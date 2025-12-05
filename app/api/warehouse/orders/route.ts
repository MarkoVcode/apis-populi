import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { badRequest } from '@/lib/utils/errors';
import { ordersStore, itemsStore, initializeWarehouseData } from '@/lib/data/warehouse/store';
import { Order } from '@/lib/data/warehouse/types';
import { createJob, processJob } from '@/lib/utils/async-jobs';
import { v4 as uuidv4 } from 'uuid';

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

  let orders = await ordersStore.getAll();

  const filters = parseFilters<Order>(searchParams, {
    equality: ['status'],
    multiValue: ['status'],
    search: ['order_number'],
    range: ['total_amount'],
    dateRange: ['created_at'],
  });

  orders = applyFilters(orders, filters);

  const result = paginate(orders, pagination, defaultSortFn);

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

  let body: {
    items?: { sku: string; quantity: number }[];
    customer?: Order['customer'];
    webhook_url?: string;
  };

  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (!body.items || body.items.length === 0 || !body.customer) {
    return badRequest('Missing required fields: items, customer');
  }

  // Validate items
  const allItems = await itemsStore.getAll();
  const orderItems: { sku: string; quantity: number; unit_price: number }[] = [];

  for (const orderItem of body.items) {
    const item = allItems.find(i => i.sku === orderItem.sku);
    if (!item) {
      return badRequest(`Item ${orderItem.sku} not found`);
    }
    orderItems.push({
      sku: orderItem.sku,
      quantity: orderItem.quantity,
      unit_price: item.price,
    });
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  // Create async job for order processing (webhook pattern)
  const job = createJob<Order>(body.webhook_url);

  // Start async processing
  processJob(job.id, async () => {
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const newOrder: Order = {
      id: uuidv4(),
      order_number: orderNumber,
      status: 'fulfilled',
      items: orderItems,
      total_amount: Math.round(totalAmount * 100) / 100,
      customer: body.customer!,
      webhook_url: body.webhook_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      fulfilled_at: new Date().toISOString(),
    };

    await ordersStore.set(newOrder);
    return newOrder;
  });

  // Return 202 Accepted
  const response = NextResponse.json({
    message: 'Order request accepted',
    job_id: job.id,
    webhook_configured: !!body.webhook_url,
    note: body.webhook_url
      ? 'You will receive a POST to your webhook_url when the order is fulfilled'
      : 'Check order status with GET /api/warehouse/orders/{job_id}',
    estimated_time_seconds: '20-50',
  }, { status: 202 });

  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
