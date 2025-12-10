'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Award, Globe, ArrowRight, PlayCircle } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Advanced Background Design */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-secondary/5" />
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-br from-secondary/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(11, 30, 59) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container-custom relative z-10 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            {/* Certification Line */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4 text-sm"
            >
              <div className="h-px w-12 bg-gradient-to-r from-secondary to-transparent" />
              <span className="text-secondary font-semibold">ISO 9001:2015 Certified • Established 2000</span>
            </motion.div>

            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-primary leading-[0.95] tracking-tight">
                International<br />
                <span className="relative inline-block">
                  <span className="relative z-10">Board of</span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute bottom-2 left-0 right-0 h-3 bg-secondary/20 origin-left"
                  />
                </span>
                <br />
                <span className="bg-gradient-to-r from-secondary via-secondary-600 to-secondary-700 bg-clip-text text-transparent">
                  Medical Practitioners
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Advancing global healthcare through <span className="font-bold text-primary">high-quality accreditation, certification, and fellowship programs</span> for medical doctors and healthcare practitioners <span className="font-bold bg-gradient-to-r from-secondary to-secondary-600 bg-clip-text text-transparent">worldwide</span>.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-5"
            >
              <Link 
                href="/accreditation"
                className="group relative px-10 py-5 bg-primary text-white font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-3">
                  Apply for Accreditation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Link>

              <Link 
                href="#overview"
                className="group relative px-10 py-5 bg-white border-2 border-gray-300 text-primary font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:border-secondary hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Watch Overview
                </span>
              </Link>
            </motion.div>

            {/* Trust Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t-2 border-gray-200"
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
                  className="group cursor-default"
                >
                  <div className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Advanced Certificate Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative"
          >
            {/* Main Certificate Display */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-2xl border border-gray-200 overflow-hidden">
              {/* Decorative Corner Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-bl-[100px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-[100px]" />

              {/* Certificate Header */}
              <div className="relative flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary via-primary-600 to-secondary rounded-3xl flex items-center justify-center shadow-xl">
                    <div className="absolute inset-0 bg-white/10 rounded-3xl" />
                    <Award className="w-8 h-8 text-white relative z-10" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Certificate ID</div>
                    <div className="text-2xl font-black text-primary">IBMP-2025-0247</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-green-700">Verified</span>
                </div>
              </div>

              {/* Certificate Image with Overlay */}
              <div className="relative h-64 rounded-2xl mb-8 overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
                  alt="Professional Medical Certificate"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent mix-blend-overlay" />
                
                {/* Floating Info Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute bottom-5 left-5 right-5 flex items-center justify-between"
                >
                  <div className="px-4 py-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg">
                    <div className="text-xs font-bold text-gray-900">ISO 9001:2015</div>
                  </div>
                  <div className="px-4 py-2.5 bg-secondary/95 backdrop-blur-sm rounded-xl shadow-lg">
                    <div className="text-xs font-bold text-white">WHO Recognized</div>
                  </div>
                </motion.div>
              </div>

              {/* Certificate Details */}
              <div className="relative space-y-6">
                <div>
                  <h3 className="text-3xl font-black text-primary mb-2">Accreditation Certificate</h3>
                  <p className="text-gray-600 font-medium">International Board of Medical Practitioners</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: Globe, label: 'Global Recognition', value: '120+ Countries', gradient: 'from-secondary to-secondary-700' },
                    { icon: Award, label: 'Validity Period', value: '5 Years', gradient: 'from-accent to-accent-700' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                      className="group flex items-center justify-between py-4 px-5 bg-white border border-gray-200 rounded-2xl hover:border-secondary hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{item.label}</span>
                      </div>
                      <span className="text-sm font-black text-primary">{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Accent Elements */}
            <motion.div
              className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
