'use client';

import { useState } from 'react';

export default function AccreditationApplicationForm() {
  const [form, setForm] = useState({
    applicationType: 'fellowship',
    organizationName: '',
    address: '',
    contactNumber: '',
    mobile: '',
    email: '',
    website: '',
    proprietorName: '',
    proprietorAddress: '',
    proprietorPin: '',
    proprietorMobile: '',
    coursesSubmitted: '',
    orgTypes: [] as string[],
    photoId: '' as string,
  });
  
  const [files, setFiles] = useState({
    photoIdFile: null as File | null,
    proprietorPhotoFile: null as File | null,
    infrastructureFile: null as File | null,
  });

  const [fileNames, setFileNames] = useState({
    photoIdFile: '',
    proprietorPhotoFile: '',
    infrastructureFile: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function handleFileChange(fieldName: keyof typeof files, file: File | null) {
    setFiles(s => ({ ...s, [fieldName]: file }));
    if (file) {
      setFileNames(s => ({ ...s, [fieldName]: file.name }));
    }
  }

  async function uploadFile(file: File, path: string): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', path);

      const response = await fetch('/api/accreditation/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        console.error('Upload error:', result.message);
        return null;
      }

      return result.filePath;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation: ensure required fields are filled
    const required = ['organizationName', 'address', 'contactNumber', 'mobile', 'email', 'proprietorName', 'proprietorAddress', 'proprietorPin', 'proprietorMobile', 'coursesSubmitted', 'photoId'] as const;
    const missing = required.filter((k) => !(form[k as keyof typeof form]));
    if (missing.length > 0) {
      alert('Please complete all required fields. Missing: ' + missing.join(', '));
      setIsSubmitting(false);
      return;
    }

    if (form.orgTypes.length === 0) {
      alert('Please select at least one organization type');
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload files if provided
      let photoIdFilePath = '';
      let proprietorPhotoFilePath = '';
      let infrastructureFilePath = '';

      if (files.photoIdFile) {
        photoIdFilePath = await uploadFile(files.photoIdFile, `accreditation/${Date.now()}_photo_id`) || '';
      }

      if (files.proprietorPhotoFile) {
        proprietorPhotoFilePath = await uploadFile(files.proprietorPhotoFile, `accreditation/${Date.now()}_proprietor_photo`) || '';
      }

      if (files.infrastructureFile) {
        infrastructureFilePath = await uploadFile(files.infrastructureFile, `accreditation/${Date.now()}_infrastructure`) || '';
      }

      // Submit form data with file paths to API
      const payload = {
        application_type: form.applicationType,
        organization_name: form.organizationName,
        address: form.address,
        contact_number: form.contactNumber,
        mobile: form.mobile,
        email: form.email,
        website: form.website,
        proprietor_name: form.proprietorName,
        proprietor_address: form.proprietorAddress,
        proprietor_pin: form.proprietorPin,
        proprietor_mobile: form.proprietorMobile,
        courses_submitted: form.coursesSubmitted,
        org_types: form.orgTypes,
        photo_id: form.photoId,
        photo_id_file: photoIdFilePath,
        proprietor_photo_file: proprietorPhotoFilePath,
        infrastructure_file: infrastructureFilePath,
      };

      const response = await fetch('/api/accreditation/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        alert('Error: ' + (result.message || 'Failed to submit application'));
        setIsSubmitting(false);
        return;
      }

      alert('Application submitted successfully! Application ID: ' + result.application?.id);
      
      // Reset form and files
      setForm({
        applicationType: 'fellowship',
        organizationName: '',
        address: '',
        contactNumber: '',
        mobile: '',
        email: '',
        website: '',
        proprietorName: '',
        proprietorAddress: '',
        proprietorPin: '',
        proprietorMobile: '',
        coursesSubmitted: '',
        orgTypes: [],
        photoId: '',
      });
      
      setFiles({
        photoIdFile: null,
        proprietorPhotoFile: null,
        infrastructureFile: null,
      });
      
      setFileNames({
        photoIdFile: '',
        proprietorPhotoFile: '',
        infrastructureFile: '',
      });
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-secondary px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Accreditation Application</h1>
          <p className="text-white/90 mt-1">Complete this application to request accreditation. Attach required documents where indicated.</p>
        </div>

        <div className="p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center gap-6">
                  <label className="text-sm font-medium text-gray-700">Application Type</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="type" checked={form.applicationType === 'fellowship'} onChange={() => update('applicationType', 'fellowship')} />
                      <span>Fellowship</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="type" checked={form.applicationType === 'certificate'} onChange={() => update('applicationType', 'certificate')} />
                      <span>Certificate</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="type" checked={form.applicationType === 'cme'} onChange={() => update('applicationType', 'cme')} />
                      <span>CME / CPD</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-right text-sm text-gray-500">All fields are required</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Organization / Institution</label>
                <input value={form.organizationName} onChange={(e) => update('organizationName', e.target.value)} className="mt-2 block w-full border border-gray-200 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-accent" placeholder="Name of organization" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Address</label>
                <input value={form.address} onChange={(e) => update('address', e.target.value)} className="mt-2 block w-full border border-gray-200 rounded-lg p-3 shadow-sm" placeholder="Full postal address" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Contact No. (with S.T.D. code)</label>
                <input value={form.contactNumber} onChange={(e) => update('contactNumber', e.target.value)} className="mt-2 block w-full border border-gray-200 rounded-lg p-3 shadow-sm" placeholder="e.g. +1 123 456 7890" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Mobile</label>
                <input value={form.mobile} onChange={(e) => update('mobile', e.target.value)} className="mt-2 block w-full border border-gray-200 rounded-lg p-3 shadow-sm" placeholder="Primary contact mobile" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="mt-2 block w-full border border-gray-200 rounded-lg p-3 shadow-sm" placeholder="contact@institution.edu" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Website</label>
                <input value={form.website} onChange={(e) => update('website', e.target.value)} className="mt-2 block w-full border border-gray-200 rounded-lg p-3 shadow-sm" placeholder="https://" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Name of coordinator</label>
                <input value={form.proprietorName} onChange={(e) => update('proprietorName', e.target.value)} className="mt-2 block w-full border border-gray-200 rounded-lg p-3 shadow-sm" placeholder="Full name" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Office Address</label>
                <input value={form.proprietorAddress} onChange={(e) => update('proprietorAddress', e.target.value)} className="mt-2 block w-full border border-gray-200 rounded-lg p-3 shadow-sm" placeholder="Postal address" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Pin code</label>
                <input value={form.proprietorPin} onChange={(e) => update('proprietorPin', e.target.value)} className="mt-2 block w-full border border-gray-200 rounded-lg p-3 shadow-sm" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Proprietor Mobile</label>
                <input value={form.proprietorMobile} onChange={(e) => update('proprietorMobile', e.target.value)} className="mt-2 block w-full border border-gray-200 rounded-lg p-3 shadow-sm" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">List of Courses Submitted</label>
              <textarea value={form.coursesSubmitted} onChange={(e) => update('coursesSubmitted', e.target.value)} className="mt-2 block w-full border border-gray-200 rounded-lg p-3 shadow-sm bg-gray-50" rows={5} placeholder="List courses separated by commas" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Type of Registered Organization</label>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {['Trust','Society','Autonomous Institution','Company','Govt. Organization','College UG/PG','Others'].map((t) => (
                  <label key={t} className="flex items-center gap-2">
                    <input type="checkbox" checked={form.orgTypes.includes(t)} onChange={(e) => {
                      const next = e.target.checked ? [...form.orgTypes, t] : form.orgTypes.filter(x => x !== t);
                      setForm(s => ({ ...s, orgTypes: next }));
                    }} />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Photo ID Proof</label>
                <div className="mt-2 flex items-center gap-6">
                  {['DL','Passport','Voter ID'].map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm">
                      <input type="radio" name="photoId" value={p} checked={form.photoId === p} onChange={(e) => setForm(s => ({ ...s, photoId: e.target.value }))} required />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Upload Selected Photo ID</label>
                <div className="mt-2">
                  <label className="block px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-accent transition">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange('photoIdFile', e.target.files?.[0] || null)}
                    />
                    <span className="text-sm text-gray-600">{fileNames.photoIdFile || 'Choose File'}</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">Upload the document that matches the selected Photo ID (PDF or image)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Authorized Representative photo</label>
                <div className="mt-2">
                  <label className="block px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-accent transition">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileChange('proprietorPhotoFile', e.target.files?.[0] || null)}
                    />
                    <span className="text-sm text-gray-600">{fileNames.proprietorPhotoFile || 'Choose File'}</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">JPEG/PNG preferred. Will be used for internal records.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Facility & Infrastructure Documentation</label>
              <div className="mt-2">
                <label className="block px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-accent transition">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) => handleFileChange('infrastructureFile', e.target.files?.[0] || null)}
                  />
                  <span className="text-sm text-gray-600">{fileNames.infrastructureFile || 'Choose File'}</span>
                </label>
                <p className="mt-1 text-xs text-gray-500">Attach floor plans, classroom photos, or a short PDF describing facilities.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-primary text-white rounded-full font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Submitting...' : 'Submit Application'}</button>
              <button type="button" disabled={isSubmitting} onClick={() => { setForm({ applicationType: 'fellowship', organizationName: '', address: '', contactNumber: '', mobile: '', email: '', website: '', proprietorName: '', proprietorAddress: '', proprietorPin: '', proprietorMobile: '', coursesSubmitted: '', orgTypes: [], photoId: '' }); }} className="px-6 py-3 border border-gray-200 rounded-full disabled:opacity-50">Reset</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
