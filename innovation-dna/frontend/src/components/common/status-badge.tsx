'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const normalized = (status || '').toLowerCase().replace(/\s+/g, '_');

  const configs: Record<string, { label: string; bg: string; text: string; border: string }> = {
    validated: { label: 'Validated', bg: 'bg-[#34C759]/15', text: 'text-[#248A3D] dark:text-[#34C759]', border: 'border-[#34C759]/30' },
    completed: { label: 'Completed', bg: 'bg-[#34C759]/15', text: 'text-[#248A3D] dark:text-[#34C759]', border: 'border-[#34C759]/30' },
    dna_extracted: { label: 'DNA Extracted', bg: 'bg-[#007AFF]/15', text: 'text-[#0062CC] dark:text-[#0A84FF]', border: 'border-[#007AFF]/30' },
    gap_detected: { label: 'Gap Detected', bg: 'bg-[#AF52DE]/15', text: 'text-[#8824B7] dark:text-[#BF5AF2]', border: 'border-[#AF52DE]/30' },
    opportunity_discovery: { label: 'Opportunity Discovered', bg: 'bg-[#30B0C7]/15', text: 'text-[#1B8093] dark:text-[#40C8E0]', border: 'border-[#30B0C7]/30' },
    evidence_review: { label: 'Evidence Review', bg: 'bg-[#FF9500]/15', text: 'text-[#B26A00] dark:text-[#FF9F0A]', border: 'border-[#FF9500]/30' },
    processing: { label: 'Processing...', bg: 'bg-[#007AFF]/15', text: 'text-[#007AFF] animate-pulse', border: 'border-[#007AFF]/30' },
    running: { label: 'Running', bg: 'bg-[#007AFF]/15', text: 'text-[#007AFF] animate-pulse', border: 'border-[#007AFF]/30' },
    draft: { label: 'Draft', bg: 'bg-black/5 dark:bg-white/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-black/10 dark:border-white/15' },
    queued: { label: 'Queued', bg: 'bg-[#FF9500]/15', text: 'text-[#B26A00] dark:text-[#FF9F0A]', border: 'border-[#FF9500]/30' },
    failed: { label: 'Failed Attempt', bg: 'bg-[#FF3B30]/15', text: 'text-[#CC2F26] dark:text-[#FF453A]', border: 'border-[#FF3B30]/30' },
    verified: { label: 'Verified', bg: 'bg-[#34C759]/15', text: 'text-[#248A3D] dark:text-[#34C759]', border: 'border-[#34C759]/30' },
    needs_review: { label: 'Needs Review', bg: 'bg-[#FF9500]/15', text: 'text-[#B26A00] dark:text-[#FF9F0A]', border: 'border-[#FF9500]/30' },
    active: { label: 'Active', bg: 'bg-[#007AFF]/15', text: 'text-[#0062CC] dark:text-[#0A84FF]', border: 'border-[#007AFF]/30' },
  };

  const config = configs[normalized] || {
    label: status.replace(/_/g, ' '),
    bg: 'bg-black/5 dark:bg-white/10',
    text: 'text-slate-600 dark:text-slate-300',
    border: 'border-black/10 dark:border-white/15'
  };

  const px = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${px} ${config.bg} ${config.text} ${config.border} backdrop-blur-sm shadow-sm`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {config.label}
    </span>
  );
}

