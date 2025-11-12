
// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FaUserCircle,
//   FaChevronDown,
//   FaGlobe,
//   FaSignOutAlt,
//   FaSearch,
//   FaCoins,
//   FaCalendarAlt,
//   FaBell,
//   FaCheck,
//   FaBook,
//   FaClock,
//   FaTimes,
//   FaHistory,
//   FaPlus,
//   FaMinus,
//   FaTrash,
//   FaBars,
// } from 'react-icons/fa';
// import { useTranslation } from 'react-i18next';
// import './Navbarrr.css';
// import novyaLogo from '../home/assets/NOVYA LOGO.png';

// const Navbar = ({ isFullScreen, rewardPoints = 0 }) => {
//   const [scrolled, setScrolled] = useState(false);
//   const [activeLink, setActiveLink] = useState('');
//   const [avatarOpen, setAvatarOpen] = useState(false);
//   const [classDropdownOpen, setClassDropdownOpen] = useState(false);
//   const [practiceDropdownOpen, setPracticeDropdownOpen] = useState(false);
//   const [langDropdownOpen, setLangDropdownOpen] = useState(false);
//   const [showNavbar, setShowNavbar] = useState(true);
//   const [calendarOpen, setCalendarOpen] = useState(false);
//   const [notificationsOpen, setNotificationsOpen] = useState(false);
//   const [rewardsHistoryOpen, setRewardsHistoryOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [mobileDropdowns, setMobileDropdowns] = useState({
//     learn: false,
//     practice: false
//   });
 
//   // MARK: ADDED - Flying coins animation state
//   const [showFlyingCoins, setShowFlyingCoins] = useState(false);

//   const [avatar, setAvatar] = useState(null);
//   const [name, setName] = useState('');
//   const [currentRewardPoints, setCurrentRewardPoints] = useState(rewardPoints);
//   const [pointsChange, setPointsChange] = useState(0);
//   const [showPointsAnimation, setShowPointsAnimation] = useState(false);

//   // MARK: ADDED - Study plan and notifications state
//   const [studyPlans, setStudyPlans] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadNotifications, setUnreadNotifications] = useState(0);
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   // MARK: ADDED - Rewards history state
//   const [rewardsHistory, setRewardsHistory] = useState([]);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation();

//   const languages = [
//     { code: 'en', label: 'English' },
//     { code: 'te', label: 'తెలుగు' },
//     { code: 'hi', label: 'हिन्दी' },
//     { code: 'kn', label: 'ಕನ್ನಡ' },
//     { code: 'ta', label: 'தமிழ்' },
//     { code: 'ml', label: 'മലയാളം' },
//   ];

//   // MARK: ADDED - Mobile detection
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // MARK: UPDATED - Load rewards history
//   const loadRewardsHistory = () => {
//     try {
//       const savedHistory = localStorage.getItem('rewardsHistory');
//       if (savedHistory) {
//         const history = JSON.parse(savedHistory);
//         // Sort by timestamp descending (newest first)
//         const sortedHistory = history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//         setRewardsHistory(sortedHistory);
//       } else {
//         setRewardsHistory([]);
//       }
//     } catch (error) {
//       console.error('Error loading rewards history:', error);
//       setRewardsHistory([]);
//     }
//   };

//   // MARK: ADDED - Clear all rewards history
//   const clearAllRewardsHistory = () => {
//     try {
//       // Clear rewards history from localStorage
//       localStorage.removeItem('rewardsHistory');
//       setRewardsHistory([]);
     
//       // Dispatch storage event for cross-tab sync
//       window.dispatchEvent(new StorageEvent('storage', {
//         key: 'rewardsHistory',
//         newValue: null
//       }));
     
//       console.log('Rewards history cleared successfully');
//     } catch (error) {
//       console.error('Error clearing rewards history:', error);
//     }
//   };

//   // MARK: ADDED - Add reward points with history tracking
//   const addRewardPointsWithHistory = (points, reason, source = 'system') => {
//     const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
//     const newPoints = currentPoints + points;
   
//     // Update points in localStorage
//     localStorage.setItem('rewardPoints', newPoints.toString());
//     setCurrentRewardPoints(newPoints);
   
//     // Add to history
//     const historyEntry = {
//       id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       points: points,
//       totalPoints: newPoints,
//       reason: reason,
//       source: source,
//       timestamp: new Date().toISOString()
//     };
   
//     const existingHistory = JSON.parse(localStorage.getItem('rewardsHistory') || '[]');
//     const updatedHistory = [historyEntry, ...existingHistory];
//     localStorage.setItem('rewardsHistory', JSON.stringify(updatedHistory));
//     setRewardsHistory(updatedHistory);
   
//     // Dispatch event to update other components
//     window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
//       detail: { rewardPoints: newPoints }
//     }));
   
//     return historyEntry;
//   };

//   // MARK: UPDATED - Load study plans and notifications from localStorage with real-time updates
//   useEffect(() => {
//     loadStudyPlans();
//     loadNotifications();
//     loadRewardsHistory(); // Load rewards history
   
//     // Listen for new study plans from lesson pages
//     const handleStudyPlanAdded = (event) => {
//       if (event.detail && event.detail.studyPlan) {
//         // Force reload study plans to get latest data
//         loadStudyPlans();
//         // Also create notification for the new study plan
//         createNotification(event.detail.studyPlan);
//       }
//     };

//     // Listen for new notifications
//     const handleNotificationAdded = (event) => {
//       if (event.detail && event.detail.notification) {
//         // Force reload notifications to get latest data
//         loadNotifications();
//       }
//     };

//     // MARK: ADDED - Listen for study plan updates
//     const handleStudyPlanUpdated = () => {
//       loadStudyPlans();
//     };

//     // MARK: ADDED - Listen for storage changes (for cross-tab updates)
//     const handleStorageChange = (e) => {
//       if (e.key === 'studyPlans') {
//         loadStudyPlans();
//       }
//       if (e.key === 'studyNotifications') {
//         loadNotifications();
//       }
//       if (e.key === 'rewardsHistory') {
//         loadRewardsHistory();
//       }
//     };

//     window.addEventListener('studyPlanAdded', handleStudyPlanAdded);
//     window.addEventListener('notificationAdded', handleNotificationAdded);
//     window.addEventListener('studyPlanUpdated', handleStudyPlanUpdated);
//     window.addEventListener('storage', handleStorageChange);
   
//     // MARK: ADDED - Set up interval to check for updates
//     const interval = setInterval(() => {
//       loadStudyPlans();
//       loadNotifications();
//       loadRewardsHistory();
//     }, 2000); // Check every 2 seconds for updates
   
//     return () => {
//       window.removeEventListener('studyPlanAdded', handleStudyPlanAdded);
//       window.removeEventListener('notificationAdded', handleNotificationAdded);
//       window.removeEventListener('studyPlanUpdated', handleStudyPlanUpdated);
//       window.removeEventListener('storage', handleStorageChange);
//       clearInterval(interval);
//     };
//   }, []);

//   // MARK: UPDATED - Study plan functions with improved real-time loading and data validation
//   const loadStudyPlans = () => {
//     try {
//       const savedPlans = localStorage.getItem('studyPlans');
//       if (savedPlans) {
//         const plans = JSON.parse(savedPlans);
       
//         // Remove duplicates based on ID and also clean up any invalid dates
//         const uniquePlans = plans.filter((plan, index, self) =>
//           index === self.findIndex(p => p.id === plan.id)
//         ).map(plan => ({
//           ...plan,
//           // Ensure studySessions exist and have proper dates starting from current date
//           studySessions: (plan.studySessions || []).filter(session =>
//             session && session.date && !isNaN(new Date(session.date).getTime())
//           ).map(session => {
//             // Normalize date to YYYY-MM-DD format
//             let normalizedDate;
//             try {
//               const dateObj = new Date(session.date);
//               normalizedDate = dateObj.toISOString().split('T')[0];
//             } catch (error) {
//               console.error('Error normalizing date:', error, session.date);
//               normalizedDate = session.date; // fallback to original
//             }
           
//             return {
//               ...session,
//               date: normalizedDate
//             };
//           })
//         }));
       
//         setStudyPlans(uniquePlans);
       
//         // Debug: Log study plans and their sessions
//         console.log('=== LOADED STUDY PLANS ===');
//         uniquePlans.forEach(plan => {
//           console.log(`Plan: ${plan.title}`);
//           console.log(`Created: ${plan.createdDate}`);
//           console.log('Sessions:', plan.studySessions?.map(s => ({
//             date: s.date,
//             formatted: new Date(s.date).toLocaleDateString(),
//             title: s.title
//           })));
//           console.log('---');
//         });
//       } else {
//         setStudyPlans([]);
//         console.log('No study plans found in localStorage');
//       }
//     } catch (error) {
//       console.error('Error loading study plans:', error);
//       setStudyPlans([]);
//     }
//   };

//   const loadNotifications = () => {
//     try {
//       const savedNotifications = localStorage.getItem('studyNotifications');
//       if (savedNotifications) {
//         const notifs = JSON.parse(savedNotifications);
//         // Remove duplicates based on ID
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

//   const addStudyPlan = (studyPlan) => {
//     const existingPlans = JSON.parse(localStorage.getItem('studyPlans') || '[]');
   
//     // Check for duplicates before adding
//     const isDuplicate = existingPlans.some(plan => plan.id === studyPlan.id);
//     if (isDuplicate) {
//       console.log('Study plan already exists, skipping duplicate');
//       return;
//     }

//     const updatedPlans = [...existingPlans, studyPlan];
//     localStorage.setItem('studyPlans', JSON.stringify(updatedPlans));
//     setStudyPlans(updatedPlans);
   
//     // MARK: ADDED - Dispatch event to notify other components
//     window.dispatchEvent(new CustomEvent('studyPlanUpdated'));
//   };

//   const addNotification = (notification) => {
//     const existingNotifications = JSON.parse(localStorage.getItem('studyNotifications') || '[]');
   
//     // Check for duplicates before adding
//     const isDuplicate = existingNotifications.some(notif => notif.id === notification.id);
//     if (isDuplicate) {
//       console.log('Notification already exists, skipping duplicate');
//       return;
//     }

//     const updatedNotifications = [notification, ...existingNotifications];
//     localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifications));
//     setNotifications(updatedNotifications);
//     setUnreadNotifications(prev => prev + 1);
   
//     // MARK: ADDED - Dispatch storage event for cross-tab sync
//     window.dispatchEvent(new StorageEvent('storage', {
//       key: 'studyNotifications',
//       newValue: JSON.stringify(updatedNotifications)
//     }));
//   };

//   // MARK: UPDATED - Create notification with current date message
//   const createNotification = (studyPlan) => {
//     const notificationId = `notif_${studyPlan.id}`;
   
//     // Check if notification already exists
//     const existingNotifications = JSON.parse(localStorage.getItem('studyNotifications') || '[]');
//     const isDuplicateNotification = existingNotifications.some(notif => notif.id === notificationId);
   
//     if (isDuplicateNotification) {
//       console.log('Notification already exists, skipping duplicate');
//       return;
//     }

//     const notification = {
//       id: notificationId,
//       type: 'study_plan_created',
//       // title: 'New Study Plan Created',
//       message: `Study plan for ${studyPlan.title} has been added to your calendar starting from today`,
//       title: t('new_study_plan_created'),
//       // message: t('study_plan_added_to_calendar', { title: studyPlan.title }),
//       date: new Date().toISOString(),
//       read: false,
//       planId: studyPlan.id
//     };
//     addNotification(notification);
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
     
//       // MARK: ADDED - Dispatch storage event for cross-tab sync
//       window.dispatchEvent(new StorageEvent('storage', {
//         key: 'studyNotifications',
//         newValue: JSON.stringify(updatedNotifications)
//       }));
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   // MARK: ADDED - Delete single notification function
//   const deleteNotification = (notificationId) => {
//     try {
//       const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
//       localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifications));
//       setNotifications(updatedNotifications);
//       const unread = updatedNotifications.filter(notif => !notif.read).length;
//       setUnreadNotifications(unread);
     
//       // MARK: ADDED - Dispatch storage event for cross-tab sync
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
     
//       // MARK: ADDED - Dispatch storage event for cross-tab sync
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
     
//       // MARK: ADDED - Dispatch storage event for cross-tab sync
//       window.dispatchEvent(new StorageEvent('storage', {
//         key: 'studyNotifications',
//         newValue: null
//       }));
//     } catch (error) {
//       console.error('Error clearing notifications:', error);
//     }
//   };

//   // MARK: ADDED - Mobile dropdown toggle
//   const toggleMobileDropdown = (dropdown) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       [dropdown]: !prev[dropdown]
//     }));
//   };

//   // MARK: ADDED - Mobile menu close function
//   const closeMobileMenu = () => {
//     setMobileMenuOpen(false);
//     setMobileDropdowns({
//       learn: false,
//       practice: false
//     });
//   };

//   // MARK: UPDATED - Get today's study plans (fixed date comparison)
//   const getTodaysStudyPlans = () => {
//     const today = new Date().toISOString().split('T')[0];
//     const todaysPlans = [];
   
//     studyPlans.forEach(plan => {
//       plan.studySessions?.forEach(session => {
//         // Direct date comparison for today's sessions
//         if (session.date === today && !session.completed) {
//           todaysPlans.push({
//             ...session,
//             planTitle: plan.title,
//             subject: plan.subject
//           });
//         }
//       });
//     });
   
//     return todaysPlans;
//   };

