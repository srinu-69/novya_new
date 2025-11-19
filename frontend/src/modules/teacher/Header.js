
// import React, { useState, useEffect, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   FiBell,          
//   FiGlobe,        
//   FiMenu,
//   FiX
// } from 'react-icons/fi';

// const HeaderBar = ({ 
//   selectedSection, 
//   onMenuToggle, 
//   onSectionSelect,
//   sections = [],
//   teacherName = "Teacher"
// }) => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
//   const { t, i18n } = useTranslation();

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timeInterval);
//   }, []);

//   useEffect(() => {
//     setNotifications([
//       { id: 1, title: t('notifications.newAssignment'), message: t('notifications.assignmentMessage'), time: t('notifications.hoursAgo', { count: 2 }), read: false },
//       { id: 2, title: t('notifications.progressReport'), message: t('notifications.progressMessage'), time: t('notifications.daysAgo', { count: 1 }), read: false },
//       { id: 3, title: t('notifications.parentMeeting'), message: t('notifications.meetingMessage'), time: t('notifications.daysAgo', { count: 2 }), read: false },
//       { id: 4, title: t('notifications.attendance'), message: t('notifications.attendanceMessage'), time: t('notifications.daysAgo', { count: 2 }), read: false },
//     ]);
//   }, [i18n.language, t]);

//   const formatTime = (date) => {
//     return date.toLocaleTimeString(i18n.language, {
//       hour12: true,
//       hour: 'numeric',
//       minute: '2-digit'
//     });
//   };

//   const markNotificationAsRead = (id) => {
//     setNotifications(notifications.map(notification =>
//       notification.id === id ? { ...notification, read: true } : notification
//     ));
//   };

//   const unreadNotificationsCount = notifications.filter(n => !n.read).length;

//   const languages = [
//     { code: 'en', name: 'English', nativeName: 'English' },
//     { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
//     { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
//     { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
//     { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
//     { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
//   ];

//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);
//     setShowLanguageDropdown(false);
//     localStorage.setItem('preferredLanguage', lng);
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showNotifications && !event.target.closest('.notification-container')) {
//         setShowNotifications(false);
//       }
//       if (showLanguageDropdown && !event.target.closest('.language-container')) {
//         setShowLanguageDropdown(false);
//       }
//       if (showProfile && !event.target.closest('.user-profile-container')) {
//         setShowProfile(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showNotifications, showLanguageDropdown, showProfile]);

//   // Get section title based on current route/section
//   const getSectionTitle = () => {
//     if (!selectedSection) return 'Hello Teacher!';
    
//     const sectionMap = {
//       'dashboard': 'Hello Teacher!',
//       'attendance': t('sections.attendance'),
//       'users': t('sections.users'),
//       'progress': t('sections.progress')
//     };
    
//     return sectionMap[selectedSection] || sections.find(s => s.key === selectedSection)?.label || 'Hello Teacher 👋';
//   };

//   return (
//     <header className="top-header">
//       <div className="header-left">
//         <button
//           className="mobile-menu-btn"
//           onClick={onMenuToggle}
//         >
//           <FiMenu />
//         </button>
//         <div className="header-title">
//           <h1>{getSectionTitle()}</h1>
//         </div>
//       </div>
     
//       <div className="header-right">
//         {!isMobile && (
//           <div className="time-display">
//             <div className="current-time">{formatTime(currentTime)}</div>
//             <div className="current-date">{currentTime.toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
//           </div>
//         )}

//         <div className="header-actions">
//           {/* Language Selector */}
//           <div className="language-container">
//             <button
//               className="action-btn"
//               onClick={() => {
//                 setShowLanguageDropdown(!showLanguageDropdown);
//                 setShowNotifications(false);
//                 setShowProfile(false);
//               }}
//             >
//               <FiGlobe />
//             </button>

//             {showLanguageDropdown && (
//               <div className="language-dropdown">
//                 <div className="dropdown-header">
//                   <h3>{t('language')}</h3>
//                   <button
//                     className="close-dropdown-btn"
//                     onClick={() => setShowLanguageDropdown(false)}
//                   >
//                     <FiX />
//                   </button>
//                 </div>
//                 <div className="language-options">
//                   {languages.map(lang => (
//                     <button
//                       key={lang.code}
//                       className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
//                       onClick={() => changeLanguage(lang.code)}
//                     >
//                       <span className="language-native">{lang.nativeName}</span>
//                       <span className="language-name">({lang.name})</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Notifications */}
//           <div className="notification-container">
//             <button
//               className="action-btn"
//               onClick={() => {
//                 setShowNotifications(!showNotifications);
//                 setShowLanguageDropdown(false);
//                 setShowProfile(false);
//               }}
//             >
//               <FiBell style={{color:'black',fontSize:'20px'}} />
//               {unreadNotificationsCount > 0 && (
//                 <span className="notification-badge">{unreadNotificationsCount}</span>
//               )}
//             </button>

//             {showNotifications && (
//               <div className="notification-dropdown">
//                 <div className="dropdown-header">
//                   <h3>{t('notification')}</h3>
//                   <div className="header-actions-right">
//                     <button
//                       className="clear-all-btn"
//                       onClick={() => setNotifications([])}
//                     >
//                       {t('clear')}
//                     </button>
//                     <button
//                       className="close-dropdown-btn"
//                       onClick={() => setShowNotifications(false)}
//                     >
//                       <FiX />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="notification-list">
//                   {notifications.length > 0 ? (
//                     notifications.map(notification => (
//                       <div
//                         key={notification.id}
//                         className={`notification-item ${notification.read ? 'read' : 'unread'}`}
//                         onClick={() => markNotificationAsRead(notification.id)}
//                       >
//                         <div className="notification-content">
//                           <h4>{notification.title}</h4>
//                           <p>{notification.message}</p>
//                           <span className="notification-time">{notification.time}</span>
//                         </div>
//                         {!notification.read && <div className="unread-dot"></div>}
//                       </div>
//                     ))
//                   ) : (
//                     <p className="no-notifications">{t('No Notifications')}</p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
         
//           {/* User Profile */}
//           <div className="user-profile-container">
//             <div
//               className="user-profile"
//               onClick={() => setShowProfile(!showProfile)}
//             >
//               <img
//                 src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/d92aaad8-daf4-48e8-9313-bc4d45f82b91.png"
//                 alt="Teacher"
//                 className="profile-avatar"
//               />
//               {!isMobile && (
//                 <div className="profile-info">
//                   <span className="profile-name">{teacherName}</span>
//                 </div>
//               )}
//             </div>

//             {showProfile && (
//               <div className="profile-dropdown">
//                 <div className="dropdown-header">
//                   <h3>Teacher Profile</h3>
//                   <button
//                     className="close-dropdown-btn"
//                     onClick={() => setShowProfile(false)}
//                   >
//                     <FiX />
//                   </button>
//                 </div>
//                 <div className="profile-details">
//                   <div className="profile-avatar-large">
//                     <img
//                       src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/d92aaad8-daf4-48e8-9313-bc4d45f82b91.png"
//                       alt="Teacher"
//                     />
//                   </div>
//                   <div className="profile-info-details">
//                     <h4 className="profile-name-large">{teacherName}</h4>
//                     <p className="profile-email">teacher@school.edu</p>
//                     <p className="profile-subject">Mathematics Department</p>
//                     <p className="profile-experience">5 years experience</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .top-header {
//           background: #ffffff;
//           border-bottom: 1px solid #e2e8f0;
//           padding: 1rem 2rem;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           position: sticky;
//           top: 0;
//           z-index: 100;
//           backdrop-filter: blur(10px);
//           margin-left: 265px;
//           width: calc(100% - 280px);
//           transition: all 0.3s ease;
//           height: 80px;
//           min-height: 80px;
//           box-sizing: border-box;
//         }

//         .dark-mode .top-header {
//           background: #1e293b;
//           border-bottom: 1px solid #334155;
//         }

//         @media (max-width: 768px) {
//           .top-header {
//             padding: 0.75rem 1.5rem;
//             margin-left: 0;
//             width: 100%;
//             height: 70px;
//             min-height: 70px;
//           }
//         }

//         .header-left {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//           flex: 1;
//         }

//         .header-title h1 {
//           font-size: 2rem;
//           font-weight: 700;
//           margin: 0;
//           color: #2D5D7B;
//           line-height: 1.2;
//           letter-spacing: -0.5px;
//         }

//         .dark-mode .header-title h1 {
//           color: #2D5D7B;
//         }

//         @media (max-width: 1024px) {
//           .header-title h1 {
//             font-size: 1.8rem;
//           }
//         }

//         @media (max-width: 768px) {
//           .header-title h1 {
//             font-size: 1.6rem;
//           }
//         }

//         @media (max-width: 480px) {
//           .header-title h1 {
//             font-size: 1.4rem;
//           }
//         }

//         .header-right {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//           flex: 0 0 auto;
//         }

//         @media (max-width: 768px) {
//           .header-right {
//             gap: 1rem;
//           }
//         }

//         .time-display {
//           text-align: right;
//           padding: 0.75rem 1rem;
//           background: #f8fafc;
//           border-radius: 12px;
//           border: 1px solid #e2e8f0;
//           min-width: 160px;
//         }

//         .dark-mode .time-display {
//           background: #334155;
//           border: 1px solid #475569;
//         }

//         @media (max-width: 768px) {
//           .time-display {
//             display: none;
//           }
//         }

//         .current-time {
//           font-size: 1rem;
//           font-weight: 600;
//           color: #1e293b;
//           line-height: 1.2;
//         }

//         .dark-mode .current-time {
//           color: #e2e8f0;
//         }

//         .current-date {
//           font-size: 0.85rem;
//           color: #64748b;
//           margin-top: 4px;
//           line-height: 1.2;
//         }

//         .dark-mode .current-date {
//           color: #94a3b8;
//         }

//         .header-actions {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           position: relative;
//         }

//         @media (max-width: 768px) {
//           .header-actions {
//             gap: 0.5rem;
//           }
//         }

//        .action-btn {
//   width: 44px;
//   height: 44px;
//   border-radius: 10px;
//   border: 1px solid #134d99ff;
//   background: #ffffff;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   transition: all 0.3s ease;
//   position: relative;
//   font-size: 1.1rem;
//   color: #134d99ff;
// }


//         .dark-mode .action-btn {
//           background: #334155;
//           border: 1px solid #475569;
//           color: #e2e8f0;
//         }

//         .action-btn:hover {
//           background: #f8fafc;
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         }

//         .dark-mode .action-btn:hover {
//           background: #475569;
//         }

//         @media (max-width: 480px) {
//           .action-btn {
//             width: 40px;
//             height: 40px;
//             font-size: 1rem;
//           }
//         }

//         .notification-badge {
//           position: absolute;
//           top: -6px;
//           right: -6px;
//           background: #ef4444;
//           color: black;
//           font-size: 0.7rem;
//           padding: 2px 6px;
//           border-radius: 10px;
//           font-weight: 600;
//           min-width: 18px;
//           height: 18px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .user-profile-container {
//           position: relative;
//         }

//         .user-profile {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           padding: 0.5rem 1rem;
//           background: #f8fafc;
//           border-radius: 12px;
//           border: 1px solid #e2e8f0;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           height: 52px;
//         }

//         .dark-mode .user-profile {
//           background: #334155;
//           border: 1px solid #475569;
//         }

//         .user-profile:hover {
//           background: #e2e8f0;
//           transform: translateY(-1px);
//         }

//         .dark-mode .user-profile:hover {
//           background: #475569;
//         }

//         @media (max-width: 768px) {
//           .user-profile {
//             padding: 0.4rem 0.75rem;
//             height: 48px;
//           }
//         }

//         .profile-avatar {
//           width: 38px;
//           height: 38px;
//           border-radius: 50%;
//           object-fit: cover;
//           border: 2px solid #e2e8f0;
//         }

//         .dark-mode .profile-avatar {
//           border-color: #475569;
//         }

//         @media (max-width: 480px) {
//           .profile-avatar {
//             width: 34px;
//             height: 34px;
//           }
//         }

//         .profile-info {
//           display: flex;
//           flex-direction: column;
//         }

//         @media (max-width: 768px) {
//           .profile-info {
//             display: none;
//           }
//         }

//         .profile-name {
//           font-weight: 600;
//           font-size: 0.95rem;
//           display: block;
//           color: #1e293b;
//           line-height: 1.2;
//         }

//         .dark-mode .profile-name {
//           color: #e2e8f0;
//         }

//         /* Profile Dropdown */
//         .profile-dropdown {
//           position: absolute;
//           top: 100%;
//           right: 0;
//           background: #ffffff;
//           border: 1px solid #e2e8f0;
//           border-radius: 16px;
//           box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
//           z-index: 1000;
//           margin-top: 10px;
//           width: 300px;
//           padding: 1.25rem;
//         }

//         .dark-mode .profile-dropdown {
//           background: #1e293b;
//           border: 1px solid #334155;
//         }

//         @media (max-width: 768px) {
//           .profile-dropdown {
//             position: fixed;
//             top: 70px !important;
//             left: 1.5rem !important;
//             right: 1.5rem !important;
//             width: auto !important;
//             max-width: none !important;
//             margin-top: 0 !important;
//             z-index: 1100 !important;
//             transform: translateY(-10px);
//             animation: slideDown 0.3s ease forwards;
//           }
//         }

//         .profile-details {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           margin-bottom: 1.5rem;
//         }

//         .profile-avatar-large {
//           width: 60px;
//           height: 60px;
//           border-radius: 50%;
//           overflow: hidden;
//           border: 3px solid #e2e8f0;
//         }

