import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import QueryProvider from '@/components/providers/query-provider';
import { Navbar } from '@/components/layout/navbar';

export const metadata: Metadata = {
  title: 'Innovation DNA | From Failed Ideas to New Possibilities',
  description: 'AI-powered open innovation intelligence platform. Turn documented innovation attempts, constraints, and capabilities into evidence-backed opportunities in new domains.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('innovation_dna_theme') || 'dark';
                var a = localStorage.getItem('innovation_dna_accent') || 'blue';
                if (t === 'system') {
                  t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.classList.remove('dark', 'light');
                document.documentElement.classList.add(t);
                document.documentElement.setAttribute('data-accent', a);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#007AFF] selection:text-white transition-colors duration-200">
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <Navbar />
              <div className="flex-1 flex flex-col">
                {children}
              </div>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

