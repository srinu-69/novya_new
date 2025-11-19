
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Toast, ToastContainer, Modal, Button, Form } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { motion } from 'framer-motion';
// import { 
//   FaUserGraduate, 
//   FaUserTie, 
//   FaBookOpen, 
//   FaChalkboardTeacher, 
//   FaEye, 
//   FaEyeSlash, 
//   FaChild,
//   FaCoins 
// } from 'react-icons/fa';
// import { RiLockPasswordFill } from 'react-icons/ri';
// import { IoMdSchool } from 'react-icons/io';

// const LoginPage = () => {
//   const [activeTab, setActiveTab] = useState('student');
//   const [formData, setFormData] = useState({
//     student: { username: '', password: '' },
//     parent: { username: '', password: '', childEmail: '' },
//     teacher: { username: '', password: '' }
//   });
//   const [errors, setErrors] = useState({
//     student: { username: '', password: '' },
//     parent: { username: '', password: '', childEmail: '' },
//     teacher: { username: '', password: '' }
//   });
//   const [showToast, setShowToast] = useState(false);
//   const [toastMsg, setToastMsg] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState({ student: false, parent: false, teacher: false });
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState('');
//   const [forgotError, setForgotError] = useState('');
//   const [showFlyingCoins, setShowFlyingCoins] = useState(false);

//   const navigate = useNavigate();

//   // MARK: FIXED - Single reward points function with PROPER duplicate prevention
//   const addRewardPointsWithHistory = (points, reason, source = 'system') => {
//     try {
//       // ✅ CHECK FOR DUPLICATES FIRST - before any updates
//       const existingHistory = JSON.parse(localStorage.getItem('rewardsHistory') || '[]');
//       const today = new Date().toISOString().split('T')[0];
      
//       // Check if daily reward was already given today
//       const hasRewardToday = existingHistory.some(item => {
//         try {
//           const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
//           return item.reason === 'Daily login reward' && itemDate === today;
//         } catch (e) {
//           return false;
//         }
//       });

//       if (hasRewardToday && reason === 'Daily login reward') {
//         console.log('🛑 Daily reward already awarded today, skipping duplicate');
//         return null;
//       }

//       // Only proceed if no duplicate found
//       const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
//       const newPoints = currentPoints + points;

//       // Update total points
//       localStorage.setItem('rewardPoints', newPoints.toString());

//       // Create new history entry
//       const historyEntry = {
//         id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//         points: points,
//         totalPoints: newPoints,
//         reason: reason,
//         source: source,
//         timestamp: new Date().toISOString()
//       };

//       // Add new entry at top
//       const updatedHistory = [historyEntry, ...existingHistory];
//       localStorage.setItem('rewardsHistory', JSON.stringify(updatedHistory));

//       console.log('✅ Reward points added:', points, 'for:', reason);
//       return historyEntry;
//     } catch (error) {
//       console.error('❌ Error adding reward points:', error);
//       return null;
//     }
//   };

//   // MARK: SIMPLIFIED - Check if daily reward was already given today
//   const hasDailyRewardBeenGiven = () => {
//     try {
//       const today = new Date().toISOString().split('T')[0];
//       const rewardsHistory = JSON.parse(localStorage.getItem('rewardsHistory') || '[]');
      
//       return rewardsHistory.some(reward => {
//         try {
//           const rewardDate = new Date(reward.timestamp).toISOString().split('T')[0];
//           return reward.reason === 'Daily login reward' && rewardDate === today;
//         } catch (e) {
//           return false;
//         }
//       });
//     } catch (error) {
//       console.error('Error checking daily reward:', error);
//       return false;
//     }
//   };

//   // Input change handler
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [activeTab]: { ...prev[activeTab], [name]: value }
//     }));

//     if (errors[activeTab][name]) {
//       setErrors(prev => ({
//         ...prev,
//         [activeTab]: { ...prev[activeTab], [name]: '' }
//       }));
//     }
//   };

//   // Form validation
//   const validateForm = () => {
//     let valid = true;
//     const current = formData[activeTab];
//     const newErrors = { username: '', password: '', childEmail: '' };

