'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Users, Globe, BookOpen, Award, ArrowRight } from 'lucide-react';

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { value: '50,000+', label: 'Certified Professionals', Icon: Users, color: 'from-blue-500 to-blue-600' },
    { value: '120+', label: 'Countries Worldwide', Icon: Globe, color: 'from-secondary to-secondary-600' },
    { value: '500+', label: 'Accredited Programs', Icon: BookOpen, color: 'from-purple-500 to-purple-600' },
    { value: '25+', label: 'Years of Excellence', Icon: Award, color: 'from-accent to-accent-600' },
  ];

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-primary-50 text-primary font-semibold text-sm rounded-full mb-4">
              Global Impact
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Trusted Worldwide by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Our globally recognized accreditations ensure excellence, credibility, and international standards in medical education. Join thousands of healthcare practitioners who trust IBMP for their professional development.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-600 text-white font-semibold text-lg rounded-xl hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all shadow-lg group"
            >
              Learn More About Us
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white border-2 border-gray-200 rounded-3xl p-8 hover:shadow-2xl hover:border-transparent transition-all duration-500 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`relative w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <stat.Icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent mb-2 relative">{stat.value}</div>
                
                {/* Label */}
                <div className="text-gray-600 font-semibold relative">{stat.label}</div>

                {/* Decorative Corner */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 blur-3xl transition-all duration-500`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
