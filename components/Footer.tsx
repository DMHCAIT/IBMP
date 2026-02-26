'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSectionContent } from '@/lib/content-context';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const content = useSectionContent('footer');

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="relative w-32 h-16 overflow-hidden">
                <Image
                  src="/ibmp-01.png"
                  alt="IBMP Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {content.brandDescription}
            </p>
            {/* Contact Info */}
            <div className="space-y-3">
              {content.contact?.phone && (
                <div className="flex items-center gap-3">
                  <span className="text-secondary">📞</span>
                  <a href={`tel:${content.contact.phone}`} className="text-gray-600 hover:text-secondary transition-colors text-sm">
                    {content.contact.phone}
                  </a>
                </div>
              )}
              {content.contact?.email && (
                <div className="flex items-center gap-3">
                  <span className="text-secondary">📧</span>
                  <a href={`mailto:${content.contact.email}`} className="text-gray-600 hover:text-secondary transition-colors text-sm">
                    {content.contact.email}
                  </a>
                </div>
              )}
            </div>
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
              <Link href="/disclaimer" className="text-gray-600 hover:text-secondary transition-colors text-sm">
                Disclaimer
              </Link>
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
