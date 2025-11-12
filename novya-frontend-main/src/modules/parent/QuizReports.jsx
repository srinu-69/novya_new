import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaChartLine, FaMedal, FaExclamationTriangle, FaArrowUp
} from 'react-icons/fa';
import { Table } from 'react-bootstrap';
import { API_CONFIG, djangoAPI } from '../../config/api';

// Status configuration function
const getStatusConfig = (status, t) => {
  switch (status) {
    case 'Excellent':
      return {
        icon: <FaMedal className="me-1" />,
        bgColor: '#d4edda',
        textColor: '#155724',
        border: '#c3e6cb',
        translatedStatus: t('excellent', { defaultValue: 'Excellent' }),
      };
    case 'Good':
      return {
        icon: <FaChartLine className="me-1" />,
        bgColor: '#d1ecf1',
        textColor: '#0c5460',
        border: '#bee5eb',
        translatedStatus: t('good', { defaultValue: 'Good' }),
      };
    case 'Needs Attention':
      return {
        icon: <FaExclamationTriangle className="me-1" />,
        bgColor: '#f8d7da',
        textColor: '#721c24',
        border: '#f5c6cb',
        translatedStatus: t('needsAttention', { defaultValue: 'Needs Attention' }),
      };
    default:
      return {
        icon: <FaChartLine className="me-1" />,
        bgColor: '#e2e3e5',
        textColor: '#383d41',
        border: '#d6d8db',
        translatedStatus: status,
      };
  }
};

