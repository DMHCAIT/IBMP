'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Flag
} from 'lucide-react';

export default function DynamicAssessmentPage() {
  const params = useParams();
  const paperSlug = params.slug ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : null;

  // Candidate Entry State
  const [candidateName, setCandidateName] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [candidatePassword, setCandidatePassword] = useState('');
  const [formError, setFormError] = useState('');
  
  // Assessment Flow State: 'LOBBY' | 'EXAM' | 'RESULT'
  const [flowState, setFlowState] = useState<'LOBBY' | 'EXAM' | 'RESULT'>('LOBBY');

  // Examination Navigation & Responses State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [examSeedData, setExamSeedData] = useState<any>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(120 * 60);
  const [loading, setLoading] = useState(true);
  
  // Store attempt ID and candidate ID for submission
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [candidateInfo, setCandidateInfo] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Paper Settings
  const [paperSettings, setPaperSettings] = useState<any>({
    name: 'Assessment',
    slug: paperSlug || 'assessment',
    durationMinutes: 120,
    totalMarks: 80,
    passingMarks: 50,
  });

  // Load exam data on mount
  useEffect(() => {
    const loadExamData = async () => {
      try {
        if (!paperSlug) {
          setFormError('Paper not found');
          setLoading(false);
          return;
        }

        // Fetch questions for this paper
        const response = await fetch(`/api/assessment/${paperSlug}/questions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            setFormError('Paper not found or no questions configured');
          } else {
            setFormError('Failed to load exam questions');
          }
          setLoading(false);
          return;
        }

        const questionsData = await response.json();
        console.log(`Loaded ${questionsData.length} questions for paper: ${paperSlug}`);
        
        // Load images for image-based questions
        let imagesMap: Record<string, string> = {};
        try {
          const imagesResponse = await fetch('/api/admin/assessment/questions/images-data?format=base64');
          if (imagesResponse.ok) {
            const allImages = await imagesResponse.json();
            if (Array.isArray(allImages)) {
              imagesMap = Object.fromEntries(
                allImages.map((img: any) => {
                  const question = questionsData.find((q: any) => q.id === img.questionId);
                  if (question) {
                    return [question.id, img.dataUri];
                  }
                  return ['', ''];
                }).filter((entry: any) => entry[0])
              );
            }
          }
        } catch (e) {
          console.warn('Could not load images:', e);
        }
        
        // Format data
        const formattedData = {
          title: `${paperSlug} Assessment`,
          durationMinutes: paperSettings.durationMinutes,
          questions: questionsData.map((q: any) => ({
            ...q,
            image_url: imagesMap[q.id] || q.image_url || null,
          })),
        };
        
        setExamSeedData(formattedData);
        setSecondsRemaining((formattedData.durationMinutes || 120) * 60);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load exam data:', error);
        setFormError('Failed to load exam questions');
        setLoading(false);
      }
    };
    
    loadExamData();
  }, [paperSlug]);

  // Candidate login handler
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

      setCandidateInfo(data.candidateInfo);
      setAttemptId(data.attemptId);
      setPaperSettings(data.paper);
      setFlowState('EXAM');
    } catch (error: any) {
      setFormError('Verification failed: ' + error.message);
    }
  };

  // Submit exam responses
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

      const result = await response.json();

      if (!response.ok) {
        alert('Submission failed: ' + (result.error || 'Unknown error'));
        setHasSubmitted(false);
        return;
      }

      setFlowState('RESULT');
      setIsSubmitModalOpen(false);
    } catch (error) {
      alert('Submission failed: ' + error);
      setHasSubmitted(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (flowState !== 'EXAM' || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          setIsSubmitModalOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [flowState, secondsRemaining]);

  // Questions
  const questions = examSeedData?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  // Format time display
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // LOBBY STATE - Candidate Entry
  if (flowState === 'LOBBY') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-8">
              <Award className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {paperSettings.name || 'Assessment'}
              </h1>
              <p className="text-gray-600">Enter your credentials to begin</p>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4 flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" />
                <p className="text-red-800">{formError}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment ID *</label>
                <input
                  type="text"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Your enrollment ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  value={candidatePassword}
                  onChange={(e) => setCandidatePassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Your password"
                  onKeyPress={(e) => e.key === 'Enter' && handleVerifyCandidate()}
                />
              </div>
            </div>

            <button
              onClick={handleVerifyCandidate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Assessment
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // RESULT STATE
  if (flowState === 'RESULT') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment Submitted</h2>
            <p className="text-gray-600 mb-6">
              Your assessment has been successfully submitted. Your responses have been recorded and will be evaluated.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
            >
              Return to Home
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // EXAM STATE - Main Assessment
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-center text-gray-600">No questions available. Please contact administrator.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with timer */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{paperSettings.name}</h1>
            <p className="text-sm text-gray-600">Q{currentQuestionIndex + 1}/{totalQuestions}</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-lg font-semibold text-orange-600">{formatTime(secondsRemaining)}</span>
            </div>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Display */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-8">
              {/* Question Stem */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{currentQuestion.stem}</h2>
                
                {/* Question Image */}
                {currentQuestion.image_url && (
                  <div className="mb-6 bg-gray-100 rounded-lg p-4 flex justify-center">
                    <img
                      src={currentQuestion.image_url}
                      alt="Question"
                      className="max-w-full max-h-96 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* MCQ Options */}
              {currentQuestion.type === 'mcq' && currentQuestion.options && (
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option: any, idx: number) => (
                    <label key={idx} className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition"
                      style={{
                        borderColor: mcqAnswers[currentQuestion.id] === (option.id || option.text || option.label || option) ? '#4F46E5' : '#E5E7EB',
                        backgroundColor: mcqAnswers[currentQuestion.id] === (option.id || option.text || option.label || option) ? '#F0F4FF' : 'white',
                      }}>
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option.id || option.text || option.label || option}
                        checked={mcqAnswers[currentQuestion.id] === (option.id || option.text || option.label || option)}
                        onChange={() => setMcqAnswers({ ...mcqAnswers, [currentQuestion.id]: option.id || option.text || option.label || option })}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 text-gray-800">{option.text || option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Text Answer */}
              {(currentQuestion.type === 'text' || currentQuestion.type === 'short' || currentQuestion.type === 'short-answer') && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer:</label>
                  <textarea
                    value={textAnswers[currentQuestion.id] || ''}
                    onChange={(e) => setTextAnswers({ ...textAnswers, [currentQuestion.id]: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    rows={6}
                    placeholder="Enter your answer here..."
                  />
                </div>
              )}

              {/* Image Question Parts */}
              {currentQuestion.type === 'image' && currentQuestion.parts && (
                <div className="space-y-6">
                  {currentQuestion.parts.map((part: any, idx: number) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Part {String.fromCharCode(97 + idx).toUpperCase()}: {part.prompt}
                      </label>
                      <textarea
                        value={textAnswers[`${currentQuestion.id}.${part.id}`] || ''}
                        onChange={(e) => setTextAnswers({
                          ...textAnswers,
                          [`${currentQuestion.id}.${part.id}`]: e.target.value
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        rows={3}
                        placeholder={`Answer for part ${String.fromCharCode(97 + idx).toUpperCase()}...`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Question Navigator Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">Questions</h3>
              
              {/* Flag question button */}
              <button
                onClick={() => setFlaggedQuestions({ ...flaggedQuestions, [currentQuestion.id]: !flaggedQuestions[currentQuestion.id] })}
                className={`w-full mb-4 py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${
                  flaggedQuestions[currentQuestion.id]
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Flag className="w-4 h-4" />
                {flaggedQuestions[currentQuestion.id] ? 'Flagged' : 'Flag'}
              </button>

              {/* Question grid */}
              <div className="grid grid-cols-6 gap-2 mb-6">
                {questions.map((q: any, idx: number) => {
                  let statusClass = 'bg-gray-200 text-gray-700';
                  if (flaggedQuestions[q.id]) statusClass = 'bg-yellow-200 text-yellow-800';
                  if (mcqAnswers[q.id] || textAnswers[q.id]) statusClass = 'bg-green-200 text-green-800';

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`p-2 rounded text-xs font-semibold ${statusClass} ${
                        currentQuestionIndex === idx ? 'ring-2 ring-indigo-600' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="text-xs text-gray-600 space-y-1">
                <p>✓ Attempted: {Object.keys(mcqAnswers).length + Object.keys(textAnswers).length}</p>
                <p>⚠ Flagged: {Object.values(flaggedQuestions).filter(Boolean).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={() => setCurrentQuestionIndex(Math.min(totalQuestions - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Assessment?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit? You cannot change your answers after submission.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitExamResponses}
                disabled={hasSubmitted}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {hasSubmitted ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
