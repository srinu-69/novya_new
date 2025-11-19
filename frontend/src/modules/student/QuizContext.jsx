////old working
// import { createContext, useContext, useState, useEffect } from 'react';
 
// const QuizContext = createContext();
 
// export const QuizProvider = ({ children }) => {

//   const [quizResults, setQuizResults] = useState({

//     totalQuizzes: 0,

//     totalScore: 0,

//     totalQuestions: 0,

//     byLevel: {},

//   });
 
//   const [mockTestResults, setMockTestResults] = useState({

//     totalTests: 0,

//     totalScore: 0,

//     totalQuestions: 0,

//   });
 
//   // History arrays for detailed tracking

//   const [quizHistory, setQuizHistory] = useState([]);

//   const [mockHistory, setMockHistory] = useState([]);

//   const [lessonHistory, setLessonHistory] = useState([]); // NEW: Lesson history state
 
//   // Track if quiz is active

//   const [isQuizActive, setIsQuizActive] = useState(false);
 
//   // Reward points state and management

//   const [rewardPoints, setRewardPoints] = useState(

//     parseInt(localStorage.getItem("rewardPoints")) || 0

//   );

//   const [earnedPoints, setEarnedPoints] = useState({

//     basePoints: 0,

//     bonusPoints: 0,

//     totalPoints: 0,

//   });

//   const [pointsAwarded, setPointsAwarded] = useState(false);

//   const [quizStarted, setQuizStarted] = useState(false);

//   const [hasAwardedPoints, setHasAwardedPoints] = useState(false);
 
//   // Initialize all histories from localStorage

//   useEffect(() => {

//     const savedQuizHistory = localStorage.getItem("quizHistory");

//     const savedMockHistory = localStorage.getItem("mockHistory");

//     const savedLessonHistory = localStorage.getItem("lessonHistory"); // NEW

//     if (savedQuizHistory) setQuizHistory(JSON.parse(savedQuizHistory));

//     if (savedMockHistory) setMockHistory(JSON.parse(savedMockHistory));

//     if (savedLessonHistory) setLessonHistory(JSON.parse(savedLessonHistory)); // NEW

//   }, []);
 
//   // Save histories to localStorage whenever they change

//   useEffect(() => {

//     localStorage.setItem("quizHistory", JSON.stringify(quizHistory));

//   }, [quizHistory]);
 
//   useEffect(() => {

//     localStorage.setItem("mockHistory", JSON.stringify(mockHistory));

//   }, [mockHistory]);
 
//   useEffect(() => {

//     localStorage.setItem("lessonHistory", JSON.stringify(lessonHistory)); // NEW

//   }, [lessonHistory]);
 
//   // Save rewardPoints persistently and sync across components

//   useEffect(() => {

//     localStorage.setItem("rewardPoints", rewardPoints.toString());

//     // Dispatch event to sync across all components

//     window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {

//       detail: { rewardPoints }

//     }));

//   }, [rewardPoints]);
 
//   // Initialize reward points from localStorage on component mount

//   useEffect(() => {

//     const savedPoints = parseInt(localStorage.getItem('rewardPoints')) || 0;

//     if (savedPoints !== rewardPoints) {

//       setRewardPoints(savedPoints);

//     }

//   }, []);
 
//   // Function to calculate earned points - UPDATED BONUS LOGIC

//   const calculateEarnedPoints = (score, totalQuestions) => {

//     const basePoints = score; // 1 point per correct answer

//     const percentage = (score / totalQuestions) * 100;

//     // Fixed 10 points bonus for 80%+ scores instead of 50%

//     const bonusPoints = percentage >= 80 ? 10 : 0;

//     const totalPoints = basePoints + bonusPoints;

//     const earnedPointsData = {

//       basePoints,

//       bonusPoints,

//       totalPoints

//     };

//     setEarnedPoints(earnedPointsData);

//     return earnedPointsData;

//   };
 
//   // Function to update global reward points

//   const updateRewardPoints = (points) => {

//     setRewardPoints(points);

//     localStorage.setItem("rewardPoints", points.toString());

//   };
 
//   // Function to add earned points after quiz (with protection against multiple awards)

//   const addEarnedPoints = (earned) => {

//     if (!hasAwardedPoints && earned.totalPoints > 0) {

//       const total = rewardPoints + earned.totalPoints;

//       setEarnedPoints(earned);

//       setRewardPoints(total);

//       setHasAwardedPoints(true);

//       setPointsAwarded(true);

//       return true; // Points were awarded

//     }

//     return false; // Points were not awarded (already awarded or zero)

//   };
 
//   // Function to start quiz

//   const startQuiz = () => {

//     console.log("Quiz started!");

//     setQuizStarted(true);

//     setIsQuizActive(true);

//     setHasAwardedPoints(false); // Reset points awarded flag when starting new quiz

//     setPointsAwarded(false);

//     setEarnedPoints({ basePoints: 0, bonusPoints: 0, totalPoints: 0 }); // Reset earned points

//   };
 
//   // Function to reset quiz

//   const resetQuiz = () => {

//     setQuizStarted(false);

//     setPointsAwarded(false);

//     setHasAwardedPoints(false);

//     setEarnedPoints({ basePoints: 0, bonusPoints: 0, totalPoints: 0 });

//   };
 
//   // Reset points awarded flag (for retry scenarios)

//   const resetPointsAwarded = () => {

//     setHasAwardedPoints(false);

//     setPointsAwarded(false);

//   };
 
//   const updateQuizResults = (score, totalQuestions, level, className, subject, subtopic) => {

//     setQuizResults(prev => ({

//       totalQuizzes: prev.totalQuizzes + 1,

//       totalScore: prev.totalScore + score,

