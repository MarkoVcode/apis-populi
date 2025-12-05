import { NextResponse } from 'next/server';
import { initializeFlightsData } from '@/lib/data/flights/store';
import { getOAuthCredentials } from '@/lib/auth/oauth';

export async function GET() {
  await initializeFlightsData();
  const oauth = getOAuthCredentials();

  return NextResponse.json({
    name: 'Flights API',
    version: '1.0.0',
    description: 'A comprehensive aviation API with airports, airlines, flights, bookings, and passengers',
    authentication: {
      methods: ['JWT Bearer Token', 'OAuth2'],
      jwt: {
        endpoint: 'POST /api/flights/auth/token',
        credentials: [
          { username: 'demo', password: 'demo123', role: 'user' },
          { username: 'admin', password: 'admin123', role: 'admin' },
        ],
      },
      oauth2: {
        authorize: 'POST /api/flights/auth/oauth/authorize',
        token: 'POST /api/flights/auth/oauth/token',
        client_id: oauth.clientId,
        client_secret: oauth.clientSecret,
        users: [
          { username: 'passenger', password: 'passenger123' },
          { username: 'traveler', password: 'traveler123' },
        ],
      },
    },
    async_operations: {
      note: 'Booking creation is asynchronous (takes 20-50 seconds)',
      pattern: 'Polling',
      endpoints: {
        create: 'POST /api/flights/bookings (returns 202 with job_id)',
        status: 'GET /api/flights/bookings/{id}/status',
      },
    },
    endpoints: {
      airports: '/api/flights/airports',
      airlines: '/api/flights/airlines',
      flights: '/api/flights/flights',
      bookings: '/api/flights/bookings',
      passengers: '/api/flights/passengers',
      auth: '/api/flights/auth',
      openapi: '/api/flights/openapi.yaml',
      reset: '/api/flights/reset',
    },
    rate_limit: {
      requests_per_minute: 60,
      burst: 10,
    },
  });
}
