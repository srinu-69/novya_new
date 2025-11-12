
// import React, { useState, useEffect } from 'react';

// import { Link } from 'react-router-dom';

// import { motion, useAnimation } from 'framer-motion';

// import { useInView } from 'react-intersection-observer';

// import { useNavigate } from 'react-router-dom';

// import './Home1.css';

 

// const Home1 = () => {

//   useEffect(() => {

//     document.title = "Student-Dashboard | NOVYA - Your Smart Learning Platform";

//   }, []);

//   const navigate = useNavigate();

//   const [currentCourse, setCurrentCourse] = useState('Mathematics Class 7');

//   const [upcomingEvents, setUpcomingEvents] = useState([

//     { id: 1, title: 'Science Workshop', date: 'Oct 15, 2023', time: '3:00 PM', type: 'workshop', image: 'https://images.piclumen.com/normal/20250703/14/ffc10f2a812e42cd8b702a792725b8d9.webp' },

//     { id: 2, title: 'Career Guidance', date: 'Oct 18, 2023', time: '4:30 PM', type: 'seminar', image: 'https://images.piclumen.com/normal/20250703/14/b3c0f0ee7c854054ae648a59a82a9c9a.webp' },

//     { id: 3, title: 'Math Olympiad', date: 'Oct 22, 2023', time: '10:00 AM', type: 'competition', image: 'https://images.piclumen.com/normal/20250703/14/7c8ecbde0fd3415f848ba00176cd3b25.webp' },

//     { id: 4, title: 'Literature Seminar', date: 'Oct 25, 2023', time: '2:00 PM', type: 'workshop', image: 'https://images.piclumen.com/normal/20250703/14/08ea6901b2ad491595bc36c122451693.webp' }

//   ]);

 

//   const coursesByClass = {

//     '7': [

//       { id: 1, title: 'Mathematics Grade 7', progress: 65, category: 'Mathematics', image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },

//       { id: 2, title: 'Physics Grade 7', progress: 45, category: 'Science', image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },

//       { id: 3, title: 'English Literature Grade 7', progress: 70, category: 'Languages', image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },

//       { id: 4, title: 'History Grade 7', progress: 30, category: 'Social Studies', image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },

//       { id: 5, title: 'Chemistry Grade 7', progress: 25, category: 'Science', image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },

//       { id: 6, title: 'Computer Science Grade 7', progress: 80, category: 'Technology', image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }

//     ],

//     '8': [

//       { id: 1, title: 'Mathematics Grade 8', progress: 70, category: 'Mathematics', image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },

//       { id: 2, title: 'Physics Grade 8', progress: 50, category: 'Science', image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },

//       { id: 3, title: 'English Literature Grade 8', progress: 75, category: 'Languages', image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },

//       { id: 4, title: 'History Grade 8', progress: 35, category: 'Social Studies', image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },

//       { id: 5, title: 'Chemistry Grade 8', progress: 30, category: 'Science', image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },

//       { id: 6, title: 'Computer Science Grade 8', progress: 85, category: 'Technology', image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }

//     ],

//     '9': [

//       { id: 1, title: 'Mathematics Grade 9', progress: 75, category: 'Mathematics', image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },

//       { id: 2, title: 'Physics Grade 9', progress: 55, category: 'Science', image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },

//       { id: 3, title: 'English Literature Grade 9', progress: 80, category: 'Languages', image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },

//       { id: 4, title: 'History Grade 9', progress: 40, category: 'Social Studies', image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },

//       { id: 5, title: 'Chemistry Grade 9', progress: 35, category: 'Science', image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },

//       { id: 6, title: 'Computer Science Grade 9', progress: 90, category: 'Technology', image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }

//     ],

//     '10': [

//       { id: 1, title: 'Mathematics Grade 10', progress: 80, category: 'Mathematics', image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },

//       { id: 2, title: 'Physics Grade 10', progress: 60, category: 'Science', image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },

//       { id: 3, title: 'English Literature Grade 10', progress: 85, category: 'Languages', image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },

//       { id: 4, title: 'History Grade 10', progress: 45, category: 'Social Studies', image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },

//       { id: 5, title: 'Chemistry Grade 10', progress: 40, category: 'Science', image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },

//       { id: 6, title: 'Computer Science Grade 10', progress: 95, category: 'Technology', image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }

//     ]

//   };

 

//   const statsByClass = {

//     '7': [

//       { value: 8, label: 'Active Courses', icon: 'book', max: 10, color: '#2D5D7B' },

//       { value: 24, label: 'Hours This Week', icon: 'clock', max: 40, color: '#A62D69' },

//       { value: 92, label: 'Average Grade', icon: 'chart-line', max: 100, color: '#F9A826' },

//       { value: 15, label: 'Assignments Due', icon: 'tasks', max: 20, color: '#009688' }

//     ],

//     '8': [

//       { value: 7, label: 'Active Courses', icon: 'book', max: 10, color: '#2D5D7B' },

//       { value: 20, label: 'Hours This Week', icon: 'clock', max: 40, color: '#A62D69' },

//       { value: 88, label: 'Average Grade', icon: 'chart-line', max: 100, color: '#F9A826' },

//       { value: 12, label: 'Assignments Due', icon: 'tasks', max: 20, color: '#009688' }

//     ],

//     '9': [

//       { value: 9, label: 'Active Courses', icon: 'book', max: 10, color: '#2D5D7B' },

//       { value: 28, label: 'Hours This Week', icon: 'clock', max: 40, color: '#A62D69' },

//       { value: 95, label: 'Average Grade', icon: 'chart-line', max: 100, color: '#F9A826' },

//       { value: 18, label: 'Assignments Due', icon: 'tasks', max: 20, color: '#009688' }

//     ],

//     '10': [

//       { value: 6, label: 'Active Courses', icon: 'book', max: 10, color: '#2D5D7B' },

//       { value: 18, label: 'Hours This Week', icon: 'clock', max: 40, color: '#A62D69' },

//       { value: 85, label: 'Average Grade', icon: 'chart-line', max: 100, color: '#F9A826' },

//       { value: 10, label: 'Assignments Due', icon: 'tasks', max: 20, color: '#009688' }

//     ]

//   };

 

//   const topicsByClass = {

//     '7': ["Large Numbers", "Arthmetic Expressions", "Peek Point", "Number Expressions", "Lines"],

//     '8': ["A Square And A Cube", "Power Play", "A Story Of Numbers", "Quadrilaterals", "Number Play"],

//     '9': ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations", "Intoduction To Euclids Geometry"],

//     '10': ["Real Numbers", "Polynomials", "Pair Of Linear Equations", "Quadritic Equations", "Arthmetic Progressions"]

//   };

 

//   const [activeClass, setActiveClass] = useState('7');

//   const [allCourses, setAllCourses] = useState(coursesByClass['7']);

//   const [activeTab, setActiveTab] = useState('all');

//   const [featuredCourses, setFeaturedCourses] = useState(coursesByClass['7']);

//   const [currentProgress, setCurrentProgress] = useState(65);

//   const [learningStats, setLearningStats] = useState(statsByClass['7']);

//   const [currentTopics, setCurrentTopics] = useState(topicsByClass['7']);

//   const [isHovered, setIsHovered] = useState(null);

//   const controls = useAnimation();

//   const [ref, inView] = useInView();

 

//   const subjectMap = {

//     'Mathematics': 'Maths',

//     'Science': 'Science',

//     'Languages': 'English',

//     'Social Studies': 'Social',

//     'Technology': 'Computer',

//   };

 

//   useEffect(() => {

//     setAllCourses(coursesByClass[activeClass]);



//   }, [activeClass]);

 

//   useEffect(() => {

//     if (activeTab === 'all') {

//       setFeaturedCourses(allCourses);

//     } else if (activeTab === 'computer') {

//       setFeaturedCourses(allCourses.filter(course => course.category.toLowerCase() === 'technology'));

//     } else {

//       setFeaturedCourses(allCourses.filter(course => course.category.toLowerCase().includes(activeTab.toLowerCase())));

//     }

//   }, [activeTab, allCourses]);

 

//   useEffect(() => {

//     if (inView) {

//       controls.start('visible');

//     }

//   }, [controls, inView]);

 

//   const containerVariants = {

//     hidden: { opacity: 0 },

//     visible: {

//       opacity: 1,

