'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, PlayCircle, X } from 'lucide-react';
import { useSectionContent } from '@/lib/content-context';

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const content = useSectionContent('hero');
  const [showVideoModal, setShowVideoModal] = useState(false);

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

      <div className="container-custom relative z-10 py-0 sm:py-2 md:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 sm:space-y-4 md:space-y-6"
          >
            {/* Heading */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-primary leading-[0.9] tracking-tight text-left">
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
              className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 flex-wrap"
            >
              {/* Button 1: Summary of Accreditation */}
              <Link 
                href="/accreditation"
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2 text-sm sm:text-base">
                  Summary of Accreditation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>

              {/* Button 2: Apply for Accreditation */}
              <Link 
                href="/contact"
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-primary text-primary font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2 text-sm sm:text-base">
                  Apply for Accreditation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>

              {/* Button 3: Watch Overview */}
              <button 
                onClick={() => setShowVideoModal(true)}
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2 text-sm sm:text-base">
                  <PlayCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  Watch Overview
                </span>
              </button>
            </motion.div>

            {/* Video Modal */}
            {showVideoModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                  <video
                    width="100%"
                    height="auto"
                    controls
                    autoPlay
                    className="w-full"
                  >
                    <source src="/Overviewvideo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </motion.div>
              </div>
            )}

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

          {/* Right Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="rounded-xl shadow-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=90"
                alt="Medical Professional Healthcare Learning"
                width={520}
                height={900}
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