//       totalQuestions: prev.totalQuestions + totalQuestions,

//       byLevel: {

//         ...prev.byLevel,

//         [level]: (prev.byLevel[level] || 0) + 1,

//       },

//     }));
 
//     // Add to history

//     const historyItem = {

//       id: Date.now(),

//       class: className,

//       subject,

//       topic: subtopic,

//       score: Math.round((score / totalQuestions) * 100),

//       questions: totalQuestions,

//       date: new Date().toISOString().split('T')[0]

//     };

//     setQuizHistory(prev => [...prev, historyItem]);
 
//     // Award points only if user passed and points haven't been awarded yet

//     if (score >= 5 && !hasAwardedPoints) {

//       const earned = calculateEarnedPoints(score, totalQuestions);

//       const pointsAwarded = addEarnedPoints(earned);

//       console.log(`Points awarded for quiz: ${pointsAwarded ? 'Yes' : 'No'}, Total: ${earned.totalPoints}`);

//     }

//   };
 
//   const getQuizHistory = () => {

//     return quizHistory;

//   };
 
//   const updateMockTestResults = (score, totalQuestions, className, subject, chapter) => {

//     setMockTestResults(prev => ({

//       totalTests: prev.totalTests + 1,

//       totalScore: prev.totalScore + score,

//       totalQuestions: prev.totalQuestions + totalQuestions,

//     }));
 
//     // Add to history

//     const historyItem = {

//       id: Date.now(),

//       class: className,

//       subject,

//       topic: chapter,

//       score: Math.round((score / totalQuestions) * 100),

//       questions: totalQuestions,

//       date: new Date().toISOString().split('T')[0]

//     };

//     setMockHistory(prev => [...prev, historyItem]);

//   };
 
//   const getMockHistory = () => {

//     return mockHistory;

//   };
 
//   // NEW: Lesson History Functions

//   const getLessonHistory = () => {

//     return lessonHistory;

//   };
 
//   const addLessonToHistory = (lessonData) => {

//     try {

//       // Check if this lesson already exists (same class, subject, chapter, subtopic)

//       const existingLessonIndex = lessonHistory.findIndex(lesson => 

//         lesson.class === lessonData.class &&

//         lesson.subject === lessonData.subject &&

//         lesson.chapter === lessonData.chapter &&

//         lesson.subtopic === lessonData.subtopic

//       );
 
//       let updatedHistory;

//       if (existingLessonIndex !== -1) {

//         // Update existing lesson

//         updatedHistory = lessonHistory.map((lesson, index) => 

//           index === existingLessonIndex 

//             ? { ...lesson, ...lessonData, id: lesson.id } 

//             : lesson

//         );

//       } else {

//         // Add new lesson

//         const newLesson = {

//           id: Date.now(),

//           date: new Date().toISOString().split('T')[0],

//           timestamp: new Date().toISOString(),

//           ...lessonData

//         };

//         updatedHistory = [newLesson, ...lessonHistory];

//       }

//       setLessonHistory(updatedHistory);

//       return true;

//     } catch (error) {

//       console.error('Error saving lesson history:', error);

//       return false;

//     }

//   };
 
//   const updateLessonCompletion = (lessonId, updates) => {

//     try {

//       const updatedHistory = lessonHistory.map(lesson => 

//         lesson.id === lessonId ? { ...lesson, ...updates } : lesson

//       );

//       setLessonHistory(updatedHistory);

//       return true;

//     } catch (error) {

//       console.error('Error updating lesson:', error);

//       return false;

//     }

//   };
 
//   // Original endQuiz

//   const endQuiz = () => setIsQuizActive(false);
 
//   return (
// <QuizContext.Provider

//       value={{

//         quizResults,

//         mockTestResults,

//         updateQuizResults,

//         updateMockTestResults,

//         getQuizHistory,

//         getMockHistory,

//         // NEW: Lesson history functions

//         getLessonHistory,

//         addLessonToHistory,

//         updateLessonCompletion,

//         isQuizActive,

//         startQuiz,

//         endQuiz,

//         // Reward points management

//         rewardPoints,

//         updateRewardPoints,

//         calculateEarnedPoints,

//         earnedPoints,

//         pointsAwarded,

//         addEarnedPoints,

//         quizStarted,

//         resetQuiz,

//         resetPointsAwarded,

//         hasAwardedPoints,

//       }}
// >

//       {children}
// </QuizContext.Provider>

//   );

// };
 
// export const useQuiz = () => useContext(QuizContext);



// import { createContext, useContext, useState, useEffect } from 'react';

// const QuizContext = createContext();

// export const QuizProvider = ({ children }) => {
//   const [quizResults, setQuizResults] = useState({
//     totalQuizzes: 0,
//     totalScore: 0,
//     totalQuestions: 0,
//     byLevel: {},
//   });

//   const [mockTestResults, setMockTestResults] = useState({
//     totalTests: 0,
//     totalScore: 0,
//     totalQuestions: 0,
//   });

//   // History arrays for detailed tracking
//   const [quizHistory, setQuizHistory] = useState([]);
//   const [mockHistory, setMockHistory] = useState([]);
//   const [lessonHistory, setLessonHistory] = useState([]);

//   // Track if quiz is active
//   const [isQuizActive, setIsQuizActive] = useState(false);

//   // Reward points state and management
//   const [rewardPoints, setRewardPoints] = useState(
//     parseInt(localStorage.getItem("rewardPoints")) || 0
//   );

//   const [earnedPoints, setEarnedPoints] = useState({
//     basePoints: 0,
//     bonusPoints: 0,
//     totalPoints: 0,
//   });