//       transition: { staggerChildren: 0.1, delayChildren: 0.3 }

//     }

//   };

 

//   const itemVariants = {

//     hidden: { y: 40, opacity: 0 },

//     visible: {

//       y: 0,

//       opacity: 1,

//       transition: { type: 'spring', stiffness: 100, damping: 15 }

//     }

//   };

 

//   const hoverEffect = {

//     scale: 1.05,

//     boxShadow: "0 15px 30px -10px rgba(45, 93, 123, 0.4)",

//     transition: { duration: 0.3 }

//   };

 

//   const cardHover = {

//     scale: 1.03,

//     boxShadow: "0 20px 40px -10px rgba(45, 93, 123, 0.3)",

//     transition: { duration: 0.3 }

//   };

 

//   const textVariants = {

//     hidden: { opacity: 0, x: -30 },

//     visible: {

//       opacity: 1,

//       x: 0,

//       transition: { duration: 0.8, ease: "easeOut" }

//     }

//   };

 

//   const fadeIn = {

//     hidden: { opacity: 0 },

//     visible: {

//       opacity: 1,

//       transition: { duration: 0.8 }

//     }

//   };

 

//   const staggerContainer = {

//     hidden: { opacity: 0 },

//     visible: {

//       opacity: 1,

//       transition: {

//         staggerChildren: 0.15

//       }

//     }

//   };

 

//   const heroVariants = {

//     hidden: { opacity: 0, y: 80 },

//     visible: {

//       opacity: 1,

//       y: 0,

//       transition: { duration: 1, ease: "easeInOut" }

//     }

//   };

 

//   const pulseAnimation = {

//     scale: [1, 1.05, 1],

//     transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }

//   };

 

//   const floatAnimation = {

//     y: [0, -15, 0],

//     transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }

//   };

 

//   const glowAnimation = {

//     boxShadow: [

//       "0 0 0 0 rgba(166, 45, 105, 0.4)",

//       "0 0 20px 10px rgba(166, 45, 105, 0)",

//       "0 0 0 0 rgba(166, 45, 105, 0.4)"

//     ],

//     transition: { duration: 3, repeat: Infinity }

//   };

 

//   const rotateAnimation = {

//     rotate: [0, 5, -5, 0],

//     transition: { duration: 0.5 }

//   };

 

//   return (

//     <div className="home-container">

//       <motion.div

//         className="floating-shape shape-1"

//         animate={{

//           y: [0, -40, 0],

//           x: [0, 20, 0],

//           rotate: [0, 5, 0]

//         }}

//         transition={{

//           duration: 12,

//           repeat: Infinity,

//           ease: "easeInOut"

//         }}

//       />

//       <motion.div

//         className="floating-shape shape-2"

//         animate={{

//           y: [0, 30, 0],

//           x: [0, -30, 0],

//           rotate: [0, -8, 0]

//         }}

//         transition={{

//           duration: 15,

//           repeat: Infinity,

//           ease: "easeInOut",

//           delay: 2

//         }}

//       />

//       <motion.div

//         className="floating-shape shape-3"

//         animate={{

//           y: [0, -20, 0],

//           x: [0, 15, 0],

//           rotate: [0, 3, 0]

//         }}

//         transition={{

//           duration: 10,

//           repeat: Infinity,

//           ease: "easeInOut",

//           delay: 1

//         }}

//       />

 

//       <motion.section

//         className="hero-section"

//         initial="hidden"

//         animate="visible"

//         variants={heroVariants}

//       >

//         <div className="container hero-content">

//           <motion.div

//             className="hero-text"

//             initial="hidden"

//             animate="visible"

//             variants={staggerContainer}

//           >

//             <motion.h1

//               variants={textVariants}

//               transition={{ duration: 0.8 }}

//             >

//               Welcome to Your <span className="highlight-text">Student Dashboard</span>

//             </motion.h1>

//             <motion.p

//               variants={textVariants}

//               transition={{ duration: 0.8, delay: 0.3 }}

//               className="hero-subtitle"

//             >

//               Track your progress, access your courses, and stay updated with upcoming events

//             </motion.p>

//             <motion.div

//               variants={textVariants}

//               transition={{ duration: 0.8, delay: 0.6 }}

//               className="hero-buttons"

//             >

//               {/* Continue Learning Button */}

//               <motion.div

//                 whileHover={{ scale: 1.05 }}

//                 whileTap={{ scale: 0.95 }}

//                 animate={controls}

//               >

//                 <button

//                   className="btn btn-primary"

//                   onClick={() => navigate(`/learn/class${activeClass}?subject=Maths`)}

//                 >

//                   Continue Learning

//                 </button>

//               </motion.div>

             

//               {[

//                 { value: "8", label: 'Active Courses' },

//                 { value: "92%", label: 'Average Grade' },

//                 { value: "15", label: 'Upcoming Tasks' }

//               ].map((stat, index) => (

//                 <motion.div

//                   className="stat-item"

//                   key={index}

//                   initial={{ opacity: 0, y: 20 }}

//                   animate={{ opacity: 1, y: 0 }}

//                   transition={{ delay: 1.4 + index * 0.2 }}

//                   whileHover={{ y: -5 }}

//                 >

//                   <div className="stat-value">{stat.value}</div>

//                   <div className="stat-label">{stat.label}</div>

//                 </motion.div>

//               ))}

//             </motion.div>

//           </motion.div>

         

//           <motion.div

//             className="hero-image"

//             initial={{ opacity: 0, scale: 0.8 }}

//             animate={{ opacity: 1, scale: 1 }}

//             transition={{ duration: 1, delay: 0.5 }}

//             whileHover={pulseAnimation}

//           >

//             <motion.img

//               src="https://illustrations.popsy.co/amber/digital-nomad.svg"

//               alt="Student illustration"

//               animate={floatAnimation}

//             />

//             <motion.div

//               className="hero-image-glow"

//               animate={glowAnimation}

//             />

//           </motion.div>

//         </div>

//       </motion.section>

 

//       {/* Rest of your existing code remains unchanged */}

//       <motion.main

//         className="main-content container py-5"

//         variants={containerVariants}

//         initial="hidden"

//         animate="visible"

//         ref={ref}

//       >

//         {/* Current Learning Section */}

//         <motion.section

//           className="current-learning-section mb-5"

//           variants={itemVariants}

//         >

//           <div className="section-header">

//             <motion.h2

//               initial={{ opacity: 0, x: -20 }}

//               animate={{ opacity: 1, x: 0 }}

//               transition={{ delay: 0.2 }}

//             >

//               Your Current Course

//             </motion.h2>

            
//           </div>

         

//           <div className="row g-4">

//             <div className="col-lg-8">

//               <motion.div

//                 className="current-course-card p-4"

//                 whileHover={cardHover}

//                 initial={{ opacity: 0, x: -40 }}

//                 animate={{ opacity: 1, x: 0 }}

//                 transition={{ delay: 0.3, type: 'spring' }}

//               >

//                 <div

//                   className="course-header"

//                   style={{

//                     display: "flex",

//                     alignItems: "center",

//                     gap: "12px",

//                     overflow: "visible"

//                   }}

//                 >

//                   <h3 style={{ margin: 0 }}>{currentCourse}</h3>

//                   <motion.span

//                     className="badge"

//                     animate={pulseAnimation}

//                     style={{

//                       fontSize: "1rem",

//                       padding: "0.3em 1.1em",

//                       lineHeight: "1.5",

//                       alignSelf: "flex-start",

//                       whiteSpace: "nowrap"

//                     }}

//                   >

//                     Active

//                   </motion.span>

//                 </div>

//                 <div className="course-meta">

//                   <span><i className="fas fa-chalkboard-teacher"></i> Instructor: Mrs. Smith</span>

//                   <span><i className="fas fa-calendar-alt"></i> Started: Sep 5, 2023</span>

//                 </div>

//                 <div className="progress-container mt-3">

//                   <div className="progress" style={{ height: '10px' }}>

//                     <motion.div

//                       className="progress-bar"

//                       role="progressbar"

//                       initial={{ width: 0 }}

//                       animate={{ width: `${currentProgress}%` }}

//                       transition={{ duration: 1.5, delay: 0.5, type: 'spring' }}

//                       style={{ backgroundColor: '#A62D69' }}

//                       aria-valuenow={currentProgress}

//                       aria-valuemin="0"

