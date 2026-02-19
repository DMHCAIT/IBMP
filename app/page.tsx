import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import WhatWeDoSection from '@/components/home/WhatWeDoSection';
import MissionVisionSection from '@/components/home/MissionVisionSection';
import StatsSection from '@/components/home/StatsSection';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <WhatWeDoSection />
        <MissionVisionSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
