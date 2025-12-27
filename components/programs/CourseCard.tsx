'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, GraduationCap } from 'lucide-react';
import { Course } from '@/lib/content-data';

interface CourseCardProps {
  course: Course;
  index: number;
}

export default function CourseCard({ course, index }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/programs/courses/${course.slug}`}>
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full">
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${course.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Credential Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-secondary text-white text-xs font-semibold rounded-full">
                {course.credential}
              </span>
            </div>
            
            {/* Duration Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
              <Clock className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-gray-800">{course.duration}</span>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {course.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {course.shortDescription}
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {course.eligibility.slice(0, 2).map((item, idx) => (
                <span 
                  key={idx}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                >
                  {item.length > 30 ? item.substring(0, 30) + '...' : item}
                </span>
              ))}
            </div>
            
            {/* CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-primary">
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm font-medium">Learn More</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <ArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
          
          {/* Hover Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}
