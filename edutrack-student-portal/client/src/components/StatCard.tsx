import type { LucideIcon } from 'lucide-react'

export default function StatCard({ title, value, subtitle, icon: Icon }: { title: string; value: string | number; subtitle: string; icon: LucideIcon }) {
  return (
    <div className="stat-card card">
      <div className="stat-icon"><Icon size={21} /></div>
      <div className="stat-copy"><span>{title}</span><strong>{value}</strong><small>{subtitle}</small></div>
    </div>
  )
}
