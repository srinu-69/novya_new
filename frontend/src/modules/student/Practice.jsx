// import React, { useState, useEffect } from 'react';
// import { Users, FileText, BookOpen, Star, Award } from 'lucide-react';

// const Practice = () => {
//   const [animatedStats, setAnimatedStats] = useState({
//     totalTests: 0,
//     studentsEnrolled: 0
//   });

//   useEffect(() => {
//     document.title = "Practice | NOVYA - Your Smart Learning Platform";

//     const animateValue = (start, end, duration, callback) => {
//       let startTimestamp = null;
//       const step = (timestamp) => {
//         if (!startTimestamp) startTimestamp = timestamp;
//         const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//         const current = Math.floor(progress * (end - start) + start);
//         callback(current);
//         if (progress < 1) window.requestAnimationFrame(step);
//       };
//       window.requestAnimationFrame(step);
//     };

//     animateValue(0, 2500, 2000, (val) => setAnimatedStats(prev => ({ ...prev, totalTests: val })));
//     animateValue(0, 850, 2500, (val) => setAnimatedStats(prev => ({ ...prev, studentsEnrolled: val })));
//   }, []);

//   return (
//     <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-20px); }
//         }
//         @keyframes slideInLeft {
//           from { opacity: 0; transform: translateX(-50px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes slideInRight {
//           from { opacity: 0; transform: translateX(50px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes slideInUp {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes pulse {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.05); }
//         }
//         @keyframes bounce {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-10px); }
//         }
//       `}</style>

//       {/* Hero Section */}
//       <section
//         style={{
//           background: 'linear-gradient(135deg, #FFFFFF 0%, #EEF2FF 100%)',
//           position: 'relative',
//           overflow: 'hidden',
//           paddingTop: '80px',
//           paddingBottom: '80px'
//         }}
//       >
//         <div
//           style={{
//             position: 'absolute',
//             top: '-50%',
//             right: '-20%',
//             width: '800px',
//             height: '800px',
//             background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
//             borderRadius: '50%',
//             animation: 'float 6s ease-in-out infinite'
//           }}
//         />
//         <div
//           style={{
//             position: 'absolute',
//             top: '20%',
//             left: '-10%',
//             width: '400px',
//             height: '400px',
//             background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
//             borderRadius: '50%',
//             animation: 'float 8s ease-in-out infinite reverse'
//           }}
//         />

//         <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
//           <div
//             style={{
//               display: 'flex',
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               flexWrap: 'wrap',
//               position: 'relative',
//               zIndex: 1
//             }}
//           >
            
//              <div 
//   style={{ 
//     flex: '1 1 350px', 
//     minWidth: 260,
//     paddingTop: '100px' // Adjust based on your navbar height
//   }}
// >
//   <h1 style={{ 
//     fontSize: 'clamp(2rem, 5vw, 3.5rem)',
//     fontWeight: '800',
//     color: '#1F2937',
//     marginBottom: '24px',
//     lineHeight: '1.2',
//     animation: 'slideInLeft 1s ease-out'
//   }}>
//     Master Every Subject with
//     <span style={{ 
//       background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
//       WebkitBackgroundClip: 'text',
//       WebkitTextFillColor: 'transparent',
//       display: 'block'
//     }}>
//       Smart Practice
//     </span>
//   </h1>

//               <p
//                 style={{ 
//                   fontSize: '1.125rem',
//                   color: '#6B7280',
//                   marginBottom: '40px',
//                   lineHeight: '1.8',
//                   animation: 'slideInLeft 1s ease-out 0.2s both'
//                 }}
//               >
//                 Challenge yourself with comprehensive practice modules. Built for students with
//                 instant feedback and detailed analytics.
//               </p>

