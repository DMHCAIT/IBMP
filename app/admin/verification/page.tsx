'use client';

import { useEffect, useState } from 'react';
import { useContent } from '@/lib/content-context';
import { defaultContent } from '@/lib/content-data';
import EditorLayout, { SectionCard, InputField } from '@/components/admin/EditorLayout';

interface VerificationRecord {
  id?: string;
  board: string;
  certificationId: string;
  fullName: string;
  fellowshipAwardedTitle: string;
  monthsYearOfAward: string;
  currentStatus: 'Active' | 'Inactive';
}

const INITIAL_RECORD: VerificationRecord = {
  board: 'FIBMP',
  certificationId: '',
  fullName: '',
  fellowshipAwardedTitle: '',
  monthsYearOfAward: '',
  currentStatus: 'Active',
};

function normalizeCsvHeader(header: string) {
  return header.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function splitCsvRow(row: string) {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i += 1) {
    const char = row[i];

    if (char === '"') {
      const nextChar = row[i + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function parseCsv(csvText: string) {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [] as VerificationRecord[];
  }

  const headers = splitCsvRow(lines[0]).map(normalizeCsvHeader);
  const keyMap: Record<string, keyof VerificationRecord> = {
    board: 'board',
    boardname: 'board',
    certificationid: 'certificationId',
    certificationnumber: 'certificationId',
    fellowname: 'fullName',
    fullname: 'fullName',
    fullnameoffellow: 'fullName',
    fellowshipawardedtitle: 'fellowshipAwardedTitle',
    fellowshiptitle: 'fellowshipAwardedTitle',
    monthsyearofaward: 'monthsYearOfAward',
    awardmonthyear: 'monthsYearOfAward',
    currentstatus: 'currentStatus',
    status: 'currentStatus',
  };

  return lines.slice(1).map((line) => {
    const values = splitCsvRow(line);
    const record: VerificationRecord = { ...INITIAL_RECORD };

    headers.forEach((header, index) => {
      const key = keyMap[header];
      if (!key) return;
      const value = values[index] || '';
      if (key === 'currentStatus') {
        record.currentStatus = value.toLowerCase() === 'inactive' ? 'Inactive' : 'Active';
      } else if (key === 'board') {
        record.board = value;
      } else if (key === 'certificationId') {
        record.certificationId = value;
      } else if (key === 'fullName') {
        record.fullName = value;
      } else if (key === 'fellowshipAwardedTitle') {
        record.fellowshipAwardedTitle = value;
      } else if (key === 'monthsYearOfAward') {
        record.monthsYearOfAward = value;
      } else {
        record.board = value;
      }
    });

    return {
      ...record,
      board: record.board || 'FIBMP',
    };
  }).filter((record) => record.certificationId && record.fullName);
}

export default function VerificationEditorPage() {
  const { content, updateContent, saveContent } = useContent();
  const [localContent, setLocalContent] = useState({
    verification: { ...content.verification },
  });
  const [records, setRecords] = useState<VerificationRecord[]>([]);
  const [recordForm, setRecordForm] = useState<VerificationRecord>(INITIAL_RECORD);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordSaving, setRecordSaving] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const loadRecords = async () => {
    setRecordsLoading(true);
    try {
      const response = await fetch('/api/admin/verification', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) {
        setRecords(data.records || []);
      } else {
        alert(data.message || 'Failed to load verification records.');
      }
    } catch {
      alert('Failed to load verification records.');
    } finally {
      setRecordsLoading(false);
    }
  };

  useEffect(() => {
    void loadRecords();
  }, []);

  const handleSave = async () => {
    updateContent('verification', localContent.verification);
    await saveContent();
    alert('Verification page content saved!');
  };

  const saveSingleRecord = async () => {
    if (!recordForm.certificationId || !recordForm.fullName || !recordForm.fellowshipAwardedTitle || !recordForm.monthsYearOfAward) {
      alert('Please fill all required student details before saving.');
      return;
    }

    setRecordSaving(true);
    try {
      const response = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record: recordForm }),
      });
      const data = await response.json();

      if (!data.success) {
        alert(data.message || 'Unable to save student record.');
        return;
      }

      alert('Student verification record saved successfully.');
      setRecordForm(INITIAL_RECORD);
      await loadRecords();
    } catch {
      alert('Unable to save student record.');
    } finally {
      setRecordSaving(false);
    }
  };

  const uploadCsv = async () => {
    if (!csvFile) {
      alert('Please choose a CSV file first.');
      return;
    }

    setRecordSaving(true);
    try {
      const fileContent = await csvFile.text();
      const parsedRecords = parseCsv(fileContent);

      if (parsedRecords.length === 0) {
        alert('No valid rows found. Ensure CSV includes Certification ID and Full Name columns.');
        return;
      }

      const response = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: parsedRecords }),
      });
      const data = await response.json();

      if (!data.success) {
        alert(data.message || 'Bulk upload failed.');
        return;
      }

      alert(`${parsedRecords.length} student records uploaded successfully.`);
      setCsvFile(null);
      await loadRecords();
    } catch {
      alert('Bulk upload failed. Please check your CSV format.');
    } finally {
      setRecordSaving(false);
    }
  };

  const deleteRecord = async (certificationId: string) => {
    if (!confirm(`Delete record for Certification ID: ${certificationId}?`)) return;

    try {
      const response = await fetch(`/api/admin/verification/${encodeURIComponent(certificationId)}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!data.success) {
        alert(data.message || 'Unable to delete record.');
        return;
      }

      await loadRecords();
    } catch {
      alert('Unable to delete record.');
    }
  };

  const handleReset = () => {
    if (confirm('Reset verification page content to defaults?')) {
      setLocalContent({
        verification: { ...defaultContent.verification },
      });
    }
  };

  return (
    <EditorLayout
      title="Verification Page"
      description="Edit the Verification page content"
      onSave={handleSave}
      onReset={handleReset}
    >
      {/* Verification Content */}
      <SectionCard title="Verification Page" description="Certificate verification page content">
        <InputField
          label="Tag"
          value={localContent.verification.tag}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, tag: value },
            })
          }
        />
        <InputField
          label="Title"
          value={localContent.verification.title}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, title: value },
            })
          }
        />
        <InputField
          label="Description"
          value={localContent.verification.description}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, description: value },
            })
          }
          type="textarea"
        />
      </SectionCard>

      {/* Form Content */}
      <SectionCard title="Verification Form" description="Form labels and text">
        <InputField
          label="Form Title"
          value={localContent.verification.formTitle}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, formTitle: value },
            })
          }
        />
        <InputField
          label="Form Description"
          value={localContent.verification.formDescription}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, formDescription: value },
            })
          }
        />
        <InputField
          label="Input Label"
          value={localContent.verification.inputLabel}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, inputLabel: value },
            })
          }
        />
        <InputField
          label="Input Placeholder"
          value={localContent.verification.inputPlaceholder}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, inputPlaceholder: value },
            })
          }
        />
        <InputField
          label="Button Text"
          value={localContent.verification.buttonText}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, buttonText: value },
            })
          }
        />
      </SectionCard>

      <SectionCard title="Student Verification Registry" description="Add one student record manually">
        <InputField
          label="Board / Prefix"
          value={recordForm.board}
          onChange={(value) => setRecordForm({ ...recordForm, board: value })}
          placeholder="Example: FIBMP"
        />
        <InputField
          label="Certification ID"
          value={recordForm.certificationId}
          onChange={(value) => setRecordForm({ ...recordForm, certificationId: value })}
          placeholder="Example: 2026039105"
        />
        <InputField
          label="Full Name of Fellow"
          value={recordForm.fullName}
          onChange={(value) => setRecordForm({ ...recordForm, fullName: value })}
          placeholder="Example: Dr Anand Singh"
        />
        <InputField
          label="Fellowship Awarded Title"
          value={recordForm.fellowshipAwardedTitle}
          onChange={(value) => setRecordForm({ ...recordForm, fellowshipAwardedTitle: value })}
          placeholder="Example: Fellowship in Surgical Oncology"
        />
        <InputField
          label="Months & Year of Award"
          value={recordForm.monthsYearOfAward}
          onChange={(value) => setRecordForm({ ...recordForm, monthsYearOfAward: value })}
          placeholder="Example: December 2025"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
          <select
            value={recordForm.currentStatus}
            onChange={(e) =>
              setRecordForm({
                ...recordForm,
                currentStatus: e.target.value === 'Inactive' ? 'Inactive' : 'Active',
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          type="button"
          onClick={saveSingleRecord}
          disabled={recordSaving}
          className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 disabled:opacity-50"
        >
          {recordSaving ? 'Saving...' : 'Save Student Record'}
        </button>
      </SectionCard>

      <SectionCard title="Bulk Upload (CSV)" description="Upload multiple student verification records at once">
        <p className="text-sm text-gray-600">
          CSV columns supported: board, certificationId, fullName, fellowshipAwardedTitle, monthsYearOfAward, currentStatus
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
        />
        <button
          type="button"
          onClick={uploadCsv}
          disabled={recordSaving}
          className="w-full px-6 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-600 disabled:opacity-50"
        >
          {recordSaving ? 'Uploading...' : 'Upload CSV'}
        </button>
      </SectionCard>

      <SectionCard title="Existing Records" description="All student records currently available for verification">
        <button
          type="button"
          onClick={loadRecords}
          disabled={recordsLoading}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          {recordsLoading ? 'Refreshing...' : 'Refresh Records'}
        </button>

        {records.length === 0 ? (
          <p className="text-sm text-gray-500">No student records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2 pr-4">Certification ID</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Award</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.certificationId} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">{record.certificationId}</td>
                    <td className="py-3 pr-4 text-gray-700">{record.fullName}</td>
                    <td className="py-3 pr-4 text-gray-700">{record.fellowshipAwardedTitle}</td>
                    <td className="py-3 pr-4 text-gray-700">{record.monthsYearOfAward}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${record.currentStatus === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                        {record.currentStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => deleteRecord(record.certificationId)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </EditorLayout>
  );
}
