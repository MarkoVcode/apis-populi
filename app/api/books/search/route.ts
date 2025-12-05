import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey, isApiKeyUser } from '@/lib/auth/apikey';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { badRequest } from '@/lib/utils/errors';
import { searchBooks, initializeBooksData } from '@/lib/data/books/store';

const API_NAME = 'books';

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Authentication
  const auth = authenticateApiKey(request, API_NAME);
  if (!isApiKeyUser(auth)) return auth;

  await initializeBooksData();

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return badRequest('Search query (q) must be at least 2 characters');
  }

  const results = await searchBooks(query);

  const response = NextResponse.json({
    query,
    results: {
      books: {
        count: results.books.length,
        items: results.books.slice(0, 20), // Limit to 20 results
      },
      authors: {
        count: results.authors.length,
        items: results.authors.slice(0, 10), // Limit to 10 results
      },
    },
  });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
