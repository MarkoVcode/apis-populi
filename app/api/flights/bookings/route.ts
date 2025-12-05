import { NextRequest, NextResponse } from 'next/server';
import { authenticateJWT, isTokenPayload } from '@/lib/auth/jwt';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { badRequest } from '@/lib/utils/errors';
import { bookingsStore, flightsStore, initializeFlightsData } from '@/lib/data/flights/store';
import { Booking } from '@/lib/data/flights/types';
import { createJob, processJob } from '@/lib/utils/async-jobs';
import { v4 as uuidv4 } from 'uuid';

const API_NAME = 'flights';

export async function GET(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateJWT(request);
  if (!isTokenPayload(auth)) return auth;

  await initializeFlightsData();

  const searchParams = request.nextUrl.searchParams;
  const pagination = parsePaginationParams(searchParams);

  let bookings = await bookingsStore.getAll();

  const filters = parseFilters<Booking>(searchParams, {
    equality: ['status', 'class', 'payment_status'],
    search: ['booking_reference'],
  });

  bookings = applyFilters(bookings, filters);

  const result = paginate(bookings, pagination, defaultSortFn);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateJWT(request);
  if (!isTokenPayload(auth)) return auth;

  await initializeFlightsData();

  let body: {
    flight_id?: string;
    passenger_ids?: string[];
    class?: 'economy' | 'business' | 'first';
  };

  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (!body.flight_id || !body.passenger_ids || body.passenger_ids.length === 0) {
    return badRequest('Missing required fields: flight_id, passenger_ids');
  }

  const flight = await flightsStore.get(body.flight_id);
  if (!flight) {
    return badRequest(`Flight ${body.flight_id} not found`);
  }

  const bookingClass = body.class || 'economy';
  if (flight.seats_available[bookingClass] < body.passenger_ids.length) {
    return badRequest(`Not enough seats available in ${bookingClass} class`);
  }

  // Create async job for booking processing
  const job = createJob<Booking>();

  // Start async processing (returns immediately)
  processJob(job.id, async () => {
    // Simulate booking processing
    const bookingReference = generateBookingReference();
    const totalPrice = flight.price[bookingClass] * body.passenger_ids!.length;

    const newBooking: Booking = {
      id: uuidv4(),
      flight_id: body.flight_id!,
      passenger_ids: body.passenger_ids!,
      booking_reference: bookingReference,
      status: 'confirmed',
      class: bookingClass,
      total_price: totalPrice,
      payment_status: 'pending',
      seat_assignments: body.passenger_ids!.map((pid, idx) => ({
        passenger_id: pid,
        seat: `${20 + Math.floor(idx / 6)}${['A', 'B', 'C', 'D', 'E', 'F'][idx % 6]}`,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save booking to store
    await bookingsStore.set(newBooking);

    // Update flight seats
    const updatedSeats = { ...flight.seats_available };
    updatedSeats[bookingClass] -= body.passenger_ids!.length;
    await flightsStore.update(flight.id, { seats_available: updatedSeats });

    return newBooking;
  });

  // Return 202 Accepted with job info
  const response = NextResponse.json({
    message: 'Booking request accepted',
    job_id: job.id,
    status_url: `/api/flights/bookings/${job.id}/status`,
    estimated_time_seconds: '20-50',
  }, { status: 202 });

  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

function generateBookingReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
