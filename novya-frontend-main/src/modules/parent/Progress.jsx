import {
  Calculator,
  Atom,
  BookOpen,
  AlertTriangle,
  Globe,
  Languages,
  Code,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  BarChart3,
  User,
  Clock,
  CheckCircle2
} from 'lucide-react';
 
// const Progress = () => {
//   const weeklyData = [
//     { day: 'Mon', activity: 85, hours: 4.2 },
//     { day: 'Tue', activity: 72, hours: 3.5 },
//     { day: 'Wed', activity: 93, hours: 5.1 },
//     { day: 'Thu', activity: 88, hours: 4.7 },
//     { day: 'Fri', activity: 76, hours: 3.8 },
//     { day: 'Sat', activity: 95, hours: 5.5 },
//     { day: 'Sun', activity: 82, hours: 4.1 },
//   ];
 
//   const subjects = [
//     { name: 'Mathematics', icon: Calculator, score: 82, trend: 'up', change: '+5%' },
//     { name: 'Science', icon: Atom, score: 90, trend: 'up', change: '+8%' },
//     { name: 'English', icon: BookOpen, score: 86, trend: 'up', change: '+3%' },
//     { name: 'Social Studies', icon: Globe, score: 72, trend: 'down', change: '-4%' },
    
//     { name: 'Computer Science', icon: Code, score: 96, trend: 'up', change: '+12%' }
//   ];
 
//   const stats = [
//     { title: 'Overall Score', value: '84%', icon: Award, color: '#667eea' },
//     { title: 'Study Hours', value: '28.9h', icon: Clock, color: '#f093fb' },
//     { title: 'Tasks Completed', value: '21/25', icon: CheckCircle2, color: '#4facfe' },
//   ];
 
//   return (
//     <>
//       <link
//         href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
//         rel="stylesheet"
//       />
 
//       <div
//         style={{
//           minHeight: '100vh',
//           background: ' #e9eaf0ff ',
//           fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
//         }}
//       >
//         <div className="container-fluid p-4">
//           <div className="d-flex justify-content-between align-items-center text-white mb-4">
//             <h1 className="display-6 fw-bold mb-0 text-dark">Progress Dashboard</h1>
           
//           </div>
 
//           <div className="row g-4 mb-4">
//             {stats.map((stat, index) => {
//               const IconComponent = stat.icon;
//               return (
//                 <div key={index} className="col-12 col-md-4">
//                   <div
//                     className="card border-0 h-100"
//                     style={{
//                       background: 'rgba(255, 255, 255, 0.95)',
//                       backdropFilter: 'blur(20px)',
//                       borderRadius: '20px',
//                       boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
//                     }}
//                   >
//                     <div className="card-body p-4">
//                       <div className="d-flex align-items-center justify-content-between">
//                         <div>
//                           <p className="text-muted small mb-1 fw-medium">{stat.title}</p>
//                           <h2 className="fw-bold mb-0" style={{ color: stat.color }}>{stat.value}</h2>
//                         </div>
//                         <div
//                           className="p-3 rounded-circle"
//                           style={{ backgroundColor: stat.color + '20' }}
//                         >
//                           <IconComponent size={24} style={{ color: stat.color }} />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
 
//           <div className="row g-4">
//             <div className="col-12 col-lg-8">
//               <div
//                 className="card border-0 h-100"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.95)',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: '20px',
//                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
//                 }}
//               >
//                 <div className="card-body p-4">
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     <div>
//                       <h5 className="fw-bold mb-1">Weekly Activity</h5>
//                       <p className="text-muted small mb-0">Your child's study time this week</p>
//                     </div>
//                     <BarChart3 className="text-muted" size={24} />
//                   </div>
//                   <div className="row g-3">
//                     {weeklyData.map((day, index) => (
//                       <div key={index} className="col">
//                         <div className="text-center">
//                         <div
//   style={{
//     height: 120,
//     width: 24,
//     display: "flex",
//     flexDirection: "column-reverse",
//     alignItems: "center",
//     margin: "0 auto",
//     position: "relative"
//   }}
// >
//   {/* Bar Track */}
//   <div
//     style={{
//       position: "absolute",
//       top: 0,
//       left: "50%",
//       transform: "translateX(-50%)",
//       width: 12,
//       height: "100%",
//       background: "#e5e7eb",
//       borderRadius: 8,
//       zIndex: 0
//     }}
//   />
//   {/* Bar Fill */}
//   <div
//     style={{
//       width: 12,
//       height: `${day.activity}%`,
//       background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
//       borderRadius: 8,
//       zIndex: 1,
//       boxShadow: "0 2px 8px rgba(102,126,234,0.15)"
//     }}
//   />
// </div>
//                           <div className="small fw-medium text-dark">{day.day}</div>
//                           <div className="small text-muted">{day.hours}h</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
 
