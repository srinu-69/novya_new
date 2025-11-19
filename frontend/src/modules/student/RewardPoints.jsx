
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaCoins, FaTimes, FaHistory, FaTrash, FaClock, FaQuestionCircle, FaGift, FaList } from 'react-icons/fa';
// import { useTranslation } from 'react-i18next';

// const RewardPoints = ({ isMobile = false }) => {
//   const [currentRewardPoints, setCurrentRewardPoints] = useState(0);
//   const [pointsChange, setPointsChange] = useState(0);
//   const [showPointsAnimation, setShowPointsAnimation] = useState(false);
//   const [showFlyingCoins, setShowFlyingCoins] = useState(false);
//   const [rewardsHistoryOpen, setRewardsHistoryOpen] = useState(false);
//   const [rewardsHistory, setRewardsHistory] = useState([]);
//   const [activeTab, setActiveTab] = useState('history'); // 'history', 'earn', 'use'

//   const { t } = useTranslation();

//   // Load rewards history
//   const loadRewardsHistory = () => {
//     try {
//       const savedHistory = localStorage.getItem('rewardsHistory');
//       if (savedHistory) {
//         const history = JSON.parse(savedHistory);
//         const sortedHistory = history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//         setRewardsHistory(sortedHistory);
//       } else {
//         setRewardsHistory([]);
//       }
//     } catch (error) {
//       console.error('Error loading rewards history:', error);
//       setRewardsHistory([]);
//     }
//   };

//   const clearAllRewardsHistory = () => {
//     try {
//       localStorage.removeItem('rewardsHistory');
//       setRewardsHistory([]);
//       window.dispatchEvent(new StorageEvent('storage', {
//         key: 'rewardsHistory',
//         newValue: null
//       }));
//     } catch (error) {
//       console.error('Error clearing rewards history:', error);
//     }
//   };

//   const addRewardPointsWithHistory = (points, reason, source = 'system') => {
//     const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
//     const newPoints = currentPoints + points;
   
//     localStorage.setItem('rewardPoints', newPoints.toString());
//     setCurrentRewardPoints(newPoints);
   
//     const historyEntry = {
//       id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       points: points,
//       totalPoints: newPoints,
//       reason: reason,
//       source: source,
//       timestamp: new Date().toISOString()
//     };
   
//     const existingHistory = JSON.parse(localStorage.getItem('rewardsHistory') || '[]');
//     const updatedHistory = [historyEntry, ...existingHistory];
//     localStorage.setItem('rewardsHistory', JSON.stringify(updatedHistory));
//     setRewardsHistory(updatedHistory);
   
//     window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
//       detail: { rewardPoints: newPoints }
//     }));
   
//     return historyEntry;
//   };

//   const triggerFlyingCoins = (pointsToAdd = 0, reason = "Activity completed") => {
//     setShowFlyingCoins(true);
//     if (pointsToAdd > 0) {
//       addRewardPointsWithHistory(pointsToAdd, reason, 'activity');
//     }
//     setTimeout(() => {
//       setShowFlyingCoins(false);
//     }, 2000);
//   };

//   const triggerWelcomeCoins = () => {
//     const welcomeAwarded = sessionStorage.getItem('welcomePointsAwarded');
//     if (!welcomeAwarded) {
//       setShowFlyingCoins(true);
//       addRewardPointsWithHistory(5, "Daily login reward", 'login');
//       sessionStorage.setItem('welcomePointsAwarded', 'true');
     
//       setTimeout(() => {
//         setShowFlyingCoins(false);
//       }, 3000);
//     }
//   };

//   // Initialize reward points
//   useEffect(() => {
//     const points = parseInt(localStorage.getItem('rewardPoints')) || 0;
//     setCurrentRewardPoints(points);
//     loadRewardsHistory();

//     const justLoggedIn = sessionStorage.getItem('justLoggedIn');
//     if (justLoggedIn) {
//       setTimeout(() => {
//         triggerWelcomeCoins();
//         sessionStorage.removeItem('justLoggedIn');
//       }, 1000);
//     }
//   }, []);

//   // Listen for reward points updates
//   useEffect(() => {
//     const handleRewardPointsUpdate = (event) => {
//       if (event.detail && event.detail.rewardPoints !== undefined) {
//         const newPoints = event.detail.rewardPoints;
//         const oldPoints = currentRewardPoints;
//         const pointsDiff = newPoints - oldPoints;
       
//         if (pointsDiff > 0) {
//           setPointsChange(pointsDiff);
//           setShowPointsAnimation(true);
//           triggerFlyingCoins();
//           setTimeout(() => setShowPointsAnimation(false), 2000);
//         }
       
//         setCurrentRewardPoints(newPoints);
//         loadRewardsHistory();
//       }
//     };

//     const handleStorageChange = (e) => {
//       if (e.key === 'rewardPoints') {
//         const points = parseInt(e.newValue) || 0;
//         const oldPoints = currentRewardPoints;
//         const pointsDiff = points - oldPoints;
       
//         if (pointsDiff > 0) {
//           setPointsChange(pointsDiff);
//           setShowPointsAnimation(true);
//           triggerFlyingCoins();
//           setTimeout(() => setShowPointsAnimation(false), 2000);
//         }
       
//         setCurrentRewardPoints(points);
//         loadRewardsHistory();
//       }
//     };

//     window.addEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
//     window.addEventListener('storage', handleStorageChange);
   
//     const interval = setInterval(() => {
//       const points = parseInt(localStorage.getItem('rewardPoints')) || 0;
//       if (points !== currentRewardPoints) {
//         const pointsDiff = points - currentRewardPoints;
//         if (pointsDiff > 0) {
//           setPointsChange(pointsDiff);
//           setShowPointsAnimation(true);
//           triggerFlyingCoins();
//           setTimeout(() => setShowPointsAnimation(false), 2000);
//         }
//         setCurrentRewardPoints(points);
//         loadRewardsHistory();
//       }
//     }, 1000);

//     return () => {
//       window.removeEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
//       window.removeEventListener('storage', handleStorageChange);
//       clearInterval(interval);
//     };
//   }, [currentRewardPoints]);

//   // Function to add points from other components
//   const addPoints = (points, reason, source = 'system') => {
//     return addRewardPointsWithHistory(points, reason, source);
//   };

