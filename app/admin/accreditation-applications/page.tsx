'use client';

import { useEffect, useState } from 'react';

interface AccApplication {
  id: string;
  application_type: string;
  organization_name: string;
  address: string;
  contact_number: string;
  mobile: string;
  email: string;
  website: string | null;
  proprietor_name: string;
  proprietor_address: string;
  proprietor_pin: string;
  proprietor_mobile: string;
  courses_submitted: string;
  org_types: string;
  photo_id: string;
  photo_id_file: string;
  proprietor_photo_file: string;
  infrastructure_file: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AccreditationApplicationsPage() {
  const [applications, setApplications] = useState<AccApplication[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const selected = applications.find(a => a.id === selectedId);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await fetch('/api/admin/accreditation-applications-db');
        const data = await response.json();
        if (data.success) {
          setApplications(data.applications);
          if (data.applications.length > 0) {
            setSelectedId(data.applications[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  async function updateStatus(newStatus: 'pending' | 'approved' | 'rejected') {
    if (!selectedId) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/accreditation-applications/${selectedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        // Update local state
        setApplications(apps =>
          apps.map(app => app.id === selectedId ? { ...app, status: newStatus } : app)
        );
        alert(`Status updated to ${newStatus}`);
      } else {
        alert('Error updating status: ' + data.message);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileUrl = (filePath: string, action: 'view' | 'download' = 'view') => {
    if (!filePath) return null;
    // Use API endpoint for authenticated access
    return `/api/accreditation/download?file=${encodeURIComponent(filePath)}&action=${action}`;
  };

  const viewFile = (filePath: string) => {
    const url = getFileUrl(filePath, 'view');
    if (!url) return;
    // Open in new tab for viewing
    window.open(url, '_blank');
  };

  const downloadFile = (filePath: string, fileName: string) => {
    const url = getFileUrl(filePath, 'download');
    if (!url) return;
    
    // Use fetch to get the file and download it
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch(err => {
        console.error('Error downloading file:', err);
        alert('Failed to download file');
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No submissions yet.</p>
      </div>
    );
  }

  const orgTypesArray = selected?.org_types && typeof selected.org_types === 'string' 
    ? selected.org_types.split(',').filter(t => t?.trim()) 
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-6 min-h-screen bg-gray-50">
      {/* Left Sidebar - List */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Applications ({applications.length})</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {applications.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedId(app.id)}
              className={`w-full text-left p-4 border-b transition hover:bg-gray-50 ${
                selectedId === app.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-500 hover:bg-blue-50'
                  : 'border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{app.organization_name}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{app.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Details */}
      {selected && (
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="border-b pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{selected.organization_name}</h1>
                  <p className="text-sm text-gray-500 mt-1">Application ID: {selected.id}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0 ${getStatusColor(selected.status)}`}>
                  {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                </span>
              </div>

              {/* Status Update Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => updateStatus('pending')}
                  disabled={updatingStatus || selected.status === 'pending'}
                  className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold text-sm hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Mark Pending
                </button>
                <button
                  onClick={() => updateStatus('approved')}
                  disabled={updatingStatus || selected.status === 'approved'}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus('rejected')}
                  disabled={updatingStatus || selected.status === 'rejected'}
                  className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-semibold text-sm hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Application Info Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">Application Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Application Type</p>
                  <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{selected.application_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Submitted Date</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{new Date(selected.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Organization Details Section */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 pb-3 border-b">Organization Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Organization / Institution Name</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selected.organization_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selected.address}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contact No. (S.T.D.)</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selected.contact_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Mobile</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selected.mobile}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Website</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selected.website || '-'}</p>
                </div>
              </div>
            </div>

            {/* Proprietor Details Section */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 pb-3 border-b">Proprietor Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name of Proprietor / Coordinator / Head</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selected.proprietor_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Proprietor Address</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selected.proprietor_address}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pin Code</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selected.proprietor_pin}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Proprietor Mobile</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selected.proprietor_mobile}</p>
                </div>
              </div>
            </div>

            {/* Program Details Section */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 pb-3 border-b">Program Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">List of Courses Submitted</p>
                  <div className="bg-gray-50 p-3 rounded border text-sm text-gray-900 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {selected.courses_submitted}
                  </div>
                </div>
                {orgTypesArray.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Type of Registered Organization</p>
                    <div className="flex flex-wrap gap-2">
                      {orgTypesArray.map((type, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ID & Verification Section */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 pb-3 border-b">ID & Verification</h3>
              <div>
                <p className="text-xs text-gray-500">Photo ID Type</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{selected.photo_id}</p>
              </div>
            </div>

            {/* Uploaded Files Section */}
            {(selected.photo_id_file || selected.proprietor_photo_file || selected.infrastructure_file) && (
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 pb-3 border-b">Uploaded Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selected.photo_id_file && (
                    <div className="border rounded-lg p-4 hover:bg-gray-50 transition">
                      <p className="text-xs text-gray-500 mb-4 font-medium">📄 Photo ID Proof</p>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => viewFile(selected.photo_id_file)}
                          className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-semibold text-center transition"
                        >
                          📖 View
                        </button>
                        <button
                          onClick={() => downloadFile(selected.photo_id_file, 'photo_id.png')}
                          className="px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-semibold transition"
                        >
                          ⬇️ Download
                        </button>
                      </div>
                    </div>
                  )}
                  {selected.proprietor_photo_file && (
                    <div className="border rounded-lg p-4 hover:bg-gray-50 transition">
                      <p className="text-xs text-gray-500 mb-4 font-medium">📸 Proprietor Photo</p>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => viewFile(selected.proprietor_photo_file)}
                          className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-semibold text-center transition"
                        >
                          📖 View
                        </button>
                        <button
                          onClick={() => downloadFile(selected.proprietor_photo_file, 'proprietor_photo.png')}
                          className="px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-semibold transition"
                        >
                          ⬇️ Download
                        </button>
                      </div>
                    </div>
                  )}
                  {selected.infrastructure_file && (
                    <div className="border rounded-lg p-4 hover:bg-gray-50 transition">
                      <p className="text-xs text-gray-500 mb-4 font-medium">🏗️ Infrastructure Details</p>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => viewFile(selected.infrastructure_file)}
                          className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-semibold text-center transition"
                        >
                          📖 View
                        </button>
                        <button
                          onClick={() => downloadFile(selected.infrastructure_file, 'infrastructure_details.pdf')}
                          className="px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-semibold transition"
                        >
                          ⬇️ Download
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
              <p>Created: {new Date(selected.created_at).toLocaleString()}</p>
              <p>Last Updated: {new Date(selected.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
