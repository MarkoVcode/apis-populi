import { NextRequest, NextResponse } from 'next/server';
import { getSessionIdFromCookie, deleteSession, clearSessionCookie } from '@/lib/auth/session';
import { rateLimitMiddleware } from '@/lib/utils/rate-limiter';

const API_NAME = 'school';

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const sessionId = getSessionIdFromCookie(request);

  if (sessionId) {
    deleteSession(sessionId);
  }

  const response = NextResponse.json({
    message: 'Logout successful',
  });

  return clearSessionCookie(response);
}
