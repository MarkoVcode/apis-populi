import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { badRequest } from '@/lib/utils/errors';
import { teachersStore, initializeSchoolData } from '@/lib/data/school/store';
import { Teacher } from '@/lib/data/school/types';
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

  let teachers = await teachersStore.getAll();

  const filters = parseFilters<Teacher>(searchParams, {
    equality: ['department', 'status'],
    search: ['first_name', 'last_name', 'email'],
  });

  teachers = applyFilters(teachers, filters);

  // Filter by subject if provided
  const subject = searchParams.get('subject');
  if (subject) {
    teachers = teachers.filter(t => t.subjects.some(s => s.toLowerCase().includes(subject.toLowerCase())));
  }

  const result = paginate(teachers, pagination, defaultSortFn);

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

  let body: Partial<Teacher>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (!body.first_name || !body.last_name || !body.email || !body.department) {
    return badRequest('Missing required fields: first_name, last_name, email, department');
  }

  const newTeacher: Teacher = {
    id: uuidv4(),
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    department: body.department,
    subjects: body.subjects || [],
    hire_date: body.hire_date || new Date().toISOString().split('T')[0],
    status: 'active',
    office_room: body.office_room || '',
    created_at: new Date().toISOString(),
  };

  await teachersStore.set(newTeacher);

  const response = NextResponse.json(newTeacher, { status: 201 });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
