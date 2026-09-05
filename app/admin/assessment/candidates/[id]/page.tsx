'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle2, Loader } from 'lucide-react';
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

export default function CandidateDetailsPage({ params }: { params: { id: string } }) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    enrollmentId: '',
    password: '',
    email: '',
    phone: '',
    examType: 'Pain Medicine (Set A)',
  });

  // Load candidate details
  useEffect(() => {
    loadCandidate();
  }, [params.id]);

  const loadCandidate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/assessment/candidates?id=${params.id}`);
      const data = await res.json();

      if (data.success && data.candidate) {
        setCandidate(data.candidate);
        setFormData({
          fullName: data.candidate.full_name || '',
          enrollmentId: data.candidate.enrollment_id || '',
          password: data.candidate.password || '',
          email: data.candidate.email || '',
          phone: data.candidate.phone || '',
          examType: data.candidate.exam_type || 'Pain Medicine (Set A)',
        });
      } else {
        setError(data.message || 'Failed to load candidate');
      }
    } catch (err) {
      console.error('Error loading candidate:', err);
      setError('Failed to load candidate');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/assessment/candidates?id=${candidate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setCandidate({
          ...candidate,
          full_name: formData.fullName,
          enrollment_id: formData.enrollmentId,
          password: formData.password,
          email: formData.email,
          phone: formData.phone,
          exam_type: formData.examType,
        });
        setSuccess('Candidate updated successfully');
        setEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update candidate');
      }
    } catch (err) {
      console.error('Error updating candidate:', err);
      setError('Failed to update candidate');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-secondary mx-auto mb-2" />
          <p className="text-slate-600">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-primary mb-2">Candidate Not Found</h2>
        <p className="text-slate-600 mb-6">The requested candidate could not be found.</p>
        <Link
          href="/admin/assessment/candidates"
          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary-600 text-white font-bold rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidates
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/assessment/candidates"
            className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Candidate Details</h1>
            <p className="text-sm text-slate-600 mt-1">{candidate.full_name}</p>
          </div>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2.5 bg-secondary hover:bg-secondary-600 text-white font-bold rounded-xl transition-all"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Candidate Details */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6">
        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-secondary hover:bg-secondary-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center gap-2"
              >
                {submitting ? <Loader className="w-4 h-4 animate-spin" /> : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-base text-slate-900 font-semibold">{candidate.full_name}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Enrollment ID</p>
                <p className="text-base text-slate-900 font-mono font-semibold">{candidate.enrollment_id}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Password</p>
                <p className="text-base text-slate-900 font-semibold">{candidate.password}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Exam Type</p>
                <p className="text-base text-slate-900 font-semibold">{candidate.exam_type}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Email</p>
                <p className="text-base text-slate-900 font-semibold">{candidate.email || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Phone</p>
                <p className="text-base text-slate-900 font-semibold">{candidate.phone || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Status</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {candidate.status}
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Created At</p>
                <p className="text-base text-slate-900 font-semibold">
                  {new Date(candidate.created_at).toLocaleDateString()} {new Date(candidate.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Link
          href="/admin/assessment/candidates"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidates
        </Link>
      </div>
    </div>
  );
}
