import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { notFound, badRequest } from '@/lib/utils/errors';
import { studentsStore, calculateGPA, initializeSchoolData } from '@/lib/data/school/store';
import { Student } from '@/lib/data/school/types';

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

  // Include calculated GPA
  const gpa = await calculateGPA(id);
  const result = { ...student, calculated_gpa: gpa };

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['session', 'apikey'],
    apiName: API_NAME,
  });
  if (!isAuthResult(auth)) return auth;

  await initializeSchoolData();

  const existing = await studentsStore.get(id);
  if (!existing) {
    return notFound(`Student with ID ${id}`);
  }

  let body: Partial<Student>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const updated: Student = {
    ...existing,
    ...body,
    id,
    updated_at: new Date().toISOString(),
  };

  await studentsStore.set(updated);

  const response = NextResponse.json(updated);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['session', 'apikey'],
    apiName: API_NAME,
  });
  if (!isAuthResult(auth)) return auth;

  await initializeSchoolData();

  const deleted = await studentsStore.delete(id);
  if (!deleted) {
    return notFound(`Student with ID ${id}`);
  }

  const response = new NextResponse(null, { status: 204 });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
