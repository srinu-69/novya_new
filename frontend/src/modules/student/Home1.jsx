
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { motion, useAnimation } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { FaCoins } from 'react-icons/fa';
// import './Home1.css';

// const Home1 = () => {
//   const { t } = useTranslation();

//   useEffect(() => {
//     document.title = t('dashboard.title') + " | NOVYA - Your Smart Learning Platform";
    
//     // Set session flag to indicate we just logged in
//     const justLoggedIn = sessionStorage.getItem('justLoggedIn');
//     if (justLoggedIn) {
//       setShowWelcomeCoins(true);
//       setTimeout(() => {
//         setShowWelcomeCoins(false);
//         sessionStorage.removeItem('justLoggedIn');
//       }, 3000);
//     }
//   }, [t]);

//   const navigate = useNavigate();
//   const [currentCourse, setCurrentCourse] = useState(t('dashboard.currentCourse'));
//   const [showWelcomeCoins, setShowWelcomeCoins] = useState(false);
//   const [showFeedbackCoins, setShowFeedbackCoins] = useState(false);
//   const [hasReceivedFeedbackReward, setHasReceivedFeedbackReward] = useState(false);

//   const emojis = ["😡", "😕", "😐", "😊", "🤩"];
//   const [feedbackRating, setFeedbackRating] = useState(0);
//   const [feedbackComment, setFeedbackComment] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   // MARK: UPDATED - Check if user has already received feedback reward (persistent across sessions)
//   useEffect(() => {
//     const checkFeedbackRewardStatus = () => {
//       // Get user ID from your authentication system
//       // For demo purposes, we'll use a combination of browser fingerprint and user ID
//       const userId = getUserId();
//       const feedbackRewardKey = `feedbackReward_${userId}`;
      
//       // Check if reward was already given to this user
//       const hasReceived = localStorage.getItem(feedbackRewardKey) === 'true';
//       setHasReceivedFeedbackReward(hasReceived);
//     };

//     checkFeedbackRewardStatus();
//   }, []);

//   // MARK: UPDATED - Get unique user ID that persists across sessions
//   const getUserId = () => {
//     // In a real app, you would get this from your authentication system
//     // For demo, we'll create a persistent user ID
//     let userId = localStorage.getItem('persistentUserId');
//     if (!userId) {
//       // Create a new persistent user ID
//       userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
//       localStorage.setItem('persistentUserId', userId);
//     }
//     return userId;
//   };

//   // MARK: UPDATED - Function to mark reward as given (persistent across sessions)
//   const markRewardAsGiven = () => {
//     const userId = getUserId();
//     const feedbackRewardKey = `feedbackReward_${userId}`;
//     localStorage.setItem(feedbackRewardKey, 'true');
//     setHasReceivedFeedbackReward(true);
//   };

//   // MARK: UPDATED - Function to add reward points with history tracking
//   const addRewardPointsWithHistory = (points, reason, source = 'system') => {
//     const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
//     const newPoints = currentPoints + points;
    
//     // Update points in localStorage
//     localStorage.setItem('rewardPoints', newPoints.toString());
    
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
    
//     // Dispatch event to update other components
//     window.dispatchEvent(new CustomEvent('rewardPointsUpdated', { 
//       detail: { rewardPoints: newPoints } 
//     }));
    
//     // Also dispatch storage event for cross-tab synchronization
//     window.dispatchEvent(new StorageEvent('storage', {
//       key: 'rewardPoints',
//       newValue: newPoints.toString(),
//       oldValue: currentPoints.toString()
//     }));
    
//     return historyEntry;
//   };

//   // MARK: UPDATED - Function to trigger flying coins for first feedback reward only (persistent)
//   const triggerFeedbackReward = () => {
//     // Show flying coins animation for first-time reward
//     setShowFeedbackCoins(true);
    
//     // MARK: UPDATED - Use the centralized function to add points with history
//     const rewardHistory = addRewardPointsWithHistory(20, "First feedback submission", 'feedback');
    
//     // MARK: UPDATED - Mark reward as given for this user (persistent)
//     markRewardAsGiven();
    
//     // Save feedback data
//     const feedbackData = localStorage.getItem('userFeedbackData');
//     const parsedData = feedbackData ? JSON.parse(feedbackData) : {};
//     const userFeedbackData = {
//       lastFeedbackDate: new Date().toISOString(),
//       feedbackCount: (parsedData.feedbackCount || 0) + 1,
//       totalPointsEarned: (parsedData.totalPointsEarned || 0) + 20,
//       feedbackHistory: [
//         ...(parsedData.feedbackHistory || []),
//         {
//           date: new Date().toISOString(),
//           rating: feedbackRating,
//           comment: feedbackComment,
//           pointsAwarded: 20,
//           rewardHistoryId: rewardHistory.id // Link to rewards history
//         }
//       ]
//     };
//     localStorage.setItem('userFeedbackData', JSON.stringify(userFeedbackData));
    
//     // Hide coins after animation
//     setTimeout(() => {
//       setShowFeedbackCoins(false);
//     }, 2000);

//     return true;
//   };

//   // MARK: UPDATED - Function to save feedback without reward
//   const saveFeedbackWithoutReward = () => {
//     const feedbackData = localStorage.getItem('userFeedbackData');
//     const parsedData = feedbackData ? JSON.parse(feedbackData) : {};
//     const userFeedbackData = {
//       lastFeedbackDate: new Date().toISOString(),
//       feedbackCount: (parsedData.feedbackCount || 0) + 1,
//       totalPointsEarned: parsedData.totalPointsEarned || 0,
//       feedbackHistory: [
//         ...(parsedData.feedbackHistory || []),
//         {
//           date: new Date().toISOString(),
//           rating: feedbackRating,
//           comment: feedbackComment,
//           pointsAwarded: 0 // No points for subsequent feedback
//         }
//       ]
//     };
//     localStorage.setItem('userFeedbackData', JSON.stringify(userFeedbackData));
//   };

//   const handleFeedbackSubmit = () => {
//     if (feedbackRating === 0 || feedbackComment.trim() === "") {
//       alert(t('feedback.alertMessage'));
//       return;
//     }

//     console.log("Feedback submitted:", {
//       rating: feedbackRating,
//       comment: feedbackComment,
//     });

//     setIsSubmitted(true);
    
//     // MARK: UPDATED - Check if this is the first feedback for reward (persistent check)
//     if (!hasReceivedFeedbackReward) {
//       // First feedback - give reward points with history tracking
//       const rewardGiven = triggerFeedbackReward();
//       if (rewardGiven) {
//         console.log("🎉 Reward points awarded for first feedback and added to history!");
//       }
//     } else {
//       // Subsequent feedback - save without reward
//       saveFeedbackWithoutReward();
//       console.log("📝 Feedback saved (no reward points - already received)");
//     }
//   };

//   // MARK: UPDATED - Allow changing feedback anytime
//   const handleChangeFeedback = () => {
//     setFeedbackRating(0);
//     setFeedbackComment("");
//     setIsSubmitted(false);
//   };

//   // MARK: ADDED - Function to get first feedback date for display
//   const getFirstFeedbackDate = () => {
//     const feedbackData = localStorage.getItem('userFeedbackData');
//     if (feedbackData) {
//       try {
//         const parsedData = JSON.parse(feedbackData);
//         if (parsedData.feedbackHistory && parsedData.feedbackHistory.length > 0) {
//           // Find the first feedback that earned points
//           const firstRewardFeedback = parsedData.feedbackHistory.find(
//             feedback => feedback.pointsAwarded > 0
//           );
//           if (firstRewardFeedback) {
//             return new Date(firstRewardFeedback.date).toLocaleDateString();
//           }
//         }
//       } catch (error) {
//         console.error('Error parsing feedback data:', error);
//       }
//     }
//     return null;
//   };

