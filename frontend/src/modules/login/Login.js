// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Toast, ToastContainer, Modal, Button, Form } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { motion } from 'framer-motion';
// import { FaUserGraduate, FaUserTie, FaBookOpen, FaChalkboardTeacher, FaEye, FaEyeSlash } from 'react-icons/fa';
// import { RiLockPasswordFill } from 'react-icons/ri';
// import { IoMdSchool } from 'react-icons/io';

// // ✅ Full Updated LoginPage with Forgot Password
// const LoginPage = () => {
//   const [activeTab, setActiveTab] = useState('student');
//   const [formData, setFormData] = useState({
//     student: { username: '', password: '' },
//     parent: { username: '', password: '' }
//   });
//   const [errors, setErrors] = useState({
//     student: { username: '', password: '' },
//     parent: { username: '', password: '' }
//   });
//   const [showToast, setShowToast] = useState(false);
//   const [toastMsg, setToastMsg] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [showPassword, setShowPassword] = useState({
//     student: false,
//     parent: false,
//   }); 
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState('');
//   const [forgotError, setForgotError] = useState('');

//   const navigate = useNavigate();

//   // ✅ Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [activeTab]: {
//         ...prev[activeTab],
//         [name]: value,
//       },
//     }));
//     if (errors[activeTab][name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [activeTab]: {
//           ...prev[activeTab],
//           [name]: '',
//         },
//       }));
//     }
//   };

//   // ✅ Validate login form
//   const validateForm = () => {
//     let valid = true;
//     const current = formData[activeTab];
//     const newErrors = { username: '', password: '' };

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

//     setErrors((prev) => ({
//       ...prev,
//       [activeTab]: newErrors,
//     }));

//     return valid;
//   };

//   // ✅ Toggle Password Visibility (separate for Student & Parent)
//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => ({
//       ...prev,
//       [activeTab]: !prev[activeTab],
//     }));
//   };

//   // ✅ Handle login submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       const current = formData[activeTab];
//       setIsLoading(true);

//       await new Promise(resolve => setTimeout(resolve, 1000));

//       if (
//         (activeTab === 'student' && current.username === 'student123' && current.password === 'studentpass') ||
//         (activeTab === 'parent' && current.username === 'parent456' && current.password === 'parentpass')
//       ) {
//         localStorage.setItem('userRole', activeTab);
//         localStorage.setItem('userToken', 'dummy-token');
//         setToastMsg(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} login successful!`);
//         setShowToast(true);
//         setIsLoading(false);

//         setTimeout(() => {
//           navigate(activeTab === 'student' ? '/student/dashboard' : '/parent/dashboard');
//         }, 2000);
//       } else {
//         setErrors((prev) => ({
//           ...prev,
//           [activeTab]: { username: '', password: 'Invalid username or password' },
//         }));
//         setIsLoading(false);
//       }
//     }
//   };

//   // Handle register navigation
//   const handleRegisterClick = () => {
//     navigate('/signup');
//   };

//   // ✅ Forgot Password - Submit
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

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
//   };

//   return (
//     <div className="min-vh-100 d-flex align-items-center" style={{
//       background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
//       overflow: 'hidden',
//       position: 'relative'
//     }}>
//       {/* Floating Icons */}
//       <motion.div initial={{ x: -100, y: -100 }} animate={{ x: 0, y: 0 }} transition={{ duration: 1, type: 'spring' }}
//         style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '3rem', color: 'rgba(255,255,255,0.2)' }}>
//         <FaBookOpen />
//       </motion.div>
//       <motion.div initial={{ x: 100, y: -100 }} animate={{ x: 0, y: 0 }} transition={{ duration: 1, type: 'spring', delay: 0.2 }}
//         style={{ position: 'absolute', top: '15%', right: '10%', fontSize: '4rem', color: 'rgba(255,255,255,0.2)' }}>
//         <IoMdSchool />
//       </motion.div>
//       <motion.div initial={{ x: -100, y: 100 }} animate={{ x: 0, y: 0 }} transition={{ duration: 1, type: 'spring', delay: 0.4 }}
//         style={{ position: 'absolute', bottom: '10%', left: '10%', fontSize: '3.5rem', color: 'rgba(255,255,255,0.2)' }}>
//         <FaChalkboardTeacher />
//       </motion.div>