//                       aria-valuemax="100"

//                     ></motion.div>

//                   </div>

//                   <div className="d-flex justify-content-between mt-2">

//                     <span>{currentProgress}% Complete</span>

//                     <span>13/20 Lessons</span>

//                   </div>

//                 </div>

//                 <div className="course-actions mt-4">

                 

//                   <motion.button

//                     className="btn btn-outline"

//                     whileHover={{ scale: 1.03 }}

//                     whileTap={{ scale: 0.98 }}

//                     onClick={() => navigate(`/learn/class${activeClass}?subject=Maths`)}

//                   >

//                     View Syllabus

//                   </motion.button>

//                 </div>

//                 <div className="course-highlights mt-4">

//                   <h5>Current Topics</h5>

//                   <ul>

//                     {currentTopics.map((item, index) => (

//                       <motion.li

//                         key={index}

//                         initial={{ opacity: 0, x: -20 }}

//                         animate={{ opacity: 1, x: 0 }}

//                         transition={{ delay: 0.6 + index * 0.1 }}

//                       >

//                         <i className="fas fa-check-circle"></i> {item}

//                       </motion.li>

//                     ))}

//                   </ul>

//                 </div>

//               </motion.div>

//             </div>

           

//             <div className="col-lg-4">

//               <motion.div

//                 className="stats-card p-4"

//                 whileHover={cardHover}

//                 initial={{ opacity: 0, y: 40 }}

//                 animate={{ opacity: 1, y: 0 }}

//                 transition={{ delay: 0.4, type: 'spring' }}

//               >

//                 <h4>Your Learning Stats</h4>

//                 <div className="stats-bargraph">

//                   {learningStats.map((stat, index) => (

//                     <div className="bargraph-item" key={index}>

//                       <div className="bargraph-label">

//                         <i className={`fas fa-${stat.icon}`}></i> {stat.label}

//                         <span className="bargraph-value">{stat.value}{stat.label === 'Average Grade' ? '%' : ''}</span>

//                       </div>

//                       <div className="bargraph-bar-bg">

//                         <div

//                           className="bargraph-bar-fill"

//                           style={{

//                             width: `${(stat.value / stat.max) * 100}%`,

//                             background: stat.color

//                           }}

//                         ></div>

//                       </div>

//                     </div>

//                   ))}

//                 </div>

//                 <motion.div

//                   className="achievement-badge mt-4"

//                   initial={{ scale: 0 }}

//                   animate={{ scale: 1 }}

//                   transition={{ delay: 1.1, type: 'spring' }}

//                   whileHover={rotateAnimation}

//                 >

//                   <i className="fas fa-trophy"></i>

//                   <span>Math Star Student</span>

//                 </motion.div>

//               </motion.div>

//             </div>

//           </div>

//         </motion.section>

 

//         <motion.section

//           className="featured-courses mb-5"

//           variants={itemVariants}

//         >

//           <div className="section-header">

//             <h2>Your Courses</h2>
           


//             <div className="tabs">

//               {/* MODIFICATION HERE: Added 'Computer' tab */}

//               {['All', 'Mathematics', 'Science', 'Languages', 'Social Studies', 'Computer'].map((tab) => (

//                 <motion.button

//                   key={tab}

//                   className={activeTab === tab.toLowerCase() ? 'active' : ''}

//                   onClick={() => setActiveTab(tab.toLowerCase())}

//                   whileHover={{ scale: 1.05, backgroundColor: activeTab === tab.toLowerCase() ? '#1a3a4f' : '#e9ecef' }}

//                   whileTap={{ scale: 0.95 }}

//                   initial={{ opacity: 0, y: 10 }}

//                   animate={{ opacity: 1, y: 0 }}

//                   transition={{ delay: 0.3 }}

//                 >

//                   {tab}

//                 </motion.button>

//               ))}

//             </div>

//           </div>

//           <div className="tabs">

//               {['7', '8', '9', '10'].map((cls) => (

//                 <motion.button

//                   key={cls}

//                   className={activeClass === cls ? 'active' : ''}

//                   onClick={() => setActiveClass(cls)}

//                   whileHover={{ scale: 1.05, backgroundColor: activeClass === cls ? '#1a3a4f' : '#e9ecef' }}

//                   whileTap={{ scale: 0.95 }}

//                   initial={{ opacity: 0, y: 10 }}

//                   animate={{ opacity: 1, y: 0 }}

//                   transition={{ delay: 0.3 }}

//                 >

//                   Class {cls}

//                 </motion.button>

//               ))}

//             </div>
// <br/>
//           <div className="row g-4">

//             {featuredCourses.map((course, index) => (

//               <div className="col-md-4" key={course.id}>

//                 <motion.div

//                   className="featured-course-card"

//                   whileHover={cardHover}

//                   initial={{ opacity: 0, y: 40 }}

//                   animate={{ opacity: 1, y: 0 }}

//                   transition={{ delay: index * 0.1, type: 'spring' }}

//                   onHoverStart={() => setIsHovered(course.id)}

//                   onHoverEnd={() => setIsHovered(null)}

//                 >

//                   <div className="course-image">

//                     <img src={course.image} alt={course.title} />

//                     <div className="course-category">{course.category}</div>

//                     {isHovered === course.id && (

//                       <motion.div

//                         className="course-hover-overlay"

//                         initial={{ opacity: 0 }}

//                         animate={{ opacity: 1 }}

//                         exit={{ opacity: 0 }}

//                       >

               

//                       </motion.div>

//                     )}

//                   </div>

//                   <div className="course-content p-4">

//                     <h3>{course.title}</h3>

//                     <div className="progress-container mt-3">

//                       <div className="progress" style={{ height: '6px' }}>

//                         <motion.div

//                           className="progress-bar"

//                           role="progressbar"

//                           initial={{ width: 0 }}

//                           animate={{ width: `${course.progress}%` }}

//                           transition={{ duration: 1, delay: index * 0.1 + 0.3 }}

//                           style={{ backgroundColor: '#2D5D7B' }}

//                         ></motion.div>

//                       </div>

//                       <span className="mt-2 d-block">{course.progress}% Complete</span>

//                     </div>

//                     <div className="course-meta mt-3">

//                       <span><i className="fas fa-book-open"></i> 20 Lessons</span>

//                       <span><i className="fas fa-clock"></i> 10 Hours</span>

//                     </div>

//                     <motion.button

//                         className="btn btn-primary w-100 mt-3"

//                         whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(45, 93, 123, 0.4)" }}

//                         whileTap={{ scale: 0.98 }}

//                         onClick={() => navigate(`/learn/class${activeClass}?subject=${subjectMap[course.category]}`)}

//                     >

//                       Continue

//                     </motion.button>

//                   </div>

//                 </motion.div>

//               </div>

//             ))}

//           </div>

//         </motion.section>

 

//         <motion.section

//           className="events-section mb-5"

//           variants={itemVariants}

//         >

//           <div className="section-header">

//             <h2>Upcoming Events</h2>

//             {/* <Link to="/events" className="view-all">View Calendar</Link> */}

//           </div>

         

//           <div className="row g-4">

//             {upcomingEvents.map((event, index) => (

//               <div className="col-lg-3 col-md-6" key={event.id}>

//                 <motion.div

//                   className="event-card"

//                   whileHover="hover"

//                   initial={{ opacity: 0, y: 40 }}

//                   animate={{ opacity: 1, y: 0 }}

//                   transition={{ delay: index * 0.1, type: 'spring' }}

//                   variants={{

//                     hover: {

//                       y: -10,

//                       boxShadow: "0 25px 50px -10px rgba(45, 93, 123, 0.3)",

//                       transition: { duration: 0.3 }

//                     }

//                   }}

//                 >

//                   <div className="event-image">

//                     <img src={event.image} alt={event.title} />

//                     <div className={`event-type ${event.type}`}>

//                       {event.type.charAt(0).toUpperCase() + event.type.slice(1)}

//                     </div>

//                   </div>

//                   <div className="event-content p-4">

//                     <div className="event-date">

//                       <span className="day">{event.date.split(' ')[1].replace(',', '')}</span>

//                       <span className="month">{event.date.split(' ')[0]}</span>

//                     </div>

//                     <h3>{event.title}</h3>

//                     <div className="event-meta">

//                       <span><i className="far fa-clock"></i> {event.time}</span>

