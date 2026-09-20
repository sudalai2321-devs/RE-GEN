'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/common/stat-card';
import { api } from '@/lib/api';
import { 
  ShieldAlert, 
  BookOpen, 
  FolderKanban, 
  AlertTriangle, 
  FileCheck, 
  Activity, 
  Terminal,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const s = await api.getAdminStats();
        setStats(s);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const adminSections = [
    { title: 'Manage Sources', desc: 'Inspect, verify, or deactivate catalog sources', href: '/admin/sources', icon: BookOpen },
    { title: 'Manage Projects', desc: 'Inspect and re-run analytical models across all user submissions', href: '/admin/projects', icon: FolderKanban },
    { title: 'Manage Problems', desc: 'Verify and curate problem database records', href: '/admin/problems', icon: AlertTriangle },
    { title: 'Manage Evidence', desc: 'Audit unsupported or flagged factual claims', href: '/admin/evidence', icon: FileCheck },
    { title: 'Analysis Runs Audit', desc: 'Inspect prompt templates, model versions, and token costs', href: '/admin/analysis-runs', icon: Terminal },
    { title: 'Background Jobs', desc: 'Monitor ingestion and extraction job execution queue', href: '/admin/jobs', icon: Activity },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Admin Control Center"
        subtitle="System-wide management, data audit, and analysis job supervision."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Admin' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Sources" value={stats?.sources || 30} icon={BookOpen} variant="blue" />
        <StatCard label="Total Projects" value={stats?.projects || 12} icon={FolderKanban} variant="purple" />
        <StatCard label="Problem Records" value={stats?.problems || 25} icon={AlertTriangle} variant="amber" />
        <StatCard label="Evidence Items" value={stats?.evidence || 20} icon={FileCheck} variant="emerald" />
        <StatCard label="Background Jobs" value={stats?.jobs || 2} icon={Activity} variant="cyan" />
        <StatCard label="System Users" value={stats?.users || 2} icon={ShieldAlert} variant="slate" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {adminSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Link
              key={sec.title}
              href={sec.href}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 transition-colors flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/60 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">{sec.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{sec.desc}</p>
              </div>

              <div className="flex items-center gap-1 text-xs text-blue-400 font-medium pt-2">
                <span>Access Management</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
