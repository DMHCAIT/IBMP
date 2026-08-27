import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'IBMP Refund Policy for Accreditation, Certification, and Fellowship applications.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-12">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full mb-4">Legal</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Refund Policy</h1>
          </div>
        </div>
      </section>
      <main className="py-12">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            {/* Heading displayed in hero above; removed duplicate here */}

            <article className="bg-white border border-gray-100 rounded-2xl p-4 md:p-8 shadow-lg">
              <div className="space-y-5 text-gray-700">
                <p>This policy covers fees paid for Accreditation, Certification, and Fellowship applications on <a href="https://www.ibmpractitioner.us" className="text-blue-600">www.ibmpractitioner.us</a>.</p>

                <div id="general-rule" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                  <h3 className="text-xl font-semibold mb-2">1. General Rule</h3>
                  <p>Review begins shortly after payment, so fees are largely non-refundable once processing starts, subject to the exceptions below.</p>
                </div>

                <div id="when-refund-applies" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                  <h3 className="text-xl font-semibold mb-2">2. When a Refund Applies</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Before document review begins (within 48 hours of payment): full refund, minus payment processing fees</li>
                    <li>Rejected at document/eligibility review, before assessment begins: partial refund (processing fee retained)</li>
                    <li>Duplicate payment or billing error: full refund of the erroneous amount</li>
                  </ul>
                </div>

                <div id="when-refund-not" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                  <h3 className="text-xl font-semibold mb-2">3. When a Refund Does Not Apply</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Assessment/portfolio evaluation has started</li>
                    <li>A credential has already been issued</li>
                    <li>Rejection is due to false, forged, or misrepresented credentials</li>
                  </ul>
                </div>

                <div id="how-to-request" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                  <h3 className="text-xl font-semibold mb-2">4. How to Request</h3>
                  <p>Email <a href="mailto:info@ibmpractitioner.us" className="text-blue-600">info@ibmpractitioner.us</a> with your name, application/reference number, payment date, and reason. Requests are reviewed within 10 business days; approved refunds are issued to the original payment method within 10–15 business days.</p>
                </div>

                <div id="fees-and-currency" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                  <h3 className="text-xl font-semibold mb-2">5. Fees and Currency</h3>
                  <p>Refunds are issued in the original payment currency. IBMP does not cover bank charges, currency conversion differences, and payment processor fees.</p>
                </div>

                <div id="chargebacks" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                  <h3 className="text-xl font-semibold mb-2">6. Chargebacks</h3>
                  <p>Please contact us before disputing a payment with your bank; unresolved chargebacks may result in application or account suspension.</p>
                </div>

                <div id="changes" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                  <h3 className="text-xl font-semibold mb-2">7. Changes</h3>
                  <p>The policy in effect at time of payment governs that transaction.</p>
                </div>

                <div id="contact" className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#0b3d91]">
                  <h3 className="text-xl font-semibold mb-2">8. Contact</h3>
                  <p>IBMP, 800 N King Street, Suite 304, Wilmington, Delaware 19801, US<br/>+1 302-302-0293 | <a href="mailto:info@ibmpractitioner.us" className="text-blue-600">info@ibmpractitioner.us</a></p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
