
// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FaUserCircle,
//   FaChevronDown,
//   FaGlobe,
//   FaSignOutAlt,
//   FaCalendarAlt,
//   FaBell,
//   FaClock,
//   FaTimes,
//   FaBars,
//   FaCoins,
//   FaHistory,
//   FaFire,
//   FaTrophy,
//   FaBrain,
//   FaSeedling,
//   FaEdit,
//   FaSave,
//   FaTrash,
//   FaPlus
// } from 'react-icons/fa';
// import { useTranslation } from 'react-i18next';
// import { useScreenTime } from './ScreenTime'; // Adjust path as needed
// import './Navbarrr.css';
// import novyaLogo from '../home/assets/NOVYA LOGO.png';
// import RewardPoints from './RewardPoints';
// import { updateStreak, getTrophyTitle } from './streaksUtil';
// import Notifications from './Notificattions';
// import { BarChart, User } from 'lucide-react';
// const Navbar = ({ isFullScreen }) => {
//   const [scrolled, setScrolled] = useState(false);
//   const [activeLink, setActiveLink] = useState('');
//   const [avatarOpen, setAvatarOpen] = useState(false);
//   const [classDropdownOpen, setClassDropdownOpen] = useState(false);
//   const [practiceDropdownOpen, setPracticeDropdownOpen] = useState(false);
//   const [langDropdownOpen, setLangDropdownOpen] = useState(false);
//   const [showNavbar, setShowNavbar] = useState(true);
//   const [calendarOpen, setCalendarOpen] = useState(false);
//   const [notificationsOpen, setNotificationsOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [mobileDropdowns, setMobileDropdowns] = useState({
//     learn: false,
//     practice: false
//   });
//   const [mobileLangDropdownOpen, setMobileLangDropdownOpen] = useState(false);
//   const [avatar, setAvatar] = useState(null);
//   const [name, setName] = useState('');
//   const [studyPlans, setStudyPlans] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadNotifications, setUnreadNotifications] = useState(0);
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   // 🔥 Streak Tracking State
//   const [streak, setStreak] = useState(0);
//   const [streakTitle, setStreakTitle] = useState('');
//   const [streakDropdownOpen, setStreakDropdownOpen] = useState(false);
//   // 🗓️ Editable Calendar System State
//   const [savedSchedules, setSavedSchedules] = useState({});
//   const [scheduleInput, setScheduleInput] = useState('');
//   const [editingDate, setEditingDate] = useState(null);
//   const [scheduleHistory, setScheduleHistory] = useState([]);
//   const [showAddSchedule, setShowAddSchedule] = useState(false);
//   const [reminderShown, setReminderShown] = useState({});
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation();
//   const { stopGlobalSession } = useScreenTime();
//   const languages = [
//     { code: 'en', label: 'English' },
//     { code: 'te', label: 'తెలుగు' },
//     { code: 'hi', label: 'हिन्दी' },
//     { code: 'kn', label: 'ಕನ್ನಡ' },
//     { code: 'ta', label: 'தமிழ்' },
//     { code: 'ml', label: 'മലയാളം' },
//   ];
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   // 🕐 Indian Standard Time (IST) Helper Functions
//   const getISTDate = (date = new Date()) => {
//     // Convert to IST (UTC+5:30)
//     return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
//   };
//   const getISTDateString = (date = new Date()) => {
//     const istDate = getISTDate(date);
//     return istDate.toISOString().split('T')[0];
//   };
//   const formatISTDate = (dateString) => {
//     const date = new Date(dateString + 'T00:00:00+05:30'); // Set to IST timezone
//     return date.toLocaleDateString(i18n.language, {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       timeZone: 'Asia/Kolkata'
//     });
//   };
//   const isTodayIST = (date) => {
//     const todayIST = getISTDateString();
//     const compareDate = getISTDateString(date);
//     return todayIST === compareDate;
//   };
//   const isFutureDateIST = (date) => {
//     const todayIST = getISTDateString();
//     const compareDate = getISTDateString(date);
//     return compareDate >= todayIST;
//   };
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);
//   // 🗓️ Load saved schedules from localStorage
//   useEffect(() => {
//     const savedData = localStorage.getItem('userSchedules');
//     const shownReminders = localStorage.getItem('shownReminders');
  
//     if (savedData) {
//       const parsedData = JSON.parse(savedData);
//       setSavedSchedules(parsedData);
//       updateScheduleHistory(parsedData);
//     }
  
//     if (shownReminders) {
//       setReminderShown(JSON.parse(shownReminders));
//     }
//   }, []);
//   // 🗓️ Update schedule history list
//   const updateScheduleHistory = (schedules) => {
//     const history = Object.entries(schedules)
//       .map(([date, note]) => ({
//         date,
//         note,
//         displayDate: formatISTDate(date)
//       }))
//       .sort((a, b) => new Date(b.date) - new Date(a.date));
//     setScheduleHistory(history);
//   };
//   // 🗓️ Save schedule to localStorage
//   const saveSchedule = (date, note) => {
//     const dateString = getISTDateString(date);
//     const updatedSchedules = {
//       ...savedSchedules,
//       [dateString]: note.trim()
//     };
  
//     setSavedSchedules(updatedSchedules);
//     localStorage.setItem('userSchedules', JSON.stringify(updatedSchedules));
//     updateScheduleHistory(updatedSchedules);
  
//     // Reset editing state
//     setScheduleInput('');
//     setEditingDate(null);
//     setShowAddSchedule(false);
  
//     // 🔔 Show reminder notification if it's today's date in IST and not already shown
//     const todayIST = getISTDateString();
//     if (dateString === todayIST && note.trim()) {
//       showScheduleReminder(note.trim(), dateString);
//     }
//   };
//   // 🗓️ Delete schedule
//   const deleteSchedule = (date) => {
//     const dateString = getISTDateString(date);
//     const updatedSchedules = { ...savedSchedules };
//     delete updatedSchedules[dateString];
  
//     setSavedSchedules(updatedSchedules);
//     localStorage.setItem('userSchedules', JSON.stringify(updatedSchedules));
//     updateScheduleHistory(updatedSchedules);
//     setScheduleInput('');
//     setEditingDate(null);
//     setShowAddSchedule(false);
//   };
//   // 🗓️ Show reminder notification (only once per schedule)
//   const showScheduleReminder = (note, dateString) => {
//     // Check if reminder was already shown for this schedule
//     const reminderKey = `${dateString}_${note}`;
//     if (reminderShown[reminderKey]) {
//       return; // Don't show reminder again
//     }
//     const displayDate = formatISTDate(dateString);
  
//     // Mark this reminder as shown
//     const updatedReminderShown = {
//       ...reminderShown,
//       [reminderKey]: true
//     };
//     setReminderShown(updatedReminderShown);
//     localStorage.setItem('shownReminders', JSON.stringify(updatedReminderShown));
//     if ('Notification' in window && Notification.permission === 'granted') {
//       new Notification('📅 Schedule Reminder', {
//         body: `You have a schedule for ${displayDate} — ${note}`,
//         icon: novyaLogo
//       });
//     } else if (Notification.permission !== 'denied') {
//       // Fallback to alert if notifications not supported
//       alert(`📅 Reminder for ${displayDate}: ${note}`);
//     }
//   };
//   // 🗓️ Request notification permission
//   useEffect(() => {
//     if ('Notification' in window && Notification.permission === 'default') {
//       Notification.requestPermission();
//     }
//   }, []);
//   // 🗓️ Check for today's reminder on component mount (only once)
//   useEffect(() => {
//     const todayIST = getISTDateString();
//     const todaySchedule = savedSchedules[todayIST];
  
//     if (todaySchedule) {
//       const reminderKey = `${todayIST}_${todaySchedule}`;
    
//       // Only show reminder if it hasn't been shown before
//       if (!reminderShown[reminderKey]) {
//         showScheduleReminder(todaySchedule, todayIST);
//       }
//     }
//   }, [savedSchedules, reminderShown]);
//   // 🗓️ Get combined schedules and study plans for a date
//   const getCombinedPlansForDate = (date) => {
//     const dateString = getISTDateString(date);
//     const combinedPlans = [];
//     // 1. Add editable calendar schedules
//     const scheduleNote = savedSchedules[dateString];
//     if (scheduleNote) {
//       combinedPlans.push({
//         type: 'personal_schedule',
//         subject: 'Personal Schedule',
//         topic: scheduleNote,
//         duration: 'All day',
//         planTitle: 'Personal Note',
//         color: '#3b82f6',
//         date: dateString
//       });
//     }
//     // 2. Add study plans from the existing system
//     studyPlans.forEach(plan => {
//       plan.studySessions?.forEach(session => {
//         const sessionDate = session.date;
//         if (sessionDate === dateString) {
//           combinedPlans.push({
//             type: 'study_plan',
//             subject: plan.subject,
//             topic: session.topic,
//             duration: session.duration,
//             planTitle: plan.title,
//             color: '#10b981',
//             date: sessionDate
//           });
//         }
//       });
//     });
//     return combinedPlans;
//   };
//   // 🗓️ Check if date has any plans (both personal schedules and study plans)
//   const shouldShowDot = (date) => {
//     const dateString = getISTDateString(date);
  
//     // Show dot if there are either personal schedules OR study plans
//     const hasPersonalSchedule = savedSchedules[dateString];
//     const hasStudyPlans = studyPlans.some(plan =>
//       plan.studySessions?.some(session => session.date === dateString)
//     );
  
//     // Only show dot for today and future dates in IST
//     return (hasPersonalSchedule || hasStudyPlans) && isFutureDateIST(date);
//   };
//   // 🗓️ Handle date click for viewing/editing
//   const handleDateClick = (date) => {
//     setSelectedDate(date);
//     const dateString = getISTDateString(date);
//     const existingSchedule = savedSchedules[dateString];
  
//     if (existingSchedule) {
//       // If schedule exists, show it without editing mode
//       setEditingDate(null);
//       setShowAddSchedule(false);
//       setScheduleInput('');
//     } else {
//       // If no schedule exists, don't automatically show add schedule
//       setEditingDate(null);
//       setShowAddSchedule(false);
//       setScheduleInput('');
//     }
//   };
//   // 🗓️ Handle add schedule button click
//   const handleAddScheduleClick = (date) => {
//     setSelectedDate(date);
//     const dateString = getISTDateString(date);
//     setEditingDate(date);
//     setScheduleInput(savedSchedules[dateString] || '');
//     setShowAddSchedule(true);
//   };
//   // 🗓️ Handle edit schedule button click
//   const handleEditScheduleClick = (date) => {
//     setSelectedDate(date);
//     const dateString = getISTDateString(date);
//     setEditingDate(date);
//     setScheduleInput(savedSchedules[dateString] || '');
//     setShowAddSchedule(true);
//   };
//   // 🗓️ Handle save schedule
//   const handleSaveSchedule = () => {
//     if (editingDate && scheduleInput.trim()) {
//       saveSchedule(editingDate, scheduleInput);
//     }
//   };
//   // 🗓️ Handle cancel editing
//   const handleCancelEdit = () => {
//     setScheduleInput('');
//     setEditingDate(null);
//     setShowAddSchedule(false);
//   };
//   // 🔥 Streak Tracking Logic
//   useEffect(() => {
//     const streakData = updateStreak();
//     setStreak(streakData.streak);
//     setStreakTitle(getTrophyTitle(streakData.streak));
//   }, []);
//   useEffect(() => {
//     loadStudyPlans();
//     loadNotifications();
//     const handleStudyPlanAdded = (event) => {
//       if (event.detail && event.detail.studyPlan) {
//         loadStudyPlans();
//         createNotification(event.detail.studyPlan);
//       }
//     };
//     const handleNotificationAdded = (event) => {
//       if (event.detail && event.detail.notification) {
//         loadNotifications();
//       }
//     };
//     const handleStudyPlanUpdated = () => {
//       loadStudyPlans();
//     };
//     const handleStorageChange = (e) => {
//       if (e.key === 'studyPlans') {
//         loadStudyPlans();
//       }
//       if (e.key === 'studyNotifications') {
//         loadNotifications();
//       }
//     };
//     window.addEventListener('studyPlanAdded', handleStudyPlanAdded);
//     window.addEventListener('notificationAdded', handleNotificationAdded);
//     window.addEventListener('studyPlanUpdated', handleStudyPlanUpdated);
//     window.addEventListener('storage', handleStorageChange);
  
//     const interval = setInterval(() => {
//       loadStudyPlans();
//       loadNotifications();
//     }, 2000);
  
//     return () => {
//       window.removeEventListener('studyPlanAdded', handleStudyPlanAdded);
//       window.removeEventListener('notificationAdded', handleNotificationAdded);
//       window.removeEventListener('studyPlanUpdated', handleStudyPlanUpdated);
//       window.removeEventListener('storage', handleStorageChange);
//       clearInterval(interval);
//     };
//   }, []);
//   const loadStudyPlans = () => {
//     try {
//       const savedPlans = localStorage.getItem('studyPlans');
//       if (savedPlans) {
//         const plans = JSON.parse(savedPlans);
//         const uniquePlans = plans.filter((plan, index, self) =>
//           index === self.findIndex(p => p.id === plan.id)
//         ).map(plan => ({
//           ...plan,
//           studySessions: (plan.studySessions || []).filter(session =>
//             session && session.date && !isNaN(new Date(session.date + 'T00:00:00+05:30').getTime())
//           ).map(session => {
//             let normalizedDate;
//             try {
//               // Normalize dates to IST format
//               const dateObj = new Date(session.date + 'T00:00:00+05:30');
//               normalizedDate = getISTDateString(dateObj);
//             } catch (error) {
//               normalizedDate = session.date;
//             }
//             return {
//               ...session,
//               date: normalizedDate
//             };
//           })
//         }));
//         setStudyPlans(uniquePlans);
//       } else {
//         setStudyPlans([]);
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
//   const addNotification = (notification) => {
//     const existingNotifications = JSON.parse(localStorage.getItem('studyNotifications') || '[]');
//     const isDuplicate = existingNotifications.some(notif => notif.id === notification.id);
//     if (isDuplicate) return;
//     const updatedNotifications = [notification, ...existingNotifications];
//     localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifications));
//     setNotifications(updatedNotifications);
//     setUnreadNotifications(prev => prev + 1);
  
//     window.dispatchEvent(new StorageEvent('storage', {
//       key: 'studyNotifications',
//       newValue: JSON.stringify(updatedNotifications)
//     }));
//   };
//   const createNotification = (studyPlan) => {
//     const notificationId = `notif_${studyPlan.id}`;
//     const existingNotifications = JSON.parse(localStorage.getItem('studyNotifications') || '[]');
//     const isDuplicateNotification = existingNotifications.some(notif => notif.id === notificationId);
  
//     if (isDuplicateNotification) return;
//     const notification = {
//       id: notificationId,
//       type: 'study_plan_created',
//       title: t('new_study_plan_created'),
//       message: `Study plan for ${studyPlan.title} has been added to your calendar starting from today`,
//       date: new Date().toISOString(),
//       read: false,
//       planId: studyPlan.id
//     };
//     addNotification(notification);
//   };
//   const toggleMobileDropdown = (dropdown) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       [dropdown]: !prev[dropdown]
//     }));
//   };
//   const closeMobileMenu = () => {
//     setMobileMenuOpen(false);
//     setMobileDropdowns({
//       learn: false,
//       practice: false
//     });
//     setMobileLangDropdownOpen(false);
//   };
//   const getTodaysStudyPlans = () => {
//     const todayIST = getISTDateString();
//     const todaysPlans = [];
  
//     studyPlans.forEach(plan => {
//       plan.studySessions?.forEach(session => {
//         if (session.date === todayIST && !session.completed) {
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
//   const isToday = (date) => {
//     return isTodayIST(date);
//   };
//   const isSelectedDate = (date) => {
//     if (!selectedDate) return false;
//     const selectedDateString = getISTDateString(selectedDate);
//     const compareDateString = getISTDateString(date);
//     return selectedDateString === compareDateString;
//   };
//   // 🔥 Get Fire Color based on streak
//   const getFireColor = () => {
//     if (streak >= 30) return '#FFD700';
//     if (streak >= 15) return '#FF6B35';
//     if (streak >= 7) return '#FFA726';
//     return '#FF5722';
//   };
//   // 🔥 Get Next Milestone Info
//   const getNextMilestone = () => {
//    if (streak < 7) {
//     return { daysLeft: 7 - streak, title: t('steady_learner'), icon: FaSeedling };
//   } else if (streak < 15) {
//     return { daysLeft: 15 - streak, title: t('focused_mind'), icon: FaBrain };
//   } else if (streak < 30) {
//     return { daysLeft: 30 - streak, title: t('learning_legend'), icon: FaTrophy };
//   } else {
//     return { daysLeft: 0, title: t('max_level'), icon: FaTrophy };
//   }
// };
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
//   }, []);
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
//     setStreakDropdownOpen(false);
//     closeMobileMenu();
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
//     setMobileLangDropdownOpen(false);
//   };
//   const handleLogout = () => {
//     // Stop global screen time session before logout
//     stopGlobalSession();
//     const rewardPointsValue = localStorage.getItem('rewardPoints');
//     const rewardsHistoryValue = localStorage.getItem('rewardsHistory');
//     const streakData = localStorage.getItem('learningStreak');
//     const userSchedules = localStorage.getItem('userSchedules');
//     const shownReminders = localStorage.getItem('shownReminders');
  
//     localStorage.clear();
  
//     if (rewardPointsValue) {
//       localStorage.setItem('rewardPoints', rewardPointsValue);
//     }
//     if (rewardsHistoryValue) {
//       localStorage.setItem('rewardsHistory', rewardsHistoryValue);
//     }
//     if (streakData) {
//       localStorage.setItem('learningStreak', streakData);
//     }
//     if (userSchedules) {
//       localStorage.setItem('userSchedules', userSchedules);
//     }
//     if (shownReminders) {
//       localStorage.setItem('shownReminders', shownReminders);
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
//           { path: '/typing-master', name: t('typing_master', 'Typing Master') },
//       ],
//     },
//     { path: '/career', name: t('career', 'Career') },
//     { path: '/study-room', name: t('studyRoom', 'Study Room') },
//   ];
//   if (!showNavbar) return null;
//   const nextMilestone = getNextMilestone();
//   const fireColor = getFireColor();
//   return (
//     <motion.nav
//       className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className="navbar-container">
      
//         <div className="navbar-left">
//           <button
//             className="mobile-toggle-btn"
//             onClick={() => setMobileMenuOpen(true)}
//           >
//             <FaBars size={16} color="#333" />
//           </button>
//           <Link to="/student/dashboard" className="logo-container">
//             <img src={novyaLogo} alt="NOVYA Logo" style={{ height: '35px' }} />
//             <motion.span
//               className="logo-text"
//               initial={{ opacity: 0, x: -10 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//               whileHover={{ backgroundPosition: 'right center', transition: { duration: 1.5 } }}
//             >
//               NOVYA
//             </motion.span>
//           </Link>
//         </div>
//         <div className="navbar-center">
//           <ul className="desktop-nav-links">
//             {navLinks.map((link) => (
//               <li
//                 key={link.path}
//                 style={{ position: 'relative' }}
//                 onMouseEnter={() => {
//                   if (link.path === '/learn') setClassDropdownOpen(true);
//                   if (link.path === '/practice') setPracticeDropdownOpen(true);
//                 }}
//                 onMouseLeave={() => {
//                   setTimeout(() => {
//                     if (link.path === '/learn') setClassDropdownOpen(false);
//                     if (link.path === '/practice') setPracticeDropdownOpen(false);
//                   }, 200);
//                 }}
//               >
//                 {link.hasDropdown ? (
//                   <div
//                     style={{ position: 'relative' }}
//                     onMouseEnter={() => {
//                       if (link.path === '/learn') setClassDropdownOpen(true);
//                       if (link.path === '/practice') setPracticeDropdownOpen(true);
//                     }}
//                     onMouseLeave={() => {
//                       if (link.path === '/learn') setClassDropdownOpen(false);
//                       if (link.path === '/practice') setPracticeDropdownOpen(false);
//                     }}
//                   >
//                     <span
//                       className={`nav-link ${
//                         activeLink === link.path ||
//                         (link.hasDropdown && activeLink.startsWith(link.path))
//                           ? 'nav-link-active'
//                           : ''
//                       }`}
//                       onClick={(e) => e.preventDefault()}
//                       style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
//                     >
//                       {link.name}
//                       <FaChevronDown size={10} />
//                     </span>
//                     <AnimatePresence>
//                       {(link.path === '/learn' ? classDropdownOpen : practiceDropdownOpen) && (
//                         <motion.div
//                           className="nav-dropdown"
//                           initial={{ opacity: 0, y: -10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -10 }}
//                           onMouseEnter={() => {
//                             if (link.path === '/learn') setClassDropdownOpen(true);
//                             if (link.path === '/practice') setPracticeDropdownOpen(true);
//                           }}
//                           onMouseLeave={() => {
//                             if (link.path === '/learn') setClassDropdownOpen(false);
//                             if (link.path === '/practice') setPracticeDropdownOpen(false);
//                           }}
//                         >
//                           <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
//                             {link.dropdownItems.map((dropdownItem) => (
//                               <li key={dropdownItem.path}>
//                                 <Link
//                                   to={dropdownItem.path}
//                                   className={`dropdown-link ${
//                                     activeLink === dropdownItem.path
//                                       ? 'dropdown-link-active'
//                                       : ''
//                                   }`}
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
//                     className={`nav-link ${activeLink === link.path ? 'nav-link-active' : ''}`}
//                   >
//                     {link.name}
//                   </Link>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="navbar-right">
//           {!isMobile && (
//             <div
//               className="icon-wrapper"
//               onMouseEnter={() => {
//                 loadStudyPlans();
//                 setCalendarOpen(true);
//                 setNotificationsOpen(false);
//                 setStreakDropdownOpen(false);
//               }}
//               onMouseLeave={(e) => {
//                 // if (!e.relatedTarget || !e.relatedTarget.closest('.nav-dropdown')) {
//                 // setCalendarOpen(false);
//                 // }
//                 if (!e.relatedTarget || !(e.relatedTarget instanceof HTMLElement) ||
//     !e.relatedTarget.closest('.nav-dropdown')) {
//   setCalendarOpen(false);
// }
//               }}
//             >
//               <button
//                 className="nav-icon-btn calendar-button"
//               >
//                 <FaCalendarAlt size={14} />
//                 {getTodaysStudyPlans().length > 0 && (
//                   <span className="badge" style={{ width: '6px', height: '6px' }}></span>
//                 )}
//               </button>
//               <AnimatePresence>
//                 {calendarOpen && (
//                   <motion.div
//                     className="nav-dropdown calendar-dropdown"
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     onMouseEnter={() => setCalendarOpen(true)}
//                     onMouseLeave={() => setCalendarOpen(false)}
//                     style={{ width: '380px', maxHeight: '80vh', overflow: 'auto' }}
//                   >
//                     {/* Calendar Container */}
//                     <div style={{
//                       background: 'white',
//                       borderRadius: '12px',
//                       boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
//                       overflow: 'hidden'
//                     }}>
//                       {/* Calendar Header */}
//                       <div style={{
//                         padding: '16px 20px',
//                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                         color: 'white'
//                       }}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
//                           <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600',color:'whitesmoke' }}>
//                             {t('study_calendar')}
//                           </h3>
//                           <div style={{ display: 'flex', gap: '8px' }}>
//                             <button
//                               className="calendar-nav-btn"
//                               onClick={() => navigateMonth(-1)}
//                               style={{
//                                 background: 'rgba(255,255,255,0.2)',
//                                 color: 'white',
//                                 border: 'none',
//                                 width: '32px',
//                                 height: '32px',
//                                 borderRadius: '8px',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 cursor: 'pointer'
//                               }}
//                             >
//                               ‹
//                             </button>
//                             <button
//                               className="calendar-nav-btn"
//                               onClick={() => navigateMonth(1)}
//                               style={{
//                                 background: 'rgba(255,255,255,0.2)',
//                                 color: 'white',
//                                 border: 'none',
//                                 width: '32px',
//                                 height: '32px',
//                                 borderRadius: '8px',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 cursor: 'pointer'
//                               }}
//                             >
//                               ›
//                             </button>
//                           </div>
//                         </div>
//                         <div style={{ fontSize: '14px', fontWeight: '500', opacity: 0.9 }}>
//                           {currentMonth.toLocaleDateString(i18n.language, {
//                             month: "long",
//                             year: "numeric",
//                             timeZone: 'Asia/Kolkata'
//                           })}
//                         </div>
//                       </div>
//                       {/* Calendar Grid */}
//                       <div style={{ padding: '16px 20px' }}>
//                         {/* Weekdays Header */}
//                         <div style={{
//                           display: 'grid',
//                           gridTemplateColumns: 'repeat(7, 1fr)',
//                           gap: '4px',
//                           marginBottom: '12px'
//                         }}>
//                           {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
//                             <div key={day} style={{
//                               textAlign: 'center',
//                               fontSize: '12px',
//                               fontWeight: '600',
//                               color: '#6b7280',
//                               padding: '8px 4px'
//                             }}>
//                               {day}
//                             </div>
//                           ))}
//                         </div>
//                         {/* Calendar Days */}
//                         <div style={{
//                           display: 'grid',
//                           gridTemplateColumns: 'repeat(7, 1fr)',
//                           gap: '4px'
//                         }}>
//                           {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, index) => (
//                             <div key={`empty-${index}`} style={{ height: '36px' }} />
//                           ))}
                        
