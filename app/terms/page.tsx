import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'IBMP Terms and Conditions for use of the platform and applications.',
  alternates: { canonical: 'https://www.ibmpractitioner.us/terms/' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-12">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full mb-4">Legal</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Terms &amp; Conditions</h1>
          </div>
        </div>
      </section>
      <main className="py-12">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-4">
              {/* Heading displayed in hero above; removed duplicate here */}

              <article className="bg-white border border-gray-100 rounded-2xl p-4 md:p-8 shadow-lg">
                <div className="space-y-6">
                  <p className="text-gray-700">International Board of Medical Practitioners (IBMP) Last Updated: 27 July 2026</p>

                  <div id="overview" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">Overview</h3>
                    <p className="text-gray-700">These Terms govern use of <a href="https://www.ibmpractitioner.us" className="text-blue-600">www.ibmpractitioner.us</a> and lms.ibmpractitioner.com (&quot;Platform&quot;) and any Accreditation, Certification, or Fellowship application. By using the Platform, you agree to these Terms.</p>
                  </div>

                  <div id="eligibility" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">1. Eligibility</h3>
                    <p className="text-gray-700">Accreditation is for institutions; Certification and Fellowship are for practitioners holding a recognized medical degree and valid professional license. All submitted credentials must be accurate. False or misleading credentials will result in rejection or revocation, and may be referred to relevant authorities.</p>
                  </div>

                  <div id="nature-of-credentials" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">2. Nature of Credentials</h3>
                    <p className="text-gray-700">IBMP credentials recognize completion of our review/assessment process. They are not a government medical license and do not authorize practice in any jurisdiction. You are responsible for confirming how a credential is regarded by employers, institutions, or regulators in your jurisdiction.</p>
                  </div>

                  <div id="application-process" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">3. Application Process</h3>
                    <p className="text-gray-700">Applications go through: submission, document review, assessment/portfolio evaluation, award decision, and (if successful) digital credential issuance and Global Registry listing. IBMP has sole discretion over approval, denial, or requests for more information. Stated timelines are estimates only.</p>
                  </div>

                  <div id="fees" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">4. Fees</h3>
                    <p className="text-gray-700">Fees are disclosed before payment and must be paid in full before processing. Fees may change; the fee at time of submission applies to that application. See our Refund Policy for cancellation terms.</p>
                  </div>

                  <div id="lms-accounts" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">5. LMS Accounts</h3>
                    <p className="text-gray-700">You&apos;re responsible for keeping your login credentials confidential and for all activity on your account. Notify us immediately of any unauthorized use.</p>
                  </div>

                  <div id="verification" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">6. Verification</h3>
                    <p className="text-gray-700">Accepting a credential means consenting to your name, program, and status appearing on our public Verification tool. IBMP may suspend or revoke a Verification listing for fraud, misrepresentation, or disciplinary findings.</p>
                  </div>

                  <div id="intellectual-property" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">7. Intellectual Property</h3>
                    <p className="text-gray-700">The IBMP name, logo, and Platform content are our property. You may reference your own awarded credential accurately (e.g., on a CV) but may not otherwise reproduce or misrepresent Platform content or credential scope.</p>
                  </div>

                  <div id="prohibited-conduct" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">8. Prohibited Conduct</h3>
                    <p className="text-gray-700">No submitting false documents, misrepresenting a credential&apos;s validity, unauthorized access attempts, or unlawful use of the Platform.</p>
                  </div>

                  <div id="suspension" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">9. Suspension/Revocation</h3>
                    <p className="text-gray-700">IBMP may suspend or revoke any credential or account for fraud, misrepresentation, loss of underlying license, or breach of these Terms.</p>
                  </div>

                  <div id="disclaimers" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">10. Disclaimers</h3>
                    <p className="text-gray-700">The Platform is provided &quot;as is.&quot; IBMP does not guarantee that a credential will be recognized by any specific employer or authority, and does not supervise or take responsibility for any credential holder&apos;s clinical practice.</p>
                  </div>

                  <div id="limitation" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">11. Limitation of Liability</h3>
                    <p className="text-gray-700">To the extent permitted by law, IBMP is not liable for indirect, incidental, or consequential damages. Total liability is capped at fees paid to IBMP in the prior 12 months.</p>
                  </div>

                  <div id="governing-law" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">12. Governing Law</h3>
                    <p className="text-gray-700">These Terms are governed by the laws of the State of Delaware, USA, with exclusive jurisdiction in Delaware courts, unless applicable law requires otherwise.</p>
                  </div>

                  <div id="changes" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">13. Changes</h3>
                    <p className="text-gray-700">We may update these Terms; continued use after changes means acceptance.</p>
                  </div>

                  <div id="contact" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                    <h3 className="text-xl font-semibold mb-2">14. Contact</h3>
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