//   // Tab navigation component
//   const TabNavigation = () => (
//     <div style={{
//       display: 'flex',
//       borderBottom: '1px solid #e5e7eb',
//       background: '#fafafa'
//     }}>
//       <button
//         onClick={() => setActiveTab('history')}
//         style={{
//           flex: 1,
//           padding: '12px 16px',
//           background: activeTab === 'history' ? '#fff' : 'transparent',
//           border: 'none',
//           borderBottom: activeTab === 'history' ? '2px solid #FFD700' : '2px solid transparent',
//           cursor: 'pointer',
//           fontSize: '13px',
//           fontWeight: '500',
//           color: activeTab === 'history' ? '#8B5A2B' : '#6b7280',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           gap: '6px',
//           transition: 'all 0.2s ease'
//         }}
//       >
//         <FaHistory size={14} />
//         History
//       </button>
//       <button
//         onClick={() => setActiveTab('earn')}
//         style={{
//           flex: 1,
//           padding: '12px 16px',
//           background: activeTab === 'earn' ? '#fff' : 'transparent',
//           border: 'none',
//           borderBottom: activeTab === 'earn' ? '2px solid #FFD700' : '2px solid transparent',
//           cursor: 'pointer',
//           fontSize: '13px',
//           fontWeight: '500',
//           color: activeTab === 'earn' ? '#8B5A2B' : '#6b7280',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           gap: '6px',
//           transition: 'all 0.2s ease'
//         }}
//       >
//         <FaQuestionCircle size={14} />
//         How to Earn
//       </button>
//       <button
//         onClick={() => setActiveTab('use')}
//         style={{
//           flex: 1,
//           padding: '12px 16px',
//           background: activeTab === 'use' ? '#fff' : 'transparent',
//           border: 'none',
//           borderBottom: activeTab === 'use' ? '2px solid #FFD700' : '2px solid transparent',
//           cursor: 'pointer',
//           fontSize: '13px',
//           fontWeight: '500',
//           color: activeTab === 'use' ? '#8B5A2B' : '#6b7280',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           gap: '6px',
//           transition: 'all 0.2s ease'
//         }}
//       >
//         <FaGift size={14} />
//         How to Use
//       </button>
//     </div>
//   );

//   // Content components for each tab
//   const HistoryContent = () => (
//     <div>
//       {rewardsHistory.length > 0 && (
//         <div style={{ 
//           padding: '12px 20px', 
//           borderBottom: '1px solid #e5e7eb', 
//           background: '#fafafa', 
//           display: 'flex', 
//           justifyContent: 'flex-end' 
//         }}>
//           <button
//             onClick={clearAllRewardsHistory}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '6px',
//               background: '#fee2e2',
//               color: '#dc2626',
//               border: '1px solid #fecaca',
//               borderRadius: '6px',
//               padding: '6px 12px',
//               fontSize: '12px',
//               fontWeight: '500',
//               cursor: 'pointer'
//             }}
//           >
//             <FaTrash size={10} />
//             {t('clear_all_history')}
//           </button>
//         </div>
//       )}

//       <div style={{ 
//         flex: 1, 
//         overflowY: 'auto', 
//         padding: '16px' 
//       }}>
//         {rewardsHistory.length === 0 ? (
//           <div style={{ 
//             padding: '40px 16px', 
//             textAlign: 'center', 
//             color: '#6b7280' 
//           }}>
//             <FaCoins size={28} style={{ marginBottom: '8px', opacity: 0.5 }} />
//             <p style={{ margin: 0, fontSize: '15px' }}>{t('no_reward_history')}</p>
//             <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>Complete activities to earn points!</p>
//           </div>
//         ) : (
//           rewardsHistory.map((reward) => (
//             <div key={reward.id} style={{ 
//               paddingBottom: '12px', 
//               borderBottom: '1px solid #f3f4f6', 
//               marginBottom: '12px' 
//             }}>
//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'space-between', 
//                 alignItems: 'flex-start', 
//                 marginBottom: '4px' 
//               }}>
//                 <div style={{ 
//                   fontWeight: 500, 
//                   color: '#374151', 
//                   fontSize: '14px' 
//                 }}>
//                   {reward.reason}
//                 </div>
//                 <div style={{ 
//                   color: reward.points > 0 ? '#16a34a' : '#dc2626', 
//                   fontWeight: '600', 
//                   fontSize: '14px' 
//                 }}>
//                   {reward.points > 0 ? '+' : ''}{reward.points}
//                 </div>
//               </div>
//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'space-between', 
//                 alignItems: 'center', 
//                 fontSize: '12px', 
//                 color: '#6b7280' 
//               }}>
//                 <div style={{ 
//                   display: 'flex', 
//                   gap: '4px', 
//                   alignItems: 'center' 
//                 }}>
//                   <FaClock size={10} />
//                   {new Date(reward.timestamp).toLocaleDateString()} at {new Date(reward.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </div>
//                 <div style={{ 
//                   fontSize: '11px', 
//                   color: '#9ca3af', 
//                   fontWeight: '500' 
//                 }}>
//                   Total: {reward.totalPoints}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );

//   const EarnContent = () => (
//     <div style={{ 
//       padding: '20px',
//       overflowY: 'auto',
//       flex: 1
//     }}>
//       <div style={{ 
//         background: 'linear-gradient(135deg, #fff9e6, #fff0cc)', 
//         padding: '16px', 
//         borderRadius: '12px', 
//         marginBottom: '20px',
//         border: '1px solid #ffe8a1'
//       }}>
//         <h3 style={{ 
//           margin: '0 0 8px 0', 
//           color: '#8B5A2B', 
//           fontSize: '16px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px'
//         }}>
//           <FaCoins color="#FFD700" />
//           Ways to Earn Reward Points
//         </h3>
//         <p style={{ 
//           margin: 0, 
//           color: '#6b7280', 
//           fontSize: '14px',
//           lineHeight: '1.5'
//         }}>
//           Complete activities to earn coins and unlock amazing rewards!
//         </p>
//       </div>

