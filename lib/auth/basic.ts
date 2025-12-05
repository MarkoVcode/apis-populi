import { NextRequest } from 'next/server';
import { unauthorized } from '../utils/errors';

// Demo credentials for Basic Auth
export const basicAuthCredentials = [
  { username: 'warehouse_user', password: 'warehouse123' },
  { username: 'warehouse_admin', password: 'admin456' },
  { username: 'space_user', password: 'space123' },
  { username: 'space_admin', password: 'cosmic789' },
];

export interface BasicAuthUser {
  username: string;
  isAdmin: boolean;
}

export function decodeBasicAuth(authHeader: string): { username: string; password: string } | null {
  if (!authHeader.startsWith('Basic ')) {
    return null;
  }

  try {
    const base64 = authHeader.slice(6);
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');

    if (!username || !password) {
      return null;
    }

    return { username, password };
  } catch {
    return null;
  }
}

export function validateBasicAuth(
  username: string,
  password: string,
  allowedPrefix?: string
): BasicAuthUser | null {
  const user = basicAuthCredentials.find((cred) => {
    if (cred.username !== username || cred.password !== password) {
      return false;
    }
    if (allowedPrefix && !cred.username.startsWith(allowedPrefix)) {
      return false;
    }
    return true;
  });

  if (!user) return null;

  return {
    username: user.username,
    isAdmin: user.username.includes('admin'),
  };
}

export function authenticateBasic(
  request: NextRequest,
  options: { allowedPrefix?: string } = {}
): BasicAuthUser | ReturnType<typeof unauthorized> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    const response = unauthorized('Basic authentication required');
    response.headers.set('WWW-Authenticate', 'Basic realm="APIs Populi"');
    return response;
  }

  const credentials = decodeBasicAuth(authHeader);

  if (!credentials) {
    const response = unauthorized('Invalid Basic auth format');
    response.headers.set('WWW-Authenticate', 'Basic realm="APIs Populi"');
    return response;
  }

  const user = validateBasicAuth(credentials.username, credentials.password, options.allowedPrefix);

  if (!user) {
    const response = unauthorized('Invalid credentials');
    response.headers.set('WWW-Authenticate', 'Basic realm="APIs Populi"');
    return response;
  }

  return user;
}

export function isBasicAuthUser(result: unknown): result is BasicAuthUser {
  return (
    typeof result === 'object' &&
    result !== null &&
    'username' in result &&
    'isAdmin' in result
  );
}