//     if (!current.username.trim()) {
//       newErrors.username = 'Username is required';
//       valid = false;
//     } else if (current.username.length < 4) {
//       newErrors.username = 'Username must be at least 4 characters';
//       valid = false;
//     }

//     if (!current.password) {
//       newErrors.password = 'Password is required';
//       valid = false;
//     } else if (current.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//       valid = false;
//     }

//     if (activeTab === 'parent') {
//       if (!current.childEmail.trim()) {
//         newErrors.childEmail = 'Child email is required';
//         valid = false;
//       } else if (!/\S+@\S+\.\S+/.test(current.childEmail)) {
//         newErrors.childEmail = 'Please enter a valid email address';
//         valid = false;
//       }
//     }

//     setErrors(prev => ({ ...prev, [activeTab]: newErrors }));
//     return valid;
//   };

//   // Toggle password visibility
//   const togglePasswordVisibility = () => {
//     setShowPassword(prev => ({ ...prev, [activeTab]: !prev[activeTab] }));
//   };

//   // Get tab configuration for dynamic content
//   const getTabConfig = () => {
//     const config = {
//       student: { icon: FaUserGraduate, title: 'Student Portal', subtitle: 'Your gateway to knowledge' },
//       parent: { icon: FaUserTie, title: 'Parent Portal', subtitle: "Track your child's progress" },
//       teacher: { icon: FaChalkboardTeacher, title: 'Teacher Portal', subtitle: 'Manage your classroom' }
//     };
//     return config[activeTab];
//   };

//   // MARK: FIXED - Handle login with SINGLE reward trigger
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const current = formData[activeTab];
//     setIsLoading(true);

//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     // Dummy login validation
//     const validCredentials = {
//       student: { username: 'student123', password: 'studentpass' },
//       parent: { username: 'parent456', password: 'parentpass' },
//       teacher: { username: 'teacher789', password: 'teacherpass' }
//     };

//     if (
//       (activeTab === 'student' && current.username === validCredentials.student.username && current.password === validCredentials.student.password) ||
//       (activeTab === 'parent' && current.username === validCredentials.parent.username && current.password === validCredentials.parent.password) ||
//       (activeTab === 'teacher' && current.username === validCredentials.teacher.username && current.password === validCredentials.teacher.password)
//     ) {
//       // ✅ SET SESSION FLAG FIRST - Prevent navbar from triggering rewards
//       sessionStorage.setItem('justLoggedIn', 'true');

//       localStorage.setItem('userRole', activeTab);
//       localStorage.setItem('userToken', 'dummy-token');
//       if (activeTab === 'parent') localStorage.setItem('childEmail', current.childEmail);

//       // --- SINGLE REWARD POINTS LOGIC (Students Only) ---
//       let rewardAwarded = false;
      
//       if (activeTab === 'student') {
//         // ✅ COMPREHENSIVE DUPLICATE CHECK
//         const rewardAlreadyGiven = hasDailyRewardBeenGiven();
        
//         if (!rewardAlreadyGiven) {
//           const rewardResult = addRewardPointsWithHistory(5, "Daily login reward", 'login');
          
//           if (rewardResult) {
//             rewardAwarded = true;
//             // Trigger flying coins animation
//             setShowFlyingCoins(true);
//             setToastMsg(`Student login successful! +5 Reward Points!`);
//             console.log('🎉 Daily login reward awarded successfully');
//           }
//         } else {
//           console.log('ℹ️ Daily reward already given today, showing normal message');
//         }
//       }

//       if (!rewardAwarded) {
//         const roleName = activeTab === 'student' ? 'Student' : 
//                         activeTab === 'parent' ? 'Parent' : 'Teacher';
//         setToastMsg(`${roleName} login successful!`);
//       }

//       setShowToast(true);
//       setIsLoading(false);

//       // Wait for animation to complete before navigation
//       const dashboardRoutes = {
//         student: '/student/dashboard',
//         parent: '/parent/dashboard',
//         teacher: '/teacher/dashboard'
//       };

//       setTimeout(() => {
//         navigate(dashboardRoutes[activeTab]);
//       }, rewardAwarded ? 2500 : 1000);

//     } else {
//       setErrors(prev => ({
//         ...prev,
//         [activeTab]: { ...prev[activeTab], username: '', password: 'Invalid username or password' }
//       }));
//       setIsLoading(false);
//     }
//   };

