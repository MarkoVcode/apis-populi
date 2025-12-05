import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { starsStore, constellationsStore, getStarPlanets, initializeSpaceData } from '@/lib/data/space/store';

const API_NAME = 'space';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['jwt', 'basic'],
    allowedPrefix: 'space',
  });
  if (!isAuthResult(auth)) return auth;

  await initializeSpaceData();

  const star = await starsStore.get(id);
  if (!star) {
    return notFound(`Star with ID ${id}`);
  }

  const searchParams = request.nextUrl.searchParams;
  const includePlanets = searchParams.get('include_planets') === 'true';
  const includeConstellation = searchParams.get('include_constellation') === 'true';

  let result: Record<string, unknown> = { ...star };

  if (includePlanets && star.name === 'Sun') {
    const planets = await getStarPlanets('Solar System');
    result.planets = planets;
  }

  if (includeConstellation && star.constellation_id !== 'const-none') {
    const constellation = await constellationsStore.get(star.constellation_id);
    result.constellation = constellation;
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
