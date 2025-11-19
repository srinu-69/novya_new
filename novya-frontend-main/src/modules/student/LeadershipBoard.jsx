
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaCrown, FaMedal, FaUser, FaSearch, FaAward, FaChevronDown } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './Leaderboard.css';
import { API_CONFIG, djangoAPI } from '../../config/api';

const LeadershipBoard = () => {
  const { t } = useTranslation();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Color scheme
  const colors = {
    background: '#F4F8FB',
    accent: '#2D5D7B',
    accentHover: '#7983D7',
    text: '#222831',
    border: '#E5E7EB'
  };

  // Subjects - using translation keys
  const subjects = ['english', 'maths', 'science', 'social', 'computer'];

  // Mock data with subjects
  const mockUsers = [
    {
      id: 1,
      name: t('leaderboard.studentNames.pavan', 'Pavan'),
      avatar: "P",
      subjects: { english: 100, maths: 80, science: 90, social: 70, computer: 50 },
      total: 500, rank: 1, isCurrentUser: false
    },
    {
      id: 2,
      name: t('leaderboard.studentNames.naga', 'Naga'),
      avatar: "N",
      subjects: { english: 100, maths: 70, science: 95, social: 95, computer: 95 },
      total: 480, rank: 2, isCurrentUser: false
    },
    {
      id: 3,
      name: t('leaderboard.studentNames.anand', 'Anand'),
      avatar: "A",
      subjects: { english: 90, maths: 70, science: 100, social: 85, computer: 90 },
      total: 435, rank: 3, isCurrentUser: false
    },
    {
      id: 4,
      name: t('leaderboard.you', 'You'),
      avatar: "Y",
      subjects: { english: 90, maths: 90, science: 50, social: 80, computer: 85 },
      total: 395, rank: 4, isCurrentUser: true
    },
    {
      id: 5,
      name: t('leaderboard.studentNames.sai', 'Sai'),
      avatar: "S",
      subjects: { english: 90, maths: 30, science: 50, social: 75, computer: 100 },
      total: 325, rank: 5, isCurrentUser: false
    }
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await djangoAPI.get(API_CONFIG.DJANGO.LEADERBOARD.GET_LEADERBOARD);
        
        if (response && response.leaderboard) {
          // Get current user info from localStorage
          const userData = JSON.parse(localStorage.getItem('studentData') || '{}');
          const currentUsername = userData.userName || localStorage.getItem('username') || '';
          
          // Transform API data to match component format with real subject scores
          const transformedData = response.leaderboard.map((entry, index) => {
            const isCurrentUser = entry.student_username === currentUsername;
            
            // Use real subject scores from API if available, otherwise 0
            const subjectScores = entry.subject_scores || {};
            
            return {
              id: entry.entry_id,
              name: entry.student_name || entry.student_username,
              avatar: (entry.student_name || entry.student_username).charAt(0).toUpperCase(),
              subjects: {
                english: subjectScores.english || 0,
                maths: subjectScores.maths || 0,
                science: subjectScores.science || 0,
                social: subjectScores.social || 0,
                computer: subjectScores.computer || 0
              },
              total: entry.total_score || entry.score || 0,  // Use total_score (sum of subjects) if available
              rank: entry.rank || index + 1,
              isCurrentUser: isCurrentUser,
              total_quizzes: entry.total_quizzes || 0,
              total_mock_tests: entry.total_mock_tests || 0,
              average_score: entry.average_score || 0,
              total_coins: entry.total_coins || 0,
              current_streak: entry.current_streak || 0
            };
          });
          
          setLeaderboardData(transformedData);
          setFilteredData(transformedData);
          
          // Set current user with real subject scores
          const currentUserEntry = transformedData.find(user => user.isCurrentUser);
          if (currentUserEntry) {
            setCurrentUser(currentUserEntry);
          } else if (response.current_user_rank) {
            // If current user is not in top 100, show their rank with subject scores
            const userRank = response.current_user_rank;
            const userSubjectScores = userRank.subject_scores || {};
            
            setCurrentUser({
              rank: userRank.rank,
              score: userRank.total_score || userRank.score || 0,
              name: userData.firstName + ' ' + userData.lastName || 'You',
              avatar: (userData.firstName || 'Y').charAt(0).toUpperCase(),
              isCurrentUser: true,
              subjects: {
                english: userSubjectScores.english || 0,
                maths: userSubjectScores.maths || 0,
                science: userSubjectScores.science || 0,
                social: userSubjectScores.social || 0,
                computer: userSubjectScores.computer || 0
              },
              total: userRank.total_score || userRank.score || 0
            });
          }
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Fallback to mock data if API fails
        const updatedMockUsers = [
          {
            id: 1,
            name: t('leaderboard.studentNames.pavan', 'Pavan'),
            avatar: "P",
            subjects: { english: 100, maths: 80, science: 90, social: 70, computer: 50 },
            total: 500, rank: 1, isCurrentUser: false
          },
          {
            id: 2,
            name: t('leaderboard.studentNames.naga', 'Naga'),
            avatar: "N",
            subjects: { english: 100, maths: 70, science: 95, social: 95, computer: 95 },
            total: 480, rank: 2, isCurrentUser: false
          },
          {
            id: 3,
            name: t('leaderboard.studentNames.anand', 'Anand'),
            avatar: "A",
            subjects: { english: 90, maths: 70, science: 100, social: 85, computer: 90 },
            total: 435, rank: 3, isCurrentUser: false
          },
          {
            id: 4,
            name: t('leaderboard.you', 'You'),
            avatar: "Y",
            subjects: { english: 90, maths: 90, science: 50, social: 80, computer: 85 },
            total: 395, rank: 4, isCurrentUser: true
          },
          {
            id: 5,
            name: t('leaderboard.studentNames.sai', 'Sai'),
            avatar: "S",
            subjects: { english: 90, maths: 30, science: 50, social: 75, computer: 100 },
            total: 325, rank: 5, isCurrentUser: false
          }
        ];
        setLeaderboardData(updatedMockUsers);
        setFilteredData(updatedMockUsers);
        setCurrentUser(updatedMockUsers.find(user => user.isCurrentUser));
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [t]);

  useEffect(() => {
    let filtered = leaderboardData;
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort based on selectedSubject
    let sorted;
    if (selectedSubject !== 'all') {
      sorted = [...filtered].sort((a, b) => b.subjects[selectedSubject] - a.subjects[selectedSubject]);
    } else {
      sorted = [...filtered].sort((a, b) => b.total - a.total);
    }

    // Assign ranks
    const withRanks = sorted.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    // Apply top filter
    let finalFiltered;
    if (activeFilter === 'top') {
      finalFiltered = withRanks.slice(0, 3);
    } else {
      finalFiltered = withRanks;
    }

    setFilteredData(finalFiltered);
  }, [searchTerm, activeFilter, selectedSubject, leaderboardData]);

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return { background: '#FFD700', color: '#222831', icon: <FaCrown /> };
      case 2:
        return { background: '#C0C0C0', color: '#222831', icon: <FaTrophy /> };
      case 3:
        return { background: '#CD7F32', color: '#FFFFFF', icon: <FaMedal /> };
      default:
        return { background: colors.background, color: colors.text, icon: <FaAward /> };
    }
  };

  const getSubjectColor = (score) => {
    if (score >= 90) return colors.accent;
    if (score >= 80) return colors.accentHover;
    return colors.text;
  };

  const getSubjectDisplayName = (subject) => {
    return t(`leaderboard.subjects.${subject}`, subject.toUpperCase());
  };

  const filters = [
    { key: 'all', label: t('leaderboard.filters.all', 'All Students') },
    { key: 'top', label: t('leaderboard.filters.top', 'Top 3') }
  ];

  return (
    <div className="leadership-board"><br></br><br></br><br></br>
      {/* Header */}
      <div className="header">
        <h1>{t('leaderboard.title', 'LEADERBOARD WITH SCORE')}</h1>
        {/* <p>{t('leaderboard.subtitle', 'This is a sample text. Insert your desired text here.')}</p> */}
      </div>

      {/* Current User Highlight */}
      {currentUser && (
        <div className="current-user-card">
          <div className="user-info">
            <div className="avatar">{currentUser.avatar}</div>
            <div>
              <div className="user-rank">#{currentUser.rank} - {currentUser.name}</div>
              <div className="user-position">{t('leaderboard.yourPosition', 'Your current position')}</div>
            </div>
          </div>

          <div className="subject-scores">
            {subjects.map(subject => {
              const score = currentUser.subjects && currentUser.subjects[subject] !== undefined 
                ? currentUser.subjects[subject] 
                : 0;
              const formattedScore = typeof score === 'number' 
                ? (score % 1 === 0 ? score.toFixed(0) : score.toFixed(2))
                : parseFloat(score || 0).toFixed(2);
              
              return (
                <div key={subject} className="score-item">
                  <div className="subject-label">{getSubjectDisplayName(subject)}</div>
                  <div className="score-value">{formattedScore}</div>
                </div>
              );
            })}
            <div className="score-item">
              <div className="subject-label">{t('leaderboard.total', 'TOTAL')}</div>
              <div className="total-value">
                {typeof currentUser.total === 'number' 
                  ? (currentUser.total % 1 === 0 
                      ? currentUser.total.toFixed(0)
                      : currentUser.total.toFixed(2))
                  : parseFloat(currentUser.total || 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        {/* Filters */}
        <div className="filter-buttons">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Subject Dropdown */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              backgroundColor: '#2D5D7B',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: '130px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          >
            {selectedSubject === 'all' 
              ? t('leaderboard.allSubjects', 'All Subjects') 
              : getSubjectDisplayName(selectedSubject)}
            <FaChevronDown style={{ marginLeft: '8px', fontSize: '13px' }} />
          </button>

          {isOpen && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                zIndex: 10,
                minWidth: '180px',
                overflow: 'hidden',
              }}
            >
              <div
                onClick={() => {
                  setSelectedSubject('all');
                  setIsOpen(false);
                }}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  backgroundColor: selectedSubject === 'all' ? '#eef2ff' : 'white',
                  color: selectedSubject === 'all' ? '#4f46e5' : '#333',
                }}
              >
                {t('leaderboard.allSubjects', 'All Subjects')}
              </div>

              {subjects.map(subject => (
                <div
                  key={subject}
                  onClick={() => {
                    setSelectedSubject(subject);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    backgroundColor: selectedSubject === subject ? '#eef2ff' : 'white',
                    color: selectedSubject === subject ? '#4f46e5' : '#333',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor =
                      selectedSubject === subject ? '#eef2ff' : 'white')
                  }
                >
                  {getSubjectDisplayName(subject)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={t('leaderboard.searchPlaceholder', 'Search classmates...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <div>{t('leaderboard.place', 'PLACE')}</div>
          <div>{t('leaderboard.name', 'NAME')}</div>
          {selectedSubject === 'all'
            ? subjects.map(subject => (
                <div key={subject} className="subject-header">{getSubjectDisplayName(subject)}</div>
              ))
            : <div className="subject-header">{getSubjectDisplayName(selectedSubject)}</div>}
          <div className="total-header">{t('leaderboard.total', 'TOTAL')}</div>
        </div>

        <div className="table-body">
          <AnimatePresence>
            {filteredData.map((student, index) => {
              const rankStyle = getRankStyle(student.rank);
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`table-row ${student.isCurrentUser ? 'current-user' : ''} ${index % 2 === 0 ? 'even' : 'odd'}`}
                >
                  <div className="rank-cell">
                    <div className="rank-badge" style={{ background: rankStyle.background, color: rankStyle.color }}>
                      {student.rank <= 3 ? rankStyle.icon : student.rank}
                    </div>
                  </div>

                  <div className="name-cell">
                    <div className="avatar" style={{ background: student.isCurrentUser ? colors.accent : colors.accentHover }}>
                      {student.avatar}
                    </div>
                    <div className="student-name">{student.name}</div>
                  </div>

                  {selectedSubject === 'all'
                    ? subjects.map(subject => (
                        <div key={subject} className="score-cell" style={{ color: getSubjectColor(student.subjects[subject]) }}>
                          {typeof student.subjects[subject] === 'number' 
                            ? (student.subjects[subject] % 1 === 0 
                                ? student.subjects[subject].toFixed(0)
                                : student.subjects[subject].toFixed(2))
                            : parseFloat(student.subjects[subject] || 0).toFixed(2)}
                        </div>
                      ))
                    : <div className="score-cell" style={{ color: getSubjectColor(student.subjects[selectedSubject]) }}>
                        {typeof student.subjects[selectedSubject] === 'number' 
                          ? (student.subjects[selectedSubject] % 1 === 0 
                              ? student.subjects[selectedSubject].toFixed(0)
                              : student.subjects[selectedSubject].toFixed(2))
                          : parseFloat(student.subjects[selectedSubject] || 0).toFixed(2)}
                      </div>}

                  <div className="total-cell">
                    {typeof student.total === 'number' 
                      ? (student.total % 1 === 0 
                          ? student.total.toFixed(0)
                          : student.total.toFixed(2))
                      : parseFloat(student.total || 0).toFixed(2)}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredData.length === 0 && (
            <div className="empty-state">
              <FaUser className="empty-icon" />
              <div className="empty-title">{t('leaderboard.noStudents', 'No students found')}</div>
              <div className="empty-subtitle">{t('leaderboard.adjustSearch', 'Try adjusting your search or filter')}</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="footer-stats">
        <div className="stat-item">
          <div className="stat-value">{leaderboardData.length}</div>
          <div className="stat-label">{t('leaderboard.totalStudents', 'Total Students')}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{Math.max(...leaderboardData.map(user => user.total))}</div>
          <div className="stat-label">{t('leaderboard.highestScore', 'Highest Score')}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {Math.round(leaderboardData.reduce((acc, user) => acc + user.total, 0) / leaderboardData.length)}
          </div>
          <div className="stat-label">{t('leaderboard.averageScore', 'Average Score')}</div>
        </div>
      </div>
    </div>
  );
};

export default LeadershipBoard;