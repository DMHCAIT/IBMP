'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useSectionContent } from '@/lib/content-context';

export default function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const content = useSectionContent('process');

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-2 bg-secondary-50 text-secondary font-semibold text-sm rounded-full mb-4">
            {content.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {content.title}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="space-y-6">
          {content.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 hover:border-secondary hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">{step.icon}</div>
                  <div className="text-4xl font-bold text-gray-200 group-hover:text-secondary transition-colors">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-primary mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
