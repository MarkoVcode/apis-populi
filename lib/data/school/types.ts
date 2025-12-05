export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  grade_level: number;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  gpa: number;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  subjects: string[];
  hire_date: string;
  status: 'active' | 'on_leave' | 'retired';
  office_room: string;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  credits: number;
  description: string;
  prerequisites: string[];
}

export interface Class {
  id: string;
  subject_id: string;
  teacher_id: string;
  name: string;
  semester: string;
  year: number;
  schedule: { day: string; start_time: string; end_time: string }[];
  room: string;
  capacity: number;
  enrolled_count: number;
}

export interface Grade {
  id: string;
  student_id: string;
  class_id: string;
  subject_id: string;
  term: string;
  year: number;
  grade_value: number;
  grade_letter: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}