//   // Navigate to register page
//   const handleRegisterClick = () => {
//     navigate('/signup');
//   };

//   // Forgot password
//   const handleForgotPassword = () => {
//     if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
//       setForgotError('Please enter a valid email address');
//       return;
//     }
//     setForgotError('');
//     setShowForgotModal(false);
//     setToastMsg(`Password reset link sent to ${forgotEmail}`);
//     setShowToast(true);
//     setForgotEmail('');
//   };

//   // Framer motion variants
//   const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
//   const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

//   const { icon: ActiveIcon, title, subtitle } = getTabConfig();

//   return (
//     <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(to right, #2D5D7B, #A62D69)', position: 'relative', overflow: 'hidden' }}>

//       {/* Flying Coins Animation */}
//       {showFlyingCoins && (
//         <div className="flying-coins-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
//           {[...Array(15)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="flying-coin"
//               initial={{ 
//                 scale: 0,
//                 opacity: 1,
//                 x: window.innerWidth / 2 - 100,
//                 y: window.innerHeight / 2 - 50
//               }}
//               animate={{
//                 scale: [0, 1, 0.8, 0],
//                 opacity: [1, 1, 1, 0],
//                 x: [window.innerWidth / 2 - 100, window.innerWidth - 100, window.innerWidth - 50],
//                 y: [window.innerHeight / 2 - 50, 50, 20]
//               }}
//               transition={{
//                 duration: 2,
//                 ease: "easeOut",
//                 delay: i * 0.1
//               }}
//               style={{
//                 position: 'absolute',
//                 fontSize: '24px',
//                 color: '#FFD700',
//                 zIndex: 9999,
//               }}
//               onAnimationComplete={() => {
//                 if (i === 14) setShowFlyingCoins(false);
//               }}
//             >
//               <FaCoins />
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Floating Icons */}
//       <motion.div initial={{ x: -100, y: -100 }} animate={{ x: 0, y: 0 }} transition={{ duration: 1, type: 'spring' }} style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '3rem', color: 'rgba(255,255,255,0.2)' }}>
//         <FaBookOpen />
//       </motion.div>
//       <motion.div initial={{ x: 100, y: -100 }} animate={{ x: 0, y: 0 }} transition={{ duration: 1, type: 'spring', delay: 0.2 }} style={{ position: 'absolute', top: '15%', right: '10%', fontSize: '4rem', color: 'rgba(255,255,255,0.2)' }}>
//         <IoMdSchool />
//       </motion.div>
//       <motion.div initial={{ x: -100, y: 100 }} animate={{ x: 0, y: 0 }} transition={{ duration: 1, type: 'spring', delay: 0.4 }} style={{ position: 'absolute', bottom: '10%', left: '10%', fontSize: '3.5rem', color: 'rgba(255,255,255,0.2)' }}>
//         <FaChalkboardTeacher />
//       </motion.div>

//       {/* Toast */}
//       <ToastContainer position="top-end" className="p-3">
//         <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="success">
//           <Toast.Header closeButton>
//             <strong className="me-auto">Notification</strong>
//           </Toast.Header>
//           <Toast.Body className="text-white">{toastMsg}</Toast.Body>
//         </Toast>
//       </ToastContainer>

//       {/* Forgot Password Modal */}
//       <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Forgot Password</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group className="mb-3">
//             <Form.Label>Enter your email</Form.Label>
//             <Form.Control type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@example.com" />
//             {forgotError && <div className="text-danger mt-1">{forgotError}</div>}
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowForgotModal(false)}>Cancel</Button>
//           <Button variant="primary" onClick={handleForgotPassword}>Send Reset Link</Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Main Card */}
//       <motion.div initial="hidden" animate="visible" variants={containerVariants} className="container">
//         <div className="row justify-content-center">
//           <div className="col-md-9 col-lg-7">
//             <motion.div variants={itemVariants} className="card shadow-lg border-0 overflow-hidden" style={{ borderRadius: '20px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.9)' }} whileHover={{ scale: 1.02 }}>
//               <div className="card-body p-0">
//                 <div className="row g-0">

