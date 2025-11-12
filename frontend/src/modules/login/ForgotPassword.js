// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export default function ForgotPassword() {
//   const [form, setForm] = useState({
//     email: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [otp, setOtp] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [resetSuccess, setResetSuccess] = useState(false);
//   const [showOtpField, setShowOtpField] = useState(false);
//   const [emailVerified, setEmailVerified] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleOtpChange = (e) => {
//     setOtp(e.target.value);
//   };

//   const sendOtp = async () => {
//     if (!form.email) {
//       toast.error('Please enter your email first!');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Simulate API call to send OTP
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       toast.success('OTP sent to your email!');
//       setShowOtpField(true);
//     } catch (error) {
//       toast.error('Failed to send OTP. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const verifyOtp = async () => {
//     if (!otp) {
//       toast.error('Please enter the OTP!');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Simulate OTP verification
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // In a real app, you would verify the OTP with your backend
//       if (otp === '123456') { // Default OTP for demo purposes
//         toast.success('Email verified successfully!');
//         setEmailVerified(true);
//       } else {
//         throw new Error('Invalid OTP');
//       }
//     } catch (error) {
//       toast.error(error.message || 'OTP verification failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Validate form
//     if (!emailVerified) {
//       toast.error('Please verify your email first!');
//       setIsLoading(false);
//       return;
//     }

//     if (form.newPassword !== form.confirmPassword) {
//       toast.error('Passwords do not match!');
//       setIsLoading(false);
//       return;
//     }

//     if (form.newPassword.length < 8) {
//       toast.error('Password must be at least 8 characters!');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Simulate API call to reset password
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // On successful reset
//       setResetSuccess(true);
//       toast.success('Password reset successfully!');

//       // Reset form
//       setForm({
//         email: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//       setOtp('');
//       setEmailVerified(false);
//       setShowOtpField(false);

//     } catch (error) {
//       toast.error(`Failed to reset password: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { staggerChildren: 0.1, delayChildren: 0.2 }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 10, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: 'spring', stiffness: 100, damping: 10 }
//     }
//   };

//   return (
//     <div className="vh-100 d-flex justify-content-center align-items-center" style={{
//       background: 'linear-gradient(135deg, #f9f9f9 0%, #f0e6f0 100%)',
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       overflow: 'hidden'
//     }}>
//       <ToastContainer
//         position="top-center"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
      
//       {resetSuccess ? (
//         <motion.div 
//           className="p-4 rounded-3 shadow-sm text-center"
//           initial={{ scale: 0.98, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           style={{
//             background: 'rgba(255, 255, 255, 0.95)',
//             backdropFilter: 'blur(8px)',
//             width: '100%',
//             maxWidth: '400px',
//             position: 'relative',
//             zIndex: 1,
//             border: '1px solid rgba(255, 255, 255, 0.3)',
//           }}
//         >
//           <div className="mb-4">
//             <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#4BB543" viewBox="0 0 16 16">
//               <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
//             </svg>
//           </div>
//           <h3 className="fw-bold mb-3" style={{ color: '#2d5d7b' }}>Password Reset Successful!</h3>
//           <p className="mb-4">Your password has been reset successfully. You can now login with your new password.</p>
//           <motion.button
//             className="btn w-100 py-2 rounded-2"
//             whileHover={{ 
//               scale: 1.02,
//               backgroundColor: '#79b3d7'
//             }}
//             whileTap={{ scale: 0.98 }}
//             style={{ 
//               backgroundColor: '#2d5d7b',
//               color: 'white',
//               fontWeight: '500',
//               border: 'none'
//             }}
//             onClick={() => setResetSuccess(false)}
//           >
//             Back to Login
//           </motion.button>
//         </motion.div>
//       ) : (
//         <>
//           <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
//             {[...Array(8)].map((_, i) => (
//               <div 
//                 key={i}
//                 className="position-absolute rounded-circle"
//                 style={{
//                   background: 'rgba(45, 93, 123, 0.05)',
//                   width: `${Math.random() * 200 + 50}px`,
//                   height: `${Math.random() * 200 + 50}px`,
//                   top: `${Math.random() * 100}%`,
//                   left: `${Math.random() * 100}%`,
//                   transform: 'translate(-50%, -50%)',
//                   animation: `pulse ${Math.random() * 8 + 8}s infinite alternate`,
//                   filter: 'blur(6px)'
//                 }}
//               />
//             ))}
//           </div>

//           <motion.div 
//             className="p-4 rounded-3 shadow-sm"
//             initial={{ scale: 0.98, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.3 }}
//             style={{
//               background: 'rgba(255, 255, 255, 0.95)',
//               backdropFilter: 'blur(8px)',
//               width: '100%',
//               maxWidth: '400px',
//               maxHeight: '90vh',
//               overflowY: 'auto',
//               position: 'relative',
//               zIndex: 1,
//               border: '1px solid rgba(255, 255, 255, 0.3)',
//               boxShadow: '0 5px 15px rgba(45, 93, 123, 0.1)'
//             }}
//           >
//             <motion.div
//               className="text-center mb-3"
//               initial={{ y: -10, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.1 }}
//             >
//               <div className="position-relative d-inline-block mb-2">
//                 <div className="position-absolute bottom-0 start-0 w-100" style={{
//                   height: '4px',
//                   background: 'rgba(45, 93, 123, 0.2)',
//                   borderRadius: '2px',
//                   zIndex: -1
//                 }} />
//                 <h3 className="fw-bold mb-0" style={{ 
//                   color: '#2d5d7b',
//                   position: 'relative',
//                   fontSize: '1.5rem'
//                 }}>Reset Password</h3>
//               </div>
//               <p className="text-muted mt-1 small">Enter your email and verify with OTP</p>
//             </motion.div>
            
//             <motion.form 
//               onSubmit={handleSubmit}
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//             >
//               <motion.div className="mb-3" variants={itemVariants}>
//                 <label className="form-label small fw-medium" style={{ color: '#555', fontSize: '0.85rem' }}>Email Address</label>
//                 <div className="input-group">
//                   <input
//                     type="email"
//                     name="email"
//                     className="form-control form-control-sm py-2 px-2 rounded-2"
//                     value={form.email}
//                     onChange={handleChange}
//                     required
//                     disabled={emailVerified}
//                     style={{
//                       border: '1px solid #ddd',
//                       transition: 'all 0.2s'
//                     }}
//                   />
//                   {!emailVerified && (
//                     <button 
//                       type="button" 
//                       className="btn btn-sm btn-outline-secondary" 
//                       onClick={sendOtp}
//                       disabled={isLoading}
//                     >
//                       {isLoading ? 'Sending...' : 'Send OTP'}
//                     </button>
//                   )}
//                 </div>
//               </motion.div>

//               {showOtpField && !emailVerified && (
//                 <motion.div 
//                   className="mb-3"
//                   variants={itemVariants}
//                   initial="hidden"
//                   animate="visible"
//                 >
//                   <label className="form-label small fw-medium" style={{ color: '#555', fontSize: '0.85rem' }}>OTP Verification</label>
//                   <div className="input-group">
//                     <input
//                       type="text"
//                       className="form-control form-control-sm py-2 px-2 rounded-2"
//                       value={otp}
//                       onChange={handleOtpChange}
//                       placeholder="Enter 6-digit OTP"
//                       maxLength="6"
//                       style={{
//                         border: '1px solid #ddd',
//                         transition: 'all 0.2s'
//                       }}
//                     />
//                     <button 
//                       type="button" 
//                       className="btn btn-sm btn-outline-primary" 
//                       onClick={verifyOtp}
//                       disabled={isLoading}
//                     >
//                       {isLoading ? 'Verifying...' : 'Verify'}
//                     </button>
//                   </div>
//                   <div className="form-text small">Demo OTP: 123456</div>
//                 </motion.div>
//               )}

//               {emailVerified && (
//                 <>
//                   <motion.div className="mb-3" variants={itemVariants}>
//                     <label className="form-label small fw-medium" style={{ color: '#555', fontSize: '0.85rem' }}>New Password</label>
//                     <input
//                       type="password"
//                       name="newPassword"
//                       className="form-control form-control-sm py-2 px-2 rounded-2"
//                       value={form.newPassword}
//                       onChange={handleChange}
//                       required
//                       minLength="8"
//                       style={{
//                         border: '1px solid #ddd',
//                         transition: 'all 0.2s'
//                       }}
//                     />
//                     <div className="form-text small">Password must be at least 8 characters</div>
//                   </motion.div>
                  
