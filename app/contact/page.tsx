import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact Us - IBMP',
  description: 'Get in touch with the International Board of Medical Practitioners for accreditation inquiries and support.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-secondary-50 text-secondary font-semibold text-sm rounded-full mb-6">
                Contact Us
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Get in Touch with IBMP
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Get your Medical Program Accredited, Join our Fellow Program, or Serve as Faculty & International Representative
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">Send us a message</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
                    />
                  </div>
                  <button className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-all shadow-md hover:shadow-lg">
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-secondary hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">🏛️</div>
                  <h3 className="text-xl font-bold text-primary mb-2">Get Your Medical Program Accredited</h3>
                  <p className="text-gray-600 mb-3">Join the ranks of globally recognized medical education providers. Our accreditation ensures your programs meet the highest international standards of quality, credibility, and excellence.</p>
                  <a href="mailto:accreditation@ibmpractitioner.us" className="text-secondary font-semibold hover:underline">
                    accreditation@ibmpractitioner.us
                  </a>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-secondary hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">🎓</div>
                  <h3 className="text-xl font-bold text-primary mb-2">Certify Your Practice Globally</h3>
                  <p className="text-gray-600 mb-3">Join our Fellow Program and achieve international recognition for your medical expertise and professional excellence.</p>
                  <a href="mailto:fellow@ibmpractitioner.us" className="text-secondary font-semibold hover:underline">
                    fellow@ibmpractitioner.us
                  </a>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-secondary hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">👨‍🏫</div>
                  <h3 className="text-xl font-bold text-primary mb-2">Join IBMP as Faculty & International Representative</h3>
                  <p className="text-gray-600 mb-3">Opportunity to serve as Faculty and International Representative. Share your expertise globally and shape the future of medical education.</p>
                  <a href="mailto:join@ibmpractitioner.us" className="text-secondary font-semibold hover:underline">
                    join@ibmpractitioner.us
                  </a>
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
