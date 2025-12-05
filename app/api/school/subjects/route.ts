import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { subjectsStore, initializeSchoolData } from '@/lib/data/school/store';
import { Subject } from '@/lib/data/school/types';

const API_NAME = 'school';

export async function GET(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['session', 'apikey'],
    apiName: API_NAME,
  });
  if (!isAuthResult(auth)) return auth;

  await initializeSchoolData();

  const searchParams = request.nextUrl.searchParams;
  const pagination = parsePaginationParams(searchParams);

  let subjects = await subjectsStore.getAll();

  const filters = parseFilters<Subject>(searchParams, {
    equality: ['department'],
    search: ['name', 'code', 'description'],
    range: ['credits'],
  });

  subjects = applyFilters(subjects, filters);

  const result = paginate(subjects, pagination, defaultSortFn);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
