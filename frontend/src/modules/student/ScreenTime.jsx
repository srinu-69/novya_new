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
//   }, []);
 
//   // Save to localStorage whenever screenTime changes
//   useEffect(() => {
//     localStorage.setItem('screenTime', JSON.stringify(screenTime));
//   }, [screenTime]);
 
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
 
//   // Get current activity
//   const getCurrentActivity = () => {
//     return screenTime.currentActivity;
//   };
 
//   // Get today's screen time
//   const getTodayScreenTime = () => {
//     return screenTime.daily;
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
 
//     const totalTime = quizTime + mockTime + lessonTime;
 
//     return {
//       quiz: quizTime,
//       mock: mockTime,
//       lesson: lessonTime,
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
//       getCurrentActivity,
//       getTodayScreenTime,
//       getWeeklyScreenTime,
//       getTotalScreenTime,
//       getActivitiesByDateRange,
//       getTodayActivities,
//       getActivitiesByType,
//       getTimeBreakdown,
//       clearScreenTimeData
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
 









import React, { createContext, useContext, useState, useEffect } from 'react';
const ScreenTimeContext = createContext();
export const ScreenTimeProvider = ({ children }) => {
  const [screenTime, setScreenTime] = useState({
    daily: 0,
    weekly: 0,
    total: 0,
    sessions: [],
    activities: [],
    currentActivity: null,
    activityStartTime: null,
    sessionTime: 0,
    isSessionActive: false,
    sessionInterval: null
  });
  // Initialize from localStorage
  useEffect(() => {
    const savedScreenTime = localStorage.getItem('screenTime');
    if (savedScreenTime) {
      const parsedData = JSON.parse(savedScreenTime);
      if (!parsedData.activities) {
        parsedData.activities = [];
      }
      setScreenTime(parsedData);
    }
  }, []);
  // Save to localStorage whenever screenTime changes
  useEffect(() => {
    localStorage.setItem('screenTime', JSON.stringify(screenTime));
  }, [screenTime]);
  // Calculate totals based on activities
  const calculateTotals = (activities) => {
    const today = new Date().toISOString().split('T')[0];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const dailyTotal = activities
      .filter(activity => activity.date === today)
      .reduce((total, activity) => total + activity.duration, 0);
    const weeklyTotal = activities
      .filter(activity => new Date(activity.date) >= oneWeekAgo)
      .reduce((total, activity) => total + activity.duration, 0);
    const totalOverall = activities
      .reduce((total, activity) => total + activity.duration, 0);
    return { dailyTotal, weeklyTotal, totalOverall };
  };
  // Start global session timer (login)
  const startGlobalSession = () => {
    if (screenTime.isSessionActive) return;
    setScreenTime(prev => ({
      ...prev,
      isSessionActive: true,
      sessionTime: 0
    }));
    const interval = setInterval(() => {
      setScreenTime(current => ({
        ...current,
        sessionTime: current.sessionTime + 1
      }));
    }, 60000); // Increment every minute
    setScreenTime(prev => ({
      ...prev,
      sessionInterval: interval
    }));
  };
  // Stop global session timer (logout) and save as activity
  const stopGlobalSession = () => {
    if (!screenTime.isSessionActive) return;
    const today = new Date().toISOString().split('T')[0];
    const sessionActivity = {
      id: `session_${Date.now()}`,
      type: 'session',
      date: today,
      duration: screenTime.sessionTime,
      completed: true,
      timestamp: new Date().toISOString()
    };
    setScreenTime(prev => {
      const updatedActivities = [...prev.activities, sessionActivity];
      const totals = calculateTotals(updatedActivities);
      clearInterval(prev.sessionInterval);
      return {
        ...prev,
        ...totals,
        activities: updatedActivities,
        sessions: [...prev.sessions, {
          startTime: Date.now() - (prev.sessionTime * 60000), // Approximate start
          endTime: Date.now(),
          duration: prev.sessionTime,
          activity: sessionActivity
        }],
        sessionTime: 0,
        isSessionActive: false,
        sessionInterval: null,
        currentActivity: null,
        activityStartTime: null
      };
    });
  };
  // Start tracking an activity (call when user starts quiz/lesson/mock test)
  const startActivityTracking = (activityType, details = {}) => {
    const startTime = Date.now();
  
    setScreenTime(prev => ({
      ...prev,
      currentActivity: {
        id: startTime,
        type: activityType,
        startTime: startTime,
        date: new Date().toISOString().split('T')[0],
        ...details
      },
      activityStartTime: startTime
    }));
    return startTime;
  };
  // Stop tracking and save the activity (call when user finishes)
  const stopActivityTracking = (activityId, additionalDetails = {}) => {
    setScreenTime(prev => {
      if (!prev.currentActivity || prev.currentActivity.id !== activityId) {
        return prev;
      }
      const endTime = Date.now();
      const durationMinutes = Math.round((endTime - prev.currentActivity.startTime) / (1000 * 60));
    
      // Only save if activity lasted at least 1 minute
      if (durationMinutes < 1) {
        // Still save if it's less than 1 minute but user completed something
        const shortActivity = {
          ...prev.currentActivity,
          endTime,
          duration: durationMinutes || 1, // Minimum 1 minute
          completed: true,
          ...additionalDetails
        };
        const updatedActivities = [...prev.activities, shortActivity];
        const { dailyTotal, weeklyTotal, totalOverall } = calculateTotals(updatedActivities);
        return {
          ...prev,
          activities: updatedActivities,
          daily: dailyTotal,
          weekly: weeklyTotal,
          total: totalOverall,
          currentActivity: null,
          activityStartTime: null,
          sessions: [...prev.sessions, {
            startTime: prev.currentActivity.startTime,
            endTime: endTime,
            duration: durationMinutes || 1,
            activity: shortActivity
          }]
        };
      }
      const completedActivity = {
        ...prev.currentActivity,
        endTime,
        duration: durationMinutes,
        completed: true,
        ...additionalDetails
      };
      const updatedActivities = [...prev.activities, completedActivity];
      const { dailyTotal, weeklyTotal, totalOverall } = calculateTotals(updatedActivities);
      return {
        ...prev,
        activities: updatedActivities,
        daily: dailyTotal,
        weekly: weeklyTotal,
        total: totalOverall,
        currentActivity: null,
        activityStartTime: null,
        sessions: [...prev.sessions, {
          startTime: prev.currentActivity.startTime,
          endTime: endTime,
          duration: durationMinutes,
          activity: completedActivity
        }]
      };
    });
  };
  // Get current activity
  const getCurrentActivity = () => {
    return screenTime.currentActivity;
  };
  // Get today's screen time (includes current session)
  const getTodayScreenTime = () => {
    return screenTime.daily + (screenTime.isSessionActive ? screenTime.sessionTime : 0);
  };
  // Get weekly screen time (includes current session)
  const getWeeklyScreenTime = () => {
    return screenTime.weekly + (screenTime.isSessionActive ? screenTime.sessionTime : 0);
  };
  // Get total screen time (includes current session)
  const getTotalScreenTime = () => {
    return screenTime.total + (screenTime.isSessionActive ? screenTime.sessionTime : 0);
  };
  // Get activities by date range
  const getActivitiesByDateRange = (startDate, endDate) => {
    return screenTime.activities.filter(activity =>
      activity.date >= startDate && activity.date <= endDate
    );
  };
  // Get today's activities
  const getTodayActivities = () => {
    const today = new Date().toISOString().split('T')[0];
    return screenTime.activities.filter(activity => activity.date === today);
  };
  // Get activities by type
  const getActivitiesByType = (type) => {
    return screenTime.activities.filter(activity => activity.type === type);
  };
  // Get time breakdown by activity type (includes current session in lesson time for today)
  const getTimeBreakdown = (date = null) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const dayActivities = screenTime.activities.filter(activity => activity.date === targetDate);
    const quizTime = dayActivities
      .filter(activity => activity.type === 'quiz')
      .reduce((total, activity) => total + activity.duration, 0);
    const mockTime = dayActivities
      .filter(activity => activity.type === 'mock_test')
      .reduce((total, activity) => total + activity.duration, 0);
    let lessonTime = dayActivities
      .filter(activity => activity.type === 'lesson')
      .reduce((total, activity) => total + activity.duration, 0);
    const sessionTimeForDay = (targetDate === new Date().toISOString().split('T')[0] && screenTime.isSessionActive) ? screenTime.sessionTime : 0;
    lessonTime += sessionTimeForDay; // Add session time to learning activities for today
    const totalTime = quizTime + mockTime + lessonTime;
    return {
      quiz: quizTime,
      mock: mockTime,
      lesson: lessonTime,
      total: totalTime
    };
  };
  // Clear all data (for reset)
  const clearScreenTimeData = () => {
    const resetData = {
      daily: 0,
      weekly: 0,
      total: 0,
      sessions: [],
      activities: [],
      currentActivity: null,
      activityStartTime: null,
      sessionTime: 0,
      isSessionActive: false,
      sessionInterval: null
    };
    setScreenTime(resetData);
    localStorage.setItem('screenTime', JSON.stringify(resetData));
  };
  return (
    <ScreenTimeContext.Provider value={{
      screenTime,
      startActivityTracking,
      stopActivityTracking,
      startGlobalSession,
      stopGlobalSession,
      getCurrentActivity,
      getTodayScreenTime,
      getWeeklyScreenTime,
      getTotalScreenTime,
      getActivitiesByDateRange,
      getTodayActivities,
      getActivitiesByType,
      getTimeBreakdown,
      clearScreenTimeData
    }}>
      {children}
    </ScreenTimeContext.Provider>
  );
};
export const useScreenTime = () => {
  const context = useContext(ScreenTimeContext);
  if (!context) {
    throw new Error('useScreenTime must be used within a ScreenTimeProvider');
  }
  return context;
};