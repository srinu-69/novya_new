

// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function Contact() {
//   useEffect(() => {
//     document.title = "Contact Us | NOVYA - Your Smart Learning Platform";
//   }, []);

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     reason: '',
//     message: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   // ✅ Email validation function
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
//   const isValidEmail = (email) => {
//     if (!emailRegex.test(email)) return false;
//     if (email.includes('..')) return false; // block double dots
//     if (email.includes(',')) return false;  // block commas
//     return true;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     // Only validate if the field has been touched (blurred at least once)
//     if (touched[name]) {
//       validateField(name, value);
//     }
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched(prev => ({ ...prev, [name]: true }));
//     validateField(name, formData[name]);
//   };

//   const validateField = (name, value) => {
//     let errorMsg = '';

//     if (name === 'name') {
//       if (!value.trim()) {
//         errorMsg = 'Full Name is required';
//       } else if (value.trim().length < 2) {
//         errorMsg = 'Name must be at least 2 characters';
//       }
//     } else if (name === 'email') {
//       if (!value.trim()) {
//         errorMsg = 'Email is required';
//       } else if (!isValidEmail(value)) {
//         errorMsg = 'Enter a valid email address (e.g., user@example.com)';
//       }
//     } else if (name === 'reason' && !value.trim()) {
//       errorMsg = 'Please select a reason';
//     } else if (name === 'message') {
//       if (!value.trim()) {
//         errorMsg = 'Message cannot be empty';
//       } else if (value.trim().length < 10) {
//         errorMsg = 'Message should be at least 10 characters';
//       }
//     }

//     setErrors(prev => ({ ...prev, [name]: errorMsg }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Full Name is required';
//     } else if (formData.name.trim().length < 2) {
//       newErrors.name = 'Name must be at least 2 characters';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!isValidEmail(formData.email)) {
//       newErrors.email = 'Enter a valid email address (e.g., user@example.com)';
//     }

//     if (!formData.reason.trim()) newErrors.reason = 'Please select a reason';

//     if (!formData.message.trim()) {
//       newErrors.message = 'Message cannot be empty';
//     } else if (formData.message.trim().length < 10) {
//       newErrors.message = 'Message should be at least 10 characters';
//     }

//     setErrors(newErrors);
//     setTouched({
//       name: true,
//       email: true,
//       reason: true,
//       message: true
//     });

//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error('⚠️ Please fix the highlighted errors!');
//       return;
//     }

//     toast.success('🎉 THANK YOU for contacting us, we will contact you soon!');
//     setFormData({ name: '', email: '', reason: '', message: '' });
//     setErrors({});
//     setTouched({});
//   };

//   // Updated to avoid navbar overlap
//   const gradientAnimation = {
//     background: 'linear-gradient(-45deg, #F4F8FB, #e0f7fa, #ffffff, #fce4ec)',
//     backgroundSize: '400% 400%',
//     animation: 'gradientMove 10s ease infinite',
//     minHeight: '100vh',
//     paddingTop: '120px',
//     paddingBottom: '60px'
//   };

//   const glassCardStyle = {
//     backdropFilter: 'blur(12px)',
//     backgroundColor: 'rgba(255, 255, 255, 0.85)',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//     boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
//   };

//   return (
//     <section style={gradientAnimation}>
//       <style>
//         {`
//           @keyframes gradientMove {
//             0%, 100% { background-position: 0% 50%; }
//             50% { background-position: 100% 50%; }
//           }
//           .form-control.is-invalid, .form-select.is-invalid {
//             border-color: #dc3545;
//             background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath d='m5.8 3.6.4.4.4-.4'/%3e%3cpath d='M6 7v2'/%3e%3c/svg%3e");
//             background-repeat: no-repeat;
//             background-position: right calc(0.375em + 0.1875rem) center;
//             background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
//           }
//         `}
//       </style>

//       <div className="container">
//         <div className="text-center mb-5 mt-4">
//           <h2 className="fw-bold" style={{ color: '#2D5D7B', marginTop: '20px' }}>
//             📬 Let's Connect
//           </h2>
//           <p className="text-muted">Tell us what you're looking for — we're here to help.</p>
//         </div>

//         <div className="row align-items-center">
//           {/* Form Section */}
//           <div className="col-lg-6 mb-5 mb-lg-0">
//             <form
//               className="p-4 rounded shadow-lg"
//               onSubmit={handleSubmit}
//               style={glassCardStyle}
//               noValidate
//             >
//               {/* Full Name */}
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">👤 Full Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   className={`form-control rounded-pill px-4 ${errors.name ? 'is-invalid' : ''}`}
//                   placeholder="Your name"
//                   value={formData.name}
//                   onChange={(e) => {
//                     const lettersOnly = e.target.value.replace(/[^A-Za-z\s]/g, ''); // allow only letters & spaces
//                     handleChange({
//                       target: { name: "name", value: lettersOnly }
//                     });
//                   }}
//                   onBlur={handleBlur}
//                 />
//                 {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
//               </div>