//         .dark-mode .profile-avatar-large {
//           border-color: #475569;
//         }

//         .profile-avatar-large img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .profile-info-details {
//           flex: 1;
//         }

//         .profile-name-large {
//           font-size: 1.2rem;
//           font-weight: 700;
//           margin: 0 0 0.25rem 0;
//           color: #1e293b;
//         }

//         .dark-mode .profile-name-large {
//           color: #e2e8f0;
//         }

//         .profile-email,
//         .profile-subject,
//         .profile-experience {
//           font-size: 0.9rem;
//           color: #64748b;
//           margin: 0.15rem 0;
//           line-height: 1.3;
//         }

//         .dark-mode .profile-email,
//         .dark-mode .profile-subject,
//         .dark-mode .profile-experience {
//           color: #94a3b8;
//         }

//         /* Dropdown Styles */
//         .notification-container, .language-container {
//           position: relative;
//         }

//         .notification-dropdown, .language-dropdown {
//           position: absolute;
//           top: 100%;
//           right: 0;
//           background: #ffffff;
//           border: 1px solid #e2e8f0;
//           border-radius: 16px;
//           box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
//           z-index: 1000;
//           margin-top: 10px;
//         }

//         .notification-dropdown {
//           width: 380px;
//           padding: 1.25rem;
//         }

//         .language-dropdown {
//           width: 240px;
//           padding: 1.25rem;
//         }

//         .dark-mode .notification-dropdown,
//         .dark-mode .language-dropdown {
//           background: #1e293b;
//           border: 1px solid #334155;
//         }

//         /* Mobile Dropdown Positioning */
//         @media (max-width: 768px) {
//           .notification-dropdown, .language-dropdown, .profile-dropdown {
//             position: fixed;
//             top: 70px !important;
//             left: 1.5rem !important;
//             right: 1.5rem !important;
//             width: auto !important;
//             max-width: none !important;
//             margin-top: 0 !important;
//             z-index: 1100 !important;
//             transform: translateY(-10px);
//             animation: slideDown 0.3s ease forwards;
//           }
         
//           @keyframes slideDown {
//             to {
//               transform: translateY(0);
//             }
//           }
//         }

//         @media (max-width: 480px) {
//           .notification-dropdown, .language-dropdown, .profile-dropdown {
//             left: 1rem !important;
//             right: 1rem !important;
//             top: 65px !important;
//           }
         
//           .notification-dropdown {
//             width: calc(100vw - 2rem) !important;
//           }
//         }

//         .dropdown-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 1.25rem;
//           padding-bottom: 0.75rem;
//           border-bottom: 1px solid #e2e8f0;
//         }

//         .dark-mode .dropdown-header {
//           border-bottom: 1px solid #334155;
//         }

//         .dropdown-header h3 {
//           margin: 0;
//           font-size: 1.2rem;
//           font-weight: 600;
//         }

//         .header-actions-right {
//           display: flex;
//           gap: 0.75rem;
//           align-items: center;
//         }

//         .clear-all-btn {
//           background: transparent;
//           border: none;
//           color: #64748b;
//           font-size: 0.9rem;
//           cursor: pointer;
//           transition: color 0.2s ease;
//           font-weight: 500;
//         }

//         .clear-all-btn:hover {
//           color: #1e293b;
//         }

//         .dark-mode .clear-all-btn:hover {
//           color: #e2e8f0;
//         }

//         .close-dropdown-btn {
//           background: transparent;
//           border: none;
//           cursor: pointer;
//           color: #64748b;
//           font-size: 1.3rem;
//           line-height: 1;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 0;
//           transition: color 0.2s ease;
//         }

//         .close-dropdown-btn:hover {
//           color: #1e293b;
//         }

//         .dark-mode .close-dropdown-btn:hover {
//           color: #e2e8f0;
//         }

//         .notification-list {
//           max-height: 350px;
//           overflow-y: auto;
//         }

//         .notification-item {
//           display: flex;
//           justify-content: space-between;
//           padding: 1rem 0;
//           border-bottom: 1px solid #e2e8f0;
//           cursor: pointer;
//           transition: background 0.2s ease;
//         }

//         .dark-mode .notification-item {
//           border-bottom: 1px solid #334155;
//         }

//         .notification-item:hover {
//           background: #f1f5f9;
//         }

//         .dark-mode .notification-item:hover {
//           background: #334155;
//         }

//         .notification-item.unread {
//           font-weight: 600;
//         }

//         .notification-content {
//           flex: 1;
//         }

//         .notification-content h4 {
//           margin: 0 0 0.3rem 0;
//           font-size: 1rem;
//         }

//         .notification-content p {
//           margin: 0 0 0.4rem 0;
//           font-size: 0.9rem;
//           color: #64748b;
//           line-height: 1.4;
//         }

//         .dark-mode .notification-content p {
//           color: #94a3b8;
//         }

//         .notification-time {
//           font-size: 0.8rem;
//           color: #94a3b8;
//         }

//         .dark-mode .notification-time {
//           color: #cbd5e1;
//         }

//         .unread-dot {
//           width: 12px;
//           height: 12px;
//           background: #ef4444;
//           border-radius: 50%;
//           align-self: center;
//           margin-left: 0.75rem;
//         }

//         .no-notifications {
//           text-align: center;
//           font-size: 0.95rem;
//           color: #64748b;
//           padding: 1.5rem 0;
//         }

//         .dark-mode .no-notifications {
//           color: #94a3b8;
//         }

//         .language-options {
//           display: flex;
//           flex-direction: column;
//           gap: 0.75rem;
//         }

//         .language-option {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 0.9rem;
//           border: none;
//           background: transparent;
//           border-radius: 10px;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           text-align: left;
//           width: 100%;
//         }

//         .language-option:hover {
//           background: #f1f5f9;
//         }

//         .dark-mode .language-option:hover {
//           background: #334155;
//         }

//         .language-option.active {
//           background: #667eea;
//           color: white;
//         }

//         .language-native {
//           font-weight: 600;
//           font-size: 1rem;
//         }

//         .language-name {
//           font-size: 0.85rem;
//           opacity: 0.8;
//         }

//         /* Mobile Menu Button */
//         .mobile-menu-btn {
//           background: #f1f5f9;
//           border: none;
//           width: 44px;
//           height: 44px;
//           border-radius: 10px;
//           display: none;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           color: #1e293b;
//           font-size: 1.2rem;
//         }

//         .dark-mode .mobile-menu-btn {
//           background: #334155;
//           color: #e2e8f0;
//         }

//         .mobile-menu-btn:hover {
//           background: #e2e8f0;
//           transform: scale(1.05);
//         }

//         .dark-mode .mobile-menu-btn:hover {
//           background: #475569;
//         }

//         @media (max-width: 768px) {
//           .mobile-menu-btn {
//             display: flex;
//           }
//         }
//       `}</style>
//     </header>
//   );
// };