const QuizReports = () => {
  console.log('🔍 Debug - QuizReports component rendered');
  const { t } = useTranslation();
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch quiz data from backend
  useEffect(() => {
    console.log('🔍 Debug - QuizReports useEffect called');
    console.log('🔍 Debug - API_CONFIG.DJANGO.QUIZZES.CHILD_ATTEMPTS:', API_CONFIG.DJANGO.QUIZZES.CHILD_ATTEMPTS);
    
    const fetchQuizData = async () => {
      try {
        console.log('🔍 Debug - Fetching quiz data from backend...');
        
        // Check if we already have data in localStorage to avoid duplicate calls
        const cachedData = localStorage.getItem('quizReportsData');
        const lastFetch = localStorage.getItem('quizReportsDataLastFetch');
        const now = Date.now();
        
        // Use cached data if it's less than 5 minutes old
        if (cachedData && lastFetch && (now - parseInt(lastFetch)) < 300000) {
          console.log('🔍 Debug - Using cached quiz reports data');
          const parsedData = JSON.parse(cachedData);
          setQuizData(parsedData || []);
          setLoading(false);
          return;
        }
        
        console.log('🔍 Debug - URL:', API_CONFIG.DJANGO.QUIZZES.CHILD_ATTEMPTS);
        const response = await djangoAPI.get(API_CONFIG.DJANGO.QUIZZES.CHILD_ATTEMPTS);
        console.log('🔍 Debug - Quiz response:', response);
        
        if (response && response.attempts) {
          // Filter for quiz attempts only (not mock tests)
          const quizzes = response.attempts.filter(attempt => attempt.type === 'quiz');
          
          console.log('🔍 Debug - Raw quiz attempts from backend:', quizzes);
          
          // Transform the data to match our component structure
          const transformedData = quizzes.map(attempt => ({
            subject: attempt.subject || 'Unknown Subject',
            class: attempt.class_name || 'Unknown Class',
            chapter: attempt.chapter || 'Unknown Chapter',
            subtopic: attempt.subtopic || 'General Quiz',
            date: new Date(attempt.attempted_at).toISOString().split('T')[0],
            score: attempt.score || 0,
            total: 100, // Assuming total is 100 for quizzes
            status: attempt.score >= 80 ? 'Excellent' : attempt.score >= 60 ? 'Good' : 'Needs Attention',
            trend: 'up', // Default trend
            improvement: '+0%', // Default improvement
            // Add additional fields from the backend
            attempt_id: attempt.attempt_id,
            quiz_type: attempt.quiz_type,
            completion_percentage: attempt.completion_percentage
          }));
          
          console.log('🔍 Debug - Transformed quiz data:', transformedData);
          
          // Cache the data
          localStorage.setItem('quizReportsData', JSON.stringify(transformedData));
          localStorage.setItem('quizReportsDataLastFetch', now.toString());
          
          setQuizData(transformedData);
        } else {
          console.log('🔍 Debug - No quiz data found, using fallback');
          setQuizData([]);
        }
      } catch (error) {
        console.error('❌ Error fetching quiz data:', error);
        console.error('❌ Error details:', error.message);
        console.error('❌ Error stack:', error.stack);
        // No fallback data - show empty state if backend fails
        setQuizData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  // Header stats
  const quizCount = quizData.length;
  const upQuizzes = quizData.filter(q => q.trend === 'up').length;
  const avgScore = quizCount > 0 ? Math.round(
    quizData.reduce((a, b) => a + b.score, 0) / quizCount
  ) : 0;
  const excQuizzes = quizData.filter(q => q.status === 'Excellent').length;

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: '#e9eaf0ff', 
        padding: "2rem 1rem", 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center', color: '#2d3748' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #8B5CF6', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading quiz data...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      {/* Custom CSS for animation & responsiveness */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
       
        /* Responsive card style */
        .responsive-card {
          background: rgba(255,255,255,0.95) !important;
          backdrop-filter: blur(10px);
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }
        
        .responsive-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }
        
        /* Icon styling */
        .icon-sm {
          width: 20px;
          height: 20px;
        }
        
        /* Progress bar styling */
        .progress-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .progress-bar-wrapper {
          flex: 1;
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .progress-percentage {
          font-size: 0.8rem;
          font-weight: 600;
          min-width: 35px;
        }
        
        /* Status badge styling */
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        /* Table styling */
        .table-container {
          overflow-x: auto;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        /* Mobile responsive test list */
        .test-list {
          display: none;
        }
        
        @media (max-width: 768px) {
          .table-container {
            display: none;
          }
          
          .test-list {
            display: block;
          }
          
          .test-item {
            background: rgba(255,255,255,0.95);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid rgba(255,255,255,0.2);
          }
          
          .test-label {
            font-weight: 600;
            color: #6c757d;
            font-size: 0.85rem;
          }
          
          .test-value {
            font-weight: 500;
            color: #2d3748;
            margin-left: 0.5rem;
          }
        }
      `}</style>

      <div className="container-fluid p-3">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center mb-2">
              <div className="p-2 rounded-circle me-2" style={{ backgroundColor: '#667eea20' }}>
                <FaChartLine className="icon-sm" style={{ color: '#667eea' }} />
              </div>
              <div>
                <h4 className="fw-bold mb-0" style={{ color: '#2d3748' }}>Quiz Reports</h4>
                <p className="text-muted small mb-0">Track your child's quiz performance and progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 responsive-card">
              <div className="card-body p-3">
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <div className="card border-0 responsive-card">
                      <div className="card-body p-2 text-center">
                        <div className="p-1 rounded-circle mx-auto mb-1" style={{ backgroundColor: '#28a74520', width: 'fit-content' }}>
                          <FaMedal className="icon-sm" style={{ color: '#28a745', width: 20, height: 20 }} />
                        </div>
                        <h5 className="fw-bold mb-0" style={{ color: '#28a745' }}>{excQuizzes}</h5>
                        <p className="text-muted small mb-0">Excellent Scores</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="card border-0 responsive-card">
                      <div className="card-body p-2 text-center">
                        <div className="p-1 rounded-circle mx-auto mb-1" style={{ backgroundColor: '#4facfe20', width: 'fit-content' }}>
                          <FaChartLine className="icon-sm" style={{ color: '#4facfe', width: 20, height: 20 }} />
                        </div>
                        <h5 className="fw-bold mb-0" style={{ color: '#4facfe' }}>
                          {avgScore}%
                        </h5>
                        <p className="text-muted small mb-0">Average Score</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="card border-0 responsive-card">
                      <div className="card-body p-2 text-center">
                        <div className="p-1 rounded-circle mx-auto mb-1" style={{ backgroundColor: '#17a2b820', width: 'fit-content' }}>
                          <FaArrowUp className="icon-sm" style={{ color: '#17a2b8', width: 20, height: 20 }} />
                        </div>
                        <h5 className="fw-bold mb-0" style={{ color: '#17a2b8' }}>
                          {quizCount}
                        </h5>
                        <p className="text-muted small mb-0">Total Quizzes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 responsive-card">
              <div className="card-body p-2">
                <div className="d-flex align-items-center mb-2">
                  <div className="p-1 rounded-circle me-1" style={{ backgroundColor: '#667eea20' }}>
                    <FaChartLine className="icon-sm" style={{ color: '#667eea', width: 20, height: 20 }} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Detailed Summary</h6>
                    <p className="text-muted small mb-0">Performance of recent quizzes</p>
                  </div>
                </div>
                <div className="table-container">
                  <Table responsive="sm" style={{ marginBottom: 0 }}>
                    <thead style={{ backgroundColor: '#2d5d7b', color: '#fff' }}>
                      <tr>
                        <th className="text-center py-1">Date</th>
                        <th className="text-center py-1">Class</th>
                        <th className="text-center py-1">Subject</th>
                        <th className="text-center py-1">Score</th>
                        <th className="text-center py-1">Progress</th>
                        <th className="text-center py-1">Status</th>
                        <th className="text-center py-1">Chapter</th>
                        <th className="text-center py-1">Subtopic</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizData.map((quiz, index) => {
                        const percentage = (quiz.score / quiz.total) * 100;
                        const status = getStatusConfig(quiz.status, t);
                        const isUp = quiz.trend === 'up';
                        return (
                          <tr key={index} style={{
                            animation: `fadeInUp 0.5s ease-in ${index * 0.1}s`,
                            animationFillMode: 'both',
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f4f8fb',
                            borderBottom: '1px solid rgba(0,0,0,0.05)'
                          }}>
                            <td className="text-center fw-medium">{quiz.date}</td>
                            <td className="text-center fw-bold">{quiz.class}</td>
                            <td className="text-center fw-bold">{t(`subjects.${quiz.subject.toLowerCase().replace(' ', '-')}`, { defaultValue: quiz.subject })}</td>
                            <td className="text-center fw-semibold">
                              {quiz.score}<span className="text-muted">/{quiz.total}</span>
                            </td>
                            <td>
                              <div className="progress-container justify-content-center">
                                <div className="progress-bar-wrapper">
                                  <div className="progress-bar" style={{
                                    width: `${percentage}%`,
                                    backgroundColor: percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545',
                                  }} />
                                </div>
                                <span className="progress-percentage" style={{
                                  color: percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545'
                                }}>
                                  {Math.round(percentage)}%
                                </span>
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="status-badge" style={{
                                background: status.bgColor,
                                color: status.textColor,
                                border: `1px solid ${status.border}`,
                              }}>
                                {status.icon}
                                {status.translatedStatus}
                              </div>
                            </td>
                            <td className="text-center fw-bold" style={{ fontSize: '0.8rem' }}>
                              {quiz.chapter}
                            </td>
                            <td className="text-center fw-bold" style={{ fontSize: '0.8rem' }}>
                              {quiz.subtopic}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
                <div className="test-list">
                  {quizData.map((quiz, index) => {
                    const percentage = (quiz.score / quiz.total) * 100;
                    const status = getStatusConfig(quiz.status, t);
                    const isUp = quiz.trend === 'up';
                    return (
                      <div key={index} className="test-item" style={{
                        animation: `fadeInUp 0.5s ease-in ${index * 0.1}s`,
                        animationFillMode: 'both',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f4f8fb',
                      }}>
                        <div><span className="test-label">Date:</span> <span className="test-value">{quiz.date}</span></div>
                        <div><span className="test-label">Class:</span> <span className="test-value">{quiz.class}</span></div>
                        <div><span className="test-label">Subject:</span> <span className="test-value">{t(`subjects.${quiz.subject.toLowerCase().replace(' ', '-')}`, { defaultValue: quiz.subject })}</span></div>
                        <div><span className="test-label">Score:</span> <span className="test-value">{quiz.score}/{quiz.total}</span></div>
                        <div className="progress-container">
                          <div className="progress-bar-wrapper">
                            <div className="progress-bar" style={{
                              width: `${percentage}%`,
                              backgroundColor: percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545',
                            }} />
                          </div>
                          <span className="progress-percentage" style={{
                            color: percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545'
                          }}>
                            {Math.round(percentage)}%
                          </span>
                        </div>
                        <div><span className="test-label">Status:</span>
                          <div className="status-badge" style={{
                            background: status.bgColor,
                            color: status.textColor,
                            border: `1px solid ${status.border}`,
                            display: 'inline-flex',
                            verticalAlign: 'middle',
                          }}>
                            {status.icon}
                            {status.translatedStatus}
                          </div>
                        </div>
                        <div><span className="test-label">Subtopic:</span> <span className="test-value">
                          {quiz.subtopic}
                        </span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizReports;
