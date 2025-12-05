import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound, badRequest } from '@/lib/utils/errors';
import { itemsStore, getItemInventory, initializeWarehouseData } from '@/lib/data/warehouse/store';
import { Item } from '@/lib/data/warehouse/types';

const API_NAME = 'warehouse';

interface RouteParams {
  params: Promise<{ sku: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { sku } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['basic', 'custom_header'],
    allowedPrefix: 'warehouse',
  });
  if (!isAuthResult(auth)) return auth;

  await initializeWarehouseData();

  const item = await itemsStore.get(sku.toUpperCase());
  if (!item) {
    return notFound(`Item with SKU ${sku}`);
  }

  const includeInventory = request.nextUrl.searchParams.get('include_inventory') === 'true';

  let result: Record<string, unknown> = { ...item };

  if (includeInventory) {
    const inventory = await getItemInventory(sku.toUpperCase());
    result.inventory = inventory;
    result.total_quantity = inventory.reduce((sum, inv) => sum + inv.quantity, 0);
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { sku } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['basic', 'custom_header'],
    allowedPrefix: 'warehouse',
  });
  if (!isAuthResult(auth)) return auth;

  await initializeWarehouseData();

  const existing = await itemsStore.get(sku.toUpperCase());
  if (!existing) {
    return notFound(`Item with SKU ${sku}`);
  }

  let body: Partial<Item>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const updated = {
    ...existing,
    ...body,
    sku: existing.sku, // SKU cannot be changed
    type: existing.type, // Type cannot be changed
    id: existing.sku,
    updated_at: new Date().toISOString(),
  } as Item & { id: string };

  await itemsStore.set(updated);

  const response = NextResponse.json(updated);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { sku } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['basic', 'custom_header'],
    allowedPrefix: 'warehouse',
  });
  if (!isAuthResult(auth)) return auth;

  await initializeWarehouseData();

  const deleted = await itemsStore.delete(sku.toUpperCase());
  if (!deleted) {
    return notFound(`Item with SKU ${sku}`);
  }

  const response = new NextResponse(null, { status: 204 });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
