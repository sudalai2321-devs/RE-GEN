'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { SearchBar } from '@/components/common/search-bar';
import { api } from '@/lib/api';
import { Project } from '@/types';
import { ArrowRight, Microscope, FolderKanban, ShieldCheck } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = projects.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.domain || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Documented Innovation Projects"
        subtitle="Catalog of analyzed historical attempts with decoded technical DNA and gap detections."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Projects' }]}
        actions={
          <Link
            href="/analyze"
            className="px-4 py-2 bg-[#007AFF] hover:bg-[#0071E3] text-white text-xs font-semibold rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Microscope className="w-4 h-4" />
            <span>Analyze New Project</span>
          </Link>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter by project name, industry, or domain..."
        />
        <span className="text-xs text-slate-400 font-mono">
          {filtered.length} of {projects.length} recorded
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p: any) => (
          <div
            key={p.id}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-5 hover:border-slate-600 transition-colors flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                  {p.domain || 'Technology'}
                </span>
                <StatusBadge status={p.status} size="sm" />
              </div>

              <h3 className="font-bold text-slate-100 text-base leading-snug">
                <Link href={`/projects/${p.id}`} className="hover:text-[var(--ios-accent,#007AFF)] transition-colors">
                  {p.name}
                </Link>
              </h3>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {p.failure_summary || p.problem || 'Technical failure documentation available in detailed report.'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
                <span>Verified DNA</span>
              </div>
              <Link
                href={`/projects/${p.id}`}
                className="text-[var(--ios-accent,#007AFF)] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Inspect DNA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
