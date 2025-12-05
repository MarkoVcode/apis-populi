import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { eventsStore, initializeSpaceData } from '@/lib/data/space/store';
import { CelestialEvent } from '@/lib/data/space/types';

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

  let events = await eventsStore.getAll();

  const filters = parseFilters<CelestialEvent>(searchParams, {
    equality: ['type'],
    multiValue: ['type'],
    search: ['name', 'description'],
    dateRange: ['date'],
  });

  events = applyFilters(events, filters);

  // Filter for upcoming events if requested
  const upcoming = searchParams.get('upcoming');
  if (upcoming === 'true') {
    const now = new Date().toISOString().split('T')[0];
    events = events.filter(e => e.date >= now);
  }

  const result = paginate(events, pagination, defaultSortFn);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
