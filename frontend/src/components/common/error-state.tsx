'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'An error occurred while loading data.', onRetry }: ErrorStateProps) {
  return (
    <div className="p-6 bg-rose-950/20 border border-rose-900/40 rounded-xl text-center">
      <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
      <h4 className="text-sm font-semibold text-rose-300 mb-1">Analysis Stream Error</h4>
      <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Operation
        </button>
      )}
    </div>
  );
}
