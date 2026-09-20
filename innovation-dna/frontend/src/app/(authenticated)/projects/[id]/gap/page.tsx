'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api';
import { Gap, Project } from '@/types';
import { AlertCircle, ArrowRight, Lightbulb, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ProjectGapPage() {
  const params = useParams();
  const id = String(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [proj, gapList] = await Promise.all([
          api.getProject(id),
          api.getProjectGaps(id),
        ]);
        setProject(proj);
        setGaps(gapList);
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
        title={`${project?.name || 'Project'} — Gap & Constraint Detection`}
        subtitle="Differentiates between directly documented failure constraints and AI-derived opportunity hypotheses."
        breadcrumbs={[
          { label: 'Projects', href: '/projects' },
          { label: project?.name || 'Project', href: `/projects/${id}` },
          { label: 'Gap Analysis' }
        ]}
        actions={
          <Link
            href={`/projects/${id}/opportunities`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-1.5 transition-colors"
          >
            <Lightbulb className="w-4 h-4 text-cyan-300" />
            <span>Find Cross-Domain Opportunities</span>
          </Link>
        }
      />

      <div className="space-y-4">
        {gaps.map((gap, idx) => {
          const isHypothesis = gap.gap_type === 'ai_hypothesis';

          return (
            <div
              key={gap.id || idx}
              className={`rounded-2xl p-6 border transition-colors space-y-3 ${
                isHypothesis
                  ? 'bg-blue-950/20 border-blue-800/60'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold border ${
                  isHypothesis
                    ? 'bg-blue-900/60 text-blue-300 border-blue-700/60'
                    : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                }`}>
                  {isHypothesis ? 'AI-Derived Opportunity Hypothesis' : `Documented Limitation: ${gap.gap_type}`}
                </span>

                <span className="text-xs font-mono text-emerald-400">
                  {Math.round((gap.confidence || 0.85) * 100)}% Confidence
                </span>
              </div>

              <h4 className="text-base font-bold text-white leading-snug">{gap.description}</h4>

              {gap.reasoning && (
                <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-400 block mb-1">Analytical Reasoning:</strong>
                  {gap.reasoning}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <Link
          href={`/projects/${id}/opportunities`}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow transition-all"
        >
          <span>Explore Matched Cross-Domain Opportunities</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
