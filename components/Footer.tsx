'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSectionContent } from '@/lib/content-context';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const content = useSectionContent('footer');

  return (
    <footer id="site-footer" className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 text-gray-100 border-t border-primary-500 shadow-lg">
      <div className="container-custom py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 md:gap-8 items-start mb-6">
            {/* Brand & Contact */}
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Image src="/title.png" alt="IBMP Logo" width={48} height={48} style={{ width: 'auto', height: 'auto' }} className="object-contain" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-white tracking-tight">IBMP</h3>
                  <p className="text-xs text-gray-300 font-medium">International Board of Medical Practitioners</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4 font-light">Establishing global excellence in medical education, accreditation, and professional certification for healthcare practitioners worldwide.</p>
              <div className="space-y-3 text-sm text-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <a href={`tel:${content.contact?.phone ?? '+13023020293'}`} className="hover:text-accent transition-colors font-medium">{content.contact?.phone ?? '+1 3023020293'}</a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <a href={`mailto:${content.contact?.email ?? 'info@ibmpractitioner.us'}`} className="hover:text-accent transition-colors font-medium">{content.contact?.email ?? 'info@ibmpractitioner.us'}</a>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">800 N King Street, Suite 304</div>
                    <div className="font-light">Wilmington, Delaware 19801, United States</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-3 pt-0 md:pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
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
                      <Link href="/faqs" className="text-gray-200 hover:text-accent transition-colors">FAQs</Link>
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

                {/* Social Media Icons */}
                <div className="sm:col-start-3 sm:-mt-12">
                  <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Follow Us</h4>
                  <div className="flex flex-wrap items-start gap-3 sm:gap-4">
                    <a 
                      href="https://www.facebook.com/ibmpractitioner" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                      aria-label="Facebook"
                    >
                      <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5c-.563-.074-1.396-.236-2.545-.236-2.564 0-4.455 1.565-4.455 4.432v1.804z"/>
                      </svg>
                    </a>

                    <a 
                      href="https://www.youtube.com/@ibmpractitioner_us" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-600 hover:bg-red-700 transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                      aria-label="YouTube"
                    >
                      <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                      </svg>
                    </a>

                    <a 
                      href="https://www.instagram.com/ibmpboard/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-pink-600 hover:bg-pink-700 transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                      aria-label="Instagram"
                    >
                      <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.756 0 8.335.012 7.052.07 2.695.272.273 2.69.07 7.052.012 8.335 0 8.756 0 12c0 3.244.012 3.665.07 4.948.202 4.358 2.624 6.78 6.986 6.982 1.283.058 1.704.07 4.948.07 3.244 0 3.665-.012 4.948-.07 4.354-.202 6.782-2.624 6.984-6.98.058-1.28.07-1.702.07-4.948 0-3.244-.012-3.667-.07-4.947-.202-4.354-2.63-6.78-6.984-6.982C15.668.012 15.247 0 12 0z"/>
                        <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </a>

                    <a 
                      href="https://www.linkedin.com/company/107542174/admin/dashboard/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                      </svg>
                    </a>
                  </div>
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