//       {/* Toast */}
//       <ToastContainer position="top-end" className="p-3">
//         <Toast onClose={() => setShowToast(false)} show={showToast} delay={2500} autohide bg="success">
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
//             <Form.Control
//               type="email"
//               value={forgotEmail}
//               onChange={(e) => setForgotEmail(e.target.value)}
//               placeholder="you@example.com"
//             />
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
//           <div className="col-md-8 col-lg-6">
//             <motion.div variants={itemVariants} className="card shadow-lg border-0 overflow-hidden"
//               style={{ borderRadius: '20px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.9)' }}
//               whileHover={{ scale: 1.02 }}>
//               <div className="card-body p-0">
//                 <div className="row g-0">
//                   {/* Left Visual */}
//                   <div className="col-md-5 d-none d-md-flex align-items-center justify-content-center"
//                     style={{ background: 'linear-gradient(to right, #2D5D7B, #A62D69)' }}>
//                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
//                       style={{ zIndex: 1, textAlign: 'center', color: 'white' }}>
//                       <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
//                         {activeTab === 'student' ? <FaUserGraduate /> : <FaUserTie />}
//                       </div>
//                       <h4 className="fw-bold mb-0">{activeTab === 'student' ? 'Student Portal' : 'Parent Portal'}</h4>
//                       {activeTab === 'student'
//                         ? <p className="mb-0 text-white">Your gateway to knowledge</p>
//                         : <p className="mb-0 text-white">Track your child’s progress</p>}
//                     </motion.div>
//                   </div>

//                   {/* Right Form */}
//                   <div className="col-md-7">
//                     <div className="p-4 p-md-5">
//                       {/* Branding */}
//                       <motion.div variants={itemVariants} className="text-center mb-4"
//                         onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
//                         <motion.h1 className="fw-bold mb-2"
//                           style={{ background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
//                             WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
//                           NOVYA
//                         </motion.h1>
//                         <p className="text-muted">Education Management Platform</p>
//                       </motion.div>

//                       {/* Tabs */}
//                       <div className="btn-group w-100 shadow-sm mb-4">
//                         <button className={`btn ${activeTab === 'student' ? 'btn-primary' : 'btn-outline-primary'}`}
//                           onClick={() => setActiveTab('student')}>
//                           <FaUserGraduate className="me-2" /> Student
//                         </button>
//                         <button className={`btn ${activeTab === 'parent' ? 'btn-primary' : 'btn-outline-primary'}`}
//                           onClick={() => setActiveTab('parent')}>
//                           <FaUserTie className="me-2" /> Parent
//                         </button>
//                       </div>

//                       {/* Form */}
//                       <motion.form variants={containerVariants} onSubmit={handleSubmit}>
//                         {/* Username */}
//                         <div className="mb-3">
//                           <label className="form-label fw-medium">Username</label>
//                           <div className="input-group">
//                             <span className="input-group-text"><FaUserGraduate /></span>
//                             <input
//                               type="text"
//                               name="username"
//                               className="form-control"
//                               value={formData[activeTab].username}
//                               onChange={handleChange}
//                               placeholder={`Enter username`}
//                             />
//                           </div>
//                           {errors[activeTab].username && (
//                             <div className="invalid-feedback d-block">{errors[activeTab].username}</div>
//                           )}
//                         </div>

