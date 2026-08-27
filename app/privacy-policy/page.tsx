import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the IBMP privacy policy to understand how personal information is collected, used, and protected while accessing our services.',
  alternates: {
    canonical: 'https://www.ibmpractitioner.us/privacy-policy/',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-12">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full mb-4">Legal</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Privacy Policy</h1>
          </div>
        </div>
      </section>
      <main className="py-12">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-4">
                {/* Heading displayed in hero above; removed duplicate here */}

              <article className="bg-white border border-gray-100 rounded-2xl p-4 md:p-8 shadow-lg">
                <div className="space-y-5">
                  <p className="text-gray-700">This policy explains how IBMP collects, uses, and protects personal information on <a href="https://www.ibmpractitioner.us" className="text-blue-600">www.ibmpractitioner.us</a> and our Learning Management System (LMS).</p>

                  <div id="information-we-collect" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">1. Information We Collect</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Contact and identity details (name, email, phone, address, country)</li>
                      <li>Professional credentials (degree, license number, specialty, CV, transcripts, supporting documents)</li>
                      <li>Payment details (processed by third-party payment processors)</li>
                      <li>LMS account and usage data</li>
                      <li>Device/browser data and cookies</li>
                    </ul>
                  </div>

                  <div id="how-we-use-it" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">2. How We Use It</h3>
                    <p className="text-gray-700">We use personal information to process applications, verify credentials, issue and display credentials (including on the public Verification tool), operate the LMS, handle payments, respond to inquiries, and meet legal obligations.</p>
                  </div>

                  <div id="sharing" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">3. Sharing</h3>
                    <p className="text-gray-700">We do not sell personal data. We share it only with service providers (payment, hosting, LMS, verification vendors) under confidentiality obligations; parties using the Verification tool (limited to name, program, credential status); and authorities where legally required.</p>
                  </div>

                  <div id="international-transfers" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">4. International Transfers</h3>
                    <p className="text-gray-700">As we serve applicants in 120+ countries, data may be processed in the United States or other countries where our service providers operate, with reasonable safeguards in place.</p>
                  </div>

                  <div id="cookies" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">5. Cookies</h3>
                    <p className="text-gray-700">Cookies are used for site functionality, login sessions, and analytics. You can manage cookies via your browser settings.</p>
                  </div>

                  <div id="data-retention" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">6. Data Retention</h3>
                    <p className="text-gray-700">We retain data as long as needed to administer your credential, support Verification, and meet legal requirements. Issued-credential records may be kept indefinitely for verification integrity.</p>
                  </div>

                  <div id="your-rights" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">7. Your Rights</h3>
                    <p className="text-gray-700">You may request access, correction, or deletion of your personal data by emailing <a href="mailto:info@ibmpractitioner.us" className="text-blue-600">info@ibmpractitioner.us</a>. Deletion may be limited where retention is needed for credential verification or legal recordkeeping.</p>
                  </div>

                  <div id="security" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">8. Security</h3>
                    <p className="text-gray-700">We use reasonable administrative and technical safeguards but cannot guarantee absolute security.</p>
                  </div>

                  <div id="children" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">9. Children</h3>
                    <p className="text-gray-700">The Platform is not directed at individuals under 18.</p>
                  </div>

                  <div id="changes" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">10. Changes</h3>
                    <p className="text-gray-700">We may update this policy; the &quot;Last Updated&quot; date will reflect changes.</p>
                  </div>

                  <div id="contact" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">11. Contact</h3>
                    <p className="text-gray-700">IBMP, 800 N King Street, Suite 304, Wilmington, Delaware 19801, US<br/>+1 302-302-0293 | <a href="mailto:info@ibmpractitioner.us" className="text-blue-600">info@ibmpractitioner.us</a></p>
                  </div>
                </div>
              </article>
            </div>

            {/* Quick Links removed as requested */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