//   const [pointsAwarded, setPointsAwarded] = useState(false);
//   const [quizStarted, setQuizStarted] = useState(false);
//   const [hasAwardedPoints, setHasAwardedPoints] = useState(false);

//   // Initialize all histories from localStorage
//   useEffect(() => {
//     const savedQuizHistory = localStorage.getItem("quizHistory");
//     const savedMockHistory = localStorage.getItem("mockHistory");
//     const savedLessonHistory = localStorage.getItem("lessonHistory");
    
//     if (savedQuizHistory) setQuizHistory(JSON.parse(savedQuizHistory));
//     if (savedMockHistory) setMockHistory(JSON.parse(savedMockHistory));
//     if (savedLessonHistory) setLessonHistory(JSON.parse(savedLessonHistory));
//   }, []);

//   // Save histories to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
//   }, [quizHistory]);

//   useEffect(() => {
//     localStorage.setItem("mockHistory", JSON.stringify(mockHistory));
//   }, [mockHistory]);

//   useEffect(() => {
//     localStorage.setItem("lessonHistory", JSON.stringify(lessonHistory));
//   }, [lessonHistory]);

//   // Save rewardPoints persistently and sync across components
//   useEffect(() => {
//     localStorage.setItem("rewardPoints", rewardPoints.toString());
//     // Dispatch event to sync across all components
//     window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
//       detail: { rewardPoints }
//     }));
//   }, [rewardPoints]);

//   // Initialize reward points from localStorage on component mount
//   useEffect(() => {
//     const savedPoints = parseInt(localStorage.getItem('rewardPoints')) || 0;
//     if (savedPoints !== rewardPoints) {
//       setRewardPoints(savedPoints);
//     }
//   }, []);

//   // Function to calculate earned points - UPDATED BONUS LOGIC
//   const calculateEarnedPoints = (score, totalQuestions) => {
//     const basePoints = score; // 1 point per correct answer
//     const percentage = (score / totalQuestions) * 100;
//     // Fixed 10 points bonus for 80%+ scores instead of 50%
//     const bonusPoints = percentage >= 80 ? 10 : 0;
//     const totalPoints = basePoints + bonusPoints;
//     const earnedPointsData = {
//       basePoints,
//       bonusPoints,
//       totalPoints
//     };
//     setEarnedPoints(earnedPointsData);
//     return earnedPointsData;
//   };

//   // Function to update global reward points
//   const updateRewardPoints = (points) => {
//     setRewardPoints(points);
//     localStorage.setItem("rewardPoints", points.toString());
//   };

//   // Function to add earned points after quiz (with protection against multiple awards)
//   const addEarnedPoints = (earned) => {
//     if (!hasAwardedPoints && earned.totalPoints > 0) {
//       const total = rewardPoints + earned.totalPoints;
//       setEarnedPoints(earned);
//       setRewardPoints(total);
//       setHasAwardedPoints(true);
//       setPointsAwarded(true);
//       return true; // Points were awarded
//     }
//     return false; // Points were not awarded (already awarded or zero)
//   };

//   // Function to start quiz
//   const startQuiz = () => {
//     console.log("Quiz started!");
//     setQuizStarted(true);
//     setIsQuizActive(true);
//     setHasAwardedPoints(false); // Reset points awarded flag when starting new quiz
//     setPointsAwarded(false);
//     setEarnedPoints({ basePoints: 0, bonusPoints: 0, totalPoints: 0 }); // Reset earned points
//   };

//   // Function to reset quiz
//   const resetQuiz = () => {
//     setQuizStarted(false);
//     setPointsAwarded(false);
//     setHasAwardedPoints(false);
//     setEarnedPoints({ basePoints: 0, bonusPoints: 0, totalPoints: 0 });
//   };

//   // Reset points awarded flag (for retry scenarios)
//   const resetPointsAwarded = () => {
//     setHasAwardedPoints(false);
//     setPointsAwarded(false);
//   };

//   const updateQuizResults = (score, totalQuestions, level, className, subject, subtopic) => {
//     setQuizResults(prev => ({
//       totalQuizzes: prev.totalQuizzes + 1,
//       totalScore: prev.totalScore + score,
//       totalQuestions: prev.totalQuestions + totalQuestions,
//       byLevel: {
//         ...prev.byLevel,
//         [level]: (prev.byLevel[level] || 0) + 1,
//       },
//     }));

//     // Add to history
//     const historyItem = {
//       id: Date.now(),
//       class: className,
//       subject,
//       topic: subtopic,
//       score: Math.round((score / totalQuestions) * 100),
//       questions: totalQuestions,
//       date: new Date().toISOString().split('T')[0]
//     };
//     setQuizHistory(prev => [...prev, historyItem]);

//     // Award points only if user passed and points haven't been awarded yet
//     if (score >= 5 && !hasAwardedPoints) {
//       const earned = calculateEarnedPoints(score, totalQuestions);
//       const pointsAwarded = addEarnedPoints(earned);
//       console.log(`Points awarded for quiz: ${pointsAwarded ? 'Yes' : 'No'}, Total: ${earned.totalPoints}`);
//     }
//   };

//   const getQuizHistory = () => {
//     return quizHistory;
//   };

//   const updateMockTestResults = (score, totalQuestions, className, subject, chapter) => {
//     setMockTestResults(prev => ({
//       totalTests: prev.totalTests + 1,
//       totalScore: prev.totalScore + score,
//       totalQuestions: prev.totalQuestions + totalQuestions,
//     }));

//     // Add to history
//     const historyItem = {
//       id: Date.now(),
//       class: className,
//       subject,
//       topic: chapter,
//       score: Math.round((score / totalQuestions) * 100),
//       questions: totalQuestions,
//       date: new Date().toISOString().split('T')[0]
//     };
//     setMockHistory(prev => [...prev, historyItem]);
//   };

