'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ArrowLeft, Loader, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  question_number: number;
  type: string;
  stem: string;
  options: any;
  correct_answer: string;
  marks: number;
  paper_id: string;
}

interface Paper {
  id: string;
  name: string;
  slug: string;
}

export default function PaperQuestionsPage({ params }: { params: { paperId: string } }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    question_number: 1,
    type: 'MCQ',
    stem: '',
    options: 'A: \nB: \nC: \nD: ',
    correct_answer: 'A',
    marks: 1,
  });

  useEffect(() => {
    loadPaper();
    loadQuestions();
  }, [params.paperId]);

  const loadPaper = async () => {
    try {
      const response = await fetch(`/api/admin/assessment/papers/${params.paperId}`);
      const data = await response.json();
      setPaper(data.paper);
    } catch (err) {
      console.error('Error loading paper:', err);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/assessment/papers/${params.paperId}/questions`);
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (question: Question) => {
    setEditingId(question.id);
    setFormData({
      question_number: question.question_number,
      type: question.type,
      stem: question.stem,
      options: Array.isArray(question.options)
        ? question.options.map((o: any, i: number) => `${String.fromCharCode(65 + i)}: ${o}`).join('\n')
        : question.options || '',
      correct_answer: question.correct_answer,
      marks: question.marks,
    });
    setShowAddForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const optionsList = formData.options
        .split('\n')
        .filter((o) => o.trim())
        .map((o) => o.replace(/^[A-D]:\s*/, '').trim());

      const payload = {
        ...formData,
        options: optionsList,
        paper_id: params.paperId,
      };

      const url = editingId
        ? `/api/admin/assessment/questions/${editingId}`
        : '/api/admin/assessment/questions';

      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (editingId) {
          // Update existing question
          setQuestions(questions.map((q) => (q.id === editingId ? data : q)));
        } else {
          // Add new question
          setQuestions([...questions, data]);
        }

        // Reset form
        setFormData({
          question_number: questions.length + 1,
          type: 'MCQ',
          stem: '',
          options: 'A: \nB: \nC: \nD: ',
          correct_answer: 'A',
          marks: 1,
        });
        setEditingId(null);
        setShowAddForm(false);
      } else {
        setError(data.error || 'Failed to save question');
      }
    } catch (err) {
      console.error('Error saving question:', err);
      setError('Failed to save question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const res = await fetch(`/api/admin/assessment/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setQuestions(questions.filter((q) => q.id !== questionId));
      } else {
        setError('Failed to delete question');
      }
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Failed to delete question');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/assessment/papers"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Papers
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            {paper?.name} - Questions
          </h1>
          <p className="text-sm text-slate-600 mt-1">Manage all questions for this paper - add, edit, or delete</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              question_number: questions.length + 1,
              type: 'MCQ',
              stem: '',
              options: 'A: \nB: \nC: \nD: ',
              correct_answer: 'A',
              marks: 1,
            });
            setShowAddForm(!showAddForm);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary-600 text-white font-bold rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-primary">
            {editingId ? 'Edit Question' : 'Add New Question'} - {paper?.name}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Question Number *
                </label>
                <input
                  type="number"
                  value={formData.question_number}
                  onChange={(e) => setFormData({ ...formData, question_number: parseInt(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Question Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                >
                  <option value="MCQ">Multiple Choice (MCQ)</option>
                  <option value="Essay">Essay</option>
                  <option value="TrueFalse">True/False</option>
                  <option value="ShortAnswer">Short Answer</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Question Text *
                </label>
                <textarea
                  value={formData.stem}
                  onChange={(e) => setFormData({ ...formData, stem: e.target.value })}
                  placeholder="Enter the question text here"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  rows={3}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Answer Options (one per line)
                </label>
                <textarea
                  value={formData.options}
                  onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                  placeholder="A: First option&#10;B: Second option&#10;C: Third option&#10;D: Fourth option"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary font-mono"
                  rows={4}
                />
                <p className="text-xs text-slate-500 mt-1">Format: A: Option text</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Correct Answer *
                </label>
                <input
                  type="text"
                  value={formData.correct_answer}
                  onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                  placeholder="A"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Marks *
                </label>
                <input
                  type="number"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-secondary hover:bg-secondary-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingId ? 'Update Question' : 'Add Question'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                }}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader className="w-8 h-8 animate-spin text-secondary mx-auto mb-2" />
          <p className="text-slate-600">Loading questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-600 mb-4">No questions added yet for this paper.</p>
          <button
            onClick={() => {
              setEditingId(null);
              setShowAddForm(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary hover:bg-secondary-600 text-white font-bold rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add First Question
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">Q#</th>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left font-bold text-primary uppercase text-xs tracking-wider">Question Text</th>
                  <th className="px-6 py-3 text-center font-bold text-primary uppercase text-xs tracking-wider">Answer</th>
                  <th className="px-6 py-3 text-center font-bold text-primary uppercase text-xs tracking-wider">Marks</th>
                  <th className="px-6 py-3 text-center font-bold text-primary uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {questions.map((question) => (
                  <tr key={question.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-primary">{question.question_number}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                        {question.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 line-clamp-2">{question.stem}</td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-primary">{question.correct_answer}</td>
                    <td className="px-6 py-4 text-center font-semibold">{question.marks}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(question)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                          title="Edit question"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                          title="Delete question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Questions Count */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-sm text-slate-600">
            <strong>{questions.length}</strong> questions created for <strong>{paper?.name}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
