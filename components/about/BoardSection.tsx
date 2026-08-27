'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Building2, GraduationCap, Globe2, Scale } from 'lucide-react';
import { useSectionContent } from '@/lib/content-context';
import { LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Building2,
  GraduationCap,
  Globe2,
  Scale,
};

export default function BoardSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const content = useSectionContent('board');

  return (
    <section id="board" ref={ref} className="py-12 md:py-16 bg-gradient-to-br from-slate-50 via-white to-primary-50 relative overflow-hidden">
      {/* Background Accent Elements */}
      <div className="absolute top-1/3 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-secondary/8 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 px-4 sm:px-0"
        >
          <div className="inline-block px-5 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 font-bold text-xs sm:text-sm rounded-full mb-6 sm:mb-8 shadow-md border-2 border-primary-200">
            {content.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-primary mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
            {content.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed font-medium max-w-2xl mx-auto px-2 sm:px-0">
            {content.description}
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center mb-12 sm:mb-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[260px] sm:h-[340px] md:h-[420px] rounded-3xl overflow-hidden shadow-lg sm:shadow-xl border border-primary/10">
              <Image
                src={content.imageUrl}
                alt={content.imageAlt}
                fill
                className="object-cover object-center"
                quality={95}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/10" />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-3xl blur-2xl" />
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="px-4 sm:px-0"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary mb-3 sm:mb-4 leading-tight">{content.commitmentTitle}</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 font-medium">
              {content.commitmentText1}
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6 sm:mb-8">
              {content.commitmentText2}
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                  <Building2 className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Expertise</p>
                <p className="text-xl sm:text-2xl font-black text-primary">Global</p>
              </div>
              <div className="bg-gradient-to-br from-secondary/5 to-accent/5 border border-secondary/20 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-secondary to-secondary-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                  <GraduationCap className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Excellence</p>
                <p className="text-xl sm:text-2xl font-black text-secondary">Assured</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Board Expertise Areas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {content.expertiseAreas.map((area, index) => {
              const IconComponent = iconMap[area.icon] || Building2;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-secondary hover:shadow-2xl transition-all hover:-translate-y-2 shadow-sm"
                >
                  <div className={`w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br ${area.gradient} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <IconComponent className="w-7 sm:w-8 h-7 sm:h-8 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">{area.title}</h4>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{area.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
