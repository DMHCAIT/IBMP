'use client';

import { useState, useEffect } from 'react';
import { Loader, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Paper {
  id: string;
  name: string;
  slug: string;
}

interface Attempt {
  id: string;
  candidate_id: string;
  score: number;
  total_marks: number;
  created_at: string;
  full_name?: string;
}

export default function PaperResultsPage({ params }: { params: { paperId: string } }) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [params.paperId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load paper
      const paperRes = await fetch(`/api/admin/assessment/papers/${params.paperId}`);
      const paperData = await paperRes.json();
      setPaper(paperData.paper);

      // Load attempts for this paper
      const attemptsRes = await fetch(`/api/admin/assessment/papers/${params.paperId}/results`);
      const attemptsData = await attemptsRes.json();
      setAttempts(attemptsData.attempts || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const averageScore = attempts.length > 0
    ? (attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length).toFixed(2)
    : 0;

  const passCount = attempts.filter((a) => a.score >= 50).length;

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
          {paper?.name} - Results
        </h1>
        <p className="text-sm text-slate-600 mt-1">View all assessment results for this paper</p>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-primary">{attempts.length}</div>
            <p className="text-xs text-slate-600 uppercase tracking-wider mt-1">Total Attempts</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-green-600">{passCount}</div>
            <p className="text-xs text-slate-600 uppercase tracking-wider mt-1">Passed</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{averageScore}%</div>
            <p className="text-xs text-slate-600 uppercase tracking-wider mt-1">Average Score</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {attempts.length > 0 ? ((passCount / attempts.length) * 100).toFixed(0) : 0}%
            </div>
            <p className="text-xs text-slate-600 uppercase tracking-wider mt-1">Pass Rate</p>
          </div>
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
          <p className="text-slate-600">No attempts yet for this paper.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {attempts.map((attempt) => {
                  const percentage = ((attempt.score / attempt.total_marks) * 100).toFixed(0);
                  const passed = attempt.score >= 50;
                  return (
                    <tr key={attempt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-primary">{attempt.full_name || 'Candidate'}</td>
                      <td className="px-6 py-4 font-semibold">{attempt.score}/{attempt.total_marks}</td>
                      <td className="px-6 py-4">{percentage}%</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            passed
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(attempt.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
