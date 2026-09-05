'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Clock,
  FileText,
  Play,
  ArrowRight,
  BarChart3,
  ClipboardList,
  CheckCircle2,
  User,
  Key,
  Lock,
  AlertCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Flag
} from 'lucide-react';

export default function AssessmentPage() {
  // Candidate Entry State
  const [candidateName, setCandidateName] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [candidatePassword, setCandidatePassword] = useState('');
  const [formError, setFormError] = useState('');
  
  // Assessment Flow State: 'LOBBY' | 'EXAM' | 'RESULT'
  const [flowState, setFlowState] = useState<'LOBBY' | 'EXAM' | 'RESULT'>('LOBBY');

  // Examination Navigation & Responses State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({}); // qId -> optionId
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({}); // qId or partId -> text
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [examSeedData, setExamSeedData] = useState<any>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(120 * 60);
  const [loading, setLoading] = useState(true);
  
  // Store attempt ID and candidate ID for submission
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [candidateInfo, setCandidateInfo] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Prevent double submission
  
  // Settings State
  const [settings, setSettings] = useState<any>({
    exam_type: 'Pain Medicine',
    exam_title: 'Pain Medicine (Set A)',
    duration_minutes: 120,
    total_marks: 80,
    passing_marks: 50,
    passing_percentage: 62.5,
    description: 'Pain Medicine specialization assessment',
  });

  // Load exam data on mount
  useEffect(() => {
    const loadExamData = async () => {
      try {
        // First try to load from database
        const response = await fetch('/api/admin/assessment/questions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const questionsData = await response.json();
          console.log('Exam questions loaded from database:', questionsData.length);
          
          // Load images for image-based questions
          let imagesMap: Record<string, string> = {};
          try {
            const imagesResponse = await fetch('/api/admin/assessment/questions/images');
            if (imagesResponse.ok) {
              const allImages = await imagesResponse.json();
              // Map images by question_id
              if (Array.isArray(allImages)) {
                imagesMap = Object.fromEntries(
                  allImages.map((img: any) => {
                    // Find question number by ID
                    const question = questionsData.find((q: any) => q.id === img.question_id);
                    if (question) {
                      return [question.question_number, img.image_url];
                    }
                    return ['', ''];
                  }).filter((entry: any) => entry[0])
                );
              }
            }
          } catch (e) {
            console.warn('Could not load images:', e);
          }
          
          // Format database questions to match exam.seed.json structure
          const formattedData = {
            title: 'Pain Medicine Assessment',
            durationMinutes: 120,
            questions: questionsData.map((q: any) => {
              // If question_data is available from database, use it directly
              if (q.question_data) {
                return {
                  ...q.question_data,
                  image_url: imagesMap[q.question_number] || q.question_data.asset?.file || q.image_url || null,
                };
              }

              // Otherwise, construct from individual fields (fallback)
              // Parse options if they're a JSON string
              let parsedOptions: any[] = [];
              if (q.type === 'mcq') {
                try {
                  if (typeof q.options === 'string') {
                    parsedOptions = JSON.parse(q.options || '[]');
                  } else if (Array.isArray(q.options)) {
                    parsedOptions = q.options;
                  }
                } catch (e) {
                  console.error('Error parsing options for question', q.question_number, e);
                  parsedOptions = [];
                }
              }
              
              return {
                id: q.question_number,
                number: parseInt(q.question_number),
                type: q.type,
                moduleId: parseInt(q.module?.replace(/\D/g, '')) || 1,
                topic: '',
                stem: q.stem,
                maxUnits: q.marks || 1,
                scoring: { marks: q.marks },
                options: parsedOptions,
                correctOption: q.type === 'mcq' ? q.correct_answer : undefined,
                image_url: imagesMap[q.question_number] || q.image_url || null,
                parts: [], // Will be populated if present in question_data
              };
            }),
          };
          
          setExamSeedData(formattedData);
          setSecondsRemaining((formattedData.durationMinutes || 120) * 60);
        } else {
          throw new Error('Failed to load questions from database');
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to load exam data:', error);
        setLoading(false);
      }
    };
    
    loadExamData();
  }, []);

  // Load assessment settings from database
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/assessment/settings', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setSettings(data.settings);
            console.log('Assessment settings loaded from database:', data.settings);
          }
        }
      } catch (error) {
        console.warn('Could not load settings from database, using defaults:', error);
      }
    };

    loadSettings();
  }, []);

  // All 60 questions from seed data
  const questions = examSeedData?.questions || [];
  const totalQuestions = questions.length;

  // Submit exam responses function
  const submitExamResponses = async () => {
    if (hasSubmitted || !attemptId || !candidateInfo) return;
    
    setHasSubmitted(true);
    
    try {
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          candidateId: candidateInfo.id,
          mcqAnswers,
          textAnswers,
          flaggedQuestions,
          examData: examSeedData,
        }),
      });

      if (response.ok) {
        console.log('Exam submitted successfully');
      } else {
        console.error('Failed to submit exam responses');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  // Timer Effect during EXAM - Auto-submit when time expires
  useEffect(() => {
    if (flowState !== 'EXAM' || !examSeedData) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit before showing results
          submitExamResponses();
          setFlowState('RESULT');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [flowState, examSeedData, attemptId, candidateInfo, mcqAnswers, textAnswers, flaggedQuestions, hasSubmitted]);

  // Handle page unload/refresh - Auto-submit exam
  useEffect(() => {
    if (flowState !== 'EXAM') return;

    const handleBeforeUnload = () => {
      if (!hasSubmitted && attemptId && candidateInfo) {
        // Send beacon for immediate submission even if page unloads
        // sendBeacon requires string or FormData, so convert to JSON string
        const submissionData = JSON.stringify({
          attemptId,
          candidateId: candidateInfo.id,
          mcqAnswers,
          textAnswers,
          flaggedQuestions,
          examData: examSeedData,
        });
        
        navigator.sendBeacon('/api/assessment/submit', submissionData);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [flowState, attemptId, candidateInfo, mcqAnswers, textAnswers, flaggedQuestions, examSeedData, hasSubmitted]);

  // Handle Launching Assessment - NOW CALLS VERIFICATION API
  const handleStartAssessment = async () => {
    if (!candidateName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!candidateId.trim()) {
      setFormError('Please enter your registration / enrollment ID.');
      return;
    }
    if (!candidatePassword.trim()) {
      setFormError('Please enter your password.');
      return;
    }

    setFormError('');

    try {
      // Call verification API
      const response = await fetch('/api/assessment/verify-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: candidateId,
          password: candidatePassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.limited) {
          // Candidate has already attempted
          setFormError(
            'Assessment attempt limit reached. You have already started this assessment. Please contact admin for assistance.'
          );
        } else {
          setFormError(data.message || 'Invalid credentials');
        }
        return;
      }

      // Success - store info and start exam
      setCandidateInfo(data.candidate);
      setAttemptId(data.attempt.id);
      setSecondsRemaining((settings.duration_minutes || 120) * 60);
      setCurrentQuestionIndex(0);
      setFlowState('EXAM');
    } catch (error) {
      console.error('Verification error:', error);
      setFormError('Failed to verify credentials. Please try again.');
    }
  };

  // Format Timer HH:MM:SS
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle Flag Question
  const toggleFlagQuestion = (qId: string) => {
    setFlaggedQuestions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Check if a question is answered
  const isQuestionAnswered = (q: Record<string, any>) => {
    if (q.type === 'mcq') {
      return !!mcqAnswers[q.id];
    }
    if (q.type === 'image' && q.parts) {
      return q.parts.some((p: Record<string, any>) => !!(textAnswers[`${q.id}.${p.id}`] || '').trim());
    }
    if (q.type === 'short') {
      return !!(textAnswers[q.id] || '').trim();
    }
    return false;
  };

  // Calculate Evaluation Metrics
  const scoreSummary = useMemo(() => {
    let mcqCorrect = 0;
    let mcqTotal = 0;

    questions.forEach((q: any) => {
      if (q.type === 'mcq') {
        mcqTotal++;
        const selectedOptId = mcqAnswers[q.id];
        // Check against correctOptionId (letter) or use correctOption as fallback
        const correctId = q.correctOptionId || q.correctOption;
        if (selectedOptId && selectedOptId === correctId) {
          mcqCorrect++;
        }
      }
    });

    const answeredCount = questions.filter(isQuestionAnswered).length;
    const percentage = Math.round((mcqCorrect / (mcqTotal || 1)) * 100);

    return {
      mcqCorrect,
      mcqTotal,
      answeredCount,
      totalQuestions,
      percentage,
      passed: percentage >= 70
    };
  }, [mcqAnswers, textAnswers, questions]);

  const marksBreakdown = [
    { section: 'A. MCQs', questions: 40, marksEach: '1', total: 40 },
    { section: 'B. Image-based', questions: 10, marksEach: '3', total: 30 },
    { section: 'C. Short answers', questions: 10, marksEach: '1', total: 10 },
  ];

  const instructions = [
    {
      key: 'a',
      title: 'Question Format',
      text: 'Attempt all 60 questions. Section A requires one best answer for each MCQ.'
    },
    {
      key: 'b',
      title: 'Image-Based Section',
      text: 'Section B contains ten original figures. Answer all three parts of each image question; each part carries 1 mark unless a split is stated in the key.'
    },
    {
      key: 'c',
      title: 'Short Answer Section',
      text: 'Section C requires a brief answer: usually one term, one example or one sentence.'
    },
    {
      key: 'd',
      title: 'Scoring Rules',
      text: 'Scoring: correct MCQ = 1; incorrect/unanswered MCQ = 0. No negative marking.'
    },
    {
      key: 'e',
      title: 'Fictional Case Disclaimer',
      text: 'All cases and plotted observations are fictional. Images are teaching schematics, not patient photographs or diagnostic scans. Interpret each figure together with its stem.'
    },
    {
      key: 'f',
      title: 'Scope of Assessment',
      text: 'This written assessment tests knowledge and clinical reasoning. It does not independently certify hands-on procedural competence.'
    }
  ];

  const currentQ = questions[currentQuestionIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-slate-600 font-semibold">Loading assessment...</p>
          <p className="text-xs text-slate-500">Please wait while we prepare the exam</p>
        </div>
      </div>
    );
  }

  if (!examSeedData || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl max-w-md">
          <p className="text-red-600 font-semibold mb-2">Unable to Load Assessment</p>
          <p className="text-slate-600 text-sm mb-4">The assessment data could not be loaded. Please refresh the page or contact support.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-primary font-sans flex flex-col selection:bg-primary-50 selection:text-primary">
      <Header />
      
      {/* EXAM STATE TOOLBAR - Shows candidate info and finish button during exam */}
      {flowState === 'EXAM' && (
        <div className="sticky top-20 z-40 bg-white border-b border-gray-200/80 shadow-sm">
          <div className="container-custom">
            <div className="flex items-center justify-between h-16">
              <div className="text-left">
                <p className="text-xs font-bold text-primary">{candidateName}</p>
                <p className="text-[10px] text-slate-500 font-mono">ID: {candidateId}</p>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-4 py-2 bg-secondary hover:bg-secondary-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Finish Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {/* VIEW 1: LOBBY / CANDIDATE CHECK-IN */}
        {flowState === 'LOBBY' && (
          <div className="py-8 sm:py-12">
            <div className="container-custom max-w-6xl space-y-10">

              {/* PAGE TITLE & QUICK SPECIFICATIONS HEADER */}
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
                  {settings.exam_title}
                </h1>
                
                {/* Metadata Pills */}
                <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-600 flex-wrap pt-1">
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                    <Clock className="w-4 h-4 text-secondary" />
                    <span>Duration: <strong className="text-primary font-bold">{settings.duration_minutes} Mins</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>Total Questions: <strong className="text-primary font-bold">{totalQuestions}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                    <Award className="w-4 h-4 text-accent" />
                    <span>Total Marks: <strong className="text-primary font-bold">{settings.total_marks} Marks</strong></span>
                  </div>
                </div>
              </div>

              {/* MAIN 2-COLUMN SECTION: CANDIDATE CHECK-IN & MARKS BREAKDOWN */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                {/* LEFT: CANDIDATE REGISTRATION CARD */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col justify-between h-full">
                  <div>
                    {/* Card Header Strip */}
                    <div className="bg-gradient-to-r from-primary-900 to-primary p-5 sm:p-6 text-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/10 rounded-xl">
                          <User className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h2 className="text-base sm:text-lg font-bold">Candidate Access Verification</h2>
                          <p className="text-xs text-slate-300">Enter your credentials to launch the test session</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-7 space-y-5">
                      {formError && (
                        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5">
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span>{formError}</span>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                            Candidate Full Name *
                          </label>
                          <div className="relative">
                            <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={candidateName}
                              onChange={(e) => {
                                setCandidateName(e.target.value);
                                if (formError) setFormError('');
                              }}
                              placeholder="e.g. Dr. Alexander Wright"
                              className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-primary text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                            Registration / Enrollment ID *
                          </label>
                          <div className="relative">
                            <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={candidateId}
                              onChange={(e) => {
                                setCandidateId(e.target.value);
                                if (formError) setFormError('');
                              }}
                              placeholder="e.g. IBMP-2026-9842"
                              className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-primary text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                            Password *
                          </label>
                          <div className="relative">
                            <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="password"
                              value={candidatePassword}
                              onChange={(e) => {
                                setCandidatePassword(e.target.value);
                                if (formError) setFormError('');
                              }}
                              placeholder="Enter your password"
                              className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-primary text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 pt-0">
                    <button
                      onClick={handleStartAssessment}
                      className="w-full py-3.5 px-6 bg-secondary hover:bg-secondary-600 text-white font-extrabold rounded-xl shadow-lg shadow-secondary/25 hover:shadow-secondary/40 hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 text-base group"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>Start Assessment</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* RIGHT: MARKS BREAKDOWN SUMMARY TABLE */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col h-full">
                  {/* Card Header Strip */}
                  <div className="bg-gradient-to-r from-primary-900 to-primary p-5 sm:p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/10 rounded-xl">
                        <BarChart3 className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold">Marks Breakdown</h2>
                        <p className="text-xs text-slate-300">Structure & scoring weights</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                      <thead className="bg-slate-100/80 text-primary uppercase text-[11px] font-bold tracking-wider border-b border-slate-200/80">
                        <tr>
                          <th className="py-3 px-4">Section</th>
                          <th className="py-3 px-3 text-center">Qs</th>
                          <th className="py-3 px-3 text-center">Marks</th>
                          <th className="py-3 px-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {marksBreakdown.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-4 px-4 font-semibold text-primary">{row.section}</td>
                            <td className="py-4 px-3 text-center font-medium">{row.questions}</td>
                            <td className="py-4 px-3 text-center font-medium">{row.marksEach}</td>
                            <td className="py-4 px-4 text-right font-bold text-primary">{row.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Total Row Footer */}
                  <div className="bg-primary-50/70 border-t-2 border-slate-200 font-extrabold text-primary p-4 px-5 flex items-center justify-between">
                    <span className="uppercase tracking-wider text-xs font-bold text-primary">TOTAL EVALUATION</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-600"><strong className="text-primary font-bold">60</strong> Questions</span>
                      <span className="text-secondary font-extrabold text-base">80 Marks</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* CANDIDATE INSTRUCTIONS SECTION */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="p-2.5 bg-secondary-50 rounded-xl text-secondary">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-primary">Candidate Instructions & Guidelines</h2>
                    <p className="text-xs text-slate-500">Important rules to follow during the examination session</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {instructions.map((item) => (
                    <div key={item.key} className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all flex items-start gap-3.5">
                      <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {item.key}
                      </span>
                      <div>
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE ASSESSMENT WORKSPACE */}
        {flowState === 'EXAM' && currentQ && (
          <div className="py-6 sm:py-8 bg-slate-100 min-h-[calc(100vh-80px)] flex flex-col">
            <div className="container-custom max-w-7xl flex-1 flex flex-col gap-6">
              
              {/* TOP WORKSPACE CONTROL BAR */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-extrabold">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:inline">
                    {currentQ.topic || 'Pain Medicine'}
                  </span>
                </div>

                {/* Live Countdown Timer & Submit */}
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold ${
                    secondsRemaining < 600 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-50 text-primary border-slate-200'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(secondsRemaining)}</span>
                  </div>

                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="px-5 py-2 bg-secondary hover:bg-secondary-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-secondary/20"
                  >
                    Finish & Submit
                  </button>
                </div>
              </div>

              {/* MAIN QUESTION DISPLAY & PALETTE GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
                
                {/* LEFT: ACTIVE QUESTION CARD */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between min-h-[480px]">
                  <div>
                    {/* Header: Question Type Badge & Flag Button */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-md bg-primary-50 text-primary border border-primary-100">
                        {currentQ.type === 'mcq' && 'Section A: Multiple Choice Question'}
                        {currentQ.type === 'image' && 'Section B: Image-Based Evaluation'}
                        {currentQ.type === 'short' && 'Section C: Short Answer Question'}
                      </span>

                      <button
                        onClick={() => toggleFlagQuestion(currentQ.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          flaggedQuestions[currentQ.id]
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[currentQ.id] ? 'fill-current' : ''}`} />
                        <span>{flaggedQuestions[currentQ.id] ? 'Flagged' : 'Flag Question'}</span>
                      </button>
                    </div>

                    {/* Question Stem */}
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-primary leading-relaxed mb-6">
                      {currentQ.stem}
                    </h2>

                    {/* TYPE 1: MCQ OPTIONS */}
                    {currentQ.type === 'mcq' && currentQ.options && (
                      <div className="space-y-3">
                        {currentQ.options.map((opt: any, idx: number) => {
                          // Handle both string and object option formats
                          const optId = typeof opt === 'string' ? String.fromCharCode(65 + idx) : (opt.id || String.fromCharCode(65 + idx));
                          const optText = typeof opt === 'string' ? opt : (opt.text || opt.label || opt);
                          const isSelected = mcqAnswers[currentQ.id] === optId;
                          return (
                            <button
                              key={optId}
                              onClick={() => setMcqAnswers((prev) => ({ ...prev, [currentQ.id]: optId }))}
                              className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-4 ${
                                isSelected
                                  ? 'bg-primary-50 border-primary text-primary font-semibold shadow-sm'
                                  : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200 text-slate-700'
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                                isSelected ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="flex-1 leading-relaxed">{optText}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* TYPE 2: IMAGE-BASED QUESTION - Display from Database or Seed */}
                    {currentQ.type === 'image' && (
                      <div className="space-y-5">
                        {/* Display image if available from database or seed data */}
                        {(currentQ.image_url || currentQ.asset?.file) && (
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-center space-y-2">
                            <div className="relative w-full max-w-lg mx-auto h-64 sm:h-72 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                              {currentQ.image_url ? (
                                <img
                                  src={currentQ.image_url}
                                  alt="Question image"
                                  className="object-contain w-full h-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <Image
                                  src={`/quiz-assets/${currentQ.asset.file.replace(/^assets\//, '')}`}
                                  alt={currentQ.asset.alt || currentQ.asset.title || 'Teaching Schematic'}
                                  fill
                                  className="object-contain p-2"
                                  unoptimized
                                />
                              )}
                            </div>
                          </div>
                        )}

                        {/* Display parts if available from seed data */}
                        {currentQ.parts && currentQ.parts.map((part: any) => (
                          <div key={part.id} className="space-y-2">
                            <label className="block text-xs font-bold text-primary">
                              Part ({part.id}): {part.prompt}
                            </label>
                            <input
                              type="text"
                              value={textAnswers[`${currentQ.id}.${part.id}`] || ''}
                              onChange={(e) => setTextAnswers((prev) => ({ ...prev, [`${currentQ.id}.${part.id}`]: e.target.value }))}
                              placeholder="Type your response for this part..."
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TYPE 3: SHORT ANSWER QUESTION */}
                    {currentQ.type === 'short' && (
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Candidate Short Answer Response
                        </label>
                        <textarea
                          rows={4}
                          value={textAnswers[currentQ.id] || ''}
                          onChange={(e) => setTextAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))}
                          placeholder="Provide a concise response (one term, phrase, or sentence)..."
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* BOTTOM NAVIGATION BUTTONS */}
                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {currentQuestionIndex < totalQuestions - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                        className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-600 flex items-center gap-1 shadow-sm transition-all"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsSubmitModalOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-secondary text-white font-bold text-xs sm:text-sm hover:bg-secondary-600 flex items-center gap-1 shadow-md transition-all"
                      >
                        <span>Review & Submit</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* RIGHT: QUESTION PALETTE NAVIGATOR */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Question Palette (60 Questions)
                    </h4>

                    {/* Status Legend */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-emerald-500" />
                        <span>Answered ({scoreSummary.answeredCount})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-amber-400" />
                        <span>Flagged ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
                      </div>
                    </div>

                    {/* 60 Question Buttons Grid */}
                    <div className="grid grid-cols-6 gap-2 max-h-[380px] overflow-y-auto pr-1">
                      {questions.map((q: any, idx: number) => {
                        const isCurrent = currentQuestionIndex === idx;
                        const answered = isQuestionAnswered(q);
                        const isFlagged = flaggedQuestions[q.id];

                        let btnStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                        if (answered) btnStyle = 'bg-emerald-500 text-white font-bold border-emerald-600';
                        if (isFlagged) btnStyle = 'bg-amber-400 text-slate-900 font-bold border-amber-500';
                        if (isCurrent) btnStyle += ' ring-2 ring-primary ring-offset-1';

                        return (
                          <button
                            key={q.id}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`h-9 rounded-lg text-xs font-bold border transition-all flex items-center justify-center relative ${btnStyle}`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* CONFIRMATION SUBMIT MODAL */}
            {isSubmitModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center gap-3 text-amber-500 mb-4">
                    <AlertCircle className="w-8 h-8" />
                    <h3 className="text-xl font-bold text-primary">Confirm Submission</h3>
                  </div>

                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    You have answered <strong>{scoreSummary.answeredCount}</strong> out of <strong>{totalQuestions}</strong> questions. Are you ready to complete your assessment?
                  </p>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                    >
                      Return to Test
                    </button>
                    <button
                      onClick={async () => {
                        setIsSubmitModalOpen(false);
                        await submitExamResponses();
                        setFlowState('RESULT');
                      }}
                      className="px-5 py-2 rounded-xl bg-secondary text-white font-bold text-xs hover:bg-secondary-600 shadow-md transition-all"
                    >
                      Yes, Submit Exam
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: SCORE REPORT & CLINICAL RATIONALES */}
        {flowState === 'RESULT' && (
          <div className="py-10 sm:py-14">
            <div className="container-custom max-w-4xl">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-6 sm:p-10 text-center space-y-8">
                
                {/* Header Status */}
                <div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4 ${
                    scoreSummary.passed ? 'bg-emerald-100 text-emerald-600 border-emerald-50' : 'bg-amber-100 text-amber-600 border-amber-50'
                  }`}>
                    {scoreSummary.passed ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                  </div>

                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                    scoreSummary.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {scoreSummary.passed ? 'Board Certification Passed' : 'Assessment Completed'}
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
                    Evaluation Report for {candidateName || 'Candidate'}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">ID: {candidateId || 'N/A'}</p>
                </div>

                {/* Score Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 max-w-2xl mx-auto">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Questions Attempted</span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-secondary mt-1">{scoreSummary.answeredCount} / {totalQuestions}</p>
                  </div>
                </div>



                {/* Back to Lobby */}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setMcqAnswers({});
                      setTextAnswers({});
                      setFlaggedQuestions({});
                      setFlowState('LOBBY');
                    }}
                    className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-all text-sm shadow-md"
                  >
                    Return to Assessment Lobby
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
