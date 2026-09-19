'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api';
import { Terminal, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export default function AdminAnalysisRunsPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const r = await api.getAdminAnalysisRuns();
        setRuns(r);
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
        title="Admin: AI Analysis Runs Audit"
        subtitle="Reproducibility ledger tracking LLM models, prompt template versions, and execution telemetry."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Analysis Runs' }
        ]}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/60 uppercase font-semibold text-slate-400">
              <th className="py-3 px-4">Run ID</th>
              <th className="py-3 px-4">Stage Type</th>
              <th className="py-3 px-4">AI Model</th>
              <th className="py-3 px-4">Prompt Version</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Execution Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {runs.length > 0 ? (
              runs.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">RUN-00{r.id}</td>
                  <td className="py-3 px-4 font-semibold text-white uppercase">{r.run_type}</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">{r.model || 'gpt-4o'}</td>
                  <td className="py-3 px-4 font-mono text-blue-400">{r.prompt_version || 'v1.0'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-medium">
                      {r.status || 'completed'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-500">
                    {r.started_at ? new Date(r.started_at).toLocaleString() : 'Recent'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No analysis runs recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
