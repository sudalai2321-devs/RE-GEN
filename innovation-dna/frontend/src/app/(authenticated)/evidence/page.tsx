'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { SearchBar } from '@/components/common/search-bar';
import { EvidencePanel } from '@/components/common/evidence-panel';
import { api } from '@/lib/api';
import { Evidence } from '@/types';
import { FileCheck, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function EvidenceVaultPage() {
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [search, setSearch] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getEvidence();
        setEvidenceList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = evidenceList.filter((e) =>
    (e.claim || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.excerpt || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Verified Evidence Vault"
        subtitle="Atomic factual claims extracted from technical literature with direct citation pointers."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Evidence Vault' }]}
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search claims and supporting excerpts..."
        />
        <span className="text-xs text-slate-400 font-mono">
          {filtered.length} of {evidenceList.length} evidence items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((ev) => (
          <div
            key={ev.id}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-3 hover:border-slate-600 transition-colors shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                  {ev.verification_status || 'Verified'}
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-medium">
                  {Math.round((ev.confidence || 0.88) * 100)}% Conf
                </span>
              </div>

              <h4 className="font-semibold text-slate-100 text-sm leading-snug">"{ev.claim}"</h4>

              {ev.excerpt && (
                <blockquote className="text-xs text-slate-300 italic bg-slate-800 p-3 rounded-xl border-l-2 border-[var(--ios-accent,#007AFF)] line-clamp-2">
                  "{ev.excerpt}"
                </blockquote>
              )}
            </div>

            <div className="pt-3 border-t border-slate-700 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedEvidence(ev)}
                className="text-xs text-[var(--ios-accent,#007AFF)] hover:underline font-semibold inline-flex items-center gap-1.5"
              >
                <span>Inspect Evidence Detail</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>


      {selectedEvidence && (
        <EvidencePanel
          evidence={selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
        />
      )}
    </div>
  );
}