//               <div style={{ 
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
//                 gap: '20px',
//                 marginTop: '40px',
//                 animation: 'slideInUp 1s ease-out 0.4s both'
//               }}>
//                 <div style={{
//                   background: '#FFFFFF',
//                   borderRadius: '16px',
//                   padding: '20px',
//                   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '12px'
//                 }}>
//                   <div style={{
//                     background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
//                     borderRadius: '12px',
//                     padding: '10px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}>
//                     <FileText size={20} color="#FFFFFF" />
//                   </div>
//                   <div>
//                     <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937' }}>
//                       {animatedStats.totalTests.toLocaleString()}+
//                     </div>
//                     <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Practice Tests</div>
//                   </div>
//                 </div>
//                 <div style={{
//                   background: '#FFFFFF',
//                   borderRadius: '16px',
//                   padding: '20px',
//                   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '12px'
//                 }}>
//                   <div style={{
//                     background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
//                     borderRadius: '12px',
//                     padding: '10px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}>
//                     <Users size={20} color="#FFFFFF" />
//                   </div>
//                   <div>
//                     <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937' }}>
//                       {animatedStats.studentsEnrolled.toLocaleString()}+
//                     </div>
//                     <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Students Learning</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div
//               style={{
//                 flex: '1 1 320px',
//                 maxWidth: 420,
//                 minWidth: 220,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 margin: '40px auto 0',
//                 animation: 'slideInRight 1s ease-out 0.3s both'
//               }}
//             >
//               <div
//                 style={{
//                   width: '100%',
//                   maxWidth: '320px',
//                   height: '240px',
//                   background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
//                   borderRadius: '24px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   position: 'relative',
//                   boxShadow: '0 20px 40px -12px rgba(79, 70, 229, 0.25)',
//                   animation: 'pulse 4s ease-in-out infinite',
//                   marginBottom: '18px'
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: '80px',
//                     color: '#FFFFFF',
//                     opacity: 0.9,
//                     animation: 'bounce 2s infinite'
//                   }}
//                 >
//                   👨‍🎓
//                 </div>
//                 <div
//                   style={{
//                     position: 'absolute',
//                     top: '20px',
//                     right: '20px',
//                     background: 'rgba(255, 255, 255, 0.2)',
//                     borderRadius: '12px',
//                     padding: '8px',
//                     animation: 'float 3s ease-in-out infinite'
//                   }}
//                 >
//                   <BookOpen size={24} color="#FFFFFF" />
//                 </div>
//                 <div
//                   style={{
//                     position: 'absolute',
//                     bottom: '20px',
//                     left: '20px',
//                     background: 'rgba(255, 255, 255, 0.2)',
//                     borderRadius: '12px',
//                     padding: '8px',
//                     animation: 'float 3s ease-in-out infinite 1s'
//                   }}
//                 >
//                   <Star size={20} color="#FFFFFF" />
//                 </div>
//                 <div
//                   style={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '15px',
//                     background: 'rgba(255, 255, 255, 0.2)',
//                     borderRadius: '50%',
//                     padding: '6px',
//                     animation: 'float 3s ease-in-out infinite 2s'
//                   }}
//                 >
//                   <Award size={18} color="#FFFFFF" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
//         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//           <div style={{ textAlign: 'center', marginBottom: '60px' }}>
//             <h2 style={{ 
//               fontSize: '2.5rem', 
//               fontWeight: '700', 
//               color: '#1F2937',
//               marginBottom: '16px',
//               animation: 'fadeIn 1s ease-out'
//             }}>
//               Why Choose NOVYA Practice?
//             </h2>
//             <p style={{ 
//               fontSize: '1.125rem', 
//               color: '#6B7280', 
//               maxWidth: '600px', 
//               margin: '0 auto',
//               animation: 'fadeIn 1s ease-out 0.2s both'
//             }}>
//               Experience a revolutionary way to practice and master your subjects
//             </p>
//           </div>

//           <div style={{ 
//             display: 'grid', 
//             gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
//             gap: '30px',
//             marginTop: '40px'
//           }}>
//             {[
//               {
//                 icon: '🎯',
//                 title: 'Personalized Learning',
//                 description: 'AI-powered recommendations based on your performance and learning style',
//                 delay: '0s'
//               },
//               {
//                 icon: '⚡',
//                 title: 'Instant Feedback',
//                 description: 'Get real-time explanations and corrections to improve faster',
//                 delay: '0.1s'
//               },
//               {
//                 icon: '📊',
//                 title: 'Progress Analytics',
//                 description: 'Track your improvement with detailed insights and performance metrics',
//                 delay: '0.2s'
//               },
//               {
//                 icon: '🏆',
//                 title: 'Gamified Experience',
//                 description: 'Earn badges, climb leaderboards, and compete with peers',
//                 delay: '0.3s'
//               },
//               {
//                 icon: '📚',
//                 title: 'Vast Question Bank',
//                 description: 'Access thousands of curated questions across all subjects',
//                 delay: '0.4s'
//               },
//               {
//                 icon: '🎓',
//                 title: 'Expert Crafted',
//                 description: 'Content designed by subject matter experts and educators',
//                 delay: '0.5s'
//               }
//             ].map((feature, index) => (
//               <div
//                 key={index}
//                 style={{
//                   background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
//                   borderRadius: '20px',
//                   padding: '32px',
//                   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//                   transition: 'all 0.3s ease',
//                   cursor: 'pointer',
//                   animation: `slideInUp 0.6s ease-out ${feature.delay} both`,
//                   border: '1px solid #E5E7EB'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = 'translateY(-8px)';
//                   e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = 'translateY(0)';
//                   e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
//                 }}
//               >
//                 <div style={{
//                   fontSize: '48px',
//                   marginBottom: '16px',
//                   animation: 'bounce 2s infinite'
//                 }}>
//                   {feature.icon}
//                 </div>
//                 <h3 style={{
//                   fontSize: '1.25rem',
//                   fontWeight: '600',
//                   color: '#1F2937',
//                   marginBottom: '12px'
//                 }}>
//                   {feature.title}
//                 </h3>
//                 <p style={{
//                   fontSize: '0.95rem',
//                   color: '#6B7280',
//                   lineHeight: '1.6'
//                 }}>
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Subject Categories */}
//       <section style={{ 
//         padding: '80px 20px', 
//         background: 'linear-gradient(180deg, #F3F4F6 0%, #FFFFFF 100%)' 
//       }}>
//         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//           <div style={{ textAlign: 'center', marginBottom: '60px' }}>
//             <h2 style={{ 
//               fontSize: '2.5rem', 
//               fontWeight: '700', 
//               color: '#1F2937',
//               marginBottom: '16px'
//             }}>
//               Explore Practice Categories
//             </h2>
//             <p style={{ fontSize: '1.125rem', color: '#6B7280' }}>
//               Choose from our comprehensive collection of subjects
//             </p>
//           </div>

