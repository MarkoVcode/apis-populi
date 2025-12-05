import { createStore } from '../../db/store';
import { Student, Teacher, Subject, Class, Grade, Attendance } from './types';
import { students as seedStudents, teachers as seedTeachers, subjects as seedSubjects, classes as seedClasses, grades as seedGrades, attendance as seedAttendance } from './seed';

export const studentsStore = createStore<Student>('school', 'students');
export const teachersStore = createStore<Teacher>('school', 'teachers');
export const subjectsStore = createStore<Subject>('school', 'subjects');
export const classesStore = createStore<Class>('school', 'classes');
export const gradesStore = createStore<Grade>('school', 'grades');
export const attendanceStore = createStore<Attendance>('school', 'attendance');

let isInitialized = false;

export async function initializeSchoolData(): Promise<void> {
  if (isInitialized) return;

  const existingStudents = await studentsStore.getAll();
  if (existingStudents.length > 0) {
    isInitialized = true;
    return;
  }

  await Promise.all([
    studentsStore.setMany(seedStudents),
    teachersStore.setMany(seedTeachers),
    subjectsStore.setMany(seedSubjects),
    classesStore.setMany(seedClasses),
    gradesStore.setMany(seedGrades),
    attendanceStore.setMany(seedAttendance),
  ]);

  isInitialized = true;
}

export async function resetSchoolData(): Promise<void> {
  await Promise.all([
    studentsStore.clear(),
    teachersStore.clear(),
    subjectsStore.clear(),
    classesStore.clear(),
    gradesStore.clear(),
    attendanceStore.clear(),
  ]);

  isInitialized = false;
  await initializeSchoolData();
}

export async function getStudentGrades(studentId: string): Promise<Grade[]> {
  const allGrades = await gradesStore.getAll();
  return allGrades.filter(g => g.student_id === studentId);
}

export async function getStudentAttendance(studentId: string): Promise<Attendance[]> {
  const allAttendance = await attendanceStore.getAll();
  return allAttendance.filter(a => a.student_id === studentId);
}

export async function getClassGrades(classId: string): Promise<Grade[]> {
  const allGrades = await gradesStore.getAll();
  return allGrades.filter(g => g.class_id === classId);
}

export async function getClassRoster(classId: string): Promise<Student[]> {
  const classGrades = await getClassGrades(classId);
  const studentIds = [...new Set(classGrades.map(g => g.student_id))];
  const allStudents = await studentsStore.getAll();
  return allStudents.filter(s => studentIds.includes(s.id));
}

export async function getTeacherClasses(teacherId: string): Promise<Class[]> {
  const allClasses = await classesStore.getAll();
  return allClasses.filter(c => c.teacher_id === teacherId);
}

export async function calculateGPA(studentId: string): Promise<number> {
  const grades = await getStudentGrades(studentId);
  if (grades.length === 0) return 0;

  const gradePoints: Record<string, number> = {
    'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0,
  };

  const total = grades.reduce((sum, g) => sum + (gradePoints[g.grade_letter] || 0), 0);
  return Math.round((total / grades.length) * 100) / 100;
}

export async function getGPARankings(options: { term?: string; gradeLevel?: number }): Promise<Array<{ student: Student; gpa: number }>> {
  const allStudents = await studentsStore.getAll();
  let filteredStudents = allStudents.filter(s => s.status === 'active');

  if (options.gradeLevel) {
    filteredStudents = filteredStudents.filter(s => s.grade_level === options.gradeLevel);
  }

  const rankings = await Promise.all(
    filteredStudents.map(async student => ({
      student,
      gpa: await calculateGPA(student.id),
    }))
  );

  return rankings.sort((a, b) => b.gpa - a.gpa);
}

export async function getAttendanceSummary(studentId: string): Promise<{
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendance_rate: number;
}> {
  const attendance = await getStudentAttendance(studentId);

  const summary = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    excused: attendance.filter(a => a.status === 'excused').length,
    attendance_rate: 0,
  };

  summary.attendance_rate = summary.total > 0
    ? Math.round(((summary.present + summary.late + summary.excused) / summary.total) * 100)
    : 100;

  return summary;
}
