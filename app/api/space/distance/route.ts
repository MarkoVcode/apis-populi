import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { badRequest, notFound } from '@/lib/utils/errors';
import { starsStore, galaxiesStore, calculateDistance, initializeSpaceData } from '@/lib/data/space/store';

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
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const type = searchParams.get('type') || 'stars';

  if (!from || !to) {
    return badRequest('Provide both "from" and "to" object IDs');
  }

  let obj1: { name: string; distance_ly?: number; distance_mly?: number } | null = null;
  let obj2: { name: string; distance_ly?: number; distance_mly?: number } | null = null;

  if (type === 'stars') {
    obj1 = await starsStore.get(from);
    obj2 = await starsStore.get(to);
  } else if (type === 'galaxies') {
    obj1 = await galaxiesStore.get(from);
    obj2 = await galaxiesStore.get(to);
  } else {
    return badRequest('Invalid type. Use: stars or galaxies');
  }

  if (!obj1) return notFound(`Object with ID ${from}`);
  if (!obj2) return notFound(`Object with ID ${to}`);

  const distance = calculateDistance(obj1, obj2);

  const response = NextResponse.json({
    from: { id: from, name: obj1.name },
    to: { id: to, name: obj2.name },
    distance: {
      light_years: distance.light_years,
      kilometers: distance.kilometers,
      light_years_formatted: distance.light_years < 1000
        ? `${distance.light_years.toFixed(2)} ly`
        : `${(distance.light_years / 1e6).toFixed(2)} Mly`,
      travel_time_at_light_speed_years: distance.light_years,
    },
  });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
