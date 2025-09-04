import React, { useState } from 'react';
import { Plus, BookOpen, TrendingUp, User, Edit, Trash2 } from 'lucide-react';
import { Course } from '../../types';
import CourseForm from './CourseForm';

interface CourseManagerProps {
  courses: Course[];
  onAdd: (course: Omit<Course, 'id' | 'created_at' | 'user_id'>) => void;
  onEdit: (id: string, course: Omit<Course, 'id' | 'created_at' | 'user_id'>) => void;
  onDelete: (id: string) => void;
}

const CourseManager: React.FC<CourseManagerProps> = ({
  courses,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleFormSubmit = (courseData: Omit<Course, 'id' | 'created_at' | 'user_id'>) => {
    if (editingCourse) {
      onEdit(editingCourse.id, courseData);
    } else {
      onAdd(courseData);
    }
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">My Courses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your enrolled courses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-md text-sm sm:text-base"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add Course</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {showForm && (
        <CourseForm
          initialData={editingCourse}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            <div 
              className="h-24 sm:h-32 relative"
              style={{ backgroundColor: course.color }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <BookOpen size={32} className="text-white sm:w-12 sm:h-12" />
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(course)}
                  className="text-white hover:text-gray-300 transition-colors bg-black bg-opacity-20 p-2 rounded-full"
                >
                  <Edit size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => onDelete(course.id)}
                  className="text-white hover:text-red-300 transition-colors bg-black bg-opacity-20 p-2 rounded-full"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{course.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{course.code}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm line-clamp-2">{course.description}</p>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                <User size={14} className="mr-1" />
                <span className="truncate">{course.instructor}</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              <button className="w-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors font-medium flex items-center justify-center space-x-2">
                <TrendingUp size={16} />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full text-center py-8 sm:py-12">
            <BookOpen className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No courses added yet</p>
            <p className="text-gray-400 dark:text-gray-500">Add your first course to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManager;