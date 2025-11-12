// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // This is the updated isValidEmail function
// const isValidEmail = (email) => {
//   // A more robust regex that checks for a standard email format
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
//   return emailRegex.test(email);
// };

// function FreeDemo() {
//   const [showForm, setShowForm] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     course: '',
//     preferredTime: '',
//     message: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   useEffect(() => {
//     document.title = "Free demo | NOVYA - Your Smart Learning Platform";
//   }, []);

//   const handleBookDemo = () => {
//     setShowForm(true);
//   };

//   const handleCloseForm = () => {
//     setShowForm(false);
//     setShowSuccess(false);
//     setFormData({
//       name: '',
//       email: '',
//       phone: '',
//       course: '',
//       preferredTime: '',
//       message: ''
//     });
//     setErrors({});
//     setTouched({});
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'phone') {
//       const digitsOnly = value.replace(/\D/g, '');
//       if (digitsOnly.length > 10) {
//         return;
//       }
//       setFormData(prev => ({ ...prev, [name]: digitsOnly }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }

//     // Validate the field on every change if it has been touched
//     if (touched[name]) {
//       validateField(name, value);
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setTouched(prev => ({ ...prev, [name]: true }));
//     validateField(name, value);
//   };

//   const validateField = (name, value) => {
//     let errorMsg = '';

//     switch (name) {
//       case 'email':
//         if (!value.trim()) {
//           errorMsg = 'Email is required';
//         } else if (!isValidEmail(value)) {
//           errorMsg = 'Please enter a valid email address';
//         }
//         break;
//       case 'name':
//         if (!value.trim()) {
//           errorMsg = 'Name is required';
//         } else if (value.trim().length < 2) {
//           errorMsg = 'Name must be at least 2 characters';
//         } else if (!/^[a-zA-Z\s]+$/.test(value)) {
//           errorMsg = 'Name can only contain letters and spaces';
//         }
//         break;
//       case 'phone':
//         const digitsOnly = formData.phone;
//         if (!digitsOnly) {
//           errorMsg = 'Phone number is required';
//         } else if (digitsOnly.length !== 10) {
//           errorMsg = 'Phone number must be exactly 10 digits';
//         } else if (!/^[6-9]/.test(digitsOnly)) {
//           errorMsg = 'Enter a valid phone number ';
//         }
//         break;
//       case 'course':
//         if (!value.trim()) {
//           errorMsg = 'Please select a course';
//         }
//         break;
//       case 'preferredTime':
//         if (!value.trim()) {
//           errorMsg = 'Please select a preferred time';
//         }
//         break;
//       default:
//         break;
//     }

//     setErrors(prev => ({ ...prev, [name]: errorMsg }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Validate all fields
//     Object.keys(formData).forEach(key => {
//       let value = formData[key];
//       validateField(key, value);
//     });

//     // We must return true or false based on the updated errors object
//     // after all fields have been validated.
//     // We create a temporary object to hold current validation results.
//     const tempErrors = {};
//     Object.keys(formData).forEach(key => {
//         let value = formData[key];
//         switch (key) {
//             case 'email':
//                 if (!value.trim()) {
//                     tempErrors.email = 'Email is required';
//                 } else if (!isValidEmail(value)) {
//                     tempErrors.email = 'Please enter a valid email address';
//                 }
//                 break;
//             case 'name':
//                 if (!value.trim()) {
//                     tempErrors.name = 'Name is required';
//                 } else if (value.trim().length < 2) {
//                     tempErrors.name = 'Name must be at least 2 characters';
//                 } else if (!/^[a-zA-Z\s]+$/.test(value)) {
//                     tempErrors.name = 'Name can only contain letters and spaces';
//                 }
//                 break;
//             case 'phone':
//                 const digitsOnly = formData.phone;
//                 if (!digitsOnly) {
//                     tempErrors.phone = 'Phone number is required';
//                 } else if (digitsOnly.length !== 10) {
//                     tempErrors.phone = 'Phone number must be exactly 10 digits';
//                 } else if (!/^[6-9]/.test(digitsOnly)) {
//                     tempErrors.phone = 'Phone number must start with 6, 7, 8, or 9';
//                 }
//                 break;
//             case 'course':
//                 if (!value.trim()) {
//                     tempErrors.course = 'Please select a course';
//                 }
//                 break;
//             case 'preferredTime':
//                 if (!value.trim()) {
//                     tempErrors.preferredTime = 'Please select a preferred time';
//                 }
//                 break;
//             default:
//                 break;
//         }
//     });

//     setErrors(tempErrors); // Update the state with the final errors
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Mark all fields as touched for full validation feedback
//     const allTouched = {};
//     Object.keys(formData).forEach(key => {
//       allTouched[key] = true;
//     });
//     setTouched(allTouched);

//     if (validateForm()) {
//       // Handle successful form submission
//       console.log('Form submitted:', formData);
//       setShowSuccess(true);
      
//       // Auto close after 5 seconds
//       setTimeout(() => {
//         handleCloseForm();
//       }, 5000);
//     } else {
//       // Find the first invalid field and focus on it
//       const firstErrorField = Object.keys(errors).find(key => errors[key]);
//       if (firstErrorField) {
//         const element = document.querySelector(`[name="${firstErrorField}"]`);
//         if (element) {
//           element.focus();
//         }
//       }
//     }
//   };

//   return (
//     <div className="container-fluid p-0" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', overflow: 'hidden' }}>
//       {/* CSS for invalid fields */}
//       <style>
//         {`
//           .is-invalid {
//             border-color: #dc3545 !important;
//             background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='m3.5 8.5 5-5m0 5-5-5'/%3e%3c/svg%3e") !important;
//             background-repeat: no-repeat !important;
//             background-position: right 0.75rem center !important;
//             background-size: 1.25em auto !important;
//           }
//         `}
//       </style>

//       {/* Hero Section */}
//       <div className="row g-0 align-items-center position-relative flex-column flex-lg-row" style={{ minHeight: 'calc(100vh - 80px)' }}>
//         {/* Magic Sparkles */}
//         <motion.div
//           className="position-absolute top-0 start-0 w-100 h-100"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 0.3 }}
//           transition={{ duration: 2 }}
//           style={{
//             backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
//             backgroundSize: '40px 40px',
//             zIndex: 1,
//           }}
//         />

//         {/* Left Section */}
//         <div className="col-12 col-lg-6 p-5 position-relative" style={{ zIndex: 2 }}>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <h1 className="display-4 fw-bold mb-4" style={{ color: '#2D5D7B' }}>
//               Book your{' '}
//               <motion.span
//                 initial={{ scale: 1 }}
//                 animate={{
//                   scale: [1, 1.1, 1],
//                   color: ['#A62D69', '#2D5D7B', '#3a7ca5'],
//                   textShadow: ['0 0 5px #fff', '0 0 15px #3a7ca5', '0 0 10px #fff'],
//                 }}
//                 transition={{
//                   repeat: Infinity,
//                   duration: 2,
//                   ease: 'easeInOut',
//                 }}
//                 style={{
//                   fontWeight: 'bold',
//                   padding: '2px 6px',
//                   borderRadius: '6px',
//                   display: 'inline-block',
//                 }}
//               >
//                 Free Demo
//               </motion.span>{' '}
//               session
//             </h1>

//             <p className="lead mb-4" style={{ color: '#5A6A7D' }}>
//               Get a free academic counselling session with our expert educators
//             </p>

//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={handleBookDemo}
//               className="btn btn-lg px-5 py-3 fw-bold"
//               style={{
//                 background: 'linear-gradient(135deg, #2D5D7B, #3a7ca5)',
//                 color: '#fff',
//                 borderRadius: '12px',
//                 boxShadow: '0 4px 15px rgba(45, 93, 123, 0.4)',
//               }}
//             >
//               Book a free demo
//             </motion.button>
//           </motion.div>
//         </div>

//         {/* Right Section with Full Background Image */}
//         <div className="col-12 col-lg-6 position-relative">
//           <motion.div
//             initial={{ opacity: 0, scale: 1.1 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1 }}
//             className="w-100"
//             style={{
//               backgroundImage: 'url(/images/bestimg.png)',
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//               backgroundRepeat: 'no-repeat',
//               height: '400px',
//               minHeight: '100%',
//             }}
//           />
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="py-5" style={{ backgroundColor: '#fff' }}>
//         <div className="container py-5">
//           <div className="row g-4">
//             {/* Feature 1 */}
//             <div className="col-md-4">
//               <motion.div
//                 whileHover={{ y: -5 }}
//                 className="p-4 rounded-3 h-100"
//                 style={{
//                   backgroundColor: '#f8f9fa',
//                   borderLeft: '4px solid #2D5D7B',
//                 }}
//               >
//                 <div className="d-flex align-items-start">
//                   <img
//                     src="/images/bestimg.png"
//                     alt="Guidance Icon"
//                     style={{ width: '60px', height: '60px', marginRight: '15px' }}
//                   />
//                   <div>
//                     <h4 className="fw-bold mb-2" style={{ color: '#2D5D7B' }}>
//                       Personalized Guidance
//                     </h4>
//                     <p className="mb-0">
//                       Get tailored advice based on your academic goals and learning style.
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>

//             {/* Feature 2 */}
//             <div className="col-md-4">
//               <motion.div
//                 whileHover={{ y: -5 }}
//                 className="p-4 rounded-3 h-100"
//                 style={{
//                   backgroundColor: '#f8f9fa',
//                   borderLeft: '4px solid #A62D69',
//                 }}
//               >
//                 <h4 className="fw-bold mb-3" style={{ color: '#A62D69' }}>
//                   Course Selection
//                 </h4>
//                 <p className="mb-0">Understand which courses best fit your career aspirations.</p>
//               </motion.div>
//             </div>

//             {/* Feature 3 */}
//             <div className="col-md-4">
//               <motion.div
//                 whileHover={{ y: -5 }}
//                 className="p-4 rounded-3 h-100"
//                 style={{
//                   backgroundColor: '#f8f9fa',
//                   borderLeft: '4px solid #28a745',
//                 }}
//               >
//                 <h4 className="fw-bold mb-3" style={{ color: '#28a745' }}>
//                   Learning Strategy
//                 </h4>
//                 <p className="mb-0">Develop an effective study plan with our experienced educators.</p>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Booking Form Modal */}
//       <AnimatePresence>
//         {showForm && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//             style={{
//               backgroundColor: 'rgba(0, 0, 0, 0.7)',
//               zIndex: 9999,
//             }}
//           >
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               className="bg-white rounded-4 p-4 mx-3"
//               style={{
//                 maxWidth: '600px',
//                 width: '100%',
//                 maxHeight: '90vh',
//                 overflowY: 'auto',
//                 boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
//               }}
//             >
//               {!showSuccess ? (
//                 // Form Content
//                 <>
//                   <div className="d-flex justify-content-between align-items-center mb-4">
//                     <h3 className="fw-bold mb-0" style={{ color: '#2D5D7B' }}>
//                       Book Your Free Demo
//                     </h3>
//                     <button
//                       onClick={handleCloseForm}
//                       className="btn-close"
//                       aria-label="Close"
//                     ></button>
//                   </div>

//                   <form onSubmit={handleSubmit}>
//                     <div className="row g-3">
//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold" style={{ color: '#2D5D7B' }}>
//                           Full Name *
//                         </label>
//                         <input
//                           type="text"
//                           className={`form-control ${errors.name ? 'is-invalid' : ''}`}
//                           name="name"
//                           value={formData.name}
//                           onChange={handleInputChange}
//                           onBlur={handleBlur}
//                           required
//                           aria-invalid={!!errors.name}
//                           style={{ borderRadius: '8px' }}
//                         />
//                         {errors.name && (
//                           <div className="text-danger small mt-1">{errors.name}</div>
//                         )}
//                       </div>

//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold" style={{ color: '#2D5D7B' }}>
//                           Email Address *
//                         </label>
//                         <input
//                           type="email"
//                           className={`form-control ${errors.email ? 'is-invalid' : ''}`}
//                           name="email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           onBlur={handleBlur}
//                           required
//                           aria-invalid={!!errors.email}
//                           style={{ borderRadius: '8px' }}
//                         />
//                         {errors.email && (
//                           <div className="text-danger small mt-1">{errors.email}</div>
//                         )}
//                       </div>

//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold" style={{ color: '#2D5D7B' }}>
//                           Phone Number *
//                         </label>
//                         <div className="input-group">
//                           <span className="input-group-text bg-light border-end-0">+91</span>
//                           <input
//                             type="tel"
//                             className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
//                             name="phone"
//                             value={formData.phone}
//                             onChange={handleInputChange}
//                             onBlur={handleBlur}
//                             required
//                             maxLength={10}
//                             placeholder="Enter 10-digit number"
//                             pattern="[6-9]{1}[0-9]{9}"
//                             aria-invalid={!!errors.phone}
//                             style={{
//                               borderRadius: '0 8px 8px 0',
//                               borderLeft: 'none'
//                             }}
//                           />
//                         </div>
//                         {errors.phone && (
//                           <div className="text-danger small mt-1">{errors.phone}</div>
//                         )}
//                       </div>

//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold" style={{ color: '#2D5D7B' }}>
//                           Course of Interest *
//                         </label>
//                         <select
//                           className={`form-select ${errors.course ? 'is-invalid' : ''}`}
//                           name="course"
//                           value={formData.course}
//                           onChange={handleInputChange}
//                           onBlur={handleBlur}
//                           aria-invalid={!!errors.course}
//                           style={{ borderRadius: '8px' }}
//                         >
//                           <option value="">Select a course</option>
//                           <option value="mathematics">Mathematics</option>
//                           <option value="science">Science</option>
//                           <option value="english">English</option>
//                           <option value="computer-science">Computer Science</option>
//                           <option value="other">Other</option>
//                         </select>
//                         {errors.course && (
//                           <div className="text-danger small mt-1">{errors.course}</div>
//                         )}
//                       </div>

//                       <div className="col-12">
//                         <label className="form-label fw-semibold" style={{ color: '#2D5D7B' }}>
//                           Preferred Time *
//                         </label>
//                         <select
//                           className={`form-select ${errors.preferredTime ? 'is-invalid' : ''}`}
//                           name="preferredTime"
//                           value={formData.preferredTime}
//                           onChange={handleInputChange}
//                           onBlur={handleBlur}
//                           aria-invalid={!!errors.preferredTime}
//                           style={{ borderRadius: '8px' }}
//                         >
//                           <option value="">Select preferred time</option>
//                           <option value="morning">Morning (9 AM - 12 PM)</option>
//                           <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
//                           <option value="evening">Evening (6 PM - 9 PM)</option>
//                         </select>
//                         {errors.preferredTime && (
//                           <div className="text-danger small mt-1">{errors.preferredTime}</div>
//                         )}
//                       </div>

//                       <div className="col-12">
//                         <label className="form-label fw-semibold" style={{ color: '#2D5D7B' }}>
//                           Additional Message
//                         </label>
//                         <textarea
//                           className="form-control"
//                           name="message"
//                           value={formData.message}
//                           onChange={handleInputChange}
//                           rows="3"
//                           placeholder="Tell us about your learning goals or any specific requirements..."
//                           style={{ borderRadius: '8px', border: '2px solid #e9ecef' }}
//                         />
//                       </div>
//                     </div>

//                     <div className="d-flex gap-3 mt-4">
//                       <button
//                         type="button"
//                         onClick={handleCloseForm}
//                         className="btn btn-outline-secondary flex-fill"
//                         style={{ borderRadius: '8px' }}
//                       >
//                         Cancel
//                       </button>
//                       <motion.button
//                         type="submit"
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         className="btn flex-fill fw-bold"
//                         style={{
//                           background: 'linear-gradient(135deg, #2D5D7B, #3a7ca5)',
//                           color: '#fff',
//                           borderRadius: '8px',
//                           border: 'none',
//                         }}
//                       >
//                         Book Demo
//                       </motion.button>
//                     </div>
//                   </form>
//                 </>
//               ) : (
//                 // Success Message
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                   className="text-center py-4"
//                 >
//                   {/* Success Icon */}
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
//                     className="mb-4"
//                   >
//                     <div
//                       className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
//                       style={{
//                         width: '80px',
//                         height: '80px',
//                         background: 'linear-gradient(135deg, #28a745, #20c997)',
//                         color: 'white'
//                       }}
//                     >
//                       <svg width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
//                         <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
//                         <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
//                       </svg>
//                     </div>
//                   </motion.div>

//                   {/* Thank You Message */}
//                   <motion.h3
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.4 }}
//                     className="fw-bold mb-3"
//                     style={{ color: '#2D5D7B' }}
//                   >
//                     Thank You!
//                   </motion.h3>

