import { NextResponse } from 'next/server';
import { initializeSpaceData } from '@/lib/data/space/store';

export async function GET() {
  await initializeSpaceData();

  return NextResponse.json({
    name: 'Space API',
    version: '1.0.0',
    description: 'A cosmic database with planets, stars, galaxies, constellations, space missions, and astronauts',
    authentication: {
      methods: ['JWT Bearer Token', 'Basic Auth'],
      jwt: {
        endpoint: '/api/flights/auth/token',
        note: 'Shares authentication with Flights API',
      },
      basic_auth: {
        credentials: ['space_user:space123', 'space_admin:cosmic789'],
      },
    },
    endpoints: {
      planets: '/api/space/planets',
      stars: '/api/space/stars',
      galaxies: '/api/space/galaxies',
      constellations: '/api/space/constellations',
      missions: '/api/space/missions',
      astronauts: '/api/space/astronauts',
      satellites: '/api/space/satellites',
      events: '/api/space/events',
      search: '/api/space/search',
      compare: '/api/space/compare',
      distance: '/api/space/distance',
      openapi: '/api/space/openapi.yaml',
      reset: '/api/space/reset',
    },
    rate_limit: {
      requests_per_minute: 120,
      burst: 25,
    },
  });
}
