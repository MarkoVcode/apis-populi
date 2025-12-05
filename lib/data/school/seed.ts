import { Student, Teacher, Subject, Class, Grade, Attendance } from './types';

const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(startYear: number, endYear: number): string {
  const year = startYear + Math.floor(Math.random() * (endYear - startYear));
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function gradeToLetter(grade: number): string {
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 70) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
}

export const subjects: Subject[] = [
  { id: 'subj-math101', name: 'Algebra I', code: 'MATH101', department: 'Mathematics', credits: 4, description: 'Introduction to algebraic concepts and equations.', prerequisites: [] },
  { id: 'subj-math201', name: 'Algebra II', code: 'MATH201', department: 'Mathematics', credits: 4, description: 'Advanced algebraic concepts and functions.', prerequisites: ['MATH101'] },
  { id: 'subj-math301', name: 'Calculus I', code: 'MATH301', department: 'Mathematics', credits: 4, description: 'Introduction to differential calculus.', prerequisites: ['MATH201'] },
  { id: 'subj-math302', name: 'Calculus II', code: 'MATH302', department: 'Mathematics', credits: 4, description: 'Integral calculus and series.', prerequisites: ['MATH301'] },
  { id: 'subj-phys101', name: 'Physics I', code: 'PHYS101', department: 'Science', credits: 4, description: 'Mechanics and thermodynamics.', prerequisites: ['MATH101'] },
  { id: 'subj-phys201', name: 'Physics II', code: 'PHYS201', department: 'Science', credits: 4, description: 'Electricity, magnetism, and optics.', prerequisites: ['PHYS101'] },
  { id: 'subj-chem101', name: 'Chemistry I', code: 'CHEM101', department: 'Science', credits: 4, description: 'Introduction to chemical principles.', prerequisites: [] },
  { id: 'subj-chem201', name: 'Chemistry II', code: 'CHEM201', department: 'Science', credits: 4, description: 'Organic chemistry fundamentals.', prerequisites: ['CHEM101'] },
  { id: 'subj-bio101', name: 'Biology I', code: 'BIO101', department: 'Science', credits: 4, description: 'Introduction to biological systems.', prerequisites: [] },
  { id: 'subj-bio201', name: 'Biology II', code: 'BIO201', department: 'Science', credits: 4, description: 'Cellular biology and genetics.', prerequisites: ['BIO101'] },
  { id: 'subj-eng101', name: 'English Composition', code: 'ENG101', department: 'English', credits: 3, description: 'Writing and composition skills.', prerequisites: [] },
  { id: 'subj-eng201', name: 'American Literature', code: 'ENG201', department: 'English', credits: 3, description: 'Survey of American literary works.', prerequisites: ['ENG101'] },
  { id: 'subj-eng301', name: 'British Literature', code: 'ENG301', department: 'English', credits: 3, description: 'Survey of British literary works.', prerequisites: ['ENG101'] },
  { id: 'subj-hist101', name: 'World History I', code: 'HIST101', department: 'Social Studies', credits: 3, description: 'Ancient civilizations to the Renaissance.', prerequisites: [] },
  { id: 'subj-hist201', name: 'World History II', code: 'HIST201', department: 'Social Studies', credits: 3, description: 'Modern history from 1500 to present.', prerequisites: ['HIST101'] },
  { id: 'subj-hist301', name: 'US History', code: 'HIST301', department: 'Social Studies', credits: 3, description: 'American history from colonization to present.', prerequisites: [] },
  { id: 'subj-cs101', name: 'Computer Science I', code: 'CS101', department: 'Technology', credits: 3, description: 'Introduction to programming concepts.', prerequisites: [] },
  { id: 'subj-cs201', name: 'Computer Science II', code: 'CS201', department: 'Technology', credits: 3, description: 'Data structures and algorithms.', prerequisites: ['CS101'] },
  { id: 'subj-art101', name: 'Art Fundamentals', code: 'ART101', department: 'Arts', credits: 2, description: 'Basic principles of visual arts.', prerequisites: [] },
  { id: 'subj-mus101', name: 'Music Theory', code: 'MUS101', department: 'Arts', credits: 2, description: 'Fundamentals of music theory.', prerequisites: [] },
];

const departments = ['Mathematics', 'Science', 'English', 'Social Studies', 'Technology', 'Arts', 'Physical Education'];

