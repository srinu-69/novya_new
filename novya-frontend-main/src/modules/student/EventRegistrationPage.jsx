// MAIN FUNCTIONALITIES:

// 1. EVENT REGISTRATION FORM
// - Dynamic form that loads based on event ID from URL parameters
// - Collects user details: name, email, phone with country code
// - Handles form submission with validation

// 2. FORM VALIDATION SYSTEM
// - HTML5 native validation for required fields
// - Email validation: requires @gmail.com domain specifically
// - Phone validation: Indian numbers only (starts with 6-9, 10 digits)
// - Name validation: only letters and spaces allowed

// 3. EVENT DATA MANAGEMENT
// - Fetches event details from mock data based on eventId
// - Displays event image, title, date, time, location, description
// - Shows event type with styled badges

// 4. USER EXPERIENCE FEATURES
// - Loading states during form submission
// - Success confirmation message after registration
// - Smooth animations using Framer Motion
// - Back navigation to dashboard

// 5. PHONE NUMBER HANDLING
// - Country code selection (currently only +91 India)
// - Automatic digit filtering and length restriction (10 digits)
// - Input sanitization to remove non-numeric characters

// 6. ERROR HANDLING
// - Redirects if event not found
// - Form validation feedback
// - Submission state management

// DATA FLOW:
// URL Event ID → Load Event Details → Form Input → Validation → Submit → Confirmation

 
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './EventRegistrationPage.css';
 
const EventRegistrationPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  // ADD 'countryCode' to the formData state, with a default value
  const [formData, setFormData] = useState({ name: '', email: '', countryCode: '+91', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
 
  // Mock data - In a real app, you'd fetch this from an API
  const mockUpcomingEvents = [
    { id: 1, title: 'Science Workshop', date: 'Oct 15, 2023', time: '3:00 PM', type: 'workshop', image: 'https://images.piclumen.com/normal/20250703/14/ffc10f2a812e42cd8b702a792725b8d9.webp', description: 'A hands-on workshop covering various scientific principles and experiments. Engage with experts and explore new concepts!', location: 'School Auditorium' },
    { id: 2, title: 'Career Guidance', date: 'Oct 18, 2023', time: '4:30 PM', type: 'seminar', image: 'https://images.piclumen.com/normal/20250703/14/b3c0f0ee7c854054ae648a59a82a9c9a.webp', description: 'Expert-led seminar to help students explore career paths, understand industry trends, and prepare for future opportunities.', location: 'Main Hall' },
    { id: 3, title: 'Math Olympiad', date: 'Oct 22, 2023', time: '10:00 AM', type: 'competition', image: 'https://images.piclumen.com/normal/20250703/14/7c8ecbde0fd3415f848ba00176cd3b25.webp', description: 'A challenging mathematics competition for students to test their problem-solving skills and analytical thinking.', location: 'Math Department' },
    { id: 4, title: 'Literature Seminar', date: 'Oct 25, 2023', time: '2:00 PM', type: 'workshop', image: 'https://images.piclumen.com/normal/20250703/14/08ea6901b2ad491595bc36c122451693.webp', description: 'An immersive seminar exploring classic and contemporary literature, with discussions and insights from renowned authors.', location: 'Library Conference Room' }
  ];
 
  // Modified: Only include +91 for India (as per previous requests)
  const countryCodes = [
    { code: '+91', name: 'India' },
  ];
 
  useEffect(() => {
    document.title = "Register for Event | NOVYA";
    const event = mockUpcomingEvents.find(e => e.id === parseInt(eventId));
    if (event) {
      setEventDetails(event);
    } else {
      navigate('/student/dashboard');
    }
  }, [eventId, navigate]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Allow only digits and limit to 10 characters (as per previous requests)
      const sanitizedValue = value.replace(/\D/g, ''); // Remove non-digits
      if (sanitizedValue.length > 10) {
        return; // Do not update state if input exceeds 10 characters after sanitization
      }
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
 
  const handleSubmit = (e) => {
    // ############ MODIFICATION 1 (Crucial for proper HTML5 validation) ############
    // The browser will now try to validate the form first because 'noValidate' is removed.
    // If validation fails (e.g., email or phone pattern mismatch, required field missing),
    // the browser will show its native error messages and prevent the default submission.
    // We explicitly check checkValidity() here to ensure our custom logic only runs
    // if the form is already considered valid by the browser.
    if (!e.target.checkValidity()) {
      e.preventDefault(); // Prevent React's onSubmit from proceeding if browser validation failed
      return; // Stop the function here
    }
 
    // If checkValidity() passes, then it's safe to prevent default and proceed with custom logic.
    e.preventDefault(); // Prevents default form submission (page refresh) ONLY IF VALID
 
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Registration Data:', formData, 'for Event ID:', eventId);
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      // setTimeout(() => navigate('/student/dashboard'), 3000);
    }, 2000);
  };
 
  if (!eventDetails) {
    return (
      <div className="event-registration-container container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <p className="text-center">Loading event details or event not found...</p>
      </div>
    );
  }
 
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
 
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
 
  return (
    <motion.div
      className="event-registration-container container my-5 py-5"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
    >
      <motion.button
        className="btn btn-outline-secondary mb-4 back-button"
        onClick={() => navigate('/student/dashboard')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
      </motion.button>
 
      <motion.h1
        className="text-center mb-4 event-registration-title"
        variants={fadeInVariants}
      >
        Register for <span className="highlight-text">{eventDetails.title}</span>
      </motion.h1>
 
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
          <motion.div
            className="card event-details-card shadow-lg border-0"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div className="row g-0">
              <div className="col-md-5">
                <motion.img
                  src={eventDetails.image}
                  className="img-fluid rounded-start event-detail-image"
                  alt={eventDetails.title}
                  variants={fadeInVariants}
                />
              </div>
              <div className="col-md-7">
                <div className="card-body p-5">
                  <motion.h2 className="card-title mb-4" variants={fadeInVariants}>
                    {eventDetails.title}
                    <span className={`badge ms-3 event-type-badge ${eventDetails.type}`}>{eventDetails.type.charAt(0).toUpperCase() + eventDetails.type.slice(1)}</span>
                  </motion.h2>
                  <motion.p className="card-text mb-3" variants={fadeInVariants}>
                    <i className="far fa-calendar-alt me-2 icon-color"></i> <strong>Date:</strong> {eventDetails.date}
                  </motion.p>
                  <motion.p className="card-text mb-3" variants={fadeInVariants}>
                    <i className="far fa-clock me-2 icon-color"></i> <strong>Time:</strong> {eventDetails.time}
                  </motion.p>
                  <motion.p className="card-text mb-3" variants={fadeInVariants}>
                    <i className="fas fa-map-marker-alt me-2 icon-color"></i> <strong>Location:</strong> {eventDetails.location || 'School Campus'}
                  </motion.p>
                  <motion.p className="card-text event-description mb-4" variants={fadeInVariants}>
                    {eventDetails.description}
                  </motion.p>
 
                  <motion.hr variants={fadeInVariants} />
 
                  {!submissionSuccess ? (
                    // ############ MODIFICATION 2 (Crucial for proper HTML5 validation) ############
                    // Removed the `noValidate` attribute from the <form> tag.
                    // This allows the browser to perform its native HTML5 validation checks
                    // on all form fields (including `required`, `type="email"`, and `pattern`).
                    <form onSubmit={handleSubmit} className="mt-4">
                      <motion.h4 className="mb-4" variants={fadeInVariants}>Fill your details to register:</motion.h4>
                      <motion.div className="mb-3" variants={fadeInVariants}>
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => {
                          const regex = /^[A-Za-z\s]*$/; // allow only letters and spaces
                          if (regex.test(e.target.value)) {
                            handleChange(e);
                          }
                        }}
                        required
                        disabled={isSubmitting}
                      />

                      </motion.div>
                      <motion.div className="mb-3" variants={fadeInVariants}>
                        <label htmlFor="email" className="form-label">Email address</label>
                        {/* ############ MODIFICATION 3 (Email Input Tag) ############ */}
                        {/* This is the email input field where validation rules are applied. */}
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required // Ensures the field cannot be empty
                          disabled={isSubmitting}
                          // Pattern: Requires the email to have a username part followed by "@gmail.com"
                          // [a-z0-9._%+-]+ : Allows letters, numbers, dot, underscore, percent, plus, or hyphen for the username part (one or more times)
                          // @gmail\.com    : Matches the literal string "@gmail.com" (the dot is escaped because it's a special character in regex)
                          // $              : Asserts that this is the end of the string, meaning nothing else can follow ".com"
                          pattern="[a-z0-9._%+-]+@gmail\.com$"
                          // Title: Provides a user-friendly tooltip/message if the pattern is not met
                          title="Please enter a valid Gmail address (e.g., example@gmail.com)"
                        />
                        <div className="form-text">We'll send event details to this email.</div>
                      </motion.div>
                      {/* PHONE NUMBER INPUT GROUP WITH COUNTRY CODE */}
                      <motion.div className="mb-4" variants={fadeInVariants}>
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <div className="input-group">
                          <select
                            className="form-select country-code-select" // Added custom class for potential styling
                            id="countryCode"
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            style={{ flex: '0 0 auto', width: 'auto' }} // Inline style to make select narrow
                          >
                            {countryCodes.map((cc) => (
                              <option key={cc.code} value={cc.code}>
                                {cc.code} ({cc.name})
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            maxLength="10" // Limits input to 10 characters (as per previous requests)
                            pattern="[6-9][0-9]{9}" // Pattern for Indian mobile numbers (starts with 6-9, followed by 9 digits)
                            title="Please enter a valid number " // Title for better feedback
                          />
                        </div>
                        <div className="form-text">For important event updates.</div>
                      </motion.div>
                      {/* END PHONE NUMBER INPUT GROUP */}
                      <motion.button
                        type="submit"
                        className="btn btn-primary register-btn w-100 py-2"
                        whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(45, 93, 123, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Registering...
                          </>
                        ) : (
                          'Complete Registration'
                        )}
                      </motion.button>
                    </form>
                  ) : (
                    <motion.div
                      className="alert alert-success text-center mt-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                    >
                      <h4 className="alert-heading">Registration Successful!</h4>
                      <p>Thank you, <strong>{formData.name}</strong>! Your registration for <strong>{eventDetails.title}</strong> has been received. A confirmation email has been sent to <strong>{formData.email}</strong>, and we'll keep you updated via <strong>{formData.countryCode}{formData.phone}</strong>.</p>
                      <hr />
                      <p className="mb-0">We look forward to seeing you there!</p>
                      <motion.button
                        className="btn btn-primary mt-3"
                        onClick={() => navigate('/student/dashboard')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Go to Dashboard
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
 
export default EventRegistrationPage;
 