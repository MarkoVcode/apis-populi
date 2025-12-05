import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound, badRequest } from '@/lib/utils/errors';
import { getOrderWithDetails, ordersStore, initializeWarehouseData } from '@/lib/data/warehouse/store';
import { getJob } from '@/lib/utils/async-jobs';
import { Order } from '@/lib/data/warehouse/types';

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

  // First check if it's a job ID
  const job = getJob(id);
  if (job) {
    if (job.status === 'completed' && job.result) {
      const response = NextResponse.json(job.result);
      const clientId = getClientIdentifier(request);
      const rateLimit = checkRateLimit(API_NAME, clientId);
      return addRateLimitHeaders(response, rateLimit);
    }
    // Return job status
    const response = NextResponse.json({
      job_id: job.id,
      status: job.status,
      progress: job.progress,
      eta_seconds: job.eta_seconds,
      ...(job.status === 'failed' && { error: job.error }),
    });
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(API_NAME, clientId);
    return addRateLimitHeaders(response, rateLimit);
  }

  // Otherwise look for existing order
  const orderDetails = await getOrderWithDetails(id);
  if (!orderDetails) {
    return notFound(`Order with ID ${id}`);
  }

  const expand = request.nextUrl.searchParams.get('expand');
  let result: Record<string, unknown> = { ...orderDetails.order };

  if (expand) {
    const expandFields = expand.split(',');
    if (expandFields.includes('items')) {
      result.item_details = orderDetails.items;
    }
    if (expandFields.includes('shipment') && orderDetails.shipment) {
      result.shipment = orderDetails.shipment;
    }
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['basic', 'custom_header'],
    allowedPrefix: 'warehouse',
  });
  if (!isAuthResult(auth)) return auth;

  await initializeWarehouseData();

  const order = await ordersStore.get(id);
  if (!order) {
    return notFound(`Order with ID ${id}`);
  }

  let body: { status?: Order['status'] };
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (!body.status) {
    return badRequest('Missing required field: status');
  }

  const validStatuses: Order['status'][] = ['pending', 'processing', 'fulfilled', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(body.status)) {
    return badRequest(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const updated = await ordersStore.update(id, {
    status: body.status,
    updated_at: new Date().toISOString(),
    ...(body.status === 'fulfilled' && { fulfilled_at: new Date().toISOString() }),
  });

  const response = NextResponse.json(updated);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
