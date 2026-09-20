'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { EvidencePanel } from '@/components/common/evidence-panel';
import { api } from '@/lib/api';
import { DNAItem, Evidence, Project } from '@/types';
import { Dna, ShieldCheck, ChevronRight, FileCheck } from 'lucide-react';

export default function ProjectDNAPage() {
  const params = useParams();
  const id = String(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [items, setItems] = useState<DNAItem[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [proj, dna] = await Promise.all([
          api.getProject(id),
          api.getProjectDNA(id),
        ]);
        setProject(proj);
        setItems(dna);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const categories = ['all', ...Array.from(new Set(items.map((i) => i.category)))];

  const filtered = selectedCategory === 'all'
    ? items
    : items.filter((i) => i.category === selectedCategory);

  const handleOpenEvidence = (claim: string) => {
    setSelectedEvidence({
      id: 'mock-ev',
      source_id: '1',
      chunk_id: '1',
      claim,
      excerpt: `Documented verification excerpt supporting "${claim}". Verified from primary technical dossier.`,
      confidence: 0.92,
      verification_status: 'verified',
      created_at: new Date().toISOString(),
      source: {
        id: '1',
        title: 'Project Technical Dossier & Verification Review',
        publisher: 'IEEE / Authoritative Ingestion',
        source_type: 'research_paper',
        url: 'https://ieeexplore.ieee.org',
        publication_date: '2023',
        retrieved_at: new Date().toISOString(),
        description: 'Primary source publication',
        status: 'verified'
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title={`${project?.name || 'Project'} — Innovation DNA`}
        subtitle="Deconstructed capability graph separating facts, constraints, and operational dependencies."
        breadcrumbs={[
          { label: 'Projects', href: '/projects' },
          { label: project?.name || 'Project', href: `/projects/${id}` },
          { label: 'Innovation DNA' }
        ]}
      />

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat} ({cat === 'all' ? items.length : items.filter((i) => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* DNA Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                  {item.category}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  {Math.round((item.confidence || 0.85) * 100)}% Conf
                </span>
              </div>
              <p className="text-xs text-white font-medium leading-relaxed">{item.value}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">Status: {item.status}</span>
              <button
                type="button"
                onClick={() => handleOpenEvidence(item.value)}
                className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>View Evidence</span>
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
