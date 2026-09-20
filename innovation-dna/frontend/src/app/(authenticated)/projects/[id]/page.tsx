'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { PipelineStepper } from '@/components/common/pipeline-stepper';
import { EvidencePanel } from '@/components/common/evidence-panel';
import { api } from '@/lib/api';
import { Project, Document, DNAItem, Gap, Opportunity, Evidence } from '@/types';
import { 
  Dna, 
  AlertCircle, 
  Lightbulb, 
  ArrowRight, 
  FileCheck, 
  ExternalLink,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [dnaItems, setDnaItems] = useState<DNAItem[]>([]);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [loading, setLoading] = useState(true);

  const getStageFromStatus = (status: string): number => {
    switch (status) {
      case 'draft': return 0;
      case 'processing': return 1;
      case 'dna_extracted': return 2;
      case 'gap_detected': return 3;
      case 'opportunity_discovery': return 4;
      case 'cross_domain_matched': return 5;
      case 'evidence_verified': return 6;
      case 'validated': return 8;
      case 'failed': return -1;
      default: return 1;
    }
  };

  useEffect(() => {
    let isMounted = true;
    let pollTimer: NodeJS.Timeout | null = null;

    async function load() {
      try {
        const [proj, dna, gapList, oppList, docList] = await Promise.all([
          api.getProject(id),
          api.getProjectDNA(id),
          api.getProjectGaps(id),
          api.getProjectOpportunities(id),
          api.getDocuments(id).catch(() => []),
        ]);
        if (!isMounted) return;
        setProject(proj);
        setDnaItems(dna);
        setGaps(gapList);
        setOpportunities(oppList);
        setDocuments(docList || []);

        // If still processing, poll every 2 seconds until complete
        if (proj.status && !['validated', 'failed'].includes(proj.status)) {
          pollTimer = setTimeout(load, 2000);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();

    return () => {
      isMounted = false;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400 animate-pulse">Loading Innovation DNA...</div>;
  }

  if (!project) {
    return <div className="p-8 text-center text-xs text-rose-500">Project not found.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title={project.name}
        subtitle={`Domain: ${project.domain} • Analysis Status: ${project.status}`}
        breadcrumbs={[
          { label: 'Projects', href: '/projects' },
          { label: project.name }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={`/projects/${id}/dna`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 rounded-full text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Dna className="w-4 h-4 text-purple-500" />
              <span>Full DNA Breakdown</span>
            </Link>
            <Link
              href={`/projects/${id}/gap`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 rounded-full text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Gaps & Constraints</span>
            </Link>
            <Link
              href={`/projects/${id}/opportunities`}
              className="px-4 py-2 bg-[#007AFF] hover:bg-[#0071E3] text-white rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Discovered Opportunities ({opportunities.length})</span>
            </Link>
          </div>
        }
      />

      {/* Stepper Pipeline */}
      <PipelineStepper 
        currentStage={getStageFromStatus(project.status)} 
        project={project}
        documents={documents}
        dnaItems={dnaItems}
        gaps={gaps}
        opportunities={opportunities}
        onReanalyze={async () => {
          await api.analyzeProject(id);
          const [p, d, g, o, docList] = await Promise.all([
            api.getProject(id),
            api.getProjectDNA(id),
            api.getProjectGaps(id),
            api.getProjectOpportunities(id),
            api.getDocuments(id).catch(() => []),
          ]);
          setProject(p);
          setDnaItems(d);
          setGaps(g);
          setOpportunities(o);
          setDocuments(docList || []);
        }}
      />

      {/* Template Detection Banner if applicable */}
      {dnaItems.some(d => d.category === 'document_type' || d.category === 'status_assessment' || d.value.toLowerCase().includes('template')) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">Unfilled Pitch Deck Template Detected</h4>
            <p className="text-xs text-amber-200 leading-relaxed">
              The uploaded file is an unpopulated hackathon pitch deck template (e.g. Celestia / ISTE VIT Vellore). The system has decoded the required competition structure below. To synthesize full technical DNA and cross-domain opportunities, populate <strong>Slide 3 (Problem Statement)</strong>, <strong>Slide 4 (Proposed Solution)</strong>, and <strong>Slide 5 (Tech Stack)</strong> or use Mode B (Manual Entry).
            </p>
          </div>
        </div>
      )}

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-3 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Original Objective & Approach</h3>
          <p className="text-xs text-slate-200 leading-relaxed">
            {project.objective || `Documented technical attempt to build solutions in ${project.domain || 'the target domain'}.`}
          </p>
          <div className="pt-2 border-t border-slate-700">
            <h4 className="text-xs font-semibold text-slate-400 mb-1">Target Problem:</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {project.problem || `Operational bottlenecks and unaddressed constraints in ${project.domain || 'the target field'}.`}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-3 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Documented Limitation / Failure Summary</h3>
          <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/25 font-medium">
            {project.failure_summary || 'No fatal technical limitation or failure post-mortem recorded in current submission.'}
          </p>
          <div className="pt-2 border-t border-slate-700 text-xs text-slate-400">
            <strong className="text-slate-200 font-semibold">Analytical takeaway: </strong>
            {project.failure_summary
              ? `Operational constraints isolated from documented attempt: ${project.failure_summary.slice(0, 120)}...`
              : `Core technical capabilities identified for ${project.name}; empirical validation pending.`}
          </div>
        </div>
      </div>

      {/* Decoded DNA Items Preview */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-[var(--ios-accent,#007AFF)]" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Decoded Innovation DNA ({dnaItems.length} elements)</h3>
          </div>
          <Link href={`/projects/${id}/dna`} className="text-xs text-[var(--ios-accent,#007AFF)] hover:underline font-semibold flex items-center gap-1">
            <span>Explore Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {dnaItems.slice(0, 9).map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-800 border border-slate-700 rounded-2xl space-y-1.5 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-cyan-600 dark:text-cyan-300 font-semibold uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-[#34C759] font-mono text-[10px] font-bold">
                  {Math.round((item.confidence || 0.85) * 100)}% Conf
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Discovered Opportunities Quick-List */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-cyan-500" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Cross-Domain Matches ({opportunities.length})
            </h3>
          </div>
          <Link href={`/projects/${id}/opportunities`} className="text-xs text-[var(--ios-accent,#007AFF)] hover:underline font-semibold">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-4 bg-slate-800 border border-slate-700 rounded-2xl space-y-2 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-300 bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/30 font-semibold">
                  Target Fit: {Math.round((opp.technology_fit || 0.75) * 100)}%
                </span>
                <Link
                  href={`/opportunities/${opp.id}`}
                  className="text-xs text-[var(--ios-accent,#007AFF)] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Intelligence Report</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <h4 className="font-bold text-slate-100 text-sm">{opp.title}</h4>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{opp.rationale}</p>
            </div>
          ))}
        </div>
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
