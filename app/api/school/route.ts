import { NextResponse } from 'next/server';
import { initializeSchoolData } from '@/lib/data/school/store';

export async function GET() {
  await initializeSchoolData();

  return NextResponse.json({
    name: 'School API',
    version: '1.0.0',
    description: 'An education management API with students, teachers, classes, grades, and attendance tracking',
    authentication: {
      methods: ['Session Cookie', 'API Key'],
      session: {
        login: 'POST /api/school/auth/login',
        logout: 'POST /api/school/auth/logout',
        credentials: [
          { username: 'teacher', password: 'teacher123', role: 'teacher' },
          { username: 'principal', password: 'principal123', role: 'admin' },
          { username: 'student', password: 'student123', role: 'student' },
        ],
      },
      api_key: {
        header: 'X-API-Key',
        demo_keys: ['school-api-key-1', 'school-api-key-2', 'school-demo-key'],
      },
    },
    endpoints: {
      students: '/api/school/students',
      teachers: '/api/school/teachers',
      subjects: '/api/school/subjects',
      classes: '/api/school/classes',
      reports: '/api/school/reports',
      auth: '/api/school/auth',
      openapi: '/api/school/openapi.yaml',
      reset: '/api/school/reset',
    },
    rate_limit: {
      requests_per_minute: 80,
      burst: 15,
    },
  });
}
