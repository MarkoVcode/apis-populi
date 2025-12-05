export type ItemType = 'electronics' | 'furniture' | 'clothing' | 'food' | 'tools';

export interface BaseItem {
  sku: string;
  name: string;
  type: ItemType;
  description: string;
  price: number;
  cost: number;
  weight_kg: number;
  dimensions: { length: number; width: number; height: number };
  created_at: string;
  updated_at: string;
}

export interface ElectronicsItem extends BaseItem {
  type: 'electronics';
  brand: string;
  model: string;
  voltage: number;
  warranty_months: number;
  power_consumption_watts?: number;
}

export interface FurnitureItem extends BaseItem {
  type: 'furniture';
  material: string;
  color: string;
  assembly_required: boolean;
  max_weight_capacity_kg?: number;
}

export interface ClothingItem extends BaseItem {
  type: 'clothing';
  size: string;
  color: string;
  material: string;
  gender: 'male' | 'female' | 'unisex';
}

export interface FoodItem extends BaseItem {
  type: 'food';
  expiry_date: string;
  calories_per_serving: number;
  allergens: string[];
  storage_temperature_c: { min: number; max: number };
  organic: boolean;
}

export interface ToolsItem extends BaseItem {
  type: 'tools';
  power_source: 'manual' | 'electric' | 'battery' | 'pneumatic';
  safety_rating: string;
  intended_use: string;
}

export type Item = ElectronicsItem | FurnitureItem | ClothingItem | FoodItem | ToolsItem;

export interface Location {
  id: string;
  name: string;
  type: 'warehouse' | 'store' | 'distribution_center';
  address: string;
  city: string;
  country: string;
  capacity_units: number;
  current_occupancy: number;
  operating_hours: { open: string; close: string };
  manager: string;
}

export interface InventoryEntry {
  id: string;
  item_sku: string;
  location_id: string;
  quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  last_restocked: string;
  bin_location: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled';
  items: { sku: string; quantity: number; unit_price: number }[];
  total_amount: number;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
  };
  webhook_url?: string;
  created_at: string;
  updated_at: string;
  fulfilled_at?: string;
}

export interface Shipment {
  id: string;
  order_id: string;
  tracking_number: string;
  carrier: string;
  status: 'label_created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered';
  estimated_delivery: string;
  actual_delivery?: string;
  tracking_history: { timestamp: string; status: string; location: string }[];
  created_at: string;
}

export const itemTypeSchemas: Record<ItemType, { required: string[]; optional: string[] }> = {
  electronics: {
    required: ['brand', 'model', 'voltage', 'warranty_months'],
    optional: ['power_consumption_watts'],
  },
  furniture: {
    required: ['material', 'color', 'assembly_required'],
    optional: ['max_weight_capacity_kg'],
  },
  clothing: {
    required: ['size', 'color', 'material', 'gender'],
    optional: [],
  },
  food: {
    required: ['expiry_date', 'calories_per_serving', 'allergens', 'storage_temperature_c', 'organic'],
    optional: [],
  },
  tools: {
    required: ['power_source', 'safety_rating', 'intended_use'],
    optional: [],
  },
};
