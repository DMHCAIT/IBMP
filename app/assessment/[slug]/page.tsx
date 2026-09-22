'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Clock,
  Play,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Flag
} from 'lucide-react';

export default function DynamicAssessmentPage() {
  const params = useParams();
  const slug = params.slug as string;

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
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [candidateInfo, setCandidateInfo] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Prevent double submission
  const [examSeedData, setExamSeedData] = useState<any>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(120 * 60);
  const [loading, setLoading] = useState(true);
  const [_settings, _setSettings] = useState<any>({
    exam_type: 'Assessment',
    duration_minutes: 120,
    total_marks: 80,
  });

  // Load exam data for specific paper
  useEffect(() => {
    const savedSession = sessionStorage.getItem('assessment-session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.paperSlug === slug && session.attemptId && session.candidateInfo) {
          setAttemptId(session.attemptId);
          setCandidateInfo(session.candidateInfo);
          setFlowState('EXAM');
          sessionStorage.removeItem('assessment-session');
        }
      } catch {
        sessionStorage.removeItem('assessment-session');
      }
    }

    const loadExamData = async () => {
      try {
        // Load questions from paper-specific API
        const response = await fetch(`/api/assessment/${slug}/questions`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const questionsData = await response.json();
          console.log(`Exam questions loaded for paper ${slug}:`, questionsData.length);
          
          // Load images for image-based questions (from database with base64 data)
          let imagesMap: Record<string, string> = {};
          try {
            const imagesResponse = await fetch('/api/admin/assessment/questions/images-data?format=base64');
            if (imagesResponse.ok) {
              const allImages = await imagesResponse.json();
              // Map images by question_id, using dataUri (data:image/png;base64,...)
              if (Array.isArray(allImages)) {
                imagesMap = Object.fromEntries(
                  allImages.map((img: any) => {
                    // Find question number by ID
                    const question = questionsData.find((q: any) => q.id === img.questionId);
                    if (question) {
                      // Use dataUri which is the complete base64 data URI
                      return [question.question_number, img.dataUri];
                    }
                    return ['', ''];
                  }).filter((entry: any) => entry[0])
                );
              }
              console.log('Images loaded from database:', Object.keys(imagesMap).length);
            }
          } catch (e) {
            console.warn('Could not load images from database:', e);
          }
          
          // Format database questions to match exam.seed.json structure
          const formattedData = {
            title: 'Pain Medicine Assessment',
            durationMinutes: 120,
            questions: questionsData.map((q: any) => {
              const sourceData = q.question_data || {};
              const normalizedParts = q.parts || sourceData.parts || [];
              const normalizedImage = imagesMap[q.question_number] || q.image_url || sourceData.image_url || sourceData.asset?.file || null;

              // Merge canonical metadata with normalized database fields.
              if (q.question_data) {
                return {
                  ...sourceData,
                  id: sourceData.id || q.question_number,
                  number: sourceData.number || parseInt(q.question_number.replace(/\D/g, ''), 10),
                  type: q.type || sourceData.type,
                  stem: q.stem || sourceData.stem,
                  maxUnits: q.maxUnits || q.marks || sourceData.maxUnits || 1,
                  image_url: normalizedImage,
                  parts: normalizedParts,
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
                maxUnits: q.maxUnits || q.marks || 1,
                scoring: q.scoring || { marks: q.maxUnits || q.marks || 1 },
                options: q.options || parsedOptions,
                correctOption: q.type === 'mcq' ? (q.correctOption || q.correct_answer) : undefined,
                image_url: imagesMap[q.question_number] || q.image_url || null,
                parts: normalizedParts,
              };
            }),
          };
          
          setExamSeedData(formattedData);
          setSecondsRemaining((formattedData.durationMinutes || 120) * 60);
        } else {
          throw new Error(`Failed to load questions for paper: ${slug}`);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to load exam data:', error);
        setLoading(false);
      }
    };
    
    loadExamData();
  }, [slug]);

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

  // Handle Launching Assessment - NOW CALLS VERIFICATION API WITH PAPER SLUG
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
      // Call verification API with paper slug
      const response = await fetch(`/api/assessment/${slug}/verify-candidate`, {
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
        if (data.limited) {
          // Candidate has already attempted
          setFormError(
            "You've already taken this assessment. Only one attempt is allowed."
          );
        } else {
          setFormError(
            data.error || 'Verification failed. Please check your credentials.'
          );
        }
        return;
      }

      // Verification successful
      console.log('Candidate verified, attempt created:', data.attemptId);
      setAttemptId(data.attemptId);
      setCandidateInfo(data.candidateInfo);
      setFlowState('EXAM');
      setMcqAnswers({});
      setTextAnswers({});
      setFlaggedQuestions({});
      setCurrentQuestionIndex(0);
    } catch (error) {
      setFormError('Error verifying candidate: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  // Handler: Change current question
  const handleNavigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(Math.max(0, Math.min(index, totalQuestions - 1)));
  };

  // Handler: Update MCQ answer
  const handleSelectOption = (questionId: string, optionId: string) => {
    if (!optionId) return;
    setMcqAnswers(current => ({ ...current, [questionId]: optionId }));
  };

  // Handler: Update text answer (text/image/short answer)
  const handleInputTextAnswer = (questionId: string, answerText: string) => {
    setTextAnswers(current => ({ ...current, [questionId]: answerText }));
  };

  // Handler: Toggle flag on question
  const handleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions({
      ...flaggedQuestions,
      [questionId]: !flaggedQuestions[questionId],
    });
  };

  const getImageUrl = (question: any): string | null => {
    const imageUrl = question.image_url || question.asset?.file;
    if (!imageUrl) return null;
    if (/^(https?:)?\//.test(imageUrl)) return imageUrl;
    return `/${imageUrl.replace(/^assets\//, 'quiz-assets/')}`;
  };

  // Handler: Submit Assessment
  const handleSubmitAssessment = () => {
    setIsSubmitModalOpen(false);
    submitExamResponses();
    setFlowState('RESULT');
  };

  // Compute question status
  const getQuestionStatus = (q: any): 'unanswered' | 'answered' | 'flagged' => {
    const questionId = q.id || `Q${String(q.number).padStart(2, '0')}`;
    if (flaggedQuestions[questionId]) return 'flagged';
    if (q.type === 'mcq') {
      return typeof mcqAnswers[questionId] === 'string' && mcqAnswers[questionId].trim()
        ? 'answered'
        : 'unanswered';
    }
    if (q.type === 'image' && Array.isArray(q.parts)) {
      const hasPartAnswer = q.parts.some((part: any) =>
        Boolean(textAnswers[`${questionId}.${part.id}`]?.trim())
      );
      return hasPartAnswer ? 'answered' : 'unanswered';
    }
    return typeof textAnswers[questionId] === 'string' && textAnswers[questionId].trim()
      ? 'answered'
      : 'unanswered';
  };

  const answeredCount = questions.filter(
    (q: any) => getQuestionStatus(q) === 'answered'
  ).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

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

  // ==================== RENDERING SECTIONS ====================

  // Section 1: LOBBY - Credential Form
  if (flowState === 'LOBBY') {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                  <ClipboardList className="w-12 h-12 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Assessment Portal
                </h1>
                <p className="text-sm text-gray-600">
                  Enter your credentials to begin
                </p>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStartAssessment();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enrollment / Registration ID
                  </label>
                  <input
                    type="text"
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                    placeholder="e.g., ENC-001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={candidatePassword}
                    onChange={(e) => setCandidatePassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition mt-6"
                >
                  <Play className="w-5 h-5" />
                  Start Assessment
                </button>
              </form>

              {/* Footer */}
              <p className="text-xs text-center text-gray-500">
                Only authorized candidates may proceed.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Section 2: EXAM - Question Display
  if (flowState === 'EXAM') {
    const currentQuestion = questions[currentQuestionIndex];
    const timeStr = `${Math.floor(secondsRemaining / 60)
      .toString()
      .padStart(2, '0')}:${(secondsRemaining % 60).toString().padStart(2, '0')}`;

    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Assessment</h1>
              <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-mono">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className={secondsRemaining < 300 ? 'text-red-600 font-bold' : 'text-gray-700'}>
                  {timeStr}
                </span>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 gap-6 max-w-7xl mx-auto w-full px-6 py-8">
          {/* Main Content */}
          <div className="flex-1">
            {currentQuestion && (
              <div className="bg-white rounded-lg shadow p-8">
                {/* Question Header */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Question {currentQuestion.number || currentQuestionIndex + 1}
                    {flaggedQuestions[currentQuestion.id] && (
                      <Flag className="w-5 h-5 text-orange-500 inline ml-2" />
                    )}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Type: <span className="font-medium">{currentQuestion.type.replace(/_/g, ' ').toUpperCase()}</span> | Marks: <span className="font-medium">{currentQuestion.maxUnits}</span>
                  </p>
                </div>

                {/* Question Content */}
                <div className="mb-8">
                  <p className="text-lg text-gray-800 mb-6 leading-relaxed">
                    {currentQuestion.stem}
                  </p>

                  {/* Image if exists */}
                  {getImageUrl(currentQuestion) && (
                    <div className="mb-6">
                      <img
                        src={getImageUrl(currentQuestion) || ''}
                        alt="Question Image"
                        className="max-h-96 rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>

                {/* Answer Section */}
                {currentQuestion.type === 'mcq' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option: any, _idx: number) => {
                      const optionId = option.id || option.text || option.label || option;
                      const isSelected = mcqAnswers[currentQuestion.id] === optionId;

                      return (
                        <label
                          key={optionId}
                          className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-slate-200 bg-white hover:border-indigo-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={optionId}
                            checked={isSelected}
                            onChange={() => handleSelectOption(currentQuestion.id, optionId)}
                            className="mt-1"
                          />
                          <span className="text-gray-800">
                            {typeof option === 'string' ? option : option.text || option.label || JSON.stringify(option)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.type === 'image' && Array.isArray(currentQuestion.parts) && currentQuestion.parts.length > 0 && (
                  <div className="space-y-6">
                    {currentQuestion.parts.map((part: any, idx: number) => {
                      const responseKey = `${currentQuestion.id}.${part.id}`;
                      return (
                        <div key={part.id || idx}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Part {String.fromCharCode(97 + idx).toUpperCase()}: {part.prompt}
                          </label>
                          <textarea
                            value={textAnswers[responseKey] || ''}
                            onChange={(e) => handleInputTextAnswer(responseKey, e.target.value)}
                            placeholder={`Answer for part ${String.fromCharCode(97 + idx).toUpperCase()}...`}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            rows={3}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {(currentQuestion.type === 'short' ||
                  currentQuestion.type === 'short_answer' ||
                  currentQuestion.type === 'image_based' ||
                  currentQuestion.type === 'text') && (
                  <textarea
                    value={textAnswers[currentQuestion.id] || ''}
                    onChange={(e) =>
                      handleInputTextAnswer(currentQuestion.id, e.target.value)
                    }
                    placeholder="Type your answer here..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    rows={6}
                  />
                )}

                {/* Flag Button */}
                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between">
                  <button
                    onClick={() => handleFlagQuestion(currentQuestion.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                      flaggedQuestions[currentQuestion.id]
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                    {flaggedQuestions[currentQuestion.id]
                      ? 'Flagged'
                      : 'Flag for Review'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Question Navigator */}
          <aside className="w-80">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Questions ({answeredCount}/{totalQuestions})
              </h3>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
                <div className="bg-green-50 rounded p-2 text-center">
                  <p className="text-green-700 font-semibold">{answeredCount}</p>
                  <p className="text-green-600 text-xs">Answered</p>
                </div>
                <div className="bg-orange-50 rounded p-2 text-center">
                  <p className="text-orange-700 font-semibold">{flaggedCount}</p>
                  <p className="text-orange-600 text-xs">Flagged</p>
                </div>
                <div className="bg-slate-100 rounded p-2 text-center">
                  <p className="text-slate-700 font-semibold">
                    {totalQuestions - answeredCount}
                  </p>
                  <p className="text-slate-600 text-xs">Unanswered</p>
                </div>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((q: any, idx: number) => {
                  const status = getQuestionStatus(q);
                  const isCurrentQuestion = idx === currentQuestionIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleNavigateToQuestion(idx)}
                      className={`w-10 h-10 rounded text-sm font-semibold transition ${
                        isCurrentQuestion
                          ? 'ring-2 ring-indigo-500 bg-indigo-600 text-white'
                          : status === 'answered'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : status === 'flagged'
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleNavigateToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <button
                  onClick={() => handleNavigateToQuestion(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Submit Modal */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-sm p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Submit Assessment?</h2>
              <p className="text-gray-600">
                You have answered {answeredCount} out of {totalQuestions} questions.
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAssessment}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Section 3: RESULT - Final Results Display
  if (flowState === 'RESULT') {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Assessment Submitted
                </h1>
                <p className="text-gray-600">
                  Your responses have been recorded and will be reviewed shortly.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions Answered:</span>
                  <span className="font-semibold text-gray-900">{answeredCount}/{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions Flagged:</span>
                  <span className="font-semibold text-gray-900">{flaggedCount}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                You will receive your results via email.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return null;
}
