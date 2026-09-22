'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronLeft, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface EditablePart {
  id: string;
  prompt: string;
  expectedAnswer: string;
}

interface Question {
  id: string;
  question_number: string;
  type: 'mcq' | 'image' | 'short';
  stem: string;
  marks: number;
  correct_answer?: string;
  options?: string[];
  image_url?: string | null;
  parts?: EditablePart[];
  question_data?: Record<string, any>;
  expected_answer?: string;
}

interface Paper {
  id: string;
  name: string;
}

const QUESTION_PATTERN = {
  mcq: { label: 'MCQ' },
  image: { label: 'Image question' },
  short: { label: 'Short answer' },
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
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    question_number: '',
    type: 'mcq' as 'mcq' | 'image' | 'short',
    stem: '',
    marks: 1,
    correct_answer: '',
    options: ['', '', '', ''],
    image_url: '',
    parts: [] as EditablePart[],
    expected_answer: '',
  });

  useEffect(() => {
    loadData();
  }, [paperId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const paperRes = await fetch(`/api/admin/assessment/papers/${paperId}`, { cache: 'no-store' });
      if (paperRes.ok) {
        const paperData = await paperRes.json();
        const cleanPaper = {
          id: String(paperData.paper?.id || ''),
          name: String(paperData.paper?.name || 'Paper'),
        };
        setPaper(cleanPaper);
      }

      const questionsRes = await fetch(`/api/admin/assessment/papers/${paperId}/questions`, { cache: 'no-store' });
      if (questionsRes.ok) {
        const rawQuestions = await questionsRes.json();
        const questionsData = (Array.isArray(rawQuestions) ? rawQuestions : []).map((q: any) => {
          let parsedOptions: string[] = [];
          if (typeof q.options === 'string') {
            try {
              const parsed = JSON.parse(q.options);
              if (Array.isArray(parsed)) {
                parsedOptions = parsed.map((o: any) => {
                  if (typeof o === 'string') return o;
                  if (typeof o === 'object' && o !== null && o.text) return String(o.text);
                  return '';
                }).filter(Boolean);
              }
            } catch {
              parsedOptions = [];
            }
          } else if (Array.isArray(q.options)) {
            parsedOptions = q.options.map((o: any) => {
              if (typeof o === 'string') return o;
              if (typeof o === 'object' && o !== null && o.text) return String(o.text);
              return '';
            }).filter(Boolean);
          }

          let parsedParts: any[] = [];
          const seedParts = Array.isArray(q.question_data?.parts) ? q.question_data.parts : [];
          const rubric = Array.isArray(q.question_data?.scoring?.rubric) ? q.question_data.scoring.rubric : [];
          parsedParts = seedParts.map((part: any, index: number) => ({
            id: String(part.id || String.fromCharCode(97 + index)),
            prompt: String(part.prompt || ''),
            expectedAnswer: String(rubric.find((item: any) => item.partId === part.id || (!item.partId && index === 0))?.answer || ''),
          }));

          return {
            id: String(q.id || ''),
            question_number: String(q.question_number || ''),
            type: q.type,
            stem: String(q.stem || ''),
            marks: Number(q.marks || 1),
            correct_answer: String(q.correct_answer || ''),
            options: parsedOptions,
            image_url: q.image_url ? String(q.image_url) : null,
            parts: parsedParts,
            question_data: q.question_data || {},
            expected_answer: String(rubric[0]?.answer || ''),
          };
        });
        setQuestions(questionsData);
      }
    } catch (err) {
      console.error('Load data error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getQuestionsForType = () => {
    return questions;
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    const options = Array.isArray(question.options) 
      ? question.options 
      : typeof question.options === 'string'
        ? JSON.parse(question.options)
        : ['', '', '', ''];
    setFormData({
      question_number: question.question_number,
      type: question.type,
      stem: question.stem,
      marks: question.marks,
      correct_answer: question.correct_answer || '',
      options: options,
      image_url: question.image_url || '',
      parts: question.parts || [],
      expected_answer: question.expected_answer || question.question_data?.scoring?.rubric?.[0]?.answer || '',
    });
    setShowForm(true);
  };

  const handleImageUpload = async (file: File) => {
    if (!editingQuestion?.id) {
      setError('Save the question first, then upload its image.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('questionId', editingQuestion.id);
      uploadData.append('paperId', paperId);
      uploadData.append('imageTitle', `${formData.question_number} reference image`);
      const response = await fetch('/api/admin/assessment/questions/images', {
        method: 'POST',
        body: uploadData,
      });
      const result = await response.json();
      const imageUrl = result.image_url || result.url;
      if (!response.ok || !imageUrl) throw new Error(result.error || 'Image upload failed');
      setFormData(current => ({ ...current, image_url: imageUrl }));
      setSuccess('Image uploaded. Save the question to persist it.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      const qNum = parseInt(formData.question_number.replace(/[^\d]/g, ''));

      // Validation
      if (qNum < 1 || qNum > 60) {
        throw new Error('Question number must be between Q01 and Q60');
      }

      if (!formData.stem.trim()) {
        throw new Error('Question stem is required');
      }

      // Validate MCQ
      if (formData.options.some(opt => !opt.trim())) {
        if (formData.type === 'mcq') throw new Error('All 4 MCQ options must be filled');
      }
      if (formData.type === 'mcq' && !formData.correct_answer) {
        throw new Error('Correct answer must be specified');
      }
      if (formData.type === 'short' && !formData.expected_answer.trim()) {
        throw new Error('Expected answer must be specified');
      }
      if (formData.type === 'image' && (
        formData.parts.length !== 3 ||
        formData.parts.some(part => !part.prompt.trim() || !part.expectedAnswer.trim())
      )) {
        throw new Error('Image questions must have three parts with expected answers');
      }

      const questionData = {
        ...(editingQuestion?.question_data || {}),
        parts: formData.type === 'image'
          ? formData.parts.map(part => ({ id: part.id, prompt: part.prompt }))
          : [],
        scoring: {
          ...(editingQuestion?.question_data?.scoring || {}),
          rubric: formData.type === 'image'
            ? formData.parts.map(part => ({
                id: `${formData.question_number}.${part.id}`,
                partId: part.id,
                maxUnits: 1,
                allowedUnits: [0, 1],
                answer: part.expectedAnswer,
              }))
            : [{
                id: `${formData.question_number}.answer`,
                maxUnits: 1,
                allowedUnits: [0, 1],
                answer: formData.expected_answer,
              }],
        },
      };
      const payload = {
        ...formData,
        question_data: questionData,
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
      const res = await fetch(`/api/admin/assessment/questions/${questionId}?paperId=${paperId}`, {
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
      type: 'mcq' as const,
      stem: '',
      marks: 1,
      correct_answer: '',
      options: ['', '', '', ''],
      image_url: '',
      parts: [],
      expected_answer: '',
    });
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

  const mcqQuestions = getQuestionsForType();

  const QuestionCard = ({ question }: { question: Question }) => {
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-gray-900">{question.question_number}</h3>
              <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800">
                {QUESTION_PATTERN[question.type].label} ({question.marks}M)
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

        {question.options && (
          <div className="text-xs text-gray-600 space-y-1">
            {Array.isArray(question.options) && question.options.map((opt, idx) => {
              return (
                <div key={idx} className={opt === question.correct_answer ? 'font-bold text-green-700' : ''}>
                  {String.fromCharCode(65 + idx)}) {opt}
                </div>
              );
            })}
          </div>
        )}
        {question.image_url && (
          <img src={question.image_url} alt={`${question.question_number} reference`} className="mt-3 max-h-48 rounded border border-gray-200" />
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
                    placeholder="Q01 to Q60"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Q01-Q60 (format is preserved from the seed)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Type (Auto-Detected)</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'mcq' | 'image' | 'short' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  >
                    <option value="mcq">MCQ</option>
                    <option value="image">Image question</option>
                    <option value="short">Short answer</option>
                  </select>
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

              {(formData.type === 'image' || formData.image_url) && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Question Image</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleImageUpload(file);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="Uploaded image URL or asset path"
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Question preview" className="mt-3 max-h-48 rounded border border-gray-200" />
                  )}
                </div>
              )}

              {formData.type === 'short' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Expected Answer *</label>
                  <textarea
                    value={formData.expected_answer}
                    onChange={(e) => setFormData({ ...formData, expected_answer: e.target.value })}
                    placeholder="Enter the expected answer or accepted marking guidance"
                    rows={4}
                    className="w-full px-4 py-2 border border-green-300 rounded-lg"
                    required
                  />
                </div>
              )}

              {formData.type === 'image' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase">Sub-questions and expected answers</label>
                      <p className="text-xs text-gray-500 mt-1">Image questions normally contain parts a, b, and c. Short answers use one part.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(current => ({
                        ...current,
                        parts: [...current.parts, { id: String.fromCharCode(97 + current.parts.length), prompt: '', expectedAnswer: '' }],
                      }))}
                      className="px-3 py-2 text-sm border border-indigo-300 text-indigo-700 rounded-lg"
                    >
                      Add part
                    </button>
                  </div>
                  {formData.parts.map((part, index) => (
                    <div key={part.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-700">Part {part.id || String.fromCharCode(97 + index)}</span>
                        <button
                          type="button"
                          onClick={() => setFormData(current => ({ ...current, parts: current.parts.filter((_, partIndex) => partIndex !== index) }))}
                          className="text-sm text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <textarea
                        value={part.prompt}
                        onChange={(e) => setFormData(current => ({
                          ...current,
                          parts: current.parts.map((item, partIndex) => partIndex === index ? { ...item, prompt: e.target.value } : item),
                        }))}
                        placeholder={`Part ${part.id} prompt`}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                      <textarea
                        value={part.expectedAnswer}
                        onChange={(e) => setFormData(current => ({
                          ...current,
                          parts: current.parts.map((item, partIndex) => partIndex === index ? { ...item, expectedAnswer: e.target.value } : item),
                        }))}
                        placeholder="Expected answer / marking guidance"
                        rows={3}
                        className="w-full px-4 py-2 border border-green-300 rounded-lg"
                        required
                      />
                    </div>
                  ))}
                </div>
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
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-bold mb-2">SEED QUESTIONS (Q01-Q60)</p>
            <p className="text-2xl font-bold text-blue-600">{questions.length}/60</p>
            <p className="text-xs text-blue-800 mt-1">MCQ, image, and short-answer formats preserved</p>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6">
            {mcqQuestions.length > 0 ? (
              <div className="space-y-4">
                {mcqQuestions.map(q => (
                  <QuestionCard key={q.id} question={q} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No questions yet. Click &quot;Add Question&quot; to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
