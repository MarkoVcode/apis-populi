import { NextResponse } from 'next/server';
import { db, isUsingKV } from '@/lib/db/kv';

export async function GET() {
  let kvStatus = 'unknown';
  let kvError: string | null = null;

  try {
    // Try a simple operation to verify KV connectivity
    const testKey = '_health_check';
    await db.set(testKey, { timestamp: Date.now() });
    const result = await db.get(testKey);
    await db.del(testKey);

    if (result) {
      kvStatus = isUsingKV ? 'kv_connected' : 'memory_fallback';
    } else {
      kvStatus = 'error';
      kvError = 'Failed to read test value';
    }
  } catch (error) {
    kvStatus = 'error';
    kvError = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    storage: {
      type: isUsingKV ? 'vercel_kv' : 'memory',
      status: kvStatus,
      ...(kvError && { error: kvError }),
    },
  });
}
