
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight, BarChart2, BookOpen, Briefcase, Clock, Compass,
  Globe, GraduationCap, Rocket, Star, Target, TrendingUp, Users, X,
  Bookmark, Award, Code, Music, Palette, Mic
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './career.css';
import { useQuiz } from './QuizContext';
import Navbar from './Navbarrr';

const Career = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { quizResults, mockTestResults, getQuizHistory, getMockHistory } = useQuiz();

  // ✅ Safe initialization of quiz and mock results
  const [safeQuizResults, setSafeQuizResults] = useState({
    totalScore: 0,
    totalQuestions: 0,
    totalQuizzes: 0,
    byLevel: {}
  });

  const [safeMockResults, setSafeMockResults] = useState({
    totalScore: 0,
    totalQuestions: 0,
    totalTests: 0
  });

  useEffect(() => {
    document.title = `${t('performance.title')} | NOVYA - Your Smart Learning Platform`;
  }, [t]);

  // ✅ Initialize results safely
  useEffect(() => {
    try {
      // Get current quiz results if available
      if (quizResults && typeof quizResults === 'object') {
        setSafeQuizResults({
          totalScore: quizResults.totalScore || 0,
          totalQuestions: quizResults.totalQuestions || 0,
          totalQuizzes: quizResults.totalQuizzes || (quizResults.totalQuestions > 0 ? 1 : 0),
          byLevel: quizResults.byLevel || {}
        });
      }

      // Initialize mock results safely
      if (mockTestResults && typeof mockTestResults === 'object') {
        setSafeMockResults({
          totalScore: mockTestResults.totalScore || 0,
          totalQuestions: mockTestResults.totalQuestions || 0,
          totalTests: mockTestResults.totalTests || 0
        });
      }
    } catch (error) {
      console.error('Error initializing quiz results:', error);
      // Keep default values if there's an error
    }
  }, [quizResults, mockTestResults]);

  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    successRate: 0,
    careers: 0,
    universities: 0
  });
  const [showDetails, setShowDetails] = useState(null);
  const [heroAnimation, setHeroAnimation] = useState(false);

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

    animateValue(0, 12500, 2000, (val) => setAnimatedStats(prev => ({ ...prev, students: val })));
    animateValue(0, 92, 1800, (val) => setAnimatedStats(prev => ({ ...prev, successRate: val })));
    animateValue(0, 350, 2200, (val) => setAnimatedStats(prev => ({ ...prev, careers: val })));
    animateValue(0, 2800, 2500, (val) => setAnimatedStats(prev => ({ ...prev, universities: val })));

    setTimeout(() => {
      setHeroAnimation(true);
    }, 500);
  }, []);

  // ✅ Safe calculation of averages
  const quizAverage = safeQuizResults.totalQuestions > 0
    ? ((safeQuizResults.totalScore / safeQuizResults.totalQuestions) * 100).toFixed(1)
    : 0;

  const mockAverage = safeMockResults.totalQuestions > 0
    ? ((safeMockResults.totalScore / safeMockResults.totalQuestions) * 100).toFixed(1)
    : 0;

  const scrollToMetrics = () => {
    metricsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateToHome = () => {
    navigate('/student/dashboard');
  };

  const performanceMetrics = [
    {
      id: 'academic',
      title: t('aca_demic'),
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
      title: t('qu_iz'),
      icon: <BookOpen size={24} />,
      metrics: [
        {
          name: t('metrics.totalQuizzes'),
          value: safeQuizResults.totalQuizzes || 0,
          max: 50,
          trend: 'up'
        },
        {
          name: t('metrics.averageScore'),
          value: parseFloat(quizAverage) || 0,
          unit: '%',
          max: 100,
          trend: 'up'
        },
        {
          name: t('metrics.totalQuestions'),
          value: safeQuizResults.totalQuestions || 0,
          max: 500,
          trend: 'steady'
        }
      ],
      details: {
        description: t('quiz.description'),
        strengths: [
          t('quiz.strengths.0'),
          t('quiz.strengths.1', { count: Object.keys(safeQuizResults.byLevel || {}).length }),
          t('quiz.strengths.2')
        ],
        recommendations: [
          t('quiz.recommendations.0'),
          t('quiz.recommendations.1'),
          t('quiz.recommendations.2')
        ],
        history: getQuizHistory ? getQuizHistory() : [], // Dynamic history from context
        chartData: {
          labels: Object.keys(safeQuizResults.byLevel || {}).length > 0
            ? Object.keys(safeQuizResults.byLevel)
            : [t('quiz.chart.noData') || 'No Data'],
          datasets: [
            {
              label: t('quiz.chart.label'),
              data: Object.keys(safeQuizResults.byLevel || {}).length > 0
                ? Object.values(safeQuizResults.byLevel)
                : [0],
              backgroundColor: 'rgba(102, 126, 234, 0.6)'
            }
          ]
        }
      }
    },
    {
      id: 'mock',
      title: t('mo_ck'),
      icon: <Clock size={24} />,
      metrics: [
        {
          name: t('metrics.totalTests'),
          value: safeMockResults.totalTests || 0,
          max: 10,
          trend: 'up'
        },
        {
          name: t('metrics.averageScore'),
          value: parseFloat(mockAverage) || 0,
          unit: '%',
          max: 100,
          trend: 'up'
        },
        {
          name: t('metrics.totalQuestions'),
          value: safeMockResults.totalQuestions || 0,
          max: 1000,
          trend: 'steady'
        }
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
        history: getMockHistory ? getMockHistory() : [], // Dynamic history from context
        chartData: {
          labels: [t('mock.chart.label')],
          datasets: [
            {
              label: t('performance.title'),
              data: [parseFloat(mockAverage) || 0],
              backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }
          ]
        }
      }
    }
  ];

  // ✅ Safe computation of translations
  const interestsList = t('profile.interestsList', { returnObjects: true });
  const hobbiesList = t('profile.hobbies', { returnObjects: true });
  const recentAchievementsList = t('profile.recentAchievements', { returnObjects: true });

  const studentDetails = {
    name: "Alex Johnson",
    grade: t('profile.grade'),
    school: "Maplewood Middle School",
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
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

  // ✅ Safe history retrieval
  const getHistory = () => {
    if (!showDetails) return [];
    try {
      if (showDetails.id === 'quiz') return getQuizHistory ? getQuizHistory() : [];
      if (showDetails.id === 'mock') return getMockHistory ? getMockHistory() : [];
      return [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  };

  // ✅ Render fallback if no data is available
  if (!performanceMetrics) {
    return (
      <div className="career-container">
        <Navbar isFullScreen={false} />
        <div className="error-state">
          <h2>Unable to Load Career Data</h2>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            <div className="stat-label">{t('studentsTracked')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <Star size={32} />
            </div>
            <div className="stat-number">{animatedStats.successRate}%</div>
            <div className="stat-label">{t('improvementRate')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <Target size={32} />
            </div>
            <div className="stat-number">{animatedStats.careers}+</div>
            <div className="stat-label">{t('metricsTracked')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <Clock size={32} />
            </div>
            <div className="stat-number">{animatedStats.universities.toLocaleString()}+</div>
            <div className="stat-label">{t('hoursAnalyzed')}</div>
          </div>
        </div>
      </section>

      <section className="performance-section" ref={metricsRef}>
        <h2 className="section-title">{t('ti_tle')}</h2>
        <p className="section-subtitle">
          {t('sub_title')}
        </p>

        <div className="metrics-grid">
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
                    <h3>
                      {showDetails.id === 'quiz' 
                        ? t('quizHistory.title') 
                        : t('mockHistory.title')
                      }
                    </h3>
                    {getHistory().length > 0 ? (
                      <div className="history-list">
                        {getHistory().slice(-5).reverse().map((item, index) => ( // Show last 5, newest first
                          <div key={item.id || index} className="history-item">
                            <div className="history-info">
                              <span className="history-title">
                                {item.class} - {item.subject} - {item.topic}
                              </span>
                              <span className="history-score">{item.score}% ({item.questions} questions)</span>
                              <span className="history-date">{item.date}</span>
                            </div>
                            <div className="history-bar">
                              <div
                                className="bar-fill"
                                style={{
                                  width: `${item.score}%`,
                                  backgroundColor: getMetricColor(item.score, 100)
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>
                        {showDetails.id === 'quiz' 
                          ? t('quizHistory.empty') 
                          : t('mockHistory.empty')
                        }
                      </p>
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



