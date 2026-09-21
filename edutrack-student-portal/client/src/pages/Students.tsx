import { useEffect, useMemo, useState } from 'react'
import { Edit3, Filter, Plus, Search, Trash2, Users } from 'lucide-react'
import { studentsApi } from '../services/api'
import type { Student } from '../types'
import Loading from '../components/Loading'
import StudentModal from '../components/StudentModal'

export default function Students() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All')
  const [year, setYear] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)

  const load = () => studentsApi.list().then(setStudents).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => students.filter(s => {
    const q = query.toLowerCase()
    const matchQ = [s.name, s.rollNo, s.email, s.department].some(v => v.toLowerCase().includes(q))
    return matchQ && (department === 'All' || s.department === department) && (year === 'All' || s.year === year)
  }), [students, query, department, year])

  const save = async (payload: Omit<Student, 'id'>) => {
    if (editing) await studentsApi.update(editing.id, payload)
    else await studentsApi.create(payload)
    await load(); setEditing(null)
  }

  const remove = async (student: Student) => {
    if (!window.confirm(`Delete ${student.name}?`)) return
    await studentsApi.remove(student.id); await load()
  }

  if (loading) return <Loading />

  return (
    <div className="stack-xl">
      <section className="page-heading"><div><h1>Students</h1><p>Search, filter, add and update student records.</p></div><button className="btn primary" onClick={() => { setEditing(null); setModalOpen(true) }}><Plus size={18}/> Add Student</button></section>
      <section className="card toolbar-card">
        <div className="big-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name, roll number, email or department..." /></div>
        <div className="toolbar-select"><Filter size={17}/><select value={department} onChange={e=>setDepartment(e.target.value)}><option>All</option><option>IT</option><option>CSE</option><option>ECE</option><option>Electrical</option><option>Mechanical</option></select></div>
        <select className="select" value={year} onChange={e=>setYear(e.target.value)}><option>All</option><option>First Year</option><option>Second Year</option><option>Third Year</option><option>Final Year</option></select>
      </section>
      <section className="card table-card">
        <div className="card-head"><div><span className="section-kicker">Directory</span><h3>{filtered.length} student{filtered.length !== 1 ? 's' : ''}</h3></div><Users size={20}/></div>
        <div className="table-scroll"><table><thead><tr><th>Student</th><th>Department</th><th>Year</th><th>Attendance</th><th>CGPA</th><th>Status</th><th></th></tr></thead><tbody>{filtered.map(s => {
          const risk = s.attendance < 75 || s.averageScore < 60 || s.pendingAssignments >= 3
          return <tr key={s.id}><td><div className="student-cell"><div className="mini-avatar">{s.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><strong>{s.name}</strong><span>{s.rollNo} · {s.email}</span></div></div></td><td>{s.department}</td><td>{s.year}</td><td><span className={s.attendance < 75 ? 'badge danger' : 'badge success'}>{s.attendance}%</span></td><td>{s.cgpa.toFixed(2)}</td><td><span className={risk ? 'badge warning' : 'badge neutral'}>{risk ? 'Needs Attention' : 'Active'}</span></td><td><div className="row-actions"><button className="icon-btn" onClick={()=>{setEditing(s);setModalOpen(true)}}><Edit3 size={16}/></button><button className="icon-btn danger-btn" onClick={()=>remove(s)}><Trash2 size={16}/></button></div></td></tr>
        })}</tbody></table></div>
        {!filtered.length && <div className="empty-state">No students match your filters.</div>}
      </section>
      <StudentModal open={modalOpen} onClose={()=>{setModalOpen(false);setEditing(null)}} onSave={save} student={editing}/>
    </div>
  )
}
