'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { 
  Stethoscope,
  Microscope,
  Award,
  ArrowRight
} from 'lucide-react';

const categories = [
  {
    id: 'medical-specialties',
    title: 'Fellowship in Medical Specialties',
    description: 'Core medical specialties including internal medicine, surgery, pediatrics, and 24 more specialty areas.',
    icon: Stethoscope,
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    count: 27,
    href: '/programs/medical-specialties'
  },
  {
    id: 'super-specialties',
    title: 'Fellowship in Super-Specialties',
    description: 'Advanced subspecialties like cardiology, gastroenterology, oncology, and 24 more specialized fields.',
    icon: Microscope,
    gradient: 'from-secondary to-secondary-600',
    bgGradient: 'from-teal-50 to-teal-100',
    count: 27,
    href: '/programs/super-specialties'
  },
  {
    id: 'honorary-fellowship',
    title: 'Honorary Fellowship',
    description: 'Prestigious recognition awarded for exceptional contributions to medicine, healthcare leadership, and medical education.',
    icon: Award,
    gradient: 'from-amber-500 to-amber-600',
    bgGradient: 'from-amber-50 to-amber-100',
    count: null,
    href: '/programs/honorary-fellowship'
  }
];

export default function FellowshipCategories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="fellowship-categories" ref={ref} className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-2 bg-primary-50 text-primary font-semibold text-sm rounded-full mb-4">
            Fellowship Categories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Explore Our <span className="text-secondary">Specialties</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Choose from a comprehensive range of medical specialties and super-specialties for your Fellowship program.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Link href={category.href} className="block group h-full">
                <div className={`bg-gradient-to-br ${category.bgGradient} border-2 border-transparent rounded-3xl p-8 h-full hover:border-secondary hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                    {category.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {category.description}
                  </p>

                  {/* Count Badge & Arrow */}
                  <div className="flex items-center justify-between">
                    {category.count ? (
                      <span className="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-700 shadow-sm">
                        {category.count} Specialties
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-semibold text-amber-600 shadow-sm">
                        By Nomination
                      </span>
                    )}
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-secondary group-hover:text-white transition-all">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