//                   {/* Left Visual */}
//                   <div className="col-md-5 d-none d-md-flex flex-column align-items-center justify-content-center" 
//                     style={{ background: 'linear-gradient(to right, #2D5D7B, #A62D69)' }}>
//                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} 
//                       style={{ textAlign: 'center', color: 'white' }}>
//                       <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
//                         <ActiveIcon />
//                       </div>
//                       <h4 className="fw-bold mb-0">{title}</h4>
//                       <p className="mb-0 text-white">{subtitle}</p>
//                     </motion.div>

//                     {/* Reward Points Info */}
//                     {activeTab === 'student' && (
//                       <motion.div 
//                         style={{
//                           marginTop: '20px',
//                           padding: '10px 15px',
//                           background: 'rgba(255,255,255,0.2)',
//                           borderRadius: '8px',
//                           color: 'white',
//                           fontWeight: '600',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           gap: '8px',
//                           fontSize: '0.9rem'
//                         }}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.5 }}
//                       >
//                         <FaCoins size={16} />
//                         <span>+5 Daily Login Reward!</span>
//                       </motion.div>
//                     )}
//                   </div>

//                   {/* Right Form */}
//                   <div className="col-md-7">
//                     <div className="p-4 p-md-5">

//                       {/* Branding */}
//                       <motion.div variants={itemVariants} className="text-center mb-4">
//                         <motion.h1 className="fw-bold mb-2" style={{ background: 'linear-gradient(to right, #2D5D7B, #A62D69)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
//                           NOVYA
//                         </motion.h1>
//                         <p className="text-muted">Education Management Platform</p>
//                       </motion.div>

//                       {/* Tabs */}
//                       <div className="d-flex justify-content-center mb-4">
//                         <button className={`btn ${activeTab === 'student' ? 'btn-primary' : 'btn-outline-primary'}`} 
//                           onClick={() => setActiveTab('student')} 
//                           style={{ flex: '0 0 auto', margin: '0 5px', fontSize: '0.8rem', textAlign: 'center', padding: '0.35rem 0.75rem' }}>
//                           <FaUserGraduate className="me-1" /> Student
//                         </button>
//                         <button className={`btn ${activeTab === 'parent' ? 'btn-primary' : 'btn-outline-primary'}`} 
//                           onClick={() => setActiveTab('parent')} 
//                           style={{ flex: '0 0 auto', margin: '0 5px', fontSize: '0.8rem', textAlign: 'center', padding: '0.35rem 0.75rem' }}>
//                           <FaUserTie className="me-1" /> Parent
//                         </button>
//                         <button className={`btn ${activeTab === 'teacher' ? 'btn-primary' : 'btn-outline-primary'}`} 
//                           onClick={() => setActiveTab('teacher')} 
//                           style={{ flex: '0 0 auto', margin: '0 5px', fontSize: '0.8rem', textAlign: 'center', padding: '0.35rem 0.75rem' }}>
//                           <FaChalkboardTeacher className="me-1" /> Teacher
//                         </button>
//                       </div>

//                       {/* Form */}
//                       <motion.form onSubmit={handleSubmit} variants={containerVariants}>

//                         {/* Username */}
//                         <div className="mb-3">
//                           <label className="form-label fw-medium">Username</label>
//                           <div className="input-group">
//                             <span className="input-group-text">
//                               {activeTab === 'student' && <FaUserGraduate />}
//                               {activeTab === 'parent' && <FaUserTie />}
//                               {activeTab === 'teacher' && <FaChalkboardTeacher />}
//                             </span>
//                             <input type="text" name="username" className="form-control" value={formData[activeTab].username} onChange={handleChange} placeholder="Enter username" />
//                           </div>
//                           {errors[activeTab].username && <div className="invalid-feedback d-block">{errors[activeTab].username}</div>}
//                         </div>

//                         {/* Password */}
//                         <div className="mb-3">
//                           <label className="form-label fw-medium">Password</label>
//                           <div className="input-group">
//                             <span className="input-group-text"><RiLockPasswordFill /></span>
//                             <input type={showPassword[activeTab] ? "text" : "password"} name="password" className="form-control" value={formData[activeTab].password} onChange={handleChange} placeholder="Enter password" />
//                             {formData[activeTab].password.length > 0 && (
//                               <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={togglePasswordVisibility}>
//                                 {showPassword[activeTab] ? <FaEyeSlash /> : <FaEye />}
//                               </span>
//                             )}
//                           </div>
//                           {errors[activeTab].password && <div className="invalid-feedback d-block">{errors[activeTab].password}</div>}
//                         </div>

