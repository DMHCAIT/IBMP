'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useSectionContent } from '@/lib/content-context';

export default function AboutHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const content = useSectionContent('aboutHero');

  return (
    <section ref={ref} className="relative py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-2 h-2 bg-secondary rounded-full opacity-40" />
      <div className="absolute bottom-20 left-10 w-3 h-3 bg-accent-400 rounded-full opacity-30" />

      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 bg-secondary-50 text-secondary font-semibold text-sm rounded-full mb-6"
          >
            {content.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6"
          >
            {content.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 leading-relaxed mb-8"
          >
            {content.description}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            {content.subDescription}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
