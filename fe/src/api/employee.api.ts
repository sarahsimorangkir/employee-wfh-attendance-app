import { api } from './axios';
import { Employee, PaginatedResponse } from '../types';

export const employeeApi = {
  getAll: (params?: { search?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Employee>>('/employees', { params }),

  getById: (id: number) => api.get<Employee>(`/employees/${id}`),

  create: (data: {
    employeeCode: string;
    fullName: string;
    email: string;
    password: string;
    role: 'EMPLOYEE' | 'ADMIN';
    department?: string;
    position?: string;
  }) => api.post<Employee>('/employees', data),

  update: (
    id: number,
    data: {
      employeeCode?: string;
      fullName?: string;
      email?: string;
      role?: 'EMPLOYEE' | 'ADMIN';
      department?: string;
      position?: string;
      isActive?: boolean;
    },
  ) => api.patch<Employee>(`/employees/${id}`, data),

  deactivate: (id: number) => api.delete(`/employees/${id}`),
};
