import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { badRequest } from '@/lib/utils/errors';
import { transferInventory, initializeWarehouseData } from '@/lib/data/warehouse/store';

const API_NAME = 'warehouse';

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['basic', 'custom_header'],
    allowedPrefix: 'warehouse',
  });
  if (!isAuthResult(auth)) return auth;

  await initializeWarehouseData();

  let body: {
    item_sku?: string;
    from_location_id?: string;
    to_location_id?: string;
    quantity?: number;
  };

  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (!body.item_sku || !body.from_location_id || !body.to_location_id || !body.quantity) {
    return badRequest('Missing required fields: item_sku, from_location_id, to_location_id, quantity');
  }

  if (body.quantity <= 0) {
    return badRequest('Quantity must be greater than 0');
  }

  if (body.from_location_id === body.to_location_id) {
    return badRequest('Source and destination locations must be different');
  }

  const result = await transferInventory(
    body.item_sku,
    body.from_location_id,
    body.to_location_id,
    body.quantity
  );

  if (!result.success) {
    return badRequest(result.message);
  }

  const response = NextResponse.json({
    message: result.message,
    transfer: {
      item_sku: body.item_sku,
      from_location_id: body.from_location_id,
      to_location_id: body.to_location_id,
      quantity: body.quantity,
      timestamp: new Date().toISOString(),
    },
  });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
