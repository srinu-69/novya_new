
// import React, { useState, useEffect } from 'react';
// import './SummaryDaily.css';
// import { useQuiz } from './QuizContext';
// import { useScreenTime } from './ScreenTime';
// import { useTranslation } from 'react-i18next';

// const LearningReports = () => {
//   const { t } = useTranslation();
//   const [dailyReport, setDailyReport] = useState(null);
//   const [weeklyReport, setWeeklyReport] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('daily');
  
//   // Get quiz and lesson data from context
//   const {
//     quizResults,
//     mockTestResults,
//     getQuizHistory,
//     getMockHistory,
//     getLessonHistory,
//     rewardPoints,
//   } = useQuiz();
  
//   // Get screen time data
//   const {
//     screenTime,
//     getTodayScreenTime,
//     getWeeklyScreenTime,
//     getTotalScreenTime,
//     getTimeBreakdown,
//     getTodayActivities
//   } = useScreenTime();

//   const quizHistory = getQuizHistory();
//   const mockHistory = getMockHistory();
//   const lessonHistory = getLessonHistory();

//   // UPDATED: Function to get activity type icon and label with translation
//   const getActivityTypeInfo = (activityType) => {
//     const types = {
//       'video': { icon: '🎥', label: t('activityTypes.video') },
//       'ai_assistant': { icon: '🤖', label: t('activityTypes.ai_assistant') },
//       'notes': { icon: '📝', label: t('activityTypes.notes') },
//       'quick_practice': { icon: '⚡', label: t('activityTypes.quick_practice') },
//       'feedback': { icon: '💬', label: t('activityTypes.feedback') },
//       'typing_practice': { icon: '⌨️', label: t('activityTypes.typing_practice') },
//       'spin_wheel': { icon: '🎰', label: t('activityTypes.spin_wheel') },
//       'quiz': { icon: '📝', label: t('activityTypes.quiz') },
//       'practice': { icon: '🧠', label: t('activityTypes.practice') },
//       'general': { icon: '📖', label: t('activityTypes.general') }
//     };
//     return types[activityType] || { icon: '📖', label: t('activityTypes.general') };
//   };

//   // UPDATED: Calculate learning statistics with enhanced activity tracking
//   const calculateLearningStats = () => {
//     const today = new Date().toISOString().split('T')[0];
   
//     // Get actual time breakdown from screenTime
//     const timeBreakdown = getTimeBreakdown(today);
//     const todayActivities = getTodayActivities();
    
//     // Calculate actual time for each activity type
//     const quizTime = timeBreakdown.quiz;
//     const mockTime = timeBreakdown.mock;
//     const lessonTime = timeBreakdown.lesson;
//     const totalStudyTime = timeBreakdown.total;
    
//     // Count activities - UPDATED: Include all completed activities including feedback, typing, and spin wheel
//     const todayQuizAttempts = quizHistory.filter(item => item.date === today);
//     const todayMockAttempts = mockHistory.filter(item => item.date === today);
   
//     // UPDATED: Get all completed activities for today (including feedback, typing, and spin wheel)
//     const todayActivitiesCompleted = lessonHistory.filter(item =>
//       item.date === today && item.completed === true
//     );
   
//     const totalActivitiesCompleted =
//       todayQuizAttempts.length +
//       todayMockAttempts.length +
//       todayActivitiesCompleted.length;
    
//     // Calculate productivity score
//     const productivityScore = Math.min(10,
//       Math.floor((totalStudyTime / 60) * 2) + // 1 point per 30 minutes
//       Math.floor(totalActivitiesCompleted * 1.5) // 1.5 points per activity
//     );

//     return {
//       totalActivitiesCompleted,
//       totalStudyTime,
//       productivityScore,
//       todayQuizAttempts,
//       todayMockAttempts,
//       todayActivitiesCompleted,
//       quizTime,
//       mockTime,
//       lessonTime,
//       actualScreenTime: getTodayScreenTime(),
//       timeBreakdown
//     };
//   };

//   // UPDATED: Calculate weekly statistics with enhanced activity tracking
//   const calculateWeeklyStats = () => {
//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
//     const weekStart = oneWeekAgo.toISOString().split('T')[0];
//     const weekEnd = new Date().toISOString().split('T')[0];
    
//     // Calculate weekly totals from screenTime activities
//     const weeklyTotalTime = getWeeklyScreenTime();
    
//     // Filter this week's activities
//     const weekQuizAttempts = quizHistory.filter(item => item.date >= weekStart);
//     const weekMockAttempts = mockHistory.filter(item => item.date >= weekStart);
   
//     // UPDATED: Get all completed activities for the week (including feedback, typing, and spin wheel)
//     const weekActivitiesCompleted = lessonHistory.filter(item =>
//       item.date >= weekStart && item.completed === true
//     );
    
//     // Calculate weekly totals
//     const weeklyTotalActivities =
//       weekQuizAttempts.length +
//       weekMockAttempts.length +
//       weekActivitiesCompleted.length;
    
//     // Calculate average daily time
//     const averageDailyTime = Math.round(weeklyTotalTime / 7);
    
//     // Calculate consistency score (days with activities / 7 days)
//     const activityDays = new Set([
//       ...weekQuizAttempts.map(item => item.date),
//       ...weekMockAttempts.map(item => item.date),
//       ...weekActivitiesCompleted.map(item => item.date)
//     ]).size;
    
//     const consistencyScore = Math.min(10, Math.floor((activityDays / 7) * 10));
    
//     // Daily breakdown with actual time
//     const dailyBreakdown = [];
//     for (let i = 6; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       const dateStr = date.toISOString().split('T')[0];
     
//       // Get time breakdown for each day
//       const dayTimeBreakdown = getTimeBreakdown(dateStr);
//       const dayTotalTime = dayTimeBreakdown.total;
     
//       const dayQuiz = quizHistory.filter(item => item.date === dateStr);
//       const dayMock = mockHistory.filter(item => item.date === dateStr);
//       const dayActivities = lessonHistory.filter(item =>
//         item.date === dateStr && item.completed === true
//       );
     
//       const dayTotalActivities = dayQuiz.length + dayMock.length + dayActivities.length;
//       dailyBreakdown.push({
//         date: dateStr,
//         total_study_time: dayTotalTime,
//         activities_completed: dayTotalActivities,
//         time_breakdown: dayTimeBreakdown
//       });
//     }

//     return {
//       week_start: weekStart,
//       week_end: weekEnd,
//       weekly_total_activities: weeklyTotalActivities,
//       weekly_total_time: weeklyTotalTime,
//       average_daily_time: averageDailyTime,
//       consistency_score: consistencyScore,
//       daily_breakdown: dailyBreakdown
//     };
//   };

//   // Generate recommendations based on actual activity
//   const generateRecommendations = (stats) => {
//     const recommendations = [];
   
//     if (stats.totalStudyTime === 0) {
//       recommendations.push(t('recommendations.startJourney'));
//       recommendations.push(t('recommendations.shortStudy'));
//     } else if (stats.totalStudyTime < 30) {
//       recommendations.push(t('recommendations.greatStart'));
//       recommendations.push(t('recommendations.consistentShort'));
//     } else if (stats.totalStudyTime < 60) {
//       recommendations.push(t('recommendations.excellentFocus'));
//       recommendations.push(t('recommendations.mixActivities'));
//     } else {
//       recommendations.push(t('recommendations.outstandingDedication'));
//       recommendations.push(t('recommendations.excellentProgress'));
//     }

//     if (stats.quizTime === 0) {
//       recommendations.push(t('recommendations.tryQuiz'));
//     }
//     if (stats.lessonTime === 0) {
//       recommendations.push(t('recommendations.watchLesson'));
//     }
//     if (stats.mockTime === 0) {
//       recommendations.push(t('recommendations.attemptMock'));
//     }

//     return recommendations;
//   };

//   // Generate weekly insights
//   const generateWeeklyInsights = (weeklyStats) => {
//     const insights = [];
   
//     if (weeklyStats.weekly_total_time > 300) { // 5+ hours
//       insights.push(t('weeklyInsights.outstandingDedication'));
//     } else if (weeklyStats.weekly_total_time > 180) { // 3+ hours
//       insights.push(t('weeklyInsights.greatConsistency'));
//     } else if (weeklyStats.weekly_total_time > 60) { // 1+ hour
//       insights.push(t('weeklyInsights.goodProgress'));
//     } else {
//       insights.push(t('weeklyInsights.everyMinuteCounts'));
//     }

//     if (weeklyStats.consistency_score >= 8) {
//       insights.push(t('weeklyInsights.excellentConsistency'));
//     } else if (weeklyStats.consistency_score >= 5) {
//       insights.push(t('weeklyInsights.goodConsistency'));
//     }

//     insights.push(t('weeklyInsights.timeSpent', { minutes: Math.round(weeklyStats.weekly_total_time) }));
//     insights.push(t('weeklyInsights.activitiesCompleted', { 
//       activities: weeklyStats.weekly_total_activities, 
//       days: weeklyStats.consistency_score 
//     }));

//     return insights;
//   };

//   // UPDATED: Function to get total statistics from context with enhanced activity tracking
//   const getTotalStatistics = () => {
//     // Get actual total study time from screenTime
//     const totalStudyTime = getTotalScreenTime();
   
//     // Total quizzes and mock tests from context
//     const totalQuizzes = quizResults.totalQuizzes || quizHistory.length || 0;
//     const totalMockTests = mockTestResults.totalTests || mockHistory.length || 0;
   
//     // Total questions answered
//     const totalQuizQuestions = quizResults.totalQuestions || quizHistory.reduce((total, quiz) => total + (quiz.questionsCount || 0), 0);
//     const totalMockQuestions = mockTestResults.totalQuestions || mockHistory.reduce((total, mock) => total + (mock.questionsCount || 0), 0);
//     const totalQuestions = totalQuizQuestions + totalMockQuestions;
   
//     // UPDATED: Total learning activities completed (EXCLUDE feedback, typing, AND spin wheel activities)
//     const totalActivitiesCompleted = lessonHistory.filter(activity =>
//       activity.completed === true &&
//       activity.activityType !== 'feedback' &&
//       activity.activityType !== 'typing_practice' &&
//       activity.activityType !== 'spin_wheel'
//     ).length;

//     return {
//       totalQuizzes,
//       totalMockTests,
//       totalQuestions,
//       totalActivitiesCompleted,
//       totalStudyTime,
//       rewardPoints
//     };
//   };

//   useEffect(() => {
//     const fetchReports = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // Calculate local statistics from context data with actual time
//         const dailyStats = calculateLearningStats();
//         const weeklyStats = calculateWeeklyStats();
//         const totalStats = getTotalStatistics();

