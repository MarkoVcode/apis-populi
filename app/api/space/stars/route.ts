import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { starsStore, initializeSpaceData } from '@/lib/data/space/store';
import { Star } from '@/lib/data/space/types';

const API_NAME = 'space';

export async function GET(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['jwt', 'basic'],
    allowedPrefix: 'space',
  });
  if (!isAuthResult(auth)) return auth;

  await initializeSpaceData();

  const searchParams = request.nextUrl.searchParams;
  const pagination = parsePaginationParams(searchParams);

  let stars = await starsStore.getAll();

  const filters = parseFilters<Star>(searchParams, {
    equality: ['constellation_id', 'spectral_class'],
    search: ['name', 'description'],
    range: ['distance_ly', 'apparent_magnitude', 'temperature_k', 'mass_solar'],
  });

  stars = applyFilters(stars, filters);

  const result = paginate(stars, pagination, defaultSortFn);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