//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
//             gap: '24px',
//             maxWidth: '900px',
//             margin: '0 auto'
//           }}>
//             {[
//               { name: 'English', icon: '📖', color: '#F59E0B', tests: 420 },
//               { name: 'Telugu', icon: '🔤', color: '#EC4899', tests: 380 },
//               { name: 'Mathematics', icon: '🔢', color: '#3B82F6', tests: 450 },
//               { name: 'Social', icon: '🌏', color: '#8B5CF6', tests: 340 },
//               { name: 'Science', icon: '🔬', color: '#10B981', tests: 390 },
//               { name: 'Computers', icon: '💻', color: '#6366F1', tests: 310 }
//             ].map((subject, index) => (
//               <div
//                 key={index}
//                 style={{
//                   background: '#FFFFFF',
//                   borderRadius: '16px',
//                   padding: '28px',
//                   textAlign: 'center',
//                   boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
//                   transition: 'all 0.3s ease',
//                   cursor: 'pointer',
//                   animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
//                   border: '2px solid transparent'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = 'scale(1.05)';
//                   e.currentTarget.style.borderColor = subject.color;
//                   e.currentTarget.style.boxShadow = `0 8px 24px ${subject.color}40`;
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = 'scale(1)';
//                   e.currentTarget.style.borderColor = 'transparent';
//                   e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
//                 }}
//               >
//                 <div style={{ 
//                   fontSize: '56px', 
//                   marginBottom: '12px',
//                   animation: 'float 3s ease-in-out infinite'
//                 }}>
//                   {subject.icon}
//                 </div>
//                 <h3 style={{
//                   fontSize: '1.25rem',
//                   fontWeight: '600',
//                   color: '#1F2937',
//                   marginBottom: '8px'
//                 }}>
//                   {subject.name}
//                 </h3>
//                 <p style={{ fontSize: '0.875rem', color: subject.color, fontWeight: '500' }}>
//                   {subject.tests} Practice Tests
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
//         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//           <div style={{ textAlign: 'center', marginBottom: '60px' }}>
//             <h2 style={{ 
//               fontSize: '2.5rem', 
//               fontWeight: '700', 
//               color: '#1F2937',
//               marginBottom: '16px'
//             }}>
//               How It Works
//             </h2>
//             <p style={{ fontSize: '1.125rem', color: '#6B7280' }}>
//               Get started in just three simple steps
//             </p>
//           </div>

