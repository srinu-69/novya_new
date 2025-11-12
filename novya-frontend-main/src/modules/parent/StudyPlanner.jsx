// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams} from 'react-router-dom';
// import { 
//   GraduationCap,
//   Clock,
//   CheckCircle,
//   Circle,
//   Calendar,
//   BookOpen,
//   Video,
//   X,
//   Target,
//   TrendingUp,
//   ArrowLeft,
//   Calculator,
//   Atom,
//   FileText,
//   Users,
//   Code
// } from 'lucide-react';

// const StudyPlanner = () => {
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [currentVideo, setCurrentVideo] = useState('');
//   const [selectedPlan, setSelectedPlan] = useState(null);

//   const navigate = useNavigate();
//   const { subject } = useParams(); // Get subject from URL params
//   const [selectedSubject, setSelectedSubject] = useState(subject || '');
//   const [planner, setPlanner] = useState([]);

//   // Define subjects (same as in ClassSevenInterface)
//   const subjects = [
//     { name: 'Maths', icon: Calculator, color: '#f4a468', description: 'Explore mathematical concepts, algebra, geometry and problem-solving skills.' },
//     { name: 'Science', icon: Atom, color: '#4ECDC4', description: 'Discover the wonders of physics, chemistry, and biology through experiments.' },
//     { name: 'English', icon: FileText, color: '#FF6B6B', description: 'Develop language skills through literature, grammar, and creative writing.' },
//     { name: 'Social', icon: Users, color: '#6A0572', description: 'Understand society, history, geography, and civic responsibilities.' },
//     { name: 'Computer', icon: Code, color: '#45B7D1', description: 'Learn computer basics, software applications, and digital literacy.' },
//   ];

//   useEffect(() => {
//     if (subject) {
//       setSelectedSubject(subject);
//       // Generate study planner when subject changes
//       const generatedPlanner = generateStudyPlanner(subject);
//       setPlanner(generatedPlanner);
//     }
//   }, [subject]);

