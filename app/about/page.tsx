import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutHero from '@/components/about/AboutHero';
import BoardSection from '@/components/about/BoardSection';
import ValuesSection from '@/components/about/ValuesSection';

export const metadata: Metadata = {
  title: 'About IBMP | Global Medical Education & Accreditation Authority',
  description: 'Learn about IBMP, an international organization dedicated to advancing medical education, accreditation standards, and professional recognition worldwide.',
  alternates: {
    canonical: 'https://www.ibmpractitioner.us/about/',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <AboutHero />
        <BoardSection />
        <ValuesSection />
      </main>
      <Footer />
    </div>
  );
}
