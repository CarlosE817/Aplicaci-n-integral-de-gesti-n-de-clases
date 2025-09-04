export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  instructor: string;
  color: string;
  progress: number;
  created_at: string;
  user_id: string;
}

export interface ClassSchedule {
  id: string;
  course_id: string;
  course?: Course;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string;
  end_time: string;
  location: string;
  created_at: string;
  user_id: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  course?: Course;
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
  user_id: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  class_reminders: boolean;
  reminder_time: number; // minutes before class
  assignment_reminders: boolean;
  assignment_reminder_days: number; // days before due date
  email_notifications: boolean;
  push_notifications: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'class' | 'assignment' | 'exam';
  color: string;
  course?: Course;
}