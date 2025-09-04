import React from 'react';
import { Bell, Mail, Smartphone, Clock, Calendar } from 'lucide-react';
import { NotificationSettings } from '../../types';

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onUpdate: (settings: NotificationSettings) => void;
  onRequestPermission: () => Promise<NotificationPermission>;
  permission: NotificationPermission;
}

const NotificationSettingsComponent: React.FC<NotificationSettingsProps> = ({
  settings,
  onUpdate,
  onRequestPermission,
  permission,
}) => {
  const handleToggle = (key: keyof NotificationSettings, value: boolean | number) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <Bell className="mr-3 text-indigo-600" size={32} />
          Notification Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Customize how and when you receive notifications</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
        {/* Permission Status */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Browser Notifications</h2>
          <div className="flex items-center justify-between flex-col sm:flex-row space-y-4 sm:space-y-0">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Browser notification permission</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Status: <span className={`font-medium ${
                  permission === 'granted' ? 'text-green-600' : 
                  permission === 'denied' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {permission === 'granted' ? 'Enabled' : 
                   permission === 'denied' ? 'Blocked' : 'Not requested'}
                </span>
              </p>
            </div>
            {permission !== 'granted' && (
              <button
                onClick={onRequestPermission}
                className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto"
              >
                Enable Notifications
              </button>
            )}
          </div>
        </div>

        {/* Notification Types */}
        <div className="p-4 sm:p-6 space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notification Types</h3>
            
            <div className="space-y-4">
              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="text-indigo-600" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">Push Notifications</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Receive notifications in your browser</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.push_notifications}
                    onChange={(e) => handleToggle('push_notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="text-emerald-600" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">Email Notifications</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email_notifications}
                    onChange={(e) => handleToggle('email_notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Class Reminders */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Class Reminders</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">Class Reminders</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Get notified before your classes start</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.class_reminders}
                    onChange={(e) => handleToggle('class_reminders', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {settings.class_reminders && (
                <div className="pl-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reminder Time
                  </label>
                  <select
                    value={settings.reminder_time}
                    onChange={(e) => handleToggle('reminder_time', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value={5}>5 minutes before</option>
                    <option value={15}>15 minutes before</option>
                    <option value={30}>30 minutes before</option>
                    <option value={60}>1 hour before</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Reminders */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Assignment Reminders</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-orange-600" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">Assignment Deadlines</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Get notified about upcoming due dates</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.assignment_reminders}
                    onChange={(e) => handleToggle('assignment_reminders', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>

              {settings.assignment_reminders && (
                <div className="pl-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reminder Days Before Due Date
                  </label>
                  <select
                    value={settings.assignment_reminder_days}
                    onChange={(e) => handleToggle('assignment_reminder_days', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value={1}>1 day before</option>
                    <option value={2}>2 days before</option>
                    <option value={3}>3 days before</option>
                    <option value={7}>1 week before</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsComponent;