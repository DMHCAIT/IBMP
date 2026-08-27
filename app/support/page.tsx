import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Shield, Users, Globe, Award, FileCheck, HelpCircle, Settings, AlertTriangle, Building2 } from 'lucide-react';

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
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
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
      color: "from-secondary to-secondary-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100"
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
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-100"
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
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-100"
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
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-100"
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
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100"
    }
  ];

  const importantNotes = [
    'Include your full name, IBMP ID number (if applicable), and nature of inquiry in all communications.',
    'IBMP does not provide medical advice or clinical opinions.',
    'All communications are handled in accordance with IBMP confidentiality and data protection policies.',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white">
      <Header />
      <main className="py-16 md:py-24">
        <div className="container-custom">
          {/* Hero Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-secondary-50 text-secondary font-semibold text-xs md:text-sm rounded-full mb-6">
                24/7 Support Available
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
                How Can We Help?
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                We&apos;re committed to supporting medical practitioners, institutions, and stakeholders with expert assistance across all aspects of IBMP services.
              </p>
            </div>
          </div>

          {/* Support Sections Grid */}
          <div className="mb-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
              {supportSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div key={index} className={`group relative flex h-full overflow-hidden rounded-3xl border ${section.borderColor} ${section.bgColor} p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-primary to-secondary transition-opacity duration-300" />
                    
                    <div className="relative flex h-full w-full flex-col">
                      {/* Icon */}
                      <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${section.color} mb-5 shadow-lg shadow-black/5 group-hover:scale-105 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-bold text-primary mb-5 leading-snug">{section.title}</h3>

                      {/* Support Items */}
                      <ul className="mb-8 space-y-3">
                        {section.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-secondary to-primary mt-2 flex-shrink-0" />
                            <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Email Contact */}
                      <div className="mt-auto pt-5 border-t border-current border-opacity-10">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                          <a 
                            href={`mailto:${section.email}`} 
                            className="text-sm font-semibold text-primary hover:text-secondary transition-colors duration-200 break-all"
                          >
                            {section.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
            <section className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-8 shadow-lg shadow-slate-200/60 md:p-10">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-secondary/10 via-primary/5 to-transparent" />
              <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-secondary/5 blur-3xl" />
              <div className="relative">
                <div className="mb-8 flex items-start gap-4">
                  <div className="inline-flex rounded-2xl bg-gradient-to-br from-secondary to-secondary-600 p-3.5 shadow-lg shadow-secondary/20">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Direct Contact</p>
                    <h2 className="mt-2 text-2xl font-bold text-primary md:text-3xl">General Inquiries</h2>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-gray-600 md:text-base">
                      Reach our main support desk for guidance, routing, and questions that do not fall under a specific service desk above.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="group rounded-[1.75rem] border border-gray-200 bg-gradient-to-r from-slate-50 via-white to-slate-50/50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/20 hover:shadow-md md:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="inline-flex rounded-2xl bg-secondary/10 p-3 text-secondary transition-colors duration-300 group-hover:bg-secondary/15">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Email Support</p>
                          <a href="mailto:info@ibmpractitioner.us" className="mt-2 block text-lg font-bold text-primary transition-colors hover:text-secondary md:text-xl">
                            info@ibmpractitioner.us
                          </a>
                        </div>
                      </div>
                      <p className="max-w-sm text-sm leading-6 text-gray-600 md:text-right">
                        For general questions, clarification requests, and support routing across IBMP services.
                      </p>
                    </div>
                  </div>

                  <div className="group rounded-[1.75rem] border border-gray-200 bg-gradient-to-r from-slate-50 via-white to-slate-50/50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-md md:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary transition-colors duration-300 group-hover:bg-primary/15">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Institutional Office</p>
                          <p className="mt-2 text-lg font-bold leading-snug text-primary md:text-xl">International Boards of Medical Practitioners</p>
                        </div>
                      </div>
                      <p className="max-w-sm text-sm leading-6 text-gray-600 md:text-right">
                        Primary board-level contact point for administrative communication and institutional coordination.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-white p-8 shadow-lg shadow-amber-100/70 md:p-10">
              <div className="pointer-events-none absolute -right-10 top-0 h-32 w-32 rounded-full bg-amber-200/30 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-36 w-36 rounded-full bg-orange-100/40 blur-3xl" />
              <div className="relative">
                <div className="mb-7 flex items-start gap-4">
                  <div className="inline-flex rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-3.5 shadow-lg shadow-amber-200/70">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Before You Contact Us</p>
                    <h2 className="mt-2 text-2xl font-bold text-primary md:text-3xl">Important Notes</h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {importantNotes.map((note, index) => (
                    <div key={note} className="rounded-[1.6rem] border border-white/80 bg-white/80 p-4 shadow-[0_10px_30px_rgba(251,191,36,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(251,191,36,0.14)] md:p-5">
                      <div className="flex items-start gap-4">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-sm font-bold text-amber-700 ring-1 ring-amber-200/70">
                          {index + 1}
                        </span>
                        <p className="pt-0.5 text-sm leading-7 text-gray-700 md:text-[15px]">{note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-red-200 bg-gradient-to-r from-white via-red-50 to-rose-50 p-6 shadow-sm shadow-red-100/60 md:mx-auto md:max-w-5xl md:p-8">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-red-300 via-red-400 to-rose-300" />
            <div className="relative flex items-start gap-4 md:gap-5">
              <div className="inline-flex rounded-2xl bg-red-100 p-3 text-red-600 shadow-sm ring-1 ring-red-200/70">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">Advisory Notice</p>
                <h2 className="mt-2 text-2xl font-bold text-primary">Disclaimer</h2>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-700 md:text-base">
                  Support assistance does not constitute legal, regulatory, or licensure advice. IBMP accreditation, fellowship, or appointments do not replace national medical licensing requirements.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
