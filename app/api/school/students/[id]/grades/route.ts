import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { notFound, badRequest } from '@/lib/utils/errors';
import { studentsStore, gradesStore, getStudentGrades, initializeSchoolData } from '@/lib/data/school/store';
import { Grade } from '@/lib/data/school/types';
import { v4 as uuidv4 } from 'uuid';

const API_NAME = 'school';

interface RouteParams {
  params: Promise<{ id: string }>;
}

function gradeToLetter(grade: number): string {
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 70) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
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

  const student = await studentsStore.get(id);
  if (!student) {
    return notFound(`Student with ID ${id}`);
  }

  const searchParams = request.nextUrl.searchParams;
  const pagination = parsePaginationParams(searchParams);

  let grades = await getStudentGrades(id);

  // Filter by subject or term
  const subjectId = searchParams.get('subject_id');
  const term = searchParams.get('term');

  if (subjectId) {
    grades = grades.filter(g => g.subject_id === subjectId);
  }
  if (term) {
    grades = grades.filter(g => g.term === term);
  }

  const result = paginate(grades, pagination, defaultSortFn);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['session', 'apikey'],
    apiName: API_NAME,
  });
  if (!isAuthResult(auth)) return auth;

  await initializeSchoolData();

  const student = await studentsStore.get(id);
  if (!student) {
    return notFound(`Student with ID ${id}`);
  }

  let body: Partial<Grade>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (!body.class_id || !body.subject_id || !body.term || body.grade_value === undefined) {
    return badRequest('Missing required fields: class_id, subject_id, term, grade_value');
  }

  if (body.grade_value < 0 || body.grade_value > 100) {
    return badRequest('Grade value must be between 0 and 100');
  }

  const newGrade: Grade = {
    id: uuidv4(),
    student_id: id,
    class_id: body.class_id,
    subject_id: body.subject_id,
    term: body.term,
    year: body.year || new Date().getFullYear(),
    grade_value: body.grade_value,
    grade_letter: gradeToLetter(body.grade_value),
    created_at: new Date().toISOString(),
  };

  await gradesStore.set(newGrade);

  const response = NextResponse.json(newGrade, { status: 201 });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
