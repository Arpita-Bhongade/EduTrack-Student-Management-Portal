export type StudentStatus = 'Active' | 'Needs Attention'

export interface Student {
  id: string
  rollNo: string
  name: string
  email: string
  department: string
  year: string
  attendance: number
  cgpa: number
  averageScore: number
  pendingAssignments: number
  phone?: string
  status?: StudentStatus
}

export interface AttendanceRecord {
  id: string
  studentId: string
  date: string
  status: 'Present' | 'Absent'
}

export interface Assignment {
  id: string
  title: string
  subject: string
  dueDate: string
  totalStudents: number
  submitted: number
  status: 'Active' | 'Closed'
}

export interface DashboardData {
  totals: {
    students: number
    presentToday: number
    avgAttendance: number
    avgCgpa: number
  }
  attendanceTrend: Array<{ name: string; attendance: number }>
  performanceTrend: Array<{ name: string; score: number }>
  recentStudents: Student[]
  warnings: Student[]
}