//       <div style={{ marginBottom: '24px' }}>
//         <h4 style={{ 
//           margin: '0 0 12px 0', 
//           color: '#374151', 
//           fontSize: '15px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//           flexWrap: 'wrap',
//           lineHeight: '1.4'
//         }}>
//           <div style={{
//             width: '24px',
//             height: '24px',
//             background: '#10b981',
//             borderRadius: '50%',
//             display: 'inline-flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: '11px',
//             color: '#fff',
//             fontWeight: '600',
//             marginRight: '8px',
//             flexShrink: 0,
//             boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
//           }}>
//             +5
//           </div>
//           Daily Activities
//         </h4>
//         <div style={{ 
//           background: '#f8fafc', 
//           padding: '12px', 
//           borderRadius: '8px',
//           borderLeft: '4px solid #10b981'
//         }}>
//           <ul style={{ 
//             margin: 0, 
//             paddingLeft: '16px', 
//             color: '#6b7280',
//             fontSize: '14px',
//             lineHeight: '1.6'
//           }}>
//             <li><strong>Daily Login:</strong> Earn 5 coins every day you log in</li>
//             <li><strong>Video Lessons:</strong> Get 10 coins for watching complete chapters without skipping</li>
//             <li><strong>Daily Spin:</strong> Spin to win 5-20 coins daily</li>
//           </ul>
//         </div>
//       </div>

//       <div style={{ marginBottom: '24px' }}>
//         <h4 style={{ 
//           margin: '0 0 12px 0', 
//           color: '#374151', 
//           fontSize: '15px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//           flexWrap: 'wrap',
//           lineHeight: '1.4'
//         }}>
//           <div style={{
//             width: '24px',
//             height: '24px',
//             background: '#3b82f6',
//             borderRadius: '50%',
//             display: 'inline-flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: '11px',
//             color: '#fff',
//             fontWeight: '600',
//             marginRight: '8px',
//             flexShrink: 0,
//             boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
//           }}>
//             +20
//           </div>
//           Feedback & Engagement
//         </h4>
//         <div style={{ 
//           background: '#f8fafc', 
//           padding: '12px', 
//           borderRadius: '8px',
//           borderLeft: '4px solid #3b82f6'
//         }}>
//           <ul style={{ 
//             margin: 0, 
//             paddingLeft: '16px', 
//             color: '#6b7280',
//             fontSize: '14px',
//             lineHeight: '1.6'
//           }}>
//             <li><strong>Submit Feedback:</strong> Earn 20 coins for providing valuable feedback</li>
//           </ul>
//         </div>
//       </div>

//       <div style={{ marginBottom: '24px' }}>
//         <h4 style={{ 
//           margin: '0 0 12px 0', 
//           color: '#374151', 
//           fontSize: '15px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//           flexWrap: 'wrap',
//           lineHeight: '1.4'
//         }}>
// <div style={{
//   width: '36px',
//   height: '36px',
//   background: '#f59e0b',
//   borderRadius: '50%',
//   display: 'inline-flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   fontSize: '9px',
//   color: '#fff',
//   fontWeight: '600',
//   marginRight: '8px',
//   flexShrink: 0,
//   boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
//   textAlign: 'center',
//   lineHeight: '1'
// }}>
//   QUIZ
// </div>

//           Quiz Performance
//         </h4>
//         <div style={{ 
//           background: '#f8fafc', 
//           padding: '12px', 
//           borderRadius: '8px',
//           borderLeft: '4px solid #f59e0b'
//         }}>
//           <ul style={{ 
//             margin: 0, 
//             paddingLeft: '16px', 
//             color: '#6b7280',
//             fontSize: '14px',
//             lineHeight: '1.6'
//           }}>
//             <li><strong>Passing Score (5+):</strong> Earn coins equal to your score</li>
//             <li><strong>Excellent Score (80%+):</strong> Get your score + 10 bonus coins</li>
//             {/* <li><strong>Example:</strong> Score 8/10 = 8 coins + 10 bonus coins = 18 coins</li> */}
//           </ul>
//         </div>
//       </div>

//       <div style={{ marginBottom: '24px' }}>
//         <h4 style={{ 
//           margin: '0 0 12px 0', 
//           color: '#374151', 
//           fontSize: '15px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//           flexWrap: 'wrap',
//           lineHeight: '1.4'
//         }}>
// <div style={{
//   width: '36px',
//   height: '36px',
//   background: '#8b5cf6',
//   borderRadius: '50%',
//   display: 'inline-flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   fontSize: '9px',
//   color: '#fff',
//   fontWeight: '600',
//   marginRight: '8px',
//   flexShrink: 0,
//   boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
//   textAlign: 'center',
//   lineHeight: '1'
// }}>
//   MOCK
// </div>


//           Mock Test Performance
//         </h4>
//         <div style={{ 
//           background: '#f8fafc', 
//           padding: '12px', 
//           borderRadius: '8px',
//           borderLeft: '4px solid #8b5cf6'
//         }}>
//           <ul style={{ 
//             margin: 0, 
//             paddingLeft: '16px', 
//             color: '#6b7280',
//             fontSize: '14px',
//             lineHeight: '1.6'
//           }}>
//             <li><strong>Passing Score (20+):</strong> Earn coins equal to your score</li>
//             <li><strong>Excellent Score (80%+):</strong> Get your score + 10 bonus coins</li>
//             {/* <li><strong>Example:</strong> Score 25/30 = 25 coins + 10 bonus coins = 35 coins</li> */}
//           </ul>
//         </div>
//       </div>

//       <div style={{ 
//         background: '#f0f9ff', 
//         padding: '16px', 
//         borderRadius: '8px',
//         border: '1px solid #bae6fd',
//         textAlign: 'center'
//       }}>
//         <p style={{ 
//           margin: '0 0 8px 0', 
//           color: '#0369a1', 
//           fontSize: '14px',
//           fontWeight: '500'
//         }}>
//           Coins are awarded immediately after completing activities
//         </p>
//         <p style={{ 
//           margin: 0, 
//           color: '#6b7280', 
//           fontSize: '12px'
//         }}>
//           Practice regularly to maximize your coin earnings!
//         </p>
//       </div>
//     </div>
//   );

//   const UseContent = () => (
//     <div style={{ 
//       padding: '20px',
//       overflowY: 'auto',
//       flex: 1
//     }}>
//       <div style={{ 
//         background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', 
//         padding: '16px', 
//         borderRadius: '12px', 
//         marginBottom: '20px',
//         border: '1px solid #bae6fd'
//       }}>
//         <h3 style={{ 
//           margin: '0 0 8px 0', 
//           color: '#0369a1', 
//           fontSize: '16px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px'
//         }}>
//           <FaGift color="#3b82f6" />
//           Using Your Reward Coins
//         </h3>
//         <p style={{ 
//           margin: 0, 
//           color: '#6b7280', 
//           fontSize: '14px',
//           lineHeight: '1.5'
//         }}>
//           Use your coins to get help during quizzes and mock tests, or unlock premium features.
//         </p>
//       </div>

