import { NextResponse } from 'next/server';
import { schemaSDL } from '@/lib/graphql/schema';

export async function GET() {
  return new NextResponse(schemaSDL, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
