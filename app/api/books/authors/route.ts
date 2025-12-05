import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey, isApiKeyUser } from '@/lib/auth/apikey';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { badRequest, conflict } from '@/lib/utils/errors';
import { authorsStore, initializeBooksData } from '@/lib/data/books/store';
import { Author } from '@/lib/data/books/types';
import { v4 as uuidv4 } from 'uuid';

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
  const pagination = parsePaginationParams(searchParams);

  // Get all authors
  let authors = await authorsStore.getAll();

  // Apply filters
  const filters = parseFilters<Author>(searchParams, {
    equality: ['nationality'],
    search: ['name', 'biography'],
    range: ['birth_year', 'death_year'],
  });

  authors = applyFilters(authors, filters);

  // Paginate
  const result = paginate(authors, pagination, defaultSortFn);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Authentication
  const auth = authenticateApiKey(request, API_NAME);
  if (!isApiKeyUser(auth)) return auth;

  await initializeBooksData();

  let body: Partial<Author>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  // Validate required fields
  if (!body.name || !body.nationality) {
    return badRequest('Missing required fields: name, nationality');
  }

  // Check for duplicate name
  const existingAuthors = await authorsStore.getAll();
  const duplicate = existingAuthors.find(a => a.name.toLowerCase() === body.name!.toLowerCase());
  if (duplicate) {
    return conflict(`Author ${body.name} already exists`);
  }

  const now = new Date().toISOString();
  const newAuthor: Author = {
    id: uuidv4(),
    name: body.name,
    birth_year: body.birth_year || 0,
    death_year: body.death_year,
    nationality: body.nationality,
    biography: body.biography || '',
    created_at: now,
    updated_at: now,
  };

  await authorsStore.set(newAuthor);

  const response = NextResponse.json(newAuthor, { status: 201 });
  response.headers.set('Location', `/api/books/authors/${newAuthor.id}`);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
