import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { unauthorized } from '../utils/errors';

// In-memory session store
const sessions = new Map<string, SessionData>();

export interface SessionData {
  id: string;
  userId: string;
  username: string;
  role: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface SessionUser {
  sessionId: string;
  userId: string;
  username: string;
  role: string;
}

const SESSION_COOKIE_NAME = 'apis_populi_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Demo users for session auth (school API)
export const sessionUsers = [
  { userId: 'school-user-1', username: 'teacher', password: 'teacher123', role: 'teacher' },
  { userId: 'school-user-2', username: 'principal', password: 'principal123', role: 'admin' },
  { userId: 'school-user-3', username: 'student', password: 'student123', role: 'student' },
];

export function createSession(userId: string, username: string, role: string): SessionData {
  const session: SessionData = {
    id: uuidv4(),
    userId,
    username,
    role,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
  };

  sessions.set(session.id, session);
  return session;
}

export function getSession(sessionId: string): SessionData | null {
  const session = sessions.get(sessionId);

  if (!session) return null;

  // Check if expired
  if (new Date() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

export function validateSessionCredentials(
  username: string,
  password: string
): { userId: string; username: string; role: string } | null {
  const user = sessionUsers.find(
    (u) => u.username === username && u.password === password
  );
  return user ? { userId: user.userId, username: user.username, role: user.role } : null;
}

export function getSessionIdFromCookie(request: NextRequest): string | null {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  return cookie?.value || null;
}

export function setSessionCookie(response: NextResponse, sessionId: string): NextResponse {
  response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_MS / 1000,
    path: '/',
  });
  return response;
}

export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

export function authenticateSession(
  request: NextRequest
): SessionUser | ReturnType<typeof unauthorized> {
  const sessionId = getSessionIdFromCookie(request);

  if (!sessionId) {
    return unauthorized('Session required. Please login at /school/auth/login');
  }

  const session = getSession(sessionId);

  if (!session) {
    return unauthorized('Session expired or invalid. Please login again');
  }

  return {
    sessionId: session.id,
    userId: session.userId,
    username: session.username,
    role: session.role,
  };
}

export function isSessionUser(result: unknown): result is SessionUser {
  return (
    typeof result === 'object' &&
    result !== null &&
    'sessionId' in result &&
    'userId' in result &&
    'username' in result
  );
}

// Cleanup expired sessions periodically
setInterval(() => {
  const now = new Date();
  for (const [id, session] of sessions) {
    if (now > session.expiresAt) {
      sessions.delete(id);
    }
  }
}, 300000); // Every 5 minutes
