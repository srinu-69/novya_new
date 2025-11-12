

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Set this to match your actual navbar height
// const NAVBAR_HEIGHT = '80px';

// function Courses() {
//   useEffect(() => {
//     document.title = "Courses|NOVYA - Your Smart Learning Platform";
//   }, []);

//   const navigate = useNavigate();
//   const [activeCategory, setActiveCategory] = useState('all');

//   const handleExploreClick = (courseId) => {
//     // Show toast for courses except School Education (id: 1)
//     if (courseId !== 1) {
//       toast.info("🚀 Coming Soon! This course will be available shortly.", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "colored",
//       });
//       return;
//     }

//     localStorage.setItem('scrollToCourses', 'true');
//     navigate('/pricing');
//   };

//   const courseData = [
//     {
//       id: 1,
//       title: '📚 School Education 7-12 class',
//       category: 'academic',
//       subjects: [' Maths', 'Science', 'English', 'Social', 'Computer'],
//       images: [
//         'https://images.piclumen.com/normal/20250711/19/11427e802c8b41eaa440cfc27f27eac9.webp',
//         'https://snu.edu.in/site/assets/files/16749/computerscienceandengineering.1600x0.webp',
//         'https://images.piclumen.com/normal/20250711/19/8cf4f2439f074fb7ad5f5444d2bcacda.webp'
//       ]
//     },
//     {
//       id: 2,
//       title: '⚙️ Engineering',
//       category: 'academic',
//       subjects: ['Computer Science', 'Artificial Intelligence & Machine Learning (AI & ML)', 'Cybersecurity & Ethical Hacking', 'Cloud Computing'],
//       images: [
//         'https://images.piclumen.com/normal/20250711/20/239b7df218024472a4e8505a966c1f8e.webp',
//         'https://images.piclumen.com/normal/20250711/20/063f479b49d045cfb7bae791d8e0c318.webp',
//         'https://images.piclumen.com/normal/20250711/20/abac3bc7a2c0466d83df930c2f7f472f.webp'
//       ]
//     },
//     {
//       id: 3,
//       title: '💻 Software Development',
//       category: 'professional',
//       subjects: ['Python Programming', 'Web Development', 'Mobile App Development', 'Data Science', 'Cloud Computing'],
//       images: [
//         'https://images.piclumen.com/normal/20250711/20/e67d65525fc845f5b0158686de7a1f69.webp',
//         'https://images.piclumen.com/normal/20250711/20/b1e7f235ce0f4993a37d4aa105e24950.webp',
//         'https://images.piclumen.com/normal/20250711/20/7419f505c07646c99b379c4abe3750dc.webp'
//       ]
//     },
//     {
//       id: 4,
//       title: '🏨 Hotel Management',
//       category: 'professional',
//       subjects: ['Front Office Operations', 'Housekeeping Management', 'Food Production', 'Food & Beverage Service', 'Hotel Accounting'],
//       images: [
//         'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1470&q=80',
//         'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1632&q=80',
//         'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1470&q=80'
//       ]
//     },
//     {
//       id: 5,
//       title: '🎓 Certifications',
//       category: 'professional',
//       subjects: ['AWS Certification', 'Microsoft Certifications', 'Cisco Certifications', 'Digital Marketing', 'Project Management'],
//       images: [
//         'https://images.piclumen.com/normal/20250711/20/b1e7f235ce0f4993a37d4aa105e24950.webp',
//         'https://images.piclumen.com/normal/20250711/20/bb93d7160db44e87989b2b390db3e827.webp',
//         'https://images.piclumen.com/normal/20250711/20/6c6b66a5c33447f2a71f9b519da18456.webp'
//       ]
//     }
//   ];

//   const filteredCourses = activeCategory === 'all' 
//     ? courseData 
//     : courseData.filter(course => course.category === activeCategory);