//       <div style={{ marginBottom: '24px' }}>
//         <h4 style={{ 
//           margin: '0 0 16px 0', 
//           color: '#374151', 
//           fontSize: '15px',
//           paddingBottom: '8px',
//           borderBottom: '2px solid #e5e7eb'
//         }}>
//           In-App Features
//         </h4>
        
//         <div style={{ 
//           display: 'grid', 
//           gap: '12px',
//           marginBottom: '20px'
//         }}>
//           <div style={{ 
//             background: '#f8fafc', 
//             padding: '16px', 
//             borderRadius: '8px',
//             border: '1px solid #e5e7eb'
//           }}>
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: '8px'
//             }}>
//               <span style={{ 
//                 fontWeight: '600', 
//                 color: '#374151',
//                 fontSize: '14px'
//               }}>
//                 Quiz Hints
//               </span>
//               <span style={{ 
//                 background: '#dc2626', 
//                 color: 'white',
//                 padding: '4px 8px',
//                 borderRadius: '12px',
//                 fontSize: '12px',
//                 fontWeight: 'bold'
//               }}>
//                 5 coins
//               </span>
//             </div>
//             <p style={{ 
//               margin: 0, 
//               color: '#6b7280', 
//               fontSize: '13px',
//               lineHeight: '1.5'
//             }}>
//               Get helpful hints during quizzes when you're stuck on a question
//             </p>
//           </div>

//           <div style={{ 
//             background: '#f8fafc', 
//             padding: '16px', 
//             borderRadius: '8px',
//             border: '1px solid #e5e7eb'
//           }}>
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: '8px'
//             }}>
//               <span style={{ 
//                 fontWeight: '600', 
//                 color: '#374151',
//                 fontSize: '14px'
//               }}>
//                 Mock Test Hints
//               </span>
//               <span style={{ 
//                 background: '#dc2626', 
//                 color: 'white',
//                 padding: '4px 8px',
//                 borderRadius: '12px',
//                 fontSize: '12px',
//                 fontWeight: 'bold'
//               }}>
//                 5 coins
//               </span>
//             </div>
//             <p style={{ 
//               margin: 0, 
//               color: '#6b7280', 
//               fontSize: '13px',
//               lineHeight: '1.5'
//             }}>
//               Unlock hints during mock tests to help with difficult questions
//             </p>
//           </div>

//           <div style={{ 
//             background: '#f8fafc', 
//             padding: '16px', 
//             borderRadius: '8px',
//             border: '1px solid #e5e7eb'
//           }}>
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: '8px'
//             }}>
//               <span style={{ 
//                 fontWeight: '600', 
//                 color: '#374151',
//                 fontSize: '14px'
//               }}>
//                 Skip Question
//               </span>
//               <span style={{ 
//                 background: '#f59e0b', 
//                 color: 'white',
//                 padding: '4px 8px',
//                 borderRadius: '12px',
//                 fontSize: '12px',
//                 fontWeight: 'bold'
//               }}>
//                 10 coins
//               </span>
//             </div>
//             <p style={{ 
//               margin: 0, 
//               color: '#6b7280', 
//               fontSize: '13px',
//               lineHeight: '1.5'
//             }}>
//               Skip a difficult question and come back to it later
//             </p>
//           </div>
//         </div>
//       </div>

//       <div style={{ marginBottom: '24px' }}>
//         <h4 style={{ 
//           margin: '0 0 12px 0', 
//           color: '#374151', 
//           fontSize: '15px'
//         }}>
//           How to Use Coins
//         </h4>
//         <div style={{ 
//           background: '#f8fafc', 
//           padding: '16px', 
//           borderRadius: '8px',
//           borderLeft: '4px solid #8b5cf6'
//         }}>
//           <ol style={{ 
//             margin: 0, 
//             paddingLeft: '16px', 
//             color: '#6b7280',
//             fontSize: '14px',
//             lineHeight: '1.6'
//           }}>
//             <li>During quizzes or mock tests, click the "Hint" button when available</li>
//             <li>Confirm you want to spend 5 coins for a hint</li>
//             <li>The hint will be revealed to help you answer the question</li>
//             <li>Coins are deducted automatically from your balance</li>
//             <li>Continue earning coins through daily activities and good performance</li>
//           </ol>
//         </div>
//       </div>

//       <div style={{ 
//         background: '#fef2f2', 
//         padding: '16px', 
//         borderRadius: '8px',
//         border: '1px solid #fecaca'
//       }}>
//         <h5 style={{ 
//           margin: '0 0 8px 0', 
//           color: '#dc2626', 
//           fontSize: '14px'
//         }}>
//           Important Notes
//         </h5>
//         <ul style={{ 
//           margin: 0, 
//           paddingLeft: '16px', 
//           color: '#6b7280',
//           fontSize: '13px',
//           lineHeight: '1.5'
//         }}>
//           <li>Coins expire after 12 months of inactivity</li>
//           <li>Hints can only be used once per question</li>
//           <li>Coins cannot be transferred or exchanged for cash</li>
//           <li>Ensure you have sufficient coins before attempting to use hints</li>
//         </ul>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* Flying Coins Animation */}
//       {showFlyingCoins && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           pointerEvents: 'none',
//           zIndex: 9998
//         }}>
//           {[...Array(12)].map((_, i) => (
//             <motion.div
//               key={i}
//               style={{
//                 position: 'absolute',
//                 fontSize: '20px',
//                 color: '#FFD700',
//                 zIndex: 9998,
//                 filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))'
//               }}
//               initial={{
//                 scale: 0,
//                 opacity: 1,
//                 x: Math.random() * window.innerWidth,
//                 y: window.innerHeight + 50
//               }}
//               animate={{
//                 scale: [0, 1, 0.8, 0],
//                 opacity: [1, 1, 1, 0],
//                 x: [
//                   Math.random() * window.innerWidth,
//                   Math.random() * window.innerWidth,
//                   Math.random() * window.innerWidth
//                 ],
//                 y: [
//                   window.innerHeight + 50,
//                   window.innerHeight * 0.3,
//                   -50
//                 ]
//               }}
//               transition={{
//                 duration: 2,
//                 ease: "easeOut",
//                 delay: i * 0.15
//               }}
//             >
//               <FaCoins />
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Reward Points Display */}
//       <div style={{ position: 'relative' }}>
//         <motion.div
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             background: 'linear-gradient(135deg, #FFD700, #FFA500)',
//             padding: '8px 16px',
//             borderRadius: '20px',
//             fontSize: '14px',
//             fontWeight: '600',
//             color: '#744210',
//             border: '2px solid #FFC107',
//             cursor: 'pointer',
//             boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)',
//             minWidth: '80px',
//             justifyContent: 'center',
//             position: 'relative',
//             overflow: 'hidden'
//           }}
//           onClick={() => {
//             loadRewardsHistory();
//             setRewardsHistoryOpen(true);
//             setActiveTab('history');
//           }}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <div style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
//             backgroundSize: '200% 100%',
//             animation: 'shimmer 2s infinite linear',
//             opacity: 0.5
//           }} />
         