// export default HeaderBar;






// import React, { useState, useEffect, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   FiBell,          
//   FiGlobe,        
//   FiMenu,
//   FiX
// } from 'react-icons/fi';

// const HeaderBar = ({ 
//   selectedSection, 
//   onMenuToggle, 
//   onSectionSelect,
//   sections = [],
//   teacherName = "Teacher"
// }) => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
//   const { t, i18n } = useTranslation();

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timeInterval);
//   }, []);

//   useEffect(() => {
//     setNotifications([
//       { id: 1, title: t('notifications.newAssignment'), message: t('notifications.assignmentMessage'), time: t('notifications.hoursAgo', { count: 2 }), read: false },
//       { id: 2, title: t('notifications.progressReport'), message: t('notifications.progressMessage'), time: t('notifications.daysAgo', { count: 1 }), read: false },
//       { id: 3, title: t('notifications.parentMeeting'), message: t('notifications.meetingMessage'), time: t('notifications.daysAgo', { count: 2 }), read: false },
//       { id: 4, title: t('notifications.attendance'), message: t('notifications.attendanceMessage'), time: t('notifications.daysAgo', { count: 2 }), read: false },
//     ]);
//   }, [i18n.language, t]);

//   const formatTime = (date) => {
//     return date.toLocaleTimeString(i18n.language, {
//       hour12: true,
//       hour: 'numeric',
//       minute: '2-digit'
//     });
//   };

//   const markNotificationAsRead = (id) => {
//     setNotifications(notifications.map(notification =>
//       notification.id === id ? { ...notification, read: true } : notification
//     ));
//   };

//   const unreadNotificationsCount = notifications.filter(n => !n.read).length;

//   const languages = [
//     { code: 'en', name: 'English', nativeName: 'English' },
//     { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
//     { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
//     { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
//     { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
//     { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
//   ];

//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);
//     setShowLanguageDropdown(false);
//     localStorage.setItem('preferredLanguage', lng);
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showNotifications && !event.target.closest('.notification-container')) {
//         setShowNotifications(false);
//       }
//       if (showLanguageDropdown && !event.target.closest('.language-container')) {
//         setShowLanguageDropdown(false);
//       }
//       if (showProfile && !event.target.closest('.user-profile-container')) {
//         setShowProfile(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showNotifications, showLanguageDropdown, showProfile]);

//   // Get section title based on current route/section
//   const getSectionTitle = () => {
//     if (!selectedSection) return 'Hello Teacher!';
    
//     const sectionMap = {
//       'dashboard': 'Hello Teacher!',
//       'attendance': t('sections.attendance'),
//       'users': t('sections.users'),
//       'progress': t('sections.progress')
//     };
    
//     return sectionMap[selectedSection] || sections.find(s => s.key === selectedSection)?.label || 'Hello Teacher 👋';
//   };

//   return (
//     <header className="top-header">
//       <div className="header-left">
//         <button
//           className="mobile-menu-btn"
//           onClick={onMenuToggle}
//         >
//           <FiMenu />
//         </button>
//         <div className="header-title">
//           <h1>{getSectionTitle()}</h1>
//         </div>
//       </div>
     
//       <div className="header-right">
//         {!isMobile && (
//           <div className="time-display">
//             <div className="current-time">{formatTime(currentTime)}</div>
//             <div className="current-date">{currentTime.toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
//           </div>
//         )}

//         <div className="header-actions">
//           {/* Language Selector */}
//           <div className="language-container">
//             <button
//               className="action-btn"
//               onClick={() => {
//                 setShowLanguageDropdown(!showLanguageDropdown);
//                 setShowNotifications(false);
//                 setShowProfile(false);
//               }}
//               style={{ color: '#2D5D7B', fontSize: '1.4rem' }} // 👈 Make icon visible

//             >
//               <FiGlobe style={{ color: '#2D5D7B', fontSize: '1.4rem' }} />
//             </button>

//             {showLanguageDropdown && (
//               <div className="language-dropdown">
//                 <div className="dropdown-header">
//                   <h3>{t('language')}</h3>
//                   <button
//                     className="close-dropdown-btn"
//                     onClick={() => setShowLanguageDropdown(false)}
//                   >
//                     <FiX />
//                   </button>
//                 </div>
//                 <div className="language-options">
//                   {languages.map(lang => (
//                     <button
//                       key={lang.code}
//                       className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
//                       onClick={() => changeLanguage(lang.code)}
//                     >
//                       <span className="language-native">{lang.nativeName}</span>
//                       <span className="language-name">({lang.name})</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Notifications */}
//           <div className="notification-container">
//             <button
//               className="action-btn"
//               onClick={() => {
//                 setShowNotifications(!showNotifications);
//                 setShowLanguageDropdown(false);
//                 setShowProfile(false);
//               }}
//                   style={{ color: '#2D5D7B', fontSize: '1.4rem' }} // 👈 Add color + size

//             >
//               <FiBell style={{ color: '#2D5D7B', fontSize: '1.4rem' }} />
//               {unreadNotificationsCount > 0 && (
//                 <span className="notification-badge">{unreadNotificationsCount}</span>
//               )}
//             </button>

//             {showNotifications && (
//               <div className="notification-dropdown">
//                 <div className="dropdown-header">
//                   <h3>{t('notification')}</h3>
//                   <div className="header-actions-right">
//                     <button
//                       className="clear-all-btn"
//                       onClick={() => setNotifications([])}
//                     >
//                       {t('clear')}
//                     </button>
//                     <button
//                       className="close-dropdown-btn"
//                       onClick={() => setShowNotifications(false)}
//                     >
//                       <FiX />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="notification-list">
//                   {notifications.length > 0 ? (
//                     notifications.map(notification => (
//                       <div
//                         key={notification.id}
//                         className={`notification-item ${notification.read ? 'read' : 'unread'}`}
//                         onClick={() => markNotificationAsRead(notification.id)}
//                       >
//                         <div className="notification-content">
//                           <h4>{notification.title}</h4>
//                           <p>{notification.message}</p>
//                           <span className="notification-time">{notification.time}</span>
//                         </div>
//                         {!notification.read && <div className="unread-dot"></div>}
//                       </div>
//                     ))
//                   ) : (
//                     <p className="no-notifications">{t('No Notifications')}</p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
         
//           {/* User Profile */}
//           <div className="user-profile-container">
//             <div
//               className="user-profile"
//               onClick={() => setShowProfile(!showProfile)}
//             >
//               <img
//                 src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/d92aaad8-daf4-48e8-9313-bc4d45f82b91.png"
//                 alt="Teacher"
//                 className="profile-avatar"
//               />
//               {!isMobile && (
//                 <div className="profile-info">
//                   <span className="profile-name">{teacherName}</span>
//                 </div>
//               )}
//             </div>

//             {showProfile && (
//               <div className="profile-dropdown">
//                 <div className="dropdown-header">
//                   <h3>Teacher Profile</h3>
//                   <button
//                     className="close-dropdown-btn"
//                     onClick={() => setShowProfile(false)}
//                   >
//                     <FiX />
//                   </button>
//                 </div>
//                 <div className="profile-details">
//                   <div className="profile-avatar-large">
//                     <img
//                       src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/d92aaad8-daf4-48e8-9313-bc4d45f82b91.png"
//                       alt="Teacher"
//                     />
//                   </div>
//                   <div className="profile-info-details">
//                     <h4 className="profile-name-large">{teacherName}</h4>
//                     <p className="profile-email">teacher@school.edu</p>
//                     <p className="profile-subject">Mathematics Department</p>
//                     <p className="profile-experience">5 years experience</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .top-header {
//           background: #ffffff;
//           border-bottom: 1px solid #e2e8f0;
//           padding: 1rem 2rem;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           position: sticky;
//           top: 0;
//           z-index: 100;
//           backdrop-filter: blur(10px);
//           margin-left: 265px;
//           width: calc(100% - 280px);
//           transition: all 0.3s ease;
//           height: 80px;
//           min-height: 80px;
//           box-sizing: border-box;
//         }

//         .dark-mode .top-header {
//           background: #1e293b;
//           border-bottom: 1px solid #334155;
//         }

//         @media (max-width: 768px) {
//           .top-header {
//             padding: 0.75rem 1.5rem;
//             margin-left: 0;
//             width: 100%;
//             height: 70px;
//             min-height: 70px;
//           }
//         }

//         .header-left {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//           flex: 1;
//         }

//         .header-title h1 {
//           font-size: 2rem;
//           font-weight: 700;
//           margin: 0;
//           color: #2D5D7B;
//           line-height: 1.2;
//           letter-spacing: -0.5px;
//         }

//         .dark-mode .header-title h1 {
//           color: #2D5D7B;
//         }

//         @media (max-width: 1024px) {
//           .header-title h1 {
//             font-size: 1.8rem;
//           }
//         }

//         @media (max-width: 768px) {
//           .header-title h1 {
//             font-size: 1.6rem;
//           }
//         }

//         @media (max-width: 480px) {
//           .header-title h1 {
//             font-size: 1.4rem;
//           }
//         }

//         .header-right {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//           flex: 0 0 auto;
//         }

//         @media (max-width: 768px) {
//           .header-right {
//             gap: 1rem;
//           }
//         }

//         .time-display {
//           text-align: right;
//           padding: 0.75rem 1rem;
//           background: #f8fafc;
//           border-radius: 12px;
//           border: 1px solid #e2e8f0;
//           min-width: 160px;
//         }

//         .dark-mode .time-display {
//           background: #334155;
//           border: 1px solid #475569;
//         }

//         @media (max-width: 768px) {
//           .time-display {
//             display: none;
//           }
//         }

//         .current-time {
//           font-size: 1rem;
//           font-weight: 600;
//           color: #1e293b;
//           line-height: 1.2;
//         }

//         .dark-mode .current-time {
//           color: #e2e8f0;
//         }

//         .current-date {
//           font-size: 0.85rem;
//           color: #64748b;
//           margin-top: 4px;
//           line-height: 1.2;
//         }

//         .dark-mode .current-date {
//           color: #94a3b8;
//         }

//         .header-actions {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           position: relative;
//         }

//         @media (max-width: 768px) {
//           .header-actions {
//             gap: 0.5rem;
//           }
//         }

//         .action-btn {
//           width: 44px;
//           height: 44px;
//           border-radius: 10px;
//           border: 1px solid #e2e8f0;
//           background: #ffffff;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           position: relative;
//           font-size: 1.1rem;
//         }

//         .dark-mode .action-btn {
//           background: #334155;
//           border: 1px solid #475569;
//           color: #e2e8f0;
//         }

//         .action-btn:hover {
//           background: #f8fafc;
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         }

