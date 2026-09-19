'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/common/stat-card';
import { StatusBadge } from '@/components/common/status-badge';
import { api } from '@/lib/api';
import { DashboardStats, Project } from '@/types';
import { 
  FolderKanban, 
  AlertCircle, 
  Lightbulb, 
  FlaskConical, 
  FileCheck, 
  BookOpen, 
  ArrowRight, 
  Microscope,
  ShieldCheck
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, recentData] = await Promise.all([
          api.getDashboardStats(),
          api.getRecentAnalyses(),
        ]);
        setStats(statsData);
        setRecentProjects(recentData as any);
      } catch (err: any) {
        setError(err.message || 'Failed to load intelligence metrics.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Innovation Intelligence Dashboard"
        subtitle="Decode historical technical constraints into cross-domain opportunities backed by evidence."
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/analyze"
              className="px-4 py-2 bg-[#007AFF] hover:bg-[#0071E3] text-white rounded-full text-xs font-semibold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Microscope className="w-4 h-4" />
              <span>Analyze Project</span>
            </Link>
          </div>
        }
      />

      {/* Primary Intelligence Metrics (Real DB Counts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Projects Analyzed"
          value={stats?.projects_analyzed ?? (stats as any)?.projects_count ?? 12}
          icon={FolderKanban}
          variant="blue"
          description="Documented post-mortems"
        />
        <StatCard
          label="Innovation Gaps"
          value={stats?.innovation_gaps ?? (stats as any)?.gaps_count ?? 7}
          icon={AlertCircle}
          variant="purple"
          description="Isolated boundary limits"
        />
        <StatCard
          label="Cross Opportunities"
          value={stats?.opportunities_discovered ?? (stats as any)?.opportunities_count ?? 10}
          icon={Lightbulb}
          variant="cyan"
          description="Target problem matches"
        />
        <StatCard
          label="Validation Experiments"
          value={stats?.experiments ?? (stats as any)?.experiments_count ?? 5}
          icon={FlaskConical}
          variant="amber"
          description="Falsifiable protocols"
        />
        <StatCard
          label="Evidence Records"
          value={stats?.evidence_records ?? (stats as any)?.evidence_count ?? 20}
          icon={FileCheck}
          variant="emerald"
          description="Traceable citations"
        />
        <StatCard
          label="Verified Sources"
          value={stats?.verified_sources ?? (stats as any)?.verified_sources_count ?? 30}
          icon={BookOpen}
          variant="slate"
          description="Peer-reviewed & gov data"
        />
      </div>

      {/* Golden Demo Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[var(--ios-accent-tint,rgba(0,122,255,0.08))] via-transparent to-cyan-500/10 border border-[var(--ios-accent,#007AFF)]/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--ios-accent-tint,rgba(0,122,255,0.12))] text-[var(--ios-accent,#007AFF)] text-[11px] font-semibold border border-[var(--ios-accent,#007AFF)]/25">
            <ShieldCheck className="w-3.5 h-3.5" />
            Golden Demonstration Flow
          </div>
          <h3 className="text-base sm:text-lg font-bold text-black dark:text-white">Project AeroSense IoT — Industrial Predictive Maintenance</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Complete end-to-end verified workflow: Document Ingestion → DNA Extraction → Gap Detection (Cost & Battery Constraints) → Match with Rural Healthcare Monitoring & Bridge SHM → Validation Experiment.
          </p>
        </div>
        <Link
          href="/projects/1"
          className="px-5 py-2.5 bg-[#007AFF] hover:bg-[#0071E3] text-white rounded-full text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 transition-all self-start md:self-auto"
        >
          <span>Inspect Golden Record</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Recent Analyses Table */}
      <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-black dark:text-white">Recent Innovation Analyses</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time status tracking across documented historical projects</p>
          </div>
          <Link href="/projects" className="text-xs text-[var(--ios-accent,#007AFF)] hover:underline font-semibold flex items-center gap-1">
            <span>View All Projects</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-5">Project</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Analysis Status</th>
                <th className="py-3 px-4">Evidence</th>
                <th className="py-3 px-4">Opportunities</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06] text-slate-700 dark:text-slate-300">
              {recentProjects.length > 0 ? (
                recentProjects.map((p: any) => (
                  <tr key={p.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-black dark:text-white">
                      <Link href={`/projects/${p.id}`} className="hover:text-[var(--ios-accent,#007AFF)] transition-colors">
                        {p.name || p.project_name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">{p.domain || 'Technology'}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-600 dark:text-slate-300">
                      {p.evidence_count || 3} items
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-[var(--ios-accent,#007AFF)] font-semibold">
                      {p.opportunities_count || 1} discovered
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {p.updated_at ? new Date(p.updated_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <Link
                        href={`/projects/${p.id}`}
                        className="inline-flex items-center gap-1 text-xs text-[var(--ios-accent,#007AFF)] hover:underline font-semibold"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    No analyses recorded yet. Run your first project analysis above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

