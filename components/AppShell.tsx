'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, BookOpen, BriefcaseBusiness, Database, FileSearch, FlaskConical, GitBranch, LayoutDashboard, Lightbulb, Menu, Settings, ShieldCheck, Sparkles, Target, X } from 'lucide-react';
import { useState } from 'react';

const nav = [
  { label:'Dashboard', href:'/dashboard', icon:LayoutDashboard, group:'WORKSPACE' },
  { label:'Analyze', href:'/analyze', icon:Sparkles, group:'WORKSPACE' },
  { label:'Projects', href:'/projects', icon:BriefcaseBusiness, group:'WORKSPACE' },
  { label:'Opportunities', href:'/opportunities', icon:Lightbulb, group:'DISCOVERY' },
  { label:'Problems', href:'/problems', icon:Target, group:'DISCOVERY' },
  { label:'Sources', href:'/sources', icon:BookOpen, group:'EVIDENCE' },
  { label:'Evidence', href:'/evidence', icon:ShieldCheck, group:'EVIDENCE' },
  { label:'Experiments', href:'/experiments', icon:FlaskConical, group:'VALIDATION' },
  { label:'Admin', href:'/admin', icon:Settings, group:'SYSTEM' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const title = path === '/' ? 'Overview' : path.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Overview';
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        {['WORKSPACE','DISCOVERY','EVIDENCE','VALIDATION','SYSTEM'].map(group => (
          <div className="nav-group" key={group}>
            <div className="nav-label">{group}</div>
            {nav.filter(x=>x.group===group).map(item => {
              const Icon = item.icon;
              const active = path === item.href || (item.href !== '/dashboard' && path.startsWith(item.href + '/'));
              return <Link className={`nav-item ${active ? 'active':''}`} key={item.href} href={item.href}><Icon size={15} strokeWidth={1.7}/><span>{item.label}</span><span className="dot"/></Link>
            })}
          </div>
        ))}
        <div className="sidebar-bottom">
          <div className="demo-card"><span className="demo-badge">Demo Mode</span><p>Deterministic sample outputs are labeled throughout the product until a real AI provider is connected.</p></div>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="crumbs"><span>Innovation DNA</span><span>/</span><strong style={{textTransform:'capitalize'}}>{title}</strong></div>
          <div className="top-actions">
            <button className="icon-btn" title="System health"><Activity size={15}/></button>
            <button className="icon-btn" title="Data catalog"><Database size={15}/></button>
            <button className="icon-btn" title="Open navigation on mobile" onClick={()=>setOpen(true)}><Menu size={16}/></button>
            <div className="avatar">SD</div>
          </div>
        </header>
        {open && <div className="drawer-backdrop" onClick={()=>setOpen(false)}><div className="drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><h3>Navigate</h3><button className="icon-btn" onClick={()=>setOpen(false)}><X size={15}/></button></div>{nav.map(item=>{const Icon=item.icon;return <Link key={item.href} className="quick-link mb-3" href={item.href} onClick={()=>setOpen(false)}><span style={{display:'flex',alignItems:'center',gap:10}}><Icon size={14}/>{item.label}</span><span>→</span></Link>})}</div></div>}
        {children}
      </div>
    </div>
  );
}

function Brand(){return <div className="brand"><div className="brand-mark"><GitBranch size={16}/></div><div><div className="brand-text">INNOVATION DNA</div><div className="brand-sub">Evidence intelligence</div></div></div>}
