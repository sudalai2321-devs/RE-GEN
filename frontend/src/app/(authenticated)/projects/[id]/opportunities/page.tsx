'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api';
import { Opportunity, Project } from '@/types';
import { Lightbulb, ArrowRight, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

export default function ProjectOpportunitiesPage() {
  const params = useParams();
  const id = String(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [proj, oppList] = await Promise.all([
          api.getProject(id),
          api.getProjectOpportunities(id),
        ]);
        setProject(proj);
        setOpportunities(oppList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <PageHeader
        title={`${project?.name || 'Project'} — Cross-Domain Opportunities`}
        subtitle="Opportunities identified by matching decoded capabilities to verified real-world problems."
        breadcrumbs={[
          { label: 'Projects', href: '/projects' },
          { label: project?.name || 'Project', href: `/projects/${id}` },
          { label: 'Opportunities' }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/60">
                  Tech Fit: {Math.round((opp.technology_fit || 0.8) * 100)}%
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  Evidence: {Math.round((opp.evidence_strength || 0.75) * 100)}%
                </span>
              </div>

              <h3 className="font-bold text-white text-base leading-snug">{opp.title}</h3>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                {opp.rationale}
              </p>

              {opp.transferable_capabilities && opp.transferable_capabilities.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Transferable Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.transferable_capabilities.map((cap: any, i: number) => (
                      <span key={i} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-medium">
                        {typeof cap === 'string' ? cap : cap.capability || 'Capability'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">Status: {opp.status}</span>
              <Link
                href={`/opportunities/${opp.id}`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-1.5 transition-colors"
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
