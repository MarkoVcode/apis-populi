import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createUserProfile, getUserProfile, deleteUserProfile } from '@/lib/data/content/store';
import { CookieCreateRequest, UserProfile, VALID_SEGMENTS, UserSegment } from '@/lib/data/content/types';
import { rateLimitMiddleware, getClientIdentifier, checkRateLimit, addRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { badRequest, notFound } from '@/lib/utils/errors';

const API_NAME = 'content';
const COOKIE_NAME = 'content_personalization';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

// POST - Create a new personalization profile and set cookie
export async function POST(request: NextRequest) {
  // Rate limit check
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Parse request body
  let body: CookieCreateRequest;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  // Validate required fields
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return badRequest('Name is required and must be a non-empty string');
  }

  // Validate segment if provided
  const segment: UserSegment = body.segment && VALID_SEGMENTS.includes(body.segment)
    ? body.segment
    : 'standard';

  // Create profile
  const profileId = `prf_${uuidv4().slice(0, 12)}`;
  const profile: UserProfile = {
    profile_id: profileId,
    name: body.name.trim(),
    email: body.email,
    preferences: body.preferences || {},
    segment,
    created_at: new Date().toISOString(),
  };

  // Store profile
  await createUserProfile(profile);

  // Build response
  const response = NextResponse.json(
    {
      profile_id: profile.profile_id,
      name: profile.name,
      email: profile.email,
      preferences: profile.preferences,
      segment: profile.segment,
      created_at: profile.created_at,
      message: 'Personalization profile created successfully. Cookie has been set.',
      usage: {
        description: 'Include this cookie in subsequent requests to /api/content/pages/{slug} for personalized content',
        example: `curl /api/content/pages/header -b "${COOKIE_NAME}=${profileId}"`,
      },
    },
    { status: 201 }
  );

  // Set cookie
  response.cookies.set(COOKIE_NAME, profileId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  // Add rate limit headers
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

// GET - Retrieve current profile from cookie
export async function GET(request: NextRequest) {
  // Rate limit check
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Get cookie value
  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;

  if (!cookieValue) {
    const response = NextResponse.json(
      {
        personalized: false,
        message: 'No personalization cookie found',
        how_to_create: {
          method: 'POST',
          endpoint: '/api/content/cookie',
          body: {
            name: 'Your Name',
            email: 'your.email@example.com (optional)',
            segment: 'standard | premium | vip (optional)',
            preferences: {
              theme: 'light | dark | system (optional)',
              locale: 'en-US (optional)',
              interests: ['array', 'of', 'interests (optional)'],
            },
          },
        },
      },
      { status: 200 }
    );

    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(API_NAME, clientId);
    return addRateLimitHeaders(response, rateLimit);
  }

  // Look up profile
  const profile = await getUserProfile(cookieValue);

  if (!profile) {
    const response = NextResponse.json(
      {
        personalized: false,
        message: 'Cookie found but profile not found or expired. Please create a new profile.',
        how_to_create: {
          method: 'POST',
          endpoint: '/api/content/cookie',
        },
      },
      { status: 200 }
    );

    // Clear invalid cookie
    response.cookies.delete(COOKIE_NAME);

    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(API_NAME, clientId);
    return addRateLimitHeaders(response, rateLimit);
  }

  // Return profile
  const response = NextResponse.json({
    personalized: true,
    profile: {
      profile_id: profile.profile_id,
      name: profile.name,
      email: profile.email,
      preferences: profile.preferences,
      segment: profile.segment,
      created_at: profile.created_at,
    },
    message: 'Personalization profile found. Content will be personalized for this user.',
  });

  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

// DELETE - Clear personalization cookie and delete profile
export async function DELETE(request: NextRequest) {
  // Rate limit check
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Get cookie value
  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;

  if (!cookieValue) {
    return notFound('No personalization cookie found to delete');
  }

  // Delete profile from store
  await deleteUserProfile(cookieValue);

  // Build response
  const response = NextResponse.json({
    message: 'Personalization profile deleted and cookie cleared',
    personalized: false,
  });

  // Clear cookie
  response.cookies.delete(COOKIE_NAME);

  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
