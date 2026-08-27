'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useSectionContent } from '@/lib/content-context';

export default function AboutHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const content = useSectionContent('aboutHero');

  return (
    <section ref={ref} className="relative py-8 sm:py-10 md:py-14 lg:py-16 xl:py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 overflow-hidden border-b-4 sm:border-b-8 border-secondary shadow-2xl">
      {/* Simplified Background Elements for cleaner hero */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-secondary/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-24 w-64 h-64 bg-accent/15 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/12 rounded-full blur-2xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45 }}
            className="inline-block px-4 py-2 bg-white/8 text-white/90 font-semibold text-sm rounded-full mb-6 ring-1 ring-white/10"
          >
            {content.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4 leading-snug tracking-tight px-2 sm:px-0"
          >
            {content.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed mb-3 max-w-3xl mx-auto px-4 sm:px-0"
          >
            {content.description}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="text-xs sm:text-sm md:text-sm text-primary-100/90 leading-relaxed max-w-2xl mx-auto opacity-95 px-4 sm:px-0"
          >
            {content.subDescription}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8"
          >
            <a
              href="#board"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary-600 via-secondary-500 to-accent text-white font-semibold text-sm rounded-full hover:shadow-lg transition-transform transform hover:-translate-y-1 shadow-md"
            >
              Learn More
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
