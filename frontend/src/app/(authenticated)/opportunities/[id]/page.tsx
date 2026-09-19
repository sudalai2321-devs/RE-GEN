'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { TransferabilityMatrix } from '@/components/features/transferability-matrix';
import { ProvenanceChain } from '@/components/features/provenance-chain';
import { api } from '@/lib/api';
import { Opportunity, Evidence } from '@/types';
import { 
  Lightbulb, 
  FlaskConical, 
  FileCheck, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export default function OpportunityDetailPage() {
  const params = useParams();
  const id = String(params.id);

  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [o, ev] = await Promise.all([
          api.getOpportunity(id),
          api.getOpportunityEvidence(id),
        ]);
        setOpp(o);
        setEvidenceList(ev);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400 animate-pulse">Loading Opportunity Intelligence Report...</div>;
  }

  if (!opp) {
    return <div className="p-8 text-center text-xs text-rose-400">Opportunity record not found.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <PageHeader
        title={opp.title}
        subtitle="Evidence-backed cross-domain opportunity synthesis."
        breadcrumbs={[
          { label: 'Opportunities', href: '/opportunities' },
          { label: opp.title }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href={`/opportunities/${id}/evidence`}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Evidence Chain ({evidenceList.length})</span>
            </Link>
            <Link
              href={`/opportunities/${id}/experiment`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-1.5 transition-colors"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Generate Validation Experiment</span>
            </Link>
          </div>
        }
      />

      {/* Provenance Audit Stepper */}
      <ProvenanceChain
        projectName={opp.project_name || 'Project AeroSense IoT'}
        gapText="Cold Battery & Deployment Cost"
        opportunityTitle={opp.title}
      />

      {/* Overview & Rationale */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 block mb-1">
            Executive Intelligence Summary
          </span>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {opp.rationale}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Transferable Capabilities
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {(opp.transferable_capabilities || ['Long-range wireless LPWAN telemetry', 'High-frequency vibration anomaly detection', 'Edge preprocessing reducing bandwidth']).map((c: any, i: number) => (
                <li key={i} className="flex items-center gap-2 p-2 bg-slate-800/60 rounded-lg border border-slate-700/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{typeof c === 'string' ? c : c.capability}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Non-Transferable / Boundary Factors
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {(opp.non_transferable_factors || ['Industrial equipment mounting hardware', 'High per-sensor BOM ($200+) requiring redesign', 'Manufacturing-specific ML weights']).map((f: any, i: number) => (
                <li key={i} className="flex items-center gap-2 p-2 bg-slate-800/60 rounded-lg border border-slate-700/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>{typeof f === 'string' ? f : f.factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Transferability Matrix Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">Dimensional Transferability Matrix</h3>
          <span className="text-xs text-slate-400">Independent multi-criteria analytical evaluation</span>
        </div>
        <TransferabilityMatrix />
      </div>

      {/* Validation Requirements */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          Pre-Validation Requirements (Must Test Before Deployment)
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          {(opp.validation_requirements || [
            'Test RF propagation range in target geographical topology (10km+).',
            'Conduct clinical/field sensor calibration against benchmark gold standards.',
            'Validate unit cost reduction below $40/node to verify economic sustainability.',
            'Confirm battery endurance in outdoor ambient temperature fluctuations.'
          ]).map((r: string, idx: number) => (
            <li key={idx} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/80 flex items-start gap-2">
              <span className="text-blue-400 font-mono font-bold">0{idx + 1}</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>

        <div className="pt-2 flex justify-end">
          <Link
            href={`/opportunities/${id}/experiment`}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-2 transition-colors"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Generate Formal Validation Protocol</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
