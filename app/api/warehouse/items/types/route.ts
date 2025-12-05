import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { itemTypeSchemas } from '@/lib/data/warehouse/types';

const API_NAME = 'warehouse';

export async function GET(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['basic', 'custom_header'],
    allowedPrefix: 'warehouse',
  });
  if (!isAuthResult(auth)) return auth;

  const types = Object.entries(itemTypeSchemas).map(([type, schema]) => ({
    type,
    required_fields: schema.required,
    optional_fields: schema.optional,
    base_fields: ['sku', 'name', 'type', 'description', 'price', 'cost', 'weight_kg', 'dimensions'],
  }));

  const response = NextResponse.json({
    types,
    description: 'Each item type has specific required and optional fields in addition to base fields',
  });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
