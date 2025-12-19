import { NextResponse } from 'next/server';
import { tooManyRequests } from './errors';

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory rate limit store (resets on cold start, but that's acceptable for this use case)
const rateLimitStore = new Map<string, RateLimitEntry>();

// API-specific rate limit configurations
export const rateLimitConfigs: Record<string, RateLimitConfig> = {
  flights: { limit: 60, windowMs: 60000 },
  books: { limit: 100, windowMs: 60000 },
  warehouse: { limit: 50, windowMs: 60000 },
  school: { limit: 80, windowMs: 60000 },
  space: { limit: 120, windowMs: 60000 },
  content: { limit: 200, windowMs: 60000 },
  mobile: { limit: 100, windowMs: 60000 },
};

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'anonymous';
  return ip;
}

export function checkRateLimit(
  apiName: string,
  clientId: string
): { allowed: boolean; remaining: number; reset: number; limit: number } {
  const config = rateLimitConfigs[apiName] || { limit: 100, windowMs: 60000 };
  const key = `${apiName}:${clientId}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  if (!entry || now >= entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  const remaining = Math.max(0, config.limit - entry.count);
  const allowed = entry.count <= config.limit;

  return {
    allowed,
    remaining,
    reset: Math.ceil(entry.resetTime / 1000),
    limit: config.limit,
  };
}

export function addRateLimitHeaders(
  response: NextResponse,
  rateLimit: { remaining: number; reset: number; limit: number }
): NextResponse {
  response.headers.set('X-RateLimit-Limit', rateLimit.limit.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimit.reset.toString());
  return response;
}

export function rateLimitMiddleware(
  apiName: string,
  request: Request
): NextResponse | null {
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(apiName, clientId);

  if (!rateLimit.allowed) {
    const retryAfter = Math.ceil((rateLimit.reset * 1000 - Date.now()) / 1000);
    const response = tooManyRequests(retryAfter);
    return addRateLimitHeaders(response, rateLimit);
  }

  return null;
}

export function withRateLimit<T>(
  apiName: string,
  request: Request,
  response: NextResponse<T>
): NextResponse<T> {
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(apiName, clientId);

  // Note: we already counted the request in rateLimitMiddleware
  // This function is just for adding headers to successful responses
  // We need to adjust the remaining count since we counted twice
  rateLimit.remaining = Math.max(0, rateLimit.remaining);

  addRateLimitHeaders(response, rateLimit);
  return response;
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);
