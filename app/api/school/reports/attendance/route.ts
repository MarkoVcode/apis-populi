import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { studentsStore, getAttendanceSummary, initializeSchoolData } from '@/lib/data/school/store';

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
  const gradeLevel = searchParams.get('grade_level');
  const threshold = parseInt(searchParams.get('threshold') || '90', 10);

  let students = await studentsStore.getAll();
  students = students.filter(s => s.status === 'active');

  if (gradeLevel) {
    students = students.filter(s => s.grade_level === parseInt(gradeLevel, 10));
  }

  // Get attendance summaries for students (limited to first 50 for performance)
  const summaries = await Promise.all(
    students.slice(0, 50).map(async student => {
      const summary = await getAttendanceSummary(student.id);
      return {
        student,
        ...summary,
        meets_threshold: summary.attendance_rate >= threshold,
      };
    })
  );

  // Calculate overall statistics
  const avgRate = summaries.length > 0
    ? Math.round(summaries.reduce((sum, s) => sum + s.attendance_rate, 0) / summaries.length)
    : 100;

  const response = NextResponse.json({
    threshold,
    overall_average_rate: avgRate,
    students_meeting_threshold: summaries.filter(s => s.meets_threshold).length,
    students_below_threshold: summaries.filter(s => !s.meets_threshold).length,
    details: summaries.sort((a, b) => a.attendance_rate - b.attendance_rate),
  });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