//   // Define videos (same as in LessonPage)
//   const videos = {
//     Maths: {
//       1: { title: "Large Numbers", file: "/videos/Maths/chapter-1.mp4", about: "Learn about large numbers, their place values, and representation." },
//       2: { title: "Arithmetic Expressions", file: "/videos/Maths/chapter-2.mp4", about: "Understand arithmetic expressions and step-by-step solving." },
//       3: { title: "Peek Point", file: "/videos/Maths/chapter-3.mp4", about: "Explore fundamental geometry concepts like points, lines, and rays." },
//       4: { title: "Number Expressions", file: "/videos/Maths/chapter-4.mp4", about: "Dive into solving simple algebraic equations with one variable." },
//       5: { title: "Lines and Angles", file: "/videos/Maths/chapter-5.mp4", about: "Introduction to lines, line segments, rays, and basic angles." },
//     },
//     Science: {
//       1: { title: "Age of Science", file: "/videos/science/chapter-1.mp4", about: "Discover the role of science in human progress and historical context." },
//       2: { title: "Substances", file: "/videos/science/chapter-2.mp4", about: "Learn about different states of matter and their properties." },
//       3: { title: "Electricity Basics", file: "/videos/science/chapter-3.mp4", about: "Basics of electricity, current, circuits, and components." },
//       4: { title: "Metals & Non-metals", file: "/videos/science/chapter-4.mp4", about: "Study the properties, uses, and differences between metals and non-metals." },
//       5: { title: "Physical & Chemical Changes", file: "/videos/science/chapter-5.mp4", about: "Differentiate physical changes from chemical changes with examples." },
//     },
//     Social: {
//       1: { title: "Tracing Changes", file: "/videos/social/chapter1 (online-video-cutter.com).mp4", about: "Explore historical changes and sources over a thousand years in India." },
//       2: { title: "New Kings & Kingdoms", file: "/videos/social/chpter2social.mp4", about: "Learn about the rise of various kingdoms in medieval India." },
//       3: { title: "The Delhi Sultans", file: "/videos/social/social_ch3.mp4.mp4", about: "Know about the Delhi Sultans, their administration, and monuments." },
//       4: { title: "The Mughal Empire", file: "/videos/social/social_ch4.mp4.mp4", about: "A detailed look into the Mughal Empire, its rulers, and policies." },
//       5: { title: "Rulers and Buildings", file: "/videos/social/social_ch5.mp4.mp4", about: "Study the architectural marvels and ruling strategies of various historical rulers." },
//     },
//     English: {
//       1: { title: "Learning Together", file: "/videos/english/7th english unit -1 LEARNING TOGETHER (2).mp4", about: "Understand the basics of nouns, pronouns, and their usage in sentences." },
//       2: { title: "Wit And Humour", file: "/videos/english/7th english unit -1 LEARNING TOGETHER.mp4", about: "Explore verbs, different tenses, and how they change meaning." },
//       3: { title: "Dreams And Discoveries", file: "/videos/english/english_3.mp4", about: "Learn to identify and use adjectives and adverbs to describe words effectively." },
//       4: { title: "Travel And Adventure", file: "/videos/english/english_4.mp4", about: "Understand the role of prepositions in showing relationships and conjunctions in joining sentences." },
//       5: { title: "Brave Hearts", file: "/videos/english/english_5.mp4", about: "Master different sentence structures and the correct use of punctuation marks." },
//     },
//     Computer: {
//       1: { title: "Microsoft word", file: "/videos/Computer/chapter-1.mp4", about: "Microsoft Word is a word-processing software used to create, edit, format, and share text documents." },
//       2: { title: "Text Editing", file: "/videos/Computer/chapter-2.mp4", about: "Text editing is the process of creating, modifying, and formatting written content using a text editor or word processor." },
//       3: { title: "MS Word Pictures", file: "/videos/Computer/chapter-3.mp4", about: "Microsoft Word, pictures can be inserted and formatted to enhance the appearance and meaning of a document." },
//       4: { title: "MS Word Smart Art", file: "/videos/Computer/chapter-4.mp4", about: "SmartArt in Microsoft Word is a feature that lets you create diagrams and visuals to represent information effectively." },
//       5: { title: "Smart Art Editing", file: "/videos/Computer/chapter-5.mp4", about: "SmartArt editing in Microsoft Word allows you to modify shapes, colors, layouts, and text within a diagram to better present information." },
//     }
//   };

//   // Generate study planner items from the videos data
//   const generateStudyPlanner = (subjectName) => {
//     const planner = [];
//     let id = 1;
    
//     const subjectVideos = videos[subjectName];
//     if (subjectVideos) {
//       Object.keys(subjectVideos).forEach(chapterNumber => {
//         const chapter = subjectVideos[chapterNumber];
//         const subjectObj = subjects.find(s => s.name === subjectName);
//         planner.push({
//           id: id++,
//           date: `2025-07-${chapterNumber}`,
//           subject: subjectName,
//           topic: chapter.title,
//           videoLink: chapter.file,
//           about: chapter.about,
//           completed: false,
//           duration: '45 mins',
//           difficulty: 'Medium',
//           priority: 'High',
//           color: subjectObj ? subjectObj.color : '#6A0572',
//         });
//       });
//     }
    
//     return planner;
//   };

//   const handleSubjectClick = (subjectObj) => {
//     // Navigate to the subject-specific study planner
//     navigate(`/parent/dashboard/studyplanner/${subjectObj.name}`);
//   };

//   const handleBackToSubjects = () => {
//     setSelectedSubject('');
//     setPlanner([]);
//     navigate('/parent/dashboard/studyplanner');
//   };

