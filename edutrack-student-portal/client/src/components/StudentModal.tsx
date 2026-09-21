import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { Student } from '../types'

const blank: Omit<Student, 'id'> = {
  rollNo: '', name: '', email: '', department: 'IT', year: 'Third Year', attendance: 85,
  cgpa: 8, averageScore: 75, pendingAssignments: 0, phone: ''
}

export default function StudentModal({ open, onClose, onSave, student }: {
  open: boolean
  onClose: () => void
  onSave: (student: Omit<Student, 'id'>) => Promise<void>
  student?: Student | null
}) {
  const [form, setForm] = useState<Omit<Student, 'id'>>(blank)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (student) {
      const { id: _id, ...rest } = student
      setForm(rest)
    } else setForm(blank)
  }, [student, open])

  if (!open) return null

  const change = (key: keyof Omit<Student, 'id'>, value: string | number) => setForm(v => ({ ...v, [key]: value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try { await onSave(form); onClose() } finally { setSaving(false) }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form className="modal-card" onSubmit={submit} onMouseDown={e => e.stopPropagation()}>
        <div className="modal-head"><div><div className="eyebrow">Student record</div><h3>{student ? 'Edit Student' : 'Add New Student'}</h3></div><button type="button" className="icon-btn" onClick={onClose}><X size={20} /></button></div>
        <div className="form-grid">
          <label>Full Name<input value={form.name} onChange={e => change('name', e.target.value)} required /></label>
          <label>Roll Number<input value={form.rollNo} onChange={e => change('rollNo', e.target.value)} required /></label>
          <label>Email<input type="email" value={form.email} onChange={e => change('email', e.target.value)} required /></label>
          <label>Phone<input value={form.phone || ''} onChange={e => change('phone', e.target.value)} /></label>
          <label>Department<select value={form.department} onChange={e => change('department', e.target.value)}><option>IT</option><option>CSE</option><option>ECE</option><option>Electrical</option><option>Mechanical</option></select></label>
          <label>Year<select value={form.year} onChange={e => change('year', e.target.value)}><option>First Year</option><option>Second Year</option><option>Third Year</option><option>Final Year</option></select></label>
          <label>Attendance %<input type="number" min="0" max="100" value={form.attendance} onChange={e => change('attendance', Number(e.target.value))} /></label>
          <label>CGPA<input type="number" min="0" max="10" step="0.01" value={form.cgpa} onChange={e => change('cgpa', Number(e.target.value))} /></label>
          <label>Average Score<input type="number" min="0" max="100" value={form.averageScore} onChange={e => change('averageScore', Number(e.target.value))} /></label>
          <label>Pending Assignments<input type="number" min="0" value={form.pendingAssignments} onChange={e => change('pendingAssignments', Number(e.target.value))} /></label>
        </div>
        <div className="modal-actions"><button type="button" className="btn secondary" onClick={onClose}>Cancel</button><button className="btn primary" disabled={saving}>{saving ? 'Saving...' : 'Save Student'}</button></div>
      </form>
    </div>
  )
}
