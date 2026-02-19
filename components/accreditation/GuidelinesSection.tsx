'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Building2, 
  BookOpen, 
  FileText, 
  ClipboardCheck, 
  Shield, 
  Award,
  Clock,
  Users,
  GraduationCap,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function GuidelinesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="container-custom">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-primary-50 text-primary font-semibold text-sm rounded-full mb-4">
            Accreditation Guidelines
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Ensuring Excellence in Medical Education
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            The IBMP accreditation process ensures that medical education providers maintain high academic and professional standards in line with international best practices. Accreditation confirms the quality, integrity, and relevance of educational programs offered under the IBMP framework.
          </p>
        </motion.div>

        {/* Eligibility Criteria */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-primary">Accreditation Eligibility Criteria</h3>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Educational institutions, training organizations, hospitals, and medical academies may apply if they meet the following requirements:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Organizational Requirements */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-secondary" />
                  <h4 className="text-xl font-bold text-primary">Organizational Requirements</h4>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Legally registered educational or training entity in their jurisdiction.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Clearly defined governance structure and academic leadership.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Documented quality assurance and continuous improvement processes.</span>
                  </li>
                </ul>
              </div>

              {/* Program Requirements */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-secondary" />
                  <h4 className="text-xl font-bold text-primary">Program Requirements</h4>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Courses must be medically relevant, evidence-based, and compliant with recognized clinical and educational standards.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Courses should fall within the scope of continuing medical education (CME) or professional development.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Course duration must be between 3 to 12 months.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Applicant must submit 5–10 courses for review during accreditation.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Application Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-primary">Accreditation Application Process</h3>
          </div>

          {/* Submission Requirements */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <h4 className="text-2xl font-bold text-primary mb-6">Submission Requirements</h4>
            <p className="text-gray-600 mb-6">Applicants must submit:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                'Organizational profile',
                'Academic leadership CVs',
                'Course syllabi (5–10 courses)',
                'Learning outcomes & assessment methods',
                'Faculty qualifications',
                'Infrastructure & learning resources documentation',
                'Quality assurance and evaluation methods',
                'Sample educational materials',
                'Evidence of ethical and professional standards'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Stages */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <h4 className="text-2xl font-bold mb-8">Review Stages</h4>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  stage: '1',
                  title: 'Preliminary Screening',
                  description: 'Confirmation of eligibility and document completeness.'
                },
                {
                  stage: '2',
                  title: 'Academic Review',
                  description: 'Detailed evaluation of curriculum, faculty, assessment methodology, and clinical/educational rigor.'
                },
                {
                  stage: '3',
                  title: 'Compliance Verification',
                  description: 'Ensures alignment with IBMP standards in ethics, learner safety, scientific accuracy, and professionalism.'
                },
                {
                  stage: '4',
                  title: 'Final Decision',
                  description: 'Granted, Deferred, or Denied.'
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold">{item.stage}</span>
                  </div>
                  <h5 className="text-lg font-bold mb-2">{item.title}</h5>
                  <p className="text-white/80 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Accreditation Duration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-8 h-8 text-secondary" />
                <h4 className="text-2xl font-bold text-primary">Accreditation Duration</h4>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Accreditation is valid for a <strong>3-year term</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Institutions must maintain compliance during all three years.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Mid-term review may be conducted if deemed necessary.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-secondary" />
                <h4 className="text-2xl font-bold text-primary">Use of IBMP Logo and Credentials</h4>
              </div>
              <p className="text-gray-600 mb-4">Accredited organizations may use:</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">IBMP Accreditation Seal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">IBMP Certified Provider Logo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">Mention of accreditation status in marketing materials</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Logo Usage Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-16"
        >
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
              <h4 className="text-2xl font-bold text-primary">Conditions for Logo Use</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Logo may only be used for the specific 5–10 accredited courses.',
                'Individual courses must display the approved credentialing statement.',
                'Logo must not imply endorsement of non-accredited programs.',
                'Unauthorized or misleading use will result in warnings or revocation of accreditation.'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 bg-white rounded-xl p-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Course Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-primary">Course Requirements for Accredited Programs</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-6 border border-primary-100">
              <Clock className="w-10 h-10 text-primary mb-4" />
              <h4 className="text-xl font-bold text-primary mb-3">Course Duration</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Each course must fall within 3 to 12 months.
                </li>
                <li className="flex items-start gap-2 text-gray-600 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Courses should have clear modules, timelines, and completion criteria.
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-white rounded-2xl p-6 border border-secondary-100">
              <BookOpen className="w-10 h-10 text-secondary mb-4" />
              <h4 className="text-xl font-bold text-primary mb-3">Curriculum Structure</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Evidence-based content
                </li>
                <li className="flex items-start gap-2 text-gray-600 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Learning objectives aligned with IBMP competency standards
                </li>
                <li className="flex items-start gap-2 text-gray-600 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Practical, theoretical, or blended learning approaches
                </li>
                <li className="flex items-start gap-2 text-gray-600 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Mandatory assessment and measurable outcomes
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-white rounded-2xl p-6 border border-accent-100">
              <Users className="w-10 h-10 text-accent-600 mb-4" />
              <h4 className="text-xl font-bold text-primary mb-3">Faculty Qualifications</h4>
              <p className="text-gray-600 text-sm">
                Courses must be taught by licensed medical practitioners, specialists, or recognized experts in their respective fields.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Ongoing Responsibilities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-gray-900 to-primary rounded-3xl p-8 md:p-12 text-white">
            <div className="flex items-center gap-3 mb-8">
              <ClipboardCheck className="w-10 h-10" />
              <h3 className="text-3xl font-bold">Ongoing Responsibilities of Accredited Institutions</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Annual activity report to IBMP',
                'Notification of major changes to course structure or faculty',
                'Compliance with ethical, academic, and professional standards',
                'Allow IBMP to conduct monitoring or audits if required'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                  <span className="text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Renewal Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <RefreshCw className="w-8 h-8 text-green-600" />
                <h4 className="text-2xl font-bold text-primary">Renewal of Accreditation</h4>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Renewal required every <strong>3 years</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Renewal applicants must submit updated course materials, outcomes, faculty updates, and quality assurance records.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Renewal is based on demonstrated performance and adherence to IBMP standards.</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-red-600" />
                <h4 className="text-2xl font-bold text-primary">Grounds for Suspension or Revocation</h4>
              </div>
              <p className="text-gray-600 mb-4">Accreditation may be suspended or withdrawn for:</p>
              <ul className="space-y-3">
                {[
                  'Misuse of IBMP logo or credentials',
                  'Significant deviation from approved curriculum',
                  'Violation of ethical or professional standards',
                  'Providing fraudulent documentation',
                  'Non-compliance with monitoring requirements'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
