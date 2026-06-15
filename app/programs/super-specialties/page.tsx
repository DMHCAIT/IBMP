import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SuperSpecialtiesListNew from '@/components/programs/SuperSpecialtiesListNew';

// Always fetch fresh content so admin course updates are reflected immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