//         // UPDATED: Create daily report from local data with enhanced activities including feedback, typing, and spin wheel
//         const localDailyReport = {
//           summary_date: new Date().toISOString().split('T')[0],
//           total_study_time: dailyStats.totalStudyTime,
//           activities_completed: dailyStats.totalActivitiesCompleted,
//           productivity_score: dailyStats.productivityScore,
//           recommendations: generateRecommendations(dailyStats),
//           summary_text: t('dailySummary.text', {
//             minutes: dailyStats.totalStudyTime,
//             activities: dailyStats.totalActivitiesCompleted,
//             quizzes: dailyStats.todayQuizAttempts.length,
//             mocks: dailyStats.todayMockAttempts.length,
//             learning: dailyStats.todayActivitiesCompleted.length
//           }),
//           activities: [
//             ...dailyStats.todayQuizAttempts.map(quiz => ({
//               activity_type: 'quiz',
//               activity_name: `${quiz.subject} ${t('activityTypes.quiz')} - ${quiz.topic}`,
//               duration_minutes: Math.round(dailyStats.quizTime / Math.max(dailyStats.todayQuizAttempts.length, 1)),
//               timestamp: new Date().toISOString(),
//               score: quiz.score
//             })),
//             ...dailyStats.todayMockAttempts.map(mock => ({
//               activity_type: 'practice',
//               activity_name: `${mock.subject} ${t('activityTypes.practice')} - ${mock.topic}`,
//               duration_minutes: Math.round(dailyStats.mockTime / Math.max(dailyStats.todayMockAttempts.length, 1)),
//               timestamp: new Date().toISOString(),
//               score: mock.score
//             })),
//             // UPDATED: Include all completed learning activities with proper typing including feedback, typing, and spin wheel
//             ...dailyStats.todayActivitiesCompleted.map(activity => {
//               const typeInfo = getActivityTypeInfo(activity.activityType);
//               return {
//                 activity_type: activity.activityType || 'general',
//                 activity_name: activity.title || `${activity.subject} - ${activity.chapter}`,
//                 duration_minutes: activity.duration || 15,
//                 timestamp: activity.timestamp || new Date().toISOString(),
//                 rewardPoints: activity.rewardPoints || 0,
//                 activity_icon: typeInfo.icon,
//                 activity_label: typeInfo.label,
//                 subject: activity.subject,
//                 chapter: activity.chapter,
//                 rating: activity.rating,
//                 comment: activity.comment,
//                 speed: activity.speed,
//                 accuracy: activity.accuracy,
//                 difficulty: activity.difficulty,
//                 keystrokes: activity.keystrokes,
//                 rewardName: activity.rewardName,
//                 rewardValue: activity.rewardValue,
//                 spinsRemaining: activity.spinsRemaining
//               };
//             })
//           ],
//           total_statistics: totalStats,
//           time_breakdown: dailyStats.timeBreakdown
//         };

//         // Create weekly report from local data
//         const localWeeklyReport = {
//           week_start: weeklyStats.week_start,
//           week_end: weeklyStats.week_end,
//           weekly_total_time: weeklyStats.weekly_total_time,
//           weekly_total_activities: weeklyStats.weekly_total_activities,
//           average_daily_time: weeklyStats.average_daily_time,
//           consistency_score: weeklyStats.consistency_score,
//           weekly_insights: generateWeeklyInsights(weeklyStats),
//           daily_breakdown: weeklyStats.daily_breakdown,
//           total_statistics: totalStats
//         };

//         setDailyReport(localDailyReport);
//         setWeeklyReport(localWeeklyReport);
//       } catch (err) {
//         setError(t('errors.failedToGenerate'));
//         console.error('Error generating reports:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReports();
    
//     // NEW: Add event listener for real-time updates when new activities are completed
//     const handleStorageUpdate = () => {
//       fetchReports();
//     };
    
//     window.addEventListener('storage', handleStorageUpdate);
//     return () => window.removeEventListener('storage', handleStorageUpdate);
//   }, [quizHistory, mockHistory, lessonHistory, quizResults, mockTestResults, rewardPoints, screenTime, t]);

//   const StatCard = ({ title, value, subtitle, icon, color }) => (
//     <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
//       <div className="stat-content">
//         <div className="stat-icon" style={{ backgroundColor: color }}>
//           {icon}
//         </div>
//         <div className="stat-text">
//           <h3>{value}</h3>
//           <p className="stat-title">{title}</p>
//           <p className="stat-subtitle">{subtitle}</p>
//         </div>
//       </div>
//     </div>
//   );

//   const ProgressBar = ({ score, maxScore = 10, color }) => (
//     <div className="progress-container">
//       <div className="progress-header">
//         <span>{t('common.progress')}</span>
//         <span>{score}/{maxScore}</span>
//       </div>
//       <div className="progress-bar">
//         <div
//           className="progress-fill"
//           style={{
//             width: `${(score / maxScore) * 100}%`,
//             backgroundColor: color
//           }}
//         ></div>
//       </div>
//     </div>
//   );

//   // Time Breakdown Component
//   const TimeBreakdown = ({ breakdown }) => (
//     <div className="time-breakdown">
//       <h4>⏱️ {t('timeBreakdown.title')}</h4>
//       <div className="breakdown-bars">
//         <div className="breakdown-item">
//           <span className="breakdown-label">{t('timeBreakdown.quizzes')}</span>
//           <div className="breakdown-bar">
//             <div
//               className="breakdown-fill quiz-fill"
//               style={{ width: `${breakdown.total > 0 ? (breakdown.quiz / breakdown.total) * 100 : 0}%` }}
//             ></div>
//           </div>
//           <span className="breakdown-time">{Math.round(breakdown.quiz)}m</span>
//         </div>
//         <div className="breakdown-item">
//           <span className="breakdown-label">{t('timeBreakdown.mockTests')}</span>
//           <div className="breakdown-bar">
//             <div
//               className="breakdown-fill mock-fill"
//               style={{ width: `${breakdown.total > 0 ? (breakdown.mock / breakdown.total) * 100 : 0}%` }}
//             ></div>
//           </div>
//           <span className="breakdown-time">{Math.round(breakdown.mock)}m</span>
//         </div>
//         <div className="breakdown-item">
//           <span className="breakdown-label">{t('timeBreakdown.learningActivities')}</span>
//           <div className="breakdown-bar">
//             <div
//               className="breakdown-fill lesson-fill"
//               style={{ width: `${breakdown.total > 0 ? (breakdown.lesson / breakdown.total) * 100 : 0}%` }}
//             ></div>
//           </div>
//           <span className="breakdown-time">{Math.round(breakdown.lesson)}m</span>
//         </div>
//       </div>
//     </div>
//   );

//   // UPDATED: Total Statistics Component
//   const TotalStatistics = ({ stats }) => {
//     // Format total study time to hours and minutes
//     const formatTotalStudyTime = (minutes) => {
//       const hours = Math.floor(minutes / 60);
//       const mins = Math.round(minutes % 60);
//       if (hours > 0) {
//         return `${hours}h ${mins}m`;
//       }
//       return `${mins}m`;
//     };

//     return (
//       <div className="total-statistics">
//         <h3>📊 {t('totalStatistics.title')}</h3>
//         <div className="stats-grid total-stats-grid">
//           <div className="total-stat-item">
//             <span className="total-stat-value">{stats.totalQuizzes}</span>
//             <span className="total-stat-label">{t('totalStatistics.totalQuizzes')}</span>
//           </div>
//           <div className="total-stat-item">
//             <span className="total-stat-value">{stats.totalMockTests}</span>
//             <span className="total-stat-label">{t('totalStatistics.mockTests')}</span>
//           </div>
//           <div className="total-stat-item">
//             <span className="total-stat-value">{stats.totalActivitiesCompleted}</span>
//             <span className="total-stat-label">{t('totalStatistics.classroomActivities')}</span>
//           </div>
//           <div className="total-stat-item">
//             <span className="total-stat-value">{formatTotalStudyTime(stats.totalStudyTime)}</span>
//             <span className="total-stat-label">{t('totalStatistics.totalStudyTime')}</span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) return (
//     <div className="loading-container">
//       <div className="loading-spinner"></div>
//       <p>{t('common.loading')}</p>
//     </div>
//   );

//   if (error) return (
//     <div className="error-container">
//       <div className="error-icon">⚠️</div>
//       <h3>{t('errors.somethingWentWrong')}</h3>
//       <p>{error}</p>
//       <button className="retry-btn" onClick={() => window.location.reload()}>
//         {t('common.tryAgain')}
//       </button>
//     </div>
//   );

//   return (
//     <div className="learning-reports">
//       <div className="reports-header"><br></br><br></br>
//         <h1>{t('title')}</h1>
//         <p>{t('subtitle')}</p>
//       </div>

//       {/* Total Statistics - Always Visible */}
//       {dailyReport?.total_statistics && (
//         <TotalStatistics stats={dailyReport.total_statistics} />
//       )}

//       {/* Tab Navigation */}
//       <div className="tabs-container">
//         <div className="tabs">
//           <button
//             className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
//             onClick={() => setActiveTab('daily')}
//           >
//             📊 {t('tabs.dailyReport')}
//           </button>
//           <button
//             className={`tab ${activeTab === 'weekly' ? 'active' : ''}`}
//             onClick={() => setActiveTab('weekly')}
//           >
//             📈 {t('tabs.weeklyReport')}
//           </button>
//         </div>
//       </div>

//       {/* Daily Report */}
//       {activeTab === 'daily' && dailyReport && (
//         <div className="report-container">
//           <div className="report-header">
//             <h2>{t('dailyReport.title')}</h2>
//             <span className="date-badge">{dailyReport.summary_date}</span>
//           </div>

//           <div className="stats-grid">
//             <StatCard
//               title={t('statCards.totalStudyTime')}
//               value={`${Math.round(dailyReport.total_study_time)}m`}
//               subtitle={t('statCards.actualTimeSpent')}
//               icon="⏱️"
//               color="#4f46e5"
//             />
//             <StatCard
//               title={t('statCards.activitiesCompleted')}
//               value={dailyReport.activities_completed}
//               subtitle={t('statCards.tasksAccomplished')}
//               icon="✅"
//               color="#10b981"
//             />
//             <StatCard
//               title={t('statCards.productivityScore')}
//               value={`${dailyReport.productivity_score}/10`}
//               subtitle={t('statCards.todaysEfficiency')}
//               icon="🚀"
//               color="#f59e0b"
//             />
//           </div>

