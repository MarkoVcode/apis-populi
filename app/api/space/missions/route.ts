import { NextRequest, NextResponse } from 'next/server';
import { authenticate, isAuthResult } from '@/lib/auth/middleware';
import { rateLimitMiddleware, addRateLimitHeaders, checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limiter';
import { parsePaginationParams, paginate, defaultSortFn } from '@/lib/utils/pagination';
import { parseFilters, applyFilters } from '@/lib/utils/filtering';
import { badRequest } from '@/lib/utils/errors';
import { missionsStore, initializeSpaceData } from '@/lib/data/space/store';
import { Mission } from '@/lib/data/space/types';
import { v4 as uuidv4 } from 'uuid';

const API_NAME = 'space';

export async function GET(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['jwt', 'basic'],
    allowedPrefix: 'space',
  });
  if (!isAuthResult(auth)) return auth;

  await initializeSpaceData();

  const searchParams = request.nextUrl.searchParams;
  const pagination = parsePaginationParams(searchParams);

  let missions = await missionsStore.getAll();

  const filters = parseFilters<Mission>(searchParams, {
    equality: ['agency', 'status', 'type'],
    multiValue: ['agency', 'status'],
    search: ['name', 'destination', 'description'],
    dateRange: ['launch_date'],
  });

  missions = applyFilters(missions, filters);

  const result = paginate(missions, pagination, defaultSortFn);

  const response = NextResponse.json(result);
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(API_NAME, request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticate(request, {
    methods: ['jwt', 'basic'],
    allowedPrefix: 'space',
  });
  if (!isAuthResult(auth)) return auth;

  await initializeSpaceData();

  let body: Partial<Mission>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (!body.name || !body.agency || !body.destination) {
    return badRequest('Missing required fields: name, agency, destination');
  }

  const newMission: Mission = {
    id: uuidv4(),
    name: body.name,
    agency: body.agency,
    type: body.type || 'robotic',
    status: 'planned',
    launch_date: body.launch_date || new Date().toISOString().split('T')[0],
    destination: body.destination,
    objectives: body.objectives || [],
    achievements: [],
    crew_count: body.crew_count,
    description: body.description || '',
  };

  await missionsStore.set(newMission);

  const response = NextResponse.json(newMission, { status: 201 });
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(API_NAME, clientId);
  return addRateLimitHeaders(response, rateLimit);
}
