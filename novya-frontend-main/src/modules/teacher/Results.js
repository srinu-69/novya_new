import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Studentresults from './Studentresults';
import Sidebar from './Sidebar';
import { djangoAPI, API_CONFIG } from '../../config/api';

const Results = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentView, setCurrentView] = useState('list');
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Color variables using your exact codes
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
    muted: '#B0BEC5',
    white: '#FFFFFF',
    borderColor: 'rgba(0, 0, 0, 0.1)'
  };

  // Fetch students from teacher's school and their quiz/mock test scores
  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        setLoading(true);
        // Fetch students from teacher's school
        const response = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.TEACHER_STUDENTS);
        console.log('📊 Teacher students response:', response);
        const students = response.students || [];
        console.log(`📊 Found ${students.length} students`);
        
        // Process students data - scores are already included from backend
        const studentsWithScores = students.map((student) => {
          // Get initials from name
          const firstName = student.user_info?.firstname || student.first_name || '';
          const lastName = student.user_info?.lastname || student.last_name || '';
          const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'NA';
          
          // Debug logging for scores - log the raw data first
          console.log(`📊 RAW Student data for ${student.student_id}:`, JSON.stringify(student, null, 2));
          console.log(`📊 Student ${student.student_id} (${student.student_username || firstName}):`, {
            quiz_score: student.quiz_score,
            quiz_score_type: typeof student.quiz_score,
            mock_score: student.mock_score,
            mock_score_type: typeof student.mock_score,
            average_score: student.average_score,
            average_score_type: typeof student.average_score,
            quiz_attempts: student.quiz_attempts_count,
            mock_attempts: student.mock_attempts_count
          });
          
          // Parse scores more carefully
          const quizScore = student.quiz_score !== null && student.quiz_score !== undefined 
            ? (typeof student.quiz_score === 'string' ? parseFloat(student.quiz_score) : Number(student.quiz_score))
            : null;
          const mockScore = student.mock_score !== null && student.mock_score !== undefined
            ? (typeof student.mock_score === 'string' ? parseFloat(student.mock_score) : Number(student.mock_score))
            : null;
          const averageScore = student.average_score !== null && student.average_score !== undefined
            ? (typeof student.average_score === 'string' ? parseFloat(student.average_score) : Number(student.average_score))
            : null;
          
          console.log(`📊 PARSED scores for ${student.student_id}: quiz=${quizScore}, mock=${mockScore}, avg=${averageScore}`);
          
          return {
            id: student.student_id,
            student_id: student.student_id,
            initials: initials,
            name: `${firstName} ${lastName}`.trim() || 'Unknown',
            email: student.user_info?.email || student.student_email || '',
            quizScore: quizScore,
            mockScore: mockScore,
            averageScore: averageScore,
            quizAttempts: student.quiz_attempts_count || 0,
            mockAttempts: student.mock_attempts_count || 0,
            subjectPerformance: student.subject_performance || student.subjectPerformance || {},
            course: student.profile?.grade || 'General',
            enrollmentDate: student.created_at ? new Date(student.created_at).toISOString().split('T')[0] : null,
            quizCompletionDate: student.quiz_completion_date || null,
            mockCompletionDate: student.mock_completion_date || null,
            quizTimeMinutes: student.quiz_time_minutes || 0,
            mockTimeMinutes: student.mock_time_minutes || 0
          };
        });
        
        console.log('📊 Processed students with scores:', studentsWithScores);
        setStudentsData(studentsWithScores);
      } catch (error) {
        console.error('❌ Error fetching students data:', error);
        setStudentsData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentsData();
  }, []);
  
  // Legacy mock data (kept for reference, but not used)
  const mockStudentsData = [
    {
      id: 1, initials: "JD", name: "John Doe", email: "john@example.com",
      enrollmentDate: "2024-01-15", course: "General", avatarColor: "avatar-blue",
      subjects: {
        mathematics: { score: 85, total: 100, status: "complete", timeSpent: "45 mins" },
        english: { score: 92, total: 100, status: "complete", timeSpent: "40 mins" },
        socialStudies: { score: 88, total: 100, status: "complete", timeSpent: "55 mins" },
        science: { score: 78, total: 100, status: "complete", timeSpent: "50 mins" },
        computer: { score: 95, total: 100, status: "complete", timeSpent: "35 mins" }
      },
      quiz: { status: "complete", score: 85, total: 100, timeSpent: "45 mins", date: "2024-03-15", attempts: 1 },
      mocktest: { status: "pending" }
    },
    {
      id: 2, initials: "JS", name: "Jane Smith", email: "jane@example.com",
      enrollmentDate: "2024-01-20", course: "General", avatarColor: "avatar-blue",
      subjects: {
        mathematics: { score: 92, total: 100, status: "complete", timeSpent: "38 mins" },
        english: { score: 88, total: 100, status: "complete", timeSpent: "48 mins" },
        socialStudies: { score: 76, total: 100, status: "complete", timeSpent: "52 mins" },
        science: { score: 85, total: 100, status: "complete", timeSpent: "48 mins" },
        computer: { score: 90, total: 100, status: "complete", timeSpent: "32 mins" }
      },
      quiz: { status: "complete", score: 92, total: 100, timeSpent: "38 mins", date: "2024-03-16", attempts: 1 },
      mocktest: { status: "complete", score: 78, total: 100, timeSpent: "120 mins", date: "2024-03-18", attempts: 2 }
    },
    {
      id: 3, initials: "MJ", name: "Mike Johnson", email: "mike@example.com",
      enrollmentDate: "2024-02-01", course: "General", avatarColor: "avatar-blue",
      subjects: {
        mathematics: { score: 65, total: 100, status: "complete", timeSpent: "60 mins" },
        english: { score: 82, total: 100, status: "complete", timeSpent: "45 mins" },
        socialStudies: { score: 90, total: 100, status: "complete", timeSpent: "50 mins" },
        science: { score: 72, total: 100, status: "complete", timeSpent: "55 mins" },
        computer: { score: 68, total: 100, status: "complete", timeSpent: "65 mins" }
      },
      quiz: { status: "pending" },
      mocktest: { status: "pending" }
    },
    {
      id: 4, initials: "SW", name: "Sarah Wilson", email: "sarah@example.com",
      enrollmentDate: "2024-01-25", course: "General", avatarColor: "avatar-blue",
      subjects: {
        mathematics: { score: 88, total: 100, status: "complete", timeSpent: "42 mins" },
        english: { score: 94, total: 100, status: "complete", timeSpent: "38 mins" },
        socialStudies: { score: 81, total: 100, status: "complete", timeSpent: "48 mins" },
        science: { score: 79, total: 100, status: "complete", timeSpent: "52 mins" },
        computer: { score: 91, total: 100, status: "complete", timeSpent: "30 mins" }
      },
      quiz: { status: "complete", score: 88, total: 100, timeSpent: "42 mins", date: "2024-03-17", attempts: 1 },
      mocktest: { status: "complete", score: 82, total: 100, timeSpent: "115 mins", date: "2024-03-19", attempts: 1 }
    },
    {
      id: 5, initials: "TB", name: "Tom Brown", email: "tom@example.com",
      enrollmentDate: "2024-02-05", course: "General", avatarColor: "avatar-blue",
      subjects: {
        mathematics: { score: 72, total: 100, status: "complete", timeSpent: "58 mins" },
        english: { score: 85, total: 100, status: "complete", timeSpent: "44 mins" },
        socialStudies: { score: 78, total: 100, status: "complete", timeSpent: "53 mins" },
        science: { score: 81, total: 100, status: "complete", timeSpent: "49 mins" },
        computer: { score: 76, total: 100, status: "complete", timeSpent: "62 mins" }
      },
      quiz: { status: "complete", score: 72, total: 100, timeSpent: "58 mins", date: "2024-03-20", attempts: 2 },
      mocktest: { status: "pending" }
    },
    {
      id: 6, initials: "ED", name: "Emma Davis", email: "emma@example.com",
      enrollmentDate: "2024-02-10", course: "General", avatarColor: "avatar-blue",
      subjects: {
        mathematics: { score: 95, total: 100, status: "complete", timeSpent: "35 mins" },
        english: { score: 89, total: 100, status: "complete", timeSpent: "41 mins" },
        socialStudies: { score: 92, total: 100, status: "complete", timeSpent: "46 mins" },
        science: { score: 87, total: 100, status: "complete", timeSpent: "43 mins" },
        computer: { score: 98, total: 100, status: "complete", timeSpent: "28 mins" }
      },
      quiz: { status: "complete", score: 95, total: 100, timeSpent: "35 mins", date: "2024-03-21", attempts: 1 },
      mocktest: { status: "complete", score: 90, total: 100, timeSpent: "110 mins", date: "2024-03-23", attempts: 1 }
    },
    {
      id: 7, initials: "AM", name: "Alex Miller", email: "alex@example.com",
      enrollmentDate: "2024-02-15", course: "General", avatarColor: "avatar-blue",
      subjects: {
        mathematics: { score: 58, total: 100, status: "complete", timeSpent: "70 mins" },
        english: { score: 62, total: 100, status: "complete", timeSpent: "65 mins" },
        socialStudies: { score: 71, total: 100, status: "complete", timeSpent: "60 mins" },
        science: { score: 55, total: 100, status: "complete", timeSpent: "75 mins" },
        computer: { score: 64, total: 100, status: "complete", timeSpent: "68 mins" }
      },
      quiz: { status: "pending" },
      mocktest: { status: "pending" }
    },
    {
      id: 8, initials: "LG", name: "Lisa Garcia", email: "lisa@example.com",
      enrollmentDate: "2024-02-20", course: "General", avatarColor: "avatar-blue",
      subjects: {
        mathematics: { score: 83, total: 100, status: "complete", timeSpent: "47 mins" },
        english: { score: 91, total: 100, status: "complete", timeSpent: "39 mins" },
        socialStudies: { score: 86, total: 100, status: "complete", timeSpent: "51 mins" },
        science: { score: 88, total: 100, status: "complete", timeSpent: "46 mins" },
        computer: { score: 84, total: 100, status: "complete", timeSpent: "44 mins" }
      },
      quiz: { status: "complete", score: 83, total: 100, timeSpent: "47 mins", date: "2024-03-22", attempts: 1 },
      mocktest: { status: "complete", score: 79, total: 100, timeSpent: "118 mins", date: "2024-03-24", attempts: 2 }
    },
    {
      id: 9, initials: "KM", name: "Kevin Martinez", email: "kevin@example.com",
      enrollmentDate: "2024-02-25", course: "General", avatarColor: "avatar-blue",
      subjects: {
        mathematics: { score: 75, total: 100, status: "complete", timeSpent: "52 mins" },
        english: { score: 80, total: 100, status: "complete", timeSpent: "48 mins" },
        socialStudies: { score: 82, total: 100, status: "complete", timeSpent: "55 mins" },
        science: { score: 77, total: 100, status: "complete", timeSpent: "50 mins" },
        computer: { score: 85, total: 100, status: "complete", timeSpent: "42 mins" }
      },
      quiz: { status: "pending" },
      mocktest: { status: "pending" }
    },
    {
      id: 10, initials: "AR", name: "Amy Robinson", email: "amy@example.com",
      enrollmentDate: "2024-03-01", course: "General", avatarColor: "avatar-blue",
      subjects: {
        mathematics: { score: 91, total: 100, status: "complete", timeSpent: "38 mins" },
        english: { score: 87, total: 100, status: "complete", timeSpent: "42 mins" },
        socialStudies: { score: 89, total: 100, status: "complete", timeSpent: "47 mins" },
        science: { score: 84, total: 100, status: "complete", timeSpent: "45 mins" },
        computer: { score: 93, total: 100, status: "complete", timeSpent: "33 mins" }
      },
      quiz: { status: "complete", score: 91, total: 100, timeSpent: "38 mins", date: "2024-03-25", attempts: 1 },
      mocktest: { status: "complete", score: 86, total: 100, timeSpent: "112 mins", date: "2024-03-27", attempts: 1 }
    }
  ];

  // Export functionality
  const exportToCSV = () => {
    // Prepare CSV headers
    const headers = [
      'Student ID',
      'Name',
      'Email',
      'Quiz Score',
      'Mock Score',
      'Average Score',
      'Quiz Attempts',
      'Mock Attempts'
    ];

    // Prepare CSV data
    const csvData = studentsData.map(student => {
      return [
        student.student_id || student.id,
        `"${student.name}"`,
        `"${student.email}"`,
        student.quizScore !== null ? student.quizScore : 'N/A',
        student.mockScore !== null ? student.mockScore : 'N/A',
        student.averageScore !== null ? student.averageScore.toFixed(2) : 'N/A',
        student.quizAttempts || 0,
        student.mockAttempts || 0
      ];
    });

    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `student_results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowExportConfirm(false);
  };

  const exportToPDF = () => {
    // Simple PDF export simulation
    alert(t('studentResults.pdfExportMessage'));
    setShowExportConfirm(false);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedStudent(null);
  };

  // Calculate summary statistics
  const calculateSummaryStats = () => {
    const totalStudents = studentsData.length;
    
    const quizCompleted = studentsData.filter(student => student.quizScore !== null).length;
    const quizPending = totalStudents - quizCompleted;
    
    const mocktestCompleted = studentsData.filter(student => student.mockScore !== null).length;
    const mocktestPending = totalStudents - mocktestCompleted;
    
    const totalQuizScore = studentsData
      .filter(student => student.quizScore !== null)
      .reduce((sum, student) => sum + student.quizScore, 0);
    const averageQuizScore = quizCompleted > 0 ? Math.round(totalQuizScore / quizCompleted) : 0;
    
    // Calculate class average from quiz and mock scores
    const allScores = studentsData
      .filter(student => student.averageScore !== null)
      .map(student => student.averageScore);
    const classAverage = allScores.length > 0 
      ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
      : 0;

    return {
      totalStudents,
      quizCompleted,
      quizPending,
      mocktestCompleted,
      mocktestPending,
      averageQuizScore,
      classAverage
    };
  };

  const summaryStats = calculateSummaryStats();

  // SummaryCards Component
  const SummaryCards = () => {
    const { t } = useTranslation();
    
    const containerStyle = {
      padding: '0px 30px 20px 30px'
    };

    const cardsGridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    };

    const cardStyle = {
      background: colors.white,
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: `1px solid ${colors.borderColor}`,
      textAlign: 'center'
    };

    const summaryData = [
      {
        value: summaryStats.totalStudents,
        label: t('studentResults.totalStudents'),
        description: t('studentResults.enrolledInCourse'),
        color: colors.primary,
        icon: '👥'
      },
      {
        value: `${summaryStats.quizCompleted}/${summaryStats.totalStudents}`,
        label: t('studentResults.quizCompleted'),
        description: t('studentResults.studentsFinishedQuiz'),
        color: colors.success,
        icon: '📝'
      },
      {
        value: `${summaryStats.mocktestCompleted}/${summaryStats.totalStudents}`,
        label: t('studentResults.mockTestsCompleted'),
        description: t('studentResults.studentsFinishedMockTest'),
        color: colors.info,
        icon: '🎯'
      }
    ];

    return (
      <div style={containerStyle}>
        <div style={cardsGridStyle}>
          {summaryData.map((item, index) => (
            <div key={index} style={cardStyle}>
              <div style={{fontSize: '2rem', marginBottom: '15px', color: item.color}}>
                {item.icon}
              </div>
              <div style={{fontSize: '2.2rem', fontWeight: '700', margin: '0 0 8px 0', color: item.color}}>
                {item.value}
              </div>
              <p style={{fontSize: '0.9rem', color: colors.muted, fontWeight: '500', margin: 0}}>
                {item.label}
              </p>
              <p style={{fontSize: '0.75rem', color: colors.muted, margin: '5px 0 0 0', fontStyle: 'italic'}}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ContentHeader Component
  const ContentHeader = () => {
    const { t } = useTranslation();
    
    const contentHeaderStyle = {
      background: 'transparent',
      padding: '20px 30px 0px 30px',
      marginTop: '20px'
    };

    const headerContentStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: '100%'
    };

    const titleStyle = {
      fontSize: '1.9rem',
      fontWeight: '700',
      color: colors.dark,
      margin: 0
    };

    const subtitleStyle = {
      fontSize: '0.9rem',
      color: colors.muted,
      margin: '4px 0 0 0'
    };

    const buttonsContainerStyle = {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    };

    const buttonStyle = {
      padding: '12px 20px',
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      minWidth: '140px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease'
    };

    const backButtonStyle = {
      ...buttonStyle,
      marginBottom: '15px'
    };

    return (
      <div style={contentHeaderStyle}>
        {currentView === 'details' && selectedStudent ? (
          <div style={{width: '100%'}}>
            <button 
              style={backButtonStyle} 
              onClick={handleBackToList}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = colors.secondary;
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = colors.primary;
              }}
            >
              ← {t('studentResults.backToList')}
            </button>
            <div style={headerContentStyle}>
              <div>
                <h1 style={titleStyle}>{t('studentResults.studentDetails')}</h1>
                <p style={subtitleStyle}>{t('studentResults.viewingDetails')} {selectedStudent.name}</p>
              </div>
            </div>
          </div>
        ) : (
          <div style={headerContentStyle}>
            <div>
              <h1 style={titleStyle}>{t('studentResults.dashboard')}</h1>
              <p style={subtitleStyle}>{t('studentResults.comprehensiveOverview')}</p>
            </div>
            {currentView !== 'details' && (
              <div style={buttonsContainerStyle}>
                <button 
                  style={buttonStyle}
                  onClick={() => setShowExportConfirm(true)}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = colors.secondary;
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = colors.primary;
                  }}
                >
                  📥 {t('studentResults.exportResults')}
                </button>
                <button 
                  style={{
                    ...buttonStyle,
                    backgroundColor: showAnalytics ? colors.accent : colors.primary
                  }}
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = showAnalytics ? '#8a2458' : colors.secondary;
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = showAnalytics ? colors.accent : colors.primary;
                  }}
                >
                  📈 {showAnalytics ? t('studentResults.hideAnalytics') : t('studentResults.showAnalytics')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // AnalyticsView Component
  const AnalyticsView = () => {
    const { t } = useTranslation();
    
    // Calculate subject-wise average scores (using quiz and mock scores)
    const calculateSubjectAverages = () => {
      // Since we don't have subject-wise breakdown, we'll show overall performance metrics
      // Return empty object or use quiz/mock averages as placeholders
      const quizScores = studentsData
        .filter(student => student.quizScore !== null)
        .map(student => student.quizScore);
      
      const mockScores = studentsData
        .filter(student => student.mockScore !== null)
        .map(student => student.mockScore);
      
      const averageQuiz = quizScores.length > 0 
        ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
        : 0;
      
      const averageMock = mockScores.length > 0
        ? Math.round(mockScores.reduce((sum, score) => sum + score, 0) / mockScores.length)
        : 0;
      
      // Return simplified structure for display
      return {
        quiz: averageQuiz,
        mockTest: averageMock
      };
    };

    // Calculate top performing student
    const calculateTopStudent = () => {
      const studentsWithAverage = studentsData
        .filter(student => student.averageScore !== null)
        .map(student => ({
          ...student,
          averageScore: student.averageScore || 0
        }));

      if (studentsWithAverage.length === 0) {
        return { averageScore: 0, name: 'N/A', email: 'N/A' };
      }

      return studentsWithAverage.reduce((topStudent, currentStudent) => {
        return currentStudent.averageScore > topStudent.averageScore ? currentStudent : topStudent;
      }, { averageScore: 0 });
    };

    // Calculate overall class average
    const calculateClassAverage = () => {
      const allAverageScores = studentsData
        .filter(student => student.averageScore !== null)
        .map(student => student.averageScore);

      if (allAverageScores.length === 0) return 0;
      
      const totalScore = allAverageScores.reduce((sum, score) => sum + score, 0);
      return Math.round(totalScore / allAverageScores.length);
    };

    const subjectAverages = calculateSubjectAverages();
    const topStudent = calculateTopStudent();
    const classAverage = calculateClassAverage();
    
    // Subject display names with icons
    const subjectData = {
      mathematics: { name: t('subjects.mathematics'), icon: '🧮', color: '#EF5350' },
      english: { name: t('subjects.english'), icon: '📚', color: '#4DD0E1' },
      socialStudies: { name: t('subjects.socialStudies'), icon: '🌍', color: '#3CB371' },
      science: { name: t('subjects.science'), icon: '🔬', color: '#FFA726' },
      computer: { name: t('subjects.computer'), icon: '💻', color: '#A62D69' }
    };

    const containerStyle = {
      padding: '20px 30px',
      backgroundColor: colors.light,
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif'
    };

    const headerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    };

    const titleStyle = {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: colors.dark,
      margin: 0
    };

    const closeButtonStyle = {
      padding: '10px 20px',
      backgroundColor: colors.danger,
      color: colors.white,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      fontFamily: 'Inter, sans-serif',
      transition: 'all 0.3s ease'
    };

    const cardStyle = {
      background: colors.white,
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: `1px solid ${colors.borderColor}`,
      marginBottom: '25px'
    };

    const cardTitleStyle = {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: colors.primary,
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    };

    // Calculate overall statistics
    const totalStudents = studentsData.length;
    const quizCompleted = studentsData.filter(student => student.quizScore !== null).length;
    const mocktestCompleted = studentsData.filter(student => student.mockScore !== null).length;
    const totalQuizScore = studentsData
      .filter(student => student.quizScore !== null)
      .reduce((sum, student) => sum + (student.quizScore || 0), 0);
    const averageQuizScore = quizCompleted > 0 ? Math.round(totalQuizScore / quizCompleted) : 0;

    // Stats card style
    const statCardStyle = {
      textAlign: 'center',
      padding: '25px 20px',
      backgroundColor: colors.white,
      borderRadius: '12px',
      border: `1px solid ${colors.borderColor}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    };

    const statValueStyle = {
      fontSize: '2.2rem',
      fontWeight: '800',
      marginBottom: '8px',
      background: 'linear-gradient(135deg, #2D5D7B, #79B3D7)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    };

    const statLabelStyle = {
      fontSize: '0.85rem',
      color: colors.muted,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    };

    // Subject Performance Cards
    const subjectCardStyle = {
      background: colors.white,
      padding: '20px',
      borderRadius: '12px',
      border: `1px solid ${colors.borderColor}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    };

    const progressBarContainerStyle = {
      width: '100%',
      height: '8px',
      backgroundColor: colors.primaryLight,
      borderRadius: '10px',
      overflow: 'hidden',
      marginTop: '12px'
    };

    const getProgressBarStyle = (percentage, color) => ({
      height: '100%',
      width: `${percentage}%`,
      backgroundColor: color,
      borderRadius: '10px',
      transition: 'width 0.8s ease',
      position: 'relative'
    });

    const getGradeColor = (percentage) => {
      if (percentage >= 90) return colors.success;
      if (percentage >= 80) return '#4CAF50';
      if (percentage >= 70) return '#8BC34A';
      if (percentage >= 60) return colors.warning;
      return colors.danger;
    };

    const getGradeText = (percentage) => {
      if (percentage >= 90) return t('studentResults.excellent');
      if (percentage >= 80) return t('studentResults.veryGood');
      if (percentage >= 70) return t('studentResults.good');
      if (percentage >= 60) return t('studentResults.average');
      return t('studentResults.needsImprovement');
    };

    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>📊 {t('studentResults.analyticsDashboard')}</h1>
          <button 
            style={closeButtonStyle}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#c82333';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = colors.danger;
            }}
            onClick={() => setShowAnalytics(false)}
          >
            ✕ {t('studentResults.closeAnalytics')}
          </button>
        </div>

        {/* Overall Statistics */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>📈 {t('studentResults.overallPerformanceSummary')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={statCardStyle}>
              <div style={{...statValueStyle}}>
                {totalStudents}
              </div>
              <div style={statLabelStyle}>{t('studentResults.totalStudents')}</div>
            </div>
            <div style={statCardStyle}>
              <div style={{...statValueStyle}}>
                {quizCompleted}
              </div>
              <div style={statLabelStyle}>{t('studentResults.quizCompleted')}</div>
            </div>
            <div style={statCardStyle}>
              <div style={{...statValueStyle}}>
                {mocktestCompleted}
              </div>
              <div style={statLabelStyle}>{t('studentResults.mockTestsCompleted')}</div>
            </div>
            <div style={statCardStyle}>
              <div style={{...statValueStyle}}>
                {averageQuizScore}%
              </div>
              <div style={statLabelStyle}>{t('studentResults.averageQuizScore')}</div>
            </div>
          </div>
        </div>

        {/* Assessment Performance Cards */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>🎯 Assessment Performance</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Quiz Performance Card */}
            {subjectAverages.quiz > 0 && (
              <div 
                style={subjectCardStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      fontSize: '1.5rem',
                      background: 'linear-gradient(135deg, #3CB371, #3CB37199)',
                      borderRadius: '10px',
                      padding: '8px'
                    }}>
                      📝
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: colors.dark, fontSize: '1rem' }}>
                        Quiz Average
                      </div>
                      <div style={{ fontSize: '0.8rem', color: colors.muted, marginTop: '2px' }}>
                        {getGradeText(subjectAverages.quiz)}
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '1.4rem', 
                    fontWeight: '700', 
                    color: getGradeColor(subjectAverages.quiz),
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {subjectAverages.quiz}%
                  </div>
                </div>
                
                <div style={progressBarContainerStyle}>
                  <div style={getProgressBarStyle(subjectAverages.quiz, getGradeColor(subjectAverages.quiz))}></div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: colors.muted }}>0%</span>
                  <span style={{ fontSize: '0.75rem', color: colors.muted }}>100%</span>
                </div>
              </div>
            )}
            
            {/* Mock Test Performance Card */}
            {subjectAverages.mockTest > 0 && (
              <div 
                style={subjectCardStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      fontSize: '1.5rem',
                      background: 'linear-gradient(135deg, #4DD0E1, #4DD0E199)',
                      borderRadius: '10px',
                      padding: '8px'
                    }}>
                      🎯
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: colors.dark, fontSize: '1rem' }}>
                        Mock Test Average
                      </div>
                      <div style={{ fontSize: '0.8rem', color: colors.muted, marginTop: '2px' }}>
                        {getGradeText(subjectAverages.mockTest)}
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '1.4rem', 
                    fontWeight: '700', 
                    color: getGradeColor(subjectAverages.mockTest),
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {subjectAverages.mockTest}%
                  </div>
                </div>
                
                <div style={progressBarContainerStyle}>
                  <div style={getProgressBarStyle(subjectAverages.mockTest, getGradeColor(subjectAverages.mockTest))}></div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: colors.muted }}>0%</span>
                  <span style={{ fontSize: '0.75rem', color: colors.muted }}>100%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performance Distribution */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>📊 {t('studentResults.performanceDistribution')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {/* Quiz Performance */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.primary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📝 {t('studentResults.quizCompletion')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ minWidth: '100px', fontWeight: '500', color: colors.dark, fontSize: '0.9rem' }}>
                    {t('studentResults.completed')}
                  </div>
                  <div style={{ flex: 1, height: '12px', backgroundColor: colors.primaryLight, borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${(quizCompleted / totalStudents) * 100}%`, 
                      backgroundColor: colors.success,
                      borderRadius: '10px'
                    }}></div>
                  </div>
                  <div style={{ minWidth: '40px', textAlign: 'right', fontWeight: '600', color: colors.dark, fontSize: '0.9rem' }}>
                    {quizCompleted}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ minWidth: '100px', fontWeight: '500', color: colors.dark, fontSize: '0.9rem' }}>
                    {t('studentResults.pending')}
                  </div>
                  <div style={{ flex: 1, height: '12px', backgroundColor: colors.primaryLight, borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${((totalStudents - quizCompleted) / totalStudents) * 100}%`, 
                      backgroundColor: colors.muted,
                      borderRadius: '10px'
                    }}></div>
                  </div>
                  <div style={{ minWidth: '40px', textAlign: 'right', fontWeight: '600', color: colors.dark, fontSize: '0.9rem' }}>
                    {totalStudents - quizCompleted}
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Test Performance */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.primary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎯 {t('studentResults.mockTestCompletion')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ minWidth: '100px', fontWeight: '500', color: colors.dark, fontSize: '0.9rem' }}>
                    {t('studentResults.completed')}
                  </div>
                  <div style={{ flex: 1, height: '12px', backgroundColor: colors.primaryLight, borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${(mocktestCompleted / totalStudents) * 100}%`, 
                      backgroundColor: colors.info,
                      borderRadius: '10px'
                    }}></div>
                  </div>
                  <div style={{ minWidth: '40px', textAlign: 'right', fontWeight: '600', color: colors.dark, fontSize: '0.9rem' }}>
                    {mocktestCompleted}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ minWidth: '100px', fontWeight: '500', color: colors.dark, fontSize: '0.9rem' }}>
                    {t('studentResults.pending')}
                  </div>
                  <div style={{ flex: 1, height: '12px', backgroundColor: colors.primaryLight, borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${((totalStudents - mocktestCompleted) / totalStudents) * 100}%`, 
                      backgroundColor: colors.muted,
                      borderRadius: '10px'
                    }}></div>
                  </div>
                  <div style={{ minWidth: '40px', textAlign: 'right', fontWeight: '600', color: colors.dark, fontSize: '0.9rem' }}>
                    {totalStudents - mocktestCompleted}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>🌟 {t('studentResults.performanceInsights')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div style={{ 
              padding: '20px', 
              background: 'linear-gradient(135deg, rgba(166, 45, 105, 0.1), rgba(166, 45, 105, 0.05))',
              borderRadius: '12px',
              border: `1px solid ${colors.accent}20`
            }}>
              <h4 style={{ color: colors.accent, margin: '0 0 12px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏆 {t('studentResults.topPerformingStudent')}
              </h4>
              <p style={{ margin: 0, color: colors.dark, fontWeight: '600', fontSize: '1.1rem' }}>
                {topStudent.name || 'N/A'}
              </p>
              {/* <p style={{ margin: '8px 0 0 0', color: colors.muted, fontSize: '0.9rem' }}>
                {t('common.averageScore')}: <span style={{ color: colors.accent, fontWeight: '600' }}>{topStudent.averageScore || 0}%</span>
              </p> */}
              <p style={{ margin: '4px 0 0 0', color: colors.muted, fontSize: '0.8rem' }}>
                {t('common.email')}: {topStudent.email || 'N/A'}
              </p>
            </div>
            <div style={{ 
              padding: '20px', 
              background: 'linear-gradient(135deg, rgba(45, 93, 123, 0.1), rgba(45, 93, 123, 0.05))',
              borderRadius: '12px',
              border: `1px solid ${colors.primary}20`
            }}>
              <h4 style={{ color: colors.primary, margin: '0 0 12px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📊 {t('studentResults.overallClassAverage')}
              </h4>
              <p style={{ margin: 0, color: colors.dark, fontWeight: '600', fontSize: '1.8rem' }}>
                {classAverage}%
              </p>
              <p style={{ margin: '8px 0 0 0', color: colors.muted, fontSize: '0.9rem' }}>
                {t('studentResults.acrossAllSubjects')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // StudentList Component
  const StudentList = () => {
    const { t } = useTranslation();
    
    const containerStyle = {
      padding: '0px 30px 20px 30px',
      backgroundColor: colors.light,
      minHeight: 'calc(100vh - 200px)'
    };

    const controlsStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      gap: '15px'
    };

    const searchInputStyle = {
      padding: '12px 15px',
      border: `1px solid ${colors.borderColor}`,
      borderRadius: '8px',
      fontSize: '0.9rem',
      width: '300px'
    };

    const filterSelectStyle = {
      padding: '12px 15px',
      border: `1px solid ${colors.borderColor}`,
      borderRadius: '8px',
      fontSize: '0.9rem',
      backgroundColor: colors.white
    };

    const tableStyle = {
      width: '100%',
      backgroundColor: colors.white,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      border: `1px solid ${colors.borderColor}`
    };

    const tableHeaderStyle = {
      backgroundColor: colors.primary,
      color: colors.white,
      padding: '15px 20px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '0.9rem'
    };

    const tableCellStyle = {
      padding: '15px 20px',
      fontSize: '0.85rem',
      color: colors.dark
    };

    const avatarStyle = {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: colors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.white,
      fontWeight: 'bold',
      fontSize: '0.9rem',
      marginRight: '10px'
    };

    const studentInfoStyle = {
      display: 'flex',
      alignItems: 'center'
    };

    const statusStyle = (status) => ({
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'inline-block',
      backgroundColor: status === 'complete' ? colors.success + '20' : colors.warning + '20',
      color: status === 'complete' ? colors.success : colors.warning
    });

    const viewDetailsButtonStyle = {
      padding: '8px 16px',
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      fontWeight: '600',
      minWidth: '100px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    };

    const filteredStudents = studentsData.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' ||
                           (filterStatus === 'quiz' && student.quizScore !== null) ||
                           (filterStatus === 'mocktest' && student.mockScore !== null) ||
                           (filterStatus === 'pending' && (student.quizScore === null && student.mockScore === null));
      return matchesSearch && matchesFilter;
    });

    return (
      <div style={containerStyle}>
        <div style={controlsStyle}>
          <input
            type="text"
            placeholder={t('studentResults.searchStudents')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={filterSelectStyle}
          >
            <option value="all">{t('studentResults.allStudents')}</option>
            <option value="quiz">{t('studentResults.quizCompletedFilter')}</option>
            <option value="mocktest">{t('studentResults.mockTestCompletedFilter')}</option>
            <option value="pending">{t('studentResults.pendingTests')}</option>
          </select>
        </div>

        <div style={tableStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, width: '5%' }}>{t('studentResults.serialNumber')}</th>
                <th style={{ ...tableHeaderStyle, width: '25%' }}>{t('studentResults.student')}</th>
                <th style={{ ...tableHeaderStyle, width: '15%' }}>Quiz Score</th>
                <th style={{ ...tableHeaderStyle, width: '15%' }}>Mock Score</th>
                <th style={{ ...tableHeaderStyle, width: '15%' }}>{t('studentResults.averageScore')}</th>
                <th style={{ ...tableHeaderStyle, width: '15%' }}>{t('studentResults.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ ...tableCellStyle, textAlign: 'center', padding: '40px' }}>
                    Loading students data...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ ...tableCellStyle, textAlign: 'center', padding: '40px', color: colors.muted }}>
                    {t('studentResults.noStudentsFound')}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  // Calculate average: (quizScore + mockScore) / 2, or use available score
                  let displayAverage = null;
                  if (student.quizScore !== null && student.mockScore !== null) {
                    displayAverage = Math.round((student.quizScore + student.mockScore) / 2);
                  } else if (student.quizScore !== null) {
                    displayAverage = student.quizScore;
                  } else if (student.mockScore !== null) {
                    displayAverage = student.mockScore;
                  }
                  
                  return (
                    <tr key={student.id} style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
                      <td style={tableCellStyle}><strong>{index + 1}</strong></td>
                      <td style={tableCellStyle}>
                        <div style={studentInfoStyle}>
                          <div style={avatarStyle}>{student.initials}</div>
                          <div>
                            <div style={{fontWeight: '600', marginBottom: '2px'}}>{student.name}</div>
                            <div style={{fontSize: '0.75rem', color: colors.muted}}>{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        {student.quizScore !== null ? (
                          <strong style={{ color: colors.success, fontSize: '0.9rem' }}>
                            {student.quizScore}%
                          </strong>
                        ) : (
                          <span style={{ color: colors.muted, fontSize: '0.85rem' }}>N/A</span>
                        )}
                      </td>
                      <td style={tableCellStyle}>
                        {student.mockScore !== null ? (
                          <strong style={{ color: colors.info, fontSize: '0.9rem' }}>
                            {student.mockScore}%
                          </strong>
                        ) : (
                          <span style={{ color: colors.muted, fontSize: '0.85rem' }}>N/A</span>
                        )}
                      </td>
                      <td style={tableCellStyle}>
                        {displayAverage !== null ? (
                          <strong style={{ color: colors.primary, fontSize: '0.9rem' }}>
                            {displayAverage}%
                          </strong>
                        ) : (
                          <span style={{ color: colors.muted, fontSize: '0.85rem' }}>N/A</span>
                        )}
                      </td>
                      <td style={tableCellStyle}>
                        <button
                          style={viewDetailsButtonStyle}
                          onClick={() => handleViewDetails(student)}
                        >
                          {t('studentResults.viewDetails')}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    );
  };

  // ExportModal Component
  const ExportModal = () => {
    const { t } = useTranslation();
    
    if (!showExportConfirm) return null;

    const overlayStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    };

    const modalStyle = {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      maxWidth: '500px',
      width: '90%'
    };

    const buttonContainerStyle = {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
      justifyContent: 'flex-end',
      flexWrap: 'wrap'
    };

    const buttonStyle = {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    };

    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h3 style={{ marginTop: 0, color: colors.primary }}>{t('studentResults.exportStudentResults')}</h3>
          <p>{t('studentResults.chooseExportFormat')}</p>
          
          <div style={buttonContainerStyle}>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: colors.success,
                color: 'white',
                flex: 1,
                minWidth: '120px'
              }}
              onClick={exportToCSV}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#35a165';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = colors.success;
              }}
            >
              📊 {t('studentResults.exportAsCSV')}
            </button>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: colors.muted,
                color: colors.dark
              }}
              onClick={() => setShowExportConfirm(false)}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#9eacb4';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = colors.muted;
              }}
            >
              {t('studentResults.cancel')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main container with responsive layout
  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: colors.light
  };

  const mainContentStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '0px',
    width: 'calc(100% - 240px)',
    minWidth: 'calc(100% - 240px)',
    overflowX: 'auto'
  };

  return (
    <div style={containerStyle}>
      <ExportModal />
      <Sidebar />
      
      <div style={mainContentStyle}>
        {currentView !== 'details' && !showAnalytics && (
          <>
            <ContentHeader />
            <SummaryCards />
          </>
        )}

        {showAnalytics ? (
          <AnalyticsView />
        ) : (
          <>
            {currentView === 'details' ? (
              <Studentresults 
                selectedStudent={selectedStudent} 
                handleBackToList={handleBackToList} 
              />
            ) : !showAnalytics && (
              <StudentList />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Results;