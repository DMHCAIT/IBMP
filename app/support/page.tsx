import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Shield, Users, Globe, Award, FileCheck, HelpCircle, Settings } from 'lucide-react';

export const metadata = {
  title: 'Support Centre - IBMP',
  description: 'IBMP Support Centre - We are committed to assisting medical practitioners, institutions, and stakeholders.',
};

export default function SupportPage() {
  const supportSections = [
    {
      title: "Accreditation Support",
      icon: Shield,
      items: [
        "New accreditation applications",
        "Renewal and validity inquiries", 
        "Accreditation status or verification issues",
        "Document submission and corrections"
      ],
      email: "accreditation@ibmpractitioner.us",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Fellowship Support", 
      icon: Award,
      items: [
        "Fellowship eligibility and applications",
        "Fellowship nomination process",
        "Fellowship status verification",
        "Fellowship designation and usage"
      ],
      email: "fellow@ibmpractitioner.us",
      color: "from-secondary to-secondary-600"
    },
    {
      title: "Faculty & Academic Support",
      icon: Users,
      items: [
        "Faculty appointments and roles",
        "Teaching, training, and academic programs",
        "Curriculum, assessments, and research initiatives"
      ],
      email: "join@ibmpractitioner.us",
      color: "from-green-500 to-green-600"
    },
    {
      title: "International Representative Support",
      icon: Globe,
      items: [
        "International representation appointments",
        "Country or regional coordination",
        "Partnerships with institutions and regulators"
      ],
      email: "join@ibmpractitioner.us",
      color: "from-teal-500 to-teal-600"
    },
    {
      title: "Verification & Registry Support",
      icon: FileCheck,
      items: [
        "Online verification of accreditation or fellowship",
        "Registry record corrections",
        "Certificate authenticity confirmation"
      ],
      email: "verification@ibmpractitioner.us",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Technical & Portal Support",
      icon: Settings,
      items: [
        "IBMP website or application portal",
        "Login or account access",
        "Online forms or payment issues"
      ],
      email: "support@ibmpractitioner.us",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-secondary-50 text-secondary font-semibold text-sm rounded-full mb-6">
              Support Centre
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              IBMP Support Centre
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We are committed to assisting medical practitioners, institutions, and stakeholders with inquiries related to IBMP accreditation, fellowship, faculty appointments, international representation, verification, and general services.
            </p>
          </div>

          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">How Can We Help You?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {supportSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-primary">{section.title}</h3>
                    </div>
                    <ul className="space-y-2 mb-6 ml-16">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="ml-16 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-secondary" />
                      <a href={`mailto:${section.email}`} className="font-semibold hover:text-secondary transition-colors text-sm text-primary">
                        {section.email}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">General Inquiries</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-secondary" />
                  <div>
                    <span className="text-gray-600">Email: </span>
                    <a href="mailto:info@ibmpractitioner.us" className="text-secondary font-semibold hover:underline">
                      info@ibmpractitioner.us
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Globe className="w-6 h-6 text-secondary" />
                  <span className="text-gray-700">Office: International Boards of Medical Practitioners</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-4">Important Notes</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 mt-1">⚠️</span>
                      <span className="text-gray-700">Please include your <strong>full name</strong>, <strong>IBMP ID number</strong> (if applicable), and <strong>nature of inquiry</strong> in all communications</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 mt-1">⚠️</span>
                      <span className="text-gray-700">IBMP does not provide medical advice or clinical opinions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 mt-1">⚠️</span>
                      <span className="text-gray-700">All communications are handled in accordance with IBMP confidentiality and data protection policies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Disclaimer</h2>
              <p className="text-gray-700 leading-relaxed">
                Support assistance does not constitute legal, regulatory, or licensure advice. IBMP accreditation, fellowship, or appointments do not replace national medical licensing requirements.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