//         .dark-mode .action-btn:hover {
//           background: #475569;
//         }

//         @media (max-width: 480px) {
//           .action-btn {
//             width: 40px;
//             height: 40px;
//             font-size: 1rem;
//           }
//         }

//         .notification-badge {
//           position: absolute;
//           top: -6px;
//           right: -6px;
//           background: #ef4444;
//           color: white;
//           font-size: 0.7rem;
//           padding: 2px 6px;
//           border-radius: 10px;
//           font-weight: 600;
//           min-width: 18px;
//           height: 18px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .user-profile-container {
//           position: relative;
//         }

//         .user-profile {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           padding: 0.5rem 1rem;
//           background: #f8fafc;
//           border-radius: 12px;
//           border: 1px solid #e2e8f0;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           height: 52px;
//         }

//         .dark-mode .user-profile {
//           background: #334155;
//           border: 1px solid #475569;
//         }

//         .user-profile:hover {
//           background: #e2e8f0;
//           transform: translateY(-1px);
//         }

//         .dark-mode .user-profile:hover {
//           background: #475569;
//         }

//         @media (max-width: 768px) {
//           .user-profile {
//             padding: 0.4rem 0.75rem;
//             height: 48px;
//           }
//         }

//         .profile-avatar {
//           width: 38px;
//           height: 38px;
//           border-radius: 50%;
//           object-fit: cover;
//           border: 2px solid #e2e8f0;
//         }

//         .dark-mode .profile-avatar {
//           border-color: #475569;
//         }

//         @media (max-width: 480px) {
//           .profile-avatar {
//             width: 34px;
//             height: 34px;
//           }
//         }

//         .profile-info {
//           display: flex;
//           flex-direction: column;
//         }

//         @media (max-width: 768px) {
//           .profile-info {
//             display: none;
//           }
//         }

//         .profile-name {
//           font-weight: 600;
//           font-size: 0.95rem;
//           display: block;
//           color: #1e293b;
//           line-height: 1.2;
//         }

//         .dark-mode .profile-name {
//           color: #e2e8f0;
//         }

//         /* Profile Dropdown */
//         .profile-dropdown {
//           position: absolute;
//           top: 100%;
//           right: 0;
//           background: #ffffff;
//           border: 1px solid #e2e8f0;
//           border-radius: 16px;
//           box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
//           z-index: 1000;
//           margin-top: 10px;
//           width: 300px;
//           padding: 1.25rem;
//         }

//         .dark-mode .profile-dropdown {
//           background: #1e293b;
//           border: 1px solid #334155;
//         }

//         @media (max-width: 768px) {
//           .profile-dropdown {
//             position: fixed;
//             top: 70px !important;
//             left: 1.5rem !important;
//             right: 1.5rem !important;
//             width: auto !important;
//             max-width: none !important;
//             margin-top: 0 !important;
//             z-index: 1100 !important;
//             transform: translateY(-10px);
//             animation: slideDown 0.3s ease forwards;
//           }
//         }

