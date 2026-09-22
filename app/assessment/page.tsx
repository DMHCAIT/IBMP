'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
} from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFirstPaper = async () => {
      try {
        const response = await fetch('/api/admin/assessment/papers');
        if (!response.ok) throw new Error('Failed to load papers');
        
        const data = await response.json();
        if (data.papers && data.papers.length > 0) {
          const slug = data.papers[0].slug;
          router.push(`/assessment-${slug}`);
        } else {
          setError('No assessment papers available');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assessment');
      }
    };

    loadFirstPaper();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">Unable to Load Assessment</p>
          <p className="text-slate-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-slate-600 font-semibold mt-4">Loading assessment...</p>
      </div>
    </div>
  );
}
