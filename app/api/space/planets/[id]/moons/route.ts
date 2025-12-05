import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { planetsStore, getPlanetMoons, initializeSpaceData } from '@/lib/data/space/store';

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

  const planet = await planetsStore.get(id);
  if (!planet) {
    return notFound(`Planet with ID ${id}`);
  }

  const moons = await getPlanetMoons(id);

  const response = NextResponse.json({
    planet: planet.name,
    moons_count: planet.moons_count,
    known_moons: moons,
  });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
