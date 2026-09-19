'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { api } from '@/lib/api';
import { Project } from '@/types';
import { FolderKanban, RefreshCw, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const p = await api.getAdminProjects();
        setProjects(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRerun = async (id: string) => {
    try {
      await api.analyzeProject(id);
      const updated = await api.getAdminProjects();
      setProjects(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Admin: Innovation Projects Supervision"
        subtitle="Inspect, re-run analysis pipelines, and audit user-submitted documented projects."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Projects' }
        ]}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/60 uppercase font-semibold text-slate-400">
              <th className="py-3 px-4">Project Name</th>
              <th className="py-3 px-4">Domain</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4 text-right">Supervisory Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {projects.map((p: any) => (
              <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-semibold text-white max-w-xs truncate">
                  <Link href={`/projects/${p.id}`} className="hover:text-blue-400">
                    {p.name}
                  </Link>
                </td>
                <td className="py-3 px-4 text-slate-400">{p.domain}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={p.status} size="sm" />
                </td>
                <td className="py-3 px-4 font-mono text-slate-500">
                  {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Recent'}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <Link
                    href={`/projects/${p.id}`}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 inline-flex items-center gap-1 font-medium"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </Link>
                  <button
                    onClick={() => handleRerun(String(p.id))}
                    className="px-2.5 py-1 bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 rounded border border-blue-800/60 inline-flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-Analyze</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
