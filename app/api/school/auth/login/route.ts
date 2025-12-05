import { NextRequest, NextResponse } from 'next/server';
import { validateSessionCredentials, createSession, setSessionCookie } from '@/lib/auth/session';
import { badRequest, unauthorized } from '@/lib/utils/errors';
import { rateLimitMiddleware } from '@/lib/utils/rate-limiter';

const API_NAME = 'school';

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (!body.username || !body.password) {
    return badRequest('Username and password are required');
  }

  const user = validateSessionCredentials(body.username, body.password);
  if (!user) {
    return unauthorized('Invalid credentials');
  }

  const session = createSession(user.userId, user.username, user.role);

  const response = NextResponse.json({
    message: 'Login successful',
    user: {
      id: user.userId,
      username: user.username,
      role: user.role,
    },
    session: {
      id: session.id,
      expires_at: session.expiresAt.toISOString(),
    },
  });

  return setSessionCookie(response, session.id);
}