//                           {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
//                             const day = index + 1;
//                             const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
//                             const hasPlans = shouldShowDot(date);
                          
//                             return (
//                               <div
//                                 key={day}
//                                 className={`calendar-date ${isToday(date) ? 'today' : ''} ${isSelectedDate(date) ? 'selected' : ''}`}
//                                 onClick={() => handleDateClick(date)}
//                                 style={{
//                                   position: 'relative',
//                                   height: '36px',
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   justifyContent: 'center',
//                                   borderRadius: '8px',
//                                   cursor: 'pointer',
//                                   fontSize: '14px',
//                                   fontWeight: '500',
//                                   transition: 'all 0.2s ease',
//                                   background: isSelectedDate(date) ? '#3b82f6' : 'transparent',
//                                   color: isSelectedDate(date) ? 'white' : isToday(date) ? '#3b82f6' : '#374151',
//                                   border: isToday(date) && !isSelectedDate(date) ? '2px solid #3b82f6' : 'none'
//                                 }}
//                                 onMouseEnter={(e) => {
//                                   if (!isSelectedDate(date)) {
//                                     e.target.style.background = '#f3f4f6';
//                                   }
//                                 }}
//                                 onMouseLeave={(e) => {
//                                   if (!isSelectedDate(date)) {
//                                     e.target.style.background = 'transparent';
//                                   }
//                                 }}
//                               >
//                                 {day}
//                                 {hasPlans && (
//                                   <div
//                                     style={{
//                                       position: 'absolute',
//                                       bottom: '4px',
//                                       left: '50%',
//                                       transform: 'translateX(-50%)',
//                                       width: '4px',
//                                       height: '4px',
//                                       borderRadius: '50%',
//                                       backgroundColor: isSelectedDate(date) ? 'white' : '#f97316'
//                                     }}
//                                   />
//                                 )}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                       {/* Selected Date Plans Section */}
//                       {selectedDate && (
//                         <div style={{
//                           borderTop: '1px solid #e5e7eb',
//                           background: '#f8fafc'
//                         }}>
//                           <div style={{ padding: '16px 20px' }}>
//                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                               <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#374151' }}>
//                                 {t('study_plans_for')} {formatISTDate(getISTDateString(selectedDate))}
//                               </h4>
//                               {!savedSchedules[getISTDateString(selectedDate)] && !showAddSchedule && (
//                                 <button
//                                   onClick={() => handleAddScheduleClick(selectedDate)}
//                                   style={{
//                                     padding: '6px 12px',
//                                     background: '#3b82f6',
//                                     color: 'white',
//                                     border: 'none',
//                                     borderRadius: '6px',
//                                     cursor: 'pointer',
//                                     fontSize: '12px',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: '4px',
//                                     fontWeight: '500'
//                                   }}
//                                 >
//                                   <FaPlus size={10} />
//                                   {t('add_schedule')}
//                                 </button>
//                               )}
//                               {savedSchedules[getISTDateString(selectedDate)] && !showAddSchedule && (
//                                 <button
//                                   onClick={() => handleEditScheduleClick(selectedDate)}
//                                   style={{
//                                     padding: '6px 12px',
//                                     background: '#6b7280',
//                                     color: 'white',
//                                     border: 'none',
//                                     borderRadius: '6px',
//                                     cursor: 'pointer',
//                                     fontSize: '12px',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: '4px',
//                                     fontWeight: '500'
//                                   }}
//                                 >
//                                   <FaEdit size={10} />
//                                   Edit
//                                 </button>
//                               )}
//                             </div>
//                             {/* Add/Edit Schedule Form */}
//                             {(showAddSchedule && editingDate && getISTDateString(editingDate) === getISTDateString(selectedDate)) && (
//                               <div style={{
//                                 background: 'white',
//                                 borderRadius: '8px',
//                                 border: '1px solid #e5e7eb',
//                                 padding: '12px',
//                                 marginBottom: '12px'
//                               }}>
//                                 <div style={{
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   gap: '8px',
//                                   marginBottom: '8px'
//                                 }}>
//                                   <FaEdit size={12} color="#6b7280" />
//                                   <h5 style={{
//                                     fontSize: '13px',
//                                     fontWeight: '600',
//                                     margin: 0,
//                                     color: '#374151'
//                                   }}>
//                                     {savedSchedules[getISTDateString(selectedDate)] ? 'Edit Schedule' : 'Add Schedule'}
//                                   </h5>
//                                 </div>
                              
//                                 <textarea
//                                   value={scheduleInput}
//                                   onChange={(e) => setScheduleInput(e.target.value)}
//                                   placeholder="Add your schedule for this date..."
//                                   style={{
//                                     width: '100%',
//                                     minHeight: '60px',
//                                     padding: '8px',
//                                     border: '1px solid #d1d5db',
//                                     borderRadius: '6px',
//                                     fontSize: '13px',
//                                     resize: 'vertical',
//                                     fontFamily: 'inherit',
//                                     outline: 'none',
//                                     transition: 'border-color 0.2s ease'
//                                   }}
//                                   onFocus={(e) => {
//                                     e.target.style.borderColor = '#3b82f6';
//                                   }}
//                                   onBlur={(e) => {
//                                     e.target.style.borderColor = '#d1d5db';
//                                   }}
//                                 />
                              
//                                 <div style={{
//                                   display: 'flex',
//                                   gap: '6px',
//                                   marginTop: '8px'
//                                 }}>
//                                   <button
//                                     onClick={handleSaveSchedule}
//                                     disabled={!scheduleInput.trim()}
//                                     style={{
//                                       padding: '6px 12px',
//                                       background: scheduleInput.trim() ? '#3b82f6' : '#9ca3af',
//                                       color: 'white',
//                                       border: 'none',
//                                       borderRadius: '4px',
//                                       cursor: scheduleInput.trim() ? 'pointer' : 'not-allowed',
//                                       fontSize: '12px',
//                                       display: 'flex',
//                                       alignItems: 'center',
//                                       gap: '4px',
//                                       fontWeight: '500'
//                                     }}
//                                   >
//                                     <FaSave size={10} />
//                                     Save
//                                   </button>
                                
//                                   {savedSchedules[getISTDateString(selectedDate)] && (
//                                     <button
//                                       onClick={() => deleteSchedule(selectedDate)}
//                                       style={{
//                                         padding: '6px 12px',
//                                         background: '#ef4444',
//                                         color: 'white',
//                                         border: 'none',
//                                         borderRadius: '4px',
//                                         cursor: 'pointer',
//                                         fontSize: '12px',
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         gap: '4px',
//                                         fontWeight: '500'
//                                       }}
//                                     >
//                                       <FaTrash size={10} />
//                                       Delete
//                                     </button>
//                                   )}
                                
//                                   <button
//                                     onClick={handleCancelEdit}
//                                     style={{
//                                       padding: '6px 12px',
//                                       background: 'transparent',
//                                       color: '#6b7280',
//                                       border: '1px solid #d1d5db',
//                                       borderRadius: '4px',
//                                       cursor: 'pointer',
//                                       fontSize: '12px',
//                                       fontWeight: '500'
//                                     }}
//                                   >
//                                     Cancel
//                                   </button>
//                                 </div>
//                               </div>
//                             )}
//                             {/* Plans List */}
//                             {getCombinedPlansForDate(selectedDate).length === 0 ? (
//                               <div style={{
//                                 textAlign: 'center',
//                                 padding: '20px',
//                                 color: '#6b7280',
//                                 fontSize: '14px'
//                               }}>
//                                 {t('no_plans_scheduled')}
//                               </div>
//                             ) : (
//                               <div style={{ maxHeight: '120px', overflow: 'auto' }}>
//                                 {getCombinedPlansForDate(selectedDate).map((plan, index) => (
//                                   <div key={index} style={{
//                                     background: 'white',
//                                     borderRadius: '8px',
//                                     padding: '12px',
//                                     marginBottom: '8px',
//                                     borderLeft: `4px solid ${plan.color}`,
//                                     boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//                                   }}>
//                                     <div style={{
//                                       fontSize: '14px',
//                                       fontWeight: '600',
//                                       color: '#1f2937',
//                                       marginBottom: '4px'
//                                     }}>
//                                       {plan.subject}
//                                     </div>
//                                     <div style={{
//                                       fontSize: '13px',
//                                       color: '#4b5563',
//                                       marginBottom: '4px'
//                                     }}>
//                                       {plan.topic}
//                                     </div>
//                                     <div style={{
//                                       fontSize: '12px',
//                                       color: '#6b7280',
//                                       display: 'flex',
//                                       alignItems: 'center',
//                                       gap: '4px'
//                                     }}>
//                                       <FaClock size={10} />
//                                       {plan.duration}
//                                     </div>
//                                     {plan.type === 'personal_schedule' && (
//                                       <div style={{
//                                         fontSize: '11px',
//                                         color: '#3b82f6',
//                                         fontStyle: 'italic',
//                                         marginTop: '4px'
//                                       }}>
//                                         Personal Schedule
//                                       </div>
//                                     )}
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                       {/* Schedule History */}
//                       {scheduleHistory.length > 0 && (
//                         <div style={{
//                           borderTop: '1px solid #e5e7eb'
//                         }}>
//                           <div style={{ padding: '16px 20px' }}>
//                             <div style={{
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '8px',
//                               marginBottom: '12px'
//                             }}>
//                               <FaHistory size={14} color="#6b7280" />
//                               <h4 style={{
//                                 fontSize: '16px',
//                                 fontWeight: '600',
//                                 margin: 0,
//                                 color: '#374151'
//                               }}>
//                                 Schedule History
//                               </h4>
//                             </div>
                          
