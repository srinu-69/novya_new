
// ////quiz coins working
import { createContext, useContext, useState, useEffect } from 'react';
import { submitQuizAttempt, submitMockTestAttempt, getRecentQuizAttempts, getStudentPerformance } from '../../utils/quizTracking';
import { addCoins, addCoinsForMockTest, getCoinBalance, updateStreak, awardBadge, updateDailySummary } from '../../utils/coinTracking';

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
  const [lessonHistory, setLessonHistory] = useState([]); // NEW: Lesson history state
  
  // Load user-specific data from database on mount
  useEffect(() => {
    const loadUserDataFromDatabase = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('userToken');
        if (!token) {
          console.log('ℹ️ User not authenticated, skipping database load');
          return;
        }
        
        console.log('📥 Loading user quiz data and coin balance from database...');
        
        // Load coin balance from database FIRST (database is source of truth)
        // IMPORTANT: This must happen BEFORE any localStorage reading
        try {
          const coinBalanceResponse = await getCoinBalance();
          console.log('📊 Database balance response:', coinBalanceResponse);
          
          if (coinBalanceResponse && coinBalanceResponse.balance) {
            const totalCoins = coinBalanceResponse.balance.total_coins || 0;
            console.log('✅ Database has balance:', totalCoins);
            
            // Database is source of truth - always use database balance
            localStorage.setItem('rewardPoints', totalCoins.toString());
            setRewardPoints(totalCoins);
            console.log('✅ Coin balance loaded from database and set to:', totalCoins);
            
            // Clear old localStorage reward history after successful sync
            try {
              const oldHistory = localStorage.getItem('rewardsHistory');
              if (oldHistory) {
                console.log('🧹 Clearing old localStorage reward history');
                localStorage.removeItem('rewardsHistory');
              }
            } catch (e) {
              // Ignore errors in cleanup
            }
          } else {
            // Database has no balance - clear localStorage to 0
            console.log('⚠️ Database has NO balance (empty/truncated), clearing localStorage to 0');
            const oldLocalStorage = localStorage.getItem('rewardPoints');
            console.log('📊 Old localStorage had:', oldLocalStorage);
            localStorage.setItem('rewardPoints', '0');
            setRewardPoints(0);
            
            // Clear reward history
            localStorage.removeItem('rewardsHistory');
            console.log('✅ Cleared localStorage to 0');
          }
        } catch (error) {
          console.error('❌ Error loading coin balance from database:', error);
          // If database fails, clear localStorage to avoid stale data
          console.warn('⚠️ Database error, clearing localStorage to 0');
          localStorage.setItem('rewardPoints', '0');
          setRewardPoints(0);
          localStorage.removeItem('rewardsHistory');
        }
        
        // Load recent quiz attempts from database
        try {
          const recentAttempts = await getRecentQuizAttempts(50); // Get last 50 attempts
          if (recentAttempts && recentAttempts.attempts) {
            // Separate quiz and mock test attempts
            const quizzes = recentAttempts.attempts.filter(attempt => attempt.type === 'quiz');
            const mockTests = recentAttempts.attempts.filter(attempt => attempt.type === 'mock_test');
            
            // Update quiz results from database
            if (quizzes.length > 0) {
              const totalQuizzes = quizzes.length;
              const totalScore = quizzes.reduce((sum, q) => sum + (q.score || 0), 0);
              const totalQuestions = quizzes.reduce((sum, q) => sum + (q.total_questions || 0), 0);
              
              setQuizResults({
                totalQuizzes,
                totalScore,
                totalQuestions,
                byLevel: {} // Could be calculated if needed
              });
              
              // Update quiz history
              const history = quizzes.map(q => ({
                id: q.id || Date.now(),
                class: q.class_name || q.className || 'Unknown',
                subject: q.subject || 'Unknown',
                topic: q.topic || q.subtopic || 'Unknown',
                score: q.score || 0,
                questions: q.total_questions || q.totalQuestions || 0,
                date: q.created_at || q.date || new Date().toISOString().split('T')[0]
              }));
              setQuizHistory(history);
              
              console.log('✅ Quiz data loaded from database:', { totalQuizzes, totalScore, totalQuestions });
            }
            
            // Update mock test results from database
            if (mockTests.length > 0) {
              const totalTests = mockTests.length;
              const totalScore = mockTests.reduce((sum, m) => sum + (m.score || 0), 0);
              const totalQuestions = mockTests.reduce((sum, m) => sum + (m.total_questions || m.totalQuestions || 0), 0);
              
              setMockTestResults({
                totalTests,
                totalScore,
                totalQuestions,
              });
              
              // Update mock history
              const history = mockTests.map(m => ({
                id: m.id || Date.now(),
                class: m.class_name || m.className || 'Unknown',
                subject: m.subject || 'Unknown',
                topic: m.chapter || m.topic || 'Unknown',
                score: m.score || 0,
                questions: m.total_questions || m.totalQuestions || 0,
                date: m.created_at || m.date || new Date().toISOString().split('T')[0]
              }));
              setMockHistory(history);
              
              console.log('✅ Mock test data loaded from database:', { totalTests, totalScore, totalQuestions });
            }
          }
        } catch (error) {
          console.error('❌ Error loading recent attempts from database:', error);
        }
        
        // Load lesson history from localStorage
        try {
          const savedLessonHistory = localStorage.getItem("lessonHistory");
          if (savedLessonHistory) {
            setLessonHistory(JSON.parse(savedLessonHistory));
            console.log('✅ Lesson history loaded from localStorage');
          }
        } catch (error) {
          console.error('❌ Error loading lesson history:', error);
        }
        
        // Load performance data
        try {
          const performance = await getStudentPerformance();
          if (performance) {
            console.log('✅ Performance data loaded from database:', performance);
            // Could update state with performance data if needed
          }
        } catch (error) {
          console.error('❌ Error loading performance from database:', error);
        }
        
      } catch (error) {
        console.error('❌ Error loading user data from database:', error);
      }
    };
    
    loadUserDataFromDatabase();
  }, []); // Run once on mount

  // Track if quiz is active
  const [isQuizActive, setIsQuizActive] = useState(false);

  // Reward points state and management
  // Initialize reward points to 0 (will be updated from database on mount)
  const [rewardPoints, setRewardPoints] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState({
    basePoints: 0,
    bonusPoints: 0,
    totalPoints: 0,
  });
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [hasAwardedPoints, setHasAwardedPoints] = useState(false);

  // Save rewardPoints persistently and sync across components
  useEffect(() => {
    // Only update localStorage if rewardPoints is set (not initial 0 from mount)
    // This prevents overwriting database balance with 0 on initial load
    if (rewardPoints > 0 || localStorage.getItem('rewardPoints') !== null) {
      localStorage.setItem("rewardPoints", rewardPoints.toString());
      
      // Dispatch event to sync across all components
      window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
        detail: { rewardPoints }
      }));
    }
  }, [rewardPoints]);

  // REMOVED: Initialize from localStorage - database load handles this
  // This prevents stale localStorage data from overwriting database balance

  // Function to calculate earned points - UPDATED BONUS LOGIC
  // Quiz logic (10 questions): below 5 = 0, 5-7 = 1 coin per mark, 8-10 = 1 coin per mark + 10 bonus
  // Mock test logic (50 questions): below 20 = 0, 20-39 = 1 coin per mark, 40-50 = 1 coin per mark + 10 bonus
  const calculateEarnedPoints = (score, totalQuestions, isMockTest = false) => {
    let basePoints = 0;
    let bonusPoints = 0;
    let totalPoints = 0;
    
    if (isMockTest) {
      // Mock test logic (50 questions)
      if (score < 20) {
        // Below 20: 0 coins
        basePoints = 0;
        bonusPoints = 0;
      } else if (score >= 20 && score <= 39) {
        // 20-39: 1 coin per mark
        basePoints = score;
        bonusPoints = 0;
      } else if (score >= 40 && score <= 50) {
        // 40-50: 1 coin per mark + 10 bonus
        basePoints = score;
        bonusPoints = 10;
      }
    } else {
      // Quiz logic (10 questions)
      if (score < 5) {
        // Below 5: 0 coins
        basePoints = 0;
        bonusPoints = 0;
      } else if (score >= 5 && score <= 7) {
        // 5-7: 1 coin per mark
        basePoints = score;
        bonusPoints = 0;
      } else if (score >= 8 && score <= 10) {
        // 8-10: 1 coin per mark + 10 bonus
        basePoints = score;
        bonusPoints = 10;
      }
    }
    
    totalPoints = basePoints + bonusPoints;
    
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
  // UPDATED: Don't add to localStorage here - let addCoins handle it via database
  const addEarnedPoints = (earned) => {
    if (!hasAwardedPoints && earned.totalPoints > 0) {
      // Just track that we're awarding points, don't update localStorage yet
      // The database will be the source of truth
      setEarnedPoints(earned);
      setHasAwardedPoints(true);
      setPointsAwarded(true);
      
      return true; // Points will be awarded via addCoins
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

  const updateQuizResults = async (score, totalQuestions, level, className, subject, subtopic, quizData = null) => {
    // Update local state
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

    // Save to database (if quizData provided)
    let submittedQuizData = null;
    if (quizData) {
      try {
        console.log('💾 Saving quiz results to database...');
        const response = await submitQuizAttempt(quizData);
        submittedQuizData = response; // Store response for coin reference
        console.log('✅ Quiz results saved to database successfully');
      } catch (error) {
        console.error('❌ Error saving quiz results to database:', error);
        // Don't throw - local state already updated, user can continue
      }
    }

    // Award points only if user passed and points haven't been awarded yet
    // Use new coin calculation logic (below 5 = 0 coins, 5-7 = score coins, 8-10 = score + 10 bonus)
    if (!hasAwardedPoints) {
      const earned = calculateEarnedPoints(score, totalQuestions, false); // false = not mock test
      // Only award if totalPoints > 0 (score >= 5 for quizzes)
      if (earned.totalPoints > 0) {
        // Mark that we're awarding points (prevents double awarding)
        const pointsAwarded = addEarnedPoints(earned);
        
        // Add coins to database first (database is source of truth)
        if (pointsAwarded) {
          try {
            const reason = `Quiz completed: ${score}/${totalQuestions} correct answers (Level ${level})`;
            const coinResult = await addCoins(earned.totalPoints, 'quiz', reason, submittedQuizData?.id || null, 'quiz_attempt', {
              score,
              totalQuestions,
              correctAnswers: score,
              basePoints: earned.basePoints,
              bonusPoints: earned.bonusPoints,
              class: className,
              subject: subject,
              topic: subtopic
            });
            
            if (coinResult && coinResult.balance) {
              // Update localStorage with database balance (source of truth)
              // This ensures we're always in sync with the database
              const newBalance = coinResult.balance.total_coins || 0;
              localStorage.setItem('rewardPoints', newBalance.toString());
              setRewardPoints(newBalance);
              console.log('✅ Quiz coins saved to database and balance synced:', newBalance);
              console.log(`   Points added: ${earned.totalPoints} (Base: ${earned.basePoints}, Bonus: ${earned.bonusPoints})`);
              
              // Dispatch event to sync across components
              window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
                detail: { rewardPoints: newBalance }
              }));
              
              // Dispatch quiz completed event for Career page refresh
              window.dispatchEvent(new CustomEvent('quizCompleted', {
                detail: { score, totalQuestions, type: 'quiz' }
              }));
              
              // Update streak after quiz completion
              try {
                await updateStreak();
              } catch (error) {
                console.error('❌ Error updating streak:', error);
              }
              
              // Update daily summary
              try {
                await updateDailySummary();
              } catch (error) {
                console.error('❌ Error updating daily summary:', error);
              }
              
              // Check for Quick Master badge (10+ quick practices with 80+ average score)
              try {
                const { getStudentPerformance } = await import('../../utils/quizTracking');
                const performance = await getStudentPerformance();
                if (performance && performance.quiz_stats) {
                  const totalAttempts = performance.quiz_stats.total_attempts || 0;
                  const averageScore = performance.quiz_stats.average_score || 0;
                  if (totalAttempts >= 10 && averageScore >= 80) {
                    await awardBadge('quick_master');
                  }
                }
              } catch (error) {
                console.error('❌ Error checking for Quick Master badge:', error);
              }
            } else {
              console.error('❌ Invalid coin result from database:', coinResult);
              // Reset the flag if database update failed
              setHasAwardedPoints(false);
              setPointsAwarded(false);
            }
          } catch (error) {
            console.error('❌ Error syncing coins to database:', error);
            // Reset the flag if database update failed
            setHasAwardedPoints(false);
            setPointsAwarded(false);
            // Don't throw - user can continue, but points won't be awarded
          }
        }
        
        console.log(`Points awarded for quiz: ${pointsAwarded ? 'Yes' : 'No'}, Total: ${earned.totalPoints}`);
      } else {
        console.log(`No points awarded for quiz: Score ${score}/${totalQuestions} is below minimum threshold (5)`);
      }
    }
    
    // Update streak and daily summary even if no points awarded
    try {
      await updateStreak();
      await updateDailySummary();
    } catch (error) {
      console.error('❌ Error updating streak/daily summary:', error);
    }
    
    // Dispatch quiz completed event even if no points awarded (for database sync)
    window.dispatchEvent(new CustomEvent('quizCompleted', {
      detail: { score, totalQuestions, type: 'quiz' }
    }));
  };

  const getQuizHistory = () => {
    return quizHistory;
  };

  const updateMockTestResults = async (score, totalQuestions, className, subject, chapter, mockTestData = null) => {
    // Update local state
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

    // Save to database (if mockTestData provided)
    let submittedMockTestData = null;
    if (mockTestData) {
      try {
        console.log('💾 Saving mock test results to database...');
        const response = await submitMockTestAttempt(mockTestData);
        submittedMockTestData = response; // Store response for coin reference
        console.log('✅ Mock test results saved to database successfully');
      } catch (error) {
        console.error('❌ Error saving mock test results to database:', error);
        // Don't throw - local state already updated, user can continue
      }
    }

    // Add coins to database for mock test completion (USER-SPECIFIC)
    try {
      console.log(`💰 Adding coins for mock test: score=${score}, totalQuestions=${totalQuestions}`);
      const coinResult = await addCoinsForMockTest(score, totalQuestions, submittedMockTestData || mockTestData);
      
      if (coinResult && coinResult.balance) {
        // Update localStorage with database balance (source of truth)
        const newBalance = coinResult.balance.total_coins || 0;
        const oldBalance = parseInt(localStorage.getItem('rewardPoints') || '0');
        
        localStorage.setItem('rewardPoints', newBalance.toString());
        setRewardPoints(newBalance);
        console.log(`✅ Mock test coins saved to database: ${oldBalance} → ${newBalance} (+${newBalance - oldBalance})`);
        
        // Dispatch event to sync across all components (Navbarrr, etc.)
        window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
          detail: { rewardPoints: newBalance }
        }));
        console.log('✅ Dispatched rewardPointsUpdated event');
        
        // Dispatch mock test completed event for Career page refresh
        window.dispatchEvent(new CustomEvent('mockTestCompleted', {
          detail: { score, totalQuestions, type: 'mock_test' }
        }));
        console.log('✅ Dispatched mockTestCompleted event');
        
        // Also dispatch storage event for components listening to localStorage changes
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'rewardPoints',
          newValue: newBalance.toString(),
          oldValue: oldBalance.toString()
        }));
        console.log('✅ Dispatched storage event');
      } else if (coinResult === null && score < 20) {
        // Score is below 20, no coins awarded (expected behavior)
        console.log(`ℹ️ Mock test score ${score}/${totalQuestions} is below 20, no coins awarded`);
        
        // Still refresh balance from database to ensure sync
        try {
          const { getCoinBalance } = await import('../../utils/coinTracking');
          const balanceResponse = await getCoinBalance();
          if (balanceResponse && balanceResponse.balance) {
            const currentBalance = balanceResponse.balance.total_coins || 0;
            localStorage.setItem('rewardPoints', currentBalance.toString());
            setRewardPoints(currentBalance);
            window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
              detail: { rewardPoints: currentBalance }
            }));
          }
        } catch (balanceError) {
          console.error('❌ Error refreshing balance:', balanceError);
        }
        
        // Still dispatch mock test completed event even if no coins (for database sync and Career page refresh)
        window.dispatchEvent(new CustomEvent('mockTestCompleted', {
          detail: { score, totalQuestions, type: 'mock_test' }
        }));
        console.log('✅ Mock test completed event dispatched (no coins)');
      } else {
        console.warn('⚠️ Unexpected coinResult:', coinResult);
        console.warn('⚠️ Score:', score, 'TotalQuestions:', totalQuestions);
        
        // Still try to refresh balance from database
        try {
          const { getCoinBalance } = await import('../../utils/coinTracking');
          const balanceResponse = await getCoinBalance();
          if (balanceResponse && balanceResponse.balance) {
            const currentBalance = balanceResponse.balance.total_coins || 0;
            localStorage.setItem('rewardPoints', currentBalance.toString());
            setRewardPoints(currentBalance);
            window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
              detail: { rewardPoints: currentBalance }
            }));
            console.log('✅ Refreshed balance from database:', currentBalance);
          }
        } catch (balanceError) {
          console.error('❌ Error refreshing balance:', balanceError);
        }
        
        // Still dispatch mock test completed event even on unexpected result
        window.dispatchEvent(new CustomEvent('mockTestCompleted', {
          detail: { score, totalQuestions, type: 'mock_test' }
        }));
        console.log('✅ Mock test completed event dispatched (unexpected result)');
      }
      
      // Update streak after mock test completion
      try {
        await updateStreak();
      } catch (error) {
        console.error('❌ Error updating streak:', error);
      }
      
      // Update daily summary
      try {
        await updateDailySummary();
      } catch (error) {
        console.error('❌ Error updating daily summary:', error);
      }
      
      // Check for Mock Master badge (5+ mock tests with 75+ average score)
      try {
        const { getStudentPerformance } = await import('../../utils/quizTracking');
        const performance = await getStudentPerformance();
        if (performance && performance.mock_test_stats) {
          const totalAttempts = performance.mock_test_stats.total_attempts || 0;
          const averageScore = performance.mock_test_stats.average_score || 0;
          if (totalAttempts >= 5 && averageScore >= 75) {
            await awardBadge('mock_master');
          }
        }
      } catch (error) {
        console.error('❌ Error checking for Mock Master badge:', error);
      }
    } catch (error) {
      console.error('❌ Error adding coins for mock test:', error);
      console.error('❌ Error details:', error);
      
      // Still update streak and daily summary even on error
      try {
        await updateStreak();
        await updateDailySummary();
      } catch (updateError) {
        console.error('❌ Error updating streak/daily summary:', updateError);
      }
      
      // Still try to refresh balance from database even on error
      try {
        const { getCoinBalance } = await import('../../utils/coinTracking');
        const balanceResponse = await getCoinBalance();
        if (balanceResponse && balanceResponse.balance) {
          const currentBalance = balanceResponse.balance.total_coins || 0;
          localStorage.setItem('rewardPoints', currentBalance.toString());
          setRewardPoints(currentBalance);
          window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
            detail: { rewardPoints: currentBalance }
          }));
          console.log('✅ Refreshed balance from database after error:', currentBalance);
        }
      } catch (balanceError) {
        console.error('❌ Error refreshing balance after error:', balanceError);
      }
      
      // Still dispatch mock test completed event even on error (for database sync and Career page refresh)
      window.dispatchEvent(new CustomEvent('mockTestCompleted', {
        detail: { score, totalQuestions, type: 'mock_test' }
      }));
      console.log('✅ Mock test completed event dispatched (error case)');
      // Don't throw - continue even if coin addition fails
    }
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
      
      // Save to localStorage
      localStorage.setItem("lessonHistory", JSON.stringify(updatedHistory));

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
      
      // Save to localStorage
      localStorage.setItem("lessonHistory", JSON.stringify(updatedHistory));
      
      return true;
    } catch (error) {
      console.error('Error updating lesson:', error);
      return false;
    }
  };

  // Save lessonHistory to localStorage whenever it changes
  useEffect(() => {
    if (lessonHistory.length > 0) {
      localStorage.setItem("lessonHistory", JSON.stringify(lessonHistory));
    }
  }, [lessonHistory]);

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
        trackSpinWheel,
        
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







