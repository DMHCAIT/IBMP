'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Award, 
  CheckCircle, 
  TrendingUp, 
  Shield, 
  Users, 
  Star,
  BookOpen,
  Globe
} from 'lucide-react';

export default function CertificationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const certificationBenefits = [
    'Recognition of advanced expertise',
    'Career progression opportunities',
    'Validation of clinical competencies',
    'Enhanced credibility with employers, institutions, and patients',
    'Alignment with international medical education standards'
  ];

  const fellowshipRepresents = [
    'A symbol of distinguished professional achievement',
    'Commitment to the highest standards of medical practice',
    'Recognition of advanced academic, clinical, or research contributions',
    'Eligibility for global collaborations and leadership roles'
  ];

  const fellowshipCategories = [
    { name: 'Fellowship in Medical Specialties', icon: Award },
    { name: 'Fellowship in Super-Specialties', icon: Star },
    { name: 'Honorary Fellowship', icon: Shield }
  ];

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="container-custom">
        {/* Certification Programs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-primary-50 text-primary font-semibold text-sm rounded-full mb-4">
                IBMP Certification Programs
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Validate Your <span className="text-secondary">Expertise</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Our certification programs validate a practitioner&apos;s knowledge, skills, and clinical competence in a specific medical specialty or area of advanced practice.
              </p>
              
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-secondary" />
                  Certification Provides:
                </h3>
                <ul className="space-y-3">
                  {certificationBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 text-white">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent rounded-2xl flex items-center justify-center shadow-xl">
                  <Award className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Career Advancement</h3>
                <p className="text-white/90 mb-6">
                  IBMP Certification opens doors to new opportunities in clinical practice, academia, and healthcare leadership.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: TrendingUp, label: 'Career Growth' },
                    { icon: Globe, label: 'Global Recognition' },
                    { icon: Users, label: 'Network Access' },
                    { icon: BookOpen, label: 'Lifelong Learning' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <item.icon className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fellowship Programs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-4 py-2 bg-secondary-50 text-secondary font-semibold text-sm rounded-full mb-4">
              IBMP Fellowship Programs
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Prestigious <span className="text-secondary">Postgraduate Credentials</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              IBMP Fellowships are prestigious postgraduate credentials awarded to practitioners who demonstrate advanced mastery, clinical leadership, and ongoing commitment to professional excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* What Fellowship Represents */}
            <div className="bg-gradient-to-br from-gray-900 to-primary rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Star className="w-8 h-8 text-accent" />
                What Fellowship Represents
              </h3>
              <ul className="space-y-4">
                {fellowshipRepresents.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fellowship Categories */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">Fellowship Categories</h3>
              <div className="space-y-4">
                {fellowshipCategories.map((category, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-secondary hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-600 rounded-xl flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-primary">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
