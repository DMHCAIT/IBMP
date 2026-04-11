'use client';

import { FormEvent, useState } from 'react';

type VerificationRecord = {
  board: string;
  certificationId: string;
  fullName: string;
  fellowshipAwardedTitle: string;
  monthsYearOfAward: string;
  currentStatus: 'Active' | 'Inactive';
};

export default function VerificationSearchCard() {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [record, setRecord] = useState<VerificationRecord | null>(null);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();

    const certificationId = searchValue.trim();
    if (!certificationId) {
      setErrorMessage('Please enter a Certification ID.');
      setRecord(null);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setRecord(null);

    try {
      const response = await fetch(`/api/verification?certificationId=${encodeURIComponent(certificationId)}`, {
        cache: 'no-store',
      });
      const data = await response.json();

      if (!data.success) {
        setErrorMessage(data.message || 'No record found for this Certification ID.');
        return;
      }

      setRecord(data.record);
    } catch {
      setErrorMessage('Unable to verify right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search Credentials</label>
          <input
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Enter Certification ID"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify Now'}
        </button>
      </form>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {errorMessage}
        </div>
      )}

      {record && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Verification Result</h3>
          <div className="space-y-2 text-sm text-gray-800">
            <p><span className="font-semibold">Board:</span> {record.board || 'FIBMP'}</p>
            <p><span className="font-semibold">Certification ID:</span> {record.certificationId}</p>
            <p><span className="font-semibold">Full Name of Fellow:</span> {record.fullName}</p>
            <p><span className="font-semibold">Fellowship Awarded Title:</span> {record.fellowshipAwardedTitle}</p>
            <p><span className="font-semibold">Months & Year of Award:</span> {record.monthsYearOfAward}</p>
            <p>
              <span className="font-semibold">Current Status:</span>{' '}
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${record.currentStatus === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                {record.currentStatus}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