//             <div className="col-12 col-lg-4">
//               <div
//                 className="card border-0 h-100"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.95)',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: '20px',
//                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
//                 }}
//               >
//                 <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center text-center">
//                   <div className="position-relative mb-4">
//                     <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
//                       <circle
//                         cx="70"
//                         cy="70"
//                         r="60"
//                         stroke="#e9ecef"
//                         strokeWidth="8"
//                         fill="transparent"
//                       />
//                       <circle
//                         cx="70"
//                         cy="70"
//                         r="60"
//                         stroke="url(#gradient)"
//                         strokeWidth="8"
//                         fill="transparent"
//                         strokeDasharray="377"
//                         strokeDashoffset="75"
//                         strokeLinecap="round"
//                         style={{ transition: 'stroke-dashoffset 2s ease-out' }}
//                       />
//                       <defs>
//                         <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                           <stop offset="0%" stopColor="#667eea" />
//                           <stop offset="100%" stopColor="#764ba2" />
//                         </linearGradient>
//                       </defs>
//                     </svg>
//                     <div className="position-absolute top-50 start-50 translate-middle text-center">
//                       <div className="display-6 fw-bold text-dark">84%</div>
//                       <div className="small text-muted">Complete</div>
//                     </div>
//                   </div>
//                   <h6 className="fw-bold mb-2">This Week's Goal</h6>
//                   <p className="text-muted small mb-0">16% more to reach the target!</p>
//                 </div>
//               </div>
//             </div>
//           </div>
 
//           {/* Subject Cards - WHITE BG + ORANGE GRADIENT BORDER */}
//           <div className="row mt-4">
//             <div className="col-12">
//               <div
//                 className="card border-0"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.95)',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: '20px',
//                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
//                 }}
//               >
//                 <div className="card-body p-4">
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     <div>
//                       <h5 className="fw-bold mb-1">Subject Performance</h5>
//                       <p className="text-muted small mb-0">Track your child's progress across subjects</p>
//                     </div>
//                     <User className="text-muted" size={24} />
//                   </div>
//                   <div className="row g-4">
//                     {subjects.map((subject, index) => {
//                       const IconComponent = subject.icon;
//                       return (
//                         <div key={index} className="col-12 col-md-6 col-lg-4">
//                           <div
//                             className="p-4 rounded-4 h-100 position-relative overflow-hidden"
//                             style={{
//     background: '#fff',
//     color: '#313131',
//     borderRadius: '999px', // pill/ellipse shape!
//     border: '3px solid #f4a468',
//     borderImage: 'linear-gradient(135deg, #f4a468 0%, #fee140 100%) 1',
//     boxShadow: '0 6px 20px rgba(244,164,104,0.06)',
//     transition: 'transform 0.3s, box-shadow 0.3s'
//   }}
//                             onMouseEnter={(e) => {
//                               e.currentTarget.style.transform = 'translateY(-5px)';
//                               e.currentTarget.style.boxShadow = '0 24px 56px rgba(244,164,104,0.16)';
//                             }}
//                             onMouseLeave={(e) => {
//                               e.currentTarget.style.transform = 'translateY(0)';
//                               e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,164,104,0.06)';
//                             }}
//                           >
//                             <div className="d-flex align-items-center justify-content-between mb-3">
//                               <IconComponent size={28} style={{ color: '#f4a468' }} />
//                               <div className="d-flex align-items-center">
//                                 {subject.trend === 'up' ? (
//                                   <TrendingUp size={16} className="me-1" color="#28a745" />
//                                 ) : (
//                                   <TrendingDown size={16} className="me-1" color="#dc3545" />
//                                 )}
//                                 <span className="small">{subject.change}</span>
//                               </div>
//                             </div>
//                             <h6 className="fw-semibold mb-2">{subject.name}</h6>
//                             <div className="d-flex align-items-end justify-content-between">
//                               <div>
//                                 <div className="display-6 fw-bold">{subject.score}%</div>
//                                 <div className="small opacity-75">Current Score</div>
//                               </div>
//                             </div>
//                             <div
//                               className="position-absolute"
//                               style={{
//                                 bottom: '-20px',
//                                 right: '-20px',
//                                 width: '80px',
//                                 height: '80px',
//                                 background: 'rgba(244,164,104,0.10)',
//                                 borderRadius: '50%'
//                               }}
//                             />
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
 
//           <div className="row mt-4">
//             <div className="col-12">
//               <div
//                 className="alert border-0 d-flex align-items-center p-4"
//                 style={{
//                   background: 'white',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: '20px',
//                   border: '1px solid rgba(255, 193, 7, 0.2)'
//                 }}
//               >
//                 <div
//                   className="p-3 rounded-circle me-3"
//                   style={{ backgroundColor: 'rgba(255, 193, 7, 0.2)' }}
//                 >
//                   <AlertTriangle size={24} style={{ color: '#f57c00' }} />
//                 </div>
//                 <div className="flex-grow-1" >
//                   <h6 className="fw-bold mb-2" style={{ color: '#f57c00' }}>Social Studies Needs Attention</h6>
//                   <p className="mb-3 text-dark opacity-75">
//                     Your child's performance has dropped by 4%. Consider reviewing recent topics and completing practice exercises.
//                   </p>
                 
//                 </div>
//               </div>
//             </div>
//           </div>
 
//         </div>
//       </div>
//     </>
//   );
// };
 
// export default Progress;
 
 


// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   Calculator,
//   Atom,
//   BookOpen,
//   AlertTriangle,
//   Globe,
//   Code,
//   TrendingUp,
//   TrendingDown,
//   Clock,
//   Award,
//   CheckCircle2,
//   BarChart3,
//   User
// } from 'lucide-react';

// const Progress = () => {
//   const { t } = useTranslation();

//   const weeklyData = [
//     { day: 'Mon', activity: 85, hours: 4.2 },
//     { day: 'Tue', activity: 72, hours: 3.5 },
//     { day: 'Wed', activity: 93, hours: 5.1 },
//     { day: 'Thu', activity: 88, hours: 4.7 },
//     { day: 'Fri', activity: 76, hours: 3.8 },
//     { day: 'Sat', activity: 95, hours: 5.5 },
//     { day: 'Sun', activity: 82, hours: 4.1 },
//   ];

