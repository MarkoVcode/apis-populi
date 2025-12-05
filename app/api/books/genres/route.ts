import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey, isApiKeyUser } from '@/lib/auth/apikey';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { genresStore, booksStore, initializeBooksData } from '@/lib/data/books/store';

const API_NAME = 'books';

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Authentication
  const auth = authenticateApiKey(request, API_NAME);
  if (!isApiKeyUser(auth)) return auth;

  await initializeBooksData();

  // Get all genres with book counts
  const [genres, books] = await Promise.all([
    genresStore.getAll(),
    booksStore.getAll(),
  ]);

  const genresWithCounts = genres.map(genre => {
    const bookCount = books.filter(b => b.genre_id === genre.id).length;
    return {
      ...genre,
      book_count: bookCount,
    };
  });

  const response = NextResponse.json({
    data: genresWithCounts,
    total: genresWithCounts.length,
  });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
