import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { shipmentsStore, initializeWarehouseData } from '@/lib/data/warehouse/store';

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

  const shipment = await shipmentsStore.get(id);
  if (!shipment) {
    return notFound(`Shipment with ID ${id}`);
  }

  const response = NextResponse.json({
    shipment_id: shipment.id,
    tracking_number: shipment.tracking_number,
    carrier: shipment.carrier,
    status: shipment.status,
    estimated_delivery: shipment.estimated_delivery,
    actual_delivery: shipment.actual_delivery,
    tracking_history: shipment.tracking_history,
  });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
