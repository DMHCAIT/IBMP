'use client';

import { useState, useEffect } from 'react';
import { Save, Loader, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Paper {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration_minutes: number;
  total_questions: number;
  total_marks: number;
  passing_marks: number;
  passing_percentage: number;
  exam_type: string;
  max_attempts: number;
  is_active: boolean;
}

export default function PaperSettingsPage({ params }: { params: { paperId: string } }) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [formData, setFormData] = useState<Partial<Paper>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPaper();
  }, [params.paperId]);

  const loadPaper = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/assessment/papers/${params.paperId}`);
      const data = await res.json();
      setPaper(data.paper);
      setFormData(data.paper);
    } catch (error) {
      console.error('Error loading paper:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch(`/api/admin/assessment/papers/${params.paperId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setPaper(data.paper);
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader className="w-8 h-8 animate-spin text-secondary mx-auto mb-2" />
        <p className="text-slate-600">Loading paper settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/assessment/papers"
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Papers
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          {paper?.name} - Settings
        </h1>
        <p className="text-sm text-slate-600 mt-1">Configure paper settings and parameters</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Paper Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Exam Type
            </label>
            <select
              value={formData.exam_type || ''}
              onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              <option value="Standard">Standard</option>
              <option value="Advanced">Advanced</option>
              <option value="Specialist">Specialist</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration_minutes || ''}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Total Questions
            </label>
            <input
              type="number"
              value={formData.total_questions || ''}
              onChange={(e) => setFormData({ ...formData, total_questions: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Total Marks
            </label>
            <input
              type="number"
              value={formData.total_marks || ''}
              onChange={(e) => setFormData({ ...formData, total_marks: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Passing Marks
            </label>
            <input
              type="number"
              value={formData.passing_marks || ''}
              onChange={(e) => setFormData({ ...formData, passing_marks: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Passing Percentage
            </label>
            <input
              type="number"
              value={formData.passing_percentage || ''}
              onChange={(e) => setFormData({ ...formData, passing_percentage: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Maximum Attempts
            </label>
            <input
              type="number"
              value={formData.max_attempts || ''}
              onChange={(e) => setFormData({ ...formData, max_attempts: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Status
            </label>
            <select
              value={formData.is_active ? 'active' : 'inactive'}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-secondary hover:bg-secondary-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/assessment/papers"
            className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-all"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
