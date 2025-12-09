import { NextRequest, NextResponse } from 'next/server';
import { getPageWithPlacements, parsePlacements, getUserProfile } from '@/lib/data/content/store';
import { personalizeContent } from '@/lib/data/content/dynamics';
import { rateLimitMiddleware, getClientIdentifier, checkRateLimit, addRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';

const API_NAME = 'content';
const COOKIE_NAME = 'content_personalization';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  // Rate limit check
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Get slug from params
  const { slug } = await params;

  // Parse placement filter from query string
  const searchParams = request.nextUrl.searchParams;
  const requestedPlacements = parsePlacements(searchParams);

  // Get page with filtered placements
  const page = await getPageWithPlacements(slug, requestedPlacements.length > 0 ? requestedPlacements : undefined);

  if (!page) {
    return notFound(`Page '${slug}' not found`);
  }

  // Check for personalization cookie
  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
  let userProfile = null;

  if (cookieValue) {
    try {
      // Cookie contains profile_id
      userProfile = await getUserProfile(cookieValue);
    } catch {
      // Invalid cookie, ignore
    }
  }

  // Apply dynamic content and personalization
  const response = personalizeContent(page, userProfile);

  // Build response with headers
  const jsonResponse = NextResponse.json(response);

  // Add cache headers
  jsonResponse.headers.set('Cache-Control', response.cache_control);
  jsonResponse.headers.set('ETag', `"${response.etag}"`);

  // Add rate limit headers
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(jsonResponse, rateLimit);
}
