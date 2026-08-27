'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useSectionContent } from '@/lib/content-context';

export default function ValuesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const content = useSectionContent('values');

  return (
    <section id="values" ref={ref} className="py-12 md:py-16 bg-gradient-to-b from-white via-slate-50 to-primary-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -mr-48" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl -mb-40" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 px-4 sm:px-0"
        >
          <div className="inline-block px-5 sm:px-7 py-2 sm:py-4 bg-gradient-to-r from-accent-100 to-accent-50 text-accent-700 font-bold text-xs sm:text-sm rounded-full mb-6 sm:mb-8 shadow-md border-2 border-accent-200">
            {content.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-primary mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {content.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed font-medium max-w-2xl mx-auto px-2 sm:px-0">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {content.values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white border-2 border-gray-200 rounded-3xl p-5 sm:p-8 md:p-10 hover:border-secondary hover:shadow-xl transition-all hover:-translate-y-2 shadow-md overflow-hidden"
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-accent/8 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              
              <div className="relative z-10">
                <div className="w-14 sm:w-18 h-14 sm:h-18 bg-gradient-to-br from-secondary-100 via-secondary-50 to-accent-50 rounded-3xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform flex-shrink-0 border-2 border-secondary/20 shadow-md">
                  <span className="text-3xl sm:text-4xl drop-shadow-lg">{value.icon}</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-primary mb-2 sm:mb-4 leading-tight">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
