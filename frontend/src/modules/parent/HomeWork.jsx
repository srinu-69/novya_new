// import React from 'react';
// import { FaBook, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

// // Sample data
// const assignments = [
//   {
//     task: 'Math Worksheet',
//     subject: 'Mathematics',
//     status: 'Pending',
//     dueDate: 'Tomorrow',
//     description: 'Complete problems 1-20 on algebraic equations',
//   },
//   {
//     task: 'Science Project',
//     subject: 'Science',
//     status: 'Submitted',
//     dueDate: 'Yesterday',
//     description: 'Solar system model submission',
//   },
//   {
//     task: 'English Essay',
//     subject: 'English',
//     status: 'Overdue',
//     dueDate: 'Last Friday',
//     description: '500-word essay on favorite book',
//   },
// ];

// // Helper for status badge
// const getStatusDetails = (status) => {
//   switch (status) {
//     case 'Submitted':
//       return { color: '#28a745', bg: '#28a74520', icon: <FaCheckCircle /> };
//     case 'Pending':
//       return { color: '#ffc107', bg: '#ffc10720', icon: <FaClock /> };
//     default:
//       return { color: '#dc3545', bg: '#dc354520', icon: <FaExclamationTriangle /> };
//   }
// };

// const cardBorder = (status) => {
//   if (status === "Submitted") return "2px solid #28a745";
//   if (status === "Pending") return "2px solid #ffc107";
//   return "2px solid #dc3545";
// };

// const Homework = () => (
//   <>
//     {/* Bootstrap CSS */}
//     <link
//       href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
//       rel="stylesheet"
//     />
//     <div style={{ 
//       minHeight: '100vh', 
//       background: ' #e9eaf0ff ',
//       fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
//       padding: '2rem 0'
//     }}>
//       <div className="container py-4">
//         <div
//           className="card border-0"
//           style={{
//             background: 'rgba(255,255,255,0.95)',
//             borderRadius: '20px',
//             boxShadow: '0 8px 32px rgba(45,93,123,0.08)',
//             backdropFilter: 'blur(12px)',
//             marginBottom: '2rem',
//           }}
//         >
//           <div className="card-body px-4 py-4">
//             {/* Header */}
//             <div className="d-flex align-items-center mb-4">
//               <div
//                 className="p-3 rounded-circle me-3"
//                 style={{
//                   background: 'rgba(102,126,234,0.14)',
//                   width: 42,
//                   height: 42,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   color: '#667eea',
//                 }}
//               >
//                 <FaBook size={22} />
//               </div>
//               <div>
//                 <h5 className="mb-0 fw-bold text-dark">Assignments</h5>
//                 <p className="mb-0 text-muted small">
//                   Track your child's homework status and due dates
//                 </p>
//               </div>
//             </div>
//             {/* Assignment List */}
//             <div className="row g-4">
//               {assignments.map((hw, idx) => {
//                 const status = getStatusDetails(hw.status);
//                 return (
//                   <div key={idx} className="col-12 col-md-6">
//                     <div
//                       className="p-4 h-100 rounded-4 position-relative"
//                       style={{
//                         background: idx % 2 === 0
//                           ? 'linear-gradient(110deg, #f6fafd, #ffffff)'
//                           : 'linear-gradient(110deg, #f4f8fb, #ffffff)',
//                         border: cardBorder(hw.status),
//                         boxShadow: hw.status === 'Overdue'
//                           ? '0 0 10px #dc354580'
//                           : '0 2px 9px rgba(45,93,123,0.05)',
//                         transition: 'box-shadow 0.3s, border 0.3s',
//                         animation: 'fadeInUp 0.6s both',
//                         animationDelay: `${idx * 0.12}s`,
//                       }}
//                     >
//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <div>
//                           <h6 className="mb-1 fw-bold text-dark">{hw.task}</h6>
//                           <span className="badge rounded-pill"
//                             style={{
//                               background: '#667eea15',
//                               color: '#2D5D7B',
//                               fontWeight: '500',
//                               fontSize: '0.88rem',
//                               marginTop: '3px',
//                               marginBottom: '2px',
//                             }}>
//                             {hw.subject}
//                           </span>
//                         </div>
//                         <span className="badge rounded-pill d-flex align-items-center px-3 py-2"
//                           style={{
//                             background: status.bg,
//                             color: status.color,
//                             fontWeight: '600',
//                             fontSize: '0.92rem',
//                             border: `1px solid ${status.color}40`,
//                             boxShadow: hw.status === 'Overdue'
//                               ? '0 0 8px #dc354570'
//                               : 'none',
//                             animation: hw.status === 'Overdue'
//                               ? 'glow 1.5s infinite' : 'none',
//                             gap: '0.4rem',
//                             minWidth: '110px',
//                             justifyContent: 'center',
//                           }}>
//                           {status.icon}
//                           {hw.status}
//                         </span>
//                       </div>
//                       <p className="mb-2 text-muted" style={{ fontSize: '1.02rem' }}>
//                         {hw.description}
//                       </p>
//                       <small className="text-muted">
//                         Due:{' '}
//                         <span style={{
//                           color: hw.status === 'Overdue' ? '#dc3545' : '#667eea',
//                           fontWeight: hw.status === 'Overdue' ? '600' : '500',
//                         }}>
//                           {hw.dueDate}
//                         </span>
//                       </small>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     <style>{`
//       @keyframes glow {
//         0% { box-shadow: 0 0 0 #dc354540; }
//         50% { box-shadow: 0 0 12px #dc354580; }
//         100% { box-shadow: 0 0 0 #dc354540; }
//       }
//       @keyframes fadeInUp {
//         from { opacity: 0; transform: translateY(20px);}
//         to { opacity: 1; transform: translateY(0);}
//       }
//       @media (max-width: 768px) {
//         .card-body { padding: 1.2rem !important; }
//         .p-4 { padding: 1.1rem !important; }
//         h5 { font-size: 1.1rem !important; }
//         h6 { font-size: 1rem !important; }
//       }
//       @media (max-width: 480px) {
//         .p-4 { padding: 0.7rem !important; }
//         h5 { font-size: 1rem !important; }
//         h6 { font-size: 0.91rem !important; }
//       }
//     `}</style>
//   </>
// );

