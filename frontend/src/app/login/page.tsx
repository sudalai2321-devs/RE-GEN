'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { api } from '@/lib/api';
import { Dna, Lock, Mail, User, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [email, setEmail] = useState('demo@innovationdna.ai');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('Demo Researcher');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await api.login({ email, password });
        login(res.access_token, res.user);
        router.push('/dashboard');
      } else {
        const res = await api.register({ email, password, name });
        login(res.access_token, res.user);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@innovationdna.ai');
      setPassword('admin123');
    } else {
      setEmail('demo@innovationdna.ai');
      setPassword('demo123');
    }
    setError(null);
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.12] rounded-3xl p-8 shadow-2xl backdrop-blur-xl transition-all">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#007AFF] to-[#5856D6] flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-500/25">
          <Dna className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">Innovation DNA</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Open Innovation Intelligence Platform</p>
      </div>

      {/* Tab switch */}
      <div className="flex bg-black/[0.05] dark:bg-white/[0.08] p-1 rounded-full mb-6 text-xs font-medium border border-black/[0.04] dark:border-white/[0.06]">
        <button
          type="button"
          onClick={() => { setTab('login'); setError(null); }}
          className={`flex-1 py-1.5 rounded-full transition-all duration-200 ${
            tab === 'login' 
              ? 'bg-white dark:bg-[#2c2c2e] text-black dark:text-white shadow-sm font-semibold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setTab('register'); setError(null); }}
          className={`flex-1 py-1.5 rounded-full transition-all duration-200 ${
            tab === 'register' 
              ? 'bg-white dark:bg-[#2c2c2e] text-black dark:text-white shadow-sm font-semibold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs text-[#FF3B30] flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#FF3B30] flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {tab === 'register' && (
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alex Rivera"
                className="w-full bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-black dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[var(--ios-accent,#007AFF)]"
              />
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="researcher@organization.org"
              className="w-full bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-black dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[var(--ios-accent,#007AFF)]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-black dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[var(--ios-accent,#007AFF)]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#007AFF] hover:bg-[#0071E3] text-white rounded-full font-semibold text-xs transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 mt-2"
        >
          {loading ? 'Authenticating...' : tab === 'login' ? 'Sign In to Workspace' : 'Register Account'}
        </button>
      </form>

      {/* Demo Quick Fill */}
      <div className="mt-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 text-center">
          Quick-Fill Demo Credentials
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDemoCredentials('user')}
            className="flex-1 py-2 px-3 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 rounded-xl border border-black/[0.06] dark:border-white/[0.08] text-xs font-medium transition-colors"
          >
            Demo User
          </button>
          <button
            type="button"
            onClick={() => setDemoCredentials('admin')}
            className="flex-1 py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20 text-xs font-semibold transition-colors"
          >
            Admin Root
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[var(--ios-bg)] min-h-[calc(100vh-4rem)]">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading sign in portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

