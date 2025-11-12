import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineUserCircle } from 'react-icons/hi2';

// Mock teacher service to replace studentService
const teacherService = {
  getStudents: () => [
    { id: 1, name: 'John Doe', status: 'Active' },
    { id: 2, name: 'Jane Smith', status: 'Active' },
    { id: 3, name: 'Mike Johnson', status: 'Inactive' },
    { id: 4, name: 'Sarah Wilson', status: 'Active' },
    { id: 5, name: 'Tom Brown', status: 'Active' }
  ],
  
  getStudentPerformance: (studentId) => ({
    overallPercentage: Math.floor(Math.random() * 30) + 70
  })
};

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

  const loadDashboardData = () => {
    const students = teacherService.getStudents();
    const activeStudents = students.filter(s => s.status === 'Active').length;
    
    let totalPerformance = 0;
    let studentsWithPerformance = 0;
    
    students.forEach(student => {
      const performance = teacherService.getStudentPerformance(student.id);
      if (performance.overallPercentage > 0) {
        totalPerformance += performance.overallPercentage;
        studentsWithPerformance++;
      }
    });

    const averagePerformance = studentsWithPerformance > 0 
      ? Math.round(totalPerformance / studentsWithPerformance) 
      : 0;

    const attendanceRate = 87;
    const pendingCommunications = 12;

    setStats({
      totalStudents: students.length,
      activeStudents,
      totalParents: students.length,
      averagePerformance,
      attendanceRate,
      pendingCommunications
    });

    setQuickStats([
      { label: 'quizCompleted', value: '45', change: '+12%', trend: 'up' },
      { label: 'mockTests', value: '23', change: '+5%', trend: 'up' },
      { label: 'assignments', value: '67', change: '+8%', trend: 'up' },
      { label: 'pendingReviews', value: '8', change: '-2%', trend: 'down' }
    ]);

    setChartData({
      performanceDistribution: [
        { label: 'excellent', value: 8, color: colors.primary },
        { label: 'good', value: 12, color: colors.secondary },
        { label: 'average', value: 18, color: colors.info },
        { label: 'needsImprovement', value: 7, color: colors.accent }
      ],
      subjectPerformance: [
        { label: 'mathematics', value: 85 },
        { label: 'physics', value: 78 },
        { label: 'chemistry', value: 82 },
        { label: 'biology', value: 75 },
        { label: 'english', value: 88 }
      ],
      assessmentTypes: [
        { label: 'quizzes', value: 45, color: colors.primary },
        { label: 'mockTests', value: 23, color: colors.secondary },
        { label: 'assignments', value: 67, color: colors.info },
        { label: 'projects', value: 12, color: colors.accent }
      ],
      studentProgress: [
        { label: 'week 1', value: 65 },
        { label: 'week 2', value: 72 },
        { label: 'week 3', value: 78 },
        { label: 'week 4', value: 82 },
        { label: 'week 5', value: 85 },
        { label: 'week 6', value: 87 }
      ]
    });

    setRecentActivities([
      { 
        id: 1, 
        type: 'quiz', 
        message: t('mathematicsQuizCompleted'), 
        time: `10 ${t('minutesAgo')}`,
        score: '85%'
      },
      { 
        id: 2, 
        type: 'communication', 
        message: t('newMessageFromParent'), 
        time: `25 ${t('minutesAgo')}`,
        priority: 'high'
      },
      { 
        id: 3, 
        type: 'attendance', 
        message: t('studentMarkedAbsent'), 
        time: `1 ${t('hourAgo')}`,
        action: 'notify'
      },
      { 
        id: 4, 
        type: 'performance', 
        message: t('studentImprovedPerformance'), 
        time: `2 ${t('hoursAgo')}`,
        improvement: '+15%' 
      },
      { 
        id: 5, 
        type: 'system', 
        message: t('weeklyReportGenerated'), 
        time: `3 ${t('hoursAgo')}`,
        action: 'view'
      }
    ]);
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
                {[
                  { type: t('mathematicsQuizzes'), avg: '78%', completion: `45/50 ${t('completed')}`, color: colors.primary },
                  { type: t('physicsMockTests'), avg: '82%', completion: `38/50 ${t('completed')}`, color: colors.secondary },
                  { type: t('chemistryAssignments'), avg: '85%', completion: `42/50 ${t('completed')}`, color: colors.info }
                ].map((assessment, index) => (
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

        {/* Quick Actions */}
        <div style={{ 
          marginTop: '32px', 
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            color: darkMode ? '#e2e8f0' : colors.dark,
            fontSize: isMobile ? '18px' : '20px',
            fontWeight: '600'
          }}>{t('quickActions')}</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            width: '100%'
          }}>
            {[
              { icon: '📝', label: t('createQuiz'), color: colors.primary },
              { icon: '📊', label: t('viewReports'), color: colors.secondary },
              { icon: '💬', label: t('sendAnnouncement'), color: colors.info },
              { icon: '👥', label: t('markAttendance'), color: colors.accent }
            ].map((action, index) => (
              <button key={index} style={{
                padding: isMobile ? '20px 16px' : '24px 20px',
                backgroundColor: darkMode ? '#1e293b' : colors.white,
                border: `2px solid ${action.color}`,
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                width: '100%',
                boxSizing: 'border-box',
                minHeight: '120px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 25px ${action.color}30`;
                e.currentTarget.style.backgroundColor = `${action.color}08`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.backgroundColor = darkMode ? '#1e293b' : colors.white;
              }}
              >
                <div style={{
                  width: isMobile ? '44px' : '52px',
                  height: isMobile ? '44px' : '52px',
                  borderRadius: '10px',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '28px' : '32px',
                  transition: 'all 0.3s ease'
                }}>{action.icon}</div>
                <span style={{
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: '600',
                  color: darkMode ? '#e2e8f0' : colors.dark,
                  textAlign: 'center',
                  lineHeight: '1.3'
                }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
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







