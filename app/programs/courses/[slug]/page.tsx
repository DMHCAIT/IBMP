import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseDetail from '@/components/programs/CourseDetail';
import { Course } from '@/lib/content-data';
import { promises as fs } from 'fs';
import path from 'path';

interface CoursePageProps {
  params: {
    slug: string;
  };
}

// Allow dynamic params in development
export const dynamicParams = true;

// Revalidate every hour to get latest content
export const revalidate = 3600;

// Function to load content from file
async function loadContent() {
  try {
    const contentPath = path.join(process.cwd(), 'data', 'content.json');
    const fileContent = await fs.readFile(contentPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error loading content:', error);
    // Fallback to default content if file doesn't exist
    const { defaultContent } = await import('@/lib/content-data');
    return defaultContent;
  }
}

// Function to find course by slug across all categories
async function findCourseBySlug(slug: string): Promise<Course | null> {
  const content = await loadContent();
  
  // Search in medical specialties
  const medicalSpecialty = content.courses.medicalSpecialties.find(
    (course: Course) => course.slug === slug
  );
  if (medicalSpecialty) return medicalSpecialty;

  // Search in super specialties
  const superSpecialty = content.courses.superSpecialties.find(
    (course: Course) => course.slug === slug
  );
  if (superSpecialty) return superSpecialty;

  // Search in honorary fellowship
  const honoraryFellowship = content.courses.honoraryFellowship.find(
    (course: Course) => course.slug === slug
  );
  if (honoraryFellowship) return honoraryFellowship;

  return null;
}

// Generate static params for all active courses
export async function generateStaticParams() {
  const content = await loadContent();
  
  const allCourses = [
    ...content.courses.medicalSpecialties,
    ...content.courses.superSpecialties,
    ...content.courses.honoraryFellowship
  ];

  const params = allCourses
    .filter((course: Course) => course.isActive)
    .map((course: Course) => ({
      slug: course.slug,
    }));

  // Log for debugging during build
  console.log('Generated static params:', params.map(p => p.slug));

  return params;
}

// Generate metadata for the course
export async function generateMetadata({ params }: CoursePageProps) {
  const course = await findCourseBySlug(params.slug);
  
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

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await findCourseBySlug(params.slug);

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