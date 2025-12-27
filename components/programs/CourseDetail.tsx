'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Clock, 
  Award, 
  ArrowLeft, 
  CheckCircle, 
  BookOpen, 
  Target, 
  FileCheck, 
  Briefcase,
  GraduationCap,
  Users,
  Star
} from 'lucide-react';
import { Course } from '@/lib/content-data';

interface CourseDetailProps {
  course: Course;
}

export default function CourseDetail({ course }: CourseDetailProps) {
  const categoryLabels: Record<string, string> = {
    'medical-specialties': 'Medical Specialties',
    'super-specialties': 'Super Specialties',
    'honorary-fellowship': 'Honorary Fellowship'
  };

  const categoryLinks: Record<string, string> = {
    'medical-specialties': '/programs/medical-specialties',
    'super-specialties': '/programs/super-specialties',
    'honorary-fellowship': '/programs/honorary-fellowship'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${course.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-secondary/85" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link 
              href={categoryLinks[course.category]}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {categoryLabels[course.category]}</span>
            </Link>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
                {categoryLabels[course.category]}
              </span>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                {course.name}
              </h1>
              
              <p className="text-xl text-white/90 mb-8">
                {course.shortDescription}
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
                  <Clock className="w-5 h-5 text-secondary" />
                  <span className="text-white">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
                  <Award className="w-5 h-5 text-secondary" />
                  <span className="text-white">{course.credential}</span>
                </div>
              </div>
            </motion.div>
            
            {/* Right CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Apply Now</h3>
              <p className="text-gray-600 mb-6">
                Ready to advance your career with the {course.credential} credential? Start your application today.
              </p>
              
              <Link 
                href="/accreditation"
                className="block w-full py-4 px-6 bg-gradient-to-r from-primary to-secondary text-white text-center font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Start Application
              </Link>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Applications open year-round</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Flexible learning options</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>International recognition</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Program Overview</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {course.fullDescription}
                </p>
              </motion.div>
              
              {/* Curriculum */}
              {course.curriculum.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Curriculum</h2>
                  </div>
                  <div className="space-y-6">
                    {course.curriculum.map((module, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {module.module}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {module.topics.map((topic, topicIdx) => (
                            <span 
                              key={topicIdx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Learning Outcomes */}
              {course.learningOutcomes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Target className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Learning Outcomes</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Assessment Methods */}
              {course.assessmentMethods.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FileCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Assessment Methods</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {course.assessmentMethods.map((method, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg font-medium"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Career Opportunities */}
              {course.careerOpportunities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Career Opportunities</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.careerOpportunities.map((opportunity, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl"
                      >
                        <Star className="w-5 h-5 text-purple-600" />
                        <span className="text-gray-800 font-medium">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Eligibility */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Eligibility</h3>
                  </div>
                  <ul className="space-y-3">
                    {course.eligibility.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
                
                {/* Quick Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg p-6 text-white"
                >
                  <h3 className="text-lg font-bold mb-4">Program Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/20">
                      <span className="text-white/80">Duration</span>
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/20">
                      <span className="text-white/80">Credential</span>
                      <span className="font-semibold">{course.credential}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Category</span>
                      <span className="font-semibold">{categoryLabels[course.category]}</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Contact CTA */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-gray-100 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Need More Information?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Contact our admissions team for detailed program information and guidance.
                  </p>
                  <Link 
                    href="/contact"
                    className="block w-full py-3 px-4 bg-white text-primary text-center font-semibold rounded-xl border-2 border-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Take the next step in your medical career with {course.credential}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/accreditation"
                className="px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Apply Now
              </Link>
              <Link 
                href={categoryLinks[course.category]}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
              >
                View All Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
