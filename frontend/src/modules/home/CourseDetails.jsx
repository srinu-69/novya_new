
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.min.css';

// const NAVBAR_HEIGHT = 60; // Must match your fixed navbar height

// const CourseDetail = () => {
//   useEffect(() => {
//       document.title = "Course Details|NOVYA - Your Smart Learning Platform";
//     }, []);
//   const { state: course } = useLocation();
//   const navigate = useNavigate();

//   return (
//     <div
//       className="container-fluid"
//       style={{
//         paddingTop: NAVBAR_HEIGHT,      // Directly pushes down content
//         paddingBottom: 40,
//         backgroundColor: '#f4f8fb',
//         color: '#222831',
//         minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`
//       }}
//     >
//       <div className="container py-5">
//         <div className="row align-items-start">
//           {/* Left Image */}
//           <div className="col-md-6 mb-4">
//             <img
//               src={course?.image || 'https://via.placeholder.com/400'}
//               alt={course?.title}
//               className="img-fluid rounded shadow"
//               style={{ border: '4px solid #e596bd' }}
//             />
//           </div>
//           {/* Right Info */}
//           <div className="col-md-6">
//             <h2
//               className="fw-bold mb-3"
//               style={{ color: '#2d5d7b', marginTop: 0 }}
//             >
//               {course?.title}
//             </h2>
//             <h5 className="text-muted mb-2">By {course?.instructor}</h5>
//             <h4 className="mb-3" style={{ color: '#e596bd' }}>
//               {course?.originalPrice}
//             </h4>
//             <p className="mb-3">
//               ⭐ {course?.rating} | 👥 {course?.students} students
//             </p>
//             <p className="mb-4">
//               Learn{' '}
//               <span
//                 className="fw-bold"
//                 style={{ textDecoration: 'underline' }}
//               >
//                 {course?.title}
//               </span>{' '}
//               from scratch with hands-on projects.
//             </p>
//             <ul className="mb-4">
//               <li>✓ Lifetime access</li>
//               <li>✓ Certificate of Completion</li>
//               <li>✓ Full-time mentor support</li>
//             </ul>
//             <button
//               className="btn btn-lg mt-2 px-5"
//               onClick={() => navigate('/pricing')}
//               style={{
//                 backgroundColor: '#2d5d7b',
//                 color: '#fff',
//                 border: 'none',
//                 transition: 'background-color 0.3s ease'
//               }}
//               onMouseOver={(e) =>
//                 (e.currentTarget.style.backgroundColor = '#79b3d7')
//               }
//               onMouseOut={(e) =>
//                 (e.currentTarget.style.backgroundColor = '#2d5d7b')
//               }
//             >
//               <i className="bi bi-lightning-fill me-2"></i>Enroll Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseDetail;







import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

const NAVBAR_HEIGHT = 60; // Must match your fixed navbar height

const CourseDetail = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    document.title = `${t('coursedetail.title')} | NOVYA - Your Smart Learning Platform`;
  }, [t]);
  
  const { state: course } = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className="container-fluid"
      style={{
        paddingTop: NAVBAR_HEIGHT,      // Directly pushes down content
        paddingBottom: 40,
        backgroundColor: '#f4f8fb',
        color: '#222831',
        minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`
      }}
    >
      <div className="container py-5">
        <div className="row align-items-start">
          {/* Left Image */}
          <div className="col-md-6 mb-4">
            <img
              src={course?.image || 'https://via.placeholder.com/400'}
              alt={course?.title || t('coursedetail.imageAlt')}
              className="img-fluid rounded shadow"
              style={{ border: '4px solid #e596bd' }}
            />
          </div>
          {/* Right Info */}
          <div className="col-md-6">
            <h2
              className="fw-bold mb-3"
              style={{ color: '#2d5d7b', marginTop: 0 }}
            >
              {course?.title || t('coursedetail.defaultTitle')}
            </h2>
            <h5 className="text-muted mb-2">{t('coursedetail.by')} {course?.instructor}</h5>
            <h4 className="mb-3" style={{ color: '#e596bd' }}>
              {course?.originalPrice}
            </h4>
            <p className="mb-3">
              ⭐ {course?.rating} | 👥 {course?.students} {t('coursedetail.students')}
            </p>
            <p className="mb-4">
              {t('coursedetail.description', { title: course?.title || t('coursedetail.defaultTitle') })}
            </p>
            <ul className="mb-4">
              <li>✓ {t('coursedetail.features.lifetimeAccess')}</li>
              <li>✓ {t('coursedetail.features.certificate')}</li>
              <li>✓ {t('coursedetail.features.mentorSupport')}</li>
            </ul>
            <button
              className="btn btn-lg mt-2 px-5"
              onClick={() => navigate('/pricing')}
              style={{
                backgroundColor: '#2d5d7b',
                color: '#fff',
                border: 'none',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#79b3d7')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = '#2d5d7b')
              }
            >
              <i className="bi bi-lightning-fill me-2"></i>{t('coursedetail.enrollNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;