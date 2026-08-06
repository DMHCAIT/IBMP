'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useContent } from '@/lib/content-context';

interface SearchResult {
  type: 'course' | 'page';
  id: string;
  title: string;
  description: string;
  href: string;
  category?: string;
}

const PAGES = [
  { title: 'Home', href: '/', description: 'Return to homepage' },
  { title: 'About Us', href: '/about', description: 'Learn about IBMP' },
  { title: 'Programs', href: '/programs', description: 'Explore fellowship programs' },
  { title: 'Medical Specialties', href: '/programs/medical-specialties', description: 'Core medical specialty fellowships' },
  { title: 'Super Specialties', href: '/programs/super-specialties', description: 'Advanced subspecialty fellowships' },
  { title: 'Honorary Fellowship', href: '/programs/honorary-fellowship', description: 'Prestigious honorary recognition' },
  { title: 'Verification', href: '/verification', description: 'Verify credentials' },
  { title: 'Contact Us', href: '/contact', description: 'Get in touch with us' },
  { title: 'FAQs', href: '/faqs', description: 'Frequently asked questions' },
  { title: 'Accreditation', href: '/accreditation', description: 'Apply for accreditation' },
  { title: 'Guidelines', href: '/guidelines', description: 'Program guidelines' },
  { title: 'Privacy Policy', href: '/privacy-policy', description: 'Privacy information' },
  { title: 'Terms of Service', href: '/terms', description: 'Terms and conditions' },
];

export default function HeaderSearch() {
  const { content } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const performSearch = (query: string): SearchResult[] => {
    if (!query.trim()) {
      return [];
    }

    const q = query.toLowerCase();
    const courseResults: SearchResult[] = [];
    const pageResults: SearchResult[] = [];

    // Combine all courses
    const allCourses = [
      ...(content.courses?.medicalSpecialties || []).map(course => ({
        ...course,
        category: 'Medical Specialties'
      })),
      ...(content.courses?.superSpecialties || []).map(course => ({
        ...course,
        category: 'Super Specialties'
      })),
      ...(content.courses?.honoraryFellowship || []).map(course => ({
        ...course,
        category: 'Honorary Fellowship'
      }))
    ];

    // Search in courses
    allCourses.forEach(course => {
      if (
        course.name?.toLowerCase().includes(q) ||
        course.fullDescription?.toLowerCase().includes(q)
      ) {
        courseResults.push({
          type: 'course',
          id: course.id,
          title: course.name,
          description: course.fullDescription || '',
          href: `/programs/courses/${course.slug || course.id}`,
          category: course.category
        });
      }
    });

    // Search in pages
    PAGES.forEach(page => {
      if (
        page.title.toLowerCase().includes(q) ||
        page.description.toLowerCase().includes(q)
      ) {
        pageResults.push({
          type: 'page',
          id: page.href,
          title: page.title,
          description: page.description,
          href: page.href
        });
      }
    });

    return [...pageResults, ...courseResults].slice(0, 8);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      setResults(performSearch(value));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length > 0 && linkRef.current) {
      e.preventDefault();
      linkRef.current.href = results[0].href;
      linkRef.current.click();
      handleClose();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setResults([]);
    setIsOpen(false);
    setIsSearchExpanded(false);
  };

  const navigateTo = (href: string) => {
    window.location.href = href;
    handleClose();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    if (isOpen || isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, isSearchExpanded]);

  // Focus input when search is expanded
  useEffect(() => {
    if (isSearchExpanded) {
      inputRef.current?.focus();
    }
  }, [isSearchExpanded]);

  return (
    <div ref={containerRef} className="relative hidden md:block">
      {/* Search Icon Button */}
      <button
        onClick={() => setIsSearchExpanded(!isSearchExpanded)}
        className="p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        title="Search (Cmd+K)"
      >
        <Search className="w-5 h-5 group-hover:text-primary transition-colors" />
      </button>

      {/* Search Bar - Animated */}
      <AnimatePresence>
        {isSearchExpanded && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="absolute right-12 top-1/2 transform -translate-y-1/2"
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:bg-white">
              <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent text-sm placeholder-gray-400 focus:outline-none w-40"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && results.length > 0 && isSearchExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 w-80"
          >
            <div className="max-h-96 overflow-y-auto">
              {/* Pages Section */}
              {results.filter(r => r.type === 'page').length > 0 && (
                <div>
                  <div className="sticky top-0 px-4 py-2 bg-gray-50 font-semibold text-xs text-gray-600 uppercase tracking-wide border-b border-gray-200">
                    Pages
                  </div>
                  {results
                    .filter(r => r.type === 'page')
                    .map(result => (
                      <button
                        key={result.id}
                        onClick={() => navigateTo(result.href)}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group border-b border-gray-100 last:border-b-0"
                      >
                        <div className="mt-0.5 p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors flex-shrink-0">
                          <Search className="w-3 h-3 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors">
                            {result.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">{result.description}</p>
                        </div>
                      </button>
                    ))}
                </div>
              )}

              {/* Courses Section */}
              {results.filter(r => r.type === 'course').length > 0 && (
                <div>
                  <div className="sticky top-0 px-4 py-2 bg-gray-50 font-semibold text-xs text-gray-600 uppercase tracking-wide border-b border-gray-200">
                    Courses
                  </div>
                  {results
                    .filter(r => r.type === 'course')
                    .map(result => (
                      <button
                        key={result.id}
                        onClick={() => navigateTo(result.href)}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group border-b border-gray-100 last:border-b-0"
                      >
                        <div className="mt-0.5 p-1.5 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors flex-shrink-0">
                          <Search className="w-3 h-3 text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-semibold text-sm text-gray-900 group-hover:text-secondary transition-colors truncate">
                              {result.title}
                            </h4>
                            <span className="text-xs bg-secondary/10 text-secondary px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                              {result.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {result.description.substring(0, 80)}...
                          </p>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </span>
              <span className="text-xs text-gray-400">Press Enter to navigate</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden anchor for Enter key navigation */}
      <a ref={linkRef} style={{ display: 'none' }} />

    </div>
  );
}