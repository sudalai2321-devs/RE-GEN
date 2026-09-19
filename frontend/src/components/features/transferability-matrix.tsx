'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface MatrixRow {
  dimension: string;
  assessment: 'High' | 'Medium' | 'Low';
  rationale: string;
}

interface TransferabilityMatrixProps {
  dimensions?: MatrixRow[];
}

export function TransferabilityMatrix({ dimensions }: TransferabilityMatrixProps) {
  const defaultRows: MatrixRow[] = [
    { dimension: 'Technology Transferability', assessment: 'High', rationale: 'Core algorithmic and sensing capabilities map directly to target problem data modalities.' },
    { dimension: 'Operating Environment', assessment: 'Medium', rationale: 'Target environment requires weather-proof casing and extended ambient tolerance.' },
    { dimension: 'Data Compatibility', assessment: 'High', rationale: 'Time-series telemetry format requires minimal transformation for target inference.' },
    { dimension: 'Infrastructure Fit', assessment: 'Medium', rationale: 'Requires LPWAN gateway deployment within 10km radius of monitoring points.' },
    { dimension: 'Cost Feasibility', assessment: 'Low', rationale: 'Initial bill of materials exceeds target smallholder budget without assembly optimization.' },
    { dimension: 'Operational Context', assessment: 'High', rationale: 'Day-to-day workflow matches existing technician capabilities.' },
    { dimension: 'Evidence Strength', assessment: 'High', rationale: 'Backed by 4 peer-reviewed publications and verified benchmark datasets.' },
  ];

  const rows = dimensions && dimensions.length > 0 ? dimensions : defaultRows;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-800/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <th className="py-3 px-4">Dimension</th>
            <th className="py-3 px-4">Transfer Fit</th>
            <th className="py-3 px-4">Evidence-Backed Analytical Rationale</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {rows.map((r, i) => {
            const fit = r.assessment;
            const badge =
              fit === 'High' ? (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-medium">
                  <CheckCircle className="w-3 h-3" /> High
                </span>
              ) : fit === 'Medium' ? (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/60 font-medium">
                  <AlertTriangle className="w-3 h-3" /> Medium
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-rose-950/60 text-rose-400 border border-rose-800/60 font-medium">
                  <XCircle className="w-3 h-3" /> Low
                </span>
              );

            return (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">{r.dimension}</td>
                <td className="py-3.5 px-4 whitespace-nowrap">{badge}</td>
                <td className="py-3.5 px-4 text-xs text-slate-400 leading-relaxed">{r.rationale}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
