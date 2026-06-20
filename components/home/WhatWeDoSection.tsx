'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, GraduationCap, Users, CheckCircle } from 'lucide-react';
import { useSectionContent } from '@/lib/content-context';
import { LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Award,
  GraduationCap,
  Users,
};

export default function WhatWeDoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const content = useSectionContent('whatWeDo');

  return (
    <section ref={ref} className="relative py-12 overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(11, 30, 59) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-4xl font-black text-primary mb-6 tracking-tight">
            {content.title}{' '}
            <span className="bg-gradient-to-r from-secondary to-secondary-600 bg-clip-text text-transparent">
              {content.subtitle}
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {content.services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Award;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + index * 0.15 }}
                className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-secondary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-primary mb-2">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{service.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Why Choose IBMP */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-gray-200 rounded-2xl p-8"
        >
          <h3 className="text-4xl font-black text-primary mb-6 text-center">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-secondary to-secondary-600 bg-clip-text text-transparent">
              IBMP?
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {content.whyChoose.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-secondary to-secondary-600 rounded-full flex items-center justify-center shadow-md mt-0.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-base font-semibold text-gray-700 leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
