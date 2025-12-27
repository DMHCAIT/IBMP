'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Stethoscope, 
  ArrowLeft, 
  CheckCircle,
  GraduationCap,
  Clock,
  Award
} from 'lucide-react';

const medicalSpecialties = [
  { name: 'Internal Medicine', description: 'Comprehensive care for adult diseases and complex medical conditions' },
  { name: 'Family Medicine / General Practice', description: 'Primary care across all ages, genders, and disease types' },
  { name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents' },
  { name: 'Emergency Medicine', description: 'Acute care for patients with urgent medical conditions' },
  { name: 'Psychiatry', description: 'Diagnosis and treatment of mental health disorders' },
  { name: 'Neurology', description: 'Disorders of the nervous system including brain and spinal cord' },
  { name: 'Radiology / Diagnostic Radiology', description: 'Medical imaging for diagnosis and treatment guidance' },
  { name: 'Anesthesiology / Anaesthesia', description: 'Perioperative care and pain management' },
  { name: 'Pathology', description: 'Laboratory analysis of tissues and bodily fluids' },
  { name: 'Preventive Medicine / Public Health', description: 'Disease prevention and population health management' },
  { name: 'General Surgery', description: 'Operative procedures on the abdomen and soft tissues' },
  { name: 'Orthopedic Surgery', description: 'Musculoskeletal system disorders and injuries' },
  { name: 'Cardiothoracic Surgery', description: 'Surgical treatment of heart and chest conditions' },
  { name: 'Neurosurgery', description: 'Surgical treatment of nervous system disorders' },
  { name: 'Urology', description: 'Urinary tract and male reproductive system conditions' },
  { name: 'Plastic & Reconstructive Surgery', description: 'Reconstruction and aesthetic surgical procedures' },
  { name: 'Otolaryngology (ENT)', description: 'Ear, nose, throat, and related structures' },
  { name: 'Ophthalmology', description: 'Eye and vision care including surgery' },
  { name: 'Vascular Surgery', description: 'Disorders of the circulatory system' },
  { name: 'Colorectal Surgery', description: 'Colon, rectum, and anal canal surgical treatment' },
  { name: 'Obstetrics & Gynecology (OB-GYN)', description: 'Women\'s reproductive health and childbirth' },
  { name: 'Dermatology', description: 'Skin, hair, and nail conditions' },
  { name: 'Allergy & Immunology', description: 'Allergic diseases and immune system disorders' },
  { name: 'Medical Genetics', description: 'Genetic disorders diagnosis and counseling' },
  { name: 'Nuclear Medicine', description: 'Radioactive substances for diagnosis and treatment' },
  { name: 'Physical Medicine & Rehabilitation', description: 'Functional restoration and disability management' },
  { name: 'Occupational & Environmental Medicine', description: 'Workplace and environmental health conditions' }
];

export default function MedicalSpecialtiesList() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&q=80"
            alt="Medical Specialties"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-blue-700/90 to-primary/80" />

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
              <Stethoscope className="w-4 h-4" />
              <span>27 Specialties Available</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6"
            >
              Fellowship in <span className="text-blue-200">Medical Specialties</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-white/90 leading-relaxed"
            >
              IBMP offers Fellowship programs across core medical specialties, recognizing practitioners who demonstrate advanced expertise and commitment to excellence in their field.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Clock, label: 'Duration', value: '3-12 Months' },
              { icon: GraduationCap, label: 'Credential', value: 'FIBMP' },
              { icon: Award, label: 'Recognition', value: 'Global' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-blue-600" />
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
              Available Medical Specialties
            </h2>
            <p className="text-lg text-gray-600">
              Select a specialty to learn more about the Fellowship program requirements and curriculum.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {medicalSpecialties.map((specialty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.03 * index }}
                className="group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                    <CheckCircle className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-blue-600 transition-colors">
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
      <section className="py-16 bg-gradient-to-r from-blue-600 to-primary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Apply for Fellowship?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Take the next step in your medical career with an IBMP Fellowship.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
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
