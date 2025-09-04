import React from 'react';
import { Clock, BookOpen, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Course, ClassSchedule, Assignment } from '../../types';

interface DashboardOverviewProps {
  courses: Course[];
  schedules: ClassSchedule[];
  assignments: Assignment[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  courses, 
  schedules, 
  assignments 
}) => {
  const todaySchedules = schedules.filter(schedule => {
    const today = new Date().getDay();
    return schedule.day_of_week === today;
  });

  const upcomingAssignments = assignments
    .filter(a => !a.completed && new Date(a.due_date) > new Date())
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 3);

  const completedAssignments = assignments.filter(a => a.completed);
  const averageProgress = courses.reduce((sum, course) => sum + course.progress, 0) / courses.length || 0;

  const stats = [
    { 
      label: 'Active Courses', 
      value: courses.length, 
      icon: BookOpen, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Today\'s Classes', 
      value: todaySchedules.length, 
      icon: Clock, 
      color: 'bg-emerald-500' 
    },
    { 
      label: 'Completed Tasks', 
      value: completedAssignments.length, 
      icon: CheckCircle, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Average Progress', 
      value: `${Math.round(averageProgress)}%`, 
      icon: TrendingUp, 
      color: 'bg-purple-500' 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your academic overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Schedule & Upcoming Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Classes */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="mr-2 text-indigo-600" size={20} />
            Today's Classes
          </h2>
          {todaySchedules.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No classes scheduled for today</p>
          ) : (
            <div className="space-y-3">
              {todaySchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{schedule.course?.name}</h3>
                    <p className="text-sm text-gray-600">{schedule.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-indigo-600">
                      {schedule.start_time} - {schedule.end_time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="mr-2 text-orange-600" size={20} />
            Upcoming Assignments
          </h2>
          {upcomingAssignments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming assignments</p>
          ) : (
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">{assignment.course?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.priority === 'high' 
                        ? 'bg-red-100 text-red-800'
                        : assignment.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {assignment.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;