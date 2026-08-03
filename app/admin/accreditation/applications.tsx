'use client';

import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface AccreditationApplication {
  id: string;
  application_type: string;
  organization_name: string;
  email: string;
  contact_number: string;
  mobile: string;
  proprietor_name: string;
  status: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
  courses_submitted: string;
}

export default function AdminAccreditationApplications() {
  const [applications, setApplications] = useState<AccreditationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<AccreditationApplication | null>(null);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');
  const [newStatus, setNewStatus] = useState<'pending' | 'under_review' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    try {
      const response = await fetch('/api/accreditation/applications');
      const result = await response.json();
      
      if (response.ok) {
        setApplications(result.data || []);
      } else {
        console.error('Error fetching applications:', result.error);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateApplicationStatus(applicationId: string, status: string, adminNotes: string) {
    setUpdating(true);
    try {
      const response = await fetch(`/api/accreditation/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes: adminNotes }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Application updated successfully');
        setSelectedApp(null);
        fetchApplications();
      } else {
        alert('Error: ' + (result.error || 'Failed to update'));
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update application');
    } finally {
      setUpdating(false);
    }
  }

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Accreditation Applications</h1>
        <p className="text-gray-600 mt-1">Manage incoming accreditation requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 font-medium capitalize border-b-2 transition ${
              filter === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab} ({filteredApps.filter(a => filter === 'all' ? true : a.status === tab).length})
          </button>
        ))}
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading applications...</div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No applications found</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Organization</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Contact</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Submitted</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{app.organization_name}</p>
                      <p className="text-xs text-gray-500">{app.proprietor_name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 capitalize text-gray-700">{app.application_type}</td>
                  <td className="px-6 py-3 text-sm">
                    <p className="text-gray-900">{app.email}</p>
                    <p className="text-gray-500">{app.mobile}</p>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[app.status]}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-xs">
                    {formatDistanceToNow(new Date(app.submitted_at), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setNewStatus((app.status as 'pending' | 'under_review' | 'approved' | 'rejected') || 'pending');
                        setNotes(app.notes || '');
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      View & Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary px-6 py-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedApp.organization_name}</h2>
              <button onClick={() => setSelectedApp(null)} className="text-2xl hover:opacity-70">&times;</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Organization Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Organization</p>
                  <p className="text-gray-900 font-medium">{selectedApp.organization_name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Application Type</p>
                  <p className="text-gray-900 font-medium capitalize">{selectedApp.application_type}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Proprietor</p>
                  <p className="text-gray-900 font-medium">{selectedApp.proprietor_name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Email</p>
                  <p className="text-gray-900">{selectedApp.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Contact</p>
                  <p className="text-gray-900">{selectedApp.contact_number}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Mobile</p>
                  <p className="text-gray-900">{selectedApp.mobile}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Courses Submitted</p>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedApp.courses_submitted}</p>
              </div>

              {/* Status Update */}
              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold text-gray-900">Review Status</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as 'pending' | 'under_review' | 'approved' | 'rejected')}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    rows={4}
                    placeholder="Add comments for internal reference..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => updateApplicationStatus(selectedApp.id, newStatus, notes)}
                    disabled={updating}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
