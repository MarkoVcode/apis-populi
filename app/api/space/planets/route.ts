import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { planetsStore, initializeSpaceData } from '@/lib/data/space/store';
import { Planet } from '@/lib/data/space/types';

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

  let planets = await planetsStore.getAll();

  const filters = parseFilters<Planet>(searchParams, {
    equality: ['type', 'star_system', 'habitable', 'has_rings'],
    search: ['name', 'description'],
    range: ['mass_earth', 'radius_earth', 'distance_au', 'moons_count'],
  });

  planets = applyFilters(planets, filters);

  const result = paginate(planets, pagination, defaultSortFn);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
