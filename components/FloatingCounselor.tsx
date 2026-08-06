'use client';

import { CounselorContact } from '@/components/PricingAndContact';
import { useContent } from '@/lib/content-context';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FloatingCounselor() {
  const { content } = useContent();
  const pathname = usePathname();
  const [hideFloating, setHideFloating] = useState(false);

  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setHideFloating(entry.isIntersecting);
      });
    }, { root: null, threshold: 0.05 });

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);
  
  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Only show if globally enabled and showOnAllPages is true
  if (!content.globalSettings.counselor.enabled || !content.globalSettings.counselor.showOnAllPages) {
    return null;
  }

  return <CounselorContact variant="floating" className={hideFloating ? 'opacity-0 pointer-events-none' : ''} />;
}