//                       <span><i className="fas fa-map-marker-alt"></i> School Campus</span>

//                     </div>

//                     <p className="event-description">

//                       Join us for an exciting {event.type} on {event.date} at {event.time}

//                     </p>

//                     <div className="event-footer">

//                       <motion.button

//                         className="btn btn-primary"

//                         whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(45, 93, 123, 0.4)" }}

//                         whileTap={{ scale: 0.98 }}

//                         style={{

//                           fontSize: "0.95rem",

//                           padding: "0.35em 1.1em",

//                           minWidth: "unset"

//                         }}

//                         // MODIFICATION HERE: Navigate to an event-specific registration page

//                         onClick={() => navigate(`/events/${event.id}/register`)}

//                       >

//                         Register Now

//                       </motion.button>

//                       <div className="event-reminder">

//                         <i className="far fa-bell"></i>

//                       </div>

//                     </div>

//                   </div>

//                 </motion.div>

//               </div>

//             ))}

//           </div>

//         </motion.section>

//       </motion.main>

//     </div>

//   );

// };

 

// export default Home1;








// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { motion, useAnimation } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import './Home1.css';

// const Home1 = () => {
//   const { t } = useTranslation();

//   useEffect(() => {
//     document.title = t('home.title') + " | NOVYA - Your Smart Learning Platform";
//   }, [t]);

//   const navigate = useNavigate();
//   const [currentCourse, setCurrentCourse] = useState(t('home.currentCourse'));
//   const [upcomingEvents, setUpcomingEvents] = useState([
//     { id: 1, title: t('home.events.scienceWorkshop'), date: t('home.events.dates.oct15'), time: '3:00 PM', type: 'workshop', image: 'https://images.piclumen.com/normal/20250703/14/ffc10f2a812e42cd8b702a792725b8d9.webp' },
//     { id: 2, title: t('home.events.careerGuidance'), date: t('home.events.dates.oct18'), time: '4:30 PM', type: 'seminar', image: 'https://images.piclumen.com/normal/20250703/14/b3c0f0ee7c854054ae648a59a82a9c9a.webp' },
//     { id: 3, title: t('home.events.mathOlympiad'), date: t('home.events.dates.oct22'), time: '10:00 AM', type: 'competition', image: 'https://images.piclumen.com/normal/20250703/14/7c8ecbde0fd3415f848ba00176cd3b25.webp' },
//     { id: 4, title: t('home.events.literatureSeminar'), date: t('home.events.dates.oct25'), time: '2:00 PM', type: 'workshop', image: 'https://images.piclumen.com/normal/20250703/14/08ea6901b2ad491595bc36c122451693.webp' }
//   ]);

//   const coursesByClass = {
//     '7': [
//       { id: 1, title: t('home.courses.class7.math'), progress: 65, category: t('home.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
//       { id: 2, title: t('home.courses.class7.physics'), progress: 45, category: t('home.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
//       { id: 3, title: t('home.courses.class7.english'), progress: 70, category: t('home.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
//       { id: 4, title: t('home.courses.class7.history'), progress: 30, category: t('home.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
//       { id: 5, title: t('home.courses.class7.chemistry'), progress: 25, category: t('home.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
//       { id: 6, title: t('home.courses.class7.computer'), progress: 80, category: t('home.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
//     ],
//     '8': [
//       { id: 1, title: t('home.courses.class8.math'), progress: 70, category: t('home.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
//       { id: 2, title: t('home.courses.class8.physics'), progress: 50, category: t('home.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
//       { id: 3, title: t('home.courses.class8.english'), progress: 75, category: t('home.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
//       { id: 4, title: t('home.courses.class8.history'), progress: 35, category: t('home.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
//       { id: 5, title: t('home.courses.class8.chemistry'), progress: 30, category: t('home.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
//       { id: 6, title: t('home.courses.class8.computer'), progress: 85, category: t('home.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
//     ],
//     '9': [
//       { id: 1, title: t('home.courses.class9.math'), progress: 75, category: t('home.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
//       { id: 2, title: t('home.courses.class9.physics'), progress: 55, category: t('home.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
//       { id: 3, title: t('home.courses.class9.english'), progress: 80, category: t('home.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
//       { id: 4, title: t('home.courses.class9.history'), progress: 40, category: t('home.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
//       { id: 5, title: t('home.courses.class9.chemistry'), progress: 35, category: t('home.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
//       { id: 6, title: t('home.courses.class9.computer'), progress: 90, category: t('home.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
//     ],
//     '10': [
//       { id: 1, title: t('home.courses.class10.math'), progress: 80, category: t('home.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
//       { id: 2, title: t('home.courses.class10.physics'), progress: 60, category: t('home.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
//       { id: 3, title: t('home.courses.class10.english'), progress: 85, category: t('home.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
//       { id: 4, title: t('home.courses.class10.history'), progress: 45, category: t('home.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
//       { id: 5, title: t('home.courses.class10.chemistry'), progress: 40, category: t('home.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
//       { id: 6, title: t('home.courses.class10.computer'), progress: 95, category: t('home.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
//     ]
//   };

//   const statsByClass = {
//     '7': [
//       { value: 8, label: t('home.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
//       { value: 24, label: t('home.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
//       { value: 92, label: t('home.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
//       { value: 15, label: t('home.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
//     ],
//     '8': [
//       { value: 7, label: t('home.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
//       { value: 20, label: t('home.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
//       { value: 88, label: t('home.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
//       { value: 12, label: t('home.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
//     ],
//     '9': [
//       { value: 9, label: t('home.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
//       { value: 28, label: t('home.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
//       { value: 95, label: t('home.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
//       { value: 18, label: t('home.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
//     ],
//     '10': [
//       { value: 6, label: t('home.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
//       { value: 18, label: t('home.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
//       { value: 85, label: t('home.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
//       { value: 10, label: t('home.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
//     ]
//   };

//   const topicsByClass = {
//     '7': t('home.topics.class7', { returnObjects: true }),
//     '8': t('home.topics.class8', { returnObjects: true }),
//     '9': t('home.topics.class9', { returnObjects: true }),
//     '10': t('home.topics.class10', { returnObjects: true })
//   };

//   const [activeClass, setActiveClass] = useState('7');
//   const [allCourses, setAllCourses] = useState(coursesByClass['7']);
//   const [activeTab, setActiveTab] = useState('all');
//   const [featuredCourses, setFeaturedCourses] = useState(coursesByClass['7']);
//   const [currentProgress, setCurrentProgress] = useState(65);
//   const [learningStats, setLearningStats] = useState(statsByClass['7']);
//   const [currentTopics, setCurrentTopics] = useState(topicsByClass['7']);
//   const [isHovered, setIsHovered] = useState(null);
//   const controls = useAnimation();
//   const [ref, inView] = useInView();

//   const subjectMap = {
//     [t('home.categories.mathematics')]: 'Maths',
//     [t('home.categories.science')]: 'Science',
//     [t('home.categories.languages')]: 'English',
//     [t('home.categories.socialStudies')]: 'Social',
//     [t('home.categories.technology')]: 'Computer',
//   };

//   useEffect(() => {
//     setAllCourses(coursesByClass[activeClass]);
//     setCurrentTopics(topicsByClass[activeClass]);
//     setLearningStats(statsByClass[activeClass]);
//     setCurrentCourse(coursesByClass[activeClass][0].title);
//     setCurrentProgress(coursesByClass[activeClass][0].progress);
//   }, [activeClass, t]);

//   useEffect(() => {
//     if (activeTab === 'all') {
//       setFeaturedCourses(allCourses);
//     } else if (activeTab === 'computer') {
//       setFeaturedCourses(allCourses.filter(course => course.category.toLowerCase() === t('home.categories.technology').toLowerCase()));
//     } else {
//       setFeaturedCourses(allCourses.filter(course => course.category.toLowerCase().includes(activeTab.toLowerCase())));
//     }
//   }, [activeTab, allCourses, t]);

//   useEffect(() => {
//     if (inView) {
//       controls.start('visible');
//     }
//   }, [controls, inView]);

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1, delayChildren: 0.3 }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 40, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: 'spring', stiffness: 100, damping: 15 }
//     }
//   };

//   const hoverEffect = {
//     scale: 1.05,
//     boxShadow: "0 15px 30px -10px rgba(45, 93, 123, 0.4)",
//     transition: { duration: 0.3 }
//   };

