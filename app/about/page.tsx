import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutHero from '@/components/about/AboutHero';
import BoardSection from '@/components/about/BoardSection';
import ValuesSection from '@/components/about/ValuesSection';

export const metadata = {
  title: 'About Us - IBMP',
  description: 'Learn about the International Board of Medical Practitioners, our mission, vision, board of directors, and core values.',
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