//   const getMockHistory = () => {
//     return mockHistory;
//   };

//   // UPDATED: Enhanced Lesson History Functions to track all activity types
//   const getLessonHistory = () => {
//     return lessonHistory;
//   };

//   const addLessonToHistory = (lessonData) => {
//     try {
//       // Create a unique identifier for the activity
//       const activityId = `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
//       const newActivity = {
//         id: activityId,
//         date: new Date().toISOString().split('T')[0],
//         timestamp: new Date().toISOString(),
//         videoCompleted: lessonData.activityType === 'video' ? true : false,
//         completed: true,
//         rewardPoints: lessonData.rewardPoints || 0,
//         duration: lessonData.duration || 15, // Default 15 minutes
//         ...lessonData
//       };

//       const updatedHistory = [newActivity, ...lessonHistory];
//       setLessonHistory(updatedHistory);

//       // Award reward points if any
//       if (lessonData.rewardPoints && lessonData.rewardPoints > 0) {
//         const total = rewardPoints + lessonData.rewardPoints;
//         setRewardPoints(total);
//       }

//       // Dispatch storage event to notify LearningReports component
//       window.dispatchEvent(new Event('storage'));
      
//       return true;
//     } catch (error) {
//       console.error('Error saving lesson history:', error);
//       return false;
//     }
//   };

//   // NEW: Function to track specific activity types
//   const trackLearningActivity = (activityData) => {
//     const defaultData = {
//       activityType: 'general',
//       subject: 'General',
//       chapter: 'General',
//       title: 'Learning Activity',
//       duration: 15,
//       rewardPoints: 5, // Default points for any learning activity
//       completed: true,
//       timestamp: new Date().toISOString()
//     };

//     const activityToSave = { ...defaultData, ...activityData };
//     return addLessonToHistory(activityToSave);
//   };

//   // NEW: Specific functions for different activity types
//   const trackVideoCompletion = (videoData) => {
//     const activityData = {
//       activityType: 'video',
//       title: videoData.title || `${videoData.subject} - ${videoData.chapter}`,
//       rewardPoints: 10, // More points for video completion
//       duration: videoData.duration || 20,
//       ...videoData
//     };
//     return trackLearningActivity(activityData);
//   };

//   const trackAIAssistantUsage = (aiData) => {
//     const activityData = {
//       activityType: 'ai_assistant',
//       title: aiData.title || 'AI Assistant Session',
//       rewardPoints: 5,
//       duration: aiData.duration || 10,
//       ...aiData
//     };
//     return trackLearningActivity(activityData);
//   };

//   const trackNotesCreation = (notesData) => {
//     const activityData = {
//       activityType: 'notes',
//       title: notesData.title || 'Notes Created',
//       rewardPoints: 3,
//       duration: notesData.duration || 5,
//       ...notesData
//     };
//     return trackLearningActivity(activityData);
//   };

//   const trackQuickPractice = (practiceData) => {
//     const activityData = {
//       activityType: 'quick_practice',
//       title: practiceData.title || 'Quick Practice',
//       rewardPoints: 7,
//       duration: practiceData.duration || 15,
//       ...practiceData
//     };
//     return trackLearningActivity(activityData);
//   };

//   // NEW: Function to track feedback submission
//   const trackFeedbackSubmission = (feedbackData) => {
//     const activityData = {
//       activityType: 'feedback',
//       title: feedbackData.title || 'Platform Feedback',
//       rewardPoints: feedbackData.rewardPoints || 0, // No points for regular feedback, only first time
//       duration: 5, // Quick activity
//       rating: feedbackData.rating,
//       comment: feedbackData.comment,
//       ...feedbackData
//     };
//     return trackLearningActivity(activityData);
//   };

//   // NEW: Function to track typing practice
//   const trackTypingPractice = (typingData) => {
//     const activityData = {
//       activityType: 'typing_practice',
//       title: typingData.title || `Typing Practice - ${typingData.difficulty} Level`,
//       rewardPoints: typingData.rewardPoints || 0,
//       duration: typingData.duration || 5,
//       subject: 'Typing',
//       chapter: 'Keyboard Skills',
//       speed: typingData.speed,
//       accuracy: typingData.accuracy,
//       difficulty: typingData.difficulty,
//       keystrokes: typingData.keystrokes,
//       correctKeystrokes: typingData.correctKeystrokes,
//       ...typingData
//     };
//     return trackLearningActivity(activityData);
//   };

//   const updateLessonCompletion = (lessonId, updates) => {
//     try {
//       const updatedHistory = lessonHistory.map(lesson => 
//         lesson.id === lessonId ? { ...lesson, ...updates } : lesson
//       );
//       setLessonHistory(updatedHistory);
//       return true;
//     } catch (error) {
//       console.error('Error updating lesson:', error);
//       return false;
//     }
//   };

//   // Original endQuiz
//   const endQuiz = () => setIsQuizActive(false);

//   return (
//     <QuizContext.Provider
//       value={{
//         quizResults,
//         mockTestResults,
//         updateQuizResults,
//         updateMockTestResults,
//         getQuizHistory,
//         getMockHistory,
        
//         // Lesson history functions
//         getLessonHistory,
//         addLessonToHistory,
//         updateLessonCompletion,
        
//         // NEW: Enhanced activity tracking functions
//         trackLearningActivity,
//         trackVideoCompletion,
//         trackAIAssistantUsage,
//         trackNotesCreation,
//         trackQuickPractice,
//         trackFeedbackSubmission,
//         trackTypingPractice, // NEW: Added typing practice tracking

//         isQuizActive,
//         startQuiz,
//         endQuiz,

