'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  CheckCircle,
  Award,
  Crown,
  ChevronDown,
  FileText,
  Users,
  Lightbulb
} from 'lucide-react';

const fellowshipCategories = [
  {
    id: 'surgery',
    title: 'Honorary Fellowship in Surgery',
    subtitle: 'Recognition for exceptional contributions to surgical care and the surgical profession.',
    description: 'This distinction honours surgeons whose careers demonstrate meaningful advances in surgical practice, patient safety, clinical leadership, education, research, or access to surgical services. Nominees may have made their contribution through a surgical specialty, multidisciplinary care, mentorship, or the development of services that benefit patients and practitioners.',
    contributions: [
      'Improvements in surgical quality, safety, or patient outcomes.',
      'Leadership in establishing or strengthening surgical services.',
      'Surgical teaching, mentorship, and workforce development.',
      'Research, innovation, or evidence-based improvements in practice.',
      'Service that expands access to surgical care.'
    ],
    eligibility: 'Experienced, appropriately qualified and registered surgeons with a distinguished professional record, ordinarily spanning at least 15 years.',
    recognition: 'Awarded in recognition of distinguished contributions to surgical practice, education, leadership, and patient care.'
  },
  {
    id: 'medicine',
    title: 'Honorary Fellowship in Medicine',
    subtitle: 'Recognition for exceptional contributions to clinical medicine and healthcare.',
    description: 'This distinction honours physicians whose sustained work has improved medical care, professional education, healthcare delivery, or the health of communities. IBMP considers the significance of a nominee\'s achievements alongside the quality of their leadership, service, and professional conduct.',
    contributions: [
      'Improvements in clinical care, patient outcomes, or care pathways.',
      'Leadership in healthcare services or multidisciplinary programs.',
      'Medical education, mentorship, and professional development.',
      'Public health initiatives or improved access to care.',
      'Development and application of evidence-based practice.'
    ],
    eligibility: 'Experienced, appropriately qualified and registered physicians with a distinguished professional record, ordinarily spanning at least 15 years.',
    recognition: 'Awarded in recognition of distinguished contributions to medicine, medical education, healthcare leadership, and service to patients and communities.'
  },
  {
    id: 'research',
    title: 'Honorary Fellowship in Medical Research',
    subtitle: 'Recognition for research that advances medical knowledge and healthcare practice.',
    description: 'This distinction honours individuals whose sustained research contribution has improved understanding of health and disease, informed clinical practice or health policy, or strengthened research capacity. Relevant work may include clinical, translational, epidemiological, public health, and health systems research.',
    contributions: [
      'Original research with demonstrated scientific or practical value.',
      'Evidence that has informed healthcare practice, programs, or policy.',
      'Research leadership and multidisciplinary collaboration.',
      'Development of research methods, tools, or infrastructure.',
      'Mentorship and contributions to research ethics and quality.'
    ],
    eligibility: 'Established medical researchers with a substantial, verifiable record of contribution, ordinarily spanning at least 15 years.',
    recognition: 'Awarded in recognition of distinguished contributions to medical research and the advancement of evidence-based healthcare.'
  }
];

const nominationSteps = [
  {
    step: 1,
    title: 'Submit a nomination',
    description: 'An existing IBMP Fellow or institution nominates a distinguished colleague and selects the most relevant fellowship category.'
  },
  {
    step: 2,
    title: 'Provide supporting evidence',
    description: 'The nominator submits the candidate\'s professional profile, qualifications, career history, statement of contribution, and evidence of impact. IBMP may request references or additional documentation.'
  },
  {
    step: 3,
    title: 'Verify eligibility',
    description: 'IBMP reviews the submission for completeness and verifies key professional credentials and claims relevant to the nomination.'
  },
  {
    step: 4,
    title: 'Evaluate the contribution',
    description: 'Relevant reviewers assess the significance, duration, and documented outcomes of the nominee\'s work. Any conflicts of interest should be declared and managed.'
  },
  {
    step: 5,
    title: 'IBMP Board decision',
    description: 'The IBMP Board considers the review findings and makes the final award decision.'
  },
  {
    step: 6,
    title: 'Notify and recognise the recipient',
    description: 'Successful nominees receive formal notification and a certificate specifying the exact honorary fellowship awarded. Any digital credential or registry listing should follow IBMP\'s published credential policy.'
  }
];

const documents = [
  'Nominee\'s current CV or professional biography with copies of relevant qualifications and professional registration details.',
  'A short statement explaining the nominee\'s principal contribution and its impact on their field.',
  'Evidence of achievement such as publications, service outcomes, program records, awards, or institutional endorsements.',
  'Contact details for the nominator and professional referees who can support the nomination.'
];

