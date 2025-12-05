import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { subjectsStore, classesStore, initializeSchoolData } from '@/lib/data/school/store';

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

  const subject = await subjectsStore.get(id);
  if (!subject) {
    return notFound(`Subject with ID ${id}`);
  }

  // Include classes for this subject
  const includeClasses = request.nextUrl.searchParams.get('include_classes') === 'true';

  let result: Record<string, unknown> = { ...subject };
  if (includeClasses) {
    const allClasses = await classesStore.getAll();
    result.classes = allClasses.filter(c => c.subject_id === id);
  }

  // Get prerequisite details
  if (subject.prerequisites.length > 0) {
    const allSubjects = await subjectsStore.getAll();
    result.prerequisite_details = allSubjects.filter(s =>
      subject.prerequisites.includes(s.code)
    );
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
