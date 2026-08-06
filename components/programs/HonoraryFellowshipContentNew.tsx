'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  Star, 
  ArrowLeft, 
  CheckCircle,
  Award,
  Globe,
  Crown
} from 'lucide-react';
import { useContent } from '@/lib/content-context';
import CourseCard from './CourseCard';

export default function HonoraryFellowshipContentNew() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { content, isLoading } = useContent();
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';
  const [localSearchQuery, setLocalSearchQuery] = useState(urlSearchQuery);

  const allCourses = content.courses.honoraryFellowship.filter(c => c.isActive);

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
      <section className="relative py-8 bg-gradient-to-br from-yellow-600 via-amber-700 to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80"
            alt="Honorary Fellowship"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/80 via-amber-700/90 to-primary/80" />

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
              <Crown className="w-4 h-4" />
              <span>Prestigious Recognition</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6"
            >
              <span className="text-yellow-200">Honorary</span> Fellowship
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-white/90 leading-relaxed"
            >
              The IBMP Honorary Fellowship recognizes distinguished physicians who have made exceptional contributions to medicine, healthcare leadership, research, or humanitarian service over a distinguished career.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-6"
          >
            <div className="flex items-center gap-2 text-white">
              <Award className="w-5 h-5 text-yellow-200" />
              <span>Lifetime Recognition</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Star className="w-5 h-5 text-yellow-200" />
              <span>Hon. FIBMP Credential</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Globe className="w-5 h-5 text-yellow-200" />
              <span>International Prestige</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fellowship Types Grid */}
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
                placeholder="Search honorary fellowships..."
                className="w-full px-6 py-4 pl-14 bg-white rounded-full border-2 border-gray-300 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 text-lg transition-all shadow-md"
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
              Honorary Fellowship Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Click on any category to learn more about the nomination process and eligibility criteria.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
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
                    No honorary fellowships found matching &quot;{localSearchQuery}&quot;
                  </p>
                  <button
                    onClick={() => setLocalSearchQuery('')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <p className="text-gray-500 text-lg">
                  No honorary fellowship categories are currently available. Please check back later.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Nomination Process */}
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
                Nomination Process
              </h2>
              <p className="text-gray-600">
                Honorary Fellowships are awarded through a nomination process:
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Nomination by existing IBMP Fellow or institution",
                "Distinguished career spanning 15+ years",
                "Significant contributions to medical field",
                "Leadership in healthcare organizations",
                "Recognition by peers and professional bodies",
                "Review and approval by IBMP Board"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl"
                >
                  <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Benefits of Honorary Fellowship
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Crown,
                title: "Prestigious Recognition",
                description: "Join an elite group of distinguished medical professionals recognized for their exceptional contributions."
              },
              {
                icon: Globe,
                title: "Global Network",
                description: "Connect with leading physicians, researchers, and healthcare leaders worldwide."
              },
              {
                icon: Star,
                title: "Advisory Opportunities",
                description: "Participate in advisory boards, mentorship programs, and speaking engagements."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center mb-4">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-primary">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nominate a Distinguished Colleague
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Know a physician who deserves recognition? Submit a nomination for Honorary Fellowship.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-amber-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Submit Nomination
              </Link>
              <Link
                href="/programs"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-colors"
              >
                Explore All Programs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
