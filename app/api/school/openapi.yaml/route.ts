import { NextResponse } from 'next/server';

const openApiSpec = `openapi: 3.0.3
info:
  title: School API
  description: Education management API with students, teachers, classes, grades, and attendance. Session-based authentication.
  version: 1.0.0
  contact:
    name: APIs Populi
    url: https://github.com/MarkoVcode/apis-populi
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: /api/school
    description: School API

security:
  - SessionCookie: []
  - ApiKey: []

paths:
  /auth/login:
    post:
      summary: Login and get session cookie
      operationId: login
      tags: [Authentication]
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, password]
              properties:
                username:
                  type: string
                  example: admin
                password:
                  type: string
                  example: school123
      responses:
        '200':
          description: Login successful
          headers:
            Set-Cookie:
              schema:
                type: string
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  user:
                    type: object
                    properties:
                      username:
                        type: string
                      role:
                        type: string
        '401':
          $ref: '#/components/responses/Unauthorized'

  /auth/logout:
    post:
      summary: Logout and invalidate session
      operationId: logout
      tags: [Authentication]
      responses:
        '200':
          description: Logout successful

  /students:
    get:
      summary: List students
      operationId: listStudents
      tags: [Students]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: grade_level
          in: query
          schema:
            type: integer
        - name: q
          in: query
          schema:
            type: string
      responses:
        '200':
          description: List of students
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedStudents'
    post:
      summary: Enroll new student
      operationId: enrollStudent
      tags: [Students]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/StudentCreate'
      responses:
        '201':
          description: Student enrolled
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Student'

  /students/{id}:
    get:
      summary: Get student profile
      operationId: getStudent
      tags: [Students]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Student details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Student'
        '404':
          $ref: '#/components/responses/NotFound'
    put:
      summary: Update student
      operationId: updateStudent
      tags: [Students]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/StudentUpdate'
      responses:
        '200':
          description: Student updated
    delete:
      summary: Remove student
      operationId: deleteStudent
      tags: [Students]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: Student removed

  /students/{id}/grades:
    get:
      summary: Get student grades
      operationId: getStudentGrades
      tags: [Grades]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
        - name: subject_id
          in: query
          schema:
            type: string
        - name: term
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Student grades
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedGrades'
    post:
      summary: Add grade
      operationId: addGrade
      tags: [Grades]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GradeCreate'
      responses:
        '201':
          description: Grade added

  /students/{id}/attendance:
    get:
      summary: Get attendance records
      operationId: getStudentAttendance
      tags: [Attendance]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
        - name: from
          in: query
          schema:
            type: string
            format: date
        - name: to
          in: query
          schema:
            type: string
            format: date
      responses:
        '200':
          description: Attendance records
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedAttendance'
    post:
      summary: Record attendance
      operationId: recordAttendance
      tags: [Attendance]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AttendanceCreate'
      responses:
        '201':
          description: Attendance recorded

  /teachers:
    get:
      summary: List teachers
      operationId: listTeachers
      tags: [Teachers]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: subject_id
          in: query
          schema:
            type: string
        - name: department
          in: query
          schema:
            type: string
      responses:
        '200':
          description: List of teachers
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedTeachers'
    post:
      summary: Add teacher
      operationId: addTeacher
      tags: [Teachers]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TeacherCreate'
      responses:
        '201':
          description: Teacher added

  /teachers/{id}:
    get:
      summary: Get teacher profile
      operationId: getTeacher
      tags: [Teachers]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Teacher details with classes
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Teacher'

  /subjects:
    get:
      summary: List subjects
      operationId: listSubjects
      tags: [Subjects]
      responses:
        '200':
          description: List of subjects
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Subject'

  /subjects/{id}:
    get:
      summary: Get subject details
      operationId: getSubject
      tags: [Subjects]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Subject with curriculum
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Subject'

  /classes:
    get:
      summary: List classes
      operationId: listClasses
      tags: [Classes]
      parameters:
        - name: subject_id
          in: query
          schema:
            type: string
        - name: teacher_id
          in: query
          schema:
            type: string
        - name: grade_level
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: List of classes
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedClasses'

  /classes/{id}:
    get:
      summary: Get class details
      operationId: getClass
      tags: [Classes]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
        - name: include_roster
          in: query
          schema:
            type: boolean
      responses:
        '200':
          description: Class details with roster
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Class'

  /classes/{id}/grades:
    get:
      summary: Class grade report
      operationId: getClassGrades
      tags: [Classes]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Grade report for class
          content:
            application/json:
              schema:
                type: object
                properties:
                  class_id:
                    type: string
                  grades:
                    type: array
                    items:
                      type: object

  /reports/gpa:
    get:
      summary: GPA rankings
      operationId: getGPARankings
      tags: [Reports]
      parameters:
        - name: term
          in: query
          schema:
            type: string
        - name: grade_level
          in: query
          schema:
            type: integer
        - $ref: '#/components/parameters/limit'
      responses:
        '200':
          description: GPA rankings
          content:
            application/json:
              schema:
                type: object
                properties:
                  rankings:
                    type: array
                    items:
                      type: object
                      properties:
                        student_id:
                          type: string
                        student_name:
                          type: string
                        gpa:
                          type: number
                        rank:
                          type: integer

  /reports/attendance:
    get:
      summary: Attendance summary
      operationId: getAttendanceSummary
      tags: [Reports]
      parameters:
        - name: from
          in: query
          schema:
            type: string
            format: date
        - name: to
          in: query
          schema:
            type: string
            format: date
        - name: grade_level
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Attendance summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  period:
                    type: object
                  summary:
                    type: object

  /reset:
    post:
      summary: Reset all data
      operationId: resetData
      tags: [Admin]
      responses:
        '200':
          description: Data reset successful

components:
  securitySchemes:
    SessionCookie:
      type: apiKey
      in: cookie
      name: school_session
    ApiKey:
      type: apiKey
      in: header
      name: X-API-Key

  parameters:
    page:
      name: page
      in: query
      schema:
        type: integer
        default: 1
    limit:
      name: limit
      in: query
      schema:
        type: integer
        default: 20

  responses:
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    NotFound:
      description: Not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

  schemas:
    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string

    Student:
      type: object
      properties:
        id:
          type: string
        student_id:
          type: string
        first_name:
          type: string
        last_name:
          type: string
        email:
          type: string
        date_of_birth:
          type: string
        grade_level:
          type: integer
        enrollment_date:
          type: string
        status:
          type: string

    StudentCreate:
      type: object
      required: [first_name, last_name, date_of_birth, grade_level]
      properties:
        first_name:
          type: string
        last_name:
          type: string
        email:
          type: string
        date_of_birth:
          type: string
        grade_level:
          type: integer

    StudentUpdate:
      type: object
      properties:
        first_name:
          type: string
        last_name:
          type: string
        email:
          type: string
        grade_level:
          type: integer
        status:
          type: string

    PaginatedStudents:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Student'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Teacher:
      type: object
      properties:
        id:
          type: string
        employee_id:
          type: string
        first_name:
          type: string
        last_name:
          type: string
        email:
          type: string
        department:
          type: string
        subjects:
          type: array
          items:
            type: string
        hire_date:
          type: string

    TeacherCreate:
      type: object
      required: [first_name, last_name, email, department]
      properties:
        first_name:
          type: string
        last_name:
          type: string
        email:
          type: string
        department:
          type: string
        subjects:
          type: array
          items:
            type: string

    PaginatedTeachers:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Teacher'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Subject:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        code:
          type: string
        department:
          type: string
        credits:
          type: integer
        description:
          type: string

    Class:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        subject_id:
          type: string
        teacher_id:
          type: string
        room:
          type: string
        schedule:
          type: object
        grade_level:
          type: integer
        max_students:
          type: integer
        enrolled_count:
          type: integer

    PaginatedClasses:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Class'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Grade:
      type: object
      properties:
        id:
          type: string
        student_id:
          type: string
        subject_id:
          type: string
        class_id:
          type: string
        grade:
          type: string
        score:
          type: number
        term:
          type: string
        assignment_type:
          type: string
        created_at:
          type: string

    GradeCreate:
      type: object
      required: [subject_id, grade, score, term]
      properties:
        subject_id:
          type: string
        class_id:
          type: string
        grade:
          type: string
        score:
          type: number
        term:
          type: string
        assignment_type:
          type: string

    PaginatedGrades:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Grade'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Attendance:
      type: object
      properties:
        id:
          type: string
        student_id:
          type: string
        class_id:
          type: string
        date:
          type: string
        status:
          type: string
          enum: [present, absent, late, excused]
        notes:
          type: string

    AttendanceCreate:
      type: object
      required: [class_id, date, status]
      properties:
        class_id:
          type: string
        date:
          type: string
        status:
          type: string
          enum: [present, absent, late, excused]
        notes:
          type: string

    PaginatedAttendance:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Attendance'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        pages:
          type: integer
        has_next:
          type: boolean
        has_prev:
          type: boolean
`;

export async function GET() {
  return new NextResponse(openApiSpec, {
    headers: {
      'Content-Type': 'text/yaml',
    },
  });
}