//         // Reward points management
//         rewardPoints,
//         updateRewardPoints,
//         calculateEarnedPoints,
//         earnedPoints,
//         pointsAwarded,
//         addEarnedPoints,
//         quizStarted,
//         resetQuiz,
//         resetPointsAwarded,
//         hasAwardedPoints,
//       }}
//     >
//       {children}
//     </QuizContext.Provider>
//   );
// };

// export const useQuiz = () => useContext(QuizContext);









// import React, { createContext, useContext, useState, useEffect } from 'react';
 
// const ScreenTimeContext = createContext();
 
// export const ScreenTimeProvider = ({ children }) => {
//   const [screenTime, setScreenTime] = useState({
//     daily: 0,
//     weekly: 0,
//     total: 0,
//     sessions: [],
//     activities: [],
//     currentActivity: null,
//     activityStartTime: null
//   });

//   const [realTimeUpdate, setRealTimeUpdate] = useState(0);

//   // Initialize from localStorage
//   useEffect(() => {
//     const savedScreenTime = localStorage.getItem('screenTime');
//     if (savedScreenTime) {
//       const parsedData = JSON.parse(savedScreenTime);
//       if (!parsedData.activities) {
//         parsedData.activities = [];
//       }
//       setScreenTime(parsedData);
//     }

//     // Start real-time updates for screen time
//     const interval = setInterval(() => {
//       setRealTimeUpdate(prev => prev + 1);
//     }, 60000); // Update every minute

//     return () => clearInterval(interval);
//   }, []);

//   // Save to localStorage whenever screenTime changes
//   useEffect(() => {
//     localStorage.setItem('screenTime', JSON.stringify(screenTime));
//   }, [screenTime]);

//   // Listen for storage changes (for real-time updates across components)
//   useEffect(() => {
//     const handleStorageChange = (e) => {
//       if (e.key === 'screenTime') {
//         const newScreenTime = JSON.parse(e.newValue || '{}');
//         setScreenTime(prev => ({ ...prev, ...newScreenTime }));
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   // Calculate totals based on activities
//   const calculateTotals = (activities) => {
//     const today = new Date().toISOString().split('T')[0];
//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
 
//     const dailyTotal = activities
//       .filter(activity => activity.date === today)
//       .reduce((total, activity) => total + activity.duration, 0);
 
//     const weeklyTotal = activities
//       .filter(activity => new Date(activity.date) >= oneWeekAgo)
//       .reduce((total, activity) => total + activity.duration, 0);
 
//     const totalOverall = activities
//       .reduce((total, activity) => total + activity.duration, 0);
 
//     return { dailyTotal, weeklyTotal, totalOverall };
//   };
 
//   // Start tracking an activity (call when user starts quiz/lesson/mock test)
//   const startActivityTracking = (activityType, details = {}) => {
//     const startTime = Date.now();
   
//     setScreenTime(prev => ({
//       ...prev,
//       currentActivity: {
//         id: startTime,
//         type: activityType,
//         startTime: startTime,
//         date: new Date().toISOString().split('T')[0],
//         ...details
//       },
//       activityStartTime: startTime
//     }));
 
//     return startTime;
//   };
 
//   // Stop tracking and save the activity (call when user finishes)
//   const stopActivityTracking = (activityId, additionalDetails = {}) => {
//     setScreenTime(prev => {
//       if (!prev.currentActivity || prev.currentActivity.id !== activityId) {
//         return prev;
//       }
 
//       const endTime = Date.now();
//       const durationMinutes = Math.round((endTime - prev.currentActivity.startTime) / (1000 * 60));
     
//       // Only save if activity lasted at least 1 minute
//       if (durationMinutes < 1) {
//         // Still save if it's less than 1 minute but user completed something
//         const shortActivity = {
//           ...prev.currentActivity,
//           endTime,
//           duration: durationMinutes || 1, // Minimum 1 minute
//           completed: true,
//           ...additionalDetails
//         };
 
//         const updatedActivities = [...prev.activities, shortActivity];
//         const { dailyTotal, weeklyTotal, totalOverall } = calculateTotals(updatedActivities);
 
//         return {
//           ...prev,
//           activities: updatedActivities,
//           daily: dailyTotal,
//           weekly: weeklyTotal,
//           total: totalOverall,
//           currentActivity: null,
//           activityStartTime: null,
//           sessions: [...prev.sessions, {
//             startTime: prev.currentActivity.startTime,
//             endTime: endTime,
//             duration: durationMinutes || 1,
//             activity: shortActivity
//           }]
//         };
//       }
 
//       const completedActivity = {
//         ...prev.currentActivity,
//         endTime,
//         duration: durationMinutes,
//         completed: true,
//         ...additionalDetails
//       };
 
//       const updatedActivities = [...prev.activities, completedActivity];
//       const { dailyTotal, weeklyTotal, totalOverall } = calculateTotals(updatedActivities);
 
//       return {
//         ...prev,
//         activities: updatedActivities,
//         daily: dailyTotal,
//         weekly: weeklyTotal,
//         total: totalOverall,
//         currentActivity: null,
//         activityStartTime: null,
//         sessions: [...prev.sessions, {
//           startTime: prev.currentActivity.startTime,
//           endTime: endTime,
//           duration: durationMinutes,
//           activity: completedActivity
//         }]
//       };
//     });
//   };

//   // Add general screen time (for login-to-logout tracking)
//   const addGeneralScreenTime = (minutes) => {
//     const today = new Date().toISOString().split('T')[0];
    
//     setScreenTime(prev => {
//       const updatedActivities = [...prev.activities];
      
//       // Find or create general screen time activity for today
//       let screenTimeActivity = updatedActivities.find(activity => 
//         activity.date === today && activity.type === 'general_screen_time'
//       );
      
//       if (!screenTimeActivity) {
//         screenTimeActivity = {
//           id: `screen_time_${Date.now()}`,
//           type: 'general_screen_time',
//           activityType: 'general_screen_time',
//           title: 'General Screen Time',
//           subject: 'Platform',
//           chapter: 'Usage',
//           duration: 0,
//           date: today,
//           timestamp: new Date().toISOString(),
//           completed: true
//         };
//         updatedActivities.push(screenTimeActivity);
//       }
      
//       // Update duration
//       screenTimeActivity.duration += minutes;
//       screenTimeActivity.timestamp = new Date().toISOString();
      
//       const { dailyTotal, weeklyTotal, totalOverall } = calculateTotals(updatedActivities);
      
//       return {
//         ...prev,
//         activities: updatedActivities,
//         daily: dailyTotal,
//         weekly: weeklyTotal,
//         total: totalOverall
//       };
//     });
//   };
 
//   // Get current activity
//   const getCurrentActivity = () => {
//     return screenTime.currentActivity;
//   };
 
//   // Get today's screen time (real-time)
//   const getTodayScreenTime = () => {
//     // Check for ongoing session and add current time
//     const sessionData = JSON.parse(localStorage.getItem('screenTimeSession') || '{}');
//     let currentSessionTime = 0;
    
//     if (sessionData.loginTime) {
//       const now = new Date();
//       const lastUpdate = new Date(sessionData.lastUpdateTime || sessionData.loginTime);
//       currentSessionTime = Math.floor((now - lastUpdate) / (1000 * 60));
//     }
    
//     return screenTime.daily + currentSessionTime;
//   };
 
//   // Get weekly screen time
//   const getWeeklyScreenTime = () => {
//     return screenTime.weekly;
//   };
 
//   // Get total screen time
//   const getTotalScreenTime = () => {
//     return screenTime.total;
//   };
 
//   // Get activities by date range
//   const getActivitiesByDateRange = (startDate, endDate) => {
//     return screenTime.activities.filter(activity =>
//       activity.date >= startDate && activity.date <= endDate
//     );
//   };
 
//   // Get today's activities
//   const getTodayActivities = () => {
//     const today = new Date().toISOString().split('T')[0];
//     return screenTime.activities.filter(activity => activity.date === today);
//   };
 
//   // Get activities by type
//   const getActivitiesByType = (type) => {
//     return screenTime.activities.filter(activity => activity.type === type);
//   };
 
//   // Get time breakdown by activity type
//   const getTimeBreakdown = (date = null) => {
//     const targetDate = date || new Date().toISOString().split('T')[0];
//     const dayActivities = screenTime.activities.filter(activity => activity.date === targetDate);
 
//     const quizTime = dayActivities
//       .filter(activity => activity.type === 'quiz')
//       .reduce((total, activity) => total + activity.duration, 0);
 
//     const mockTime = dayActivities
//       .filter(activity => activity.type === 'mock_test')
//       .reduce((total, activity) => total + activity.duration, 0);
 
//     const lessonTime = dayActivities
//       .filter(activity => activity.type === 'lesson')
//       .reduce((total, activity) => total + activity.duration, 0);

//     const generalTime = dayActivities
//       .filter(activity => activity.type === 'general_screen_time')
//       .reduce((total, activity) => total + activity.duration, 0);
 
//     const totalTime = quizTime + mockTime + lessonTime + generalTime;
 
//     return {
//       quiz: quizTime,
//       mock: mockTime,
//       lesson: lessonTime,
//       general: generalTime,
//       total: totalTime
//     };
//   };
 
//   // Clear all data (for reset)
//   const clearScreenTimeData = () => {
//     const resetData = {
//       daily: 0,
//       weekly: 0,
//       total: 0,
//       sessions: [],
//       activities: [],
//       currentActivity: null,
//       activityStartTime: null
//     };
//     setScreenTime(resetData);
//     localStorage.setItem('screenTime', JSON.stringify(resetData));
//   };
 
//   return (
//     <ScreenTimeContext.Provider value={{
//       screenTime,
//       startActivityTracking,
//       stopActivityTracking,
//       addGeneralScreenTime,
//       getCurrentActivity,
//       getTodayScreenTime,
//       getWeeklyScreenTime,
//       getTotalScreenTime,
//       getActivitiesByDateRange,
//       getTodayActivities,
//       getActivitiesByType,
//       getTimeBreakdown,
//       clearScreenTimeData,
//       realTimeUpdate
//     }}>
//       {children}
//     </ScreenTimeContext.Provider>
//   );
// };
 
// export const useScreenTime = () => {
//   const context = useContext(ScreenTimeContext);
//   if (!context) {
//     throw new Error('useScreenTime must be used within a ScreenTimeProvider');
//   }
//   return context;
// };

















import { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizResults, setQuizResults] = useState({
    totalQuizzes: 0,
    totalScore: 0,
    totalQuestions: 0,
    byLevel: {},
  });

  const [mockTestResults, setMockTestResults] = useState({
    totalTests: 0,
    totalScore: 0,
    totalQuestions: 0,
  });

  // History arrays for detailed tracking
  const [quizHistory, setQuizHistory] = useState([]);
  const [mockHistory, setMockHistory] = useState([]);
  const [lessonHistory, setLessonHistory] = useState([]);

  // Track if quiz is active
  const [isQuizActive, setIsQuizActive] = useState(false);

  // Reward points state and management
  const [rewardPoints, setRewardPoints] = useState(
    parseInt(localStorage.getItem("rewardPoints")) || 0
  );

  const [earnedPoints, setEarnedPoints] = useState({
    basePoints: 0,
    bonusPoints: 0,
    totalPoints: 0,
  });

  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [hasAwardedPoints, setHasAwardedPoints] = useState(false);

  // Initialize all histories from localStorage
  useEffect(() => {
    const savedQuizHistory = localStorage.getItem("quizHistory");
    const savedMockHistory = localStorage.getItem("mockHistory");
    const savedLessonHistory = localStorage.getItem("lessonHistory");
    
    if (savedQuizHistory) setQuizHistory(JSON.parse(savedQuizHistory));
    if (savedMockHistory) setMockHistory(JSON.parse(savedMockHistory));
    if (savedLessonHistory) setLessonHistory(JSON.parse(savedLessonHistory));
  }, []);

  // Save histories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
  }, [quizHistory]);

  useEffect(() => {
    localStorage.setItem("mockHistory", JSON.stringify(mockHistory));
  }, [mockHistory]);

  useEffect(() => {
    localStorage.setItem("lessonHistory", JSON.stringify(lessonHistory));
  }, [lessonHistory]);

  // Save rewardPoints persistently and sync across components
  useEffect(() => {
    localStorage.setItem("rewardPoints", rewardPoints.toString());
    // Dispatch event to sync across all components
    window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
      detail: { rewardPoints }
    }));
  }, [rewardPoints]);

  // Initialize reward points from localStorage on component mount
  useEffect(() => {
    const savedPoints = parseInt(localStorage.getItem('rewardPoints')) || 0;
    if (savedPoints !== rewardPoints) {
      setRewardPoints(savedPoints);
    }
  }, []);

  // Function to calculate earned points - UPDATED BONUS LOGIC
  const calculateEarnedPoints = (score, totalQuestions) => {
    const basePoints = score; // 1 point per correct answer
    const percentage = (score / totalQuestions) * 100;
    // Fixed 10 points bonus for 80%+ scores instead of 50%
    const bonusPoints = percentage >= 80 ? 10 : 0;
    const totalPoints = basePoints + bonusPoints;
    const earnedPointsData = {
      basePoints,
      bonusPoints,
      totalPoints
    };
    setEarnedPoints(earnedPointsData);
    return earnedPointsData;
  };

  // Function to update global reward points
  const updateRewardPoints = (points) => {
    setRewardPoints(points);
    localStorage.setItem("rewardPoints", points.toString());
  };

  // Function to add earned points after quiz (with protection against multiple awards)
  const addEarnedPoints = (earned) => {
    if (!hasAwardedPoints && earned.totalPoints > 0) {
      const total = rewardPoints + earned.totalPoints;
      setEarnedPoints(earned);
      setRewardPoints(total);
      setHasAwardedPoints(true);
      setPointsAwarded(true);
      return true; // Points were awarded
    }
    return false; // Points were not awarded (already awarded or zero)
  };

  // Function to start quiz
  const startQuiz = () => {
    console.log("Quiz started!");
    setQuizStarted(true);
    setIsQuizActive(true);
    setHasAwardedPoints(false); // Reset points awarded flag when starting new quiz
    setPointsAwarded(false);
    setEarnedPoints({ basePoints: 0, bonusPoints: 0, totalPoints: 0 }); // Reset earned points
  };

  // Function to reset quiz
  const resetQuiz = () => {
    setQuizStarted(false);
    setPointsAwarded(false);
    setHasAwardedPoints(false);
    setEarnedPoints({ basePoints: 0, bonusPoints: 0, totalPoints: 0 });
  };

  // Reset points awarded flag (for retry scenarios)
  const resetPointsAwarded = () => {
    setHasAwardedPoints(false);
    setPointsAwarded(false);
  };

  const updateQuizResults = (score, totalQuestions, level, className, subject, subtopic) => {
    setQuizResults(prev => ({
      totalQuizzes: prev.totalQuizzes + 1,
      totalScore: prev.totalScore + score,
      totalQuestions: prev.totalQuestions + totalQuestions,
      byLevel: {
        ...prev.byLevel,
        [level]: (prev.byLevel[level] || 0) + 1,
      },
    }));

    // Add to history
    const historyItem = {
      id: Date.now(),
      class: className,
      subject,
      topic: subtopic,
      score: Math.round((score / totalQuestions) * 100),
      questions: totalQuestions,
      date: new Date().toISOString().split('T')[0]
    };
    setQuizHistory(prev => [...prev, historyItem]);

    // Award points only if user passed and points haven't been awarded yet
    if (score >= 5 && !hasAwardedPoints) {
      const earned = calculateEarnedPoints(score, totalQuestions);
      const pointsAwarded = addEarnedPoints(earned);
      console.log(`Points awarded for quiz: ${pointsAwarded ? 'Yes' : 'No'}, Total: ${earned.totalPoints}`);
    }
  };

  const getQuizHistory = () => {
    return quizHistory;
  };

  const updateMockTestResults = (score, totalQuestions, className, subject, chapter) => {
    setMockTestResults(prev => ({
      totalTests: prev.totalTests + 1,
      totalScore: prev.totalScore + score,
      totalQuestions: prev.totalQuestions + totalQuestions,
    }));

    // Add to history
    const historyItem = {
      id: Date.now(),
      class: className,
      subject,
      topic: chapter,
      score: Math.round((score / totalQuestions) * 100),
      questions: totalQuestions,
      date: new Date().toISOString().split('T')[0]
    };
    setMockHistory(prev => [...prev, historyItem]);
  };

  const getMockHistory = () => {
    return mockHistory;
  };

  // UPDATED: Enhanced Lesson History Functions to track all activity types
  const getLessonHistory = () => {
    return lessonHistory;
  };

  const addLessonToHistory = (lessonData) => {
    try {
      // Create a unique identifier for the activity
      const activityId = `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newActivity = {
        id: activityId,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        videoCompleted: lessonData.activityType === 'video' ? true : false,
        completed: true,
        rewardPoints: lessonData.rewardPoints || 0,
        duration: lessonData.duration || 15, // Default 15 minutes
        ...lessonData
      };

      const updatedHistory = [newActivity, ...lessonHistory];
      setLessonHistory(updatedHistory);

      // Award reward points if any
      if (lessonData.rewardPoints && lessonData.rewardPoints > 0) {
        const total = rewardPoints + lessonData.rewardPoints;
        setRewardPoints(total);
      }

      // Dispatch storage event to notify LearningReports component
      window.dispatchEvent(new Event('storage'));
      
      return true;
    } catch (error) {
      console.error('Error saving lesson history:', error);
      return false;
    }
  };

  // NEW: Function to track specific activity types
  const trackLearningActivity = (activityData) => {
    const defaultData = {
      activityType: 'general',
      subject: 'General',
      chapter: 'General',
      title: 'Learning Activity',
      duration: 15,
      rewardPoints: 5, // Default points for any learning activity
      completed: true,
      timestamp: new Date().toISOString()
    };

    const activityToSave = { ...defaultData, ...activityData };
    return addLessonToHistory(activityToSave);
  };

  // NEW: Specific functions for different activity types
  const trackVideoCompletion = (videoData) => {
    const activityData = {
      activityType: 'video',
      title: videoData.title || `${videoData.subject} - ${videoData.chapter}`,
      rewardPoints: 10, // More points for video completion
      duration: videoData.duration || 20,
      ...videoData
    };
    return trackLearningActivity(activityData);
  };

  const trackAIAssistantUsage = (aiData) => {
    const activityData = {
      activityType: 'ai_assistant',
      title: aiData.title || 'AI Assistant Session',
      rewardPoints: 5,
      duration: aiData.duration || 10,
      ...aiData
    };
    return trackLearningActivity(activityData);
  };

  const trackNotesCreation = (notesData) => {
    const activityData = {
      activityType: 'notes',
      title: notesData.title || 'Notes Created',
      rewardPoints: 3,
      duration: notesData.duration || 5,
      ...notesData
    };
    return trackLearningActivity(activityData);
  };

  const trackQuickPractice = (practiceData) => {
    const activityData = {
      activityType: 'quick_practice',
      title: practiceData.title || 'Quick Practice',
      rewardPoints: 7,
      duration: practiceData.duration || 15,
      ...practiceData
    };
    return trackLearningActivity(activityData);
  };

  // NEW: Function to track feedback submission
  const trackFeedbackSubmission = (feedbackData) => {
    const activityData = {
      activityType: 'feedback',
      title: feedbackData.title || 'Platform Feedback',
      rewardPoints: feedbackData.rewardPoints || 0, // No points for regular feedback, only first time
      duration: 5, // Quick activity
      rating: feedbackData.rating,
      comment: feedbackData.comment,
      ...feedbackData
    };
    return trackLearningActivity(activityData);
  };

  // NEW: Function to track typing practice
  const trackTypingPractice = (typingData) => {
    const activityData = {
      activityType: 'typing_practice',
      title: typingData.title || `Typing Practice - ${typingData.difficulty} Level`,
      rewardPoints: typingData.rewardPoints || 0,
      duration: typingData.duration || 5,
      subject: 'Typing',
      chapter: 'Keyboard Skills',
      speed: typingData.speed,
      accuracy: typingData.accuracy,
      difficulty: typingData.difficulty,
      keystrokes: typingData.keystrokes,
      correctKeystrokes: typingData.correctKeystrokes,
      ...typingData
    };
    return trackLearningActivity(activityData);
  };

  // NEW: Function to track spin wheel activity
  const trackSpinWheel = (spinData) => {
    const activityData = {
      activityType: 'spin_wheel',
      title: spinData.title || 'Daily Spin Wheel',
      rewardPoints: spinData.rewardPoints || 0,
      duration: spinData.duration || 1,
      subject: 'Rewards',
      chapter: 'Daily Bonus',
      rewardName: spinData.rewardName,
      rewardValue: spinData.rewardValue,
      spinsRemaining: spinData.spinsRemaining,
      ...spinData
    };
    return trackLearningActivity(activityData);
  };

  const updateLessonCompletion = (lessonId, updates) => {
    try {
      const updatedHistory = lessonHistory.map(lesson => 
        lesson.id === lessonId ? { ...lesson, ...updates } : lesson
      );
      setLessonHistory(updatedHistory);
      return true;
    } catch (error) {
      console.error('Error updating lesson:', error);
      return false;
    }
  };

  // Original endQuiz
  const endQuiz = () => setIsQuizActive(false);

  return (
    <QuizContext.Provider
      value={{
        quizResults,
        mockTestResults,
        updateQuizResults,
        updateMockTestResults,
        getQuizHistory,
        getMockHistory,
        
        // Lesson history functions
        getLessonHistory,
        addLessonToHistory,
        updateLessonCompletion,
        
        // NEW: Enhanced activity tracking functions
        trackLearningActivity,
        trackVideoCompletion,
        trackAIAssistantUsage,
        trackNotesCreation,
        trackQuickPractice,
        trackFeedbackSubmission,
        trackTypingPractice,
        trackSpinWheel, // NEW: Added spin wheel tracking

        isQuizActive,
        startQuiz,
        endQuiz,

        // Reward points management
        rewardPoints,
        updateRewardPoints,
        calculateEarnedPoints,
        earnedPoints,
        pointsAwarded,
        addEarnedPoints,
        quizStarted,
        resetQuiz,
        resetPointsAwarded,
        hasAwardedPoints,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);