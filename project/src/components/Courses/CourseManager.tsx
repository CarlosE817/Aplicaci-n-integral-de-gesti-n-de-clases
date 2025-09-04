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
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">Manage your enrolled courses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-md"
        >
          <Plus size={20} />
          <span>Add Course</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            <div 
              className="h-32 relative"
              style={{ backgroundColor: course.color }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <BookOpen size={48} className="text-white" />
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(course)}
                  className="text-white hover:text-gray-300 transition-colors bg-black bg-opacity-20 p-2 rounded-full"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(course.id)}
                  className="text-white hover:text-red-300 transition-colors bg-black bg-opacity-20 p-2 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                <p className="text-sm text-gray-500 font-medium">{course.code}</p>
                <p className="text-gray-600 mt-2 text-sm">{course.description}</p>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-4">
                <User size={14} className="mr-1" />
                <span>{course.instructor}</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-indigo-600 font-semibold">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              <button className="w-full bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 transition-colors font-medium flex items-center justify-center space-x-2">
                <TrendingUp size={16} />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full text-center py-12">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No courses added yet</p>
            <p className="text-gray-400">Add your first course to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManager;