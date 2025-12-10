import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccreditationHero from '@/components/accreditation/AccreditationHero';
import ProcessSection from '@/components/accreditation/ProcessSection';
import ApplicationCTA from '@/components/accreditation/ApplicationCTA';

export const metadata = {
  title: 'Accreditation - IBMP',
  description: 'Apply for IBMP accreditation for your medical education programs. Globally recognized standards and streamlined process.',
};

export default function AccreditationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <AccreditationHero />
        <ProcessSection />
        <ApplicationCTA />
      </main>
      <Footer />
    </div>
  );
}
