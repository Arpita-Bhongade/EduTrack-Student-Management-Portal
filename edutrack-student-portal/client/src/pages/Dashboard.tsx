import { useEffect, useState } from 'react'
import { AlertTriangle, BookOpenCheck, GraduationCap, TrendingUp, UserCheck, Users } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { dashboardApi } from '../services/api'
import type { DashboardData } from '../types'
import StatCard from '../components/StatCard'
import Loading from '../components/Loading'

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { dashboardApi.get().then(setData).catch(() => setError('Could not load dashboard. Make sure the backend is running.')) }, [])
  if (!data && !error) return <Loading />
  if (error) return <div className="error-box">{error}</div>
  if (!data) return null

  return (
    <div className="stack-xl">
      <section className="page-heading"><div><h1>Good morning 👋</h1><p>Here’s what’s happening across your student community today.</p></div><div className="date-pill">Academic Year 2026–27</div></section>
      <section className="stat-grid">
        <StatCard title="Total Students" value={data.totals.students} subtitle="Active student records" icon={Users} />
        <StatCard title="Present Today" value={data.totals.presentToday} subtitle="Marked present today" icon={UserCheck} />
        <StatCard title="Avg. Attendance" value={`${data.totals.avgAttendance}%`} subtitle="Across all departments" icon={TrendingUp} />
        <StatCard title="Average CGPA" value={data.totals.avgCgpa.toFixed(2)} subtitle="Current academic average" icon={GraduationCap} />
      </section>
      <section className="grid-2">
        <div className="card chart-card"><div className="card-head"><div><span className="section-kicker">Attendance</span><h3>Weekly attendance trend</h3></div><UserCheck size={20} /></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.attendanceTrend}><defs><linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.28}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis domain={[60, 100]} /><Tooltip /><Area type="monotone" dataKey="attendance" stroke="#4f46e5" strokeWidth={3} fill="url(#attendanceFill)" /></AreaChart></ResponsiveContainer></div></div>
        <div className="card chart-card"><div className="card-head"><div><span className="section-kicker">Academics</span><h3>Average performance</h3></div><BookOpenCheck size={20} /></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.performanceTrend}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis domain={[0,100]} /><Tooltip /><Bar dataKey="score" fill="#16a34a" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div></div>
      </section>
      <section className="grid-dashboard-bottom">
        <div className="card table-card"><div className="card-head"><div><span className="section-kicker">Recently added</span><h3>Student directory</h3></div></div><div className="table-scroll"><table><thead><tr><th>Student</th><th>Department</th><th>Attendance</th><th>CGPA</th></tr></thead><tbody>{data.recentStudents.map(s => <tr key={s.id}><td><div className="student-cell"><div className="mini-avatar">{s.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><strong>{s.name}</strong><span>{s.rollNo}</span></div></div></td><td>{s.department}</td><td><span className={s.attendance < 75 ? 'badge danger' : 'badge success'}>{s.attendance}%</span></td><td>{s.cgpa.toFixed(2)}</td></tr>)}</tbody></table></div></div>
        <div className="card warning-card"><div className="card-head"><div><span className="section-kicker">Early Warning System</span><h3>Needs attention</h3></div><AlertTriangle size={20} /></div><div className="warning-list">{data.warnings.length ? data.warnings.slice(0,4).map(s => <div className="warning-item" key={s.id}><div className="warning-icon"><AlertTriangle size={17}/></div><div><strong>{s.name}</strong><p>{s.attendance < 75 ? `Attendance ${s.attendance}%` : s.pendingAssignments >= 3 ? `${s.pendingAssignments} pending assignments` : `Average score ${s.averageScore}%`}</p></div><span>{s.department}</span></div>) : <div className="empty-state">No students currently flagged.</div>}</div></div>
      </section>
    </div>
  )
}
