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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-primary-50 text-primary font-semibold text-sm rounded-full mb-6">
                Verification Portal
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                IBMP Accreditation & Fellowship Verification
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Welcome to the official verification portal of the International Boards of Medical Practitioners (IBMP). This service enables healthcare institutions, regulatory authorities, employers, and the public to verify the accreditation and fellowship status of medical practitioners recognized by IBMP.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                All information provided through this portal is sourced from the official IBMP registry and reflects the most current status of records maintained by the Board.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.018-4.118a3.951 3.951 0 012.483 6.366M10.982 20.736a3.951 3.951 0 01-2.483-6.366m.01-7.74a8 8 0 0110 0m-10 17.48a8 8 0 010-17.48" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-primary mb-2">Accreditation & Fellowship Verification</h2>
                <p className="text-gray-600">Enter IBMP Accreditation Number, Fellowship Number, or Full Name to verify status</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search Credentials
                  </label>
                  <input
                    type="text"
                    placeholder="Enter accreditation number, fellowship number, or full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
                <button className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-all shadow-md hover:shadow-lg">
                  Verify Now
                </button>
              </div>

              {/* Info Boxes */}
              <div className="mt-10 grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-bold text-primary mb-3">Accreditation Verification Results May Display:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Name of Organization</li>
                    <li>• Accreditation Title / Category</li>
                    <li>• IBMP Accreditation Number</li>
                    <li>• Date of Accreditation</li>
                    <li>• Validity Period (if applicable)</li>
                    <li>• Current Status (Active / Expired / Suspended / Withdrawn)</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="font-bold text-primary mb-3">Fellowship Verification Results May Display:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Full Name of Fellow</li>
                    <li>• Fellowship Designation</li>
                    <li>• IBMP Fellowship Number</li>
                    <li>• Year of Award</li>
                    <li>• Current Status (Active / Inactive)</li>
                  </ul>
                </div>
              </div>

              {/* Important Information */}
              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-bold text-primary mb-3">Important Information</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Verification results displayed on this portal are <strong>official and valid</strong> as of the date of search</li>
                  <li>• Verification confirms professional recognition status only and does not imply licensure to practice medicine in any specific jurisdiction</li>
                  <li>• Printed or electronic copies of verification results may be used for reference by institutions and employers</li>
                </ul>
              </div>

              {/* Record Not Found */}
              <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-primary mb-3">Record Not Found?</h3>
                <p className="text-sm text-gray-700 mb-3">If a record does not appear:</p>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>• Please ensure the entered information is accurate</li>
                  <li>• The accreditation or fellowship may be newly issued and pending system update</li>
                  <li>• The status may have expired, been suspended, or withdrawn</li>
                </ul>
                <p className="text-sm text-gray-700">
                  For verification assistance, please contact:<br/>
                  <strong>Email:</strong> <a href="mailto:verification@ibmpractitioner.us" className="text-secondary hover:underline">verification@ibmpractitioner.us</a><br/>
                  <strong>Office:</strong> International Boards of Medical Practitioners
                </p>
              </div>

              {/* Disclaimer */}
              <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-bold text-primary mb-3">Disclaimer</h3>
                <p className="text-sm text-gray-700">
                  Verification through this portal confirms IBMP accreditation or fellowship status only. It does not replace original certificates, official letters, or national medical licensure requirements. IBMP assumes no liability for decisions made based solely on verification results.
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
