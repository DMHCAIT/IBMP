'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronLeft, X, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface QuestionPart {
  id?: string;
  partLabel: string; // 'a', 'b', 'c'
  prompt: string;
  marks: number;
  correctAnswer: string;
}

interface Question {
  id: string;
  question_number: string;
  type: 'mcq' | 'image' | 'short';
  stem: string;
  marks: number;
  correct_answer?: string;
  options?: string[];
  image_url?: string;
  // For image-based questions
  parts?: QuestionPart[];
}

interface Paper {
  id: string;
  name: string;
}

const QUESTION_PATTERN = {
  mcq: { start: 1, end: 40, marksPerQ: 1, totalMarks: 40, label: 'MCQ Questions' },
  image: { start: 41, end: 50, marksPerQ: 3, totalMarks: 30, label: 'Image-Based Questions' },
  short: { start: 51, end: 60, marksPerQ: 1, totalMarks: 10, label: 'Short Answer Questions' }
};

export default function ManagePaperQuestionsPage() {
  const params = useParams();
  const paperId = params.paperId as string;

  const [paper, setPaper] = useState<Paper | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'mcq' | 'image' | 'short'>('mcq');

  const [formData, setFormData] = useState({
    question_number: '',
    type: 'mcq' as 'mcq' | 'image' | 'short',
    stem: '',
    marks: 1,
    correct_answer: '',
    options: ['', '', '', ''],
    parts: [
      { partLabel: 'a', prompt: '', marks: 1, correctAnswer: '' },
      { partLabel: 'b', prompt: '', marks: 1, correctAnswer: '' },
      { partLabel: 'c', prompt: '', marks: 1, correctAnswer: '' }
    ] as QuestionPart[],
    image_url: '',
  });

  useEffect(() => {
    loadData();
  }, [paperId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const paperRes = await fetch(`/api/admin/assessment/papers/${paperId}`);
      const paperData = await paperRes.json();
      setPaper(paperData.paper);

      const questionsRes = await fetch(`/api/admin/assessment/papers/${paperId}/questions`);
      if (questionsRes.ok) {
        const questionsData = await questionsRes.json();
        setQuestions(questionsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getQuestionType = (qNum: string): 'mcq' | 'image' | 'short' => {
    const num = parseInt(qNum.replace(/[^\d]/g, ''));
    if (num >= 1 && num <= 40) return 'mcq';
    if (num >= 41 && num <= 50) return 'image';
    return 'short';
  };

  const getQuestionsForType = (type: 'mcq' | 'image' | 'short') => {
    const range = QUESTION_PATTERN[type];
    return questions.filter(q => {
      const num = parseInt(q.question_number.replace(/[^\d]/g, ''));
      return num >= range.start && num <= range.end;
    });
  };

  const questionsProgress = {
    mcq: getQuestionsForType('mcq').length,
    image: getQuestionsForType('image').length,
    short: getQuestionsForType('short').length,
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    const type = getQuestionType(question.question_number);
    setFormData({
      question_number: question.question_number,
      type: type,
      stem: question.stem,
      marks: question.marks,
      correct_answer: question.correct_answer || '',
      options: question.options || ['', '', '', ''],
      parts: question.parts || [
        { partLabel: 'a', prompt: '', marks: 1, correctAnswer: '' },
        { partLabel: 'b', prompt: '', marks: 1, correctAnswer: '' },
        { partLabel: 'c', prompt: '', marks: 1, correctAnswer: '' }
      ],
      image_url: question.image_url || '',
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      const qNum = parseInt(formData.question_number.replace(/[^\d]/g, ''));
      const expectedType = getQuestionType(formData.question_number);

      // Validation
      if (qNum < 1 || qNum > 60) {
        throw new Error('Question number must be between Q01 and Q60');
      }

      if (expectedType !== formData.type) {
        throw new Error(`Question ${formData.question_number} should be ${QUESTION_PATTERN[expectedType].label}`);
      }

      if (!formData.stem.trim()) {
        throw new Error('Question stem is required');
      }

      // Validate based on type
      if (formData.type === 'mcq') {
        if (formData.options.some(opt => !opt.trim())) {
          throw new Error('All MCQ options must be filled');
        }
        if (!formData.correct_answer) {
          throw new Error('Correct answer must be specified');
        }
      } else if (formData.type === 'image') {
        if (formData.parts.some(p => !p.prompt.trim() || !p.correctAnswer.trim())) {
          throw new Error('All parts must have prompt and correct answer');
        }
      } else if (formData.type === 'short') {
        if (!formData.correct_answer.trim()) {
          throw new Error('Expected answer is required for short answer questions');
        }
      }

      let imageUrl = formData.image_url;
      if (imageFile && formData.type === 'image') {
        const formDataImg = new FormData();
        formDataImg.append('file', imageFile);
        formDataImg.append('bucket', 'assessment-images');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formDataImg,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
      }

      const payload = {
        ...formData,
        image_url: imageUrl,
        paper_id: paperId,
      };

      const url = editingQuestion
        ? `/api/admin/assessment/questions/${editingQuestion.id}`
        : '/api/admin/assessment/questions';

      const method = editingQuestion ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save question');
      }

      setSuccess(`Question ${editingQuestion ? 'updated' : 'added'} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
      
      setImageFile(null);
      setShowForm(false);
      setEditingQuestion(null);
      resetForm();
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save question');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (questionId: string, qNum: string) => {
    if (!confirm(`Delete Question ${qNum}?`)) return;

    try {
      const res = await fetch(`/api/admin/assessment/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');
      setSuccess('Question deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question');
    }
  };

  const resetForm = () => {
    setFormData({
      question_number: '',
      type: 'mcq',
      stem: '',
      marks: 1,
      correct_answer: '',
      options: ['', '', '', ''],
      parts: [
        { partLabel: 'a', prompt: '', marks: 1, correctAnswer: '' },
        { partLabel: 'b', prompt: '', marks: 1, correctAnswer: '' },
        { partLabel: 'c', prompt: '', marks: 1, correctAnswer: '' }
      ],
      image_url: '',
    });
    setImageFile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  const mcqQuestions = getQuestionsForType('mcq');
  const imageQuestions = getQuestionsForType('image');
  const shortQuestions = getQuestionsForType('short');

  const QuestionCard = ({ question }: { question: Question }) => {
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-gray-900">{question.question_number}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                question.type === 'mcq' ? 'bg-blue-100 text-blue-800' :
                question.type === 'image' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {question.type === 'mcq' ? 'MCQ (1M)' : question.type === 'image' ? 'IMAGE (3M)' : 'SHORT (1M)'}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{question.stem.substring(0, 100)}...</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => handleEdit(question)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(question.id, question.question_number)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {question.type === 'mcq' && question.options && (
          <div className="text-xs text-gray-600 space-y-1">
            {question.options.map((opt, idx) => (
              <div key={idx} className={opt === question.correct_answer ? 'font-bold text-green-700' : ''}>
                {String.fromCharCode(65 + idx)}) {opt}
              </div>
            ))}
          </div>
        )}

        {question.type === 'image' && question.image_url && (
          <div className="text-xs text-indigo-600 mb-2 flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            Image attached
          </div>
        )}

        {question.type === 'image' && question.parts && (
          <div className="text-xs text-gray-600 space-y-1 mt-2 pt-2 border-t border-gray-200">
            {question.parts.map((part) => (
              <div key={part.partLabel}>
                <strong>({part.partLabel})</strong> {part.prompt.substring(0, 60)}...
              </div>
            ))}
          </div>
        )}

        {question.type === 'short' && (
          <div className="text-xs text-gray-600">
            <strong>Expected:</strong> {question.correct_answer?.substring(0, 80)}...
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            href={`/admin/assessment/papers/${paperId}/candidates`}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Paper
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{paper?.name}</h1>
              <p className="text-gray-600 mt-1">Manage 60-question assessment pattern</p>
            </div>
            {!showForm && (
              <button
                onClick={() => {
                  resetForm();
                  setEditingQuestion(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Question
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-700 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>{success}</div>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingQuestion(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Question Number & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Question Number *</label>
                  <input
                    type="text"
                    value={formData.question_number}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setFormData({ ...formData, question_number: val });
                    }}
                    placeholder="Q01, Q41, Q51, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Q01-Q40 (MCQ), Q41-Q50 (Image), Q51-Q60 (Short)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Type (Auto-Detected)</label>
                  <input
                    type="text"
                    value={QUESTION_PATTERN[formData.type].label}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
              </div>

              {/* Stem */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Question Stem *</label>
                <textarea
                  value={formData.stem}
                  onChange={(e) => setFormData({ ...formData, stem: e.target.value })}
                  placeholder="Enter the question text..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* MCQ Options */}
              {formData.type === 'mcq' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase">Options (A, B, C, D) *</label>
                    <div className="space-y-2">
                      {formData.options.map((opt, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...formData.options];
                            newOpts[idx] = e.target.value;
                            setFormData({ ...formData, options: newOpts });
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Correct Answer *</label>
                    <select
                      value={formData.correct_answer}
                      onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select correct option...</option>
                      {formData.options.map((opt, idx) => (
                        <option key={idx} value={opt}>
                          {String.fromCharCode(65 + idx)}) {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Marks:</strong> 1 (Fixed for MCQ)
                    </p>
                  </div>
                </>
              )}

              {/* Image Question - Image Upload & Parts */}
              {formData.type === 'image' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Question Image *</label>
                    {formData.image_url && (
                      <div className="mb-4 relative">
                        <img
                          src={formData.image_url}
                          alt="Question"
                          className="w-full max-h-64 object-contain border border-gray-300 rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase">Image Sub-Questions (a, b, c) *</label>
                    <div className="space-y-4">
                      {formData.parts.map((part, idx) => (
                        <div key={idx} className="border border-gray-300 rounded-lg p-4">
                          <div className="font-bold text-gray-900 mb-3">Part ({part.partLabel})</div>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-bold text-gray-700 mb-1 block">Prompt *</label>
                              <input
                                type="text"
                                value={part.prompt}
                                onChange={(e) => {
                                  const newParts = [...formData.parts];
                                  newParts[idx].prompt = e.target.value;
                                  setFormData({ ...formData, parts: newParts });
                                }}
                                placeholder={`Question part ${part.partLabel}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-700 mb-1 block">Expected Answer *</label>
                              <input
                                type="text"
                                value={part.correctAnswer}
                                onChange={(e) => {
                                  const newParts = [...formData.parts];
                                  newParts[idx].correctAnswer = e.target.value;
                                  setFormData({ ...formData, parts: newParts });
                                }}
                                placeholder="Model answer"
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                required
                              />
                            </div>
                            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              <strong>Marks:</strong> 1 (Fixed per part)
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-900">
                      <strong>Total Marks for Question:</strong> 3 (1 mark per part × 3 parts)
                    </p>
                  </div>
                </>
              )}

              {/* Short Answer Question */}
              {formData.type === 'short' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Expected / Model Answer *</label>
                    <textarea
                      value={formData.correct_answer}
                      onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                      placeholder="One-line or brief expected answer..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-900">
                      <strong>Marks:</strong> 1 (Fixed for Short Answer)
                    </p>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
                >
                  {uploading ? 'Saving...' : editingQuestion ? 'Update Question' : 'Add Question'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Question Progress */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-bold mb-2">MCQ QUESTIONS (Q1-Q40)</p>
            <p className="text-2xl font-bold text-blue-600">{questionsProgress.mcq}/40</p>
            <p className="text-xs text-blue-800 mt-1">40 marks total</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-900 font-bold mb-2">IMAGE QUESTIONS (Q41-Q50)</p>
            <p className="text-2xl font-bold text-purple-600">{questionsProgress.image}/10</p>
            <p className="text-xs text-purple-800 mt-1">30 marks total (3 per Q)</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900 font-bold mb-2">SHORT ANSWER (Q51-Q60)</p>
            <p className="text-2xl font-bold text-green-600">{questionsProgress.short}/10</p>
            <p className="text-xs text-green-800 mt-1">10 marks total</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('mcq')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'mcq'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              MCQ (Q1-Q40)
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'image'
                  ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Image (Q41-Q50)
            </button>
            <button
              onClick={() => setActiveTab('short')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'short'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Short Answer (Q51-Q60)
            </button>
          </div>

          <div className="p-6 space-y-4">
            {activeTab === 'mcq' && (
              mcqQuestions.length > 0 ? (
                <div className="space-y-4">
                  {mcqQuestions.map(q => (
                    <QuestionCard key={q.id} question={q} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No MCQ questions yet. Click &quot;Add Question&quot; to get started.</p>
                </div>
              )
            )}

            {activeTab === 'image' && (
              imageQuestions.length > 0 ? (
                <div className="space-y-4">
                  {imageQuestions.map(q => (
                    <QuestionCard key={q.id} question={q} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No image-based questions yet. Click &quot;Add Question&quot; to get started.</p>
                </div>
              )
            )}

            {activeTab === 'short' && (
              shortQuestions.length > 0 ? (
                <div className="space-y-4">
                  {shortQuestions.map(q => (
                    <QuestionCard key={q.id} question={q} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No short answer questions yet. Click &quot;Add Question&quot; to get started.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
