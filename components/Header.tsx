'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSectionContent } from '@/lib/content-context';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const content = useSectionContent('header');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-48 h-20 overflow-hidden">
              <Image
                src="/ibmp-01.png"
                alt="IBMP Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {content.navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-5 py-2.5 text-gray-700 hover:text-primary font-semibold rounded-xl transition-all duration-300 group overflow-hidden"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={content.ctaHref}
              className="group relative px-8 py-3.5 bg-primary text-white rounded-2xl overflow-hidden font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">{content.ctaText}</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 bg-white"
          >
            <div className="container-custom py-4 space-y-2">
              {content.navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-all font-medium"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href={content.ctaHref}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 bg-primary text-white text-center rounded-lg hover:bg-primary-600 transition-all font-semibold mt-4"
              >
                {content.ctaText}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
