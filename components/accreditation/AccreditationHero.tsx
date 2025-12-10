'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Award, CheckCircle, Shield } from 'lucide-react';

export default function AccreditationHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-24 bg-gradient-to-br from-primary via-primary-800 to-secondary overflow-hidden">
      {/* Background Medical Imagery */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1920&q=80"
          alt="Medical Education Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-800/90 to-secondary/80" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-full mb-6 border border-white/30"
          >
            <Award className="w-4 h-4" />
            <span>Accreditation Services</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6"
          >
            Get Your Medical Program <span className="bg-gradient-to-r from-accent to-accent-300 bg-clip-text text-transparent">Accredited</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-white/90 leading-relaxed mb-12"
          >
            Join the ranks of globally recognized medical education providers. Our accreditation ensures your programs meet the highest international standards of quality, credibility, and excellence.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {[
              { icon: CheckCircle, text: 'ISO 9001:2015 Certified' },
              { icon: Shield, text: 'WHO Recognized Standards' },
              { icon: Award, text: '500+ Programs Accredited' },
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
