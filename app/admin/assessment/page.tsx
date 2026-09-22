'use client';

import { Users, FileText, BarChart3, Settings, BookMarked } from 'lucide-react';
import Link from 'next/link';

export default function AssessmentAdminPage() {
  const features = [
    {
      title: 'Manage Papers',
      description: 'Create and manage different exam papers with unique content',
      icon: BookMarked,
      href: '/admin/assessment/papers',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Manage Candidates',
      description: 'Add, edit, and manage candidate credentials and access',
      icon: Users,
      href: '/admin/assessment/candidates',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'View Results',
      description: 'Review assessment attempts and candidate responses',
      icon: BarChart3,
      href: '/admin/assessment/results',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Question Bank',
      description: 'Manage exam questions and scoring criteria',
      icon: FileText,
      href: '/admin/assessment/questions',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Settings',
      description: 'Configure exam settings and rules',
      icon: Settings,
      href: '/admin/assessment/settings',
      color: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">Assessment Administration</h1>
        <p className="text-slate-600 mt-2">Manage candidates, view results, and configure assessments</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <div className="text-3xl font-bold text-secondary mb-2">—</div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Total Candidates</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <div className="text-3xl font-bold text-secondary mb-2">—</div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Assessments Started</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <div className="text-3xl font-bold text-secondary mb-2">—</div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Completed</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <div className="text-3xl font-bold text-secondary mb-2">60</div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Total Questions</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="group relative bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

              {/* Content */}
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-primary mb-1.5 group-hover:translate-x-1 transition-transform">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>

                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 group-hover:text-primary group-hover:gap-3 transition-all">
                  <span>Go to {feature.title.split(' ')[0]}</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="font-bold text-blue-900 mb-3">Assessment System Overview</h2>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Create candidates and assign unique enrollment IDs</li>
          <li>✓ Candidates can only start assessment once</li>
          <li>✓ Track all responses and scores in real-time</li>
          <li>✓ Export results for analysis and certification</li>
        </ul>
      </div>
    </div>
  );
}
