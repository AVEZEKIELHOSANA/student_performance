export type UserRole = 'student' | 'instructor' | 'admin';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface AdminUserCreatePayload {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AdminUserUpdatePayload {
  username?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
  password?: string;
}

export interface AdminStudent {
  id: string;
  user_id: string;
  username: string;
  email: string;
  student_id?: string;
  school_id?: string;
  school_name?: string;
  faculty_id?: string;
  faculty_name?: string;
  department_id?: string;
  department_name?: string;
  level?: number;
  assigned_instructor_id?: string;
  assigned_instructor_name?: string;
}

export interface AdminInstructor {
  id: string;
  user_id: string;
  username: string;
  email: string;
  school_id?: string;
  school_name?: string;
  faculty_id?: string;
  faculty_name?: string;
  department_id?: string;
  department_name?: string;
  assigned_student_count: number;
}

export interface Assignment {
  id: string;
  student_id: string;
  student_name: string;
  instructor_id: string;
  instructor_name: string;
  assigned_at: string;
}

export interface AdminDashboardStats {
  total_students: number;
  total_instructors: number;
  total_admins: number;
  assigned_students: number;
  unassigned_students: number;
}

export interface School {
  id: string;
  name: string;
  code: string;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  school_id: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  faculty_id: string;
}
