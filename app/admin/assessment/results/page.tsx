'use client';

import { useState, useEffect } from 'react';
import { Eye, Loader, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Attempt {
  id: string;
  enrollment_id: string;
  started_at: string;
  submitted_at: string;
  status: string;
  total_score: number;
  assessment_candidates?: {
    full_name: string;
    email: string;
  };
}

export default function AssessmentResultsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/assessment/results');
      const data = await res.json();

      if (data.success) {
        setAttempts(data.attempts);
      } else {
        setError(data.message || 'Failed to load results');
      }
    } catch (err) {
      console.error('Error loading attempts:', err);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Assessment Results</h1>
        <p className="text-sm text-slate-600 mt-1">View all candidate attempts and responses</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Table */}
      {loading ? (
        <div className="text-center py-12">
          <Loader className="w-8 h-8 animate-spin text-secondary mx-auto mb-2" />
          <p className="text-slate-600">Loading results...</p>
        </div>
      ) : attempts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-600">No assessment attempts yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">Candidate</th>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">Enrollment ID</th>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">Started</th>
                  <th className="px-6 py-3 text-right font-bold text-primary uppercase text-xs tracking-wider">Score</th>
                  <th className="px-6 py-3 text-center font-bold text-primary uppercase text-xs tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {attempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-primary">
                      {attempt.assessment_candidates?.full_name || '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{attempt.enrollment_id}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          attempt.status === 'completed'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {attempt.status === 'completed' ? 'Submitted' : 'In Progress'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {formatDate(attempt.started_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {attempt.status === 'completed' ? (
                        <span className="font-bold text-primary">{attempt.total_score || 0}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <Link
                          href={`/admin/assessment/results/${attempt.id}`}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
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