//   return (
//     <div 
//       className="page-content-wrapper"
//       style={{
//         paddingTop: NAVBAR_HEIGHT,
//         minHeight: `calc(100vh - ${NAVBAR_HEIGHT})`
//       }}
//     >
//       <section
//         className="py-5"
//         style={{
//           background: 'linear-gradient(135deg, #f0f9ff 0%, #e1f5fe 100%)',
//           fontFamily: `'Poppins', sans-serif`
//         }}
//       >
//         <div className="container">
//           <h2
//             className="text-center fw-bold mb-3"
//             style={{ color: '#2D5D7B', fontSize: '2.5rem' }}
//           >
//             Explore Our Courses
//           </h2>

//           <h5 className="text-center mb-4" style={{ color: '#4a6b8a' }}>
//             Professional Courses: Software Development & Hotel Management
//           </h5>

//           <div className="d-flex justify-content-center mb-5">
//             <div className="btn-group" role="group">
//               <button 
//                 type="button" 
//                 className={`btn ${activeCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
//                 onClick={() => setActiveCategory('all')}
//               >
//                 All Courses
//               </button>
//               <button 
//                 type="button" 
//                 className={`btn ${activeCategory === 'academic' ? 'btn-primary' : 'btn-outline-primary'}`}
//                 onClick={() => setActiveCategory('academic')}
//               >
//                 Academic
//               </button>
//               <button 
//                 type="button" 
//                 className={`btn ${activeCategory === 'professional' ? 'btn-primary' : 'btn-outline-primary'}`}
//                 onClick={() => setActiveCategory('professional')}
//               >
//                 Professional
//               </button>
//             </div>
//           </div>

//           <div className="row g-4">
//             {filteredCourses.map(course => (
//               <div className="col-md-4" key={course.id}>
//                 <div className="course-card shadow-sm">
//                   <div className="course-slider">
//                     <div className="slide-track">
//                       {[...course.images, ...course.images].map((img, i) => (
//                         <div className="slide" key={i}>
//                           <img src={img} alt="course" />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="p-4">
//                     <h5 className="fw-bold" style={{ color: '#1e88e5' }}>
//                       {course.title}
//                     </h5>
//                     <ul className="list-unstyled ps-3 mt-3">
//                       {course.subjects.map((s, idx) => (
//                        <li key={idx} style={{ fontSize: '1rem', color: 'black' }}>
//                           ⭐ {s}
//                         </li>
//                       ))}
//                     </ul>
//                     <button
//                       onClick={() => handleExploreClick(course.id)}
//                       className="btn btn-primary mt-3 w-100"
//                       style={{
//                         background: 'linear-gradient(90deg, #1e88e5, #0d47a1)',
//                         border: 'none',
//                         borderRadius: '12px',
//                         fontWeight: 600
//                       }}
//                     >
//                       Explore Courses
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Inline slider CSS */}
//         <style>{`
//           .course-card { 
//             background: white; 
//             border-radius: 18px; 
//             overflow: hidden; 
//             transition: transform 0.3s; 
//           }
//           .course-card:hover { 
//             transform: scale(1.02); 
//           }
//           .course-slider { 
//             height: 200px; 
//             overflow: hidden; 
//             position: relative; 
//           }
//           .slide-track { 
//             display: flex; 
//             width: 200%; 
//             animation: scrollX 18s linear infinite; 
//           }
//           .course-card:hover .slide-track { 
//             animation-play-state: paused; 
//           }
//           .slide { 
//             flex: 0 0 33.33%; 
//           }
//           .slide img { 
//             width: 100%; 
//             height: 200px; 
//             object-fit: cover; 
//             transition: transform 0.3s ease-in-out; 
//           }
//           .slide img:hover { 
//             transform: scale(1.1); 
//           }
//           @keyframes scrollX { 
//             0% { transform: translateX(0%); } 
//             100% { transform: translateX(-50%); } 
//           }
//           html { 
//             scroll-padding-top: ${NAVBAR_HEIGHT}; 
//           }
//         `}</style>
//       </section>
//       {/* Toast container must be inside JSX */}
//       <ToastContainer />
//     </div>
//   );
// }

