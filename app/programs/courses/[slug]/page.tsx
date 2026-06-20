import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseDetail from '@/components/programs/CourseDetail';
import { Course, defaultContent, SiteContent } from '@/lib/content-data';
import { getSupabaseServiceClient } from '@/lib/supabase';

interface CoursePageProps {
  params: {
    slug: string;
  };
}

// Allow dynamic params in development
export const dynamicParams = true;

// Always fetch fresh content so admin course updates are reflected immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Function to load content directly from Supabase database
async function loadContent(): Promise<SiteContent> {
  try {
    const supabase = getSupabaseServiceClient();
    console.log('[CourseDetail] Reading content from Supabase table: site_content');
    
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'main')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record doesn't exist, return defaults
        console.log('[CourseDetail] Content record not found, using defaults');
        return defaultContent;
      }
      throw error;
    }

    const parsed = data?.content || defaultContent;
    const merged = { ...defaultContent, ...parsed };
    console.log(`[CourseDetail] Loaded ${merged.courses?.medicalSpecialties?.length || 0} medical specialties, ${merged.courses?.superSpecialties?.length || 0} super specialties`);
    return merged;
  } catch (error) {
    console.warn('[CourseDetail] Failed to load content from Supabase. Using default content fallback.', error);
    return defaultContent;
  }
}

// Function to find course by slug across all categories
async function findCourseBySlug(slug: string): Promise<Course | null> {
  console.log(`[CourseDetail] Finding course with slug: ${slug}`);
  const content = await loadContent();
  const courses = content?.courses;

  if (!courses) {
    console.warn('[CourseDetail] No courses found in content');
    return null;
  }
  
  console.log(`[CourseDetail] Searching in ${courses.medicalSpecialties.length} medical specialties...`);
  for (const course of courses.medicalSpecialties) {
    if (course.slug === slug) {
      console.log(`[CourseDetail] Found in medical specialties: ${course.name}`);
      return course;
    }
  }

  console.log(`[CourseDetail] Searching in ${courses.superSpecialties.length} super specialties...`);
  for (const course of courses.superSpecialties) {
    if (course.slug === slug) {
      console.log(`[CourseDetail] Found in super specialties: ${course.name}`);
      return course;
    }
  }

  console.log(`[CourseDetail] Searching in ${courses.honoraryFellowship.length} honorary fellowship...`);
  for (const course of courses.honoraryFellowship) {
    if (course.slug === slug) {
      console.log(`[CourseDetail] Found in honorary fellowship: ${course.name}`);
      return course;
    }
  }

  console.warn(`[CourseDetail] Course not found with slug: ${slug}`);
  console.log(`[CourseDetail] Available medical specialty slugs:`, courses.medicalSpecialties.map(c => c.slug).slice(0, 3));
  console.log(`[CourseDetail] Available super specialty slugs:`, courses.superSpecialties.map(c => c.slug).slice(0, 3));
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