import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { inventoryStore, itemsStore, locationsStore, initializeWarehouseData } from '@/lib/data/warehouse/store';
import { InventoryEntry } from '@/lib/data/warehouse/types';

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

  let inventory = await inventoryStore.getAll();

  const filters = parseFilters<InventoryEntry>(searchParams, {
    equality: ['item_sku', 'location_id'],
    range: ['quantity'],
  });

  inventory = applyFilters(inventory, filters);

  // Filter by low stock if requested
  const lowStock = searchParams.get('low_stock');
  if (lowStock === 'true') {
    inventory = inventory.filter(inv => inv.quantity <= inv.min_stock_level);
  }

  // Expand item and location details if requested
  const expand = searchParams.get('expand');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let expandedInventory: any[] = inventory;

  if (expand) {
    const expandFields = expand.split(',');
    const [items, locations] = await Promise.all([
      expandFields.includes('item') ? itemsStore.getAll() : Promise.resolve([]),
      expandFields.includes('location') ? locationsStore.getAll() : Promise.resolve([]),
    ]);

    expandedInventory = inventory.map(inv => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const expanded: Record<string, any> = { ...inv };
      if (expandFields.includes('item')) {
        expanded.item = items.find(i => i.sku === inv.item_sku);
      }
      if (expandFields.includes('location')) {
        expanded.location = locations.find(l => l.id === inv.location_id);
      }
      return expanded;
    });
  }

  const result = paginate(expandedInventory, pagination, defaultSortFn);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
