import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { API_CONFIG, djangoAPI, getChildEmailForParent } from '../../config/api';
import { FiX, FiTrash2 } from 'react-icons/fi';

const ParentNotifications = ({ onClose, showNotifications }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications on component mount and when shown
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get child email from localStorage (stored during parent login)
      const childEmail = getChildEmailForParent();
      
      // Build URL with child_email query param if available
      let url = API_CONFIG.DJANGO.AUTH.PARENT_NOTIFICATIONS;
      if (childEmail) {
        url = `${url}?child_email=${encodeURIComponent(childEmail)}`;
      }
      
      const response = await djangoAPI.get(url);
      
      if (response && response.notifications) {
        // Transform API response to match component format
        const transformedNotifications = response.notifications.map(notif => ({
          id: notif.notification_id,
          title: notif.title,
          message: notif.message,
          time: notif.time_ago || 'Just now',
          read: notif.is_read,
          student_name: notif.student_name || 'Your child',
          teacher_name: notif.teacher_name || 'Teacher',
          created_at: notif.created_at
        }));
        
        setNotifications(transformedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error('❌ Error fetching parent notifications:', err);
      setError(err.message || 'Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await djangoAPI.post(API_CONFIG.DJANGO.AUTH.MARK_PARENT_NOTIFICATION_READ(notificationId));
      
      // Update local state
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (err) {
      console.error('❌ Error marking notification as read:', err);
      alert('Failed to mark notification as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await djangoAPI.delete(API_CONFIG.DJANGO.AUTH.DELETE_PARENT_NOTIFICATION(notificationId));
      
      // Remove from local state
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
    } catch (err) {
      console.error('❌ Error deleting notification:', err);
      alert('Failed to delete notification');
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };

  if (!showNotifications) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-dropdown">
      <div className="dropdown-header" style={{ alignItems: "center" }}>
        <h3 style={{ margin: 0, flex: 1 }}>{t('common.notifications') || 'Notifications'}</h3>
        {unreadCount > 0 && (
          <span style={{
            marginRight: '10px',
            padding: '4px 8px',
            backgroundColor: '#A62D69',
            color: '#FFFFFF',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            {unreadCount} {t('common.unread') || 'unread'}
          </span>
        )}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            className="close-dropdown-btn"
            onClick={onClose}
            style={{ fontSize: "1.2rem", background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <FiX />
          </button>
        </div>
      </div>
      
      <div className="notification-list">
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {t('loading') || 'Loading notifications...'}
          </div>
        )}
        
        {error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px', 
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            margin: '10px'
          }}>
            {t('error') || 'Error'}: {error}
            <button 
              onClick={fetchNotifications}
              style={{
                marginLeft: '10px',
                padding: '6px 12px',
                backgroundColor: '#2D5D7B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {t('retry') || 'Retry'}
            </button>
          </div>
        )}
        
        {!loading && !error && (
          notifications.length === 0 ? (
            <p className="no-notifications" style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              fontSize: '0.9rem'
            }}>
              {t('common.noNotifications') || 'No notifications yet'}
            </p>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => handleNotificationClick(notification)}
                style={{
                  backgroundColor: notification.read ? '#FFFFFF' : '#F0F9FF',
                  borderLeft: notification.read ? '3px solid transparent' : '3px solid #2D5D7B',
                  cursor: 'pointer'
                }}
              >
                <div className="notification-content" style={{ flex: 1 }}>
                  <h4 style={{ 
                    margin: '0 0 5px 0',
                    fontSize: '0.95rem',
                    fontWeight: notification.read ? '500' : '600',
                    color: notification.read ? '#666' : '#222831'
                  }}>
                    {notification.title}
                  </h4>
                  <p style={{ 
                    margin: '0 0 5px 0',
                    fontSize: '0.85rem',
                    color: '#666',
                    lineHeight: '1.4'
                  }}>
                    {notification.message}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <span className="notification-time" style={{
                      fontSize: '0.75rem',
                      color: '#999'
                    }}>
                      {notification.time}
                    </span>
                    {notification.student_name && (
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#2D5D7B',
                        fontWeight: '500'
                      }}>
                        About: {notification.student_name}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '10px' }}>
                  {!notification.read && (
                    <div className="unread-dot" style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#2D5D7B'
                    }}></div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(t('common.confirmDelete') || 'Are you sure you want to delete this notification?'))) {
                        handleDeleteNotification(notification.id);
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#DC3545',
                      fontSize: '1rem'
                    }}
                    title={t('common.delete') || 'Delete'}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default ParentNotifications;