//                             <div style={{
//                               maxHeight: '150px',
//                               overflow: 'auto'
//                             }}>
//                               {scheduleHistory.map(({ date, note, displayDate }, index) => (
//                                 <div
//                                   key={date}
//                                   style={{
//                                     background: 'white',
//                                     borderRadius: '8px',
//                                     padding: '12px',
//                                     marginBottom: '8px',
//                                     borderLeft: '4px solid #3b82f6',
//                                     boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//                                   }}
//                                 >
//                                   <div style={{
//                                     fontWeight: '600',
//                                     color: '#1f2937',
//                                     marginBottom: '4px',
//                                     fontSize: '14px'
//                                   }}>
//                                     {displayDate}
//                                   </div>
//                                   <div style={{
//                                     color: '#6b7280',
//                                     fontSize: '13px'
//                                   }}>
//                                     {note}
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
//           {!isMobile && (
//             <div
//               className="icon-wrapper"
//               onMouseEnter={() => {
//                 loadNotifications();
//                 setNotificationsOpen(true);
//                 setCalendarOpen(false);
//                 setStreakDropdownOpen(false);
//               }}
//               onMouseLeave={(e) => {
//                 // if (!e.relatedTarget || !e.relatedTarget.closest('.nav-dropdown')) {
//                 // setNotificationsOpen(false);
//                 // }
//                 if (!e.relatedTarget || !(e.relatedTarget instanceof HTMLElement) ||
//     !e.relatedTarget.closest('.nav-dropdown')) {
//   setNotificationsOpen(false);
// }
//               }}
//             >
//               <button
//                 className="nav-icon-btn notification-button"
//               >
//                 <FaBell size={14} />
//                 {unreadNotifications > 0 && (
//                   <span className="badge">{unreadNotifications}</span>
//                 )}
//               </button>
//               <AnimatePresence>
//                 {notificationsOpen && (
//                   <Notifications
//                     isMobile={false}
//                     onClose={() => setNotificationsOpen(false)}
//                   />
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
//           {!isMobile && (
//             <div
//               className="language-wrapper"
//               onMouseEnter={() => {
//                 setLangDropdownOpen(true);
//                 setCalendarOpen(false);
//                 setNotificationsOpen(false);
//                 setStreakDropdownOpen(false);
//               }}
//               onMouseLeave={() => {
//                 setTimeout(() => setLangDropdownOpen(false), 200);
//               }}
//             >
//               <button
//                 className="nav-icon-btn language-button"
//               >
//                 <FaGlobe size={12} />
//                 <span>{i18n.language.toUpperCase()}</span>
//                 <FaChevronDown size={8} />
//               </button>
//               <AnimatePresence>
//                 {langDropdownOpen && (
//                   <motion.div
//                     className="nav-dropdown language-dropdown"
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     onMouseEnter={() => setLangDropdownOpen(true)}
//                     onMouseLeave={() => setLangDropdownOpen(false)}
//                   >
//                     {languages.map((lang) => (
//                       <button
//                         key={lang.code}
//                         onClick={() => handleLanguageChange(lang.code)}
//                         style={{
//                           width: '100%',
//                           border: 'none',
//                           background: i18n.language === lang.code ? '#f0f7ff' : 'transparent',
//                           padding: '12px 16px',
//                           textAlign: 'left',
//                           cursor: 'pointer',
//                           fontSize: '14px',
//                           color: i18n.language === lang.code ? '#2D5D7B' : '#333',
//                           fontWeight: i18n.language === lang.code ? '600' : '400',
//                           transition: 'all 0.2s ease'
//                         }}
//                         onMouseEnter={(e) => {
//                           if (i18n.language !== lang.code) {
//                             e.target.style.background = '#2D5D7B';
//                             e.target.style.color = 'white';
//                           }
//                         }}
//                         onMouseLeave={(e) => {
//                           if (i18n.language !== lang.code) {
//                             e.target.style.background = 'transparent';
//                             e.target.style.color = '#333';
//                           }
//                         }}
//                       >
//                         {lang.label}
//                       </button>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
//           <RewardPoints isMobile={isMobile} />
//           <div
//             className="streak-wrapper"
//             style={{
//               position: 'relative',
//               display: 'flex',
//               alignItems: 'center',
//               margin: '0 8px'
//             }}
//           >
//             <button
//               className="nav-icon-btn streak-button"
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '6px',
//                 padding: '8px 12px',
//                 background: 'transparent',
//                 border: 'none',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 color: '#000000',
//                 fontWeight: '600',
//                 fontSize: '14px',
//                 transition: 'all 0.2s ease'
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.background = '#fff5f5';
//                 setStreakDropdownOpen(true);
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.background = 'transparent';
//               }}
//               onClick={() => setStreakDropdownOpen(!streakDropdownOpen)}
//             >
//               <FaFire
//                 size={16}
//                 color={fireColor}
//                 style={{
//                   filter: streak >= 7 ? `drop-shadow(0 0 2px ${fireColor}50)` : 'none',
//                   transition: 'all 0.3s ease'
//                 }}
//               />
//               <span style={{ color: '#000000' }}>{streak}</span>
//             </button>
//             <AnimatePresence>
//               {streakDropdownOpen && (
//                 <motion.div
//                   className="nav-dropdown streak-dropdown"
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   onMouseEnter={() => setStreakDropdownOpen(true)}
//                   onMouseLeave={() => setStreakDropdownOpen(false)}
//                   style={{
//                     width: '280px',
//                     right: 0,
//                     left: 'auto'
//                   }}
//                 >
//                   <div style={{ padding: '16px', background: 'linear-gradient(135deg, #fff9f0, #ffe8cc)' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
//                       <div style={{
//                         background: fireColor,
//                         borderRadius: '50%',
//                         width: '40px',
//                         height: '40px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: 'white',
//                         fontSize: '18px',
//                         fontWeight: 'bold'
//                       }}>
//                         {streak}
//                       </div>
//                     <div>
//   <div style={{ fontSize: '16px', fontWeight: '700', color: '#7c2d12' }}>
//     {t('day_streak', { count: streak })}
//   </div>
//   <div style={{ fontSize: '14px', color: '#d97706', fontWeight: '600' }}>
//     {t(streakTitle)}
//   </div>
// </div>
//                     </div>
//                     {streakTitle && (
//                       <div style={{
//                         background: 'rgba(255, 255, 255, 0.7)',
//                         padding: '12px',
//                         borderRadius: '8px',
//                         marginBottom: '12px',
//                         border: `2px solid ${fireColor}30`
//                       }}>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#7c2d12' }}>
//                           <FaTrophy color={fireColor} />
//                           {streakTitle}
//                         </div>
//                       </div>
//                     )}
//                     {nextMilestone.daysLeft > 0 && (
//                       <div style={{
//                         background: 'rgba(255, 255, 255, 0.9)',
//                         padding: '12px',
//                         borderRadius: '8px',
//                         border: '1px solid #e5e7eb'
//                       }}>
//                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
//   {t('next_milestone')}
// </div>
// <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
//   <nextMilestone.icon size={12} color={fireColor} />
//   <span>
//     {nextMilestone.daysLeft} {t(nextMilestone.daysLeft === 1 ? 'day' : 'days')} {t('more_for')} {t(nextMilestone.title)}
//   </span>
// </div>
//                       </div>
//                     )}
//                <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
//   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
//    <span>{t('steady_learner')}</span>
//     <span style={{ fontWeight: '600', color: streak >= 7 ? '#10b981' : '#9ca3af' }}>
//       {streak >= 7 ? '✓' : `7 ${t('days')}`}
//     </span>
//   </div>
//   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
//     <span>{t('focused_mind')}</span>
//     <span style={{ fontWeight: '600', color: streak >= 15 ? '#f59e0b' : '#9ca3af' }}>
//       {streak >= 15 ? '✓' : `15 ${t('days')}`}
//     </span>
//   </div>
//   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//     <span>{t('learning_legend')}</span>
//     <span style={{ fontWeight: '600', color: streak >= 30 ? '#d97706' : '#9ca3af' }}>
//       {streak >= 30 ? '✓' : `30 ${t('days')}`}
//     </span>
//   </div>
// </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//           <div
//             className="avatar-wrapper"
//             onMouseEnter={() => {
//               setAvatarOpen(true);
//               setCalendarOpen(false);
//               setNotificationsOpen(false);
//               setLangDropdownOpen(false);
//               setStreakDropdownOpen(false);
//             }}
//             onMouseLeave={() => setAvatarOpen(false)}
//           >
//             <div className="avatar-container">
//               {avatar ? (
//                 <img src={avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//               ) : (
//                 <FaUserCircle size={36} color="#4B5563" />
//               )}
//             </div>
//             <AnimatePresence>
//               {avatarOpen && (
//                 <motion.div
//                   className="nav-dropdown avatar-dropdown"
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   onMouseEnter={() => setAvatarOpen(true)}
//                   onMouseLeave={() => setAvatarOpen(false)}
//                 >
//                   <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', background: 'linear-gradient(135deg, #fff9e6, #fff0cc)' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#744210', fontWeight: '600' }}>
//                       <FaCoins size={14} color="#FFA500" />
//                       <span>{t('reward_points')}: {parseInt(localStorage.getItem('rewardPoints') || '0').toLocaleString()}</span>
//                     </div>
//                   </div>
//                   <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', background: '#fff5f5' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#7c2d12', fontWeight: '600' }}>
//                       <FaFire size={14} color={fireColor} />
//                       <span>
//                         {t("streak_label")}: {streak} {t("days_label")}
//                       </span>
//                     </div>
//                     {streakTitle && (
//                       <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
//                         {streakTitle}
//                       </div>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => navigate('/user-details')}
//                     style={{
//                       width: '100%',
//                       border: 'none',
//                       background: 'transparent',
//                       padding: '10px 16px',
//                       cursor: 'pointer',
//                       textAlign: 'left',
//                       fontSize: '14px',
//                       color: '#1F2937',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px'
//                     }}
//                     onMouseEnter={(e) => { e.target.style.background = '#f0f0f0'; }}
//                     onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
//                   >
//                     <FaUserCircle size={14} />
//                     {t('view_profile')}
//                   </button>
                  
//  {/* ✅ Daily Summary Button */}
//   <Link
//     to="/daily-summary"
//     style={{
//       width: '100%',
//       border: 'none',
//       background: 'transparent',
//       padding: '10px 16px',
//       cursor: 'pointer',
//       textAlign: 'left',
//       fontSize: '14px',
//       color: '#1F2937',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px',
//       textDecoration: 'none',
//       borderRadius: '6px',
//       transition: 'background 0.2s ease'
//     }}
//     onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
//     onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
//   >
//     <BarChart fontSize="small" />
//     {t("daily_summary")}
//   </Link>
//       {/* ✅ Leadership Button */}
//     {/* <Link to="/leadership" className="nav-item leadership-link">
//       <FaTrophy style={{ marginRight: '6px', color: '#fbbf24' }} />
//       Leadership
//     </Link> */}
//     <Link
//   to="/leadership"
//   style={{
//     width: '100%',
//     border: 'none',
//     background: 'transparent',
//     padding: '10px 16px',
//     cursor: 'pointer',
//     textAlign: 'left',
//     fontSize: '14px',
//     color: '#1F2937',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     textDecoration: 'none',
//     borderRadius: '6px',
//     transition: 'background 0.2s ease'
//   }}
//   onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
//   onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
// >
//   <FaTrophy fontSize="small" style={{ color: '#fbbf24' }} />
//   {t('Leadership')}
// </Link>
//                   <button
//                     onClick={handleLogout}
//                     style={{
//                       width: '100%',
//                       border: 'none',
//                       background: 'transparent',
//                       padding: '10px 16px',
//                       cursor: 'pointer',
//                       textAlign: 'left',
//                       fontSize: '14px',
//                       color: '#dc2626',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px'
//                     }}
//                     onMouseEnter={(e) => { e.target.style.background = '#fef2f2'; }}
//                     onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
//                   >
//                     <FaSignOutAlt size={14} />
//                     {t('logout')}
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//       {/* Mobile menu and other components remain the same */}
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
//               {/* Mobile menu content remains the same */}
//               <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                   <img src={novyaLogo} alt="NOVYA Logo" style={{ height: '30px' }} />
//                   <span className="logo-text" style={{ fontSize: '1.4rem' }}>NOVYA</span>
//                 </div>
//                 <button onClick={closeMobileMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b7280' }}>
//                   <FaTimes />
//                 </button>
//               </div>
//               <div style={{ padding: '16px 20px', background: '#fff5f5', borderBottom: '1px solid #fed7d7', display: 'flex', alignItems: 'center', gap: '12px' }}>
//                 <FaFire size={20} color={fireColor} />
//                 <div>
//                   <div style={{ fontSize: '16px', fontWeight: '600', color: '#7c2d12' }}>
//                     {streak} Day Streak
//                   </div>
//                   {streakTitle && (
//                     <div style={{ fontSize: '14px', color: '#d97706', fontWeight: '500' }}>
//                       {streakTitle}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div style={{ display: 'flex', gap: '12px', padding: '0 16px', marginBottom: '16px', marginTop: '16px' }}>
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
//                     <span className="badge" style={{ width: '6px', height: '6px' }}></span>
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
              
