import { NextRequest, NextResponse } from 'next/server';
import { authenticateJWT, isTokenPayload, TokenPayload } from './jwt';
import { authenticateBasic, isBasicAuthUser, BasicAuthUser } from './basic';
import { authenticateApiKey, isApiKeyUser, ApiKeyUser } from './apikey';
import { authenticateCustomHeader, isCustomHeaderUser, CustomHeaderUser } from './custom-header';
import { authenticateSession, isSessionUser, SessionUser } from './session';
import { unauthorized } from '../utils/errors';

export type AuthResult =
  | TokenPayload
  | BasicAuthUser
  | ApiKeyUser
  | CustomHeaderUser
  | SessionUser;

export type AuthMethod = 'jwt' | 'basic' | 'apikey' | 'custom_header' | 'session';

export interface AuthConfig {
  methods: AuthMethod[];
  apiName?: string;
  allowedPrefix?: string;
}

export async function authenticate(
  request: NextRequest,
  config: AuthConfig
): Promise<AuthResult | NextResponse> {
  const errors: string[] = [];

  for (const method of config.methods) {
    switch (method) {
      case 'jwt': {
        const result = await authenticateJWT(request, { requiredApi: config.apiName });
        if (isTokenPayload(result)) return result;
        errors.push('JWT: ' + (result as NextResponse).statusText);
        break;
      }

      case 'basic': {
        const result = authenticateBasic(request, { allowedPrefix: config.allowedPrefix });
        if (isBasicAuthUser(result)) return result;
        errors.push('Basic: Invalid credentials');
        break;
      }

      case 'apikey': {
        if (!config.apiName) {
          errors.push('API Key: API name not configured');
          break;
        }
        const result = authenticateApiKey(request, config.apiName);
        if (isApiKeyUser(result)) return result;
        errors.push('API Key: Invalid key');
        break;
      }

      case 'custom_header': {
        const result = authenticateCustomHeader(request);
        if (isCustomHeaderUser(result)) return result;
        errors.push('Custom Header: Invalid token');
        break;
      }

      case 'session': {
        const result = authenticateSession(request);
        if (isSessionUser(result)) return result;
        errors.push('Session: Not authenticated');
        break;
      }
    }
  }

  // If multiple methods are allowed, provide helpful error message
  const methodNames = config.methods.map(m => {
    switch (m) {
      case 'jwt': return 'Bearer token';
      case 'basic': return 'Basic auth';
      case 'apikey': return 'API key';
      case 'custom_header': return 'X-Warehouse-Token';
      case 'session': return 'Session cookie';
      default: return m;
    }
  });

  return unauthorized(`Authentication required. Accepted methods: ${methodNames.join(', ')}`);
}

export function isAuthResult(result: unknown): result is AuthResult {
  return (
    isTokenPayload(result) ||
    isBasicAuthUser(result) ||
    isApiKeyUser(result) ||
    isCustomHeaderUser(result) ||
    isSessionUser(result)
  );
}
