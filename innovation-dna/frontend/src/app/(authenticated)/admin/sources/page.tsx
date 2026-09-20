'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api';
import { Source } from '@/types';
import { BookOpen, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const s = await api.getAdminSources();
        setSources(s);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleVerify = async (id: string) => {
    try {
      await api.verifySource(id);
      setSources((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'verified' } : s))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Admin: Source Management"
        subtitle="Inspect, verify, or re-run ingestion across authoritative sources."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Sources' }
        ]}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/60 uppercase font-semibold text-slate-400">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Publisher</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {sources.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-semibold text-white max-w-xs truncate">{s.title}</td>
                <td className="py-3 px-4">{s.publisher}</td>
                <td className="py-3 px-4 uppercase font-mono text-[10px] text-cyan-300">{s.source_type}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-medium">
                    {s.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleVerify(s.id)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-900/40 text-emerald-400 rounded border border-slate-700 hover:border-emerald-700 transition-colors font-medium"
                  >
                    Confirm Verified
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
