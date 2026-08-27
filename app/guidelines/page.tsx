import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Professional Recognition Guidelines - IBMP',
  description: 'IBMP guidelines for accreditation, fellowship, faculty appointments, and international representation.',
};

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 bg-secondary-50 text-secondary font-semibold text-sm rounded-full mb-6">
                Guidelines
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                IBMP Professional Recognition Guidelines
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                International Boards of Medical Practitioners (IBMP)
              </p>
            </div>

            {/* 1. Accreditation Guidelines */}
            <section className="mb-16 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-primary mb-6">1. Accreditation Guidelines</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                The IBMP accreditation process ensures that medical education providers maintain high academic and professional standards in line with international best practices. Accreditation confirms the quality, integrity, and relevance of educational programs offered under the IBMP framework.
              </p>

              <h3 className="text-2xl font-bold text-primary mb-4">Accreditation Eligibility Criteria</h3>
              <p className="text-gray-700 mb-4">
                Educational institutions, training organizations, hospitals, and medical academies may apply if they meet the following requirements:
              </p>

              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <h4 className="text-xl font-bold text-primary mb-4">Organizational Requirements</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">✓</span>
                    <span className="text-gray-700">Legally registered educational or training entity in their jurisdiction</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">✓</span>
                    <span className="text-gray-700">Clearly defined governance structure and academic leadership</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">✓</span>
                    <span className="text-gray-700">Documented quality assurance and continuous improvement processes</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h4 className="text-xl font-bold text-primary mb-4">Validity & Renewal</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span className="text-gray-700">Renewal required every <strong>3 years</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span className="text-gray-700">Renewal applicants must submit updated course materials, outcomes, faculty updates, and quality assurance records</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span className="text-gray-700">Renewal is based on demonstrated performance and adherence to IBMP standards</span>
                  </li>
                </ul>
              </div>

              <Link href="/accreditation" className="inline-block px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-600 transition-all">
                Learn More About Accreditation
              </Link>
            </section>

            {/* 2. Fellowship Guidelines */}
            <section className="mb-16 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-primary mb-6">2. Fellowship Guidelines</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                IBMP Fellowship is an honorary and professional distinction awarded to medical practitioners who have demonstrated exceptional expertise, leadership, academic contribution, or service to the medical profession.
              </p>

              <h3 className="text-2xl font-bold text-primary mb-4">Eligibility Criteria</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-gray-700">✓ Recognized medical degree (MD/MBBS or equivalent)</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-gray-700">✓ Valid professional registration or license</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-gray-700">✓ Specialty-level training or clinical experience</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-gray-700">✓ Completion of required assessments or portfolio review</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-primary mb-4">Fellowship Categories</h3>
              <div className="space-y-3 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="font-semibold text-primary">Fellowship in Medical Specialties</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="font-semibold text-primary">Fellowship in Super-Specialties</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <p className="font-semibold text-primary">Honorary Fellowship</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-primary mb-4">Application / Nomination Process</h3>
              <div className="space-y-3 mb-6">
                {[
                  'Submit Application & Credentials',
                  'Document Review & Eligibility Verification',
                  'Assessment / Portfolio Evaluation',
                  'Certification or Fellowship Award',
                  'Digital Credential Issuance & Global Registry Listing'
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>

              <Link href="/programs" className="inline-block px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-600 transition-all">
                Explore Fellowship Programs
              </Link>
            </section>

            {/* 3. Faculty & International Representatives Guidelines */}
            <section className="mb-16 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-primary mb-6">3. Faculty & International Representatives Guidelines</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                The International Board of Medical Practitioners (IBMP) is committed to elevating global healthcare standards through advanced education, skill development, and international medical collaborations. As IBMP continues to expand its global network, we welcome distinguished medical professionals to join us as Faculty Members and International Representatives.
              </p>

              <h3 className="text-2xl font-bold text-primary mb-4">Why Become a Part of IBMP?</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="text-3xl mb-3">🌍</div>
                  <h4 className="font-bold text-primary mb-2">Global Medical Recognition</h4>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="text-3xl mb-3">📚</div>
                  <h4 className="font-bold text-primary mb-2">Academic & Professional Growth</h4>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="text-3xl mb-3">🤝</div>
                  <h4 className="font-bold text-primary mb-2">International Collaboration</h4>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="text-3xl mb-3">👨‍💼</div>
                  <h4 className="font-bold text-primary mb-2">Leadership & Influence</h4>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-primary mb-4">Roles & Responsibilities</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-primary mb-4">As IBMP Faculty</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="text-gray-700">Deliver lectures, workshops, and clinical training</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="text-gray-700">Participate in curriculum design & academic development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="text-gray-700">Mentor medical students and healthcare professionals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="text-gray-700">Contribute to medical research, case studies, and continuing education programs</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-primary mb-4">As International Representative</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="text-gray-700">Promote IBMP programs and certifications within your region</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="text-gray-700">Build collaborations with hospitals, universities, and medical associations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="text-gray-700">Represent IBMP at medical events, conferences, and international panels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="text-gray-700">Support global outreach, membership development, and medical initiatives</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-primary mb-4">Who Can Apply?</h3>
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <ul className="grid md:grid-cols-2 gap-3">
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✓</span>
                    <span className="text-gray-700">Licensed medical doctors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✓</span>
                    <span className="text-gray-700">Specialists & consultants</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✓</span>
                    <span className="text-gray-700">Medical educators and researchers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✓</span>
                    <span className="text-gray-700">Healthcare leaders & clinical trainers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✓</span>
                    <span className="text-gray-700">Public health professionals</span>
                  </li>
                </ul>
                <p className="text-gray-600 mt-4 italic">
                  Candidates should demonstrate a commitment to medical excellence, ethics, and global healthcare development.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-primary mb-4">Benefits</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  'International accreditation and certification',
                  'Professional title and recognition from IBMP',
                  'Opportunities for global collaboration and medical exchange',
                  'Priority access to international conferences & medical forums',
                  'Publication support and academic visibility',
                  'Membership in a prestigious global medical board'
                ].map((benefit, index) => (
                  <div key={index} className="bg-secondary-50 border border-secondary-200 rounded-xl p-4">
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>

              <Link href="/contact" className="inline-block px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-600 transition-all">
                Apply to Join IBMP
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