//   const cardHover = {
//     scale: 1.03,
//     boxShadow: "0 20px 40px -10px rgba(45, 93, 123, 0.3)",
//     transition: { duration: 0.3 }
//   };

//   const textVariants = {
//     hidden: { opacity: 0, x: -30 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: { duration: 0.8, ease: "easeOut" }
//     }
//   };

//   const fadeIn = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { duration: 0.8 }
//     }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.15
//       }
//     }
//   };

//   const heroVariants = {
//     hidden: { opacity: 0, y: 80 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 1, ease: "easeInOut" }
//     }
//   };

//   const pulseAnimation = {
//     scale: [1, 1.05, 1],
//     transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
//   };

//   const floatAnimation = {
//     y: [0, -15, 0],
//     transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
//   };

//   const glowAnimation = {
//     boxShadow: [
//       "0 0 0 0 rgba(166, 45, 105, 0.4)",
//       "0 0 20px 10px rgba(166, 45, 105, 0)",
//       "0 0 0 0 rgba(166, 45, 105, 0.4)"
//     ],
//     transition: { duration: 3, repeat: Infinity }
//   };

//   const rotateAnimation = {
//     rotate: [0, 5, -5, 0],
//     transition: { duration: 0.5 }
//   };

//   return (
//     <div className="home-container">
//       <motion.div
//         className="floating-shape shape-1"
//         animate={{
//           y: [0, -40, 0],
//           x: [0, 20, 0],
//           rotate: [0, 5, 0]
//         }}
//         transition={{
//           duration: 12,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       />
//       <motion.div
//         className="floating-shape shape-2"
//         animate={{
//           y: [0, 30, 0],
//           x: [0, -30, 0],
//           rotate: [0, -8, 0]
//         }}
//         transition={{
//           duration: 15,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 2
//         }}
//       />
//       <motion.div
//         className="floating-shape shape-3"
//         animate={{
//           y: [0, -20, 0],
//           x: [0, 15, 0],
//           rotate: [0, 3, 0]
//         }}
//         transition={{
//           duration: 10,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 1
//         }}
//       />

//       <motion.section
//         className="hero-section"
//         initial="hidden"
//         animate="visible"
//         variants={heroVariants}
//       >
//         <div className="container hero-content">
//           <motion.div
//             className="hero-text"
//             initial="hidden"
//             animate="visible"
//             variants={staggerContainer}
//           >
//             <motion.h1
//               variants={textVariants}
//               transition={{ duration: 0.8 }}
//             >
//               {t('home.hero.title')} <span className="highlight-text">{t('home.hero.highlight')}</span>
//             </motion.h1>
//             <motion.p
//               variants={textVariants}
//               transition={{ duration: 0.8, delay: 0.3 }}
//               className="hero-subtitle"
//             >
//               {t('home.hero.subtitle')}
//             </motion.p>
//             <motion.div
//               variants={textVariants}
//               transition={{ duration: 0.8, delay: 0.6 }}
//               className="hero-buttons"
//             >
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 animate={controls}
//               >
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => navigate(`/learn/class${activeClass}?subject=Maths`)}
//                 >
//                   {t('home.hero.continueLearning')}
//                 </button>
//               </motion.div>

//               {[
//                 { value: "8", label: t('home.stats.activeCourses') },
//                 { value: "92%", label: t('home.stats.averageGrade') },
//                 { value: "15", label: t('home.stats.assignmentsDue') }
//               ].map((stat, index) => (
//                 <motion.div
//                   className="stat-item"
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 1.4 + index * 0.2 }}
//                   whileHover={{ y: -5 }}
//                 >
//                   <div className="stat-value">{stat.value}</div>
//                   <div className="stat-label">{stat.label}</div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </motion.div>

//           <motion.div
//             className="hero-image"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1, delay: 0.5 }}
//             whileHover={pulseAnimation}
//           >
//             <motion.img
//               src="https://illustrations.popsy.co/amber/digital-nomad.svg"
//               alt={t('home.hero.imageAlt')}
//               animate={floatAnimation}
//             />
//             <motion.div
//               className="hero-image-glow"
//               animate={glowAnimation}
//             />
//           </motion.div>
//         </div>
//       </motion.section>

//       <motion.main
//         className="main-content container py-5"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         ref={ref}
//       >
//         <motion.section
//           className="current-learning-section mb-5"
//           variants={itemVariants}
//         >
//           <div className="section-header">
//             <motion.h2
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               {t('home.sections.currentCourse')}
//             </motion.h2>
//           </div>

//           <div className="row g-4">
//             <div className="col-lg-8">
//               <motion.div
//                 className="current-course-card p-4"
//                 whileHover={cardHover}
//                 initial={{ opacity: 0, x: -40 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3, type: 'spring' }}
//               >
//                 <div
//                   className="course-header"
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "12px",
//                     overflow: "visible"
//                   }}
//                 >
//                   <h3 style={{ margin: 0 }}>{currentCourse}</h3>
//                   <motion.span
//                     className="badge"
//                     animate={pulseAnimation}
//                     style={{
//                       fontSize: "1rem",
//                       padding: "0.3em 1.1em",
//                       lineHeight: "1.5",
//                       alignSelf: "flex-start",
//                       whiteSpace: "nowrap"
//                     }}
//                   >
//                     {t('home.active')}
//                   </motion.span>
//                 </div>
//                 <div className="course-meta">
//                   <span><i className="fas fa-chalkboard-teacher"></i> {t('home.instructor')}</span>
//                   <span><i className="fas fa-calendar-alt"></i> {t('home.startDate')}</span>
//                 </div>
//                 <div className="progress-container mt-3">
//                   <div className="progress" style={{ height: '10px' }}>
//                     <motion.div
//                       className="progress-bar"
//                       role="progressbar"
//                       initial={{ width: 0 }}
//                       animate={{ width: `${currentProgress}%` }}
//                       transition={{ duration: 1.5, delay: 0.5, type: 'spring' }}
//                       style={{ backgroundColor: '#A62D69' }}
//                       aria-valuenow={currentProgress}
//                       aria-valuemin="0"
//                       aria-valuemax="100"
//                     ></motion.div>
//                   </div>
//                   <div className="d-flex justify-content-between mt-2">
//                     <span>{currentProgress}% {t('home.complete')}</span>
//                     <span>{t('home.lessonsProgress')}</span>
//                   </div>
//                 </div>
//                 <div className="course-actions mt-4">
//                   <motion.button
//                     className="btn btn-outline"
//                     whileHover={{ scale: 1.03 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => navigate(`/learn/class${activeClass}?subject=Maths`)}
//                   >
//                     {t('home.viewSyllabus')}
//                   </motion.button>
//                 </div>
//                 <div className="course-highlights mt-4">
//                   <h5>{t('home.currentTopics')}</h5>
//                   <ul>
//                     {Array.isArray(currentTopics) ? currentTopics.map((item, index) => (
//                       <motion.li
//                         key={index}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: 0.6 + index * 0.1 }}
//                       >
//                         <i className="fas fa-check-circle"></i> {item}
//                       </motion.li>
//                     )) : <li>{t('home.noTopics')}</li>}
//                   </ul>
//                 </div>
//               </motion.div>
//             </div>

//             <div className="col-lg-4">
//               <motion.div
//                 className="stats-card p-4"
//                 whileHover={cardHover}
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4, type: 'spring' }}
//               >
//                 <h4>{t('home.sections.learningStats')}</h4>
//                 <div className="stats-bargraph">
//                   {learningStats.map((stat, index) => (
//                     <div className="bargraph-item" key={index}>
//                       <div className="bargraph-label">
//                         <i className={`fas fa-${stat.icon}`}></i> {stat.label}
//                         <span className="bargraph-value">{stat.value}{stat.label === t('home.stats.averageGrade') ? '%' : ''}</span>
//                       </div>
//                       <div className="bargraph-bar-bg">
//                         <div
//                           className="bargraph-bar-fill"
//                           style={{
//                             width: `${(stat.value / stat.max) * 100}%`,
//                             background: stat.color
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <motion.div
//                   className="achievement-badge mt-4"
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ delay: 1.1, type: 'spring' }}
//                   whileHover={rotateAnimation}
//                 >
//                   <i className="fas fa-trophy"></i>
//                   <span>{t('home.achievement')}</span>
//                 </motion.div>
//               </motion.div>
//             </div>
//           </div>
//         </motion.section>