//           {/* UPDATED: Activities Section with enhanced display including feedback, typing, and spin wheel */}
//           <div className="activities-section">
//             <h3>📚 {t('activitiesSection.title')}</h3>
//             <div className="activities-list">
//               {dailyReport.activities.map((act, index) => {
//                 const typeInfo = getActivityTypeInfo(act.activity_type);
//                 return (
//                   <div key={index} className="activity-item">
//                     <div className="activity-icon">
//                       {act.activity_icon || typeInfo.icon}
//                     </div>
//                     <div className="activity-details">
//                       <h4>{act.activity_name}</h4>
//                       <p>
//                         {act.activity_label || typeInfo.label}
//                         {act.subject && act.subject !== 'Platform' && act.subject !== 'Rewards' && ` • ${act.subject}`}
//                         {act.chapter && act.chapter !== 'Feedback' && act.chapter !== 'Keyboard Skills' && act.chapter !== 'Daily Bonus' && ` • ${act.chapter}`}
//                         {act.rating && ` • ${t('activityDetails.rating')}: ${act.rating}/5`}
//                         {act.speed && ` • ${t('activityDetails.speed')}: ${act.speed} WPM`}
//                         {act.accuracy && ` • ${t('activityDetails.accuracy')}: ${act.accuracy}%`}
//                         {act.difficulty && ` • ${t('activityDetails.level')}: ${act.difficulty}`}
//                         {act.rewardName && ` • ${t('activityDetails.reward')}: ${act.rewardName}`}
//                         {act.rewardValue > 0 && ` • ${t('activityDetails.points')}: +${act.rewardValue}`}
//                         {act.spinsRemaining !== undefined && ` • ${t('activityDetails.spinsLeft')}: ${act.spinsRemaining}`}
//                         {` • ${Math.round(act.duration_minutes)} ${t('common.minutes')}`}
//                         {act.score && ` • ${t('activityDetails.score')}: ${act.score}%`}
//                         {act.rewardPoints && act.rewardPoints > 0 && ` • +${act.rewardPoints} ${t('common.points')}`}
//                       </p>
//                     </div>
//                     <div className="activity-time">
//                       {new Date(act.timestamp).toLocaleTimeString([], {
//                         hour: '2-digit',
//                         minute: '2-digit'
//                       })}
//                     </div>
//                   </div>
//                 );
//               })}
//               {dailyReport.activities.length === 0 && (
//                 <div className="no-activities">
//                   <p>{t('activitiesSection.noActivities')}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Weekly Report */}
//       {activeTab === 'weekly' && weeklyReport && (
//         <div className="report-container">
//           <div className="report-header">
//             <h2>{t('weeklyReport.title')}</h2>
//             <span className="date-badge">
//               {weeklyReport.week_start} {t('common.to')} {weeklyReport.week_end}
//             </span>
//           </div>

//           <div className="stats-grid">
//             <StatCard
//               title={t('statCards.totalStudyTime')}
//               value={`${Math.round(weeklyReport.weekly_total_time / 60)}h ${Math.round(weeklyReport.weekly_total_time % 60)}m`}
//               subtitle={t('statCards.thisWeeksTotal')}
//               icon="⏱️"
//               color="#4f46e5"
//             />
//             <StatCard
//               title={t('statCards.activitiesCompleted')}
//               value={weeklyReport.weekly_total_activities}
//               subtitle={t('statCards.weeklyTasks')}
//               icon="✅"
//               color="#10b981"
//             />
//             <StatCard
//               title={t('statCards.averageDailyTime')}
//               value={`${weeklyReport.average_daily_time}m`}
//               subtitle={t('statCards.dailyAverage')}
//               icon="📅"
//               color="#8b5cf6"
//             />
//             <StatCard
//               title={t('statCards.consistencyScore')}
//               value={`${weeklyReport.consistency_score}/10`}
//               subtitle={t('statCards.learningConsistency')}
//               icon="🔥"
//               color="#f59e0b"
//             />
//           </div>

//           <div className="content-grid">
//             <div className="insights-card">
//               <h3>💡 {t('weeklyReport.insights')}</h3>
//               <div className="insights-list">
//                 {weeklyReport.weekly_insights.map((insight, index) => (
//                   <div key={index} className="insight-item">
//                     <span className="insight-icon">💡</span>
//                     <span>{insight}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="progress-card">
//               <h3>📊 {t('weeklyReport.consistencyProgress')}</h3>
//               <ProgressBar
//                 score={weeklyReport.consistency_score}
//                 color="#8b5cf6"
//               />
//               <p>{t('weeklyReport.consistencyDescription')}</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LearningReports;





// import React, { useState, useEffect } from 'react';
// import './SummaryDaily.css';
// import { useQuiz } from './QuizContext';
// import { useScreenTime } from './ScreenTime';
// import { useTranslation } from 'react-i18next';

// const LearningReports = () => {
//   const { t } = useTranslation();
//   const [dailyReport, setDailyReport] = useState(null);
//   const [weeklyReport, setWeeklyReport] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('daily');
  
//   // Get quiz and lesson data from context
//   const {
//     quizResults,
//     mockTestResults,
//     getQuizHistory,
//     getMockHistory,
//     getLessonHistory,
//     rewardPoints,
//   } = useQuiz();
  
//   // Get screen time data
//   const {
//     screenTime,
//     getTodayScreenTime,
//     getWeeklyScreenTime,
//     getTotalScreenTime,
//     getTimeBreakdown,
//     getTodayActivities
//   } = useScreenTime();

//   const quizHistory = getQuizHistory();
//   const mockHistory = getMockHistory();
//   const lessonHistory = getLessonHistory();

//   // UPDATED: Function to get activity type icon and label with translation
//   const getActivityTypeInfo = (activityType) => {
//     const types = {
//       'video': { icon: '🎥', label: t('activityTypes.video') },
//       'ai_assistant': { icon: '🤖', label: t('activityTypes.ai_assistant') },
//       'notes': { icon: '📝', label: t('activityTypes.notes') },
//       'quick_practice': { icon: '⚡', label: t('activityTypes.quick_practice') },
//       'feedback': { icon: '💬', label: t('activityTypes.feedback') },
//       'typing_practice': { icon: '⌨️', label: t('activityTypes.typing_practice') },
//       'spin_wheel': { icon: '🎰', label: t('activityTypes.spin_wheel') },
//       'quiz': { icon: '📝', label: t('activityTypes.quiz') },
//       'practice': { icon: '🧠', label: t('activityTypes.practice') },
//       'general': { icon: '📖', label: t('activityTypes.general') }
//     };
//     return types[activityType] || { icon: '📖', label: t('activityTypes.general') };
//   };

//   // UPDATED: Format time to hours and minutes
//   const formatTime = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = Math.round(minutes % 60);
//     if (hours > 0) {
//       return `${hours}h ${mins}m`;
//     }
//     return `${mins}m`;
//   };

//   // UPDATED: Calculate learning statistics with MUCH HARDER productivity score
//   const calculateLearningStats = () => {
//     const today = new Date().toISOString().split('T')[0];
   
//     // Get actual time breakdown from screenTime
//     const timeBreakdown = getTimeBreakdown(today);
//     const todayActivities = getTodayActivities();
    
//     // Calculate actual time for each activity type
//     const quizTime = timeBreakdown.quiz;
//     const mockTime = timeBreakdown.mock;
//     const lessonTime = timeBreakdown.lesson;
//     const totalStudyTime = timeBreakdown.total;
    
//     // Count activities - UPDATED: Include all completed activities including feedback, typing, and spin wheel
//     const todayQuizAttempts = quizHistory.filter(item => item.date === today);
//     const todayMockAttempts = mockHistory.filter(item => item.date === today);
   
//     // UPDATED: Get all completed activities for today (including feedback, typing, and spin wheel)
//     const todayActivitiesCompleted = lessonHistory.filter(item =>
//       item.date === today && item.completed === true
//     );
   
//     const totalActivitiesCompleted =
//       todayQuizAttempts.length +
//       todayMockAttempts.length +
//       todayActivitiesCompleted.length;
    
//     // UPDATED: Calculate productivity score - MUCH HARDER calculation
//     const productivityScore = Math.min(10,
//       Math.floor((totalStudyTime / 180) * 2) + // 1 point per 90 minutes (much harder)
//       Math.floor(totalActivitiesCompleted * 0.3) // 0.3 points per activity (much harder)
//     );

//     return {
//       totalActivitiesCompleted,
//       totalStudyTime,
//       productivityScore,
//       todayQuizAttempts,
//       todayMockAttempts,
//       todayActivitiesCompleted,
//       quizTime,
//       mockTime,
//       lessonTime,
//       actualScreenTime: getTodayScreenTime(),
//       timeBreakdown
//     };
//   };

//   // UPDATED: Calculate weekly statistics with enhanced activity tracking
//   const calculateWeeklyStats = () => {
//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
//     const weekStart = oneWeekAgo.toISOString().split('T')[0];
//     const weekEnd = new Date().toISOString().split('T')[0];
    
//     // Calculate weekly totals from screenTime activities
//     const weeklyTotalTime = getWeeklyScreenTime();
    
//     // Filter this week's activities
//     const weekQuizAttempts = quizHistory.filter(item => item.date >= weekStart);
//     const weekMockAttempts = mockHistory.filter(item => item.date >= weekStart);
   
//     // UPDATED: Get all completed activities for the week (including feedback, typing, and spin wheel)
//     const weekActivitiesCompleted = lessonHistory.filter(item =>
//       item.date >= weekStart && item.completed === true
//     );
    
//     // Calculate weekly totals
//     const weeklyTotalActivities =
//       weekQuizAttempts.length +
//       weekMockAttempts.length +
//       weekActivitiesCompleted.length;
    
//     // Calculate average daily time
//     const averageDailyTime = Math.round(weeklyTotalTime / 7);
    
//     // Calculate consistency score (days with activities / 7 days)
//     const activityDays = new Set([
//       ...weekQuizAttempts.map(item => item.date),
//       ...weekMockAttempts.map(item => item.date),
//       ...weekActivitiesCompleted.map(item => item.date)
//     ]).size;
    
//     const consistencyScore = Math.min(10, Math.floor((activityDays / 7) * 10));
    
//     // Daily breakdown with actual time
//     const dailyBreakdown = [];
//     for (let i = 6; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       const dateStr = date.toISOString().split('T')[0];
     
//       // Get time breakdown for each day
//       const dayTimeBreakdown = getTimeBreakdown(dateStr);
//       const dayTotalTime = dayTimeBreakdown.total;
     
