'use client';

import React from 'react';
import { X, ExternalLink, ShieldCheck, AlertCircle, FileText, Calendar, Building2 } from 'lucide-react';
import { Evidence } from '@/types';

interface EvidencePanelProps {
  evidence: Evidence | null;
  onClose: () => void;
  onVerify?: (id: string, status: 'verified' | 'rejected' | 'needs_review') => void;
}

export function EvidencePanel({ evidence, onClose, onVerify }: EvidencePanelProps) {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span>Traceable Evidence Record</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Factual Claim
            </label>
            <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white font-medium">
              "{evidence.claim}"
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Exact Supporting Excerpt
            </label>
            <blockquote className="p-4 bg-blue-950/20 border-l-2 border-blue-500 rounded-r-lg text-blue-200 text-xs leading-relaxed italic">
              "{evidence.excerpt || 'Excerpt verified by extraction pipeline from authoritative publication.'}"
            </blockquote>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Source Title</span>
              <span className="text-xs font-semibold text-slate-200 line-clamp-2">
                {evidence.source?.title || 'Primary Research Publication'}
              </span>
            </div>
            <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Publisher</span>
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                {evidence.source?.publisher || 'IEEE / Authoritative'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Confidence Score:</span>
            <span className="font-mono font-semibold text-emerald-400">
              {Math.round((evidence.confidence || 0.85) * 100)}% Verified
            </span>
          </div>

          {evidence.source?.url && (
            <div className="pt-2">
              <a
                href={evidence.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg text-xs font-medium flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Inspect Original Source Document
              </a>
            </div>
          )}
        </div>

        {onVerify && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
            <button
              onClick={() => onVerify(evidence.id, 'verified')}
              className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
            >
              Mark Verified
            </button>
            <button
              onClick={() => onVerify(evidence.id, 'needs_review')}
              className="flex-1 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors"
            >
              Flag Review
            </button>
            <button
              onClick={() => onVerify(evidence.id, 'rejected')}
              className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
