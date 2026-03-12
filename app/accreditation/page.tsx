import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccreditationHero from '@/components/accreditation/AccreditationHero';
import GuidelinesSection from '@/components/accreditation/GuidelinesSection';
import ApplicationCTA from '@/components/accreditation/ApplicationCTA';

export const metadata: Metadata = {
  title: 'International Medical Accreditation | IBMP Accreditation Programs',
  description: 'IBMP provides international medical accreditation for healthcare institutions and medical education providers to ensure quality standards and global credibility.',
  alternates: {
    canonical: 'https://www.ibmpractitioner.us/accreditation/',
  },
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
