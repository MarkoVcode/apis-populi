import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { locationsStore, getLocationInventory, initializeWarehouseData } from '@/lib/data/warehouse/store';

const API_NAME = 'warehouse';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['basic', 'custom_header'],
    allowedPrefix: 'warehouse',
  });
  if (!isAuthResult(auth)) return auth;

  await initializeWarehouseData();

  const location = await locationsStore.get(id);
  if (!location) {
    return notFound(`Location with ID ${id}`);
  }

  const includeInventory = request.nextUrl.searchParams.get('include_inventory') === 'true';

  let result: Record<string, unknown> = { ...location };

  if (includeInventory) {
    const inventory = await getLocationInventory(id);
    result.inventory = inventory;
    result.unique_items = inventory.length;
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
