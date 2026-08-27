'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Award, 
  ArrowLeft, 
  CheckCircle,
  Star,
  Users,
  Globe,
  Heart,
  BookOpen,
  Trophy
} from 'lucide-react';

const eligibilityCriteria = [
  'Distinguished career in medicine or healthcare spanning 15+ years',
  'Significant contributions to medical research, education, or clinical practice',
  'Leadership roles in healthcare organizations or academic institutions',
  'Published works in peer-reviewed medical journals',
  'Recognition by peers and professional bodies',
  'Commitment to advancing healthcare standards globally'
];

const benefits = [
  {
    icon: Trophy,
    title: 'Prestigious Recognition',
    description: 'Join an elite group of medical professionals recognized for exceptional contributions to healthcare.'
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Connect with distinguished fellows and medical leaders from around the world.'
  },
  {
    icon: Users,
    title: 'Leadership Opportunities',
    description: 'Access to advisory roles, speaking engagements, and collaborative research projects.'
  },
  {
    icon: BookOpen,
    title: 'Academic Contribution',
    description: 'Opportunity to mentor the next generation of medical professionals.'
  }
];

export default function HonoraryFellowshipContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-amber-500 via-amber-600 to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80"
            alt="Honorary Fellowship"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/80 via-amber-600/90 to-primary/80" />

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
              <Award className="w-4 h-4" />
              <span>By Nomination Only</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6"
            >
              Honorary <span className="text-amber-200">Fellowship</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-white/90 leading-relaxed"
            >
              The IBMP Honorary Fellowship is the highest distinction awarded to individuals who have made exceptional contributions to medicine, healthcare leadership, medical education, or humanitarian service in the field of health.
            </motion.p>
          </div>
        </div>
      </section>

      {/* What is Honorary Fellowship */}
      <section ref={ref} className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 bg-amber-50 text-amber-600 font-semibold text-sm rounded-full mb-4">
                About Honorary Fellowship
              </div>
              <h2 className="text-4xl font-bold text-primary mb-6">
                A Symbol of <span className="text-amber-500">Distinguished Achievement</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                The Honorary Fellowship (Hon. FIBMP) is awarded to recognize lifetime achievements and extraordinary contributions to the advancement of medicine and healthcare. This prestigious credential is not earned through examination but through demonstrated excellence over a distinguished career.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Recipients of this honor join an elite community of medical luminaries who have shaped the landscape of healthcare through innovation, leadership, education, or humanitarian service.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">Hon. FIBMP</h3>
                    <p className="text-gray-600">Honorary Fellow of IBMP</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Heart className="w-5 h-5 text-amber-500" />
                    <span>Awarded for exceptional contributions to medicine</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Globe className="w-5 h-5 text-amber-500" />
                    <span>Globally recognized distinction</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Users className="w-5 h-5 text-amber-500" />
                    <span>By nomination and board approval</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-block px-4 py-2 bg-primary-50 text-primary font-semibold text-sm rounded-full mb-4">
              Requirements
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Eligibility Criteria
            </h2>
            <p className="text-lg text-gray-600">
              Candidates for Honorary Fellowship are evaluated based on their career achievements and contributions to the medical field.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {eligibilityCriteria.map((criteria, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="flex items-start gap-4 bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-amber-500 transition-colors"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-gray-700">{criteria}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-800 to-amber-900 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Benefits of Honorary Fellowship
            </h2>
            <p className="text-xl text-white/80">
              As an Honorary Fellow, you gain access to exclusive privileges and opportunities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-white/70">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nomination Process */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-block px-4 py-2 bg-secondary-50 text-secondary font-semibold text-sm rounded-full mb-4">
                How to Apply
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Nomination Process
              </h2>
            </motion.div>

            <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-3xl p-8 md:p-12">
              <div className="space-y-6">
                {[
                  { step: '1', title: 'Nomination Submission', description: 'Candidates must be nominated by an existing IBMP Fellow, medical institution, or professional body.' },
                  { step: '2', title: 'Documentation Review', description: 'The nominee\'s CV, publications, achievements, and supporting letters are reviewed by the IBMP Board.' },
                  { step: '3', title: 'Board Evaluation', description: 'The IBMP Honorary Fellowship Committee evaluates the nomination based on established criteria.' },
                  { step: '4', title: 'Award Ceremony', description: 'Approved candidates are formally inducted as Honorary Fellows at an IBMP ceremony or event.' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-start gap-6"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Know Someone Deserving?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Nominate a distinguished medical professional for the IBMP Honorary Fellowship.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition-colors shadow-lg"
              >
                Submit a Nomination
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
