export interface FilterConfig {
  equality?: string[];
  multiValue?: string[];
  range?: string[];
  search?: string[];
  dateRange?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FilterableItem = Record<string, any>;

export function parseFilters<T extends FilterableItem>(
  searchParams: URLSearchParams,
  config: FilterConfig
): ((item: T) => boolean)[] {
  const filters: ((item: T) => boolean)[] = [];

  // Equality filters: ?status=active
  if (config.equality) {
    for (const field of config.equality) {
      const value = searchParams.get(field);
      if (value !== null) {
        filters.push((item) => String(item[field as keyof T]) === value);
      }
    }
  }

  // Multi-value filters: ?status=active,pending
  if (config.multiValue) {
    for (const field of config.multiValue) {
      const value = searchParams.get(field);
      if (value !== null) {
        const values = value.split(',').map((v) => v.trim().toLowerCase());
        filters.push((item) => values.includes(String(item[field as keyof T]).toLowerCase()));
      }
    }
  }

  // Range filters: ?price_min=10&price_max=100
  if (config.range) {
    for (const field of config.range) {
      const min = searchParams.get(`${field}_min`);
      const max = searchParams.get(`${field}_max`);
      if (min !== null) {
        const minVal = parseFloat(min);
        filters.push((item) => {
          const val = item[field as keyof T];
          return typeof val === 'number' && val >= minVal;
        });
      }
      if (max !== null) {
        const maxVal = parseFloat(max);
        filters.push((item) => {
          const val = item[field as keyof T];
          return typeof val === 'number' && val <= maxVal;
        });
      }
    }
  }

  // Search filter: ?q=search+term
  if (config.search && config.search.length > 0) {
    const query = searchParams.get('q');
    if (query !== null) {
      const searchTerm = query.toLowerCase();
      filters.push((item) => {
        for (const field of config.search!) {
          const val = item[field as keyof T];
          if (typeof val === 'string' && val.toLowerCase().includes(searchTerm)) {
            return true;
          }
        }
        return false;
      });
    }
  }

  // Date range filters: ?from=2024-01-01&to=2024-12-31
  if (config.dateRange) {
    for (const field of config.dateRange) {
      const from = searchParams.get(`${field}_from`) || searchParams.get('from');
      const to = searchParams.get(`${field}_to`) || searchParams.get('to');
      if (from !== null) {
        const fromDate = new Date(from).getTime();
        filters.push((item) => {
          const val = item[field as keyof T] as unknown;
          if (val instanceof Date) return val.getTime() >= fromDate;
          if (typeof val === 'string') return new Date(val).getTime() >= fromDate;
          return true;
        });
      }
      if (to !== null) {
        const toDate = new Date(to).getTime();
        filters.push((item) => {
          const val = item[field as keyof T] as unknown;
          if (val instanceof Date) return val.getTime() <= toDate;
          if (typeof val === 'string') return new Date(val).getTime() <= toDate;
          return true;
        });
      }
    }
  }

  return filters;
}

export function applyFilters<T extends FilterableItem>(
  items: T[],
  filters: ((item: T) => boolean)[]
): T[] {
  if (filters.length === 0) return items;
  return items.filter((item) => filters.every((filter) => filter(item)));
}
