'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Microscope, 
  ArrowLeft, 
  CheckCircle,
  GraduationCap,
  Clock,
  Award
} from 'lucide-react';

const superSpecialties = [
  { name: 'Cardiology', description: 'Heart and cardiovascular system disorders' },
  { name: 'Gastroenterology', description: 'Digestive system and gastrointestinal tract' },
  { name: 'Endocrinology & Metabolism', description: 'Hormonal and metabolic disorders' },
  { name: 'Nephrology', description: 'Kidney diseases and renal care' },
  { name: 'Pulmonology / Respiratory Medicine', description: 'Lung and respiratory system disorders' },
  { name: 'Infectious Diseases', description: 'Diagnosis and treatment of infections' },
  { name: 'Rheumatology', description: 'Autoimmune and musculoskeletal diseases' },
  { name: 'Hematology & Oncology', description: 'Blood disorders and cancer treatment' },
  { name: 'Geriatric Medicine', description: 'Healthcare for elderly patients' },
  { name: 'Neonatology', description: 'Care of newborn infants, especially ill or premature' },
  { name: 'Pediatric Cardiology', description: 'Heart conditions in children' },
  { name: 'Pediatric Oncology', description: 'Cancer treatment in children' },
  { name: 'Pediatric Critical Care', description: 'Intensive care for critically ill children' },
  { name: 'Developmental & Behavioral Pediatrics', description: 'Child development and behavioral disorders' },
  { name: 'Thoracic Surgery', description: 'Surgical treatment of chest diseases' },
  { name: 'Pediatric Surgery', description: 'Surgical care for infants and children' },
  { name: 'Trauma & Critical Care Surgery', description: 'Emergency surgical care for injuries' },
  { name: 'Transplant Surgery', description: 'Organ transplantation procedures' },
  { name: 'Hand Surgery', description: 'Surgical treatment of hand and upper extremity' },
  { name: 'Surgical Oncology', description: 'Surgical treatment of cancer' },
  { name: 'Interventional Radiology', description: 'Minimally invasive image-guided procedures' },
  { name: 'Pain Medicine', description: 'Comprehensive pain management and treatment' },
  { name: 'Sleep Medicine', description: 'Sleep disorders diagnosis and treatment' },
  { name: 'Clinical Immunology', description: 'Immune system disorders and diseases' },
  { name: 'Forensic Pathology', description: 'Investigation of sudden or unexpected deaths' },
  { name: 'Sports Medicine', description: 'Athletic injuries and physical fitness' },
  { name: 'Medical Toxicology', description: 'Poisoning and toxic exposure treatment' }
];

export default function SuperSpecialtiesList() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-secondary via-secondary-700 to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&q=80"
            alt="Super-Specialties"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 via-secondary-700/90 to-primary/80" />

        <div className="container-custom relative z-10">
          <Link 
            href="/programs" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Programs
          </Link>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-full mb-6 border border-white/30"
            >
              <Microscope className="w-4 h-4" />
              <span>27 Super-Specialties Available</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6"
            >
              Fellowship in <span className="text-teal-200">Super-Specialties</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-white/90 leading-relaxed"
            >
              Advanced Fellowship programs for practitioners seeking expertise in highly specialized medical fields, representing the pinnacle of clinical excellence and subspecialty mastery.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Clock, label: 'Duration', value: '6-12 Months' },
              { icon: GraduationCap, label: 'Credential', value: 'FIBMP (Super-Specialty)' },
              { icon: Award, label: 'Recognition', value: 'Global' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-lg font-bold text-primary">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Grid */}
      <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Available Super-Specialties
            </h2>
            <p className="text-lg text-gray-600">
              Select a super-specialty to learn more about the advanced Fellowship program requirements and curriculum.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {superSpecialties.map((specialty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.03 * index }}
                className="group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-secondary hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-secondary transition-colors">
                    <CheckCircle className="w-5 h-5 text-secondary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-secondary transition-colors">
                      {specialty.name}
                    </h3>
                    <p className="text-sm text-gray-500">{specialty.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary to-primary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Specialize Further?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Advance your expertise with an IBMP Super-Specialty Fellowship.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-secondary-50 transition-colors shadow-lg"
              >
                Apply Now
              </Link>
              <Link
                href="/programs"
                className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
              >
                View All Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
