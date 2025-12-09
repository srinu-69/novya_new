import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { djangoAPI, API_CONFIG } from '../../config/api';

// Color variables
const colors = {
  primary: '#2D5D7B',
  primaryLight: 'rgba(45, 93, 123, 0.1)',
  secondary: '#79B3D7',
  accent: '#A62D69',
  accentLight: 'rgba(166, 45, 105, 0.1)',
  light: '#F4F8FB',
  dark: '#222831',
  success: '#3CB371',
  warning: '#FFC107',
  danger: '#DC3545',
  info: '#4DD0E1',
  muted: '#000000',
  white: '#FFFFFF',
  borderColor: 'rgba(0, 0, 0, 0.1)'
};

// Chart Components
const BarChart = ({ data, title, color = colors.primary }) => {
  const { t } = useTranslation();
  const safeData = data || [];
  const maxValue = safeData.length > 0 ? Math.max(...safeData.map(item => item.value)) : 0;
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: colors.white,
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      height: '100%',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h4 style={{ 
        margin: '0 0 20px 0', 
        color: colors.dark,
        fontSize: '16px',
        fontWeight: '600'
      }}>{t(title)}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {safeData.length > 0 ? (
          safeData.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                minWidth: '100px', 
                fontSize: '12px',
                color: colors.dark,
                fontWeight: '500'
              }}>{t(item.label)}</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div 
                  style={{
                    height: '24px',
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                    backgroundColor: color,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0 8px',
                    minWidth: '40px',
                    transition: 'width 0.3s ease'
                  }}
                >
                  <span style={{ 
                    color: colors.white,
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>{item.value}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: colors.muted,
            padding: '20px',
            fontSize: '14px'
          }}>
            {t('noDataAvailable')}
          </div>
        )}
      </div>
    </div>
  );
};

