import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { teachersStore, getTeacherClasses, initializeSchoolData } from '@/lib/data/school/store';

const API_NAME = 'school';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['session', 'apikey'],
    apiName: API_NAME,
  });
  if (!isAuthResult(auth)) return auth;

  await initializeSchoolData();

  const teacher = await teachersStore.get(id);
  if (!teacher) {
    return notFound(`Teacher with ID ${id}`);
  }

  const includeClasses = request.nextUrl.searchParams.get('include_classes') === 'true';

  let result: Record<string, unknown> = { ...teacher };
  if (includeClasses) {
    const classes = await getTeacherClasses(id);
    result.classes = classes;
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
