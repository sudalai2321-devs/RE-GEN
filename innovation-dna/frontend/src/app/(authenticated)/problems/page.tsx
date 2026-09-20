'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { SearchBar } from '@/components/common/search-bar';
import { api } from '@/lib/api';
import { Problem } from '@/types';
import { AlertTriangle, ArrowRight, MapPin, Users, Globe2, ShieldCheck } from 'lucide-react';

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getProblems();
        setProblems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const domains = ['all', ...Array.from(new Set(problems.map((p) => p.domain).filter(Boolean)))];

  const filtered = problems.filter((p) => {
    const matchesDomain = selectedDomain === 'all' || p.domain === selectedDomain;
    const matchesSearch =
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.problem_statement || '').toLowerCase().includes(search.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Real-World Problem Database"
        subtitle="Verified real-world problem statements sourced from WHO, FAO, UNESCO, EPA, and public research."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Problems' }]}
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter problems by keyword, industry, or region..."
        />

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                selectedDomain === dom
                  ? 'bg-[#007AFF] text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-700'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((prob) => (
          <div
            key={prob.id}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-600 transition-colors shadow-sm"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-300 bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/30 font-semibold">
                  {prob.domain}
                </span>
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
                  Verified
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-base leading-snug">
                <Link href={`/problems/${prob.id}`} className="hover:text-[var(--ios-accent,#007AFF)] transition-colors">
                  {prob.title}
                </Link>
              </h3>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {prob.problem_statement}
              </p>

              {prob.affected_users && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                  <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{prob.affected_users}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 truncate max-w-[140px] flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                {prob.geography || 'Global'}
              </span>

              <Link
                href={`/problems/${prob.id}`}
                className="text-xs text-[var(--ios-accent,#007AFF)] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Explore Fit</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