//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.6 }}
//                     className="mb-4"
//                     style={{ color: '#5A6A7D', fontSize: '1.1rem' }}
//                   >
//                     Your demo session has been successfully booked.
//                   </motion.p>

//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.8 }}
//                     className="p-3 rounded-3 mb-4"
//                     style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}
//                   >
//                     <p className="mb-2" style={{ color: '#2D5D7B' }}>
//                       <strong>What's Next?</strong>
//                     </p>
//                     <p className="mb-0" style={{ color: '#5A6A7D' }}>
//                       Detailed information and a demo session link will be sent to your email shortly.
//                       Our team will contact you within 24 hours to confirm your preferred time slot.
//                     </p>
//                   </motion.div>

//                   <motion.button
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 1 }}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={handleCloseForm}
//                     className="btn btn-lg px-4 fw-bold"
//                     style={{
//                       background: 'linear-gradient(135deg, #2D5D7B, #3a7ca5)',
//                       color: '#fff',
//                       borderRadius: '8px',
//                       border: 'none',
//                     }}
//                   >
//                     Continue Exploring
//                   </motion.button>

//                   {/* Auto-close indicator */}
//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 3 }}
//                     className="mt-3 small text-muted"
//                   >
//                     This window will close automatically in 5 seconds
//                   </motion.p>
//                 </motion.div>
//               )}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default FreeDemo;