//                         {/* Password */}
//                         <div className="mb-2">
//                           <label className="form-label fw-medium">Password</label>
//                           <div className="input-group">
//                             <span className="input-group-text"><RiLockPasswordFill /></span>
//                             <input
//                               type={showPassword[activeTab] ? "text" : "password"}
//                               name="password"
//                               className="form-control"
//                               value={formData[activeTab].password}
//                               onChange={handleChange}
//                               placeholder="Enter password"
//                             />
//                             {formData[activeTab].password.length > 0 && (
//                               <span className="input-group-text" style={{ cursor: "pointer" }} onClick={togglePasswordVisibility}>
//                                 {showPassword[activeTab] ? <FaEyeSlash /> : <FaEye />}
//                               </span>
//                             )}
//                           </div>
//                           {errors[activeTab].password && (
//                             <div className="invalid-feedback d-block">{errors[activeTab].password}</div>
//                           )}
//                         </div>

//                         {/* Forgot Password */}
//                         <div className="text-end mb-3">
//                           <button type="button" className="btn btn-link p-0" onClick={() => setShowForgotModal(true)}>
//                             Forgot Password?
//                           </button>
//                         </div>

//                         {/* Submit */}
//                         <button type="submit" className="btn w-100" disabled={isLoading}
//                           style={{ background: "linear-gradient(to right, #2D5D7B, #A62D69)", color: "white" }}>
//                           {isLoading ? "Signing in..." : "Sign In"}
//                         </button>

//                         {/* Register */}
//                         <div className="text-center mt-3">
//                           <p className="text-muted">
//                             New to Novya?{" "}
//                             <button type="button" className="btn btn-link p-0" onClick={handleRegisterClick}>Create account</button>
//                           </p>
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
import { FaUserGraduate, FaUserTie, FaBookOpen, FaChalkboardTeacher, FaEye, FaEyeSlash, FaChild } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdSchool } from 'react-icons/io';
import { API_CONFIG, djangoAPI } from '../../config/api';
 
