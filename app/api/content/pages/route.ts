import { NextRequest, NextResponse } from 'next/server';
import { getAllPages } from '@/lib/data/content/store';
import { ContentPageListItem } from '@/lib/data/content/types';
import { rateLimitMiddleware, getClientIdentifier, checkRateLimit, addRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate } from '@/lib/utils/pagination';

const API_NAME = 'content';

export async function GET(request: NextRequest) {
  // Rate limit check
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Get all pages
  const pages = await getAllPages();

  // Transform to list items
  const listItems: ContentPageListItem[] = pages.map(page => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    description: page.description,
    version: page.version,
    placement_count: page.placements.length,
    created_at: page.created_at,
    updated_at: page.updated_at,
  }));

  // Parse pagination
  const searchParams = request.nextUrl.searchParams;
  const pagination = parsePaginationParams(searchParams);

  // Sort function for pages
  const sortFn = (a: ContentPageListItem, b: ContentPageListItem) => {
    const sortField = pagination.sort || 'slug';
    const order = pagination.order === 'desc' ? -1 : 1;

    const aVal = a[sortField as keyof ContentPageListItem];
    const bVal = b[sortField as keyof ContentPageListItem];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * order;
    }
    return 0;
  };

  // Apply pagination
  const result = paginate(listItems, pagination, sortFn);

  // Add rate limit headers
  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
