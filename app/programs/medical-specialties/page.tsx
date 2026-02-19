import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MedicalSpecialtiesListNew from '@/components/programs/MedicalSpecialtiesListNew';

export const metadata = {
  title: 'Fellowship in Medical Specialties - IBMP',
  description: 'Explore IBMP Fellowship programs in core medical specialties including internal medicine, surgery, pediatrics, and more.',
};

export default function MedicalSpecialtiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <MedicalSpecialtiesListNew />
      </main>
      <Footer />
    </div>
  );
}
