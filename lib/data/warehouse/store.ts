import { createStore } from '../../db/store';
import { Item, Location, InventoryEntry, Order, Shipment } from './types';
import { items as seedItems, locations as seedLocations, inventory as seedInventory, orders as seedOrders, shipments as seedShipments } from './seed';

export const itemsStore = createStore<Item & { id?: string }>('warehouse', 'items', 'sku' as keyof (Item & { id?: string }));
export const locationsStore = createStore<Location>('warehouse', 'locations');
export const inventoryStore = createStore<InventoryEntry>('warehouse', 'inventory');
export const ordersStore = createStore<Order>('warehouse', 'orders');
export const shipmentsStore = createStore<Shipment>('warehouse', 'shipments');

let isInitialized = false;

export async function initializeWarehouseData(): Promise<void> {
  if (isInitialized) return;

  const existingItems = await itemsStore.getAll();
  if (existingItems.length > 0) {
    isInitialized = true;
    return;
  }

  await Promise.all([
    itemsStore.setMany(seedItems.map(i => ({ ...i, id: i.sku }))),
    locationsStore.setMany(seedLocations),
    inventoryStore.setMany(seedInventory),
    ordersStore.setMany(seedOrders),
    shipmentsStore.setMany(seedShipments),
  ]);

  isInitialized = true;
}

export async function resetWarehouseData(): Promise<void> {
  await Promise.all([
    itemsStore.clear(),
    locationsStore.clear(),
    inventoryStore.clear(),
    ordersStore.clear(),
    shipmentsStore.clear(),
  ]);

  isInitialized = false;
  await initializeWarehouseData();
}

export async function getItemInventory(sku: string): Promise<{ location: Location; quantity: number; bin_location: string }[]> {
  const [inventoryEntries, allLocations] = await Promise.all([
    inventoryStore.getAll(),
    locationsStore.getAll(),
  ]);

  return inventoryEntries
    .filter(inv => inv.item_sku === sku)
    .map(inv => ({
      location: allLocations.find(loc => loc.id === inv.location_id)!,
      quantity: inv.quantity,
      bin_location: inv.bin_location,
    }))
    .filter(entry => entry.location);
}

export async function getLocationInventory(locationId: string): Promise<{ item: Item; quantity: number; bin_location: string }[]> {
  const [inventoryEntries, allItems] = await Promise.all([
    inventoryStore.getAll(),
    itemsStore.getAll(),
  ]);

  return inventoryEntries
    .filter(inv => inv.location_id === locationId)
    .map(inv => ({
      item: allItems.find(item => item.sku === inv.item_sku)!,
      quantity: inv.quantity,
      bin_location: inv.bin_location,
    }))
    .filter(entry => entry.item);
}

export async function transferInventory(
  itemSku: string,
  fromLocationId: string,
  toLocationId: string,
  quantity: number
): Promise<{ success: boolean; message: string }> {
  const inventoryEntries = await inventoryStore.getAll();

  const fromEntry = inventoryEntries.find(
    inv => inv.item_sku === itemSku && inv.location_id === fromLocationId
  );

  if (!fromEntry || fromEntry.quantity < quantity) {
    return { success: false, message: 'Insufficient inventory at source location' };
  }

  const toEntry = inventoryEntries.find(
    inv => inv.item_sku === itemSku && inv.location_id === toLocationId
  );

  // Update source
  await inventoryStore.update(fromEntry.id, {
    quantity: fromEntry.quantity - quantity,
  });

  // Update or create destination
  if (toEntry) {
    await inventoryStore.update(toEntry.id, {
      quantity: toEntry.quantity + quantity,
    });
  } else {
    // Would need to create new entry - simplified for this example
    return { success: false, message: 'Destination location does not stock this item' };
  }

  return { success: true, message: `Transferred ${quantity} units successfully` };
}

export async function getOrderWithDetails(orderId: string): Promise<{
  order: Order;
  items: { item: Item; quantity: number; unit_price: number }[];
  shipment?: Shipment;
} | null> {
  const order = await ordersStore.get(orderId);
  if (!order) return null;

  const [allItems, allShipments] = await Promise.all([
    itemsStore.getAll(),
    shipmentsStore.getAll(),
  ]);

  const orderItems = order.items.map(orderItem => ({
    item: allItems.find(i => i.sku === orderItem.sku)!,
    quantity: orderItem.quantity,
    unit_price: orderItem.unit_price,
  })).filter(item => item.item);

  const shipment = allShipments.find(s => s.order_id === orderId);

  return { order, items: orderItems, shipment };
}
