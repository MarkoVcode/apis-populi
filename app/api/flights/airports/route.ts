import { NextRequest, NextResponse } from 'next/server';
import { authenticateJWT, isTokenPayload } from '@/lib/auth/jwt';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { airportsStore, initializeFlightsData } from '@/lib/data/flights/store';
import { Airport } from '@/lib/data/flights/types';

const API_NAME = 'flights';

export async function GET(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateJWT(request);
  if (!isTokenPayload(auth)) return auth;

  await initializeFlightsData();

  const searchParams = request.nextUrl.searchParams;
  const pagination = parsePaginationParams(searchParams);

  let airports = await airportsStore.getAll();

  const filters = parseFilters<Airport>(searchParams, {
    equality: ['country'],
    search: ['name', 'city', 'code'],
  });

  airports = applyFilters(airports, filters);

  const result = paginate(airports, pagination, defaultSortFn);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