//           {!isMobile && (
//             <FaCoins size={16} color="#744210" style={{ position: 'relative', zIndex: 1 }} />
//           )}
//           <span style={{
//             fontFamily: "'Poppins', sans-serif",
//             background: 'linear-gradient(45deg, #744210, #8B5A2B)',
//             WebkitBackgroundClip: 'text',
//             backgroundClip: 'text',
//             color: 'transparent',
//             position: 'relative',
//             zIndex: 1
//           }}>
//             {currentRewardPoints.toLocaleString()}
//           </span>
         
//           {showPointsAnimation && pointsChange > 0 && (
//             <motion.div
//               style={{
//                 position: 'absolute',
//                 right: 0,
//                 top: '-20px',
//                 background: 'linear-gradient(135deg, #10b981, #059669)',
//                 color: 'white',
//                 padding: '4px 8px',
//                 borderRadius: '12px',
//                 fontSize: '12px',
//                 fontWeight: 'bold',
//                 whiteSpace: 'nowrap',
//                 boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
//                 zIndex: 1001
//               }}
//               initial={{ opacity: 0, y: 0 }}
//               animate={{ opacity: 1, y: -20 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               +{pointsChange}
//             </motion.div>
//           )}
//         </motion.div>

//         {/* Rewards History - Fixed Sidebar */}
//         <AnimatePresence>
//           {rewardsHistoryOpen && (
//             <>
//               {/* Overlay */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 style={{
//                   position: 'fixed',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   background: 'rgba(0, 0, 0, 0.5)',
//                   zIndex: 9999,
//                 }}
//                 onClick={() => setRewardsHistoryOpen(false)}
//               />
             
//               {/* Sidebar */}
//               <motion.div
//                 initial={{ x: '100%', opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 exit={{ x: '100%', opacity: 0 }}
//                 transition={{ type: 'tween', duration: 0.3 }}
//                 style={{
//                   position: 'fixed',
//                   top: 0,
//                   right: 0,
//                   height: '100vh',
//                   width: isMobile ? '100vw' : '420px',
//                   background: '#fff',
//                   boxShadow: '-4px 0 25px rgba(0,0,0,0.2)',
//                   zIndex: 10000,
//                   display: 'flex',
//                   flexDirection: 'column',
//                 }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div style={{ 
//                   padding: '20px', 
//                   borderBottom: '1px solid #e5e7eb', 
//                   background: 'linear-gradient(135deg, #fff9e6, #fff0cc)' 
//                 }}>
//                   <div style={{ 
//                     display: 'flex', 
//                     justifyContent: 'space-between', 
//                     alignItems: 'center' 
//                   }}>
//                     <div>
//                       <h3 style={{ 
//                         fontSize: '18px', 
//                         fontWeight: '600', 
//                         margin: 0 
//                       }}>
//                         {t('reward_points_history')}
//                       </h3>
//                       <p style={{ 
//                         fontSize: '13px', 
//                         color: '#6b7280', 
//                         margin: '4px 0 0 0' 
//                       }}>
//                         <b style={{ color: "#8B5A2B" }}>
//                           {t("totalPoints", { points: currentRewardPoints.toLocaleString() })}
//                         </b>
//                       </p>
//                     </div>
//                     <button 
//                       onClick={() => setRewardsHistoryOpen(false)} 
//                       style={{ 
//                         background: 'none', 
//                         border: 'none', 
//                         cursor: 'pointer', 
//                         fontSize: '16px', 
//                         color: '#6b7280' 
//                       }}
//                     >
//                       <FaTimes />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Tab Navigation */}
//                 <TabNavigation />

//                 {/* Tab Content */}
//                 <div style={{ flex: 1, overflow: 'auto' }}>
//                   {activeTab === 'history' ? <HistoryContent /> : null}
//                   {activeTab === 'earn' ? <EarnContent /> : null}
//                   {activeTab === 'use' ? <UseContent /> : null}
//                 </div>
//               </motion.div>
//             </>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Shimmer Animation Style */}
//       <style>
//         {`
//           @keyframes shimmer {
//             0% { background-position: -200% 0; }
//             100% { background-position: 200% 0; }
//           }
//         `}
//       </style>
//     </>
//   );
// };

// // Export the addPoints function for other components to use
// export const addRewardPoints = (points, reason, source = 'system') => {
//   const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
//   const newPoints = currentPoints + points;
 
//   localStorage.setItem('rewardPoints', newPoints.toString());
 
//   const historyEntry = {
//     id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//     points: points,
//     totalPoints: newPoints,
//     reason: reason,
//     source: source,
//     timestamp: new Date().toISOString()
//   };
 
//   const existingHistory = JSON.parse(localStorage.getItem('rewardsHistory') || '[]');
//   const updatedHistory = [historyEntry, ...existingHistory];
//   localStorage.setItem('rewardsHistory', JSON.stringify(updatedHistory));
 
//   window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
//     detail: { rewardPoints: newPoints }
//   }));
 
//   return historyEntry;
// };

// // Export function to get current points
// export const getCurrentRewardPoints = () => {
//   return parseInt(localStorage.getItem('rewardPoints') || '0');
// };

// // Export function to trigger flying coins animation
// export const triggerRewardAnimation = (points = 0, reason = "Activity completed") => {
//   window.dispatchEvent(new CustomEvent('triggerFlyingCoins', {
//     detail: { points, reason }
//   }));
// };

// export default RewardPoints;











