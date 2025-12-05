import { NextRequest, NextResponse } from 'next/server';
import { authenticateJWT, isTokenPayload } from '@/lib/auth/jwt';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { getBookingWithDetails, bookingsStore, initializeFlightsData } from '@/lib/data/flights/store';
import { getJob } from '@/lib/utils/async-jobs';

const API_NAME = 'flights';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateJWT(request);
  if (!isTokenPayload(auth)) return auth;

  await initializeFlightsData();

  // First check if it's a job ID (for async booking)
  const job = getJob(id);
  if (job && job.status === 'completed' && job.result) {
    // Return the completed booking
    const response = NextResponse.json(job.result);
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(API_NAME, clientId);
    return addRateLimitHeaders(response, rateLimit);
  }

  // Otherwise look for existing booking
  const bookingDetails = await getBookingWithDetails(id);
  if (!bookingDetails) {
    return notFound(`Booking with ID ${id}`);
  }

  const expand = request.nextUrl.searchParams.get('expand');
  let result: Record<string, unknown> = { ...bookingDetails.booking };

  if (expand) {
    const expandFields = expand.split(',');
    if (expandFields.includes('flight')) {
      result.flight = bookingDetails.flight;
    }
    if (expandFields.includes('passengers')) {
      result.passengers = bookingDetails.passengers;
    }
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateJWT(request);
  if (!isTokenPayload(auth)) return auth;

  await initializeFlightsData();

  const booking = await bookingsStore.get(id);
  if (!booking) {
    return notFound(`Booking with ID ${id}`);
  }

  // Update booking status to cancelled instead of deleting
  await bookingsStore.update(id, {
    status: 'cancelled',
    updated_at: new Date().toISOString(),
  });

  const response = NextResponse.json({
    message: 'Booking cancelled successfully',
    booking_id: id,
    status: 'cancelled',
  });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
