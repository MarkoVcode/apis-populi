export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export function parsePaginationParams(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const sort = searchParams.get('sort') || undefined;
  const order = (searchParams.get('order') as 'asc' | 'desc') || 'asc';

  return { page, limit, sort, order };
}

export function paginate<T>(
  items: T[],
  params: PaginationParams,
  sortFn?: (a: T, b: T, sort: string, order: 'asc' | 'desc') => number
): PaginatedResponse<T> {
  let sorted = [...items];

  if (params.sort && sortFn) {
    sorted = sorted.sort((a, b) => sortFn(a, b, params.sort!, params.order || 'asc'));
  }

  const total = sorted.length;
  const pages = Math.ceil(total / params.limit);
  const start = (params.page - 1) * params.limit;
  const end = start + params.limit;
  const data = sorted.slice(start, end);

  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      pages,
      has_next: params.page < pages,
      has_prev: params.page > 1,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defaultSortFn<T extends Record<string, any>>(
  a: T,
  b: T,
  sort: string,
  order: 'asc' | 'desc'
): number {
  const aVal = a[sort as keyof T] as unknown;
  const bVal = b[sort as keyof T] as unknown;

  if (aVal === undefined || bVal === undefined) return 0;

  let comparison = 0;
  if (typeof aVal === 'string' && typeof bVal === 'string') {
    comparison = aVal.localeCompare(bVal);
  } else if (typeof aVal === 'number' && typeof bVal === 'number') {
    comparison = aVal - bVal;
  } else if (aVal instanceof Date && bVal instanceof Date) {
    comparison = aVal.getTime() - bVal.getTime();
  }

  return order === 'desc' ? -comparison : comparison;
}