import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaTimes, FaHistory, FaTrash, FaClock, FaQuestionCircle, FaGift, FaList } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RewardPoints = ({ isMobile = false }) => {
  const [currentRewardPoints, setCurrentRewardPoints] = useState(0);
  const [pointsChange, setPointsChange] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [showFlyingCoins, setShowFlyingCoins] = useState(false);
  const [rewardsHistoryOpen, setRewardsHistoryOpen] = useState(false);
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('history'); // 'history', 'earn', 'use'

  const { t } = useTranslation();

  // Load rewards history
  const loadRewardsHistory = () => {
    try {
      const savedHistory = localStorage.getItem('rewardsHistory');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        const sortedHistory = history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRewardsHistory(sortedHistory);
      } else {
        setRewardsHistory([]);
      }
    } catch (error) {
      console.error('Error loading rewards history:', error);
      setRewardsHistory([]);
    }
  };

  const clearAllRewardsHistory = () => {
    try {
      localStorage.removeItem('rewardsHistory');
      setRewardsHistory([]);
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'rewardsHistory',
        newValue: null
      }));
    } catch (error) {
      console.error('Error clearing rewards history:', error);
    }
  };

  const addRewardPointsWithHistory = (points, reason, source = 'system') => {
    const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
    const newPoints = currentPoints + points;
   
    localStorage.setItem('rewardPoints', newPoints.toString());
    setCurrentRewardPoints(newPoints);
   
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
    setRewardsHistory(updatedHistory);
   
    window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
      detail: { rewardPoints: newPoints }
    }));
   
    return historyEntry;
  };

  const triggerFlyingCoins = (pointsToAdd = 0, reason = "Activity completed") => {
    setShowFlyingCoins(true);
    if (pointsToAdd > 0) {
      addRewardPointsWithHistory(pointsToAdd, reason, 'activity');
    }
    setTimeout(() => {
      setShowFlyingCoins(false);
    }, 2000);
  };

  const triggerWelcomeCoins = () => {
    const welcomeAwarded = sessionStorage.getItem('welcomePointsAwarded');
    if (!welcomeAwarded) {
      setShowFlyingCoins(true);
      addRewardPointsWithHistory(5, t('rewards.dailyLogin'), 'login');
      sessionStorage.setItem('welcomePointsAwarded', 'true');
     
      setTimeout(() => {
        setShowFlyingCoins(false);
      }, 3000);
    }
  };

  // Initialize reward points
  useEffect(() => {
    const points = parseInt(localStorage.getItem('rewardPoints')) || 0;
    setCurrentRewardPoints(points);
    loadRewardsHistory();

    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn) {
      setTimeout(() => {
        triggerWelcomeCoins();
        sessionStorage.removeItem('justLoggedIn');
      }, 1000);
    }
  }, []);

  // Listen for reward points updates
  useEffect(() => {
    const handleRewardPointsUpdate = (event) => {
      if (event.detail && event.detail.rewardPoints !== undefined) {
        const newPoints = event.detail.rewardPoints;
        const oldPoints = currentRewardPoints;
        const pointsDiff = newPoints - oldPoints;
       
        if (pointsDiff > 0) {
          setPointsChange(pointsDiff);
          setShowPointsAnimation(true);
          triggerFlyingCoins();
          setTimeout(() => setShowPointsAnimation(false), 2000);
        }
       
        setCurrentRewardPoints(newPoints);
        loadRewardsHistory();
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'rewardPoints') {
        const points = parseInt(e.newValue) || 0;
        const oldPoints = currentRewardPoints;
        const pointsDiff = points - oldPoints;
       
        if (pointsDiff > 0) {
          setPointsChange(pointsDiff);
          setShowPointsAnimation(true);
          triggerFlyingCoins();
          setTimeout(() => setShowPointsAnimation(false), 2000);
        }
       
        setCurrentRewardPoints(points);
        loadRewardsHistory();
      }
    };

    window.addEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
    window.addEventListener('storage', handleStorageChange);
   
    const interval = setInterval(() => {
      const points = parseInt(localStorage.getItem('rewardPoints')) || 0;
      if (points !== currentRewardPoints) {
        const pointsDiff = points - currentRewardPoints;
        if (pointsDiff > 0) {
          setPointsChange(pointsDiff);
          setShowPointsAnimation(true);
          triggerFlyingCoins();
          setTimeout(() => setShowPointsAnimation(false), 2000);
        }
        setCurrentRewardPoints(points);
        loadRewardsHistory();
      }
    }, 1000);

    return () => {
      window.removeEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentRewardPoints]);

  // Function to add points from other components
  const addPoints = (points, reason, source = 'system') => {
    return addRewardPointsWithHistory(points, reason, source);
  };

  // Tab navigation component
  const TabNavigation = () => (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid #e5e7eb',
      background: '#fafafa'
    }}>
      <button
        onClick={() => setActiveTab('history')}
        style={{
          flex: 1,
          padding: '12px 16px',
          background: activeTab === 'history' ? '#fff' : 'transparent',
          border: 'none',
          borderBottom: activeTab === 'history' ? '2px solid #FFD700' : '2px solid transparent',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          color: activeTab === 'history' ? '#8B5A2B' : '#6b7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'all 0.2s ease'
        }}
      >
        <FaHistory size={14} />
        {t('rewards.history')}
      </button>
      <button
        onClick={() => setActiveTab('earn')}
        style={{
          flex: 1,
          padding: '12px 16px',
          background: activeTab === 'earn' ? '#fff' : 'transparent',
          border: 'none',
          borderBottom: activeTab === 'earn' ? '2px solid #FFD700' : '2px solid transparent',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          color: activeTab === 'earn' ? '#8B5A2B' : '#6b7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'all 0.2s ease'
        }}
      >
        <FaQuestionCircle size={14} />
        {t('rewards.howToEarn')}
      </button>
      <button
        onClick={() => setActiveTab('use')}
        style={{
          flex: 1,
          padding: '12px 16px',
          background: activeTab === 'use' ? '#fff' : 'transparent',
          border: 'none',
          borderBottom: activeTab === 'use' ? '2px solid #FFD700' : '2px solid transparent',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          color: activeTab === 'use' ? '#8B5A2B' : '#6b7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'all 0.2s ease'
        }}
      >
        <FaGift size={14} />
        {t('rewards.howToUse')}
      </button>
    </div>
  );

  // Content components for each tab
  const HistoryContent = () => (
    <div>
      {rewardsHistory.length > 0 && (
        <div style={{ 
          padding: '12px 20px', 
          borderBottom: '1px solid #e5e7eb', 
          background: '#fafafa', 
          display: 'flex', 
          justifyContent: 'flex-end' 
        }}>
          <button
            onClick={clearAllRewardsHistory}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <FaTrash size={10} />
            {t('rewards.clearAllHistory')}
          </button>
        </div>
      )}

      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '16px' 
      }}>
        {rewardsHistory.length === 0 ? (
          <div style={{ 
            padding: '40px 16px', 
            textAlign: 'center', 
            color: '#6b7280' 
          }}>
            <FaCoins size={28} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '15px' }}>{t('rewards.noRewardHistory')}</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>{t('rewards.completeActivities')}</p>
          </div>
        ) : (
          rewardsHistory.map((reward) => (
            <div key={reward.id} style={{ 
              paddingBottom: '12px', 
              borderBottom: '1px solid #f3f4f6', 
              marginBottom: '12px' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '4px' 
              }}>
                <div style={{ 
                  fontWeight: 500, 
                  color: '#374151', 
                  fontSize: '14px' 
                }}>
                  {reward.reason}
                </div>
                <div style={{ 
                  color: reward.points > 0 ? '#16a34a' : '#dc2626', 
                  fontWeight: '600', 
                  fontSize: '14px' 
                }}>
                  {reward.points > 0 ? '+' : ''}{reward.points}
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                fontSize: '12px', 
                color: '#6b7280' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '4px', 
                  alignItems: 'center' 
                }}>
                  <FaClock size={10} />
                  {new Date(reward.timestamp).toLocaleDateString()} at {new Date(reward.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#9ca3af', 
                  fontWeight: '500' 
                }}>
                  {t('rewards.total')}: {reward.totalPoints}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const EarnContent = () => (
    <div style={{ 
      padding: '20px',
      overflowY: 'auto',
      flex: 1
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #fff9e6, #fff0cc)', 
        padding: '16px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        border: '1px solid #ffe8a1'
      }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          color: '#8B5A2B', 
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FaCoins color="#FFD700" />
          {t('rewards.waysToEarn')}
        </h3>
        <p style={{ 
          margin: 0, 
          color: '#6b7280', 
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          {t('rewards.earnDescription')}
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ 
          margin: '0 0 12px 0', 
          color: '#374151', 
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          lineHeight: '1.4'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: '#10b981',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            color: '#fff',
            fontWeight: '600',
            marginRight: '8px',
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
          }}>
            +5
          </div>
          {t('rewards.dailyActivities')}
        </h4>
        <div style={{ 
          background: '#f8fafc', 
          padding: '12px', 
          borderRadius: '8px',
          borderLeft: '4px solid #10b981'
        }}>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '16px', 
            color: '#6b7280',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <li><strong>{t('rewards.dailyLogin')}:</strong> {t('rewards.dailyLoginDesc')}</li>
            <li><strong>{t('rewards.videoLessons')}:</strong> {t('rewards.videoLessonsDesc')}</li>
            <li><strong>{t('rewards.dailySpin')}:</strong> {t('rewards.dailySpinDesc')}</li>
          </ul>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ 
          margin: '0 0 12px 0', 
          color: '#374151', 
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          lineHeight: '1.4'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: '#3b82f6',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            color: '#fff',
            fontWeight: '600',
            marginRight: '8px',
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
          }}>
            +20
          </div>
          {t('rewards.feedbackEngagement')}
        </h4>
        <div style={{ 
          background: '#f8fafc', 
          padding: '12px', 
          borderRadius: '8px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '16px', 
            color: '#6b7280',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <li><strong>{t('rewards.submitFeedback')}:</strong> {t('rewards.submitFeedbackDesc')}</li>
          </ul>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ 
          margin: '0 0 12px 0', 
          color: '#374151', 
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          lineHeight: '1.4'
        }}>
<div style={{
  width: '36px',
  height: '36px',
  background: '#f59e0b',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '9px',
  color: '#fff',
  fontWeight: '600',
  marginRight: '8px',
  flexShrink: 0,
  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  textAlign: 'center',
  lineHeight: '1'
}}>
  {t('rewards.quiz')}
</div>
          {t('rewards.quizPerformance')}
        </h4>
        <div style={{ 
          background: '#f8fafc', 
          padding: '12px', 
          borderRadius: '8px',
          borderLeft: '4px solid #f59e0b'
        }}>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '16px', 
            color: '#6b7280',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <li><strong>{t('rewards.passingScore')}:</strong> {t('rewards.passingScoreDesc')}</li>
            <li><strong>{t('rewards.excellentScore')}:</strong> {t('rewards.excellentScoreDesc')}</li>
          </ul>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ 
          margin: '0 0 12px 0', 
          color: '#374151', 
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          lineHeight: '1.4'
        }}>