//   const subjects = [
//     { name: t('Mathematics'), icon: Calculator, score: 82, trend: 'up', change: '+5%' },
//     { name: t('Science'), icon: Atom, score: 90, trend: 'up', change: '+8%' },
//     { name: t('English'), icon: BookOpen, score: 86, trend: 'up', change: '+3%' },
//     { name: t('Social Studies'), icon: Globe, score: 72, trend: 'down', change: '-4%' },
//     { name: t('Computer Science'), icon: Code, score: 96, trend: 'up', change: '+12%' }
//   ];

//   const stats = [
//     { title: t('overallScore'), value: '84%', icon: Award, color: '#667eea' },
//     { title: t('studyHours'), value: '28.9h', icon: Clock, color: '#f093fb' },
//     { title: t('tasksCompleted'), value: '21/25', icon: CheckCircle2, color: '#4facfe' },
//   ];

//   return (
//     <>
//       <link
//         href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
//         rel="stylesheet"
//       />

//       <div
//         style={{
//           minHeight: '100vh',
//           background: '#e9eaf0ff',
//           fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
//         }}
//       >
//         <div className="container-fluid p-4">
//           {/* Header */}
//           <div className="d-flex justify-content-between align-items-center text-white mb-4">
//             <h1 className="display-6 fw-bold mb-0 text-dark">{t('progressDashboard')}</h1>
//           </div>