//                         {/* Child Email for Parent */}
//                         {activeTab === 'parent' && (
//                           <div className="mb-3">
//                             <label className="form-label fw-medium">Child's Email</label>
//                             <div className="input-group">
//                               <span className="input-group-text"><FaChild /></span>
//                               <input type="email" name="childEmail" className="form-control" value={formData.parent.childEmail} onChange={handleChange} placeholder="Enter child's email" />
//                             </div>
//                             {errors.parent.childEmail && <div className="invalid-feedback d-block">{errors.parent.childEmail}</div>}
//                           </div>
//                         )}

//                         {/* Forgot Password */}
//                         <div className="text-end mb-3">
//                           <button type="button" className="btn btn-link p-0" onClick={() => setShowForgotModal(true)}>Forgot Password?</button>
//                         </div>

//                         {/* Submit */}
//                         <button type="submit" className="btn w-100" disabled={isLoading} style={{ background: 'linear-gradient(to right, #2D5D7B, #A62D69)', color: 'white' }}>
//                           {isLoading ? "Signing in..." : "Sign In"}
//                         </button>

//                         {/* Register */}
//                         <div className="text-center mt-3">
//                           <p className="text-muted">New to Novya? <button type="button" className="btn btn-link p-0" onClick={handleRegisterClick}>Create account</button></p>
//                         </div>

//                       </motion.form>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;