//               {/* Email */}
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">📧 Email Address</label>
//                 <input
//                   type="email"
//                   name="email"
//                   className={`form-control rounded-pill px-4 ${errors.email ? 'is-invalid' : ''}`}
//                   placeholder="you@example.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                 />
//                 {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
//               </div>

//               {/* Reason */}
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">📌 What do you need help with?</label>
//                 <select
//                   name="reason"
//                   className={`form-select rounded-pill px-4 ${errors.reason ? 'is-invalid' : ''}`}
//                   value={formData.reason}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                 >
//                   <option value="">Select one...</option>
//                   <option value="student-support">I'm a Student needing support</option>
//                   <option value="parent-info">I'm a Parent with questions</option>
//                   <option value="partnership">Interested in partnership</option>
//                   <option value="career">Looking to work with you</option>
//                   <option value="other">Other</option>
//                 </select>
//                 {errors.reason && <div className="text-danger small mt-1">{errors.reason}</div>}
//               </div>

//               {/* Message */}
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">💬 Message</label>
//                 <textarea
//                   name="message"
//                   rows="4"
//                   className={`form-control rounded px-4 py-2 ${errors.message ? 'is-invalid' : ''}`}
//                   placeholder="Tell us more..."
//                   value={formData.message}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                 />
//                 {errors.message && <div className="text-danger small mt-1">{errors.message}</div>}
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 className="btn w-100"
//                 style={{
//                   backgroundColor: '#2D5D7B',
//                   color: '#fff',
//                   fontWeight: '600',
//                   borderRadius: '50px'
//                 }}
//               >
//                 🚀 Submit Request
//               </button>

//               <div className="text-center mt-4">
//                 <a
//                   href="https://wa.me/919999999999?text=Hi%20I%20have%20a%20question%20about%20LMS%20AI"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="btn btn-success rounded-pill px-4 py-2 fw-semibold"
//                 >
//                   💬 Chat on WhatsApp
//                 </a>
//               </div>
//             </form>
//           </div>

//           {/* Image Section */}
//           <div className="col-lg-6 text-center">
//             <img
//               src="/images/ai-removebg.png"
//               alt="AI Illustration"
//               className="img-fluid"
//               style={{ maxHeight: '500px', width: '100%', objectFit: 'contain' }}
//             />
//           </div>
//         </div>
//       </div>

//       <ToastContainer position="bottom-center" autoClose={3000} />
//     </section>
//   );
// }

