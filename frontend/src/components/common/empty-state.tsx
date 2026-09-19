'use client';

import React from 'react';
import { FolderSearch } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionText, actionHref, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 bg-slate-900 border border-slate-800 rounded-2xl">
      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
        <FolderSearch className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">{description}</p>
      {actionText && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
}
