
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, FileText } from 'lucide-react';
import { Wheel } from 'react-custom-roulette';
import { addCoinsForSpinWheel } from '../../utils/coinTracking';
import './practice.css';

// Flying Reward Component
const FlyingReward = ({ reward, onComplete }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const rewardRef = useRef(null);

  useEffect(() => {
    if (rewardRef.current) {
      const wheelRect = document.querySelector('.wheel-wrapper')?.getBoundingClientRect();
      const navbarReward = document.querySelector('.reward-points-display')?.getBoundingClientRect();
     
      if (wheelRect && navbarReward) {
        const startX = wheelRect.left + wheelRect.width / 2;
        const startY = wheelRect.top + wheelRect.height / 2;
        const endX = navbarReward.left + navbarReward.width / 2;
        const endY = navbarReward.top + navbarReward.height / 2;
        setPosition({ x: startX, y: startY });
       
        setTimeout(() => {
          setPosition({ x: endX, y: endY });
          setScale(0.3);
        }, 100);

        setTimeout(() => {
          setOpacity(0);
        }, 800);

        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1000);
      }
    }
  }, [onComplete]);

  return (
    <div
      ref={rewardRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        background: reward.color,
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 10000,
        pointerEvents: 'none',
        transition: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        opacity: opacity
      }}
    >
      {reward.name}
    </div>
  );
};

// MARK: UPDATED - Add reward points with history tracking function
const addRewardPointsWithHistory = (points, reason, source = 'spin_wheel') => {
  const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
  const newPoints = currentPoints + points;
  
  // Update points in localStorage
  localStorage.setItem('rewardPoints', newPoints.toString());
  
  // Add to rewards history
  const historyEntry = {
    id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    points: points,
    totalPoints: newPoints,
    reason: reason,
    source: source,
    timestamp: new Date().toISOString()
  };
  
  const existingHistory = JSON.parse(localStorage.getItem('rewardsHistory') || '[]');
  const updatedHistory = [historyEntry, ...existingHistory];
  localStorage.setItem('rewardsHistory', JSON.stringify(updatedHistory));
  
  // Dispatch event to update navbar and other components
  window.dispatchEvent(new CustomEvent('rewardPointsUpdated', { 
    detail: { 
      rewardPoints: newPoints,
      addedPoints: points,
      source: source
    } 
  }));
  
  return historyEntry;
};

