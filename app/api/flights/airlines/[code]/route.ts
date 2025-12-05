import { NextRequest, NextResponse } from 'next/server';
import { authenticateJWT, isTokenPayload } from '@/lib/auth/jwt';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { airlinesStore, flightsStore, initializeFlightsData } from '@/lib/data/flights/store';

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

  const airline = await airlinesStore.get(code.toUpperCase());
  if (!airline) {
    return notFound(`Airline with code ${code}`);
  }

  const includeFlights = request.nextUrl.searchParams.get('include_flights') === 'true';

  let result: Record<string, unknown> = { ...airline };

  if (includeFlights) {
    const allFlights = await flightsStore.getAll();
    result.flights = allFlights.filter(f => f.airline_code === code.toUpperCase()).slice(0, 20);
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
