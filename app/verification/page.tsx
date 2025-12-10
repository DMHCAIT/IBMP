import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Verification - IBMP',
  description: 'Verify IBMP accreditation certificates and credentials online.',
};

export default function VerificationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-primary-50 text-primary font-semibold text-sm rounded-full mb-6">
                Verification
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Verify Accreditation
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Verify the authenticity of IBMP accreditation certificates and credentials
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.018-4.118a3.951 3.951 0 012.483 6.366M10.982 20.736a3.951 3.951 0 01-2.483-6.366m.01-7.74a8 8 0 0110 0m-10 17.48a8 8 0 010-17.48" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-primary mb-2">Certificate Verification</h2>
                <p className="text-gray-600">Enter certificate number to verify authenticity</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Certificate Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter certificate number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
                <button className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-all shadow-md hover:shadow-lg">
                  Verify Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
