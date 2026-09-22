'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Settings,
  BookOpen,
  Archive,
  AlertCircle,
} from 'lucide-react';

export default function PapersManagementPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: 120,
    total_questions: 60,
    total_marks: 80,
    passing_marks: 50,
    exam_type: 'Standard',
  });

  // Load papers
  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      const response = await fetch('/api/admin/assessment/papers', { cache: 'no-store' });
      const data = await response.json();
      setPapers(data.papers || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading papers:', error);
      setLoading(false);
    }
  };

  const handleCreatePaper = async () => {
    if (!formData.name) {
      alert('Paper name is required');
      return;
    }

    try {
      const response = await fetch('/api/admin/assessment/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to create paper');
        return;
      }

      alert(`Paper "${formData.name}" created successfully!`);
      setFormData({
        name: '',
        description: '',
        duration_minutes: 120,
        total_questions: 60,
        total_marks: 80,
        passing_marks: 50,
        exam_type: 'Standard',
      });
      setShowCreateModal(false);
      loadPapers();
      window.dispatchEvent(new Event('assessment-papers-updated'));
    } catch (error) {
      alert('Error creating paper: ' + error);
    }
  };

  const handleDeletePaper = async (paperId: string) => {
    try {
      const response = await fetch(`/api/admin/assessment/papers/${paperId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to delete paper');
        setShowDeleteConfirm(null);
        return;
      }

      alert('Paper deleted successfully');
      setShowDeleteConfirm(null);
      loadPapers();
      window.dispatchEvent(new Event('assessment-papers-updated'));
    } catch (error) {
      alert('Error deleting paper: ' + error);
    }
  };

  const handleTogglePaperStatus = async (paperId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/assessment/papers/${paperId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!response.ok) {
        alert('Failed to update paper status');
        return;
      }

      loadPapers();
      window.dispatchEvent(new Event('assessment-papers-updated'));
    } catch (error) {
      alert('Error updating paper: ' + error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Exam Papers</h1>
            <p className="text-gray-600">Create and manage different assessment papers</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Paper
          </button>
        </div>

        {/* Papers Grid */}
        {papers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No exam papers created yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
            >
              Create First Paper
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <div key={paper.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{paper.name}</h3>
                    <p className="text-sm text-gray-600">/{paper.slug}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    paper.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {paper.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{paper.description || 'No description'}</p>

                {/* Paper Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="bg-blue-50 rounded p-2">
                    <p className="text-gray-600">Duration</p>
                    <p className="font-semibold text-blue-600">{paper.duration_minutes} min</p>
                  </div>
                  <div className="bg-purple-50 rounded p-2">
                    <p className="text-gray-600">Marks</p>
                    <p className="font-semibold text-purple-600">{paper.total_marks}</p>
                  </div>
                  <div className="bg-green-50 rounded p-2">
                    <p className="text-gray-600">Questions</p>
                    <p className="font-semibold text-green-600">{paper.total_questions}</p>
                  </div>
                  <div className="bg-orange-50 rounded p-2">
                    <p className="text-gray-600">Pass Marks</p>
                    <p className="font-semibold text-orange-600">{paper.passing_marks}</p>
                  </div>
                </div>

                {/* URL Preview */}
                <div className="bg-gray-100 rounded p-3 mb-6">
                  <p className="text-xs text-gray-600 mb-1">Assessment URL:</p>
                  <code className="text-sm text-gray-800 break-all">
                    https://www.ibmpractitioner.us/{paper.slug}
                  </code>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/assessment/papers/${paper.id}/questions`}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Questions
                  </Link>

                  <Link
                    href={`/admin/assessment/papers/${paper.id}`}
                    className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Edit
                  </Link>

                  <button
                    onClick={() => handleTogglePaperStatus(paper.id, paper.is_active)}
                    className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-2 rounded text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    {paper.is_active ? 'Archive' : 'Restore'}
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(paper.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Paper Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Exam Paper</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paper Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., Pain Management, Clinical Cardiology"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  rows={3}
                  placeholder="Brief description of the paper"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Questions</label>
                  <input
                    type="number"
                    value={formData.total_questions}
                    onChange={(e) => setFormData({ ...formData, total_questions: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={formData.total_marks}
                    onChange={(e) => setFormData({ ...formData, total_marks: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={formData.passing_marks}
                    onChange={(e) => setFormData({ ...formData, passing_marks: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                <select
                  value={formData.exam_type}
                  onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Standard">Standard</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Specialist">Specialist</option>
                </select>
              </div>

              {/* URL Preview */}
              <div className="bg-indigo-50 rounded p-4 border border-indigo-200">
                <p className="text-sm text-indigo-800">
                  <strong>Assessment URL will be:</strong><br/>
                  <code className="text-xs">https://www.ibmpractitioner.us/{formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}</code>
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePaper}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Create Paper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md">
            <div className="flex gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <h3 className="text-lg font-bold text-gray-800">Delete Paper?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this paper? All associated questions will also be deleted. This cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePaper(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
