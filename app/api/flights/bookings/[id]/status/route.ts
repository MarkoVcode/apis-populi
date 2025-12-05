import { NextRequest, NextResponse } from 'next/server';
import { authenticateJWT, isTokenPayload } from '@/lib/auth/jwt';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { getJob } from '@/lib/utils/async-jobs';
import { initializeFlightsData } from '@/lib/data/flights/store';

const API_NAME = 'flights';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateJWT(request);
  if (!isTokenPayload(auth)) return auth;

  await initializeFlightsData();

  const job = getJob(id);
  if (!job) {
    return notFound(`Job with ID ${id}`);
  }

  const response = NextResponse.json({
    job_id: job.id,
    status: job.status,
    progress: job.progress,
    eta_seconds: job.eta_seconds,
    created_at: job.created_at,
    updated_at: job.updated_at,
    ...(job.status === 'completed' && { result: job.result }),
    ...(job.status === 'failed' && { error: job.error }),
  });

  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