//           {/* Stats Cards */}
//           <div className="row g-4 mb-4">
//             {stats.map((stat, index) => {
//               const IconComponent = stat.icon;
//               return (
//                 <div key={index} className="col-12 col-md-4">
//                   <div
//                     className="card border-0 h-100"
//                     style={{
//                       background: 'rgba(255, 255, 255, 0.95)',
//                       backdropFilter: 'blur(20px)',
//                       borderRadius: '20px',
//                       boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
//                     }}
//                   >
//                     <div className="card-body p-4">
//                       <div className="d-flex align-items-center justify-content-between">
//                         <div>
//                           <p className="text-muted small mb-1 fw-medium">{stat.title}</p>
//                           <h2 className="fw-bold mb-0" style={{ color: stat.color }}>{stat.value}</h2>
//                         </div>
//                         <div
//                           className="p-3 rounded-circle"
//                           style={{ backgroundColor: stat.color + '20' }}
//                         >
//                           <IconComponent size={24} style={{ color: stat.color }} />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Weekly Activity */}
//           <div className="row g-4">
//             <div className="col-12 col-lg-8">
//               <div
//                 className="card border-0 h-100"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.95)',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: '20px',
//                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
//                 }}
//               >
//                 <div className="card-body p-4">
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     <div>
//                       <h5 className="fw-bold mb-1">{t('weeklyActivity')}</h5>
//                       <p className="text-muted small mb-0">{t('weeklyActivityDesc')}</p>
//                     </div>
//                     <BarChart3 className="text-muted" size={24} />
//                   </div>
//                   <div className="row g-3">
//                     {weeklyData.map((day, index) => (
//                       <div key={index} className="col">
//                         <div className="text-center">
//                           <div
//                             style={{
//                               height: 120,
//                               width: 24,
//                               display: "flex",
//                               flexDirection: "column-reverse",
//                               alignItems: "center",
//                               margin: "0 auto",
//                               position: "relative"
//                             }}
//                           >
//                             <div
//                               style={{
//                                 position: "absolute",
//                                 top: 0,
//                                 left: "50%",
//                                 transform: "translateX(-50%)",
//                                 width: 12,
//                                 height: "100%",
//                                 background: "#e5e7eb",
//                                 borderRadius: 8,
//                                 zIndex: 0
//                               }}
//                             />
//                             <div
//                               style={{
//                                 width: 12,
//                                 height: `${day.activity}%`,
//                                 background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
//                                 borderRadius: 8,
//                                 zIndex: 1,
//                                 boxShadow: "0 2px 8px rgba(102,126,234,0.15)"
//                               }}
//                             />
//                           </div>
//                           <div className="small fw-medium text-dark">{day.day}</div>
//                           <div className="small text-muted">{day.hours}h</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* This Week's Goal */}
//             <div className="col-12 col-lg-4">
//               <div
//                 className="card border-0 h-100"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.95)',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: '20px',
//                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
//                 }}
//               >
//                 <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center text-center">
//                   <div className="position-relative mb-4">
//                     <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
//                       <circle cx="70" cy="70" r="60" stroke="#e9ecef" strokeWidth="8" fill="transparent"/>
//                       <circle
//                         cx="70"
//                         cy="70"
//                         r="60"
//                         stroke="url(#gradient)"
//                         strokeWidth="8"
//                         fill="transparent"
//                         strokeDasharray="377"
//                         strokeDashoffset="75"
//                         strokeLinecap="round"
//                         style={{ transition: 'stroke-dashoffset 2s ease-out' }}
//                       />
//                       <defs>
//                         <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                           <stop offset="0%" stopColor="#667eea"/>
//                           <stop offset="100%" stopColor="#764ba2"/>
//                         </linearGradient>
//                       </defs>
//                     </svg>
//                     <div className="position-absolute top-50 start-50 translate-middle text-center">
//                       <div className="display-6 fw-bold text-dark">84%</div>
//                       <div className="small text-muted">{t('goalDesc')}</div>
//                     </div>
//                   </div>
//                   <h6 className="fw-bold mb-2">{t('thisWeekGoal')}</h6>
//                   <p className="text-muted small mb-0">{t('goalDesc')}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Subject Performance */}
//           <div className="row mt-4">
//             <div className="col-12">
//               <div
//                 className="card border-0"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.95)',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: '20px',
//                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
//                 }}
//               >
//                 <div className="card-body p-4">
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     <div>
//                       <h5 className="fw-bold mb-1">{t('subjectPerformance')}</h5>
//                       <p className="text-muted small mb-0">{t('subjectDesc')}</p>
//                     </div>
//                     <User className="text-muted" size={24}/>
//                   </div>
//                   <div className="row g-4">
//                     {subjects.map((subject, index) => {
//                       const IconComponent = subject.icon;
//                       return (
//                         <div key={index} className="col-12 col-md-6 col-lg-4">
//                           <div
//                             className="p-4 rounded-4 h-100 position-relative overflow-hidden"
//                             style={{
//                               background: '#fff',
//                               color: '#313131',
//                               borderRadius: '999px',
//                               border: '3px solid #f4a468',
//                               borderImage: 'linear-gradient(135deg, #f4a468 0%, #fee140 100%) 1',
//                               boxShadow: '0 6px 20px rgba(244,164,104,0.06)',
//                               transition: 'transform 0.3s, box-shadow 0.3s'
//                             }}
//                             onMouseEnter={(e) => {
//                               e.currentTarget.style.transform = 'translateY(-5px)';
//                               e.currentTarget.style.boxShadow = '0 24px 56px rgba(244,164,104,0.16)';
//                             }}
//                             onMouseLeave={(e) => {
//                               e.currentTarget.style.transform = 'translateY(0)';
//                               e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,164,104,0.06)';
//                             }}
//                           >
//                             <div className="d-flex align-items-center justify-content-between mb-3">
//                               <IconComponent size={28} style={{ color: '#f4a468' }} />
//                               <div className="d-flex align-items-center">
//                                 {subject.trend === 'up' ? (
//                                   <TrendingUp size={16} className="me-1" color="#28a745"/>
//                                 ) : (
//                                   <TrendingDown size={16} className="me-1" color="#dc3545"/>
//                                 )}
//                                 <span className="small">{subject.change}</span>
//                               </div>
//                             </div>
//                             <h6 className="fw-semibold mb-2">{subject.name}</h6>
//                             <div className="d-flex align-items-end justify-content-between">
//                               <div>
//                                 <div className="display-6 fw-bold">{subject.score}%</div>
//                                 <div className="small opacity-75">{t('currentScore')}</div>
//                               </div>
//                             </div>
//                             <div
//                               className="position-absolute"
//                               style={{
//                                 bottom: '-20px',
//                                 right: '-20px',
//                                 width: '80px',
//                                 height: '80px',
//                                 background: 'rgba(244,164,104,0.10)',
//                                 borderRadius: '50%'
//                               }}
//                             />
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Alert */}
//           <div className="row mt-4">
//             <div className="col-12">
//               <div
//                 className="alert border-0 d-flex align-items-center p-4"
//                 style={{
//                   background: 'white',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: '20px',
//                   border: '1px solid rgba(255, 193, 7, 0.2)'
//                 }}
//               >
//                 <div
//                   className="p-3 rounded-circle me-3"
//                   style={{ backgroundColor: 'rgba(255, 193, 7, 0.2)' }}
//                 >
//                   <AlertTriangle size={24} style={{ color: '#f57c00' }} />
//                 </div>
//                 <div className="flex-grow-1">
//                   <h6 className="fw-bold mb-2" style={{ color: '#f57c00' }}>{t('socialStudiesAlertTitle')}</h6>
//                   <p className="mb-3 text-dark opacity-75">{t('socialStudiesAlertDesc')}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default Progress;












// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   Calculator,
//   Atom,
//   BookOpen,
//   AlertTriangle,
//   Globe,
//   Code,
//   TrendingUp,
//   TrendingDown,
//   Clock,
//   Award,
//   CheckCircle2,
//   BarChart3,
//   User
// } from 'lucide-react';

// const Progress = () => {
//   const { t } = useTranslation();

//   const weeklyData = [
//     { day: 'Mon', activity: 85, hours: 4.2 },
//     { day: 'Tue', activity: 72, hours: 3.5 },
//     { day: 'Wed', activity: 93, hours: 5.1 },
//     { day: 'Thu', activity: 88, hours: 4.7 },
//     { day: 'Fri', activity: 76, hours: 3.8 },
//     { day: 'Sat', activity: 95, hours: 5.5 },
//     { day: 'Sun', activity: 82, hours: 4.1 },
//   ];

//   const subjects = [
//     { name: t('Mathematics'), icon: Calculator, score: 82, trend: 'up', change: '+5%' },
//     { name: t('Science'), icon: Atom, score: 90, trend: 'up', change: '+8%' },
//     { name: t('English'), icon: BookOpen, score: 86, trend: 'up', change: '+3%' },
//     { name: t('Social Studies'), icon: Globe, score: 72, trend: 'down', change: '-4%' },
//     { name: t('Computer Science'), icon: Code, score: 96, trend: 'up', change: '+12%' }
//   ];

