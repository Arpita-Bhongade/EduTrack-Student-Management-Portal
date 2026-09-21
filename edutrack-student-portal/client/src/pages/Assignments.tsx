import { useEffect, useState } from 'react'
import { BookOpenCheck, CalendarClock, CheckCircle2, Plus } from 'lucide-react'
import { assignmentsApi } from '../services/api'
import type { Assignment } from '../types'
import Loading from '../components/Loading'

export default function Assignments(){
  const [items,setItems]=useState<Assignment[]>([]); const [loading,setLoading]=useState(true); const [show,setShow]=useState(false)
  const [form,setForm]=useState({title:'',subject:'Web Application Development',dueDate:'',totalStudents:40,submitted:0,status:'Active' as const})
  const load=()=>assignmentsApi.list().then(setItems).finally(()=>setLoading(false)); useEffect(()=>{load()},[])
  const create=async(e:React.FormEvent)=>{e.preventDefault();await assignmentsApi.create(form);setShow(false);setForm({...form,title:'',dueDate:'',submitted:0});await load()}
  if(loading)return <Loading/>
  return <div className="stack-xl"><section className="page-heading"><div><h1>Assignments</h1><p>Create and monitor assignment submission progress.</p></div><button className="btn primary" onClick={()=>setShow(!show)}><Plus size={18}/>New Assignment</button></section>
    {show&&<form className="card inline-form" onSubmit={create}><label>Title<input value={form.title} required onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Subject<input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></label><label>Due Date<input type="date" required value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></label><button className="btn primary">Create</button></form>}
    <section className="assignment-grid">{items.map(a=>{const pct=Math.round((a.submitted/a.totalStudents)*100);return <article className="card assignment-card" key={a.id}><div className="assignment-top"><div className="assignment-icon"><BookOpenCheck size={20}/></div><span className={a.status==='Active'?'badge success':'badge neutral'}>{a.status}</span></div><h3>{a.title}</h3><p>{a.subject}</p><div className="assignment-meta"><span><CalendarClock size={16}/>{a.dueDate}</span><span><CheckCircle2 size={16}/>{a.submitted}/{a.totalStudents} submitted</span></div><div className="progress"><div style={{width:`${pct}%`}}/></div><div className="assignment-footer"><strong>{pct}% complete</strong><button className="link-btn" onClick={async()=>{await assignmentsApi.setStatus(a.id,a.status==='Active'?'Closed':'Active');await load()}}>{a.status==='Active'?'Close':'Reopen'}</button></div></article>})}</section>
  </div>
}
