'use client';

import { useState } from 'react';

interface FellowshipResult {
  certificationId: string;
  fullName: string;
  fellowshipTitle: string;
  awardMonthYear: string;
  status: string;
}

interface OrganizationAccreditationResult {
  organizationName: string;
  accreditationTitle: string;
  accreditationNumber: string;
  dateOfAccreditation: string;
  validityPeriod: string;
  status: string;
}

type VerificationResult = FellowshipResult | OrganizationAccreditationResult;

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'Active';
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
        isActive
          ? 'bg-green-100 text-green-700 border-green-200'
          : 'bg-red-100 text-red-700 border-red-200'
      }`}
    >
      {status}
    </span>
  );
}

export default function VerificationForm() {
  const [activeTab, setActiveTab] = useState<'fellowship' | 'organization'>('fellowship');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VerificationResult[] | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleVerify = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError(`Please enter ${activeTab === 'fellowship' ? 'an accreditation number, fellowship number, or full name' : 'an accreditation number or organization name'}.`);
      return;
    }
    if (trimmed.length < 2) {
      setError('Please enter at least 2 characters to search.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);
    setSearched(false);

    try {
      const res = await fetch(`/api/verification?q=${encodeURIComponent(trimmed)}&type=${activeTab}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || 'Error searching records. Please try again.');
      } else {
        setResults(json.results || []);
        setSearched(true);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleVerify();
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab('fellowship');
            setQuery('');
            setResults(null);
            setError('');
            setSearched(false);
          }}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'fellowship'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Fellowship Verification
        </button>
        <button
          onClick={() => {
            setActiveTab('organization');
            setQuery('');
            setResults(null);
            setError('');
            setSearched(false);
          }}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'organization'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Organization Accreditation
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Search Credentials
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          placeholder={activeTab === 'fellowship' ? 'Enter fellowship number or full name' : 'Enter accreditation number or organization name'}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
          disabled={loading}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Verifying...
          </>
        ) : (
          'Verify Now'
        )}
      </button>

      {/* Results */}
      {searched && results !== null && (
        <div className="mt-6">
          {results.length === 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <h3 className="font-bold text-gray-800 mb-1">No Records Found</h3>
              <p className="text-sm text-gray-600">
                No records matched your search. Please verify the {activeTab === 'fellowship' ? 'ID or name' : 'accreditation number or organization name'} and try again.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-bold text-primary text-lg">
                {results.length} Record{results.length > 1 ? 's' : ''} Found
              </h3>

              {/* Fellowship Results */}
              {activeTab === 'fellowship' && results.map((r, i) => {
                const fellowshipResult = r as FellowshipResult;
                return (
                  <div key={i} className="bg-white border border-green-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="font-bold text-gray-900 text-lg">{fellowshipResult.fullName}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-gray-100 pb-3">
                        <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Certification ID</span>
                        <span className="text-gray-900 font-semibold font-mono">{fellowshipResult.certificationId}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-gray-100 pb-3">
                        <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Full Name</span>
                        <span className="text-gray-900 font-semibold">{fellowshipResult.fullName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-gray-100 pb-3">
                        <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Fellowship Awarded Title</span>
                        <span className="text-gray-900">{fellowshipResult.fellowshipTitle}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-gray-100 pb-3">
                        <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Month &amp; year</span>
                        <span className="text-gray-900">{fellowshipResult.awardMonthYear}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Current Status (Active / Inactive)</span>
                        <StatusBadge status={fellowshipResult.status} />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Organization Accreditation Results */}
              {activeTab === 'organization' && results.map((r, i) => {
                const orgResult = r as OrganizationAccreditationResult;
                return (
                  <div key={i} className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="font-bold text-gray-900 text-lg">{orgResult.organizationName}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-gray-100 pb-3">
                        <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">IBMP Accreditation No.</span>
                        <span className="text-gray-900 font-semibold font-mono">{orgResult.accreditationNumber}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-gray-100 pb-3">
                        <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Name of Organization</span>
                        <span className="text-gray-900 font-semibold">{orgResult.organizationName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-gray-100 pb-3">
                        <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Accreditation Title / Category</span>
                        <span className="text-gray-900">{orgResult.accreditationTitle}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-gray-100 pb-3">
                        <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Date of Accreditation</span>
                        <span className="text-gray-900">{orgResult.dateOfAccreditation}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-gray-100 pb-3">
                        <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Validity Period</span>
                        <span className="text-gray-900">{orgResult.validityPeriod || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Current Status</span>
                        <StatusBadge status={orgResult.status} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
