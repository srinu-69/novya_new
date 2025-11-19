
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaBell, FaClock, FaTimes, FaCheck, FaPlay } from 'react-icons/fa';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';

// const Notifications = ({ isMobile, onClose }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadNotifications, setUnreadNotifications] = useState(0);
//   const [selectedClass, setSelectedClass] = useState('7th');
//   const [todayProgress, setTodayProgress] = useState({
//     completed: 0,
//     total: 8,
//     subjects: [
//       { name: 'Math', completed: false },
//       { name: 'Science', completed: false },
//       { name: 'English', completed: false },
//       { name: 'Social', completed: false },
//       { name: 'Physics', completed: false },
//       { name: 'Chemistry', completed: false },
//       { name: 'Biology', completed: false },
//       { name: 'Computer', completed: false }
//     ]
//   });
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   // Function to set user class
//   const setUserClass = (selectedClass) => {
//     const currentProgress = JSON.parse(localStorage.getItem('learningProgress') || '{}');
//     currentProgress.userClass = selectedClass;
//     localStorage.setItem('learningProgress', JSON.stringify(currentProgress));
//     setSelectedClass(selectedClass);
//   };

//   // Class selector component
//   const ClassSelector = () => (
//     <div style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>
//     </div>
//   );

//   // Load today's progress from localStorage
//   const loadTodayProgress = () => {
//     try {
//       const today = new Date().toDateString();
//       const savedProgress = localStorage.getItem(`dailyProgress_${today}`);
//       if (savedProgress) {
//         const progress = JSON.parse(savedProgress);
//         const completedCount = progress.subjects.filter(subject => subject.completed).length;
//         setTodayProgress({
//           ...progress,
//           completed: completedCount
//         });
//       } else {
//         // Initialize today's progress
//         const initialProgress = {
//           completed: 0,
//           total: 8,
//           subjects: [
//             { name: 'Math', completed: false },
//             { name: 'Science', completed: false },
//             { name: 'English', completed: false },
//             { name: 'Social', completed: false },
//             { name: 'Physics', completed: false },
//             { name: 'Chemistry', completed: false },
//             { name: 'Biology', completed: false },
//             { name: 'Computer', completed: false }
//           ]
//         };
//         localStorage.setItem(`dailyProgress_${today}`, JSON.stringify(initialProgress));
//         setTodayProgress(initialProgress);
//       }
//     } catch (error) {
//       console.error('Error loading today progress:', error);
//     }
//   };

//   // Enhanced notification generator with real progress tracking
//   const generateDailyProgressNotification = () => {
//     const currentProgress = JSON.parse(localStorage.getItem('learningProgress') || '{}');
//     const learningStatus = JSON.parse(localStorage.getItem('learningStatus') || '{}');
//     const userClass = currentProgress.userClass || '7';
//     const today = new Date().toDateString();

//     // Calculate real progress from learningStatus
//     const completedSubjects = new Set();
    
//     Object.values(learningStatus).forEach(status => {
//       if (status.date === today && status.status === 'TASK_DONE' && status.subject) {
//         completedSubjects.add(status.subject);
//       }
//     });

//     // Get available subjects for the class
//     const allChapters = {
//       '7': ['Maths', 'Science', 'English', 'History', 'Civics', 'Geography', 'Computer'],
//       '8': ['Maths', 'Science', 'English', 'History', 'Civics', 'Geography', 'Computer'],
//       '9': ['Maths', 'Science', 'English', 'History', 'Civics', 'Geography', 'Computer', 'Economics'],
//       '10': ['Maths', 'Science', 'English', 'History', 'Civics', 'Geography', 'Computer', 'Economics']
//     };

//     const availableSubjects = allChapters[userClass] || [];
//     const totalSubjects = availableSubjects.length;
//     const completedCount = completedSubjects.size;
//     const completionPercentage = totalSubjects > 0 ? Math.round((completedCount / totalSubjects) * 100) : 0;
//     const isCompleted = completedCount === totalSubjects && totalSubjects > 0;

//     // Create subject status array
//     const subjectsStatus = availableSubjects.map(subject => ({
//       name: subject,
//       completed: completedSubjects.has(subject)
//     }));

