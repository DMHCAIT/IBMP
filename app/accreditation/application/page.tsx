import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccreditationApplicationForm from '@/components/accreditation/AccreditationApplicationForm';

export const metadata = {
  title: 'Accreditation Application | IBMP',
  description: 'Submit your accreditation application to IBMP',
};

export default function AccreditationApplicationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container-custom">
          <AccreditationApplicationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
