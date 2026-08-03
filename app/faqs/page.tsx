import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface FAQItem {
  q?: string;
  a?: string;
  section?: string;
}

const faqs: FAQItem[] = [
  { q: 'What is IBMP?', a: 'The International Board of Medical Practitioners is a global body focused on accreditation, certification, and professional recognition in medical education.' },
  { q: 'What does IBMP do?', a: 'IBMP accredits institutions, certifies professionals, and offers fellowship pathways to support global medical education standards.' },
  { q: 'Is IBMP a government organization?', a: 'No, IBMP is an independent professional body, not a government authority.' },
  { q: 'Is IBMP globally recognized?', a: 'Yes, IBMP credentials are recognized internationally across 120+ countries for professional and academic purposes.' },
  { q: 'Where is IBMP headquartered?', a: 'IBMP is headquartered in Wilmington, Delaware, USA.' },

  { section: 'Accreditation FAQs' },
  { q: 'What is IBMP accreditation?', a: 'It is a quality assurance process validating medical education providers against international standards.' },
  { q: 'Who can apply for accreditation?', a: 'Hospitals, training institutes, academies, and educational organizations.' },
  { q: 'What is the validity of accreditation?', a: 'Accreditation is valid for 3 years with renewal requirements.' },
  { q: 'What documents are required for accreditation?', a: 'Institutional profile, faculty details, course syllabus, QA processes, and learning outcomes.' },
  { q: 'How long does the accreditation process take?', a: 'Typically 2–4 weeks depending on documentation and review stages.' },
  { q: 'Can IBMP revoke accreditation?', a: 'Yes, for non-compliance, misuse, or ethical violations.' },

  { section: 'Certification & Fellowship FAQs' },
  { q: 'What are IBMP certification programs?', a: 'Programs that validate clinical skills and professional competence in specific specialties.' },
  { q: 'What is an IBMP Fellowship?', a: 'A prestigious postgraduate recognition for advanced expertise and leadership in medicine.' },
  { q: 'Who is eligible for IBMP Fellowship?', a: 'Medical professionals with recognized degrees, experience, and valid registration.' },
  { q: 'Are fellowships academic or honorary?', a: 'They can be both—based on assessment or honorary recognition.' },
  { q: 'Does IBMP provide clinical training?', a: 'IBMP focuses on accreditation and recognition; training is delivered by accredited institutions.' },
  { q: 'What are the benefits of IBMP certification?', a: 'Career growth, credibility, global recognition, and enhanced professional standing.' },

  { section: 'Verification & Recognition FAQs' },
  { q: 'How can I verify an IBMP certificate?', a: 'Through the official IBMP verification portal using name or credential number.' },
  { q: 'What details appear in verification?', a: 'Name, credential type, ID number, date, and current status.' },
  { q: 'Is verification proof of license to practice?', a: 'No, it confirms recognition status only.' },
  { q: 'Can employers verify IBMP credentials?', a: 'Yes, institutions and employers can access official verification online.' },

  { section: 'Compliance & Legal FAQs' },
  { q: 'Does IBMP grant a medical license?', a: 'No, IBMP does not grant or replace medical licenses.' },
  { q: 'Can IBMP certification be used for clinical practice?', a: 'Only alongside valid national licensing; IBMP itself does not authorize practice.' },
  { q: 'Does IBMP guarantee jobs?', a: 'No, IBMP does not guarantee employment or placements.' },
  { q: 'Is IBMP recognised by medical councils?', a: 'Recognition depends on local regulatory bodies; IBMP provides professional recognition, not regulatory approval.' },

  { section: 'Application & Process FAQs' },
  { q: 'How can I apply for IBMP programs?', a: 'Submit your application, credentials, and documents through the official platform.' },
  { q: 'What is the application process?', a: 'Application → Review → Assessment → Certification/Fellowship → Registry listing.' },
  { q: 'Who evaluates applications?', a: 'IBMP’s academic board and expert reviewers.' },
  { q: 'Are digital certificates provided?', a: 'Yes, credentials are issued digitally and listed in the global registry.' },
  { q: 'Can institutions use the IBMP logo?', a: 'Yes, but only for accredited programs and under strict guidelines.' },
]

export default function FAQsPage() {
  const sectionIcons: Record<string, string> = {
    'General FAQs (IBMP Overview)': '🌍',
    'Accreditation FAQs': '✓',
    'Certification & Fellowship FAQs': '🎓',
    'Verification & Recognition FAQs': '🔍',
    'Compliance & Legal FAQs': '⚖️',
    'Application & Process FAQs': '📋',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <Header />
      <main className="py-16">
        <div className="container-custom">
          <section className="mb-12">
            <div className="bg-gradient-to-r from-[#071428] via-[#0a1f38] to-[#071428] text-white rounded-2xl shadow-2xl overflow-hidden border border-blue-900">
              <div className="px-10 py-16">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">Frequently Asked Questions</h1>
                <p className="mt-4 text-blue-100 max-w-3xl text-lg leading-relaxed">Comprehensive answers about IBMP services, accreditation, certification, and professional processes. Find the information you need to succeed with IBMP.</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <div>
              {faqs.map((item, idx) => {
                if (item.section) {
                  const icon = sectionIcons[item.section] || '📌';
                  return (
                    <div key={idx} className="mt-10 mb-6">
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-600">
                        <span className="text-3xl">{icon}</span>
                        <h2 className="text-3xl font-bold text-gray-900">{item.section}</h2>
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={idx} className="mb-4 group">
                    <details className="group/details">
                      <summary className="flex items-center justify-between cursor-pointer list-none bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl px-6 py-4 transition-all duration-300 shadow-sm hover:shadow-md">
                        <span className="text-base md:text-lg font-semibold text-gray-900 pr-4">{item.q}</span>
                        <svg className="w-6 h-6 text-blue-600 flex-shrink-0 transition-transform duration-300 group-open/details:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                      </summary>
                      <div className="mt-0 px-6 py-4 bg-gradient-to-br from-blue-50 to-slate-50 border-2 border-t-0 border-gray-200 rounded-b-xl text-gray-700 leading-relaxed text-base">{item.a}</div>
                    </details>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="mt-16">
            <div className="mx-auto max-w-4xl">
              <div className="bg-gradient-to-r from-primary to-primary-600 rounded-2xl p-8 shadow-lg border border-primary-500">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-none">
                    <div className="w-14 h-14 rounded-md bg-accent text-primary flex items-center justify-center shadow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-white">Still have questions?</h3>
                    <p className="mt-2 text-gray-100">If you need help with accreditation, certification, or verification processes, our team is ready to assist you.</p>
                  </div>

                  <div className="flex-none">
                    <a href="/contact" className="inline-flex items-center gap-3 bg-accent hover:bg-yellow-600 text-primary font-semibold px-6 py-3 rounded-lg shadow-md transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