export const teachers: Teacher[] = [];
for (let i = 0; i < 50; i++) {
  const dept = departments[i % departments.length];
  const subjectsForDept = subjects.filter(s => s.department === dept).map(s => s.name);
  teachers.push({
    id: `teacher-${i + 1}`,
    first_name: randomFrom(firstNames),
    last_name: randomFrom(lastNames),
    email: `teacher${i + 1}@school.edu`,
    department: dept,
    subjects: subjectsForDept.slice(0, Math.min(3, subjectsForDept.length)),
    hire_date: randomDate(2000, 2023),
    status: Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'on_leave' : 'retired'),
    office_room: `${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}${100 + Math.floor(Math.random() * 50)}`,
    created_at: '2024-01-01T00:00:00Z',
  });
}

export const students: Student[] = [];
for (let i = 0; i < 200; i++) {
  const gradeLevel = 9 + Math.floor(Math.random() * 4); // 9-12
  const gpa = 1.5 + Math.random() * 2.5; // 1.5 - 4.0
  students.push({
    id: `student-${i + 1}`,
    first_name: randomFrom(firstNames),
    last_name: randomFrom(lastNames),
    email: `student${i + 1}@school.edu`,
    date_of_birth: randomDate(2005, 2010),
    grade_level: gradeLevel,
    enrollment_date: randomDate(2020, 2024),
    status: Math.random() > 0.05 ? 'active' : randomFrom(['inactive', 'graduated', 'transferred']),
    gpa: Math.round(gpa * 100) / 100,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  });
}

export const classes: Class[] = [];
const semesters = ['Fall 2024', 'Spring 2024', 'Fall 2023'];
const days = ['Monday', 'Wednesday', 'Friday'];
const times = [
  { start: '08:00', end: '09:30' },
  { start: '10:00', end: '11:30' },
  { start: '13:00', end: '14:30' },
  { start: '15:00', end: '16:30' },
];

for (let i = 0; i < 40; i++) {
  const subject = subjects[i % subjects.length];
  const teacher = teachers.find(t => t.department === subject.department) || teachers[0];
  const semester = semesters[Math.floor(i / 14) % semesters.length];
  const year = semester.includes('2024') ? 2024 : 2023;
  const timeSlot = times[i % times.length];

  classes.push({
    id: `class-${i + 1}`,
    subject_id: subject.id,
    teacher_id: teacher.id,
    name: `${subject.name} - Section ${(i % 3) + 1}`,
    semester: semester.split(' ')[0],
    year,
    schedule: days.slice(0, 2 + (i % 2)).map(day => ({
      day,
      start_time: timeSlot.start,
      end_time: timeSlot.end,
    })),
    room: `${['Main', 'Science', 'Arts'][Math.floor(Math.random() * 3)]} ${100 + Math.floor(Math.random() * 50)}`,
    capacity: 30,
    enrolled_count: 15 + Math.floor(Math.random() * 15),
  });
}

export const grades: Grade[] = [];
const terms = ['Midterm', 'Final', 'Quiz 1', 'Quiz 2', 'Project'];
students.forEach(student => {
  // Each student has grades in 4-6 classes
  const numClasses = 4 + Math.floor(Math.random() * 3);
  const studentClasses = classes.slice(0, numClasses);

  studentClasses.forEach(cls => {
    terms.forEach(term => {
      const gradeValue = 50 + Math.floor(Math.random() * 50);
      grades.push({
        id: `grade-${student.id}-${cls.id}-${term}`.replace(/\s/g, '-'),
        student_id: student.id,
        class_id: cls.id,
        subject_id: cls.subject_id,
        term,
        year: cls.year,
        grade_value: gradeValue,
        grade_letter: gradeToLetter(gradeValue),
        created_at: '2024-01-01T00:00:00Z',
      });
    });
  });
});

export const attendance: Attendance[] = [];
const attendanceStatuses: Attendance['status'][] = ['present', 'present', 'present', 'present', 'absent', 'late', 'excused'];
students.slice(0, 50).forEach(student => {
  const studentClasses = classes.slice(0, 3);
  studentClasses.forEach(cls => {
    // Generate attendance for last 20 school days
    for (let day = 0; day < 20; day++) {
      const date = new Date(2024, 10 - Math.floor(day / 5), 1 + (day % 28));
      attendance.push({
        id: `attendance-${student.id}-${cls.id}-${day}`,
        student_id: student.id,
        class_id: cls.id,
        date: date.toISOString().split('T')[0],
        status: randomFrom(attendanceStatuses),
      });
    }
  });
});
