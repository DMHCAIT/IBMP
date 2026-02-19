'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  FileText, 
  Search, 
  ClipboardCheck, 
  Award, 
  Globe,
  CheckCircle,
  GraduationCap,
  Briefcase
} from 'lucide-react';

export default function EligibilityProcess() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const eligibilityRequirements = [
    'Recognized medical degree (MD/MBBS or equivalent)',
    'Valid professional registration or license',
    'Specialty-level training or clinical experience',
    'Completion of required assessments or portfolio review'
  ];

  const applicationSteps = [
    { number: '1', title: 'Submit Application & Credentials', icon: FileText },
    { number: '2', title: 'Document Review & Eligibility Verification', icon: Search },
    { number: '3', title: 'Assessment / Portfolio Evaluation', icon: ClipboardCheck },
    { number: '4', title: 'Certification or Fellowship Award', icon: Award },
    { number: '5', title: 'Digital Credential Issuance & Global Registry Listing', icon: Globe }
  ];

  const whyChooseReasons = [
    'Globally recognized credentials',
    'Career advancement in clinical, academic, and leadership roles',
    'Validation of advanced clinical competence',
    'Strengthened professional credibility',
    'Connection to an international network of practitioners',
    'Commitment to lifelong learning and healthcare excellence'
  ];

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="container-custom">
        {/* Eligibility Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-secondary-50 text-secondary font-semibold text-sm rounded-full mb-4">
                Requirements
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Eligibility <span className="text-secondary">Requirements</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Eligibility criteria vary by program but generally include:
              </p>
              
              <div className="space-y-4">
                {eligibilityRequirements.map((req, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{req}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8">
              <GraduationCap className="w-16 h-16 text-primary mb-6" />
              <h3 className="text-2xl font-bold text-primary mb-4">Who Can Apply?</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Medical doctors and healthcare practitioners with recognized qualifications and relevant clinical experience are welcome to apply for IBMP Certification and Fellowship programs.
              </p>
              <div className="flex items-center gap-3 text-secondary font-semibold">
                <Briefcase className="w-5 h-5" />
                <span>All medical specialties and super-specialties</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Application Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-4 py-2 bg-primary-50 text-primary font-semibold text-sm rounded-full mb-4">
              How to Apply
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Application <span className="text-secondary">Process</span>
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connection Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent hidden lg:block transform -translate-x-1/2" />

            <div className="space-y-8">
              {applicationSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className={`bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-secondary hover:shadow-lg transition-all inline-block ${index % 2 === 0 ? 'lg:ml-auto' : 'lg:mr-auto'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                          <step.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-secondary font-semibold mb-1">Step {step.number}</div>
                          <h3 className="text-lg font-bold text-primary">{step.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden lg:flex w-16 h-16 bg-white border-4 border-secondary rounded-full items-center justify-center text-2xl font-black text-secondary shadow-lg z-10">
                    {step.number}
                  </div>
                  
                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Why Choose IBMP */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gradient-to-br from-gray-900 via-primary to-secondary rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose IBMP Certification or Fellowship?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChooseReasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-5"
                >
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-white/90 font-medium">{reason}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
