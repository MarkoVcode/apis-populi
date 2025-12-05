import { kv } from '@vercel/kv';

// Check if Vercel KV is configured
const isKVConfigured = !!(
  process.env.KV_REST_API_URL &&
  process.env.KV_REST_API_TOKEN
);

// In-memory fallback storage
const memoryStore = new Map<string, unknown>();

export interface Database {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: { ex?: number }): Promise<void>;
  del(key: string): Promise<void>;
  keys(pattern: string): Promise<string[]>;
  hget<T>(key: string, field: string): Promise<T | null>;
  hset(key: string, field: string, value: unknown): Promise<void>;
  hgetall<T extends Record<string, unknown>>(key: string): Promise<T | null>;
  hdel(key: string, field: string): Promise<void>;
  hkeys(key: string): Promise<string[]>;
}

class VercelKVDatabase implements Database {
  async get<T>(key: string): Promise<T | null> {
    return kv.get<T>(key);
  }

  async set<T>(key: string, value: T, options?: { ex?: number }): Promise<void> {
    if (options?.ex) {
      await kv.set(key, value, { ex: options.ex });
    } else {
      await kv.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await kv.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return kv.keys(pattern);
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    return kv.hget<T>(key, field);
  }

  async hset(key: string, field: string, value: unknown): Promise<void> {
    await kv.hset(key, { [field]: value });
  }

  async hgetall<T extends Record<string, unknown>>(key: string): Promise<T | null> {
    return kv.hgetall<T>(key);
  }

  async hdel(key: string, field: string): Promise<void> {
    await kv.hdel(key, field);
  }

  async hkeys(key: string): Promise<string[]> {
    const data = await kv.hgetall(key);
    return data ? Object.keys(data) : [];
  }
}

class MemoryDatabase implements Database {
  async get<T>(key: string): Promise<T | null> {
    return (memoryStore.get(key) as T) ?? null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    memoryStore.set(key, value);
  }

  async del(key: string): Promise<void> {
    memoryStore.delete(key);
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return Array.from(memoryStore.keys()).filter((key) => regex.test(key));
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    const hash = memoryStore.get(key) as Record<string, unknown> | undefined;
    return (hash?.[field] as T) ?? null;
  }

  async hset(key: string, field: string, value: unknown): Promise<void> {
    const hash = (memoryStore.get(key) as Record<string, unknown>) || {};
    hash[field] = value;
    memoryStore.set(key, hash);
  }

  async hgetall<T extends Record<string, unknown>>(key: string): Promise<T | null> {
    return (memoryStore.get(key) as T) ?? null;
  }

  async hdel(key: string, field: string): Promise<void> {
    const hash = memoryStore.get(key) as Record<string, unknown> | undefined;
    if (hash) {
      delete hash[field];
      memoryStore.set(key, hash);
    }
  }

  async hkeys(key: string): Promise<string[]> {
    const hash = memoryStore.get(key) as Record<string, unknown> | undefined;
    return hash ? Object.keys(hash) : [];
  }
}

// Export the appropriate database instance
export const db: Database = isKVConfigured ? new VercelKVDatabase() : new MemoryDatabase();

// Helper to check if using KV or memory
export const isUsingKV = isKVConfigured;

// Clear all data for a specific API (used by reset endpoints)
export async function clearApiData(apiPrefix: string): Promise<void> {
  const keys = await db.keys(`${apiPrefix}:*`);
  for (const key of keys) {
    await db.del(key);
  }
}
