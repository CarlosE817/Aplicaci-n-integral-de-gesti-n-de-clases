import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNotifications } from './hooks/useNotifications';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import Sidebar from './components/Layout/Sidebar';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import ScheduleManager from './components/Schedule/ScheduleManager';
import CalendarView from './components/Calendar/CalendarView';
import AssignmentManager from './components/Assignments/AssignmentManager';
import CourseManager from './components/Courses/CourseManager';
import NotificationSettingsComponent from './components/Settings/NotificationSettings';
import { Course, ClassSchedule, Assignment } from './types';
import { mockCourses, mockSchedules, mockAssignments, generateCalendarEvents } from './data/mockData';

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', mockCourses);
  const [schedules, setSchedules] = useLocalStorage<ClassSchedule[]>('schedules', mockSchedules);
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>('assignments', mockAssignments);
  
  const { 
    permission, 
    settings, 
    setSettings, 
    requestPermission, 
    scheduleClassReminder 
  } = useNotifications();

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Course operations
  const handleAddCourse = (courseData: Omit<Course, 'id' | 'created_at' | 'user_id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: generateId(),
      created_at: new Date().toISOString(),
      user_id: user?.id || '1',
    };
    setCourses([...courses, newCourse]);
  };

  const handleEditCourse = (id: string, courseData: Omit<Course, 'id' | 'created_at' | 'user_id'>) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, ...courseData } : course
    ));
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    setSchedules(schedules.filter(schedule => schedule.course_id !== id));
    setAssignments(assignments.filter(assignment => assignment.course_id !== id));
  };

  // Schedule operations
  const handleAddSchedule = (scheduleData: Omit<ClassSchedule, 'id' | 'created_at' | 'user_id'>) => {
    const course = courses.find(c => c.id === scheduleData.course_id);
    const newSchedule: ClassSchedule = {
      ...scheduleData,
      id: generateId(),
      course,
      created_at: new Date().toISOString(),
      user_id: user?.id || '1',
    };
    setSchedules([...schedules, newSchedule]);

    // Schedule notification for next occurrence
    const nextClassDate = getNextClassDate(scheduleData.day_of_week, scheduleData.start_time);
    if (nextClassDate && course) {
      scheduleClassReminder(course.name, nextClassDate, scheduleData.location);
    }
  };

  const handleEditSchedule = (id: string, scheduleData: Omit<ClassSchedule, 'id' | 'created_at' | 'user_id'>) => {
    const course = courses.find(c => c.id === scheduleData.course_id);
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, ...scheduleData, course } : schedule
    ));
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  // Assignment operations
  const handleAddAssignment = (assignmentData: Omit<Assignment, 'id' | 'created_at' | 'user_id'>) => {
    const course = courses.find(c => c.id === assignmentData.course_id);
    const newAssignment: Assignment = {
      ...assignmentData,
      id: generateId(),
      course,
      created_at: new Date().toISOString(),
      user_id: user?.id || '1',
    };
    setAssignments([...assignments, newAssignment]);
  };

  const handleEditAssignment = (id: string, assignmentData: Omit<Assignment, 'id' | 'created_at' | 'user_id'>) => {
    const course = courses.find(c => c.id === assignmentData.course_id);
    setAssignments(assignments.map(assignment => 
      assignment.id === id ? { ...assignment, ...assignmentData, course } : assignment
    ));
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  const handleToggleAssignmentComplete = (id: string) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id ? { ...assignment, completed: !assignment.completed } : assignment
    ));
  };

  const getNextClassDate = (dayOfWeek: number, startTime: string): Date | null => {
    const now = new Date();
    const [hours, minutes] = startTime.split(':').map(Number);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      if (date.getDay() === dayOfWeek) {
        date.setHours(hours, minutes, 0, 0);
        if (date > now) {
          return date;
        }
      }
    }
    return null;
  };

  const calendarEvents = generateCalendarEvents(schedules, assignments);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview courses={courses} schedules={schedules} assignments={assignments} />;
      case 'schedule':
        return (
          <ScheduleManager
            schedules={schedules}
            courses={courses}
            onAdd={handleAddSchedule}
            onEdit={handleEditSchedule}
            onDelete={handleDeleteSchedule}
          />
        );
      case 'courses':
        return (
          <CourseManager
            courses={courses}
            onAdd={handleAddCourse}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
          />
        );
      case 'assignments':
        return (
          <AssignmentManager
            assignments={assignments}
            courses={courses}
            onAdd={handleAddAssignment}
            onEdit={handleEditAssignment}
            onDelete={handleDeleteAssignment}
            onToggleComplete={handleToggleAssignmentComplete}
          />
        );
      case 'calendar':
        return <CalendarView events={calendarEvents} />;
      case 'notifications':
        return (
          <NotificationSettingsComponent
            settings={settings}
            onUpdate={setSettings}
            onRequestPermission={requestPermission}
            permission={permission}
          />
        );
      default:
        return <DashboardOverview courses={courses} schedules={schedules} assignments={assignments} />;
    }
  };

  if (!user) {
    return <AuthWrapper />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function AuthWrapper() {
  const [isLogin, setIsLogin] = useState(true);
  
  return isLogin ? (
    <LoginForm onToggleMode={() => setIsLogin(false)} />
  ) : (
    <SignupForm onToggleMode={() => setIsLogin(true)} />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;