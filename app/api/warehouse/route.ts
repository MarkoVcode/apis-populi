import { NextResponse } from 'next/server';
import { initializeWarehouseData } from '@/lib/data/warehouse/store';
import { getWarehouseTokens } from '@/lib/auth/custom-header';

export async function GET() {
  await initializeWarehouseData();

  return NextResponse.json({
    name: 'Warehouse API',
    version: '1.0.0',
    description: 'An inventory management API with polymorphic items, locations, inventory tracking, orders, and shipments',
    authentication: {
      methods: ['Basic Auth', 'Custom Header (X-Warehouse-Token)'],
      basic_auth: {
        credentials: [
          { username: 'warehouse_user', password: 'warehouse123' },
          { username: 'warehouse_admin', password: 'admin456' },
        ],
      },
      custom_header: {
        header: 'X-Warehouse-Token',
        demo_tokens: getWarehouseTokens(),
      },
    },
    async_operations: {
      note: 'Order creation is asynchronous (takes 20-50 seconds)',
      pattern: 'Webhook',
      description: 'Provide webhook_url in POST /orders to receive fulfillment notification',
    },
    item_types: ['electronics', 'furniture', 'clothing', 'food', 'tools'],
    endpoints: {
      items: '/api/warehouse/items',
      item_types: '/api/warehouse/items/types',
      locations: '/api/warehouse/locations',
      inventory: '/api/warehouse/inventory',
      orders: '/api/warehouse/orders',
      shipments: '/api/warehouse/shipments',
      openapi: '/api/warehouse/openapi.yaml',
      reset: '/api/warehouse/reset',
    },
    rate_limit: {
      requests_per_minute: 50,
      burst: 10,
    },
  });
}
