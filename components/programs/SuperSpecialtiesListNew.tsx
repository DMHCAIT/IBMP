'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  Heart, 
  ArrowLeft, 
  CheckCircle,
  GraduationCap,
  Clock,
  Award
} from 'lucide-react';
import { useContent } from '@/lib/content-context';
import CourseCard from './CourseCard';

export default function SuperSpecialtiesListNew() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { content, isLoading } = useContent();
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';
  const [localSearchQuery, setLocalSearchQuery] = useState(urlSearchQuery);

  const allCourses = content.courses.superSpecialties.filter(c => c.isActive);

  // Filter courses based on search query
  const courses = useMemo(() => {
    if (!localSearchQuery.trim()) {
      return allCourses;
    }
    return allCourses.filter(course =>
      course.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      course.fullDescription?.toLowerCase().includes(localSearchQuery.toLowerCase())
    );
  }, [localSearchQuery, allCourses]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-8 bg-gradient-to-br from-secondary via-secondary-700 to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80"
            alt="Super Specialties"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 via-secondary-700/90 to-primary/80" />

        <div className="container-custom relative z-10">
          <Link 
            href="/programs" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Programs
          </Link>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-full mb-6 border border-white/30"
            >
              <Heart className="w-4 h-4" />
              <span>{courses.length} Super Specialties Available</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6"
            >
              Fellowship in <span className="text-secondary-200">Super Specialties</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-white/90 leading-relaxed"
            >
              Advanced subspecialty fellowships for physicians seeking deep expertise in focused areas of medicine, building upon core specialty training.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-6"
          >
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-secondary-200" />
              <span>12-24 Month Programs</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Award className="w-5 h-5 text-secondary-200" />
              <span>FIBMP Subspecialty Credential</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <GraduationCap className="w-5 h-5 text-secondary-200" />
              <span>Advanced Clinical Training</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-gray-50" ref={ref}>
        <div className="container-custom">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="Search super specialties..."
                className="w-full px-6 py-4 pl-14 bg-white rounded-full border-2 border-gray-300 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-teal-100 text-lg transition-all shadow-md"
              />
              <svg
                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {localSearchQuery && (
                <button
                  onClick={() => setLocalSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-xl"
                >
                  ✕
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Available Super Specialty Programs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Click on any program to learn more about eligibility, curriculum, and how to apply.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              {localSearchQuery ? (
                <>
                  <p className="text-gray-500 text-lg mb-4">
                    No super specialties found matching &quot;{localSearchQuery}&quot;
                  </p>
                  <button
                    onClick={() => setLocalSearchQuery('')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-700 transition-colors"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <p className="text-gray-500 text-lg">
                  No super specialty programs are currently available. Please check back later.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Super Specialty Eligibility Requirements
              </h2>
              <p className="text-gray-600">
                Super specialty fellowships require completion of core specialty training:
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "MD/MBBS or equivalent medical degree",
                "Completed residency in relevant specialty",
                "Valid specialty board certification or equivalent",
                "Minimum 2 years post-residency experience",
                "Research experience preferred",
                "Strong recommendation from specialty supervisors"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-secondary/10 rounded-xl"
                >
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary to-primary">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Take Your Expertise to the Next Level
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join elite physicians who have advanced their careers with IBMP super specialty fellowships.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/accreditation"
                className="px-8 py-4 bg-white text-secondary font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Apply Now
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
