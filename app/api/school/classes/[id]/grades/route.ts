import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound } from '@/lib/utils/errors';
import { classesStore, getClassGrades, getClassRoster, initializeSchoolData } from '@/lib/data/school/store';

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

  const grades = await getClassGrades(id);
  const roster = await getClassRoster(id);

  // Calculate class statistics
  const gradeValues = grades.map(g => g.grade_value);
  const avgGrade = gradeValues.length > 0
    ? Math.round(gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length)
    : 0;

  const letterDistribution = grades.reduce((acc, g) => {
    acc[g.grade_letter] = (acc[g.grade_letter] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const response = NextResponse.json({
    class: classData,
    enrolled_students: roster.length,
    grades,
    statistics: {
      average_grade: avgGrade,
      highest_grade: gradeValues.length > 0 ? Math.max(...gradeValues) : 0,
      lowest_grade: gradeValues.length > 0 ? Math.min(...gradeValues) : 0,
      letter_distribution: letterDistribution,
    },
  });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
