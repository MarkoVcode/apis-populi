import { NextRequest, NextResponse } from 'next/server';
import {
  validateOAuthClient,
  consumeAuthorizationCode,
  validateRefreshToken,
  generateOAuthTokens,
  revokeRefreshToken,
  createOAuthError,
} from '@/lib/auth/oauth';
import { rateLimitMiddleware } from '@/lib/utils/rate-limiter';

const API_NAME = 'flights';

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  let body: {
    grant_type?: string;
    code?: string;
    redirect_uri?: string;
    client_id?: string;
    client_secret?: string;
    refresh_token?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      createOAuthError('invalid_request', 'Invalid JSON body'),
      { status: 400 }
    );
  }

  if (!body.grant_type) {
    return NextResponse.json(
      createOAuthError('invalid_request', 'grant_type is required'),
      { status: 400 }
    );
  }

  if (!body.client_id || !body.client_secret) {
    return NextResponse.json(
      createOAuthError('invalid_client', 'client_id and client_secret are required'),
      { status: 401 }
    );
  }

  if (!validateOAuthClient(body.client_id, body.client_secret)) {
    return NextResponse.json(
      createOAuthError('invalid_client', 'Invalid client credentials'),
      { status: 401 }
    );
  }

  if (body.grant_type === 'authorization_code') {
    if (!body.code || !body.redirect_uri) {
      return NextResponse.json(
        createOAuthError('invalid_request', 'code and redirect_uri are required'),
        { status: 400 }
      );
    }

    const authCode = consumeAuthorizationCode(body.code, body.client_id, body.redirect_uri);
    if (!authCode) {
      return NextResponse.json(
        createOAuthError('invalid_grant', 'Invalid, expired, or already used authorization code'),
        { status: 400 }
      );
    }

    const tokens = await generateOAuthTokens(
      authCode.userId,
      authCode.username,
      body.client_id,
      authCode.scope
    );

    return NextResponse.json(tokens);
  }

  if (body.grant_type === 'refresh_token') {
    if (!body.refresh_token) {
      return NextResponse.json(
        createOAuthError('invalid_request', 'refresh_token is required'),
        { status: 400 }
      );
    }

    const refreshToken = validateRefreshToken(body.refresh_token, body.client_id);
    if (!refreshToken) {
      return NextResponse.json(
        createOAuthError('invalid_grant', 'Invalid or expired refresh token'),
        { status: 400 }
      );
    }

    // Revoke old refresh token
    revokeRefreshToken(body.refresh_token);

    // Generate new tokens
    const tokens = await generateOAuthTokens(
      refreshToken.userId,
      refreshToken.username,
      body.client_id,
      refreshToken.scope
    );

    return NextResponse.json(tokens);
  }

  return NextResponse.json(
    createOAuthError('unsupported_grant_type', 'Supported grant types: authorization_code, refresh_token'),
    { status: 400 }
  );
}
