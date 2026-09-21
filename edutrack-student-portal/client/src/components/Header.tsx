import { Bell, LogOut, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const titles: Record<string, string> = {
  '/': 'Dashboard', '/students': 'Student Management', '/attendance': 'Attendance',
  '/academics': 'Academics', '/assignments': 'Assignments', '/reports': 'Reports', '/settings': 'Settings'
}

export default function Header() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  return (
    <header className="topbar">
      <div>
        <div className="eyebrow">EduTrack Workspace</div>
        <h2>{titles[pathname] || 'EduTrack'}</h2>
      </div>
      <div className="topbar-actions">
        <div className="header-search"><Search size={17} /><input placeholder="Quick search" /></div>
        <button className="icon-btn" aria-label="Notifications"><Bell size={19} /></button>
        <div className="user-chip"><div className="avatar">AM</div><div><strong>{user?.name || 'Admin'}</strong><span>{user?.role || 'Administrator'}</span></div></div>
        <button className="icon-btn" onClick={logout} aria-label="Logout"><LogOut size={19} /></button>
      </div>
    </header>
  )
}
