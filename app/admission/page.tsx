'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdmissionPage() {
  const [formData, setFormData] = useState({
    // Application Details
    passportPhoto: null as File | null,
    
    // Personal Details
    title: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    age: '',
    nationality: 'Indian',
    maritalStatus: '',
    religion: '',
    
    // Referral
    referralSource: '',
    otherReferralSource: '',
    
    // Contact Details
    correspondenceAddress: '',
    phoneNumber: '',
    mobileNumber: '',
    emailId: '',
    permanentAddress: '',
    
    // Family Details
    parentName: '',
    parentOccupation: '',
    parentMobile: '',
    parentEmail: '',
    
    // Course Details
    courseType: '',
    courseName: '',
    sessionYear: '',
    studyMode: '',
    
    // Educational Background - 10th
    school10th: '',
    year10th: '',
    marks10th: '',
    maxMarks10th: '',
    percentage10th: '',
    
    // Educational Background - 12th
    school12th: '',
    year12th: '',
    marks12th: '',
    maxMarks12th: '',
    percentage12th: '',
    
    // Educational Background - UG
    collegeUG: '',
    yearUG: '',
    percentageUG: '',
    cgpaUG: '',
    
    // Educational Background - PG
    collegePG: '',
    yearPG: '',
    percentagePG: '',
    cgpaPG: '',
    
    // Documents
    cv: null as File | null,
    educationalCertificates: null as File | null,
    marksheets: null as File | null,
    identityProof: null as File | null,
    
    // Payment
    paymentOption: '',
    
    // Terms & Declaration
    termsAccepted: false,
    privacyAccepted: false,
    declarantName: '',
    parentNameDeclaration: '',
    declarationDate: '',
    digitalSignature: null as File | null,
    declarationAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedAppNumber, setSubmittedAppNumber] = useState('');

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download the PDF receipt.');
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>IBMP Application Receipt - ${submittedAppNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 40px; background: white; }
          .receipt { max-width: 700px; margin: 0 auto; border: 2px solid #1e3a5f; padding: 40px; }
          .header { text-align: center; border-bottom: 3px solid #1e3a5f; padding-bottom: 20px; margin-bottom: 25px; }
          .header h1 { color: #1e3a5f; font-size: 22px; margin-bottom: 4px; }
          .header p { color: #555; font-size: 12px; }
          .badge { display: inline-block; background: #d4edda; color: #155724; padding: 6px 18px; border-radius: 20px; font-weight: 600; font-size: 14px; margin: 15px 0; }
          .app-number { text-align: center; background: #f0f4ff; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 20px; font-weight: 700; color: #1e3a5f; letter-spacing: 1px; }
          .section { margin-bottom: 20px; }
          .section h3 { color: #1e3a5f; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin-bottom: 10px; }
          .row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; }
          .row .label { color: #666; }
          .row .value { font-weight: 600; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #1e3a5f; font-size: 11px; color: #888; }
          .note { background: #fff3cd; padding: 12px; border-radius: 6px; font-size: 12px; color: #856404; margin-top: 20px; }
          @media print { body { padding: 20px; } .receipt { border: 1px solid #999; } }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>INTERNATIONAL BOARD OF MEDICAL PRACTITIONERS</h1>
            <p>600 N Broad Street Suite 5 #3695, Middletown, DE 19709, USA</p>
            <p>Email: info@ibmpractitioner.us | Phone: +1 302 600 2718</p>
            <div class="badge">✓ APPLICATION RECEIVED</div>
          </div>

          <div class="app-number">${submittedAppNumber}</div>

          <div class="section">
            <h3>Applicant Information</h3>
            <div class="row"><span class="label">Full Name</span><span class="value">${formData.fullName}</span></div>
            <div class="row"><span class="label">Email</span><span class="value">${formData.emailId}</span></div>
            <div class="row"><span class="label">Mobile</span><span class="value">${formData.mobileNumber}</span></div>
            <div class="row"><span class="label">Gender</span><span class="value">${formData.gender}</span></div>
            <div class="row"><span class="label">Nationality</span><span class="value">${formData.nationality}</span></div>
          </div>

          <div class="section">
            <h3>Course Details</h3>
            <div class="row"><span class="label">Course Type</span><span class="value">${formData.courseType}</span></div>
            <div class="row"><span class="label">Course Name</span><span class="value">${formData.courseName}</span></div>
            ${formData.sessionYear ? `<div class="row"><span class="label">Session</span><span class="value">${formData.sessionYear}</span></div>` : ''}
            ${formData.studyMode ? `<div class="row"><span class="label">Mode</span><span class="value">${formData.studyMode}</span></div>` : ''}
          </div>

          <div class="section">
            <h3>Submission Details</h3>
            <div class="row"><span class="label">Date</span><span class="value">${dateStr}</span></div>
            <div class="row"><span class="label">Time</span><span class="value">${timeStr}</span></div>
            <div class="row"><span class="label">Status</span><span class="value">Pending Review</span></div>
            <div class="row"><span class="label">Payment Method</span><span class="value">${formData.paymentOption || 'N/A'}</span></div>
          </div>

          <div class="note">
            <strong>Important:</strong> Please save this receipt for your records. Your application number <strong>${submittedAppNumber}</strong> is required for all future correspondence. You will receive a confirmation email within 2-3 business days.
          </div>

          <div class="footer">
            <p>This is a computer-generated receipt and does not require a signature.</p>
            <p style="margin-top: 5px;">© ${now.getFullYear()} International Board of Medical Practitioners. All rights reserved.</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    // Validate file size (max 5MB per file)
    if (file && file.size > 5 * 1024 * 1024) {
      alert(`File "${file.name}" is too large. Maximum size is 5MB per file.`);
      e.target.value = '';
      return;
    }
    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (typeof value === 'boolean') {
          formDataToSend.append(key, value ? '1' : '0');
        } else if (value !== null) {
          formDataToSend.append(key, String(value));
        }
      });

      const response = await fetch('/api/admission/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      // Handle non-JSON responses (e.g., 413 Request Entity Too Large)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (response.status === 413) {
          alert('The uploaded files are too large. Please reduce the file sizes (max 2MB each) and try again.');
        } else {
          alert(`Server error (${response.status}). Please try again.`);
        }
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (result.success) {
        setSubmittedAppNumber(result.applicationNumber || 'IBMP-' + new Date().getFullYear());
        setShowSuccess(true);
      } else {
        alert(result.message || 'Error submitting application. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const courseOptions = [
    "Fellowship in Emergency Medicine",
    "Fellowship in Diabetology",
    "Fellowship in Family Medicine",
    "Fellowship in Anesthesiology",
    "Fellowship in Critical Care",
    "Fellowship in Internal Medicine",
    "Fellowship in Endocrinology",
    "Fellowship in HIV Medicine",
    "Fellowship in Intensive Care",
    "Fellowship in Geriatric Medicine",
    "Fellowship in Pulmonary Medicine",
    "Fellowship in Pain Management",
    "Fellowship in Psychological Medicine",
    "Fellowship in Obstetrics & Gynecology",
    "Fellowship in Reproductive Medicine",
    "Fellowship in Fetal Medicine",
    "Fellowship in Cosmetic Gynecology",
    "Fellowship in Endogynecology",
    "Fellowship in Gynae Oncology",
    "Fellowship in Gynae Laparoscopy",
    "Fellowship in Laparoscopy & Hysteroscopy",
    "Fellowship in Interventional Radiology",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Application for Admission
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our globally recognized medical education programs and advance your healthcare career with International Board of Medical Practitioners (IBMP) certification.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="mb-8 text-center border-b pb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              International Board of Medical Practitioners (IBMP)
            </h2>
            <p className="text-gray-600">Application for Admission - Academic Year 2025-26</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Application Details */}
            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="text-xl font-semibold text-gray-900 px-3">Application Details</legend>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form Number
                  </label>
                  <input
                    type="text"
                    value="IBMP-2025-AUTO-GENERATED"
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recent Passport Size Photo *
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'passportPhoto')}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 2MB)</p>
                </div>
              </div>
            </fieldset>

            {/* Personal Details */}
            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="text-xl font-semibold text-gray-900 px-3">Personal Details</legend>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Title</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Full Name as per Certificate"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="18"
                    max="100"
                    required
                    placeholder="As in 10th Certificate"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </fieldset>

            {/* How do you know us */}
            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="text-xl font-semibold text-gray-900 px-3">How do you know us?</legend>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How did you hear about IBMP? *
                  </label>
                  <select
                    name="referralSource"
                    value={formData.referralSource}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select an option</option>
                    <option value="Google Search">Google Search</option>
                    <option value="Social Media">Social Media</option>
                    <option value="DMHCA">DMHCA</option>
                    <option value="Website">IBMP Website</option>
                    <option value="Friend/Family">Friend/Family Recommendation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {formData.referralSource === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Please specify *</label>
                    <input
                      type="text"
                      name="otherReferralSource"
                      value={formData.otherReferralSource}
                      onChange={handleInputChange}
                      required
                      placeholder="Please tell us how you found us"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </fieldset>

            {/* Contact Details */}
            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="text-xl font-semibold text-gray-900 px-3">Contact Details</legend>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correspondence Address *</label>
                  <textarea
                    name="correspondenceAddress"
                    value={formData.correspondenceAddress}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Complete correspondence address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Landline number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="Mobile number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email ID *</label>
                  <input
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    required
                    placeholder="Email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permanent Address *</label>
                  <textarea
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Complete permanent address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </fieldset>

            {/* Course Details */}
            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="text-xl font-semibold text-gray-900 px-3">Course/Programme Details</legend>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Type *</label>
                  <select
                    name="courseType"
                    value={formData.courseType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Course Type</option>
                    <option value="Fellowship">Fellowship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
                  <select
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Course</option>
                    {courseOptions.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Study Mode *</label>
                  <select
                    name="studyMode"
                    value={formData.studyMode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Mode</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Year *</label>
                  <input
                    type="text"
                    name="sessionYear"
                    value={formData.sessionYear}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 2025-2026"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </fieldset>

            {/* Terms & Declaration */}
            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="text-xl font-semibold text-gray-900 px-3">Terms & Conditions</legend>
              
              <div className="space-y-4 mt-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    required
                    className="mt-1 h-5 w-5 text-blue-600 rounded"
                  />
                  <label className="text-sm text-gray-700">
                    I have read and agree to all the terms and conditions *
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleInputChange}
                    required
                    className="mt-1 h-5 w-5 text-blue-600 rounded"
                  />
                  <label className="text-sm text-gray-700">
                    I agree to the Privacy Policy *
                  </label>
                </div>
              </div>
            </fieldset>

            {/* Declaration */}
            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="text-xl font-semibold text-gray-900 px-3">Declaration</legend>
              
              <div className="space-y-4 mt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      name="declarationDate"
                      value={formData.declarationDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Digital Signature *</label>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={(e) => handleFileChange(e, 'digitalSignature')}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG (Max 1MB)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="declarationAccepted"
                    checked={formData.declarationAccepted}
                    onChange={handleInputChange}
                    required
                    className="mt-1 h-5 w-5 text-blue-600 rounded"
                  />
                  <label className="text-sm text-gray-700">
                    I hereby confirm that all information provided is true and accurate *
                  </label>
                </div>
              </div>
            </fieldset>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center bg-white rounded-lg p-8 shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about the admission process, please contact us:
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 text-gray-700">
            <a href="mailto:info@ibmpractitioner.us" className="hover:text-blue-600">
              📧 info@ibmpractitioner.us
            </a>
            <a href="tel:+13026002718" className="hover:text-blue-600">
              📞 +1 302 600 2718
            </a>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-600 mb-1">Your Application Number</p>
              <p className="text-xl font-bold text-blue-800 tracking-wider">{submittedAppNumber}</p>
            </div>
            
            <p className="text-gray-600 text-sm mb-6">
              Please save your application number for future reference. We will review your submission and contact you within 2-3 business days.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={generatePDF}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
              >
                📄 Download Receipt (PDF)
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
