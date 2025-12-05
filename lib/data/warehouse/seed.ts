import { Item, Location, InventoryEntry, Order, Shipment, ElectronicsItem, FurnitureItem, ClothingItem, FoodItem, ToolsItem } from './types';

const electronicsItems: ElectronicsItem[] = [
  { sku: 'ELEC-001', name: 'Ultra HD Smart TV 55"', type: 'electronics', description: '4K Ultra HD Smart LED TV with HDR', price: 599.99, cost: 350, weight_kg: 18.5, dimensions: { length: 123, width: 71, height: 8 }, brand: 'TechVision', model: 'TV-55UHD', voltage: 120, warranty_months: 24, power_consumption_watts: 150, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'ELEC-002', name: 'Wireless Bluetooth Headphones', type: 'electronics', description: 'Noise-cancelling over-ear headphones', price: 149.99, cost: 60, weight_kg: 0.32, dimensions: { length: 20, width: 18, height: 10 }, brand: 'AudioMax', model: 'BT-NC500', voltage: 5, warranty_months: 12, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'ELEC-003', name: 'Laptop Pro 15', type: 'electronics', description: '15.6" Professional Laptop with i7', price: 1299.99, cost: 800, weight_kg: 2.1, dimensions: { length: 36, width: 25, height: 2 }, brand: 'CompuTech', model: 'LP-15PRO', voltage: 19, warranty_months: 36, power_consumption_watts: 65, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'ELEC-004', name: 'Smart Home Speaker', type: 'electronics', description: 'Voice-controlled smart speaker', price: 79.99, cost: 30, weight_kg: 0.8, dimensions: { length: 10, width: 10, height: 15 }, brand: 'SmartHome', model: 'SH-SPEAK1', voltage: 12, warranty_months: 12, power_consumption_watts: 10, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'ELEC-005', name: 'Wireless Charging Pad', type: 'electronics', description: 'Fast wireless charger for phones', price: 39.99, cost: 12, weight_kg: 0.15, dimensions: { length: 10, width: 10, height: 1 }, brand: 'PowerUp', model: 'WC-FAST', voltage: 9, warranty_months: 12, power_consumption_watts: 15, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

const furnitureItems: FurnitureItem[] = [
  { sku: 'FURN-001', name: 'Modern Desk Chair', type: 'furniture', description: 'Ergonomic office chair with lumbar support', price: 299.99, cost: 120, weight_kg: 15, dimensions: { length: 65, width: 65, height: 120 }, material: 'Mesh and Steel', color: 'Black', assembly_required: true, max_weight_capacity_kg: 150, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'FURN-002', name: 'Standing Desk', type: 'furniture', description: 'Electric height-adjustable desk', price: 549.99, cost: 250, weight_kg: 45, dimensions: { length: 150, width: 75, height: 130 }, material: 'Bamboo and Steel', color: 'Natural', assembly_required: true, max_weight_capacity_kg: 100, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'FURN-003', name: 'Bookshelf 5-Tier', type: 'furniture', description: 'Modern industrial style bookshelf', price: 189.99, cost: 70, weight_kg: 25, dimensions: { length: 80, width: 30, height: 180 }, material: 'Wood and Metal', color: 'Walnut', assembly_required: true, max_weight_capacity_kg: 80, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'FURN-004', name: 'Coffee Table', type: 'furniture', description: 'Minimalist coffee table with storage', price: 159.99, cost: 55, weight_kg: 18, dimensions: { length: 100, width: 50, height: 45 }, material: 'Oak Wood', color: 'Light Brown', assembly_required: false, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'FURN-005', name: 'Floor Lamp', type: 'furniture', description: 'Modern arc floor lamp', price: 129.99, cost: 45, weight_kg: 8, dimensions: { length: 40, width: 40, height: 180 }, material: 'Brass and Marble', color: 'Gold', assembly_required: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

const clothingItems: ClothingItem[] = [
  { sku: 'CLTH-001', name: 'Classic Fit T-Shirt', type: 'clothing', description: 'Premium cotton classic fit t-shirt', price: 29.99, cost: 8, weight_kg: 0.2, dimensions: { length: 30, width: 25, height: 2 }, size: 'M', color: 'Navy Blue', material: '100% Cotton', gender: 'unisex', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'CLTH-002', name: 'Denim Jeans', type: 'clothing', description: 'Slim fit stretch denim jeans', price: 79.99, cost: 25, weight_kg: 0.6, dimensions: { length: 40, width: 30, height: 3 }, size: 'L', color: 'Indigo', material: '98% Cotton, 2% Elastane', gender: 'male', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'CLTH-003', name: 'Wool Blend Sweater', type: 'clothing', description: 'Cozy wool blend crew neck sweater', price: 89.99, cost: 30, weight_kg: 0.4, dimensions: { length: 35, width: 28, height: 4 }, size: 'S', color: 'Burgundy', material: '50% Wool, 50% Acrylic', gender: 'female', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'CLTH-004', name: 'Running Shoes', type: 'clothing', description: 'Lightweight running shoes with cushion', price: 119.99, cost: 45, weight_kg: 0.5, dimensions: { length: 32, width: 12, height: 12 }, size: '10', color: 'White/Black', material: 'Synthetic Mesh', gender: 'unisex', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'CLTH-005', name: 'Winter Jacket', type: 'clothing', description: 'Waterproof insulated winter jacket', price: 199.99, cost: 75, weight_kg: 1.2, dimensions: { length: 70, width: 55, height: 8 }, size: 'XL', color: 'Forest Green', material: 'Polyester with Down Fill', gender: 'male', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

const foodItems: FoodItem[] = [
  { sku: 'FOOD-001', name: 'Organic Quinoa', type: 'food', description: 'Premium organic white quinoa', price: 12.99, cost: 5, weight_kg: 1, dimensions: { length: 20, width: 10, height: 5 }, expiry_date: '2025-12-31', calories_per_serving: 170, allergens: [], storage_temperature_c: { min: 15, max: 25 }, organic: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'FOOD-002', name: 'Dark Chocolate Bar', type: 'food', description: '72% cacao dark chocolate', price: 5.99, cost: 2, weight_kg: 0.1, dimensions: { length: 15, width: 8, height: 1 }, expiry_date: '2025-06-30', calories_per_serving: 210, allergens: ['milk', 'soy'], storage_temperature_c: { min: 15, max: 20 }, organic: false, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'FOOD-003', name: 'Extra Virgin Olive Oil', type: 'food', description: 'Cold-pressed Italian olive oil', price: 18.99, cost: 8, weight_kg: 0.75, dimensions: { length: 8, width: 8, height: 25 }, expiry_date: '2025-09-30', calories_per_serving: 120, allergens: [], storage_temperature_c: { min: 10, max: 22 }, organic: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'FOOD-004', name: 'Almond Butter', type: 'food', description: 'Natural creamy almond butter', price: 14.99, cost: 6, weight_kg: 0.45, dimensions: { length: 8, width: 8, height: 12 }, expiry_date: '2025-08-15', calories_per_serving: 190, allergens: ['tree nuts'], storage_temperature_c: { min: 15, max: 25 }, organic: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'FOOD-005', name: 'Protein Powder', type: 'food', description: 'Whey protein isolate vanilla', price: 49.99, cost: 20, weight_kg: 2, dimensions: { length: 15, width: 15, height: 28 }, expiry_date: '2025-10-31', calories_per_serving: 120, allergens: ['milk', 'soy'], storage_temperature_c: { min: 15, max: 25 }, organic: false, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

const toolsItems: ToolsItem[] = [
  { sku: 'TOOL-001', name: 'Cordless Drill', type: 'tools', description: '20V Max cordless drill/driver', price: 129.99, cost: 50, weight_kg: 1.5, dimensions: { length: 25, width: 20, height: 8 }, power_source: 'battery', safety_rating: 'UL Listed', intended_use: 'Drilling and driving screws in wood, metal, and plastic', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'TOOL-002', name: 'Hammer', type: 'tools', description: '16oz claw hammer with fiberglass handle', price: 24.99, cost: 8, weight_kg: 0.5, dimensions: { length: 35, width: 12, height: 4 }, power_source: 'manual', safety_rating: 'ANSI Certified', intended_use: 'Driving nails and general construction', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'TOOL-003', name: 'Circular Saw', type: 'tools', description: '7-1/4" circular saw 15 Amp', price: 149.99, cost: 60, weight_kg: 4.2, dimensions: { length: 35, width: 25, height: 25 }, power_source: 'electric', safety_rating: 'CSA Certified', intended_use: 'Cutting wood, plywood, and composite materials', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'TOOL-004', name: 'Socket Set', type: 'tools', description: '150-piece mechanics tool set', price: 199.99, cost: 80, weight_kg: 8, dimensions: { length: 50, width: 35, height: 12 }, power_source: 'manual', safety_rating: 'ANSI Certified', intended_use: 'Automotive and mechanical repairs', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { sku: 'TOOL-005', name: 'Air Compressor', type: 'tools', description: '6 Gallon pancake air compressor', price: 179.99, cost: 70, weight_kg: 14, dimensions: { length: 45, width: 40, height: 50 }, power_source: 'pneumatic', safety_rating: 'UL Listed', intended_use: 'Powering pneumatic tools and inflating tires', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

export const items: Item[] = [...electronicsItems, ...furnitureItems, ...clothingItems, ...foodItems, ...toolsItems];

export const locations: Location[] = [
  { id: 'loc-001', name: 'Main Distribution Center', type: 'distribution_center', address: '1000 Warehouse Blvd', city: 'Chicago', country: 'United States', capacity_units: 100000, current_occupancy: 75000, operating_hours: { open: '06:00', close: '22:00' }, manager: 'John Smith' },
  { id: 'loc-002', name: 'East Coast Warehouse', type: 'warehouse', address: '500 Industrial Park', city: 'Newark', country: 'United States', capacity_units: 50000, current_occupancy: 35000, operating_hours: { open: '07:00', close: '21:00' }, manager: 'Sarah Johnson' },
  { id: 'loc-003', name: 'West Coast Warehouse', type: 'warehouse', address: '2500 Pacific Ave', city: 'Los Angeles', country: 'United States', capacity_units: 60000, current_occupancy: 42000, operating_hours: { open: '06:00', close: '23:00' }, manager: 'Michael Brown' },
  { id: 'loc-004', name: 'Downtown Store', type: 'store', address: '100 Main Street', city: 'New York', country: 'United States', capacity_units: 5000, current_occupancy: 3500, operating_hours: { open: '09:00', close: '21:00' }, manager: 'Emily Davis' },
  { id: 'loc-005', name: 'European Hub', type: 'distribution_center', address: '25 Logistics Road', city: 'Amsterdam', country: 'Netherlands', capacity_units: 80000, current_occupancy: 55000, operating_hours: { open: '05:00', close: '23:00' }, manager: 'Hans Mueller' },
];

export const inventory: InventoryEntry[] = [];
items.forEach((item, itemIndex) => {
  locations.forEach((location, locIndex) => {
    inventory.push({
      id: `inv-${itemIndex}-${locIndex}`,
      item_sku: item.sku,
      location_id: location.id,
      quantity: 50 + Math.floor(Math.random() * 200),
      min_stock_level: 20,
      max_stock_level: 500,
      last_restocked: new Date(2024, 11, Math.floor(Math.random() * 28) + 1).toISOString(),
      bin_location: `${['A', 'B', 'C', 'D'][locIndex % 4]}${10 + itemIndex}-${locIndex + 1}`,
    });
  });
});

const customerNames = ['Alice Cooper', 'Bob Wilson', 'Carol Martinez', 'David Lee', 'Eva Garcia'];
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];

export const orders: Order[] = [];
for (let i = 0; i < 50; i++) {
  const numItems = 1 + Math.floor(Math.random() * 4);
  const orderItems = items.slice(i % items.length, (i % items.length) + numItems).map(item => ({
    sku: item.sku,
    quantity: 1 + Math.floor(Math.random() * 3),
    unit_price: item.price,
  }));

  const totalAmount = orderItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const statuses: Order['status'][] = ['pending', 'processing', 'fulfilled', 'shipped', 'delivered'];

  orders.push({
    id: `order-${i + 1}`,
    order_number: `ORD-${String(10000 + i).padStart(6, '0')}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    items: orderItems,
    total_amount: Math.round(totalAmount * 100) / 100,
    customer: {
      name: customerNames[i % customerNames.length],
      email: `customer${i + 1}@example.com`,
      address: `${100 + i} Sample Street`,
      city: cities[i % cities.length],
      country: 'United States',
    },
    created_at: new Date(2024, 11, Math.floor(Math.random() * 28) + 1).toISOString(),
    updated_at: new Date().toISOString(),
  });
}

const carriers = ['FedEx', 'UPS', 'DHL', 'USPS'];

export const shipments: Shipment[] = [];
orders.filter(o => ['shipped', 'delivered'].includes(o.status)).forEach((order, i) => {
  const carrier = carriers[i % carriers.length];
  const statuses: Shipment['status'][] = order.status === 'delivered'
    ? ['label_created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered']
    : ['label_created', 'picked_up', 'in_transit'];

  shipments.push({
    id: `ship-${i + 1}`,
    order_id: order.id,
    tracking_number: `${carrier.substring(0, 2).toUpperCase()}${100000000 + i}`,
    carrier,
    status: statuses[statuses.length - 1],
    estimated_delivery: new Date(Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    actual_delivery: order.status === 'delivered' ? new Date().toISOString() : undefined,
    tracking_history: statuses.map((status, idx) => ({
      timestamp: new Date(Date.now() - (statuses.length - idx) * 12 * 60 * 60 * 1000).toISOString(),
      status,
      location: ['Origin Facility', 'Regional Hub', 'Local Hub', 'Out for Delivery', 'Delivered'][idx] || 'Unknown',
    })),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  });
});
