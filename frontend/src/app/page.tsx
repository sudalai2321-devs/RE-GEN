'use client';

import Link from 'next/link';
import { 
  Dna, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

export default function LandingPage() {
  const steps = [
    { title: 'Collect', desc: 'Documented failed projects, technical reports, and patents' },
    { title: 'Understand', desc: 'Original intent, hypotheses, and target application domain' },
    { title: 'Decode', desc: 'Extract capabilities, constraints, failure conditions & DNA' },
    { title: 'Detect Gap', desc: 'Isolate documented limitations vs derived hypotheses' },
    { title: 'Discover', desc: 'Cross-match transferable capabilities with real problems' },
    { title: 'Verify', desc: 'Trace every factual claim to verified excerpts and citations' },
    { title: 'Validate', desc: 'Generate testable validation experiment protocols' },
  ];

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 border-b border-black/[0.06] dark:border-white/[0.08] bg-gradient-to-b from-transparent via-black/[0.02] dark:via-white/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--ios-accent-tint,rgba(0,122,255,0.1))] border border-[var(--ios-accent,#007AFF)]/20 text-[var(--ios-accent,#007AFF)] text-xs font-semibold uppercase tracking-wider mb-8 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Innovation Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-black dark:text-white tracking-tight leading-none max-w-4xl mx-auto">
            INNOVATION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007AFF] via-[#5856D6] to-[#34C759]">DNA</span>
          </h1>

          <p className="mt-4 text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
            From Failed Ideas to New Possibilities
          </p>

          <p className="mt-6 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Decode what an innovation attempt could do, understand where it failed, discover where its capabilities still matter, and validate cross-domain opportunities backed by traceable evidence.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/analyze"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#007AFF] hover:bg-[#0071E3] text-white font-semibold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Analyze a Failed Innovation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/opportunities"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-black dark:text-white font-semibold text-base border border-black/10 dark:border-white/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Compass className="w-4 h-4 text-[var(--ios-accent,#007AFF)]" />
              <span>Explore Opportunities</span>
            </Link>

            <Link
              href="/how-it-works"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white font-medium text-sm transition-colors"
            >
              How It Works
            </Link>
          </div>

          {/* Verification Badge */}
          <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#34C759]" />
            <span>Anti-Hallucination Core: Every claim traces to verified primary excerpts</span>
          </div>
        </div>
      </section>

      {/* Visual Pipeline */}
      <section className="py-20 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ios-accent,#007AFF)]">The Traceable Process</h2>
            <p className="text-2xl sm:text-3xl font-bold text-black dark:text-white mt-1">End-to-End Analytical Pipeline</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
            {steps.map((step, idx) => (
              <div
                key={step.title}
                className="bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-md dark:hover:border-white/[0.16] transition-all"
              >
                <div>
                  <div className="w-7 h-7 rounded-xl bg-[var(--ios-accent-tint,rgba(0,122,255,0.1))] text-[var(--ios-accent,#007AFF)] border border-[var(--ios-accent,#007AFF)]/20 flex items-center justify-center text-xs font-bold font-mono mb-3">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-black dark:text-white text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Distinction Section: Innovation Intelligence vs Idea Generator */}
      <section className="py-20 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ios-accent,#007AFF)]">Why Innovation DNA Matters</h2>
            <p className="text-3xl font-bold text-black dark:text-white mt-1">Innovation Intelligence vs. Generic Idea Generator</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5 text-[#FF3B30] font-bold text-lg border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
                <AlertTriangle className="w-5 h-5" />
                <span>Generic "Idea Generator"</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF3B30] font-bold">✕</span>
                  <span>Asks "Give me a cool new startup idea" with zero historical grounding.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF3B30] font-bold">✕</span>
                  <span>Hallucinates market demand, unproven technology capabilities, and fake stats.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF3B30] font-bold">✕</span>
                  <span>Repeats documented failures without analyzing why they failed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF3B30] font-bold">✕</span>
                  <span>Provides unstructured, free-form text advice that cannot be tested.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-[#1c1c1e] border border-[var(--ios-accent,#007AFF)]/30 rounded-3xl p-6 space-y-4 shadow-lg shadow-blue-500/5">
              <div className="flex items-center gap-2.5 text-[var(--ios-accent,#007AFF)] font-bold text-lg border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
                <Dna className="w-5 h-5 text-[var(--ios-accent,#007AFF)]" />
                <span>Innovation DNA Intelligence</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#34C759] flex-shrink-0 mt-0.5" />
                  <span>Decodes proven capabilities and explicit constraints from verified documents.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#34C759] flex-shrink-0 mt-0.5" />
                  <span>Strict anti-hallucination guardrails: every claim links to source excerpts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#34C759] flex-shrink-0 mt-0.5" />
                  <span>Maps transferable capabilities across unrelated domains with real problems.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#34C759] flex-shrink-0 mt-0.5" />
                  <span>Produces structured, falsifiable validation experiment protocols with metrics.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
            Ready to decode innovations into evidence-backed opportunities?
          </h3>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Test the golden demo workflow or upload your own documented technical post-mortems.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/analyze"
              className="px-8 py-3 bg-[#007AFF] hover:bg-[#0071E3] text-white font-semibold rounded-full text-sm transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              Start Analysis Now
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-black dark:text-white font-semibold rounded-full text-sm transition-colors border border-black/10 dark:border-white/10 active:scale-[0.98]"
            >
              Open Live Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