//     return {
//       id: `daily-progress-${Date.now()}`,
//       title: isCompleted ? `🎉 Today's Learning Completed!` : `Today's Learning Progress`,
//       message: isCompleted 
//         ? `Great job! You've completed all ${totalSubjects} subjects for Class ${userClass}.`
//         : `Keep learning! ${completedCount}/${totalSubjects} subjects completed for Class ${userClass}.`,
//       date: new Date(),
//       read: false,
//       type: 'daily_progress',
//       data: {
//         class: userClass,
//         progress: completionPercentage,
//         completed: completedCount,
//         total: totalSubjects,
//         isCompleted: isCompleted,
//         subjects: subjectsStatus
//       }
//     };
//   };

//   // Function to check and add daily agenda
//   const checkAndAddDailyAgenda = () => {
//     const lastNotificationDate = localStorage.getItem('lastDailyAgendaDate');
//     const today = new Date().toDateString();
    
//     if (lastNotificationDate !== today) {
//       const dailyNotification = generateDailyProgressNotification();
//       addNotification(dailyNotification);
//       localStorage.setItem('lastDailyAgendaDate', today);
//     } else {
//       // Update existing daily notification with current progress
//       updateDailyNotificationProgress();
//     }
//   };

//   // Update daily notification with current progress
//   const updateDailyNotificationProgress = () => {
//     try {
//       const savedNotifications = localStorage.getItem('studyNotifications');
//       if (savedNotifications) {
//         const notifications = JSON.parse(savedNotifications);
//         const today = new Date().toDateString();
        
//         const updatedNotifications = notifications.map(notif => {
//           if (notif.type === 'daily_progress' && 
//               new Date(notif.date).toDateString() === today) {
//             return generateDailyProgressNotification();
//           }
//           return notif;
//         });
        
//         localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifications));
//         setNotifications(updatedNotifications);
        
//         window.dispatchEvent(new StorageEvent('storage', {
//           key: 'studyNotifications',
//           newValue: JSON.stringify(updatedNotifications)
//         }));
//       }
//     } catch (error) {
//       console.error('Error updating daily notification:', error);
//     }
//   };

//   // Function to add notification to localStorage
//   const addNotification = (notification) => {
//     try {
//       const savedNotifications = localStorage.getItem('studyNotifications');
//       const notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
      
//       // Remove any existing daily notification for today
//       const today = new Date().toDateString();
//       const filteredNotifications = notifications.filter(notif => 
//         !(notif.type === 'daily_progress' && 
//           new Date(notif.date).toDateString() === today)
//       );
      
//       filteredNotifications.unshift(notification);
//       localStorage.setItem('studyNotifications', JSON.stringify(filteredNotifications));
      
//       // Trigger storage event to update other components
//       window.dispatchEvent(new StorageEvent('storage', {
//         key: 'studyNotifications',
//         newValue: JSON.stringify(filteredNotifications)
//       }));
//     } catch (error) {
//       console.error('Error adding notification:', error);
//     }
//   };

//   useEffect(() => {
//     loadNotifications();
//     loadTodayProgress();
    
//     // Check for daily agenda every time component mounts
//     checkAndAddDailyAgenda();
    
//     // Also check every hour for users who keep the app open
//     const interval = setInterval(() => {
//       checkAndAddDailyAgenda();
//       loadNotifications();
//       loadTodayProgress();
//     }, 60 * 60 * 1000);

