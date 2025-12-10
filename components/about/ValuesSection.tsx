'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function ValuesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      icon: '🎯',
      title: 'Commitment to Ethical Governance',
      description:
        'We uphold the highest standards of integrity, transparency, and accountability in all our accreditation processes and organizational operations.',
    },
    {
      icon: '🌏',
      title: 'Global Perspective on Healthcare Quality',
      description:
        'We recognize and promote diverse healthcare practices while maintaining universal standards of excellence that transcend geographical boundaries.',
    },
    {
      icon: '📊',
      title: 'Evidence-Based Decision-Making',
      description:
        'Our accreditation criteria and processes are grounded in rigorous research, data-driven insights, and proven best practices in medical education.',
    },
    {
      icon: '🚀',
      title: 'Continuous Advancement of Medical Education',
      description:
        'We foster innovation and evolution in medical training, encouraging programs to adopt cutting-edge methodologies and emerging healthcare technologies.',
    },
    {
      icon: '🔒',
      title: 'Transparency and Accountability',
      description:
        'We maintain open communication with all stakeholders and hold ourselves accountable to the medical community, accredited institutions, and the public we serve.',
    },
  ];

  return (
    <section id="values" ref={ref} className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-2 bg-accent-50 text-accent-600 font-semibold text-sm rounded-full mb-4">
            Our Principles
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Board Values
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            The core principles that guide our mission to elevate global medical education standards
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-secondary hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">{value.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
