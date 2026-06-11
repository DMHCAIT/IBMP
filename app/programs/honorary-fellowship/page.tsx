import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HonoraryFellowshipContentNew from '@/components/programs/HonoraryFellowshipContentNew';

export const metadata = {
  title: 'Honorary Fellowship - IBMP',
  description: 'IBMP Honorary Fellowship - Prestigious recognition awarded for exceptional contributions to medicine, healthcare leadership, and medical education.',
};

export default function HonoraryFellowshipPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HonoraryFellowshipContentNew />
      </main>
      <Footer />
    </div>
  );
}
