'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Trash2, Copy, ExternalLink } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSubmissions();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSubmissions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/contact/submissions');
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    // For now, we'll just remove from UI
    // In future, add API endpoint to delete from database
    setSubmissions(submissions.filter((s) => s.id !== id));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Submissions</h1>
          <p className="text-gray-600">View and manage messages from the contact form</p>
          <button
            onClick={fetchSubmissions}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Total Submissions</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{submissions.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Unique Contacts</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {new Set(submissions.map((s) => s.email)).size}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Last Submission</p>
            <p className="text-sm font-bold text-gray-900 mt-2">
              {submissions.length > 0 ? formatDate(submissions[0].created_at) : 'None'}
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submissions List */}
          <div className="lg:col-span-2">
            {submissions.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No contact submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission)}
                    className={`bg-white rounded-lg border p-6 cursor-pointer transition ${
                      selectedSubmission?.id === submission.id
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{submission.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Mail className="h-4 w-4" />
                          {submission.email}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap">
                        <Calendar className="h-4 w-4" />
                        {formatDate(submission.created_at)}
                      </span>
                    </div>
                    {submission.subject && (
                      <p className="text-sm text-gray-700 mb-2 font-medium">
                        Subject: {submission.subject}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2">{submission.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submission Details */}
          <div>
            {selectedSubmission ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Submission Details</h2>
                  <button
                    onClick={() => deleteSubmission(selectedSubmission.id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">
                      Name
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 break-words flex-1">{selectedSubmission.name}</p>
                      <button
                        onClick={() => copyToClipboard(selectedSubmission.name)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">
                      Email
                    </label>
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${selectedSubmission.email}`}
                        className="text-blue-600 hover:underline break-words flex-1"
                      >
                        {selectedSubmission.email}
                      </a>
                      <button
                        onClick={() => copyToClipboard(selectedSubmission.email)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">
                      Sent On
                    </label>
                    <p className="text-gray-900">{formatDate(selectedSubmission.created_at)}</p>
                  </div>

                  {/* Subject */}
                  {selectedSubmission.subject && (
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">
                        Subject
                      </label>
                      <p className="text-gray-900">{selectedSubmission.subject}</p>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">
                      Message
                    </label>
                    <div className="bg-gray-50 rounded p-4 max-h-64 overflow-y-auto">
                      <p className="text-gray-900 text-sm whitespace-pre-wrap break-words">
                        {selectedSubmission.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
                Select a submission to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
