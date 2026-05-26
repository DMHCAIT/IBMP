import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SuperSpecialtiesListNew from '@/components/programs/SuperSpecialtiesListNew';

export const metadata = {
  title: 'Fellowship in Super-Specialties - IBMP',
  description: 'Explore IBMP Fellowship programs in advanced super-specialties including cardiology, gastroenterology, oncology, and more.',
};

export default function SuperSpecialtiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <SuperSpecialtiesListNew />
      </main>
      <Footer />
    </div>
  );
}
