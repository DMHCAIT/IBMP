'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSectionContent } from '@/lib/content-context';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const content = useSectionContent('footer');

  return (
    <footer className="bg-gradient-to-r from-slate-800 to-slate-700 text-gray-100 border-t border-slate-600">
      <div className="container-custom py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start mb-8">
            {/* Brand & Contact */}
            <div className="md:col-span-2 pr-4">
              <div className="mb-4 flex items-start -ml-3">
                <Image src="/ibmp-01.png" alt="IBMP Logo" width={176} height={64} className="object-contain" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">Establishing global excellence in medical education, accreditation, and professional certification for healthcare practitioners worldwide.</p>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">📞</span>
                  <a href={`tel:${content.contact?.phone ?? '+13023020293'}`} className="hover:text-amber-400 transition-colors">{content.contact?.phone ?? '+1 3023020293'}</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">✉️</span>
                  <a href={`mailto:${content.contact?.email ?? 'info@ibmpractitioner.us'}`} className="hover:text-amber-400 transition-colors">{content.contact?.email ?? 'info@ibmpractitioner.us'}</a>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">📍</span>
                  <div className="text-xs">
                    <div>800 N King Street, Suite 304</div>
                    <div>Wilmington, Delaware 19801</div>
                    <div>United States</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-3 pt-6 md:pt-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-sky-300 font-semibold text-sm uppercase tracking-wider mb-4">Explore</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/" className="text-gray-300 hover:text-amber-400 transition-colors">Home</Link></li>
                    <li><Link href="/about" className="text-gray-300 hover:text-amber-400 transition-colors">About us</Link></li>
                    <li><Link href="/accreditation" className="text-gray-300 hover:text-amber-400 transition-colors">Accreditation</Link></li>
                    <li><Link href="/programs" className="text-gray-300 hover:text-amber-400 transition-colors">Fellowship</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sky-300 font-semibold text-sm uppercase tracking-wider mb-4">Programs</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/verification" className="text-gray-300 hover:text-amber-400 transition-colors">Verification</Link></li>
                    <li><Link href="/blog" className="text-gray-300 hover:text-amber-400 transition-colors">Blog</Link></li>
                    <li><Link href="/contact" className="text-gray-300 hover:text-amber-400 transition-colors">Contact us</Link></li>
                    <li><Link href="/faqs" className="text-gray-300 hover:text-amber-400 transition-colors">FAQs</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sky-300 font-semibold text-sm uppercase tracking-wider mb-4">Support</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/guidelines" className="text-gray-300 hover:text-amber-400 transition-colors">Guidelines</Link></li>
                    <li><Link href="/support" className="text-gray-300 hover:text-amber-400 transition-colors">Support</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-xs">
              © {currentYear} International Board of Medical Practitioners. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs">
              <Link href="/disclaimer" className="text-gray-400 hover:text-amber-400 transition-colors">
                Disclaimer
              </Link>
              <Link href="/privacy-policy" className="text-gray-400 hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-amber-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund-policy" className="text-gray-400 hover:text-amber-400 transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