//       const dayQuiz = quizHistory.filter(item => item.date === dateStr);
//       const dayMock = mockHistory.filter(item => item.date === dateStr);
//       const dayActivities = lessonHistory.filter(item =>
//         item.date === dateStr && item.completed === true
//       );
     
//       const dayTotalActivities = dayQuiz.length + dayMock.length + dayActivities.length;
//       dailyBreakdown.push({
//         date: dateStr,
//         total_study_time: dayTotalTime,
//         activities_completed: dayTotalActivities,
//         time_breakdown: dayTimeBreakdown
//       });
//     }

//     return {
//       week_start: weekStart,
//       week_end: weekEnd,
//       weekly_total_activities: weeklyTotalActivities,
//       weekly_total_time: weeklyTotalTime,
//       average_daily_time: averageDailyTime,
//       consistency_score: consistencyScore,
//       daily_breakdown: dailyBreakdown
//     };
//   };

//   // Generate recommendations based on actual activity
//   const generateRecommendations = (stats) => {
//     const recommendations = [];
   
//     if (stats.totalStudyTime === 0) {
//       recommendations.push(t('recommendations.startJourney'));
//       recommendations.push(t('recommendations.shortStudy'));
//     } else if (stats.totalStudyTime < 30) {
//       recommendations.push(t('recommendations.greatStart'));
//       recommendations.push(t('recommendations.consistentShort'));
//     } else if (stats.totalStudyTime < 60) {
//       recommendations.push(t('recommendations.excellentFocus'));
//       recommendations.push(t('recommendations.mixActivities'));
//     } else {
//       recommendations.push(t('recommendations.outstandingDedication'));
//       recommendations.push(t('recommendations.excellentProgress'));
//     }

//     if (stats.quizTime === 0) {
//       recommendations.push(t('recommendations.tryQuiz'));
//     }
//     if (stats.lessonTime === 0) {
//       recommendations.push(t('recommendations.watchLesson'));
//     }
//     if (stats.mockTime === 0) {
//       recommendations.push(t('recommendations.attemptMock'));
//     }

//     return recommendations;
//   };

//   // Generate weekly insights
//   const generateWeeklyInsights = (weeklyStats) => {
//     const insights = [];
   
//     if (weeklyStats.weekly_total_time > 300) { // 5+ hours
//       insights.push(t('weeklyInsights.outstandingDedication'));
//     } else if (weeklyStats.weekly_total_time > 180) { // 3+ hours
//       insights.push(t('weeklyInsights.greatConsistency'));
//     } else if (weeklyStats.weekly_total_time > 60) { // 1+ hour
//       insights.push(t('weeklyInsights.goodProgress'));
//     } else {
//       insights.push(t('weeklyInsights.everyMinuteCounts'));
//     }

//     if (weeklyStats.consistency_score >= 8) {
//       insights.push(t('weeklyInsights.excellentConsistency'));
//     } else if (weeklyStats.consistency_score >= 5) {
//       insights.push(t('weeklyInsights.goodConsistency'));
//     }

//     insights.push(t('weeklyInsights.timeSpent', { minutes: Math.round(weeklyStats.weekly_total_time) }));
//     insights.push(t('weeklyInsights.activitiesCompleted', { 
//       activities: weeklyStats.weekly_total_activities, 
//       days: weeklyStats.consistency_score 
//     }));

//     return insights;
//   };

//   // UPDATED: Function to get total statistics from context with enhanced activity tracking
//   const getTotalStatistics = () => {
//     // Get actual total study time from screenTime
//     const totalStudyTime = getTotalScreenTime();
   
//     // Total quizzes and mock tests from context
//     const totalQuizzes = quizResults.totalQuizzes || quizHistory.length || 0;
//     const totalMockTests = mockTestResults.totalTests || mockHistory.length || 0;
   
//     // Total questions answered
//     const totalQuizQuestions = quizResults.totalQuestions || quizHistory.reduce((total, quiz) => total + (quiz.questionsCount || 0), 0);
//     const totalMockQuestions = mockTestResults.totalQuestions || mockHistory.reduce((total, mock) => total + (mock.questionsCount || 0), 0);
//     const totalQuestions = totalQuizQuestions + totalMockQuestions;
   
//     // UPDATED: Total learning activities completed (EXCLUDE feedback, typing, AND spin wheel activities)
//     const totalActivitiesCompleted = lessonHistory.filter(activity =>
//       activity.completed === true &&
//       activity.activityType !== 'feedback' &&
//       activity.activityType !== 'typing_practice' &&
//       activity.activityType !== 'spin_wheel'
//     ).length;

//     return {
//       totalQuizzes,
//       totalMockTests,
//       totalQuestions,
//       totalActivitiesCompleted,
//       totalStudyTime,
//       rewardPoints
//     };
//   };

//   // NEW: Function to refresh data for real-time updates
//   const refreshData = () => {
//     const dailyStats = calculateLearningStats();
//     const weeklyStats = calculateWeeklyStats();
//     const totalStats = getTotalStatistics();

//     const localDailyReport = {
//       summary_date: new Date().toISOString().split('T')[0],
//       total_study_time: dailyStats.totalStudyTime,
//       activities_completed: dailyStats.totalActivitiesCompleted,
//       productivity_score: dailyStats.productivityScore,
//       recommendations: generateRecommendations(dailyStats),
//       summary_text: t('dailySummary.text', {
//         minutes: dailyStats.totalStudyTime,
//         activities: dailyStats.totalActivitiesCompleted,
//         quizzes: dailyStats.todayQuizAttempts.length,
//         mocks: dailyStats.todayMockAttempts.length,
//         learning: dailyStats.todayActivitiesCompleted.length
//       }),
//       activities: [
//         ...dailyStats.todayQuizAttempts.map(quiz => ({
//           activity_type: 'quiz',
//           activity_name: `${quiz.subject} ${t('activityTypes.quiz')} - ${quiz.topic}`,
//           duration_minutes: Math.round(dailyStats.quizTime / Math.max(dailyStats.todayQuizAttempts.length, 1)),
//           timestamp: new Date().toISOString(),
//           score: quiz.score
//         })),
//         ...dailyStats.todayMockAttempts.map(mock => ({
//           activity_type: 'practice',
//           activity_name: `${mock.subject} ${t('activityTypes.practice')} - ${mock.topic}`,
//           duration_minutes: Math.round(dailyStats.mockTime / Math.max(dailyStats.todayMockAttempts.length, 1)),
//           timestamp: new Date().toISOString(),
//           score: mock.score
//         })),
//         ...dailyStats.todayActivitiesCompleted.map(activity => {
//           const typeInfo = getActivityTypeInfo(activity.activityType);
//           return {
//             activity_type: activity.activityType || 'general',
//             activity_name: activity.title || `${activity.subject} - ${activity.chapter}`,
//             duration_minutes: activity.duration || 15,
//             timestamp: activity.timestamp || new Date().toISOString(),
//             rewardPoints: activity.rewardPoints || 0,
//             activity_icon: typeInfo.icon,
//             activity_label: typeInfo.label,
//             subject: activity.subject,
//             chapter: activity.chapter,
//             rating: activity.rating,
//             comment: activity.comment,
//             speed: activity.speed,
//             accuracy: activity.accuracy,
//             difficulty: activity.difficulty,
//             keystrokes: activity.keystrokes,
//             rewardName: activity.rewardName,
//             rewardValue: activity.rewardValue,
//             spinsRemaining: activity.spinsRemaining
//           };
//         })
//       ],
//       total_statistics: totalStats,
//       time_breakdown: dailyStats.timeBreakdown
//     };

//     const localWeeklyReport = {
//       week_start: weeklyStats.week_start,
//       week_end: weeklyStats.week_end,
//       weekly_total_time: weeklyStats.weekly_total_time,
//       weekly_total_activities: weeklyStats.weekly_total_activities,
//       average_daily_time: weeklyStats.average_daily_time,
//       consistency_score: weeklyStats.consistency_score,
//       weekly_insights: generateWeeklyInsights(weeklyStats),
//       daily_breakdown: weeklyStats.daily_breakdown,
//       total_statistics: totalStats
//     };

//     setDailyReport(localDailyReport);
//     setWeeklyReport(localWeeklyReport);
//   };

//   useEffect(() => {
//     const fetchReports = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         refreshData();
//       } catch (err) {
//         setError(t('errors.failedToGenerate'));
//         console.error('Error generating reports:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReports();
    
//     // NEW: Set up interval for real-time updates
//     const intervalId = setInterval(() => {
//       if (activeTab === 'analytics') {
//         refreshData();
//       }
//     }, 60000); // Update every minute

//     // NEW: Add event listener for real-time updates when new activities are completed
//     const handleStorageUpdate = () => {
//       refreshData();
//     };
    
//     window.addEventListener('storage', handleStorageUpdate);
//     return () => {
//       window.removeEventListener('storage', handleStorageUpdate);
//       clearInterval(intervalId);
//     };
//   }, [quizHistory, mockHistory, lessonHistory, quizResults, mockTestResults, rewardPoints, screenTime, t, activeTab]);

//   const StatCard = ({ title, value, subtitle, icon, color }) => (
//     <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
//       <div className="stat-content">
//         <div className="stat-icon" style={{ backgroundColor: color }}>
//           {icon}
//         </div>
//         <div className="stat-text">
//           <h3>{value}</h3>
//           <p className="stat-title">{title}</p>
//           <p className="stat-subtitle">{subtitle}</p>
//         </div>
//       </div>
//     </div>
//   );

//   const ProgressBar = ({ score, maxScore = 10, color }) => (
//     <div className="progress-container">
//       <div className="progress-header">
//         <span>{t('common.progress')}</span>
//         <span>{score}/{maxScore}</span>
//       </div>
//       <div className="progress-bar">
//         <div
//           className="progress-fill"
//           style={{
//             width: `${(score / maxScore) * 100}%`,
//             backgroundColor: color
//           }}
//         ></div>
//       </div>
//     </div>
//   );

//   // UPDATED: Analytics Graph Component with proper scaling for high activity counts
//   const AnalyticsGraph = ({ stats }) => {
//     // UPDATED: Separate scaling for different types of metrics
//     const activityMetrics = [
//       stats.totalQuizzes,
//       stats.totalMockTests,
//       stats.totalActivitiesCompleted,
//       stats.activities_completed || 0
//     ];
    
//     const timeMetrics = [
//       Math.round(stats.totalStudyTime / 60) // Convert minutes to hours
//     ];
    
//     const scoreMetrics = [
//       stats.productivity_score || 0
//     ];
    
