'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Dna, LogOut, User as UserIcon, Shield, Layers, Compass, HelpCircle } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-700 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-100 hover:opacity-85 transition-opacity">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#007AFF] to-[#5856D6] flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Dna className="w-5 h-5" />
            </div>
            <span className="font-semibold tracking-tight">
              INNOVATION <span className="text-[var(--ios-accent,#007AFF)]">DNA</span>
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[var(--ios-accent-tint,rgba(0,122,255,0.1))] text-[var(--ios-accent,#007AFF)] border border-[var(--ios-accent,#007AFF)]/25 ml-1">
              RE:GEN
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            <Link
              href="/how-it-works"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>How It Works</span>
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
                >
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/opportunities"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
                >
                  <Compass className="w-4 h-4 text-slate-400" />
                  <span>Opportunities</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2.5">
              {user.role?.toLowerCase() === 'admin' && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 font-semibold"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                <UserIcon className="w-3.5 h-3.5 text-[var(--ios-accent,#007AFF)]" />
                <span className="font-semibold text-slate-100">{user.name}</span>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-800 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-400 hover:text-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-800 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/login?tab=register"
                className="text-xs font-semibold bg-[#007AFF] hover:bg-[#0071E3] text-white px-4 py-1.5 rounded-full shadow-sm active:scale-95 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
