'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BarChart3, FileText, Settings, ArrowLeft, Menu, X, BookMarked } from 'lucide-react';

export default function AssessmentAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [papers, setPapers] = useState<any[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);

  // Load papers on mount and whenever navigation returns to a paper page.
  useEffect(() => {
    loadPapers();
  }, [pathname]);

  useEffect(() => {
    const handlePapersUpdated = () => loadPapers();
    window.addEventListener('assessment-papers-updated', handlePapersUpdated);
    return () => window.removeEventListener('assessment-papers-updated', handlePapersUpdated);
  }, []);

  const loadPapers = async () => {
    try {
      const response = await fetch('/api/admin/assessment/papers', { cache: 'no-store' });
      const data = await response.json();
      if (data.papers && data.papers.length > 0) {
        setPapers(data.papers);
        // Try to detect if we're on a paper-specific page
        if (pathname.includes('/papers/')) {
          const match = pathname.match(/\/papers\/([^/]+)/);
          if (match) setSelectedPaperId(match[1]);
        } else {
          setSelectedPaperId(null);
        }
      } else {
        setPapers([]);
      }
    } catch (error) {
      console.error('Error loading papers:', error);
    }
  };

  const mainNavItems = [
    {
      label: 'Overview',
      href: '/admin/assessment',
      icon: BarChart3,
      badge: null,
    },
    {
      label: 'Manage Papers',
      href: '/admin/assessment/papers',
      icon: BookMarked,
      badge: null,
    },
  ];

  // Paper-specific options (shown when a paper is selected)
  const paperNavItems = [
    {
      label: 'Candidates',
      href: selectedPaperId ? `/admin/assessment/papers/${selectedPaperId}/candidates` : '#',
      icon: Users,
      badge: null,
    },
    {
      label: 'Results',
      href: selectedPaperId ? `/admin/assessment/papers/${selectedPaperId}/results` : '#',
      icon: BarChart3,
      badge: null,
    },
    {
      label: 'Questions',
      href: selectedPaperId ? `/admin/assessment/papers/${selectedPaperId}/questions` : '#',
      icon: FileText,
      badge: null,
    },
    {
      label: 'Settings',
      href: selectedPaperId ? `/admin/assessment/papers/${selectedPaperId}/settings` : '#',
      icon: Settings,
      badge: null,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-full gap-6">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-50 border-r border-slate-200 p-6 space-y-8">
        {/* Back Link */}
        <Link
          href="/admin"
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>

        {/* Main Navigation */}
        <nav className="space-y-6">
          {/* Main Items */}
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-primary text-white font-semibold'
                      : 'text-slate-700 hover:bg-white hover:text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Papers Section */}
          {papers.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider px-4 mb-2">Exam Papers</p>
              <div className="space-y-1">
                {papers.map((paper) => {
                  const active = selectedPaperId === paper.id;
                  return (
                    <div key={paper.id}>
                      <button
                        onClick={() => setSelectedPaperId(active ? null : paper.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                          active
                            ? 'bg-indigo-100 text-indigo-700 font-semibold'
                            : 'text-slate-700 hover:bg-white hover:text-primary'
                        }`}
                      >
                        <BookMarked className="w-4 h-4" />
                        <span className="text-sm">{paper.name}</span>
                      </button>

                      {/* Paper-specific options */}
                      {active && (
                        <div className="mt-1 ml-2 pl-2 border-l-2 border-indigo-300 space-y-1">
                          {paperNavItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                                  active
                                    ? 'bg-indigo-600 text-white font-semibold'
                                    : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Info Box */}
        <div className="mt-auto p-4 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-800 space-y-2">
          <p className="font-semibold">Assessment Admin</p>
          <p>Manage candidates, view results, and configure exams.</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <h1 className="text-lg font-bold text-primary">Assessment Admin</h1>

          <div className="w-10" />
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-50 border-b border-slate-200 p-4 space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Link>

            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-primary text-white font-semibold'
                      : 'text-slate-700 hover:bg-white hover:text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Page Content */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
