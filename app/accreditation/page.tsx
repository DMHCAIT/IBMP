import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccreditationHero from '@/components/accreditation/AccreditationHero';
import GuidelinesSection from '@/components/accreditation/GuidelinesSection';
import ApplicationCTA from '@/components/accreditation/ApplicationCTA';

export const metadata = {
  title: 'Accreditation Guidelines - IBMP',
  description: 'IBMP accreditation guidelines for medical education providers. Learn about eligibility criteria, application process, course requirements, and renewal procedures.',
};

export default function AccreditationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <AccreditationHero />
        <GuidelinesSection />
        <ApplicationCTA />
      </main>
      <Footer />
    </div>
  );
}