//     // UPDATED: Use different max values for different metric types
//     const maxActivityValue = Math.max(...activityMetrics, 50); // Cap at 50 for better scaling
//     const maxTimeValue = Math.max(...timeMetrics, 10); // Cap at 10 hours for better scaling
//     const maxScoreValue = Math.max(...scoreMetrics, 10); // Cap at 10 for scores

//     const barData = [
//       { 
//         label: t('totalStatistics.totalQuizzes'), 
//         value: stats.totalQuizzes, 
//         maxValue: maxActivityValue,
//         color: '#4f46e5',
//         formattedValue: stats.totalQuizzes,
//         type: 'activity'
//       },
//       { 
//         label: t('totalStatistics.mockTests'), 
//         value: stats.totalMockTests, 
//         maxValue: maxActivityValue,
//         color: '#10b981',
//         formattedValue: stats.totalMockTests,
//         type: 'activity'
//       },
//       { 
//         label: t('totalStatistics.classroomActivities'), 
//         value: stats.totalActivitiesCompleted, 
//         maxValue: maxActivityValue,
//         color: '#8b5cf6',
//         formattedValue: stats.totalActivitiesCompleted,
//         type: 'activity'
//       },
//       { 
//         label: t('totalStatistics.totalStudyTime'), 
//         value: Math.round(stats.totalStudyTime / 60), 
//         maxValue: maxTimeValue,
//         color: '#f59e0b', 
//         formattedValue: formatTime(stats.totalStudyTime),
//         type: 'time'
//       },
//       { 
//         label: t('statCards.activitiesCompleted'), 
//         value: stats.activities_completed || 0, 
//         maxValue: maxActivityValue,
//         color: '#ef4444',
//         formattedValue: stats.activities_completed || 0,
//         type: 'activity'
//       },
//       { 
//         label: t('statCards.productivityScore'), 
//         value: stats.productivity_score || 0, 
//         maxValue: maxScoreValue,
//         color: '#06b6d4',
//         formattedValue: `${stats.productivity_score || 0}/10`,
//         type: 'score'
//       }
//     ];

//     return (
//       <div className="analytics-graph">
//         <h3>📈 {t('tabs.title')}</h3>
//         <div className="graph-container">
//           {barData.map((item, index) => (
//             <div key={index} className="bar-item">
//               <div className="bar-label">
//                 <span className="bar-label-text">{item.label}</span>
//                 <span className="bar-value-mobile">{item.formattedValue}</span>
//               </div>
//               <div className="bar-container">
//                 <div
//                   className="bar-fill"
//                   style={{
//                     width: `${Math.max((item.value / item.maxValue) * 100, 3)}%`, // Minimum 3% width
//                     backgroundColor: item.color
//                   }}
//                 >
//                   <span className="bar-value-inside">{item.formattedValue}</span>
//                 </div>
//               </div>
//               <span className="bar-value-desktop">{item.formattedValue}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Time Breakdown Component
//   const TimeBreakdown = ({ breakdown }) => (
//     <div className="time-breakdown">
//       <h4>⏱️ {t('timeBreakdown.title')}</h4>
//       <div className="breakdown-bars">
//         <div className="breakdown-item">
//           <span className="breakdown-label">{t('timeBreakdown.quizzes')}</span>
//           <div className="breakdown-bar">
//             <div
//               className="breakdown-fill quiz-fill"
//               style={{ width: `${breakdown.total > 0 ? (breakdown.quiz / breakdown.total) * 100 : 0}%` }}
//             ></div>
//           </div>
//           <span className="breakdown-time">{formatTime(breakdown.quiz)}</span>
//         </div>
//         <div className="breakdown-item">
//           <span className="breakdown-label">{t('timeBreakdown.mockTests')}</span>
//           <div className="breakdown-bar">
//             <div
//               className="breakdown-fill mock-fill"
//               style={{ width: `${breakdown.total > 0 ? (breakdown.mock / breakdown.total) * 100 : 0}%` }}
//             ></div>
//           </div>
//           <span className="breakdown-time">{formatTime(breakdown.mock)}</span>
//         </div>
//         <div className="breakdown-item">
//           <span className="breakdown-label">{t('timeBreakdown.learningActivities')}</span>
//           <div className="breakdown-bar">
//             <div
//               className="breakdown-fill lesson-fill"
//               style={{ width: `${breakdown.total > 0 ? (breakdown.lesson / breakdown.total) * 100 : 0}%` }}
//             ></div>
//           </div>
//           <span className="breakdown-time">{formatTime(breakdown.lesson)}</span>
//         </div>
//       </div>
//     </div>
//   );

//   // UPDATED: Total Statistics Component with formatted time
//   const TotalStatistics = ({ stats }) => {
//     return (
//       <div className="total-statistics">
//         <h3>📊 {t('totalStatistics.title')}</h3>
//         <div className="stats-grid total-stats-grid">
//           <div className="total-stat-item">
//             <span className="total-stat-value">{stats.totalQuizzes}</span>
//             <span className="total-stat-label">{t('totalStatistics.totalQuizzes')}</span>
//           </div>
//           <div className="total-stat-item">
//             <span className="total-stat-value">{stats.totalMockTests}</span>
//             <span className="total-stat-label">{t('totalStatistics.mockTests')}</span>
//           </div>
//           <div className="total-stat-item">
//             <span className="total-stat-value">{stats.totalActivitiesCompleted}</span>
//             <span className="total-stat-label">{t('totalStatistics.classroomActivities')}</span>
//           </div>
//           <div className="total-stat-item">
//             <span className="total-stat-value">{formatTime(stats.totalStudyTime)}</span>
//             <span className="total-stat-label">{t('totalStatistics.totalStudyTime')}</span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) return (
//     <div className="loading-container">
//       <div className="loading-spinner"></div>
//       <p>{t('common.loading')}</p>
//     </div>
//   );

//   if (error) return (
//     <div className="error-container">
//       <div className="error-icon">⚠️</div>
//       <h3>{t('errors.somethingWentWrong')}</h3>
//       <p>{error}</p>
//       <button className="retry-btn" onClick={() => window.location.reload()}>
//         {t('common.tryAgain')}
//       </button>
//     </div>
//   );

//   return (
//     <div className="learning-reports">
//       <div className="reports-header"><br></br><br></br>
//         <h1>{t('title')}</h1>
//         <p>{t('subtitle')}</p>
//       </div>

//       {/* Total Statistics - Always Visible */}
//       {dailyReport?.total_statistics && (
//         <TotalStatistics stats={dailyReport.total_statistics} />
//       )}

//       {/* Tab Navigation */}
//       <div className="tabs-container">
//         <div className="tabs">
//           <button
//             className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
//             onClick={() => setActiveTab('daily')}
//           >
//             📊 {t('tabs.dailyReport')}
//           </button>
//           <button
//             className={`tab ${activeTab === 'weekly' ? 'active' : ''}`}
//             onClick={() => setActiveTab('weekly')}
//           >
//             📈 {t('tabs.weeklyReport')}
//           </button>
//           {/* UPDATED: Analytics Tab */}
//           <button
//             className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
//             onClick={() => setActiveTab('analytics')}
//           >
//             📊 {t('tabs.analytics')}
//           </button>
//         </div>
//       </div>

//       {/* Daily Report */}
//       {activeTab === 'daily' && dailyReport && (
//         <div className="report-container">
//           <div className="report-header">
//             <h2>{t('dailyReport.title')}</h2>
//             <span className="date-badge">{dailyReport.summary_date}</span>
//           </div>

//           <div className="stats-grid">
//             <StatCard
//               title={t('statCards.totalStudyTime')}
//               value={formatTime(dailyReport.total_study_time)}
//               subtitle={t('statCards.actualTimeSpent')}
//               icon="⏱️"
//               color="#4f46e5"
//             />
//             <StatCard
//               title={t('statCards.activitiesCompleted')}
//               value={dailyReport.activities_completed}
//               subtitle={t('statCards.tasksAccomplished')}
//               icon="✅"
//               color="#10b981"
//             />
//             <StatCard
//               title={t('statCards.productivityScore')}
//               value={`${dailyReport.productivity_score}/10`}
//               subtitle={t('statCards.todaysEfficiency')}
//               icon="🚀"
//               color="#f59e0b"
//             />
//           </div>

//           {/* UPDATED: Activities Section with enhanced display including feedback, typing, and spin wheel */}
//           <div className="activities-section">
//             <h3>📚 {t('activitiesSection.title')}</h3>
//             <div className="activities-list">
//               {dailyReport.activities.map((act, index) => {
//                 const typeInfo = getActivityTypeInfo(act.activity_type);
//                 return (
//                   <div key={index} className="activity-item">
//                     <div className="activity-icon">
//                       {act.activity_icon || typeInfo.icon}
//                     </div>
//                     <div className="activity-details">
//                       <h4>{act.activity_name}</h4>
//                       <p>
//                         {act.activity_label || typeInfo.label}
//                         {act.subject && act.subject !== 'Platform' && act.subject !== 'Rewards' && ` • ${act.subject}`}
//                         {act.chapter && act.chapter !== 'Feedback' && act.chapter !== 'Keyboard Skills' && act.chapter !== 'Daily Bonus' && ` • ${act.chapter}`}
//                         {act.rating && ` • ${t('activityDetails.rating')}: ${act.rating}/5`}
//                         {act.speed && ` • ${t('activityDetails.speed')}: ${act.speed} WPM`}
//                         {act.accuracy && ` • ${t('activityDetails.accuracy')}: ${act.accuracy}%`}
//                         {act.difficulty && ` • ${t('activityDetails.level')}: ${act.difficulty}`}
//                         {act.rewardName && ` • ${t('activityDetails.reward')}: ${act.rewardName}`}
//                         {act.rewardValue > 0 && ` • ${t('activityDetails.points')}: +${act.rewardValue}`}
//                         {act.spinsRemaining !== undefined && ` • ${t('activityDetails.spinsLeft')}: ${act.spinsRemaining}`}
//                         {` • ${formatTime(act.duration_minutes)}`}
//                         {act.score && ` • ${t('activityDetails.score')}: ${act.score}%`}
//                         {act.rewardPoints && act.rewardPoints > 0 && ` • +${act.rewardPoints} ${t('common.points')}`}
//                       </p>
//                     </div>
//                     <div className="activity-time">
//                       {new Date(act.timestamp).toLocaleTimeString([], {
//                         hour: '2-digit',
//                         minute: '2-digit'
//                       })}
//                     </div>
//                   </div>
//                 );
//               })}
//               {dailyReport.activities.length === 0 && (
//                 <div className="no-activities">
//                   <p>{t('activitiesSection.noActivities')}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Weekly Report */}
//       {activeTab === 'weekly' && weeklyReport && (
//         <div className="report-container">
//           <div className="report-header">
//             <h2>{t('weeklyReport.title')}</h2>
//             <span className="date-badge">
//               {weeklyReport.week_start} {t('common.to')} {weeklyReport.week_end}
//             </span>
//           </div>

