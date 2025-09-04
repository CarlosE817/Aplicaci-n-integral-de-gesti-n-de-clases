import React, { useState } from 'react';
import { Plus, Edit, Trash2, Clock, MapPin, User } from 'lucide-react';
import { ClassSchedule, Course } from '../../types';
import ScheduleForm from './ScheduleForm';

interface ScheduleManagerProps {
  schedules: ClassSchedule[];
  courses: Course[];
  onAdd: (schedule: Omit<ClassSchedule, 'id' | 'created_at' | 'user_id'>) => void;
  onEdit: (id: string, schedule: Omit<ClassSchedule, 'id' | 'created_at' | 'user_id'>) => void;
  onDelete: (id: string) => void;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  schedules,
  courses,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const day = schedule.day_of_week;
    if (!acc[day]) acc[day] = [];
    acc[day].push(schedule);
    return acc;
  }, {} as Record<number, ClassSchedule[]>);

  // Sort schedules by start time within each day
  Object.keys(groupedSchedules).forEach(day => {
    groupedSchedules[parseInt(day)].sort((a, b) => a.start_time.localeCompare(b.start_time));
  });

  const handleEdit = (schedule: ClassSchedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const handleFormSubmit = (scheduleData: Omit<ClassSchedule, 'id' | 'created_at' | 'user_id'>) => {
    if (editingSchedule) {
      onEdit(editingSchedule.id, scheduleData);
    } else {
      onAdd(scheduleData);
    }
    setShowForm(false);
    setEditingSchedule(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSchedule(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Class Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your weekly class schedule</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-md text-sm sm:text-base"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add Class</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {showForm && (
        <ScheduleForm
          courses={courses}
          initialData={editingSchedule}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {daysOfWeek.map((day, index) => (
          <div key={day} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-4">
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-4 text-center border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 3)}</span>
            </h3>
            <div className="space-y-3">
              {groupedSchedules[index]?.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 rounded-lg p-3 border-l-4 border-indigo-500 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm line-clamp-2 flex-1 mr-2">
                      {schedule.course?.name}
                    </h4>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(schedule.id)}
                        className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      <span>{schedule.start_time} - {schedule.end_time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={12} className="mr-1" />
                      <span className="truncate">{schedule.location}</span>
                    </div>
                    <div className="flex items-center">
                      <User size={12} className="mr-1" />
                      <span className="truncate">{schedule.course?.instructor}</span>
                    </div>
                  </div>
                </div>
              )) || (
                <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm text-center py-4">No classes</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleManager;