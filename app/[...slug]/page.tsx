'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Clock, Play, CheckCircle2, AlertCircle, Award, ClipboardList } from 'lucide-react';

export default function DynamicAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const slugArray = Array.isArray(params.slug) ? params.slug : [params.slug];
  const fullSlug = slugArray.join('/');
  const paperSlug = fullSlug.startsWith('assessment-') ? fullSlug.substring(11) : fullSlug;

  const [candidateName, setCandidateName] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [candidatePassword, setCandidatePassword] = useState('');
  const [formError, setFormError] = useState('');
  const [flowState, _setFlowState] = useState<'LOBBY' | 'EXAM' | 'RESULT'>('LOBBY');
  const [loading, setLoading] = useState(true);
  const [paperSettings, setPaperSettings] = useState<any>({
    name: 'Assessment',
    durationMinutes: 120,
    totalMarks: 80,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`/api/admin/assessment/papers?slug=${paperSlug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.papers?.length > 0) {
            const paper = data.papers[0];
            setPaperSettings({
              name: paper.name,
              durationMinutes: paper.duration_minutes || 120,
              totalMarks: paper.total_marks || 80,
            });
          }
        }
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    if (paperSlug) loadData();
  }, [paperSlug]);

  const handleVerifyCandidate = async () => {
    setFormError('');
    if (!candidateName || !candidateId || !candidatePassword) {
      setFormError('Please fill all fields');
      return;
    }
    try {
      const response = await fetch(`/api/assessment/${paperSlug}/verify-candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: candidateName,
          enrollmentId: candidateId,
          password: candidatePassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error || 'Verification failed');
        return;
      }
      sessionStorage.setItem('assessment-session', JSON.stringify({
        paperSlug,
        attemptId: data.attemptId,
        candidateInfo: data.candidateInfo,
      }));
      router.replace(`/assessment/${paperSlug}`);
    } catch (error) {
      setFormError('Error: ' + String(error));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (flowState === 'LOBBY') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Header />
        <main className="flex-1">
          <div className="py-8 sm:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              {/* PAGE TITLE */}
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">{paperSettings.name}</h1>
                <p className="text-gray-600">Complete the assessment to evaluate your knowledge</p>
              </div>

              {/* INFO BADGES ROW */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-teal-600" />
                    <span className="text-sm font-semibold text-slate-600">Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{paperSettings.durationMinutes} Mins</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-semibold text-slate-600">Total Questions</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">120</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-semibold text-slate-600">Total Marks</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{paperSettings.totalMarks} Marks</p>
                </div>
              </div>

              {/* MAIN CONTENT GRID */}
              <div className="grid grid-cols-3 gap-8">
                {/* LEFT: CANDIDATE VERIFICATION FORM (2 columns) */}
                <div className="col-span-2">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-slate-900 text-white px-8 py-6 flex items-center gap-4">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <ClipboardList className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Candidate Access Verification</h2>
                        <p className="text-sm text-slate-300">Enter your credentials to launch the test session</p>
                      </div>
                    </div>
                    <div className="p-8">
                      {formError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 mb-6">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-700">{formError}</p>
                        </div>
                      )}
                      <form onSubmit={(e) => { e.preventDefault(); handleVerifyCandidate(); }} className="space-y-5">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Candidate Full Name *</label>
                          <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="e.g. Dr. Alexander Wright" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Registration / Enrollment ID *</label>
                          <input type="text" value={candidateId} onChange={(e) => setCandidateId(e.target.value)} placeholder="e.g. IBMP-2026-9842" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Password *</label>
                          <input type="password" value={candidatePassword} onChange={(e) => setCandidatePassword(e.target.value)} placeholder="Enter your password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-8 transition-all shadow-md">
                          <Play className="w-5 h-5" />
                          Start Assessment
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* RIGHT: MARKS BREAKDOWN */}
                <div>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-slate-900 text-white px-8 py-6 flex items-center gap-4">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Marks Breakdown</h2>
                        <p className="text-sm text-slate-300">Structure & scoring weights</p>
                      </div>
                    </div>
                    <div className="p-8">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-2 font-bold text-slate-600 text-xs uppercase">SECTION</th>
                            <th className="text-center py-2 font-bold text-slate-600 text-xs uppercase">QS</th>
                            <th className="text-center py-2 font-bold text-slate-600 text-xs uppercase">MARKS</th>
                            <th className="text-right py-2 font-bold text-slate-600 text-xs uppercase">TOTAL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-3 text-gray-700 font-medium">A. MCQs</td>
                            <td className="text-center text-gray-700 font-semibold">40</td>
                            <td className="text-center text-gray-700 font-semibold">1</td>
                            <td className="text-right text-gray-900 font-bold">40</td>
                          </tr>
                          <tr>
                            <td className="py-3 text-gray-700 font-medium">B. Image-based</td>
                            <td className="text-center text-gray-700 font-semibold">10</td>
                            <td className="text-center text-gray-700 font-semibold">3</td>
                            <td className="text-right text-gray-900 font-bold">30</td>
                          </tr>
                          <tr>
                            <td className="py-3 text-gray-700 font-medium">C. Short answers</td>
                            <td className="text-center text-gray-700 font-semibold">10</td>
                            <td className="text-center text-gray-700 font-semibold">1</td>
                            <td className="text-right text-gray-900 font-bold">10</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <div className="mt-6 pt-6 border-t-2 border-slate-300">
                        <div className="grid grid-cols-3 gap-4 px-4 py-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Total</p>
                            <p className="text-xs font-semibold text-slate-600">Evaluation</p>
                          </div>
                          <div className="text-center border-l border-r border-slate-300">
                            <p className="text-2xl font-bold text-gray-900">60</p>
                            <p className="text-xs font-semibold text-slate-600 mt-1">Questions</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-teal-600">{paperSettings.totalMarks}</p>
                            <p className="text-xs font-semibold text-slate-600 mt-1">Marks</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CANDIDATE INSTRUCTIONS */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <ClipboardList className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Candidate Instructions & Guidelines</h2>
                    <p className="text-sm text-gray-600">Important rules to follow during the examination session</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4 flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">a</div>
                    <div>
                      <p className="font-semibold text-gray-900 uppercase text-sm">Question Format</p>
                      <p className="text-sm text-gray-600 mt-1">Attempt all 60 questions. Section A requires one best answer for each MCQ.</p>
                    </div>
                  </div>
                  <div className="space-y-4 flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">b</div>
                    <div>
                      <p className="font-semibold text-gray-900 uppercase text-sm">Image-Based Section</p>
                      <p className="text-sm text-gray-600 mt-1">Section B contains ten original figures. Answer all three parts of each image question; each part carries 1 mark unless a split is stated in the key.</p>
                    </div>
                  </div>
                  <div className="space-y-4 flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">c</div>
                    <div>
                      <p className="font-semibold text-gray-900 uppercase text-sm">Short Answer Section</p>
                      <p className="text-sm text-gray-600 mt-1">Section C requires a brief answer: usually one term, one example or one sentence.</p>
                    </div>
                  </div>
                  <div className="space-y-4 flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">d</div>
                    <div>
                      <p className="font-semibold text-gray-900 uppercase text-sm">Scoring Rules</p>
                      <p className="text-sm text-gray-600 mt-1">Scoring: correct MCQ = 1; incorrect/unanswered MCQ = 0. No negative marking.</p>
                    </div>
                  </div>
                  <div className="space-y-4 flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">e</div>
                    <div>
                      <p className="font-semibold text-gray-900 uppercase text-sm">Fictional Case Disclaimer</p>
                      <p className="text-sm text-gray-600 mt-1">All cases and plotted observations are fictional. Images are teaching schematics, not patient photographs or diagnostic scans. Interpret each figure together with its stem.</p>
                    </div>
                  </div>
                  <div className="space-y-4 flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">f</div>
                    <div>
                      <p className="font-semibold text-gray-900 uppercase text-sm">Scope of Assessment</p>
                      <p className="text-sm text-gray-600 mt-1">This written assessment tests knowledge and clinical reasoning. It does not independently certify hands-on procedural competence.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (flowState === 'EXAM') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Assessment {paperSettings.name}</h2>
              <p className="text-gray-600">Opening the assessment interface...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Assessment Submitted</h2>
        </div>
      </main>
      <Footer />
    </div>
  );
}