//         .profile-details {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           margin-bottom: 1.5rem;
//         }

//         .profile-avatar-large {
//           width: 60px;
//           height: 60px;
//           border-radius: 50%;
//           overflow: hidden;
//           border: 3px solid #e2e8f0;
//         }

//         .dark-mode .profile-avatar-large {
//           border-color: #475569;
//         }

//         .profile-avatar-large img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .profile-info-details {
//           flex: 1;
//         }

//         .profile-name-large {
//           font-size: 1.2rem;
//           font-weight: 700;
//           margin: 0 0 0.25rem 0;
//           color: #1e293b;
//         }

//         .dark-mode .profile-name-large {
//           color: #e2e8f0;
//         }

//         .profile-email,
//         .profile-subject,
//         .profile-experience {
//           font-size: 0.9rem;
//           color: #64748b;
//           margin: 0.15rem 0;
//           line-height: 1.3;
//         }

//         .dark-mode .profile-email,
//         .dark-mode .profile-subject,
//         .dark-mode .profile-experience {
//           color: #94a3b8;
//         }

//         /* Dropdown Styles */
//         .notification-container, .language-container {
//           position: relative;
//         }

//         .notification-dropdown, .language-dropdown {
//           position: absolute;
//           top: 100%;
//           right: 0;
//           background: #ffffff;
//           border: 1px solid #e2e8f0;
//           border-radius: 16px;
//           box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
//           z-index: 1000;
//           margin-top: 10px;
//         }

//         .notification-dropdown {
//           width: 380px;
//           padding: 1.25rem;
//         }

//         .language-dropdown {
//           width: 240px;
//           padding: 1.25rem;
//         }

//         .dark-mode .notification-dropdown,
//         .dark-mode .language-dropdown {
//           background: #1e293b;
//           border: 1px solid #334155;
//         }

//         /* Mobile Dropdown Positioning */
//         @media (max-width: 768px) {
//           .notification-dropdown, .language-dropdown, .profile-dropdown {
//             position: fixed;
//             top: 70px !important;
//             left: 1.5rem !important;
//             right: 1.5rem !important;
//             width: auto !important;
//             max-width: none !important;
//             margin-top: 0 !important;
//             z-index: 1100 !important;
//             transform: translateY(-10px);
//             animation: slideDown 0.3s ease forwards;
//           }
         
//           @keyframes slideDown {
//             to {
//               transform: translateY(0);
//             }
//           }
//         }

//         @media (max-width: 480px) {
//           .notification-dropdown, .language-dropdown, .profile-dropdown {
//             left: 1rem !important;
//             right: 1rem !important;
//             top: 65px !important;
//           }
         
//           .notification-dropdown {
//             width: calc(100vw - 2rem) !important;
//           }
//         }

//         .dropdown-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 1.25rem;
//           padding-bottom: 0.75rem;
//           border-bottom: 1px solid #e2e8f0;
//         }

//         .dark-mode .dropdown-header {
//           border-bottom: 1px solid #334155;
//         }

//         .dropdown-header h3 {
//           margin: 0;
//           font-size: 1.2rem;
//           font-weight: 600;
//         }

//         .header-actions-right {
//           display: flex;
//           gap: 0.75rem;
//           align-items: center;
//         }

//         .clear-all-btn {
//           background: transparent;
//           border: none;
//           color: #64748b;
//           font-size: 0.9rem;
//           cursor: pointer;
//           transition: color 0.2s ease;
//           font-weight: 500;
//         }

//         .clear-all-btn:hover {
//           color: #1e293b;
//         }

//         .dark-mode .clear-all-btn:hover {
//           color: #e2e8f0;
//         }

//         .close-dropdown-btn {
//           background: transparent;
//           border: none;
//           cursor: pointer;
//           color: #64748b;
//           font-size: 1.3rem;
//           line-height: 1;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 0;
//           transition: color 0.2s ease;
//         }

//         .close-dropdown-btn:hover {
//           color: #1e293b;
//         }

//         .dark-mode .close-dropdown-btn:hover {
//           color: #e2e8f0;
//         }

//         .notification-list {
//           max-height: 350px;
//           overflow-y: auto;
//         }

//         .notification-item {
//           display: flex;
//           justify-content: space-between;
//           padding: 1rem 0;
//           border-bottom: 1px solid #e2e8f0;
//           cursor: pointer;
//           transition: background 0.2s ease;
//         }

//         .dark-mode .notification-item {
//           border-bottom: 1px solid #334155;
//         }

//         .notification-item:hover {
//           background: #f1f5f9;
//         }

//         .dark-mode .notification-item:hover {
//           background: #334155;
//         }

//         .notification-item.unread {
//           font-weight: 600;
//         }

//         .notification-content {
//           flex: 1;
//         }

//         .notification-content h4 {
//           margin: 0 0 0.3rem 0;
//           font-size: 1rem;
//         }

//         .notification-content p {
//           margin: 0 0 0.4rem 0;
//           font-size: 0.9rem;
//           color: #64748b;
//           line-height: 1.4;
//         }

//         .dark-mode .notification-content p {
//           color: #94a3b8;
//         }

//         .notification-time {
//           font-size: 0.8rem;
//           color: #94a3b8;
//         }

//         .dark-mode .notification-time {
//           color: #cbd5e1;
//         }

//         .unread-dot {
//           width: 12px;
//           height: 12px;
//           background: #ef4444;
//           border-radius: 50%;
//           align-self: center;
//           margin-left: 0.75rem;
//         }

//         .no-notifications {
//           text-align: center;
//           font-size: 0.95rem;
//           color: #64748b;
//           padding: 1.5rem 0;
//         }

//         .dark-mode .no-notifications {
//           color: #94a3b8;
//         }

//         .language-options {
//           display: flex;
//           flex-direction: column;
//           gap: 0.75rem;
//         }

//         .language-option {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 0.9rem;
//           border: none;
//           background: transparent;
//           border-radius: 10px;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           text-align: left;
//           width: 100%;
//         }

//         .language-option:hover {
//           background: #f1f5f9;
//         }

//         .dark-mode .language-option:hover {
//           background: #334155;
//         }

//         .language-option.active {
//           background: #667eea;
//           color: white;
//         }

//         .language-native {
//           font-weight: 600;
//           font-size: 1rem;
//         }

//         .language-name {
//           font-size: 0.85rem;
//           opacity: 0.8;
//         }

//         /* Mobile Menu Button */
//         .mobile-menu-btn {
//           background: #f1f5f9;
//           border: none;
//           width: 44px;
//           height: 44px;
//           border-radius: 10px;
//           display: none;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           color: #1e293b;
//           font-size: 1.2rem;
//         }

//         .dark-mode .mobile-menu-btn {
//           background: #334155;
//           color: #e2e8f0;
//         }

//         .mobile-menu-btn:hover {
//           background: #e2e8f0;
//           transform: scale(1.05);
//         }

