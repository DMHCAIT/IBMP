import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseDetail from '@/components/programs/CourseDetail';
import { content } from '@/lib/content-data';
import { Course } from '@/lib/content-data';

interface CoursePageProps {
  params: {
    slug: string;
  };
}

// Function to find course by slug across all categories
function findCourseBySlug(slug: string): Course | null {
  // Search in medical specialties
  const medicalSpecialty = content.courses.medicalSpecialties.find(
    course => course.slug === slug && course.isActive
  );
  if (medicalSpecialty) return medicalSpecialty;

  // Search in super specialties
  const superSpecialty = content.courses.superSpecialties.find(
    course => course.slug === slug && course.isActive
  );
  if (superSpecialty) return superSpecialty;

  // Search in honorary fellowship
  const honoraryFellowship = content.courses.honoraryFellowship.find(
    course => course.slug === slug && course.isActive
  );
  if (honoraryFellowship) return honoraryFellowship;

  return null;
}

// Generate static params for all active courses
export async function generateStaticParams() {
  const allCourses = [
    ...content.courses.medicalSpecialties,
    ...content.courses.superSpecialties,
    ...content.courses.honoraryFellowship
  ];

  return allCourses
    .filter(course => course.isActive)
    .map(course => ({
      slug: course.slug,
    }));
}

// Generate metadata for the course
export async function generateMetadata({ params }: CoursePageProps) {
  const course = findCourseBySlug(params.slug);
  
  if (!course) {
    return {
      title: 'Course Not Found - IBMP',
    };
  }

  return {
    title: `${course.name} - IBMP Certification Program`,
    description: course.shortDescription,
  };
}

export default function CoursePage({ params }: CoursePageProps) {
  const course = findCourseBySlug(params.slug);

  // If course not found, trigger 404
  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <CourseDetail course={course} />
      </main>
      <Footer />
    </div>
  );
}