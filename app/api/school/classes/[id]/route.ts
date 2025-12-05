import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { classesStore, teachersStore, subjectsStore, getClassRoster, initializeSchoolData } from '@/lib/data/school/store';

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

  const classData = await classesStore.get(id);
  if (!classData) {
    return notFound(`Class with ID ${id}`);
  }

  const searchParams = request.nextUrl.searchParams;
  const includeRoster = searchParams.get('include_roster') === 'true';
  const includeTeacher = searchParams.get('include_teacher') === 'true';
  const includeSubject = searchParams.get('include_subject') === 'true';

  let result: Record<string, unknown> = { ...classData };

  if (includeRoster) {
    const roster = await getClassRoster(id);
    result.roster = roster;
  }

  if (includeTeacher) {
    const teacher = await teachersStore.get(classData.teacher_id);
    result.teacher = teacher;
  }

  if (includeSubject) {
    const subject = await subjectsStore.get(classData.subject_id);
    result.subject = subject;
  }

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
