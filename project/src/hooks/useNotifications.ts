import { useState, useEffect } from 'react';
import { NotificationSettings } from '../types';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    id: '1',
    user_id: '1',
    class_reminders: true,
    reminder_time: 15,
    assignment_reminders: true,
    assignment_reminder_days: 1,
    email_notifications: true,
    push_notifications: true,
  });

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted' && settings.push_notifications) {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  };

  const scheduleClassReminder = (className: string, startTime: Date, location: string) => {
    if (!settings.class_reminders) return;

    const reminderTime = new Date(startTime.getTime() - settings.reminder_time * 60 * 1000);
    const now = new Date();

    if (reminderTime > now) {
      const timeoutMs = reminderTime.getTime() - now.getTime();
      setTimeout(() => {
        sendNotification(`Class Reminder: ${className}`, {
          body: `Your class starts in ${settings.reminder_time} minutes at ${location}`,
          tag: `class-${className}`,
        });
      }, timeoutMs);
    }
  };

  return {
    permission,
    settings,
    setSettings,
    requestPermission,
    sendNotification,
    scheduleClassReminder,
  };
}