const faqs = [
  {
    question: 'What is the IBMP Honorary Fellowship?',
    answer: 'The IBMP Honorary Fellowship is a professional recognition awarded to individuals with a distinguished record of contribution to medicine, surgery, or medical research. It is awarded through nomination and review, rather than completion of a training course.'
  },
  {
    question: 'Which honorary fellowships are available?',
    answer: 'IBMP offers three categories: Honorary Fellowship in Surgery, Honorary Fellowship in Medicine, and Honorary Fellowship in Medical Research.'
  },
  {
    question: 'Who is eligible for nomination?',
    answer: 'Nominees should ordinarily have at least 15 years of distinguished professional contribution, significant achievements in their field, recognition by peers, and a record of professional integrity. Clinical nominees must hold qualifications and registration appropriate to their place of practice.'
  },
  {
    question: 'Can professionals from any country be nominated?',
    answer: 'Yes. IBMP may consider nominees from different countries. Qualifications, professional registration, and achievements should be assessed in the context of the nominee\'s country and field of practice.'
  },
  {
    question: 'Who can submit a nomination?',
    answer: 'The current IBMP process accepts nominations from an existing IBMP Fellow or an institution.'
  },
  {
    question: 'Can I nominate myself?',
    answer: 'The published process specifies nomination by an IBMP Fellow or institution. Prospective candidates should arrange a nomination through one of those routes unless IBMP announces a self-nomination option.'
  },
  {
    question: 'What documents are needed?',
    answer: 'A nomination should include the nominee\'s CV or professional biography, relevant credentials, a description of their principal contributions, and evidence of impact. IBMP may request references or further documents during review.'
  },
  {
    question: 'How are nominees selected?',
    answer: 'IBMP reviews the nominee\'s professional record, significance of their contributions, leadership, and peer recognition. The final award decision is made by the IBMP Board.'
  },
  {
    question: 'Is there an examination or course to complete?',
    answer: 'No. An honorary fellowship recognises established contributions. It is not a taught program and does not involve course modules, examinations, or clinical training.'
  },
  {
    question: 'Is the Honorary Fellowship valid internationally?',
    answer: 'Recipients may describe the award internationally as an IBMP honorary distinction. Acceptance of any professional credential for employment, academic appointments, clinical privileges, or regulatory purposes depends on the relevant organisation and country. IBMP does not guarantee such recognition.'
  },
  {
    question: 'Does the award permit me to practise medicine or surgery in another country?',
    answer: 'No. Recipients must independently meet the licensing and registration requirements wherever they practise. IBMP is not a medical licensing authority.'
  },
  {
    question: 'Is the Honorary Fellowship equivalent to a specialist qualification or board certification?',
    answer: 'No. It recognises professional contribution; it does not replace a medical degree, specialist qualification, board certification, or clinical training fellowship.'
  },
  {
    question: 'Can a non-physician medical researcher be nominated?',
    answer: 'IBMP\'s current Honorary Fellowship page describes the award as recognising physicians. If IBMP wishes to include qualified non-physician researchers in the Medical Research category, it should first state that eligibility clearly in its published policy.'
  },
  {
    question: 'Can recipients use "Hon. FIBMP" after their name?',
    answer: 'The IBMP page displays the designation "Hon. FIBMP." Successful nominees should follow the exact usage guidance provided with their award and identify IBMP as the awarding organisation when the context requires clarification.'
  },
  {
    question: 'How can I submit a nomination?',
    answer: 'Select Submit Nomination on the Honorary Fellowship page. Include "Honorary Fellowship Nomination," the proposed category, and the nominee\'s name in your message.'
  }
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white hover:border-teal-500 transition-colors"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-bold text-gray-900 text-left">{faq.question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-teal-600 transition-transform flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function HonoraryFellowshipContentUpdated() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80"
            alt="Honorary Fellowship"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/80 via-teal-700/90 to-teal-800/80" />

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
              <Crown className="w-4 h-4" />
              <span>Recognising Distinguished Contributions</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6"
            >
              <span className="text-teal-200">Honorary</span> Fellowship
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-white/90 leading-relaxed mb-8"
            >
              The IBMP Honorary Fellowship recognises medical professionals whose sustained work has advanced patient care, surgical practice, medical research, education, healthcare leadership, or service to communities.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-white/85 leading-relaxed mb-8"
            >
              Awarded following nomination and review, this honorary distinction celebrates a documented record of achievement and contribution to the profession. It is a lifetime recognition of service, subject to IBMP&apos;s award and credential policies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/contact?subject=Honorary+Fellowship+Nomination"
                className="px-8 py-4 bg-white text-teal-600 font-bold rounded-lg hover:bg-teal-50 transition-colors shadow-lg inline-flex items-center justify-center"
              >
                Nominate a Colleague
              </Link>
              <button
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/30 transition-colors"
              >
                Explore Fellowship Categories
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-white" ref={ref}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Honorary Fellowship Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              IBMP recognises distinguished contributions across three principal categories
            </p>
          </motion.div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {fellowshipCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <button
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className="w-full text-left"
                >
                  <div className={`bg-gradient-to-br from-teal-50 to-teal-100 rounded-3xl p-8 border-2 transition-all ${
                    selectedCategory === category.id
                      ? 'border-teal-600 shadow-xl'
                      : 'border-transparent hover:border-teal-500 hover:shadow-lg'
                  }`}>
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {category.title.replace('Honorary Fellowship in ', '')}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {category.subtitle}
                        </p>
                      </div>
                      <div className="flex-shrink-0 mt-2">
                        <ChevronDown
                          className={`w-6 h-6 text-teal-600 transition-transform ${
                            selectedCategory === category.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </button>

                {selectedCategory === category.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 bg-white rounded-2xl p-8 border-2 border-teal-200 shadow-lg"
                  >
                    <p className="text-gray-700 mb-6 leading-relaxed">{category.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-4 text-lg">Contributions Considered:</h4>
                      <ul className="space-y-3">
                        {category.contributions.map((contrib, i) => (
                          <li key={i} className="flex gap-3 text-gray-700">
                            <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                            <span>{contrib}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-xl mb-4 border-l-4 border-teal-600">
                      <p className="text-sm text-gray-700 mb-3">
                        <strong className="text-gray-900">Who may be nominated:</strong>
                      </p>
                      <p className="text-gray-700">{category.eligibility}</p>
                    </div>

                    <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-xl border-2 border-teal-300">
                      <p className="text-sm italic text-teal-800 font-semibold">
                        &quot;{category.recognition}&quot;
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility & Selection Criteria */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Eligibility and Selection Criteria
              </h2>
              <p className="text-gray-600">
                A nominee should demonstrate the following qualities
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Distinguished career record',
                  description: 'Ordinarily at least 15 years of relevant professional contribution with documented achievements extending beyond routine job responsibilities.'
                },
                {
                  title: 'Professional qualifications and standing',
                  description: 'Appropriate qualifications, current registration or licensure where clinical practice is involved, and recognized professional standing in their field.'
                },
                {
                  title: 'Peer recognition and professional integrity',
                  description: 'Support from professional colleagues, institutions, or relevant bodies, with conduct consistent with the responsibilities of the medical or research profession.'
                },
                {
                  title: 'Significant documented impact',
                  description: 'Demonstrable influence on clinical practice, healthcare delivery, research advancement, education, or service to communities.'
                }
              ].map((criterion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 border-2 border-teal-200 hover:border-teal-600 transition-colors"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{criterion.title}</h3>
                  <p className="text-gray-600">{criterion.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nomination Process */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nomination Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Honorary Fellowships are awarded through a structured six-step nomination and review process
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {nominationSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 bg-gray-50 p-6 rounded-xl hover:bg-teal-50 transition-colors border-l-4 border-teal-600"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-600 text-white font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Step {step.step}: {step.title}</h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents to Prepare */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-teal-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Documents to Prepare
                </h2>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white p-6 rounded-xl border-2 border-teal-200 hover:border-teal-600 transition-colors flex items-start gap-4"
                >
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">{doc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Benefits of Recognition
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Crown,
                title: 'Professional Recognition',
                description: 'A formal IBMP distinction acknowledging a sustained and documented contribution to the profession.'
              },
              {
                icon: Users,
                title: 'Professional Connections',
                description: 'Opportunities to connect with other medical professionals, educators, researchers, and healthcare leaders in the IBMP network.'
              },
              {
                icon: Lightbulb,
                title: 'Opportunities to Contribute',
                description: 'Recipients may be invited to take part in mentorship, academic discussions, speaking engagements, or advisory activities.'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 border-2 border-teal-200 hover:border-teal-600 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about the IBMP Honorary Fellowship
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-800">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Nominate a Colleague?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Nominate a distinguished colleague for IBMP Honorary Fellowship recognition.
            </p>
            <Link
              href="/contact?subject=Honorary+Fellowship+Nomination"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 font-bold rounded-lg hover:bg-teal-50 transition-colors shadow-lg"
            >
              Submit a Nomination
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
