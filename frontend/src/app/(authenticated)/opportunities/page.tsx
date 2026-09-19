'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { SearchBar } from '@/components/common/search-bar';
import { api } from '@/lib/api';
import { Opportunity } from '@/types';
import { Lightbulb, ArrowRight, ShieldCheck, Filter } from 'lucide-react';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getOpportunities();
        setOpportunities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = opportunities.filter((o) =>
    (o.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.rationale || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Cross-Domain Opportunities"
        subtitle="Analytical matches connecting historical capabilities with real-world problems backed by evidence."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Opportunities' }]}
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter opportunities by capability, target domain, or keywords..."
        />
        <span className="text-xs text-slate-400 font-mono">
          {filtered.length} of {opportunities.length} candidates
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-600 transition-colors shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-300 bg-cyan-500/15 px-2.5 py-1 rounded-full border border-cyan-500/30 font-semibold">
                  Tech Fit: {Math.round((opp.technology_fit || 0.75) * 100)}%
                </span>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30 font-semibold">
                  Evidence: {Math.round((opp.evidence_strength || 0.8) * 100)}%
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-base leading-snug">
                <Link href={`/opportunities/${opp.id}`} className="hover:text-[var(--ios-accent,#007AFF)] transition-colors">
                  {opp.title}
                </Link>
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
                {opp.rationale}
              </p>

              {opp.transferable_capabilities && opp.transferable_capabilities.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Transferable Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.transferable_capabilities.map((cap: any, idx: number) => (
                      <span key={idx} className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 font-medium">
                        {typeof cap === 'string' ? cap : cap.capability || 'Capability'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 capitalize">Status: {opp.status}</span>
              <Link
                href={`/opportunities/${opp.id}`}
                className="px-4 py-2 bg-[#007AFF] hover:bg-[#0071E3] text-white rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <span>Intelligence Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
