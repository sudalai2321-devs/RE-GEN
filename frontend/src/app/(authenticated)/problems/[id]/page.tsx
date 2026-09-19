'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api';
import { Problem } from '@/types';
import { AlertTriangle, MapPin, Users, Globe2, ShieldCheck, ArrowRight, Lightbulb } from 'lucide-react';

export default function ProblemDetailPage() {
  const params = useParams();
  const id = String(params.id);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const p = await api.getProblem(id);
        setProblem(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400 animate-pulse">Loading problem dossier...</div>;
  }

  if (!problem) {
    return <div className="p-8 text-center text-xs text-rose-400">Problem not found.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title={problem.title}
        subtitle={`Domain: ${problem.domain} • Subdomain: ${problem.subdomain || 'General'}`}
        breadcrumbs={[
          { label: 'Problems', href: '/problems' },
          { label: problem.title }
        ]}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Problem Statement
          </label>
          <p className="text-base text-white leading-relaxed font-medium">
            {problem.problem_statement}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              Affected Stakeholders
            </span>
            <p className="text-xs text-slate-200">{problem.affected_users || 'Global communities'}</p>
          </div>

          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Geographical Scope
            </span>
            <p className="text-xs text-slate-200">{problem.geography || 'Global'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Existing Solutions
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{problem.existing_solutions || 'Traditional approaches'}</p>
          </div>

          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 block">
              Known Limitations
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{problem.limitations || 'Cost, infrastructure and scalability bottlenecks.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
