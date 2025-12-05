import { v4 as uuidv4 } from 'uuid';
import { createToken } from './jwt';

// OAuth2 configuration
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID || 'flights-demo-client';
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || 'flights-demo-secret';

// In-memory authorization code store
const authorizationCodes = new Map<string, AuthorizationCode>();

// In-memory refresh token store
const refreshTokens = new Map<string, RefreshToken>();

export interface AuthorizationCode {
  code: string;
  clientId: string;
  userId: string;
  username: string;
  redirectUri: string;
  scope: string;
  expiresAt: Date;
}

export interface RefreshToken {
  token: string;
  clientId: string;
  userId: string;
  username: string;
  scope: string;
  expiresAt: Date;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

export interface OAuthError {
  error: string;
  error_description: string;
}

// OAuth users (same as JWT demo users for simplicity)
const oauthUsers = [
  { userId: 'oauth-user-1', username: 'passenger', password: 'passenger123' },
  { userId: 'oauth-user-2', username: 'traveler', password: 'traveler123' },
];

export function validateOAuthClient(clientId: string, clientSecret?: string): boolean {
  if (clientId !== OAUTH_CLIENT_ID) return false;
  if (clientSecret !== undefined && clientSecret !== OAUTH_CLIENT_SECRET) return false;
  return true;
}

export function validateOAuthUser(
  username: string,
  password: string
): { userId: string; username: string } | null {
  const user = oauthUsers.find(
    (u) => u.username === username && u.password === password
  );
  return user ? { userId: user.userId, username: user.username } : null;
}

export function createAuthorizationCode(
  clientId: string,
  userId: string,
  username: string,
  redirectUri: string,
  scope: string
): string {
  const code = uuidv4();
  const authCode: AuthorizationCode = {
    code,
    clientId,
    userId,
    username,
    redirectUri,
    scope,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  };

  authorizationCodes.set(code, authCode);
  return code;
}

export function consumeAuthorizationCode(
  code: string,
  clientId: string,
  redirectUri: string
): AuthorizationCode | null {
  const authCode = authorizationCodes.get(code);

  if (!authCode) return null;
  if (authCode.clientId !== clientId) return null;
  if (authCode.redirectUri !== redirectUri) return null;
  if (new Date() > authCode.expiresAt) {
    authorizationCodes.delete(code);
    return null;
  }

  // Authorization codes are single-use
  authorizationCodes.delete(code);
  return authCode;
}

export function createRefreshToken(
  clientId: string,
  userId: string,
  username: string,
  scope: string
): string {
  const token = uuidv4();
  const refreshToken: RefreshToken = {
    token,
    clientId,
    userId,
    username,
    scope,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  };

  refreshTokens.set(token, refreshToken);
  return token;
}

export function validateRefreshToken(
  token: string,
  clientId: string
): RefreshToken | null {
  const refreshToken = refreshTokens.get(token);

  if (!refreshToken) return null;
  if (refreshToken.clientId !== clientId) return null;
  if (new Date() > refreshToken.expiresAt) {
    refreshTokens.delete(token);
    return null;
  }

  return refreshToken;
}

export function revokeRefreshToken(token: string): boolean {
  return refreshTokens.delete(token);
}

export async function generateOAuthTokens(
  userId: string,
  username: string,
  clientId: string,
  scope: string,
  includeRefreshToken = true
): Promise<OAuthTokenResponse> {
  const accessToken = await createToken(
    {
      sub: userId,
      username,
      role: 'oauth_user',
      api: 'flights',
    },
    '1h'
  );

  const response: OAuthTokenResponse = {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    scope,
  };

  if (includeRefreshToken) {
    response.refresh_token = createRefreshToken(clientId, userId, username, scope);
  }

  return response;
}

export function createOAuthError(error: string, description: string): OAuthError {
  return {
    error,
    error_description: description,
  };
}

// Get OAuth client credentials for documentation
export function getOAuthCredentials(): { clientId: string; clientSecret: string } {
  return {
    clientId: OAUTH_CLIENT_ID,
    clientSecret: OAUTH_CLIENT_SECRET,
  };
}

// Cleanup expired tokens periodically
setInterval(() => {
  const now = new Date();
  for (const [code, authCode] of authorizationCodes) {
    if (now > authCode.expiresAt) {
      authorizationCodes.delete(code);
    }
  }
  for (const [token, refreshToken] of refreshTokens) {
    if (now > refreshToken.expiresAt) {
      refreshTokens.delete(token);
    }
  }
}, 300000); // Every 5 minutes
