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
    <section id="board" ref={ref} className="py-24 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-2 bg-primary-50 text-primary font-semibold text-sm rounded-full mb-4">
            {content.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {content.title}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 md:p-12 mb-12"
        >
          <h3 className="text-2xl font-bold text-primary mb-6">{content.commitmentTitle}</h3>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {content.commitmentText1}
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            {content.commitmentText2}
          </p>
        </motion.div>

        {/* Professional Board Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative h-[400px] rounded-3xl overflow-hidden mb-12 shadow-2xl"
        >
          <Image
            src={content.imageUrl}
            alt={content.imageAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-4 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl max-w-fit">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-600 rounded-2xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-black text-primary">{content.overlayTitle}</div>
                <div className="text-xs text-gray-600">{content.overlaySubtitle}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Board Expertise Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.expertiseAreas.map((area, index) => {
            const IconComponent = iconMap[area.icon] || Building2;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-secondary hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${area.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-lg font-black text-primary mb-2">{area.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{area.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
