import { NavLink } from 'react-router-dom'
import {
  BarChart3, BookOpenCheck, ClipboardCheck, GraduationCap, LayoutDashboard,
  Settings, Users, FileBarChart
} from 'lucide-react'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/academics', label: 'Academics', icon: GraduationCap },
  { to: '/assignments', label: 'Assignments', icon: BookOpenCheck },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><BarChart3 size={23} /></div>
        <div><strong>EduTrack</strong><span>Student Portal</span></div>
      </div>
      <nav className="side-nav">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Icon size={19} /> <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-card">
        <div className="sidebar-card-title">Frontend Portfolio</div>
        <p>React + TypeScript + REST APIs</p>
      </div>
    </aside>
  )
}
