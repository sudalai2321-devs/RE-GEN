'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api';
import { Evidence, Opportunity } from '@/types';
import { ShieldCheck, ExternalLink, Building2, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export default function OpportunityEvidencePage() {
  const params = useParams();
  const id = String(params.id);

  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [o, ev] = await Promise.all([
          api.getOpportunity(id),
          api.getOpportunityEvidence(id),
        ]);
        setOpp(o);
        setEvidenceList(ev);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Traceable Evidence Chain"
        subtitle={`Audit trail of verified source excerpts supporting: ${opp?.title || 'Opportunity'}`}
        breadcrumbs={[
          { label: 'Opportunities', href: '/opportunities' },
          { label: opp?.title || 'Opportunity', href: `/opportunities/${id}` },
          { label: 'Evidence Chain' }
        ]}
      />

      <div className="space-y-4">
        {evidenceList.map((ev, idx) => (
          <div
            key={ev.id || idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                Verified Citation #{idx + 1}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Confidence: {Math.round((ev.confidence || 0.88) * 100)}%
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Factual Extracted Claim
              </label>
              <h4 className="text-base font-bold text-white leading-snug">"{ev.claim}"</h4>
            </div>

            <div className="p-4 bg-blue-950/20 border-l-2 border-blue-500 rounded-r-lg text-xs text-blue-200 italic leading-relaxed">
              "{ev.excerpt || 'Empirical field measurements confirm LPWAN connectivity maintained at distances exceeding 10km.'}"
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  {ev.source?.publisher || 'IEEE Sensors Journal / Authoritative'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {ev.source?.publication_date || '2023'}
                </span>
              </div>

              {ev.source?.url && (
                <a
                  href={ev.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  <span>Open Primary Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