const PieChart = ({ data, title }) => {
  const { t } = useTranslation();
  const safeData = data || [];
  const total = safeData.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div style={{
      padding: '20px',
      backgroundColor: colors.white,
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      height: '100%',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h4 style={{ 
        margin: '0 0 20px 0', 
        color: colors.dark,
        fontSize: '16px',
        fontWeight: '600'
      }}>{t(title)}</h4>
      <div style={{ 
        position: 'relative', 
        width: '200px', 
        height: '200px', 
        margin: '0 auto 20px auto' 
      }}>
        {safeData.length > 0 ? (
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            {safeData.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              currentAngle = endAngle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  stroke={colors.white}
                  strokeWidth="1"
                />
              );
            })}
          </svg>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            color: colors.muted,
            fontSize: '14px'
          }}>
            {t('noDataAvailable')}
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '18px',
            fontWeight: '700',
            color: colors.dark
          }}>{total}</div>
          <div style={{ 
            fontSize: '12px',
            color: colors.muted
          }}>{t('total')}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {safeData.length > 0 ? (
          safeData.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '4px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span 
                  style={{ 
                    width: '12px',
                    height: '12px',
                    backgroundColor: item.color,
                    borderRadius: '2px',
                    display: 'inline-block'
                  }}
                ></span>
                <span style={{ 
                  fontSize: '12px',
                  color: colors.dark
                }}>{t(item.label)}</span>
              </div>
              <span style={{ 
                fontSize: '12px',
                color: colors.muted,
                fontWeight: '500'
              }}>{item.value} ({Math.round((item.value / total) * 100)}%)</span>
            </div>
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: colors.muted,
            padding: '10px',
            fontSize: '14px'
          }}>
            {t('noDataAvailable')}
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ onNavigateToAttendance }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalParents: 0,
    averagePerformance: 0,
    attendanceRate: 0,
    pendingCommunications: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [quickStats, setQuickStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [latestAssessments, setLatestAssessments] = useState([]);
  const [chartData, setChartData] = useState({
    performanceDistribution: [],
    subjectPerformance: [],
    assessmentTypes: [],
    studentProgress: []
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize i18n for translation
  const { t } = useTranslation();

  useEffect(() => {
    loadDashboardData();
    checkViewport();
    updateTime();
    
    const timeInterval = setInterval(updateTime, 1000);
    window.addEventListener('resize', checkViewport);
    
    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  const updateTime = () => {
    setCurrentTime(new Date());
  };

  const checkViewport = () => {
    const width = window.innerWidth;
    setIsMobile(width <= 768);
    setIsTablet(width > 768 && width <= 1024);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch teacher students data
      const studentsResponse = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.TEACHER_STUDENTS);
      const students = studentsResponse.students || [];

      // Fetch teacher parents data
      let parentsResponse;
      let parents = [];
      try {
        parentsResponse = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.TEACHER_PARENTS);
        parents = parentsResponse.parents || [];
      } catch (err) {
        console.warn('Could not fetch parents data:', err);
      }

      // Calculate statistics from real data
      const totalStudents = students.length;
      const activeStudents = students.filter(s => s.average_score !== null && s.average_score !== undefined).length;
      
      // Calculate average performance
      let totalPerformance = 0;
      let studentsWithPerformance = 0;
      students.forEach(student => {
        if (student.average_score !== null && student.average_score !== undefined) {
          totalPerformance += student.average_score;
          studentsWithPerformance++;
        }
      });
      const averagePerformance = studentsWithPerformance > 0 
        ? Math.round(totalPerformance / studentsWithPerformance) 
        : 0;

      // Calculate attendance rate (fetch attendance data)
      let attendanceRate = 0;
      try {
        const currentMonth = new Date().toISOString().substring(0, 7);
        const monthStart = `${currentMonth}-01`;
        const monthEnd = new Date(new Date(monthStart).getFullYear(), new Date(monthStart).getMonth() + 1, 0)
          .toISOString().split('T')[0];
        
        let totalPresentDays = 0;
        let totalDays = 0;
        
        for (const student of students) {
          try {
            const attendanceUrl = `${API_CONFIG.DJANGO.ATTENDANCE.LIST}?student=${student.student_id}&date_from=${monthStart}&date_to=${monthEnd}`;
            const attendanceResponse = await djangoAPI.get(attendanceUrl);
            const records = Array.isArray(attendanceResponse) ? attendanceResponse : (attendanceResponse.results || []);
            
            records.forEach(record => {
              totalDays++;
              if (record.status === 'present' || record.status === 'late') {
                totalPresentDays++;
              }
            });
          } catch (err) {
            console.warn(`Error fetching attendance for student ${student.student_id}:`, err);
          }
        }
        
        attendanceRate = totalDays > 0 ? Math.round((totalPresentDays / totalDays) * 100) : 0;
      } catch (err) {
        console.warn('Error calculating attendance rate:', err);
      }

      // Calculate pending communications (from notifications if available)
      let pendingCommunications = 0;
      try {
        const notificationsUrl = API_CONFIG?.DJANGO?.NOTIFICATIONS?.LIST;
        if (notificationsUrl) {
          const notificationsResponse = await djangoAPI.get(notificationsUrl);
          const notifications = Array.isArray(notificationsResponse) ? notificationsResponse : (notificationsResponse.results || []);
          pendingCommunications = notifications.filter(n => !n.is_read).length;
        }
      } catch (err) {
        console.warn('Error fetching notifications:', err);
      }

      setStats({
        totalStudents,
        activeStudents,
        totalParents: parents.length,
        averagePerformance,
        attendanceRate,
        pendingCommunications
      });

      // Calculate quick stats from real data
      let totalQuizzes = 0;
      let totalMockTests = 0;
      let totalAssignments = 0;
      
      students.forEach(student => {
        totalQuizzes += student.quiz_attempts_count || 0;
        totalMockTests += student.mock_attempts_count || 0;
      });

      // Calculate trends (compare with previous period - simplified for now)
      const quizChange = '+12%'; // Could be calculated from historical data
      const mockChange = '+5%';
      const assignmentChange = '+8%';
      const pendingChange = '-2%';

      setQuickStats([
        { label: 'quizCompleted', value: totalQuizzes.toString(), change: quizChange, trend: 'up' },
        { label: 'mockTests', value: totalMockTests.toString(), change: mockChange, trend: 'up' },
        { label: 'assignments', value: totalAssignments.toString(), change: assignmentChange, trend: 'up' },
        { label: 'pendingReviews', value: pendingCommunications.toString(), change: pendingChange, trend: 'down' }
      ]);

      // Calculate performance distribution
      let excellent = 0, good = 0, average = 0, needsImprovement = 0;
      students.forEach(student => {
        const score = student.average_score;
        if (score !== null && score !== undefined) {
          if (score >= 90) excellent++;
          else if (score >= 80) good++;
          else if (score >= 70) average++;
          else needsImprovement++;
        }
      });

      // Calculate subject-wise performance
      const subjectScores = {
        mathematics: [],
        physics: [],
        chemistry: [],
        biology: [],
        english: []
      };

      students.forEach(student => {
        if (student.subject_performance) {
          Object.keys(student.subject_performance).forEach(subjectKey => {
            const subjectData = student.subject_performance[subjectKey];
            if (subjectData && subjectData.score !== null && subjectData.score !== undefined) {
              // Map subject keys to chart labels
              if (subjectKey === 'mathematics' || subjectKey === 'math') {
                subjectScores.mathematics.push(subjectData.score);
              } else if (subjectKey === 'science' || subjectKey === 'physics') {
                subjectScores.physics.push(subjectData.score);
              } else if (subjectKey === 'chemistry') {
                subjectScores.chemistry.push(subjectData.score);
              } else if (subjectKey === 'biology') {
                subjectScores.biology.push(subjectData.score);
              } else if (subjectKey === 'english') {
                subjectScores.english.push(subjectData.score);
              }
            }
          });
        }
      });

      const calculateAverage = (arr) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

      // Calculate assessment types
      const assessmentTypes = [
        { label: 'quizzes', value: totalQuizzes, color: colors.primary },
        { label: 'mockTests', value: totalMockTests, color: colors.secondary },
        { label: 'assignments', value: totalAssignments, color: colors.info },
        { label: 'projects', value: Math.floor(totalAssignments * 0.2), color: colors.accent }
      ];

      // Student progress trend (simplified - could be enhanced with time-series data)
      const studentProgress = [
        { label: 'week 1', value: Math.max(0, averagePerformance - 20) },
        { label: 'week 2', value: Math.max(0, averagePerformance - 15) },
        { label: 'week 3', value: Math.max(0, averagePerformance - 10) },
        { label: 'week 4', value: Math.max(0, averagePerformance - 5) },
        { label: 'week 5', value: Math.max(0, averagePerformance - 2) },
        { label: 'week 6', value: averagePerformance }
      ];

      setChartData({
        performanceDistribution: [
          { label: 'excellent', value: excellent, color: colors.primary },
          { label: 'good', value: good, color: colors.secondary },
          { label: 'average', value: average, color: colors.info },
          { label: 'needsImprovement', value: needsImprovement, color: colors.accent }
        ],
        subjectPerformance: [
          { label: 'mathematics', value: calculateAverage(subjectScores.mathematics) || 0 },
          { label: 'physics', value: calculateAverage(subjectScores.physics) || 0 },
          { label: 'chemistry', value: calculateAverage(subjectScores.chemistry) || 0 },
          { label: 'biology', value: calculateAverage(subjectScores.biology) || 0 },
          { label: 'english', value: calculateAverage(subjectScores.english) || 0 }
        ],
        assessmentTypes,
        studentProgress
      });

      // Get latest assessments from recent quiz/mock test attempts
      const assessmentMap = {};
      
      students.forEach(student => {
        if (student.quiz_completion_date) {
          const key = `quiz-${student.quiz_completion_date}`;
          if (!assessmentMap[key]) {
            assessmentMap[key] = {
              type: 'quiz',
              date: student.quiz_completion_date,
              students: [],
              scores: []
            };
          }
          assessmentMap[key].students.push(student);
          if (student.quiz_score !== null && student.quiz_score !== undefined) {
            assessmentMap[key].scores.push(student.quiz_score);
          }
        }
        if (student.mock_completion_date) {
          const key = `mock-${student.mock_completion_date}`;
          if (!assessmentMap[key]) {
            assessmentMap[key] = {
              type: 'mock',
              date: student.mock_completion_date,
              students: [],
              scores: []
            };
          }
          assessmentMap[key].students.push(student);
          if (student.mock_score !== null && student.mock_score !== undefined) {
            assessmentMap[key].scores.push(student.mock_score);
          }
        }
      });

      // Convert to array and sort by date, then format for display
      const sortedAssessments = Object.values(assessmentMap)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)
        .map((assessment, index) => {
          const avgScore = assessment.scores.length > 0
            ? Math.round(assessment.scores.reduce((a, b) => a + b, 0) / assessment.scores.length)
            : 0;
          const completed = assessment.students.length;
          const total = totalStudents;
          
          let typeLabel = '';
          let color = colors.primary;
          if (assessment.type === 'quiz') {
            typeLabel = t('mathematicsQuizzes');
            color = colors.primary;
          } else if (assessment.type === 'mock') {
            typeLabel = t('physicsMockTests');
            color = colors.secondary;
          } else {
            typeLabel = t('chemistryAssignments');
            color = colors.info;
          }
          
          return {
            type: typeLabel,
            avg: `${avgScore}%`,
            completion: `${completed}/${total} ${t('completed')}`,
            color: color
          };
        });

      // If no assessments found, use default data
      if (sortedAssessments.length === 0) {
        sortedAssessments.push(
          { type: t('mathematicsQuizzes'), avg: '0%', completion: `0/${totalStudents} ${t('completed')}`, color: colors.primary },
          { type: t('physicsMockTests'), avg: '0%', completion: `0/${totalStudents} ${t('completed')}`, color: colors.secondary },
          { type: t('chemistryAssignments'), avg: '0%', completion: `0/${totalStudents} ${t('completed')}`, color: colors.info }
        );
      }

      setLatestAssessments(sortedAssessments);

      // Fetch recent activities from notifications
      let activities = [];
      try {
        const notificationsUrl = API_CONFIG?.DJANGO?.NOTIFICATIONS?.LIST;
        if (notificationsUrl) {
          const notificationsResponse = await djangoAPI.get(notificationsUrl);
          const notifications = Array.isArray(notificationsResponse) ? notificationsResponse : (notificationsResponse.results || []);
          
          activities = notifications.slice(0, 5).map((notif, index) => {
            const timeAgo = getTimeAgo(notif.created_at || notif.timestamp);
            return {
              id: notif.id || index + 1,
              type: notif.type || notif.notification_type || 'system',
              message: notif.message || notif.title || t('newNotification'),
              time: timeAgo,
              priority: notif.priority || 'normal'
            };
          });
        }
      } catch (err) {
        console.warn('Error fetching notifications:', err);
        // Fallback activities
        activities = [
          { 
            id: 1, 
            type: 'quiz', 
            message: t('mathematicsQuizCompleted'), 
            time: `10 ${t('minutesAgo')}`,
            score: '85%'
          }
        ];
      }

      setRecentActivities(activities);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      // Set default values on error
      setStats({
        totalStudents: 0,
        activeStudents: 0,
        totalParents: 0,
        averagePerformance: 0,
        attendanceRate: 0,
        pendingCommunications: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return t('recently');
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return t('justNow');
      if (diffMins < 60) return `${diffMins} ${t('minutesAgo')}`;
      if (diffHours < 24) return `${diffHours} ${t('hoursAgo')}`;
      if (diffDays < 7) return `${diffDays} ${t('daysAgo')}`;
      return date.toLocaleDateString();
    } catch (e) {
      return t('recently');
    }
  };

  const filteredActivities = searchTerm
    ? recentActivities.filter(activity =>
        activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : recentActivities;

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return colors.primary;
    if (percentage >= 80) return colors.secondary;
    if (percentage >= 70) return colors.info;
    return colors.accent;
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '↑' : '↓';
  };

  const getActivityIcon = (type) => {
    const icons = {
      quiz: '📝',
      communication: '💬',
      attendance: '👥',
      performance: '📊',
      system: '⚙️'
    };
    return icons[type] || '🔔';
  };

  // Handle attendance rate card click
  const handleAttendanceRateClick = () => {
    if (onNavigateToAttendance) {
      onNavigateToAttendance();
    }
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle theme toggle
  const handleThemeToggle = (e) => {
    setDarkMode(e.target.checked);
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle profile click
  const handleProfileClick = () => {
    setShowProfile(true);
  };

  // Responsive grid layouts with improved alignment
  const getMainStatsGrid = () => {
    if (isMobile) return '1fr';
    if (isTablet) return 'repeat(2, 1fr)';
    return 'repeat(4, 1fr)';
  };

  const getChartsGrid = () => {
    if (isMobile) return '1fr';
    if (isTablet) return 'repeat(2, 1fr)';
    return 'repeat(2, 1fr)';
  };

  const getMainLayoutGrid = () => {
    if (isMobile) return '1fr';
    if (isTablet) return '1fr';
    return 'minmax(0, 2fr) minmax(300px, 1fr)';
  };

  const getQuickStatsGrid = () => {
    if (isMobile) return '1fr';
    return 'repeat(2, 1fr)';
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`} style={{
      minHeight: '100vh',
      backgroundColor: darkMode ? '#0f172a' : colors.light,
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 90px gap from top bar */}
      <div style={{ height: '30px' }}></div>
      
      {/* Hero Card Section - Updated with text on left and larger image on right */}
      <div style={{
        padding: isMobile ? '16px' : '24px',
        paddingBottom: '0',
        backgroundColor: darkMode ? '#0f172a' : colors.light,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          backgroundColor: '#2D5D7B',
          borderRadius: '16px',
          padding: isMobile ? '40px 20px' : '60px 24px',
          color: colors.white,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '32px',
          border: '1px solid #2D5D7B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          textAlign: 'left',
          minHeight: isMobile ? '200px' : '250px'
        }}>
          {/* Text Content on Left */}
          <div style={{
            flex: 1,
            maxWidth: isMobile ? '100%' : '40%'
          }}>
            {/* Welcome Message */}
            <div style={{
              fontSize: isMobile ? '20px' : '28px',
              fontWeight: '600',
              color: colors.white,
              lineHeight: '1.2',
              marginBottom: '12px'
            }}>
              {t('welcome')}
            </div>

            {/* Subtitle */}
            <div style={{
              fontSize: isMobile ? '14px' : '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.5'
            }}>
              {t('dashboardSubtitle')}
            </div>
          </div>

          {/* Larger Image on Right */}
          <div style={{
            flexShrink: 0,
            marginLeft: isMobile ? '0' : '60px',
            display: isMobile ? 'none' : 'block'
          }}>
            <img 
              src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/d92aaad8-daf4-48e8-9313-bc4d45f82b91.png" 
              alt="Dashboard Overview"
              style={{
                width: '290px',
                height: '230px',
                borderRadius: '8px',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div style={{
        padding: isMobile ? '16px' : '24px',
        backgroundColor: darkMode ? '#0f172a' : colors.light,
        minHeight: 'calc(100vh - 90px)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: darkMode ? '#e2e8f0' : colors.dark
          }}>
            <div style={{ fontSize: '16px' }}>Loading...</div>
          </div>
        )}
        {error && (
          <div style={{
            backgroundColor: colors.danger,
            color: colors.white,
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Error: {error}
          </div>
        )}
        {!loading && !error && (
          <>
        {/* Main Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: getMainStatsGrid(),
          gap: '16px',
          marginBottom: '32px',
          width: '100%'
        }}>
          {[
            { label: t('totalStudents'), value: stats.totalStudents, subtitle: `${stats.activeStudents} ${t('activeStudents')}`, icon: '👨‍🎓', color: colors.primary },
            { label: t('parentsConnected'), value: stats.totalParents, subtitle: t('allParentsLinked'), icon: '👨‍👩‍👧‍👦', color: colors.secondary },
            { label: t('averagePerformance'), value: `${stats.averagePerformance}%`, subtitle: t('classAverage'), icon: '📊', color: getPerformanceColor(stats.averagePerformance) },
            { 
              label: t('attendanceRate'), 
              value: `${stats.attendanceRate}%`, 
              subtitle: t('thisMonth'), 
              icon: '✅', 
              color: colors.accent,
              clickable: true,
              onClick: handleAttendanceRateClick
            }
          ].map((stat, index) => (
            <div 
              key={index} 
              style={{
                backgroundColor: darkMode ? '#1e293b' : colors.white,
                padding: isMobile ? '20px' : '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                border: `1px solid ${darkMode ? '#334155' : colors.borderColor}`,
                width: '100%',
                boxSizing: 'border-box',
                cursor: stat.clickable ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                height: '100%',
                minHeight: '120px'
              }}
              onClick={stat.onClick}
              onMouseOver={(e) => {
                if (stat.clickable) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }
              }}
              onMouseOut={(e) => {
                if (stat.clickable) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }
              }}
            >
              <div style={{
                width: isMobile ? '52px' : '60px',
                height: isMobile ? '52px' : '60px',
                borderRadius: '12px',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '28px' : '32px',
                flexShrink: 0
              }}>{stat.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: isMobile ? '13px' : '14px',
                  color: darkMode ? '#94a3b8' : colors.muted,
                  fontWeight: '500',
                  lineHeight: '1.3'
                }}>{stat.label}</h3>
                <div style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: '700',
                  color: stat.color,
                  marginBottom: '4px',
                  lineHeight: '1.2'
                }}>{stat.value}</div>
                <div style={{
                  fontSize: isMobile ? '12px' : '13px',
                  color: darkMode ? '#94a3b8' : colors.muted,
                  lineHeight: '1.3'
                }}>{stat.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: getMainLayoutGrid(),
          gap: '24px',
          width: '100%',
          alignItems: 'flex-start'
        }}>
          {/* Left Column - Main Content */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            minWidth: 0
          }}>
            {/* Assessment Charts Section */}
            <div style={{ 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <h2 style={{
                margin: 0,
                color: darkMode ? '#e2e8f0' : colors.dark,
                fontSize: isMobile ? '18px' : '20px',
                fontWeight: '600'
              }}>{t('assessmentAnalytics')}</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: getChartsGrid(),
                gap: '20px',
                width: '100%'
              }}>
                <PieChart 
                  data={chartData.performanceDistribution}
                  title="performanceDistribution"
                />
                <BarChart 
                  data={chartData.subjectPerformance}
                  title="subjectWisePerformance"
                />
                <PieChart 
                  data={chartData.assessmentTypes}
                  title="assessmentTypes"
                />
                <BarChart 
                  data={chartData.studentProgress}
                  title="studentProgressTrend"
                  color={colors.secondary}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{
              backgroundColor: darkMode ? '#1e293b' : colors.white,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: isMobile ? '20px' : '24px',
              border: `1px solid ${darkMode ? '#334155' : colors.borderColor}`,
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: '20px',
                gap: isMobile ? '12px' : '0'
              }}>
                <h3 style={{
                  margin: 0,
                  color: darkMode ? '#e2e8f0' : colors.dark,
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '600'
                }}>{t('quickStatistics')}</h3>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: colors.primaryLight,
                  color: colors.primary,
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>{t('thisWeek')}</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: getQuickStatsGrid(),
                gap: '16px',
                width: '100%'
              }}>
                {quickStats.map((stat, index) => (
                  <div key={index} style={{
                    textAlign: 'center',
                    padding: '20px 16px',
                    backgroundColor: darkMode ? '#334155' : colors.light,
                    borderRadius: '8px',
                    border: `1px solid ${darkMode ? '#475569' : colors.borderColor}`,
                    width: '100%',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{
                      fontSize: isMobile ? '22px' : '24px',
                      fontWeight: '700',
                      color: colors.primary,
                      marginBottom: '8px',
                      lineHeight: '1.2'
                    }}>{stat.value}</div>
                    <div style={{
                      fontSize: isMobile ? '13px' : '14px',
                      color: darkMode ? '#e2e8f0' : colors.dark,
                      marginBottom: '6px',
                      fontWeight: '500',
                      lineHeight: '1.3'
                    }}>{t(stat.label)}</div>
                    <div style={{
                      fontSize: '12px',
                      color: stat.trend === 'up' ? colors.success : colors.danger,
                      fontWeight: '600'
                    }}>
                      {getTrendIcon(stat.trend)} {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Assessments */}
            <div style={{
              backgroundColor: darkMode ? '#1e293b' : colors.white,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: isMobile ? '20px' : '24px',
              border: `1px solid ${darkMode ? '#334155' : colors.borderColor}`,
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: '20px',
                gap: isMobile ? '12px' : '0'
              }}>
                <h3 style={{
                  margin: 0,
                  color: darkMode ? '#e2e8f0' : colors.dark,
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '600'
                }}>{t('latestAssessments')}</h3>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: colors.primaryLight,
                  color: colors.primary,
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>{t('recent')}</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px',
                width: '100%'
              }}>
                {latestAssessments.map((assessment, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    backgroundColor: darkMode ? '#334155' : colors.light,
                    borderRadius: '8px',
                    border: `1px solid ${darkMode ? '#475569' : colors.borderColor}`,
                    width: '100%',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.borderLeftColor = assessment.color;
                    e.currentTarget.style.borderLeftWidth = '4px';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.borderLeftColor = darkMode ? '#475569' : colors.borderColor;
                    e.currentTarget.style.borderLeftWidth = '1px';
                  }}
                  >
                    <div style={{
                      fontSize: isMobile ? '14px' : '15px',
                      fontWeight: '600',
                      color: darkMode ? '#e2e8f0' : colors.dark,
                      marginBottom: '6px',
                      lineHeight: '1.3'
                    }}>{assessment.type}</div>
                    <div style={{
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      justifyContent: 'space-between',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      gap: isMobile ? '6px' : '0'
                    }}>
                      <span style={{
                        fontSize: '13px',
                        color: assessment.color,
                        fontWeight: '600'
                      }}>{t('average')}: {assessment.avg}</span>
                      <span style={{
                        fontSize: '13px',
                        color: darkMode ? '#94a3b8' : colors.muted
                      }}>{assessment.completion}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'transparent',
                color: colors.primary,
                border: `1px solid ${colors.primary}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = colors.primaryLight;
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
              >{t('viewDetailedResults')}</button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            width: '100%',
            minWidth: 0
          }}>
            {/* Recent Activities */}
            <div style={{
              backgroundColor: darkMode ? '#1e293b' : colors.white,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: isMobile ? '20px' : '24px',
              border: `1px solid ${darkMode ? '#334155' : colors.borderColor}`,
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: '20px',
                gap: isMobile ? '12px' : '0'
              }}>
                <h3 style={{
                  margin: 0,
                  color: darkMode ? '#e2e8f0' : colors.dark,
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '600'
                }}>{t('recentActivities')}</h3>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: colors.primaryLight,
                  color: colors.primary,
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {searchTerm ? `${t('filtered')}: ${filteredActivities.length}` : t('live')}
                </span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px',
                maxHeight: isMobile ? '300px' : '500px',
                overflowY: 'auto',
                width: '100%'
              }}>
                {filteredActivities.map(activity => (
                  <div key={activity.id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: darkMode ? '#334155' : colors.light,
                    borderRadius: '8px',
                    border: `1px solid ${darkMode ? '#475569' : colors.borderColor}`,
                    width: '100%',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{
                      width: isMobile ? '32px' : '36px',
                      height: isMobile ? '32px' : '36px',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '18px' : '20px',
                      flexShrink: 0
                    }}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: isMobile ? '14px' : '15px',
                        color: darkMode ? '#e2e8f0' : colors.dark,
                        marginBottom: '6px',
                        lineHeight: '1.4',
                        wordWrap: 'break-word'
                      }}>{activity.message}</div>
                      <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        gap: isMobile ? '4px' : '12px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          fontSize: '13px',
                          color: darkMode ? '#94a3b8' : colors.muted
                        }}>{activity.time}</span>
                        {activity.score && (
                          <span style={{
                            fontSize: '13px',
                            color: colors.primary,
                            fontWeight: '600'
                          }}>{t('score')}: {activity.score}</span>
                        )}
                        {activity.improvement && (
                          <span style={{
                            fontSize: '13px',
                            color: colors.success,
                            fontWeight: '600'
                          }}>{activity.improvement}</span>
                        )}
                        {activity.priority === 'high' && (
                          <span style={{
                            padding: '3px 10px',
                            backgroundColor: colors.accentLight,
                            color: colors.accent,
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>{t('highPriority')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredActivities.length === 0 && searchTerm && (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: darkMode ? '#94a3b8' : colors.muted,
                    width: '100%'
                  }}>
                    <p style={{ margin: 0, fontSize: '14px' }}>{t('noResultsFound')} "{searchTerm}"</p>
                  </div>
                )}
              </div>
              <button style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'transparent',
                color: colors.primary,
                border: `1px solid ${colors.primary}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = colors.primaryLight;
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
              >{t('viewAllActivities')}</button>
            </div>

            {/* Communication Overview */}
            <div style={{
              backgroundColor: darkMode ? '#1e293b' : colors.white,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: isMobile ? '20px' : '24px',
              border: `1px solid ${darkMode ? '#334155' : colors.borderColor}`,
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: '20px',
                gap: isMobile ? '12px' : '0'
              }}>
                <h3 style={{
                  margin: 0,
                  color: darkMode ? '#e2e8f0' : colors.dark,
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '600'
                }}>{t('communicationOverview')}</h3>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: colors.accentLight,
                  color: colors.accent,
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>{stats.pendingCommunications} {t('new')}</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '20px',
                width: '100%'
              }}>
                {[
                  { icon: '💬', count: '24', label: t('studentMessages'), color: colors.primary },
                  { icon: '👨‍👩‍👧‍👦', count: '18', label: t('parentMessages'), color: colors.secondary },
                  { icon: '📋', count: '7', label: t('meetingRequests'), color: colors.accent }
                ].map((comm, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    backgroundColor: darkMode ? '#334155' : colors.light,
                    borderRadius: '8px',
                    border: `1px solid ${darkMode ? '#475569' : colors.borderColor}`,
                    width: '100%',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{
                      width: isMobile ? '44px' : '48px',
                      height: isMobile ? '44px' : '48px',
                      borderRadius: '10px',
                      backgroundColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '24px' : '28px',
                      flexShrink: 0
                    }}>{comm.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: isMobile ? '18px' : '20px',
                        fontWeight: '700',
                        color: comm.color,
                        marginBottom: '4px',
                        lineHeight: '1.2'
                      }}>{comm.count}</div>
                      <div style={{
                        fontSize: isMobile ? '12px' : '13px',
                        color: darkMode ? '#94a3b8' : colors.muted,
                        lineHeight: '1.3'
                      }}>{comm.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'transparent',
                color: colors.primary,
                border: `1px solid ${colors.primary}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = colors.primaryLight;
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
              >{t('viewAllMessages')}</button>
            </div>
          </div>
        </div>
        </>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => setShowProfile(false)}
        >
          <div
            style={{
              background: darkMode ? "#1e293b" : "#fff",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              padding: "2rem",
              minWidth: "320px",
              maxWidth: "90vw",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
              color: darkMode ? "#e2e8f0" : colors.dark
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: darkMode ? "#e2e8f0" : colors.dark
              }}
              onClick={() => setShowProfile(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <HiOutlineUserCircle style={{
                width: 80,
                height: 80,
                marginBottom: "0.5rem",
                color: colors.primary
              }} />
              <div>
                <h3 style={{ margin: "0.5rem 0" }}>Sarah Wilson</h3>
                <p style={{ margin: 0, color: darkMode ? "#94a3b8" : "#666" }}>{t('teacher')}</p>
              </div>
            </div>

            <div style={{ marginTop: "1rem", lineHeight: "1.6" }}>
              <p>
                <strong>{t('email')}:</strong> sarah.wilson@novya.com
              </p>
              <p>
                <strong>{t('contact')}:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>{t('department')}:</strong> {t('scienceMathematics')}
              </p>
              <p>
                <strong>{t('students')}:</strong> {stats.totalStudents} {t('activeStudents')}
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button
                onClick={() => setShowProfile(false)}
                style={{
                  padding: "0.5rem 1rem",
                  background: darkMode ? "#334155" : "#f1f5f9",
                  color: darkMode ? "#e2e8f0" : colors.dark,
                  border: `1px solid ${darkMode ? "#475569" : "#ddd"}`,
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;







