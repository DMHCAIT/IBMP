'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useSectionContent } from '@/lib/content-context';

export default function ValuesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const content = useSectionContent('values');

  return (
    <section id="values" ref={ref} className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-2 bg-accent-50 text-accent-600 font-semibold text-sm rounded-full mb-4">
            {content.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {content.title}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-secondary hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">{value.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
