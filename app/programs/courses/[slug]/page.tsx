'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useContent } from '@/lib/content-context';
import CourseDetail from '@/components/programs/CourseDetail';
import { Course } from '@/lib/content-data';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CoursePage() {
  const params = useParams();
  const { content, isLoading } = useContent();
  const [course, setCourse] = useState<Course | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isLoading && params.slug) {
      const slug = params.slug as string;
      
      // Search through all course categories
      const allCourses = [
        ...content.courses.medicalSpecialties,
        ...content.courses.superSpecialties,
        ...content.courses.honoraryFellowship
      ];
      
      const foundCourse = allCourses.find(c => c.slug === slug && c.isActive);
      
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        setNotFound(true);
      }
    }
  }, [params.slug, content.courses, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">
            The course you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
          <Link 
            href="/programs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Browse All Programs
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return <CourseDetail course={course} />;
}
