'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useSectionContent } from '@/lib/content-context';

export default function ValuesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const content = useSectionContent('values');

  return (
    <section id="values" ref={ref} className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-block px-3 py-1.5 bg-accent-50 text-accent-600 font-semibold text-sm rounded-full mb-3">
            {content.badge}
          </div>
          <h2 className="text-4xl font-bold text-primary mb-3">
            {content.title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-secondary hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-secondary-100 to-secondary-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">{value.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-primary mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
