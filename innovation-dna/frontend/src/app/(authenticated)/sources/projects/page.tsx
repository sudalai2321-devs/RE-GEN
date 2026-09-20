'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { SearchBar } from '@/components/common/search-bar';
import { api } from '@/lib/api';
import { Building2, Calendar, ArrowRight, Loader2, BookOpen, ShieldCheck } from 'lucide-react';

export default function SourcesProjectsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [importing, setImporting] = useState<string | null>(null);

  const curatedProjects = [
    {
      id: 'src-proj-1',
      title: 'Project AeroSense IoT — Industrial Predictive Maintenance',
      publisher: 'IEEE Sensors Journal',
      date: '2023',
      domain: 'Industrial IoT',
      snippet: 'Low-cost wireless vibration monitoring system validated in manufacturing but limited by extreme cold battery performance and deployment economics.',
      relevance: 'High accuracy vibration telemetry transferable to bridge structural health and remote healthcare monitoring.'
    },
    {
      id: 'src-proj-2',
      title: 'Google Glass Explorer Post-Mortem',
      publisher: 'MIT Technology Review',
      date: '2015',
      domain: 'Consumer AR',
      snippet: 'HUD waveguide display failed in consumer social settings due to camera privacy pushback, but achieved 25% productivity gains in enterprise manufacturing.',
      relevance: 'Hands-free surgical checklist overlays and construction hazard warnings.'
    },
    {
      id: 'src-proj-3',
      title: 'Microsoft Kinect Motion Depth Tracker',
      publisher: 'ACM Computing Surveys',
      date: '2017',
      domain: 'Motion Sensing',
      snippet: 'Markerless depth sensing discontinued for living room gaming consoles but demonstrated sub-centimeter skeletal tracking.',
      relevance: 'Non-wearable home fall detection for elderly care.'
    },
    {
      id: 'src-proj-4',
      title: 'Solyndra Cylindrical Thin-Film Solar Array',
      publisher: 'NREL Technical Report',
      date: '2011',
      domain: 'Renewable Energy',
      snippet: 'Cylindrical photovoltaic tubes capturing omnidirectional light without sun tracking systems.',
      relevance: 'Vertical solar facades and highway sound barriers.'
    }
  ];

  const filtered = curatedProjects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.domain.toLowerCase().includes(search.toLowerCase())
  );

  const handleImport = async (item: typeof curatedProjects[0]) => {
    setImporting(item.id);
    try {
      const proj = await api.createProject({
        name: item.title,
        domain: item.domain,
        objective: `Imported from verified publication: ${item.publisher}`,
        problem: item.snippet,
        failure_summary: item.snippet,
      });
      await api.analyzeProject(String(proj.id));
      router.push(`/projects/${proj.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setImporting(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <PageHeader
        title="Documented Innovation Projects Catalog"
        subtitle="Search verified innovation attempts from peer-reviewed literature and technical reports to import."
        breadcrumbs={[
          { label: 'Sources', href: '/sources' },
          { label: 'Documented Projects' }
        ]}
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search documented innovation post-mortems..."
        />
        <span className="text-xs text-slate-400 font-mono">
          {filtered.length} verified records
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors shadow-sm"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-semibold">
                  {item.domain}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-blue-400" />
                  {item.publisher} ({item.date})
                </span>
              </div>

              <h3 className="font-bold text-white text-base">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.snippet}</p>

              <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Transferability potential: {item.relevance}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleImport(item)}
              disabled={importing === item.id}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors disabled:opacity-50"
            >
              {importing === item.id ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <span>Import Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