//   // MARK: ADDED - Calendar functions
//   const getDaysInMonth = (date) => {
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (date) => {
//     return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//   };

//   const navigateMonth = (direction) => {
//     setCurrentMonth(prev => {
//       const newDate = new Date(prev);
//       newDate.setMonth(prev.getMonth() + direction);
//       return newDate;
//     });
//   };

//   // MARK: UPDATED - Enhanced study plan date filtering with proper date comparison
//   const getStudyPlansForDate = (date) => {
//     // Convert both dates to YYYY-MM-DD format for consistent comparison
//     const dateString = date.toISOString().split('T')[0];
//     const plansForDate = [];
   
//     console.log(`Checking study plans for date: ${dateString}`);
   
//     studyPlans.forEach(plan => {
//       plan.studySessions?.forEach(session => {
//         // Ensure session date is in same format for comparison
//         const sessionDate = session.date;
       
//         // Debug log to see what's being compared
//         console.log(`Comparing session date: ${sessionDate} with target: ${dateString}`);
       
//         if (sessionDate === dateString) {
//           plansForDate.push({
//             ...session,
//             planTitle: plan.title,
//             subject: plan.subject,
//             created: plan.createdDate
//           });
//         }
//       });
//     });
   
//     console.log(`Found ${plansForDate.length} study plans for ${dateString}`);
//     return plansForDate;
//   };

//   // MARK: UPDATED - Enhanced date comparison functions
//   const isToday = (date) => {
//     const today = new Date();
//     return date.getDate() === today.getDate() &&
//            date.getMonth() === today.getMonth() &&
//            date.getFullYear() === today.getFullYear();
//   };

//   const isSelectedDate = (date) => {
//     if (!selectedDate) return false;
//     return date.getDate() === selectedDate.getDate() &&
//            date.getMonth() === selectedDate.getMonth() &&
//            date.getFullYear() === selectedDate.getFullYear();
//   };

//   const formatTime = (dateString) => {
//     return new Date(dateString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // MARK: UPDATED - Flying coins animation trigger function with proper timeout
//   const triggerFlyingCoins = (pointsToAdd = 0, reason = "Activity completed") => {
//     setShowFlyingCoins(true);
//     if (pointsToAdd > 0) {
//       addRewardPointsWithHistory(pointsToAdd, reason, 'activity');
//     }
//     setTimeout(() => {
//       setShowFlyingCoins(false);
//     }, 2000); // Fixed timeout duration - was 20ms, now 2000ms for proper animation
//   };

//   // MARK: UPDATED - Welcome coins animation for login with points and history
//   const triggerWelcomeCoins = () => {
//     // Check if welcome points were already awarded
//     const welcomeAwarded = sessionStorage.getItem('welcomePointsAwarded');
//     if (!welcomeAwarded) {
//       setShowFlyingCoins(true);
//       addRewardPointsWithHistory(5, "Daily login reward", 'login');
//       sessionStorage.setItem('welcomePointsAwarded', 'true');
     
//       setTimeout(() => {
//         setShowFlyingCoins(false);
//       }, 3000);
//     }
//   };

//   // MARK: ADDED - Debug function to check all study plans

//   // const debugStudyPlans = () => {
//   //   console.log('=== STUDY PLANS DEBUG INFO ===');
//   //   console.log('Total study plans:', studyPlans.length);
   
//   //   studyPlans.forEach((plan, planIndex) => {
//   //     console.log(`Plan ${planIndex + 1}:`, {
//   //       title: plan.title,
//   //       id: plan.id,
//   //       created: plan.createdDate,
//   //       sessionCount: plan.studySessions?.length || 0,
//   //       sessions: plan.studySessions?.map(s => ({
//   //         date: s.date,
//   //         title: s.title,
//   //         formattedDate: new Date(s.date).toLocaleDateString()
//   //       }))
//   //     });
//   //   });
   
//   //   // Check today's plans specifically
//   //   const today = new Date();
//   //   const todayPlans = getStudyPlansForDate(today);
//   //   console.log(`Today's plans (${today.toISOString().split('T')[0]}):`, todayPlans);
//   // };


//   // MARK: ADDED - Debug today's study plans specifically
// const debugTodaysStudyPlans = () => {
//   const today = new Date();
//   const todayString = today.toISOString().split('T')[0];
//   console.log('=== DEBUG TODAYS STUDY PLANS ===');
//   console.log('Today date:', todayString);
//   console.log('Total study plans:', studyPlans.length);
 
//   studyPlans.forEach((plan, planIndex) => {
//     console.log(`Plan ${planIndex + 1}: ${plan.title}`);
//     plan.studySessions?.forEach((session, sessionIndex) => {
//       console.log(`  Session ${sessionIndex + 1}:`, {
//         date: session.date,
//         matchesToday: session.date === todayString,
//         title: session.title
//       });
//     });
//   });
 
//   const todaysPlans = getTodaysStudyPlans();
//   console.log('Todays plans found:', todaysPlans);
// };

//   // MARK: UPDATED - Sync reward points from localStorage and props
//   useEffect(() => {
//     const userRole = localStorage.getItem('userRole');
//     let storedData = null;

//     if (userRole === 'student') {
//       storedData = localStorage.getItem('studentData');
//     } else if (userRole === 'parent') {
//       storedData = localStorage.getItem('parentData');
//     }

//     if (storedData) {
//       const parsed = JSON.parse(storedData);
//       setAvatar(parsed.avatar || null);
//       setName(`${parsed.firstName || ''} ${parsed.lastName || ''}`);
//     }

//     // Load reward points from localStorage
//     const points = parseInt(localStorage.getItem('rewardPoints')) || 0;
//     setCurrentRewardPoints(points);

//     // MARK: UPDATED - Check for login animation with proper timing
//     const justLoggedIn = sessionStorage.getItem('justLoggedIn');
//     if (justLoggedIn) {
//       setTimeout(() => {
//         triggerWelcomeCoins();
//         sessionStorage.removeItem('justLoggedIn');
//       }, 1000);
//     }
//   }, [rewardPoints]);

//   // MARK: UPDATED - Improved reward points update listener
//   useEffect(() => {
//     const handleRewardPointsUpdate = (event) => {
//       if (event.detail && event.detail.rewardPoints !== undefined) {
//         const newPoints = event.detail.rewardPoints;
//         const oldPoints = currentRewardPoints;
//         const pointsDiff = newPoints - oldPoints;
       
//         if (pointsDiff > 0) {
//           setPointsChange(pointsDiff);
//           setShowPointsAnimation(true);
//           triggerFlyingCoins();
//           setTimeout(() => setShowPointsAnimation(false), 2000);
//         }
       
//         setCurrentRewardPoints(newPoints);
//         loadRewardsHistory(); // Reload history when points update
//       }
//     };

//     const handleStorageChange = (e) => {
//       if (e.key === 'rewardPoints') {
//         const points = parseInt(e.newValue) || 0;
//         const oldPoints = currentRewardPoints;
//         const pointsDiff = points - oldPoints;
       
//         if (pointsDiff > 0) {
//           setPointsChange(pointsDiff);
//           setShowPointsAnimation(true);
//           triggerFlyingCoins();
//           setTimeout(() => setShowPointsAnimation(false), 2000);
//         }
       
//         setCurrentRewardPoints(points);
//         loadRewardsHistory(); // Reload history when points update
//       }
//     };

//     // Listen for custom events (same tab - video, mock tests)
//     window.addEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
   
//     // Listen for storage events (other tabs)
//     window.addEventListener('storage', handleStorageChange);
   
//     // Also check for changes periodically
//     const interval = setInterval(() => {
//       const points = parseInt(localStorage.getItem('rewardPoints')) || 0;
//       if (points !== currentRewardPoints) {
//         const pointsDiff = points - currentRewardPoints;
//         if (pointsDiff > 0) {
//           setPointsChange(pointsDiff);
//           setShowPointsAnimation(true);
//           triggerFlyingCoins();
//           setTimeout(() => setShowPointsAnimation(false), 2000);
//         }
//         setCurrentRewardPoints(points);
//         loadRewardsHistory(); // Reload history when points update
//       }
//     }, 1000);

//     return () => {
//       window.removeEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
//       window.removeEventListener('storage', handleStorageChange);
//       clearInterval(interval);
//     };
//   }, [currentRewardPoints]);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     setActiveLink(location.pathname);
//     setAvatarOpen(false);
//     setClassDropdownOpen(false);
//     setPracticeDropdownOpen(false);
//     setLangDropdownOpen(false);
//     setRewardsHistoryOpen(false);

//     // Close mobile menu when route changes
//     closeMobileMenu();

//     // Hide navbar in fullscreen mode during tests
//     if (isFullScreen) {
//       setShowNavbar(false);
//       return;
//     }

//     const hideNavbarRoutes = ['/mock-test', '/quick-practice'];
//     const shouldHideNavbar = hideNavbarRoutes.some(route =>
//       location.pathname.includes(route)
//     );

//     setShowNavbar(!shouldHideNavbar);
//   }, [location.pathname, isFullScreen]);

//   const handleLanguageChange = (code) => {
//     i18n.changeLanguage(code);
//     setLangDropdownOpen(false);
//   };

//   const handleLogout = () => {
//     // Clear all localStorage except rewardPoints and rewardsHistory to persist points after logout
//     const rewardPointsValue = localStorage.getItem('rewardPoints');
//     const rewardsHistoryValue = localStorage.getItem('rewardsHistory');
//     localStorage.clear();
//     if (rewardPointsValue) {
//       localStorage.setItem('rewardPoints', rewardPointsValue);
//     }
//     if (rewardsHistoryValue) {
//       localStorage.setItem('rewardsHistory', rewardsHistoryValue);
//     }
//     navigate('/');
//   };

//   const navLinks = [
//     { path: '/student/dashboard', name: t('home', 'Home') },
//     {
//       path: '/learn',
//       name: t('class_room', 'Class Room'),
//       hasDropdown: true,
//       dropdownItems: [
//         { path: '/learn', name: t('class_7', 'Class 7') },
//         { path: '/learn/class8', name: t('class_8', 'Class 8') },
//         { path: '/learn/class9', name: t('class_9', 'Class 9') },
//         { path: '/learn/class10', name: t('class_10', 'Class 10') },
//       ],
//     },
//     {
//       path: '/practice',
//       name: t('practice', 'Practice'),
//       hasDropdown: true,
//       dropdownItems: [
//         { path: '/quick-practice', name: t('quick_practice', 'Quick Practice') },
//         { path: '/mock-test', name: t('mock_test', 'Mock Test') },
//         { path: '/spin-wheel', name: t('spin_wheel', 'Spin Wheel') },
//       ],
//     },
//     { path: '/career', name: t('career', 'Career') },
//     { path: '/study-room', name: t('studyRoom', 'Study Room') },
//   ];

//   if (!showNavbar) return null;

//   return (
//     <motion.nav
//       className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       {/* MARK: ADDED - Flying Coins Animation Container */}
//       {showFlyingCoins && (
//         <div className="flying-coins-container" style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           pointerEvents: 'none',
//           zIndex: 9998
//         }}>
//           {[...Array(12)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="flying-coin"
//               initial={{
//                 scale: 0,
//                 opacity: 1,
//                 x: Math.random() * window.innerWidth,
//                 y: window.innerHeight + 50
//               }}
//               animate={{
//                 scale: [0, 1, 0.8, 0],
//                 opacity: [1, 1, 1, 0],
//                 x: [
//                   Math.random() * window.innerWidth,
//                   Math.random() * window.innerWidth,
//                   Math.random() * window.innerWidth
//                 ],
//                 y: [
//                   window.innerHeight + 50,
//                   window.innerHeight * 0.3,
//                   -50
//                 ]
//               }}
//               transition={{
//                 duration: 2,
//                 ease: "easeOut",
//                 delay: i * 0.15
//               }}
//               style={{
//                 position: 'absolute',
//                 fontSize: '20px',
//                 color: '#FFD700',
//                 zIndex: 9998,
//                 filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))'
//               }}
//             >
//               <FaCoins />
//             </motion.div>
//           ))}
//         </div>
//       )}

//       <style>
//         {`
//           @keyframes shimmer {
//             0% { background-position: -200% 0; }
//             100% { background-position: 200% 0; }
//           }
         
//           @keyframes gradientText {
//             0% { background-position: 0% 50%; }
//             50% { background-position: 100% 50%; }
//             100% { background-position: 0% 50%; }
//           }
         
//           @keyframes pointsPop {
//             0% { transform: scale(1); opacity: 1; }
//             50% { transform: scale(1.2); opacity: 0.8; }
//             100% { transform: scale(1); opacity: 0; }
//           }
         
//           .reward-points-display:hover {
//             animation: pulse 1s infinite;
//           }
         
//           @keyframes pulse {
//             0% { transform: scale(1); }
//             50% { transform: scale(1.05); }
//             100% { transform: scale(1); }
//           }
         
//           .points-animation {
//             animation: pointsPop 2s ease-out forwards;
//             position: absolute;
//             right: 0;
//             top: -20px;
//             background: linear-gradient(135deg, #10b981, #059669);
//             color: white;
//             padding: 4px 8px;
//             border-radius: 12px;
//             font-size: 12px;
//             font-weight: bold;
//             white-space: nowrap;
//             box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
//             z-index: 1001;
//           }

//           /* MARK: ADDED - Flying coins animation styles */
//           .flying-coins-container {
//             pointer-events: none;
//           }
         
//           .flying-coin {
//             pointer-events: none;
//           }

//           /* MARK: ADDED - Calendar and notification styles */
//           .calendar-grid {
//             display: grid;
//             grid-template-columns: repeat(7, 1fr);
//             gap: 4px;
//             margin-top: 12px;
//           }
         
//           .calendar-day {
//             width: 32px;
//             height: 32px;
//             display: flex;
//             align-items: 'center';
//             justify-content: 'center';
//             border-radius: 50%;
//             font-size: 12px;
//             cursor: pointer;
//             transition: all 0.2s;
//           }
         
//           .calendar-day:hover {
//             background-color: #f3f4f6;
//           }
         
//           .calendar-day.today {
//             background-color: #3b82f6;
//             color: white;
//           }
         
//           .calendar-day.selected {
//             background-color: #10b981;
//             color: white;
//           }
         
//           .calendar-day.has-plans {
//             position: relative;
//           }
         
//           .calendar-day.has-plans::after {
//             content: '';
//             position: absolute;
//             bottom: 2px;
//             left: 50%;
//             transform: translateX(-50%);
//             width: 4px;
//             height: 4px;
//             background-color: #ef4444;
//             border-radius: 50%;
//           }
         
//           .study-plan-dot {
//             width: 6px;
//             height: 6px;
//             border-radius: 50%;
//             background-color: #ef4444;
//             margin-left: 2px;
//           }

//           /* MARK: ADDED - Rewards history styles */
//           .rewards-history-item {
//             padding: 12px 16px;
//             border-bottom: 1px solid #f3f4f6;
//             transition: background 0.2s;
//           }
         
//           .rewards-history-item:hover {
//             background-color: #f9fafb;
//           }
         
//           .rewards-history-item:last-child {
//             border-bottom: none;
//           }
         
//           .reward-points-positive {
//             color: #059669;
//             font-weight: 600;
//           }
         
//           .reward-points-negative {
//             color: #dc2626;
//             font-weight: 600;
//           }
         
//           .reward-reason {
//             font-size: 13px;
//             color: #1f2937;
//             margin-bottom: 4px;
//           }
         
//           .reward-timestamp {
//             font-size: 11px;
//             color: #6b7280;
//             display: flex;
//             align-items: center;
//             gap: 4px;
//           }

//           /* MARK: ADDED - Clear All Button Styles */
//           .clear-all-button {
//             display: flex;
//             align-items: center;
//             gap: 6px;
//             background: #fee2e2;
//             color: #dc2626;
//             border: 1px solid #fecaca;
//             border-radius: 6px;
//             padding: 6px 12px;
//             font-size: 12px;
//             font-weight: 500;
//             cursor: pointer;
//             transition: all 0.2s ease;
//           }
         
//           .clear-all-button:hover {
//             background: #fecaca;
//             border-color: #fca5a5;
//           }
         
//           .clear-all-button:active {
//             transform: scale(0.98);
//           }

//           /* MARK: ADDED - Delete notification button styles */
//           .delete-notification-btn {
//             background: none;
//             border: none;
//             color: #9ca3af;
//             cursor: pointer;
//             padding: 4px;
//             border-radius: 4px;
//             transition: all 0.2s ease;
//             display: flex;
//             alignItems: 'center';
//             justifyContent: 'center';
//           }
         
//           .delete-notification-btn:hover {
//             background: #fee2e2;
//             color: #dc2626;
//           }

//           /* MARK: ADDED - Mobile Responsive Styles */
//           @media (max-width: 768px) {
//             .navbar-desktop-links {
//               display: none;
//             }
           
//             .navbar-mobile-menu {
//               display: flex;
//             }
           
//             .navbar-container {
//               padding: 0 16px;
//             }
           
//             .navbar-end {
//               gap: 8px;
//             }
           
//             .mobile-menu-overlay {
//               position: fixed;
//               top: 0;
//               left: 0;
//               right: 0;
//               bottom: 0;
//               background: rgba(0, 0, 0, 0.5);
//               z-index: 9995;
//             }
           
//             .mobile-menu-content {
//               position: fixed;
//               top: 0;
//               left: 0;
//               width: 280px;
//               height: 100vh;
//               background: white;
//               z-index: 9996;
//               overflow-y: auto;
//               padding: 20px 0;
//             }
           
//             .mobile-menu-header {
//               padding: 0 20px 20px;
//               border-bottom: 1px solid #e5e7eb;
//               display: flex;
//               justify-content: space-between;
//               align-items: center;
//             }
           
//             .mobile-nav-links {
//               padding: 20px;
//             }
           
//             .mobile-nav-item {
//               margin-bottom: 8px;
//             }
           
//             .mobile-nav-link {
//               display: flex;
//               align-items: center;
//               justify-content: space-between;
//               padding: 12px 16px;
//               background: #f8fafc;
//               border-radius: 8px;
//               text-decoration: none;
//               color: #374151;
//               font-weight: 500;
//             }
           
//             .mobile-dropdown-content {
//               padding-left: 20px;
//               margin-top: 8px;
//             }
           
//             .mobile-dropdown-link {
//               display: block;
//               padding: 10px 16px;
//               text-decoration: none;
//               color: #6b7280;
//               border-left: 2px solid #e5e7eb;
//               margin-bottom: 4px;
//             }
           
//             .mobile-dropdown-link.active {
//               color: #2D5D7B;
//               border-left-color: #2D5D7B;
//               background: #f0f7ff;
//             }
           
//             .mobile-bottom-actions {
//               padding: 20px;
//               border-top: 1px solid #e5e7eb;
//               margin-top: 20px;
//             }
           
//             .mobile-avatar-section {
//               display: flex;
//               align-items: center;
//               gap: 12px;
//               padding: 16px;
//               background: #f8fafc;
//               border-radius: 8px;
//               margin-bottom: 16px;
//             }
           
//             .mobile-action-button {
//               width: '100%';
//               padding: '12px 16px';
//               border: '1px solid #e5e7eb';
//               border-radius: '8px';
//               background: 'white';
//               display: 'flex';
//               align-items: 'center';
//               gap: '8px';
//               margin-bottom: '8px';
//               font-size: '14px';
//               color: '#374151';
//             }
           
//             .reward-points-mobile {
//               display: flex;
//               align-items: center;
//               gap: 8px;
//               padding: 12px 16px;
//               background: linear-gradient(135deg, #FFD700, #FFA500);
//               border-radius: 20px;
//               color: #744210;
//               font-weight: 600;
//               font-size: 14px;
//               margin: 16px 0;
//             }
           
//             .mobile-icons-row {
//               display: flex;
//               gap: 12px;
//               padding: 0 20px;
//               margin-bottom: 16px;
//             }
           
//             .mobile-icon-button {
//               flex: 1;
//               display: flex;
//               flex-direction: column;
//               align-items: center;
//               gap: 4px;
//               padding: 12px 8px;
//               background: #f8fafc;
//               border: 1px solid #e5e7eb;
//               border-radius: 8px;
//               font-size: 12px;
//               color: #374151;
//             }
           
//             .mobile-icon-button .badge {
//               position: absolute;
//               top: -5px;
//               right: -5px;
//               background: #ef4444;
//               color: white;
//               border-radius: 50%;
//               width: 18px;
//               height: 18px;
//               font-size: 10px;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//             }
//           }

//           @media (min-width: 769px) {
//             .navbar-mobile-menu {
//               display: none;
//             }
           
//             .mobile-menu-overlay {
//               display: none;
//             }
//           }

//           @media (max-width: 480px) {
//             .navbar-brand img {
//               height: 28px;
//             }
           
//             .navbar-brand span {
//               font-size: 1.3rem;
//               margin-left: 6px;
//             }
           
//             .navbar-end {
//               gap: 6px;
//             }
           
//             .reward-points-display {
//               padding: 6px 12px;
//               font-size: 12px;
//               min-width: 70px;
//             }
           
//             .language-button, .calendar-button, .notification-button {
//               padding: 6px 8px;
//               min-width: auto;
//             }
           
//             .language-button span {
//               display: none;
//             }
           
//             .mobile-menu-content {
//               width: 100%;
//             }
//           }

//           @media (max-width: 360px) {
//             .navbar-container {
//               padding: 0 12px;
//             }
           
//             .reward-points-display {
//               padding: 4px 8px;
//               font-size: 11px;
//               min-width: 60px;
//             }
           
//             .navbar-avatar-container span {
//               display: none;
//             }
//           }
//         `}
//       </style>
     
//       <div className="navbar-container" style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         width: '100%',
//         padding: '0 20px',
//         boxSizing: 'border-box'
//       }}>
//         {/* Logo - Left Side */}
//         <div className="navbar-brand">
//           <Link
//             to="/student/dashboard"
//             className="navbar-logo-link"
//             style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
//           >
//             <img src={novyaLogo} alt="NOVYA Logo" style={{ height: '35px' }} />
//             <motion.span
//               style={{
//                 background: 'linear-gradient(90deg, #2D5D7B 0%, #4a8db7 25%, #FF6B6B 50%, #FFD166 75%, #2D5D7B 100%)',
//                 WebkitBackgroundClip: 'text',
//                 backgroundClip: 'text',
//                 color: 'transparent',
//                 fontWeight: '800',
//                 fontSize: '1.6rem',
//                 marginLeft: '10px',
//                 letterSpacing: '1px',
//                 fontFamily: "'Poppins', sans-serif",
//                 backgroundSize: '200% auto',
//                 animation: 'gradientText 3s ease infinite',
//               }}
//               initial={{ opacity: 0, x: -10 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//               whileHover={{ backgroundPosition: 'right center', transition: { duration: 1.5 } }}
//             >
//               NOVYA
//             </motion.span>
//           </Link>
//         </div>

//         {/* Desktop Links - Center (Hidden on Mobile) */}
//         <div className="navbar-desktop-links">
//           <ul style={{
//             display: 'flex',
//             alignItems: 'center',
//             margin: 0,
//             padding: 0,
//             listStyle: 'none',
//             gap: '20px'
//           }}>
//             {navLinks.map((link) => (
//               <li
//                 key={link.path}
//                 className={`nav-item ${activeLink === link.path || (link.hasDropdown && activeLink.startsWith(link.path)) ? 'active' : ''} ${link.hasDropdown ? 'has-dropdown' : ''}`}
//                 style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
//                 onMouseEnter={() => {
//                   if (link.path === '/learn') setClassDropdownOpen(true);
//                   if (link.path === '/practice') setPracticeDropdownOpen(true);
//                 }}
//                 onMouseLeave={() => {
//                   if (link.path === '/learn') setClassDropdownOpen(false);
//                   if (link.path === '/practice') setPracticeDropdownOpen(false);
//                 }}
//               >
//                 {link.hasDropdown ? (
//                   <div className="nav-link-wrapper" style={{ position: 'relative' }}>
//                     <span
//                       className={`nav-link ${
//                         activeLink === link.path ||
//                         (link.hasDropdown && activeLink.startsWith(link.path))
//                           ? 'nav-link-active'
//                           : ''
//                       }`}
//                       style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '5px',
//                         textDecoration: 'none',
//                         color:
//                           activeLink === link.path ||
//                           (link.hasDropdown && activeLink.startsWith(link.path))
//                             ? '#2D5D7B'
//                             : 'inherit',
//                         fontWeight:
//                           activeLink === link.path ||
//                           (link.hasDropdown && activeLink.startsWith(link.path))
//                             ? '600'
//                             : '400',
//                         borderBottom:
//                           activeLink === link.path ||
//                           (link.hasDropdown && activeLink.startsWith(link.path))
//                             ? '2px solid #2D5D7B'
//                             : 'none',
//                         padding: '8px 4px',
//                         cursor: 'pointer',
//                       }}
//                       onClick={(e) => e.preventDefault()} // ❌ Stop navigation
//                     >
//                       {link.name}
//                       <FaChevronDown size={10} />
//                     </span>

//                     <AnimatePresence>
//                       {(link.path === '/learn'
//                         ? classDropdownOpen
//                         : practiceDropdownOpen) && (
//                         <motion.div
//                           className="nav-dropdown"
//                           initial={{ opacity: 0, y: -10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -10 }}
//                           style={{
//                             position: 'absolute',
//                             top: '100%',
//                             left: 0,
//                             background: 'white',
//                             borderRadius: '8px',
//                             boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//                             minWidth: '160px',
//                             zIndex: 1000,
//                             padding: '10px 0',
//                           }}
//                         >
//                           <ul
//                             style={{
//                               margin: 0,
//                               padding: 0,
//                               listStyle: 'none',
//                             }}
//                           >
//                             {link.dropdownItems.map((dropdownItem) => (
//                               <li key={dropdownItem.path}>
//                                 <Link
//                                   to={dropdownItem.path}
//                                   className={`dropdown-link ${
//                                     activeLink === dropdownItem.path
//                                       ? 'dropdown-link-active'
//                                       : ''
//                                   }`}
//                                   style={{
//                                     display: 'block',
//                                     padding: '8px 16px',
//                                     textDecoration: 'none',
//                                     color:
//                                       activeLink === dropdownItem.path
//                                         ? '#2D5D7B'
//                                         : '#333',
//                                     fontWeight:
//                                       activeLink === dropdownItem.path
//                                         ? '600'
//                                         : '400',
//                                     background:
//                                       activeLink === dropdownItem.path
//                                         ? '#f0f7ff'
//                                         : 'transparent',
//                                     transition: 'background 0.3s, color 0.3s',
//                                   }}
//                                   onMouseEnter={(e) => {
//                                     if (activeLink !== dropdownItem.path) {
//                                       e.target.style.background = '#f5f5f5';
//                                     }
//                                   }}
//                                   onMouseLeave={(e) => {
//                                     if (activeLink !== dropdownItem.path) {
//                                       e.target.style.background =
//                                         activeLink === dropdownItem.path
//                                           ? '#f0f7ff'
//                                           : 'transparent';
//                                     }
//                                   }}
//                                 >
//                                   {dropdownItem.name}
//                                 </Link>
//                               </li>
//                             ))}
//                           </ul>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 ) : (
//                   <Link
//                     to={link.path}
//                     className={`nav-link ${
//                       activeLink === link.path ? 'nav-link-active' : ''
//                     }`}
//                     style={{
//                       display: 'block',
//                       textDecoration: 'none',
//                       color: activeLink === link.path ? '#2D5D7B' : 'inherit',
//                       fontWeight: activeLink === link.path ? '600' : '400',
//                       borderBottom:
//                         activeLink === link.path ? '2px solid #2D5D7B' : 'none',
//                       padding: '8px 4px',
//                       transition: 'all 0.3s ease',
//                     }}
//                   >
//                     {link.name}
//                   </Link>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Right Side - Calendar, Notifications, Language, Reward Points & Profile */}
//         <div className="navbar-end" style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '15px',
//           position: 'relative'
//         }}>

//           {/* MARK: ADDED - Calendar Icon */}
//           <div className="nav-item" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
//             <div
//               className="nav-link-wrapper"
//               style={{ position: 'relative' }}
//               // onMouseEnter={() => {
//               //   if (!isMobile) {
//               //     loadStudyPlans();
//               //     setCalendarOpen(true);
//               //   }
//               // }}

//               // In the calendar button onMouseEnter, add:
// onMouseEnter={() => {
//   if (!isMobile) {
//     loadStudyPlans();
//     debugTodaysStudyPlans(); // ADD THIS LINE
//     setCalendarOpen(true);
//   }
// }}
//               onMouseLeave={() => !isMobile && setCalendarOpen(false)}
//             >
//               <button
//                 className="calendar-button"
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   background: 'transparent',
//                   border: '1px solid #ddd',
//                   borderRadius: '6px',
//                   padding: '6px 12px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   color: '#333',
//                   transition: 'all 0.3s ease',
//                   minWidth: 'auto',
//                   justifyContent: 'center',
//                   position: 'relative'
//                 }}
//                 onMouseEnter={(e) => { if (!isMobile) { e.target.style.background = '#f8f9fa'; e.target.style.borderColor = '#2D5D7B'; } }}
//                 onMouseLeave={(e) => { if (!isMobile) { e.target.style.background = 'transparent'; e.target.style.borderColor = '#ddd'; } }}
//                 onClick={() => isMobile && setCalendarOpen(!calendarOpen)}
//               >
//                 <FaCalendarAlt size={14} />
//                 {getTodaysStudyPlans().length > 0 && (
//                   <span
//                     style={{
//                       position: 'absolute',
//                       top: '-5px',
//                       right: '-5px',
//                       width: '8px',
//                       height: '8px',
//                       backgroundColor: '#ef4444',
//                       borderRadius: '50%'
//                     }}
//                   ></span>
//                 )}
//               </button>

//               <AnimatePresence>
//                 {calendarOpen && (
//                   <motion.div
//                     className="nav-dropdown"
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     style={{
//                       position: isMobile ? 'fixed' : 'absolute',
//                       top: isMobile ? '50%' : '100%',
//                       left: isMobile ? '50%' : 'auto',
//                       right: isMobile ? 'auto' : 0,
//                       transform: isMobile ? 'translate(-50%, -50%)' : 'none',
//                       background: 'white',
//                       borderRadius: '12px',
//                       boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
//                       width: isMobile ? '90vw' : '320px',
//                       maxWidth: isMobile ? '400px' : 'none',
//                       zIndex: 1000,
//                       padding: '16px',
//                       marginTop: isMobile ? '0' : '8px'
//                     }}
//                   >
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                       <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
//                         {t('study_calendar')}
//                       </h3>
//                       {isMobile && (
//                         <button
//                           onClick={() => setCalendarOpen(false)}
//                           style={{
//                             background: 'none',
//                             border: 'none',
//                             cursor: 'pointer',
//                             padding: '4px',
//                             borderRadius: '4px',
//                             fontSize: '16px',
//                             color: '#6b7280'
//                           }}
//                         >
//                           <FaTimes />
//                         </button>
//                       )}
//                     </div>

//                     {/* Calendar Header */}
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                       <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//                         <button
//                           onClick={() => navigateMonth(-1)}
//                           style={{
//                             background: 'none',
//                             border: 'none',
//                             cursor: 'pointer',
//                             padding: '4px',
//                             borderRadius: '4px',
//                             fontSize: '12px'
//                           }}
//                         >
//                           ‹
//                         </button>
//                         <span style={{ fontSize: '14px', fontWeight: '500', minWidth: '120px', textAlign: 'center' }}>
//                           {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                         </span>
//                         <button
//                           onClick={() => navigateMonth(1)}
//                           style={{
//                             background: 'none',
//                             border: 'none',
//                             cursor: 'pointer',
//                             padding: '4px',
//                             borderRadius: '4px',
//                             fontSize: '12px'
//                           }}
//                         >
//                           ›
//                         </button>
//                       </div>
//                     </div>

//                     {/* Calendar Header Days */}
//                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
//                       {/* {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ( */}
//                        {[t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')].map(day => (
//                         <div key={day} style={{ textAlign: 'center', fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>
//                           {day}
//                         </div>
//                       ))}
//                     </div>

//                     {/* Calendar Grid */}
//                     <div className="calendar-grid">
//                       {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, index) => (
//                         <div key={`empty-${index}`} style={{ width: '32px', height: '32px' }} />
//                       ))}
                     
//                       {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
//                         const day = index + 1;
//                         const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
//                         const hasPlans = getStudyPlansForDate(date).length > 0;
                       
//                         // Debug log for specific dates
//                         if (hasPlans) {
//                           console.log(`Date ${date.toISOString().split('T')[0]} has study plans:`, getStudyPlansForDate(date));
//                         }
                       
//                         return (
//                           <div
//                             key={day}
//                             className={`calendar-day ${isToday(date) ? 'today' : ''} ${isSelectedDate(date) ? 'selected' : ''} ${hasPlans ? 'has-plans' : ''}`}
//                             onClick={() => setSelectedDate(date)}
//                             style={{
//                               backgroundColor: isToday(date) ? '#3b82f6' : isSelectedDate(date) ? '#10b981' : 'transparent',
//                               color: isToday(date) || isSelectedDate(date) ? 'white' : '#1f2937',
//                               fontWeight: isToday(date) || isSelectedDate(date) ? '600' : '400',
//                               width: '32px',
//                               height: '32px',
//                               display: 'flex',
//                               alignItems: 'center',
//                               justifyContent: 'center',
//                               borderRadius: '50%',
//                               fontSize: '12px',
//                               cursor: 'pointer',
//                               transition: 'all 0.2s',
//                               position: 'relative'
//                             }}
//                           >
//                             {day}
//                             {hasPlans && (
//                               <div
//                                 style={{
//                                   position: 'absolute',
//                                   bottom: '2px',
//                                   left: '50%',
//                                   transform: 'translateX(-50%)',
//                                   width: '4px',
//                                   height: '4px',
//                                   backgroundColor: '#ef4444',
//                                   borderRadius: '50%'
//                                 }}
//                               />
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>

//                     {/* Selected Date Study Plans */}
//                     <div style={{ marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
//                       <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
//                        {/* Study Plans for {selectedDate.toLocaleDateString()} */}
//                         {t('study_plans_for')} {selectedDate.toLocaleDateString(i18n.language)}
//                       </h4>
//                       {getStudyPlansForDate(selectedDate).length === 0 ? (
//                         <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', margin: '12px 0' }}>
//                           {/* No study plans scheduled */}
//                           {t('no_study_plans_scheduled')}
//                         </p>
//                       ) : (
//                         <div style={{ maxHeight: '120px', overflow: 'auto' }}>
//                           {getStudyPlansForDate(selectedDate).map((plan, index) => (
//                             <div key={index} style={{
//                               padding: '8px',
//                               backgroundColor: '#f8fafc',
//                               borderRadius: '6px',
//                               marginBottom: '6px',
//                               borderLeft: '3px solid #3b82f6'
//                             }}>
//                               <div style={{ fontSize: '12px', fontWeight: '500', color: '#1f2937' }}>
//                                 {plan.subject} - {plan.topic}
//                               </div>
//                               <div style={{ fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
//                                 <FaClock size={10} />
//                                 {plan.duration}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* MARK: ADDED - Notification Bell Icon */}
//           <div className="nav-item" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
//             <div
//               className="nav-link-wrapper"
//               style={{ position: 'relative' }}
//               onMouseEnter={() => {
//                 if (!isMobile) {
//                   loadNotifications();
//                   setNotificationsOpen(true);
//                 }
//               }}
//               onMouseLeave={() => !isMobile && setNotificationsOpen(false)}
//             >
//               <button
//                 className="notification-button"
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   background: 'transparent',
//                   border: '1px solid #ddd',
//                   borderRadius: '6px',
//                   padding: '6px 12px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   color: '#333',
//                   transition: 'all 0.3s ease',
//                   minWidth: 'auto',
//                   justifyContent: 'center',
//                   position: 'relative'
//                 }}
//                 onMouseEnter={(e) => { if (!isMobile) { e.target.style.background = '#f8f9fa'; e.target.style.borderColor = '#2D5D7B'; } }}
//                 onMouseLeave={(e) => { if (!isMobile) { e.target.style.background = 'transparent'; e.target.style.borderColor = '#ddd'; } }}
//                 onClick={() => isMobile && setNotificationsOpen(!notificationsOpen)}
//               >
//                 <FaBell size={14} />
//                 {unreadNotifications > 0 && (
//                   <span style={{
//                     position: 'absolute',
//                     top: '-5px',
//                     right: '-5px',
//                     backgroundColor: '#ef4444',
//                     color: 'white',
//                     borderRadius: '50%',
//                     width: '16px',
//                     height: '16px',
//                     fontSize: '10px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     fontWeight: 'bold'
//                   }}>
//                     {unreadNotifications}
//                   </span>
//                 )}
//               </button>

//               <AnimatePresence>
//                 {notificationsOpen && (
//                   <motion.div
//                     className="nav-dropdown"
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     style={{
//                       position: isMobile ? 'fixed' : 'absolute',
//                       top: isMobile ? '50%' : '100%',
//                       left: isMobile ? '50%' : 'auto',
//                       right: isMobile ? 'auto' : 0,
//                       transform: isMobile ? 'translate(-50%, -50%)' : 'none',
//                       background: 'white',
//                       borderRadius: '12px',
//                       boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
//                       width: isMobile ? '90vw' : '320px',
//                       maxWidth: isMobile ? '400px' : 'none',
//                       maxHeight: isMobile ? '80vh' : '400px',
//                       zIndex: 1000,
//                       padding: '0',
//                       marginTop: isMobile ? '0' : '8px',
//                       overflow: 'hidden'
//                     }}
//                   >
//                     <div style={{
//                       padding: '16px',
//                       borderBottom: '1px solid #e5e7eb',
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'center'
//                     }}>
//                       <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
//                         {/* Notifications */}
//                         {t('nav-notifications')}
//                       </h3>
//                       <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//                         {isMobile && (
//                           <button
//                             onClick={() => setNotificationsOpen(false)}
//                             style={{
//                               background: 'none',
//                               border: 'none',
//                               cursor: 'pointer',
//                               padding: '4px',
//                               borderRadius: '4px',
//                               fontSize: '16px',
//                               color: '#6b7280',
//                               marginRight: '8px'
//                             }}
//                           >
//                             <FaTimes />
//                           </button>
//                         )}
//                         {unreadNotifications > 0 && (
//                           <button
//                             onClick={markAllNotificationsAsRead}
//                             style={{
//                               background: 'none',
//                               border: 'none',
//                               color: '#3b82f6',
//                               fontSize: '12px',
//                               cursor: 'pointer',
//                               fontWeight: '500'
//                             }}
//                           >
//                             {/* Mark all read */}
//                             {t('mark_all_read')}
//                           </button>
//                         )}
//                         {notifications.length > 0 && (
//                           <button
//                             onClick={clearAllNotifications}
//                             style={{
//                               background: 'none',
//                               border: 'none',
//                               color: '#ef4444',
//                               fontSize: '12px',
//                               cursor: 'pointer',
//                               fontWeight: '500'
//                             }}
//                           >
//                             {/* Clear all */}
//                             {t('clear_all')}
//                           </button>
//                         )}
//                       </div>
//                     </div>

//                     <div style={{ maxHeight: isMobile ? '60vh' : '300px', overflow: 'auto' }}>
//                       {notifications.length === 0 ? (
//                         <div style={{ padding: '32px 16px', textAlign: 'center', color: '#6b7280' }}>
//                           <FaBell size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
//                           {/* <p style={{ margin: 0, fontSize: '14px' }}>No notifications yet</p> */}
//                           {/* <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Study plans will appear here</p> */}
//                             <p style={{ margin: 0, fontSize: '14px' }}>{t('no_notifications_yet')}</p>
//                            <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>{t('study_plans_will_appear_here')}</p>
//                         </div>
//                       ) : (
//                         notifications.map((notification) => (
//                           <div
//                             key={notification.id}
//                             style={{
//                               padding: '12px 16px',
//                               borderBottom: '1px solid #f3f4f6',
//                               backgroundColor: notification.read ? 'transparent' : '#f0f9ff',
//                               cursor: 'pointer',
//                               transition: 'background 0.2s',
//                               position: 'relative'
//                             }}
//                             onClick={() => !notification.read && markNotificationAsRead(notification.id)}
//                             onMouseEnter={(e) => {
//                               if (!isMobile) {
//                                 e.currentTarget.style.backgroundColor = notification.read ? '#f9fafb' : '#e0f2fe';
//                               }
//                             }}
//                             onMouseLeave={(e) => {
//                               if (!isMobile) {
//                                 e.currentTarget.style.backgroundColor = notification.read ? 'transparent' : '#f0f9ff';
//                               }
//                             }}
//                           >
//                             {/* MARK: ADDED - Delete notification button */}
//                             <button
//                               className="delete-notification-btn"
//                               onClick={(e) => {
//                                 e.stopPropagation(); // Prevent marking as read when deleting
//                                 deleteNotification(notification.id);
//                               }}
//                               style={{
//                                 position: 'absolute',
//                                 top: '8px',
//                                 right: '8px',
//                                 background: 'none',
//                                 border: 'none',
//                                 color: '#9ca3af',
//                                 cursor: 'pointer',
//                                 padding: '4px',
//                                 borderRadius: '4px',
//                                 transition: 'all 0.2s ease',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center'
//                               }}
//                               onMouseEnter={(e) => {
//                                 e.target.style.background = '#fee2e2';
//                                 e.target.style.color = '#dc2626';
//                               }}
//                               onMouseLeave={(e) => {
//                                 e.target.style.background = 'none';
//                                 e.target.style.color = '#9ca3af';
//                               }}
//                             >
//                               <FaTimes size={12} />
//                             </button>

//                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', paddingRight: '20px' }}>
//                               <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
//                                 {notification.title}
//                               </div>
//                               {!notification.read && (
//                                 <div style={{
//                                   width: '8px',
//                                   height: '8px',
//                                   backgroundColor: '#3b82f6',
//                                   borderRadius: '50%',
//                                   flexShrink: 0,
//                                   marginLeft: '8px'
//                                 }} />
//                               )}
//                             </div>
//                             <div style={{ fontSize: '12px', color: '#4b5563', marginBottom: '4px', paddingRight: '20px' }}>
//                               {notification.message}
//                             </div>
//                             <div style={{ fontSize: '11px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
//                               <FaClock size={10} />
//                               {new Date(notification.date).toLocaleDateString()} at {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                             </div>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Language Button */}
//           <div className="nav-item" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
//             <div
//               className="nav-link-wrapper"
//               style={{ position: 'relative' }}
//               onMouseEnter={() => !isMobile && setLangDropdownOpen(true)}
//               onMouseLeave={() => !isMobile && setLangDropdownOpen(false)}
//             >
//               <button
//                 className="language-button"
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   background: 'transparent',
//                   border: '1px solid #ddd',
//                   borderRadius: '6px',
//                   padding: '6px 12px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   color: '#333',
//                   transition: 'all 0.3s ease',
//                   minWidth: isMobile ? 'auto' : '90px',
//                   justifyContent: 'center'
//                 }}
//                 onMouseEnter={(e) => { if (!isMobile) { e.target.style.background = '#f8f9fa'; e.target.style.borderColor = '#2D5D7B'; } }}
//                 onMouseLeave={(e) => { if (!isMobile) { e.target.style.background = 'transparent'; e.target.style.borderColor = '#ddd'; } }}
//                 onClick={() => isMobile && setLangDropdownOpen(!langDropdownOpen)}
//               >
//                 <FaGlobe size={12} />
//                 {!isMobile && <span>{i18n.language.toUpperCase()}</span>}
//                 <FaChevronDown size={8} />
//               </button>

//               <AnimatePresence>
//                 {langDropdownOpen && (
//                   <motion.div
//                     className="nav-dropdown"
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     style={{
//                       position: isMobile ? 'fixed' : 'absolute',
//                       top: isMobile ? '50%' : '100%',
//                       left: isMobile ? '50%' : 'auto',
//                       right: isMobile ? 'auto' : 0,
//                       transform: isMobile ? 'translate(-50%, -50%)' : 'none',
//                       background: 'white',
//                       borderRadius: '8px',
//                       boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//                       minWidth: isMobile ? '80vw' : '140px',
//                       maxWidth: isMobile ? '300px' : 'none',
//                       zIndex: 1000,
//                       padding: '8px 0',
//                       marginTop: isMobile ? '0' : '5px'
//                     }}
//                   >
//                     {isMobile && (
//                       <div style={{ padding: '8px 16px', borderBottom: '1px solid #e5e7eb' }}>
//                         <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>Select Language</h4>
//                       </div>
//                     )}
//                     <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
//                       {languages.map((lang) => (
//                         <li key={lang.code}>
//                           <button
//                             onClick={() => {
//                               handleLanguageChange(lang.code);
//                               if (isMobile) setLangDropdownOpen(false);
//                             }}
//                             className="dropdown-link"
//                             style={{
//                               width: '100%',
//                               border: 'none',
//                               background: 'transparent',
//                               padding: '12px 16px',
//                               textAlign: 'left',
//                               cursor: 'pointer',
//                               fontSize: '14px',
//                               color: '#333',
//                               transition: 'all 0.3s ease',
//                               display: 'flex',
//                               alignItems: 'center',
//                               borderRadius: '0'
//                             }}
//                             onMouseEnter={(e) => { if (!isMobile) { e.target.style.background = '#2D5D7B'; e.target.style.color = 'white'; } }}
//                             onMouseLeave={(e) => { if (!isMobile) { e.target.style.background = 'transparent'; e.target.style.color = '#333'; } }}
//                           >
//                             {lang.label}
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                     {isMobile && (
//                       <div style={{ padding: '8px 16px', borderTop: '1px solid #e5e7eb' }}>
//                         <button
//                           onClick={() => setLangDropdownOpen(false)}
//                           style={{
//                             width: '100%',
//                             padding: '8px',
//                             background: '#f3f4f6',
//                             border: 'none',
//                             borderRadius: '4px',
//                             cursor: 'pointer',
//                             fontSize: '14px',
//                             color: '#6b7280'
//                           }}
//                         >
//                           Close
//                         </button>
//                       </div>
//                     )}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Enhanced Reward Points Display with Animation and History */}
//           <div className="nav-item" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
//             <div
//               className="nav-link-wrapper"
//               style={{ position: 'relative' }}
//               onMouseEnter={() => {
//                 if (!isMobile) {
//                   loadRewardsHistory();
//                   setRewardsHistoryOpen(true);
//                 }
//               }}
//               onMouseLeave={() => !isMobile && setRewardsHistoryOpen(false)}
//             >
//               <motion.div
//                 className="reward-points-display"
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   background: 'linear-gradient(135deg, #FFD700, #FFA500)',
//                   padding: '8px 16px',
//                   borderRadius: '20px',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   color: '#744210',
//                   border: '2px solid #FFC107',
//                   cursor: 'pointer',
//                   boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)',
//                   minWidth: isMobile ? '70px' : '80px',
//                   justifyContent: 'center',
//                   position: 'relative',
//                   overflow: 'hidden'
//                 }}
//                 title="Your Reward Points - Click to view history"
//                 whileHover={{ scale: isMobile ? 1 : 1.05, boxShadow: isMobile ? '0 2px 8px rgba(255, 193, 7, 0.3)' : '0 4px 12px rgba(255, 193, 7, 0.5)' }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => isMobile && setRewardsHistoryOpen(true)}
//               >
//                 {/* Animated background effect */}
//                 <div style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
//                   backgroundSize: '200% 100%',
//                   animation: 'shimmer 2s infinite linear',
//                   opacity: 0.5
//                 }} />
               
//                 <FaCoins size={16} color="#744210" style={{ position: 'relative', zIndex: 1 }} />
//                 <span style={{
//                   fontFamily: "'Poppins', sans-serif",
//                   background: 'linear-gradient(45deg, #744210, #8B5A2B)',
//                   WebkitBackgroundClip: 'text',
//                   backgroundClip: 'text',
//                   color: 'transparent',
//                   position: 'relative',
//                   zIndex: 1
//                 }}>
//                   {currentRewardPoints.toLocaleString()}
//                 </span>
               
//                 {/* Points Animation for Video/Mock Test Rewards */}
//                 {showPointsAnimation && pointsChange > 0 && (
//                   <motion.div
//                     className="points-animation"
//                     initial={{ opacity: 0, y: 0 }}
//                     animate={{ opacity: 1, y: -20 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.5 }}
//                   >
//                     +{pointsChange}
//                   </motion.div>
//                 )}
//               </motion.div>

//               {/* Rewards History Drawer - Full Right Side */}
//               <AnimatePresence>
//                 {rewardsHistoryOpen && (
//                   <motion.div
//                     initial={{ x: '100%', opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     exit={{ x: '100%', opacity: 0 }}
//                     transition={{ type: 'tween', duration: 0.3 }}
//                     style={{
//                       position: 'fixed',
//                       top: 0,
//                       right: 0,
//                       height: '100vh',
//                       width: isMobile ? '100vw' : '380px',
//                       background: '#fff',
//                       boxShadow: '-4px 0 25px rgba(0,0,0,0.2)',
//                       borderTopLeftRadius: isMobile ? '0' : '16px',
//                       borderBottomLeftRadius: isMobile ? '0' : '16px',
//                       zIndex: 10000,
//                       display: 'flex',
//                       flexDirection: 'column',
//                       overflow: 'hidden',
//                     }}
//                   >
//                     {/* Header */}
//                     <div
//                       style={{
//                         padding: '20px',
//                         borderBottom: '1px solid #e5e7eb',
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         background: 'linear-gradient(135deg, #fff9e6, #fff0cc)',
//                         position: 'sticky',
//                         top: 0,
//                         zIndex: 1,
//                       }}
//                     >
//                       <div>
//                         <h3
//                           style={{
//                             fontSize: '18px',
//                             fontWeight: '600',
//                             color: '#1f2937',
//                             margin: 0,
//                           }}
//                         >
//                           {/* Reward Points History */}
//                           {t('reward_points_history')}
//                         </h3>
//                         <p
//                           style={{
//                             fontSize: '13px',
//                             color: '#6b7280',
//                             margin: '4px 0 0 0',
//                           }}
//                         >
//                           <b style={{ color: '#8B5A2B' }}>
//                             {t('total_point', { count: currentRewardPoints.toLocaleString() })}
//                           </b>
//                         </p>
//                       </div>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                         <button
//                           onClick={() => setRewardsHistoryOpen(false)}
//                           style={{
//                             background: 'none',
//                             border: 'none',
//                             cursor: 'pointer',
//                             padding: '4px',
//                             borderRadius: '4px',
//                             fontSize: '16px',
//                             color: '#6b7280'
//                           }}
//                         >
//                           <FaTimes />
//                         </button>
//                       </div>
//                     </div>

//                     {/* Clear All Button */}
//                     {rewardsHistory.length > 0 && (
//                       <div
//                         style={{
//                           padding: '12px 20px',
//                           borderBottom: '1px solid #e5e7eb',
//                           display: 'flex',
//                           justifyContent: 'flex-end',
//                           background: '#fafafa',
//                         }}
//                       >
//                         <button
//                           className="clear-all-button"
//                           onClick={clearAllRewardsHistory}
//                           style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '6px',
//                             background: '#fee2e2',
//                             color: '#dc2626',
//                             border: '1px solid #fecaca',
//                             borderRadius: '6px',
//                             padding: '6px 12px',
//                             fontSize: '12px',
//                             fontWeight: '500',
//                             cursor: 'pointer',
//                             transition: 'all 0.2s ease',
//                           }}
//                           onMouseEnter={(e) => {
//                             e.target.style.background = '#fecaca';
//                             e.target.style.borderColor = '#fca5a5';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.target.style.background = '#fee2e2';
//                             e.target.style.borderColor = '#fecaca';
//                           }}
//                         >
//                           <FaTrash size={10} />
//                           {/* Clear All History */}
//                           {t('clear_all_history')}
//                         </button>
//                       </div>
//                     )}

//                     {/* Scrollable Content */}
//                     <div
//                       style={{
//                         flex: 1,
//                         overflowY: 'auto',
//                         padding: '16px',
//                       }}
//                     >
//                       {rewardsHistory.length === 0 ? (
//                         <div
//                           style={{
//                             padding: '40px 16px',
//                             textAlign: 'center',
//                             color: '#6b7280',
//                           }}
//                         >
//                           <FaCoins size={28} style={{ marginBottom: '8px', opacity: 0.5 }} />
//                           {/* <p style={{ margin: 0, fontSize: '15px' }}>No reward history yet</p> */}
//                           <p style={{ margin: 0, fontSize: '15px' }}>{t('no_reward_history')}</p>
//                           <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
//                             {/* Complete activities to earn points! */}
//                             {t('earn_points_hint')}
//                           </p>
//                         </div>
//                       ) : (
//                         rewardsHistory.map((reward) => (
//                           <div
//                             key={reward.id}
//                             style={{
//                               paddingBottom: '12px',
//                               borderBottom: '1px solid #f3f4f6',
//                               marginBottom: '12px',
//                             }}
//                           >
//                             <div
//                               style={{
//                                 display: 'flex',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'flex-start',
//                                 marginBottom: '4px',
//                               }}
//                             >
//                               <div
//                                 style={{
//                                   fontWeight: 500,
//                                   color: '#374151',
//                                   fontSize: '14px',
//                                 }}
//                               >
//                                 {reward.reason}
//                               </div>
//                               <div
//                                 style={{
//                                   color: reward.points > 0 ? '#16a34a' : '#dc2626',
//                                   fontWeight: '600',
//                                   fontSize: '14px',
//                                 }}
//                               >
//                                 {reward.points > 0 ? '+' : ''}
//                                 {reward.points}
//                               </div>
//                             </div>

//                             <div
//                               style={{
//                                 display: 'flex',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 fontSize: '12px',
//                                 color: '#6b7280',
//                               }}
//                             >
//                               <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
//                                 <FaClock size={10} />
//                                 {new Date(reward.timestamp).toLocaleDateString()} at{' '}
//                                 {new Date(reward.timestamp).toLocaleTimeString([], {
//                                   hour: '2-digit',
//                                   minute: '2-digit',
//                                 })}
//                               </div>
//                               <div
//                                 style={{
//                                   fontSize: '11px',
//                                   color: '#9ca3af',
//                                   fontWeight: '500',
//                                 }}
//                               >
//                                 Total: {reward.totalPoints}
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Avatar Dropdown */}
//           <div
//             className="navbar-avatar-container"
//             style={{
//               position: 'relative',
//               cursor: 'pointer',
//             }}
//             onMouseEnter={() => !isMobile && setAvatarOpen(true)}
//             onMouseLeave={() => !isMobile && setAvatarOpen(false)}
//           >
//             {/* Avatar with Name */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <div
//                 style={{
//                   width: '32px',
//                   height: '32px',
//                   borderRadius: '50%',
//                   overflow: 'hidden',
//                   boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   background: '#f0f0f0',
//                   transition: 'transform 0.2s',
//                 }}
//               >
//                 {avatar ? (
//                   <img
//                     src={avatar}
//                     alt="User Avatar"
//                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                   />
//                 ) : (
//                   <FaUserCircle size={28} color="#4B5563" />
//                 )}
//               </div>
//               {!isMobile && (
//                 <span style={{ fontWeight: 500, color: '#111827', fontSize: '14px' }}>
//                   {name || 'User'}
//                 </span>
//               )}
//             </div>

//             {/* Dropdown */}
//             <AnimatePresence>
//               {avatarOpen && (
//                 <motion.div
//                   className="avatar-dropdown"
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   style={{
//                     position: 'absolute',
//                     top: 'calc(100% + 8px)',
//                     right: 0,
//                     background: 'white',
//                     borderRadius: '8px',
//                     boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
//                     padding: '8px 0',
//                     minWidth: '160px',
//                     zIndex: 1000,
//                   }}
//                 >
//                   {/* Reward Points Summary in Dropdown */}
//                   <div style={{
//                     padding: '12px 16px',
//                     borderBottom: '1px solid #f0f0f0',
//                     background: 'linear-gradient(135deg, #fff9e6, #fff0cc)'
//                   }}>
//                     <div style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px',
//                       fontSize: '14px',
//                       color: '#744210',
//                       fontWeight: '600'
//                     }}>
//                       <FaCoins size={14} color="#FFA500" />
//                       {/* <span>Reward Points: {currentRewardPoints.toLocaleString()}</span> */}
//                       <span>{t('reward_points')}: {currentRewardPoints.toLocaleString()}</span>
//                     </div>
//                     {/* REMOVED WELCOME MESSAGE LINE */}
//                   </div>

//                   <button
//                     onClick={() => navigate('/user-details')}
//                     className="profile-button"
//                     style={{
//                       width: '100%',
//                       border: 'none',
//                       background: 'transparent',
//                       padding: '10px 16px',
//                       cursor: 'pointer',
//                       textAlign: 'left',
//                       fontSize: '14px',
//                       color: '#1F2937',
//                       transition: 'background 0.2s, color 0.2s',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px'
//                     }}
//                     onMouseEnter={(e) => { e.target.style.background = '#f0f0f0'; }}
//                     onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
//                   >
//                     <FaUserCircle size={14} />
//                     {/* View Profile */}
//                     {t('view_profile')}
//                   </button>
//                   <button
//                     onClick={handleLogout}
//                     className="logout-button"
//                     style={{
//                       width: '100%',
//                       border: 'none',
//                       background: 'transparent',
//                       padding: '10px 16px',
//                       cursor: 'pointer',
//                       textAlign: 'left',
//                       fontSize: '14px',
//                       color: '#dc2626',
//                       transition: 'background 0.2s, color 0.2s',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px'
//                     }}
//                     onMouseEnter={(e) => { e.target.style.background = '#fef2f2'; }}
//                     onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
//                   >
//                     <FaSignOutAlt size={14} />
//                     {/* Logout */}
//                     {t('logout')}
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* MARK: ADDED - Mobile Menu Button */}
//           <div className="navbar-mobile-menu">
//             <button
//               onClick={() => setMobileMenuOpen(true)}
//               style={{
//                 background: 'transparent',
//                 border: '1px solid #ddd',
//                 borderRadius: '6px',
//                 padding: '8px',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               <FaBars size={16} color="#333" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MARK: ADDED - Mobile Menu Overlay and Content */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <>
//             <motion.div
//               className="mobile-menu-overlay"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={closeMobileMenu}
//             />
//             <motion.div
//               className="mobile-menu-content"
//               initial={{ x: -280 }}
//               animate={{ x: 0 }}
//               exit={{ x: -280 }}
//               transition={{ type: 'tween', duration: 0.3 }}
//             >
//               <div className="mobile-menu-header">
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                   <img src={novyaLogo} alt="NOVYA Logo" style={{ height: '30px' }} />
//                   <span style={{
//                     background: 'linear-gradient(90deg, #2D5D7B 0%, #4a8db7 25%, #FF6B6B 50%, #FFD166 75%, #2D5D7B 100%)',
//                     WebkitBackgroundClip: 'text',
//                     backgroundClip: 'text',
//                     color: 'transparent',
//                     fontWeight: '800',
//                     fontSize: '1.4rem',
//                     fontFamily: "'Poppins', sans-serif",
//                   }}>
//                     NOVYA
//                   </span>
//                 </div>
//                 <button
//                   onClick={closeMobileMenu}
//                   style={{
//                     background: 'none',
//                     border: 'none',
//                     cursor: 'pointer',
//                     padding: '4px',
//                     borderRadius: '4px',
//                     fontSize: '18px',
//                     color: '#6b7280'
//                   }}
//                 >
//                   <FaTimes />
//                 </button>
//               </div>

//               {/* User Info Section */}
//               <div className="mobile-avatar-section">
//                 <div
//                   style={{
//                     width: '48px',
//                     height: '48px',
//                     borderRadius: '50%',
//                     overflow: 'hidden',
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     background: '#f0f0f0',
//                   }}
//                 >
//                   {avatar ? (
//                     <img
//                       src={avatar}
//                       alt="User Avatar"
//                       style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                     />
//                   ) : (
//                     <FaUserCircle size={40} color="#4B5563" />
//                   )}
//                 </div>
//                 <div>
//                   <div style={{ fontWeight: 600, color: '#111827', fontSize: '16px' }}>
//                     {name || 'User'}
//                   </div>
//                   <div style={{ fontSize: '14px', color: '#6b7280' }}>
//                     Student
//                   </div>
//                 </div>
//               </div>

//               {/* Reward Points Display */}
//               <div className="reward-points-mobile">
//                 <FaCoins size={18} color="#744210" />
//                 <span>{currentRewardPoints.toLocaleString()} Points</span>
//               </div>

//               {/* Quick Actions Row */}
//               <div className="mobile-icons-row">
//                 <button
//                   className="mobile-icon-button"
//                   onClick={() => {
//                     loadStudyPlans();
//                     setCalendarOpen(true);
//                     closeMobileMenu();
//                   }}
//                   style={{ position: 'relative' }}
//                 >
//                   <FaCalendarAlt size={18} />
//                   <span>Calendar</span>
//                   {getTodaysStudyPlans().length > 0 && (
//                     <span className="badge"></span>
//                   )}
//                 </button>
//                 <button
//                   className="mobile-icon-button"
//                   onClick={() => {
//                     loadNotifications();
//                     setNotificationsOpen(true);
//                     closeMobileMenu();
//                   }}
//                   style={{ position: 'relative' }}
//                 >
//                   <FaBell size={18} />
//                   <span>Alerts</span>
//                   {unreadNotifications > 0 && (
//                     <span className="badge">{unreadNotifications}</span>
//                   )}
//                 </button>
//                 <button
//                   className="mobile-icon-button"
//                   onClick={() => {
//                     loadRewardsHistory();
//                     setRewardsHistoryOpen(true);
//                     closeMobileMenu();
//                   }}
//                 >
//                   <FaHistory size={18} />
//                   <span>History</span>
//                 </button>
//               </div>

//               {/* Navigation Links */}
//               <div className="mobile-nav-links">
//                 {navLinks.map((link) => (
//                   <div key={link.path} className="mobile-nav-item">
//                     {link.hasDropdown ? (
//                       <>
//                         <button
//                           className="mobile-nav-link"
//                           onClick={() => toggleMobileDropdown(link.path === '/learn' ? 'learn' : 'practice')}
//                         >
//                           <span>{link.name}</span>
//                           <FaChevronDown
//                             size={12}
//                             style={{
//                               transform: mobileDropdowns[link.path === '/learn' ? 'learn' : 'practice'] ? 'rotate(180deg)' : 'none',
//                               transition: 'transform 0.3s ease'
//                             }}
//                           />
//                         </button>
//                         <AnimatePresence>
//                           {mobileDropdowns[link.path === '/learn' ? 'learn' : 'practice'] && (
//                             <motion.div
//                               className="mobile-dropdown-content"
//                               initial={{ opacity: 0, height: 0 }}
//                               animate={{ opacity: 1, height: 'auto' }}
//                               exit={{ opacity: 0, height: 0 }}
//                             >
//                               {link.dropdownItems.map((dropdownItem) => (
//                                 <Link
//                                   key={dropdownItem.path}
//                                   to={dropdownItem.path}
//                                   className={`mobile-dropdown-link ${activeLink === dropdownItem.path ? 'active' : ''}`}
//                                   onClick={closeMobileMenu}
//                                 >
//                                   {dropdownItem.name}
//                                 </Link>
//                               ))}
//                             </motion.div>
//                           )}
//                         </AnimatePresence>
//                       </>
//                     ) : (
//                       <Link
//                         to={link.path}
//                         className="mobile-nav-link"
//                         onClick={closeMobileMenu}
//                         style={{
//                           color: activeLink === link.path ? '#2D5D7B' : '#374151',
//                           background: activeLink === link.path ? '#f0f7ff' : '#f8fafc',
//                         }}
//                       >
//                         <span>{link.name}</span>
//                       </Link>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Bottom Actions */}
//               <div className="mobile-bottom-actions">
//                 <button
//                   className="mobile-action-button"
//                   onClick={() => {
//                     setLangDropdownOpen(true);
//                     closeMobileMenu();
//                   }}
//                 >
//                   <FaGlobe size={14} />
//                   <span>Language ({i18n.language.toUpperCase()})</span>
//                 </button>
//                 <button
//                   className="mobile-action-button"
//                   onClick={() => {
//                     navigate('/user-details');
//                     closeMobileMenu();
//                   }}
//                 >
//                   <FaUserCircle size={14} />
//                   <span>View Profile</span>
//                 </button>
//                 <button
//                   className="mobile-action-button"
//                   onClick={handleLogout}
//                   style={{ color: '#dc2626', borderColor: '#fecaca' }}
//                 >
//                   <FaSignOutAlt size={14} />
//                    <span>logout</span>
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// };

// export default Navbar;











import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUserCircle,
  FaChevronDown,
  FaGlobe,
  FaSignOutAlt,
  FaCoins,
  FaCalendarAlt,
  FaBell,
  FaClock,
  FaTimes,
  FaHistory,
  FaTrash,
  FaBars,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './Navbarrr.css';
import novyaLogo from '../home/assets/NOVYA LOGO.png';
import { API_CONFIG, djangoAPI } from '../../config/api';

const Navbar = ({ isFullScreen, rewardPoints = 0 }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [practiceDropdownOpen, setPracticeDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [rewardsHistoryOpen, setRewardsHistoryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({
    learn: false,
    practice: false
  });
  const [mobileLangDropdownOpen, setMobileLangDropdownOpen] = useState(false);
 
  const [showFlyingCoins, setShowFlyingCoins] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [currentRewardPoints, setCurrentRewardPoints] = useState(rewardPoints);
  const [pointsChange, setPointsChange] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [studyPlans, setStudyPlans] = useState([]);
  const [calendarEntries, setCalendarEntries] = useState([]); // Calendar entries from database
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rewardsHistory, setRewardsHistory] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'హిందీ' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'ml', label: 'മലയാളം' },
  ];

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load rewards history
  const loadRewardsHistory = () => {
    try {
      const savedHistory = localStorage.getItem('rewardsHistory');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        // Sort by timestamp descending (newest first)
        const sortedHistory = history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRewardsHistory(sortedHistory);
        console.log('✅ Loaded rewards history:', sortedHistory.length, 'entries');
      } else {
        setRewardsHistory([]);
        console.log('ℹ️ No rewards history found in localStorage');
      }
    } catch (error) {
      console.error('❌ Error loading rewards history:', error);
      setRewardsHistory([]);
    }
  };

  const clearAllRewardsHistory = () => {
    try {
      localStorage.removeItem('rewardsHistory');
      setRewardsHistory([]);
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'rewardsHistory',
        newValue: null
      }));
    } catch (error) {
      console.error('Error clearing rewards history:', error);
    }
  };

  const addRewardPointsWithHistory = (points, reason, source = 'system') => {
    const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
    const newPoints = currentPoints + points;
   
    localStorage.setItem('rewardPoints', newPoints.toString());
    setCurrentRewardPoints(newPoints);
   
    const historyEntry = {
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      points: points,
      totalPoints: newPoints,
      reason: reason,
      source: source,
      timestamp: new Date().toISOString()
    };
   
    const existingHistory = JSON.parse(localStorage.getItem('rewardsHistory') || '[]');
    const updatedHistory = [historyEntry, ...existingHistory];
    localStorage.setItem('rewardsHistory', JSON.stringify(updatedHistory));
    setRewardsHistory(updatedHistory);
   
    window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
      detail: { rewardPoints: newPoints }
    }));
   
    return historyEntry;
  };

  useEffect(() => {
    loadStudyPlans();
    loadNotifications();
    loadRewardsHistory();

    const handleStudyPlanAdded = (event) => {
      if (event.detail && event.detail.studyPlan) {
        loadStudyPlans();
        // DON'T create notification here - LessonPage already creates it
        // This prevents duplicate notifications
        console.log('ℹ️ Navbarrr - Study plan added event received, refreshing study plans only');
      }
    };

    const handleNotificationAdded = (event) => {
      if (event.detail && event.detail.notification) {
        loadNotifications();
      }
    };

    const handleStudyPlanUpdated = () => {
      loadStudyPlans();
    };

    const handleStorageChange = (e) => {
      if (e.key === 'studyPlans') {
        loadStudyPlans();
      }
      if (e.key === 'studyNotifications') {
        loadNotifications();
      }
      if (e.key === 'rewardsHistory') {
        loadRewardsHistory();
      }
    };

    window.addEventListener('studyPlanAdded', handleStudyPlanAdded);
    window.addEventListener('notificationAdded', handleNotificationAdded);
    window.addEventListener('studyPlanUpdated', handleStudyPlanUpdated);
    window.addEventListener('storage', handleStorageChange);
   
    // Removed setInterval to prevent infinite loop - only load on mount and events
    // If periodic updates are needed, increase interval to 30 seconds or more
   
    return () => {
      window.removeEventListener('studyPlanAdded', handleStudyPlanAdded);
      window.removeEventListener('notificationAdded', handleNotificationAdded);
      window.removeEventListener('studyPlanUpdated', handleStudyPlanUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadStudyPlans = async () => {
    try {
      // Load from localStorage (backward compatibility)
      const savedPlans = localStorage.getItem('studyPlans');
      let plansFromStorage = [];
      if (savedPlans) {
        plansFromStorage = JSON.parse(savedPlans);
        const uniquePlans = plansFromStorage.filter((plan, index, self) =>
          index === self.findIndex(p => p.id === plan.id)
        ).map(plan => ({
          ...plan,
          studySessions: (plan.studySessions || []).filter(session =>
            session && session.date && !isNaN(new Date(session.date).getTime())
          ).map(session => {
            let normalizedDate;
            try {
              const dateObj = new Date(session.date);
              normalizedDate = dateObj.toISOString().split('T')[0];
            } catch (error) {
              normalizedDate = session.date;
            }
            return {
              ...session,
              date: normalizedDate
            };
          })
        }));
        setStudyPlans(uniquePlans);
      } else {
        setStudyPlans([]);
      }

      // Also load calendar entries from database
      try {
        const response = await djangoAPI.get(API_CONFIG.DJANGO.AI_ASSISTANT.GET_CALENDAR_ENTRIES);
        if (response && response.calendar_entries) {
          const entries = response.calendar_entries.map(entry => ({
            calendar_id: entry.calendar_id,
            entry_date: entry.entry_date,
            subject: entry.subject,
            topic: entry.topic,
            duration: entry.duration,
            class_name: entry.class_name,
            chapter: entry.chapter,
            subtopic: entry.subtopic,
            plan_id: entry.plan_id,
            completed: entry.completed
          }));
          setCalendarEntries(entries);
          console.log(`✅ Loaded ${entries.length} calendar entries from database`);
        }
      } catch (error) {
        console.error('❌ Error loading calendar entries from database:', error);
        // Continue with localStorage data even if database fetch fails
      }
    } catch (error) {
      console.error('Error loading study plans:', error);
      setStudyPlans([]);
    }
  };

  const loadNotifications = async () => {
    try {
      // First load from localStorage (for backward compatibility)
      const savedNotifications = localStorage.getItem('studyNotifications');
      let notificationsFromStorage = [];
      if (savedNotifications) {
        notificationsFromStorage = JSON.parse(savedNotifications);
      }
      
      // Then fetch from database
      try {
        const response = await djangoAPI.get(API_CONFIG.DJANGO.NOTIFICATIONS.GET_STUDENT_NOTIFICATIONS);
        if (response && response.notifications) {
          // Convert database notifications to frontend format
          const dbNotifications = response.notifications.map(notif => ({
            id: `notif_${notif.plan_id || notif.notification_id}`,
            type: notif.notification_type || 'study_plan_created',
            title: notif.title,
            message: notif.message,
            date: notif.created_at || new Date().toISOString(),
            read: notif.is_read || false,
            planId: notif.plan_id,
            notificationId: notif.notification_id // Store DB ID for delete/mark-read operations
          }));
          
          // Merge with localStorage notifications (prioritize database)
          // Remove duplicates by checking both id and message content
          const allNotifications = [...dbNotifications, ...notificationsFromStorage];
          const uniqueNotifs = allNotifications.filter((notif, index, self) =>
            index === self.findIndex(n => 
              n.id === notif.id || 
              (n.message === notif.message && n.title === notif.title && Math.abs(new Date(n.date) - new Date(notif.date)) < 60000)
            )
          );
          
          setNotifications(uniqueNotifs);
          const unread = uniqueNotifs.filter(notif => !notif.read).length;
          setUnreadNotifications(unread);
          console.log(`✅ Loaded ${uniqueNotifs.length} notifications (${dbNotifications.length} from database)`);
          return;
        }
      } catch (error) {
        console.error('❌ Error loading notifications from database:', error);
        // Continue with localStorage data if database fetch fails
      }
      
      // Fallback to localStorage only if database fetch fails
      if (notificationsFromStorage.length > 0) {
        const uniqueNotifs = notificationsFromStorage.filter((notif, index, self) =>
          index === self.findIndex(n => 
            n.id === notif.id || 
            (n.message === notif.message && n.title === notif.title && Math.abs(new Date(n.date) - new Date(notif.date)) < 60000)
          )
        );
        setNotifications(uniqueNotifs);
        const unread = uniqueNotifs.filter(notif => !notif.read).length;
        setUnreadNotifications(unread);
      } else {
        setNotifications([]);
        setUnreadNotifications(0);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
      setUnreadNotifications(0);
    }
  };

  const addNotification = (notification) => {
    const existingNotifications = JSON.parse(localStorage.getItem('studyNotifications') || '[]');
    const isDuplicate = existingNotifications.some(notif => notif.id === notification.id);
    if (isDuplicate) return;

    const updatedNotifications = [notification, ...existingNotifications];
    localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
    setUnreadNotifications(prev => prev + 1);
   
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'studyNotifications',
      newValue: JSON.stringify(updatedNotifications)
    }));
  };

  const createNotification = async (studyPlan) => {
    const notificationId = `notif_${studyPlan.id}`;
    const existingNotifications = JSON.parse(localStorage.getItem('studyNotifications') || '[]');
    const isDuplicateNotification = existingNotifications.some(notif => notif.id === notificationId);
   
    let notification;
    if (isDuplicateNotification) {
      console.log('⚠️ Navbarrr - Notification already exists in localStorage:', notificationId);
      // Use existing notification
      notification = existingNotifications.find(notif => notif.id === notificationId);
      // Still try to save to database if it doesn't have a database ID
      if (notification && notification.notificationId) {
        console.log('✅ Navbarrr - Notification already exists in both localStorage and database, skipping');
        return; // Already exists in both localStorage and database
      }
      if (!notification) {
        notification = {
          id: notificationId,
          type: 'study_plan_created',
          title: t('new_study_plan_created'),
          message: `Study plan for ${studyPlan.title} has been added to your calendar starting from ${new Date(studyPlan.createdDate || Date.now()).toLocaleDateString()}`,
          date: new Date().toISOString(),
          read: false,
          planId: studyPlan.id
        };
      }
      console.log('📤 Navbarrr - Notification exists in localStorage but not in database, attempting to save...');
    } else {
      notification = {
        id: notificationId,
        type: 'study_plan_created',
        title: t('new_study_plan_created'),
        message: `Study plan for ${studyPlan.title} has been added to your calendar starting from ${new Date(studyPlan.createdDate || Date.now()).toLocaleDateString()}`,
        date: new Date().toISOString(),
        read: false,
        planId: studyPlan.id
      };
      
      // Save to localStorage first
      addNotification(notification);
    }
    
    // Save to database
    try {
      const notificationData = {
        notification_type: 'study_plan_created',
        title: notification.title,
        message: notification.message,
        plan_id: notification.planId || null // Convert to string if needed
      };
      
      console.log('📤 Navbarrr - Saving notification to database:', notificationData);
      console.log('📤 Navbarrr - API endpoint:', API_CONFIG.DJANGO.NOTIFICATIONS.SAVE_STUDENT_NOTIFICATION);
      
      const response = await djangoAPI.post(API_CONFIG.DJANGO.NOTIFICATIONS.SAVE_STUDENT_NOTIFICATION, notificationData);
      
      console.log('📥 Navbarrr - API response:', response);
      
      // Handle both success (201) and duplicate (200) responses
      if (response && (response.notification || response.message)) {
        if (response.message === 'Notification already exists') {
          console.log('⚠️ Navbarrr - Notification already exists in database:', response.notification);
          // Update notification with existing database ID
          if (response.notification && response.notification.notification_id) {
            notification.notificationId = response.notification.notification_id;
            const updatedNotifications = JSON.parse(localStorage.getItem('studyNotifications') || '[]');
            const updatedNotifs = updatedNotifications.map(n => 
              n.id === notificationId ? { ...n, notificationId: response.notification.notification_id } : n
            );
            localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifs));
            setNotifications(updatedNotifs);
          }
        } else {
          console.log('✅ Navbarrr - Notification saved to database successfully:', response);
          // Update notification with database ID if available
          if (response.notification && response.notification.notification_id) {
            notification.notificationId = response.notification.notification_id;
            // Update localStorage with database ID
            const updatedNotifications = JSON.parse(localStorage.getItem('studyNotifications') || '[]');
            const updatedNotifs = updatedNotifications.map(n => 
              n.id === notificationId ? { ...n, notificationId: response.notification.notification_id } : n
            );
            localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifs));
            setNotifications(updatedNotifs);
          }
        }
      } else {
        console.warn('⚠️ Navbarrr - Unexpected response format:', response);
      }
    } catch (error) {
      console.error('❌ Navbarrr - Error saving notification to database:', error);
      console.error('❌ Navbarrr - Error message:', error.message);
      console.error('❌ Navbarrr - Error stack:', error.stack);
      // Fetch errors don't have .response, the error message contains the details
      console.error('❌ Navbarrr - Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      // Continue even if database save fails - notification is in localStorage
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      // Update in localStorage
      const updatedNotifications = notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
      const unread = updatedNotifications.filter(notif => !notif.read).length;
      setUnreadNotifications(unread);
     
      // Update in database if notification has database ID
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && notification.notificationId) {
        try {
          await djangoAPI.put(API_CONFIG.DJANGO.NOTIFICATIONS.MARK_STUDENT_NOTIFICATION_READ(notification.notificationId));
          console.log('✅ Notification marked as read in database');
        } catch (error) {
          console.error('❌ Error marking notification as read in database:', error);
          // Continue even if database update fails
        }
      }
     
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'studyNotifications',
        newValue: JSON.stringify(updatedNotifications)
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // Delete from localStorage
      const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
      localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
      const unread = updatedNotifications.filter(notif => !notif.read).length;
      setUnreadNotifications(unread);
     
      // Delete from database if notification has database ID
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && notification.notificationId) {
        try {
          await djangoAPI.delete(API_CONFIG.DJANGO.NOTIFICATIONS.DELETE_STUDENT_NOTIFICATION(notification.notificationId));
          console.log('✅ Notification deleted from database');
        } catch (error) {
          console.error('❌ Error deleting notification from database:', error);
          // Continue even if database delete fails
        }
      }
     
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'studyNotifications',
        newValue: JSON.stringify(updatedNotifications)
      }));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAllNotificationsAsRead = () => {
    try {
      const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
      localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
      setUnreadNotifications(0);
     
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'studyNotifications',
        newValue: JSON.stringify(updatedNotifications)
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('studyNotifications');
      setNotifications([]);
      setUnreadNotifications(0);
     
      // Clear from database
      try {
        await djangoAPI.delete(API_CONFIG.DJANGO.NOTIFICATIONS.CLEAR_ALL_STUDENT_NOTIFICATIONS);
        console.log('✅ All notifications cleared from database');
      } catch (error) {
        console.error('❌ Error clearing notifications from database:', error);
        // Continue even if database clear fails
      }
     
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'studyNotifications',
        newValue: null
      }));
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const toggleMobileDropdown = (dropdown) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdowns({
      learn: false,
      practice: false
    });
    setMobileLangDropdownOpen(false);
  };

  const getTodaysStudyPlans = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysPlans = [];
   
    // Get from localStorage study plans
    studyPlans.forEach(plan => {
      plan.studySessions?.forEach(session => {
        if (session.date === today && !session.completed) {
          todaysPlans.push({
            ...session,
            planTitle: plan.title,
            subject: plan.subject || session.subject
          });
        }
      });
    });

    // Also get from database calendar entries
    calendarEntries.forEach(entry => {
      if (entry.entry_date === today && !entry.completed) {
        todaysPlans.push({
          id: entry.calendar_id,
          date: entry.entry_date,
          subject: entry.subject,
          topic: entry.topic,
          duration: entry.duration || '60 minutes',
          planTitle: `${entry.subject} - ${entry.topic}`
        });
      }
    });
   
    return todaysPlans;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getStudyPlansForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const plansForDate = [];
   
    // Get plans from localStorage study plans
    studyPlans.forEach(plan => {
      plan.studySessions?.forEach(session => {
        const sessionDate = session.date;
        if (sessionDate === dateString) {
          plansForDate.push({
            ...session,
            planTitle: plan.title,
            subject: plan.subject || session.subject,
            created: plan.createdDate
          });
        }
      });
    });

    // Also get calendar entries from database
    calendarEntries.forEach(entry => {
      if (entry.entry_date === dateString) {
        plansForDate.push({
          id: entry.calendar_id,
          date: entry.entry_date,
          subject: entry.subject,
          topic: entry.topic,
          duration: entry.duration || '60 minutes',
          completed: entry.completed || false,
          class_name: entry.class_name,
          chapter: entry.chapter,
          subtopic: entry.subtopic
        });
      }
    });
   
    return plansForDate;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelectedDate = (date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const triggerFlyingCoins = (pointsToAdd = 0, reason = "Activity completed") => {
    setShowFlyingCoins(true);
    if (pointsToAdd > 0) {
      addRewardPointsWithHistory(pointsToAdd, reason, 'activity');
    }
    setTimeout(() => {
      setShowFlyingCoins(false);
    }, 2000);
  };

  // REMOVED: triggerWelcomeCoins - Daily login reward is handled in Login.js
  // This prevents duplicate coin entries in the database

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    let storedData = null;

    if (userRole === 'student') {
      storedData = localStorage.getItem('studentData');
    } else if (userRole === 'parent') {
      storedData = localStorage.getItem('parentData');
    }

    if (storedData) {
      const parsed = JSON.parse(storedData);
      setAvatar(parsed.avatar || null);
      setName(`${parsed.firstName || ''} ${parsed.lastName || ''}`);
    }

    // Balance will be loaded from database in the separate useEffect below
    // Don't read from localStorage here to avoid stale data
  }, [rewardPoints]);

  // Load balance from database on mount (database is source of truth)
  // This MUST run FIRST before any other balance reading
  useEffect(() => {
    const loadBalanceFromDatabase = async () => {
      try {
        const { getCoinBalance } = await import('../../utils/coinTracking');
        const coinBalanceResponse = await getCoinBalance();
        console.log('📊 Navbarrr - Database balance response:', coinBalanceResponse);
        
        if (coinBalanceResponse && coinBalanceResponse.balance) {
          const totalCoins = coinBalanceResponse.balance.total_coins || 0;
          console.log('✅ Navbarrr - Database has balance:', totalCoins);
          
          // Database is source of truth - always use database balance
          localStorage.setItem('rewardPoints', totalCoins.toString());
          setCurrentRewardPoints(totalCoins);
          console.log('✅ Navbarrr - Balance loaded from database and set to:', totalCoins);
        } else {
          // Database has no balance - clear localStorage to 0
          console.log('⚠️ Navbarrr - Database has NO balance (empty/truncated), clearing localStorage to 0');
          const oldLocalStorage = localStorage.getItem('rewardPoints');
          console.log('📊 Navbarrr - Old localStorage had:', oldLocalStorage);
          
          localStorage.setItem('rewardPoints', '0');
          setCurrentRewardPoints(0);
          
          // Clear any stale reward history
          localStorage.removeItem('rewardsHistory');
          console.log('✅ Navbarrr - Cleared localStorage to 0');
        }
      } catch (error) {
        console.error('❌ Navbarrr - Error loading balance from database:', error);
        // If database fails, clear localStorage to avoid stale data
        console.log('⚠️ Navbarrr - Database error, clearing localStorage to 0');
        localStorage.setItem('rewardPoints', '0');
        setCurrentRewardPoints(0);
        
        // Clear any stale reward history
        localStorage.removeItem('rewardsHistory');
      }
    };

    // Load balance immediately on mount (BEFORE any other code runs)
    loadBalanceFromDatabase();
    
    // NOTE: Daily login reward is handled in Login.js, not here
    // This prevents duplicate entries in the database
  }, []); // Only run once on mount

  useEffect(() => {
    const handleRewardPointsUpdate = (event) => {
      if (event.detail && event.detail.rewardPoints !== undefined) {
        const newPoints = event.detail.rewardPoints;
        const oldPoints = currentRewardPoints;
        const pointsDiff = newPoints - oldPoints;
       
        // Update balance immediately (works for both positive and negative changes)
        setCurrentRewardPoints(newPoints);
        loadRewardsHistory();
        
        // Only show animation for positive changes
        if (pointsDiff > 0) {
          setPointsChange(pointsDiff);
          setShowPointsAnimation(true);
          triggerFlyingCoins();
          setTimeout(() => setShowPointsAnimation(false), 2000);
        }
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'rewardPoints') {
        const points = parseInt(e.newValue) || 0;
        const oldPoints = currentRewardPoints;
        const pointsDiff = points - oldPoints;
       
        // Update balance immediately (works for both positive and negative changes)
        setCurrentRewardPoints(points);
        loadRewardsHistory();
        
        // Only show animation for positive changes
        if (pointsDiff > 0) {
          setPointsChange(pointsDiff);
          setShowPointsAnimation(true);
          triggerFlyingCoins();
          setTimeout(() => setShowPointsAnimation(false), 2000);
        }
      }
    };

    window.addEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
    window.addEventListener('storage', handleStorageChange);
   
    // Check for balance updates every 3 seconds (reduced frequency to avoid excessive checks)
    const interval = setInterval(() => {
      const points = parseInt(localStorage.getItem('rewardPoints')) || 0;
      if (points !== currentRewardPoints) {
        const pointsDiff = points - currentRewardPoints;
        // Update balance immediately (works for both positive and negative changes)
        setCurrentRewardPoints(points);
        loadRewardsHistory();
        
        // Only show animation for positive changes
        if (pointsDiff > 0) {
          setPointsChange(pointsDiff);
          setShowPointsAnimation(true);
          triggerFlyingCoins();
          setTimeout(() => setShowPointsAnimation(false), 2000);
        }
      }
    }, 3000); // Reduced to 3 seconds to avoid excessive checks

    return () => {
      window.removeEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentRewardPoints]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
    setAvatarOpen(false);
    setClassDropdownOpen(false);
    setPracticeDropdownOpen(false);
    setLangDropdownOpen(false);
    setRewardsHistoryOpen(false);

    closeMobileMenu();

    if (isFullScreen) {
      setShowNavbar(false);
      return;
    }

    const hideNavbarRoutes = ['/mock-test', '/quick-practice'];
    const shouldHideNavbar = hideNavbarRoutes.some(route =>
      location.pathname.includes(route)
    );

    setShowNavbar(!shouldHideNavbar);
  }, [location.pathname, isFullScreen]);

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    setLangDropdownOpen(false);
    setMobileLangDropdownOpen(false);
  };

  const handleLogout = () => {
    const rewardPointsValue = localStorage.getItem('rewardPoints');
    const rewardsHistoryValue = localStorage.getItem('rewardsHistory');
    localStorage.clear();
    if (rewardPointsValue) {
      localStorage.setItem('rewardPoints', rewardPointsValue);
    }
    if (rewardsHistoryValue) {
      localStorage.setItem('rewardsHistory', rewardsHistoryValue);
    }
    navigate('/');
  };

  const navLinks = [
    { path: '/student/dashboard', name: t('home', 'Home') },
    {
      path: '/learn',
      name: t('class_room', 'Class Room'),
      hasDropdown: true,
      dropdownItems: [
        { path: '/learn', name: t('class_7', 'Class 7') },
        { path: '/learn/class8', name: t('class_8', 'Class 8') },
        { path: '/learn/class9', name: t('class_9', 'Class 9') },
        { path: '/learn/class10', name: t('class_10', 'Class 10') },
      ],
    },
    {
      path: '/practice',
      name: t('practice', 'Practice'),
      hasDropdown: true,
      dropdownItems: [
        { path: '/quick-practice', name: t('quick_practice', 'Quick Practice') },
        { path: '/mock-test', name: t('mock_test', 'Mock Test') },
        { path: '/spin-wheel', name: t('spin_wheel', 'Spin Wheel') },
      ],
    },
    { path: '/career', name: t('career', 'Career') },
    { path: '/study-room', name: t('studyRoom', 'Study Room') },
  ];

  if (!showNavbar) return null;

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <style>
        {`
          .navbar {
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            height: 70px;
          }

          .navbar-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
            height: 100%;
          }

          .navbar-left {
            display: flex;
            align-items: center;
            gap: 15px;
            flex: 1;
          }

          .navbar-center {
            flex: 2;
            display: flex;
            justify-content: center;
          }

          .navbar-right {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            justify-content: flex-end;
          }

          .mobile-toggle-btn {
            background: transparent;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 40px;
            height: 40px;
          }

          .logo-container {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
          }

          .logo-text {
            background: linear-gradient(90deg, #2D5D7B 0%, #4a8db7 25%, #FF6B6B 50%, #FFD166 75%, #2D5D7B 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: 800;
            font-size: 1.6rem;
            letter-spacing: 1px;
            font-family: 'Poppins', sans-serif;
            background-size: 200% auto;
            animation: gradientText 3s ease infinite;
            white-space: nowrap;
          }

          .desktop-nav-links {
            display: flex;
            align-items: center;
            margin: 0;
            padding: 0;
            list-style: none;
            gap: 20px;
          }

          .nav-link {
            display: block;
            text-decoration: none;
            color: inherit;
            font-weight: 400;
            padding: 8px 4px;
            transition: all 0.3s ease;
            border-bottom: 2px solid transparent;
          }

          .nav-link-active {
            color: #2D5D7B;
            font-weight: 600;
            border-bottom-color: #2D5D7B;
          }

          .nav-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            min-width: 160px;
            z-index: 1000;
            padding: 10px 0;
          }

          .dropdown-link {
            display: block;
            padding: 8px 16px;
            text-decoration: none;
            color: #333;
            transition: background 0.3s, color 0.3s;
          }

          .dropdown-link-active {
            color: #2D5D7B;
            font-weight: 600;
            background: #f0f7ff;
          }

          .nav-icon-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            background: transparent;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #333;
            transition: all 0.3s ease;
            min-width: auto;
            justify-content: center;
            position: relative;
          }

          .nav-icon-btn:hover {
            background: #f8f9fa;
            border-color: #2D5D7B;
          }

          .reward-points {
            display: flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            color: #744210;
            border: 2px solid #FFC107;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
            min-width: 80px;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }

          .reward-points:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(255, 193, 7, 0.5);
          }

          .avatar-container {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            cursor: pointer;
          }

          .badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ef4444;
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          }

          /* Mobile Menu Overlay and Content */
          .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9995;
          }

          .mobile-menu-content {
            position: fixed;
            top: 0;
            left: 0;
            width: 280px;
            height: 100vh;
            background: white;
            z-index: 9996;
            overflow-y: auto;
            padding: 20px 0;
          }

          /* Mobile Calendar and Notifications - HIGHER Z-INDEX */
          .mobile-calendar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .mobile-calendar-content {
            background: white;
            border-radius: 12px;
            width: 100%;
            max-width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            padding: 20px;
            z-index: 10000;
          }

          .mobile-notifications-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .mobile-notifications-content {
            background: white;
            border-radius: 12px;
            width: 100%;
            max-width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            padding: 0;
            z-index: 10000;
          }

          .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
            margin-top: 12px;
          }

          .calendar-day {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .calendar-day:hover {
            background-color: #f3f4f6;
          }

          .calendar-day.today {
            background-color: #3b82f6;
            color: white;
          }

          .calendar-day.selected {
            background-color: #10b981;
            color: white;
          }

          .calendar-day.has-plans::after {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            background-color: #ef4444;
            border-radius: 50%;
          }

          .mobile-action-button {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: white;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-size: 14px;
            color: #374151;
            cursor: pointer;
            text-align: left;
          }

          .mobile-icon-button {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 12px 8px;
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 12px;
            color: #374151;
            cursor: pointer;
            position: relative;
          }

          @keyframes gradientText {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          .flying-coins-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
          }

          .flying-coin {
            position: absolute;
            font-size: 20px;
            color: #FFD700;
            z-index: 9998;
            filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.8));
          }

          /* Improved Calendar and Notification Styles */
          .calendar-container {
            width: 100%;
            max-width: 320px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            overflow: hidden;
          }

          .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: linear-gradient(135deg, #2D5D7B, #4a8db7);
            color: white;
          }

          .calendar-nav-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.3s;
          }

          .calendar-nav-btn:hover {
            background: rgba(255,255,255,0.3);
          }

          .calendar-weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            background: #f8fafc;
            border-bottom: 1px solid #e5e7eb;
          }

          .calendar-weekday {
            text-align: center;
            padding: 8px 4px;
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
          }

          .calendar-days-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
            padding: 8px;
            background: white;
          }

          .calendar-date {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            border: 2px solid transparent;
            position: relative;
          }

          .calendar-date:hover {
            background-color: #f3f4f6;
          }

          .calendar-date.today {
            background-color: #3b82f6;
            color: white;
            border-color: #3b82f6;
          }

          .calendar-date.selected {
            background-color: #10b981;
            color: white;
            border-color: #10b981;
          }

          .calendar-date.has-event::after {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            background-color: #ef4444;
            border-radius: 50%;
          }

          .notifications-container {
            width: 100%;
            max-width: 350px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            overflow: hidden;
          }

          .notifications-header {
            padding: 16px;
            background: linear-gradient(135deg, #2D5D7B, #4a8db7);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .notifications-actions {
            display: flex;
            gap: 8px;
            padding: 12px 16px;
            background: #f8fafc;
            border-bottom: 1px solid #e5e7eb;
          }

          .notification-item {
            padding: 12px 16px;
            border-bottom: 1px solid #f3f4f6;
            cursor: pointer;
            transition: background 0.2s;
            position: relative;
          }

          .notification-item.unread {
            background: #f0f9ff;
          }

          .notification-item:hover {
            background: #f8fafc;
          }

          .notification-delete-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
          }

          .notification-delete-btn:hover {
            background: #ef4444;
            color: white;
          }

          /* Mobile Responsive Styles */
          @media (max-width: 768px) {
            .navbar-center {
              display: none;
            }

            .nav-icon-btn:not(.reward-points) {
              display: none;
            }

            .navbar-right {
              gap: 8px;
            }

            .reward-points {
              min-width: 70px;
              padding: 6px 12px;
              font-size: 12px;
              gap: 0;
            }

            .reward-points span {
              font-size: 12px;
            }

            .avatar-container {
              width: 35px;
              height: 35px;
            }

            .calendar-button,
            .notification-button,
            .language-button {
              display: none !important;
            }

            .reward-points svg,
            .reward-points .fa-coins {
              display: none !important;
            }

            /* Mobile specific calendar and notification styles */
            .mobile-calendar-content,
            .mobile-notifications-content {
              width: 95vw;
              max-width: 95vw;
              margin: 20px;
            }

            .calendar-date {
              width: 40px;
              height: 40px;
            }

            .notifications-container {
              max-width: 95vw;
            }
          }

          @media (min-width: 769px) {
            .mobile-toggle-btn {
              display: none;
            }
          }
        `}
      </style>
     
      {/* Flying Coins Animation */}
      {showFlyingCoins && (
        <div className="flying-coins-container">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="flying-coin"
              initial={{
                scale: 0,
                opacity: 1,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50
              }}
              animate={{
                scale: [0, 1, 0.8, 0],
                opacity: [1, 1, 1, 0],
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth
                ],
                y: [
                  window.innerHeight + 50,
                  window.innerHeight * 0.3,
                  -50
                ]
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
                delay: i * 0.15
              }}
            >
              <FaCoins />
            </motion.div>
          ))}
        </div>
      )}

      <div className="navbar-container">
       
        {/* Left Section - Toggle + Logo */}
        <div className="navbar-left">
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FaBars size={16} color="#333" />
          </button>

          <Link to="/student/dashboard" className="logo-container">
            <img src={novyaLogo} alt="NOVYA Logo" style={{ height: '35px' }} />
            <motion.span
              className="logo-text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ backgroundPosition: 'right center', transition: { duration: 1.5 } }}
            >
              NOVYA
            </motion.span>
          </Link>
        </div>

        {/* Center Section - Desktop Navigation Links */}
        <div className="navbar-center">
          <ul className="desktop-nav-links">
            {navLinks.map((link) => (
              <li
                key={link.path}
                style={{ position: 'relative' }}
                onMouseEnter={() => {
                  if (link.path === '/learn') setClassDropdownOpen(true);
                  if (link.path === '/practice') setPracticeDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  setTimeout(() => {
                    if (link.path === '/learn') setClassDropdownOpen(false);
                    if (link.path === '/practice') setPracticeDropdownOpen(false);
                  }, 200);
                }}
              >
                {link.hasDropdown ? (
                  <div
                    style={{ position: 'relative' }}
                    onMouseEnter={() => {
                      if (link.path === '/learn') setClassDropdownOpen(true);
                      if (link.path === '/practice') setPracticeDropdownOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (link.path === '/learn') setClassDropdownOpen(false);
                      if (link.path === '/practice') setPracticeDropdownOpen(false);
                    }}
                  >
                    <span
                      className={`nav-link ${
                        activeLink === link.path ||
                        (link.hasDropdown && activeLink.startsWith(link.path))
                          ? 'nav-link-active'
                          : ''
                      }`}
                      onClick={(e) => e.preventDefault()}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                    >
                      {link.name}
                      <FaChevronDown size={10} />
                    </span>

                    <AnimatePresence>
                      {(link.path === '/learn' ? classDropdownOpen : practiceDropdownOpen) && (
                        <motion.div
                          className="nav-dropdown"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          onMouseEnter={() => {
                            if (link.path === '/learn') setClassDropdownOpen(true);
                            if (link.path === '/practice') setPracticeDropdownOpen(true);
                          }}
                          onMouseLeave={() => {
                            if (link.path === '/learn') setClassDropdownOpen(false);
                            if (link.path === '/practice') setPracticeDropdownOpen(false);
                          }}
                        >
                          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                            {link.dropdownItems.map((dropdownItem) => (
                              <li key={dropdownItem.path}>
                                <Link
                                  to={dropdownItem.path}
                                  className={`dropdown-link ${
                                    activeLink === dropdownItem.path
                                      ? 'dropdown-link-active'
                                      : ''
                                  }`}
                                  onMouseEnter={(e) => {
                                    if (activeLink !== dropdownItem.path) {
                                      e.target.style.background = '#f5f5f5';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (activeLink !== dropdownItem.path) {
                                      e.target.style.background =
                                        activeLink === dropdownItem.path
                                          ? '#f0f7ff'
                                          : 'transparent';
                                    }
                                  }}
                                >
                                  {dropdownItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`nav-link ${activeLink === link.path ? 'nav-link-active' : ''}`}
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section - Icons & Profile */}
        <div className="navbar-right">
       {/* Calendar Icon - Desktop Only */}
{!isMobile && (
  <div
    style={{ position: 'relative', display: 'inline-block' }}
    onMouseEnter={() => {
      loadStudyPlans();
      setCalendarOpen(true);
    }}
  onMouseLeave={(e) => {
  const { relatedTarget } = e;
  // ✅ Ensure relatedTarget exists and is a valid Element
  if (
    !relatedTarget ||
    !(relatedTarget instanceof Element) ||
    !relatedTarget.closest(".nav-dropdown")
  ) {
    setCalendarOpen(false);
  }
}}

  >
    <button
      className="nav-icon-btn calendar-button"
    >
      <FaCalendarAlt size={14} />
      {getTodaysStudyPlans().length > 0 && (
        <span className="badge" style={{ width: '8px', height: '8px' }}></span>
      )}
    </button>

    {calendarOpen && (
      <div
        className="nav-dropdown"
        style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '350px',
          padding: '0',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          zIndex: 1000
        }}
        onMouseEnter={() => setCalendarOpen(true)}
        onMouseLeave={(e) => {
          // Check if mouse is moving to the icon
          const relatedTarget = e.relatedTarget;
          if (!relatedTarget || !relatedTarget.closest('.calendar-button')) {
            setCalendarOpen(false);
          }
        }}
      >
        <div className="calendar-container">
          <div className="calendar-header" style={{
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
              {t('study_calendar')}
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="calendar-nav-btn"
                onClick={() => navigateMonth(-1)}
              >
                ‹
              </button>
              <button
                className="calendar-nav-btn"
                onClick={() => navigateMonth(1)}
              >
                ›
              </button>
            </div>
          </div>
         
          <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="calendar-weekdays">
             {[t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')].map(day => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days-grid">
            {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, index) => (
              <div key={`empty-${index}`} style={{ width: '36px', height: '36px' }} />
            ))}
           
            {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
              const day = index + 1;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const hasPlans = getStudyPlansForDate(date).length > 0;
             
              return (
                <div
                  key={day}
                  className={`calendar-date ${isToday(date) ? 'today' : ''} ${isSelectedDate(date) ? 'selected' : ''} ${hasPlans ? 'has-event' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {selectedDate && (
            <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0', color: '#374151' }}>
               {t('study_plans_for')} {selectedDate.toLocaleDateString(i18n.language)}
              </h4>
              {getStudyPlansForDate(selectedDate).length === 0 ? (
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                 {t('no_study_plans_scheduled')}
                </p>
              ) : (
                <div style={{ maxHeight: '120px', overflow: 'auto' }}>
                  {getStudyPlansForDate(selectedDate).map((plan, index) => (
                    <div key={index} style={{
                      padding: '8px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      marginBottom: '6px',
                      borderLeft: '3px solid #3b82f6'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '500', color: '#1f2937' }}>
                        {plan.subject} - {plan.topic}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaClock size={10} />
                        {plan.duration}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
)}

{/* Notifications Icon - Desktop Only */}
{!isMobile && (
  <div
    style={{ position: 'relative', display: 'inline-block' }}
    onMouseEnter={() => {
      loadNotifications();
      setNotificationsOpen(true);
    }}
    onMouseLeave={(e) => {
      // Check if mouse is moving to the dropdown
      const relatedTarget = e.relatedTarget;
      if (!relatedTarget || !relatedTarget.closest('.nav-dropdown')) {
        setNotificationsOpen(false);
      }
    }}
  >
    <button
      className="nav-icon-btn notification-button"
    >
      <FaBell size={14} />
      {unreadNotifications > 0 && (
        <span className="badge">{unreadNotifications}</span>
      )}
    </button>

    {notificationsOpen && (
      <div
        className="nav-dropdown"
        style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '380px',
          padding: '0',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          zIndex: 1000
        }}
        onMouseEnter={() => setNotificationsOpen(true)}
        onMouseLeave={(e) => {
          // Check if mouse is moving to the icon
          const relatedTarget = e.relatedTarget;
          if (!relatedTarget || !relatedTarget.closest('.notification-button')) {
            setNotificationsOpen(false);
          }
        }}
      >
        <div className="notifications-container">
          <div className="notifications-header" style={{
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
             {t('nav-notifications')}
            </h3>
            {unreadNotifications > 0 && (
              <span style={{
                background: '#ef4444',
                color: 'white',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {unreadNotifications} new
              </span>
            )}
          </div>

          <div className="notifications-actions" style={{
            padding: '8px 16px',
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid #e5e7eb',
            background: '#f8fafc'
          }}>
            {unreadNotifications > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                style={{
                  background: 'none',
                  border: '1px solid #3b82f6',
                  color: '#3b82f6',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
               {t('mark_all_read')}
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                style={{
                  background: 'none',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
               {t('clear_all')}
              </button>
            )}
          </div>

          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280' }}>
                <FaBell size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: '14px' }}>{t('no_notifications_yet')}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>{t('study_plans_will_appear_here')}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: !notification.read ? 'pointer' : 'default',
                    backgroundColor: !notification.read ? '#f0f9ff' : 'transparent',
                    position: 'relative',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <button
                    className="notification-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#9ca3af',
                      padding: '4px',
                      borderRadius: '4px',
                      fontSize: '10px'
                    }}
                  >
                    <FaTimes size={10} />
                  </button>

                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#1f2937' }}>
                    {notification.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4b5563', marginBottom: '6px', lineHeight: '1.4' }}>
                    {notification.message}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaClock size={10} />
                    {new Date(notification.date).toLocaleDateString()} at {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )}
  </div>
)}
          {/* Language Button - Desktop Only */}
          {!isMobile && (
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setLangDropdownOpen(true)}
              onMouseLeave={() => {
                setTimeout(() => setLangDropdownOpen(false), 200);
              }}
            >
              <button
                className="nav-icon-btn language-button"
              >
                <FaGlobe size={12} />
                <span>{i18n.language.toUpperCase()}</span>
                <FaChevronDown size={8} />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    className="nav-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      right: 0,
                      left: 'auto',
                      minWidth: '140px',
                      marginTop: '5px'
                    }}
                    onMouseEnter={() => setLangDropdownOpen(true)}
                    onMouseLeave={() => setLangDropdownOpen(false)}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: i18n.language === lang.code ? '#f0f7ff' : 'transparent',
                          padding: '12px 16px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: i18n.language === lang.code ? '#2D5D7B' : '#333',
                          fontWeight: i18n.language === lang.code ? '600' : '400',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (i18n.language !== lang.code) {
                            e.target.style.background = '#2D5D7B';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (i18n.language !== lang.code) {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#333';
                          }
                        }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Reward Points - Always Visible */}
<div style={{ position: 'relative' }}>
  <motion.div
    className="reward-points"
    onClick={() => {
      loadRewardsHistory();
      setRewardsHistoryOpen(true);
    }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    style={{ cursor: 'pointer' }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 2s infinite linear',
      opacity: 0.5
    }} />
   
    {!isMobile && (
      <FaCoins size={16} color="#744210" style={{ position: 'relative', zIndex: 1 }} />
    )}
    <span style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(45deg, #744210, #8B5A2B)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      position: 'relative',
      zIndex: 1
    }}>
      {currentRewardPoints.toLocaleString()}
    </span>
   
    {showPointsAnimation && pointsChange > 0 && (
      <motion.div
        style={{
          position: 'absolute',
          right: 0,
          top: '-20px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
          zIndex: 1001
        }}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: -20 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        +{pointsChange}
      </motion.div>
    )}
  </motion.div>

  {/* Rewards History - Fixed Sidebar */}
  <AnimatePresence>
    {rewardsHistoryOpen && (
      <>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}
          onClick={() => setRewardsHistoryOpen(false)}
        />
       
        {/* Sidebar */}
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'tween', duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100vh',
            width: isMobile ? '100vw' : '380px',
            background: '#fff',
            boxShadow: '-4px 0 25px rgba(0,0,0,0.2)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', background: 'linear-gradient(135deg, #fff9e6, #fff0cc)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{t('reward_points_history')}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
                        <b style={{ color: "#8B5A2B" }}>
        {t("totalPoints", { points: currentRewardPoints.toLocaleString() })}
      </b>
                </p>
              </div>
              <button onClick={() => setRewardsHistoryOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#6b7280' }}>
                <FaTimes />
              </button>
            </div>
          </div>

          {rewardsHistory.length > 0 && (
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #e5e7eb', background: '#fafafa', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={clearAllRewardsHistory}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <FaTrash size={10} />
               {t('clear_all_history')}
              </button>
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {rewardsHistory.length === 0 ? (
              <div style={{ padding: '40px 16px', textAlign: 'center', color: '#6b7280' }}>
                <FaCoins size={28} style={{ marginBottom: '8px', opacity: 0.5 }} />
                 <p style={{ margin: 0, fontSize: '15px' }}>{t('no_reward_history')}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>Complete activities to earn points!</p>
              </div>
            ) : (
              rewardsHistory.map((reward) => (
                <div key={reward.id} style={{ paddingBottom: '12px', borderBottom: '1px solid #f3f4f6', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                      {reward.reason}
                    </div>
                    <div style={{ color: reward.points > 0 ? '#16a34a' : '#dc2626', fontWeight: '600', fontSize: '14px' }}>
                      {reward.points > 0 ? '+' : ''}{reward.points}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6b7280' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <FaClock size={10} />
                      {new Date(reward.timestamp).toLocaleDateString()} at {new Date(reward.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500' }}>
                      Total: {reward.totalPoints}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
</div>
          {/* Avatar - Always Visible */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setAvatarOpen(true)}
            onMouseLeave={() => setAvatarOpen(false)}
          >
            <div className="avatar-container">
              {avatar ? (
                <img src={avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <FaUserCircle size={36} color="#4B5563" />
              )}
            </div>

            <AnimatePresence>
              {avatarOpen && (
                <motion.div
                  className="nav-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ right: 0, left: 'auto' }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', background: 'linear-gradient(135deg, #fff9e6, #fff0cc)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#744210', fontWeight: '600' }}>
                      <FaCoins size={14} color="#FFA500" />
                      <span>{t('reward_points')}: {currentRewardPoints.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/user-details')}
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: '#1F2937',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => { e.target.style.background = '#f0f0f0'; }}
                    onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
                  >
                    <FaUserCircle size={14} />
                   {t('view_profile')}
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => { e.target.style.background = '#fef2f2'; }}
                    onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
                  >
                    <FaSignOutAlt size={14} />
                   {t('logout')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className="mobile-menu-content"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={novyaLogo} alt="NOVYA Logo" style={{ height: '30px' }} />
                  <span className="logo-text" style={{ fontSize: '1.4rem' }}>NOVYA</span>
                </div>
                <button onClick={closeMobileMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b7280' }}>
                  <FaTimes />
                </button>
              </div>

              {/* Mobile Quick Actions */}
              <div style={{ display: 'flex', gap: '12px', padding: '0 16px', marginBottom: '16px', marginTop: '16px' }}>
                <button
                  className="mobile-icon-button"
                  onClick={() => {
                    loadStudyPlans();
                    setCalendarOpen(true);
                    closeMobileMenu();
                  }}
                  style={{ position: 'relative' }}
                >
                  <FaCalendarAlt size={18} />
                  <span>Calendar</span>
                  {getTodaysStudyPlans().length > 0 && (
                    <span className="badge" style={{ width: '8px', height: '8px' }}></span>
                  )}
                </button>
                <button
                  className="mobile-icon-button"
                  onClick={() => {
                    loadNotifications();
                    setNotificationsOpen(true);
                    closeMobileMenu();
                  }}
                  style={{ position: 'relative' }}
                >
                  <FaBell size={18} />
                  <span>Alerts</span>
                  {unreadNotifications > 0 && (
                    <span className="badge">{unreadNotifications}</span>
                  )}
                </button>
                <button
                  className="mobile-icon-button"
                  onClick={() => {
                    loadRewardsHistory();
                    setRewardsHistoryOpen(true);
                    closeMobileMenu();
                  }}
                >
                  <FaHistory size={18} />
                  <span>History</span>
                </button>
              </div>

              <div style={{ padding: '20px' }}>
                {navLinks.map((link) => (
                  <div key={link.path} style={{ marginBottom: '8px' }}>
                    {link.hasDropdown ? (
                      <>
                        <button
                          onClick={() => toggleMobileDropdown(link.path === '/learn' ? 'learn' : 'practice')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: '#f8fafc',
                            border: 'none',
                            borderRadius: '8px',
                            width: '100%',
                            cursor: 'pointer',
                            color: '#374151',
                            fontWeight: '500'
                          }}
                        >
                          <span>{link.name}</span>
                          <FaChevronDown size={12} style={{ transform: mobileDropdowns[link.path === '/learn' ? 'learn' : 'practice'] ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
                        </button>
                        <AnimatePresence>
                          {mobileDropdowns[link.path === '/learn' ? 'learn' : 'practice'] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              style={{ paddingLeft: '20px', marginTop: '8px' }}
                            >
                              {link.dropdownItems.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.path}
                                  to={dropdownItem.path}
                                  onClick={closeMobileMenu}
                                  style={{
                                    display: 'block',
                                    padding: '10px 16px',
                                    textDecoration: 'none',
                                    color: activeLink === dropdownItem.path ? '#2D5D7B' : '#6b7280',
                                    borderLeft: '2px solid #e5e7eb',
                                    marginBottom: '4px',
                                    background: activeLink === dropdownItem.path ? '#f0f7ff' : 'transparent'
                                  }}
                                >
                                  {dropdownItem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={link.path}
                        onClick={closeMobileMenu}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          background: activeLink === link.path ? '#f0f7ff' : '#f8fafc',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          color: activeLink === link.path ? '#2D5D7B' : '#374151',
                          fontWeight: '500'
                        }}
                      >
                        <span>{link.name}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Bottom Actions with Language Dropdown */}
              <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb', marginTop: '20px' }}>
                {/* Language Dropdown for Mobile */}
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <button
                    className="mobile-action-button"
                    onClick={() => setMobileLangDropdownOpen(!mobileLangDropdownOpen)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaGlobe size={14} />
                      <span>Language ({i18n.language.toUpperCase()})</span>
                    </div>
                    <FaChevronDown
                      size={12}
                      style={{
                        transform: mobileLangDropdownOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileLangDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          background: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          marginTop: '8px',
                          overflow: 'hidden'
                        }}
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              handleLanguageChange(lang.code);
                              setMobileLangDropdownOpen(false);
                            }}
                            style={{
                              width: '100%',
                              border: 'none',
                              background: i18n.language === lang.code ? '#f0f7ff' : 'transparent',
                              padding: '12px 16px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: i18n.language === lang.code ? '#2D5D7B' : '#333',
                              fontWeight: i18n.language === lang.code ? '600' : '400',
                              borderBottom: '1px solid #f3f4f6'
                            }}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  className="mobile-action-button"
                  onClick={() => {
                    navigate('/user-details');
                    closeMobileMenu();
                  }}
                >
                  <FaUserCircle size={14} />
                  <span>View Profile</span>
                </button>
                <button
                  className="mobile-action-button"
                  onClick={handleLogout}
                  style={{ color: '#dc2626', borderColor: '#fecaca' }}
                >
                  <FaSignOutAlt size={14} />
                  <span>logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Calendar - Only show on mobile devices */}
{isMobile && (
  <AnimatePresence>
    {calendarOpen && (
      <>
        <motion.div
          className="mobile-calendar-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="calendar-container">
            <div className="calendar-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                {t('study_calendar')}
              </h3>
              <button onClick={() => setCalendarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: '18px' }}>
                <FaTimes />
              </button>
            </div>
           
            <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="calendar-nav-btn"
                onClick={() => navigateMonth(-1)}
                style={{ background: '#e5e7eb', color: '#374151' }}
              >
                ‹
              </button>
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#374151' }}>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                className="calendar-nav-btn"
                onClick={() => navigateMonth(1)}
                style={{ background: '#e5e7eb', color: '#374151' }}
              >
                ›
              </button>
            </div>

            <div className="calendar-weekdays">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-days-grid">
              {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, index) => (
                <div key={`empty-${index}`} style={{ width: '40px', height: '40px' }} />
              ))}
             
              {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
                const day = index + 1;
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const hasPlans = getStudyPlansForDate(date).length > 0;
               
                return (
                  <div
                    key={day}
                    className={`calendar-date ${isToday(date) ? 'today' : ''} ${isSelectedDate(date) ? 'selected' : ''} ${hasPlans ? 'has-event' : ''}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {selectedDate && (
              <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0', color: '#374151' }}>
                 {t('study_plans_for')} {selectedDate.toLocaleDateString(i18n.language)}
                </h4>
                {getStudyPlansForDate(selectedDate).length === 0 ? (
                  <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', margin: '16px 0' }}>
                   {t('no_study_plans_scheduled')}
                  </p>
                ) : (
                  <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                    {getStudyPlansForDate(selectedDate).map((plan, index) => (
                      <div key={index} style={{
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        borderLeft: '4px solid #3b82f6'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                          {plan.subject} - {plan.topic}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaClock size={12} />
                          {plan.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
)}

      {/* Mobile Notifications Modal */}
      {/* Mobile Notifications - Only show on mobile devices */}
{isMobile && (
  <AnimatePresence>
    {notificationsOpen && (
      <>
        <motion.div
          className="mobile-notifications-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setNotificationsOpen(false)}
        />
        <motion.div
          className="mobile-notifications-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="notifications-container">
            <div className="notifications-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                Notifications
              </h3>
              <button onClick={() => setNotificationsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: '18px' }}>
                <FaTimes />
              </button>
            </div>

            <div className="notifications-actions">
              {unreadNotifications > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  style={{
                    background: '#3b82f6',
                    border: 'none',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  style={{
                    background: '#ef4444',
                    border: 'none',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Clear all
                </button>
              )}
            </div>

            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280' }}>
                  <FaBell size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>No notifications yet</p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>You're all caught up!</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                  >
                    <button
                      className="notification-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <FaTimes size={12} />
                    </button>

                    <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px', color: '#1f2937' }}>
                      {notification.title}
                    </div>
                    <div style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px', lineHeight: '1.4' }}>
                      {notification.message}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaClock size={12} />
                      {new Date(notification.date).toLocaleDateString()} at {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
)}
    </motion.nav>
  );
};

export default Navbar;