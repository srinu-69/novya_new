import { useState, useEffect, useCallback, useRef } from 'react';

// Global notification state to prevent multiple instances
let globalNotifications = [];
let globalListeners = new Set();

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const isInitialMount = useRef(true);

  // Load notifications from localStorage
  const loadNotifications = useCallback(() => {
    try {
      const savedNotifications = localStorage.getItem('studyNotifications');
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        globalNotifications = parsed;
        
        const unread = parsed.filter(notif => !notif.read).length;
        
        setNotifications(parsed);
        setUnreadCount(unread);
      } else {
        globalNotifications = [];
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  // Add notification
  const addNotification = useCallback((notification) => {
    const updated = [notification, ...globalNotifications];
    globalNotifications = updated;
    localStorage.setItem('studyNotifications', JSON.stringify(updated));
    
    // Update all listeners
    globalListeners.forEach(listener => listener());
  }, []);

  // Mark as read
  const markAsRead = useCallback((id) => {
    const updated = globalNotifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    globalNotifications = updated;
    localStorage.setItem('studyNotifications', JSON.stringify(updated));
    globalListeners.forEach(listener => listener());
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id) => {
    const updated = globalNotifications.filter(notif => notif.id !== id);
    globalNotifications = updated;
    localStorage.setItem('studyNotifications', JSON.stringify(updated));
    globalListeners.forEach(listener => listener());
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    const updated = globalNotifications.map(notif => ({ ...notif, read: true }));
    globalNotifications = updated;
    localStorage.setItem('studyNotifications', JSON.stringify(updated));
    globalListeners.forEach(listener => listener());
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    globalNotifications = [];
    localStorage.removeItem('studyNotifications');
    globalListeners.forEach(listener => listener());
  }, []);

  useEffect(() => {
    // Initial load
    loadNotifications();

    // Add this component to global listeners
    const updateListener = () => {
      loadNotifications();
    };
    
    globalListeners.add(updateListener);

    // Storage event listener
    const handleStorageChange = (e) => {
      if (e.key === 'studyNotifications') {
        loadNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      globalListeners.delete(updateListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    clearAll,
    loadNotifications
  };
};
