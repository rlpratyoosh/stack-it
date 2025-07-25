'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { markNotificationAsRead } from '@/lib/action';

type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: Date;
  userId: string;
};

interface NotificationBellProps {
  initialNotifications: Notification[];
}

export default function NotificationBell({ 
  initialNotifications 
}: NotificationBellProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (notificationId: string) => {
    // Optimistically update the UI
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    
    // Call the server action
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert the optimistic update on error
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: false } : n
        )
      );
    }
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 sm:p-2"
      >
        <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown content */}
          <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-lg z-20 max-h-80 sm:max-h-96 overflow-y-auto">
            <div className="p-2 sm:p-3 border-b border-gray-200 dark:border-zinc-700">
              <h3 className="font-semibold text-sm sm:text-base">Notifications</h3>
            </div>
            
            {notifications.length === 0 ? (
              <div className="p-3 sm:p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                No notifications yet
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-zinc-700">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                      !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    {notification.link ? (
                      <Link 
                        href={notification.link}
                        onClick={() => {
                          markAsRead(notification.id);
                          setIsOpen(false);
                        }}
                        className="block"
                      >
                        <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 break-words">
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.createdAt.toLocaleDateString()}
                        </div>
                      </Link>
                    ) : (
                      <div
                        onClick={() => markAsRead(notification.id)}
                        className="cursor-pointer"
                      >
                        <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 break-words">
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
