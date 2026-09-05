'use client';

import { AlertCircle, Save, Loader } from 'lucide-react';
import { useState } from 'react';

export default function AssessmentSettingsPage() {
  const [settings, setSettings] = useState({
    examType: 'Pain Medicine',
    examTitle: 'Pain Medicine (Set A)',
    durationMinutes: 120,
    totalQuestions: 60,
    totalMarks: 80,
    passingMarks: 50,
    passingPercentage: 62.5,
    description: 'Pain Medicine specialization assessment',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/assessment/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examType: settings.examType,
          examTitle: settings.examTitle,
          durationMinutes: settings.durationMinutes,
          totalMarks: settings.totalMarks,
          passingMarks: settings.passingMarks,
          passingPercentage: settings.passingPercentage,
          description: settings.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save settings');
      }

      setMessage('Settings saved successfully to database');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Assessment Settings</h1>
        <p className="text-sm text-slate-600 mt-1">Configure exam parameters and scoring criteria</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
          message.includes('success')
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exam Type */}
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Exam Type
            </label>
            <input
              type="text"
              value={settings.examType}
              onChange={(e) => setSettings({ ...settings, examType: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          {/* Exam Title */}
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Exam Title (Display Name)
            </label>
            <input
              type="text"
              value={settings.examTitle}
              onChange={(e) => setSettings({ ...settings, examTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Duration (Minutes)
            </label>
            <input
              type="number"
              value={settings.durationMinutes}
              onChange={(e) => setSettings({ ...settings, durationMinutes: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          {/* Total Questions */}
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Total Questions
            </label>
            <input
              type="number"
              value={settings.totalQuestions}
              onChange={(e) => setSettings({ ...settings, totalQuestions: parseInt(e.target.value) })}
              disabled
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">Read-only - defined in exam data</p>
          </div>

          {/* Total Marks */}
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Total Marks
            </label>
            <input
              type="number"
              value={settings.totalMarks}
              onChange={(e) => setSettings({ ...settings, totalMarks: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          {/* Passing Marks */}
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Passing Marks
            </label>
            <input
              type="number"
              value={settings.passingMarks}
              onChange={(e) => setSettings({ ...settings, passingMarks: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          {/* Passing Percentage */}
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Passing Percentage (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.passingPercentage}
              onChange={(e) => setSettings({ ...settings, passingPercentage: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
            Exam Description
          </label>
          <textarea
            value={settings.description}
            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            rows={3}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary resize-none"
          />
        </div>

        {/* Save Button */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-secondary hover:bg-secondary-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-2">Assessment Rules</p>
        <ul className="space-y-1 text-xs">
          <li>• Each candidate can only start the assessment once</li>
          <li>• Once started, candidates must complete or the attempt remains open</li>
          <li>• Image-based and short-answer questions require manual scoring</li>
          <li>• Multiple-choice questions are auto-scored</li>
        </ul>
      </div>
    </div>
  );
}
