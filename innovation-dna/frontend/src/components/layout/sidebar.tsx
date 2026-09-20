'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { 
  LayoutDashboard, 
  Microscope, 
  FolderKanban, 
  Lightbulb, 
  AlertTriangle, 
  BookOpen, 
  FileCheck, 
  ShieldAlert,
  Terminal,
  Activity,
  UserCheck
} from 'lucide-react';

const MAIN_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analyze Project', href: '/analyze', icon: Microscope },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Opportunities', href: '/opportunities', icon: Lightbulb },
  { name: 'Real Problems', href: '/problems', icon: AlertTriangle },
  { name: 'Source Library', href: '/sources', icon: BookOpen },
  { name: 'Evidence Vault', href: '/evidence', icon: FileCheck },
];

const ADMIN_NAV = [
  { name: 'Admin Overview', href: '/admin', icon: ShieldAlert },
  { name: 'Manage Sources', href: '/admin/sources', icon: BookOpen },
  { name: 'Manage Evidence', href: '/admin/evidence', icon: FileCheck },
  { name: 'Analysis Runs', href: '/admin/analysis-runs', icon: Terminal },
  { name: 'Background Jobs', href: '/admin/jobs', icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col flex-shrink-0 transition-colors">
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Innovation Intelligence
          </div>
          <nav className="space-y-1">
            {MAIN_NAV.map((item) => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-[var(--ios-accent,#007AFF)] text-white shadow-sm shadow-blue-500/25 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {isAdmin && (
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center justify-between">
              <span>Admin Center</span>
              <span className="text-[10px] bg-amber-500/15 px-1.5 py-0.5 rounded-full text-amber-600 dark:text-amber-300 font-semibold">Root</span>
            </div>
            <nav className="space-y-1">
              {ADMIN_NAV.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25 font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-amber-500'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        <div className="pt-2 px-1">
          <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 text-xs space-y-1.5">
            <div className="font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"></span>
              Demonstration Mode
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Every factual claim links directly to documented source records. Anti-hallucination guardrails active.
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-slate-700 bg-slate-900">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors text-sm"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--ios-accent-tint,rgba(0,122,255,0.15))] text-[var(--ios-accent,#007AFF)] border border-[var(--ios-accent,#007AFF)]/30 flex items-center justify-center font-semibold text-xs shadow-sm">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-100 truncate text-xs">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email || 'Logged in'}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}