// ✅ Full Updated LoginPage with Forgot Password and Child Email for Parents
const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    student: { username: '', password: '' },
    parent: { username: '', password: '', childEmail: '' }
  });
  const [errors, setErrors] = useState({
    student: { username: '', password: '' },
    parent: { username: '', password: '', childEmail: '' }
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPassword, setShowPassword] = useState({
    student: false,
    parent: false,
  });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
 
  const navigate = useNavigate();
 
  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [name]: value,
      },
    }));
    if (errors[activeTab][name]) {
      setErrors((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [name]: '',
        },
      }));
    }
  };
 
  // ✅ Validate login form
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
 
    // Additional validation for parent: child email
    if (activeTab === 'parent' && !current.childEmail.trim()) {
      newErrors.childEmail = 'Child email is required';
      valid = false;
    } else if (activeTab === 'parent' && current.childEmail && !/\S+@\S+\.\S+/.test(current.childEmail)) {
      newErrors.childEmail = 'Please enter a valid email address';
      valid = false;
    }
 
    setErrors((prev) => ({
      ...prev,
      [activeTab]: newErrors,
    }));
 
    return valid;
  };
 
  // ✅ Toggle Password Visibility (separate for Student & Parent)
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => ({
      ...prev,
      [activeTab]: !prev[activeTab],
    }));
  };
 
  // ✅ Clear all authentication data
  const clearAuthData = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('firstName');
    localStorage.removeItem('studentData');
    localStorage.removeItem('parentData');
    localStorage.removeItem('studentDataLastFetch');
    localStorage.removeItem('parentDataLastFetch');
    console.log('🔍 Debug - All authentication data cleared');
  };

  // ✅ Handle login submit - REAL API INTEGRATION
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const current = formData[activeTab];
      setIsLoading(true);
      
      // Clear any existing authentication data first
      clearAuthData();

      try {
        // Call Django backend login API (no auth needed for login)
        const response = await djangoAPI.postNoAuth(API_CONFIG.DJANGO.AUTH.LOGIN, {
          username: current.username,
          password: current.password
        });

        // Store authentication data
        console.log('🔍 Debug - Login response:', response);
        const token = response.access || response.token;
        console.log('🔍 Debug - Token received:', token ? token.substring(0, 50) + '...' : 'No token');
        
        localStorage.setItem('userRole', activeTab);
        localStorage.setItem('userToken', token);
        localStorage.setItem('refreshToken', response.refresh);
        localStorage.setItem('username', current.username);
        
        console.log('🔍 Debug - Authentication data stored in localStorage');
        
        // Store user data if provided
        if (response.user) {
          localStorage.setItem('userId', response.user.id || response.user.userid);
          localStorage.setItem('userEmail', response.user.email);
          localStorage.setItem('firstName', response.user.firstname || response.user.first_name);
        }
        
        // Always store complete user data object for UserDetailsPage (with fallback)
        const userData = {
          firstName: response.user?.firstname || response.user?.first_name || 'User',
          lastName: response.user?.lastname || response.user?.last_name || 'Name',
          email: response.user?.email || 'user@example.com',
          userName: current.username,
          role: activeTab,
          phone: response.user?.phone || '',
          address: response.user?.address || '',
          ...(activeTab === 'student' && {
            grade: response.user?.grade || '',
            course: response.user?.course || ''
          })
        };
        
        // Store based on role
        if (activeTab === 'student') {
          localStorage.setItem('studentData', JSON.stringify(userData));
        } else {
          localStorage.setItem('parentData', JSON.stringify(userData));
        }
       
        // Store child email for parent login
        if (activeTab === 'parent' && current.childEmail) {
          localStorage.setItem('childEmail', current.childEmail);
        }
       
        setToastMsg(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} login successful!`);
        setShowToast(true);
        setIsLoading(false);

        setTimeout(() => {
          navigate(activeTab === 'student' ? '/student/dashboard' : '/parent/dashboard');
        }, 2000);
        
      } catch (error) {
        console.error('Login error:', error);
        setErrors((prev) => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            username: '',
            password: error.message || 'Invalid username or password. Please try again.'
          },
        }));
        setIsLoading(false);
      }
    }
  };
 
  // Handle register navigation
  const handleRegisterClick = () => {
    navigate('/signup');
  };
 
  // ✅ Forgot Password - Submit
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
 
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
 
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };
 
  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Floating Icons */}
      <motion.div initial={{ x: -100, y: -100 }} animate={{ x: 0, y: 0 }} transition={{ duration: 1, type: 'spring' }}
        style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '3rem', color: 'rgba(255,255,255,0.2)' }}>
        <FaBookOpen />
      </motion.div>
      <motion.div initial={{ x: 100, y: -100 }} animate={{ x: 0, y: 0 }} transition={{ duration: 1, type: 'spring', delay: 0.2 }}
        style={{ position: 'absolute', top: '15%', right: '10%', fontSize: '4rem', color: 'rgba(255,255,255,0.2)' }}>
        <IoMdSchool />
      </motion.div>
      <motion.div initial={{ x: -100, y: 100 }} animate={{ x: 0, y: 0 }} transition={{ duration: 1, type: 'spring', delay: 0.4 }}
        style={{ position: 'absolute', bottom: '10%', left: '10%', fontSize: '3.5rem', color: 'rgba(255,255,255,0.2)' }}>
        <FaChalkboardTeacher />
      </motion.div>
 
      {/* Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={2500} autohide bg="success">
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
            <Form.Control
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="you@example.com"
            />
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
          <div className="col-md-8 col-lg-6">
            <motion.div variants={itemVariants} className="card shadow-lg border-0 overflow-hidden"
              style={{ borderRadius: '20px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.9)' }}
              whileHover={{ scale: 1.02 }}>
              <div className="card-body p-0">
                <div className="row g-0">
                  {/* Left Visual */}
                  <div className="col-md-5 d-none d-md-flex align-items-center justify-content-center"
                    style={{ background: 'linear-gradient(to right, #2D5D7B, #A62D69)' }}>
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
                      style={{ zIndex: 1, textAlign: 'center', color: 'white' }}>
                      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                        {activeTab === 'student' ? <FaUserGraduate /> : <FaUserTie />}
                      </div>
                      <h4 className="fw-bold mb-0">{activeTab === 'student' ? 'Student Portal' : 'Parent Portal'}</h4>
                      {activeTab === 'student'
                        ? <p className="mb-0 text-white">Your gateway to knowledge</p>
                        : <p className="mb-0 text-white">Track your child's progress</p>}
                    </motion.div>
                  </div>
 
                  {/* Right Form */}
                  <div className="col-md-7">
                    <div className="p-4 p-md-5">
                      {/* Branding */}
                      <motion.div variants={itemVariants} className="text-center mb-4"
                        onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
                        <motion.h1 className="fw-bold mb-2"
                          style={{ background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          NOVYA
                        </motion.h1>
                        <p className="text-muted">Education Management Platform</p>
                      </motion.div>
 
                      {/* Tabs */}
                      <div className="btn-group w-100 shadow-sm mb-4">
                        <button className={`btn ${activeTab === 'student' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setActiveTab('student')}>
                          <FaUserGraduate className="me-2" /> Student
                        </button>
                        <button className={`btn ${activeTab === 'parent' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setActiveTab('parent')}>
                          <FaUserTie className="me-2" /> Parent
                        </button>
                      </div>
 
                      {/* Form */}
                      <motion.form variants={containerVariants} onSubmit={handleSubmit}>
                        {/* Username */}
                        <div className="mb-3">
                          <label className="form-label fw-medium">Username</label>
                          <div className="input-group">
                            <span className="input-group-text"><FaUserGraduate /></span>
                            <input
                              type="text"
                              name="username"
                              className="form-control"
                              value={formData[activeTab].username}
                              onChange={handleChange}
                              placeholder={`Enter username`}
                            />
                          </div>
                          {errors[activeTab].username && (
                            <div className="invalid-feedback d-block">{errors[activeTab].username}</div>
                          )}
                        </div>
 
                        {/* Password */}
                        <div className="mb-3">
                          <label className="form-label fw-medium">Password</label>
                          <div className="input-group">
                            <span className="input-group-text"><RiLockPasswordFill /></span>
                            <input
                              type={showPassword[activeTab] ? "text" : "password"}
                              name="password"
                              className="form-control"
                              value={formData[activeTab].password}
                              onChange={handleChange}
                              placeholder="Enter password"
                            />
                            {formData[activeTab].password.length > 0 && (
                              <span className="input-group-text" style={{ cursor: "pointer" }} onClick={togglePasswordVisibility}>
                                {showPassword[activeTab] ? <FaEyeSlash /> : <FaEye />}
                              </span>
                            )}
                          </div>
                          {errors[activeTab].password && (
                            <div className="invalid-feedback d-block">{errors[activeTab].password}</div>
                          )}
                        </div>
 
                        {/* Child Email Field (Only for Parent) */}
                        {activeTab === 'parent' && (
                          <div className="mb-3">
                            <label className="form-label fw-medium">Child's Email</label>
                            <div className="input-group">
                              <span className="input-group-text"><FaChild /></span>
                              <input
                                type="email"
                                name="childEmail"
                                className="form-control"
                                value={formData.parent.childEmail}
                                onChange={handleChange}
                                placeholder="Enter child's email"
                              />
                            </div>
                            {errors.parent.childEmail && (
                              <div className="invalid-feedback d-block">{errors.parent.childEmail}</div>
                            )}
                           
                          </div>
                        )}
 
                        {/* Forgot Password */}
                        <div className="text-end mb-3">
                          <button type="button" className="btn btn-link p-0" onClick={() => setShowForgotModal(true)}>
                            Forgot Password?
                          </button>
                        </div>
 
                        {/* Submit */}
                        <button type="submit" className="btn w-100" disabled={isLoading}
                          style={{ background: "linear-gradient(to right, #2D5D7B, #A62D69)", color: "white" }}>
                          {isLoading ? "Signing in..." : "Sign In"}
                        </button>
 
                        {/* Register */}
                        <div className="text-center mt-3">
                          <p className="text-muted">
                            New to Novya?{" "}
                            <button type="button" className="btn btn-link p-0" onClick={handleRegisterClick}>Create account</button>
                          </p>
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


