//   const handleVideoClick = (videoUrl, plan) => {
//     setCurrentVideo(videoUrl);
//     setSelectedPlan(plan);
//     setShowVideoModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowVideoModal(false);
//     setCurrentVideo('');
//     setSelectedPlan(null);
//   };

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty.toLowerCase()) {
//       case 'easy': return '#28a745';
//       case 'medium': return '#ffc107';
//       case 'hard': return '#dc3545';
//       default: return '#6c757d';
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority.toLowerCase()) {
//       case 'high': return '#dc3545';
//       case 'medium': return '#ffc107';
//       case 'low': return '#28a745';
//       default: return '#6c757d';
//     }
//   };

//   const completedCount = planner.filter(item => item.completed).length;
//   const totalHours = planner.reduce((total, item) => {
//     const hours = parseInt(item.duration.split(' ')[0]);
//     return total + hours;
//   }, 0);

//   // Get the subject object for the currently selected subject
//   const currentSubjectObj = subjects.find(s => s.name === selectedSubject);

//   return (
//     <>
//       {/* Bootstrap CSS */}
//       <link
//         href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
//         rel="stylesheet"
//       />
//       <div style={{ 
//         minHeight: '100vh', 
//         background: '#f8f9fa',
//         fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
//         padding: '2rem 0'
//       }}>
//         <div className="container">
//           {/* Header Stats */}
//           <div className="row mb-4">
//             <div className="col-12">
//               <div className="text-center mb-4">
//                 <h1 className="display-6 fw-bold mb-2 text-dark">Study Planner</h1>
//                 <p className="mb-0 text-muted">Your child's personalized learning schedule</p>
//               </div>
              
//               {selectedSubject ? (
//                 <div className="d-flex align-items-center justify-content-between mb-4">
//                   <button 
//                     className="btn btn-outline-secondary d-flex align-items-center"
//                     onClick={handleBackToSubjects}
//                   >
//                     <ArrowLeft size={18} className="me-2" />
//                     Back to Subjects
//                   </button>
                  
//                   <div style={{ width: '130px' }}></div> {/* Spacer for alignment */}
//                 </div>
//               ) : (
//                 <div className="row g-4">
//                   <div className="col-12 col-md-4">
//                     <div 
//                       className="card border-0"
//                       style={{
//                         background: 'white',
//                         borderRadius: '16px',
//                         boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//                       }}
//                     >
//                       <div className="card-body p-4 text-center">
//                         <div className="p-3 rounded-circle mx-auto mb-3" style={{ backgroundColor: '#FFE6E6', width: 'fit-content' }}>
//                           <Target size={24} style={{ color: '#FF6B6B' }} />
//                         </div>
//                         <h3 className="fw-bold mb-1 text-dark">{subjects.length}</h3>
//                         <p className="text-muted small mb-0">Subjects</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-12 col-md-4">
//                     <div 
//                       className="card border-0"
//                       style={{
//                         background: 'white',
//                         borderRadius: '16px',
//                         boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//                       }}
//                     >
//                       <div className="card-body p-4 text-center">
//                         <div className="p-3 rounded-circle mx-auto mb-3" style={{ backgroundColor: '#E0F7F6', width: 'fit-content' }}>
//                           <Clock size={24} style={{ color: '#4ECDC4' }} />
//                         </div>
//                         <h3 className="fw-bold mb-1 text-dark">5h+</h3>
//                         <p className="text-muted small mb-0">Total Study Content</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-12 col-md-4">
//                     <div 
//                       className="card border-0"
//                       style={{
//                         background: 'white',
//                         borderRadius: '16px',
//                         boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//                       }}
//                     >
//                       <div className="card-body p-4 text-center">
//                         <div className="p-3 rounded-circle mx-auto mb-3" style={{ backgroundColor: '#FFF6E0', width: 'fit-content' }}>
//                           <TrendingUp size={24} style={{ color: '#FFD166' }} />
//                         </div>
//                         <h3 className="fw-bold mb-1 text-dark">25+</h3>
//                         <p className="text-muted small mb-0">Video Lessons</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="row">
//             <div className="col-12">
//               {!selectedSubject ? (
//                 // Subject Selection View
//                 <div 
//                   className="card border-0"
//                   style={{
//                     background: 'rgba(255,255,255,0.96)',
//                     borderRadius: '20px',
//                     boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
//                   }}
//                 >
//                   <div className="card-body p-4">
//                     <div className="d-flex align-items-center mb-4">
//                       <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#ffd699' }}>
//                         <GraduationCap size={24} style={{ color: '#f4a468' }} />
//                       </div>
//                       <div>
//                         <h5 className="fw-bold mb-1">Select a Subject</h5>
//                         <p className="text-muted small mb-0">Choose a subject to view study materials</p>
//                       </div>
//                     </div>
//                     <div className="row g-4">
//                       {subjects.map((subject) => {
//                         const IconComponent = subject.icon;
//                         return (
//                           <div key={subject.name} className="col-12 col-md-6 col-lg-4">
//                             <div 
//                               className="p-4 rounded-4 h-100 position-relative overflow-hidden"
//                               style={{
//                                 background: `linear-gradient(135deg, ${subject.color}10, #fff)`,
//                                 border: `2px solid ${subject.color}`,
//                                 transition: 'all 0.3s ease',
//                                 cursor: 'pointer',
//                                 minHeight: '180px'
//                               }}
//                               onMouseEnter={(e) => {
//                                 e.currentTarget.style.transform = 'translateY(-2px)';
//                                 e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
//                               }}
//                               onMouseLeave={(e) => {
//                                 e.currentTarget.style.transform = 'translateY(0)';
//                                 e.currentTarget.style.boxShadow = 'none';
//                               }}
//                               onClick={() => handleSubjectClick(subject)}
//                             >
//                               <div className="d-flex align-items-center mb-3">
//                                 <div 
//                                   className="p-2 rounded-circle me-3"
//                                   style={{ backgroundColor: subject.color + '40' }}
//                                 >
//                                   <IconComponent size={20} style={{ color: subject.color }} />
//                                 </div>
//                                 <h6 className="fw-bold mb-0" style={{ color: subject.color }}>{subject.name}</h6>
//                               </div>
//                               <p className="text-muted small mb-3">{subject.description}</p>
//                               <div className="d-flex align-items-center text-muted small">
//                                 <Video size={14} className="me-1" />
//                                 {Object.keys(videos[subject.name] || {}).length} video lessons
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 // Subject Detail View
//                 <div 
//                   className="card border-0"
//                   style={{
//                     background: 'rgba(255,255,255,0.96)',
//                     borderRadius: '20px',
//                     boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
//                     border: currentSubjectObj ? `2px solid ${currentSubjectObj.color}` : '2px solid #6A0572'
//                   }}
//                 >
//                   <div className="card-body p-4">
//                     <div className="d-flex align-items-center mb-4">
//                       <div className="p-2 rounded-circle me-3" style={{ backgroundColor: (currentSubjectObj?.color || '#6A0572') + '40' }}>
//                         {currentSubjectObj && React.createElement(currentSubjectObj.icon, { size: 24, style: { color: currentSubjectObj.color } })}
//                       </div>
//                       <div>
//                         <h5 className="fw-bold mb-1">{selectedSubject} Study Plan</h5>
//                         <p className="text-muted small mb-0">All chapters and video lessons</p>
//                       </div>
//                     </div>
                    
//                     {/* Progress Stats */}
//                     <div className="row g-4 mb-4">
//                       <div className="col-12 col-md-4">
//                         <div className="p-3 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
//                           <div className="d-flex align-items-center">
//                             <Target size={20} style={{ color: currentSubjectObj?.color || '#6A0572' }} className="me-2" />
//                             <span className="fw-medium">Progress</span>
//                           </div>
//                           <h4 className="fw-bold mt-2 mb-0">{completedCount}/{planner.length}</h4>
//                           <small className="text-muted">Lessons Completed</small>
//                         </div>
//                       </div>
//                       <div className="col-12 col-md-4">
//                         <div className="p-3 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
//                           <div className="d-flex align-items-center">
//                             <Clock size={20} style={{ color: currentSubjectObj?.color || '#6A0572' }} className="me-2" />
//                             <span className="fw-medium">Time</span>
//                           </div>
//                           <h4 className="fw-bold mt-2 mb-0">{totalHours}h</h4>
//                           <small className="text-muted">Total Study Time</small>
//                         </div>
//                       </div>
//                       <div className="col-12 col-md-4">
//                         <div className="p-3 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
//                           <div className="d-flex align-items-center">
//                             <TrendingUp size={20} style={{ color: currentSubjectObj?.color || '#6A0572' }} className="me-2" />
//                             <span className="fw-medium">Progress</span>
//                           </div>
//                           <h4 className="fw-bold mt-2 mb-0">{planner.length > 0 ? Math.round((completedCount/planner.length)*100) : 0}%</h4>
//                           <small className="text-muted">Completion Rate</small>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Lessons List */}
//                     <div className="row g-4">
//                       {planner.map((item) => (
//                         <div key={item.id} className="col-12 col-lg-6">
//                           <div 
//                             className="p-4 rounded-4 h-100 position-relative overflow-hidden"
//                             style={{
//                               background: `linear-gradient(135deg, ${item.color}10, #fff)`,
//                               border: `2px solid ${item.color}`,
//                               transition: 'all 0.3s ease',
//                               cursor: 'pointer',
//                             }}
//                             onMouseEnter={(e) => {
//                               e.currentTarget.style.transform = 'translateY(-2px)';
//                               e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
//                             }}
//                             onMouseLeave={(e) => {
//                               e.currentTarget.style.transform = 'translateY(0)';
//                               e.currentTarget.style.boxShadow = 'none';
//                             }}
//                           >
//                             {/* Task Header */}
//                             <div className="d-flex align-items-center justify-content-between mb-3">
//                               <div className="d-flex align-items-center">
//                                 <div 
//                                   className="p-2 rounded-circle me-3"
//                                   style={{ backgroundColor: item.color + '40' }}
//                                 >
//                                   <BookOpen size={20} style={{ color: item.color }} />
//                                 </div>
//                                 <div>
//                                   <h6 className="fw-bold mb-0" style={{ color: item.color }}>Chapter {item.id}</h6>
//                                   <div className="d-flex align-items-center text-muted small">
//                                     <Calendar size={12} className="me-1" />
//                                     {item.date}
//                                   </div>
//                                 </div>
//                               </div>
//                               {/* Only indicate incomplete status here */}
//                               {!item.completed && (
//                                 <Circle size={20} className="text-muted" />
//                               )}
//                             </div>
//                             {/* Topic */}
//                             <h6 className="fw-semibold mb-3 text-dark">{item.topic}</h6>
//                             <p className="text-muted small mb-3">{item.about}</p>
//                             {/* Details */}
//                             <div className="row g-3 mb-3">
//                               <div className="col-6">
//                                 <div className="d-flex align-items-center">
//                                   <Clock size={16} className="text-muted me-2" />
//                                   <small className="text-muted fw-medium">{item.duration}</small>
//                                 </div>
//                               </div>
//                               <div className="col-6">
//                                 <span 
//                                   className="badge rounded-pill px-3 py-2 small"
//                                   style={{ 
//                                     backgroundColor: getDifficultyColor(item.difficulty) + '20',
//                                     color: getDifficultyColor(item.difficulty),
//                                     border: `1px solid ${getDifficultyColor(item.difficulty)}40`
//                                   }}
//                                 >
//                                   {item.difficulty}
//                                 </span>
//                               </div>
//                             </div>
//                             {/* Actions */}
//                             <div className="d-flex align-items-center justify-content-between">
//                               <button
//                                 className="btn btn-sm d-flex align-items-center"
//                                 style={{
//                                   backgroundColor: item.color,
//                                   color: 'white',
//                                   border: 'none',
//                                   borderRadius: '25px',
//                                   padding: '8px 16px',
//                                   fontSize: '0.85rem',
//                                   fontWeight: '500'
//                                 }}
//                                 onClick={() => handleVideoClick(item.videoLink, item)}
//                               >
//                                 <Video size={14} className="me-2" />
//                                 Watch Video
//                               </button>
//                               <span 
//                                 className="badge rounded-pill px-3 py-2 small"
//                                 style={{ 
//                                   backgroundColor: getPriorityColor(item.priority) + '20',
//                                   color: getPriorityColor(item.priority),
//                                   border: `1px solid ${getPriorityColor(item.priority)}40`
//                                 }}
//                               >
//                                 {item.priority} Priority
//                               </span>
//                             </div>
//                             {/* Completed Overlay (single green tick) */}
//                             {item.completed && (
//                               <div 
//                                 className="position-absolute top-0 end-0 p-2"
//                                 style={{
//                                   background: 'linear-gradient(135deg, #28a74520, #28a74510)',
//                                   borderRadius: '0 1rem 0 1rem'
//                                 }}
//                               >
//                                 <CheckCircle size={16} className="text-success" />
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Video Modal */}
//       {showVideoModal && (
//         <div 
//           className="modal fade show d-block" 
//           style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
//           onClick={handleCloseModal}
//         >
//           <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
//             <div 
//               className="modal-content border-0"
//               style={{ 
//                 borderRadius: '20px',
//                 overflow: 'hidden',
//                 background: 'rgba(255, 255, 255, 0.98)',
//                 backdropFilter: 'blur(20px)'
//               }}
//             >
//               <div className="modal-header border-0 p-4">
//                 <div className="d-flex align-items-center">
//                   {selectedPlan && (
//                     <div 
//                       className="p-2 rounded-circle me-3"
//                       style={{ backgroundColor: selectedPlan.color + '20' }}
//                     >
//                       <Video size={20} style={{ color: selectedPlan.color }} />
//                     </div>
//                   )}
//                   <div>
//                     <h5 className="modal-title fw-bold mb-0">
//                       {selectedPlan ? selectedPlan.subject : 'Study Video'}
//                     </h5>
//                     {selectedPlan && (
//                       <p className="small text-muted mb-0">{selectedPlan.topic}</p>
//                     )}
//                   </div>
//                 </div>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={handleCloseModal}
//                   style={{
//                     background: 'none',
//                     border: 'none',
//                     fontSize: '1.5rem',
//                     opacity: 0.8
//                   }}
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//               <div className="modal-body p-0">
//                 {currentVideo && (
//                   <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
//                     <video
//                       src={currentVideo}
//                       controls
//                       controlsList="nodownload"
//                       disablePictureInPicture
//                       style={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         width: "100%",
//                         height: "100%",
//                         border: "none",
//                         borderRadius: "0 0 20px 20px"
//                       }}
//                     >
//                       Your browser does not support the video tag.
//                     </video>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default StudyPlanner;













 
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  GraduationCap,
  Clock,
  CheckCircle,
  Circle,
  Calendar,
  BookOpen,
  Video,
  X,
  Target,
  TrendingUp,
  ArrowLeft,
  Calculator,
  Atom,
  FileText,
  Users,
  Code
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
 