// export default Courses;







import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set this to match your actual navbar height
const NAVBAR_HEIGHT = '80px';

function Courses() {
  const { t } = useTranslation();
  
  useEffect(() => {
    document.title = `${t('courses.title')} | NOVYA - Your Smart Learning Platform`;
  }, [t]);

  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const handleExploreClick = (courseId) => {
    // Show toast for courses except School Education (id: 1)
    if (courseId !== 1) {
      toast.info(t('courses.comingSoonToast'), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    localStorage.setItem('scrollToCourses', 'true');
    navigate('/pricing');
  };

  const courseData = [
    {
      id: 1,
      title: t('courses.schoolEducation.title'),
      category: 'academic',
      subjects: [
        t('courses.schoolEducation.subjects.maths'),
        t('courses.schoolEducation.subjects.science'),
        t('courses.schoolEducation.subjects.english'),
        t('courses.schoolEducation.subjects.social'),
        t('courses.schoolEducation.subjects.computer')
      ],
      images: [
        'https://images.piclumen.com/normal/20250711/19/11427e802c8b41eaa440cfc27f27eac9.webp',
        'https://snu.edu.in/site/assets/files/16749/computerscienceandengineering.1600x0.webp',
        'https://images.piclumen.com/normal/20250711/19/8cf4f2439f074fb7ad5f5444d2bcacda.webp'
      ]
    },
    {
      id: 2,
      title: t('courses.engineering.title'),
      category: 'academic',
      subjects: [
        t('courses.engineering.subjects.computerScience'),
        t('courses.engineering.subjects.aiMl'),
        t('courses.engineering.subjects.cybersecurity'),
        t('courses.engineering.subjects.cloudComputing')
      ],
      images: [
        'https://images.piclumen.com/normal/20250711/20/239b7df218024472a4e8505a966c1f8e.webp',
        'https://images.piclumen.com/normal/20250711/20/063f479b49d045cfb7bae791d8e0c318.webp',
        'https://images.piclumen.com/normal/20250711/20/abac3bc7a2c0466d83df930c2f7f472f.webp'
      ]
    },
    {
      id: 3,
      title: t('courses.softwareDevelopment.title'),
      category: 'professional',
      subjects: [
        t('courses.softwareDevelopment.subjects.python'),
        t('courses.softwareDevelopment.subjects.webDev'),
        t('courses.softwareDevelopment.subjects.mobileApp'),
        t('courses.softwareDevelopment.subjects.dataScience'),
        t('courses.softwareDevelopment.subjects.cloudComputing')
      ],
      images: [
        'https://images.piclumen.com/normal/20250711/20/e67d65525fc845f5b0158686de7a1f69.webp',
        'https://images.piclumen.com/normal/20250711/20/b1e7f235ce0f4993a37d4aa105e24950.webp',
        'https://images.piclumen.com/normal/20250711/20/7419f505c07646c99b379c4abe3750dc.webp'
      ]
    },
    {
      id: 4,
      title: t('courses.hotelManagement.title'),
      category: 'professional',
      subjects: [
        t('courses.hotelManagement.subjects.frontOffice'),
        t('courses.hotelManagement.subjects.housekeeping'),
        t('courses.hotelManagement.subjects.foodProduction'),
        t('courses.hotelManagement.subjects.foodService'),
        t('courses.hotelManagement.subjects.hotelAccounting')
      ],
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1632&q=80',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1470&q=80'
      ]
    },
    {
      id: 5,
      title: t('courses.certifications.title'),
      category: 'professional',
      subjects: [
        t('courses.certifications.subjects.aws'),
        t('courses.certifications.subjects.microsoft'),
        t('courses.certifications.subjects.cisco'),
        t('courses.certifications.subjects.digitalMarketing'),
        t('courses.certifications.subjects.projectManagement')
      ],
      images: [
        'https://images.piclumen.com/normal/20250711/20/b1e7f235ce0f4993a37d4aa105e24950.webp',
        'https://images.piclumen.com/normal/20250711/20/bb93d7160db44e87989b2b390db3e827.webp',
        'https://images.piclumen.com/normal/20250711/20/6c6b66a5c33447f2a71f9b519da18456.webp'
      ]
    }
  ];

  const filteredCourses = activeCategory === 'all' 
    ? courseData 
    : courseData.filter(course => course.category === activeCategory);

  return (
    <div 
      className="page-content-wrapper"
      style={{
        paddingTop: NAVBAR_HEIGHT,
        minHeight: `calc(100vh - ${NAVBAR_HEIGHT})`
      }}
    >
      <section
        className="py-5"
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e1f5fe 100%)',
          fontFamily: `'Poppins', sans-serif`
        }}
      >
        <div className="container">
          <h2
            className="text-center fw-bold mb-3"
            style={{ color: '#2D5D7B', fontSize: '2.5rem' }}
          >
            {t('courses.exploreTitle')}
          </h2>

          <h5 className="text-center mb-4" style={{ color: '#4a6b8a' }}>
            {t('courses.professionalSubtitle')}
          </h5>

          <div className="d-flex justify-content-center mb-5">
            <div className="btn-group" role="group">
              <button 
                type="button" 
                className={`btn ${activeCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveCategory('all')}
              >
                {t('courses.tabs.all')}
              </button>
              <button 
                type="button" 
                className={`btn ${activeCategory === 'academic' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveCategory('academic')}
              >
                {t('courses.tabs.academic')}
              </button>
              <button 
                type="button" 
                className={`btn ${activeCategory === 'professional' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveCategory('professional')}
              >
                {t('courses.tabs.professional')}
              </button>
            </div>
          </div>

          <div className="row g-4">
            {filteredCourses.map(course => (
              <div className="col-md-4" key={course.id}>
                <div className="course-card shadow-sm">
                  <div className="course-slider">
                    <div className="slide-track">
                      {[...course.images, ...course.images].map((img, i) => (
                        <div className="slide" key={i}>
                          <img src={img} alt="course" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <h5 className="fw-bold" style={{ color: '#1e88e5' }}>
                      {course.title}
                    </h5>
                    <ul className="list-unstyled ps-3 mt-3">
                      {course.subjects.map((s, idx) => (
                       <li key={idx} style={{ fontSize: '1rem', color: 'black' }}>
                          ⭐ {s}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleExploreClick(course.id)}
                      className="btn btn-primary mt-3 w-100"
                      style={{
                        background: 'linear-gradient(90deg, #1e88e5, #0d47a1)',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 600
                      }}
                    >
                      {t('courses.exploreButton')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inline slider CSS */}
        <style>{`
          .course-card { 
            background: white; 
            border-radius: 18px; 
            overflow: hidden; 
            transition: transform 0.3s; 
          }
          .course-card:hover { 
            transform: scale(1.02); 
          }
          .course-slider { 
            height: 200px; 
            overflow: hidden; 
            position: relative; 
          }
          .slide-track { 
            display: flex; 
            width: 200%; 
            animation: scrollX 18s linear infinite; 
          }
          .course-card:hover .slide-track { 
            animation-play-state: paused; 
          }
          .slide { 
            flex: 0 0 33.33%; 
          }
          .slide img { 
            width: 100%; 
            height: 200px; 
            object-fit: cover; 
            transition: transform 0.3s ease-in-out; 
          }
          .slide img:hover { 
            transform: scale(1.1); 
          }
          @keyframes scrollX { 
            0% { transform: translateX(0%); } 
            100% { transform: translateX(-50%); } 
          }
          html { 
            scroll-padding-top: ${NAVBAR_HEIGHT}; 
          }
        `}</style>
      </section>
      {/* Toast container must be inside JSX */}
      <ToastContainer />
    </div>
  );
}

export default Courses;