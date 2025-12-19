import { NextRequest } from 'next/server';
import { unauthorized } from '../utils/errors';

// API Keys for different APIs
const apiKeys: Record<string, string[]> = {
  books: process.env.BOOKS_API_KEYS?.split(',') || [
    'books-api-key-1',
    'books-api-key-2',
    'books-demo-key',
  ],
  school: process.env.SCHOOL_API_KEYS?.split(',') || [
    'school-api-key-1',
    'school-api-key-2',
    'school-demo-key',
  ],
  mobile: process.env.MOBILE_API_KEYS?.split(',') || [
    'mobile-api-key-1',
    'mobile-api-key-2',
    'mobile-demo-key',
  ],
};

export interface ApiKeyUser {
  apiKey: string;
  api: string;
}

export function validateApiKey(key: string, api: string): ApiKeyUser | null {
  const keys = apiKeys[api];
  if (!keys || !keys.includes(key)) {
    return null;
  }

  return {
    apiKey: key,
    api,
  };
}

export function authenticateApiKey(
  request: NextRequest,
  api: string
): ApiKeyUser | ReturnType<typeof unauthorized> {
  // Check header first (X-API-Key)
  let apiKey = request.headers.get('x-api-key');

  // Fall back to query parameter (?api_key=...)
  if (!apiKey) {
    const url = new URL(request.url);
    apiKey = url.searchParams.get('api_key');
  }

  if (!apiKey) {
    return unauthorized('API key required (X-API-Key header or api_key query parameter)');
  }

  const user = validateApiKey(apiKey, api);

  if (!user) {
    return unauthorized('Invalid API key');
  }

  return user;
}

export function isApiKeyUser(result: unknown): result is ApiKeyUser {
  return (
    typeof result === 'object' &&
    result !== null &&
    'apiKey' in result &&
    'api' in result
  );
}

// Get all valid API keys for an API (useful for documentation)
export function getApiKeysForApi(api: string): string[] {
  return apiKeys[api] || [];
}
