import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { badRequest } from '@/lib/utils/errors';
import { shipmentsStore, ordersStore, initializeWarehouseData } from '@/lib/data/warehouse/store';
import { Shipment } from '@/lib/data/warehouse/types';
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

  let shipments = await shipmentsStore.getAll();

  const filters = parseFilters<Shipment>(searchParams, {
    equality: ['status', 'carrier', 'order_id'],
    search: ['tracking_number'],
  });

  shipments = applyFilters(shipments, filters);

  const result = paginate(shipments, pagination, defaultSortFn);

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
    order_id?: string;
    carrier?: string;
    estimated_delivery?: string;
  };

  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (!body.order_id || !body.carrier) {
    return badRequest('Missing required fields: order_id, carrier');
  }

  const order = await ordersStore.get(body.order_id);
  if (!order) {
    return badRequest(`Order ${body.order_id} not found`);
  }

  const trackingNumber = `${body.carrier.substring(0, 2).toUpperCase()}${Date.now().toString().slice(-10)}`;

  const newShipment: Shipment = {
    id: uuidv4(),
    order_id: body.order_id,
    tracking_number: trackingNumber,
    carrier: body.carrier,
    status: 'label_created',
    estimated_delivery: body.estimated_delivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tracking_history: [{
      timestamp: new Date().toISOString(),
      status: 'label_created',
      location: 'Origin Facility',
    }],
    created_at: new Date().toISOString(),
  };

  await shipmentsStore.set(newShipment);

  // Update order status
  await ordersStore.update(body.order_id, { status: 'shipped' });

  const response = NextResponse.json(newShipment, { status: 201 });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