//   const coursesByClass = {
//     '7': [
//       { id: 1, title: t('dashboard.courses.class7.math'), progress: 65, category: t('dashboard.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
//       { id: 2, title: t('dashboard.courses.class7.physics'), progress: 45, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
//       { id: 3, title: t('dashboard.courses.class7.english'), progress: 70, category: t('dashboard.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
//       { id: 4, title: t('dashboard.courses.class7.history'), progress: 30, category: t('dashboard.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
//       { id: 5, title: t('dashboard.courses.class7.chemistry'), progress: 25, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
//       { id: 6, title: t('dashboard.courses.class7.computer'), progress: 80, category: t('dashboard.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
//     ],
//     '8': [
//       { id: 1, title: t('dashboard.courses.class8.math'), progress: 70, category: t('dashboard.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
//       { id: 2, title: t('dashboard.courses.class8.physics'), progress: 50, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
//       { id: 3, title: t('dashboard.courses.class8.english'), progress: 75, category: t('dashboard.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
//       { id: 4, title: t('dashboard.courses.class8.history'), progress: 35, category: t('dashboard.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
//       { id: 5, title: t('dashboard.courses.class8.chemistry'), progress: 30, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
//       { id: 6, title: t('dashboard.courses.class8.computer'), progress: 85, category: t('dashboard.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
//     ],
//     '9': [
//       { id: 1, title: t('dashboard.courses.class9.math'), progress: 75, category: t('dashboard.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
//       { id: 2, title: t('dashboard.courses.class9.physics'), progress: 55, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
//       { id: 3, title: t('dashboard.courses.class9.english'), progress: 80, category: t('dashboard.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
//       { id: 4, title: t('dashboard.courses.class9.history'), progress: 40, category: t('dashboard.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
//       { id: 5, title: t('dashboard.courses.class9.chemistry'), progress: 35, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
//       { id: 6, title: t('dashboard.courses.class9.computer'), progress: 90, category: t('dashboard.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
//     ],
//     '10': [
//       { id: 1, title: t('dashboard.courses.class10.math'), progress: 80, category: t('dashboard.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
//       { id: 2, title: t('dashboard.courses.class10.physics'), progress: 60, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
//       { id: 3, title: t('dashboard.courses.class10.english'), progress: 85, category: t('dashboard.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
//       { id: 4, title: t('dashboard.courses.class10.history'), progress: 45, category: t('dashboard.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
//       { id: 5, title: t('dashboard.courses.class10.chemistry'), progress: 40, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
//       { id: 6, title: t('dashboard.courses.class10.computer'), progress: 95, category: t('dashboard.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
//     ]
//   };

//   const statsByClass = {
//     '7': [
//       { value: 8, label: t('dashboard.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
//       { value: 24, label: t('dashboard.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
//       { value: 92, label: t('dashboard.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
//       { value: 15, label: t('dashboard.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
//     ],
//     '8': [
//       { value: 7, label: t('dashboard.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
//       { value: 20, label: t('dashboard.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
//       { value: 88, label: t('dashboard.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
//       { value: 12, label: t('dashboard.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
//     ],
//     '9': [
//       { value: 9, label: t('dashboard.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
//       { value: 28, label: t('dashboard.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
//       { value: 95, label: t('dashboard.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
//       { value: 18, label: t('dashboard.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
//     ],
//     '10': [
//       { value: 6, label: t('dashboard.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
//       { value: 18, label: t('dashboard.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
//       { value: 85, label: t('dashboard.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
//       { value: 10, label: t('dashboard.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
//     ]
//   };

//   const topicsByClass = {
//     '7': t('dashboard.topics.class7', { returnObjects: true }),
//     '8': t('dashboard.topics.class8', { returnObjects: true }),
//     '9': t('dashboard.topics.class9', { returnObjects: true }),
//     '10': t('dashboard.topics.class10', { returnObjects: true })
//   };

//   const [activeClass, setActiveClass] = useState('7');
//   const [allCourses, setAllCourses] = useState(coursesByClass['7']);
//   const [activeTab, setActiveTab] = useState('all');
//   const [featuredCourses, setFeaturedCourses] = useState(coursesByClass['7']);
//   const [currentProgress, setCurrentProgress] = useState(65);
//   const [learningStats, setLearningStats] = useState(statsByClass['7']);
//   const [currentTopics, setCurrentTopics] = useState(topicsByClass['7']);
//   const [isHovered, setIsHovered] = useState(null);
//   const controls = useAnimation();
//   const [ref, inView] = useInView();

//   // MARK: FIXED - Updated subject map to handle navigation properly
//   const subjectMap = {
//     [t('dashboard.categories.mathematics')]: 'Maths',
//     [t('dashboard.categories.science')]: 'Science',
//     [t('dashboard.categories.languages')]: 'English',
//     [t('dashboard.categories.socialStudies')]: 'Social',
//     [t('dashboard.categories.technology')]: 'Computer',
//   };

//   // MARK: FIXED - Function to handle navigation to specific class and subject
//   const navigateToClassSubject = (subject) => {
//     const classNumber = activeClass; // This is '7', '8', '9', or '10'
//     const subjectKey = subjectMap[subject] || subject;
    
//     // Navigate to the correct class page with the subject
//     navigate(`/learn/class${classNumber}?subject=${subjectKey}`);
//   };

//   useEffect(() => {
//     setAllCourses(coursesByClass[activeClass]);
//     setCurrentTopics(topicsByClass[activeClass]);
//     setLearningStats(statsByClass[activeClass]);
//     setCurrentCourse(coursesByClass[activeClass][0].title);
//     setCurrentProgress(coursesByClass[activeClass][0].progress);
//   }, [activeClass, t]);

//   useEffect(() => {
//     if (activeTab === 'all') {
//       setFeaturedCourses(allCourses);
//     } else if (activeTab === 'computer') {
//       setFeaturedCourses(allCourses.filter(course => course.category.toLowerCase() === t('dashboard.categories.technology').toLowerCase()));
//     } else {
//       setFeaturedCourses(allCourses.filter(course => course.category.toLowerCase().includes(activeTab.toLowerCase())));
//     }
//   }, [activeTab, allCourses, t]);

//   useEffect(() => {
//     if (inView) {
//       controls.start('visible');
//     }
//   }, [controls, inView]);

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1, delayChildren: 0.3 }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 40, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: 'spring', stiffness: 100, damping: 15 }
//     }
//   };

//   const hoverEffect = {
//     scale: 1.05,
//     boxShadow: "0 15px 30px -10px rgba(45, 93, 123, 0.4)",
//     transition: { duration: 0.3 }
//   };

//   const cardHover = {
//     scale: 1.03,
//     boxShadow: "0 20px 40px -10px rgba(45, 93, 123, 0.3)",
//     transition: { duration: 0.3 }
//   };

//   const textVariants = {
//     hidden: { opacity: 0, x: -30 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: { duration: 0.8, ease: "easeOut" }
//     }
//   };

//   const fadeIn = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { duration: 0.8 }
//     }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.15
//       }
//     }
//   };

//   const heroVariants = {
//     hidden: { opacity: 0, y: 80 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 1, ease: "easeInOut" }
//     }
//   };

//   const pulseAnimation = {
//     scale: [1, 1.05, 1],
//     transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
//   };

//   const floatAnimation = {
//     y: [0, -15, 0],
//     transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
//   };

//   const glowAnimation = {
//     boxShadow: [
//       "0 0 0 0 rgba(166, 45, 105, 0.4)",
//       "0 0 20px 10px rgba(166, 45, 105, 0)",
//       "0 0 0 0 rgba(166, 45, 105, 0.4)"
//     ],
//     transition: { duration: 3, repeat: Infinity }
//   };

//   const rotateAnimation = {
//     rotate: [0, 5, -5, 0],
//     transition: { duration: 0.5 }
//   };

//   // MARK: UPDATED - Dynamic message based on reward eligibility
//   const canReceiveReward = !hasReceivedFeedbackReward;
//   const firstFeedbackDate = getFirstFeedbackDate();

