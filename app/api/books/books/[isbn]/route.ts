import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey, isApiKeyUser } from '@/lib/auth/apikey';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound, badRequest } from '@/lib/utils/errors';
import { booksStore, authorsStore, publishersStore, genresStore, initializeBooksData } from '@/lib/data/books/store';
import { Book, BookWithRelations } from '@/lib/data/books/types';

const API_NAME = 'books';

interface RouteParams {
  params: Promise<{ isbn: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { isbn } = await params;

  // Rate limiting
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Authentication
  const auth = authenticateApiKey(request, API_NAME);
  if (!isApiKeyUser(auth)) return auth;

  await initializeBooksData();

  const book = await booksStore.get(isbn);
  if (!book) {
    return notFound(`Book with ISBN ${isbn}`);
  }

  // Expand relations if requested
  const expand = request.nextUrl.searchParams.get('expand');
  let result: BookWithRelations = book;

  if (expand) {
    const expandFields = expand.split(',');
    if (expandFields.includes('author')) {
      result.author = await authorsStore.get(book.author_id) || undefined;
    }
    if (expandFields.includes('publisher')) {
      result.publisher = await publishersStore.get(book.publisher_id) || undefined;
    }
    if (expandFields.includes('genre')) {
      result.genre = await genresStore.get(book.genre_id) || undefined;
    }
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { isbn } = await params;

  // Rate limiting
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Authentication
  const auth = authenticateApiKey(request, API_NAME);
  if (!isApiKeyUser(auth)) return auth;

  await initializeBooksData();

  const existing = await booksStore.get(isbn);
  if (!existing) {
    return notFound(`Book with ISBN ${isbn}`);
  }

  let body: Partial<Book>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  // Validate references if provided
  if (body.author_id) {
    const author = await authorsStore.get(body.author_id);
    if (!author) return badRequest(`Author ${body.author_id} not found`);
  }
  if (body.publisher_id) {
    const publisher = await publishersStore.get(body.publisher_id);
    if (!publisher) return badRequest(`Publisher ${body.publisher_id} not found`);
  }
  if (body.genre_id) {
    const genre = await genresStore.get(body.genre_id);
    if (!genre) return badRequest(`Genre ${body.genre_id} not found`);
  }

  const updatedBook: Book = {
    ...existing,
    ...body,
    isbn, // ISBN cannot be changed
    updated_at: new Date().toISOString(),
  };

  await booksStore.set({ ...updatedBook, id: isbn });

  const response = NextResponse.json(updatedBook);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { isbn } = await params;

  // Rate limiting
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Authentication
  const auth = authenticateApiKey(request, API_NAME);
  if (!isApiKeyUser(auth)) return auth;

  await initializeBooksData();

  const deleted = await booksStore.delete(isbn);
  if (!deleted) {
    return notFound(`Book with ISBN ${isbn}`);
  }

  const response = new NextResponse(null, { status: 204 });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
