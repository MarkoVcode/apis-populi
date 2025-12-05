import { NextRequest, NextResponse } from 'next/server';
import { authenticateJWT, isTokenPayload } from '@/lib/auth/jwt';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { airportsStore, flightsStore, initializeFlightsData } from '@/lib/data/flights/store';

const API_NAME = 'flights';

interface RouteParams {
  params: Promise<{ code: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { code } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateJWT(request);
  if (!isTokenPayload(auth)) return auth;

  await initializeFlightsData();

  const airport = await airportsStore.get(code.toUpperCase());
  if (!airport) {
    return notFound(`Airport with code ${code}`);
  }

  const includeDepartures = request.nextUrl.searchParams.get('include_departures') === 'true';
  const includeArrivals = request.nextUrl.searchParams.get('include_arrivals') === 'true';

  let result: Record<string, unknown> = { ...airport };

  if (includeDepartures || includeArrivals) {
    const allFlights = await flightsStore.getAll();
    if (includeDepartures) {
      result.departures = allFlights.filter(f => f.origin === code.toUpperCase()).slice(0, 10);
    }
    if (includeArrivals) {
      result.arrivals = allFlights.filter(f => f.destination === code.toUpperCase()).slice(0, 10);
    }
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