import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast, ToastContainer, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import {
  FaUserGraduate,
  FaUserTie,
  FaBookOpen,
  FaChalkboardTeacher,
  FaEye,
  FaEyeSlash,
  FaChild,
  FaCoins
} from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdSchool } from 'react-icons/io';
import { useScreenTime } from '../student/ScreenTime';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    student: { username: '', password: '' },
    parent: { username: '', password: '', childEmail: '' },
    teacher: { username: '', password: '' }
  });
  const [errors, setErrors] = useState({
    student: { username: '', password: '' },
    parent: { username: '', password: '', childEmail: '' },
    teacher: { username: '', password: '' }
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({ student: false, parent: false, teacher: false });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [showFlyingCoins, setShowFlyingCoins] = useState(false);
  const navigate = useNavigate();
  const { startGlobalSession } = useScreenTime();
  // MARK: FIXED - Single reward points function with PROPER duplicate prevention
  const addRewardPointsWithHistory = (points, reason, source = 'system') => {
    try {
      // ✅ CHECK FOR DUPLICATES FIRST - before any updates
      const existingHistory = JSON.parse(localStorage.getItem('rewardsHistory') || '[]');
      const today = new Date().toISOString().split('T')[0];
     
      // Check if daily reward was already given today
      const hasRewardToday = existingHistory.some(item => {
        try {
          const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
          return item.reason === 'Daily login reward' && itemDate === today;
        } catch (e) {
          return false;
        }
      });
      if (hasRewardToday && reason === 'Daily login reward') {
        console.log('🛑 Daily reward already awarded today, skipping duplicate');
        return null;
      }
      // Only proceed if no duplicate found
      const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
      const newPoints = currentPoints + points;
      // Update total points
      localStorage.setItem('rewardPoints', newPoints.toString());
      // Create new history entry
      const historyEntry = {
        id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        points: points,
        totalPoints: newPoints,
        reason: reason,
        source: source,
        timestamp: new Date().toISOString()
      };
      // Add new entry at top
      const updatedHistory = [historyEntry, ...existingHistory];
      localStorage.setItem('rewardsHistory', JSON.stringify(updatedHistory));
      console.log('✅ Reward points added:', points, 'for:', reason);
      return historyEntry;
    } catch (error) {
      console.error('❌ Error adding reward points:', error);
      return null;
    }
  };
  // MARK: SIMPLIFIED - Check if daily reward was already given today
  const hasDailyRewardBeenGiven = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const rewardsHistory = JSON.parse(localStorage.getItem('rewardsHistory') || '[]');
     
      return rewardsHistory.some(reward => {
        try {
          const rewardDate = new Date(reward.timestamp).toISOString().split('T')[0];
          return reward.reason === 'Daily login reward' && rewardDate === today;
        } catch (e) {
          return false;
        }
      });
    } catch (error) {
      console.error('Error checking daily reward:', error);
      return false;
    }
  };
  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [name]: value }
    }));
    if (errors[activeTab][name]) {
      setErrors(prev => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], [name]: '' }
      }));
    }
  };
  // Form validation
  const validateForm = () => {
    let valid = true;
    const current = formData[activeTab];
    const newErrors = { username: '', password: '', childEmail: '' };
    if (!current.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (current.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
      valid = false;
    }
    if (!current.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (current.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    if (activeTab === 'parent') {
      if (!current.childEmail.trim()) {
        newErrors.childEmail = 'Child email is required';
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(current.childEmail)) {
        newErrors.childEmail = 'Please enter a valid email address';
        valid = false;
      }
    }
    setErrors(prev => ({ ...prev, [activeTab]: newErrors }));
    return valid;
  };
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => ({ ...prev, [activeTab]: !prev[activeTab] }));
  };
  // Get tab configuration for dynamic content
  const getTabConfig = () => {
    const config = {
      student: { icon: FaUserGraduate, title: 'Student Portal', subtitle: 'Your gateway to knowledge' },
      parent: { icon: FaUserTie, title: 'Parent Portal', subtitle: "Track your child's progress" },
      teacher: { icon: FaChalkboardTeacher, title: 'Teacher Portal', subtitle: 'Manage your classroom' }
    };
    return config[activeTab];
  };
  // MARK: FIXED - Handle login with SINGLE reward trigger
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const current = formData[activeTab];
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Dummy login validation
    const validCredentials = {
      student: { username: 'student123', password: 'studentpass' },
      parent: { username: 'parent456', password: 'parentpass' },
      teacher: { username: 'teacher789', password: 'teacherpass' }
    };
    if (
      (activeTab === 'student' && current.username === validCredentials.student.username && current.password === validCredentials.student.password) ||
      (activeTab === 'parent' && current.username === validCredentials.parent.username && current.password === validCredentials.parent.password) ||
      (activeTab === 'teacher' && current.username === validCredentials.teacher.username && current.password === validCredentials.teacher.password)
    ) {
      // ✅ SET SESSION FLAG FIRST - Prevent navbar from triggering rewards
      sessionStorage.setItem('justLoggedIn', 'true');
      localStorage.setItem('userRole', activeTab);
      localStorage.setItem('userToken', 'dummy-token');
      if (activeTab === 'parent') localStorage.setItem('childEmail', current.childEmail);
      // --- SINGLE REWARD POINTS LOGIC (Students Only) ---
      let rewardAwarded = false;
     
      if (activeTab === 'student') {
        // ✅ COMPREHENSIVE DUPLICATE CHECK
        const rewardAlreadyGiven = hasDailyRewardBeenGiven();
       
        if (!rewardAlreadyGiven) {
          const rewardResult = addRewardPointsWithHistory(5, "Daily login reward", 'login');
         
          if (rewardResult) {
            rewardAwarded = true;
            // Trigger flying coins animation
            setShowFlyingCoins(true);
            setToastMsg(`Student login successful! +5 Reward Points!`);
            console.log('🎉 Daily login reward awarded successfully');
          }
        } else {
          console.log('ℹ️ Daily reward already given today, showing normal message');
        }
        // Start global screen time session for students
        startGlobalSession();
      }
      if (!rewardAwarded) {
        const roleName = activeTab === 'student' ? 'Student' :
                        activeTab === 'parent' ? 'Parent' : 'Teacher';
        setToastMsg(`${roleName} login successful!`);
      }
      setShowToast(true);
      setIsLoading(false);
      // Wait for animation to complete before navigation
      const dashboardRoutes = {
        student: '/student/dashboard',
        parent: '/parent/dashboard',
        teacher: '/teacher/dashboard'
      };
      setTimeout(() => {
        navigate(dashboardRoutes[activeTab]);
      }, rewardAwarded ? 2500 : 1000);
    } else {
      setErrors(prev => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], username: '', password: 'Invalid username or password' }
      }));
      setIsLoading(false);
    }
  };
  // Navigate to register page
  const handleRegisterClick = () => {
    navigate('/signup');
  };
  // Forgot password
  const handleForgotPassword = () => {
    if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotError('Please enter a valid email address');
      return;
    }
    setForgotError('');
    setShowForgotModal(false);
    setToastMsg(`Password reset link sent to ${forgotEmail}`);
    setShowToast(true);
    setForgotEmail('');
  };
  // Framer motion variants
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };
  const { icon: ActiveIcon, title, subtitle } = getTabConfig();
  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(to right, #2D5D7B, #A62D69)', position: 'relative', overflow: 'hidden' }}>
      {/* Flying Coins Animation */}
      {showFlyingCoins && (
        <div className="flying-coins-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="flying-coin"
              initial={{
                scale: 0,
                opacity: 1,
                x: window.innerWidth / 2 - 100,
                y: window.innerHeight / 2 - 50
              }}
              animate={{
                scale: [0, 1, 0.8, 0],
                opacity: [1, 1, 1, 0],
                x: [window.innerWidth / 2 - 100, window.innerWidth - 100, window.innerWidth - 50],
                y: [window.innerHeight / 2 - 50, 50, 20]
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
                delay: i * 0.1
              }}
              style={{
                position: 'absolute',
                fontSize: '24px',
                color: '#FFD700',
                zIndex: 9999,
              }}
              onAnimationComplete={() => {
                if (i === 14) setShowFlyingCoins(false);
              }}
            >
              <FaCoins />
            </motion.div>
          ))}
        </div>
      )}
      {/* Floating Icons */}
      <motion.div initial={{ x: -100, y: -100 }} animate={{ x: 0, y: 0 }} transition={{ duration: 1, type: 'spring' }} style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '3rem', color: 'rgba(255,255,255,0.2)' }}>
        <FaBookOpen />
      </motion.div>
      <motion.div initial={{ x: 100, y: -100 }} animate={{ x: 0, y: 0 }} transition={{ duration: 1, type: 'spring', delay: 0.2 }} style={{ position: 'absolute', top: '15%', right: '10%', fontSize: '4rem', color: 'rgba(255,255,255,0.2)' }}>
        <IoMdSchool />
      </motion.div>
      <motion.div initial={{ x: -100, y: 100 }} animate={{ x: 0, y: 0 }} transition={{ duration: 1, type: 'spring', delay: 0.4 }} style={{ position: 'absolute', bottom: '10%', left: '10%', fontSize: '3.5rem', color: 'rgba(255,255,255,0.2)' }}>
        <FaChalkboardTeacher />
      </motion.div>
      {/* Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="success">
          <Toast.Header closeButton>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
      {/* Forgot Password Modal */}
      <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Enter your email</Form.Label>
            <Form.Control type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@example.com" />
            {forgotError && <div className="text-danger mt-1">{forgotError}</div>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForgotModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleForgotPassword}>Send Reset Link</Button>
        </Modal.Footer>
      </Modal>
      {/* Main Card */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="container">
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-7">
            <motion.div variants={itemVariants} className="card shadow-lg border-0 overflow-hidden" style={{ borderRadius: '20px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.9)' }} whileHover={{ scale: 1.02 }}>
              <div className="card-body p-0">
                <div className="row g-0">
                  {/* Left Visual */}
                  <div className="col-md-5 d-none d-md-flex flex-column align-items-center justify-content-center"
                    style={{ background: 'linear-gradient(to right, #2D5D7B, #A62D69)' }}>
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
                      style={{ textAlign: 'center', color: 'white' }}>
                      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                        <ActiveIcon />
                      </div>
                      <h4 className="fw-bold mb-0">{title}</h4>
                      <p className="mb-0 text-white">{subtitle}</p>
                    </motion.div>
                    {/* Reward Points Info */}
                    {activeTab === 'student' && (
                      <motion.div
                        style={{
                          marginTop: '20px',
                          padding: '10px 15px',
                          background: 'rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          fontSize: '0.9rem'
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <FaCoins size={16} />
                        <span>+5 Daily Login Reward!</span>
                      </motion.div>
                    )}
                  </div>
                  {/* Right Form */}
                  <div className="col-md-7">
                    <div className="p-4 p-md-5">
                      {/* Branding */}
                      <motion.div variants={itemVariants} className="text-center mb-4">
                        <motion.h1 className="fw-bold mb-2" style={{ background: 'linear-gradient(to right, #2D5D7B, #A62D69)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          NOVYA
                        </motion.h1>
                        <p className="text-muted">Education Management Platform</p>
                      </motion.div>
                      {/* Tabs */}
                      <div className="d-flex justify-content-center mb-4">
                        <button className={`btn ${activeTab === 'student' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setActiveTab('student')}
                          style={{ flex: '0 0 auto', margin: '0 5px', fontSize: '0.8rem', textAlign: 'center', padding: '0.35rem 0.75rem' }}>
                          <FaUserGraduate className="me-1" /> Student
                        </button>
                        <button className={`btn ${activeTab === 'parent' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setActiveTab('parent')}
                          style={{ flex: '0 0 auto', margin: '0 5px', fontSize: '0.8rem', textAlign: 'center', padding: '0.35rem 0.75rem' }}>
                          <FaUserTie className="me-1" /> Parent
                        </button>
                        <button className={`btn ${activeTab === 'teacher' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setActiveTab('teacher')}
                          style={{ flex: '0 0 auto', margin: '0 5px', fontSize: '0.8rem', textAlign: 'center', padding: '0.35rem 0.75rem' }}>
                          <FaChalkboardTeacher className="me-1" /> Teacher
                        </button>
                      </div>
                      {/* Form */}
                      <motion.form onSubmit={handleSubmit} variants={containerVariants}>
                        {/* Username */}
                        <div className="mb-3">
                          <label className="form-label fw-medium">Username</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              {activeTab === 'student' && <FaUserGraduate />}
                              {activeTab === 'parent' && <FaUserTie />}
                              {activeTab === 'teacher' && <FaChalkboardTeacher />}
                            </span>
                            <input type="text" name="username" className="form-control" value={formData[activeTab].username} onChange={handleChange} placeholder="Enter username" />
                          </div>
                          {errors[activeTab].username && <div className="invalid-feedback d-block">{errors[activeTab].username}</div>}
                        </div>
                        {/* Password */}
                        <div className="mb-3">
                          <label className="form-label fw-medium">Password</label>
                          <div className="input-group">
                            <span className="input-group-text"><RiLockPasswordFill /></span>
                            <input type={showPassword[activeTab] ? "text" : "password"} name="password" className="form-control" value={formData[activeTab].password} onChange={handleChange} placeholder="Enter password" />
                            {formData[activeTab].password.length > 0 && (
                              <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={togglePasswordVisibility}>
                                {showPassword[activeTab] ? <FaEyeSlash /> : <FaEye />}
                              </span>
                            )}
                          </div>
                          {errors[activeTab].password && <div className="invalid-feedback d-block">{errors[activeTab].password}</div>}
                        </div>
                        {/* Child Email for Parent */}
                        {activeTab === 'parent' && (
                          <div className="mb-3">
                            <label className="form-label fw-medium">Child's Email</label>
                            <div className="input-group">
                              <span className="input-group-text"><FaChild /></span>
                              <input type="email" name="childEmail" className="form-control" value={formData.parent.childEmail} onChange={handleChange} placeholder="Enter child's email" />
                            </div>
                            {errors.parent.childEmail && <div className="invalid-feedback d-block">{errors.parent.childEmail}</div>}
                          </div>
                        )}
                        {/* Forgot Password */}
                        <div className="text-end mb-3">
                          <button type="button" className="btn btn-link p-0" onClick={() => setShowForgotModal(true)}>Forgot Password?</button>
                        </div>
                        {/* Submit */}
                        <button type="submit" className="btn w-100" disabled={isLoading} style={{ background: 'linear-gradient(to right, #2D5D7B, #A62D69)', color: 'white' }}>
                          {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                        {/* Register */}
                        <div className="text-center mt-3">
                          <p className="text-muted">New to Novya? <button type="button" className="btn btn-link p-0" onClick={handleRegisterClick}>Create account</button></p>
                        </div>
                      </motion.form>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default LoginPage;