import { NextRequest, NextResponse } from 'next/server';
import { authenticateJWT, isTokenPayload } from '@/lib/auth/jwt';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { passengersStore, bookingsStore, initializeFlightsData } from '@/lib/data/flights/store';

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

  const passenger = await passengersStore.get(id);
  if (!passenger) {
    return notFound(`Passenger with ID ${id}`);
  }

  const includeBookings = request.nextUrl.searchParams.get('include_bookings') === 'true';

  let result: Record<string, unknown> = { ...passenger };

  if (includeBookings) {
    const allBookings = await bookingsStore.getAll();
    result.bookings = allBookings.filter(b => b.passenger_ids.includes(id));
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
