'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { FileUpload } from '@/components/features/file-upload';
import { api } from '@/lib/api';
import { 
  Upload, 
  FileEdit, 
  Search, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function AnalyzePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upload' | 'manual' | 'sources'>('upload');
  
  // Mode A: File Upload
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProjectName, setUploadProjectName] = useState('');
  const [uploadDomain, setUploadDomain] = useState('');
  
  // Mode B: Manual
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [objective, setObjective] = useState('');
  const [problem, setProblem] = useState('');
  const [outcome, setOutcome] = useState('');
  const [failureSummary, setFailureSummary] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  // Mode C: Public Search Catalog
  const [searchQuery, setSearchQuery] = useState('predictive maintenance');
  const [importLoading, setImportLoading] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Catalog records for Mode C
  const catalogRecords = [
    {
      id: 'cat-1',
      title: 'Project AeroSense IoT — Vibration Monitoring',
      publisher: 'IEEE Sensors Journal',
      date: '2022',
      domain: 'Industrial IoT',
      snippet: 'High deployment cost ($200+/sensor) and cold temperature battery degradation prevented scaling beyond pilot manufacturing plants.',
      whyRelevant: 'Demonstrated high 87% vibration anomaly accuracy; capabilities transferable to structural and healthcare sensing.'
    },
    {
      id: 'cat-2',
      title: 'Google Glass Explorer Post-Mortem',
      publisher: 'MIT Technology Review',
      date: '2015',
      domain: 'Consumer AR',
      snippet: 'Failed in consumer market due to social resistance and privacy concerns, but HUD waveguide optics proved valuable in enterprise workflows.',
      whyRelevant: 'Hands-free display capabilities applicable to medical surgery and construction safety overlays.'
    },
    {
      id: 'cat-3',
      title: 'Microsoft Kinect Depth Sensing Platform',
      publisher: 'ACM Computing Surveys',
      date: '2017',
      domain: 'Motion Sensing',
      snippet: 'Discontinued for gaming console due to room size constraints, but 30fps markerless depth tracking holds significant value.',
      whyRelevant: 'Can detect elderly falls non-invasively without requiring wearable panic pendants.'
    }
  ];

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadProjectName) {
      setError('Please provide a project name.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      let resolvedDomain = uploadDomain.trim();
      if (!resolvedDomain) {
        const lowerName = (uploadProjectName + ' ' + (uploadedFile?.name || '')).toLowerCase();
        if (lowerName.includes('cricket') || lowerName.includes('sport') || lowerName.includes('football')) {
          resolvedDomain = 'Sports Analytics';
        } else if (lowerName.includes('sar') || lowerName.includes('satellite') || lowerName.includes('radar')) {
          resolvedDomain = 'Space Technology';
        } else if (lowerName.includes('celestia') || lowerName.includes('hackathon')) {
          resolvedDomain = 'Open Innovation / Hackathon';
        } else if (lowerName.includes('battery') || lowerName.includes('solar') || lowerName.includes('energy')) {
          resolvedDomain = 'Clean Energy';
        } else if (lowerName.includes('health') || lowerName.includes('medical') || lowerName.includes('cancer')) {
          resolvedDomain = 'Biomedical';
        } else {
          resolvedDomain = 'General Innovation';
        }
      }

      const proj = await api.createProject({
        name: uploadProjectName,
        domain: resolvedDomain,
        objective: `Analyze technical capabilities, constraints, and cross-domain transfer potential of ${uploadProjectName}.`,
        problem: `Identify innovation gaps and transferable capabilities from ${uploadProjectName} in the ${resolvedDomain} domain.`,
      });

      if (uploadedFile) {
        await api.uploadDocument(String(proj.id), uploadedFile);
      }

      // This now runs synchronously — analysis completes before response returns
      await api.analyzeProject(String(proj.id));
      router.push(`/projects/${proj.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to process project.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError('Project name is required.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const proj = await api.createProject({
        name,
        domain,
        objective,
        problem,
        outcome,
        failure_summary: failureSummary,
      });

      await api.analyzeProject(String(proj.id));
      router.push(`/projects/${proj.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportCatalog = async (item: typeof catalogRecords[0]) => {
    setImportLoading(item.id);
    setError(null);

    try {
      const proj = await api.createProject({
        name: item.title,
        domain: item.domain,
        objective: `Analyze documented outcomes from ${item.publisher} (${item.date}).`,
        problem: item.snippet,
        failure_summary: item.snippet,
      });

      await api.analyzeProject(String(proj.id));
      router.push(`/projects/${proj.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to import catalog project.');
    } finally {
      setImportLoading(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Analyze Documented Innovation"
        subtitle="Ingest past innovation attempts, extract their Innovation DNA, and detect cross-domain possibilities."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Analyze' }]}
      />

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* iOS Segmented Control */}
      <div className="flex bg-slate-800 border border-slate-700 p-1.5 rounded-full gap-2">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'upload'
              ? 'bg-[#007AFF] text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Mode A: Upload Document</span>
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'manual'
              ? 'bg-[#007AFF] text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
          }`}
        >
          <FileEdit className="w-4 h-4" />
          <span>Mode B: Manual Entry</span>
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'sources'
              ? 'bg-[#007AFF] text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Mode C: Public Sources</span>
        </button>
      </div>

      {/* Mode A: Upload */}
      {activeTab === 'upload' && (
        <form onSubmit={handleUploadSubmit} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Project / Innovation Name *
              </label>
              <input
                type="text"
                required
                value={uploadProjectName}
                onChange={(e) => setUploadProjectName(e.target.value)}
                placeholder="e.g. Project AeroSense IoT Vibration Monitoring"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-[#007AFF] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Originating Domain / Industry
              </label>
              <input
                type="text"
                value={uploadDomain}
                onChange={(e) => setUploadDomain(e.target.value)}
                placeholder="e.g. Space Technology, Sports Analytics, AI Software (or leave blank)"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-[#007AFF] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Project Documentation File
            </label>
            <FileUpload
              onFileSelect={(file) => setUploadedFile(file)}
              accept=".pdf,.docx,.pptx,.txt,.md"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#007AFF] hover:bg-[#0071E3] text-white rounded-full text-xs font-semibold shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing & Decoding DNA...</span>
                </>
              ) : (
                <>
                  <span>Analyze Project & Extract DNA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Mode B: Manual Entry */}
      {activeTab === 'manual' && (
        <form onSubmit={handleManualSubmit} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">Project Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Solyndra Cylindrical Solar"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-[#007AFF] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">Industry / Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. Clean Energy, Solar Photovoltaics"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-[#007AFF] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">Original Objective</label>
            <textarea
              rows={2}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What did the original innovation attempt to accomplish?"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-slate-100 text-xs focus:outline-none focus:border-[#007AFF] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">Problem Addressed</label>
            <textarea
              rows={2}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="What real-world problem or constraint was being targeted?"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-slate-100 text-xs focus:outline-none focus:border-[#007AFF] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">Observed Outcome</label>
              <textarea
                rows={3}
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder="What technically worked during prototyping or deployment?"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-slate-100 text-xs focus:outline-none focus:border-[#007AFF] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">Failure / Boundary Limitation</label>
              <textarea
                rows={3}
                value={failureSummary}
                onChange={(e) => setFailureSummary(e.target.value)}
                placeholder="Why did it fail or stall (cost, environment, battery, infrastructure, adoption)?"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-slate-100 text-xs focus:outline-none focus:border-[#007AFF] transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#007AFF] hover:bg-[#0071E3] text-white rounded-full text-xs font-semibold shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Analyzing Project...' : 'Create Project & Run Analysis'}
            </button>
          </div>
        </form>
      )}

      {/* Mode C: Public Sources */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-700 rounded-full p-2.5 px-4 flex items-center gap-3 shadow-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter documented innovation records..."
              className="bg-transparent border-none text-slate-100 text-xs focus:outline-none flex-1 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {catalogRecords.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-700 rounded-3xl p-5 hover:border-slate-600 transition-colors space-y-3 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-100 text-sm">{item.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Building2 className="w-3.5 h-3.5 text-[var(--ios-accent,#007AFF)]" />
                        {item.publisher}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 font-mono text-[10px] font-semibold">
                        {item.domain}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleImportCatalog(item)}
                    disabled={importLoading === item.id}
                    className="px-4 py-2 bg-[#007AFF] hover:bg-[#0071E3] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm whitespace-nowrap active:scale-95 disabled:opacity-50"
                  >
                    {importLoading === item.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Importing...</span>
                      </>
                    ) : (
                      <>
                        <span>Import & Analyze</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800 p-3 rounded-2xl border border-slate-700">
                  <strong className="text-slate-400">Documented Outcome: </strong>
                  {item.snippet}
                </p>

                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cross-domain match hypothesis: {item.whyRelevant}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
