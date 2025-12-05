import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { notFound, badRequest } from '@/lib/utils/errors';
import { studentsStore, attendanceStore, getStudentAttendance, getAttendanceSummary, initializeSchoolData } from '@/lib/data/school/store';
import { Attendance } from '@/lib/data/school/types';
import { v4 as uuidv4 } from 'uuid';

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

  const student = await studentsStore.get(id);
  if (!student) {
    return notFound(`Student with ID ${id}`);
  }

  const searchParams = request.nextUrl.searchParams;

  // Return summary if requested
  if (searchParams.get('summary') === 'true') {
    const summary = await getAttendanceSummary(id);
    const response = NextResponse.json(summary);
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(API_NAME, clientId);
    return addRateLimitHeaders(response, rateLimit);
  }

  const pagination = parsePaginationParams(searchParams);
  let attendance = await getStudentAttendance(id);

  // Filter by class or status
  const classId = searchParams.get('class_id');
  const status = searchParams.get('status');

  if (classId) {
    attendance = attendance.filter(a => a.class_id === classId);
  }
  if (status) {
    attendance = attendance.filter(a => a.status === status);
  }

  const result = paginate(attendance, pagination, defaultSortFn);

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

  let body: Partial<Attendance>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (!body.class_id || !body.date || !body.status) {
    return badRequest('Missing required fields: class_id, date, status');
  }

  const validStatuses = ['present', 'absent', 'late', 'excused'];
  if (!validStatuses.includes(body.status)) {
    return badRequest(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const newAttendance: Attendance = {
    id: uuidv4(),
    student_id: id,
    class_id: body.class_id,
    date: body.date,
    status: body.status,
    notes: body.notes,
  };

  await attendanceStore.set(newAttendance);

  const response = NextResponse.json(newAttendance, { status: 201 });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
