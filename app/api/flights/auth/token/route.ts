import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, createToken } from '@/lib/auth/jwt';
import { badRequest, unauthorized } from '@/lib/utils/errors';
import { rateLimitMiddleware } from '@/lib/utils/rate-limiter';
import { v4 as uuidv4 } from 'uuid';

const API_NAME = 'flights';

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

  const user = validateCredentials(body.username, body.password);
  if (!user) {
    return unauthorized('Invalid credentials');
  }

  const token = await createToken({
    sub: uuidv4(),
    username: user.username,
    role: user.role,
    api: 'flights',
  });

  return NextResponse.json({
    access_token: token,
    token_type: 'Bearer',
    expires_in: 3600,
    scope: 'flights:read flights:write',
  });
}
