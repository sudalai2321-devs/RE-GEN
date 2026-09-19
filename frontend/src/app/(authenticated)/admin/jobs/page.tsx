'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api';
import { Activity, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const j = await api.getAdminJobs();
        setJobs(j);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRetry = async (id: string) => {
    try {
      await api.retryJob(id);
      const updated = await api.getAdminJobs();
      setJobs(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Admin: Background Pipeline Jobs"
        subtitle="Real-time execution monitor for extraction, embedding, gap detection, and experiment generation."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Jobs' }
        ]}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/60 uppercase font-semibold text-slate-400">
              <th className="py-3 px-4">Job ID</th>
              <th className="py-3 px-4">Job Type</th>
              <th className="py-3 px-4">Entity</th>
              <th className="py-3 px-4">Progress</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {jobs.length > 0 ? (
              jobs.map((j) => (
                <tr key={j.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">JOB-{j.id}</td>
                  <td className="py-3 px-4 font-semibold text-white uppercase">{j.job_type}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">Project #{j.entity_id}</td>
                  <td className="py-3 px-4">
                    <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${Math.round((j.progress || 1.0) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-medium">
                      {j.status || 'completed'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRetry(String(j.id))}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors inline-flex items-center gap-1 font-medium"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No background jobs registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