import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';

// This is the updated isValidEmail function
const isValidEmail = (email) => {
  // A more robust regex that checks for a standard email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
  return emailRegex.test(email);
};

function FreeDemo() {
  const { t } = useTranslation();
  
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    preferredTime: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    document.title = `${t('freedemo.title')} | NOVYA - Your Smart Learning Platform`;
  }, [t]);

  const handleBookDemo = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setShowSuccess(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      course: '',
      preferredTime: '',
      message: ''
    });
    setErrors({});
    setTouched({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 10) {
        return;
      }
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Validate the field on every change if it has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = '';

    switch (name) {
      case 'email':
        if (!value.trim()) {
          errorMsg = t('freedemo.errors.emailRequired');
        } else if (!isValidEmail(value)) {
          errorMsg = t('freedemo.errors.invalidEmail');
        }
        break;
      case 'name':
        if (!value.trim()) {
          errorMsg = t('freedemo.errors.nameRequired');
        } else if (value.trim().length < 2) {
          errorMsg = t('freedemo.errors.nameMinLength');
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          errorMsg = t('freedemo.errors.nameInvalid');
        }
        break;
      case 'phone':
        const digitsOnly = formData.phone;
        if (!digitsOnly) {
          errorMsg = t('freedemo.errors.phoneRequired');
        } else if (digitsOnly.length !== 10) {
          errorMsg = t('freedemo.errors.phoneLength');
        } else if (!/^[6-9]/.test(digitsOnly)) {
          errorMsg = t('freedemo.errors.phoneInvalid');
        }
        break;
      case 'course':
        if (!value.trim()) {
          errorMsg = t('freedemo.errors.courseRequired');
        }
        break;
      case 'preferredTime':
        if (!value.trim()) {
          errorMsg = t('freedemo.errors.timeRequired');
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach(key => {
      let value = formData[key];
      switch (key) {
        case 'email':
          if (!value.trim()) {
            newErrors.email = t('freedemo.errors.emailRequired');
          } else if (!isValidEmail(value)) {
            newErrors.email = t('freedemo.errors.invalidEmail');
          }
          break;
        case 'name':
          if (!value.trim()) {
            newErrors.name = t('freedemo.errors.nameRequired');
          } else if (value.trim().length < 2) {
            newErrors.name = t('freedemo.errors.nameMinLength');
          } else if (!/^[a-zA-Z\s]+$/.test(value)) {
            newErrors.name = t('freedemo.errors.nameInvalid');
          }
          break;
        case 'phone':
          const digitsOnly = formData.phone;
          if (!digitsOnly) {
            newErrors.phone = t('freedemo.errors.phoneRequired');
          } else if (digitsOnly.length !== 10) {
            newErrors.phone = t('freedemo.errors.phoneLength');
          } else if (!/^[6-9]/.test(digitsOnly)) {
            newErrors.phone = t('freedemo.errors.phoneInvalid');
          }
          break;
        case 'course':
          if (!value.trim()) {
            newErrors.course = t('freedemo.errors.courseRequired');
          }
          break;
        case 'preferredTime':
          if (!value.trim()) {
            newErrors.preferredTime = t('freedemo.errors.timeRequired');
          }
          break;
        default:
          break;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched for full validation feedback
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (validateForm()) {
      // Handle successful form submission
      console.log('Form submitted:', formData);
      setShowSuccess(true);
      
      // Auto close after 5 seconds
      setTimeout(() => {
        handleCloseForm();
      }, 5000);
    } else {
      // Find the first invalid field and focus on it
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.focus();
        }
      }
    }
  };

  const courses = [
    { value: 'mathematics', label: t('freedemo.courses.mathematics') },
    { value: 'science', label: t('freedemo.courses.science') },
    { value: 'english', label: t('freedemo.courses.english') },
    { value: 'computer-science', label: t('freedemo.courses.computerScience') },
    { value: 'other', label: t('freedemo.courses.other') }
  ];

  const times = [
    { value: 'morning', label: t('freedemo.times.morning') },
    { value: 'afternoon', label: t('freedemo.times.afternoon') },
    { value: 'evening', label: t('freedemo.times.evening') }
  ];

  return (
    <div className="container-fluid p-0" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', overflow: 'hidden' }}>
      {/* CSS for invalid fields */}
      <style>
        {`
          .is-invalid {
            border-color: #dc3545 !important;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='m3.5 8.5 5-5m0 5-5-5'/%3e%3c/svg%3e") !important;
            background-repeat: no-repeat !important;
            background-position: right 0.75rem center !important;
            background-size: 1.25em auto !important;
          }
        `}
      </style>

      {/* Hero Section */}
      <div className="row g-0 align-items-center position-relative flex-column flex-lg-row" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Magic Sparkles */}
        <motion.div
          className="position-absolute top-0 start-0 w-100 h-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
          style={{
            backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            zIndex: 1,
          }}
        />

        {/* Left Section */}
        <div className="col-12 col-lg-6 p-5 position-relative" style={{ zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="display-4 fw-bold mb-4" style={{ color: '#2D5D7B' }}>
              {t('freedemo.hero.title1')}{' '}
              <motion.span
                initial={{ scale: 1 }}
                animate={{
                  scale: [1, 1.1, 1],
                  color: ['#A62D69', '#2D5D7B', '#3a7ca5'],
                  textShadow: ['0 0 5px #fff', '0 0 15px #3a7ca5', '0 0 10px #fff'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                }}
                style={{
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  display: 'inline-block',
                }}
              >
                {t('freedemo.hero.highlight')}
              </motion.span>{' '}
              {t('freedemo.hero.title2')}
            </h1>

            <p className="lead mb-4" style={{ color: '#5A6A7D' }}>
              {t('freedemo.hero.subtitle')}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookDemo}
              className="btn btn-lg px-5 py-3 fw-bold"
              style={{
                background: 'linear-gradient(135deg, #2D5D7B, #3a7ca5)',
                color: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(45, 93, 123, 0.4)',
              }}
            >
              {t('freedemo.hero.button')}
            </motion.button>
          </motion.div>
        </div>

        {/* Right Section with Full Background Image */}
        <div className="col-12 col-lg-6 position-relative">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-100"
            style={{
              backgroundImage: 'url(/images/bestimg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              height: '400px',
              minHeight: '100%',
            }}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-5" style={{ backgroundColor: '#fff' }}>
        <div className="container py-5">
          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-md-4">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-4 rounded-3 h-100"
                style={{
                  backgroundColor: '#f8f9fa',
                  borderLeft: '4px solid #2D5D7B',
                }}
              >
                <div className="d-flex align-items-start">
                  <img
                    src="/images/bestimg.png"
                    alt={t('freedemo.features.1.iconAlt')}
                    style={{ width: '60px', height: '60px', marginRight: '15px' }}
                  />
                  <div>
                    <h4 className="fw-bold mb-2" style={{ color: '#2D5D7B' }}>
                      {t('freedemo.features.1.title')}
                    </h4>
                    <p className="mb-0">
                      {t('freedemo.features.1.description')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-4">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-4 rounded-3 h-100"
                style={{
                  backgroundColor: '#f8f9fa',
                  borderLeft: '4px solid #A62D69',
                }}
              >
                <h4 className="fw-bold mb-3" style={{ color: '#A62D69' }}>
                  {t('freedemo.features.2.title')}
                </h4>
                <p className="mb-0">{t('freedemo.features.2.description')}</p>
              </motion.div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-4">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-4 rounded-3 h-100"
                style={{
                  backgroundColor: '#f8f9fa',
                  borderLeft: '4px solid #28a745',
                }}
              >
                <h4 className="fw-bold mb-3" style={{ color: '#28a745' }}>
                  {t('freedemo.features.3.title')}
                </h4>
                <p className="mb-0">{t('freedemo.features.3.description')}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 9999,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-4 p-4 mx-3"
              style={{
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
            >
              {!showSuccess ? (
                // Form Content
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0" style={{ color: '#2D5D7B' }}>
                      {t('freedemo.modal.title')}
                    </h3>
                    <button
                      onClick={handleCloseForm}
                      className="btn-close"
                      aria-label={t('freedemo.modal.closeAria')}
                    ></button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ color: '#2D5D7B' }}>
                          {t('freedemo.modal.labels.name')} *
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                          aria-invalid={!!errors.name}
                          style={{ borderRadius: '8px' }}
                        />
                        {errors.name && (
                          <div className="text-danger small mt-1">{errors.name}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ color: '#2D5D7B' }}>
                          {t('freedemo.modal.labels.email')} *
                        </label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                          aria-invalid={!!errors.email}
                          style={{ borderRadius: '8px' }}
                        />
                        {errors.email && (
                          <div className="text-danger small mt-1">{errors.email}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ color: '#2D5D7B' }}>
                          {t('freedemo.modal.labels.phone')} *
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">{t('freedemo.modal.phonePrefix')}</span>
                          <input
                            type="tel"
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            maxLength={10}
                            placeholder={t('freedemo.modal.placeholders.phone')}
                            pattern="[6-9]{1}[0-9]{9}"
                            aria-invalid={!!errors.phone}
                            style={{
                              borderRadius: '0 8px 8px 0',
                              borderLeft: 'none'
                            }}
                          />
                        </div>
                        {errors.phone && (
                          <div className="text-danger small mt-1">{errors.phone}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ color: '#2D5D7B' }}>
                          {t('freedemo.modal.labels.course')} *
                        </label>
                        <select
                          className={`form-select ${errors.course ? 'is-invalid' : ''}`}
                          name="course"
                          value={formData.course}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          aria-invalid={!!errors.course}
                          style={{ borderRadius: '8px' }}
                        >
                          <option value="">{t('freedemo.modal.placeholders.course')}</option>
                          {courses.map((course) => (
                            <option key={course.value} value={course.value}>
                              {course.label}
                            </option>
                          ))}
                        </select>
                        {errors.course && (
                          <div className="text-danger small mt-1">{errors.course}</div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold" style={{ color: '#2D5D7B' }}>
                          {t('freedemo.modal.labels.time')} *
                        </label>
                        <select
                          className={`form-select ${errors.preferredTime ? 'is-invalid' : ''}`}
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          aria-invalid={!!errors.preferredTime}
                          style={{ borderRadius: '8px' }}
                        >
                          <option value="">{t('freedemo.modal.placeholders.time')}</option>
                          {times.map((time) => (
                            <option key={time.value} value={time.value}>
                              {time.label}
                            </option>
                          ))}
                        </select>
                        {errors.preferredTime && (
                          <div className="text-danger small mt-1">{errors.preferredTime}</div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold" style={{ color: '#2D5D7B' }}>
                          {t('freedemo.modal.labels.message')}
                        </label>
                        <textarea
                          className="form-control"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows="3"
                          placeholder={t('freedemo.modal.placeholders.message')}
                          style={{ borderRadius: '8px', border: '2px solid #e9ecef' }}
                        />
                      </div>
                    </div>

                    <div className="d-flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={handleCloseForm}
                        className="btn btn-outline-secondary flex-fill"
                        style={{ borderRadius: '8px' }}
                      >
                        {t('freedemo.modal.buttons.cancel')}
                      </button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn flex-fill fw-bold"
                        style={{
                          background: 'linear-gradient(135deg, #2D5D7B, #3a7ca5)',
                          color: '#fff',
                          borderRadius: '8px',
                          border: 'none',
                        }}
                      >
                        {t('freedemo.modal.buttons.bookDemo')}
                      </motion.button>
                    </div>
                  </form>
                </>
              ) : (
                // Success Message
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-4"
                >
                  {/* Success Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="mb-4"
                  >
                    <div
                      className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #28a745, #20c997)',
                        color: 'white'
                      }}
                    >
                      <svg width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                      </svg>
                    </div>
                  </motion.div>

                  {/* Thank You Message */}
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="fw-bold mb-3"
                    style={{ color: '#2D5D7B' }}
                  >
                    {t('freedemo.success.thankYou')}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-4"
                    style={{ color: '#5A6A7D', fontSize: '1.1rem' }}
                  >
                    {t('freedemo.success.message')}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="p-3 rounded-3 mb-4"
                    style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}
                  >
                    <p className="mb-2" style={{ color: '#2D5D7B' }}>
                      <strong>{t('freedemo.success.nextTitle')}</strong>
                    </p>
                    <p className="mb-0" style={{ color: '#5A6A7D' }}>
                      {t('freedemo.success.nextDescription')}
                    </p>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloseForm}
                    className="btn btn-lg px-4 fw-bold"
                    style={{
                      background: 'linear-gradient(135deg, #2D5D7B, #3a7ca5)',
                      color: '#fff',
                      borderRadius: '8px',
                      border: 'none',
                    }}
                  >
                    {t('freedemo.success.continueButton')}
                  </motion.button>

                  {/* Auto-close indicator */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                    className="mt-3 small text-muted"
                  >
                    {t('freedemo.success.autoClose')}
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FreeDemo;