//                   <motion.div className="mb-4" variants={itemVariants}>
//                     <label className="form-label small fw-medium" style={{ color: '#555', fontSize: '0.85rem' }}>Confirm Password</label>
//                     <input
//                       type="password"
//                       name="confirmPassword"
//                       className="form-control form-control-sm py-2 px-2 rounded-2"
//                       value={form.confirmPassword}
//                       onChange={handleChange}
//                       required
//                       minLength="8"
//                       style={{
//                         border: '1px solid #ddd',
//                         transition: 'all 0.2s'
//                       }}
//                     />
//                   </motion.div>
//                 </>
//               )}
              
//               <motion.div variants={itemVariants}>
//                 <motion.button
//                   type="submit"
//                   className="btn w-100 py-2 rounded-2"
//                   whileHover={{ 
//                     scale: 1.02,
//                     backgroundColor: !isLoading ? '#79b3d7' : '#2d5d7b'
//                   }}
//                   whileTap={{ scale: isLoading ? 1 : 0.98 }}
//                   disabled={isLoading || !emailVerified}
//                   style={{ 
//                     backgroundColor: '#2d5d7b',
//                     color: 'white',
//                     fontWeight: '500',
//                     border: 'none',
//                     cursor: isLoading ? 'not-allowed' : 'pointer'
//                   }}
//                 >
//                   {isLoading ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                       Processing...
//                     </>
//                   ) : (
//                     'Reset Password'
//                   )}
//                 </motion.button>
//               </motion.div>
//             </motion.form>
//           </motion.div>
//         </>
//       )}