//               </div>
//               <div style={{ padding: '20px' }}>
//                 {navLinks.map((link) => (
//                   <div key={link.path} style={{ marginBottom: '8px' }}>
//                     {link.hasDropdown ? (
//                       <>
//                         <button
//                           onClick={() => toggleMobileDropdown(link.path === '/learn' ? 'learn' : 'practice')}
//                           style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'space-between',
//                             padding: '12px 16px',
//                             background: '#f8fafc',
//                             border: 'none',
//                             borderRadius: '8px',
//                             width: '100%',
//                             cursor: 'pointer',
//                             color: '#374151',
//                             fontWeight: '500'
//                           }}
//                         >
//                           <span>{link.name}</span>
//                           <FaChevronDown size={12} style={{ transform: mobileDropdowns[link.path === '/learn' ? 'learn' : 'practice'] ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
//                         </button>
//                         <AnimatePresence>
//                           {mobileDropdowns[link.path === '/learn' ? 'learn' : 'practice'] && (
//                             <motion.div
//                               initial={{ opacity: 0, height: 0 }}
//                               animate={{ opacity: 1, height: 'auto' }}
//                               exit={{ opacity: 0, height: 0 }}
//                               style={{ paddingLeft: '20px', marginTop: '8px' }}
//                             >
//                               {link.dropdownItems.map((dropdownItem) => (
//                                 <Link
//                                   key={dropdownItem.path}
//                                   to={dropdownItem.path}
//                                   onClick={closeMobileMenu}
//                                   style={{
//                                     display: 'block',
//                                     padding: '10px 16px',
//                                     textDecoration: 'none',
//                                     color: activeLink === dropdownItem.path ? '#2D5D7B' : '#6b7280',
//                                     borderLeft: '2px solid #e5e7eb',
//                                     marginBottom: '4px',
//                                     background: activeLink === dropdownItem.path ? '#f0f7ff' : 'transparent'
//                                   }}
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
//                         onClick={closeMobileMenu}
//                         style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'space-between',
//                           padding: '12px 16px',
//                           background: activeLink === link.path ? '#f0f7ff' : '#f8fafc',
//                           borderRadius: '8px',
//                           textDecoration: 'none',
//                           color: activeLink === link.path ? '#2D5D7B' : '#374151',
//                           fontWeight: '500'
//                         }}
//                       >
//                         <span>{link.name}</span>
//                       </Link>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb', marginTop: '20px' }}>
//                 <div style={{ position: 'relative', marginBottom: '8px' }}>
//                   <button
//                     className="mobile-action-button"
//                     onClick={() => setMobileLangDropdownOpen(!mobileLangDropdownOpen)}
//                     style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
//                   >
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                       <FaGlobe size={14} />
//                       <span>Language ({i18n.language.toUpperCase()})</span>
//                     </div>
//                     <FaChevronDown
//                       size={12}
//                       style={{
//                         transform: mobileLangDropdownOpen ? 'rotate(180deg)' : 'none',
//                         transition: 'transform 0.3s ease'
//                       }}
//                     />
//                   </button>
//                   <AnimatePresence>
//                     {mobileLangDropdownOpen && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: 'auto' }}
//                         exit={{ opacity: 0, height: 0 }}
//                         style={{
//                           background: 'white',
//                           border: '1px solid #e5e7eb',
//                           borderRadius: '8px',
//                           marginTop: '8px',
//                           overflow: 'hidden'
//                         }}
//                       >
//                         {languages.map((lang) => (
//                           <button
//                             key={lang.code}
//                             onClick={() => {
//                               handleLanguageChange(lang.code);
//                               setMobileLangDropdownOpen(false);
//                             }}
//                             style={{
//                               width: '100%',
//                               border: 'none',
//                               background: i18n.language === lang.code ? '#f0f7ff' : 'transparent',
//                               padding: '12px 16px',
//                               textAlign: 'left',
//                               cursor: 'pointer',
//                               fontSize: '14px',
//                               color: i18n.language === lang.code ? '#2D5D7B' : '#333',
//                               fontWeight: i18n.language === lang.code ? '600' : '400',
//                               borderBottom: '1px solid #f3f4f6'
//                             }}
//                           >
//                             {lang.label}
//                           </button>
//                         ))}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//                 <button
//                   className="mobile-action-button"
//                   onClick={() => {
//                     navigate('/user-details');
//                     closeMobileMenu();
//                   }}
//                 >
//                   <FaUserCircle size={14} />
//                   <span> {t('view_profile')}</span>
//                 </button>
                
//  {/* ✅ Daily Summary Button */}
//   <Link
//     to="/daily-summary"
//     style={{
//       width: '100%',
//       border: 'none',
//       background: 'transparent',
//       padding: '10px 16px',
//       cursor: 'pointer',
//       textAlign: 'left',
//       fontSize: '14px',
//       color: '#1F2937',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px',
//       textDecoration: 'none',
//       borderRadius: '6px',
//       transition: 'background 0.2s ease'
//     }}
//     onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
//     onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
//   >
//     <BarChart fontSize="small" />
//     {t("daily_summary")}
//   </Link>
  
//     <Link
//   to="/leadership"
//   style={{
//     width: '100%',
//     border: 'none',
//     background: 'transparent',
//     padding: '10px 16px',
//     cursor: 'pointer',
//     textAlign: 'left',
//     fontSize: '14px',
//     color: '#1F2937',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     textDecoration: 'none',
//     borderRadius: '6px',
//     transition: 'background 0.2s ease'
//   }}
//   onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
//   onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
// >
//   <FaTrophy fontSize="small" style={{ color: '#fbbf24' }} />
//   {t('Leadership')}
// </Link>
//                 <button
//                   className="mobile-action-button"
//                   onClick={handleLogout}
//                   style={{ color: '#dc2626', borderColor: '#fecaca' }}
//                 >
//                   <FaSignOutAlt size={14} />
//                   <span>{t('logout')}</span>
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//       {/* Mobile calendar and notifications remain the same */}
//       {isMobile && (
//         <AnimatePresence>
//           {calendarOpen && (
//             <>
//               <motion.div
//                 className="mobile-calendar-content"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.8, opacity: 0 }}
//                 onClick={(e) => e.stopPropagation()}
//                 style={{ width: '90vw', maxWidth: '400px' }}
//               >
//                 {/* Mobile calendar content remains the same */}
//                 <div style={{
//                   background: 'white',
//                   borderRadius: '12px',
//                   boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
//                   overflow: 'hidden'
//                 }}>
//                   <div className="calendar-header" style={{
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     color: 'white'
//                   }}>
//                     <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
//                       {t('study_calendar')}
//                     </h3>
//                     <button onClick={() => setCalendarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: '18px' }}>
//                       <FaTimes />
//                     </button>
//                   </div>
                
//                   <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <button
//                       className="calendar-nav-btn"
//                       onClick={() => navigateMonth(-1)}
//                       style={{ background: '#e5e7eb', color: '#374151' }}
//                     >
//                       ‹
//                     </button>
//                     <span style={{ fontSize: '16px', fontWeight: '500', color: '#374151' }}>
//                       {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })}
//                     </span>
//                     <button
//                       className="calendar-nav-btn"
//                       onClick={() => navigateMonth(1)}
//                       style={{ background: '#e5e7eb', color: '#374151' }}
//                     >
//                       ›
//                     </button>
//                   </div>
//                   <div className="calendar-weekdays">
//                     {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
//                       <div key={day} className="calendar-weekday">
//                         {day}
//                       </div>
//                     ))}
//                   </div>
//                   <div className="calendar-days-grid">
//                     {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, index) => (
//                       <div key={`empty-${index}`} style={{ width: '40px', height: '40px' }} />
//                     ))}
                  
//                     {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
//                       const day = index + 1;
//                       const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
//                       const hasPlans = shouldShowDot(date);
                    
