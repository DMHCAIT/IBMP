'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BarChart3, FileText, Settings, ArrowLeft, Menu, X } from 'lucide-react';

export default function AssessmentAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: 'Overview',
      href: '/admin/assessment',
      icon: BarChart3,
      badge: null,
    },
    {
      label: 'Candidates',
      href: '/admin/assessment/candidates',
      icon: Users,
      badge: null,
    },
    {
      label: 'Results',
      href: '/admin/assessment/results',
      icon: BarChart3,
      badge: null,
    },
    {
      label: 'Questions',
      href: '/admin/assessment/questions',
      icon: FileText,
      badge: null,
    },
    {
      label: 'Settings',
      href: '/admin/assessment/settings',
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

        {/* Nav Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
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
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
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

            {navItems.map((item) => {
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
