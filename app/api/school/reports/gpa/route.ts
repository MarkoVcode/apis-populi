import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate } from '@/lib/utils/pagination';
import { getGPARankings, initializeSchoolData } from '@/lib/data/school/store';

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

  const gradeLevel = searchParams.get('grade_level');
  const term = searchParams.get('term');

  const rankings = await getGPARankings({
    gradeLevel: gradeLevel ? parseInt(gradeLevel, 10) : undefined,
    term: term || undefined,
  });

  // Add rank to each entry
  const rankedData = rankings.map((entry, index) => ({
    rank: index + 1,
    student: entry.student,
    gpa: entry.gpa,
  }));

  const result = paginate(rankedData, pagination);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
