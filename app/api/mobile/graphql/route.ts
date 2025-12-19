import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { NextRequest, NextResponse } from 'next/server';
import { typeDefs } from '@/lib/graphql/schema';
import { resolvers } from '@/lib/graphql/resolvers';
import { createContext, GraphQLContext } from '@/lib/graphql/context';
import { rateLimitMiddleware, checkRateLimit, getClientIdentifier, addRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { MOBILE_API_KEYS } from '@/lib/data/mobile/types';

const API_NAME = 'mobile';

// Create GraphQL schema using makeExecutableSchema for better type compatibility
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create Yoga instance with Next.js App Router compatibility
const yoga = createYoga<GraphQLContext>({
  schema,
  context: createContext,
  graphqlEndpoint: '/api/mobile/graphql',
  fetchAPI: { Response },
  // Enable GraphiQL in development
  graphiql: process.env.NODE_ENV === 'development',
});

// Validate API key
function validateApiKey(request: NextRequest): string | null {
  const apiKey = request.headers.get('x-api-key') ||
    request.nextUrl.searchParams.get('api_key');

  if (!apiKey) return null;
  if (!MOBILE_API_KEYS.includes(apiKey)) return null;

  return apiKey;
}

// Handler function
async function handler(request: NextRequest) {
  // Rate limit check
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  // API Key authentication check
  const apiKey = validateApiKey(request);

  if (!apiKey) {
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(API_NAME, clientId);

    const errorResponse = NextResponse.json(
      {
        errors: [
          {
            message: 'API key required (X-API-Key header or api_key query parameter)',
            extensions: {
              code: 'UNAUTHENTICATED',
              demo_keys: MOBILE_API_KEYS,
            },
          },
        ],
      },
      { status: 401 }
    );

    return addRateLimitHeaders(errorResponse, rateLimit);
  }

  // Pass to graphql-yoga
  const response = await yoga.fetch(request);

  // Add rate limit headers to successful response
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);

  // Clone response and add headers
  const newResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  return addRateLimitHeaders(newResponse, rateLimit);
}

export { handler as GET, handler as POST };
