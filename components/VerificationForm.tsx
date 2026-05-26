'use client';

import { useState } from 'react';

interface VerificationResult {
  certificationId: string;
  fullName: string;
  fellowshipTitle: string;
  awardMonthYear: string;
  status: string;
}

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
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VerificationResult[] | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleVerify = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError('Please enter an accreditation number, fellowship number, or full name.');
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
      const res = await fetch(`/api/verification?q=${encodeURIComponent(trimmed)}`);
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
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Search Credentials
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          placeholder="Enter accreditation number, fellowship number, or full name"
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
                No records matched your search. Please verify the ID or name and try again.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-bold text-primary text-lg">
                {results.length} Record{results.length > 1 ? 's' : ''} Found
              </h3>
              {results.map((r, i) => (
                <div key={i} className="bg-white border border-green-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">{r.fullName}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-gray-100 pb-3">
                      <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Certification ID</span>
                      <span className="text-gray-900 font-semibold font-mono">{r.certificationId}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-gray-100 pb-3">
                      <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Full Name of Fellow</span>
                      <span className="text-gray-900 font-semibold">{r.fullName}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-gray-100 pb-3">
                      <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Fellowship Awarded Title</span>
                      <span className="text-gray-900">{r.fellowshipTitle}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-gray-100 pb-3">
                      <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Months &amp; Year of Award</span>
                      <span className="text-gray-900">{r.awardMonthYear}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="text-gray-500 font-medium sm:w-56 flex-shrink-0">Current Status (Active / Inactive)</span>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
