import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseDetail from '@/components/programs/CourseDetail';
import { Course, defaultContent } from '@/lib/content-data';
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

let cachedContent: typeof defaultContent | null = null;

// Function to load content from file
async function loadContent() {
  if (cachedContent) {
    return cachedContent;
  }

  try {
    const contentPath = path.join(process.cwd(), 'data', 'content.json');
    const fileContent = await fs.readFile(contentPath, 'utf-8');
    cachedContent = JSON.parse(fileContent);
    return cachedContent;
  } catch (error) {
    const fsError = error as NodeJS.ErrnoException;

    // Missing file is expected in some deployments - silently use defaults.
    if (fsError?.code !== 'ENOENT') {
      console.warn('Unable to read data/content.json. Using default content fallback.', fsError);
    }

    cachedContent = defaultContent;
    return cachedContent;
  }
}

// Function to find course by slug across all categories
async function findCourseBySlug(slug: string): Promise<Course | null> {
  const content = await loadContent();
  const courses = content?.courses;

  if (!courses) {
    return null;
  }
  
  // Search in medical specialties
  const medicalSpecialty = courses.medicalSpecialties.find(
    (course: Course) => course.slug === slug
  );
  if (medicalSpecialty) return medicalSpecialty;

  // Search in super specialties
  const superSpecialty = courses.superSpecialties.find(
    (course: Course) => course.slug === slug
  );
  if (superSpecialty) return superSpecialty;

  // Search in honorary fellowship
  const honoraryFellowship = courses.honoraryFellowship.find(
    (course: Course) => course.slug === slug
  );
  if (honoraryFellowship) return honoraryFellowship;

  return null;
}

// Generate static params for all active courses
export async function generateStaticParams() {
  const content = await loadContent();
  const courses = content?.courses;

  if (!courses) {
    return [];
  }
  
  const allCourses = [
    ...courses.medicalSpecialties,
    ...courses.superSpecialties,
    ...courses.honoraryFellowship
  ];

  return allCourses
    .filter((course: Course) => course.isActive)
    .map((course: Course) => ({
      slug: course.slug,
    }));
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