//                       return (
//                         <div
//                           key={day}
//                           className={`calendar-date ${isToday(date) ? 'today' : ''} ${isSelectedDate(date) ? 'selected' : ''} ${hasPlans ? 'has-event' : ''}`}
//                           onClick={() => handleDateClick(date)}
//                           style={{ position: 'relative', cursor: 'pointer' }}
//                         >
//                           {day}
//                           {hasPlans && (
//                             <div
//                               style={{
//                                 position: 'absolute',
//                                 bottom: '2px',
//                                 left: '50%',
//                                 transform: 'translateX(-50%)',
//                                 width: '4px',
//                                 height: '4px',
//                                 borderRadius: '50%',
//                                 backgroundColor: '#f97316',
//                                 boxShadow: '0 0 1px rgba(249, 115, 22, 0.5)'
//                               }}
//                             />
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                   {selectedDate && (
//                     <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                         <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#374151' }}>
//                           {t('study_plans_for')} {formatISTDate(getISTDateString(selectedDate))}
//                         </h4>
//                         {!savedSchedules[getISTDateString(selectedDate)] && !showAddSchedule && (
//                           <button
//                             onClick={() => handleAddScheduleClick(selectedDate)}
//                             style={{
//                               padding: '8px 12px',
//                               background: '#3b82f6',
//                               color: 'white',
//                               border: 'none',
//                               borderRadius: '6px',
//                               cursor: 'pointer',
//                               fontSize: '12px',
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '4px'
//                             }}
//                           >
//                             <FaPlus size={12} />
//                             {t('add_schedule')}
//                           </button>
//                         )}
//                         {savedSchedules[getISTDateString(selectedDate)] && !showAddSchedule && (
//                           <button
//                             onClick={() => handleEditScheduleClick(selectedDate)}
//                             style={{
//                               padding: '8px 12px',
//                               background: '#6b7280',
//                               color: 'white',
//                               border: 'none',
//                               borderRadius: '6px',
//                               cursor: 'pointer',
//                               fontSize: '12px',
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '4px'
//                             }}
//                           >
//                             <FaEdit size={12} />
//                             Edit
//                           </button>
//                         )}
//                       </div>
//                       {(showAddSchedule && editingDate && getISTDateString(editingDate) === getISTDateString(selectedDate)) && (
//                         <div style={{
//                           padding: '12px',
//                           background: '#f8fafc',
//                           borderRadius: '8px',
//                           border: '1px solid #e5e7eb',
//                           marginBottom: '12px'
//                         }}>
//                           <div style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '8px',
//                             marginBottom: '8px'
//                           }}>
//                             <FaEdit size={14} color="#6b7280" />
//                             <h5 style={{
//                               fontSize: '14px',
//                               fontWeight: '600',
//                               margin: 0,
//                               color: '#374151'
//                             }}>
//                               {savedSchedules[getISTDateString(selectedDate)] ? 'Edit Schedule' : 'Add Schedule'}
//                             </h5>
//                           </div>
                        
//                           <textarea
//                             value={scheduleInput}
//                             onChange={(e) => setScheduleInput(e.target.value)}
//                             placeholder="Add your schedule for this date..."
//                             style={{
//                               width: '100%',
//                               minHeight: '80px',
//                               padding: '10px',
//                               border: '1px solid #d1d5db',
//                               borderRadius: '6px',
//                               fontSize: '14px',
//                               resize: 'vertical',
//                               fontFamily: 'inherit'
//                             }}
//                           />
                        
//                           <div style={{
//                             display: 'flex',
//                             gap: '8px',
//                             marginTop: '10px',
//                             flexWrap: 'wrap'
//                           }}>
//                             <button
//                               onClick={handleSaveSchedule}
//                               disabled={!scheduleInput.trim()}
//                               style={{
//                                 padding: '8px 16px',
//                                 background: scheduleInput.trim() ? '#3b82f6' : '#9ca3af',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: '6px',
//                                 cursor: scheduleInput.trim() ? 'pointer' : 'not-allowed',
//                                 fontSize: '14px',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: '6px',
//                                 flex: 1
//                               }}
//                             >
//                               <FaSave size={12} />
//                               Save
//                             </button>
                          
//                             {savedSchedules[getISTDateString(selectedDate)] && (
//                               <button
//                                 onClick={() => deleteSchedule(selectedDate)}
//                                 style={{
//                                   padding: '8px 16px',
//                                   background: '#ef4444',
//                                   color: 'white',
//                                   border: 'none',
//                                   borderRadius: '6px',
//                                   cursor: 'pointer',
//                                   fontSize: '14px',
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   gap: '6px',
//                                   flex: 1
//                                 }}
//                               >
//                                 <FaTrash size={12} />
//                                 Delete
//                               </button>
//                             )}
                          
//                             <button
//                               onClick={handleCancelEdit}
//                               style={{
//                                 padding: '8px 16px',
//                                 background: 'transparent',
//                                 color: '#6b7280',
//                                 border: '1px solid #d1d5db',
//                                 borderRadius: '6px',
//                                 cursor: 'pointer',
//                                 fontSize: '14px',
//                                 flex: 1
//                               }}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                       {getCombinedPlansForDate(selectedDate).length === 0 ? (
//                         <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', margin: '16px 0' }}>
//                           {t('no_study_plans_scheduled')}
//                         </p>
//                       ) : (
//                         <div style={{ maxHeight: '200px', overflow: 'auto' }}>
//                           {getCombinedPlansForDate(selectedDate).map((plan, index) => (
//                             <div key={index} style={{
//                               padding: '12px',
//                               backgroundColor: '#f8fafc',
//                               borderRadius: '8px',
//                               marginBottom: '8px',
//                               borderLeft: `4px solid ${plan.color}`
//                             }}>
//                               <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
//                                 {plan.subject} - {plan.topic}
//                               </div>
//                               <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
//                                 <FaClock size={12} />
//                                 {plan.duration}
//                               </div>
//                               {plan.type === 'personal_schedule' && (
//                                 <div style={{ fontSize: '11px', color: '#3b82f6', fontStyle: 'italic', marginTop: '4px' }}>
//                                   Personal Schedule
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                   {scheduleHistory.length > 0 && (
//                     <div style={{
//                       padding: '16px',
//                       borderTop: '1px solid #e5e7eb'
//                     }}>
//                       <div style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '8px',
//                         marginBottom: '12px'
//                       }}>
//                         <FaHistory size={16} color="#6b7280" />
//                         <h4 style={{
//                           fontSize: '16px',
//                           fontWeight: '600',
//                           margin: 0,
//                           color: '#374151'
//                         }}>
//                           Schedule History
//                         </h4>
//                       </div>
                    
//                       <div style={{
//                         maxHeight: '200px',
//                         overflow: 'auto',
//                         background: '#f8fafc',
//                         borderRadius: '8px',
//                         padding: '8px'
//                       }}>
//                         {scheduleHistory.map(({ date, note, displayDate }, index) => (
//                           <div
//                             key={date}
//                             style={{
//                               padding: '12px',
//                               background: 'white',
//                               borderRadius: '8px',
//                               marginBottom: '8px',
//                               borderLeft: '4px solid #3b82f6'
//                             }}
//                           >
//                             <div style={{
//                               fontWeight: '600',
//                               color: '#1f2937',
//                               marginBottom: '4px',
//                               fontSize: '14px'
//                             }}>
//                               {displayDate}
//                             </div>
//                             <div style={{
//                               color: '#6b7280',
//                               fontSize: '13px'
//                             }}>
//                               {note}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             </>
//           )}
//         </AnimatePresence>
//       )}
//       {isMobile && notificationsOpen && (
//         <Notifications
//           isMobile={true}
//           onClose={() => setNotificationsOpen(false)}
//         />
//       )}
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
  FaCalendarAlt,
  FaBell,
  FaClock,
  FaTimes,
  FaBars,
  FaCoins,
  FaHistory,
  FaFire,
  FaTrophy,
  FaBrain,
  FaSeedling,
  FaEdit,
  FaSave,
  FaTrash,
  FaPlus
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useScreenTime } from './ScreenTime'; // Adjust path as needed
import { useNotifications } from './useNotifications'; // Add this import
import './Navbarrr.css';
import novyaLogo from '../home/assets/NOVYA LOGO.png';
import RewardPoints from './RewardPoints';
import { updateStreak, getTrophyTitle } from './streaksUtil';
import Notifications from './Notificattions';
import { BarChart, User } from 'lucide-react';

const Navbar = ({ isFullScreen }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [practiceDropdownOpen, setPracticeDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 
  const [mobileDropdowns, setMobileDropdowns] = useState({
    learn: false,
    practice: false
  });
  const [mobileLangDropdownOpen, setMobileLangDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [studyPlans, setStudyPlans] = useState([]);
 
  // ✅ Use centralized notification hook to prevent flickering
  const { unreadCount } = useNotifications();
 
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  // 🔥 Streak Tracking State
  const [streak, setStreak] = useState(0);
  const [streakTitle, setStreakTitle] = useState('');
  const [streakDropdownOpen, setStreakDropdownOpen] = useState(false);
  // 🗓️ Editable Calendar System State
  const [savedSchedules, setSavedSchedules] = useState({});
  const [scheduleInput, setScheduleInput] = useState('');
  const [editingDate, setEditingDate] = useState(null);
  const [scheduleHistory, setScheduleHistory] = useState([]);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [reminderShown, setReminderShown] = useState({});
 
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { stopGlobalSession } = useScreenTime();
 
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'ml', label: 'മലയാളം' },
  ];
 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 🕐 Indian Standard Time (IST) Helper Functions
  const getISTDate = (date = new Date()) => {
    // Convert to IST (UTC+5:30)
    return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
  };

  const getISTDateString = (date = new Date()) => {
    const istDate = getISTDate(date);
    return istDate.toISOString().split('T')[0];
  };

  const formatISTDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00+05:30'); // Set to IST timezone
    return date.toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
  };

  const isTodayIST = (date) => {
    const todayIST = getISTDateString();
    const compareDate = getISTDateString(date);
    return todayIST === compareDate;
  };

  const isFutureDateIST = (date) => {
    const todayIST = getISTDateString();
    const compareDate = getISTDateString(date);
    return compareDate >= todayIST;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🗓️ Load saved schedules from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('userSchedules');
    const shownReminders = localStorage.getItem('shownReminders');
 
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSavedSchedules(parsedData);
      updateScheduleHistory(parsedData);
    }
 
    if (shownReminders) {
      setReminderShown(JSON.parse(shownReminders));
    }
  }, []);

  // 🗓️ Update schedule history list
  const updateScheduleHistory = (schedules) => {
    const history = Object.entries(schedules)
      .map(([date, note]) => ({
        date,
        note,
        displayDate: formatISTDate(date)
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    setScheduleHistory(history);
  };

  // 🗓️ Save schedule to localStorage
  const saveSchedule = (date, note) => {
    const dateString = getISTDateString(date);
    const updatedSchedules = {
      ...savedSchedules,
      [dateString]: note.trim()
    };
 
    setSavedSchedules(updatedSchedules);
    localStorage.setItem('userSchedules', JSON.stringify(updatedSchedules));
    updateScheduleHistory(updatedSchedules);
 
    // Reset editing state
    setScheduleInput('');
    setEditingDate(null);
    setShowAddSchedule(false);
 
    // 🔔 Show reminder notification if it's today's date in IST and not already shown
    const todayIST = getISTDateString();
    if (dateString === todayIST && note.trim()) {
      showScheduleReminder(note.trim(), dateString);
    }
  };

  // 🗓️ Delete schedule
  const deleteSchedule = (date) => {
    const dateString = getISTDateString(date);
    const updatedSchedules = { ...savedSchedules };
    delete updatedSchedules[dateString];
 
    setSavedSchedules(updatedSchedules);
    localStorage.setItem('userSchedules', JSON.stringify(updatedSchedules));
    updateScheduleHistory(updatedSchedules);
    setScheduleInput('');
    setEditingDate(null);
    setShowAddSchedule(false);
  };

  // 🗓️ Show reminder notification (only once per schedule)
  const showScheduleReminder = (note, dateString) => {
    // Check if reminder was already shown for this schedule
    const reminderKey = `${dateString}_${note}`;
    if (reminderShown[reminderKey]) {
      return; // Don't show reminder again
    }
    const displayDate = formatISTDate(dateString);
 
    // Mark this reminder as shown
    const updatedReminderShown = {
      ...reminderShown,
      [reminderKey]: true
    };
    setReminderShown(updatedReminderShown);
    localStorage.setItem('shownReminders', JSON.stringify(updatedReminderShown));
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('📅 Schedule Reminder', {
        body: `You have a schedule for ${displayDate} — ${note}`,
        icon: novyaLogo
      });
    } else if (Notification.permission !== 'denied') {
      // Fallback to alert if notifications not supported
      alert(`📅 Reminder for ${displayDate}: ${note}`);
    }
  };

  // 🗓️ Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // 🗓️ Check for today's reminder on component mount (only once)
  useEffect(() => {
    const todayIST = getISTDateString();
    const todaySchedule = savedSchedules[todayIST];
 
    if (todaySchedule) {
      const reminderKey = `${todayIST}_${todaySchedule}`;
   
      // Only show reminder if it hasn't been shown before
      if (!reminderShown[reminderKey]) {
        showScheduleReminder(todaySchedule, todayIST);
      }
    }
  }, [savedSchedules, reminderShown]);

  // 🗓️ Get combined schedules and study plans for a date
  const getCombinedPlansForDate = (date) => {
    const dateString = getISTDateString(date);
    const combinedPlans = [];
    // 1. Add editable calendar schedules
    const scheduleNote = savedSchedules[dateString];
    if (scheduleNote) {
      combinedPlans.push({
        type: 'personal_schedule',
        subject: 'Personal Schedule',
        topic: scheduleNote,
        duration: 'All day',
        planTitle: 'Personal Note',
        color: '#3b82f6',
        date: dateString
      });
    }
    // 2. Add study plans from the existing system
    studyPlans.forEach(plan => {
      plan.studySessions?.forEach(session => {
        const sessionDate = session.date;
        if (sessionDate === dateString) {
          combinedPlans.push({
            type: 'study_plan',
            subject: plan.subject,
            topic: session.topic,
            duration: session.duration,
            planTitle: plan.title,
            color: '#10b981',
            date: sessionDate
          });
        }
      });
    });
    return combinedPlans;
  };

  // 🗓️ Check if date has any plans (both personal schedules and study plans)
  const shouldShowDot = (date) => {
    const dateString = getISTDateString(date);
 
    // Show dot if there are either personal schedules OR study plans
    const hasPersonalSchedule = savedSchedules[dateString];
    const hasStudyPlans = studyPlans.some(plan =>
      plan.studySessions?.some(session => session.date === dateString)
    );
 
    // Only show dot for today and future dates in IST
    return (hasPersonalSchedule || hasStudyPlans) && isFutureDateIST(date);
  };

  // 🗓️ Handle date click for viewing/editing
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateString = getISTDateString(date);
    const existingSchedule = savedSchedules[dateString];
 
    if (existingSchedule) {
      // If schedule exists, show it without editing mode
      setEditingDate(null);
      setShowAddSchedule(false);
      setScheduleInput('');
    } else {
      // If no schedule exists, don't automatically show add schedule
      setEditingDate(null);
      setShowAddSchedule(false);
      setScheduleInput('');
    }
  };

  // 🗓️ Handle add schedule button click
  const handleAddScheduleClick = (date) => {
    setSelectedDate(date);
    const dateString = getISTDateString(date);
    setEditingDate(date);
    setScheduleInput('');
    setShowAddSchedule(true);
  };

  // 🗓️ Handle edit schedule button click
  const handleEditScheduleClick = (date) => {
    setSelectedDate(date);
    const dateString = getISTDateString(date);
    setEditingDate(date);
    setScheduleInput(savedSchedules[dateString] || '');
    setShowAddSchedule(true);
  };

  // 🗓️ Handle save schedule
  const handleSaveSchedule = () => {
    if (editingDate && scheduleInput.trim()) {
      saveSchedule(editingDate, scheduleInput);
    }
  };

  // 🗓️ Handle cancel editing
  const handleCancelEdit = () => {
    setScheduleInput('');
    setEditingDate(null);
    setShowAddSchedule(false);
  };

  // 🔥 Streak Tracking Logic
  useEffect(() => {
    const streakData = updateStreak();
    setStreak(streakData.streak);
    setStreakTitle(getTrophyTitle(streakData.streak));
  }, []);

  // ✅ Simplified useEffect without notification flickering
  useEffect(() => {
    loadStudyPlans();
   
    const handleStudyPlanAdded = (event) => {
      if (event.detail && event.detail.studyPlan) {
        loadStudyPlans();
      }
    };
   
    const handleStudyPlanUpdated = () => {
      loadStudyPlans();
    };
   
    const handleStorageChange = (e) => {
      if (e.key === 'studyPlans') {
        loadStudyPlans();
      }
    };
   
    window.addEventListener('studyPlanAdded', handleStudyPlanAdded);
    window.addEventListener('studyPlanUpdated', handleStudyPlanUpdated);
    window.addEventListener('storage', handleStorageChange);
   
    return () => {
      window.removeEventListener('studyPlanAdded', handleStudyPlanAdded);
      window.removeEventListener('studyPlanUpdated', handleStudyPlanUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadStudyPlans = () => {
    try {
      const savedPlans = localStorage.getItem('studyPlans');
      if (savedPlans) {
        const plans = JSON.parse(savedPlans);
        const uniquePlans = plans.filter((plan, index, self) =>
          index === self.findIndex(p => p.id === plan.id)
        ).map(plan => ({
          ...plan,
          studySessions: (plan.studySessions || []).filter(session =>
            session && session.date && !isNaN(new Date(session.date + 'T00:00:00+05:30').getTime())
          ).map(session => {
            let normalizedDate;
            try {
              // Normalize dates to IST format
              const dateObj = new Date(session.date + 'T00:00:00+05:30');
              normalizedDate = getISTDateString(dateObj);
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
    } catch (error) {
      console.error('Error loading study plans:', error);
      setStudyPlans([]);
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
    const todayIST = getISTDateString();
    const todaysPlans = [];
 
    studyPlans.forEach(plan => {
      plan.studySessions?.forEach(session => {
        if (session.date === todayIST && !session.completed) {
          todaysPlans.push({
            ...session,
            planTitle: plan.title,
            subject: plan.subject
          });
        }
      });
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

  const isToday = (date) => {
    return isTodayIST(date);
  };

  const isSelectedDate = (date) => {
    if (!selectedDate) return false;
    const selectedDateString = getISTDateString(selectedDate);
    const compareDateString = getISTDateString(date);
    return selectedDateString === compareDateString;
  };

  // 🔥 Get Fire Color based on streak
  const getFireColor = () => {
    if (streak >= 30) return '#FFD700';
    if (streak >= 15) return '#FF6B35';
    if (streak >= 7) return '#FFA726';
    return '#FF5722';
  };

  // 🔥 Get Next Milestone Info
  const getNextMilestone = () => {
   if (streak < 7) {
    return { daysLeft: 7 - streak, title: t('steady_learner'), icon: FaSeedling };
  } else if (streak < 15) {
    return { daysLeft: 15 - streak, title: t('focused_mind'), icon: FaBrain };
  } else if (streak < 30) {
    return { daysLeft: 30 - streak, title: t('learning_legend'), icon: FaTrophy };
  } else {
    return { daysLeft: 0, title: t('max_level'), icon: FaTrophy };
  }
};

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
  }, []);

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
    setStreakDropdownOpen(false);
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
    // Stop global screen time session before logout
    stopGlobalSession();
    const rewardPointsValue = localStorage.getItem('rewardPoints');
    const rewardsHistoryValue = localStorage.getItem('rewardsHistory');
    const streakData = localStorage.getItem('learningStreak');
    const userSchedules = localStorage.getItem('userSchedules');
    const shownReminders = localStorage.getItem('shownReminders');
 
    localStorage.clear();
 
    if (rewardPointsValue) {
      localStorage.setItem('rewardPoints', rewardPointsValue);
    }
    if (rewardsHistoryValue) {
      localStorage.setItem('rewardsHistory', rewardsHistoryValue);
    }
    if (streakData) {
      localStorage.setItem('learningStreak', streakData);
    }
    if (userSchedules) {
      localStorage.setItem('userSchedules', userSchedules);
    }
    if (shownReminders) {
      localStorage.setItem('shownReminders', shownReminders);
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
          { path: '/typing-master', name: t('typing_master', 'Typing Master') },
      ],
    },
    { path: '/career', name: t('career', 'Career') },
    { path: '/study-room', name: t('studyRoom', 'Study Room') },
  ];

  if (!showNavbar) return null;
 
  const nextMilestone = getNextMilestone();
  const fireColor = getFireColor();

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="navbar-container">
     
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
       
        <div className="navbar-right">
          {!isMobile && (
            <div
              className="icon-wrapper"
              onMouseEnter={() => {
                loadStudyPlans();
                setCalendarOpen(true);
                setNotificationsOpen(false);
                setStreakDropdownOpen(false);
              }}
              onMouseLeave={(e) => {
                if (!e.relatedTarget || !(e.relatedTarget instanceof HTMLElement) ||
    !e.relatedTarget.closest('.nav-dropdown')) {
  setCalendarOpen(false);
}
              }}
            >
              <button
                className="nav-icon-btn calendar-button"
              >
                <FaCalendarAlt size={14} />
                {getTodaysStudyPlans().length > 0 && (
                  <span className="badge" style={{ width: '6px', height: '6px' }}></span>
                )}
              </button>
              <AnimatePresence>
                {calendarOpen && (
                  <motion.div
                    className="nav-dropdown calendar-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseEnter={() => setCalendarOpen(true)}
                    onMouseLeave={() => setCalendarOpen(false)}
                    style={{ width: '380px', maxHeight: '80vh', overflow: 'auto' }}
                  >
                    {/* Calendar Container */}
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      overflow: 'hidden'
                    }}>
                      {/* Calendar Header */}
                      <div style={{
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600',color:'whitesmoke' }}>
                            {t('study_calendar')}
                          </h3>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="calendar-nav-btn"
                              onClick={() => navigateMonth(-1)}
                              style={{
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                border: 'none',
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              ‹
                            </button>
                            <button
                              className="calendar-nav-btn"
                              onClick={() => navigateMonth(1)}
                              style={{
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                border: 'none',
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              ›
                            </button>
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '500', opacity: 0.9 }}>
                          {currentMonth.toLocaleDateString(i18n.language, {
                            month: "long",
                            year: "numeric",
                            timeZone: 'Asia/Kolkata'
                          })}
                        </div>
                      </div>
                      {/* Calendar Grid */}
                      <div style={{ padding: '16px 20px' }}>
                        {/* Weekdays Header */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(7, 1fr)',
                          gap: '4px',
                          marginBottom: '12px'
                        }}>
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                            <div key={day} style={{
                              textAlign: 'center',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#6b7280',
                              padding: '8px 4px'
                            }}>
                              {day}
                            </div>
                          ))}
                        </div>
                        {/* Calendar Days */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(7, 1fr)',
                          gap: '4px'
                        }}>
                          {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, index) => (
                            <div key={`empty-${index}`} style={{ height: '36px' }} />
                          ))}
                       
                          {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
                            const day = index + 1;
                            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                            const hasPlans = shouldShowDot(date);
                         
                            return (
                              <div
                                key={day}
                                className={`calendar-date ${isToday(date) ? 'today' : ''} ${isSelectedDate(date) ? 'selected' : ''}`}
                                onClick={() => handleDateClick(date)}
                                style={{
                                  position: 'relative',
                                  height: '36px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  transition: 'all 0.2s ease',
                                  background: isSelectedDate(date) ? '#3b82f6' : 'transparent',
                                  color: isSelectedDate(date) ? 'white' : isToday(date) ? '#3b82f6' : '#374151',
                                  border: isToday(date) && !isSelectedDate(date) ? '2px solid #3b82f6' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelectedDate(date)) {
                                    e.target.style.background = '#f3f4f6';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelectedDate(date)) {
                                    e.target.style.background = 'transparent';
                                  }
                                }}
                              >
                                {day}
                                {hasPlans && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      bottom: '4px',
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                      width: '4px',
                                      height: '4px',
                                      borderRadius: '50%',
                                      backgroundColor: isSelectedDate(date) ? 'white' : '#f97316'
                                    }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {/* Selected Date Plans Section */}
                      {selectedDate && (
                        <div style={{
                          borderTop: '1px solid #e5e7eb',
                          background: '#f8fafc'
                        }}>
                          <div style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#374151' }}>
                                {t('study_plans_for')} {formatISTDate(getISTDateString(selectedDate))}
                              </h4>
                            {!showAddSchedule && (
  <div style={{ display: 'flex', gap: '6px' }}>
    <button
      onClick={() => handleAddScheduleClick(selectedDate)}
      style={{
        padding: '6px 12px',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: '500'
      }}
    >
      <FaPlus size={10} />
      Add
    </button>
  </div>
)}
                               
                              {savedSchedules[getISTDateString(selectedDate)] && !showAddSchedule && (
                                <button
                                  onClick={() => handleEditScheduleClick(selectedDate)}
                                  style={{
                                    padding: '6px 12px',
                                    background: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: '500'
                                  }}
                                >
                                  <FaEdit size={10} />
                                  Edit
                                </button>
                              )}
                            </div>
                            {/* Add/Edit Schedule Form */}
                            {(showAddSchedule && editingDate && getISTDateString(editingDate) === getISTDateString(selectedDate)) && (
                              <div style={{
                                background: 'white',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                padding: '12px',
                                marginBottom: '12px'
                              }}>
                                {/* <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  marginBottom: '8px'
                                }}>
                                  <FaEdit size={12} color="#6b7280" />
                                  <h5 style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    margin: 0,
                                    color: '#374151'
                                  }}>
                                    {savedSchedules[getISTDateString(selectedDate)] ? 'Edit Schedule' : 'Add Schedule'}
                                  </h5>
                                </div> */}
                             
                                 <textarea
                                  value={scheduleInput}
                                  onChange={(e) => setScheduleInput(e.target.value)}
                                  placeholder="Add your schedule for this date..."
                                  style={{
                                    width: '100%',
                                    minHeight: '60px',
                                    padding: '8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease'
                                  }}
                                  onFocus={(e) => {
                                    e.target.style.borderColor = '#3b82f6';
                                  }}
                                  onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                  }}
                                />
                             
                                <div style={{
                                  display: 'flex',
                                  gap: '6px',
                                  marginTop: '8px'
                                }}>
                                  <button
                                    onClick={handleSaveSchedule}
                                    disabled={!scheduleInput.trim()}
                                    style={{
                                      padding: '6px 12px',
                                      background: scheduleInput.trim() ? '#3b82f6' : '#9ca3af',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: scheduleInput.trim() ? 'pointer' : 'not-allowed',
                                      fontSize: '12px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontWeight: '500'
                                    }}
                                  >
                                    <FaSave size={10} />
                                    Save
                                  </button>
                               
                                  {savedSchedules[getISTDateString(selectedDate)] && (
                                    <button
                                      onClick={() => deleteSchedule(selectedDate)}
                                      style={{
                                        padding: '6px 12px',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontWeight: '500'
                                      }}
                                    >
                                      <FaTrash size={10} />
                                      Delete
                                    </button>
                                  )}
                               
                                  <button
                                    onClick={handleCancelEdit}
                                    style={{
                                      padding: '6px 12px',
                                      background: 'transparent',
                                      color: '#6b7280',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: '500'
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}



                            {/* Plans List */}
                            {getCombinedPlansForDate(selectedDate).length === 0 ? (
                              <div style={{
                                textAlign: 'center',
                                padding: '20px',
                                color: '#6b7280',
                                fontSize: '14px'
                              }}>
                                {t('no_plans_scheduled')}
                              </div>
                            ) : (
                              <div style={{ maxHeight: '120px', overflow: 'auto' }}>
                                {getCombinedPlansForDate(selectedDate).map((plan, index) => (
  <div
    key={index}
    style={{
      background: 'white',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '8px',
      borderLeft: `4px solid ${plan.color}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }}
  >
    {/* Left side - plan details */}
    <div>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '4px'
      }}>
        {plan.subject}
      </div>
      <div style={{
        fontSize: '13px',
        color: '#4b5563',
        marginBottom: '4px'
      }}>
        {plan.topic}
      </div>
      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <FaClock size={10} />
        {plan.duration}
      </div>
      {plan.type === 'personal_schedule' && (
        <div style={{
          fontSize: '11px',
          color: '#3b82f6',
          fontStyle: 'italic',
          marginTop: '4px'
        }}>
          Personal Schedule
        </div>
      )}
    </div>

    {/* Right side - delete button */}
    {plan.type === 'personal_schedule' && (
      <button
        onClick={() => deleteSchedule(new Date(plan.date))}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#ef4444',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '6px',
          transition: 'background 0.2s ease'
        }}
        title="Delete Schedule"
        onMouseEnter={(e) => { e.target.style.background = '#fee2e2'; }}
        onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
      >
        <FaTrash size={12} />
      </button>
    )}
  </div>
))}

                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Schedule History */}
                      {scheduleHistory.length > 0 && (
                        <div style={{
                          borderTop: '1px solid #e5e7eb'
                        }}>
                          <div style={{ padding: '16px 20px' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '12px'
                            }}>
                              <FaHistory size={14} color="#6b7280" />
                              <h4 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                margin: 0,
                                color: '#374151'
                              }}>
                                Schedule History
                              </h4>
                            </div>
                         
                            <div style={{
                              maxHeight: '150px',
                              overflow: 'auto'
                            }}>
                              {scheduleHistory.map(({ date, note, displayDate }, index) => (
                                <div
                                  key={date}
                                  style={{
                                    background: 'white',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    marginBottom: '8px',
                                    borderLeft: '4px solid #3b82f6',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  <div style={{
                                    fontWeight: '600',
                                    color: '#1f2937',
                                    marginBottom: '4px',
                                    fontSize: '14px'
                                  }}>
                                    {displayDate}
                                  </div>
                                  <div style={{
                                    color: '#6b7280',
                                    fontSize: '13px'
                                  }}>
                                    {note}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
         
          {!isMobile && (
            <div
              className="icon-wrapper"
              onMouseEnter={() => {
                setNotificationsOpen(true);
                setCalendarOpen(false);
                setStreakDropdownOpen(false);
              }}
              onMouseLeave={(e) => {
                if (!e.relatedTarget || !(e.relatedTarget instanceof HTMLElement) ||
    !e.relatedTarget.closest('.nav-dropdown')) {
  setNotificationsOpen(false);
}
              }}
            >
              <button
                className="nav-icon-btn notification-button"
              >
                <FaBell size={14} />
                {/* ✅ UPDATED: Use unreadCount from centralized hook */}
                {unreadCount > 0 && (
                  <span className="badge">{unreadCount}</span>
                )}
              </button>
              <AnimatePresence>
                {notificationsOpen && (
                  <Notifications
                    isMobile={false}
                    onClose={() => setNotificationsOpen(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
         
          {!isMobile && (
            <div
              className="language-wrapper"
              onMouseEnter={() => {
                setLangDropdownOpen(true);
                setCalendarOpen(false);
                setNotificationsOpen(false);
                setStreakDropdownOpen(false);
              }}
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
                    className="nav-dropdown language-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
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
         
          <RewardPoints isMobile={isMobile} />
         
          <div
            className="streak-wrapper"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              margin: '0 8px'
            }}
          >
            <button
              className="nav-icon-btn streak-button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#000000',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#fff5f5';
                setStreakDropdownOpen(true);
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
              onClick={() => setStreakDropdownOpen(!streakDropdownOpen)}
            >
              <FaFire
                size={16}
                color={fireColor}
                style={{
                  filter: streak >= 7 ? `drop-shadow(0 0 2px ${fireColor}50)` : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
              <span style={{ color: '#000000' }}>{streak}</span>
            </button>
            <AnimatePresence>
              {streakDropdownOpen && (
                <motion.div
                  className="nav-dropdown streak-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onMouseEnter={() => setStreakDropdownOpen(true)}
                  onMouseLeave={() => setStreakDropdownOpen(false)}
                  style={{
                    width: '280px',
                    right: 0,
                    left: 'auto'
                  }}
                >
                  <div style={{ padding: '16px', background: 'linear-gradient(135deg, #fff9f0, #ffe8cc)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{
                        background: fireColor,
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        {streak}
                      </div>
                    <div>
  <div style={{ fontSize: '16px', fontWeight: '700', color: '#7c2d12' }}>
    {t('day_streak', { count: streak })}
  </div>
  <div style={{ fontSize: '14px', color: '#d97706', fontWeight: '600' }}>
    {t(streakTitle)}
  </div>
</div>
                    </div>
                    {streakTitle && (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        border: `2px solid ${fireColor}30`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#7c2d12' }}>
                          <FaTrophy color={fireColor} />
                          {streakTitle}
                        </div>
                      </div>
                    )}
                    {nextMilestone.daysLeft > 0 && (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                       <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
  {t('next_milestone')}
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
  <nextMilestone.icon size={12} color={fireColor} />
  <span>
    {nextMilestone.daysLeft} {t(nextMilestone.daysLeft === 1 ? 'day' : 'days')} {t('more_for')} {t(nextMilestone.title)}
  </span>
</div>
                      </div>
                    )}
               <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
   <span>{t('steady_learner')}</span>
    <span style={{ fontWeight: '600', color: streak >= 7 ? '#10b981' : '#9ca3af' }}>
      {streak >= 7 ? '✓' : `7 ${t('days')}`}
    </span>
  </div>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
    <span>{t('focused_mind')}</span>
    <span style={{ fontWeight: '600', color: streak >= 15 ? '#f59e0b' : '#9ca3af' }}>
      {streak >= 15 ? '✓' : `15 ${t('days')}`}
    </span>
  </div>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span>{t('learning_legend')}</span>
    <span style={{ fontWeight: '600', color: streak >= 30 ? '#d97706' : '#9ca3af' }}>
      {streak >= 30 ? '✓' : `30 ${t('days')}`}
    </span>
  </div>
</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
         
          <div
            className="avatar-wrapper"
            onMouseEnter={() => {
              setAvatarOpen(true);
              setCalendarOpen(false);
              setNotificationsOpen(false);
              setLangDropdownOpen(false);
              setStreakDropdownOpen(false);
            }}
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
                  className="nav-dropdown avatar-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onMouseEnter={() => setAvatarOpen(true)}
                  onMouseLeave={() => setAvatarOpen(false)}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', background: 'linear-gradient(135deg, #fff9e6, #fff0cc)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#744210', fontWeight: '600' }}>
                      <FaCoins size={14} color="#FFA500" />
                      <span>{t('reward_points')}: {parseInt(localStorage.getItem('rewardPoints') || '0').toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', background: '#fff5f5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#7c2d12', fontWeight: '600' }}>
                      <FaFire size={14} color={fireColor} />
                      <span>  {t("streak_label")}: {streak} {t("days_label")}</span>
                    </div>
                    {streakTitle && (
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                        {streakTitle}
                      </div>
                    )}
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
                 
 {/* ✅ Daily Summary Button */}
  <Link
    to="/daily-summary"
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
      gap: '8px',
      textDecoration: 'none',
      borderRadius: '6px',
      transition: 'background 0.2s ease'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
  >
    <BarChart fontSize="small" />
    {t("daily_summary")}
  </Link>
 
    <Link
  to="/leadership"
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
    gap: '8px',
    textDecoration: 'none',
    borderRadius: '6px',
    transition: 'background 0.2s ease'
  }}
  onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
>
  <FaTrophy fontSize="small" style={{ color: '#fbbf24' }} />
  {t('Leadership')}
</Link>
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
     
      {/* Mobile menu and other components remain the same */}
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
              {/* Mobile menu content remains the same */}
              <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={novyaLogo} alt="NOVYA Logo" style={{ height: '30px' }} />
                  <span className="logo-text" style={{ fontSize: '1.4rem' }}>NOVYA</span>
                </div>
                <button onClick={closeMobileMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b7280' }}>
                  <FaTimes />
                </button>
              </div>
              <div style={{ padding: '16px 20px', background: '#fff5f5', borderBottom: '1px solid #fed7d7', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaFire size={20} color={fireColor} />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#7c2d12' }}>
                    {streak} Day Streak
                  </div>
                  {streakTitle && (
                    <div style={{ fontSize: '14px', color: '#d97706', fontWeight: '500' }}>
                      {streakTitle}
                    </div>
                  )}
                </div>
              </div>
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
                    <span className="badge" style={{ width: '6px', height: '6px' }}></span>
                  )}
                </button>
                <button
                  className="mobile-icon-button"
                  onClick={() => {
                    setNotificationsOpen(true);
                    closeMobileMenu();
                  }}
                  style={{ position: 'relative' }}
                >
                  <FaBell size={18} />
                  <span>Alerts</span>
                  {/* ✅ UPDATED: Use unreadCount from centralized hook */}
                  {unreadCount > 0 && (
                    <span className="badge">{unreadCount}</span>
                  )}
                </button>
                <button
                  className="mobile-icon-button"
                  onClick={() => {
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
              <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb', marginTop: '20px' }}>
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
                  <span> {t('view_profile')}</span>
                </button>
               
 {/* ✅ Daily Summary Button */}
  <Link
    to="/daily-summary"
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
      gap: '8px',
      textDecoration: 'none',
      borderRadius: '6px',
      transition: 'background 0.2s ease'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
  >
    <BarChart fontSize="small" />
    {t("daily_summary")}
  </Link>
 
    <Link
  to="/leadership"
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
    gap: '8px',
    textDecoration: 'none',
    borderRadius: '6px',
    transition: 'background 0.2s ease'
  }}
  onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
>
  <FaTrophy fontSize="small" style={{ color: '#fbbf24' }} />
  {t('Leadership')}
</Link>
                <button
                  className="mobile-action-button"
                  onClick={handleLogout}
                  style={{ color: '#dc2626', borderColor: '#fecaca' }}
                >
                  <FaSignOutAlt size={14} />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
     
      {/* Mobile calendar and notifications remain the same */}
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
                style={{ width: '90vw', maxWidth: '400px' }}
              >
                {/* Mobile calendar content remains the same */}
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                }}>
                  <div className="calendar-header" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
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
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })}
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
                      const hasPlans = shouldShowDot(date);
                   
                      return (
                        <div
                          key={day}
                          className={`calendar-date ${isToday(date) ? 'today' : ''} ${isSelectedDate(date) ? 'selected' : ''} ${hasPlans ? 'has-event' : ''}`}
                          onClick={() => handleDateClick(date)}
                          style={{ position: 'relative', cursor: 'pointer' }}
                        >
                          {day}
                          {hasPlans && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '2px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '4px',
                                height: '4px',
                                borderRadius: '50%',
                                backgroundColor: '#f97316',
                                boxShadow: '0 0 1px rgba(249, 115, 22, 0.5)'
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {selectedDate && (
                    <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#374151' }}>
                          {t('study_plans_for')} {formatISTDate(getISTDateString(selectedDate))}
                        </h4>
                        {!savedSchedules[getISTDateString(selectedDate)] && !showAddSchedule && (
                          <button
                            onClick={() => handleAddScheduleClick(selectedDate)}
                            style={{
                              padding: '8px 12px',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <FaPlus size={12} />
                            {t('add_schedule')}
                          </button>
                        )}
                        {savedSchedules[getISTDateString(selectedDate)] && !showAddSchedule && (
                          <button
                            onClick={() => handleEditScheduleClick(selectedDate)}
                            style={{
                              padding: '8px 12px',
                              background: '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <FaEdit size={12} />
                            Edit
                          </button>
                        )}
                      </div>
                      {(showAddSchedule && editingDate && getISTDateString(editingDate) === getISTDateString(selectedDate)) && (
                        <div style={{
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          marginBottom: '12px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px'
                          }}>
                            <FaEdit size={14} color="#6b7280" />
                            <h5 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              margin: 0,
                              color: '#374151'
                            }}>
                              {savedSchedules[getISTDateString(selectedDate)] ? 'Edit Schedule' : 'Add Schedule'}
                            </h5>
                          </div>
                       
                          <textarea
                            value={scheduleInput}
                            onChange={(e) => setScheduleInput(e.target.value)}
                            placeholder="Add your schedule for this date..."
                            style={{
                              width: '100%',
                              minHeight: '80px',
                              padding: '10px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '14px',
                              resize: 'vertical',
                              fontFamily: 'inherit'
                            }}
                          />
                       
                          <div style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: '10px',
                            flexWrap: 'wrap'
                          }}>
                            <button
                              onClick={handleSaveSchedule}
                              disabled={!scheduleInput.trim()}
                              style={{
                                padding: '8px 16px',
                                background: scheduleInput.trim() ? '#3b82f6' : '#9ca3af',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: scheduleInput.trim() ? 'pointer' : 'not-allowed',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                flex: 1
                              }}
                            >
                              <FaSave size={12} />
                              Save
                            </button>
                         
                            {savedSchedules[getISTDateString(selectedDate)] && (
                              <button
                                onClick={() => deleteSchedule(selectedDate)}
                                style={{
                                  padding: '8px 16px',
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  flex: 1
                                }}
                              >
                                <FaTrash size={12} />
                                Delete
                              </button>
                            )}
                         
                            <button
                              onClick={handleCancelEdit}
                              style={{
                                padding: '8px 16px',
                                background: 'transparent',
                                color: '#6b7280',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                flex: 1
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                      {getCombinedPlansForDate(selectedDate).length === 0 ? (
                        <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', margin: '16px 0' }}>
                          {t('no_study_plans_scheduled')}
                        </p>
                      ) : (
                        <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                          {getCombinedPlansForDate(selectedDate).map((plan, index) => (
                            <div key={index} style={{
                              padding: '12px',
                              backgroundColor: '#f8fafc',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              borderLeft: `4px solid ${plan.color}`
                            }}>
                              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                                {plan.subject} - {plan.topic}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FaClock size={12} />
                                {plan.duration}
                              </div>
                              {plan.type === 'personal_schedule' && (
                                <div style={{ fontSize: '11px', color: '#3b82f6', fontStyle: 'italic', marginTop: '4px' }}>
                                  Personal Schedule
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {scheduleHistory.length > 0 && (
                    <div style={{
                      padding: '16px',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px'
                      }}>
                        <FaHistory size={16} color="#6b7280" />
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          margin: 0,
                          color: '#374151'
                        }}>
                          Schedule History
                        </h4>
                      </div>
                   
                      <div style={{
                        maxHeight: '200px',
                        overflow: 'auto',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        padding: '8px'
                      }}>
                        {scheduleHistory.map(({ date, note, displayDate }, index) => (
                          <div
                            key={date}
                            style={{
                              padding: '12px',
                              background: 'white',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              borderLeft: '4px solid #3b82f6'
                            }}
                          >
                            <div style={{
                              fontWeight: '600',
                              color: '#1f2937',
                              marginBottom: '4px',
                              fontSize: '14px'
                            }}>
                              {displayDate}
                            </div>
                            <div style={{
                              color: '#6b7280',
                              fontSize: '13px'
                            }}>
                              {note}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
     
      {isMobile && notificationsOpen && (
        <Notifications
          isMobile={true}
          onClose={() => setNotificationsOpen(false)}
        />
      )}
    </motion.nav>
  );
};

export default Navbar;