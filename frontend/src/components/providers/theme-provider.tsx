'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';
export type AccentColor = 'blue' | 'purple' | 'emerald' | 'orange';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  accent: AccentColor;
  setTheme: (t: Theme) => void;
  setAccent: (a: AccentColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  resolvedTheme: 'dark',
  accent: 'blue',
  setTheme: () => {},
  setAccent: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [accent, setAccentState] = useState<AccentColor>('blue');
  const [mounted, setMounted] = useState(false);

  // Apply theme & accent to DOM
  const applyThemeToDOM = (t: Theme, acc: AccentColor) => {
    const root = document.documentElement;
    let effective: 'dark' | 'light' = 'dark';

    if (t === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effective = prefersDark ? 'dark' : 'light';
    } else {
      effective = t;
    }

    setResolvedTheme(effective);
    root.classList.remove('dark', 'light', 'cosmic', 'emerald');
    root.classList.add(effective);
    root.setAttribute('data-accent', acc);
  };

  useEffect(() => {
    const savedTheme = (localStorage.getItem('innovation_dna_theme') as Theme) || 'dark';
    const savedAccent = (localStorage.getItem('innovation_dna_accent') as AccentColor) || 'blue';
    setThemeState(savedTheme);
    setAccentState(savedAccent);
    applyThemeToDOM(savedTheme, savedAccent);
    setMounted(true);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentTheme = (localStorage.getItem('innovation_dna_theme') as Theme) || 'dark';
      if (currentTheme === 'system') {
        applyThemeToDOM('system', savedAccent);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('innovation_dna_theme', t);
    applyThemeToDOM(t, accent);
  };

  const setAccent = (a: AccentColor) => {
    setAccentState(a);
    localStorage.setItem('innovation_dna_accent', a);
    applyThemeToDOM(theme, a);
  };

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, accent, setTheme, setAccent, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