const StudyPlanner = () => {
  const { t } = useTranslation();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
 
  const navigate = useNavigate();
  const { subject } = useParams();
  const [selectedSubject, setSelectedSubject] = useState(subject || '');
  const [planner, setPlanner] = useState([]);
 
  // Subjects
  const subjects = [
    { name: t('Maths'), icon: Calculator, color: '#f4a468', description: t('MathDescription') },
    { name: t('Science'), icon: Atom, color: '#4ECDC4', description: t('ScienceDescription') },
    { name: t('English'), icon: FileText, color: '#FF6B6B', description: t('EnglishDescription') },
    { name: t('Social'), icon: Users, color: '#6A0572', description: t('SocialDescription') },
    { name: t('Computer'), icon: Code, color: '#45B7D1', description: t('ComputerDescription') },
  ];
 
  // Videos (static data)
  const videos = {
    Maths: {
      1: { title: "Large Numbers", file: "/videos/Maths/chapter-1.mp4", about: "Learn about large numbers, their place values, and representation." },
      2: { title: "Arithmetic Expressions", file: "/videos/Maths/chapter-2.mp4", about: "Understand arithmetic expressions and step-by-step solving." },
      3: { title: "Peek Point", file: "/videos/Maths/chapter-3.mp4", about: "Explore fundamental geometry concepts like points, lines, and rays." },
      4: { title: "Number Expressions", file: "/videos/Maths/chapter-4.mp4", about: "Dive into solving simple algebraic equations with one variable." },
      5: { title: "Lines and Angles", file: "/videos/Maths/chapter-5.mp4", about: "Introduction to lines, line segments, rays, and basic angles." },
    },
    Science: {
      1: { title: "Age of Science", file: "/videos/science/chapter-1.mp4", about: "Discover the role of science in human progress and historical context." },
      2: { title: "Substances", file: "/videos/science/chapter-2.mp4", about: "Learn about different states of matter and their properties." },
      3: { title: "Electricity Basics", file: "/videos/science/chapter-3.mp4", about: "Basics of electricity, current, circuits, and components." },
      4: { title: "Metals & Non-metals", file: "/videos/science/chapter-4.mp4", about: "Study the properties, uses, and differences between metals and non-metals." },
      5: { title: "Physical & Chemical Changes", file: "/videos/science/chapter-5.mp4", about: "Differentiate physical changes from chemical changes with examples." },
    },
    Social: {
      1: { title: "Tracing Changes", file: "/videos/social/chapter1.mp4", about: "Explore historical changes and sources over a thousand years in India." },
      2: { title: "New Kings & Kingdoms", file: "/videos/social/chpter2social.mp4", about: "Learn about the rise of various kingdoms in medieval India." },
      3: { title: "The Delhi Sultans", file: "/videos/social/social_ch3.mp4", about: "Know about the Delhi Sultans, their administration, and monuments." },
      4: { title: "The Mughal Empire", file: "/videos/social/social_ch4.mp4", about: "A detailed look into the Mughal Empire, its rulers, and policies." },
      5: { title: "Rulers and Buildings", file: "/videos/social/social_ch5.mp4", about: "Study the architectural marvels and ruling strategies of various historical rulers." },
    },
    English: {
      1: { title: "Learning Together", file: "/videos/english/7th english unit -1.mp4", about: "Understand the basics of nouns, pronouns, and their usage in sentences." },
      2: { title: "Wit And Humour", file: "/videos/english/english_2.mp4", about: "Explore verbs, different tenses, and how they change meaning." },
      3: { title: "Dreams And Discoveries", file: "/videos/english/english_3.mp4", about: "Learn to identify and use adjectives and adverbs to describe words effectively." },
      4: { title: "Travel And Adventure", file: "/videos/english/english_4.mp4", about: "Understand prepositions and conjunctions in joining sentences." },
      5: { title: "Brave Hearts", file: "/videos/english/english_5.mp4", about: "Master different sentence structures and punctuation marks." },
    },
    Computer: {
      1: { title: "Microsoft Word", file: "/videos/Computer/chapter-1.mp4", about: "Microsoft Word basics for creating and editing documents." },
      2: { title: "Text Editing", file: "/videos/Computer/chapter-2.mp4", about: "Editing and formatting text efficiently." },
      3: { title: "MS Word Pictures", file: "/videos/Computer/chapter-3.mp4", about: "Insert and format pictures in Word documents." },
      4: { title: "MS Word Smart Art", file: "/videos/Computer/chapter-4.mp4", about: "Use SmartArt to create diagrams and visuals." },
      5: { title: "Smart Art Editing", file: "/videos/Computer/chapter-5.mp4", about: "Edit SmartArt with shapes, layouts, and text." },
    }
  };
 
  useEffect(() => {
    if (subject) {
      setSelectedSubject(subject);
      const generatedPlanner = generateStudyPlanner(subject);
      setPlanner(generatedPlanner);
    }
  }, [subject]);
 
  const generateStudyPlanner = (subjectName) => {
    const planner = [];
    let id = 1;
    const subjectVideos = videos[subjectName];
    if (subjectVideos) {
      Object.keys(subjectVideos).forEach(chapterNumber => {
        const chapter = subjectVideos[chapterNumber];
        const subjectObj = subjects.find(s => s.name === subjectName);
        planner.push({
          id: id++,
          date: `2025-07-${chapterNumber}`,
          subject: subjectName,
          topic: chapter.title,
          videoLink: chapter.file,
          about: chapter.about,
          completed: false,
          duration: '45 mins',
          difficulty: t('medium'),
          priority: t('high'),
          color: subjectObj ? subjectObj.color : '#6A0572',
        });
      });
    }
    return planner;
  };
 
  const handleSubjectClick = (subjectObj) => {
    navigate(`/parent/dashboard/studyplanner/${subjectObj.name}`);
  };
 
  const handleBackToSubjects = () => {
    setSelectedSubject('');
    setPlanner([]);
    navigate('/parent/dashboard/studyplanner');
  };
 
  const handleVideoClick = (videoUrl, plan) => {
    setCurrentVideo(videoUrl);
    setSelectedPlan(plan);
    setShowVideoModal(true);
  };
 
  const handleCloseModal = () => {
    setShowVideoModal(false);
    setCurrentVideo('');
    setSelectedPlan(null);
  };
 
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case t('easy').toLowerCase(): return '#28a745';
      case t('medium').toLowerCase(): return '#ffc107';
      case t('hard').toLowerCase(): return '#dc3545';
      default: return '#6c757d';
    }
  };
 
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case t('high').toLowerCase(): return '#dc3545';
      case t('medium').toLowerCase(): return '#ffc107';
      case t('low').toLowerCase(): return '#28a745';
      default: return '#6c757d';
    }
  };
 
  const completedCount = planner.filter(item => item.completed).length;
  const totalHours = planner.reduce((total, item) => {
    const hours = parseInt(item.duration.split(' ')[0]);
    return total + hours;
  }, 0);
 
  const currentSubjectObj = subjects.find(s => s.name === selectedSubject);
 
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '2rem 0' }}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h1 className="fw-bold">{t('studyPlanner')}</h1>
            <p className="text-muted">{t('childLearningSchedule')}</p>
          </div>
 
          {selectedSubject ? (
            <div className="d-flex justify-content-between mb-4">
              <button className="btn btn-outline-secondary" onClick={handleBackToSubjects}>
                <ArrowLeft size={18} className="me-2" />
                {t('backToSubjects')}
              </button>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-md-4 text-center">
                <h3>{subjects.length}</h3>
                <p>{t('All Subjects')}</p>
              </div>
              <div className="col-md-4 text-center">
                <h3>5h+</h3>
                <p>{t('totalStudyContent')}</p>
              </div>
              <div className="col-md-4 text-center">
                <h3>25+</h3>
                <p>{t('videoLessons')}</p>
              </div>
            </div>
          )}
        </div>
 
        {/* Subject Selection */}
        {!selectedSubject ? (
          <div className="row g-4">
            {subjects.map((subject) => {
              const IconComponent = subject.icon;
              return (
                <div key={subject.name} className="col-md-4">
                  <div className="card p-3" onClick={() => handleSubjectClick(subject)} style={{ cursor: 'pointer' }}>
                    <IconComponent size={24} style={{ color: subject.color }} />
                    <h6 className="mt-2">{subject.name}</h6>
                    <p className="small text-muted">{subject.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <h5>{selectedSubject} {t('studyPlanner')}</h5>
            <div className="row g-4">
              {planner.map((item) => (
                <div key={item.id} className="col-md-6">
                  <div className="card p-3">
                    <h6>{t('subject')}: {item.subject}</h6>
                    <p>{item.topic}</p>
                    <button className="btn btn-primary" onClick={() => handleVideoClick(item.videoLink, item)}>
                      <Video size={14} className="me-2" /> {t('watchVideo')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
 
      {/* Video Modal */}
      {showVideoModal && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5>{t('watchVideo')}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <video src={currentVideo} controls style={{ width: '100%' }}></video>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default StudyPlanner;
 