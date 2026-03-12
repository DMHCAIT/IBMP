import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the IBMP privacy policy to understand how personal information is collected, used, and protected while accessing our services.',
  alternates: {
    canonical: 'https://www.ibmpractitioner.us/privacy-policy/',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-secondary-50 text-secondary font-semibold text-sm rounded-full mb-6">
                Legal
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Last updated: March 2026
              </p>
            </div>

            {/* Content */}
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 md:p-12">
              <div className="prose prose-lg max-w-none">

                <p className="text-gray-700 leading-relaxed mb-6">
                  The <strong>International Board of Medical Practitioners (IBMP)</strong> is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website or use our services.
                </p>

                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Information We Collect</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may collect the following types of personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                  <li><strong>Identification Information:</strong> Name, email address, phone number, and professional credentials submitted through application or contact forms.</li>
                  <li><strong>Usage Data:</strong> IP address, browser type, pages visited, and time spent on our website, collected automatically through cookies and analytics tools.</li>
                  <li><strong>Payment Information:</strong> Billing details processed securely through third-party payment providers. IBMP does not store full payment card details.</li>
                </ul>

                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  IBMP uses your personal information to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                  <li>Process and manage applications for accreditation, certification, and fellowship programs.</li>
                  <li>Communicate updates, program information, and responses to your inquiries.</li>
                  <li>Improve our website, services, and user experience.</li>
                  <li>Comply with legal obligations and enforce our terms and policies.</li>
                </ul>

                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Sharing of Information</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  IBMP does not sell or rent your personal information to third parties. We may share information with trusted service providers who assist in operating our website and services, provided they agree to keep your information confidential. We may also disclose information when required by law or to protect the rights and safety of IBMP and its users.
                </p>

                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Our website uses cookies to enhance your browsing experience. You may configure your browser to refuse cookies; however, some features of the website may not function correctly without them.
                </p>

                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We retain personal information for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required by law.
                </p>

                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Depending on your jurisdiction, you may have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                  <li>Access the personal information we hold about you.</li>
                  <li>Request correction of inaccurate data.</li>
                  <li>Request deletion of your personal information, subject to legal obligations.</li>
                  <li>Withdraw consent where processing is based on consent.</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-6">
                  To exercise these rights, please contact us at the details below.
                </p>

                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Security</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, loss, or misuse. However, no transmission over the internet is completely secure, and we cannot guarantee absolute security.
                </p>

                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  IBMP reserves the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated effective date. Your continued use of our services after changes are posted constitutes your acceptance of the updated policy.
                </p>

                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions or concerns about this Privacy Policy, please contact us through our{' '}
                  <a href="/contact" className="text-secondary font-semibold hover:underline">
                    Contact page
                  </a>
                  .
                </p>

              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
