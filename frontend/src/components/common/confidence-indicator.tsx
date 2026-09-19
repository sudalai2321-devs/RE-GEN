'use client';

import React from 'react';

interface ConfidenceIndicatorProps {
  score: number; // 0 to 1 or 0 to 100
  label?: string;
}

export function ConfidenceIndicator({ score, label }: ConfidenceIndicatorProps) {
  const pct = score > 1 ? Math.min(100, Math.round(score)) : Math.min(100, Math.round(score * 100));

  const getColor = (p: number) => {
    if (p >= 75) return 'bg-emerald-500 text-emerald-400';
    if (p >= 50) return 'bg-blue-500 text-blue-400';
    if (p >= 30) return 'bg-amber-500 text-amber-400';
    return 'bg-rose-500 text-rose-400';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{label || 'Evidence Confidence'}</span>
        <span className="font-semibold text-slate-200">{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(pct).split(' ')[0]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
