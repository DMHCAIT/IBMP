'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';

export default function ProgramsCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-12 text-center shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Ready to Advance Your Medical Career?
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Join the global community of IBMP certified practitioners and fellows. Take the first step towards internationally recognized credentials.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#fellowship-categories"
                className="group px-8 py-4 bg-primary text-white font-semibold text-lg rounded-lg hover:bg-primary-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Explore Programs
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group px-8 py-4 bg-secondary text-white font-semibold text-lg rounded-lg hover:bg-secondary-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Enrol Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm mb-3">Have questions about our programs?</p>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 text-secondary font-semibold hover:text-secondary-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact our admissions team
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
