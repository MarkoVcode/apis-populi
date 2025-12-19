import { NextRequest, NextResponse } from 'next/server';
import { resetMobileData } from '@/lib/data/mobile/store';
import { MOBILE_API_KEYS } from '@/lib/data/mobile/types';
import { rateLimitMiddleware, checkRateLimit, getClientIdentifier, addRateLimitHeaders } from '@/lib/utils/rate-limiter';

const API_NAME = 'mobile';

function validateApiKey(request: NextRequest): string | null {
  const apiKey = request.headers.get('x-api-key') ||
    request.nextUrl.searchParams.get('api_key');

  if (!apiKey) return null;
  if (!MOBILE_API_KEYS.includes(apiKey)) return null;

  return apiKey;
}

export async function POST(request: NextRequest) {
  // Rate limit check
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // API Key authentication check
  const apiKey = validateApiKey(request);

  if (!apiKey) {
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(API_NAME, clientId);

    const errorResponse = NextResponse.json(
      {
        error: {
          code: 'UNAUTHORIZED',
          message: 'API key required (X-API-Key header or api_key query parameter)',
          demo_keys: MOBILE_API_KEYS,
        },
      },
      { status: 401 }
    );

    return addRateLimitHeaders(errorResponse, rateLimit);
  }

  // Reset data
  await resetMobileData();

  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);

  const response = NextResponse.json({
    success: true,
    message: 'All mobile CMS data has been reset to initial state',
    timestamp: new Date().toISOString(),
  });

  return addRateLimitHeaders(response, rateLimit);
}
