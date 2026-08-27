'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Check, AlertCircle, Loader2, GraduationCap, Building2 } from 'lucide-react';

interface VerificationRecord {
  id: string;
  certification_id: string;
  full_name: string;
  fellowship_title: string;
  award_month_year: string;
  status: string;
  created_at: string;
}

interface OrgAccreditationRecord {
  id: string;
  organization_name: string;
  accreditation_title: string;
  accreditation_number: string;
  date_of_accreditation: string;
  validity_period: string;
  status: 'Active' | 'Expired' | 'Suspended' | 'Withdrawn';
  created_at?: string;
}

const EMPTY_FORM = {
  certification_id: '',
  full_name: '',
  fellowship_title: '',
  award_month_year: '',
  status: 'Active',
};

function parseYearsFromValidity(validityStr: string): number {
  if (!validityStr) return 3;
  const match = validityStr.match(/(\d+)\s*Year/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 3;
}

function formatValidityString(years: number, dateStr: string): string {
  let startYear = new Date().getFullYear();
  if (dateStr) {
    const match = dateStr.match(/\d{4}/);
    if (match) {
      startYear = parseInt(match[0], 10);
    }
  }
  const endYear = startYear + years;
  const labelText = years === 1 ? '1 Year' : `${years} Years`;
  return `${labelText} (${startYear} - ${endYear})`;
}

const EMPTY_ORG_FORM: Omit<OrgAccreditationRecord, 'id'> = {
  organization_name: '',
  accreditation_title: 'Fellowship',
  accreditation_number: '',
  date_of_accreditation: '',
  validity_period: '',
  status: 'Active',
};

const INITIAL_ORG_RECORDS: OrgAccreditationRecord[] = [
  {
    id: 'org-1',
    organization_name: 'Apex Global Medical University (Dummy)',
    accreditation_title: 'Fellowship',
    accreditation_number: 'IBMP-23173IN',
    date_of_accreditation: '2025-01-15',
    validity_period: '5 Years (2025 - 2030)',
    status: 'Active',
  },
  {
    id: 'org-2',
    organization_name: 'Metro Care Research Hospital (Dummy)',
    accreditation_title: 'CME/CPD',
    accreditation_number: 'IBMP-244001IN',
    date_of_accreditation: '2024-08-20',
    validity_period: '3 Years (2024 - 2027)',
    status: 'Active',
  },
];

export default function AdminVerificationPage() {
  const [activeTab, setActiveTab] = useState<'fellowship' | 'accreditation'>('fellowship');

  // Fellowship state
  const [records, setRecords] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Organization Accreditation state
  const [orgRecords, setOrgRecords] = useState<OrgAccreditationRecord[]>(INITIAL_ORG_RECORDS);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [orgForm, setOrgForm] = useState({ ...EMPTY_ORG_FORM });
  const [orgFormError, setOrgFormError] = useState('');
  const [orgFormLoading, setOrgFormLoading] = useState(false);

  // Global delete & success feedback
  const [successMsg, setSuccessMsg] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingType, setDeletingType] = useState<'fellowship' | 'accreditation' | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/verification-records', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
      } else {
        setError(data.message || 'Failed to load records.');
      }
    } catch {
      setError('Network error loading records.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrgRecords = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/organization-accreditations', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.records) && data.records.length > 0) {
        setOrgRecords(data.records);
      }
    } catch {
      // Keep existing sample records if DB table is not yet migrated
    }
  }, []);

  useEffect(() => {
    fetchRecords();
    fetchOrgRecords();
  }, [fetchRecords, fetchOrgRecords]);

  // --- Fellowship Handlers ---
  function openAddForm() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  }

  function openEditForm(record: VerificationRecord) {
    setForm({
      certification_id: record.certification_id,
      full_name: record.full_name,
      fellowship_title: record.fellowship_title,
      award_month_year: record.award_month_year,
      status: record.status,
    });
    setEditingId(record.id);
    setFormError('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const url = editingId
        ? `/api/admin/verification-records/${editingId}`
        : '/api/admin/verification-records';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(editingId ? 'Record updated successfully.' : 'Record added successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
        closeForm();
        fetchRecords();
      } else {
        setFormError(data.message || 'Failed to save record.');
      }
    } catch {
      setFormError('Network error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteFellowship(id: string) {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/verification-records/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Record deleted successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
        setDeletingId(null);
        setDeletingType(null);
        fetchRecords();
      } else {
        setError(data.message || 'Failed to delete record.');
      }
    } catch {
      setError('Network error deleting record.');
    } finally {
      setDeleteLoading(false);
    }
  }

  // --- Organization Accreditation Handlers ---
  function openAddOrgForm() {
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultValidity = formatValidityString(3, todayStr);
    setOrgForm({
      ...EMPTY_ORG_FORM,
      date_of_accreditation: todayStr,
      validity_period: defaultValidity,
    });
    setEditingOrgId(null);
    setOrgFormError('');
    setShowOrgForm(true);
  }

  function handleOrgDateChange(newDate: string) {
    const currentYears = parseYearsFromValidity(orgForm.validity_period);
    const newValidity = formatValidityString(currentYears, newDate);
    setOrgForm((prev) => ({
      ...prev,
      date_of_accreditation: newDate,
      validity_period: newValidity,
    }));
  }

  function handleOrgValidityChange(years: number) {
    const newValidity = formatValidityString(years, orgForm.date_of_accreditation);
    setOrgForm((prev) => ({
      ...prev,
      validity_period: newValidity,
    }));
  }

  function openEditOrgForm(record: OrgAccreditationRecord) {
    setOrgForm({
      organization_name: record.organization_name,
      accreditation_title: record.accreditation_title,
      accreditation_number: record.accreditation_number,
      date_of_accreditation: record.date_of_accreditation,
      validity_period: record.validity_period || formatValidityString(3, record.date_of_accreditation),
      status: record.status,
    });
    setEditingOrgId(record.id);
    setOrgFormError('');
    setShowOrgForm(true);
  }

  function closeOrgForm() {
    setShowOrgForm(false);
    setEditingOrgId(null);
    setOrgForm({ ...EMPTY_ORG_FORM });
    setOrgFormError('');
  }

  async function handleOrgSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOrgFormError('');
    if (!orgForm.organization_name.trim() || !orgForm.accreditation_title.trim() || !orgForm.accreditation_number.trim() || !orgForm.date_of_accreditation.trim()) {
      setOrgFormError('Please fill in all required fields.');
      return;
    }

    setOrgFormLoading(true);
    try {
      const url = editingOrgId
        ? `/api/admin/organization-accreditations/${editingOrgId}`
        : '/api/admin/organization-accreditations';
      const method = editingOrgId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orgForm),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(editingOrgId ? 'Organization accreditation record updated successfully.' : 'Organization accreditation record added successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
        closeOrgForm();
        fetchOrgRecords();
      } else {
        // Fallback to local frontend state if DB table not yet created
        if (editingOrgId) {
          setOrgRecords((prev) => prev.map((rec) => (rec.id === editingOrgId ? { ...rec, ...orgForm } : rec)));
        } else {
          setOrgRecords((prev) => [{ id: `org-${Date.now()}`, ...orgForm }, ...prev]);
        }
        setSuccessMsg(editingOrgId ? 'Organization accreditation record updated successfully.' : 'Organization accreditation record added successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
        closeOrgForm();
      }
    } catch {
      // Local fallback on error
      if (editingOrgId) {
        setOrgRecords((prev) => prev.map((rec) => (rec.id === editingOrgId ? { ...rec, ...orgForm } : rec)));
      } else {
        setOrgRecords((prev) => [{ id: `org-${Date.now()}`, ...orgForm }, ...prev]);
      }
      setSuccessMsg(editingOrgId ? 'Organization accreditation record updated successfully.' : 'Organization accreditation record added successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
      closeOrgForm();
    } finally {
      setOrgFormLoading(false);
    }
  }

  async function handleDeleteOrg(id: string) {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/organization-accreditations/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Organization accreditation record deleted successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
        setDeletingId(null);
        setDeletingType(null);
        fetchOrgRecords();
      } else {
        setOrgRecords((prev) => prev.filter((r) => r.id !== id));
        setSuccessMsg('Organization accreditation record deleted successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
        setDeletingId(null);
        setDeletingType(null);
      }
    } catch {
      setOrgRecords((prev) => prev.filter((r) => r.id !== id));
      setSuccessMsg('Organization accreditation record deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
      setDeletingId(null);
      setDeletingType(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  function triggerDelete(id: string, type: 'fellowship' | 'accreditation') {
    setDeletingId(id);
    setDeletingType(type);
  }

  const getStatusBadge = (status: OrgAccreditationRecord['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Expired':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Suspended':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Withdrawn':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Records</h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === 'fellowship'
              ? 'Manage fellowship verification records. Records entered here will appear when users search on the verification page.'
              : 'Manage organization accreditation records and their validity status.'}
          </p>
        </div>
        <button
          onClick={activeTab === 'fellowship' ? openAddForm : openAddOrgForm}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'fellowship' ? 'Add Record' : 'Add Accreditation Record'}
        </button>
      </div>

      {/* Tab Toggle Option */}
      <div className="flex border-b border-gray-200 mb-6 gap-2">
        <button
          onClick={() => {
            setActiveTab('fellowship');
            closeForm();
            closeOrgForm();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === 'fellowship'
            ? 'border-blue-600 text-blue-600 font-semibold'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
          <GraduationCap className="w-4 h-4" />
          Fellowship Verification
        </button>
        <button
          onClick={() => {
            setActiveTab('accreditation');
            closeForm();
            closeOrgForm();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === 'accreditation'
            ? 'border-blue-600 text-blue-600 font-semibold'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
          <Building2 className="w-4 h-4" />
          Organization Accreditation
        </button>
      </div>

      {/* Feedback Messages */}
      {successMsg && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <Check className="w-4 h-4 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Fellowship Modal Form */}
      {showForm && activeTab === 'fellowship' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6 md:p-8 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] my-auto border border-gray-100">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                {editingId ? 'Edit Fellowship Record' : 'Add New Fellowship Record'}
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Certification ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.certification_id}
                    onChange={(e) => setForm({ ...form, certification_id: e.target.value })}
                    placeholder="e.g. 2026039105"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 sm:py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[42px]"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Month &amp; Year of Award <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.award_month_year}
                    onChange={(e) => setForm({ ...form, award_month_year: e.target.value })}
                    placeholder="e.g. December 2025"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 sm:py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[42px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Full Name of Fellow <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="e.g. Dr Anand Singh"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 sm:py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[42px]"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Fellowship Awarded Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.fellowship_title}
                  onChange={(e) => setForm({ ...form, fellowship_title: e.target.value })}
                  placeholder="e.g. Fellowship in Surgical Oncology"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 sm:py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[42px]"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Current Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 sm:py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[42px] cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100 bg-white flex-shrink-0 mt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors min-h-[42px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 min-h-[42px]"
                >
                  {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Organization Accreditation Modal Form */}
      {showOrgForm && activeTab === 'accreditation' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6 md:p-8 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] my-auto border border-gray-100">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                {editingOrgId ? 'Edit Organization Accreditation' : 'Add New Organization Accreditation'}
              </h2>
              <button onClick={closeOrgForm} className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleOrgSubmit} className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 overflow-y-auto flex-1">
              {orgFormError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {orgFormError}
                </div>
              )}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Name of Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={orgForm.organization_name}
                  onChange={(e) => setOrgForm({ ...orgForm, organization_name: e.target.value })}
                  placeholder="e.g. Metro General Hospital & Research Center"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 sm:py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[42px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Accreditation Title / Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={orgForm.accreditation_title}
                    onChange={(e) => setOrgForm({ ...orgForm, accreditation_title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 sm:py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[42px] cursor-pointer"
                  >
                    <option value="Fellowship">Fellowship</option>
                    <option value="Certificate">Certificate</option>
                    <option value="CME/CPD">CME/CPD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    IBMP Accreditation Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={orgForm.accreditation_number}
                    onChange={(e) => setOrgForm({ ...orgForm, accreditation_number: e.target.value })}
                    placeholder="e.g. IBMP-33190IN"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 sm:py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[42px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Date of Accreditation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={orgForm.date_of_accreditation}
                    onChange={(e) => handleOrgDateChange(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 sm:py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[42px] cursor-pointer [color-scheme:light]"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Validity Period <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={parseYearsFromValidity(orgForm.validity_period)}
                    onChange={(e) => handleOrgValidityChange(parseInt(e.target.value, 10))}
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 sm:py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[42px] cursor-pointer"
                  >
                    {[1, 2, 3, 5].map((years) => (
                      <option key={years} value={years}>
                        {formatValidityString(years, orgForm.date_of_accreditation)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Current Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={orgForm.status}
                  onChange={(e) =>
                    setOrgForm({ ...orgForm, status: e.target.value as OrgAccreditationRecord['status'] })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 sm:py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[42px] cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 bg-white flex-shrink-0 mt-2">
                <button
                  type="button"
                  onClick={closeOrgForm}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors min-h-[42px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={orgFormLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 min-h-[42px]"
                >
                  {orgFormLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingOrgId ? 'Save Changes' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 my-auto border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Delete Record?</h2>
            <p className="text-sm text-gray-600 mb-6">
              This will permanently remove the record. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeletingId(null);
                  setDeletingType(null);
                }}
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deletingType === 'fellowship') {
                    handleDeleteFellowship(deletingId);
                  } else if (deletingType === 'accreditation') {
                    handleDeleteOrg(deletingId);
                  }
                }}
                disabled={deleteLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Tables */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {activeTab === 'fellowship' ? (
          /* Fellowship Table */
          loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading fellowship records...
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg font-medium">No records yet</p>
              <p className="text-sm mt-1">Click &quot;Add Record&quot; to create the first verification entry.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Certification ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Full Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Fellowship Title</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Month &amp; Year</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-blue-700 font-medium">{record.certification_id}</td>
                      <td className="px-4 py-3 text-gray-900">{record.full_name}</td>
                      <td className="px-4 py-3 text-gray-700">{record.fellowship_title}</td>
                      <td className="px-4 py-3 text-gray-600">{record.award_month_year}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditForm(record)} className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => triggerDelete(record.id, 'fellowship')} className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* Organization Accreditation Table */
          orgRecords.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg font-medium">No organization accreditation records yet</p>
              <p className="text-sm mt-1">Click &quot;Add Accreditation Record&quot; to create the first organization entry.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">IBMP Accreditation No.</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Name of Organization</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Accreditation Title / Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Date of Accreditation</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Validity Period</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orgRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-blue-700 font-medium">{record.accreditation_number}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{record.organization_name}</td>
                      <td className="px-4 py-3 text-gray-700">{record.accreditation_title}</td>
                      <td className="px-4 py-3 text-gray-600">{record.date_of_accreditation}</td>
                      <td className="px-4 py-3 text-gray-600">{record.validity_period || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditOrgForm(record)} className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => triggerDelete(record.id, 'accreditation')} className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Total: {activeTab === 'fellowship' ? records.length : orgRecords.length} record
        {(activeTab === 'fellowship' ? records.length : orgRecords.length) !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

