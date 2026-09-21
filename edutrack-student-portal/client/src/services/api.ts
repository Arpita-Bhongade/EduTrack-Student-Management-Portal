import axios from 'axios'
import type { Assignment, AttendanceRecord, DashboardData, Student } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 8000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edutrack_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    return data as { token: string; user: { name: string; email: string; role: string } }
  },
}

export const dashboardApi = {
  get: async () => (await api.get<DashboardData>('/dashboard')).data,
}

export const studentsApi = {
  list: async () => (await api.get<Student[]>('/students')).data,
  create: async (student: Omit<Student, 'id'>) => (await api.post<Student>('/students', student)).data,
  update: async (id: string, student: Partial<Student>) => (await api.put<Student>(`/students/${id}`, student)).data,
  remove: async (id: string) => (await api.delete(`/students/${id}`)).data,
}

export const attendanceApi = {
  list: async () => (await api.get<AttendanceRecord[]>('/attendance')).data,
  mark: async (studentId: string, date: string, status: 'Present' | 'Absent') =>
    (await api.post<AttendanceRecord>('/attendance', { studentId, date, status })).data,
}

export const assignmentsApi = {
  list: async () => (await api.get<Assignment[]>('/assignments')).data,
  create: async (assignment: Omit<Assignment, 'id'>) =>
    (await api.post<Assignment>('/assignments', assignment)).data,
  setStatus: async (id: string, status: 'Active' | 'Closed') =>
    (await api.patch<Assignment>(`/assignments/${id}/status`, { status })).data,
}
