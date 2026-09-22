'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, ChevronLeft, X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Question {
  id: string;
  question_number: string;
  type: 'mcq' | 'image_based' | 'short_answer';
  stem: string;
  marks: number;
  question_set?: string;
  correct_answer?: string;
  options?: string[];
  image_url?: string;
  module?: string;
}

interface Paper {
  id: string;
  name: string;
}

export default function ManagePaperQuestionsPage() {
  const params = useParams();
  const paperId = params.paperId as string;

  const [paper, setPaper] = useState<Paper | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    question_number: '',
    type: 'mcq' as 'mcq' | 'image_based' | 'short_answer',
    marks: 1,
    question_set: 'Set A',
    stem: '',
    options: ['', '', '', ''],
    correct_answer: '',
    module: 'Module 1',
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

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      question_number: question.question_number,
      type: question.type,
      marks: question.marks,
      question_set: question.question_set || 'Set A',
      stem: question.stem,
      options: Array.isArray(question.options) ? question.options : [],
      correct_answer: question.correct_answer || '',
      module: question.module || 'Module 1',
      image_url: question.image_url || '',
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if provided
      if (imageFile) {
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

      if (!res.ok) throw new Error('Failed to save question');

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

  const handleDelete = async (questionId: string) => {
    if (!confirm('Delete this question?')) return;

    try {
      const res = await fetch(`/api/admin/assessment/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question');
    }
  };

  const resetForm = () => {
    setFormData({
      question_number: '',
      type: 'mcq',
      marks: 1,
      question_set: 'Set A',
      stem: '',
      options: ['', '', '', ''],
      correct_answer: '',
      module: 'Module 1',
      image_url: '',
    });
    setImageFile(null);
  };

  const getQuestionNumber = (qNum: string) => parseInt(qNum.replace(/[^\d]/g, '')) || 0;
  const isImageQuestion = (qNum: string) => getQuestionNumber(qNum) >= 41 && getQuestionNumber(qNum) <= 50;

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link href={`/admin/assessment/papers/${paperId}/candidates`} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Papers
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{paper?.name}</h1>
              <p className="text-gray-600 mt-1">Manage questions for this exam paper</p>
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
      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
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
              {/* Top Row: Q#, Type, Marks, Set */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Question Number *</label>
                  <input
                    type="text"
                    value={formData.question_number}
                    onChange={(e) => setFormData({ ...formData, question_number: e.target.value })}
                    placeholder="Q01, Q41, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="image_based">Image-Based</option>
                    <option value="short_answer">Short Answer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Marks *</label>
                  <input
                    type="number"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Question Set</label>
                  <select
                    value={formData.question_set}
                    onChange={(e) => setFormData({ ...formData, question_set: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
                  >
                    <option>Set A</option>
                    <option>Set B</option>
                    <option>Set C</option>
                    <option>Set D</option>
                  </select>
                </div>
              </div>

              {/* Module Dropdown */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Module</label>
                <select
                  value={formData.module}
                  onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option>Module 1</option>
                  <option>Module 2</option>
                  <option>Module 3</option>
                  <option>Module 4</option>
                  <option>Module 5</option>
                </select>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Question Text *</label>
                <textarea
                  value={formData.stem}
                  onChange={(e) => setFormData({ ...formData, stem: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter the question..."
                  required
                />
              </div>

              {/* Image Upload for Q41-Q50 */}
              {isImageQuestion(formData.question_number) && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Question Image (Q41-Q50)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Click to upload image
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {imageFile ? imageFile.name : 'PNG, JPG, GIF up to 10MB'}
                      </p>
                    </label>
                  </div>
                </div>
              )}

              {/* Options for MCQ */}
              {formData.type === 'mcq' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Options (Separate with line breaks)</label>
                  <div className="space-y-2">
                    {formData.options.map((option, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...formData.options];
                          newOptions[idx] = e.target.value;
                          setFormData({ ...formData, options: newOptions });
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Correct Answer */}
              {formData.type === 'mcq' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Correct Answer *</label>
                  <select
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select answer...</option>
                    {formData.options.map((_, idx) => (
                      <option key={idx} value={String.fromCharCode(65 + idx)}>
                        {String.fromCharCode(65 + idx)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
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
                    setEditingQuestion(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">No questions yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-5 h-5" />
                Create First Question
              </button>
            </div>
          ) : (
            questions.map((question) => (
              <div key={question.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                {/* Question Preview Row */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="font-bold text-gray-900 w-12">{question.question_number}</div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {question.type === 'mcq' ? 'MCQ' : question.type === 'image_based' ? 'Image' : 'Short'}
                    </div>
                    <div className="text-sm text-gray-600">{question.marks}</div>
                    <div className="flex-1 text-gray-700 line-clamp-1">{question.stem}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(question)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded transition"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Question Details */}
                {question.type === 'mcq' && question.options && (
                  <div className="px-6 py-4 text-sm text-gray-600">
                    {Array.isArray(question.options) ? (
                      question.options.map((opt, idx) => (
                        <div key={idx} className="text-gray-600">
                          {String.fromCharCode(65 + idx)}. {opt}
                        </div>
                      ))
                    ) : null}
                    {question.correct_answer && (
                      <div className="mt-2 font-medium text-green-700">
                        ✓ Answer: {question.correct_answer}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