// export default Contact;









 
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
function Contact() {
  const { t } = useTranslation();
 
  useEffect(() => {
    document.title = `${t('contact.title')} | NOVYA - Your Smart Learning Platform`;
  }, [t]);
 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    message: ''
  });
 
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
 
  // ✅ Email validation function
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
  const isValidEmail = (email) => {
    if (!emailRegex.test(email)) return false;
    if (email.includes('..')) return false; // block double dots
    if (email.includes(',')) return false;  // block commas
    return true;
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
 
    // Only validate if the field has been touched (blurred at least once)
    if (touched[name]) {
      validateField(name, value);
    }
  };
 
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };
 
  const validateField = (name, value) => {
    let errorMsg = '';
 
    if (name === 'name') {
      if (!value.trim()) {
        errorMsg = t('contact.errors.nameRequired');
      } else if (value.trim().length < 2) {
        errorMsg = t('contact.errors.nameMinLength');
      }
    } else if (name === 'email') {
      if (!value.trim()) {
        errorMsg = t('contact.errors.emailRequired');
      } else if (!isValidEmail(value)) {
        errorMsg = t('contact.errors.invalidEmail');
      }
    } else if (name === 'reason' && !value.trim()) {
      errorMsg = t('contact.errors.reasonRequired');
    } else if (name === 'message') {
      if (!value.trim()) {
        errorMsg = t('contact.errors.messageRequired');
      } else if (value.trim().length < 10) {
        errorMsg = t('contact.errors.messageMinLength');
      }
    }
 
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };
 
  const validateForm = () => {
    const newErrors = {};
 
    if (!formData.name.trim()) {
      newErrors.name = t('contact.errors.nameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('contact.errors.nameMinLength');
    }
 
    if (!formData.email.trim()) {
      newErrors.email = t('contact.errors.emailRequired');
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t('contact.errors.invalidEmail');
    }
 
    if (!formData.reason.trim()) newErrors.reason = t('contact.errors.reasonRequired');
 
    if (!formData.message.trim()) {
      newErrors.message = t('contact.errors.messageRequired');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.errors.messageMinLength');
    }
 
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      reason: true,
      message: true
    });
 
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    if (!validateForm()) {
      toast.error(t('contact.submitError'));
      return;
    }
 
    toast.success(t('contact.submitSuccess'));
    setFormData({ name: '', email: '', reason: '', message: '' });
    setErrors({});
    setTouched({});
  };
 
  // Updated to avoid navbar overlap
  const gradientAnimation = {
    background: 'linear-gradient(-45deg, #F4F8FB, #e0f7fa, #ffffff, #fce4ec)',
    backgroundSize: '400% 400%',
    animation: 'gradientMove 10s ease infinite',
    minHeight: '100vh',
    paddingTop: '120px',
    paddingBottom: '60px'
  };
 
  const glassCardStyle = {
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
  };
 
  const reasons = [
    { value: 'student-support', label: t('contact.reasons.studentSupport') },
    { value: 'parent-info', label: t('contact.reasons.parentInfo') },
    { value: 'partnership', label: t('contact.reasons.partnership') },
    { value: 'career', label: t('contact.reasons.career') },
    { value: 'other', label: t('contact.reasons.other') }
  ];
 
  return (
    <section style={gradientAnimation}>
      <style>
        {`
          @keyframes gradientMove {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .form-control.is-invalid, .form-select.is-invalid {
            border-color: #dc3545;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath d='m5.8 3.6.4.4.4-.4'/%3e%3cpath d='M6 7v2'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right calc(0.375em + 0.1875rem) center;
            background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
          }
        `}
      </style>
 
      <div className="container">
        <div className="text-center mb-5 mt-4">
          <h2 className="fw-bold" style={{ color: '#2D5D7B', marginTop: '20px' }}>
            {t('contact.header')}
          </h2>
          <p className="text-muted">{t('contact.subtitle')}</p>
        </div>
 
        <div className="row align-items-center">
          {/* Form Section */}
          <div className="col-lg-6 mb-5 mb-lg-0">
            <form
              className="p-4 rounded shadow-lg"
              onSubmit={handleSubmit}
              style={glassCardStyle}
              noValidate
            >
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">{t('contact.labels.name')}</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control rounded-pill px-4 ${errors.name ? 'is-invalid' : ''}`}
                  placeholder={t('contact.placeholders.name')}
                  value={formData.name}
                  onChange={(e) => {
                    const lettersOnly = e.target.value.replace(/[^A-Za-z\s]/g, ''); // allow only letters & spaces
                    handleChange({
                      target: { name: "name", value: lettersOnly }
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
              </div>
 
              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">{t('contact.labels.email')}</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control rounded-pill px-4 ${errors.email ? 'is-invalid' : ''}`}
                  placeholder={t('contact.placeholders.email')}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
              </div>
 
              {/* Reason */}
              <div className="mb-3">
                <label className="form-label fw-semibold">{t('contact.labels.reason')}</label>
                <select
                  name="reason"
                  className={`form-select rounded-pill px-4 ${errors.reason ? 'is-invalid' : ''}`}
                  value={formData.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">{t('contact.placeholders.selectReason')}</option>
                  {reasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
                {errors.reason && <div className="text-danger small mt-1">{errors.reason}</div>}
              </div>
 
              {/* Message */}
              <div className="mb-3">
                <label className="form-label fw-semibold">{t('contact.labels.message')}</label>
                <textarea
                  name="message"
                  rows="4"
                  className={`form-control rounded px-4 py-2 ${errors.message ? 'is-invalid' : ''}`}
                  placeholder={t('contact.placeholders.message')}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.message && <div className="text-danger small mt-1">{errors.message}</div>}
              </div>
 
              {/* Submit */}
              <button
                type="submit"
                className="btn w-100"
                style={{
                  backgroundColor: '#2D5D7B',
                  color: '#fff',
                  fontWeight: '600',
                  borderRadius: '50px'
                }}
              >
                {t('contact.submitButton')}
              </button>
 
              <div className="text-center mt-4">
                <a
                  href="https://wa.me/919999999999?text=Hi%20I%20have%20a%20question%20about%20LMS%20AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success rounded-pill px-4 py-2 fw-semibold"
                >
                  {t('contact.whatsappButton')}
                </a>
              </div>
            </form>
          </div>
 
          {/* Image Section */}
          <div className="col-lg-6 text-center">
            <img
              src="/images/ai-removebg.png"
              alt={t('contact.imageAlt')}
              className="img-fluid"
              style={{ maxHeight: '500px', width: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
 
      <ToastContainer position="bottom-center" autoClose={3000} />
    </section>
  );
}
 
export default Contact;
 