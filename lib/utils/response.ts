import { NextResponse } from 'next/server';
import { addRateLimitHeaders, checkRateLimit, getClientIdentifier } from './rate-limiter';

export function jsonResponse<T>(
  data: T,
  options: { status?: number; apiName?: string; request?: Request } = {}
): NextResponse<T> {
  const response = NextResponse.json(data, { status: options.status || 200 });

  if (options.apiName && options.request) {
    const clientId = getClientIdentifier(options.request);
    const rateLimit = checkRateLimit(options.apiName, clientId);
    addRateLimitHeaders(response, rateLimit);
  }

  return response;
}

export function createdResponse<T>(
  data: T,
  options: { apiName?: string; request?: Request } = {}
): NextResponse<T> {
  return jsonResponse(data, { status: 201, ...options });
}

export function acceptedResponse<T>(
  data: T,
  options: { apiName?: string; request?: Request } = {}
): NextResponse<T> {
  return jsonResponse(data, { status: 202, ...options });
}

export function noContentResponse(
  options: { apiName?: string; request?: Request } = {}
): NextResponse {
  const response = new NextResponse(null, { status: 204 });

  if (options.apiName && options.request) {
    const clientId = getClientIdentifier(options.request);
    const rateLimit = checkRateLimit(options.apiName, clientId);
    addRateLimitHeaders(response, rateLimit);
  }

  return response;
}