//           <div className="stats-grid">
//             <StatCard
//               title={t('statCards.totalStudyTime')}
//               value={formatTime(weeklyReport.weekly_total_time)}
//               subtitle={t('statCards.thisWeeksTotal')}
//               icon="⏱️"
//               color="#4f46e5"
//             />
//             <StatCard
//               title={t('statCards.activitiesCompleted')}
//               value={weeklyReport.weekly_total_activities}
//               subtitle={t('statCards.weeklyTasks')}
//               icon="✅"
//               color="#10b981"
//             />
//             <StatCard
//               title={t('statCards.averageDailyTime')}
//               value={formatTime(weeklyReport.average_daily_time)}
//               subtitle={t('statCards.dailyAverage')}
//               icon="📅"
//               color="#8b5cf6"
//             />
//             <StatCard
//               title={t('statCards.consistencyScore')}
//               value={`${weeklyReport.consistency_score}/10`}
//               subtitle={t('statCards.learningConsistency')}
//               icon="🔥"
//               color="#f59e0b"
//             />
//           </div>

//           <div className="content-grid">
//             <div className="insights-card">
//               <h3>💡 {t('weeklyReport.insights')}</h3>
//               <div className="insights-list">
//                 {weeklyReport.weekly_insights.map((insight, index) => (
//                   <div key={index} className="insight-item">
//                     <span className="insight-icon">💡</span>
//                     <span>{insight}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="progress-card">
//               <h3>📊 {t('weeklyReport.consistencyProgress')}</h3>
//               <ProgressBar
//                 score={weeklyReport.consistency_score}
//                 color="#8b5cf6"
//               />
//               <p>{t('weeklyReport.consistencyDescription')}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* UPDATED: Analytics Tab - Only shows the graph */}
//       {activeTab === 'analytics' && dailyReport && (
//         <div className="report-container analytics-only">
//           <div className="report-header">
//             <h2>{t('tabs.title')}</h2>
//             <span className="date-badge">{dailyReport.summary_date}</span>
//           </div>

//           <div className="analytics-content">
//             <AnalyticsGraph 
//               stats={{
//                 ...dailyReport.total_statistics,
//                 activities_completed: dailyReport.activities_completed,
//                 productivity_score: dailyReport.productivity_score
//               }} 
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LearningReports;











import React, { useState, useEffect } from 'react';
import './SummaryDaily.css';
import { useQuiz } from './QuizContext';
import { useScreenTime } from './ScreenTime';
import { useTranslation } from 'react-i18next';

