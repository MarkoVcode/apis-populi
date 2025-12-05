import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { badRequest, conflict } from '@/lib/utils/errors';
import { itemsStore, initializeWarehouseData } from '@/lib/data/warehouse/store';
import { Item, itemTypeSchemas } from '@/lib/data/warehouse/types';

const API_NAME = 'warehouse';

export async function GET(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['basic', 'custom_header'],
    allowedPrefix: 'warehouse',
  });
  if (!isAuthResult(auth)) return auth;

  await initializeWarehouseData();

  const searchParams = request.nextUrl.searchParams;
  const pagination = parsePaginationParams(searchParams);

  let items = await itemsStore.getAll();

  const filters = parseFilters<Item>(searchParams, {
    equality: ['type'],
    multiValue: ['type'],
    search: ['name', 'description', 'sku'],
    range: ['price', 'weight_kg'],
  });

  items = applyFilters(items, filters);

  const result = paginate(items, pagination, defaultSortFn);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['basic', 'custom_header'],
    allowedPrefix: 'warehouse',
  });
  if (!isAuthResult(auth)) return auth;

  await initializeWarehouseData();

  let body: Partial<Item> & { type?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  // Validate required base fields
  if (!body.name || !body.type || !body.price) {
    return badRequest('Missing required fields: name, type, price');
  }

  // Validate item type
  const validTypes = Object.keys(itemTypeSchemas);
  if (!validTypes.includes(body.type)) {
    return badRequest(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
  }

  // Validate type-specific fields
  const typeSchema = itemTypeSchemas[body.type as keyof typeof itemTypeSchemas];
  const missingRequired = typeSchema.required.filter(field => !(field in body));
  if (missingRequired.length > 0) {
    return badRequest(`Missing required fields for ${body.type}: ${missingRequired.join(', ')}`);
  }

  // Generate SKU if not provided
  const sku = body.sku || `${body.type.substring(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  // Check for duplicate SKU
  const existing = await itemsStore.get(sku);
  if (existing) {
    return conflict(`Item with SKU ${sku} already exists`);
  }

  const now = new Date().toISOString();
  const newItem = {
    ...body,
    sku,
    id: sku,
    dimensions: body.dimensions || { length: 0, width: 0, height: 0 },
    weight_kg: body.weight_kg || 0,
    cost: body.cost || 0,
    created_at: now,
    updated_at: now,
  } as Item & { id: string };

  await itemsStore.set(newItem);

  const response = NextResponse.json(newItem, { status: 201 });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
