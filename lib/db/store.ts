import { db, clearApiData } from './kv';

// Generic store operations for any API
export class DataStore<T extends { id?: string }> {
  constructor(private prefix: string, private idField: keyof T = 'id' as keyof T) {}

  private getKey(id: string): string {
    return `${this.prefix}:${id}`;
  }

  private getIndexKey(): string {
    return `${this.prefix}:_index`;
  }

  async get(id: string): Promise<T | null> {
    return db.get<T>(this.getKey(id));
  }

  async getAll(): Promise<T[]> {
    const ids = await db.get<string[]>(this.getIndexKey());
    if (!ids || ids.length === 0) return [];

    const items = await Promise.all(ids.map((id) => this.get(id)));
    return items.filter((item) => item !== null) as T[];
  }

  async set(item: T): Promise<void> {
    const id = String(item[this.idField]);
    await db.set(this.getKey(id), item);

    // Update index
    const ids = (await db.get<string[]>(this.getIndexKey())) || [];
    if (!ids.includes(id)) {
      ids.push(id);
      await db.set(this.getIndexKey(), ids);
    }
  }

  async setMany(items: T[]): Promise<void> {
    await Promise.all(items.map((item) => this.set(item)));
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.get(id);
    if (!existing) return false;

    await db.del(this.getKey(id));

    // Update index
    const ids = (await db.get<string[]>(this.getIndexKey())) || [];
    const newIds = ids.filter((i) => i !== id);
    await db.set(this.getIndexKey(), newIds);

    return true;
  }

  async clear(): Promise<void> {
    await clearApiData(this.prefix);
  }

  async count(): Promise<number> {
    const ids = await db.get<string[]>(this.getIndexKey());
    return ids?.length || 0;
  }

  async exists(id: string): Promise<boolean> {
    const item = await this.get(id);
    return item !== null;
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const existing = await this.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    await this.set(updated);
    return updated;
  }
}

// Create a store instance for an API
export function createStore<T extends { id?: string }>(
  apiName: string,
  resource: string,
  idField: keyof T = 'id' as keyof T
): DataStore<T> {
  return new DataStore<T>(`${apiName}:${resource}`, idField);
}
