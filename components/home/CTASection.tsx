'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Zap, HeadphonesIcon, Trophy, ArrowRight, Mail } from 'lucide-react';
import { useSectionContent } from '@/lib/content-context';
import { LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Zap,
  HeadphonesIcon,
  Trophy,
};

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const content = useSectionContent('cta');

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-br from-primary via-primary-800 to-secondary overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-sm rounded-full mb-8 shadow-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {content.badge}
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {content.title}
          </h2>
          
          <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
            {content.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href={content.primaryButton.href}
              className="group px-10 py-5 bg-white text-primary font-bold text-lg rounded-xl hover:bg-gray-50 transition-all shadow-2xl hover:shadow-white/20 hover:-translate-y-1 flex items-center gap-3"
            >
              {content.primaryButton.text}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={content.secondaryButton.href}
              className="group px-10 py-5 bg-transparent border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-primary transition-all flex items-center gap-3"
            >
              <Mail className="w-5 h-5" />
              {content.secondaryButton.text}
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || Zap;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{feature.title}</h3>
                  <p className="text-white/80 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