// export default Homework;












 
import React from 'react';
import { FaBook, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
 
const assignments = [
  {
    task: 'mathTask',
    subject: 'mathematics',
    status: 'Pending',
    dueDate: 'tomorrow',
    description: 'mathDesc',
  },
  {
    task: 'scienceTask',
    subject: 'science',
    status: 'Submitted',
    dueDate: 'yesterday',
    description: 'scienceDesc',
  },
  {
    task: 'englishTask',
    subject: 'english',
    status: 'Overdue',
    dueDate: 'lastFriday',
    description: 'englishDesc',
  },
];
 
const getStatusDetails = (status) => {
  switch (status) {
    case 'Submitted':
      return { color: '#28a745', bg: '#28a74520', icon: <FaCheckCircle />, label: 'submitted' };
    case 'Pending':
      return { color: '#ffc107', bg: '#ffc10720', icon: <FaClock />, label: 'pending' };
    default:
      return { color: '#dc3545', bg: '#dc354520', icon: <FaExclamationTriangle />, label: 'overdue' };
  }
};
 
const cardBorder = (status) => {
  if (status === 'Submitted') return '2px solid #28a745';
  if (status === 'Pending') return '2px solid #ffc107';
  return '2px solid #dc3545';
};
 
const Homework = () => {
  const { t } = useTranslation();
 
  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          background: ' #e9eaf0ff ',
          fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
          padding: '2rem 0',
        }}
      >
        <div className="container py-4">
          <div
            className="card border-0"
            style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(45,93,123,0.08)',
              backdropFilter: 'blur(12px)',
              marginBottom: '2rem',
            }}
          >
            <div className="card-body px-4 py-4">
              {/* Header */}
              <div className="d-flex align-items-center mb-4">
                <div
                  className="p-3 rounded-circle me-3"
                  style={{
                    background: 'rgba(102,126,234,0.14)',
                    width: 42,
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#667eea',
                  }}
                >
                  <FaBook size={22} />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold text-dark">{t('assignments')}</h5>
                  <p className="mb-0 text-muted small">{t('trackHomework')}</p>
                </div>
              </div>
 
              {/* Assignment List */}
              <div className="row g-4">
                {assignments.map((hw, idx) => {
                  const status = getStatusDetails(hw.status);
                  return (
                    <div key={idx} className="col-12 col-md-6">
                      <div
                        className="p-4 h-100 rounded-4 position-relative"
                        style={{
                          background:
                            idx % 2 === 0
                              ? 'linear-gradient(110deg, #f6fafd, #ffffff)'
                              : 'linear-gradient(110deg, #f4f8fb, #ffffff)',
                          border: cardBorder(hw.status),
                          boxShadow:
                            hw.status === 'Overdue'
                              ? '0 0 10px #dc354580'
                              : '0 2px 9px rgba(45,93,123,0.05)',
                          transition: 'box-shadow 0.3s, border 0.3s',
                          animation: 'fadeInUp 0.6s both',
                          animationDelay: `${idx * 0.12}s`,
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <h6 className="mb-1 fw-bold text-dark">
                              {t(hw.task)}
                            </h6>
                            <span
                              className="badge rounded-pill"
                              style={{
                                background: '#667eea15',
                                color: '#2D5D7B',
                                fontWeight: '500',
                                fontSize: '0.88rem',
                                marginTop: '3px',
                                marginBottom: '2px',
                              }}
                            >
                              {t(hw.subject)}
                            </span>
                          </div>
                          <span
                            className="badge rounded-pill d-flex align-items-center px-3 py-2"
                            style={{
                              background: status.bg,
                              color: status.color,
                              fontWeight: '600',
                              fontSize: '0.92rem',
                              border: `1px solid ${status.color}40`,
                              boxShadow:
                                hw.status === 'Overdue'
                                  ? '0 0 8px #dc354570'
                                  : 'none',
                              animation:
                                hw.status === 'Overdue'
                                  ? 'glow 1.5s infinite'
                                  : 'none',
                              gap: '0.4rem',
                              minWidth: '110px',
                              justifyContent: 'center',
                            }}
                          >
                            {status.icon}
                            {t(status.label)}
                          </span>
                        </div>
                        <p
                          className="mb-2 text-muted"
                          style={{ fontSize: '1.02rem' }}
                        >
                          {t(hw.description)}
                        </p>
                        <small className="text-muted">
                          {t('due')}{' '}
                          <span
                            style={{
                              color:
                                hw.status === 'Overdue' ? '#dc3545' : '#667eea',
                              fontWeight:
                                hw.status === 'Overdue' ? '600' : '500',
                            }}
                          >
                            {t(hw.dueDate)}
                          </span>
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
 
export default Homework;
 
 