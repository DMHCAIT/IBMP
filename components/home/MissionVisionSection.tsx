'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Telescope, Sparkles } from 'lucide-react';
import { useSectionContent } from '@/lib/content-context';
import { LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Target,
  Telescope,
  Sparkles,
};

const iconKeys = ['Target', 'Telescope', 'Sparkles'];

export default function MissionVisionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const content = useSectionContent('missionVision');

  return (
    <section id="mission" ref={ref} className="relative py-32 overflow-hidden">
      {/* Background Design */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(30, 140, 122) 1px, transparent 0)', backgroundSize: '50px 50px' }} />
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-secondary to-transparent" />
            <span className="text-secondary font-bold uppercase tracking-wider text-sm">{content.sectionTag}</span>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-secondary to-transparent" />
          </motion.div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-primary mb-6 tracking-tight">
            {content.title}{' '}
            <span className="bg-gradient-to-r from-secondary to-secondary-600 bg-clip-text text-transparent">
              {content.subtitle}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            Guided by our core principles to advance medical education globally
          </p>
        </motion.div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {content.items.map((item, index) => {
            const IconComponent = iconMap[iconKeys[index]] || Target;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white border-2 border-gray-200 rounded-3xl p-10 hover:border-secondary/50 hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon */}
                <motion.div 
                  className={`relative w-20 h-20 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center mb-8 shadow-xl`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-3xl" />
                  <IconComponent className="w-10 h-10 text-white relative z-10" />
                </motion.div>

                {/* Content */}
                <div className="relative space-y-4">
                  <div>
                    <h3 className="text-3xl font-black text-primary mb-3 group-hover:text-secondary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <div className={`h-1 w-16 bg-gradient-to-r ${item.color} rounded-full`} />
                  </div>
                  <p className="text-sm font-bold text-secondary uppercase tracking-wide">{item.tagline}</p>
                  <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>
                </div>

                {/* Decorative Bottom Line */}
                <motion.div 
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
