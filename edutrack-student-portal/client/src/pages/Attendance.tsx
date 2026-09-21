import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, Search, XCircle } from 'lucide-react'
import { attendanceApi, studentsApi } from '../services/api'
import type { Student } from '../types'
import Loading from '../components/Loading'

export default function Attendance() {
  const [students, setStudents] = useState<Student[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const today = new Date().toISOString().slice(0,10)
  const [marked, setMarked] = useState<Record<string,'Present'|'Absent'>>({})

  useEffect(()=>{ Promise.all([studentsApi.list(), attendanceApi.list()]).then(([s,a])=>{
    setStudents(s)
    const map: Record<string,'Present'|'Absent'> = {}
    a.filter(r=>r.date===today).forEach(r=>map[r.studentId]=r.status)
    setMarked(map)
  }).finally(()=>setLoading(false)) },[today])

  const filtered = useMemo(()=>students.filter(s=>`${s.name} ${s.rollNo}`.toLowerCase().includes(query.toLowerCase())),[students,query])
  const mark = async (id:string,status:'Present'|'Absent') => { await attendanceApi.mark(id,today,status); setMarked(m=>({...m,[id]:status})) }
  const present = Object.values(marked).filter(v=>v==='Present').length
  if (loading) return <Loading />

  return <div className="stack-xl">
    <section className="page-heading"><div><h1>Daily Attendance</h1><p>Mark attendance for {new Date().toLocaleDateString(undefined,{dateStyle:'long'})}.</p></div><div className="date-pill"><CalendarDays size={17}/> {present} Present</div></section>
    <section className="card toolbar-card"><div className="big-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search student..."/></div></section>
    <section className="card table-card"><div className="table-scroll"><table><thead><tr><th>Student</th><th>Department</th><th>Attendance %</th><th>Today's Status</th><th>Mark</th></tr></thead><tbody>{filtered.map(s=><tr key={s.id}><td><div className="student-cell"><div className="mini-avatar">{s.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><strong>{s.name}</strong><span>{s.rollNo}</span></div></div></td><td>{s.department}</td><td>{s.attendance}%</td><td><span className={marked[s.id]==='Present'?'badge success':marked[s.id]==='Absent'?'badge danger':'badge neutral'}>{marked[s.id]||'Not Marked'}</span></td><td><div className="row-actions"><button className="btn compact success-btn" onClick={()=>mark(s.id,'Present')}><CheckCircle2 size={16}/>Present</button><button className="btn compact danger-soft" onClick={()=>mark(s.id,'Absent')}><XCircle size={16}/>Absent</button></div></td></tr>)}</tbody></table></div></section>
  </div>
}
