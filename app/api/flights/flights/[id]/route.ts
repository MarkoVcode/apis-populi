import { NextRequest, NextResponse } from 'next/server';
import { authenticateJWT, isTokenPayload } from '@/lib/auth/jwt';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { getFlightWithDetails, initializeFlightsData } from '@/lib/data/flights/store';

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

  const flightDetails = await getFlightWithDetails(id);
  if (!flightDetails) {
    return notFound(`Flight with ID ${id}`);
  }

  const expand = request.nextUrl.searchParams.get('expand');
  let result: Record<string, unknown> = { ...flightDetails.flight };

  if (expand) {
    const expandFields = expand.split(',');
    if (expandFields.includes('airline')) {
      result.airline = flightDetails.airline;
    }
    if (expandFields.includes('airports')) {
      result.origin_airport = flightDetails.origin_airport;
      result.destination_airport = flightDetails.destination_airport;
    }
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
