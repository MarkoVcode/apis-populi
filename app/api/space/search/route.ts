import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { badRequest } from '@/lib/utils/errors';
import { searchSpace, initializeSpaceData } from '@/lib/data/space/store';

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

  const query = request.nextUrl.searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return badRequest('Search query (q) must be at least 2 characters');
  }

  const results = await searchSpace(query);

  const response = NextResponse.json({
    query,
    results: {
      planets: { count: results.planets.length, items: results.planets.slice(0, 10) },
      stars: { count: results.stars.length, items: results.stars.slice(0, 10) },
      galaxies: { count: results.galaxies.length, items: results.galaxies.slice(0, 10) },
      missions: { count: results.missions.length, items: results.missions.slice(0, 10) },
      astronauts: { count: results.astronauts.length, items: results.astronauts.slice(0, 10) },
    },
  });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
