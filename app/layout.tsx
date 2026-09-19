import './globals.css';
import type { Metadata } from 'next';
import { AppShell } from '../components/AppShell';

export const metadata: Metadata = {
  title: 'Innovation DNA',
  description: 'From failed ideas to new possibilities.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
