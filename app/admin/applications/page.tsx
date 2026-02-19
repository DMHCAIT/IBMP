'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Application {
  applicationNumber: string;
  fullName: string;
  emailId: string;
  courseName: string;
  status: string;
  submittedAt: string;
  // Personal Details
  title?: string;
  dateOfBirth?: string;
  gender?: string;
  age?: string;
  nationality?: string;
  maritalStatus?: string;
  religion?: string;
  // Referral
  referralSource?: string;
  otherReferralSource?: string;
  // Contact
  mobileNumber?: string;
  phoneNumber?: string;
  correspondenceAddress?: string;
  permanentAddress?: string;
  // Family
  parentName?: string;
  parentOccupation?: string;
  parentMobile?: string;
  parentEmail?: string;
  // Course
  courseType?: string;
  studyMode?: string;
  sessionYear?: string;
  // Education - 10th
  school10th?: string;
  year10th?: string;
  marks10th?: string;
  maxMarks10th?: string;
  percentage10th?: string;
  // Education - 12th
  school12th?: string;
  year12th?: string;
  marks12th?: string;
  maxMarks12th?: string;
  percentage12th?: string;
  // Education - UG
  collegeUG?: string;
  yearUG?: string;
  percentageUG?: string;
  cgpaUG?: string;
  // Education - PG
  collegePG?: string;
  yearPG?: string;
  percentagePG?: string;
  cgpaPG?: string;
  // Payment & Declaration
  paymentOption?: string;
  declarantName?: string;
  parentNameDeclaration?: string;
  declarationDate?: string;
  // Files
  files?: Record<string, string>;
  [key: string]: unknown;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications');
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewApplication = async (applicationNumber: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationNumber}`);
      const data = await response.json();
      if (data.success) {
        setSelectedApp(data.application);
      }
    } catch (error) {
      console.error('Error loading application details:', error);
    }
  };

  const updateStatus = async (applicationNumber: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        loadApplications();
        if (selectedApp?.applicationNumber === applicationNumber) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admission Applications</h1>
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Back to Admin
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Applications List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Applications ({applications.length})
            </h2>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {applications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No applications yet</p>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.applicationNumber}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                    onClick={() => viewApplication(app.applicationNumber)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{app.fullName}</h3>
                        <p className="text-sm text-gray-600">{app.emailId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{app.courseName}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{app.applicationNumber}</span>
                      <span>{new Date(app.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Application Details
            </h2>

            {!selectedApp ? (
              <p className="text-gray-500 text-center py-8">
                Select an application to view details
              </p>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                {/* Status Actions */}
                <div className="space-y-2 pb-4 border-b">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(selectedApp.applicationNumber, 'approved')}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(selectedApp.applicationNumber, 'rejected')}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => updateStatus(selectedApp.applicationNumber, 'pending')}
                      className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                    >
                      Pending
                    </button>
                  </div>
                  <button
                    onClick={() => router.push(`/admin/invoices/${selectedApp.applicationNumber}`)}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Generate Invoice
                  </button>
                </div>

                {/* Application Info */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Application No:</strong> {selectedApp.applicationNumber}</p>
                    <p><strong>Title:</strong> {selectedApp.title}</p>
                    <p><strong>Full Name:</strong> {selectedApp.fullName}</p>
                    <p><strong>Date of Birth:</strong> {selectedApp.dateOfBirth}</p>
                    <p><strong>Gender:</strong> {selectedApp.gender}</p>
                    <p><strong>Age:</strong> {selectedApp.age}</p>
                    <p><strong>Nationality:</strong> {selectedApp.nationality}</p>
                    <p><strong>Marital Status:</strong> {selectedApp.maritalStatus}</p>
                    <p><strong>Religion:</strong> {selectedApp.religion}</p>
                    <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs ${
                      selectedApp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedApp.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>{selectedApp.status}</span></p>
                  </div>
                </div>

                {/* Referral */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Referral Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Referral Source:</strong> {selectedApp.referralSource}</p>
                    {selectedApp.otherReferralSource && (
                      <p><strong>Other Source:</strong> {selectedApp.otherReferralSource}</p>
                    )}
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {selectedApp.emailId}</p>
                    <p><strong>Mobile:</strong> {selectedApp.mobileNumber}</p>
                    <p><strong>Phone:</strong> {selectedApp.phoneNumber}</p>
                    <p><strong>Correspondence Address:</strong> {selectedApp.correspondenceAddress}</p>
                    <p><strong>Permanent Address:</strong> {selectedApp.permanentAddress}</p>
                  </div>
                </div>

                {/* Family Details */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Family Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Parent/Guardian Name:</strong> {selectedApp.parentName}</p>
                    <p><strong>Occupation:</strong> {selectedApp.parentOccupation}</p>
                    <p><strong>Mobile:</strong> {selectedApp.parentMobile}</p>
                    <p><strong>Email:</strong> {selectedApp.parentEmail}</p>
                  </div>
                </div>

                {/* Course Details */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Course Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Course Type:</strong> {selectedApp.courseType}</p>
                    <p><strong>Course Name:</strong> {selectedApp.courseName}</p>
                    <p><strong>Session Year:</strong> {selectedApp.sessionYear}</p>
                    <p><strong>Study Mode:</strong> {selectedApp.studyMode}</p>
                  </div>
                </div>

                {/* Educational Background - 10th */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">10th Standard</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>School:</strong> {selectedApp.school10th}</p>
                    <p><strong>Year:</strong> {selectedApp.year10th}</p>
                    <p><strong>Marks:</strong> {selectedApp.marks10th}/{selectedApp.maxMarks10th}</p>
                    <p><strong>Percentage:</strong> {selectedApp.percentage10th}%</p>
                  </div>
                </div>

                {/* Educational Background - 12th */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">12th Standard</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>School:</strong> {selectedApp.school12th}</p>
                    <p><strong>Year:</strong> {selectedApp.year12th}</p>
                    <p><strong>Marks:</strong> {selectedApp.marks12th}/{selectedApp.maxMarks12th}</p>
                    <p><strong>Percentage:</strong> {selectedApp.percentage12th}%</p>
                  </div>
                </div>

                {/* Educational Background - UG */}
                {selectedApp.collegeUG && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Undergraduate (UG)</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>College:</strong> {selectedApp.collegeUG}</p>
                      <p><strong>Year:</strong> {selectedApp.yearUG}</p>
                      <p><strong>Percentage:</strong> {selectedApp.percentageUG}%</p>
                      <p><strong>CGPA:</strong> {selectedApp.cgpaUG}</p>
                    </div>
                  </div>
                )}

                {/* Educational Background - PG */}
                {selectedApp.collegePG && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Postgraduate (PG)</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>College:</strong> {selectedApp.collegePG}</p>
                      <p><strong>Year:</strong> {selectedApp.yearPG}</p>
                      <p><strong>Percentage:</strong> {selectedApp.percentagePG}%</p>
                      <p><strong>CGPA:</strong> {selectedApp.cgpaPG}</p>
                    </div>
                  </div>
                )}

                {/* Payment */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Payment Option:</strong> {selectedApp.paymentOption}</p>
                  </div>
                </div>

                {/* Declaration */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Declaration</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Declarant Name:</strong> {selectedApp.declarantName}</p>
                    <p><strong>Parent Name:</strong> {selectedApp.parentNameDeclaration}</p>
                    <p><strong>Declaration Date:</strong> {selectedApp.declarationDate}</p>
                  </div>
                </div>

                {/* Uploaded Files */}
                {selectedApp.files && Object.keys(selectedApp.files).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Uploaded Documents</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedApp.files).map(([key, url]: [string, string]) => (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-blue-600 hover:underline"
                        >
                          📎 {key.replace(/([A-Z])/g, ' $1').trim()}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submission Info */}
                <div className="pt-4 border-t text-xs text-gray-500">
                  <p>Submitted on: {new Date(selectedApp.submittedAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
