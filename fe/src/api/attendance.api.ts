import { api } from './axios';
import { Attendance, PaginatedResponse } from '../types';

export const attendanceApi = {
  checkIn: (formData: FormData) =>
    api.post<Attendance>('/attendances', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getMyHistory: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Attendance>>('/attendances/me', { params }),

  getAll: (params?: {
    employeeId?: number;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) => api.get<PaginatedResponse<Attendance>>('/attendances', { params }),

  getById: (id: number) => api.get<Attendance>(`/attendances/${id}`),
};
