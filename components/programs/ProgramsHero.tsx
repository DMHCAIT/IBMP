'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, GraduationCap, Globe, ArrowRight } from 'lucide-react';

export default function ProgramsHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-24 bg-gradient-to-br from-primary via-primary-800 to-secondary overflow-hidden">
      {/* Background Medical Imagery */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80"
          alt="Medical Education Programs"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-800/90 to-secondary/80" />

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-full mb-6 border border-white/30"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Certification & Fellowship Programs</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6"
          >
            IBMP <span className="bg-gradient-to-r from-accent to-accent-300 bg-clip-text text-transparent">Programs</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-white/90 leading-relaxed mb-6 max-w-4xl mx-auto"
          >
            The International Board of Medical Practitioners (IBMP) offers globally recognized Certification and Fellowship programs designed to advance the clinical expertise, leadership, and professional standing of medical doctors and healthcare practitioners across specialties and super-specialties.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-white/80 leading-relaxed mb-10 max-w-3xl mx-auto"
          >
            Our programs are structured to support lifelong learning, enhance clinical competency, and prepare practitioners to meet evolving global healthcare needs.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              href="#fellowship-categories"
              className="group px-8 py-4 bg-white text-primary font-bold text-lg rounded-xl hover:bg-accent hover:text-white transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Explore Programs
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="group px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
            >
              Enrol Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {[
              { icon: Award, text: "Globally Recognized" },
              { icon: Globe, text: "International Standards" },
              { icon: GraduationCap, text: "Lifelong Learning" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20"
              >
                <item.icon className="w-5 h-5 text-accent" />
                <span className="text-white font-semibold text-sm">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
