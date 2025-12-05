import { NextRequest, NextResponse } from 'next/server';
import { validateOAuthClient, validateOAuthUser, createAuthorizationCode, createOAuthError } from '@/lib/auth/oauth';
import { badRequest } from '@/lib/utils/errors';
import { rateLimitMiddleware } from '@/lib/utils/rate-limiter';

const API_NAME = 'flights';

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  let body: {
    client_id?: string;
    redirect_uri?: string;
    response_type?: string;
    scope?: string;
    username?: string;
    password?: string;
  };

  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  // Validate required parameters
  if (!body.client_id || !body.redirect_uri || !body.response_type) {
    return NextResponse.json(
      createOAuthError('invalid_request', 'Missing required parameters: client_id, redirect_uri, response_type'),
      { status: 400 }
    );
  }

  if (body.response_type !== 'code') {
    return NextResponse.json(
      createOAuthError('unsupported_response_type', 'Only "code" response_type is supported'),
      { status: 400 }
    );
  }

  // Validate client
  if (!validateOAuthClient(body.client_id)) {
    return NextResponse.json(
      createOAuthError('invalid_client', 'Unknown client_id'),
      { status: 401 }
    );
  }

  // For this simplified flow, we require username/password in the same request
  if (!body.username || !body.password) {
    return NextResponse.json(
      createOAuthError('invalid_request', 'Username and password required for authorization'),
      { status: 400 }
    );
  }

  const user = validateOAuthUser(body.username, body.password);
  if (!user) {
    return NextResponse.json(
      createOAuthError('access_denied', 'Invalid credentials'),
      { status: 401 }
    );
  }

  const code = createAuthorizationCode(
    body.client_id,
    user.userId,
    user.username,
    body.redirect_uri,
    body.scope || 'flights:read'
  );

  return NextResponse.json({
    code,
    redirect_uri: body.redirect_uri,
    state: request.nextUrl.searchParams.get('state'),
  });
}
