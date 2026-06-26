'use client';

import { ReactNode, useState, useLayoutEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Home,
  Info,
  Award,
  BookOpen,
  Shield,
  Phone,
  Menu,
  LogOut,
  Settings,
  ChevronRight,
  X,
  GraduationCap,
  FileText,
  Receipt,
} from 'lucide-react';

const AUTH_KEY = 'ibmp-admin-auth';

const sidebarItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Home Page', href: '/admin/home', icon: Home },
  { name: 'About Page', href: '/admin/about', icon: Info },
  { name: 'Accreditation', href: '/admin/accreditation', icon: Award },
  { name: 'Programs', href: '/admin/programs', icon: BookOpen },
  { name: 'Courses', href: '/admin/courses', icon: GraduationCap },
  { name: 'Verification', href: '/admin/verification', icon: Shield },
  { name: 'Contact', href: '/admin/contact', icon: Phone },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Invoices', href: '/admin/invoices', icon: Receipt },
  { name: 'Header & Footer', href: '/admin/layout', icon: Settings },
];

function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Call logout API to clear server-side cookie
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout API error:', err);
    }
    localStorage.removeItem(AUTH_KEY);
    router.push('/admin/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IB</span>
                </div>
                <div>
                  <div className="font-bold text-primary">IBMP Admin</div>
                  <div className="text-xs text-gray-500">Content Manager</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">View Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const currentPage = sidebarItems.find((item) => item.href === pathname)?.name || 'Admin';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-primary">{currentPage}</h1>
            <p className="text-sm text-gray-500">Manage your website content</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // useLayoutEffect runs before paint — eliminates the spinner flash for authenticated users
  useLayoutEffect(() => {
    if (pathname === '/admin/login') return;

    let mounted = true;
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/check', {
          credentials: 'include',
        });}
        if (!mounted) return;
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.replace('/admin/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.replace('/admin/login');
      }
    }

    checkAuth();
    return () => {
      mounted = false;
    };
  }, [router, pathname]);

  // Login page: render children directly, no auth needed
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
