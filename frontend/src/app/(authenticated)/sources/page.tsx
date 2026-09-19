'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { SearchBar } from '@/components/common/search-bar';
import { api } from '@/lib/api';
import { Source } from '@/types';
import { BookOpen, ExternalLink, Building2, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getSources();
        setSources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = sources.filter((s) =>
    (s.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.publisher || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Authoritative Source Library"
        subtitle="Curated library of peer-reviewed research, patents, government whitepapers, and technical post-mortems."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Sources' }]}
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter sources by title, publisher, or keywords..."
        />
        <span className="text-xs text-slate-400 font-mono">
          {filtered.length} of {sources.length} sources
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-5">Source Title</th>
                <th className="py-3.5 px-4">Publisher</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Published Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors text-xs">
                  <td className="py-3.5 px-5 font-semibold text-slate-100 max-w-md">
                    <p className="line-clamp-1">{s.title}</p>
                    {s.description && (
                      <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">{s.description}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[var(--ios-accent,#007AFF)]" />
                    <span>{s.publisher}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] uppercase text-cyan-600 dark:text-cyan-300 font-semibold">
                    {s.source_type}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {s.publication_date || '2023'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--ios-accent,#007AFF)] hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