//           <div style={{ 
//             display: 'flex', 
//             flexDirection: 'column', 
//             gap: '40px',
//             maxWidth: '900px',
//             margin: '0 auto'
//           }}>
//             {[
//               {
//                 step: '01',
//                 title: 'Choose Your Subject',
//                 description: 'Select from our wide range of subjects and difficulty levels',
//                 icon: '📚',
//                 color: '#3B82F6'
//               },
//               {
//                 step: '02',
//                 title: 'Start Practicing',
//                 description: 'Answer questions with real-time feedback and detailed explanations',
//                 icon: '✍️',
//                 color: '#10B981'
//               },
//               {
//                 step: '03',
//                 title: 'Track Progress',
//                 description: 'Monitor your improvement with comprehensive analytics and insights',
//                 icon: '📈',
//                 color: '#F59E0B'
//               }
//             ].map((item, index) => (
//               <div
//                 key={index}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '30px',
//                   animation: `slideInLeft 0.6s ease-out ${index * 0.2}s both`,
//                   flexWrap: 'wrap'
//                 }}
//               >
//                 <div style={{
//                   minWidth: '80px',
//                   height: '80px',
//                   borderRadius: '50%',
//                   background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontSize: '36px',
//                   boxShadow: `0 8px 16px ${item.color}40`,
//                   animation: 'pulse 2s ease-in-out infinite'
//                 }}>
//                   {item.icon}
//                 </div>
//                 <div style={{ flex: 1, minWidth: '250px' }}>
//                   <div style={{
//                     fontSize: '3rem',
//                     fontWeight: '700',
//                     color: '#E5E7EB',
//                     marginBottom: '-10px'
//                   }}>
//                     {item.step}
//                   </div>
//                   <h3 style={{
//                     fontSize: '1.5rem',
//                     fontWeight: '600',
//                     color: '#1F2937',
//                     marginBottom: '8px'
//                   }}>
//                     {item.title}
//                   </h3>
//                   <p style={{ fontSize: '1rem', color: '#6B7280', lineHeight: '1.6' }}>
//                     {item.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section style={{
//         padding: '80px 20px',
//         background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
//         position: 'relative',
//         overflow: 'hidden'
//       }}>
//         <div style={{
//           position: 'absolute',
//           top: '-100px',
//           right: '-100px',
//           width: '300px',
//           height: '300px',
//           background: 'rgba(255, 255, 255, 0.1)',
//           borderRadius: '50%',
//           animation: 'float 8s ease-in-out infinite'
//         }} />
//         <div style={{
//           position: 'absolute',
//           bottom: '-50px',
//           left: '-50px',
//           width: '200px',
//           height: '200px',
//           background: 'rgba(255, 255, 255, 0.1)',
//           borderRadius: '50%',
//           animation: 'float 6s ease-in-out infinite reverse'
//         }} />
        
//         <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
//           <h2 style={{
//             fontSize: '2.5rem',
//             fontWeight: '700',
//             color: '#FFFFFF',
//             marginBottom: '20px',
//             animation: 'fadeIn 1s ease-out'
//           }}>
//             Ready to Excel in Your Studies?
//           </h2>
//           <p style={{
//             fontSize: '1.25rem',
//             color: 'rgba(255, 255, 255, 0.9)',
//             marginBottom: '40px',
//             animation: 'fadeIn 1s ease-out 0.2s both'
//           }}>
//             Join thousands of students who are already improving their grades with NOVYA
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Practice;






import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, FileText, BookOpen, Star, Award } from 'lucide-react';

