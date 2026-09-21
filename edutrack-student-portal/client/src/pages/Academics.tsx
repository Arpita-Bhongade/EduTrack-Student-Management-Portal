import { useEffect, useMemo, useState } from 'react'
import { Award, BookOpen, GraduationCap, TrendingUp } from 'lucide-react'
import { studentsApi } from '../services/api'
import type { Student } from '../types'
import Loading from '../components/Loading'

export default function Academics(){
  const [students,setStudents]=useState<Student[]>([]); const [loading,setLoading]=useState(true)
  useEffect(()=>{studentsApi.list().then(setStudents).finally(()=>setLoading(false))},[])
  const stats=useMemo(()=>({avg:students.length?students.reduce((a,b)=>a+b.averageScore,0)/students.length:0,cgpa:students.length?students.reduce((a,b)=>a+b.cgpa,0)/students.length:0,top:[...students].sort((a,b)=>b.cgpa-a.cgpa)[0]}),[students])
  if(loading)return <Loading/>
  return <div className="stack-xl"><section className="page-heading"><div><h1>Academic Performance</h1><p>Track scores, CGPA and student academic health.</p></div></section>
    <section className="stat-grid academic-stats"><div className="card stat-card"><div className="stat-icon"><TrendingUp size={21}/></div><div className="stat-copy"><span>Average Score</span><strong>{stats.avg.toFixed(1)}%</strong><small>Across all students</small></div></div><div className="card stat-card"><div className="stat-icon"><GraduationCap size={21}/></div><div className="stat-copy"><span>Average CGPA</span><strong>{stats.cgpa.toFixed(2)}</strong><small>Current overall</small></div></div><div className="card stat-card"><div className="stat-icon"><Award size={21}/></div><div className="stat-copy"><span>Top Performer</span><strong>{stats.top?.name||'—'}</strong><small>{stats.top?`${stats.top.cgpa.toFixed(2)} CGPA`:'No data'}</small></div></div><div className="card stat-card"><div className="stat-icon"><BookOpen size={21}/></div><div className="stat-copy"><span>Subjects</span><strong>6</strong><small>Current semester</small></div></div></section>
    <section className="card table-card"><div className="card-head"><div><span className="section-kicker">Performance register</span><h3>Student academic summary</h3></div></div><div className="table-scroll"><table><thead><tr><th>Student</th><th>Department</th><th>Average Score</th><th>CGPA</th><th>Pending Work</th><th>Academic Status</th></tr></thead><tbody>{students.map(s=><tr key={s.id}><td><div className="student-cell"><div className="mini-avatar">{s.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><strong>{s.name}</strong><span>{s.rollNo}</span></div></div></td><td>{s.department}</td><td>{s.averageScore}%</td><td>{s.cgpa.toFixed(2)}</td><td>{s.pendingAssignments}</td><td><span className={s.averageScore<60?'badge danger':s.averageScore<70?'badge warning':'badge success'}>{s.averageScore<60?'Needs Support':s.averageScore<70?'Watch':'Good'}</span></td></tr>)}</tbody></table></div></section>
  </div>
}
