export type Role = 'EMPLOYEE' | 'ADMIN';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface Employee {
  id: number;
  employeeCode: string;
  fullName: string;
  email: string;
  role: Role;
  department?: string;
  position?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Attendance {
  id: number;
  employee: Pick<Employee, 'id' | 'fullName' | 'employeeCode'>;
  attendanceDate: string;
  checkInTime: string;
  photoUrl: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
