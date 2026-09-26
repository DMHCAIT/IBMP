import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HonoraryFellowshipContentUpdated from '@/components/programs/HonoraryFellowshipContentUpdated';

export const metadata = {
  title: 'Honorary Fellowship - IBMP',
  description: 'IBMP Honorary Fellowship - Recognising distinguished contributions to medicine. Discover three fellowship categories and the nomination process.',
};

export default function HonoraryFellowshipPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HonoraryFellowshipContentUpdated />
      </main>
      <Footer />
    </div>
  );
}
