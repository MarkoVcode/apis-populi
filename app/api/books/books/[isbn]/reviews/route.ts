import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey, isApiKeyUser } from '@/lib/auth/apikey';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { notFound, badRequest } from '@/lib/utils/errors';
import { booksStore, reviewsStore, getBookReviews, initializeBooksData } from '@/lib/data/books/store';
import { Review } from '@/lib/data/books/types';
import { v4 as uuidv4 } from 'uuid';

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

  // Check if book exists
  const book = await booksStore.get(isbn);
  if (!book) {
    return notFound(`Book with ISBN ${isbn}`);
  }

  const searchParams = request.nextUrl.searchParams;
  const pagination = parsePaginationParams(searchParams);

  // Get reviews for this book
  const reviews = await getBookReviews(isbn);

  // Filter by rating if specified
  const minRating = searchParams.get('rating_min');
  const verifiedOnly = searchParams.get('verified_only');

  let filteredReviews = reviews;
  if (minRating) {
    filteredReviews = filteredReviews.filter(r => r.rating >= parseInt(minRating, 10));
  }
  if (verifiedOnly === 'true') {
    filteredReviews = filteredReviews.filter(r => r.verified_purchase);
  }

  // Paginate
  const result = paginate(filteredReviews, pagination, defaultSortFn);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { isbn } = await params;

  // Rate limiting
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // Authentication
  const auth = authenticateApiKey(request, API_NAME);
  if (!isApiKeyUser(auth)) return auth;

  await initializeBooksData();

  // Check if book exists
  const book = await booksStore.get(isbn);
  if (!book) {
    return notFound(`Book with ISBN ${isbn}`);
  }

  let body: Partial<Review>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  // Validate required fields
  if (!body.reviewer_name || !body.rating || !body.content) {
    return badRequest('Missing required fields: reviewer_name, rating, content');
  }

  if (body.rating < 1 || body.rating > 5) {
    return badRequest('Rating must be between 1 and 5');
  }

  const newReview: Review = {
    id: uuidv4(),
    book_isbn: isbn,
    reviewer_name: body.reviewer_name,
    rating: body.rating,
    title: body.title || '',
    content: body.content,
    verified_purchase: body.verified_purchase || false,
    helpful_votes: 0,
    created_at: new Date().toISOString(),
  };

  await reviewsStore.set(newReview);

  // Update book's average rating
  const allReviews = await getBookReviews(isbn);
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await booksStore.update(isbn, { rating: Math.round(avgRating * 10) / 10 });

  const response = NextResponse.json(newReview, { status: 201 });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
