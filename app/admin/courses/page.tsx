'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useContent } from '@/lib/content-context';
import { Course } from '@/lib/content-data';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Search,
  Stethoscope,
  Heart,
  Crown,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type CategoryType = 'medicalSpecialties' | 'superSpecialties' | 'honoraryFellowship';

const categoryLabels: Record<CategoryType, string> = {
  medicalSpecialties: 'Medical Specialties',
  superSpecialties: 'Super Specialties',
  honoraryFellowship: 'Honorary Fellowship',
};

const categoryIcons: Record<CategoryType, typeof Stethoscope> = {
  medicalSpecialties: Stethoscope,
  superSpecialties: Heart,
  honoraryFellowship: Crown,
};

const categoryColors: Record<CategoryType, string> = {
  medicalSpecialties: 'from-blue-500 to-blue-600',
  superSpecialties: 'from-secondary to-secondary-700',
  honoraryFellowship: 'from-amber-500 to-amber-600',
};

export default function CoursesAdminPage() {
  const { content, updateContent, saveContent, isSaving } = useContent();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('medicalSpecialties');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');

  const courses = content.courses[activeCategory];
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    try {
      await saveContent();
      alert('Courses saved successfully!');
    } catch {
      alert('Error saving courses. Please try again.');
    }
  };

  const handleAddCourse = () => {
    const categoryMapping: Record<CategoryType, Course['category']> = {
      medicalSpecialties: 'medical-specialties',
      superSpecialties: 'super-specialties',
      honoraryFellowship: 'honorary-fellowship',
    };

    const newCourse: Course = {
      id: `${activeCategory.substring(0, 2)}-${Date.now()}`,
      slug: '',
      name: '',
      shortDescription: '',
      fullDescription: '',
      category: categoryMapping[activeCategory],
      duration: '12 Months',
      credential: 'FIBMP',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      eligibility: [''],
      curriculum: [{ module: '', topics: [''] }],
      learningOutcomes: [''],
      assessmentMethods: [''],
      careerOpportunities: [''],
      isActive: true,
    };
    setEditingCourse(newCourse);
    setIsAddingNew(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse({ ...course });
    setIsAddingNew(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      const updatedCourses = courses.filter((c) => c.id !== courseId);
      updateContent('courses', {
        ...content.courses,
        [activeCategory]: updatedCourses,
      });
    }
  };

  const handleToggleActive = (courseId: string) => {
    const updatedCourses = courses.map((c) =>
      c.id === courseId ? { ...c, isActive: !c.isActive } : c
    );
    updateContent('courses', {
      ...content.courses,
      [activeCategory]: updatedCourses,
    });
  };

  const handleSaveCourse = () => {
    if (!editingCourse) return;

    // Generate slug from name if not provided
    if (!editingCourse.slug) {
      editingCourse.slug = editingCourse.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    if (isAddingNew) {
      updateContent('courses', {
        ...content.courses,
        [activeCategory]: [...courses, editingCourse],
      });
    } else {
      const updatedCourses = courses.map((c) =>
        c.id === editingCourse.id ? editingCourse : c
      );
      updateContent('courses', {
        ...content.courses,
        [activeCategory]: updatedCourses,
      });
    }
    setEditingCourse(null);
    setIsAddingNew(false);
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setIsAddingNew(false);
  };

  // Helper functions for array fields
  const updateArrayField = (field: keyof Course, index: number, value: string) => {
    if (!editingCourse) return;
    const arr = [...(editingCourse[field] as string[])];
    arr[index] = value;
    setEditingCourse({ ...editingCourse, [field]: arr });
  };

  const addArrayItem = (field: keyof Course) => {
    if (!editingCourse) return;
    const arr = [...(editingCourse[field] as string[]), ''];
    setEditingCourse({ ...editingCourse, [field]: arr });
  };

  const removeArrayItem = (field: keyof Course, index: number) => {
    if (!editingCourse) return;
    const arr = (editingCourse[field] as string[]).filter((_, i) => i !== index);
    setEditingCourse({ ...editingCourse, [field]: arr });
  };

  // Curriculum helpers
  const updateCurriculumModule = (index: number, module: string) => {
    if (!editingCourse) return;
    const curriculum = [...editingCourse.curriculum];
    curriculum[index] = { ...curriculum[index], module };
    setEditingCourse({ ...editingCourse, curriculum });
  };

  const updateCurriculumTopic = (moduleIndex: number, topicIndex: number, topic: string) => {
    if (!editingCourse) return;
    const curriculum = [...editingCourse.curriculum];
    const topics = [...curriculum[moduleIndex].topics];
    topics[topicIndex] = topic;
    curriculum[moduleIndex] = { ...curriculum[moduleIndex], topics };
    setEditingCourse({ ...editingCourse, curriculum });
  };

  const addCurriculumModule = () => {
    if (!editingCourse) return;
    const curriculum = [...editingCourse.curriculum, { module: '', topics: [''] }];
    setEditingCourse({ ...editingCourse, curriculum });
  };

  const removeCurriculumModule = (index: number) => {
    if (!editingCourse) return;
    const curriculum = editingCourse.curriculum.filter((_, i) => i !== index);
    setEditingCourse({ ...editingCourse, curriculum });
  };

  const addCurriculumTopic = (moduleIndex: number) => {
    if (!editingCourse) return;
    const curriculum = [...editingCourse.curriculum];
    curriculum[moduleIndex] = {
      ...curriculum[moduleIndex],
      topics: [...curriculum[moduleIndex].topics, ''],
    };
    setEditingCourse({ ...editingCourse, curriculum });
  };

  const removeCurriculumTopic = (moduleIndex: number, topicIndex: number) => {
    if (!editingCourse) return;
    const curriculum = [...editingCourse.curriculum];
    curriculum[moduleIndex] = {
      ...curriculum[moduleIndex],
      topics: curriculum[moduleIndex].topics.filter((_, i) => i !== topicIndex),
    };
    setEditingCourse({ ...editingCourse, curriculum });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-primary">Course Management</h1>
            <p className="text-gray-600">Add, edit, and manage fellowship courses</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save All Changes
        </button>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(categoryLabels) as CategoryType[]).map((category) => {
            const Icon = categoryIcons[category];
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${categoryColors[category]} text-white shadow-lg`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {categoryLabels[category]}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    isActive ? 'bg-white/20' : 'bg-gray-200'
                  }`}
                >
                  {content.courses[category].length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Add */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <button
          onClick={handleAddCourse}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Course
        </button>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Course</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Duration</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Credential</th>
                <th className="text-center px-6 py-4 font-semibold text-gray-700">Status</th>
                <th className="text-center px-6 py-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    {searchQuery
                      ? 'No courses match your search.'
                      : 'No courses in this category yet. Click "Add New Course" to create one.'}
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg bg-cover bg-center"
                          style={{ backgroundImage: `url(${course.image})` }}
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{course.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {course.shortDescription}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{course.duration}</td>
                    <td className="px-6 py-4 text-gray-600">{course.credential}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(course.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          course.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {course.isActive ? (
                          <>
                            <Eye className="w-4 h-4" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <Link
                          href={`/programs/courses/${course.slug}`}
                          target="_blank"
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">
                {isAddingNew ? 'Add New Course' : 'Edit Course'}
              </h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information Section */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('basic')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Basic Information</span>
                  {expandedSection === 'basic' ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSection === 'basic' && (
                  <div className="p-4 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Course Name *
                        </label>
                        <input
                          type="text"
                          value={editingCourse.name}
                          onChange={(e) =>
                            setEditingCourse({ ...editingCourse, name: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., Internal Medicine"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL Slug (auto-generated if empty)
                        </label>
                        <input
                          type="text"
                          value={editingCourse.slug}
                          onChange={(e) =>
                            setEditingCourse({ ...editingCourse, slug: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., internal-medicine"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description *
                      </label>
                      <input
                        type="text"
                        value={editingCourse.shortDescription}
                        onChange={(e) =>
                          setEditingCourse({ ...editingCourse, shortDescription: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Brief description for cards"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Description *
                      </label>
                      <textarea
                        value={editingCourse.fullDescription}
                        onChange={(e) =>
                          setEditingCourse({ ...editingCourse, fullDescription: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Detailed program description"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={editingCourse.duration}
                          onChange={(e) =>
                            setEditingCourse({ ...editingCourse, duration: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., 12 Months"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Credential
                        </label>
                        <input
                          type="text"
                          value={editingCourse.credential}
                          onChange={(e) =>
                            setEditingCourse({ ...editingCourse, credential: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., FIBMP"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={editingCourse.image}
                          onChange={(e) =>
                            setEditingCourse({ ...editingCourse, image: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Image URL"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Eligibility Section */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('eligibility')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Eligibility Requirements</span>
                  {expandedSection === 'eligibility' ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSection === 'eligibility' && (
                  <div className="p-4 space-y-2">
                    {editingCourse.eligibility.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateArrayField('eligibility', index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Eligibility requirement"
                        />
                        <button
                          onClick={() => removeArrayItem('eligibility', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('eligibility')}
                      className="flex items-center gap-1 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Requirement
                    </button>
                  </div>
                )}
              </div>

              {/* Curriculum Section */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('curriculum')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Curriculum</span>
                  {expandedSection === 'curriculum' ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSection === 'curriculum' && (
                  <div className="p-4 space-y-4">
                    {editingCourse.curriculum.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <input
                            type="text"
                            value={module.module}
                            onChange={(e) => updateCurriculumModule(moduleIndex, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-medium"
                            placeholder="Module name"
                          />
                          <button
                            onClick={() => removeCurriculumModule(moduleIndex)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="pl-4 space-y-2">
                          {module.topics.map((topic, topicIndex) => (
                            <div key={topicIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={topic}
                                onChange={(e) =>
                                  updateCurriculumTopic(moduleIndex, topicIndex, e.target.value)
                                }
                                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                                placeholder="Topic"
                              />
                              <button
                                onClick={() => removeCurriculumTopic(moduleIndex, topicIndex)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addCurriculumTopic(moduleIndex)}
                            className="text-xs text-primary hover:underline"
                          >
                            + Add Topic
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addCurriculumModule}
                      className="flex items-center gap-1 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Module
                    </button>
                  </div>
                )}
              </div>

              {/* Learning Outcomes Section */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('outcomes')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Learning Outcomes</span>
                  {expandedSection === 'outcomes' ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSection === 'outcomes' && (
                  <div className="p-4 space-y-2">
                    {editingCourse.learningOutcomes.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            updateArrayField('learningOutcomes', index, e.target.value)
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Learning outcome"
                        />
                        <button
                          onClick={() => removeArrayItem('learningOutcomes', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('learningOutcomes')}
                      className="flex items-center gap-1 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Outcome
                    </button>
                  </div>
                )}
              </div>

              {/* Assessment Methods Section */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('assessment')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Assessment Methods</span>
                  {expandedSection === 'assessment' ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSection === 'assessment' && (
                  <div className="p-4 space-y-2">
                    {editingCourse.assessmentMethods.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            updateArrayField('assessmentMethods', index, e.target.value)
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Assessment method"
                        />
                        <button
                          onClick={() => removeArrayItem('assessmentMethods', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('assessmentMethods')}
                      className="flex items-center gap-1 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Method
                    </button>
                  </div>
                )}
              </div>

              {/* Career Opportunities Section */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('career')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Career Opportunities</span>
                  {expandedSection === 'career' ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSection === 'career' && (
                  <div className="p-4 space-y-2">
                    {editingCourse.careerOpportunities.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            updateArrayField('careerOpportunities', index, e.target.value)
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Career opportunity"
                        />
                        <button
                          onClick={() => removeArrayItem('careerOpportunities', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('careerOpportunities')}
                      className="flex items-center gap-1 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Opportunity
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCourse}
                className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                {isAddingNew ? 'Add Course' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
