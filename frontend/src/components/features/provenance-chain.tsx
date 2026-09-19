'use client';

import React from 'react';
import { ArrowRight, Dna, AlertCircle, Lightbulb, FileText, Database } from 'lucide-react';
import Link from 'next/link';

interface ProvenanceChainProps {
  projectId?: string | number;
  projectName?: string;
  gapId?: string | number;
  gapText?: string;
  opportunityId?: string | number;
  opportunityTitle?: string;
}

export function ProvenanceChain({
  projectId,
  projectName = 'Source Project',
  gapText = 'Identified Constraint',
  opportunityTitle = 'Cross-Domain Opportunity'
}: ProvenanceChainProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Data Provenance Chain (Traceability Audit)
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
          <Database className="w-4 h-4 text-blue-400" />
          <span className="font-semibold">{projectName}</span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:block" />

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
          <Dna className="w-4 h-4 text-purple-400" />
          <span>Innovation DNA</span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:block" />

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 max-w-xs truncate">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="truncate">{gapText}</span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:block" />

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-950/60 border border-blue-800/80 text-blue-300 font-medium max-w-xs truncate">
          <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="truncate">{opportunityTitle}</span>
        </div>
      </div>
    </div>
  );
}
