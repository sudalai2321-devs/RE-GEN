'use client';

import React from 'react';
import { FileCheck, AlertCircle, HelpCircle } from 'lucide-react';

interface EvidenceBadgeProps {
  count?: number;
  status?: string;
  onClick?: () => void;
}

export function EvidenceBadge({ count = 0, status = 'verified', onClick }: EvidenceBadgeProps) {
  const isClickable = !!onClick;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
        status === 'verified'
          ? 'bg-emerald-950/30 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/40'
          : status === 'needs_review'
          ? 'bg-amber-950/30 text-amber-300 border-amber-800/50 hover:bg-amber-900/40'
          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
      } ${!isClickable ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <FileCheck className="w-3.5 h-3.5" />
      <span>{count > 0 ? `${count} Evidence Sources` : 'Verified Source'}</span>
    </button>
  );
}
