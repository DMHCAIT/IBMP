'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import Link from 'next/link';

interface Candidate {
  id: string;
  full_name: string;
  enrollment_id: string;
  password: string;
  email: string;
  phone: string;
  exam_type: string;
  status: string;
  created_at: string;
}

export default function AssessmentCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    enrollmentId: '',
    password: '',
    email: '',
    phone: '',
    examType: 'Pain Medicine (Set A)',
  });
  const [submitting, setSubmitting] = useState(false);

  // Load candidates
  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/assessment/candidates');
      const data = await res.json();

      if (data.success) {
        setCandidates(data.candidates);
      } else {
        setError(data.message || 'Failed to load candidates');
      }
    } catch (err) {
      console.error('Error loading candidates:', err);
      setError('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/assessment/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setCandidates([data.candidate, ...candidates]);
        setFormData({
          fullName: '',
          enrollmentId: '',
          password: '',
          email: '',
          phone: '',
          examType: 'Pain Medicine (Set A)',
        });
        setShowAddForm(false);
      } else {
        setError(data.message || 'Failed to create candidate');
      }
    } catch (err) {
      console.error('Error creating candidate:', err);
      setError('Failed to create candidate');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (candidateId: string) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;

    try {
      const res = await fetch(`/api/admin/assessment/candidates?id=${candidateId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setCandidates(candidates.filter((c) => c.id !== candidateId));
      } else {
        setError(data.message || 'Failed to delete candidate');
      }
    } catch (err) {
      console.error('Error deleting candidate:', err);
      setError('Failed to delete candidate');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Assessment Candidates</h1>
          <p className="text-sm text-slate-600 mt-1">Manage candidate access and credentials</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary-600 text-white font-bold rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Candidate</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Candidate Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-primary">Add New Candidate</h2>
          <form onSubmit={handleAddCandidate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Dr. Alexander Wright"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Enrollment ID *
                </label>
                <input
                  type="text"
                  value={formData.enrollmentId}
                  onChange={(e) => setFormData({ ...formData, enrollmentId: e.target.value })}
                  placeholder="IBMP-2026-9842"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Password *
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Temporary password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="candidate@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Exam Type
                </label>
                <select
                  value={formData.examType}
                  onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                >
                  <option>Pain Medicine (Set A)</option>
                  <option>Pain Medicine (Set B)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-secondary hover:bg-secondary-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center gap-2"
              >
                {submitting ? <Loader className="w-4 h-4 animate-spin" /> : 'Add Candidate'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Candidates Table */}
      {loading ? (
        <div className="text-center py-12">
          <Loader className="w-8 h-8 animate-spin text-secondary mx-auto mb-2" />
          <p className="text-slate-600">Loading candidates...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-600">No candidates added yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">Enrollment ID</th>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center font-bold text-primary uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-primary">{candidate.full_name}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{candidate.enrollment_id}</td>
                    <td className="px-6 py-4 text-slate-600">{candidate.email || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/assessment/candidates/${candidate.id}`}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(candidate.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
