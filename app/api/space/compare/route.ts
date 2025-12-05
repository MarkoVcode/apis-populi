import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { badRequest } from '@/lib/utils/errors';
import { planetsStore, starsStore, galaxiesStore, initializeSpaceData } from '@/lib/data/space/store';

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
  const ids = searchParams.get('ids')?.split(',') || [];
  const type = searchParams.get('type') || 'planets';

  if (ids.length < 2) {
    return badRequest('Provide at least 2 IDs to compare (ids=id1,id2)');
  }

  if (ids.length > 5) {
    return badRequest('Maximum 5 objects can be compared at once');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const objects: Array<Record<string, any>> = [];

  switch (type) {
    case 'planets':
      for (const id of ids) {
        const planet = await planetsStore.get(id);
        if (planet) objects.push({ ...planet });
      }
      break;
    case 'stars':
      for (const id of ids) {
        const star = await starsStore.get(id);
        if (star) objects.push({ ...star });
      }
      break;
    case 'galaxies':
      for (const id of ids) {
        const galaxy = await galaxiesStore.get(id);
        if (galaxy) objects.push({ ...galaxy });
      }
      break;
    default:
      return badRequest('Invalid type. Use: planets, stars, or galaxies');
  }

  if (objects.length < 2) {
    return badRequest('Could not find at least 2 valid objects to compare');
  }

  // Build comparison table based on type
  let comparison: Record<string, unknown> = {};

  if (type === 'planets') {
    comparison = {
      names: objects.map(o => o.name),
      mass_earth: objects.map(o => o.mass_earth),
      radius_earth: objects.map(o => o.radius_earth),
      distance_au: objects.map(o => o.distance_au),
      gravity_ms2: objects.map(o => o.gravity_ms2),
      moons_count: objects.map(o => o.moons_count),
      has_rings: objects.map(o => o.has_rings),
      habitable: objects.map(o => o.habitable),
    };
  } else if (type === 'stars') {
    comparison = {
      names: objects.map(o => o.name),
      distance_ly: objects.map(o => o.distance_ly),
      temperature_k: objects.map(o => o.temperature_k),
      mass_solar: objects.map(o => o.mass_solar),
      radius_solar: objects.map(o => o.radius_solar),
      luminosity_solar: objects.map(o => o.luminosity_solar),
      spectral_class: objects.map(o => o.spectral_class),
    };
  } else if (type === 'galaxies') {
    comparison = {
      names: objects.map(o => o.name),
      type: objects.map(o => o.type),
      distance_mly: objects.map(o => o.distance_mly),
      diameter_kly: objects.map(o => o.diameter_kly),
      stars_estimate: objects.map(o => o.stars_estimate),
    };
  }

  const response = NextResponse.json({
    type,
    objects,
    comparison,
  });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