const LearningReports = () => {
  const { t } = useTranslation();
  const [dailyReport, setDailyReport] = useState(null);
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('daily');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  
  // Get quiz and lesson data from context
  const {
    quizResults,
    mockTestResults,
    getQuizHistory,
    getMockHistory,
    getLessonHistory,
    rewardPoints,
  } = useQuiz();
  
  // Get screen time data
  const {
    screenTime,
    getTodayScreenTime,
    getWeeklyScreenTime,
    getTotalScreenTime,
    getTimeBreakdown,
    getTodayActivities,
    getScreenTimeByDate
  } = useScreenTime();

  const quizHistory = getQuizHistory();
  const mockHistory = getMockHistory();
  const lessonHistory = getLessonHistory();

  // UPDATED: Function to get activity type icon and label with translation
  const getActivityTypeInfo = (activityType) => {
    const types = {
      'video': { icon: '🎥', label: t('activityTypes.video') },
      'ai_assistant': { icon: '🤖', label: t('activityTypes.ai_assistant') },
      'notes': { icon: '📝', label: t('activityTypes.notes') },
      'quick_practice': { icon: '⚡', label: t('activityTypes.quick_practice') },
      'feedback': { icon: '💬', label: t('activityTypes.feedback') },
      'typing_practice': { icon: '⌨️', label: t('activityTypes.typing_practice') },
      'spin_wheel': { icon: '🎰', label: t('activityTypes.spin_wheel') },
      'quiz': { icon: '📝', label: t('activityTypes.quiz') },
      'practice': { icon: '🧠', label: t('activityTypes.practice') },
      'general': { icon: '📖', label: t('activityTypes.general') }
    };
    return types[activityType] || { icon: '📖', label: t('activityTypes.general') };
  };

  // UPDATED: Format time to hours and minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // UPDATED: Format date for display
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // UPDATED: Check if date is today
  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  // UPDATED: Calculate learning statistics for specific date
  const calculateLearningStats = (date = currentDate) => {
    // Get actual time breakdown from screenTime
    const timeBreakdown = getTimeBreakdown(date);
    const todayActivities = getTodayActivities();
    
    // Calculate actual time for each activity type
    const quizTime = timeBreakdown.quiz;
    const mockTime = timeBreakdown.mock;
    const lessonTime = timeBreakdown.lesson;
    const totalStudyTime = timeBreakdown.total;
    
    // Count activities for specific date
    const todayQuizAttempts = quizHistory.filter(item => item.date === date);
    const todayMockAttempts = mockHistory.filter(item => item.date === date);
   
    // Get all completed activities for specific date
    const todayActivitiesCompleted = lessonHistory.filter(item =>
      item.date === date && item.completed === true
    );
   
    const totalActivitiesCompleted =
      todayQuizAttempts.length +
      todayMockAttempts.length +
      todayActivitiesCompleted.length;
    
    // UPDATED: Calculate productivity score - MUCH HARDER calculation
    const productivityScore = Math.min(10,
      Math.floor((totalStudyTime / 180) * 2) + // 1 point per 90 minutes (much harder)
      Math.floor(totalActivitiesCompleted * 0.3) // 0.3 points per activity (much harder)
    );

    return {
      totalActivitiesCompleted,
      totalStudyTime,
      productivityScore,
      todayQuizAttempts,
      todayMockAttempts,
      todayActivitiesCompleted,
      quizTime,
      mockTime,
      lessonTime,
      actualScreenTime: getScreenTimeByDate ? getScreenTimeByDate(date) : getTodayScreenTime(),
      timeBreakdown
    };
  };

  // UPDATED: Calculate weekly statistics with week offset
  const calculateWeeklyStats = (weekOffset = currentWeekOffset) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (weekOffset * 7));
    const weekEnd = new Date(targetDate);
    const weekStart = new Date(targetDate);
    weekStart.setDate(weekStart.getDate() - 6);
    
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];
    
    // Calculate weekly totals from screenTime activities
    let weeklyTotalTime = 0;
    const dailyBreakdown = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(weekEnd);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
     
      // Get time breakdown for each day
      const dayTimeBreakdown = getTimeBreakdown(dateStr);
      const dayTotalTime = dayTimeBreakdown.total;
      weeklyTotalTime += dayTotalTime;
     
      const dayQuiz = quizHistory.filter(item => item.date === dateStr);
      const dayMock = mockHistory.filter(item => item.date === dateStr);
      const dayActivities = lessonHistory.filter(item =>
        item.date === dateStr && item.completed === true
      );
     
      const dayTotalActivities = dayQuiz.length + dayMock.length + dayActivities.length;
      dailyBreakdown.push({
        date: dateStr,
        total_study_time: dayTotalTime,
        activities_completed: dayTotalActivities,
        time_breakdown: dayTimeBreakdown
      });
    }

    // Filter this week's activities
    const weekQuizAttempts = quizHistory.filter(item => item.date >= weekStartStr && item.date <= weekEndStr);
    const weekMockAttempts = mockHistory.filter(item => item.date >= weekStartStr && item.date <= weekEndStr);
    const weekActivitiesCompleted = lessonHistory.filter(item =>
      item.date >= weekStartStr && item.date <= weekEndStr && item.completed === true
    );
    
    // Calculate weekly totals
    const weeklyTotalActivities =
      weekQuizAttempts.length +
      weekMockAttempts.length +
      weekActivitiesCompleted.length;
    
    // Calculate average daily time
    const averageDailyTime = Math.round(weeklyTotalTime / 7);
    
    // Calculate consistency score (days with activities / 7 days)
    const activityDays = new Set([
      ...weekQuizAttempts.map(item => item.date),
      ...weekMockAttempts.map(item => item.date),
      ...weekActivitiesCompleted.map(item => item.date)
    ]).size;
    
    const consistencyScore = Math.min(10, Math.floor((activityDays / 7) * 10));

    return {
      week_start: weekStartStr,
      week_end: weekEndStr,
      weekly_total_activities: weeklyTotalActivities,
      weekly_total_time: weeklyTotalTime,
      average_daily_time: averageDailyTime,
      consistency_score: consistencyScore,
      daily_breakdown: dailyBreakdown
    };
  };

  // Generate recommendations based on actual activity
  const generateRecommendations = (stats) => {
    const recommendations = [];
   
    if (stats.totalStudyTime === 0) {
      recommendations.push(t('recommendations.startJourney'));
      recommendations.push(t('recommendations.shortStudy'));
    } else if (stats.totalStudyTime < 30) {
      recommendations.push(t('recommendations.greatStart'));
      recommendations.push(t('recommendations.consistentShort'));
    } else if (stats.totalStudyTime < 60) {
      recommendations.push(t('recommendations.excellentFocus'));
      recommendations.push(t('recommendations.mixActivities'));
    } else {
      recommendations.push(t('recommendations.outstandingDedication'));
      recommendations.push(t('recommendations.excellentProgress'));
    }

    if (stats.quizTime === 0) {
      recommendations.push(t('recommendations.tryQuiz'));
    }
    if (stats.lessonTime === 0) {
      recommendations.push(t('recommendations.watchLesson'));
    }
    if (stats.mockTime === 0) {
      recommendations.push(t('recommendations.attemptMock'));
    }

    return recommendations;
  };

  // Generate weekly insights
  const generateWeeklyInsights = (weeklyStats) => {
    const insights = [];
   
    if (weeklyStats.weekly_total_time > 300) { // 5+ hours
      insights.push(t('weeklyInsights.outstandingDedication'));
    } else if (weeklyStats.weekly_total_time > 180) { // 3+ hours
      insights.push(t('weeklyInsights.greatConsistency'));
    } else if (weeklyStats.weekly_total_time > 60) { // 1+ hour
      insights.push(t('weeklyInsights.goodProgress'));
    } else {
      insights.push(t('weeklyInsights.everyMinuteCounts'));
    }

    if (weeklyStats.consistency_score >= 8) {
      insights.push(t('weeklyInsights.excellentConsistency'));
    } else if (weeklyStats.consistency_score >= 5) {
      insights.push(t('weeklyInsights.goodConsistency'));
    }

    insights.push(t('weeklyInsights.timeSpent', { minutes: Math.round(weeklyStats.weekly_total_time) }));
    insights.push(t('weeklyInsights.activitiesCompleted', { 
      activities: weeklyStats.weekly_total_activities, 
      days: weeklyStats.consistency_score 
    }));

    return insights;
  };

  // UPDATED: Function to get total statistics from context with enhanced activity tracking
  const getTotalStatistics = () => {
    // Get actual total study time from screenTime
    const totalStudyTime = getTotalScreenTime();
   
    // Total quizzes and mock tests from context
    const totalQuizzes = quizResults.totalQuizzes || quizHistory.length || 0;
    const totalMockTests = mockTestResults.totalTests || mockHistory.length || 0;
   
    // Total questions answered
    const totalQuizQuestions = quizResults.totalQuestions || quizHistory.reduce((total, quiz) => total + (quiz.questionsCount || 0), 0);
    const totalMockQuestions = mockTestResults.totalQuestions || mockHistory.reduce((total, mock) => total + (mock.questionsCount || 0), 0);
    const totalQuestions = totalQuizQuestions + totalMockQuestions;
   
    // UPDATED: Total learning activities completed (EXCLUDE feedback, typing, AND spin wheel activities)
    const totalActivitiesCompleted = lessonHistory.filter(activity =>
      activity.completed === true &&
      activity.activityType !== 'feedback' &&
      activity.activityType !== 'typing_practice' &&
      activity.activityType !== 'spin_wheel'
    ).length;

    return {
      totalQuizzes,
      totalMockTests,
      totalQuestions,
      totalActivitiesCompleted,
      totalStudyTime,
      rewardPoints
    };
  };

  // NEW: Function to refresh data for real-time updates
  const refreshData = () => {
    const dailyStats = calculateLearningStats(currentDate);
    const weeklyStats = calculateWeeklyStats(currentWeekOffset);
    const totalStats = getTotalStatistics();

    const localDailyReport = {
      summary_date: currentDate,
      total_study_time: dailyStats.totalStudyTime,
      activities_completed: dailyStats.totalActivitiesCompleted,
      productivity_score: dailyStats.productivityScore,
      recommendations: generateRecommendations(dailyStats),
      summary_text: t('dailySummary.text', {
        minutes: dailyStats.totalStudyTime,
        activities: dailyStats.totalActivitiesCompleted,
        quizzes: dailyStats.todayQuizAttempts.length,
        mocks: dailyStats.todayMockAttempts.length,
        learning: dailyStats.todayActivitiesCompleted.length
      }),
      activities: [
        ...dailyStats.todayQuizAttempts.map(quiz => ({
          activity_type: 'quiz',
          activity_name: `${quiz.subject} ${t('activityTypes.quiz')} - ${quiz.topic}`,
          duration_minutes: Math.round(dailyStats.quizTime / Math.max(dailyStats.todayQuizAttempts.length, 1)),
          timestamp: quiz.timestamp || new Date().toISOString(),
          score: quiz.score
        })),
        ...dailyStats.todayMockAttempts.map(mock => ({
          activity_type: 'practice',
          activity_name: `${mock.subject} ${t('activityTypes.practice')} - ${mock.topic}`,
          duration_minutes: Math.round(dailyStats.mockTime / Math.max(dailyStats.todayMockAttempts.length, 1)),
          timestamp: mock.timestamp || new Date().toISOString(),
          score: mock.score
        })),
        ...dailyStats.todayActivitiesCompleted.map(activity => {
          const typeInfo = getActivityTypeInfo(activity.activityType);
          return {
            activity_type: activity.activityType || 'general',
            activity_name: activity.title || `${activity.subject} - ${activity.chapter}`,
            duration_minutes: activity.duration || 15,
            timestamp: activity.timestamp || new Date().toISOString(),
            rewardPoints: activity.rewardPoints || 0,
            activity_icon: typeInfo.icon,
            activity_label: typeInfo.label,
            subject: activity.subject,
            chapter: activity.chapter,
            rating: activity.rating,
            comment: activity.comment,
            speed: activity.speed,
            accuracy: activity.accuracy,
            difficulty: activity.difficulty,
            keystrokes: activity.keystrokes,
            rewardName: activity.rewardName,
            rewardValue: activity.rewardValue,
            spinsRemaining: activity.spinsRemaining
          };
        })
      ],
      total_statistics: totalStats,
      time_breakdown: dailyStats.timeBreakdown
    };

    const localWeeklyReport = {
      week_start: weeklyStats.week_start,
      week_end: weeklyStats.week_end,
      weekly_total_time: weeklyStats.weekly_total_time,
      weekly_total_activities: weeklyStats.weekly_total_activities,
      average_daily_time: weeklyStats.average_daily_time,
      consistency_score: weeklyStats.consistency_score,
      weekly_insights: generateWeeklyInsights(weeklyStats),
      daily_breakdown: weeklyStats.daily_breakdown,
      total_statistics: totalStats
    };

    setDailyReport(localDailyReport);
    setWeeklyReport(localWeeklyReport);
  };

  // NEW: Navigation functions
  const goToPreviousDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    const today = new Date().toISOString().split('T')[0];
    const newDate = date.toISOString().split('T')[0];
    
    // Don't allow navigating to future dates
    if (newDate <= today) {
      setCurrentDate(newDate);
    }
  };

  const goToPreviousWeek = () => {
    setCurrentWeekOffset(prev => prev + 1);
  };

  const goToNextWeek = () => {
    setCurrentWeekOffset(prev => Math.max(0, prev - 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date().toISOString().split('T')[0]);
    setCurrentWeekOffset(0);
  };

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        refreshData();
      } catch (err) {
        setError(t('errors.failedToGenerate'));
        console.error('Error generating reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    
    // NEW: Set up interval for real-time updates
    const intervalId = setInterval(() => {
      if (activeTab === 'analytics' || activeTab === 'daily') {
        refreshData();
      }
    }, 60000); // Update every minute

    // NEW: Add event listener for real-time updates when new activities are completed
    const handleStorageUpdate = () => {
      refreshData();
    };
    
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      clearInterval(intervalId);
    };
  }, [quizHistory, mockHistory, lessonHistory, quizResults, mockTestResults, rewardPoints, screenTime, t, activeTab, currentDate, currentWeekOffset]);

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-content">
        <div className="stat-icon" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className="stat-text">
          <h3>{value}</h3>
          <p className="stat-title">{title}</p>
          <p className="stat-subtitle">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ score, maxScore = 10, color }) => (
    <div className="progress-container">
      <div className="progress-header">
        <span>{t('common.progress')}</span>
        <span>{score}/{maxScore}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${(score / maxScore) * 100}%`,
            backgroundColor: color
          }}
        ></div>
      </div>
    </div>
  );

  // UPDATED: Date Navigation Component
  const DateNavigation = ({ date, onPrevious, onNext, onToday, showTodayButton = true }) => {
    const isCurrentDateToday = isToday(date);
    
    return (
      <div className="date-navigation">
        <button 
          className="nav-arrow prev-arrow" 
          onClick={onPrevious}
          title="Previous day"
        >
          ◀
        </button>
        
        <div className="date-display">
          <span className="date-text">{formatDisplayDate(date)}</span>
          {isCurrentDateToday && <span className="today-badge">Today</span>}
        </div>
        
        <button 
          className={`nav-arrow next-arrow ${isCurrentDateToday ? 'disabled' : ''}`}
          onClick={onNext}
          disabled={isCurrentDateToday}
          title={isCurrentDateToday ? "You're viewing today" : "Next day"}
        >
          ▶
        </button>
        
        {showTodayButton && !isCurrentDateToday && (
          <button 
            className="today-button"
            onClick={onToday}
            title="Go to today"
          >
            Today
          </button>
        )}
      </div>
    );
  };

  // UPDATED: Week Navigation Component
  const WeekNavigation = ({ weekStart, weekEnd, onPrevious, onNext, onToday, showTodayButton = true }) => {
    const isCurrentWeek = currentWeekOffset === 0;
    
    return (
      <div className="date-navigation">
        <button 
          className="nav-arrow prev-arrow" 
          onClick={onPrevious}
          title="Previous week"
        >
          ◀
        </button>
        
        <div className="date-display">
          <span className="date-text">
            {formatDisplayDate(weekStart)} to {formatDisplayDate(weekEnd)}
          </span>
          {isCurrentWeek && <span className="today-badge">This Week</span>}
        </div>
        
        <button 
          className={`nav-arrow next-arrow ${isCurrentWeek ? 'disabled' : ''}`}
          onClick={onNext}
          disabled={isCurrentWeek}
          title={isCurrentWeek ? "You're viewing current week" : "Next week"}
        >
          ▶
        </button>
        
        {showTodayButton && !isCurrentWeek && (
          <button 
            className="today-button"
            onClick={onToday}
            title="Go to current week"
          >
            This Week
          </button>
        )}
      </div>
    );
  };

  // UPDATED: Analytics Graph Component with proper scaling for high activity counts
  const AnalyticsGraph = ({ stats }) => {
    // UPDATED: Separate scaling for different types of metrics
    const activityMetrics = [
      stats.totalQuizzes,
      stats.totalMockTests,
      stats.totalActivitiesCompleted,
      stats.activities_completed || 0
    ];
    
    const timeMetrics = [
      Math.round(stats.totalStudyTime / 60) // Convert minutes to hours
    ];
    
    const scoreMetrics = [
      stats.productivity_score || 0
    ];
    
    // UPDATED: Use different max values for different metric types
    const maxActivityValue = Math.max(...activityMetrics, 50); // Cap at 50 for better scaling
    const maxTimeValue = Math.max(...timeMetrics, 10); // Cap at 10 hours for better scaling
    const maxScoreValue = Math.max(...scoreMetrics, 10); // Cap at 10 for scores

    const barData = [
      { 
        label: t('totalStatistics.totalQuizzes'), 
        value: stats.totalQuizzes, 
        maxValue: maxActivityValue,
        color: '#4f46e5',
        formattedValue: stats.totalQuizzes,
        type: 'activity'
      },
      { 
        label: t('totalStatistics.mockTests'), 
        value: stats.totalMockTests, 
        maxValue: maxActivityValue,
        color: '#10b981',
        formattedValue: stats.totalMockTests,
        type: 'activity'
      },
      { 
        label: t('totalStatistics.classroomActivities'), 
        value: stats.totalActivitiesCompleted, 
        maxValue: maxActivityValue,
        color: '#8b5cf6',
        formattedValue: stats.totalActivitiesCompleted,
        type: 'activity'
      },
      { 
        label: t('totalStatistics.totalStudyTime'), 
        value: Math.round(stats.totalStudyTime / 60), 
        maxValue: maxTimeValue,
        color: '#f59e0b', 
        formattedValue: formatTime(stats.totalStudyTime),
        type: 'time'
      },
      { 
        label: t('statCards.activitiesCompleted'), 
        value: stats.activities_completed || 0, 
        maxValue: maxActivityValue,
        color: '#ef4444',
        formattedValue: stats.activities_completed || 0,
        type: 'activity'
      },
      { 
        label: t('statCards.productivityScore'), 
        value: stats.productivity_score || 0, 
        maxValue: maxScoreValue,
        color: '#06b6d4',
        formattedValue: `${stats.productivity_score || 0}/10`,
        type: 'score'
      }
    ];

    return (
      <div className="analytics-graph">
        <h3>📈 {t('tabs.title')}</h3>
        <div className="graph-container">
          {barData.map((item, index) => (
            <div key={index} className="bar-item">
              <div className="bar-label">
                <span className="bar-label-text">{item.label}</span>
                <span className="bar-value-mobile">{item.formattedValue}</span>
              </div>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.max((item.value / item.maxValue) * 100, 3)}%`, // Minimum 3% width
                    backgroundColor: item.color
                  }}
                >
                  <span className="bar-value-inside">{item.formattedValue}</span>
                </div>
              </div>
              <span className="bar-value-desktop">{item.formattedValue}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Time Breakdown Component
  const TimeBreakdown = ({ breakdown }) => (
    <div className="time-breakdown">
      <h4>⏱️ {t('timeBreakdown.title')}</h4>
      <div className="breakdown-bars">
        <div className="breakdown-item">
          <span className="breakdown-label">{t('timeBreakdown.quizzes')}</span>
          <div className="breakdown-bar">
            <div
              className="breakdown-fill quiz-fill"
              style={{ width: `${breakdown.total > 0 ? (breakdown.quiz / breakdown.total) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="breakdown-time">{formatTime(breakdown.quiz)}</span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">{t('timeBreakdown.mockTests')}</span>
          <div className="breakdown-bar">
            <div
              className="breakdown-fill mock-fill"
              style={{ width: `${breakdown.total > 0 ? (breakdown.mock / breakdown.total) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="breakdown-time">{formatTime(breakdown.mock)}</span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">{t('timeBreakdown.learningActivities')}</span>
          <div className="breakdown-bar">
            <div
              className="breakdown-fill lesson-fill"
              style={{ width: `${breakdown.total > 0 ? (breakdown.lesson / breakdown.total) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="breakdown-time">{formatTime(breakdown.lesson)}</span>
        </div>
      </div>
    </div>
  );

  // UPDATED: Total Statistics Component with formatted time
  const TotalStatistics = ({ stats }) => {
    return (
      <div className="total-statistics">
        <h3>📊 {t('totalStatistics.title')}</h3>
        <div className="stats-grid total-stats-grid">
          <div className="total-stat-item">
            <span className="total-stat-value">{stats.totalQuizzes}</span>
            <span className="total-stat-label">{t('totalStatistics.totalQuizzes')}</span>
          </div>
          <div className="total-stat-item">
            <span className="total-stat-value">{stats.totalMockTests}</span>
            <span className="total-stat-label">{t('totalStatistics.mockTests')}</span>
          </div>
          <div className="total-stat-item">
            <span className="total-stat-value">{stats.totalActivitiesCompleted}</span>
            <span className="total-stat-label">{t('totalStatistics.classroomActivities')}</span>
          </div>
          <div className="total-stat-item">
            <span className="total-stat-value">{formatTime(stats.totalStudyTime)}</span>
            <span className="total-stat-label">{t('totalStatistics.totalStudyTime')}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{t('common.loading')}</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>{t('errors.somethingWentWrong')}</h3>
      <p>{error}</p>
      <button className="retry-btn" onClick={() => window.location.reload()}>
        {t('common.tryAgain')}
      </button>
    </div>
  );

  return (
    <div className="learning-reports">
      <div className="reports-header"><br></br><br></br>
        <h1>{t('title')}</h1>
        <p>{t('subtitle')}</p>
      </div>

      {/* Total Statistics - Always Visible */}
      {dailyReport?.total_statistics && (
        <TotalStatistics stats={dailyReport.total_statistics} />
      )}

      {/* Tab Navigation */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            📊 {t('tabs.dailyReport')}
          </button>
          <button
            className={`tab ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            📈 {t('tabs.weeklyReport')}
          </button>
          {/* UPDATED: Analytics Tab */}
          <button
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 {t('tabs.analytics')}
          </button>
        </div>
      </div>

      {/* Daily Report */}
      {activeTab === 'daily' && dailyReport && (
        <div className="report-container">
          <div className="report-header">
            <h2>{t('dailyReport.title')}</h2>
            <DateNavigation
              date={currentDate}
              onPrevious={goToPreviousDay}
              onNext={goToNextDay}
              onToday={goToToday}
            />
          </div>

          <div className="stats-grid">
            <StatCard
              title={t('statCards.totalStudyTime')}
              value={formatTime(dailyReport.total_study_time)}
              subtitle={t('statCards.actualTimeSpent')}
              icon="⏱️"
              color="#4f46e5"
            />
            <StatCard
              title={t('statCards.activitiesCompleted')}
              value={dailyReport.activities_completed}
              subtitle={t('statCards.tasksAccomplished')}
              icon="✅"
              color="#10b981"
            />
            <StatCard
              title={t('statCards.productivityScore')}
              value={`${dailyReport.productivity_score}/10`}
              subtitle={t('statCards.todaysEfficiency')}
              icon="🚀"
              color="#f59e0b"
            />
          </div>

          {/* UPDATED: Activities Section with enhanced display including feedback, typing, and spin wheel */}
          <div className="activities-section">
            <h3>📚 {t('activitiesSection.title')}</h3>
            <div className="activities-list">
              {dailyReport.activities.map((act, index) => {
                const typeInfo = getActivityTypeInfo(act.activity_type);
                return (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {act.activity_icon || typeInfo.icon}
                    </div>
                    <div className="activity-details">
                      <h6>{act.activity_name}</h6>
                      <p>
                        {act.activity_label || typeInfo.label}
                        {act.subject && act.subject !== 'Platform' && act.subject !== 'Rewards' && ` • ${act.subject}`}
                        {act.chapter && act.chapter !== 'Feedback' && act.chapter !== 'Keyboard Skills' && act.chapter !== 'Daily Bonus' && ` • ${act.chapter}`}
                        {act.rating && ` • ${t('activityDetails.rating')}: ${act.rating}/5`}
                        {act.speed && ` • ${t('activityDetails.speed')}: ${act.speed} WPM`}
                        {act.accuracy && ` • ${t('activityDetails.accuracy')}: ${act.accuracy}%`}
                        {act.difficulty && ` • ${t('activityDetails.level')}: ${act.difficulty}`}
                        {act.rewardName && ` • ${t('activityDetails.reward')}: ${act.rewardName}`}
                        {act.rewardValue > 0 && ` • ${t('activityDetails.points')}: +${act.rewardValue}`}
                        {act.spinsRemaining !== undefined && ` • ${t('activityDetails.spinsLeft')}: ${act.spinsRemaining}`}
                        {` • ${formatTime(act.duration_minutes)}`}
                        {act.score && ` • ${t('activityDetails.score')}: ${act.score}%`}
                        {act.rewardPoints && act.rewardPoints > 0 && ` • +${act.rewardPoints} ${t('common.points')}`}
                      </p>
                    </div>
                    <div className="activity-time">
                      {new Date(act.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                );
              })}
              {dailyReport.activities.length === 0 && (
                <div className="no-activities">
                  <p>{isToday(currentDate) ? t('activitiesSection.noActivities') : 'No activities for this date'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Weekly Report */}
      {activeTab === 'weekly' && weeklyReport && (
        <div className="report-container">
          <div className="report-header">
            <h2>{t('weeklyReport.title')}</h2>
            <WeekNavigation
              weekStart={weeklyReport.week_start}
              weekEnd={weeklyReport.week_end}
              onPrevious={goToPreviousWeek}
              onNext={goToNextWeek}
              onToday={goToToday}
            />
          </div>

          <div className="stats-grid">
            <StatCard
              title={t('statCards.totalStudyTime')}
              value={formatTime(weeklyReport.weekly_total_time)}
              subtitle={t('statCards.thisWeeksTotal')}
              icon="⏱️"
              color="#4f46e5"
            />
            <StatCard
              title={t('statCards.activitiesCompleted')}
              value={weeklyReport.weekly_total_activities}
              subtitle={t('statCards.weeklyTasks')}
              icon="✅"
              color="#10b981"
            />
            <StatCard
              title={t('statCards.averageDailyTime')}
              value={formatTime(weeklyReport.average_daily_time)}
              subtitle={t('statCards.dailyAverage')}
              icon="📅"
              color="#8b5cf6"
            />
            <StatCard
              title={t('statCards.consistencyScore')}
              value={`${weeklyReport.consistency_score}/10`}
              subtitle={t('statCards.learningConsistency')}
              icon="🔥"
              color="#f59e0b"
            />
          </div>

          <div className="content-grid">
            <div className="insights-card">
              <h3>💡 {t('weeklyReport.insights')}</h3>
              <div className="insights-list">
                {weeklyReport.weekly_insights.map((insight, index) => (
                  <div key={index} className="insight-item">
                    <span className="insight-icon">💡</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="progress-card">
              <h3>📊 {t('weeklyReport.consistencyProgress')}</h3>
              <ProgressBar
                score={weeklyReport.consistency_score}
                color="#8b5cf6"
              />
              <p>{t('weeklyReport.consistencyDescription')}</p>
            </div>
          </div>
        </div>
      )}

      {/* UPDATED: Analytics Tab - Only shows the graph */}
      {activeTab === 'analytics' && dailyReport && (
        <div className="report-container analytics-only">
          <div className="report-header">
            <h2>{t('tabs.title')}</h2>
            <DateNavigation
              date={currentDate}
              onPrevious={goToPreviousDay}
              onNext={goToNextDay}
              onToday={goToToday}
            />
          </div>

          <div className="analytics-content">
            <AnalyticsGraph 
              stats={{
                ...dailyReport.total_statistics,
                activities_completed: dailyReport.activities_completed,
                productivity_score: dailyReport.productivity_score
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningReports;