import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey, isApiKeyUser } from '@/lib/auth/apikey';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { badRequest, notFound, conflict } from '@/lib/utils/errors';
import { booksStore, authorsStore, publishersStore, genresStore, initializeBooksData } from '@/lib/data/books/store';
import { Book, BookWithRelations } from '@/lib/data/books/types';
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

  // Get all books
  let allBooks = await booksStore.getAll();

  // Apply filters
  const filters = parseFilters<Book>(searchParams, {
    equality: ['language', 'in_stock'],
    multiValue: ['genre_id', 'author_id', 'publisher_id'],
    range: ['price', 'pages', 'rating', 'publication_year'],
    search: ['title', 'description'],
  });

  allBooks = applyFilters(allBooks, filters);

  // Expand relations if requested
  const expand = searchParams.get('expand');
  let expandedBooks: BookWithRelations[] = allBooks;

  if (expand) {
    const expandFields = expand.split(',');
    const [authors, publishers, genres] = await Promise.all([
      expandFields.includes('author') ? authorsStore.getAll() : Promise.resolve([]),
      expandFields.includes('publisher') ? publishersStore.getAll() : Promise.resolve([]),
      expandFields.includes('genre') ? genresStore.getAll() : Promise.resolve([]),
    ]);

    expandedBooks = allBooks.map(book => {
      const expanded: BookWithRelations = { ...book };
      if (expandFields.includes('author')) {
        expanded.author = authors.find(a => a.id === book.author_id);
      }
      if (expandFields.includes('publisher')) {
        expanded.publisher = publishers.find(p => p.id === book.publisher_id);
      }
      if (expandFields.includes('genre')) {
        expanded.genre = genres.find(g => g.id === book.genre_id);
      }
      return expanded;
    });
  }

  // Paginate
  const result = paginate(expandedBooks, pagination, defaultSortFn);

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

  let body: Partial<Book>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  // Validate required fields
  const requiredFields = ['title', 'author_id', 'publisher_id', 'genre_id'];
  const missingFields = requiredFields.filter(f => !body[f as keyof Book]);
  if (missingFields.length > 0) {
    return badRequest(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Generate ISBN if not provided
  const isbn = body.isbn || `978-${uuidv4().slice(0, 10).replace(/-/g, '')}`;

  // Check if ISBN already exists
  const existing = await booksStore.get(isbn);
  if (existing) {
    return conflict(`Book with ISBN ${isbn} already exists`);
  }

  // Validate references
  const [author, publisher, genre] = await Promise.all([
    authorsStore.get(body.author_id!),
    publishersStore.get(body.publisher_id!),
    genresStore.get(body.genre_id!),
  ]);

  if (!author) return badRequest(`Author ${body.author_id} not found`);
  if (!publisher) return badRequest(`Publisher ${body.publisher_id} not found`);
  if (!genre) return badRequest(`Genre ${body.genre_id} not found`);

  const now = new Date().toISOString();
  const newBook: Book = {
    isbn,
    title: body.title!,
    author_id: body.author_id!,
    publisher_id: body.publisher_id!,
    genre_id: body.genre_id!,
    publication_year: body.publication_year || new Date().getFullYear(),
    pages: body.pages || 0,
    language: body.language || 'English',
    description: body.description || '',
    price: body.price || 0,
    in_stock: body.in_stock ?? true,
    rating: body.rating || 0,
    created_at: now,
    updated_at: now,
  };

  await booksStore.set({ ...newBook, id: isbn });

  const response = NextResponse.json(newBook, { status: 201 });
  response.headers.set('Location', `/api/books/books/${isbn}`);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
