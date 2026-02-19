'use client';

import { useContent } from '@/lib/content-context';
import Link from 'next/link';
import {
  Home,
  Info,
  Award,
  BookOpen,
  Shield,
  Phone,
  Settings,
  Save,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  GraduationCap,
  FileText,
  Receipt,
} from 'lucide-react';

const sections = [
  {
    name: 'Home Page',
    href: '/admin/home',
    icon: Home,
    description: 'Hero, What We Do, Mission/Vision, Stats, CTA sections',
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'About Page',
    href: '/admin/about',
    icon: Info,
    description: 'About Hero, Board of Directors, Values sections',
    color: 'from-green-500 to-green-600',
  },
  {
    name: 'Accreditation',
    href: '/admin/accreditation',
    icon: Award,
    description: 'Accreditation Hero, Process, Application CTA sections',
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Programs',
    href: '/admin/programs',
    icon: BookOpen,
    description: 'Programs Hero and Program cards',
    color: 'from-orange-500 to-orange-600',
  },
  {
    name: 'Courses',
    href: '/admin/courses',
    icon: GraduationCap,
    description: 'Manage all fellowship courses and specialties',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    name: 'Verification',
    href: '/admin/verification',
    icon: Shield,
    description: 'Verification page content and form',
    color: 'from-teal-500 to-teal-600',
  },
  {
    name: 'Contact',
    href: '/admin/contact',
    icon: Phone,
    description: 'Contact page content and form labels',
    color: 'from-pink-500 to-pink-600',
  },
  {
    name: 'Applications',
    href: '/admin/applications',
    icon: FileText,
    description: 'View and manage admission applications',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    name: 'Invoices',
    href: '/admin/invoices',
    icon: Receipt,
    description: 'Generate and manage student invoices',
    color: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Header & Footer',
    href: '/admin/layout',
    icon: Settings,
    description: 'Navigation, logo, and footer links',
    color: 'from-gray-500 to-gray-600',
  },
];

export default function AdminDashboard() {
  const { saveContent, resetContent, isSaving, isLoading } = useContent();

  const handleSave = async () => {
    try {
      await saveContent();
      alert('All changes saved successfully!');
    } catch {
      alert('Error saving changes. Please try again.');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) {
      resetContent();
      alert('Content reset to defaults.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary via-primary-800 to-secondary rounded-3xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome to IBMP Admin Panel</h2>
        <p className="text-white/80 mb-6">
          Manage all website content from one place. Select a section below to start editing.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg disabled:opacity-50"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save All Changes
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Defaults
          </button>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            View Website
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Sections', value: '9', icon: Settings },
          { label: 'Pages', value: '6', icon: BookOpen },
          { label: 'Components', value: '15+', icon: Home },
          { label: 'Status', value: 'Active', icon: CheckCircle },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sections Grid */}
      <div>
        <h3 className="text-xl font-bold text-primary mb-6">Content Sections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <section.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-bold text-primary mb-2">{section.name}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-100 rounded-2xl p-8">
        <h3 className="text-lg font-bold text-primary mb-4">How to Use</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold text-gray-700 mb-2">1. Select a Section</div>
            <p className="text-gray-600">Click on any section card above to edit its content.</p>
          </div>
          <div>
            <div className="font-semibold text-gray-700 mb-2">2. Edit Content</div>
            <p className="text-gray-600">Modify text, add items, or remove content as needed.</p>
          </div>
          <div>
            <div className="font-semibold text-gray-700 mb-2">3. Save Changes</div>
            <p className="text-gray-600">Click &quot;Save&quot; to apply your changes to the website.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
