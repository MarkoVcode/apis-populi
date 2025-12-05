import { NextRequest } from 'next/server';
import { unauthorized } from '../utils/errors';

// Custom header tokens for warehouse API
const warehouseTokens = process.env.WAREHOUSE_TOKENS?.split(',') || [
  'wh-token-abc123',
  'wh-token-xyz789',
  'wh-demo-token',
];

export interface CustomHeaderUser {
  token: string;
  isValid: boolean;
}

export function validateWarehouseToken(token: string): CustomHeaderUser | null {
  if (!warehouseTokens.includes(token)) {
    return null;
  }

  return {
    token,
    isValid: true,
  };
}

export function authenticateCustomHeader(
  request: NextRequest
): CustomHeaderUser | ReturnType<typeof unauthorized> {
  const token = request.headers.get('x-warehouse-token');

  if (!token) {
    return unauthorized('X-Warehouse-Token header required');
  }

  const user = validateWarehouseToken(token);

  if (!user) {
    return unauthorized('Invalid warehouse token');
  }

  return user;
}

export function isCustomHeaderUser(result: unknown): result is CustomHeaderUser {
  return (
    typeof result === 'object' &&
    result !== null &&
    'token' in result &&
    'isValid' in result
  );
}

// Get all valid warehouse tokens (useful for documentation)
export function getWarehouseTokens(): string[] {
  return warehouseTokens;
}