//   const stats = [
//     { title: t('overallScore'), value: '84%', icon: Award, color: '#667eea' },
//     { title: t('studyHours'), value: '28.9h', icon: Clock, color: '#f093fb' },
//     { title: t('tasksCompleted'), value: '21/25', icon: CheckCircle2, color: '#4facfe' },
//   ];

//   return (
//     <>
//       <link
//         href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
//         rel="stylesheet"
//       />

//       <div
//         style={{
//           minHeight: '100vh',
//           background: '#e9eaf0ff',
//           fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
//         }}
//       >
//         <div className="container-fluid p-4">
//           {/* Header */}
//           <div className="d-flex justify-content-between align-items-center text-white mb-4">
//             <h1 className="display-6 fw-bold mb-0 text-dark">{t('progressDashboard')}</h1>
//           </div>

//           {/* Stats Cards */}
//           <div className="row g-4 mb-4">
//             {stats.map((stat, index) => {
//               const IconComponent = stat.icon;
//               return (
//                 <div key={index} className="col-12 col-md-4">
//                   <div
//                     className="card border-0 h-100"
//                     style={{
//                       background: 'rgba(255, 255, 255, 0.95)',
//                       backdropFilter: 'blur(20px)',
//                       borderRadius: '20px',
//                       boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
//                     }}
//                   >
//                     <div className="card-body p-4">
//                       <div className="d-flex align-items-center justify-content-between">
//                         <div>
//                           <p className="text-muted small mb-1 fw-medium">{stat.title}</p>
//                           <h2 className="fw-bold mb-0" style={{ color: stat.color }}>{stat.value}</h2>
//                         </div>
//                         <div
//                           className="p-3 rounded-circle"
//                           style={{ backgroundColor: stat.color + '20' }}
//                         >
//                           <IconComponent size={24} style={{ color: stat.color }} />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Weekly Activity */}
//           <div className="row g-4">
//             <div className="col-12 col-lg-8">
//               <div
//                 className="card border-0 h-100"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.95)',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: '20px',
//                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
//                 }}
//               >
//                 <div className="card-body p-4">
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     <div>
//                       <h5 className="fw-bold mb-1">{t('weeklyActivity')}</h5>
//                       <p className="text-muted small mb-0">{t('weeklyActivityDesc')}</p>
//                     </div>
//                     <BarChart3 className="text-muted" size={24} />
//                   </div>
//                   <div className="row g-3">
//                     {weeklyData.map((day, index) => (
//                       <div key={index} className="col">
//                         <div className="text-center">
//                           <div
//                             style={{
//                               height: 120,
//                               width: 24,
//                               display: "flex",
//                               flexDirection: "column-reverse",
//                               alignItems: "center",
//                               margin: "0 auto",
//                               position: "relative"
//                             }}
//                           >
//                             <div
//                               style={{
//                                 position: "absolute",
//                                 top: 0,
//                                 left: "50%",
//                                 transform: "translateX(-50%)",
//                                 width: 12,
//                                 height: "100%",
//                                 background: "#e5e7eb",
//                                 borderRadius: 8,
//                                 zIndex: 0
//                               }}
//                             />
//                             <div
//                               style={{
//                                 width: 12,
//                                 height: `${day.activity}%`,
//                                 background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
//                                 borderRadius: 8,
//                                 zIndex: 1,
//                                 boxShadow: "0 2px 8px rgba(102,126,234,0.15)"
//                               }}
//                             />
//                           </div>
//                           <div className="small fw-medium text-dark">{day.day}</div>
//                           <div className="small text-muted">{day.hours}h</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* This Week's Goal */}
//             <div className="col-12 col-lg-4">
//               <div
//                 className="card border-0 h-100"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.95)',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: '20px',
//                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
//                 }}
//               >
//                 <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center text-center">
//                   <div className="position-relative mb-4">
//                     <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
//                       <circle cx="70" cy="70" r="60" stroke="#e9ecef" strokeWidth="8" fill="transparent"/>
//                       <circle
//                         cx="70"
//                         cy="70"
//                         r="60"
//                         stroke="url(#gradient)"
//                         strokeWidth="8"
//                         fill="transparent"
//                         strokeDasharray="377"
//                         strokeDashoffset="75"
//                         strokeLinecap="round"
//                         style={{ transition: 'stroke-dashoffset 2s ease-out' }}
//                       />
//                       <defs>
//                         <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                           <stop offset="0%" stopColor="#667eea"/>
//                           <stop offset="100%" stopColor="#764ba2"/>
//                         </linearGradient>
//                       </defs>
//                     </svg>
//                     <div className="position-absolute top-50 start-50 translate-middle text-center">
//                       <div className="display-6 fw-bold text-dark">84%</div>
//                       <div className="small text-muted">{t('goalDesc')}</div>
//                     </div>
//                   </div>
//                   <h6 className="fw-bold mb-2">{t('thisWeekGoal')}</h6>
//                   <p className="text-muted small mb-0">{t('goalDesc')}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Subject Performance */}
//           <div className="row mt-4">
//             <div className="col-12">
//               <div
//                 className="card border-0"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.95)',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: '20px',
//                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
//                 }}
//               >
//                 <div className="card-body p-4">
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     <div>
//                       <h5 className="fw-bold mb-1">{t('subjectPerformance')}</h5>
//                       <p className="text-muted small mb-0">{t('subjectDesc')}</p>
//                     </div>
//                     <User className="text-muted" size={24}/>
//                   </div>
//                   <div className="row g-4">
//                     {subjects.map((subject, index) => {
//                       const IconComponent = subject.icon;
//                       return (
//                         <div key={index} className="col-12 col-md-6 col-lg-4">
//                           <div
//                             className="p-4 rounded-4 h-100 position-relative overflow-hidden"
//                             style={{
//                               background: '#fff',
//                               color: '#313131',
//                               borderRadius: '999px',
//                               border: '3px solid #f4a468',
//                               borderImage: 'linear-gradient(135deg, #f4a468 0%, #fee140 100%) 1',
//                               boxShadow: '0 6px 20px rgba(244,164,104,0.06)',
//                               transition: 'transform 0.3s, box-shadow 0.3s'
//                             }}
//                             onMouseEnter={(e) => {
//                               e.currentTarget.style.transform = 'translateY(-5px)';
//                               e.currentTarget.style.boxShadow = '0 24px 56px rgba(244,164,104,0.16)';
//                             }}
//                             onMouseLeave={(e) => {
//                               e.currentTarget.style.transform = 'translateY(0)';
//                               e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,164,104,0.06)';
//                             }}
//                           >
//                             <div className="d-flex align-items-center justify-content-between mb-3">
//                               <IconComponent size={28} style={{ color: '#f4a468' }} />
//                               <div className="d-flex align-items-center">
//                                 {subject.trend === 'up' ? (
//                                   <TrendingUp size={16} className="me-1" color="#28a745"/>
//                                 ) : (
//                                   <TrendingDown size={16} className="me-1" color="#dc3545"/>
//                                 )}
//                                 <span className="small">{subject.change}</span>
//                               </div>
//                             </div>
//                             <h6 className="fw-semibold mb-2">{subject.name}</h6>
//                             <div className="d-flex align-items-end justify-content-between">
//                               <div>
//                                 <div className="display-6 fw-bold">{subject.score}%</div>
//                                 <div className="small opacity-75">{t('currentScore')}</div>
//                               </div>
//                             </div>
//                             <div
//                               className="position-absolute"
//                               style={{
//                                 bottom: '-20px',
//                                 right: '-20px',
//                                 width: '80px',
//                                 height: '80px',
//                                 background: 'rgba(244,164,104,0.10)',
//                                 borderRadius: '50%'
//                               }}
//                             />
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Alert */}
//           <div className="row mt-4">
//             <div className="col-12">
//               <div
//                 className="alert border-0 d-flex align-items-center p-4"
//                 style={{
//                   background: 'white',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: '20px',
//                   border: '1px solid rgba(255, 193, 7, 0.2)'
//                 }}
//               >
//                 <div
//                   className="p-3 rounded-circle me-3"
//                   style={{ backgroundColor: 'rgba(255, 193, 7, 0.2)' }}
//                 >
//                   <AlertTriangle size={24} style={{ color: '#f57c00' }} />
//                 </div>
//                 <div className="flex-grow-1">
//                   <h6 className="fw-bold mb-2" style={{ color: '#f57c00' }}>{t('socialStudiesAlertTitle')}</h6>
//                   <p className="mb-3 text-dark opacity-75">{t('socialStudiesAlertDesc')}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default Progress;










 
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { API_CONFIG, djangoAPI } from '../../config/api';
import { Table } from 'react-bootstrap';
 
