'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { 
  FileText, 
  Brain, 
  Dna, 
  AlertCircle, 
  GitBranch, 
  ShieldCheck, 
  FlaskConical, 
  ArrowRight
} from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    number: '01',
    title: 'Collect & Ingest',
    icon: FileText,
    badge: 'Source Ingestion',
    desc: 'Ingest documented innovation attempts, post-mortems, academic research papers, patents, and government reports in PDF, DOCX, PPTX, TXT, or MD format.',
    detail: 'Every source is verified, fingerprinted, and chunked with token overlap to preserve contextual provenance.'
  },
  {
    number: '02',
    title: 'Project Understanding',
    icon: Brain,
    badge: 'Context Synthesis',
    desc: 'Synthesize what the original team attempted to achieve, their technological approach, target market assumptions, and operational environment.',
    detail: 'Separates documented source facts from retrospective commentary.'
  },
  {
    number: '03',
    title: 'Decode Innovation DNA',
    icon: Dna,
    badge: 'Structured Extraction',
    desc: 'Extract discrete capabilities, technical inputs, system outputs, operating constraints, dependencies, and explicit failure conditions into a structured schema.',
    detail: 'All extracted DNA claims store citation links to exact supporting source excerpts.'
  },
  {
    number: '04',
    title: 'Gap & Constraint Detection',
    icon: AlertCircle,
    badge: 'Limitation Analysis',
    desc: 'Distinguish between documented environmental/cost limitations and AI-derived opportunity hypotheses. Map where the original application reached boundary conditions.',
    detail: 'Identifies why the project failed in its original domain without assuming it cannot succeed elsewhere.'
  },
  {
    number: '05',
    title: 'Cross-Domain Problem Matching',
    icon: GitBranch,
    badge: 'Candidate Discovery',
    desc: 'Query verified real-world problem repositories across healthcare, agriculture, infrastructure, and energy. Compute dimensional transferability matrices.',
    detail: 'Evaluates technical fit, data fit, environmental fit, and infrastructure requirements independently.'
  },
  {
    number: '06',
    title: 'Evidence Verification',
    icon: ShieldCheck,
    badge: 'Traceability Audit',
    desc: 'Inspect supporting evidence side-by-side. Highlight conflicting data sources and maintain human-in-the-loop expert review controls.',
    detail: 'Zero hallucinated URLs or fabricated study results.'
  },
  {
    number: '07',
    title: 'Validation Experiment Design',
    icon: FlaskConical,
    badge: 'Hypothesis Protocol',
    desc: 'Generate a falsifiable, minimal validation experiment with measurable metrics, required equipment, testing procedure, and success/failure criteria.',
    detail: 'Track experiment progress from Planned to Completed and record observed metrics.'
  }
];

export default function HowItWorksPage() {
  return (
    <div className="flex-1 bg-[var(--ios-bg)] pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <PageHeader
          title="How Innovation DNA Works"
          subtitle="The rigorous 7-stage pipeline turning failed innovation attempts into verified cross-domain opportunities."
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'How It Works' }]}
          actions={
            <Link
              href="/analyze"
              className="px-4 py-2 bg-[#007AFF] hover:bg-[#0071E3] text-white text-xs font-semibold rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Start Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        <div className="space-y-6 mt-6">
          {WORKFLOW_STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.number}
                className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start gap-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 md:flex-col md:items-center text-center flex-shrink-0">
                  <span className="text-3xl font-black font-mono text-[var(--ios-accent,#007AFF)]">{s.number}</span>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--ios-accent-tint,rgba(0,122,255,0.1))] text-[var(--ios-accent,#007AFF)] border border-[var(--ios-accent,#007AFF)]/20 flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl font-bold text-slate-100">{s.title}</h3>
                    <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/25">
                      {s.badge}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{s.desc}</p>
                  <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-slate-400">
                    <strong className="text-slate-100">Technical implementation: </strong>
                    {s.detail}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="text-center pt-8">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#007AFF] hover:bg-[#0071E3] text-white font-semibold rounded-full text-sm shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all"
            >
              <span>Run Golden Demo Analysis (Project AeroSense)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

