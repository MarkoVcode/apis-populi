import { NextRequest, NextResponse } from 'next/server';
import { resetContentData } from '@/lib/data/content/store';
import { rateLimitMiddleware, getClientIdentifier, checkRateLimit, addRateLimitHeaders } from '@/lib/utils/rate-limiter';

const API_NAME = 'content';

export async function POST(request: NextRequest) {
  // Rate limit check
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Reset data
  await resetContentData();

  const response = NextResponse.json({
    message: 'Content data reset successfully',
    details: {
      pages_restored: 10,
      profiles_cleared: true,
    },
  });

  // Add rate limit headers
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