const Practice = () => {
  const { t } = useTranslation();
  const [animatedStats, setAnimatedStats] = useState({
    totalTests: 0,
    studentsEnrolled: 0
  });

  useEffect(() => {
    document.title = "Practice | NOVYA - Your Smart Learning Platform";

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
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #EEF2FF 100%)',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '80px',
          paddingBottom: '80px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
          }}
        />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 1
            }}
          >
            <div 
              style={{ 
                flex: '1 1 350px', 
                minWidth: 260,
                paddingTop: '100px'
              }}
            >
              <h1 style={{ 
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: '800',
                color: '#1F2937',
                marginBottom: '24px',
                lineHeight: '1.2',
                animation: 'slideInLeft 1s ease-out'
              }}>
                {t('masterSubject')}
                <span style={{ 
                  background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'block'
                }}>
                  {t('smartPractice')}
                </span>
              </h1>

              <p
                style={{ 
                  fontSize: '1.125rem',
                  color: '#6B7280',
                  marginBottom: '40px',
                  lineHeight: '1.8',
                  animation: 'slideInLeft 1s ease-out 0.2s both'
                }}
              >
                {t('challengeDescription')}
              </p>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '20px',
                marginTop: '40px',
                animation: 'slideInUp 1s ease-out 0.4s both'
              }}>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                    borderRadius: '12px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={20} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937' }}>
                      {animatedStats.totalTests.toLocaleString()}+
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>{t('practiceTests')}</div>
                  </div>
                </div>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    borderRadius: '12px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Users size={20} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937' }}>
                      {animatedStats.studentsEnrolled.toLocaleString()}+
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>{t('studentsLearning')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                flex: '1 1 320px',
                maxWidth: 420,
                minWidth: 220,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '40px auto 0',
                animation: 'slideInRight 1s ease-out 0.3s both'
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '320px',
                  height: '240px',
                  background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 20px 40px -12px rgba(79, 70, 229, 0.25)',
                  animation: 'pulse 4s ease-in-out infinite',
                  marginBottom: '18px'
                }}
              >
                <div
                  style={{
                    fontSize: '80px',
                    color: '#FFFFFF',
                    opacity: 0.9,
                    animation: 'bounce 2s infinite'
                  }}
                >
                  👨‍🎓
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '8px',
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  <BookOpen size={24} color="#FFFFFF" />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '8px',
                    animation: 'float 3s ease-in-out infinite 1s'
                  }}
                >
                  <Star size={20} color="#FFFFFF" />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '15px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    padding: '6px',
                    animation: 'float 3s ease-in-out infinite 2s'
                  }}
                >
                  <Award size={18} color="#FFFFFF" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#1F2937',
              marginBottom: '16px',
              animation: 'fadeIn 1s ease-out'
            }}>
              {t('whyChoose')}
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#6B7280', 
              maxWidth: '600px', 
              margin: '0 auto',
              animation: 'fadeIn 1s ease-out 0.2s both'
            }}>
              {t('revolutionaryExperience')}
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '30px',
            marginTop: '40px'
          }}>
            {[
              {
                icon: '🎯',
                title: 'personalizedLearning',
                description: 'personalizedLearning',
                delay: '0s'
              },
              {
                icon: '⚡',
                title: 'instantFeedback',
                description: 'instantFeedback',
                delay: '0.1s'
              },
              {
                icon: '📊',
                title: 'progressAnalytics',
                description: 'progressAnalytics',
                delay: '0.2s'
              },
              {
                icon: '🏆',
                title: 'gamifiedExperience',
                description: 'gamifiedExperience',
                delay: '0.3s'
              },
              {
                icon: '📚',
                title: 'vastQuestionBank',
                description: 'vastQuestionBank',
                delay: '0.4s'
              },
              {
                icon: '🎓',
                title: 'expertCrafted',
                description: 'expertCrafted',
                delay: '0.5s'
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  animation: `slideInUp 0.6s ease-out ${feature.delay} both`,
                  border: '1px solid #E5E7EB'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  animation: 'bounce 2s infinite'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '12px'
                }}>
                  {t(`features.${feature.title}`)}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#6B7280',
                  lineHeight: '1.6'
                }}>
                  {t(`featureDescriptions.${feature.description}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Categories */}
      <section style={{ 
        padding: '80px 20px', 
        background: 'linear-gradient(180deg, #F3F4F6 0%, #FFFFFF 100%)' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#1F2937',
              marginBottom: '16px'
            }}>
              {t('exploreCategories')}
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6B7280' }}>
              {t('chooseSubjects')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            maxWidth: '900px',
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
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '28px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                  border: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = subject.color;
                  e.currentTarget.style.boxShadow = `0 8px 24px ${subject.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div style={{ 
                  fontSize: '56px', 
                  marginBottom: '12px',
                  animation: 'float 3s ease-in-out infinite'
                }}>
                  {subject.icon}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '8px'
                }}>
                  {t(`subjects.${subject.name}`)}
                </h3>
                <p style={{ fontSize: '0.875rem', color: subject.color, fontWeight: '500' }}>
                  {subject.tests} {t('practiceTestsCount')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#1F2937',
              marginBottom: '16px'
            }}>
              {t('howItWorks')}
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6B7280' }}>
              {t('getStarted')}
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '40px',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {[
              {
                step: '01',
                title: 'chooseSubject',
                description: 'chooseSubject',
                icon: '📚',
                color: '#3B82F6'
              },
              {
                step: '02',
                title: 'startPracticing',
                description: 'startPracticing',
                icon: '✍️',
                color: '#10B981'
              },
              {
                step: '03',
                title: 'trackProgress',
                description: 'trackProgress',
                icon: '📈',
                color: '#F59E0B'
              }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '30px',
                  animation: `slideInLeft 0.6s ease-out ${index * 0.2}s both`,
                  flexWrap: 'wrap'
                }}
              >
                <div style={{
                  minWidth: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  boxShadow: `0 8px 16px ${item.color}40`,
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: '700',
                    color: '#E5E7EB',
                    marginBottom: '-10px'
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '8px'
                  }}>
                    {t(`steps.${item.title}`)}
                  </h3>
                  <p style={{ fontSize: '1rem', color: '#6B7280', lineHeight: '1.6' }}>
                    {t(`stepDescriptions.${item.description}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite reverse'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '20px',
            animation: 'fadeIn 1s ease-out'
          }}>
            {t('readyToExcel')}
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '40px',
            animation: 'fadeIn 1s ease-out 0.2s both'
          }}>
            {t('joinStudents')}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Practice;
