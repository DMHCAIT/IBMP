'use client';

import Link from 'next/link';
import { useSectionContent } from '@/lib/content-context';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const content = useSectionContent('footer');

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">IBMP</span>
              </div>
              <div>
                <div className="text-primary font-bold text-lg leading-tight">IBMP</div>
                <div className="text-gray-600 text-xs">Medical Accreditation</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {content.brandDescription}
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">Organization</h3>
            <ul className="space-y-3">
              {content.organization.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-secondary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-3">
              {content.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-secondary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              {content.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-secondary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} International Board of Medical Practitioners. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/#" className="text-gray-600 hover:text-secondary transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/#" className="text-gray-600 hover:text-secondary transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
