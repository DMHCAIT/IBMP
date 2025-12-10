import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { BookOpen, Stethoscope, Microscope } from 'lucide-react';

export const metadata = {
  title: 'Programs - IBMP',
  description: 'Explore IBMP accredited medical education programs across specialties and super-specialties.',
};

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section with Medical Education Image */}
        <section className="relative py-32 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80"
              alt="Medical Education Programs"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-secondary text-secondary font-bold text-sm rounded-full mb-6 shadow-lg">
                <BookOpen className="w-4 h-4" />
                <span>Programs</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-primary mb-6">
                Accredited Medical <span className="bg-gradient-to-r from-secondary to-secondary-600 bg-clip-text text-transparent">Programs</span>
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                We accredit programs across medical specialties, super-specialties, and integrated clinical skill areas, ensuring global recognition and excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Stethoscope,
                  title: 'Medical Specialties',
                  description: 'Comprehensive accreditation for core medical specialties including internal medicine, surgery, pediatrics, and more',
                  gradient: 'from-blue-500 to-blue-600',
                  image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80'
                },
                {
                  icon: Microscope,
                  title: 'Super-Specialties',
                  description: 'Advanced certification for subspecialties like cardiology, neurology, oncology, and specialized surgical fields',
                  gradient: 'from-secondary to-secondary-600',
                  image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80'
                },
                {
                  icon: BookOpen,
                  title: 'Clinical Skills',
                  description: 'Integrated clinical skills programs focusing on practical competencies and hands-on medical training',
                  gradient: 'from-accent to-accent-600',
                  image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80'
                }
              ].map((program, index) => (
                <div key={index} className="group bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:border-secondary hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div className="relative h-48">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${program.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                      <program.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-primary mb-3">{program.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{program.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
