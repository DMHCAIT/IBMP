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
                Get in Touch
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Contact Us
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Have questions about accreditation? Our team is here to help.
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
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-xl font-bold text-primary mb-2">Email Us</h3>
                  <p className="text-gray-600 mb-3">For general inquiries and support</p>
                  <a href="mailto:info@ibmp.org" className="text-secondary font-semibold hover:underline">
                    info@ibmp.org
                  </a>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-secondary hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">🌍</div>
                  <h3 className="text-xl font-bold text-primary mb-2">Global Reach</h3>
                  <p className="text-gray-600">
                    Serving medical professionals and institutions in over 120 countries worldwide
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-secondary hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">💼</div>
                  <h3 className="text-xl font-bold text-primary mb-2">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday<br />
                    9:00 AM - 5:00 PM (GMT)
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
