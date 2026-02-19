'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Award, ArrowRight, PlayCircle } from 'lucide-react';
import { useSectionContent } from '@/lib/content-context';

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const content = useSectionContent('hero');

  return (
    <section ref={ref} className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden bg-white">
      {/* Advanced Background Design */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-secondary/5" />
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-br from-secondary/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(11, 30, 59) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container-custom relative z-10 py-2 sm:py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 sm:space-y-4 md:space-y-6"
          >
            {/* Heading */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-primary leading-[0.9] tracking-tight text-left">
                {content.heading?.line1 || 'International'}<br />
                <span className="relative inline-block">
                  <span className="relative z-10">{content.heading?.line2 || 'Board of'}</span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-2 sm:h-3 bg-secondary/20 origin-left"
                  />
                </span>
                <br />
                <span className="bg-gradient-to-r from-secondary via-secondary-600 to-secondary-700 bg-clip-text text-transparent">
                  {content.heading?.line3 || 'Medical Practitioners'}
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl text-left">
                {content.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5"
            >
              <Link 
                href={content.ctaButtons?.primary?.href || '/accreditation'}
                className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-primary text-white font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-3">
                  {content.ctaButtons?.primary?.text || 'Apply for Accreditation'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Link>

              <Link 
                href={content.ctaButtons?.secondary?.href || '#overview'}
                className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white border-2 border-gray-300 text-primary font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:border-secondary hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  {content.ctaButtons?.secondary?.text || 'Watch Overview'}
                </span>
              </Link>
            </motion.div>

            {/* Trust Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 sm:pt-6 border-t-2 border-gray-200 max-w-xl"
            >
              {[
                { label: 'Global Recognition', value: 'Worldwide', color: 'from-primary to-primary-700' },
                { label: 'Evidence-Based', value: 'Standards', color: 'from-secondary to-secondary-700' },
                { label: 'Transparent', value: 'Verification', color: 'from-accent to-accent-700' },
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="group cursor-default text-left"
                >
                  <div className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>

          {/* Right Content - Certificate */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative max-w-md w-full">
              {/* Certificate Container */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 p-8">
                {/* Certificate Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">IBMP Certificate</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Fellowship Program</p>
                </div>

                {/* Certificate Body */}
                <div className="space-y-4 text-center">
                  <div className="border-t border-b border-gray-200 py-4">
                    <h4 className="font-bold text-primary text-sm mb-1">Dr. John Smith</h4>
                    <p className="text-xs text-gray-600">Internal Medicine Specialist</p>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-2">
                    <div className="flex justify-between">
                      <span>Certificate ID:</span>
                      <span className="font-mono">IBMP-2024-001</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Issue Date:</span>
                      <span>January 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valid Until:</span>
                      <span>January 2027</span>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mt-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-semibold text-green-700">Verified Certificate</span>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-secondary/10 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-primary/10 rounded-full"></div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl blur-xl -z-10 scale-105"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