// Spin Wheel Component with full internationalization
const SpinWheel = ({ onRewardWon }) => {
  const { t, i18n } = useTranslation();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [reward, setReward] = useState(null);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [wheelRadius, setWheelRadius] = useState(100);

  // Internationalized wheel data - CORRECT ORDER FOR WHEEL DISPLAY
  const getWheelData = () => [
    { option: t('spinWheel.rewards.10Points'), style: { backgroundColor: '#FF6B6B', textColor: 'white' } },
    { option: t('spinWheel.rewards.20Points'), style: { backgroundColor: '#4ECDC4', textColor: 'white' } },
    { option: t('spinWheel.rewards.05Points'), style: { backgroundColor: '#45B7D1', textColor: 'white' } },
    { option: t('spinWheel.rewards.bonusSpin'), style: { backgroundColor: '#96CEB4', textColor: 'white' } },
    { option: t('spinWheel.rewards.15Points'), style: { backgroundColor: '#FFEAA7', textColor: 'black' } },
    { option: t('spinWheel.rewards.betterLuck'), style: { backgroundColor: '#DDA0DD', textColor: 'white' } },
  ];

  // Internationalized rewards mapping - CORRECTED FOR PROPER ALIGNMENT
  const getRewardForSegment = (segmentIndex) => {
    const rewards = [
      { id: 1, name: t('spinWheel.rewards.10Points'), color: '#FF6B6B', value: 10 },      // Index 0 - 10 Points
      { id: 2, name: t('spinWheel.rewards.20Points'), color: '#4ECDC4', value: 20 },      // Index 1 - 20 Points  
      { id: 3, name: t('spinWheel.rewards.05Points'), color: '#45B7D1', value: 5 },       // Index 2 - 05 Points
      { id: 4, name: t('spinWheel.rewards.bonusSpin'), color: '#96CEB4', value: 1 },      // Index 3 - Bonus Spin
      { id: 5, name: t('spinWheel.rewards.15Points'), color: '#FFEAA7', value: 15 },      // Index 4 - 15 Points
      { id: 6, name: t('spinWheel.rewards.betterLuck'), color: '#DDA0DD', value: 0 },     // Index 5 - Better Luck
    ];
    
    // The key fix: react-custom-roulette has an offset issue
    // We need to adjust the index to match the visual position
    const adjustedIndex = (segmentIndex - 1 + rewards.length) % rewards.length;
    console.log('Wheel stopped at segment:', segmentIndex, 'Adjusted to:', adjustedIndex, 'Reward:', rewards[adjustedIndex]);
    return rewards[adjustedIndex];
  };

  useEffect(() => {
    initializeSpins();
    
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      let newRadius;
      
      if (screenWidth < 480) {
        newRadius = Math.min(70, screenWidth * 0.25);
      } else if (screenWidth < 768) {
        newRadius = Math.min(80, screenWidth * 0.22);
      } else if (screenWidth < 1024) {
        newRadius = Math.min(100, screenWidth * 0.15);
      } else {
        newRadius = 100;
      }
      
      setWheelRadius(newRadius);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initializeSpins = () => {
    const today = new Date().toDateString();
    const spinData = JSON.parse(localStorage.getItem('spinData') || '{}');
   
    if (spinData.date !== today) {
      const newSpinData = {
        date: today,
        spinsUsed: 0,
        totalSpins: 3
      };
      localStorage.setItem('spinData', JSON.stringify(newSpinData));
      setSpinsLeft(3);
    } else {
      const remainingSpins = 3 - (spinData.spinsUsed || 0);
      setSpinsLeft(Math.max(0, remainingSpins));
    }
  };

  const updateSpins = () => {
    const today = new Date().toDateString();
    const spinData = JSON.parse(localStorage.getItem('spinData') || '{}');
   
    if (spinData.date !== today) {
      const newSpinData = {
        date: today,
        spinsUsed: 1,
        totalSpins: 3
      };
      localStorage.setItem('spinData', JSON.stringify(newSpinData));
      setSpinsLeft(2);
    } else {
      const updatedSpinsUsed = (spinData.spinsUsed || 0) + 1;
      const newSpinData = {
        ...spinData,
        spinsUsed: updatedSpinsUsed
      };
      localStorage.setItem('spinData', JSON.stringify(newSpinData));
      setSpinsLeft(3 - updatedSpinsUsed);
    }
  };

  // MARK: UPDATED - Reward points update function to save to DATABASE
  const updateUserPoints = async (rewardValue, rewardName) => {
    if (rewardValue > 0) {
      try {
        // Save coins to database (USER-SPECIFIC)
        console.log(`💰 Saving ${rewardValue} coins from spin wheel to database...`);
        const coinResult = await addCoinsForSpinWheel(rewardValue, {
          rewardName,
          source: 'spin_wheel',
          date: new Date().toISOString()
        });
        
        if (coinResult && coinResult.balance) {
          // Update localStorage with database balance (source of truth)
          const newBalance = coinResult.balance.total_coins || 0;
          localStorage.setItem('rewardPoints', newBalance.toString());
          
          // Dispatch event to update navbar and other components
          window.dispatchEvent(new CustomEvent('rewardPointsUpdated', { 
            detail: { 
              rewardPoints: newBalance,
              addedPoints: rewardValue,
              source: 'spin_wheel'
            } 
          }));
          
          console.log(`✅ Spin wheel coins saved to database. New balance: ${newBalance}`);
        } else {
          // Fallback to localStorage if database save fails
          console.warn('⚠️ Database save failed, using localStorage fallback');
          addRewardPointsWithHistory(rewardValue, `Spin Wheel: ${rewardName}`, 'spin_wheel');
        }
      } catch (error) {
        console.error('❌ Error saving spin wheel coins to database:', error);
        // Fallback to localStorage if database save fails
        addRewardPointsWithHistory(rewardValue, `Spin Wheel: ${rewardName}`, 'spin_wheel');
      }
      return true;
    }
    return false;
  };

  const handleSpinClick = () => {
    if (mustSpin || spinsLeft <= 0) return;
    
    // Generate random prize number (0-5 for 6 segments)
    const newPrizeNumber = Math.floor(Math.random() * 6);
    console.log('Spinning to prize number:', newPrizeNumber);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    updateSpins();
  };

  const handleStopSpinning = async () => {
    setMustSpin(false);
   
    // Get the CORRECT reward for the segment where wheel stopped
    const wonReward = getRewardForSegment(prizeNumber);
    console.log('Wheel stopped. Prize Number:', prizeNumber, 'Won Reward:', wonReward);
    setReward(wonReward);
   
    // Save reward to localStorage
    const userRewards = JSON.parse(localStorage.getItem('userRewards') || '[]');
    const rewardWithId = {
      ...wonReward,
      id: Date.now() + Math.random(),
      date: new Date().toISOString()
    };
    userRewards.push(rewardWithId);
    localStorage.setItem('userRewards', JSON.stringify(userRewards));
    
    // MARK: UPDATED - Update points if reward has value using the new function (SAVE TO DATABASE)
    if (wonReward.value > 0) {
      await updateUserPoints(wonReward.value, wonReward.name);
    }
    
    // Handle bonus spin (refund one spin)
    if (wonReward.id === 4) { // Bonus spin has id 4
      const spinData = JSON.parse(localStorage.getItem('spinData') || '{}');
      const today = new Date().toDateString();
     
      if (spinData.date === today) {
        const updatedSpinsUsed = Math.max(0, (spinData.spinsUsed || 0) - 1);
        const newSpinData = {
          ...spinData,
          spinsUsed: updatedSpinsUsed
        };
        localStorage.setItem('spinData', JSON.stringify(newSpinData));
        setSpinsLeft(3 - updatedSpinsUsed);
        
        // MARK: Note - Bonus spin doesn't give coins, so no database update needed
      }
    } else if (wonReward.id === 6) {
      // MARK: Note - Better luck doesn't give coins, so no database update needed
    }
    
    // Call the callback function
    if (onRewardWon) {
      onRewardWon(rewardWithId);
    }
  };

  return (
    <div style={{
      background: 'transparent',
      textAlign: 'center',
      maxWidth: '340px',
      width: '100%',
      margin: '0 auto',
      padding: '0 15px'
    }}>
      {/* Spin Wheel Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px 20px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 'clamp(1rem, 4vw, 1.3rem)',
          fontWeight: '700',
          color: '#1F2937'
        }}>
          🎯 {t('spinWheel.dailyRewards')}
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(249, 250, 251, 0.9)',
          padding: '8px 12px',
          borderRadius: '10px',
          border: '1px solid rgba(229, 231, 235, 0.6)'
        }}>
          <span style={{
            fontSize: '0.8rem',
            color: '#6B7280',
            fontWeight: '500'
          }}>
            {t('spinWheel.spins')}:
          </span>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: '700',
            color: spinsLeft > 0 ? '#10B981' : '#EF4444'
          }}>
            {spinsLeft}/3
          </span>
        </div>
      </div>

      {/* Wheel Container */}
      <div className="wheel-wrapper" style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
        padding: '15px'
      }}>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={getWheelData()}
          onStopSpinning={handleStopSpinning}
          backgroundColors={['#3e3e3e', '#df3428']}
          textColors={['#ffffff']}
          fontSize={i18n.language === 'hi' ? 8 : 10}
          outerBorderColor="#333"
          outerBorderWidth={3}
          innerBorderColor="#333"
          innerRadius={0.4}
          innerBorderWidth={2}
          radiusLineColor="#333"
          radiusLineWidth={2}
          spinDuration={0.6}
          pointerProps={{
            src: '',
            style: {
              display: 'none'
            }
          }}
          perpendicularText={false}
          radius={wheelRadius}
        />
        
        {/* Custom Pointer */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '24px',
          height: '30px',
          backgroundColor: '#333',
          clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
          zIndex: 10,
          filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))'
        }} />
       
        {/* Center Circle */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          backgroundColor: 'white',
          border: '3px solid #333',
          borderRadius: '50%',
          zIndex: 5,
          boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
        }} />
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpinClick}
        disabled={mustSpin || spinsLeft <= 0}
        style={{
          width: '100%',
          padding: '14px 20px',
          fontSize: 'clamp(0.9rem, 4vw, 1.1rem)',
          fontWeight: '700',
          color: 'white',
          background: mustSpin
            ? '#9CA3AF'
            : spinsLeft <= 0
            ? '#EF4444'
            : 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
          border: 'none',
          borderRadius: '12px',
          cursor: mustSpin || spinsLeft <= 0 ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: mustSpin || spinsLeft <= 0 ? 0.7 : 1,
          boxShadow: mustSpin || spinsLeft <= 0
            ? 'none'
            : '0 6px 20px rgba(102, 126, 234, 0.4)',
          marginTop: '15px',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          if (!mustSpin && spinsLeft > 0) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
          }
        }}
        onMouseLeave={(e) => {
          if (!mustSpin && spinsLeft > 0) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }
        }}
      >
        {mustSpin ? t('spinWheel.spinning') : spinsLeft <= 0 ? t('spinWheel.comeBackTomorrow') : t('spinWheel.spinButton')}
      </button>

      {/* Reward Popup */}
      {reward && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '25px',
            maxWidth: '320px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            animation: 'scaleIn 0.3s ease-out'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '15px',
              animation: 'bounce 0.6s ease-in-out'
            }}>
              🎉
            </div>
            <h3 style={{
              fontSize: 'clamp(1.1rem, 5vw, 1.3rem)',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '12px'
            }}>
              {t('spinWheel.congratulations')}
            </h3>
            <p style={{
              fontSize: 'clamp(0.9rem, 4vw, 1rem)',
              color: '#6B7280',
              marginBottom: '15px',
              lineHeight: '1.6'
            }}>
              {t('spinWheel.youWon')} <strong style={{ color: reward.color }}>{reward.name}</strong>
            </p>
            {reward.value > 0 && (
              <p style={{
                fontSize: '0.8rem',
                color: '#10B981',
                fontWeight: '600',
                marginBottom: '15px',
                padding: '8px 15px',
                background: '#ECFDF5',
                borderRadius: '10px',
                display: 'inline-block'
              }}>
                +{reward.value} {t('spinWheel.pointsAdded')}
              </p>
            )}
            {reward.id === 4 && (
              <p style={{
                fontSize: '0.8rem',
                color: '#F59E0B',
                fontWeight: '600',
                marginBottom: '15px',
                padding: '8px 15px',
                background: '#FFFBEB',
                borderRadius: '10px',
                display: 'inline-block'
              }}>
                {t('spinWheel.bonusSpin')}
              </p>
            )}
            <button
              onClick={() => setReward(null)}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white',
                background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '12px',
                width: '100%'
              }}
            >
              {t('spinWheel.awesome')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Practice Component with Enhanced Mobile Responsiveness
const Practice = () => {
  const { t } = useTranslation();
  const [animatedStats, setAnimatedStats] = useState({
    totalTests: 0,
    studentsEnrolled: 0
  });
  const [flyingRewards, setFlyingRewards] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    document.title = "Practice | NOVYA - Your Smart Learning Platform";
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    const handlePointsUpdate = () => {
      // This is handled by navbar component
    };

    window.addEventListener('rewardPointsUpdated', handlePointsUpdate);

    const animateValue = (start, end, duration, callback) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        callback(current);
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };

    animateValue(0, 2500, 2000, (val) => setAnimatedStats(prev => ({ ...prev, totalTests: val })));
    animateValue(0, 850, 2500, (val) => setAnimatedStats(prev => ({ ...prev, studentsEnrolled: val })));

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('rewardPointsUpdated', handlePointsUpdate);
    };
  }, []);

  const handleRewardWon = (reward) => {
    const flyingReward = {
      id: Date.now() + Math.random(),
      reward: reward
    };
   
    setFlyingRewards(prev => [...prev, flyingReward]);
  };

  const handleFlyingComplete = (rewardId) => {
    setFlyingRewards(prev => prev.filter(r => r.id !== rewardId));
  };

  const isMobile = windowWidth <= 768;

  return (
    <div className="practice-full-container" style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflowX: 'hidden'
    }}>
      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        /* Mobile First Responsive Design */
        @media (max-width: 768px) {
          .mobile-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          .mobile-feature-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          .mobile-subject-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          .mobile-step-item {
            flex-direction: column !important;
            text-align: center !important;
            gap: 20px !important;
          }
          
          .mobile-hero-content {
            flex-direction: column !important;
            gap: 30px !important;
            text-align: center !important;
          }
          
          .mobile-hero-text {
            order: 2 !important;
            padding: 0 !important;
          }
          
          .mobile-wheel-section {
            order: 1 !important;
            margin: 0 auto !important;
            max-width: 280px !important;
          }
        }

        /* Tablet Styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .mobile-hero-content {
            flex-direction: row !important;
            gap: 40px !important;
            text-align: left !important;
          }
          
          .mobile-hero-text {
            order: 1 !important;
            flex: 1 !important;
          }
          
          .mobile-wheel-section {
            order: 2 !important;
            flex: 0 0 320px !important;
          }
          
          .mobile-feature-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
          
          .mobile-subject-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 18px !important;
          }
        }

        /* Desktop Styles */
        @media (min-width: 1025px) {
          .mobile-hero-content {
            flex-direction: row !important;
            gap: 60px !important;
            text-align: left !important;
          }
          
          .mobile-feature-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 25px !important;
          }
          
          .mobile-subject-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
          }
        }

        /* Small Phones (below 480px) */
        @media (max-width: 480px) {
          .mobile-hero {
            padding: 40px 15px !important;
          }
          
          .mobile-section {
            padding: 50px 15px !important;
          }
          
          .mobile-stat-card {
            padding: 15px !important;
            flex-direction: column !important;
            gap: 10px !important;
            text-align: center !important;
          }
          
          .mobile-feature-card {
            padding: 20px !important;
          }
          
          .mobile-subject-card {
            padding: 25px 15px !important;
          }
        }

        /* Landscape Mode */
        @media (max-height: 500px) and (orientation: landscape) {
          .mobile-hero {
            padding: 30px 20px !important;
            min-height: auto !important;
          }
        }
      `}</style>

      {/* Render flying rewards */}
      {flyingRewards.map((flyingReward) => (
        <FlyingReward
          key={flyingReward.id}
          reward={flyingReward.reward}
          onComplete={() => handleFlyingComplete(flyingReward.id)}
        />
      ))}

      {/* Hero Section */}
      <section
        className="mobile-hero"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #EEF2FF 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: isMobile ? '50px 20px' : '80px 20px',
          minHeight: 'auto'
        }}
      >
        <div
          className="hero-bg-1"
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: isMobile ? '400px' : '800px',
            height: isMobile ? '400px' : '800px',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <div
          className="hero-bg-2"
          style={{
            position: 'absolute',
            top: '20%',
            left: '-10%',
            width: isMobile ? '200px' : '400px',
            height: isMobile ? '200px' : '400px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
          }}
        />
        
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          width: '100%'
        }}>
          <div
            className="mobile-hero-content"
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
              gap: isMobile ? '30px' : '60px'
            }}
          >
            <div
              className="mobile-hero-text"
              style={{
                flex: isMobile ? 'none' : '1 1 600px',
                minWidth: isMobile ? '100%' : '400px',
                textAlign: isMobile ? 'center' : 'left'
              }}
            >
              <h1 style={{
                fontSize: isMobile ? 'clamp(1.8rem, 6vw, 2.5rem)' : 'clamp(2rem, 6vw, 3.5rem)',
                fontWeight: '800',
                color: '#1F2937',
                marginBottom: isMobile ? '16px' : '24px',
                lineHeight: '1.2'
              }}>
                {t('masterSubject')}
                <span style={{
                  background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'block',
                  marginTop: isMobile ? '8px' : '12px'
                }}>
                  {t('smartPractice')}
                </span>
              </h1>
              
              <p
                style={{
                  fontSize: isMobile ? 'clamp(0.95rem, 4vw, 1.1rem)' : 'clamp(1rem, 4vw, 1.25rem)',
                  color: '#6B7280',
                  marginBottom: isMobile ? '30px' : '40px',
                  lineHeight: '1.6'
                }}
              >
                {t('challengeDescription')}
              </p>
              
              <div className="mobile-stats-grid" style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: isMobile ? '12px' : '24px',
                marginTop: isMobile ? '25px' : '40px'
              }}>
                <div className="mobile-stat-card" style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: isMobile ? '15px' : '24px',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '12px' : '16px',
                  flexDirection: isMobile ? 'column' : 'row',
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                    borderRadius: '12px',
                    padding: isMobile ? '10px' : '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FileText size={isMobile ? 20 : 24} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: isMobile ? '1.3rem' : 'clamp(1.4rem, 4vw, 1.8rem)', 
                      fontWeight: '700', 
                      color: '#1F2937' 
                    }}>
                      {animatedStats.totalTests.toLocaleString()}+
                    </div>
                    <div style={{ 
                      fontSize: isMobile ? '0.8rem' : '0.9rem', 
                      color: '#6B7280' 
                    }}>
                      {t('practiceTests')}
                    </div>
                  </div>
                </div>
                
                <div className="mobile-stat-card" style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: isMobile ? '15px' : '24px',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '12px' : '16px',
                  flexDirection: isMobile ? 'column' : 'row',
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    borderRadius: '12px',
                    padding: isMobile ? '10px' : '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Users size={isMobile ? 20 : 24} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: isMobile ? '1.3rem' : 'clamp(1.4rem, 4vw, 1.8rem)', 
                      fontWeight: '700', 
                      color: '#1F2937' 
                    }}>
                      {animatedStats.studentsEnrolled.toLocaleString()}+
                    </div>
                    <div style={{ 
                      fontSize: isMobile ? '0.8rem' : '0.9rem', 
                      color: '#6B7280' 
                    }}>
                      {t('studentsLearning')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spin Wheel Section */}
            <div
              className="mobile-wheel-section"
              style={{
                flex: isMobile ? 'none' : '0 0 auto',
                maxWidth: isMobile ? '280px' : '340px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: isMobile ? '0 auto' : '0'
              }}
            >
              <SpinWheel onRewardWon={handleRewardWon} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mobile-section" style={{ 
        padding: isMobile ? '50px 20px' : '80px 20px', 
        background: '#FFFFFF' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: isMobile ? '40px' : '60px' 
          }}>
            <h2 style={{
              fontSize: isMobile ? 'clamp(1.8rem, 6vw, 2.2rem)' : 'clamp(2.2rem, 6vw, 3rem)',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: isMobile ? '16px' : '20px'
            }}>
              {t('whyChoose')}
            </h2>
            <p style={{
              fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.1rem, 4vw, 1.25rem)',
              color: '#6B7280',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              {t('revolutionaryExperience')}
            </p>
          </div>
          
          <div className="mobile-feature-grid" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: isMobile ? '16px' : '30px'
          }}>
            {[
              { icon: '🎯', title: 'personalizedLearning', description: 'personalizedLearningDesc' },
              { icon: '⚡', title: 'instantFeedback', description: 'instantFeedbackDesc' },
              { icon: '📊', title: 'progressAnalytics', description: 'progressAnalyticsDesc' },
              { icon: '🏆', title: 'gamifiedExperience', description: 'gamifiedExperienceDesc' },
              { icon: '📚', title: 'vastQuestionBank', description: 'vastQuestionBankDesc' },
              { icon: '🎓', title: 'expertCrafted', description: 'expertCraftedDesc' }
            ].map((feature, index) => (
              <div
                key={index}
                className="mobile-feature-card"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                  borderRadius: '20px',
                  padding: isMobile ? '20px' : '35px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  border: '1px solid #E5E7EB',
                  textAlign: 'center'
                }}
              >
                <div style={{ 
                  fontSize: isMobile ? '48px' : '56px', 
                  marginBottom: isMobile ? '16px' : '20px',
                  display: 'inline-block'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: isMobile ? '1.2rem' : '1.4rem',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: isMobile ? '12px' : '16px'
                }}>
                  {t(`features.${feature.title}`)}
                </h3>
                <p style={{
                  fontSize: isMobile ? '0.95rem' : '1.1rem',
                  color: '#6B7280',
                  lineHeight: '1.6'
                }}>
                  {t(`features.${feature.description}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Categories */}
      <section className="mobile-section" style={{
        padding: isMobile ? '50px 20px' : '80px 20px',
        background: 'linear-gradient(180deg, #F3F4F6 0%, #FFFFFF 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: isMobile ? '40px' : '60px' 
          }}>
            <h2 style={{
              fontSize: isMobile ? 'clamp(1.8rem, 6vw, 2.2rem)' : 'clamp(2.2rem, 6vw, 3rem)',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: isMobile ? '16px' : '20px'
            }}>
              {t('exploreCategories')}
            </h2>
            <p style={{ 
              fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.1rem, 4vw, 1.25rem)', 
              color: '#6B7280' 
            }}>
              {t('chooseSubjects')}
            </p>
          </div>
          
          <div className="mobile-subject-grid" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: isMobile ? '12px' : '25px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {[
              { name: 'English', icon: '📖', color: '#F59E0B', tests: 420 },
              { name: 'Telugu', icon: '🔤', color: '#EC4899', tests: 380 },
              { name: 'Mathematics', icon: '🔢', color: '#3B82F6', tests: 450 },
              { name: 'Social', icon: '🌏', color: '#8B5CF6', tests: 340 },
              { name: 'Science', icon: '🔬', color: '#10B981', tests: 390 },
              { name: 'Computers', icon: '💻', color: '#6366F1', tests: 310 }
            ].map((subject, index) => (
              <div
                key={index}
                className="mobile-subject-card"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: isMobile ? '25px 15px' : '35px 25px',
                  textAlign: 'center',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (windowWidth > 768) {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.borderColor = subject.color;
                    e.currentTarget.style.boxShadow = `0 12px 35px ${subject.color}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (windowWidth > 768) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
                  }
                }}
                onClick={(e) => {
                  if (windowWidth <= 768) {
                    e.currentTarget.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }, 150);
                  }
                }}
              >
                <div style={{ 
                  fontSize: isMobile ? '60px' : '72px', 
                  marginBottom: isMobile ? '16px' : '20px',
                  display: 'inline-block'
                }}>
                  {subject.icon}
                </div>
                <h3 style={{
                  fontSize: isMobile ? '1.2rem' : '1.4rem',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: isMobile ? '10px' : '12px'
                }}>
                  {t(`subjects.${subject.name}`)}
                </h3>
                <p style={{ 
                  fontSize: isMobile ? '0.85rem' : '1rem', 
                  color: subject.color, 
                  fontWeight: '600',
                  background: `${subject.color}15`,
                  padding: isMobile ? '6px 12px' : '8px 16px',
                  borderRadius: '25px',
                  display: 'inline-block'
                }}>
                  {subject.tests} {t('practiceTestsCount')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mobile-section" style={{ 
        padding: isMobile ? '50px 20px' : '80px 20px', 
        background: '#FFFFFF' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: isMobile ? '40px' : '60px' 
          }}>
            <h2 style={{
              fontSize: isMobile ? 'clamp(1.8rem, 6vw, 2.2rem)' : 'clamp(2.2rem, 6vw, 3rem)',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: isMobile ? '16px' : '20px'
            }}>
              {t('howItWorks')}
            </h2>
            <p style={{ 
              fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.1rem, 4vw, 1.25rem)', 
              color: '#6B7280' 
            }}>
              {t('getStarted')}
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '30px' : '50px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {[
              { step: '01', title: 'chooseSubject', description: 'chooseSubjectDesc', icon: '📚', color: '#3B82F6' },
              { step: '02', title: 'startPracticing', description: 'startPracticingDesc', icon: '✍️', color: '#10B981' },
              { step: '03', title: 'trackProgress', description: 'trackProgressDesc', icon: '📈', color: '#F59E0B' }
            ].map((item, index) => (
              <div
                key={index}
                className="mobile-step-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '20px' : '35px',
                  flexWrap: 'wrap',
                  flexDirection: isMobile ? 'column' : 'row',
                  textAlign: isMobile ? 'center' : 'left'
                }}
              >
                <div style={{
                  minWidth: isMobile ? '70px' : '90px',
                  height: isMobile ? '70px' : '90px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '32px' : '40px',
                  boxShadow: `0 10px 25px ${item.color}40`,
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div style={{ 
                  flex: 1, 
                  minWidth: isMobile ? '100%' : '280px',
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  <div style={{
                    fontSize: isMobile ? '2.5rem' : '3.5rem',
                    fontWeight: '700',
                    color: '#E5E7EB',
                    marginBottom: isMobile ? '-10px' : '-15px'
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{
                    fontSize: isMobile ? '1.3rem' : '1.6rem',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: isMobile ? '8px' : '12px'
                  }}>
                    {t(`steps.${item.title}`)}
                  </h3>
                  <p style={{ 
                    fontSize: isMobile ? '1rem' : '1.15rem', 
                    color: '#6B7280', 
                    lineHeight: '1.7' 
                  }}>
                    {t(`steps.${item.description}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 20px',
        background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: isMobile ? '200px' : '300px',
          height: isMobile ? '200px' : '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '-50px',
          width: isMobile ? '150px' : '200px',
          height: isMobile ? '150px' : '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite reverse'
        }} />
       
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          textAlign: 'center', 
          position: 'relative', 
          zIndex: 1 
        }}>
          <h2 style={{
            fontSize: isMobile ? 'clamp(1.8rem, 6vw, 2.2rem)' : 'clamp(2.2rem, 6vw, 3rem)',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: isMobile ? '16px' : '24px'
          }}>
            {t('readyToExcel')}
          </h2>
          <p style={{
            fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.2rem, 4vw, 1.4rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: isMobile ? '30px' : '40px',
            lineHeight: '1.6'
          }}>
            {t('joinStudents')}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Practice;