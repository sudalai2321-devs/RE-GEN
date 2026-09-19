'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, Theme, AccentColor } from '@/components/providers/theme-provider';
import { Sun, Moon, Laptop, Palette, Check } from 'lucide-react';

export function ThemeToggle() {
  const { theme, resolvedTheme, accent, setTheme, setAccent } = useTheme();
  const [accentOpen, setAccentOpen] = useState(false);
  const accentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accentRef.current && !accentRef.current.contains(event.target as Node)) {
        setAccentOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const accents: { id: AccentColor; name: string; hex: string; bgClass: string }[] = [
    { id: 'blue', name: 'iOS Blue', hex: '#007AFF', bgClass: 'bg-[#007AFF]' },
    { id: 'purple', name: 'Apple Purple', hex: '#AF52DE', bgClass: 'bg-[#AF52DE]' },
    { id: 'emerald', name: 'Apple Green', hex: '#34C759', bgClass: 'bg-[#34C759]' },
    { id: 'orange', name: 'Apple Orange', hex: '#FF9500', bgClass: 'bg-[#FF9500]' },
  ];

  const currentAccent = accents.find((a) => a.id === accent) || accents[0];

  return (
    <div className="flex items-center gap-2">
      {/* iOS Segmented Pill Control */}
      <div className="flex items-center p-1 rounded-full bg-black/[0.06] dark:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.1] backdrop-blur-md shadow-inner text-xs">
        <button
          type="button"
          onClick={() => setTheme('light')}
          title="Light Mode"
          className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all duration-200 ${
            theme === 'light'
              ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.12)] scale-100'
              : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden md:inline text-[11px]">Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          title="Dark Mode"
          className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-[#2c2c2e] text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)] scale-100'
              : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden md:inline text-[11px]">Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          title="System Match"
          className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all duration-200 ${
            theme === 'system'
              ? 'bg-white dark:bg-[#2c2c2e] text-black dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] scale-100'
              : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Laptop className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline text-[11px]">Auto</span>
        </button>
      </div>

      {/* Apple Accent Color Picker */}
      <div className="relative" ref={accentRef}>
        <button
          type="button"
          onClick={() => setAccentOpen(!accentOpen)}
          title={`Accent: ${currentAccent.name}`}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-black/[0.06] dark:bg-white/[0.1] hover:bg-black/[0.1] dark:hover:bg-white/[0.18] border border-black/[0.06] dark:border-white/[0.1] transition-colors"
        >
          <span
            className="w-3.5 h-3.5 rounded-full shadow-sm ring-2 ring-white/20 transition-transform active:scale-90"
            style={{ backgroundColor: currentAccent.hex }}
          />
        </button>

        {accentOpen && (
          <div className="absolute right-0 mt-2 w-48 p-2 rounded-2xl bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>Accent Color</span>
              <Palette className="w-3 h-3" />
            </div>

            <div className="mt-1 space-y-1">
              {accents.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    setAccent(acc.id);
                    setAccentOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                    accent === acc.id
                      ? 'bg-black/5 dark:bg-white/10 font-semibold text-black dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: acc.hex }}
                    />
                    <span>{acc.name}</span>
                  </div>
                  {accent === acc.id && (
                    <Check className="w-3.5 h-3.5 text-black dark:text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

