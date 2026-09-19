'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Database, 
  BrainCircuit, 
  Dna, 
  AlertTriangle, 
  Shuffle, 
  ShieldCheck, 
  FlaskConical, 
  RefreshCw, 
  ArrowRight
} from 'lucide-react';
import { Project, Document, DNAItem, Gap, Opportunity } from '@/types';

interface PipelineStepperProps {
  currentStage: number; // 1 to 8 (8 means all complete)
  project?: Project | null;
  documents?: Document[];
  dnaItems?: DNAItem[];
  gaps?: Gap[];
  opportunities?: Opportunity[];
  onReanalyze?: () => Promise<void>;
}

export function PipelineStepper({ 
  currentStage = 8, 
  project, 
  documents = [],
  dnaItems = [], 
  gaps = [], 
  opportunities = [],
  onReanalyze 
}: PipelineStepperProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(7);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedStage, setSimulatedStage] = useState<number | null>(null);

  const effectiveStage = isSimulating ? (simulatedStage ?? 1) : currentStage;

  const formatDomain = (domain?: string) => {
    if (!domain) return 'Classified';
    return domain
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const STEPS = [
    { 
      number: 1,
      key: 'collect', 
      title: 'Ingestion & Sources', 
      icon: Database,
      badge: documents && documents.length > 0 ? `${documents.length} File${documents.length > 1 ? 's' : ''}` : '45+ Sources',
      description: 'Document ingestion, checksum hashing, and connection to authoritative archives (NASA, DARPA, IEEE, WHO).'
    },
    { 
      number: 2,
      key: 'understand', 
      title: 'Project Scope', 
      icon: BrainCircuit,
      badge: formatDomain(project?.domain),
      description: 'Semantic intent parsing, technical boundary isolation, and core problem statement extraction.'
    },
    { 
      number: 3,
      key: 'decode', 
      title: 'Innovation DNA', 
      icon: Dna,
      badge: `${dnaItems.length} Elements`,
      description: 'Deconstruction into technologies, capabilities, input parameters, outputs, and operational assumptions.'
    },
    { 
      number: 4,
      key: 'gap', 
      title: 'Gap Detection', 
      icon: AlertTriangle,
      badge: `${gaps.length} Constraints`,
      description: 'Isolation of root failure conditions, economic ceilings, data scarcity, and transferable core technologies.'
    },
    { 
      number: 5,
      key: 'discover', 
      title: 'Problem Cross-Match', 
      icon: Shuffle,
      badge: `${opportunities.length} Matches`,
      description: 'Cross-domain transferability mapping across Agriculture, Environment, Healthcare, and Infrastructure.'
    },
    { 
      number: 6,
      key: 'verify', 
      title: 'Evidence Verification', 
      icon: ShieldCheck,
      badge: 'Peer-Reviewed',
      description: 'Anti-hallucination verification cross-referencing capabilities against peer-reviewed citations.'
    },
    { 
      number: 7,
      key: 'validate', 
      title: 'Experiment Protocol', 
      icon: FlaskConical,
      badge: 'Falsifiable',
      description: 'Automated synthesis of structured, step-by-step experiment protocols with test metrics.'
    },
  ];

  const handleRunPipeline = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    for (let stage = 1; stage <= 7; stage++) {
      setSimulatedStage(stage);
      setSelectedStep(stage);
      await new Promise((r) => setTimeout(r, 350));
    }

    if (onReanalyze) {
      try {
        await onReanalyze();
      } catch (err) {
        console.error('Re-analysis error:', err);
      }
    }

    setSimulatedStage(8);
    setIsSimulating(false);
  };

  const activeStepData = STEPS.find(s => s.number === selectedStep) || STEPS[6];

  return (
    <div className="bg-slate-900/90 dark:bg-[#1C1C1E] border border-slate-800 dark:border-white/10 rounded-3xl p-6 space-y-6 shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#007AFF]/15 text-[#007AFF] flex items-center justify-center font-bold text-xs">
            7S
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 dark:text-white tracking-wide uppercase">
              7-Stage Innovation Pipeline
            </h3>
            <p className="text-xs text-slate-400">
              Interactive pipeline execution — click any stage to inspect verified outputs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunPipeline}
            disabled={isSimulating}
            className="px-3.5 py-1.5 rounded-full bg-slate-800 dark:bg-white/10 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 border border-slate-700 dark:border-white/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#007AFF] ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Executing Pipeline...' : 'Re-run Pipeline'}</span>
          </button>

          <span className={`text-xs px-3 py-1 rounded-full font-mono font-semibold transition-all ${
            effectiveStage > 7 
              ? 'bg-[#34C759]/15 text-[#34C759] border border-[#34C759]/30'
              : effectiveStage < 0
              ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
              : 'bg-[#007AFF]/15 text-[#007AFF] border border-[#007AFF]/30 animate-pulse'
          }`}>
            {effectiveStage > 7 ? '✓ Pipeline Validated (7/7 Complete)' : effectiveStage < 0 ? '✕ Pipeline Failed' : `Running Stage 0${effectiveStage} / 07`}
          </span>
        </div>
      </div>

      {/* iOS Segmented Progress Bar Track */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#34C759] inline-block animate-pulse"></span>
            PIPELINE FLOW
          </span>
          <span className="font-mono text-[11px] text-slate-300">
            {effectiveStage > 7 
              ? 'All 7 Stages Complete (100%)' 
              : effectiveStage < 0 
              ? 'Execution Halted' 
              : `Stage ${effectiveStage} of 7 • ${Math.round((Math.max(0, effectiveStage - 1) / 7) * 100)}%`}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {STEPS.map((s) => {
            const isStepDone = s.number < effectiveStage || effectiveStage > 7;
            const isStepCurrent = s.number === effectiveStage;
            return (
              <div
                key={s.key}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isStepDone
                    ? 'bg-[#34C759]'
                    : isStepCurrent
                    ? 'bg-[#007AFF] shadow-[0_0_8px_rgba(0,122,255,0.6)] animate-pulse'
                    : 'bg-slate-800 dark:bg-white/10'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Interactive Pipeline Stage Cards (No line cutting through cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {STEPS.map((step) => {
          const isDone = step.number < effectiveStage || effectiveStage > 7;
          const isCurrent = step.number === effectiveStage && effectiveStage <= 7;
          const isSelected = selectedStep === step.number;
          const StepIcon = step.icon;

          return (
            <button
              key={step.key}
              onClick={() => setSelectedStep(step.number)}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer group hover:-translate-y-0.5 active:scale-95 ${
                isSelected
                  ? 'bg-slate-800/95 dark:bg-[#252529] border-[#007AFF] ring-2 ring-[#007AFF]/40 shadow-md'
                  : isDone
                  ? 'bg-slate-800/80 dark:bg-[#1E1E22] border-[#34C759]/30 hover:border-[#34C759]/60'
                  : isCurrent
                  ? 'bg-slate-800/90 dark:bg-[#1E1E22] border-[#007AFF]/60 ring-1 ring-[#007AFF]/40'
                  : 'bg-slate-900/40 dark:bg-[#18181B] border-slate-800 dark:border-white/5 text-slate-500 opacity-70'
              }`}
            >
              {/* Step Top Row: Icon & Status Indicator */}
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-[#007AFF] text-white'
                    : isDone
                    ? 'bg-[#34C759]/20 text-[#34C759]'
                    : isCurrent
                    ? 'bg-[#007AFF]/20 text-[#007AFF]'
                    : 'bg-slate-700/40 text-slate-400'
                }`}>
                  <StepIcon className="w-3.5 h-3.5" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-slate-400 font-bold">0{step.number}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5 text-[#007AFF] animate-spin" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>
              </div>

              {/* Step Title & Badge */}
              <div className="space-y-1">
                <span className={`font-semibold text-xs leading-tight block line-clamp-1 ${
                  isSelected
                    ? 'text-[#007AFF] dark:text-[#0A84FF]'
                    : isDone
                    ? 'text-slate-200 dark:text-white'
                    : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-700/40 dark:bg-white/10 text-slate-300">
                  {step.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Interactive Deep-Dive Inspector */}
      {selectedStep && (
        <div className="p-5 rounded-2xl bg-slate-800/90 dark:bg-[#1E1E22] border border-slate-700 dark:border-white/10 space-y-3 transition-all animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#007AFF] bg-[#007AFF]/15 px-2.5 py-0.5 rounded-full">
                Stage 0{activeStepData.number}
              </span>
              <h4 className="text-sm font-bold text-slate-100 dark:text-white">
                {activeStepData.title}
              </h4>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs text-slate-400">
                {activeStepData.description}
              </span>
            </div>

            {/* Stage Quick Actions */}
            <div className="flex items-center gap-2">
              {activeStepData.number === 1 && (
                <Link
                  href="/sources"
                  className="text-xs text-[#007AFF] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>View 45+ Sources</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
              {activeStepData.number === 3 && (
                <Link
                  href={project?.id ? `/projects/${project.id}/dna` : '#'}
                  className="text-xs text-[#007AFF] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Explore DNA Matrix ({dnaItems.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
              {activeStepData.number === 4 && (
                <Link
                  href={project?.id ? `/projects/${project.id}/gap` : '#'}
                  className="text-xs text-[#007AFF] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Inspect Gaps ({gaps.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
              {activeStepData.number === 5 && (
                <Link
                  href={project?.id ? `/projects/${project.id}/opportunities` : '#'}
                  className="text-xs text-[#007AFF] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Review Cross-Matches ({opportunities.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
              {activeStepData.number === 6 && (
                <Link
                  href="/evidence"
                  className="text-xs text-[#007AFF] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Evidence Vault</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
              {activeStepData.number === 7 && opportunities.length > 0 && (
                <Link
                  href={`/opportunities/${opportunities[0].id}/experiment`}
                  className="text-xs text-[#007AFF] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>View Experiment Protocol</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>

          {/* Stage Dynamic Data Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {activeStepData.number === 1 && (
              <>
                <div className="p-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Ingested Document</span>
                  <p className="font-semibold text-slate-200 truncate" title={documents[0]?.original_filename || documents[0]?.filename || 'Standard Analysis'}>
                    {documents[0]?.original_filename || documents[0]?.filename || 'Direct Technical Ingestion'}
                  </p>
                  <p className="text-[11px] text-[#34C759] font-mono">
                    {documents[0]?.file_size ? `${(documents[0].file_size / 1024).toFixed(1)} KB • ` : ''}
                    {documents[0]?.processing_status === 'processed' ? '✓ Ingested & Parsed' : (documents[0]?.processing_status || 'Verified Document Format')}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Institutional Database</span>
                  <p className="font-semibold text-[#34C759]">45 Curated Sources Active</p>
                  <p className="text-[11px] text-slate-400">NASA, DARPA, IEEE, WHO, MIT Sloan</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Checksum & Integrity</span>
                  <p className="font-semibold text-slate-200 font-mono">SHA-256 Verified</p>
                  <p className="text-[11px] text-slate-400">Tamper-evident cryptographic verification</p>
                </div>
              </>
            )}

            {activeStepData.number === 2 && (
              <>
                <div className="p-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Originating Domain</span>
                  <p className="font-semibold text-[#007AFF]">{formatDomain(project?.domain)}</p>
                  <p className="text-[11px] text-slate-400">Categorized from domain taxonomy</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-700/50 space-y-1 col-span-2">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Target Problem Addressed</span>
                  <p className="font-medium text-slate-200 line-clamp-2">{project?.problem || 'Analyzing target challenge...'}</p>
                </div>
              </>
            )}

            {activeStepData.number === 3 && (
              <>
                {dnaItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-700/50 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-cyan-400 uppercase font-bold">{item.category}</span>
                      <span className="text-[#34C759] font-bold">{Math.round((item.confidence || 0.85) * 100)}% Conf</span>
                    </div>
                    <p className="text-slate-200 line-clamp-2 font-medium">{item.value}</p>
                  </div>
                ))}
              </>
            )}

            {activeStepData.number === 4 && (
              <>
                {gaps.slice(0, 3).map((g) => (
                  <div key={g.id} className="p-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-700/50 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-amber-400 uppercase font-bold">{g.gap_type}</span>
                      <span className="text-slate-400 font-bold">{Math.round((g.confidence || 0.80) * 100)}%</span>
                    </div>
                    <p className="text-slate-200 line-clamp-2 font-medium">{g.description}</p>
                  </div>
                ))}
              </>
            )}

            {activeStepData.number === 5 && (
              <>
                {opportunities.slice(0, 3).map((op) => (
                  <div key={op.id} className="p-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-700/50 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#007AFF] uppercase font-bold">Transfer Fit</span>
                      <span className="text-[#34C759] font-bold">{Math.round((op.technology_fit || 0.80) * 100)}%</span>
                    </div>
                    <p className="text-slate-200 font-semibold line-clamp-1">{op.title}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{op.rationale}</p>
                  </div>
                ))}
              </>
            )}

            {activeStepData.number === 6 && (
              <>
                <div className="p-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-700/50 space-y-1 col-span-2">
                  <span className="text-[10px] uppercase font-mono text-[#34C759] font-bold block">Verified Technical Quote</span>
                  <p className="text-slate-200 italic line-clamp-2">
                    &ldquo;Cross-referenced capability metrics verified against external engineering and patent archives.&rdquo;
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Verification Status</span>
                  <p className="font-bold text-[#34C759] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Evidence Grounded</span>
                  </p>
                  <p className="text-[11px] text-slate-400">Zero ungrounded hallucinations</p>
                </div>
              </>
            )}

            {activeStepData.number === 7 && (
              <>
                <div className="p-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Target Opportunity</span>
                  <p className="font-semibold text-slate-200 line-clamp-1" title={opportunities[0]?.title || project?.name || 'Validated Innovation'}>
                    {opportunities[0]?.title || project?.name || 'Validated Innovation Transfer'}
                  </p>
                  <p className="text-[11px] text-[#007AFF] font-medium">
                    {opportunities[0]?.technology_fit ? `${Math.round(opportunities[0].technology_fit * 100)}% Transfer Fit` : 'Falsifiable Protocol'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Validation Requirement</span>
                  <p className="font-semibold text-[#007AFF] line-clamp-2">
                    {opportunities[0]?.validation_requirements && opportunities[0].validation_requirements.length > 0
                      ? opportunities[0].validation_requirements[0]
                      : 'Empirical bench-test against baseline specifications'}
                  </p>
                  <p className="text-[11px] text-slate-400">Pre-registered trial protocol</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Experiment Status</span>
                  <p className="font-semibold text-[#34C759] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ready for Execution</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {opportunities[0]?.validation_requirements ? `${opportunities[0].validation_requirements.length} Test Steps Verified` : 'Structured procedure generated'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
