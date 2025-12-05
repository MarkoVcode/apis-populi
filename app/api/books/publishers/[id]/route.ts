import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey, isApiKeyUser } from '@/lib/auth/apikey';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { publishersStore, getBooksByPublisher, initializeBooksData } from '@/lib/data/books/store';

const API_NAME = 'books';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  // Rate limiting
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Authentication
  const auth = authenticateApiKey(request, API_NAME);
  if (!isApiKeyUser(auth)) return auth;

  await initializeBooksData();

  const publisher = await publishersStore.get(id);
  if (!publisher) {
    return notFound(`Publisher with ID ${id}`);
  }

  // Include books if requested
  const includeBooks = request.nextUrl.searchParams.get('include_books') === 'true';

  let result: Record<string, unknown> = { ...publisher };
  if (includeBooks) {
    const books = await getBooksByPublisher(id);
    result.books = books;
    result.book_count = books.length;
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
