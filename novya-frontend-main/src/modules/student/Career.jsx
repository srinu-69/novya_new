import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ArrowUpRight, BarChart2, BookOpen, Briefcase, Clock, Compass,
  Globe, GraduationCap, Rocket, Star, Target, TrendingUp, Users, X,
  Bookmark, Award, Code, Music, Palette, Mic
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './career.css';
import { useQuiz } from './QuizContext';
import Navbar from './Navbarrr';
import { getStudentPerformance, getQuizStatistics, getRecentQuizAttempts } from '../../utils/quizTracking';
 
const Career = () => {
  const { t } = useTranslation();
  
  // Get quiz context with fallback values
  const quizContext = useQuiz();
  const { 
    quizResults = { totalQuizzes: 0, totalScore: 0, totalQuestions: 0, byLevel: {} }, 
    mockTestResults = { totalTests: 0, totalScore: 0, totalQuestions: 0 },
    getQuizHistory = () => [],
    getMockHistory = () => []
  } = quizContext || {};
  
  // Safety check for context functions
  const safeGetQuizHistory = getQuizHistory || (() => []);
  const safeGetMockHistory = getMockHistory || (() => []);
 
  useEffect(() => {
    // Hard-coded page title instead of translation key
    document.title = `Performance | NOVYA - Your Smart Learning Platform`;
  }, []);

  // Fetch logged-in user data (synchronous - no API call needed)
  useEffect(() => {
    try {
      // Get user data from localStorage first (synchronous, fast)
      const userRole = localStorage.getItem('userRole');
      const storedData = userRole === 'student' 
        ? localStorage.getItem('studentData') 
        : localStorage.getItem('parentData');
      
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
        } catch (error) {
          // Fall through to fallback data
        }
      } else {
        // Fallback user data
        setUserData({
          firstName: 'User',
          lastName: 'Name',
          email: 'user@example.com',
          userName: 'username',
          role: userRole || 'student'
        });
      }
    } catch (error) {
      // Set fallback data on error
      setUserData({
        firstName: 'User',
        lastName: 'Name',
        email: 'user@example.com',
        userName: 'username',
        role: 'student'
      });
    } finally {
      setLoadingUserData(false);
    }
  }, []);

  // Fetch dynamic quiz tracking data (optimized - single API call with timeout and caching)
  useEffect(() => {
    let isMounted = true;
    const cacheKey = 'career_quiz_data';
    const CACHE_DURATION = 60000; // 1 minute cache
    
    const fetchQuizData = async () => {
      try {
        // Start loading immediately, but don't block page rendering
        setLoadingQuizData(true);
        
        // Check cache first for faster loading
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        const cachedData = localStorage.getItem(cacheKey);
        const now = Date.now();
        
        // Use cached data if available and fresh (less than 1 minute old)
        if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_DURATION) {
          try {
            const parsedCache = JSON.parse(cachedData);
            if (parsedCache && parsedCache.attempts) {
              console.log('✅ Using cached quiz data for faster loading');
              if (isMounted) {
                calculateAndSetPerformanceData(parsedCache.attempts);
                setLoadingQuizData(false);
              }
              // Still fetch fresh data in background but don't block UI
              setTimeout(() => fetchFreshData(isMounted), 100);
              return;
            }
          } catch (cacheError) {
            console.warn('Cache parse error, fetching fresh data:', cacheError);
          }
        }
        
        // Determine child email for parent users
        const userRole = localStorage.getItem('userRole');
        const childEmail =
          userRole && userRole.toLowerCase() === 'parent'
            ? localStorage.getItem('childEmail')
            : null;

        // Reduced limit for faster API response (from 10 to 5)
        const recentAttemptsRes = await Promise.race([
          getRecentQuizAttempts(5, childEmail),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('API timeout')), 5000) // 5 second timeout
          )
        ]);
        
        if (!isMounted) return;
        
        // Calculate performance data from recent attempts
        if (recentAttemptsRes && recentAttemptsRes.attempts) {
          const attempts = recentAttemptsRes.attempts;
          
          // Cache the data for future loads
          try {
            localStorage.setItem(cacheKey, JSON.stringify(recentAttemptsRes));
            localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
          } catch (cacheError) {
            console.warn('Failed to cache data:', cacheError);
          }
          
          calculateAndSetPerformanceData(attempts);
        } else {
          setRecentQuizAttempts([]);
        }
      } catch (error) {
        console.error('❌ Error fetching quiz data:', error);
        // Don't show error to user, just use context data
        if (isMounted) {
          setQuizPerformanceData(null);
          setQuizStatisticsData(null);
          setRecentQuizAttempts([]);
        }
      } finally {
        if (isMounted) {
          setLoadingQuizData(false);
        }
      }
    };
    
    // Helper function to calculate performance data (extracted for reuse)
    const calculateAndSetPerformanceData = (attempts) => {
      // Single pass through attempts array (more efficient)
      let quizAttempts = [];
      let mockTestAttempts = [];
      let quizTotal = 0;
      let mockTestTotal = 0;
      let quizScoreSum = 0;
      let mockTestScoreSum = 0;
      
      for (const attempt of attempts) {
        if (attempt.type === 'quiz') {
          quizAttempts.push(attempt);
          quizTotal += attempt.total_questions || 0;
          quizScoreSum += attempt.score || 0;
        } else if (attempt.type === 'mock_test') {
          mockTestAttempts.push(attempt);
          mockTestTotal += attempt.total_questions || 0;
          mockTestScoreSum += attempt.score || 0;
        }
      }
      
      const quizAvg = quizAttempts.length > 0 ? quizScoreSum / quizAttempts.length : 0;
      const mockTestAvg = mockTestAttempts.length > 0 ? mockTestScoreSum / mockTestAttempts.length : 0;
      
      // Create performance data object
      const performanceData = {
        quiz_average_score: quizAvg,
        mock_test_average_score: mockTestAvg,
        total_quizzes_attempted: quizAttempts.length,
        total_mock_tests_attempted: mockTestAttempts.length,
        total_questions_answered: quizTotal,
        mock_test_questions_answered: mockTestTotal,
        overall_average_score: (quizAvg + mockTestAvg) / 2
      };
      
      // Create statistics data object
      const statisticsData = {
        total_attempts: attempts.length,
        quiz_count: quizAttempts.length,
        mock_test_count: mockTestAttempts.length,
        average_score: performanceData.overall_average_score
      };
      
      setQuizPerformanceData(performanceData);
      setQuizStatisticsData(statisticsData);
      setRecentQuizAttempts(attempts);
    };
    
    // Function to fetch fresh data in background (non-blocking)
    const fetchFreshData = async (mounted) => {
      try {
        const userRole = localStorage.getItem('userRole');
        const childEmail =
          userRole && userRole.toLowerCase() === 'parent'
            ? localStorage.getItem('childEmail')
            : null;
        
        const recentAttemptsRes = await getRecentQuizAttempts(5, childEmail);
        
        if (mounted && recentAttemptsRes && recentAttemptsRes.attempts) {
          // Update cache
          try {
            localStorage.setItem(cacheKey, JSON.stringify(recentAttemptsRes));
            localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
          } catch (cacheError) {
            // Ignore cache errors
          }
          
          // Update with fresh data
          calculateAndSetPerformanceData(recentAttemptsRes.attempts);
        }
      } catch (error) {
        // Silently fail - we already have cached/context data
        console.warn('Background data refresh failed:', error);
      }
    };

    // Start fetching (with cache check)
    fetchQuizData();
    
    return () => {
      isMounted = false;
    };
  }, []);
 
  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    successRate: 0,
    careers: 0,
    universities: 0
  });
  const [showDetails, setShowDetails] = useState(null);
  const [heroAnimation, setHeroAnimation] = useState(false);
  
  // Dynamic quiz tracking data
  const [quizPerformanceData, setQuizPerformanceData] = useState(null);
  const [quizStatisticsData, setQuizStatisticsData] = useState(null);
  const [recentQuizAttempts, setRecentQuizAttempts] = useState([]);
  const [loadingQuizData, setLoadingQuizData] = useState(true);
  
  // User data state
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
 
  const metricsRef = useRef(null);
  const futureRef = useRef(null);
 
  useEffect(() => {
    const animateValue = (start, end, duration, callback) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        callback(current);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };
 
    animateValue(0, 12500, 2000, (val) => setAnimatedStats(prev => ({...prev, students: val})));
    animateValue(0, 92, 1800, (val) => setAnimatedStats(prev => ({...prev, successRate: val})));
    animateValue(0, 350, 2200, (val) => setAnimatedStats(prev => ({...prev, careers: val})));
    animateValue(0, 2800, 2500, (val) => setAnimatedStats(prev => ({...prev, universities: val})));
 
    setTimeout(() => {
      setHeroAnimation(true);
    }, 500);
  }, []);
 
  const scrollToMetrics = () => {
    metricsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
 
 
  // Memoize quiz averages to avoid recalculating on every render
  const quizAverage = useMemo(() => 
    quizResults.totalQuestions > 0
      ? ((quizResults.totalScore / quizResults.totalQuestions) * 100).toFixed(1)
      : 0,
    [quizResults.totalQuestions, quizResults.totalScore]
  );
  
  const mockAverage = useMemo(() =>
    mockTestResults.totalQuestions > 0
      ? ((mockTestResults.totalScore / mockTestResults.totalQuestions) * 100).toFixed(1)
      : 0,
    [mockTestResults.totalQuestions, mockTestResults.totalScore]
  );

  // Memoize dynamic metrics to avoid recalculating on every render
  const dynamicQuizMetrics = useMemo(() => {
    if (!quizPerformanceData) {
      return {
        totalQuizzes: quizResults.totalQuizzes || 0,
        averageScore: parseFloat(quizAverage) || 0,
        totalQuestions: quizResults.totalQuestions || 0
      };
    }
    
    return {
      totalQuizzes: quizPerformanceData.total_quizzes_attempted || 0,
      averageScore: quizPerformanceData.quiz_average_score || 0,
      totalQuestions: quizPerformanceData.total_questions_answered || 0
    };
  }, [quizPerformanceData, quizResults, quizAverage]);

  const dynamicMockMetrics = useMemo(() => {
    if (!quizPerformanceData) {
      return {
        totalTests: mockTestResults.totalTests || 0,
        averageScore: parseFloat(mockAverage) || 0,
        totalQuestions: mockTestResults.totalQuestions || 0
      };
    }
    
    return {
      totalTests: quizPerformanceData.total_mock_tests_attempted || 0,
      averageScore: quizPerformanceData.mock_test_average_score || 0,
      totalQuestions: quizPerformanceData.mock_test_questions_answered || 0
    };
  }, [quizPerformanceData, mockTestResults, mockAverage]);

  // Memoize filtered attempts to avoid re-filtering on every render
  const quizAttemptsFromRecent = useMemo(() => 
    recentQuizAttempts.filter(attempt => attempt.type === 'quiz'),
    [recentQuizAttempts]
  );
  
  const mockTestAttemptsFromRecent = useMemo(() => 
    recentQuizAttempts.filter(attempt => attempt.type === 'mock_test'),
    [recentQuizAttempts]
  );

  // Memoize quizResults.byLevel keys/values to avoid recalculating
  const quizLevelKeys = useMemo(() => Object.keys(quizResults.byLevel || {}), [quizResults.byLevel]);
  const quizLevelValues = useMemo(() => Object.values(quizResults.byLevel || {}), [quizResults.byLevel]);

  // Memoize performance metrics array to avoid recreating on every render
  const performanceMetrics = useMemo(() => [
    {
      id: 'academic',
      // Hard-coded title instead of translation key
      title: 'Academic Performance',
      icon: <GraduationCap size={24} />,
      metrics: [
        { name: t('metrics.gpa'), value: 3.8, max: 4.0, trend: 'up' },
        { name: t('metrics.testScores'), value: 92, max: 100, trend: 'steady' },
        { name: t('metrics.courseRigor'), value: 4, max: 5, trend: 'up' }
      ],
      details: {
        description: t('academic.description'),
        strengths: [
          t('academic.strengths.0'),
          t('academic.strengths.1'),
          t('academic.strengths.2')
        ],
        recommendations: [
          t('academic.recommendations.0'),
          t('academic.recommendations.1'),
          t('academic.recommendations.2')
        ],
        chartData: {
          labels: [
            t('academic.chart.labels.math'),
            t('academic.chart.labels.science'),
            t('academic.chart.labels.english'),
            t('academic.chart.labels.history'),
            t('academic.chart.labels.foreignLang')
          ],
          datasets: [
            {
              label: t('academic.chart.datasets.yourScores'),
              data: [95, 93, 88, 85, 80],
              backgroundColor: 'rgba(102, 126, 234, 0.6)'
            },
            {
              label: t('academic.chart.datasets.classAverage'),
              data: [82, 81, 85, 78, 75],
              backgroundColor: 'rgba(200, 200, 200, 0.6)'
            }
          ]
        }
      }
    },
    {
      id: 'quiz',
      // Hard-coded title instead of translation key
      title: 'Quiz Performance',
      icon: <BookOpen size={24} />,
      metrics: [
        { name: t('metrics.totalQuizzes'), value: dynamicQuizMetrics.totalQuizzes, max: 50, trend: 'up' },
        { name: t('metrics.averageScore'), value: dynamicQuizMetrics.averageScore, unit: '%', max: 100, trend: 'up' },
        { name: t('metrics.totalQuestions'), value: dynamicQuizMetrics.totalQuestions, max: 500, trend: 'steady' }
      ],
      details: {
        description: t('quiz.description'),
        strengths: [
          t('quiz.strengths.0'),
          t('quiz.strengths.1', { count: quizLevelKeys.length }),
          t('quiz.strengths.2')
        ],
        recommendations: [
          t('quiz.recommendations.0'),
          t('quiz.recommendations.1'),
          t('quiz.recommendations.2')
        ],
        history: quizAttemptsFromRecent.length > 0 ? quizAttemptsFromRecent : safeGetQuizHistory(),
        chartData: {
          labels: quizLevelKeys.length > 0 ? quizLevelKeys : [t('quiz.chart.noData') || 'No Data'],
          datasets: [
            {
              label: t('quiz.chart.label'),
              data: quizLevelKeys.length > 0 ? quizLevelValues : [0],
              backgroundColor: 'rgba(102, 126, 234, 0.6)'
            }
          ]
        }
      }
    },
    {
      id: 'mock',
      // Hard-coded title instead of translation key
      title: 'Mock Performance',
      icon: <Clock size={24} />,
      metrics: [
        { name: t('metrics.totalTests'), value: dynamicMockMetrics.totalTests, max: 10, trend: 'up' },
        { name: t('metrics.averageScore'), value: dynamicMockMetrics.averageScore, unit: '%', max: 100, trend: 'up' },
        { name: t('metrics.totalQuestions'), value: dynamicMockMetrics.totalQuestions, max: 1000, trend: 'steady' }
      ],
      details: {
        description: t('mock.description'),
        strengths: [
          t('mock.strengths.0'),
          t('mock.strengths.1'),
          t('mock.strengths.2')
        ],
        recommendations: [
          t('mock.recommendations.0'),
          t('mock.recommendations.1'),
          t('mock.recommendations.2')
        ],
        history: mockTestAttemptsFromRecent.length > 0 ? mockTestAttemptsFromRecent : safeGetMockHistory(),
        chartData: {
          labels: [t('mock.chart.label')],
          datasets: [
            {
              // Hard-coded label instead of translation key
              label: 'Performance',
              data: [parseFloat(mockAverage) || 0],
              backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }
          ]
        }
      }
    }
  ], [t, dynamicQuizMetrics, dynamicMockMetrics, quizLevelKeys, quizLevelValues, quizAttemptsFromRecent, mockTestAttemptsFromRecent, safeGetQuizHistory, safeGetMockHistory, mockAverage]);
 
  // Compute translations safely before assigning to studentDetails
  const interestsList = t('profile.interestsList', { returnObjects: true });
  const hobbiesList = t('profile.hobbies', { returnObjects: true });
  const recentAchievementsList = t('profile.recentAchievements', { returnObjects: true });
 
  const studentDetails = {
    name: userData ? `${userData.firstName} ${userData.lastName}` : "Loading...",
    grade: userData?.grade || t('profile.grade'),
    school: userData?.school || "Your School",
    avatar: userData?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
    interests: Array.isArray(interestsList) ? interestsList : [],
    strengths: [
      { name: t('profile.strengthsList.0'), icon: <Bookmark size={16} /> },
      { name: t('profile.strengthsList.1'), icon: <Award size={16} /> },
      { name: t('profile.strengthsList.2'), icon: <Code size={16} /> }
    ],
    hobbies: Array.isArray(hobbiesList) ? hobbiesList.map((name, i) => ({
      name,
      icon: [Code, Music, Palette, Mic][i % 4] // Use modulo to prevent index out of bounds
    })) : [],
    recentAchievements: Array.isArray(recentAchievementsList) ? recentAchievementsList : []
  };
 
  const openDetails = (category) => {
    setShowDetails(category);
    document.body.style.overflow = 'hidden';
  };
 
  const closeDetails = () => {
    setShowDetails(null);
    document.body.style.overflow = 'auto';
  };

  // Memoize history getter to avoid re-filtering
  const getHistory = useCallback(() => {
    if (!showDetails) return [];
    if (showDetails.id === 'quiz') {
      return quizAttemptsFromRecent.length > 0 ? quizAttemptsFromRecent : safeGetQuizHistory();
    }
    if (showDetails.id === 'mock') {
      return mockTestAttemptsFromRecent.length > 0 ? mockTestAttemptsFromRecent : safeGetMockHistory();
    }
    return [];
  }, [showDetails, quizAttemptsFromRecent, mockTestAttemptsFromRecent, safeGetQuizHistory, safeGetMockHistory]);
 
  // Don't block rendering - show page immediately with context fallbacks
  // Context will be available or we use fallback values

  return (
    <div className="career-container">
      <Navbar isFullScreen={false} />
      <div className="bg-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className={`floating-icon ${heroAnimation ? 'animate' : ''}`} style={{ top: '15%', left: '5%' }}>
          <Rocket size={24} />
        </div>
        <div className={`floating-icon ${heroAnimation ? 'animate' : ''}`} style={{ top: '25%', right: '8%', animationDelay: '0.3s' }}>
          <BookOpen size={24} />
        </div>
        <div className={`floating-icon ${heroAnimation ? 'animate' : ''}`} style={{ top: '70%', left: '10%', animationDelay: '0.6s' }}>
          <Briefcase size={24} />
        </div>
        <div className={`floating-icon ${heroAnimation ? 'animate' : ''}`} style={{ bottom: '20%', right: '12%', animationDelay: '0.9s' }}>
          <Globe size={24} />
        </div>
      </div>
 
      <section className="career-hero" ref={futureRef}>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className={`title-word ${heroAnimation ? 'animate' : ''}`}>{t('hero.title.shape')}</span>{' '}
              <span className={`title-word ${heroAnimation ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>{t('hero.title.your')}</span>{' '}
              <span className={`gradient-text ${heroAnimation ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>{t('hero.title.future')}</span>
            </h1>
            <p className={`hero-subtitle ${heroAnimation ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
              {t('hero.subtitle')}
            </p>
           
            <div className={`hero-cta ${heroAnimation ? 'animate' : ''}`} style={{ animationDelay: '0.8s' }}>
              <button className="cta-btn primary" onClick={scrollToMetrics}>
                <BarChart2 size={20} />
                {t('hero.cta.viewDashboard')}
              </button>
            </div>
          </div>
         
          <div className={`hero-visual ${heroAnimation ? 'animate' : ''}`} style={{ animationDelay: '1s' }}>
            <div className="performance-scale">
              <div className="scale-item scale-excellent">
                <Star size={32} />
                <span>{t('scale.excellent')}</span>
                <div className="scale-pulse"></div>
              </div>
              <div className="scale-item scale-good">
                <TrendingUp size={32} />
                <span>{t('scale.good')}</span>
                <div className="scale-pulse"></div>
              </div>
              <div className="scale-item scale-average">
                <BarChart2 size={32} />
                <span>{t('scale.average')}</span>
                <div className="scale-pulse"></div>
              </div>
              <div className="scale-item scale-needs-improvement">
                <Compass size={32} />
                <span>{t('scale.needsWork')}</span>
                <div className="scale-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">
              <Users size={32} />
            </div>
            <div className="stat-number">{animatedStats.students.toLocaleString()}+</div>
            <div className="stat-label">{t('stats.studentsTracked')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <Star size={32} />
            </div>
            <div className="stat-number">{animatedStats.successRate}%</div>
            <div className="stat-label">{t('stats.improvementRate')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <Target size={32} />
            </div>
            <div className="stat-number">{animatedStats.careers}+</div>
            <div className="stat-label">{t('stats.metricsTracked')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <Clock size={32} />
            </div>
            <div className="stat-number">{animatedStats.universities.toLocaleString()}+</div>
            <div className="stat-label">{t('stats.hoursAnalyzed')}</div>
          </div>
        </div>
      </section>
 
      <section className="performance-section" ref={metricsRef}>
        {/* Hard-coded main title */}
        <h2 className="section-title">Performance</h2>
        <p className="section-subtitle">
          {t('performance.subtitle')}
        </p>
       
        <div className="metrics-grid">
          {/* Show content immediately - use context data while API loads */}
          {performanceMetrics.map((category) => (
            <div key={category.id} className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">
                  {category.icon}
                </div>
                <h3 className="metric-title">{category.title}</h3>
              </div>
             
              <div className="metric-items">
                {category.metrics.map((metric, index) => (
                  <div key={index} className="metric-item">
                    <div className="metric-info">
                      <span className="metric-name">{metric.name}</span>
                      <span className="metric-value">
                        {typeof metric.value === 'number' && metric.value % 1 !== 0
                          ? metric.value.toFixed(1)
                          : metric.value}
                        {metric.unit ? metric.unit : ''}
                      </span>
                    </div>
                    {metric.max && (
                      <div className="metric-bar">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${(metric.value / metric.max) * 100}%`,
                            backgroundColor: getMetricColor(metric.value, metric.max)
                          }}
                        ></div>
                      </div>
                    )}
                    <div className="metric-trend">
                      {metric.trend === 'up' && <TrendingUp size={16} color="#4CAF50" />}
                      {metric.trend === 'down' && <TrendingUp size={16} color="#F44336" style={{ transform: 'rotate(180deg)' }} />}
                      {metric.trend === 'steady' && <TrendingUp size={16} color="#FFC107" style={{ transform: 'rotate(90deg)' }} />}
                    </div>
                  </div>
                ))}
              </div>
             
              <button className="metric-btn" onClick={() => openDetails(category)}>
                {t('viewDetails')}
                <ArrowUpRight size={16} />
              </button>
            </div>
          ))}
          {/* Show subtle loading indicator only if still loading (non-blocking) */}
          {loadingQuizData && (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '10px',
              color: '#666',
              fontSize: '14px'
            }}>
              Refreshing performance data...
            </div>
          )}
        </div>
      </section>
 
      <section className="scale-section">
        <h2 className="section-title" style={{ textAlign: "center", width: "45%" }}>
          {t('scale.title')}
        </h2>
        <p className="section-subtitle">
          {t('scale.subtitle')}
        </p>
       
        <div className="scale-container">
          <div className="scale-level">
            <div className="scale-label" style={{ backgroundColor: '#4CAF50' }}>
              <span>{t('scale.excellent')}</span>
              <span>{t('scale.excellentPercent')}</span>
            </div>
            <div className="scale-description">
              {t('scale.excellentDesc')}
            </div>
          </div>
         
          <div className="scale-level">
            <div className="scale-label" style={{ backgroundColor: '#8BC34A' }}>
              <span>{t('scale.good')}</span>
              <span>{t('scale.goodPercent')}</span>
            </div>
            <div className="scale-description">
              {t('scale.goodDesc')}
            </div>
          </div>
         
          <div className="scale-level">
            <div className="scale-label" style={{ backgroundColor: '#FFC107' }}>
              <span>{t('scale.average')}</span>
              <span>{t('scale.averagePercent')}</span>
            </div>
            <div className="scale-description">
              {t('scale.averageDesc')}
            </div>
          </div>
         
          <div className="scale-level">
            <div className="scale-label" style={{ backgroundColor: '#FF9800' }}>
              <span>{t('scale.developing')}</span>
              <span>{t('scale.developingPercent')}</span>
            </div>
            <div className="scale-description">
              {t('scale.developingDesc')}
            </div>
          </div>
         
          <div className="scale-level">
            <div className="scale-label" style={{ backgroundColor: '#F44336' }}>
              <span>{t('scale.needsWork')}</span>
              <span>{t('scale.needsWorkPercent')}</span>
            </div>
            <div className="scale-description">
              {t('scale.needsWorkDesc')}
            </div>
          </div>
        </div>
      </section>
 
      <section className="career-cta">
        <div className="cta-content">
          <h2>{t('cta.title')}</h2>
          <p>
            {t('cta.subtitle')}
          </p>
          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={scrollToMetrics}>
              <BarChart2 size={20} />
              {t('cta.viewReport')}
            </button>
          </div>
        </div>
      </section>
 
      {showDetails && (
        <div className="details-modal">
          <div className="modal-overlay" onClick={closeDetails}></div>
          <div className="modal-content">
            <button className="modal-close" onClick={closeDetails}>
              <X size={24} />
            </button>
           
            <div className="modal-header">
              <div className="modal-icon">
                {showDetails.icon}
              </div>
              <h2>{showDetails.title}</h2>
              <p>{showDetails.details.description}</p>
            </div>
           
            <div className="modal-grid">
              <div className="student-profile">
                <div className="profile-header">
                  <img src={studentDetails.avatar} alt="Student" className="profile-avatar" />
                  <div>
                    <h3>{studentDetails.name}</h3>
                    <p>{studentDetails.grade} • {studentDetails.school}</p>
                  </div>
                </div>
               
                <div className="profile-section">
                  <h4>{t('profile.interests')}</h4>
                  <div className="interests-list">
                    {studentDetails.interests.map((interest, index) => (
                      <span key={index} className="interest-tag">{interest}</span>
                    ))}
                  </div>
                </div>
               
                <div className="profile-section">
                  <h4>{t('modal.strengths')}</h4>
                  <ul className="strengths-list">
                    {studentDetails.strengths.map((strength, index) => (
                      <li key={index}>
                        {strength.icon}
                        <span>{strength.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
               
                <div className="profile-section">
                  <h4>{t('profile.achievements')}</h4>
                  <ul className="achievements-list">
                    {studentDetails.recentAchievements.map((achievement, index) => (
                      <li key={index}>
                        <Award size={16} />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
             
              <div className="performance-details">
                <div className="detail-section">
                  <h3>{t('modal.keyMetrics')}</h3>
                  <div className="detail-metrics">
                    {showDetails.metrics.map((metric, index) => (
                      <div key={index} className="detail-metric">
                        <div className="metric-label">
                          {metric.name}
                          <span className="metric-trend">
                            {metric.trend === 'up' && <TrendingUp size={16} color="#4CAF50" />}
                            {metric.trend === 'down' && <TrendingUp size={16} color="#F44336" style={{ transform: 'rotate(180deg)' }} />}
                            {metric.trend === 'steady' && <TrendingUp size={16} color="#FFC107" style={{ transform: 'rotate(90deg)' }} />}
                          </span>
                        </div>
                        <div className="metric-value">
                          {typeof metric.value === 'number' && metric.value % 1 !== 0
                            ? metric.value.toFixed(1)
                            : metric.value}
                          {metric.unit ? metric.unit : ''}
                        </div>
                        {metric.max && (
                          <div className="metric-bar">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${(metric.value / metric.max) * 100}%`,
                                backgroundColor: getMetricColor(metric.value, metric.max)
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic History List for Quiz and Mock */}
                {(showDetails.id === 'quiz' || showDetails.id === 'mock') && (
                  <div className="detail-section">
                    <h3>{showDetails.id === 'quiz' ? 'Recent Quizzes Taken' : 'Recent Mock Tests Taken'}</h3>
                    {getHistory().length > 0 ? (
                      <div className="history-list">
                        {getHistory().slice(-5).reverse().map((item, index) => ( // Show last 5, newest first
                          <div key={item.attempt_id || item.id || index} className="history-item">
                            <div className="history-info">
                              <span className="history-title">
                                {item.class_name || item.class || 'Unknown Class'} - {item.subject || 'Unknown Subject'} - {item.topic || item.subtopic || 'Unknown Topic'}
                              </span>
                              <span className="history-score">{item.score || 0}% ({item.total_questions || item.questions || 0} questions)</span>
                              <span className="history-date">{item.attempted_at ? new Date(item.attempted_at).toLocaleDateString() : (item.date || 'N/A')}</span>
                            </div>
                            <div className="history-bar">
                              <div
                                className="bar-fill"
                                style={{
                                  width: `${item.score || 0}%`,
                                  backgroundColor: getMetricColor(item.score || 0, 100)
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No {showDetails.id === 'quiz' ? 'quizzes' : 'mock tests'} taken yet. Start practicing to see your performance history.</p>
                    )}
                  </div>
                )}
               
                <div className="detail-section">
                  <h3>{t('modal.recommendations')}</h3>
                  <ul className="recommendations-list">
                    {showDetails.details.recommendations.map((recommendation, index) => (
                      <li key={index}>
                        <Compass size={16} color="#667eea" />
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
const getMetricColor = (value, max) => {
  if (!max) return '#667eea';
  const percentage = (value / max) * 100;
  if (percentage >= 90) return '#4CAF50';
  if (percentage >= 75) return '#8BC34A';
  if (percentage >= 50) return '#FFC107';
  if (percentage >= 25) return '#FF9800';
  return '#F44336';
};
 
export default Career;
