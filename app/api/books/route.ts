import { NextResponse } from 'next/server';
import { initializeBooksData } from '@/lib/data/books/store';

export async function GET() {
  await initializeBooksData();

  return NextResponse.json({
    name: 'Books API',
    version: '1.0.0',
    description: 'A comprehensive library management API with books, authors, publishers, genres, and reviews',
    authentication: {
      method: 'API Key',
      header: 'X-API-Key',
      query_param: 'api_key',
      demo_keys: ['books-api-key-1', 'books-api-key-2', 'books-demo-key'],
    },
    endpoints: {
      books: '/api/books/books',
      authors: '/api/books/authors',
      publishers: '/api/books/publishers',
      genres: '/api/books/genres',
      search: '/api/books/search',
      openapi: '/api/books/openapi.yaml',
      reset: '/api/books/reset',
    },
    rate_limit: {
      requests_per_minute: 100,
      burst: 20,
    },
  });
}
