// GraphQL Context for Mobile CMS API

import { NextRequest } from 'next/server';
import { initializeMobileData } from '../data/mobile/store';

export interface GraphQLContext {
  request: NextRequest;
  apiKey: string;
  clientId: string;
}

export async function createContext({
  request,
}: {
  request: NextRequest;
}): Promise<GraphQLContext> {
  // Ensure data is initialized
  await initializeMobileData();

  // Extract API key from header or query param
  const apiKey =
    request.headers.get('x-api-key') ||
    new URL(request.url).searchParams.get('api_key') ||
    '';

  // Get client identifier for rate limiting or client-specific logic
  const forwarded = request.headers.get('x-forwarded-for');
  const clientId = forwarded?.split(',')[0]?.trim() || 'anonymous';

  return {
    request,
    apiKey,
    clientId,
  };
}
