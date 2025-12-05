import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { badRequest, conflict } from '@/lib/utils/errors';
import { studentsStore, initializeSchoolData } from '@/lib/data/school/store';
import { Student } from '@/lib/data/school/types';
import { v4 as uuidv4 } from 'uuid';

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

  let students = await studentsStore.getAll();

  const filters = parseFilters<Student>(searchParams, {
    equality: ['grade_level', 'status'],
    search: ['first_name', 'last_name', 'email'],
    range: ['gpa'],
  });

  students = applyFilters(students, filters);

  const result = paginate(students, pagination, defaultSortFn);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['session', 'apikey'],
    apiName: API_NAME,
  });
  if (!isAuthResult(auth)) return auth;

  await initializeSchoolData();

  let body: Partial<Student>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (!body.first_name || !body.last_name || !body.email) {
    return badRequest('Missing required fields: first_name, last_name, email');
  }

  // Check for duplicate email
  const existing = await studentsStore.getAll();
  if (existing.some(s => s.email === body.email)) {
    return conflict('Student with this email already exists');
  }

  const now = new Date().toISOString();
  const newStudent: Student = {
    id: uuidv4(),
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    date_of_birth: body.date_of_birth || '2005-01-01',
    grade_level: body.grade_level || 9,
    enrollment_date: body.enrollment_date || now.split('T')[0],
    status: 'active',
    gpa: 0,
    created_at: now,
    updated_at: now,
  };

  await studentsStore.set(newStudent);

  const response = NextResponse.json(newStudent, { status: 201 });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