//   return (
//     <div className="home-container" style={{ position: 'relative', overflow: 'hidden' }}>
      
//       {/* Welcome Flying Coins Animation */}
//       {showWelcomeCoins && (
//         <div className="welcome-coins-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
//           {[...Array(20)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="welcome-coin"
//               initial={{ 
//                 scale: 0,
//                 opacity: 1,
//                 x: window.innerWidth / 2 - 100,
//                 y: window.innerHeight / 2 - 50
//               }}
//               animate={{
//                 scale: [0, 1, 0.8, 0],
//                 opacity: [1, 1, 1, 0],
//                 x: [
//                   window.innerWidth / 2 - 100, 
//                   Math.random() * window.innerWidth,
//                   Math.random() * window.innerWidth
//                 ],
//                 y: [
//                   window.innerHeight / 2 - 50,
//                   Math.random() * window.innerHeight / 2,
//                   Math.random() * window.innerHeight
//                 ]
//               }}
//               transition={{
//                 duration: 2.5,
//                 ease: "easeOut",
//                 delay: i * 0.08
//               }}
//               style={{
//                 position: 'absolute',
//                 fontSize: '28px',
//                 color: '#FFD700',
//                 zIndex: 9999,
//                 filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))'
//               }}
//             >
//               <FaCoins />
//             </motion.div>
//           ))}
          
       
        
//         </div>
//       )}

//       {/* MARK: UPDATED - Feedback Reward Flying Coins Animation (only for first feedback) */}
//       {showFeedbackCoins && (
//         <div className="feedback-coins-container" style={{ 
//           position: 'fixed', 
//           top: 0, 
//           left: 0, 
//           width: '100%', 
//           height: '100%', 
//           pointerEvents: 'none', 
//           zIndex: 9998 
//         }}>
//           {[...Array(15)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="feedback-coin"
//               initial={{ 
//                 scale: 0,
//                 opacity: 1,
//                 x: window.innerWidth / 2,
//                 y: window.innerHeight - 200 // Start from feedback section area
//               }}
//               animate={{
//                 scale: [0, 1, 0.8, 0],
//                 opacity: [1, 1, 1, 0],
//                 x: [
//                   window.innerWidth / 2,
//                   window.innerWidth - 100, // Fly to navbar area
//                   window.innerWidth - 100
//                 ],
//                 y: [
//                   window.innerHeight - 200,
//                   80, // End at navbar height
//                   -50
//                 ]
//               }}
//               transition={{
//                 duration: 2,
//                 ease: "easeOut",
//                 delay: i * 0.1
//               }}
//               style={{
//                 position: 'absolute',
//                 fontSize: '24px',
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
//       <motion.div
//         className="floating-shape shape-1"
//         animate={{
//           y: [0, -40, 0],
//           x: [0, 20, 0],
//           rotate: [0, 5, 0]
//         }}
//         transition={{
//           duration: 12,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       />
//       <motion.div
//         className="floating-shape shape-2"
//         animate={{
//           y: [0, 30, 0],
//           x: [0, -30, 0],
//           rotate: [0, -8, 0]
//         }}
//         transition={{
//           duration: 15,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 2
//         }}
//       />
//       <motion.div
//         className="floating-shape shape-3"
//         animate={{
//           y: [0, -20, 0],
//           x: [0, 15, 0],
//           rotate: [0, 3, 0]
//         }}
//         transition={{
//           duration: 10,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 1
//         }}
//       />

//       <motion.section
//         className="hero-section"
//         initial="hidden"
//         animate="visible"
//         variants={heroVariants}
//       >
//         <div className="container hero-content">
//           <motion.div
//             className="hero-text"
//             initial="hidden"
//             animate="visible"
//             variants={staggerContainer}
//           >
//             <motion.h2
//               variants={textVariants}
//               transition={{ duration: 0.8 }}
//             >
//               {t('dashboard.hero.title')} <span className="highlight-text">{t('dashboard.hero.highlight')}</span>
//             </motion.h2>
//             <motion.p
//               variants={textVariants}
//               transition={{ duration: 0.8, delay: 0.3 }}
//               className="hero-subtitle"
//             >
//               {t('dashboard.hero.subtitle')}
//             </motion.p>
//             <motion.div
//               variants={textVariants}
//               transition={{ duration: 0.8, delay: 0.6 }}
//               className="hero-buttons"
//             >
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 animate={controls}
//               >
//                 {/* MARK: FIXED - Updated navigation for continue learning button */}
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => navigateToClassSubject(t('dashboard.categories.mathematics'))}
//                 >
//                   {t('dashboard.hero.continueLearning')}
//                 </button>
//               </motion.div>

//               {[
//                 { value: "8", label: t('dashboard.stats.activeCourses') },
//                 { value: "92%", label: t('dashboard.stats.averageGrade') },
//                 { value: "15", label: t('dashboard.stats.assignmentsDue') }
//               ].map((stat, index) => (
//                 <motion.div
//                   className="stat-item"
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 1.4 + index * 0.2 }}
//                   whileHover={{ y: -5 }}
//                 >
//                   <div className="stat-value">{stat.value}</div>
//                   <div className="stat-label">{stat.label}</div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </motion.div>

//           <motion.div
//             className="hero-image"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1, delay: 0.5 }}
//             whileHover={pulseAnimation}
//           >
//             <motion.img
//               src="https://illustrations.popsy.co/amber/digital-nomad.svg"
//               alt={t('dashboard.hero.imageAlt')}
//               animate={floatAnimation}
//             />
//             <motion.div
//               className="hero-image-glow"
//               animate={glowAnimation}
//             />
//           </motion.div>
//         </div>
//       </motion.section>

//       <motion.main
//         className="main-content container py-5"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         ref={ref}
//       >
//         <motion.section
//           className="current-learning-section mb-5"
//           variants={itemVariants}
//         >
//           <div className="section-header">
//             <motion.h2
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               {t('dashboard.sections.currentCourse')}
//             </motion.h2>
//           </div>

//           <div className="row g-4">
//             <div className="col-lg-8">
//               <motion.div
//                 className="current-course-card p-4"
//                 whileHover={cardHover}
//                 initial={{ opacity: 0, x: -40 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3, type: 'spring' }}
//               >
//                 <div
//                   className="course-header"
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "12px",
//                     overflow: "visible"
//                   }}
//                 >
//                   <h3 style={{ margin: 0 }}>{currentCourse}</h3>
//                   <motion.span
//                     className="badge"
//                     animate={pulseAnimation}
//                     style={{
//                       fontSize: "1rem",
//                       padding: "0.3em 1.1em",
//                       lineHeight: "1.5",
//                       alignSelf: "flex-start",
//                       whiteSpace: "nowrap"
//                     }}
//                   >
//                     {t('dashboard.active')}
//                   </motion.span>
//                 </div>
//                 <div className="course-meta">
//                   <span><i className="fas fa-chalkboard-teacher"></i> {t('dashboard.instructor')}</span>
//                   <span><i className="fas fa-calendar-alt"></i> {t('dashboard.startDate')}</span>
//                 </div>
//                 <div className="progress-container mt-3">
//                   <div className="progress" style={{ height: '10px' }}>
//                     <motion.div
//                       className="progress-bar"
//                       role="progressbar"
//                       initial={{ width: 0 }}
//                       animate={{ width: `${currentProgress}%` }}
//                       transition={{ duration: 1.5, delay: 0.5, type: 'spring' }}
//                       style={{ backgroundColor: '#A62D69' }}
//                       aria-valuenow={currentProgress}
//                       aria-valuemin="0"
//                       aria-valuemax="100"
//                     ></motion.div>
//                   </div>
//                   <div className="d-flex justify-content-between mt-2">
//                     <span>{currentProgress}% {t('dashboard.complete')}</span>
//                     <span>{t('dashboard.lessonsProgress')}</span>
//                   </div>
//                 </div>
//                 <div className="course-actions mt-4">
//                   {/* MARK: FIXED - Updated navigation for view syllabus button */}
//                   <motion.button
//                     className="btn btn-outline"
//                     whileHover={{ scale: 1.03 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => navigateToClassSubject(t('dashboard.categories.mathematics'))}
//                   >
//                     {t('dashboard.viewSyllabus')}
//                   </motion.button>
//                 </div>
//                 <div className="course-highlights mt-4">
//                   <h5>{t('dashboard.currentTopics')}</h5>
//                   <ul>
//                     {Array.isArray(currentTopics) ? currentTopics.map((item, index) => (
//                       <motion.li
//                         key={index}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: 0.6 + index * 0.1 }}
//                       >
//                         <i className="fas fa-check-circle"></i> {item}
//                       </motion.li>
//                     )) : <li>{t('dashboard.noTopics')}</li>}
//                   </ul>
//                 </div>
//               </motion.div>
//             </div>

