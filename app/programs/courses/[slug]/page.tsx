import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseDetail from '@/components/programs/CourseDetail';
import { defaultContent } from '@/lib/content-data';
import { Course } from '@/lib/content-data';

interface CoursePageProps {
  params: {
    slug: string;
  };
}

// Allow dynamic params in development
export const dynamicParams = true;

// Function to find course by slug across all categories
function findCourseBySlug(slug: string): Course | null {
  // Search in medical specialties
  const medicalSpecialty = defaultContent.courses.medicalSpecialties.find(
    course => course.slug === slug
  );
  if (medicalSpecialty) return medicalSpecialty;

  // Search in super specialties
  const superSpecialty = defaultContent.courses.superSpecialties.find(
    course => course.slug === slug
  );
  if (superSpecialty) return superSpecialty;

  // Search in honorary fellowship
  const honoraryFellowship = defaultContent.courses.honoraryFellowship.find(
    course => course.slug === slug
  );
  if (honoraryFellowship) return honoraryFellowship;

  return null;
}

// Generate static params for all active courses
export async function generateStaticParams() {
  const allCourses = [
    ...defaultContent.courses.medicalSpecialties,
    ...defaultContent.courses.superSpecialties,
    ...defaultContent.courses.honoraryFellowship
  ];

  const params = allCourses
    .filter(course => course.isActive)
    .map(course => ({
      slug: course.slug,
    }));

  // Log for debugging during build
  console.log('Generated static params:', params.map(p => p.slug));

  return params;
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