//       <style>
//         {`
//           @keyframes pulse {
//             0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
//             100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.2; }
//           }
//           body {
//             font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
//           }
//         `}
//       </style>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
  const [form, setForm] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const sendOtp = async () => {
    if (!form.email) {
      toast.error('Please enter your email first!');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('OTP sent to your email!');
      setShowOtpField(true);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter the OTP!');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would verify the OTP with your backend
      if (otp === '123456') { // Default OTP for demo purposes
        toast.success('Email verified successfully!');
        setEmailVerified(true);
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      toast.error(error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (!emailVerified) {
      toast.error('Please verify your email first!');
      setIsLoading(false);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    if (form.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters!');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On successful reset
      setResetSuccess(true);
      toast.success('Password reset successfully!');

      // Reset form
      setForm({
        email: '',
        newPassword: '',
        confirmPassword: ''
      });
      setOtp('');
      setEmailVerified(false);
      setShowOtpField(false);

    } catch (error) {
      toast.error(`Failed to reset password: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 }
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center" style={{
      background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden'
    }}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#2D5D7B',
          fontWeight: '500'
        }}
      />
      
      {resetSuccess ? (
        <motion.div 
          className="p-4 rounded-3 shadow-sm text-center"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            width: '100%',
            maxWidth: '400px',
            position: 'relative',
            zIndex: 1,
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#4BB543" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </div>
          <h3 className="fw-bold mb-3" style={{ 
            background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Password Reset Successful!</h3>
          <p className="mb-4 text-muted">Your password has been reset successfully. You can now login with your new password.</p>
          <motion.button
            className="btn w-100 py-2 rounded-2"
            whileHover={{ 
              scale: 1.02,
              background: 'linear-gradient(to right, #3D7DA6, #C23D82)'
            }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
              color: 'white',
              fontWeight: '500',
              border: 'none'
            }}
            onClick={() => setResetSuccess(false)}
          >
            Back to Login
          </motion.button>
        </motion.div>
      ) : (
        <>
          <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="position-absolute rounded-circle"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  width: `${Math.random() * 200 + 50}px`,
                  height: `${Math.random() * 200 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: `pulse ${Math.random() * 8 + 8}s infinite alternate`,
                  filter: 'blur(6px)'
                }}
              />
            ))}
          </div>

          <motion.div 
            className="p-4 rounded-3 shadow-sm"
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              width: '100%',
              maxWidth: '400px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              zIndex: 1,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(45, 93, 123, 0.2)'
            }}
          >
            <motion.div
              className="text-center mb-4"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="position-relative d-inline-block mb-3">
                <div className="position-absolute bottom-0 start-0 w-100" style={{
                  height: '4px',
                  background: 'linear-gradient(to right, #2D5D7B, #A62D69, #2D5D7B)',
                  borderRadius: '2px',
                  zIndex: -1,
                  opacity: 0.7
                }} />
                <h3 className="fw-bold mb-0" style={{ 
                  background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'relative',
                  fontSize: '1.8rem'
                }}>Reset Password</h3>
              </div>
              <p className="text-muted mt-2">Enter your email and verify with OTP</p>
            </motion.div>
            
            <motion.form 
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="mb-3" variants={itemVariants}>
                <label className="form-label fw-medium" style={{ color: '#2D5D7B' }}>Email Address</label>
                <div className="input-group">
                  <span className="input-group-text" style={{ 
                    background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
                    color: 'white',
                    border: 'none'
                  }}>
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control py-2 px-3 rounded-end"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={emailVerified}
                    style={{
                      border: '1px solid #dee2e6',
                      borderLeft: 'none',
                      transition: 'all 0.2s'
                    }}
                  />
                  {!emailVerified && (
                    <button 
                      type="button" 
                      className="btn" 
                      onClick={sendOtp}
                      disabled={isLoading}
                      style={{
                        background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
                        color: 'white',
                        border: 'none',
                        marginLeft: '8px'
                      }}
                    >
                      {isLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                  )}
                </div>
              </motion.div>

              {showOtpField && !emailVerified && (
                <motion.div 
                  className="mb-3"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label className="form-label fw-medium" style={{ color: '#2D5D7B' }}>OTP Verification</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ 
                      background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
                      color: 'white',
                      border: 'none'
                    }}>
                      <i className="fas fa-key"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control py-2 px-3 rounded-end"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      style={{
                        border: '1px solid #dee2e6',
                        borderLeft: 'none',
                        transition: 'all 0.2s'
                      }}
                    />
                    <button 
                      type="button" 
                      className="btn" 
                      onClick={verifyOtp}
                      disabled={isLoading}
                      style={{
                        background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
                        color: 'white',
                        border: 'none',
                        marginLeft: '8px'
                      }}
                    >
                      {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                  <div className="form-text" style={{ color: '#6c757d' }}>Demo OTP: 123456</div>
                </motion.div>
              )}

              {emailVerified && (
                <>
                  <motion.div className="mb-3" variants={itemVariants}>
                    <label className="form-label fw-medium" style={{ color: '#2D5D7B' }}>New Password</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ 
                        background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
                        color: 'white',
                        border: 'none'
                      }}>
                        <i className="fas fa-lock"></i>
                      </span>
                      <input
                        type="password"
                        name="newPassword"
                        className="form-control py-2 px-3 rounded-end"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                        minLength="8"
                        style={{
                          border: '1px solid #dee2e6',
                          borderLeft: 'none',
                          transition: 'all 0.2s'
                        }}
                      />
                    </div>
                    <div className="form-text" style={{ color: '#6c757d' }}>Password must be at least 8 characters</div>
                  </motion.div>
                  
                  <motion.div className="mb-4" variants={itemVariants}>
                    <label className="form-label fw-medium" style={{ color: '#2D5D7B' }}>Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ 
                        background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
                        color: 'white',
                        border: 'none'
                      }}>
                        <i className="fas fa-lock"></i>
                      </span>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control py-2 px-3 rounded-end"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength="8"
                        style={{
                          border: '1px solid #dee2e6',
                          borderLeft: 'none',
                          transition: 'all 0.2s'
                        }}
                      />
                    </div>
                  </motion.div>
                </>
              )}
              
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  className="btn w-100 py-2 rounded-2"
                  whileHover={{ 
                    scale: 1.02,
                    background: !isLoading ? 'linear-gradient(to right, #3D7DA6, #C23D82)' : 'linear-gradient(to right, #2D5D7B, #A62D69)'
                  }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  disabled={isLoading || !emailVerified}
                  style={{ 
                    background: 'linear-gradient(to right, #2D5D7B, #A62D69)',
                    color: 'white',
                    fontWeight: '500',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.2; }
          }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          .input-group-text {
            border-top-left-radius: 8px !important;
            border-bottom-left-radius: 8px !important;
          }
          .form-control {
            border-top-right-radius: 8px !important;
            border-bottom-right-radius: 8px !important;
          }
          .btn {
            border-radius: 8px !important;
          }
        `}
      </style>
    </div>
  );
}