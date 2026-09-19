'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api';
import { Problem } from '@/types';
import { AlertTriangle, MapPin, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const p = await api.getAdminProblems();
        setProblems(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Admin: Real-World Problems Supervision"
        subtitle="Manage verified problem database statements across healthcare, agriculture, infrastructure, and energy."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Problems' }
        ]}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/60 uppercase font-semibold text-slate-400">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Domain</th>
              <th className="py-3 px-4">Geography</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {problems.map((prob) => (
              <tr key={prob.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-semibold text-white max-w-sm truncate">{prob.title}</td>
                <td className="py-3 px-4 font-mono text-cyan-300 uppercase text-[10px]">{prob.domain}</td>
                <td className="py-3 px-4 text-slate-400">{prob.geography || 'Global'}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-medium">
                    {prob.status || 'Active'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/problems/${prob.id}`}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-medium inline-flex items-center gap-1"
                  >
                    <span>Inspect</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