//     const handleStorageChange = (e) => {
//       if (e.key === 'studyNotifications') {
//         loadNotifications();
//       }
//       if (e.key && e.key.startsWith('dailyProgress_')) {
//         loadTodayProgress();
//         checkAndAddDailyAgenda();
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     const quickInterval = setInterval(() => {
//       loadNotifications();
//       loadTodayProgress();
//     }, 2000);
   
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//       clearInterval(interval);
//       clearInterval(quickInterval);
//     };
//   }, []);

//   const loadNotifications = () => {
//     try {
//       const savedNotifications = localStorage.getItem('studyNotifications');
//       if (savedNotifications) {
//         const notifs = JSON.parse(savedNotifications);
//         const uniqueNotifs = notifs.filter((notif, index, self) =>
//           index === self.findIndex(n => n.id === notif.id)
//         );
//         setNotifications(uniqueNotifs);
//         const unread = uniqueNotifs.filter(notif => !notif.read).length;
//         setUnreadNotifications(unread);
//       } else {
//         setNotifications([]);
//         setUnreadNotifications(0);
//       }
//     } catch (error) {
//       console.error('Error loading notifications:', error);
//       setNotifications([]);
//       setUnreadNotifications(0);
//     }
//   };

//   const markNotificationAsRead = (notificationId) => {
//     try {
//       const updatedNotifications = notifications.map(notif =>
//         notif.id === notificationId ? { ...notif, read: true } : notif
//       );
//       localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifications));
//       setNotifications(updatedNotifications);
//       const unread = updatedNotifications.filter(notif => !notif.read).length;
//       setUnreadNotifications(unread);
     
//       window.dispatchEvent(new StorageEvent('storage', {
//         key: 'studyNotifications',
//         newValue: JSON.stringify(updatedNotifications)
//       }));
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   const deleteNotification = (notificationId) => {
//     try {
//       const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
//       localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifications));
//       setNotifications(updatedNotifications);
//       const unread = updatedNotifications.filter(notif => !notif.read).length;
//       setUnreadNotifications(unread);
     
//       window.dispatchEvent(new StorageEvent('storage', {
//         key: 'studyNotifications',
//         newValue: JSON.stringify(updatedNotifications)
//       }));
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//     }
//   };

//   const markAllNotificationsAsRead = () => {
//     try {
//       const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
//       localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifications));
//       setNotifications(updatedNotifications);
//       setUnreadNotifications(0);
     
//       window.dispatchEvent(new StorageEvent('storage', {
//         key: 'studyNotifications',
//         newValue: JSON.stringify(updatedNotifications)
//       }));
//     } catch (error) {
//       console.error('Error marking all notifications as read:', error);
//     }
//   };

//   const clearAllNotifications = () => {
//     try {
//       localStorage.removeItem('studyNotifications');
//       setNotifications([]);
//       setUnreadNotifications(0);
     
//       window.dispatchEvent(new StorageEvent('storage', {
//         key: 'studyNotifications',
//         newValue: null
//       }));
//     } catch (error) {
//       console.error('Error clearing notifications:', error);
//     }
//   };

//   // Fixed Progress Bar Component with null checks
//   const ProgressBar = ({ progress, completed, total, subjects }) => {
//     // Add null checks and default values
//     const safeSubjects = subjects || [];
//     const safeCompleted = completed || 0;
//     const safeTotal = total || 1;
//     const completionPercentage = Math.round((safeCompleted / safeTotal) * 100);
    
//     return (
//       <div style={{ marginTop: '12px' }}>
//         {/* Main Progress Bar */}
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//           marginBottom: '8px'
//         }}>
//           <div style={{
//             flex: 1,
//             height: '8px',
//             backgroundColor: '#e5e7eb',
//             borderRadius: '4px',
//             overflow: 'hidden'
//           }}>
//             <div style={{
//               width: `${completionPercentage}%`,
//               height: '100%',
//               backgroundColor: completionPercentage === 100 ? '#10b981' : '#3b82f6',
//               borderRadius: '4px',
//               transition: 'width 0.3s ease'
//             }} />
//           </div>
//           <span style={{
//             fontSize: '12px',
//             fontWeight: '600',
//             color: completionPercentage === 100 ? '#10b981' : '#3b82f6',
//             minWidth: '40px'
//           }}>
//             {completionPercentage}%
//           </span>
//         </div>

//         {/* Subjects Progress - Only render if we have subjects */}
//         {safeSubjects.length > 0 && (
//           <div style={{
//             display: 'flex',
//             gap: '4px',
//             marginBottom: '8px'
//           }}>
//             {safeSubjects.map((subject, index) => (
//               <div
//                 key={index}
//                 title={subject.name || `Subject ${index + 1}`}
//                 style={{
//                   flex: 1,
//                   height: '6px',
//                   backgroundColor: subject.completed ? '#10b981' : '#e5e7eb',
//                   borderRadius: '3px',
//                   transition: 'background-color 0.3s ease'
//                 }}
//               />
//             ))}
//           </div>
//         )}

//         {/* Progress Text */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           fontSize: '11px',
//           color: '#6b7280'
//         }}>
//           <span>
//             {safeCompleted === safeTotal ? 'All subjects completed! 🎉' : `${safeCompleted}/${safeTotal} subjects completed`}
//           </span>
//           {safeCompleted === safeTotal && (
//             <FaCheck size={12} color="#10b981" />
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Enhanced notification item with progress bar
//   const renderNotificationItem = (notification) => {
//     // Ensure notification data exists
//     const notificationData = notification.data || {};
//     const subjects = notificationData.subjects || [];
//     const completed = notificationData.completed || 0;
//     const total = notificationData.total || 0;
//     const isCompleted = notificationData.isCompleted || false;
    
//     return (
//       <div
//         key={notification.id}
//         className={`notification-item ${!notification.read ? 'unread' : ''} ${notification.type?.includes('daily') ? 'daily-agenda' : ''}`}
//         onClick={() => !notification.read && markNotificationAsRead(notification.id)}
//         style={{
//           padding: '12px 16px',
//           borderBottom: '1px solid #f3f4f6',
//           cursor: !notification.read ? 'pointer' : 'default',
//           backgroundColor: !notification.read ? 
//             (notification.type?.includes('daily') ? '#f0f9ff' : '#fef7cd') : 'transparent',
//           position: 'relative',
//           transition: 'background-color 0.2s',
//           borderLeft: notification.type?.includes('daily') ? 
//             (isCompleted ? '4px solid #10b981' : '4px solid #3b82f6') : '4px solid transparent'
//         }}
//       >
//         <button
//           className="notification-delete-btn"
//           onClick={(e) => {
//             e.stopPropagation();
//             deleteNotification(notification.id);
//           }}
//           style={{
//             position: 'absolute',
//             top: '8px',
//             right: '8px',
//             background: 'none',
//             border: 'none',
//             cursor: 'pointer',
//             color: '#9ca3af',
//             padding: '4px',
//             borderRadius: '4px',
//             fontSize: '10px'
//           }}
//         >
//           <FaTimes size={10} />
//         </button>

//         <div style={{ 
//           fontSize: '13px', 
//           fontWeight: '600', 
//           marginBottom: '4px', 
//           color: notification.type?.includes('daily') ? 
//             (isCompleted ? '#065f46' : '#1e40af') : '#1f2937'
//         }}>
//           {notification.title || 'Notification'}
//           {notification.type?.includes('daily') && (
//             <span style={{
//               marginLeft: '8px',
//               background: isCompleted ? '#10b981' : '#3b82f6',
//               color: 'white',
//               padding: '2px 6px',
//               borderRadius: '12px',
//               fontSize: '10px',
//               fontWeight: 'normal'
//             }}>
//               {isCompleted ? 'Completed' : 'Daily Goal'}
//             </span>
//           )}
//         </div>
//         <div style={{ 
//           fontSize: '12px', 
//           color: notification.type?.includes('daily') ? 
//             (isCompleted ? '#047857' : '#1e40af') : '#4b5563', 
//           marginBottom: '6px', 
//           lineHeight: '1.4' 
//         }}>
//           {notification.message || 'No message'}
//         </div>

//         {/* Progress Bar for Daily Challenges */}
//         {notification.type?.includes('daily') && notificationData && (
//           <ProgressBar 
//             progress={notificationData.progress}
//             completed={completed}
//             total={total}
//             subjects={subjects}
//           />
//         )}

//         <div style={{ 
//           fontSize: '11px', 
//           color: '#9ca3af', 
//           display: 'flex', 
//           alignItems: 'center', 
//           gap: '4px',
//           marginTop: '8px'
//         }}>
//           <FaClock size={10} />
//           {new Date(notification.date).toLocaleDateString()} at {' '}
//           {new Date(notification.date).toLocaleTimeString([], { 
//             hour: '2-digit', 
//             minute: '2-digit' 
//           })}
//         </div>
        
//         {/* Action button for daily challenges */}
//         {notification.type?.includes('daily') && !isCompleted && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               // Navigate to learning page with the suggested class
//               navigate(`/learn/class${notificationData.class || '7'}`);
//               markNotificationAsRead(notification.id);
//               if (isMobile && onClose) {
//                 onClose();
//               }
//             }}
//             style={{
//               marginTop: '12px',
//               background: '#3b82f6',
//               color: 'white',
//               border: 'none',
//               padding: '6px 12px',
//               borderRadius: '4px',
//               fontSize: '11px',
//               cursor: 'pointer',
//               fontWeight: '500',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '4px'
//             }}
//           >
//             <FaPlay size={10} />
//             Continue Learning
//           </button>
//         )}

//         {/* Completed state */}
//         {notification.type?.includes('daily') && isCompleted && (
//           <div style={{
//             marginTop: '12px',
//             padding: '8px',
//             background: '#f0fdf4',
//             border: '1px solid #bbf7d0',
//             borderRadius: '4px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '6px',
//             fontSize: '11px',
//             color: '#065f46'
//           }}>
//             <FaCheck size={12} />
//             All tasks completed for today!
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Desktop Notifications Dropdown
//   const DesktopNotifications = () => (
//     <AnimatePresence>
//       <motion.div
//         className="nav-dropdown notifications-dropdown"
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -10 }}
        
//       >
//         <ClassSelector />
//         <div className="notifications-container">
//           <div className="notifications-header" style={{
//             padding: '12px 16px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             borderBottom: '1px solid #e5e7eb'
//           }}>
//             <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
//               {t('nav-notifications')}
//             </h3>
//             {unreadNotifications > 0 && (
//               <span style={{
//                 background: '#ef4444',
//                 color: 'white',
//                 borderRadius: '12px',
//                 padding: '2px 8px',
//                 fontSize: '12px',
//                 fontWeight: '600'
//               }}>
//                 {unreadNotifications} new
//               </span>
//             )}
//           </div>

//           <div className="notifications-actions" style={{
//             padding: '8px 16px',
//             display: 'flex',
//             gap: '8px',
//             borderBottom: '1px solid #e5e7eb',
//             background: '#f8fafc'
//           }}>
//             {unreadNotifications > 0 && (
//               <button
//                 onClick={markAllNotificationsAsRead}
//                 style={{
//                   background: 'none',
//                   border: '1px solid #3b82f6',
//                   color: '#3b82f6',
//                   padding: '4px 8px',
//                   borderRadius: '4px',
//                   fontSize: '12px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 {t('mark_all_read')}
//               </button>
//             )}
//             {notifications.length > 0 && (
//               <button
//                 onClick={clearAllNotifications}
//                 style={{
//                   background: 'none',
//                   border: '1px solid #ef4444',
//                   color: '#ef4444',
//                   padding: '4px 8px',
//                   borderRadius: '4px',
//                   fontSize: '12px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 {t('clear_all')}
//               </button>
//             )}
//           </div>

//           <div style={{ maxHeight: '300px', overflow: 'auto' }}>
//             {notifications.length === 0 ? (
//               <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280' }}>
//                 <FaBell size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
//                 <p style={{ margin: 0, fontSize: '14px' }}>{t('no_notifications_yet')}</p>
//                 <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>{t('study_plans_will_appear_here')}</p>
//               </div>
//             ) : (
//               notifications.map((notification) => renderNotificationItem(notification))
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );

//   // Mobile Notifications Modal
//   const MobileNotificationsModal = () => (
//     <>
//       <motion.div
//         className="mobile-notifications-overlay"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           zIndex: 9998
//         }}
//       />
//       <motion.div
//         className="mobile-notifications-content"
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.8, opacity: 0 }}
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           position: 'fixed',
//           top: '50%',
//           left: '50%',
//           transform: 'none',
//           width: '90%',
//           maxWidth: '400px',
//           maxHeight: '80vh',
//           backgroundColor: 'white',
//           borderRadius: '12px',
//           zIndex: 9999,
//           overflow: 'hidden',
//           boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
//         }}
//       >
//         <ClassSelector />
//         <div className="notifications-container">
//           <div className="notifications-header" style={{
//             padding: '16px 20px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             borderBottom: '1px solid #e5e7eb',
//             backgroundColor: '#3b82f6',
//             color: 'white'
//           }}>
//             <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
//               Notifications
//             </h3>
//             <button 
//               onClick={onClose} 
//               style={{ 
//                 background: 'none', 
//                 border: 'none', 
//                 cursor: 'pointer', 
//                 color: 'white', 
//                 fontSize: '18px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '32px',
//                 height: '32px',
//                 borderRadius: '4px'
//               }}
//             >
//               <FaTimes />
//             </button>
//           </div>

