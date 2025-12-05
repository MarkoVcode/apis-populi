import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { NextRequest } from 'next/server';
import { unauthorized } from '../utils/errors';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'apis-populi-secret-key-change-in-production'
);

const JWT_ISSUER = 'apis-populi';
const JWT_AUDIENCE = 'apis-populi-users';

export interface TokenPayload extends JWTPayload {
  sub: string;
  username: string;
  role?: string;
  api?: string;
}

export async function createToken(
  payload: { sub: string; username: string; role?: string; api?: string },
  expiresIn = '1h'
): Promise<string> {
  const token = await new SignJWT({
    sub: payload.sub,
    username: payload.username,
    role: payload.role,
    api: payload.api,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

export async function authenticateJWT(
  request: NextRequest,
  options: { requiredApi?: string } = {}
): Promise<TokenPayload | ReturnType<typeof unauthorized>> {
  const token = extractBearerToken(request);

  if (!token) {
    return unauthorized('Bearer token required');
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return unauthorized('Invalid or expired token');
  }

  if (options.requiredApi && payload.api && payload.api !== options.requiredApi) {
    return unauthorized('Token not valid for this API');
  }

  return payload;
}

export function isTokenPayload(result: unknown): result is TokenPayload {
  return (
    typeof result === 'object' &&
    result !== null &&
    'sub' in result &&
    'username' in result
  );
}

// Demo users for token generation
export const demoUsers = [
  { username: 'demo', password: 'demo123', role: 'user' },
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'test', password: 'test123', role: 'user' },
];

export function validateCredentials(
  username: string,
  password: string
): { username: string; role: string } | null {
  const user = demoUsers.find(
    (u) => u.username === username && u.password === password
  );
  return user ? { username: user.username, role: user.role } : null;
}
