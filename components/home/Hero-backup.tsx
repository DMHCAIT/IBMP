'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Award, Shield, Globe, CheckCircle2, ArrowRight, PlayCircle, Star, TrendingUp, Users2, Building2, BadgeCheck } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sophisticated Background */}
      <div className="absolute inset-0">
        {/* Animated Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-teal-100/40 via-transparent to-transparent" />
        
        {/* Dynamic Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        
        {/* Floating Particles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-secondary rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-accent-400 rounded-full"
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-primary rounded-full"
          animate={{ y: [0, -15, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>
      
      {/* Premium Floating Badges */}
      <motion.div
        className="absolute top-24 right-8 md:right-20 bg-white/90 backdrop-blur-lg border-2 border-white/60 rounded-3xl p-5 shadow-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1, duration: 0.8 }}
        whileHover={{ scale: 1.05, rotate: 2 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 bg-gradient-to-br from-secondary via-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="absolute inset-0 bg-white/20 rounded-2xl" />
            <BadgeCheck className="w-6 h-6 text-white relative z-10" />
          </div>
          <div className="text-left">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">ISO Certified</div>
            <div className="text-base font-bold text-primary">9001:2015</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 md:bottom-40 left-8 md:left-20 bg-white/90 backdrop-blur-lg border-2 border-white/60 rounded-3xl p-5 shadow-2xl"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 1.2, duration: 0.8 }}
        whileHover={{ scale: 1.05, rotate: -2 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 bg-gradient-to-br from-accent via-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="absolute inset-0 bg-white/20 rounded-2xl" />
            <Award className="w-6 h-6 text-white relative z-10" />
          </div>
          <div className="text-left">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Established</div>
            <div className="text-base font-bold text-primary">Since 2000</div>
          </div>
        </div>
      </motion.div>

      {/* Trust Badges Strip */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-6 bg-white/80 backdrop-blur-lg border border-gray-200/60 rounded-full px-8 py-4 shadow-xl"
        initial={{ opacity: 0, y: -30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {[
          { icon: Building2, label: 'WHO Recognized', color: 'text-blue-600' },
          { icon: Globe, label: '120+ Countries', color: 'text-secondary' },
          { icon: Users2, label: '50,000+ Doctors', color: 'text-purple-600' },
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="text-sm font-semibold text-gray-700">{item.label}</span>
            {index < 2 && <div className="w-px h-6 bg-gray-300 ml-6" />}
          </div>
        ))}
      </motion.div>

      <div className="container-custom relative z-10 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            {/* Left Content */}
            <div className="text-left space-y-8">
              {/* Professional Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-green-500/30 rounded-full shadow-lg shadow-green-500/10"
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <Star className="w-4 h-4 text-accent-600 fill-accent-400" />
                <span className="text-gray-700 text-sm font-bold tracking-wide">
                  Internationally Recognized Since 2000
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-primary mb-4 leading-[1.05] tracking-tight">
                  International Board of{' '}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-secondary via-secondary-500 to-teal-600 bg-clip-text text-transparent">
                      Medical Practitioners
                    </span>
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-secondary/60 via-secondary to-teal-600/60 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : {}}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    />
                  </span>
                </h1>
              </motion.div>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl"
              >
                Setting the <span className="font-semibold text-primary">global standard</span> for medical education accreditation. Trusted by healthcare institutions in over <span className="font-semibold text-secondary">120 countries</span> worldwide.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
                <Link
                  href="/accreditation"
                  className="group relative px-10 py-5 bg-gradient-to-r from-primary via-primary-600 to-primary-700 text-white font-bold text-lg rounded-2xl transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 shadow-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-3">
                    Apply for Accreditation
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/programs"
                  className="group px-10 py-5 bg-white border-2 border-gray-300 text-gray-700 font-bold text-lg rounded-2xl transition-all hover:border-secondary hover:text-secondary hover:shadow-xl hover:-translate-y-1 flex items-center gap-3"
                >
                  <div className="relative w-10 h-10 bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-5 h-5 text-secondary" />
                  </div>
                  Watch Overview
                </Link>
              </motion.div>

              {/* Trust Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="pt-8 border-t border-gray-200"
              >
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { value: '50,000+', label: 'Certified Professionals', icon: Users2 },
                    { value: '120+', label: 'Countries Worldwide', icon: Globe },
                    { value: '25+', label: 'Years of Excellence', icon: TrendingUp },
                  ].map((stat, index) => (
                    <div key={index} className="text-left group cursor-pointer">
                      <stat.icon className="w-6 h-6 text-secondary mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent mb-1">{stat.value}</div>
                      <div className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Content - Professional Medical Imagery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 50 }}
              animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                {/* Main Professional Certificate Card */}
                <div className="relative bg-gradient-to-br from-white via-white to-gray-50 border-2 border-gray-200/80 rounded-3xl p-10 shadow-2xl overflow-hidden">
                  {/* Decorative Background Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(30,140,122,0.05)_0%,transparent_50%)]" />
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-3xl" />
                  
                  {/* Header with Logo */}
                  <div className="relative flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 bg-gradient-to-br from-primary via-primary-600 to-secondary rounded-3xl flex items-center justify-center shadow-xl">
                        <div className="absolute inset-0 bg-white/20 rounded-3xl" />
                        <Award className="w-8 h-8 text-white relative z-10" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Certificate ID</div>
                        <div className="text-lg font-black text-primary">IBMP-2025-0247</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mb-1" />
                      <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Verified</span>
                    </div>
                  </div>
                  
                  {/* Professional Medical Certificate Image */}
                  <div className="relative h-52 bg-gradient-to-br from-blue-50 via-white to-teal-50 rounded-2xl mb-8 overflow-hidden border-2 border-gray-200 shadow-inner">
                    <Image
                      src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
                      alt="Professional Medical Accreditation Certificate"
                      fill
                      className="object-cover opacity-90"
                      priority
                    />
                    {/* Overlay Badge */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                        <BadgeCheck className="w-6 h-6 text-secondary" />
                        <div>
                          <div className="text-xs font-bold text-gray-900">ISO Certified</div>
                          <div className="text-xs text-gray-600">Since 2000</div>
                        </div>
                      </div>
                      <div className="bg-accent/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                        <div className="text-xs font-black text-white">WHO Recognized</div>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="relative">
                    <h3 className="text-3xl font-black text-primary mb-2">Accreditation Certificate</h3>
                    <p className="text-gray-600 font-medium mb-6">International Board of Medical Practitioners</p>

                    <div className="space-y-4 mb-6">
                      {[
                        { icon: Shield, label: 'WHO Compliant Standards', value: 'ISO 9001:2015', color: 'from-blue-500 to-blue-600' },
                        { icon: Globe, label: 'Global Recognition', value: '120+ Countries', color: 'from-secondary to-secondary-600' },
                        { icon: Award, label: 'Validity Period', value: '5 Years', color: 'from-accent to-accent-600' },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="group flex items-center justify-between py-4 px-4 bg-gradient-to-r from-gray-50 to-transparent rounded-2xl hover:from-gray-100 transition-all border border-transparent hover:border-gray-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                              <item.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">{item.label}</span>
                          </div>
                          <span className="text-sm font-black text-primary">{item.value}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-2xl">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-bold text-green-700">Verified & Authenticated by IBMP</span>
                    </div>
                  </div>
                </div>

                {/* Floating Achievement Badges */}
                <motion.div
                  className="absolute -top-8 -right-8 bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-2xl"
                  animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="text-center">
                    <div className="text-5xl font-black bg-gradient-to-r from-secondary to-secondary-600 bg-clip-text text-transparent mb-1">98%</div>
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Success Rate</div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-8 -left-8 bg-gradient-to-br from-accent via-accent-500 to-accent-600 border-2 border-accent-700 rounded-3xl p-6 shadow-2xl"
                  animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                  <div className="text-center text-white">
                    <div className="text-5xl font-black mb-1">24/7</div>
                    <div className="text-xs font-bold uppercase tracking-wide">Expert Support</div>
                  </div>
                </motion.div>

                {/* Rating Badge */}
                <motion.div
                  className="absolute top-1/3 -left-6 bg-white border-2 border-yellow-400 rounded-2xl p-4 shadow-xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    <div>
                      <div className="text-2xl font-black text-gray-900">4.9</div>
                      <div className="text-xs text-gray-600 font-semibold">Rating</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Professional Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.4 }}
      >
        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Explore More</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-8 h-12 border-2 border-gray-300 rounded-full flex justify-center pt-2 bg-white/50 backdrop-blur-sm"
        >
          <motion.div
            animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 bg-gradient-to-b from-secondary to-secondary-600 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
