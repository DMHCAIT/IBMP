import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Disclaimer - IBMP',
  description: 'Important disclaimer regarding IBMP certifications, appointments, and professional recognition.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 font-semibold text-sm rounded-full mb-6">
                <AlertCircle className="w-4 h-4" />
                Important Notice
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Disclaimer
              </h1>
            </div>

            {/* Disclaimer Content */}
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  The <strong>International Board of Medical Practitioners (IBMP)</strong> operates as an independent professional body dedicated to advancing medical education, global healthcare standards, and professional development for medical practitioners. IBMP is <strong>not a medical licensing authority</strong>, nor does it grant permission to practice medicine in any country.
                </p>

                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Professional Recognition Only</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  All certifications, faculty appointments, and representative roles issued by IBMP are intended for <strong>professional recognition, academic engagement, and continuing medical education purposes only</strong>. These credentials do not replace or substitute any legally required national or regional medical licenses, registrations, or board certifications.
                </p>

                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">No Guarantee of Practice Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  IBMP does not guarantee employment, clinical privileges, or governmental recognition through its programs. Users and applicants are responsible for ensuring compliance with the medical regulations and licensing requirements of their respective countries or jurisdictions.
                </p>

                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Educational and Professional Role</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  By engaging with IBMP programs, services, or appointments, individuals acknowledge that IBMP's role is <strong>educational and professional—not regulatory</strong>.
                </p>

                {/* Key Points Box */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mt-8 rounded-r-lg">
                  <h3 className="text-xl font-bold text-amber-900 mb-4">Key Points to Remember:</h3>
                  <ul className="space-y-3 text-amber-900">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>IBMP is not a medical licensing authority</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>IBMP credentials are for professional recognition and education only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>IBMP credentials do not replace national medical licenses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>You are responsible for compliance with local medical regulations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>IBMP's role is educational and professional, not regulatory</span>
                    </li>
                  </ul>
                </div>

                {/* Contact */}
                <div className="mt-10 pt-8 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    For questions or clarifications regarding this disclaimer, please contact us at{' '}
                    <a href="mailto:info@ibmpractitioner.us" className="text-secondary font-semibold hover:underline">
                      info@ibmpractitioner.us
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
