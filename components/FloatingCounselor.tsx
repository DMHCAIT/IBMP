'use client';

import { CounselorContact } from '@/components/PricingAndContact';
import { useContent } from '@/lib/content-context';
import { usePathname } from 'next/navigation';

export default function FloatingCounselor() {
  const { content } = useContent();
  const pathname = usePathname();
  
  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Only show if globally enabled and showOnAllPages is true
  if (!content.globalSettings.counselor.enabled || !content.globalSettings.counselor.showOnAllPages) {
    return null;
  }

  return <CounselorContact variant="floating" />;
}