<div style={{
  width: '36px',
  height: '36px',
  background: '#8b5cf6',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '9px',
  color: '#fff',
  fontWeight: '600',
  marginRight: '8px',
  flexShrink: 0,
  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  textAlign: 'center',
  lineHeight: '1'
}}>
  {t('rewards.mock')}
</div>
          {t('rewards.mockTestPerformance')}
        </h4>
        <div style={{ 
          background: '#f8fafc', 
          padding: '12px', 
          borderRadius: '8px',
          borderLeft: '4px solid #8b5cf6'
        }}>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '16px', 
            color: '#6b7280',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <li><strong>{t('rewards.mockPassingScore')}:</strong> {t('rewards.mockPassingScoreDesc')}</li>
            <li><strong>{t('rewards.mockExcellentScore')}:</strong> {t('rewards.mockExcellentScoreDesc')}</li>
          </ul>
        </div>
      </div>

      <div style={{ 
        background: '#f0f9ff', 
        padding: '16px', 
        borderRadius: '8px',
        border: '1px solid #bae6fd',
        textAlign: 'center'
      }}>
        <p style={{ 
          margin: '0 0 8px 0', 
          color: '#0369a1', 
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {t('rewards.coinsAwarded')}
        </p>
        <p style={{ 
          margin: 0, 
          color: '#6b7280', 
          fontSize: '12px'
        }}>
          {t('rewards.practiceRegularly')}
        </p>
      </div>
    </div>
  );

  const UseContent = () => (
    <div style={{ 
      padding: '20px',
      overflowY: 'auto',
      flex: 1
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', 
        padding: '16px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        border: '1px solid #bae6fd'
      }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          color: '#0369a1', 
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FaGift color="#3b82f6" />
          {t('rewards.usingYourCoins')}
        </h3>
        <p style={{ 
          margin: 0, 
          color: '#6b7280', 
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          {t('rewards.usingCoinsDesc')}
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ 
          margin: '0 0 16px 0', 
          color: '#374151', 
          fontSize: '15px',
          paddingBottom: '8px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          {t('rewards.inAppFeatures')}
        </h4>
        
        <div style={{ 
          display: 'grid', 
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ 
            background: '#f8fafc', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>
                {t('rewards.quizHints')}
              </span>
              <span style={{ 
                background: '#dc2626', 
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {t('rewards.coinsCount', { count: 5 })}
              </span>
            </div>
            <p style={{ 
              margin: 0, 
              color: '#6b7280', 
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              {t('rewards.quizHintsDesc')}
            </p>
          </div>

          <div style={{ 
            background: '#f8fafc', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>
                {t('rewards.mockTestHints')}
              </span>
              <span style={{ 
                background: '#dc2626', 
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {t('rewards.coinsCount', { count: 5 })}
              </span>
            </div>
            <p style={{ 
              margin: 0, 
              color: '#6b7280', 
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              {t('rewards.mockTestHintsDesc')}
            </p>
          </div>

          <div style={{ 
            background: '#f8fafc', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>
                {t('rewards.skipQuestion')}
              </span>
              <span style={{ 
                background: '#f59e0b', 
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {t('rewards.coinsCount', { count: 10 })}
              </span>
            </div>
            <p style={{ 
              margin: 0, 
              color: '#6b7280', 
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              {t('rewards.skipQuestionDesc')}
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ 
          margin: '0 0 12px 0', 
          color: '#374151', 
          fontSize: '15px'
        }}>
          {t('rewards.howToUseCoins')}
        </h4>
        <div style={{ 
          background: '#f8fafc', 
          padding: '16px', 
          borderRadius: '8px',
          borderLeft: '4px solid #8b5cf6'
        }}>
          <ol style={{ 
            margin: 0, 
            paddingLeft: '16px', 
            color: '#6b7280',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <li>{t('rewards.howToUseStep1')}</li>
            <li>{t('rewards.howToUseStep2')}</li>
            <li>{t('rewards.howToUseStep3')}</li>
            <li>{t('rewards.howToUseStep4')}</li>
            <li>{t('rewards.howToUseStep5')}</li>
          </ol>
        </div>
      </div>

      <div style={{ 
        background: '#fef2f2', 
        padding: '16px', 
        borderRadius: '8px',
        border: '1px solid #fecaca'
      }}>
        <h5 style={{ 
          margin: '0 0 8px 0', 
          color: '#dc2626', 
          fontSize: '14px'
        }}>
          {t('rewards.importantNotes')}
        </h5>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '16px', 
          color: '#6b7280',
          fontSize: '13px',
          lineHeight: '1.5'
        }}>
          <li>{t('rewards.note1')}</li>
          <li>{t('rewards.note2')}</li>
          <li>{t('rewards.note3')}</li>
          <li>{t('rewards.note4')}</li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Flying Coins Animation */}
      {showFlyingCoins && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9998
        }}>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                fontSize: '20px',
                color: '#FFD700',
                zIndex: 9998,
                filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))'
              }}
              initial={{
                scale: 0,
                opacity: 1,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50
              }}
              animate={{
                scale: [0, 1, 0.8, 0],
                opacity: [1, 1, 1, 0],
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth
                ],
                y: [
                  window.innerHeight + 50,
                  window.innerHeight * 0.3,
                  -50
                ]
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
                delay: i * 0.15
              }}
            >
              <FaCoins />
            </motion.div>
          ))}
        </div>
      )}

      {/* Reward Points Display */}
      <div style={{ position: 'relative' }}>
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#744210',
            border: '2px solid #FFC107',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)',
            minWidth: '80px',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={() => {
            loadRewardsHistory();
            setRewardsHistoryOpen(true);
            setActiveTab('history');
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite linear',
            opacity: 0.5
          }} />
         
          {!isMobile && (
            <FaCoins size={16} color="#744210" style={{ position: 'relative', zIndex: 1 }} />
          )}
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            background: 'linear-gradient(45deg, #744210, #8B5A2B)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            position: 'relative',
            zIndex: 1
          }}>
            {currentRewardPoints.toLocaleString()}
          </span>
         
          {showPointsAnimation && pointsChange > 0 && (
            <motion.div
              style={{
                position: 'absolute',
                right: 0,
                top: '-20px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                zIndex: 1001
              }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              +{pointsChange}
            </motion.div>
          )}
        </motion.div>

        {/* Rewards History - Fixed Sidebar */}
        <AnimatePresence>
          {rewardsHistoryOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 9999,
                }}
                onClick={() => setRewardsHistoryOpen(false)}
              />
             
              {/* Sidebar */}
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'tween', duration: 0.3 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  height: '100vh',
                  width: isMobile ? '100vw' : '420px',
                  background: '#fff',
                  boxShadow: '-4px 0 25px rgba(0,0,0,0.2)',
                  zIndex: 10000,
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ 
                  padding: '20px', 
                  borderBottom: '1px solid #e5e7eb', 
                  background: 'linear-gradient(135deg, #fff9e6, #fff0cc)' 
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <div>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        margin: 0 
                      }}>
                        {t('rewards.rewardPointsHistory')}
                      </h3>
                      <p style={{ 
                        fontSize: '13px', 
                        color: '#6b7280', 
                        margin: '4px 0 0 0' 
                      }}>
                        <b style={{ color: "#8B5A2B" }}>
                          {t('rewards.totalPoints', { points: currentRewardPoints.toLocaleString() })}
                        </b>
                      </p>
                    </div>
                    <button 
                      onClick={() => setRewardsHistoryOpen(false)} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontSize: '16px', 
                        color: '#6b7280' 
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {/* Tab Navigation */}
                <TabNavigation />

                {/* Tab Content */}
                <div style={{ flex: 1, overflow: 'auto' }}>
                  {activeTab === 'history' ? <HistoryContent /> : null}
                  {activeTab === 'earn' ? <EarnContent /> : null}
                  {activeTab === 'use' ? <UseContent /> : null}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Shimmer Animation Style */}
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </>
  );
};

// Export the addPoints function for other components to use
export const addRewardPoints = (points, reason, source = 'system') => {
  const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
  const newPoints = currentPoints + points;
 
  localStorage.setItem('rewardPoints', newPoints.toString());
 
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
 
  window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
    detail: { rewardPoints: newPoints }
  }));
 
  return historyEntry;
};

// Export function to get current points
export const getCurrentRewardPoints = () => {
  return parseInt(localStorage.getItem('rewardPoints') || '0');
};

// Export function to trigger flying coins animation
export const triggerRewardAnimation = (points = 0, reason = "Activity completed") => {
  window.dispatchEvent(new CustomEvent('triggerFlyingCoins', {
    detail: { points, reason }
  }));
};

export default RewardPoints;