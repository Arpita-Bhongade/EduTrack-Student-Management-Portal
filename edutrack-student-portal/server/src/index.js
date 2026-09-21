import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { v4 as uuid } from 'uuid'
import { readDb, writeDb } from './db.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'EduTrack API' }))

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  if (email === 'admin@edutrack.app' && password === 'admin123') {
    return res.json({
      token: 'edutrack-demo-token',
      user: { name: 'Admin Manager', email, role: 'Administrator' }
    })
  }
  return res.status(401).json({ message: 'Invalid credentials' })
})

app.get('/api/students', (_req, res) => {
  const db = readDb()
  res.json(db.students)
})

app.post('/api/students', (req, res) => {
  const db = readDb()
  const student = { id: uuid(), ...req.body }
  db.students.unshift(student)
  writeDb(db)
  res.status(201).json(student)
})

app.put('/api/students/:id', (req, res) => {
  const db = readDb()
  const index = db.students.findIndex(s => s.id === req.params.id)
  if (index === -1) return res.status(404).json({ message: 'Student not found' })
  db.students[index] = { ...db.students[index], ...req.body, id: db.students[index].id }
  writeDb(db)
  res.json(db.students[index])
})

app.delete('/api/students/:id', (req, res) => {
  const db = readDb()
  const before = db.students.length
  db.students = db.students.filter(s => s.id !== req.params.id)
  if (db.students.length === before) return res.status(404).json({ message: 'Student not found' })
  db.attendance = db.attendance.filter(r => r.studentId !== req.params.id)
  writeDb(db)
  res.json({ ok: true })
})

app.get('/api/attendance', (_req, res) => {
  res.json(readDb().attendance)
})

app.post('/api/attendance', (req, res) => {
  const { studentId, date, status } = req.body
  if (!studentId || !date || !['Present', 'Absent'].includes(status)) {
    return res.status(400).json({ message: 'studentId, date and valid status are required' })
  }
  const db = readDb()
  let record = db.attendance.find(r => r.studentId === studentId && r.date === date)
  if (record) {
    record.status = status
  } else {
    record = { id: uuid(), studentId, date, status }
    db.attendance.push(record)
  }
  writeDb(db)
  res.json(record)
})

app.get('/api/assignments', (_req, res) => {
  res.json(readDb().assignments)
})

app.post('/api/assignments', (req, res) => {
  const db = readDb()
  const assignment = { id: uuid(), ...req.body }
  db.assignments.unshift(assignment)
  writeDb(db)
  res.status(201).json(assignment)
})

app.patch('/api/assignments/:id/status', (req, res) => {
  const db = readDb()
  const item = db.assignments.find(a => a.id === req.params.id)
  if (!item) return res.status(404).json({ message: 'Assignment not found' })
  item.status = req.body.status
  writeDb(db)
  res.json(item)
})

app.get('/api/dashboard', (_req, res) => {
  const db = readDb()
  const students = db.students
  const today = new Date().toISOString().slice(0, 10)
  const todayRecords = db.attendance.filter(r => r.date === today)
  const presentToday = todayRecords.filter(r => r.status === 'Present').length
  const avgAttendance = students.length ? Math.round(students.reduce((sum, s) => sum + Number(s.attendance || 0), 0) / students.length) : 0
  const avgCgpa = students.length ? students.reduce((sum, s) => sum + Number(s.cgpa || 0), 0) / students.length : 0
  const warnings = students.filter(s => Number(s.attendance) < 75 || Number(s.averageScore) < 60 || Number(s.pendingAssignments) >= 3)

  res.json({
    totals: {
      students: students.length,
      presentToday,
      avgAttendance,
      avgCgpa
    },
    attendanceTrend: db.analytics.attendanceTrend,
    performanceTrend: db.analytics.performanceTrend,
    recentStudents: students.slice(0, 6),
    warnings
  })
})

app.listen(PORT, () => {
  console.log(`EduTrack API running at http://localhost:${PORT}`)
})
