'use client';

import { FormEvent, useState } from 'react';
import {
  Award,
  BadgeCheck,
  Building2,
  CalendarDays,
  IdCard,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

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
        <section className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-sm">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-100/60" />
          <div className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-teal-100/60" />

          <div className="relative p-6 md:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
                <h3 className="text-xl font-bold text-primary">Verification Result</h3>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                  record.currentStatus === 'Active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                {record.currentStatus}
              </span>
            </div>

            <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-100 bg-white/70 p-4">
                <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <Building2 className="h-4 w-4 text-emerald-700" />
                  Board
                </dt>
                <dd className="text-sm font-semibold text-gray-900">{record.board || 'FIBMP'}</dd>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-white/70 p-4">
                <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <IdCard className="h-4 w-4 text-emerald-700" />
                  Certification ID
                </dt>
                <dd className="text-sm font-semibold text-gray-900">{record.certificationId}</dd>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-white/70 p-4 md:col-span-2">
                <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <UserRound className="h-4 w-4 text-emerald-700" />
                  Full Name of Fellow
                </dt>
                <dd className="text-base font-bold text-primary">{record.fullName}</dd>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-white/70 p-4 md:col-span-2">
                <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <Award className="h-4 w-4 text-emerald-700" />
                  Fellowship Awarded Title
                </dt>
                <dd className="text-sm font-semibold text-gray-900">{record.fellowshipAwardedTitle}</dd>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-white/70 p-4 md:col-span-2">
                <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <CalendarDays className="h-4 w-4 text-emerald-700" />
                  Months and Year of Award
                </dt>
                <dd className="text-sm font-semibold text-gray-900">{record.monthsYearOfAward}</dd>
              </div>
            </dl>
          </div>
        </section>
      )}
    </div>
  );
}