//         <motion.section
//           className="featured-courses mb-5"
//           variants={itemVariants}
//         >
//           <div className="section-header">
//             <h2>{t('home.sections.courses')}</h2>
//             <div className="tabs">
//               {['All', 'Mathematics', 'Science', 'Languages', 'Social Studies', 'Computer'].map((tab) => (
//                 <motion.button
//                   key={tab}
//                   className={activeTab === tab.toLowerCase() ? 'active' : ''}
//                   onClick={() => setActiveTab(tab.toLowerCase())}
//                   whileHover={{ scale: 1.05, backgroundColor: activeTab === tab.toLowerCase() ? '#1a3a4f' : '#e9ecef' }}
//                   whileTap={{ scale: 0.95 }}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                 >
//                   {t(`home.tabs.${tab.toLowerCase()}`)}
//                 </motion.button>
//               ))}
//             </div>
//           </div>
//           <div className="tabs">
//             {['7', '8', '9', '10'].map((cls) => (
//               <motion.button
//                 key={cls}
//                 className={activeClass === cls ? 'active' : ''}
//                 onClick={() => setActiveClass(cls)}
//                 whileHover={{ scale: 1.05, backgroundColor: activeClass === cls ? '#1a3a4f' : '#e9ecef' }}
//                 whileTap={{ scale: 0.95 }}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 {t('home.class', { class: cls })}
//               </motion.button>
//             ))}
//           </div>
//           <br />
//           <div className="row g-4">
//             {featuredCourses.map((course, index) => (
//               <div className="col-md-4" key={course.id}>
//                 <motion.div
//                   className="featured-course-card"
//                   whileHover={cardHover}
//                   initial={{ opacity: 0, y: 40 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1, type: 'spring' }}
//                   onHoverStart={() => setIsHovered(course.id)}
//                   onHoverEnd={() => setIsHovered(null)}
//                 >
//                   <div className="course-image">
//                     <img src={course.image} alt={course.title} />
//                     <div className="course-category">{course.category}</div>
//                     {isHovered === course.id && (
//                       <motion.div
//                         className="course-hover-overlay"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                       ></motion.div>
//                     )}
//                   </div>
//                   <div className="course-content p-4">
//                     <h3>{course.title}</h3>
//                     <div className="progress-container mt-3">
//                       <div className="progress" style={{ height: '6px' }}>
//                         <motion.div
//                           className="progress-bar"
//                           role="progressbar"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${course.progress}%` }}
//                           transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
//                           style={{ backgroundColor: '#2D5D7B' }}
//                         ></motion.div>
//                       </div>
//                       <span className="mt-2 d-block">{course.progress}% {t('home.complete')}</span>
//                     </div>
//                     <div className="course-meta mt-3">
//                       <span><i className="fas fa-book-open"></i> {t('home.lessons')}</span>
//                       <span><i className="fas fa-clock"></i> {t('home.hours')}</span>
//                     </div>
//                     <motion.button
//                       className="btn btn-primary w-100 mt-3"
//                       whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(45, 93, 123, 0.4)" }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => navigate(`/learn/class${activeClass}?subject=${subjectMap[course.category]}`)}
//                     >
//                       {t('home.continue')}
//                     </motion.button>
//                   </div>
//                 </motion.div>
//               </div>
//             ))}
//           </div>
//         </motion.section>

//         <motion.section
//           className="events-section mb-5"
//           variants={itemVariants}
//         >
//           <div className="section-header">
//             <h2>{t('home.sections.events')}</h2>
//           </div>
//           <div className="row g-4">
//             {upcomingEvents.map((event, index) => (
//               <div className="col-lg-3 col-md-6" key={event.id}>
//                 <motion.div
//                   className="event-card"
//                   whileHover="hover"
//                   initial={{ opacity: 0, y: 40 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1, type: 'spring' }}
//                   variants={{
//                     hover: {
//                       y: -10,
//                       boxShadow: "0 25px 50px -10px rgba(45, 93, 123, 0.3)",
//                       transition: { duration: 0.3 }
//                     }
//                   }}
//                 >
//                   <div className="event-image">
//                     <img src={event.image} alt={event.title} />
//                     <div className={`event-type ${event.type}`}>
//                       {t(`home.eventTypes.${event.type}`)}
//                     </div>
//                   </div>
//                   <div className="event-content p-4">
//                     <div className="event-date">
//                       <span className="day">{event.date.split(' ')[1].replace(',', '')}</span>
//                       <span className="month">{event.date.split(' ')[0]}</span>
//                     </div>
//                     <h3>{event.title}</h3>
//                     <div className="event-meta">
//                       <span><i className="far fa-clock"></i> {event.time}</span>
//                       <span><i className="fas fa-map-marker-alt"></i> {t('home.eventLocation')}</span>
//                     </div>
//                     <p className="event-description">
//                       {t('home.eventDescription', { type: t(`home.eventTypes.${event.type}`), date: event.date, time: event.time })}
//                     </p>
//                     <div className="event-footer">
//                       <motion.button
//                         className="btn btn-primary"
//                         whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(45, 93, 123, 0.4)" }}
//                         whileTap={{ scale: 0.98 }}
//                         style={{
//                           fontSize: "0.95rem",
//                           padding: "0.35em 1.1em",
//                           minWidth: "unset"
//                         }}
//                         onClick={() => navigate(`/events/${event.id}/register`)}
//                       >
//                         {t('home.register')}
//                       </motion.button>
//                       <div className="event-reminder">
//                         <i className="far fa-bell"></i>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               </div>
//             ))}
//           </div>
//         </motion.section>
//       </motion.main>
//     </div>
//   );
// };

// export default Home1;










import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStudentPerformance } from '../../utils/quizTracking';
import './Home1.css';

