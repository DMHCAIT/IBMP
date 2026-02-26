import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProgramsHero from '@/components/programs/ProgramsHero';
import CertificationSection from '@/components/programs/CertificationSection';
import FellowshipCategories from '@/components/programs/FellowshipCategories';
import EligibilityProcess from '@/components/programs/EligibilityProcess';
import ProgramsCTA from '@/components/programs/ProgramsCTA';

export const metadata = {
  title: 'Certification & Fellowship Programs - IBMP',
  description: 'Explore IBMP globally recognized Certification and Fellowship programs for medical doctors and healthcare practitioners across specialties and super-specialties.',
};

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <FellowshipCategories />
        <ProgramsHero />
        <CertificationSection />
        <EligibilityProcess />
        <ProgramsCTA />
      </main>
      <Footer />
    </div>
  );
}