const Progress = () => {
  const { t, i18n } = useTranslation();
  const [quizData, setQuizData] = useState([]);
  const [mockTestData, setMockTestData] = useState([]);
  const [loading, setLoading] = useState(true);
 
  // Language options
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Fetch quiz and mock test data (optimized - single API call with caching)
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Debug - Fetching progress data from backend...');
        
        // Check if we already have data in localStorage to avoid duplicate calls
        const cachedData = localStorage.getItem('progressData');
        const lastFetch = localStorage.getItem('progressDataLastFetch');
        const now = Date.now();
        
        // Use cached data if it's less than 5 minutes old
        if (cachedData && lastFetch && (now - parseInt(lastFetch)) < 300000) {
          console.log('🔍 Debug - Using cached progress data');
          const parsedData = JSON.parse(cachedData);
          setQuizData(parsedData.quizData || []);
          setMockTestData(parsedData.mockTestData || []);
          setLoading(false);
          return;
        }
        
        const response = await djangoAPI.get(API_CONFIG.DJANGO.QUIZZES.CHILD_ATTEMPTS);
        console.log('🔍 Debug - Progress response:', response);
        
        if (response && response.attempts) {
          // Filter for quiz attempts
          const quizzes = response.attempts.filter(attempt => attempt.type === 'quiz');
          // Filter for mock test attempts
          const mockTests = response.attempts.filter(attempt => attempt.type === 'mock_test');
          
          // Transform quiz data (simplified)
          const transformedQuizData = quizzes.map(attempt => ({
            subject: attempt.subject || 'Unknown Subject',
            class: attempt.class_name || 'Unknown Class',
            chapter: attempt.chapter || 'Unknown Chapter',
            subtopic: attempt.subtopic || 'General Quiz',
            date: new Date(attempt.attempted_at).toISOString().split('T')[0],
            score: attempt.score || 0,
            total: 100,
            status: attempt.score >= 80 ? 'Excellent' : attempt.score >= 60 ? 'Good' : 'Needs Attention',
            trend: 'up',
            improvement: '+0%',
          }));

          // Transform mock test data (simplified)
          const transformedMockTestData = mockTests.map(attempt => ({
            subject: attempt.subject || 'Unknown Subject',
            class: attempt.class_name || 'Unknown Class',
            subtopic: attempt.subtopic || 'General Test',
            date: new Date(attempt.attempted_at).toISOString().split('T')[0],
            score: attempt.score || 0,
            total: 100,
            status: attempt.score >= 80 ? 'Excellent' : attempt.score >= 60 ? 'Good' : 'Needs Attention',
            trend: 'up',
            improvement: '+0%',
          }));
          
          console.log('🔍 Debug - Transformed quiz data:', transformedQuizData);
          console.log('🔍 Debug - Transformed mock test data:', transformedMockTestData);
          
          // Cache the data
          const dataToCache = {
            quizData: transformedQuizData,
            mockTestData: transformedMockTestData
          };
          localStorage.setItem('progressData', JSON.stringify(dataToCache));
          localStorage.setItem('progressDataLastFetch', now.toString());
          
          setQuizData(transformedQuizData);
          setMockTestData(transformedMockTestData);
        } else {
          console.log('🔍 Debug - No data found, using fallback');
          setQuizData([]);
          setMockTestData([]);
        }
      } catch (error) {
        console.error('❌ Error fetching progress data:', error);
        setQuizData([]);
        setMockTestData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
 
  const weeklyData = [
    { day: 'Mon', activity: 85, hours: 4.2 },
    { day: 'Tue', activity: 72, hours: 3.5 },
    { day: 'Wed', activity: 93, hours: 5.1 },
    { day: 'Thu', activity: 88, hours: 4.7 },
    { day: 'Fri', activity: 76, hours: 3.8 },
    { day: 'Sat', activity: 95, hours: 5.5 },
    { day: 'Sun', activity: 82, hours: 4.1 },
  ];
 
  // Calculate dynamic stats
  const allAttempts = [...quizData, ...mockTestData];
  const totalTests = allAttempts.length;
  const totalScore = allAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const overallAverage = totalTests > 0 ? Math.round(totalScore / totalTests) : 0;
 
  const subjects = [
    { name: t("mathematics"), icon: Calculator, score: 82, trend: 'up', change: '+5%' },
    { name: t("science"), icon: Atom, score: 90, trend: 'up', change: '+8%' },
    { name: t("english"), icon: BookOpen, score: 86, trend: 'up', change: '+3%' },
    { name: t("Social"), icon: Globe, score: 72, trend: 'down', change: '-4%' },
    { name: t("Computer"), icon: Code, score: 96, trend: 'up', change: '+12%' }
  ];
 
  const stats = [
    { title: t("overallScore"), value: `${overallAverage}%`, icon: Award, color: '#667eea' },
    { title: t("studyHours"), value: '28.9h', icon: Clock, color: '#f093fb' },
    { title: "Number of Tests Attended", value: `${totalTests}`, icon: CheckCircle2, color: '#4facfe' },
  ];
 
  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
 
      <div
        style={{
          minHeight: '100vh',
          background: '#e9eaf0ff',
          fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
        }}
      >
        <div className="container-fluid p-4">
          <div className="d-flex justify-content-between align-items-center text-white mb-4">
            <h1 className="display-6 fw-bold mb-0 text-dark">{t("title")}</h1>
 
            {/* Language Dropdown */}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              defaultValue={i18n.language}
              className="form-select w-auto"
              style={{
                borderRadius: "10px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                color: "black",
                fontWeight: "500",
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="ml">മലയാളം</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
 
          {/* Stats Section */}
          <div className="row g-4 mb-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="col-12 col-md-4">
                  <div
                    className="card border-0 h-100"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <p className="text-muted small mb-1 fw-medium">{stat.title}</p>
                          <h2 className="fw-bold mb-0" style={{ color: stat.color }}>{stat.value}</h2>
                        </div>
                        <div
                          className="p-3 rounded-circle"
                          style={{ backgroundColor: stat.color + '20' }}
                        >
                          <IconComponent size={24} style={{ color: stat.color }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
 
          {/* Weekly Activity */}
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div
                className="card border-0 h-100"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                      <h5 className="fw-bold mb-1">{t("weeklyActivity")}</h5>
                      <p className="text-muted small mb-0">{t("weeklySubtext")}</p>
                    </div>
                    <BarChart3 className="text-muted" size={24} />
                  </div>
 
                  <div className="row g-3">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="col">
                        <div className="text-center">
                          <div
                            style={{
                              height: 120,
                              width: 24,
                              display: "flex",
                              flexDirection: "column-reverse",
                              alignItems: "center",
                              margin: "0 auto",
                              position: "relative"
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 12,
                                height: "100%",
                                background: "#e5e7eb",
                                borderRadius: 8
                              }}
                            />
                            <div
                              style={{
                                width: 12,
                                height: `${day.activity}%`,
                                background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
                                borderRadius: 8,
                              }}
                            />
                          </div>
                          <div className="small fw-medium text-dark">{day.day}</div>
                          <div className="small text-muted">{day.hours}h</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
 
            {/* Goal Section */}
            <div className="col-12 col-lg-4">
              <div
                className="card border-0 h-100 text-center p-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '20px'
                }}
              >
                <div className="display-6 fw-bold text-dark mb-2">{overallAverage}%</div>
                <div className="small text-muted mb-2">{t("complete")}</div>
                <h6 className="fw-bold mb-2">Overall Score</h6>
                <p className="text-muted small mb-0">Average score from all tests</p>
              </div>
            </div>
          </div>
 
          {/* Student Performance */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card border-0" style={{ background: 'white', borderRadius: '20px' }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                      <h5 className="fw-bold mb-1">Student Performance</h5>
                      <p className="text-muted small mb-0">Track your child's progress across subjects</p>
                    </div>
                    <User className="text-muted" size={24} />
                  </div>
 
                  {/* Quiz Reports Table */}
                  <div className="mt-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div>
                        <h5 className="fw-bold mb-1">Quiz Reports</h5>
                        <p className="text-muted small mb-0">Recent quiz performance</p>
                      </div>
                    </div>
                  
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
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
                            const status = quiz.status === 'Excellent' ? 
                              { color: '#28a745', bg: '#d4edda', border: '#c3e6cb', icon: '✓', translatedStatus: 'Excellent' } :
                              quiz.status === 'Good' ? 
                              { color: '#17a2b8', bg: '#d1ecf1', border: '#bee5eb', icon: '→', translatedStatus: 'Good' } :
                              { color: '#dc3545', bg: '#f8d7da', border: '#f5c6cb', icon: '▲', translatedStatus: 'Needs Attention' };
                            
                      return (
                              <tr key={index}>
                                <td className="text-center fw-medium">{quiz.date}</td>
                                <td className="text-center fw-bold">{quiz.class}</td>
                                <td className="text-center fw-bold">{t(`subjects.${quiz.subject.toLowerCase().replace(' ', '-')}`, { defaultValue: quiz.subject })}</td>
                                <td className="text-center fw-semibold">
                                  {quiz.score}<span className="text-muted">/{quiz.total}</span>
                                </td>
                                <td className="text-center">
                                  <div className="progress-container">
                                    <div className="progress-bar-wrapper">
                                      <div 
                                        className="progress-bar" 
                            style={{
                                          width: `${percentage}%`,
                                          backgroundColor: percentage >= 80 ? '#28a745' : percentage >= 60 ? '#17a2b8' : '#dc3545'
                                        }}
                                      ></div>
                                    </div>
                                    <span className="progress-percentage">{percentage.toFixed(0)}%</span>
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="status-badge" style={{
                                    backgroundColor: status.bg,
                                    color: status.color,
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
                  )}
                              </div>

                  {/* Mock Test Reports Table */}
                  <div className="mt-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div>
                        <h5 className="fw-bold mb-1">Mock Test Reports</h5>
                        <p className="text-muted small mb-0">Recent mock test performance</p>
                            </div>
                          </div>
                  
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
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
                          </tr>
                        </thead>
                        <tbody>
                          {mockTestData.map((test, index) => {
                            const percentage = (test.score / test.total) * 100;
                            const status = test.status === 'Excellent' ? 
                              { color: '#28a745', bg: '#d4edda', border: '#c3e6cb', icon: '✓', translatedStatus: 'Excellent' } :
                              test.status === 'Good' ? 
                              { color: '#17a2b8', bg: '#d1ecf1', border: '#bee5eb', icon: '→', translatedStatus: 'Good' } :
                              { color: '#dc3545', bg: '#f8d7da', border: '#f5c6cb', icon: '▲', translatedStatus: 'Needs Attention' };
                            
                            return (
                              <tr key={index}>
                                <td className="text-center fw-medium">{test.date}</td>
                                <td className="text-center fw-bold">{test.class}</td>
                                <td className="text-center fw-bold">{t(`subjects.${test.subject.toLowerCase().replace(' ', '-')}`, { defaultValue: test.subject })}</td>
                                <td className="text-center fw-semibold">
                                  {test.score}<span className="text-muted">/{test.total}</span>
                                </td>
                                <td className="text-center">
                                  <div className="progress-container">
                                    <div className="progress-bar-wrapper">
                                      <div 
                                        className="progress-bar" 
                                        style={{ 
                                          width: `${percentage}%`,
                                          backgroundColor: percentage >= 80 ? '#28a745' : percentage >= 60 ? '#17a2b8' : '#dc3545'
                                        }}
                                      ></div>
                                    </div>
                                    <span className="progress-percentage">{percentage.toFixed(0)}%</span>
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="status-badge" style={{
                                    backgroundColor: status.bg,
                                    color: status.color,
                                    border: `1px solid ${status.border}`,
                                  }}>
                                    {status.icon}
                                    {status.translatedStatus}
                                  </div>
                                </td>
                                <td className="text-center fw-bold" style={{ fontSize: '0.8rem' }}>
                                  {test.subtopic}
                                </td>
                              </tr>
                      );
                    })}
                        </tbody>
                      </Table>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          {/* Alert Section */}
          <div className="row mt-4">
            <div className="col-12">
              <div
                className="alert border-0 d-flex align-items-center p-4"
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 193, 7, 0.2)'
                }}
              >
                <div
                  className="p-3 rounded-circle me-3"
                  style={{ backgroundColor: 'rgba(255, 193, 7, 0.2)' }}
                >
                  <AlertTriangle size={24} style={{ color: '#f57c00' }} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-2" style={{ color: '#f57c00' }}>
                    {t("alertTitle")}
                  </h6>
                  <p className="mb-0 text-dark opacity-75">{t("alertMessage")}</p>
                </div>
              </div>
            </div>
          </div>
 
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </>
  );
};
 
export default Progress;
 