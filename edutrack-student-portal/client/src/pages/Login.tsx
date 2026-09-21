import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('admin@edutrack.app')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await login(email, password); navigate('/') }
    catch { setError('Invalid demo credentials. Use the credentials shown below.') }
    finally { setLoading(false) }
  }

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="login-brand"><div className="brand-mark"><BarChart3 size={24} /></div><strong>EduTrack</strong></div>
        <div className="hero-copy">
          <span className="hero-badge">Student Management Platform</span>
          <h1>Turn student data into <em>clear action.</em></h1>
          <p>Manage attendance, academics, assignments and early-warning insights from one modern dashboard.</p>
          <div className="hero-proof"><ShieldCheck size={20} /><span>Built with React, TypeScript and REST APIs</span></div>
        </div>
        <div className="hero-metric"><span>Early Warning Engine</span><strong>Rule-based risk detection</strong><small>Attendance • Scores • Assignments</small></div>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={submit}>
          <div className="eyebrow">Welcome back</div>
          <h2>Sign in to EduTrack</h2>
          <p className="muted">Use the demo administrator account to explore the portal.</p>
          <label>Email address<div className="input-icon"><Mail size={18} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div></label>
          <label>Password<div className="input-icon"><LockKeyhole size={18} /><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div></label>
          {error && <div className="error-box">{error}</div>}
          <button className="btn primary wide" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          <div className="demo-creds"><strong>Demo credentials</strong><span>admin@edutrack.app</span><span>admin123</span></div>
        </form>
      </section>
    </div>
  )
}
