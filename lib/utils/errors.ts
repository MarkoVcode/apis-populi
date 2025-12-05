import { NextResponse } from 'next/server';

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export function errorResponse(
  statusCode: number,
  code: string,
  message: string,
  details?: Array<{ field: string; message: string }>
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details && { details }),
      },
    },
    { status: statusCode }
  );
}

export function badRequest(message: string, details?: Array<{ field: string; message: string }>) {
  return errorResponse(400, 'BAD_REQUEST', message, details);
}

export function unauthorized(message = 'Authentication required') {
  return errorResponse(401, 'UNAUTHORIZED', message);
}

export function forbidden(message = 'Access denied') {
  return errorResponse(403, 'FORBIDDEN', message);
}

export function notFound(resource = 'Resource') {
  return errorResponse(404, 'NOT_FOUND', `${resource} not found`);
}

export function conflict(message: string) {
  return errorResponse(409, 'CONFLICT', message);
}

export function validationError(details: Array<{ field: string; message: string }>) {
  return errorResponse(422, 'VALIDATION_ERROR', 'Validation failed', details);
}

export function tooManyRequests(retryAfter: number) {
  const response = errorResponse(429, 'RATE_LIMIT_EXCEEDED', 'Too many requests');
  response.headers.set('Retry-After', retryAfter.toString());
  return response;
}

export function internalError(message = 'Internal server error') {
  return errorResponse(500, 'INTERNAL_ERROR', message);
}

export function handleError(error: unknown): NextResponse<ApiError> {
  if (error instanceof HttpError) {
    return errorResponse(error.statusCode, error.code, error.message, error.details);
  }

  console.error('Unhandled error:', error);
  return internalError();
}