//             <div className="col-lg-4">
//               <motion.div
//                 className="stats-card p-4"
//                 whileHover={cardHover}
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4, type: 'spring' }}
//               >
//                 <h5>{t('dashboard.sections.learningStats')}</h5>
//                 <div className="stats-bargraph">
//                   {learningStats.map((stat, index) => (
//                     <div className="bargraph-item" key={index}>
//                       <div className="bargraph-label">
//                         <i className={`fas fa-${stat.icon}`}></i> {stat.label}
//                         <span className="bargraph-value">{stat.value}{stat.label === t('dashboard.stats.averageGrade') ? '%' : ''}</span>
//                       </div>
//                       <div className="bargraph-bar-bg">
//                         <div
//                           className="bargraph-bar-fill"
//                           style={{
//                             width: `${(stat.value / stat.max) * 100}%`,
//                             background: stat.color
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <motion.div
//                   className="achievement-badge mt-4"
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ delay: 1.1, type: 'spring' }}
//                   whileHover={rotateAnimation}
//                 >
//                   <i className="fas fa-trophy"></i>
//                   <span>{t('dashboard.achievement')}</span>
//                 </motion.div>
//               </motion.div>
//             </div>
//           </div>
//         </motion.section>

//         <motion.section
//           className="featured-courses mb-5"
//           variants={itemVariants}
//         >
//           <div className="section-header">
//             <h2>{t('dashboard.sections.courses')}</h2>
//             <div className="tabs">
//               {['All', 'Mathematics', 'Science', 'Languages', 'Social', 'Computer'].map((tab) => (
//                 <motion.button
//                   key={tab}
//                   className={activeTab === tab.toLowerCase() ? 'active' : ''}
//                   onClick={() => setActiveTab(tab.toLowerCase())}
//                   whileHover={{ scale: 1.05, backgroundColor: activeTab === tab.toLowerCase() ? '#1a3a4f' : '#e9ecef' }}
//                   whileTap={{ scale: 0.95 }}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                 >
//                   {t(`dashboard.tabs.${tab.toLowerCase()}`)}
//                 </motion.button>
//               ))}
//             </div>
//           </div>
//           <div className="tabs">
//             {['7', '8', '9', '10'].map((cls) => (
//               <motion.button
//                 key={cls}
//                 className={activeClass === cls ? 'active' : ''}
//                 onClick={() => setActiveClass(cls)}
//                 whileHover={{ scale: 1.05, backgroundColor: activeClass === cls ? '#1a3a4f' : '#e9ecef' }}
//                 whileTap={{ scale: 0.95 }}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 {t(`classes.${cls}th`)}
//               </motion.button>
//             ))}
//           </div>

//           <br />
//           <div className="row g-4">
//             {featuredCourses.map((course, index) => (
//               <div className="col-md-4" key={course.id}>
//                 <motion.div
//                   className="featured-course-card"
//                   whileHover={cardHover}
//                   initial={{ opacity: 0, y: 40 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1, type: 'spring' }}
//                   onHoverStart={() => setIsHovered(course.id)}
//                   onHoverEnd={() => setIsHovered(null)}
//                 >
//                   <div className="course-image">
//                     <img src={course.image} alt={course.title} />
//                     <div className="course-category">{course.category}</div>
//                     {isHovered === course.id && (
//                       <motion.div
//                         className="course-hover-overlay"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                       ></motion.div>
//                     )}
//                   </div>
//                   <div className="course-content p-4">
//                     <h3>{course.title}</h3>
//                     <div className="progress-container mt-3">
//                       <div className="progress" style={{ height: '6px' }}>
//                         <motion.div
//                           className="progress-bar"
//                           role="progressbar"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${course.progress}%` }}
//                           transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
//                           style={{ backgroundColor: '#2D5D7B' }}
//                         ></motion.div>
//                       </div>
//                       <span className="mt-2 d-block">{course.progress}% {t('dashboard.complete')}</span>
//                     </div>
//                     <div className="course-meta mt-3">
//                       <span><i className="fas fa-book-open"></i> {t('dashboard.lessons')}</span>
//                       <span><i className="fas fa-clock"></i> {t('dashboard.hours')}</span>
//                     </div>
//                     {/* MARK: FIXED - Updated navigation for continue button */}
//                     <motion.button
//                       className="btn btn-primary w-100 mt-3"
//                       whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(45, 93, 123, 0.4)" }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => navigateToClassSubject(course.category)}
//                     >
//                       {t('dashboard.continue')}
//                     </motion.button>
//                   </div>
//                 </motion.div>
//               </div>
//             ))}

//             {/* Feedback & Comment Section */}
//             <motion.section
//               style={{
//                 background: "#f8f9fb",
//                 borderRadius: "20px",
//                 padding: "40px 20px",
//                 boxShadow: "0 8px 25px rgba(0, 0, 0, 0.05)",
//                 margin: "60px 0",
//                 textAlign: "center",
//                 width: "100%"
//               }}
//               variants={itemVariants}
//               initial="hidden"
//               animate="visible"
//             >
//               <div style={{ marginBottom: "25px" }}>
//                 <h2 style={{ fontWeight: "700", color: "#2D5D7B", marginBottom: "10px" }}>
//                   {t('feedback.title')}
//                 </h2>
//                 <p style={{ color: "#555", fontSize: "16px" }}>
//                   {t('feedback.subtitle')}
//                 </p>
                
