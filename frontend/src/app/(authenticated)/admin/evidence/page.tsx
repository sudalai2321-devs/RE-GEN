'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api';
import { Evidence } from '@/types';
import { FileCheck, ShieldCheck, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function AdminEvidencePage() {
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const ev = await api.getAdminEvidence();
        setEvidenceList(ev);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleUpdate = async (id: string, status: any) => {
    try {
      await api.updateEvidence(id, { verification_status: status });
      setEvidenceList((prev) =>
        prev.map((e) => (e.id === id ? { ...e, verification_status: status } : e))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Admin: Evidence Verification Audit"
        subtitle="Audit factual claim extractions against primary literature and resolve conflicting evidence."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Evidence Audit' }
        ]}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/60 uppercase font-semibold text-slate-400">
              <th className="py-3 px-4">Claim</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Current Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {evidenceList.map((e) => (
              <tr key={e.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 max-w-md">
                  <p className="font-semibold text-white line-clamp-1">"{e.claim}"</p>
                  {e.excerpt && <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">{e.excerpt}</p>}
                </td>
                <td className="py-3 px-4 font-mono text-emerald-400">
                  {Math.round((e.confidence || 0.88) * 100)}%
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    e.verification_status === 'verified'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                      : e.verification_status === 'rejected'
                      ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                      : 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                  }`}>
                    {e.verification_status || 'Pending'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => handleUpdate(e.id, 'verified')}
                    className="px-2 py-1 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 rounded border border-emerald-800/60"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => handleUpdate(e.id, 'needs_review')}
                    className="px-2 py-1 bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 rounded border border-amber-800/60"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => handleUpdate(e.id, 'rejected')}
                    className="px-2 py-1 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 rounded border border-rose-800/60"
                  >
                    Reject
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
