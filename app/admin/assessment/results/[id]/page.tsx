'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ResultDetailPage() {
  const params = useParams();
  const attemptId = params.id as string;
  
  const [attempt, setAttempt] = useState<Record<string, any> | null>(null);
  const [responses, setResponses] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResultDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  const loadResultDetails = async () => {
    try {
      setLoading(true);
      
      // Load attempt details
      const attRes = await fetch(`/api/admin/assessment/results?attemptId=${attemptId}`);
      const attData = await attRes.json();

      if (attData.success && attData.attempts && attData.attempts.length > 0) {
        setAttempt(attData.attempts[0]);
      } else {
        setError('Result not found');
        setLoading(false);
        return;
      }

      // Load responses for this attempt
      const respRes = await fetch(`/api/admin/assessment/results?attemptId=${attemptId}&includeResponses=true`);
      const respData = await respRes.json();

      if (respData.success && respData.responses) {
        setResponses(respData.responses);
      }
    } catch (err) {
      console.error('Error loading result:', err);
      setError('Failed to load result details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader className="w-8 h-8 animate-spin text-secondary mx-auto mb-2" />
        <p className="text-slate-600">Loading result details...</p>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/assessment/results"
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </Link>

        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error || 'Result not found'}</span>
        </div>
      </div>
    );
  }

  const startTime = new Date(attempt.started_at);
  const endTime = attempt.submitted_at ? new Date(attempt.submitted_at) : null;
  const durationMins = endTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60) : null;

  // Calculate total marks
  const totalMaxMarks = responses.reduce((sum, r) => sum + (r.max_marks || 0), 0);
  const totalObtained = responses.reduce((sum, r) => sum + (r.marks_obtained || 0), 0);

  // Group responses by question type
  const mcqResponses = responses.filter(r => r.question_type === 'mcq');
  const imageResponses = responses.filter(r => r.question_type === 'image');
  const shortResponses = responses.filter(r => r.question_type === 'short');

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/assessment/results"
        className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Results
      </Link>

      {/* Result Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <div className="space-y-6">
          {/* Candidate Info */}
          <div>
            <h1 className="text-2xl font-bold text-primary mb-4">Assessment Result - Candidate Responses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Candidate Name</p>
                <p className="text-lg font-semibold text-primary">
                  {attempt.assessment_candidates?.full_name || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Enrollment ID</p>
                <p className="text-lg font-mono font-semibold text-slate-700">
                  {attempt.enrollment_id}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-2">
                  {attempt.status === 'completed' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-lg font-semibold text-green-600">Submitted</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="text-lg font-semibold text-yellow-600">In Progress</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Total Score</p>
                <p className="text-lg font-bold text-secondary">
                  {totalObtained.toFixed(1)} / {totalMaxMarks.toFixed(1)} ({totalMaxMarks > 0 ? ((totalObtained / totalMaxMarks) * 100).toFixed(1) : 0}%)
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Started At</p>
                <p className="text-sm text-slate-700">{startTime.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Duration</p>
                <p className="text-sm text-slate-700">
                  {durationMins ? `${durationMins} minutes` : 'Still in progress'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Total Responses</p>
                <p className="text-lg font-semibold text-slate-700">{responses.length} / 60</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-2">ℹ️ Response View (Read-Only)</p>
        <ul className="list-disc list-inside space-y-1">
          <li>All candidate responses are displayed below for review</li>
          <li>Responses are automatically saved when the candidate submits</li>
          <li>Question numbers from Q1 to Q60 are shown sequentially</li>
          <li>Expected answers are highlighted in blue for reference</li>
        </ul>
      </div>

      {/* MCQ Responses */}
      {mcqResponses.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-primary mb-4">Multiple Choice Responses (Q1-Q40)</h2>
          <div className="space-y-4">
            {mcqResponses.map((response, _idx) => (
              <div key={response.id} className="border border-slate-200 rounded-lg p-4 hover:border-primary/30 transition">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-primary text-lg">{response.question_id}</p>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    response.is_correct 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {response.is_correct ? '✓ Correct' : '✗ Incorrect'} ({response.marks_obtained || 0}/{response.max_marks})
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <p className="text-xs font-bold text-slate-700 mb-1">Candidate&apos;s Answer:</p>
                    <p className="text-sm text-slate-800">
                      {response.response_json?.selectedOptionText || response.response_text || '(No answer provided)'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image-Based Responses */}
      {imageResponses.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-primary mb-4">Image-Based Question Responses (Q41-Q50)</h2>
          <div className="space-y-6">
            {imageResponses.map((response) => (
              <div key={response.id} className="border border-slate-200 rounded-lg p-4 hover:border-primary/30 transition">
                <div className="mb-4">
                  <p className="font-semibold text-primary text-lg mb-3">{response.question_id}</p>
                  
                  {response.response_json?.partPrompt && (
                    <div className="mb-3 p-3 bg-slate-50 rounded border border-slate-200">
                      <p className="text-xs font-bold text-slate-700 mb-1">Part Question:</p>
                      <p className="text-sm text-slate-800">{response.response_json.partPrompt}</p>
                    </div>
                  )}
                  
                  {response.expected_answer && (
                    <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs font-bold text-blue-900 mb-1">✓ Expected Answer:</p>
                      <p className="text-sm text-blue-900">{response.expected_answer}</p>
                    </div>
                  )}
                  
                  <div className="mb-3 p-3 bg-amber-50 rounded border border-amber-200">
                    <p className="text-xs font-bold text-amber-900 mb-1">Candidate&apos;s Answer:</p>
                    <p className="text-sm text-amber-900">{response.response_text || '(No answer provided)'}</p>
                  </div>

                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                    <strong>Marks:</strong> {response.marks_obtained || 0}/{response.max_marks}
                    {response.admin_notes && (
                      <p className="mt-2"><strong>Admin Notes:</strong> {response.admin_notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Short Answer Responses */}
      {shortResponses.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-primary mb-4">Short Answer Responses (Q51-Q60)</h2>
          <div className="space-y-6">
            {shortResponses.map((response) => (
              <div key={response.id} className="border border-slate-200 rounded-lg p-4 hover:border-primary/30 transition">
                <div className="mb-4">
                  <p className="font-semibold text-primary text-lg mb-3">{response.question_id}</p>
                  
                  {response.expected_answer && (
                    <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs font-bold text-blue-900 mb-1">✓ Model/Expected Answer:</p>
                      <p className="text-sm text-blue-900">{response.expected_answer}</p>
                    </div>
                  )}
                  
                  <div className="mb-3 p-3 bg-amber-50 rounded border border-amber-200">
                    <p className="text-xs font-bold text-amber-900 mb-1">Candidate&apos;s Answer:</p>
                    <p className="text-sm text-amber-900">{response.response_text || '(No answer provided)'}</p>
                  </div>

                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                    <strong>Marks:</strong> {response.marks_obtained || 0}/{response.max_marks}
                    {response.admin_notes && (
                      <p className="mt-2"><strong>Admin Notes:</strong> {response.admin_notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Response Summary */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-primary mb-4">Response Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-600 uppercase mb-1">Total Responses Submitted</p>
            <p className="text-2xl font-bold text-primary">{responses.length}/60</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-600 uppercase mb-1">Overall Score</p>
            <p className="text-2xl font-bold text-secondary">{totalObtained.toFixed(1)}/{totalMaxMarks.toFixed(1)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-600 uppercase mb-1">Percentage</p>
            <p className="text-2xl font-bold text-primary">{totalMaxMarks > 0 ? ((totalObtained / totalMaxMarks) * 100).toFixed(1) : 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

