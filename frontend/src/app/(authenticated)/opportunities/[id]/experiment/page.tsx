'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api';
import { Experiment, Opportunity } from '@/types';
import { 
  FlaskConical, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  FileText,
  Save,
  Loader2
} from 'lucide-react';

export default function OpportunityExperimentPage() {
  const params = useParams();
  const id = String(params.id);

  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState<string>('planned');
  const [resultsNotes, setResultsNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [o, exp] = await Promise.all([
          api.getOpportunity(id),
          api.getExperiment(id).catch(() => null),
        ]);
        setOpp(o);
        if (exp) {
          setExperiment(Array.isArray(exp) ? exp[0] : exp);
          setStatus((Array.isArray(exp) ? exp[0] : exp)?.status || 'planned');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleGenerateExperiment = async () => {
    setGenerating(true);
    try {
      const exp = await api.generateExperiment(id);
      setExperiment(exp);
      setStatus(exp.status || 'planned');
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experiment) return;

    try {
      await api.updateExperiment(String(experiment.id), { status: status as any });
      if (resultsNotes) {
        await api.addExperimentResult(String(experiment.id), {
          result_summary: resultsNotes,
          status: 'recorded'
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Validation Experiment Protocol"
        subtitle={`Falsifiable testing methodology for: ${opp?.title || 'Opportunity'}`}
        breadcrumbs={[
          { label: 'Opportunities', href: '/opportunities' },
          { label: opp?.title || 'Opportunity', href: `/opportunities/${id}` },
          { label: 'Experiment' }
        ]}
      />

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Experiment protocol and recorded results saved successfully!</span>
        </div>
      )}

      {!experiment ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-950/60 text-blue-400 border border-blue-800/60 flex items-center justify-center mx-auto">
            <FlaskConical className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Validation Protocol Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Generate an AI-assisted, falsifiable validation protocol specifying test setup, procedures, independent/dependent variables, and explicit failure criteria.
          </p>
          <div className="pt-2">
            <button
              onClick={handleGenerateExperiment}
              disabled={generating}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-2 mx-auto transition-colors disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Experiment Protocol...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Validation Experiment Protocol</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Experiment Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/60 font-semibold flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" />
                Formal Validation Protocol
              </span>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {experiment.expected_duration || '4-6 weeks'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  {experiment.expected_cost || '$2,000-5,000'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-blue-400 block mb-1">
                Falsifiable Hypothesis
              </label>
              <h3 className="text-base font-bold text-white leading-relaxed p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                "{experiment.hypothesis}"
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Required Materials & Hardware
                </label>
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {experiment.materials || 'Hardware prototype nodes, RF gateway, diagnostic references.'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Data & Inputs Required
                </label>
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {experiment.data_required || 'Continuous telemetry stream at 1-minute sampling intervals.'}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Testing Procedure & Variables
              </label>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {experiment.procedure || '1. Configure prototype gateway\n2. Deploy sensor nodes at baseline distances\n3. Run 48h telemetry collection'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-1.5">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                  Success Criteria (Validation Benchmark)
                </span>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  {experiment.success_criteria || '>90% telemetry delivery rate with error margin <3%.'}
                </p>
              </div>

              <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-1.5">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">
                  Failure Criteria (Refutation Threshold)
                </span>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {experiment.failure_criteria || '<80% transmission delivery rate or critical data drop.'}
                </p>
              </div>
            </div>
          </div>

          {/* Workflow Status & Results Recorder */}
          <form onSubmit={handleSaveResults} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-bold text-white">Record Validation Results & Update Status</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Experiment Workflow Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="planned">Planned (Protocol Drafted)</option>
                  <option value="in_progress">In Progress (Testing Active)</option>
                  <option value="completed">Completed (Data Collected)</option>
                  <option value="validated">Validated (Success Threshold Met)</option>
                  <option value="needs_revision">Needs Revision (Refined Protocol)</option>
                  <option value="rejected">Rejected (Hypothesis Refuted)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Observed Results & Field Notes</label>
              <textarea
                rows={3}
                value={resultsNotes}
                onChange={(e) => setResultsNotes(e.target.value)}
                placeholder="Document observed metrics, packet delivery rates, measured deviations, or anomalies..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Experiment Updates</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