//           <div className="notifications-actions" style={{
//             padding: '12px 16px',
//             display: 'flex',
//             gap: '8px',
//             borderBottom: '1px solid #e5e7eb',
//             background: '#f8fafc'
//           }}>
//             {unreadNotifications > 0 && (
//               <button
//                 onClick={markAllNotificationsAsRead}
//                 style={{
//                   background: '#3b82f6',
//                   border: 'none',
//                   color: 'white',
//                   padding: '8px 12px',
//                   borderRadius: '6px',
//                   fontSize: '14px',
//                   cursor: 'pointer',
//                   fontWeight: '500'
//                 }}
//               >
//                 Mark all read
//               </button>
//             )}
//             {notifications.length > 0 && (
//               <button
//                 onClick={clearAllNotifications}
//                 style={{
//                   background: '#ef4444',
//                   border: 'none',
//                   color: 'white',
//                   padding: '8px 12px',
//                   borderRadius: '6px',
//                   fontSize: '14px',
//                   cursor: 'pointer',
//                   fontWeight: '500'
//                 }}
//               >
//                 Clear all
//               </button>
//             )}
//           </div>

//           <div style={{ maxHeight: '400px', overflow: 'auto' }}>
//             {notifications.length === 0 ? (
//               <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280' }}>
//                 <FaBell size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
//                 <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>No notifications yet</p>
//                 <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>You're all caught up!</p>
//               </div>
//             ) : (
//               notifications.map((notification) => renderNotificationItem(notification))
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </>
//   );

