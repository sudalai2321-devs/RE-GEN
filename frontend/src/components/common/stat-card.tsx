'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  change?: string;
  variant?: 'blue' | 'purple' | 'emerald' | 'amber' | 'cyan' | 'slate';
  description?: string;
}

export function StatCard({ label, value, icon: Icon, change, variant = 'blue', description }: StatCardProps) {
  const colorStyles = {
    blue: 'border-[#007AFF]/20 bg-[#007AFF]/10 text-[#007AFF]',
    purple: 'border-[#AF52DE]/20 bg-[#AF52DE]/10 text-[#AF52DE]',
    emerald: 'border-[#34C759]/20 bg-[#34C759]/10 text-[#34C759]',
    amber: 'border-[#FF9500]/20 bg-[#FF9500]/10 text-[#FF9500]',
    cyan: 'border-[#30B0C7]/20 bg-[#30B0C7]/10 text-[#30B0C7]',
    slate: 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300',
  }[variant];

  return (
    <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] dark:hover:border-white/[0.16] transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-3xl font-extrabold text-black dark:text-white tracking-tight">{value}</p>
          {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        <div className={`p-3 rounded-2xl border ${colorStyles}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {change && (
        <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center text-xs text-slate-500 dark:text-slate-400">
          <span className="text-[#34C759] font-semibold mr-1.5">{change}</span>
          <span>vs baseline benchmark</span>
        </div>
      )}
    </div>
  );
}

