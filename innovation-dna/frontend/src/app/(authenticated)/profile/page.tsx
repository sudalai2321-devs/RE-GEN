'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useAuth } from '@/components/providers/auth-provider';
import { User, Shield, Mail, Calendar, Key } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="User Workspace Profile"
        subtitle="Identity, authentication tokens, and system access role."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Profile' }]}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-600/30">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{user?.name || 'Researcher'}</h3>
            <p className="text-xs text-slate-400">{user?.email || 'user@innovationdna.ai'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              Authorization Role
            </span>
            <p className="text-xs font-mono font-bold text-white uppercase">{user?.role || 'USER'}</p>
          </div>

          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              Session Status
            </span>
            <p className="text-xs font-mono text-emerald-400">Active JWT Session</p>
          </div>
        </div>
      </div>
    </div>
  );
}