//   if (isMobile) {
//     return <MobileNotificationsModal />;
//   }

//   return <DesktopNotifications />;
// };

// export default Notifications;












import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, 
  FaClock, 
  FaTimes, 
  FaCheck, 
  FaPlay, 
  FaBook,
  FaGraduationCap,
  FaCalendarCheck,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaRocket
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from './useNotifications';

const Notifications = ({ isMobile, onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    deleteNotification, 
    markAllAsRead, 
    clearAll 
  } = useNotifications();
  
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'daily'

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'daily') return notification.type?.includes('daily');
    return true;
  });

  // Get notification icon based on type
  const getNotificationIcon = (notification) => {
    if (notification.type?.includes('daily')) {
      return notification.data?.isCompleted ? FaCheck : FaRocket;
    }
    if (notification.type?.includes('study_plan')) {
      return FaBook;
    }
    return FaBell;
  };

  // Get notification color based on type and status
  const getNotificationColor = (notification) => {
    if (notification.type?.includes('daily')) {
      return notification.data?.isCompleted ? '#10b981' : '#3b82f6';
    }
    if (notification.read) {
      return '#6b7280';
    }
    return '#ef4444';
  };

  // Get notification background color
  const getNotificationBgColor = (notification) => {
    if (!notification.read) {
      if (notification.type?.includes('daily')) {
        return notification.data?.isCompleted ? '#f0fdf4' : '#f0f9ff';
      }
      return '#fef7cd';
    }
    return '#f8fafc';
  };

  // Enhanced Progress Bar Component
  const ProgressBar = ({ progress, completed, total, subjects }) => {
    const safeSubjects = subjects || [];
    const safeCompleted = completed || 0;
    const safeTotal = total || 1;
    const completionPercentage = Math.round((safeCompleted / safeTotal) * 100);
    
    return (
      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        {/* Progress Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaGraduationCap size={14} color="#4b5563" />
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
              Learning Progress
            </span>
          </div>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '700', 
            color: completionPercentage === 100 ? '#10b981' : '#3b82f6',
            background: completionPercentage === 100 ? '#f0fdf4' : '#f0f9ff',
            padding: '4px 8px',
            borderRadius: '12px'
          }}>
            {completionPercentage}%
          </span>
        </div>

        {/* Main Progress Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px'
        }}>
          <div style={{
            flex: 1,
            height: '10px',
            backgroundColor: '#f1f5f9',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                height: '100%',
                backgroundColor: completionPercentage === 100 ? '#10b981' : '#3b82f6',
                borderRadius: '8px',
                background: completionPercentage === 100 
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                boxShadow: '0 1px 3px rgba(59, 130, 246, 0.3)'
              }}
            />
          </div>
        </div>

        {/* Subjects Progress */}
        {safeSubjects.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(30px, 1fr))',
            gap: '6px',
            marginBottom: '10px'
          }}>
            {safeSubjects.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                title={subject.name || `Subject ${index + 1}`}
                style={{
                  height: '8px',
                  backgroundColor: subject.completed ? '#10b981' : '#e5e7eb',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                whileHover={{ scale: 1.2 }}
              >
                {subject.completed && (
                  <div style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%'
                  }} />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Progress Text */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: '#6b7280',
          fontWeight: '500'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {safeCompleted === safeTotal ? (
              <>
                <FaStar size={10} color="#f59e0b" />
                All subjects completed!
              </>
            ) : (
              `${safeCompleted}/${safeTotal} subjects completed`
            )}
          </span>
          {safeCompleted === safeTotal && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <FaCheck size={12} color="#10b981" />
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  // Enhanced notification item with modern design
  const renderNotificationItem = (notification) => {
    const IconComponent = getNotificationIcon(notification);
    const notificationColor = getNotificationColor(notification);
    const notificationBgColor = getNotificationBgColor(notification);
    
    const notificationData = notification.data || {};
    const subjects = notificationData.subjects || [];
    const completed = notificationData.completed || 0;
    const total = notificationData.total || 0;
    const isCompleted = notificationData.isCompleted || false;
    
    return (
      <motion.div
        key={notification.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className={`notification-item ${!notification.read ? 'unread' : ''} ${notification.type?.includes('daily') ? 'daily-agenda' : ''}`}
        onClick={() => !notification.read && markAsRead(notification.id)}
        style={{
          padding: '16px',
          borderBottom: '1px solid #f1f5f9',
          cursor: !notification.read ? 'pointer' : 'default',
          backgroundColor: notificationBgColor,
          position: 'relative',
          transition: 'all 0.3s ease',
          borderLeft: `4px solid ${notificationColor}`,
          borderRadius: '0 12px 12px 0',
          margin: '8px 12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          border: '1px solid #f1f5f9'
        }}
        whileHover={{ 
          scale: !notification.read ? 1.02 : 1,
          boxShadow: !notification.read ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        {/* Notification Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '12px',
          marginBottom: '8px'
        }}>
          {/* Icon */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: `${notificationColor}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: `1px solid ${notificationColor}30`
          }}>
            <IconComponent 
              size={16} 
              color={notificationColor}
            />
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '6px'
            }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '700', 
                color: notificationColor,
                lineHeight: '1.3'
              }}>
                {notification.title || 'Notification'}
              </div>
              
              {/* Status Badge */}
              {notification.type?.includes('daily') && (
                <span style={{
                  background: isCompleted ? '#10b981' : '#3b82f6',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  marginLeft: '8px'
                }}>
                  {isCompleted ? 'Completed' : 'In Progress'}
                </span>
              )}
            </div>

            <div style={{ 
              fontSize: '13px', 
              color: '#4b5563', 
              lineHeight: '1.4',
              marginBottom: '8px'
            }}>
              {notification.message || 'No message'}
            </div>
          </div>
        </div>

        {/* Progress Bar for Daily Challenges */}
        {notification.type?.includes('daily') && notificationData && (
          <ProgressBar 
            progress={notificationData.progress}
            completed={completed}
            total={total}
            subjects={subjects}
          />
        )}

        {/* Notification Footer */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '12px'
        }}>
          <div style={{ 
            fontSize: '11px', 
            color: '#9ca3af', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            fontWeight: '500'
          }}>
            <FaClock size={10} />
            {new Date(notification.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })} • {' '}
            {new Date(notification.date).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Read/Unread Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(notification.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: notification.read ? '#9ca3af' : '#3b82f6',
                padding: '6px',
                borderRadius: '6px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title={notification.read ? 'Mark as unread' : 'Mark as read'}
            >
              {notification.read ? <FaEyeSlash size={10} /> : <FaEye size={10} />}
            </button>

            {/* Action button for daily challenges */}
            {notification.type?.includes('daily') && !isCompleted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/learn/class${notificationData.class || '7'}`);
                  markAsRead(notification.id);
                  if (isMobile && onClose) {
                    onClose();
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlay size={10} />
                Continue
              </button>
            )}

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNotification(notification.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                padding: '6px',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              title="Delete notification"
            >
              <FaTrash size={10} />
            </button>
          </div>
        </div>

        {/* Unread Indicator */}
        {!notification.read && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '8px',
            height: '8px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }} />
        )}
      </motion.div>
    );
  };

  // Filter Buttons Component
  const FilterButtons = () => (
    <div style={{
      display: 'flex',
      gap: '8px',
      padding: '12px 16px',
      background: '#f8fafc',
      borderBottom: '1px solid #e5e7eb'
    }}>
      {[
        { key: 'all', label: 'All', icon: FaBell, count: notifications.length },
        { key: 'unread', label: 'Unread', icon: FaEye, count: unreadCount },
        { key: 'daily', label: 'Daily', icon: FaCalendarCheck, count: notifications.filter(n => n.type?.includes('daily')).length }
      ].map(({ key, label, icon: Icon, count }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            background: filter === key ? '#3b82f6' : 'white',
            color: filter === key ? 'white' : '#6b7280',
            border: `1px solid ${filter === key ? '#3b82f6' : '#e5e7eb'}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          <Icon size={12} />
          {label}
          {count > 0 && (
            <span style={{
              background: filter === key ? 'rgba(255,255,255,0.2)' : '#ef4444',
              color: filter === key ? 'white' : 'white',
              borderRadius: '10px',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: '700',
              minWidth: '18px'
            }}>
              {count}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  // Desktop Notifications Dropdown
  const DesktopNotifications = () => (
    <AnimatePresence>
      <motion.div
        className="nav-dropdown notifications-dropdown"
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        style={{
          width: '420px',
          maxHeight: '500px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #f1f5f9',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', }}>
              <FaBell size={16} />
              {t('nav-notifications')}
            </h3>
            {unreadCount > 0 && (
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '12px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: '700',
                backdropFilter: 'blur(10px)'
              }}>
                {unreadCount} new
              </span>
            )}
          </div>
           <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, color: 'white' }}> Stay updated with your learning progress </p>
        </div>

        <FilterButtons />

        {/* Actions */}
        <div style={{
          padding: '12px 16px',
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f8fafc'
        }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                background: '#10b981',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flex: 1
              }}
            >
              <FaCheck size={12} />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              style={{
                background: '#ef4444',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flex: 1
              }}
            >
              <FaTrash size={12} />
              Clear all
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div style={{ maxHeight: '350px', overflow: 'auto' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ 
              padding: '60px 20px', 
              textAlign: 'center', 
              color: '#9ca3af',
              background: '#f8fafc'
            }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FaBell size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#6b7280' }}>
                  {filter === 'unread' ? 'No unread notifications' : 
                   filter === 'daily' ? 'No daily progress updates' : 
                   'No notifications yet'}
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                  {filter === 'all' ? "You're all caught up! Start learning to see updates here." :
                   "Great job! You're up to date with everything."}
                </p>
              </motion.div>
            </div>
          ) : (
            <AnimatePresence>
              {filteredNotifications.map((notification) => renderNotificationItem(notification))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );

  // Mobile Notifications Modal
  const MobileNotificationsModal = () => (
    <>
      <motion.div
        className="mobile-notifications-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          backdropFilter: 'blur(4px)'
        }}
      />
      <motion.div
        className="mobile-notifications-content"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '400px',
          maxHeight: '85vh',
          backgroundColor: 'white',
          borderRadius: '20px',
          zIndex: 9999,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #f1f5f9'
        }}
      >
        {/* Mobile Header */}
        <div style={{
          padding: '24px 20px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaBell size={18} />
              Notifications
            </h3>
            <button 
              onClick={onClose} 
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                border: 'none', 
                cursor: 'pointer', 
                color: 'white', 
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <FaTimes />
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>

        <FilterButtons />

        {/* Mobile Actions */}
        <div style={{
          padding: '16px',
          display: 'flex',
          gap: '12px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f8fafc'
        }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                background: '#10b981',
                border: 'none',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '10px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: 1,
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
            >
              <FaCheck size={14} />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              style={{
                background: '#ef4444',
                border: 'none',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '10px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: 1,
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
              }}
            >
              <FaTrash size={14} />
              Clear all
            </button>
          )}
        </div>

        {/* Mobile Notifications List */}
        <div style={{ maxHeight: '400px', overflow: 'auto', padding: '8px 4px' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ 
              padding: '80px 20px', 
              textAlign: 'center', 
              color: '#9ca3af',
              background: '#f8fafc'
            }}>
              <FaBell size={56} style={{ marginBottom: '20px', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                No notifications
              </p>
              <p style={{ margin: 0, fontSize: '14px' }}>
                {filter === 'all' ? "You're all caught up!" :
                 filter === 'unread' ? "No unread notifications" :
                 "No daily progress updates"}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredNotifications.map((notification) => renderNotificationItem(notification))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </>
  );

  if (isMobile) {
    return <MobileNotificationsModal />;
  }

  return <DesktopNotifications />;
};

export default Notifications;