const Home1 = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('dashboard.title') + " | NOVYA - Your Smart Learning Platform";
  }, [t]);

  // Fetch user data from localStorage
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    let storedData = null;
    
    if (userRole === 'student') {
      storedData = localStorage.getItem('studentData');
    } else if (userRole === 'parent') {
      storedData = localStorage.getItem('parentData');
    }
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const navigate = useNavigate();
  const [currentCourse, setCurrentCourse] = useState(t('dashboard.currentCourse'));
  const [userData, setUserData] = useState(null);

  const coursesByClass = {
    '7': [
      { id: 1, title: t('dashboard.courses.class7.math'), progress: 65, category: t('dashboard.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
      { id: 2, title: t('dashboard.courses.class7.physics'), progress: 45, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
      { id: 3, title: t('dashboard.courses.class7.english'), progress: 70, category: t('dashboard.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
      { id: 4, title: t('dashboard.courses.class7.history'), progress: 30, category: t('dashboard.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
      { id: 5, title: t('dashboard.courses.class7.chemistry'), progress: 25, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
      { id: 6, title: t('dashboard.courses.class7.computer'), progress: 80, category: t('dashboard.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
    ],
    '8': [
      { id: 1, title: t('dashboard.courses.class8.math'), progress: 70, category: t('dashboard.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
      { id: 2, title: t('dashboard.courses.class8.physics'), progress: 50, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
      { id: 3, title: t('dashboard.courses.class8.english'), progress: 75, category: t('dashboard.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
      { id: 4, title: t('dashboard.courses.class8.history'), progress: 35, category: t('dashboard.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
      { id: 5, title: t('dashboard.courses.class8.chemistry'), progress: 30, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
      { id: 6, title: t('dashboard.courses.class8.computer'), progress: 85, category: t('dashboard.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
    ],
    '9': [
      { id: 1, title: t('dashboard.courses.class9.math'), progress: 75, category: t('dashboard.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
      { id: 2, title: t('dashboard.courses.class9.physics'), progress: 55, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
      { id: 3, title: t('dashboard.courses.class9.english'), progress: 80, category: t('dashboard.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
      { id: 4, title: t('dashboard.courses.class9.history'), progress: 40, category: t('dashboard.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
      { id: 5, title: t('dashboard.courses.class9.chemistry'), progress: 35, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
      { id: 6, title: t('dashboard.courses.class9.computer'), progress: 90, category: t('dashboard.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
    ],
    '10': [
      { id: 1, title: t('dashboard.courses.class10.math'), progress: 80, category: t('dashboard.categories.mathematics'), image: 'https://images.piclumen.com/normal/20250703/13/8d165eddc71142118d4122267d70f935.webp' },
      { id: 2, title: t('dashboard.courses.class10.physics'), progress: 60, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/bbe702fae3f24484a539808f7d5945c3.webp' },
      { id: 3, title: t('dashboard.courses.class10.english'), progress: 85, category: t('dashboard.categories.languages'), image: 'https://images.piclumen.com/normal/20250703/13/628bb4e5d4d949218ed1bf18674ea5e9.webp' },
      { id: 4, title: t('dashboard.courses.class10.history'), progress: 45, category: t('dashboard.categories.socialStudies'), image: 'https://images.piclumen.com/normal/20250703/13/ad70cd8ae379446fa8a024dadc66d2ce.webp' },
      { id: 5, title: t('dashboard.courses.class10.chemistry'), progress: 40, category: t('dashboard.categories.science'), image: 'https://images.piclumen.com/normal/20250703/13/6fd3ce336b4a4bd1a940573ba82618fe.webp' },
      { id: 6, title: t('dashboard.courses.class10.computer'), progress: 95, category: t('dashboard.categories.technology'), image: 'https://images.piclumen.com/normal/20250703/14/de85ebdcf04345859b4a9b29f2deea94.webp' }
    ]
  };

  const statsByClass = {
    '7': [
      { value: 8, label: t('dashboard.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
      { value: 24, label: t('dashboard.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
      { value: 92, label: t('dashboard.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
      { value: 15, label: t('dashboard.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
    ],
    '8': [
      { value: 7, label: t('dashboard.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
      { value: 20, label: t('dashboard.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
      { value: 88, label: t('dashboard.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
      { value: 12, label: t('dashboard.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
    ],
    '9': [
      { value: 9, label: t('dashboard.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
      { value: 28, label: t('dashboard.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
      { value: 95, label: t('dashboard.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
      { value: 18, label: t('dashboard.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
    ],
    '10': [
      { value: 6, label: t('dashboard.stats.activeCourses'), icon: 'book', max: 10, color: '#2D5D7B' },
      { value: 18, label: t('dashboard.stats.hoursThisWeek'), icon: 'clock', max: 40, color: '#A62D69' },
      { value: 85, label: t('dashboard.stats.averageGrade'), icon: 'chart-line', max: 100, color: '#F9A826' },
      { value: 10, label: t('dashboard.stats.assignmentsDue'), icon: 'tasks', max: 20, color: '#009688' }
    ]
  };

  const topicsByClass = {
    '7': t('dashboard.topics.class7', { returnObjects: true }),
    '8': t('dashboard.topics.class8', { returnObjects: true }),
    '9': t('dashboard.topics.class9', { returnObjects: true }),
    '10': t('dashboard.topics.class10', { returnObjects: true })
  };

  const [activeClass, setActiveClass] = useState('7');
  const [allCourses, setAllCourses] = useState(coursesByClass['7']);
  const [activeTab, setActiveTab] = useState('all');
  const [featuredCourses, setFeaturedCourses] = useState(coursesByClass['7']);
  const [currentProgress, setCurrentProgress] = useState(65);
  const [learningStats, setLearningStats] = useState(statsByClass['7']);
  const [currentTopics, setCurrentTopics] = useState(topicsByClass['7']);
  const [isHovered, setIsHovered] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [mockTestData, setMockTestData] = useState(null);
  const controls = useAnimation();
  const [ref, inView] = useInView();

  const subjectMap = {
    [t('dashboard.categories.mathematics')]: 'Maths',
    [t('dashboard.categories.science')]: 'Science',
    [t('dashboard.categories.languages')]: 'English',
    [t('dashboard.categories.socialStudies')]: 'Social',
    [t('dashboard.categories.technology')]: 'Computer',
  };

  useEffect(() => {
    setAllCourses(coursesByClass[activeClass]);
    setCurrentTopics(topicsByClass[activeClass]);
    setLearningStats(statsByClass[activeClass]);
    setCurrentCourse(coursesByClass[activeClass][0].title);
    setCurrentProgress(coursesByClass[activeClass][0].progress);
  }, [activeClass, t]);

  // Fetch quiz and mock test statistics
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        console.log('🔍 Debug - Home page fetching performance data...');
        const { getRecentQuizAttempts } = await import('../../utils/quizTracking');
        const attemptsData = await getRecentQuizAttempts();
        console.log('🔍 Debug - Attempts data received:', attemptsData);
        
        if (attemptsData && attemptsData.attempts) {
          const attempts = attemptsData.attempts;
          
          // Calculate quiz average
          const quizAttempts = attempts.filter(attempt => attempt.type === 'quiz');
          const quizScores = quizAttempts.map(attempt => attempt.score || 0);
          const quizAvg = quizScores.length > 0 ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length : 0;
          
          // Calculate mock test average
          const mockTestAttempts = attempts.filter(attempt => attempt.type === 'mock_test');
          const mockTestScores = mockTestAttempts.map(attempt => attempt.score || 0);
          const mockTestAvg = mockTestScores.length > 0 ? mockTestScores.reduce((sum, score) => sum + score, 0) / mockTestScores.length : 0;
          
          console.log('🔍 Debug - Quiz average:', quizAvg);
          console.log('🔍 Debug - Mock test average:', mockTestAvg);
          
          setQuizData({ average_score: quizAvg });
          setMockTestData({ average_score: mockTestAvg });
          
          // Update learning stats with real data
          const updatedStats = [...statsByClass[activeClass]];
          console.log('🔍 Debug - Original stats:', updatedStats);
          
          // Update "Average Grade" to "Quiz Average" with real quiz data
          const quizAverageIndex = updatedStats.findIndex(stat => stat.label === t('dashboard.stats.averageGrade'));
          console.log('🔍 Debug - Quiz average index:', quizAverageIndex);
          if (quizAverageIndex !== -1) {
            updatedStats[quizAverageIndex] = {
              ...updatedStats[quizAverageIndex],
              label: 'Quiz Average',
              value: Math.round(quizAvg * 10) / 10, // Round to 1 decimal place
              icon: 'chart-line'
            };
            console.log('🔍 Debug - Updated quiz stat:', updatedStats[quizAverageIndex]);
          }
          
          // Update "Assignments Due" to "Mock Test Average" with real mock test data
          const mockTestAverageIndex = updatedStats.findIndex(stat => stat.label === t('dashboard.stats.assignmentsDue'));
          console.log('🔍 Debug - Mock test average index:', mockTestAverageIndex);
          if (mockTestAverageIndex !== -1) {
            updatedStats[mockTestAverageIndex] = {
              ...updatedStats[mockTestAverageIndex],
              label: 'Mock Test Average',
              value: Math.round(mockTestAvg * 10) / 10, // Round to 1 decimal place
              icon: 'clock',
              max: 100
            };
            console.log('🔍 Debug - Updated mock test stat:', updatedStats[mockTestAverageIndex]);
          }
          
          console.log('🔍 Debug - Final updated stats:', updatedStats);
          setLearningStats(updatedStats);
        } else {
          console.log('🔍 Debug - No performance data received');
        }
      } catch (error) {
        console.error('❌ Error fetching quiz attempts data:', error);
      }
    };

    fetchQuizData();
    
    // Refetch data when window regains focus (user returns to tab)
    const handleFocus = () => {
      console.log('🔄 Window focused - refetching performance data...');
      fetchQuizData();
    };
    
    // Also refetch data every 30 seconds to ensure it's up to date
    const intervalId = setInterval(() => {
      console.log('🔄 Auto-refresh - refetching performance data...');
      fetchQuizData();
    }, 30000);
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, [activeClass, t]);

  useEffect(() => {
    if (activeTab === 'all') {
      setFeaturedCourses(allCourses);
    } else if (activeTab === 'computer') {
      setFeaturedCourses(allCourses.filter(course => course.category.toLowerCase() === t('dashboard.categories.technology').toLowerCase()));
    } else {
      setFeaturedCourses(allCourses.filter(course => course.category.toLowerCase().includes(activeTab.toLowerCase())));
    }
  }, [activeTab, allCourses, t]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const hoverEffect = {
    scale: 1.05,
    boxShadow: "0 15px 30px -10px rgba(45, 93, 123, 0.4)",
    transition: { duration: 0.3 }
  };

  const cardHover = {
    scale: 1.03,
    boxShadow: "0 20px 40px -10px rgba(45, 93, 123, 0.3)",
    transition: { duration: 0.3 }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeInOut" }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
  };

  const floatAnimation = {
    y: [0, -15, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  };

  const glowAnimation = {
    boxShadow: [
      "0 0 0 0 rgba(166, 45, 105, 0.4)",
      "0 0 20px 10px rgba(166, 45, 105, 0)",
      "0 0 0 0 rgba(166, 45, 105, 0.4)"
    ],
    transition: { duration: 3, repeat: Infinity }
  };

  const rotateAnimation = {
    rotate: [0, 5, -5, 0],
    transition: { duration: 0.5 }
  };

  return (
    <div className="home-container">
      <motion.div
        className="floating-shape shape-1"
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="floating-shape shape-2"
        animate={{
          y: [0, 30, 0],
          x: [0, -30, 0],
          rotate: [0, -8, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="floating-shape shape-3"
        animate={{
          y: [0, -20, 0],
          x: [0, 15, 0],
          rotate: [0, 3, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <motion.section
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="container hero-content">
          <motion.div
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              variants={textVariants}
              transition={{ duration: 0.8 }}
            >
              {t('dashboard.hero.title')} <span className="highlight-text">{t('dashboard.hero.highlight')}</span>
            </motion.h1>
            <motion.p
              variants={textVariants}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hero-subtitle"
            >
              {t('dashboard.hero.subtitle')}
            </motion.p>
            <motion.div
              variants={textVariants}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hero-buttons"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={controls}
              >
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/learn/class${activeClass}?subject=Maths`)}
                >
                  {t('dashboard.hero.continueLearning')}
                </button>
              </motion.div>

              {[
                { value: "8", label: t('dashboard.stats.activeCourses') },
                { value: "92%", label: t('dashboard.stats.averageGrade') },
                { value: "15", label: t('dashboard.stats.assignmentsDue') }
              ].map((stat, index) => (
                <motion.div
                  className="stat-item"
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            whileHover={pulseAnimation}
          >
            <motion.img
              src="https://illustrations.popsy.co/amber/digital-nomad.svg"
              alt={t('dashboard.hero.imageAlt')}
              animate={floatAnimation}
            />
            <motion.div
              className="hero-image-glow"
              animate={glowAnimation}
            />
          </motion.div>
        </div>
      </motion.section>

      <motion.main
        className="main-content container py-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        ref={ref}
      >
        <motion.section
          className="current-learning-section mb-5"
          variants={itemVariants}
        >
          <div className="section-header">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t('dashboard.sections.currentCourse')}
            </motion.h2>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <motion.div
                className="current-course-card p-4"
                whileHover={cardHover}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <div
                  className="course-header"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    overflow: "visible"
                  }}
                >
                  <h3 style={{ margin: 0 }}>
                    {userData && userData.grade && userData.course 
                      ? `${userData.course} Grade ${userData.grade}` 
                      : currentCourse}
                  </h3>
                  <motion.span
                    className="badge"
                    animate={pulseAnimation}
                    style={{
                      fontSize: "1rem",
                      padding: "0.3em 1.1em",
                      lineHeight: "1.5",
                      alignSelf: "flex-start",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {t('dashboard.active')}
                  </motion.span>
                </div>
                <div className="course-meta">
                  <span><i className="fas fa-user"></i> Student: {userData && userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : 'Student Name'}</span>
                  <span><i className="fas fa-calendar-alt"></i> {t('dashboard.startDate')}</span>
                </div>
                <div className="progress-container mt-3">
                  <div className="progress" style={{ height: '10px' }}>
                    <motion.div
                      className="progress-bar"
                      role="progressbar"
                      initial={{ width: 0 }}
                      animate={{ width: `${currentProgress}%` }}
                      transition={{ duration: 1.5, delay: 0.5, type: 'spring' }}
                      style={{ backgroundColor: '#A62D69' }}
                      aria-valuenow={currentProgress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></motion.div>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <span>{currentProgress}% {t('dashboard.complete')}</span>
                    <span>{t('dashboard.lessonsProgress')}</span>
                  </div>
                </div>
                <div className="course-actions mt-4">
                  <motion.button
                    className="btn btn-outline"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/learn/class${activeClass}?subject=Maths`)}
                  >
                    {t('dashboard.viewSyllabus')}
                  </motion.button>
                </div>
                <div className="course-highlights mt-4">
                  <h5>{t('dashboard.currentTopics')}</h5>
                  <ul>
                    {Array.isArray(currentTopics) ? currentTopics.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <i className="fas fa-check-circle"></i> {item}
                      </motion.li>
                    )) : <li>{t('dashboard.noTopics')}</li>}
                  </ul>
                </div>
              </motion.div>
            </div>

            <div className="col-lg-4">
              <motion.div
                className="stats-card p-4"
                whileHover={cardHover}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                <h4>{t('dashboard.sections.learningStats')}</h4>
                <div className="stats-bargraph">
                  {learningStats.map((stat, index) => (
                    <div className="bargraph-item" key={index}>
                      <div className="bargraph-label">
                        <i className={`fas fa-${stat.icon}`}></i> {stat.label}
                        <span className="bargraph-value">{stat.value}{stat.label === t('dashboard.stats.averageGrade') || stat.label === 'Quiz Average' || stat.label === 'Mock Test Average' ? '%' : ''}</span>
                      </div>
                      <div className="bargraph-bar-bg">
                        <div
                          className="bargraph-bar-fill"
                          style={{
                            width: `${(stat.value / stat.max) * 100}%`,
                            background: stat.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <motion.div
                  className="achievement-badge mt-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1, type: 'spring' }}
                  whileHover={rotateAnimation}
                >
                  <i className="fas fa-trophy"></i>
                  <span>{t('dashboard.achievement')}</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="featured-courses mb-5"
          variants={itemVariants}
        >
          <div className="section-header">
            <h2>{t('dashboard.sections.courses')}</h2>
            <div className="tabs">
              {['All', 'Mathematics', 'Science', 'Languages', 'Social Studies', 'Computer'].map((tab) => (
                <motion.button
                  key={tab}
                  className={activeTab === tab.toLowerCase() ? 'active' : ''}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  whileHover={{ scale: 1.05, backgroundColor: activeTab === tab.toLowerCase() ? '#1a3a4f' : '#e9ecef' }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {t(`dashboard.tabs.${tab.toLowerCase()}`)}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="tabs">
            {['7', '8', '9', '10'].map((cls) => (
              <motion.button
                key={cls}
                className={activeClass === cls ? 'active' : ''}
                onClick={() => setActiveClass(cls)}
                whileHover={{ scale: 1.05, backgroundColor: activeClass === cls ? '#1a3a4f' : '#e9ecef' }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t('dashboard.class', { class: cls })}
              </motion.button>
            ))}
          </div>
          <br />
          <div className="row g-4">
            {featuredCourses.map((course, index) => (
              <div className="col-md-4" key={course.id}>
                <motion.div
                  className="featured-course-card"
                  whileHover={cardHover}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  onHoverStart={() => setIsHovered(course.id)}
                  onHoverEnd={() => setIsHovered(null)}
                >
                  <div className="course-image">
                    <img src={course.image} alt={course.title} />
                    <div className="course-category">{course.category}</div>
                    {isHovered === course.id && (
                      <motion.div
                        className="course-hover-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></motion.div>
                    )}
                  </div>
                  <div className="course-content p-4">
                    <h3>{course.title}</h3>
                    <div className="progress-container mt-3">
                      <div className="progress" style={{ height: '6px' }}>
                        <motion.div
                          className="progress-bar"
                          role="progressbar"
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          style={{ backgroundColor: '#2D5D7B' }}
                        ></motion.div>
                      </div>
                      <span className="mt-2 d-block">{course.progress}% {t('dashboard.complete')}</span>
                    </div>
                    <div className="course-meta mt-3">
                      <span><i className="fas fa-book-open"></i> {t('dashboard.lessons')}</span>
                      <span><i className="fas fa-clock"></i> {t('dashboard.hours')}</span>
                    </div>
                    <motion.button
                      className="btn btn-primary w-100 mt-3"
                      whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(45, 93, 123, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/learn/class${activeClass}?subject=${subjectMap[course.category]}`)}
                    >
                      {t('dashboard.continue')}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
};

export default Home1;