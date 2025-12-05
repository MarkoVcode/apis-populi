import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { constellationsStore, getConstellationStars, initializeSpaceData } from '@/lib/data/space/store';

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

  const constellation = await constellationsStore.get(id);
  if (!constellation) {
    return notFound(`Constellation with ID ${id}`);
  }

  const includeStars = request.nextUrl.searchParams.get('include_stars') === 'true';

  let result: Record<string, unknown> = { ...constellation };

  if (includeStars) {
    const stars = await getConstellationStars(id);
    result.stars = stars;
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
