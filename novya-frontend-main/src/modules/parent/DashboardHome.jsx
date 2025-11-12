import { Typewriter } from 'react-simple-typewriter';
import { FiTrendingUp } from 'react-icons/fi';
import {
  HiOutlineCalendarDays,
   HiOutlineClipboardDocumentList,
  HiOutlineAcademicCap
} from 'react-icons/hi2';
import { useState, useEffect } from 'react';
import { API_CONFIG, djangoAPI } from '../../config/api';
 
const DashboardHome = ({ parentName }) => {
  const [progressData, setProgressData] = useState({
    overallScore: 0,
    totalTests: 0,
    loading: true
  });

  // Fetch progress data
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        console.log('🔍 Debug - Fetching progress data for dashboard...');
        
        // Check if we have cached data
        const cachedData = localStorage.getItem('progressData');
        const lastFetch = localStorage.getItem('progressDataLastFetch');
        const now = Date.now();
        
        if (cachedData && lastFetch && (now - parseInt(lastFetch)) < 300000) {
          console.log('🔍 Debug - Using cached progress data for dashboard');
          const parsedData = JSON.parse(cachedData);
          const allAttempts = [...(parsedData.quizData || []), ...(parsedData.mockTestData || [])];
          const totalTests = allAttempts.length;
          const totalScore = allAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
          const overallScore = totalTests > 0 ? Math.round(totalScore / totalTests) : 0;
          
          setProgressData({
            overallScore,
            totalTests,
            loading: false
          });
          return;
        }
        
        const response = await djangoAPI.get(API_CONFIG.DJANGO.QUIZZES.CHILD_ATTEMPTS);
        console.log('🔍 Debug - Dashboard progress response:', response);
        
        if (response && response.attempts) {
          const allAttempts = response.attempts;
          const totalTests = allAttempts.length;
          const totalScore = allAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
          const overallScore = totalTests > 0 ? Math.round(totalScore / totalTests) : 0;
          
          setProgressData({
            overallScore,
            totalTests,
            loading: false
          });
        } else {
          setProgressData({
            overallScore: 0,
            totalTests: 0,
            loading: false
          });
        }
      } catch (error) {
        console.error('❌ Error fetching progress data for dashboard:', error);
        setProgressData({
          overallScore: 0,
          totalTests: 0,
          loading: false
        });
      }
    };

    fetchProgressData();
  }, []);

  return (
    <div className="dashboard-home">
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1>Welcome back, {parentName}!</h1>
            <div className="typewriter-container">
              <Typewriter
                words={[
                  "Monitor academic progress in real-time",
                  "Stay connected with teachers and assignments",
                  "Celebrate every milestone and achievement",
                  "Support your child's educational journey"
                ]}
                loop
                typeSpeed={50}
                deleteSpeed={30}
                delaySpeed={2500}
              />
            </div>
          </div>
          <div className="welcome-image">
            <img
              src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/d92aaad8-daf4-48e8-9313-bc4d45f82b91.png"
              alt="Parent and child learning together"
              className="parent-child-image"
            />
            <div className="image-overlay"></div>
          </div>
        </div>
      </div>
 
      <div className="stats-section">
        <h2>Quick Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {progressData.loading ? '...' : `${progressData.overallScore}%`}
              </div>
              <div className="stat-label">Overall Progress</div>
              <div className="stat-change positive">From Progress data</div>
            </div>
          </div>
 
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
              <HiOutlineCalendarDays />
            </div>
            <div className="stat-content">
              <div className="stat-value">92%</div>
              <div className="stat-label">Attendance Rate</div>
              <div className="stat-change positive">+2% this month</div>
            </div>
          </div>
 
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              <HiOutlineClipboardDocumentList />
            </div>
            <div className="stat-content">
              <div className="stat-value">15</div>
              <div className="stat-label">Achievements</div>
              <div className="stat-change positive">+3 this week</div>
            </div>
          </div>
 
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <HiOutlineAcademicCap />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {progressData.loading ? '...' : progressData.totalTests}
              </div>
              <div className="stat-label">Quizzes</div>
              <div className="stat-change neutral">From Progress data</div>
            </div>
          </div>
        </div>
      </div>
 
      <div className="features-section">
        <h2>What Makes NOVYA Special</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>AI-Powered Learning</h3>
            <p>Personalized learning paths adapted to your child's unique learning style and pace.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-time Analytics</h3>
            <p>Track progress with detailed insights and performance metrics updated in real-time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Goal-based Learning</h3>
            <p>Set and achieve learning goals with milestone tracking and celebration of achievements.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default DashboardHome;
 