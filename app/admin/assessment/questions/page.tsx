'use client';

import React from 'react';
import { AlertCircle, Save, Loader, Trash2, Edit2, Plus, Upload, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Question {
  id: string;
  question_number: string;
  type: 'mcq' | 'image' | 'short';
  marks: number;
  module: string;
  stem: string;
  options?: string[];
  correct_answer?: string;
  image_url?: string;
  is_active: boolean;
}

interface QuestionImage {
  id: string;
  question_id: string;
  image_url: string;
  image_title: string;
  file_size: number;
  description?: string;
}

export default function AssessmentQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [questionImages, setQuestionImages] = useState<Record<string, QuestionImage[]>>({});
  const loadedImagesRef = useRef<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    question_number: '',
    type: 'mcq' as 'mcq' | 'image' | 'short',
    marks: 1,
    module: 'Module 1',
    stem: '',
    options: ['', '', '', ''],
    correct_answer: '',
  });

  const [editedQuestionData, setEditedQuestionData] = useState<Record<string, any> | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadQuestions();
  }, []);

  // Load images asynchronously after questions are displayed (without blocking)
  useEffect(() => {
    if (questions.length > 0) {
      const timer = setTimeout(() => {
        questions.forEach(question => {
          // Only load images for questions we haven't loaded yet
          if (!loadedImagesRef.current.has(question.id)) {
            loadedImagesRef.current.add(question.id);
            loadQuestionImages(question.id);
          }
        });
      }, 300); // Delay by 300ms to let questions render first
      
      return () => clearTimeout(timer);
    }
  }, [questions]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/assessment/questions');
      const data = await response.json();
      
      const questionsData: Question[] = Array.isArray(data) ? data.map((q: Record<string, any>) => {
        let parsedOptions: string[] = [];
        try {
          if (typeof q.options === 'string') {
            const parsed = JSON.parse(q.options || '[]');
            parsedOptions = Array.isArray(parsed) 
              ? parsed.map((opt: any) => typeof opt === 'string' ? opt : (opt.text || ''))
              : [];
          } else if (Array.isArray(q.options)) {
            parsedOptions = q.options.map((opt: any) => 
              typeof opt === 'string' ? opt : (opt?.text || '')
            );
          }
        } catch (e) {
          console.error('Error parsing options:', e);
          parsedOptions = [];
        }
        
        return {
          id: q.id,
          question_number: q.question_number,
          type: q.type,
          marks: q.marks,
          module: q.module,
          stem: q.stem,
          options: parsedOptions,
          correct_answer: q.correct_answer || '',
          image_url: q.image_url || '',
          is_active: q.is_active,
        };
      }) : [];
      setQuestions(questionsData);

    } catch (error) {
      console.error('Error loading questions:', error);
      setMessage('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestionImages = async (questionId: string) => {
    try {
      const response = await fetch(`/api/admin/assessment/questions/images?questionId=${questionId}`);
      const data = await response.json();
      setQuestionImages((prev) => ({
        ...prev,
        [questionId]: Array.isArray(data) ? data : [],
      }));
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Validate form
      if (!formData.question_number.trim() || !formData.stem.trim()) {
        setMessage('Question number and stem are required');
        setSaving(false);
        return;
      }

      if (formData.type === 'mcq' && !formData.correct_answer) {
        setMessage('Correct answer is required for MCQ');
        setSaving(false);
        return;
      }

      const payload = {
        id: editingId || undefined,
        question_number: formData.question_number,
        type: formData.type,
        marks: formData.marks,
        module: formData.module,
        stem: formData.stem,
        options: formData.type === 'mcq' ? formData.options.filter(o => o.trim()) : null,
        correct_answer: formData.type === 'mcq' ? formData.correct_answer : null,
        question_data: editedQuestionData || undefined,
      };

      let response;
      if (editingId) {
        response = await fetch('/api/admin/assessment/questions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/admin/assessment/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save question');
      }

      // If updating a Q41-Q60 question, recalculate scores for all attempts
      const qNum = parseInt(formData.question_number.replace(/[^\d]/g, ''));
      if (editingId && qNum >= 41 && qNum <= 60 && editedQuestionData?.scoring?.rubric) {
        const expectedAnswer = editedQuestionData.scoring.rubric[0]?.answer || '';
        const maxMarks = formData.marks;
        
        try {
          await fetch('/api/admin/assessment/questions/recalculate-attempts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              questionId: formData.question_number,
              expectedAnswer: expectedAnswer,
              maxMarks: maxMarks,
              questionType: formData.type,
            }),
          });
        } catch (recalcError) {
          console.error('Failed to recalculate scores:', recalcError);
          // Don't fail the save operation if recalculation fails
        }
      }

      await loadQuestions();
      setMessage(`Question ${editingId ? 'updated' : 'added'} successfully`);
      
      // Reset form
      setFormData({
        question_number: '',
        type: 'mcq',
        marks: 1,
        module: 'Module 1',
        stem: '',
        options: ['', '', '', ''],
        correct_answer: '',
      });
      setShowForm(false);
      setEditingId(null);
      setQuestionImages({});
      setEditedQuestionData(null);

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving question:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Delete this question? This cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/assessment/questions?id=${questionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      await loadQuestions();
      setMessage('Question deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting question:', error);
      setMessage('Failed to delete question');
    }
  };

  const handleEdit = (question: Question) => {
    const parsedOptions = typeof question.options === 'string' 
      ? JSON.parse(question.options || '[]') 
      : (Array.isArray(question.options) ? question.options : []);
    
    setFormData({
      question_number: question.question_number,
      type: question.type,
      marks: question.marks,
      module: question.module,
      stem: question.stem,
      options: parsedOptions.length > 0 ? parsedOptions : ['', '', '', ''],
      correct_answer: question.correct_answer || '',
    });
    setEditingId(question.id);
    setShowForm(true);
    
    // Load images and question data for this question when editing
    loadQuestionImages(question.id);
    loadQuestionData(question.id);
  };

  const loadQuestionData = async (questionId: string) => {
    try {
      // Fetch the full question from API which includes question_data
      const response = await fetch(`/api/admin/assessment/questions?questionId=${questionId}`);
      const data = await response.json();
      console.log('Loaded question data:', data);
      if (Array.isArray(data) && data.length > 0) {
        const qData = data[0].question_data || null;
        console.log('Question data found:', qData);
        // Initialize edited data with a deep copy of the original
        setEditedQuestionData(qData ? JSON.parse(JSON.stringify(qData)) : null);
      }
    } catch (error) {
      console.error('Error loading question data:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, questionId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('questionId', questionId);
      formDataObj.append('imageTitle', `Question ${questionId} Image`);

      const response = await fetch('/api/admin/assessment/questions/images', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      await loadQuestionImages(questionId);
      setMessage('Image uploaded successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string, questionId: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      const response = await fetch(`/api/admin/assessment/questions/images?imageId=${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      await loadQuestionImages(questionId);
      setMessage('Image deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage('Failed to delete image');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Assessment Questions</h1>
          <p className="text-sm text-slate-600 mt-1">Manage {questions.length} exam questions and scoring</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
            message.includes('success') || message.includes('updated') || message.includes('added') || message.includes('deleted')
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Add New Question Button - Only show when not editing */}
      {!showForm && !editingId && (
        <button
          onClick={() => {
            setShowForm(true);
            setFormData({
              question_number: '',
              type: 'mcq',
              marks: 1,
              module: 'Module 1',
              stem: '',
              options: ['', '', '', ''],
              correct_answer: '',
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary-600 text-white rounded-lg transition mb-6"
        >
          <Plus className="w-4 h-4" />
          Add New Question
        </button>
      )}

      {/* Questions Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Q#</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Marks</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Question Stem</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Correct Answer</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Image/Asset</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <Loader className="w-6 h-6 animate-spin text-secondary mx-auto" />
                </td>
              </tr>
            ) : questions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-600">
                  No questions added yet. Create one to get started.
                </td>
              </tr>
            ) : (
              questions.map((question, idx) => (
                <React.Fragment key={question.id}>
                  <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 text-sm font-bold text-slate-900">{question.question_number}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        question.type === 'mcq' ? 'bg-blue-100 text-blue-800' :
                        question.type === 'image' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {question.type === 'mcq' ? 'MCQ' : question.type === 'image' ? 'IMAGE' : 'TEXT'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-900">{question.marks}</td>
                    <td className="px-4 py-3 text-sm text-slate-900 max-w-md truncate" title={question.stem}>{question.stem}</td>
                    <td className="px-4 py-3 text-sm">
                      {question.type === 'mcq' && question.options && question.options.length > 0 ? (
                        <div className="text-xs space-y-1">
                          {question.options.map((opt, oidx) => (
                            <div key={oidx} className={`px-2 py-1 rounded ${
                              question.correct_answer === opt ? 'bg-green-100 text-green-800 font-bold' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {String.fromCharCode(65 + oidx)}: {opt}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-col gap-2">
                        {/* Display image from image_url field or uploaded images */}
                        {question.image_url && (
                          <div className="text-xs">
                            <a href={question.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                              📷 {question.image_url.split('/').pop()}
                            </a>
                          </div>
                        )}
                        {/* Uploaded images */}
                        {questionImages[question.id]?.map((img) => (
                          <div key={img.id} className="flex items-center justify-between bg-slate-100 p-2 rounded">
                            <a href={img.image_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate">
                              {img.image_title}
                            </a>
                            <button
                              onClick={() => handleDeleteImage(img.id, question.id)}
                              className="text-red-600 hover:text-red-800 ml-2"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <label className="flex items-center gap-1 text-xs text-blue-600 cursor-pointer hover:underline">
                          <Upload className="w-3 h-3" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, question.id)}
                            disabled={uploading}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(question)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit question"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Inline Edit Form - Shows below the question when editing */}
                  {editingId === question.id && showForm && (
                    <tr key={`edit-${question.id}`} className="bg-blue-50 border-t-2 border-blue-300">
                      <td colSpan={7} className="px-6 py-6">
                        <div className="bg-white rounded-lg border border-blue-200 p-6">
                          <h3 className="text-lg font-bold text-primary mb-4">Edit Question</h3>
                          <form onSubmit={handleAddQuestion} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                                  Question Number *
                                </label>
                                <input
                                  type="text"
                                  value={formData.question_number}
                                  onChange={(e) => setFormData({ ...formData, question_number: e.target.value })}
                                  placeholder="e.g. Q1, Q2, Q60..."
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
                                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'mcq' | 'image' | 'short' })}
                                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                                >
                                  <option value="mcq">Multiple Choice</option>
                                  <option value="image">Image-Based</option>
                                  <option value="short">Short Answer</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                                  Marks *
                                </label>
                                <input
                                  type="number"
                                  value={formData.marks}
                                  onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                                  min="1"
                                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                                  Module
                                </label>
                                <select
                                  value={formData.module}
                                  onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                                >
                                  <option>Module 1</option>
                                  <option>Module 2</option>
                                  <option>Module 3</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                                Question Text *
                              </label>
                              <textarea
                                value={formData.stem}
                                onChange={(e) => setFormData({ ...formData, stem: e.target.value })}
                                placeholder="Enter the complete question..."
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                                rows={3}
                                required
                              />
                            </div>

                            {/* MCQ Options */}
                            {formData.type === 'mcq' && (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                                    Options (Separate with line breaks)
                                  </label>
                                  {formData.options.map((option: string, idx: number) => (
                                    <input
                                      key={idx}
                                      type="text"
                                      value={option || ''}
                                      onChange={(e) => {
                                        const newOptions = [...formData.options];
                                        newOptions[idx] = e.target.value;
                                        setFormData({ ...formData, options: newOptions });
                                      }}
                                      placeholder={`Option ${idx + 1}`}
                                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary mb-2"
                                    />
                                  ))}
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                                    Correct Answer *
                                  </label>
                                  <select
                                    value={formData.correct_answer}
                                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                                    required
                                  >
                                    <option value="">Select correct answer</option>
                                    {formData.options
                                      .filter((o: any) => typeof o === 'string' && o.trim())
                                      .map((option: string, idx: number) => (
                                        <option key={idx} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              </div>
                            )}

                            {/* Short Answer Expected Answer Section */}
                            {editingId && formData.type === 'short' && editedQuestionData && (
                              <div className="border-t border-slate-200 pt-4">
                                <h4 className="text-sm font-bold text-primary mb-3">✏️ Expected Answer</h4>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <label className="text-xs font-bold text-blue-900 mb-2 block">
                                    Expected Answer:
                                  </label>
                                  <textarea
                                    value={editedQuestionData.scoring?.rubric?.[0]?.answer || ''}
                                    onChange={(e) => {
                                      const newData = JSON.parse(JSON.stringify(editedQuestionData));
                                      if (!newData.scoring) {
                                        newData.scoring = { rubric: [] };
                                      }
                                      if (!newData.scoring.rubric) {
                                        newData.scoring.rubric = [];
                                      }
                                      if (!newData.scoring.rubric[0]) {
                                        newData.scoring.rubric[0] = {
                                          id: `${formData.question_number}_answer`,
                                          partId: 'main',
                                          maxUnits: formData.marks,
                                          answer: ''
                                        };
                                      }
                                      newData.scoring.rubric[0].answer = e.target.value;
                                      setEditedQuestionData(newData);
                                    }}
                                    className="w-full px-3 py-2 text-sm bg-white border border-blue-300 rounded text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    rows={3}
                                    placeholder="Enter the model/expected answer..."
                                  />
                                </div>
                              </div>
                            )}

                            {/* Image-Based Questions Parts */}
                            {editingId && formData.type === 'image' && editedQuestionData && editedQuestionData.parts && (
                              <div className="border-t border-slate-200 pt-4">
                                <h4 className="text-sm font-bold text-primary mb-3">✏️ Question Parts & Expected Answers</h4>
                                <div className="space-y-4">
                                  {editedQuestionData.parts.map((part: any, idx: number) => {
                                    const rubricItem = editedQuestionData.scoring?.rubric?.find((r: any) => r.partId === part.id);
                                    return (
                                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                        <span className="inline-block px-2 py-1 bg-primary text-white text-xs font-bold rounded mb-2">
                                          Part {part.id.toUpperCase()}
                                        </span>
                                        <textarea
                                          value={part.prompt || ''}
                                          onChange={(e) => {
                                            const newData = JSON.parse(JSON.stringify(editedQuestionData));
                                            const partIdx = newData.parts.findIndex((p: any) => p.id === part.id);
                                            if (partIdx !== -1) {
                                              newData.parts[partIdx].prompt = e.target.value;
                                              setEditedQuestionData(newData);
                                            }
                                          }}
                                          className="w-full px-2 py-2 text-sm bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 mb-2"
                                          rows={2}
                                        />
                                        
                                        {rubricItem && (
                                          <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-2">
                                            <textarea
                                              value={rubricItem.answer || ''}
                                              onChange={(e) => {
                                                const newData = JSON.parse(JSON.stringify(editedQuestionData));
                                                const rubricIdx = newData.scoring.rubric.findIndex((r: any) => r.partId === part.id);
                                                if (rubricIdx !== -1) {
                                                  newData.scoring.rubric[rubricIdx].answer = e.target.value;
                                                  setEditedQuestionData(newData);
                                                }
                                              }}
                                              className="w-full px-2 py-1 text-sm bg-white border border-blue-300 rounded text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                              rows={2}
                                              placeholder="Expected Answer"
                                            />
                                            <input
                                              type="number"
                                              value={rubricItem.maxUnits || 2}
                                              onChange={(e) => {
                                                const newData = JSON.parse(JSON.stringify(editedQuestionData));
                                                const rubricIdx = newData.scoring.rubric.findIndex((r: any) => r.partId === part.id);
                                                if (rubricIdx !== -1) {
                                                  newData.scoring.rubric[rubricIdx].maxUnits = parseInt(e.target.value);
                                                  setEditedQuestionData(newData);
                                                }
                                              }}
                                              min="1"
                                              className="w-full px-2 py-1 text-sm bg-white border border-blue-300 rounded text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                              placeholder="Max Marks"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Image Upload */}
                            {editingId && formData.type === 'image' && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <label className="text-sm font-semibold text-blue-900 mb-3 block">
                                  Upload Question Image
                                </label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => editingId && handleImageUpload(e, editingId)}
                                  disabled={uploading}
                                  className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-secondary-600 disabled:opacity-50"
                                />
                              </div>
                            )}

                            {/* Form Actions */}
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowForm(false);
                                  setEditingId(null);
                                  setQuestionImages({});
                                  setEditedQuestionData(null);
                                  setFormData({
                                    question_number: '',
                                    type: 'mcq',
                                    marks: 1,
                                    module: 'Module 1',
                                    stem: '',
                                    options: ['', '', '', ''],
                                    correct_answer: '',
                                  });
                                }}
                                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary-600 text-white rounded-lg transition disabled:opacity-50"
                              >
                                {saving && <Loader className="w-4 h-4 animate-spin" />}
                                <Save className="w-4 h-4" />
                                Update Question
                              </button>
                            </div>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Question Section - Only show when not editing */}
      {showForm && !editingId && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 mt-6">
          <h2 className="text-lg font-bold text-primary">Add New Question</h2>
          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Question Number *
                </label>
                <input
                  type="text"
                  value={formData.question_number}
                  onChange={(e) => setFormData({ ...formData, question_number: e.target.value })}
                  placeholder="e.g. Q1, Q2, Q60..."
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
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'mcq' | 'image' | 'short' })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="image">Image-Based</option>
                  <option value="short">Short Answer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Marks *
                </label>
                <input
                  type="number"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                  min="1"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Module
                </label>
                <select
                  value={formData.module}
                  onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                >
                  <option>Module 1</option>
                  <option>Module 2</option>
                  <option>Module 3</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                Question Text *
              </label>
              <textarea
                value={formData.stem}
                onChange={(e) => setFormData({ ...formData, stem: e.target.value })}
                placeholder="Enter the complete question..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                rows={3}
                required
              />
            </div>

            {/* MCQ Options */}
            {formData.type === 'mcq' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    Options (Separate with line breaks)
                  </label>
                  {formData.options.map((option: string, idx: number) => (
                    <input
                      key={idx}
                      type="text"
                      value={option || ''}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[idx] = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }}
                      placeholder={`Option ${idx + 1}`}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary mb-2"
                    />
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    Correct Answer *
                  </label>
                  <select
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    required
                  >
                    <option value="">Select correct answer</option>
                    {formData.options
                      .filter((o: any) => typeof o === 'string' && o.trim())
                      .map((option: string, idx: number) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    question_number: '',
                    type: 'mcq',
                    marks: 1,
                    module: 'Module 1',
                    stem: '',
                    options: ['', '', '', ''],
                    correct_answer: '',
                  });
                  setQuestionImages({});
                }}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary-600 text-white rounded-lg transition disabled:opacity-50"
              >
                {saving && <Loader className="w-4 h-4 animate-spin" />}
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