//                 {/* MARK: UPDATED - Dynamic reward message based on eligibility */}
//                 {canReceiveReward ? (
//                   <motion.div
//                     style={{
//                       background: "linear-gradient(135deg, #FFD700, #FFA500)",
//                       color: "#744210",
//                       padding: "8px 16px",
//                       borderRadius: "20px",
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: "8px",
//                       fontSize: "14px",
//                       fontWeight: "600",
//                       marginTop: "10px"
//                     }}
//                     whileHover={{ scale: 1.05 }}
//                   >
//                     <FaCoins size={16} />
//                     <span>{t('feedback.rewardMessage')}</span>
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     style={{
//                       background: "linear-gradient(135deg, #2D5D7B, #A62D69)",
//                       color: "white",
//                       padding: "8px 16px",
//                       borderRadius: "20px",
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: "8px",
//                       fontSize: "14px",
//                       fontWeight: "600",
//                       marginTop: "10px"
//                     }}
//                   >
//                     <FaCoins size={16} />
//                     <span>
//                       {t('feedback.rewardReceived')}{firstFeedbackDate && ` ${t('onDate')} ${firstFeedbackDate}`}
//                     </span>
//                   </motion.div>
//                 )}
//               </div>

//               <motion.div
//                 style={{
//                   background: "#fff",
//                   borderRadius: "20px",
//                   boxShadow: "0 5px 20px rgba(0, 0, 0, 0.08)",
//                   padding: "30px 25px",
//                   maxWidth: "600px",
//                   margin: "0 auto",
//                 }}
//                 whileHover={{ scale: 1.02 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {!isSubmitted ? (
//                   <>
//                     <h5 style={{ marginBottom: "20px", color: "#2D5D7B", fontWeight: "600" }}>
//                       {t('feedback.satisfactionQuestion')}
//                     </h5>

//                     <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px" }}>
//                       {emojis.map((emoji, index) => (
//                         <motion.span
//                           key={index}
//                           whileHover={{ scale: 1.3 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => setFeedbackRating(index + 1)}
//                           style={{
//                             fontSize: "2rem",
//                             cursor: "pointer",
//                             transform: feedbackRating === index + 1 ? "scale(1.4)" : "scale(1)",
//                             filter: feedbackRating === index + 1 ? "drop-shadow(0 0 10px rgba(166, 45, 105, 0.6))" : "none",
//                             transition: "transform 0.3s, filter 0.3s",
//                           }}
//                         >
//                           {emoji}
//                         </motion.span>
//                       ))}
//                     </div>

//                     {/* Show label only for selected emoji */}
//                     {feedbackRating > 0 && (
//                       <div style={{ marginBottom: "15px", color: "#2D5D7B", fontWeight: "600" }}>
//                         {t(`feedback.labels.${feedbackRating - 1}`)}
//                       </div>
//                     )}

//                     <textarea
//                       rows="4"
//                       placeholder={t('feedback.placeholder')}
//                       value={feedbackComment}
//                       onChange={(e) => setFeedbackComment(e.target.value)}
//                       style={{
//                         width: "100%",
//                         padding: "12px",
//                         borderRadius: "10px",
//                         border: "1px solid #ccc",
//                         outline: "none",
//                         resize: "none",
//                         fontSize: "15px",
//                         transition: "all 0.3s ease",
//                         marginBottom: "15px",
//                         boxShadow: feedbackComment.length > 0 ? "0 0 6px rgba(166, 45, 105, 0.3)" : "none",
//                       }}
//                     ></textarea>

//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={handleFeedbackSubmit}
//                       style={{
//                         width: "100%",
//                         borderRadius: "10px",
//                         padding: "12px",
//                         border: "none",
//                         background: "linear-gradient(135deg, #2D5D7B, #A62D69)",
//                         color: "white",
//                         fontWeight: "600",
//                         cursor: "pointer",
//                         fontSize: "16px",
//                       }}
//                     >
//                       {t('feedback.submit')}
//                     </motion.button>
//                   </>
//                 ) : (
//                   <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//                     <motion.div
//                       style={{
//                         padding: "12px",
//                         borderRadius: "10px",
//                         border: "none",
//                         background: "#2D5D7B",
//                         color: "#fff",
//                         fontWeight: "600",
//                         textAlign: "center"
//                       }}
//                       whileHover={{ scale: 1.02 }}
//                     >
//                       {t('feedback.submitted')}
//                     </motion.div>
                    
//                     {/* MARK: UPDATED - Show change feedback button always */}
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={handleChangeFeedback}
//                       style={{
//                         borderRadius: "10px",
//                         padding: "10px",
//                         border: "1px solid #2D5D7B",
//                         background: "transparent",
//                         color: "#2D5D7B",
//                         fontWeight: "600",
//                         cursor: "pointer",
//                         fontSize: "14px",
//                       }}
//                     >
//                       {t('feedback.changeFeedback')}
//                     </motion.button>
//                   </div>
//                 )}
//               </motion.div>
//             </motion.section>
//           </div>
//         </motion.section>
//       </motion.main>
//     </div>
//   );
// };

// export default Home1;










import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCoins } from 'react-icons/fa';
import { useQuiz } from './QuizContext'; // ADDED: Import QuizContext
import './Home1.css';

const Home1 = () => {
  const { t } = useTranslation();
  const { trackFeedbackSubmission } = useQuiz(); // ADDED: Get feedback tracking function

  useEffect(() => {
    document.title = t('dashboard.title') + " | NOVYA - Your Smart Learning Platform";
    
    // Set session flag to indicate we just logged in
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn) {
      setShowWelcomeCoins(true);
      setTimeout(() => {
        setShowWelcomeCoins(false);
        sessionStorage.removeItem('justLoggedIn');
      }, 3000);
    }
  }, [t]);

  const navigate = useNavigate();
  const [currentCourse, setCurrentCourse] = useState(t('dashboard.currentCourse'));
  const [showWelcomeCoins, setShowWelcomeCoins] = useState(false);
  const [showFeedbackCoins, setShowFeedbackCoins] = useState(false);
  const [hasReceivedFeedbackReward, setHasReceivedFeedbackReward] = useState(false);

  const emojis = ["😡", "😕", "😐", "😊", "🤩"];
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // MARK: UPDATED - Check if user has already received feedback reward (persistent across sessions)
  useEffect(() => {
    const checkFeedbackRewardStatus = () => {
      // Get user ID from your authentication system
      // For demo purposes, we'll use a combination of browser fingerprint and user ID
      const userId = getUserId();
      const feedbackRewardKey = `feedbackReward_${userId}`;
      
      // Check if reward was already given to this user
      const hasReceived = localStorage.getItem(feedbackRewardKey) === 'true';
      setHasReceivedFeedbackReward(hasReceived);
    };

    checkFeedbackRewardStatus();
  }, []);

  // MARK: UPDATED - Get unique user ID that persists across sessions
  const getUserId = () => {
    // In a real app, you would get this from your authentication system
    // For demo, we'll create a persistent user ID
    let userId = localStorage.getItem('persistentUserId');
    if (!userId) {
      // Create a new persistent user ID
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('persistentUserId', userId);
    }
    return userId;
  };

  // MARK: UPDATED - Function to mark reward as given (persistent across sessions)
  const markRewardAsGiven = () => {
    const userId = getUserId();
    const feedbackRewardKey = `feedbackReward_${userId}`;
    localStorage.setItem(feedbackRewardKey, 'true');
    setHasReceivedFeedbackReward(true);
  };

  // MARK: UPDATED - Function to add reward points with history tracking
  const addRewardPointsWithHistory = (points, reason, source = 'system') => {
    const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
    const newPoints = currentPoints + points;
    
    // Update points in localStorage
    localStorage.setItem('rewardPoints', newPoints.toString());
    
    // Add to history
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
    
    // Dispatch event to update other components
    window.dispatchEvent(new CustomEvent('rewardPointsUpdated', { 
      detail: { rewardPoints: newPoints } 
    }));
    
    // Also dispatch storage event for cross-tab synchronization
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'rewardPoints',
      newValue: newPoints.toString(),
      oldValue: currentPoints.toString()
    }));
    
    return historyEntry;
  };

  // MARK: UPDATED - Function to trigger flying coins for first feedback reward only (persistent)
  const triggerFeedbackReward = () => {
    // Show flying coins animation for first-time reward
    setShowFeedbackCoins(true);
    
    // MARK: UPDATED - Use the centralized function to add points with history
    const rewardHistory = addRewardPointsWithHistory(20, "First feedback submission", 'feedback');
    
    // MARK: UPDATED - Mark reward as given for this user (persistent)
    markRewardAsGiven();
    
    // Save feedback data
    const feedbackData = localStorage.getItem('userFeedbackData');
    const parsedData = feedbackData ? JSON.parse(feedbackData) : {};
    const userFeedbackData = {
      lastFeedbackDate: new Date().toISOString(),
      feedbackCount: (parsedData.feedbackCount || 0) + 1,
      totalPointsEarned: (parsedData.totalPointsEarned || 0) + 20,
      feedbackHistory: [
        ...(parsedData.feedbackHistory || []),
        {
          date: new Date().toISOString(),
          rating: feedbackRating,
          comment: feedbackComment,
          pointsAwarded: 20,
          rewardHistoryId: rewardHistory.id // Link to rewards history
        }
      ]
    };
    localStorage.setItem('userFeedbackData', JSON.stringify(userFeedbackData));
    
    // Hide coins after animation
    setTimeout(() => {
      setShowFeedbackCoins(false);
    }, 2000);

    return true;
  };

  // MARK: UPDATED - Function to save feedback without reward
  const saveFeedbackWithoutReward = () => {
    const feedbackData = localStorage.getItem('userFeedbackData');
    const parsedData = feedbackData ? JSON.parse(feedbackData) : {};
    const userFeedbackData = {
      lastFeedbackDate: new Date().toISOString(),
      feedbackCount: (parsedData.feedbackCount || 0) + 1,
      totalPointsEarned: parsedData.totalPointsEarned || 0,
      feedbackHistory: [
        ...(parsedData.feedbackHistory || []),
        {
          date: new Date().toISOString(),
          rating: feedbackRating,
          comment: feedbackComment,
          pointsAwarded: 0 // No points for subsequent feedback
        }
      ]
    };
    localStorage.setItem('userFeedbackData', JSON.stringify(userFeedbackData));
  };

  // NEW: Function to track feedback as learning activity
  const trackFeedbackActivity = () => {
    const feedbackData = {
      title: 'Platform Feedback Submission',
      rating: feedbackRating,
      comment: feedbackComment.substring(0, 50) + (feedbackComment.length > 50 ? '...' : ''), // Truncate long comments
      rewardPoints: hasReceivedFeedbackReward ? 0 : 20, // Only reward points for first feedback
      duration: 5, // Quick activity
      subject: 'Platform',
      chapter: 'Feedback',
      activityType: 'feedback'
    };

    // Track the feedback activity
    trackFeedbackSubmission(feedbackData);
    console.log('📝 Feedback activity tracked in learning history');
  };

  const handleFeedbackSubmit = () => {
    if (feedbackRating === 0 || feedbackComment.trim() === "") {
      alert(t('feedback.alertMessage'));
      return;
    }

    console.log("Feedback submitted:", {
      rating: feedbackRating,
      comment: feedbackComment,
    });

    setIsSubmitted(true);
    
    // NEW: Track feedback as learning activity (ALWAYS track, regardless of reward)
    trackFeedbackActivity();
    
    // MARK: UPDATED - Check if this is the first feedback for reward (persistent check)
    if (!hasReceivedFeedbackReward) {
      // First feedback - give reward points with history tracking
      const rewardGiven = triggerFeedbackReward();
      if (rewardGiven) {
        console.log("🎉 Reward points awarded for first feedback and added to history!");
      }
    } else {
      // Subsequent feedback - save without reward
      saveFeedbackWithoutReward();
      console.log("📝 Feedback saved (no reward points - already received)");
    }
  };

  // MARK: UPDATED - Allow changing feedback anytime
  const handleChangeFeedback = () => {
    setFeedbackRating(0);
    setFeedbackComment("");
    setIsSubmitted(false);
  };

  // MARK: ADDED - Function to get first feedback date for display
  const getFirstFeedbackDate = () => {
    const feedbackData = localStorage.getItem('userFeedbackData');
    if (feedbackData) {
      try {
        const parsedData = JSON.parse(feedbackData);
        if (parsedData.feedbackHistory && parsedData.feedbackHistory.length > 0) {
          // Find the first feedback that earned points
          const firstRewardFeedback = parsedData.feedbackHistory.find(
            feedback => feedback.pointsAwarded > 0
          );
          if (firstRewardFeedback) {
            return new Date(firstRewardFeedback.date).toLocaleDateString();
          }
        }
      } catch (error) {
        console.error('Error parsing feedback data:', error);
      }
    }
    return null;
  };

  const coursesByClass = {
    '7': [
      { id: 1, title: t('dashboard.courses.class7.math'), progress: 65, category: t('dashboard.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
      { id: 2, title: t('dashboard.courses.class7.physics'), progress: 45, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
      { id: 3, title: t('dashboard.courses.class7.english'), progress: 70, category: t('dashboard.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
      { id: 4, title: t('dashboard.courses.class7.history'), progress: 30, category: t('dashboard.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
      { id: 5, title: t('dashboard.courses.class7.chemistry'), progress: 25, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
      { id: 6, title: t('dashboard.courses.class7.computer'), progress: 80, category: t('dashboard.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
    ],
    '8': [
      { id: 1, title: t('dashboard.courses.class8.math'), progress: 70, category: t('dashboard.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
      { id: 2, title: t('dashboard.courses.class8.physics'), progress: 50, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
      { id: 3, title: t('dashboard.courses.class8.english'), progress: 75, category: t('dashboard.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
      { id: 4, title: t('dashboard.courses.class8.history'), progress: 35, category: t('dashboard.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
      { id: 5, title: t('dashboard.courses.class8.chemistry'), progress: 30, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
      { id: 6, title: t('dashboard.courses.class8.computer'), progress: 85, category: t('dashboard.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
    ],
    '9': [
      { id: 1, title: t('dashboard.courses.class9.math'), progress: 75, category: t('dashboard.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
      { id: 2, title: t('dashboard.courses.class9.physics'), progress: 55, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
      { id: 3, title: t('dashboard.courses.class9.english'), progress: 80, category: t('dashboard.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
      { id: 4, title: t('dashboard.courses.class9.history'), progress: 40, category: t('dashboard.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
      { id: 5, title: t('dashboard.courses.class9.chemistry'), progress: 35, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
      { id: 6, title: t('dashboard.courses.class9.computer'), progress: 90, category: t('dashboard.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
    ],
    '10': [
      { id: 1, title: t('dashboard.courses.class10.math'), progress: 80, category: t('dashboard.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
      { id: 2, title: t('dashboard.courses.class10.physics'), progress: 60, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
      { id: 3, title: t('dashboard.courses.class10.english'), progress: 85, category: t('dashboard.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
      { id: 4, title: t('dashboard.courses.class10.history'), progress: 45, category: t('dashboard.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
      { id: 5, title: t('dashboard.courses.class10.chemistry'), progress: 40, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
      { id: 6, title: t('dashboard.courses.class10.computer'), progress: 95, category: t('dashboard.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
    ]
  };

  const statsByClass = {
    '7': [
      { value: 8, label: t('dashboard.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
      { value: 24, label: t('dashboard.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
      { value: 92, label: t('dashboard.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
      { value: 15, label: t('dashboard.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
    ],
    '8': [
      { value: 7, label: t('dashboard.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
      { value: 20, label: t('dashboard.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
      { value: 88, label: t('dashboard.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
      { value: 12, label: t('dashboard.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
    ],
    '9': [
      { value: 9, label: t('dashboard.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
      { value: 28, label: t('dashboard.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
      { value: 95, label: t('dashboard.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
      { value: 18, label: t('dashboard.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
    ],
    '10': [
      { value: 6, label: t('dashboard.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
      { value: 18, label: t('dashboard.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
      { value: 85, label: t('dashboard.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
      { value: 10, label: t('dashboard.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
    ]
  };

  const topicsByClass = {
    '7': t('dashboard.topics.class7', { returnObjects: true }),
    '8': t('dashboard.topics.class8', { returnObjects: true }),
    '9': t('dashboard.topics.class9', { returnObjects: true }),
    '10': t('dashboard.topics.class10', { returnObjects: true })
  };

  const [activeClass, setActiveClass] = useState('7');
  const [allCourses, setAllCourses] = useState(coursesByClass['7']);
  const [activeTab, setActiveTab] = useState('all');
  const [featuredCourses, setFeaturedCourses] = useState(coursesByClass['7']);
  const [currentProgress, setCurrentProgress] = useState(65);
  const [learningStats, setLearningStats] = useState(statsByClass['7']);
  const [currentTopics, setCurrentTopics] = useState(topicsByClass['7']);
  const [isHovered, setIsHovered] = useState(null);
  const controls = useAnimation();
  const [ref, inView] = useInView();

  // MARK: FIXED - Updated subject map to handle navigation properly
  const subjectMap = {
    [t('dashboard.categories.mathematics')]: 'Maths',
    [t('dashboard.categories.science')]: 'Science',
    [t('dashboard.categories.languages')]: 'English',
    [t('dashboard.categories.socialStudies')]: 'Social',
    [t('dashboard.categories.technology')]: 'Computer',
  };

  // MARK: FIXED - Function to handle navigation to specific class and subject
  const navigateToClassSubject = (subject) => {
    const classNumber = activeClass; // This is '7', '8', '9', or '10'
    const subjectKey = subjectMap[subject] || subject;
    
    // Navigate to the correct class page with the subject
    navigate(`/learn/class${classNumber}?subject=${subjectKey}`);
  };

  useEffect(() => {
    setAllCourses(coursesByClass[activeClass]);
    setCurrentTopics(topicsByClass[activeClass]);
    setLearningStats(statsByClass[activeClass]);
    setCurrentCourse(coursesByClass[activeClass][0].title);
    setCurrentProgress(coursesByClass[activeClass][0].progress);
  }, [activeClass, t]);

  useEffect(() => {
    if (activeTab === 'all') {
      setFeaturedCourses(allCourses);
    } else if (activeTab === 'computer') {
      setFeaturedCourses(allCourses.filter(course => course.category.toLowerCase() === t('dashboard.categories.technology').toLowerCase()));
    } else {
      setFeaturedCourses(allCourses.filter(course => course.category.toLowerCase().includes(activeTab.toLowerCase())));
    }
  }, [activeTab, allCourses, t]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const hoverEffect = {
    scale: 1.05,
    boxShadow: "0 15px 30px -10px rgba(45, 93, 123, 0.4)",
    transition: { duration: 0.3 }
  };

  const cardHover = {
    scale: 1.03,
    boxShadow: "0 20px 40px -10px rgba(45, 93, 123, 0.3)",
    transition: { duration: 0.3 }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeInOut" }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
  };

  const floatAnimation = {
    y: [0, -15, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  };

  const glowAnimation = {
    boxShadow: [
      "0 0 0 0 rgba(166, 45, 105, 0.4)",
      "0 0 20px 10px rgba(166, 45, 105, 0)",
      "0 0 0 0 rgba(166, 45, 105, 0.4)"
    ],
    transition: { duration: 3, repeat: Infinity }
  };

  const rotateAnimation = {
    rotate: [0, 5, -5, 0],
    transition: { duration: 0.5 }
  };

  // MARK: UPDATED - Dynamic message based on reward eligibility
  const canReceiveReward = !hasReceivedFeedbackReward;
  const firstFeedbackDate = getFirstFeedbackDate();

  return (
    <div className="home-container" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Welcome Flying Coins Animation */}
      {showWelcomeCoins && (
        <div className="welcome-coins-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="welcome-coin"
              initial={{ 
                scale: 0,
                opacity: 1,
                x: window.innerWidth / 2 - 100,
                y: window.innerHeight / 2 - 50
              }}
              animate={{
                scale: [0, 1, 0.8, 0],
                opacity: [1, 1, 1, 0],
                x: [
                  window.innerWidth / 2 - 100, 
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth
                ],
                y: [
                  window.innerHeight / 2 - 50,
                  Math.random() * window.innerHeight / 2,
                  Math.random() * window.innerHeight
                ]
              }}
              transition={{
                duration: 2.5,
                ease: "easeOut",
                delay: i * 0.08
              }}
              style={{
                position: 'absolute',
                fontSize: '28px',
                color: '#FFD700',
                zIndex: 9999,
                filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))'
              }}
            >
              <FaCoins />
            </motion.div>
          ))}
        </div>
      )}

      {/* MARK: UPDATED - Feedback Reward Flying Coins Animation (only for first feedback) */}
      {showFeedbackCoins && (
        <div className="feedback-coins-container" style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none', 
          zIndex: 9998 
        }}>
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="feedback-coin"
              initial={{ 
                scale: 0,
                opacity: 1,
                x: window.innerWidth / 2,
                y: window.innerHeight - 200 // Start from feedback section area
              }}
              animate={{
                scale: [0, 1, 0.8, 0],
                opacity: [1, 1, 1, 0],
                x: [
                  window.innerWidth / 2,
                  window.innerWidth - 100, // Fly to navbar area
                  window.innerWidth - 100
                ],
                y: [
                  window.innerHeight - 200,
                  80, // End at navbar height
                  -50
                ]
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
                delay: i * 0.1
              }}
              style={{
                position: 'absolute',
                fontSize: '24px',
                color: '#FFD700',
                zIndex: 9998,
                filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))'
              }}
            >
              <FaCoins />
            </motion.div>
          ))}
        </div>
      )}
      <motion.div
        className="floating-shape shape-1"
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="floating-shape shape-2"
        animate={{
          y: [0, 30, 0],
          x: [0, -30, 0],
          rotate: [0, -8, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="floating-shape shape-3"
        animate={{
          y: [0, -20, 0],
          x: [0, 15, 0],
          rotate: [0, 3, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <motion.section
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="container hero-content">
          <motion.div
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h2
              variants={textVariants}
              transition={{ duration: 0.8 }}
            >
              {t('dashboard.hero.title')} <span className="highlight-text">{t('dashboard.hero.highlight')}</span>
            </motion.h2>
            <motion.p
              variants={textVariants}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hero-subtitle"
            >
              {t('dashboard.hero.subtitle')}
            </motion.p>
            <motion.div
              variants={textVariants}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hero-buttons"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={controls}
              >
                {/* MARK: FIXED - Updated navigation for continue learning button */}
                <button
                  className="btn btn-primary"
                  onClick={() => navigateToClassSubject(t('dashboard.categories.mathematics'))}
                >
                  {t('dashboard.hero.continueLearning')}
                </button>
              </motion.div>

              {[
                { value: "8", label: t('dashboard.stats.activeCourses') },
                { value: "92%", label: t('dashboard.stats.averageGrade') },
                { value: "15", label: t('dashboard.stats.assignmentsDue') }
              ].map((stat, index) => (
                <motion.div
                  className="stat-item"
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            whileHover={pulseAnimation}
          >
            <motion.img
              src="https://illustrations.popsy.co/amber/digital-nomad.svg"
              alt={t('dashboard.hero.imageAlt')}
              animate={floatAnimation}
            />
            <motion.div
              className="hero-image-glow"
              animate={glowAnimation}
            />
          </motion.div>
        </div>
      </motion.section>

      <motion.main
        className="main-content container py-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        ref={ref}
      >
        <motion.section
          className="current-learning-section mb-5"
          variants={itemVariants}
        >
          <div className="section-header">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t('dashboard.sections.currentCourse')}
            </motion.h2>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <motion.div
                className="current-course-card p-4"
                whileHover={cardHover}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <div
                  className="course-header"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    overflow: "visible"
                  }}
                >
                  <h3 style={{ margin: 0 }}>{currentCourse}</h3>
                  <motion.span
                    className="badge"
                    animate={pulseAnimation}
                    style={{
                      fontSize: "1rem",
                      padding: "0.3em 1.1em",
                      lineHeight: "1.5",
                      alignSelf: "flex-start",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {t('dashboard.active')}
                  </motion.span>
                </div>
                <div className="course-meta">
                  <span><i className="fas fa-chalkboard-teacher"></i> {t('dashboard.instructor')}</span>
                  <span><i className="fas fa-calendar-alt"></i> {t('dashboard.startDate')}</span>
                </div>
                <div className="progress-container mt-3">
                  <div className="progress" style={{ height: '10px' }}>
                    <motion.div
                      className="progress-bar"
                      role="progressbar"
                      initial={{ width: 0 }}
                      animate={{ width: `${currentProgress}%` }}
                      transition={{ duration: 1.5, delay: 0.5, type: 'spring' }}
                      style={{ backgroundColor: '#A62D69' }}
                      aria-valuenow={currentProgress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></motion.div>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <span>{currentProgress}% {t('dashboard.complete')}</span>
                    <span>{t('dashboard.lessonsProgress')}</span>
                  </div>
                </div>
                <div className="course-actions mt-4">
                  {/* MARK: FIXED - Updated navigation for view syllabus button */}
                  <motion.button
                    className="btn btn-outline"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigateToClassSubject(t('dashboard.categories.mathematics'))}
                  >
                    {t('dashboard.viewSyllabus')}
                  </motion.button>
                </div>
                <div className="course-highlights mt-4">
                  <h5>{t('dashboard.currentTopics')}</h5>
                  <ul>
                    {Array.isArray(currentTopics) ? currentTopics.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <i className="fas fa-check-circle"></i> {item}
                      </motion.li>
                    )) : <li>{t('dashboard.noTopics')}</li>}
                  </ul>
                </div>
              </motion.div>
            </div>

            <div className="col-lg-4">
              <motion.div
                className="stats-card p-4"
                whileHover={cardHover}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                <h5>{t('dashboard.sections.learningStats')}</h5>
                <div className="stats-bargraph">
                  {learningStats.map((stat, index) => (
                    <div className="bargraph-item" key={index}>
                      <div className="bargraph-label">
                        <i className={`fas fa-${stat.icon}`}></i> {stat.label}
                        <span className="bargraph-value">{stat.value}{stat.label === t('dashboard.stats.averageGrade') ? '%' : ''}</span>
                      </div>
                      <div className="bargraph-bar-bg">
                        <div
                          className="bargraph-bar-fill"
                          style={{
                            width: `${(stat.value / stat.max) * 100}%`,
                            background: stat.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <motion.div
                  className="achievement-badge mt-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1, type: 'spring' }}
                  whileHover={rotateAnimation}
                >
                  <i className="fas fa-trophy"></i>
                  <span>{t('dashboard.achievement')}</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="featured-courses mb-5"
          variants={itemVariants}
        >
          <div className="section-header">
            <h2>{t('dashboard.sections.courses')}</h2>
            <div className="tabs">
              {['All', 'Mathematics', 'Science', 'Languages', 'Social', 'Computer'].map((tab) => (
                <motion.button
                  key={tab}
                  className={activeTab === tab.toLowerCase() ? 'active' : ''}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  whileHover={{ scale: 1.05, backgroundColor: activeTab === tab.toLowerCase() ? '#1a3a4f' : '#e9ecef' }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {t(`dashboard.tabs.${tab.toLowerCase()}`)}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="tabs">
            {['7', '8', '9', '10'].map((cls) => (
              <motion.button
                key={cls}
                className={activeClass === cls ? 'active' : ''}
                onClick={() => setActiveClass(cls)}
                whileHover={{ scale: 1.05, backgroundColor: activeClass === cls ? '#1a3a4f' : '#e9ecef' }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t(`classes.${cls}th`)}
              </motion.button>
            ))}
          </div>

          <br />
          <div className="row g-4">
            {featuredCourses.map((course, index) => (
              <div className="col-md-4" key={course.id}>
                <motion.div
                  className="featured-course-card"
                  whileHover={cardHover}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  onHoverStart={() => setIsHovered(course.id)}
                  onHoverEnd={() => setIsHovered(null)}
                >
                  <div className="course-image">
                    <img src={course.image} alt={course.title} />
                    <div className="course-category">{course.category}</div>
                    {isHovered === course.id && (
                      <motion.div
                        className="course-hover-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></motion.div>
                    )}
                  </div>
                  <div className="course-content p-4">
                    <h3>{course.title}</h3>
                    <div className="progress-container mt-3">
                      <div className="progress" style={{ height: '6px' }}>
                        <motion.div
                          className="progress-bar"
                          role="progressbar"
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          style={{ backgroundColor: '#2D5D7B' }}
                        ></motion.div>
                      </div>
                      <span className="mt-2 d-block">{course.progress}% {t('dashboard.complete')}</span>
                    </div>
                    <div className="course-meta mt-3">
                      <span><i className="fas fa-book-open"></i> {t('dashboard.lessons')}</span>
                      <span><i className="fas fa-clock"></i> {t('dashboard.hours')}</span>
                    </div>
                    {/* MARK: FIXED - Updated navigation for continue button */}
                    <motion.button
                      className="btn btn-primary w-100 mt-3"
                      whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(45, 93, 123, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigateToClassSubject(course.category)}
                    >
                      {t('dashboard.continue')}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            ))}

            {/* Feedback & Comment Section */}
            <motion.section
              style={{
                background: "#f8f9fb",
                borderRadius: "20px",
                padding: "40px 20px",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.05)",
                margin: "60px 0",
                textAlign: "center",
                width: "100%"
              }}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div style={{ marginBottom: "25px" }}>
                <h2 style={{ fontWeight: "700", color: "#2D5D7B", marginBottom: "10px" }}>
                  {t('feedback.title')}
                </h2>
                <p style={{ color: "#555", fontSize: "16px" }}>
                  {t('feedback.subtitle')}
                </p>
                
                {/* MARK: UPDATED - Dynamic reward message based on eligibility */}
                {canReceiveReward ? (
                  <motion.div
                    style={{
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                      color: "#744210",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      marginTop: "10px"
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <FaCoins size={16} />
                    <span>{t('feedback.rewardMessage')}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    style={{
                      background: "linear-gradient(135deg, #2D5D7B, #A62D69)",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      marginTop: "10px"
                    }}
                  >
                    <FaCoins size={16} />
                    <span>
                      {t('feedback.rewardReceived')}{firstFeedbackDate && ` ${t('onDate')} ${firstFeedbackDate}`}
                    </span>
                  </motion.div>
                )}
              </div>

              <motion.div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.08)",
                  padding: "30px 25px",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {!isSubmitted ? (
                  <>
                    <h5 style={{ marginBottom: "20px", color: "#2D5D7B", fontWeight: "600" }}>
                      {t('feedback.satisfactionQuestion')}
                    </h5>

                    <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px" }}>
                      {emojis.map((emoji, index) => (
                        <motion.span
                          key={index}
                          whileHover={{ scale: 1.3 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setFeedbackRating(index + 1)}
                          style={{
                            fontSize: "2rem",
                            cursor: "pointer",
                            transform: feedbackRating === index + 1 ? "scale(1.4)" : "scale(1)",
                            filter: feedbackRating === index + 1 ? "drop-shadow(0 0 10px rgba(166, 45, 105, 0.6))" : "none",
                            transition: "transform 0.3s, filter 0.3s",
                          }}
                        >
                          {emoji}
                        </motion.span>
                      ))}
                    </div>

                    {/* Show label only for selected emoji */}
                    {feedbackRating > 0 && (
                      <div style={{ marginBottom: "15px", color: "#2D5D7B", fontWeight: "600" }}>
                        {t(`feedback.labels.${feedbackRating - 1}`)}
                      </div>
                    )}

                    <textarea
                      rows="4"
                      placeholder={t('feedback.placeholder')}
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        outline: "none",
                        resize: "none",
                        fontSize: "15px",
                        transition: "all 0.3s ease",
                        marginBottom: "15px",
                        boxShadow: feedbackComment.length > 0 ? "0 0 6px rgba(166, 45, 105, 0.3)" : "none",
                      }}
                    ></textarea>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleFeedbackSubmit}
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        padding: "12px",
                        border: "none",
                        background: "linear-gradient(135deg, #2D5D7B, #A62D69)",
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      {t('feedback.submit')}
                    </motion.button>
                  </>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <motion.div
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: "none",
                        background: "#2D5D7B",
                        color: "#fff",
                        fontWeight: "600",
                        textAlign: "center"
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {t('feedback.submitted')}
                    </motion.div>
                    
                    {/* MARK: UPDATED - Show change feedback button always */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleChangeFeedback}
                      style={{
                        borderRadius: "10px",
                        padding: "10px",
                        border: "1px solid #2D5D7B",
                        background: "transparent",
                        color: "#2D5D7B",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      {t('feedback.changeFeedback')}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </motion.section>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
};

export default Home1;