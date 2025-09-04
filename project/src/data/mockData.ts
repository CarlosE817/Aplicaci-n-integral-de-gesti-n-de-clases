import { Course, ClassSchedule, Assignment, CalendarEvent } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Calculus Integral and Vectorial',
    code: 'MATH-201',
    description: 'Advanced calculus concepts including integral calculus and vector analysis',
    instructor: 'Dr. Maria Rodriguez',
    color: '#6366f1',
    progress: 45,
    created_at: new Date().toISOString(),
    user_id: '1',
  },
  {
    id: '2',
    name: 'Data Structures & Algorithms',
    code: 'CS-301',
    description: 'Fundamental computer science concepts and problem-solving techniques',
    instructor: 'Prof. John Smith',
    color: '#10b981',
    progress: 62,
    created_at: new Date().toISOString(),
    user_id: '1',
  },
  {
    id: '3',
    name: 'Digital Circuit Design',
    code: 'EE-250',
    description: 'Introduction to digital logic and circuit design principles',
    instructor: 'Dr. Sarah Chen',
    color: '#f59e0b',
    progress: 28,
    created_at: new Date().toISOString(),
    user_id: '1',
  },
];

export const mockSchedules: ClassSchedule[] = [
  {
    id: '1',
    course_id: '1',
    course: mockCourses[0],
    day_of_week: 1, // Monday
    start_time: '09:00',
    end_time: '10:30',
    location: 'Room 205, Math Building',
    created_at: new Date().toISOString(),
    user_id: '1',
  },
  {
    id: '2',
    course_id: '1',
    course: mockCourses[0],
    day_of_week: 3, // Wednesday
    start_time: '09:00',
    end_time: '10:30',
    location: 'Room 205, Math Building',
    created_at: new Date().toISOString(),
    user_id: '1',
  },
  {
    id: '3',
    course_id: '2',
    course: mockCourses[1],
    day_of_week: 2, // Tuesday
    start_time: '14:00',
    end_time: '15:30',
    location: 'Computer Lab 3',
    created_at: new Date().toISOString(),
    user_id: '1',
  },
  {
    id: '4',
    course_id: '2',
    course: mockCourses[1],
    day_of_week: 4, // Thursday
    start_time: '14:00',
    end_time: '15:30',
    location: 'Computer Lab 3',
    created_at: new Date().toISOString(),
    user_id: '1',
  },
  {
    id: '5',
    course_id: '3',
    course: mockCourses[2],
    day_of_week: 5, // Friday
    start_time: '11:00',
    end_time: '12:30',
    location: 'Electronics Lab',
    created_at: new Date().toISOString(),
    user_id: '1',
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    course_id: '1',
    course: mockCourses[0],
    title: 'Integration Problem Set 3',
    description: 'Complete exercises 1-15 on definite integrals and applications',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    priority: 'high',
    completed: false,
    created_at: new Date().toISOString(),
    user_id: '1',
  },
  {
    id: '2',
    course_id: '2',
    course: mockCourses[1],
    title: 'Binary Search Tree Implementation',
    description: 'Implement a BST with insert, delete, and search operations',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    priority: 'medium',
    completed: false,
    created_at: new Date().toISOString(),
    user_id: '1',
  },
  {
    id: '3',
    course_id: '3',
    course: mockCourses[2],
    title: 'Logic Gate Design Project',
    description: 'Design and simulate a 4-bit adder circuit using logic gates',
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    priority: 'low',
    completed: false,
    created_at: new Date().toISOString(),
    user_id: '1',
  },
  {
    id: '4',
    course_id: '1',
    course: mockCourses[0],
    title: 'Vector Calculus Quiz',
    description: 'Completed quiz on vector field theory and line integrals',
    due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    priority: 'medium',
    completed: true,
    created_at: new Date().toISOString(),
    user_id: '1',
  },
];

export const generateCalendarEvents = (
  schedules: ClassSchedule[],
  assignments: Assignment[]
): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const today = new Date();
  
  // Generate recurring class events for the next 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const dayOfWeek = date.getDay();
    
    const todaySchedules = schedules.filter(s => s.day_of_week === dayOfWeek);
    
    todaySchedules.forEach(schedule => {
      events.push({
        id: `${schedule.id}-${date.toISOString().split('T')[0]}`,
        title: schedule.course?.name || 'Class',
        date: date.toISOString().split('T')[0],
        time: schedule.start_time,
        type: 'class',
        color: schedule.course?.color || '#6366f1',
        course: schedule.course,
      });
    });
  }
  
  // Add assignment due dates
  assignments.forEach(assignment => {
    const dueDate = new Date(assignment.due_date);
    if (dueDate >= today) {
      events.push({
        id: `assignment-${assignment.id}`,
        title: assignment.title,
        date: dueDate.toISOString().split('T')[0],
        type: 'assignment',
        color: assignment.priority === 'high' ? '#ef4444' : 
               assignment.priority === 'medium' ? '#f59e0b' : '#22c55e',
        course: assignment.course,
      });
    }
  });
  
  return events;
};