//         .dark-mode .mobile-menu-btn:hover {
//           background: #475569;
//         }

//         @media (max-width: 768px) {
//           .mobile-menu-btn {
//             display: flex;
//           }
//         }
//       `}</style>
//     </header>
//   );
// };

// export default HeaderBar;













import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const HeaderBar = ({ 
  selectedSection, 
  onMenuToggle, 
  onSectionSelect,
  sections = [],
  teacherName = "Teacher"
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const { t, i18n } = useTranslation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    setNotifications([
      { id: 1, title: t('notifications.newAssignment'), message: t('notifications.assignmentMessage'), time: t('notifications.hoursAgo', { count: 2 }), read: false },
      { id: 2, title: t('notifications.progressReport'), message: t('notifications.progressMessage'), time: t('notifications.daysAgo', { count: 1 }), read: false },
      { id: 3, title: t('notifications.parentMeeting'), message: t('notifications.meetingMessage'), time: t('notifications.daysAgo', { count: 2 }), read: false },
      { id: 4, title: t('notifications.attendance'), message: t('notifications.attendanceMessage'), time: t('notifications.daysAgo', { count: 2 }), read: false },
    ]);
  }, [i18n.language, t]);

  const formatTime = (date) => {
    return date.toLocaleTimeString(i18n.language, {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLanguageDropdown(false);
    localStorage.setItem('preferredLanguage', lng);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
      if (showLanguageDropdown && !event.target.closest('.language-container')) {
        setShowLanguageDropdown(false);
      }
      if (showProfile && !event.target.closest('.user-profile-container')) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, showLanguageDropdown, showProfile]);

  // Get section title based on current route/section
  const getSectionTitle = () => {
    if (!selectedSection) return 'Hello Teacher!';
    
    const sectionMap = {
      'dashboard': 'Hello Teacher!',
      'attendance': t('sections.attendance'),
      'users': t('sections.users'),
      'progress': t('sections.progress')
    };
    
    return sectionMap[selectedSection] || sections.find(s => s.key === selectedSection)?.label || 'Hello Teacher 👋';
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={onMenuToggle}
        >
          <i className="bi bi-list"></i>
        </button>
        <div className="header-title">
          <h1>{getSectionTitle()}</h1>
        </div>
      </div>
     
      <div className="header-right">
        {!isMobile && (
          <div className="time-display">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{currentTime.toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
          </div>
        )}

        <div className="header-actions">
          {/* Language Selector */}
          <div className="language-container">
            <button
              className="action-btn"
              onClick={() => {
                setShowLanguageDropdown(!showLanguageDropdown);
                setShowNotifications(false);
                setShowProfile(false);
              }}
              style={{ color: '#2D5D7B', fontSize: '1.4rem' }}
              title="Language"
            >
              <i className="bi bi-globe2"></i>
            </button>

            {showLanguageDropdown && (
              <div className="language-dropdown">
                <div className="dropdown-header">
                  <h3>{t('language')}</h3>
                  <button
                    className="close-dropdown-btn"
                    onClick={() => setShowLanguageDropdown(false)}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
                <div className="language-options">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      <span className="language-native">{lang.nativeName}</span>
                      <span className="language-name">({lang.name})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="notification-container">
            <button
              className="action-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowLanguageDropdown(false);
                setShowProfile(false);
              }}
              style={{ color: '#2D5D7B', fontSize: '1.4rem' }}
              title="Notifications"
            >
              <i className="bi bi-bell"></i>
              {unreadNotificationsCount > 0 && (
                <span className="notification-badge">{unreadNotificationsCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="dropdown-header">
                  <h3>{t('notification')}</h3>
                  <div className="header-actions-right">
                    <button
                      className="clear-all-btn"
                      onClick={() => setNotifications([])}
                    >
                      {t('clear')}
                    </button>
                    <button
                      className="close-dropdown-btn"
                      onClick={() => setShowNotifications(false)}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                        {!notification.read && <div className="unread-dot"></div>}
                      </div>
                    ))
                  ) : (
                    <p className="no-notifications">{t('No Notifications')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
         
          {/* User Profile */}
          <div className="user-profile-container">
            <div
              className="user-profile"
              onClick={() => setShowProfile(!showProfile)}
            >
              <img
                src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/d92aaad8-daf4-48e8-9313-bc4d45f82b91.png"
                alt="Teacher"
                className="profile-avatar"
              />
              {!isMobile && (
                <div className="profile-info">
                  <span className="profile-name">{teacherName}</span>
                </div>
              )}
            </div>

            {showProfile && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <h3>Teacher Profile</h3>
                  <button
                    className="close-dropdown-btn"
                    onClick={() => setShowProfile(false)}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
                <div className="profile-details">
                  <div className="profile-avatar-large">
                    <img
                      src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/d92aaad8-daf4-48e8-9313-bc4d45f82b91.png"
                      alt="Teacher"
                    />
                  </div>
                  <div className="profile-info-details">
                    <h4 className="profile-name-large">{teacherName}</h4>
                    <p className="profile-email">teacher@school.edu</p>
                    <p className="profile-subject">Mathematics Department</p>
                    <p className="profile-experience">5 years experience</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .top-header {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
          margin-left: 265px;
          width: calc(100% - 280px);
          transition: all 0.3s ease;
          height: 80px;
          min-height: 80px;
          box-sizing: border-box;
        }

        .dark-mode .top-header {
          background: #1e293b;
          border-bottom: 1px solid #334155;
        }

        @media (max-width: 768px) {
          .top-header {
            padding: 0.75rem 1.5rem;
            margin-left: 0;
            width: 100%;
            height: 70px;
            min-height: 70px;
          }
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex: 1;
        }

        .header-title h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: #2D5D7B;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        .dark-mode .header-title h1 {
          color: #2D5D7B;
        }

        @media (max-width: 1024px) {
          .header-title h1 {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 768px) {
          .header-title h1 {
            font-size: 1.6rem;
          }
        }

        @media (max-width: 480px) {
          .header-title h1 {
            font-size: 1.4rem;
          }
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex: 0 0 auto;
        }

        @media (max-width: 768px) {
          .header-right {
            gap: 1rem;
          }
        }

        .time-display {
          text-align: right;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          min-width: 160px;
        }

        .dark-mode .time-display {
          background: #334155;
          border: 1px solid #475569;
        }

        @media (max-width: 768px) {
          .time-display {
            display: none;
          }
        }

        .current-time {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.2;
        }

        .dark-mode .current-time {
          color: #e2e8f0;
        }

        .current-date {
          font-size: 0.85rem;
          color: #64748b;
          margin-top: 4px;
          line-height: 1.2;
        }

        .dark-mode .current-date {
          color: #94a3b8;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          position: relative;
        }

        @media (max-width: 768px) {
          .header-actions {
            gap: 0.5rem;
          }
        }

        .action-btn {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          font-size: 1.1rem;
        }

        .dark-mode .action-btn {
          background: #334155;
          border: 1px solid #475569;
          color: #e2e8f0;
        }

        .action-btn:hover {
          background: #f8fafc;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .action-btn:hover {
          background: #475569;
        }

        @media (max-width: 480px) {
          .action-btn {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
        }

        .notification-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: 600;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-profile-container {
          position: relative;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.3s ease;
          height: 52px;
        }

        .dark-mode .user-profile {
          background: #334155;
          border: 1px solid #475569;
        }

        .user-profile:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }

        .dark-mode .user-profile:hover {
          background: #475569;
        }

        @media (max-width: 768px) {
          .user-profile {
            padding: 0.4rem 0.75rem;
            height: 48px;
          }
        }

        .profile-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e2e8f0;
        }

        .dark-mode .profile-avatar {
          border-color: #475569;
        }

        @media (max-width: 480px) {
          .profile-avatar {
            width: 34px;
            height: 34px;
          }
        }

        .profile-info {
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 768px) {
          .profile-info {
            display: none;
          }
        }

        .profile-name {
          font-weight: 600;
          font-size: 0.95rem;
          display: block;
          color: #1e293b;
          line-height: 1.2;
        }

        .dark-mode .profile-name {
          color: #e2e8f0;
        }

        /* Profile Dropdown */
        .profile-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          margin-top: 10px;
          width: 300px;
          padding: 1.25rem;
        }

        .dark-mode .profile-dropdown {
          background: #1e293b;
          border: 1px solid #334155;
        }

        @media (max-width: 768px) {
          .profile-dropdown {
            position: fixed;
            top: 70px !important;
            left: 1.5rem !important;
            right: 1.5rem !important;
            width: auto !important;
            max-width: none !important;
            margin-top: 0 !important;
            z-index: 1100 !important;
            transform: translateY(-10px);
            animation: slideDown 0.3s ease forwards;
          }
        }

        .profile-details {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .profile-avatar-large {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #e2e8f0;
        }

        .dark-mode .profile-avatar-large {
          border-color: #475569;
        }

        .profile-avatar-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-info-details {
          flex: 1;
        }

        .profile-name-large {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0 0.25rem 0;
          color: #1e293b;
        }

        .dark-mode .profile-name-large {
          color: #e2e8f0;
        }

        .profile-email,
        .profile-subject,
        .profile-experience {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0.15rem 0;
          line-height: 1.3;
        }

        .dark-mode .profile-email,
        .dark-mode .profile-subject,
        .dark-mode .profile-experience {
          color: #94a3b8;
        }

        /* Dropdown Styles */
        .notification-container, .language-container {
          position: relative;
        }

        .notification-dropdown, .language-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          margin-top: 10px;
        }

        .notification-dropdown {
          width: 380px;
          padding: 1.25rem;
        }

        .language-dropdown {
          width: 240px;
          padding: 1.25rem;
        }

        .dark-mode .notification-dropdown,
        .dark-mode .language-dropdown {
          background: #1e293b;
          border: 1px solid #334155;
        }

        /* Mobile Dropdown Positioning */
        @media (max-width: 768px) {
          .notification-dropdown, .language-dropdown, .profile-dropdown {
            position: fixed;
            top: 70px !important;
            left: 1.5rem !important;
            right: 1.5rem !important;
            width: auto !important;
            max-width: none !important;
            margin-top: 0 !important;
            z-index: 1100 !important;
            transform: translateY(-10px);
            animation: slideDown 0.3s ease forwards;
          }
         
          @keyframes slideDown {
            to {
              transform: translateY(0);
            }
          }
        }

        @media (max-width: 480px) {
          .notification-dropdown, .language-dropdown, .profile-dropdown {
            left: 1rem !important;
            right: 1rem !important;
            top: 65px !important;
          }
         
          .notification-dropdown {
            width: calc(100vw - 2rem) !important;
          }
        }

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .dark-mode .dropdown-header {
          border-bottom: 1px solid #334155;
        }

        .dropdown-header h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .header-actions-right {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .clear-all-btn {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 0.9rem;
          cursor: pointer;
          transition: color 0.2s ease;
          font-weight: 500;
        }

        .clear-all-btn:hover {
          color: #1e293b;
        }

        .dark-mode .clear-all-btn:hover {
          color: #e2e8f0;
        }

        .close-dropdown-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #64748b;
          font-size: 1.3rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: color 0.2s ease;
        }

        .close-dropdown-btn:hover {
          color: #1e293b;
        }

        .dark-mode .close-dropdown-btn:hover {
          color: #e2e8f0;
        }

        .notification-list {
          max-height: 350px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px solid #e2e8f0;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .dark-mode .notification-item {
          border-bottom: 1px solid #334155;
        }

        .notification-item:hover {
          background: #f1f5f9;
        }

        .dark-mode .notification-item:hover {
          background: #334155;
        }

        .notification-item.unread {
          font-weight: 600;
        }

        .notification-content {
          flex: 1;
        }

        .notification-content h4 {
          margin: 0 0 0.3rem 0;
          font-size: 1rem;
        }

        .notification-content p {
          margin: 0 0 0.4rem 0;
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.4;
        }

        .dark-mode .notification-content p {
          color: #94a3b8;
        }

        .notification-time {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .dark-mode .notification-time {
          color: #cbd5e1;
        }

        .unread-dot {
          width: 12px;
          height: 12px;
          background: #ef4444;
          border-radius: 50%;
          align-self: center;
          margin-left: 0.75rem;
        }

        .no-notifications {
          text-align: center;
          font-size: 0.95rem;
          color: #64748b;
          padding: 1.5rem 0;
        }

        .dark-mode .no-notifications {
          color: #94a3b8;
        }

        .language-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .language-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.9rem;
          border: none;
          background: transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
        }

        .language-option:hover {
          background: #f1f5f9;
        }

        .dark-mode .language-option:hover {
          background: #334155;
        }

        .language-option.active {
          background: #667eea;
          color: white;
        }

        .language-native {
          font-weight: 600;
          font-size: 1rem;
        }

        .language-name {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          background: #f1f5f9;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: none;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #1e293b;
          font-size: 1.2rem;
        }

        .dark-mode .mobile-menu-btn {
          background: #334155;
          color: #e2e8f0;
        }

        .mobile-menu-btn:hover {
          background: #e2e8f0;
          transform: scale(1.05);
        }

        .dark-mode .mobile-menu-btn:hover {
          background: #475569;
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex;
          }
        }

        /* Bootstrap Icons styling */
        .bi {
          font-size: inherit;
          color: inherit;
          vertical-align: middle;
        }

        .action-btn .bi {
          font-size: 1.4rem;
        }

        .mobile-menu-btn .bi {
          font-size: 1.2rem;
        }

        .close-dropdown-btn .bi {
          font-size: 1.3rem;
        }
      `}</style>
    </header>
  );
};

export default HeaderBar;