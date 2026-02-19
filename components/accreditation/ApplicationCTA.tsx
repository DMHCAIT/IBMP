'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { useSectionContent } from '@/lib/content-context';

export default function ApplicationCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const content = useSectionContent('applicationCTA');

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-12 text-center shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {content.title}
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {content.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={content.primaryButton.href}
                className="group px-8 py-4 bg-primary text-white font-semibold text-lg rounded-lg hover:bg-primary-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                {content.primaryButton.text}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href={content.secondaryButton.href}
                className="group px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold text-lg rounded-lg hover:border-secondary hover:text-secondary transition-all flex items-center gap-2"
              >
                {content.secondaryButton.text}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
