'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSectionContent } from '@/lib/content-context';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const content = useSectionContent('footer');

  return (
    <footer className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 text-gray-100 border-t border-primary-500 shadow-lg">
      <div className="container-custom py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start mb-6">
            {/* Brand & Contact */}
            <div className="md:col-span-2 pr-4 mt-2 md:mt-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex-shrink-0">
                  <Image src="/title.png" alt="IBMP Logo" width={60} height={60} className="object-contain filter brightness-75 sepia-0" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-white">IBMP</h3>
                  <p className="text-xs text-white">International Board of Medical Practitioners</p>
                </div>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed mb-2">Establishing global excellence in medical education, accreditation, and professional certification for healthcare practitioners worldwide.</p>
              <div className="space-y-2 text-sm text-gray-100">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <a href={`tel:${content.contact?.phone ?? '+13023020293'}`} className="hover:text-accent transition-colors">{content.contact?.phone ?? '+1 3023020293'}</a>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <a href={`mailto:${content.contact?.email ?? 'info@ibmpractitioner.us'}`} className="hover:text-accent transition-colors">{content.contact?.email ?? 'info@ibmpractitioner.us'}</a>
                </div>
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <div className="text-xs">
                    <div>800 N King Street, Suite 304</div>
                    <div>Wilmington, Delaware 19801, United States</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-3 pt-3 md:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Explore</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/" className="text-gray-200 hover:text-accent transition-colors">Home</Link></li>
                    <li><Link href="/about" className="text-gray-200 hover:text-accent transition-colors">About us</Link></li>
                    <li><Link href="/accreditation" className="text-gray-200 hover:text-accent transition-colors">Accreditation</Link></li>
                    <li><Link href="/programs" className="text-gray-200 hover:text-accent transition-colors">Fellowship</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Programs</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/verification" className="text-gray-200 hover:text-accent transition-colors">Verification</Link></li>
                    <li><Link href="/blog" className="text-gray-200 hover:text-accent transition-colors">Blog</Link></li>
                    <li><Link href="/contact" className="text-gray-200 hover:text-accent transition-colors">Contact us</Link></li>
                      <li className="mb-2">
                        <Link href="/faqs" className="text-gray-200 hover:text-accent transition-colors">
                          FAQs
                        </Link>
                      </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Support</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/guidelines" className="text-gray-200 hover:text-accent transition-colors">Guidelines</Link></li>
                    <li><Link href="/support" className="text-gray-200 hover:text-accent transition-colors">Support</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="pt-6 border-t border-primary-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-gray-300 text-xs">
              © {currentYear} International Board of Medical Practitioners. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs">
              <Link href="/disclaimer" className="text-gray-300 hover:text-accent transition-colors">
                Disclaimer
              </Link>
              <Link href="/privacy-policy" className="text-gray-300 hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund-policy" className="text-gray-300 hover:text-accent transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
