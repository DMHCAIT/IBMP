import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProgramsHero from '@/components/programs/ProgramsHero';
import CertificationSection from '@/components/programs/CertificationSection';
import FellowshipCategories from '@/components/programs/FellowshipCategories';
import EligibilityProcess from '@/components/programs/EligibilityProcess';
import ProgramsCTA from '@/components/programs/ProgramsCTA';

export const metadata: Metadata = {
  title: 'IBMP Medical Fellowship Program | Advanced Healthcare Training',
  description: 'IBMP offers a wide range of medical fellowship programs and advanced healthcare training courses designed for doctors and healthcare professionals seeking specialized medical expertise and global recognition.',
  alternates: {
    canonical: 'https://www.ibmpractitioner.us/programs',
  },
};

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ProgramsHero />
        <CertificationSection />
        <FellowshipCategories />
        <EligibilityProcess />
        <ProgramsCTA />
      </main>
      <Footer />
    </div>
  );
}
