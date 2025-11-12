




import React, { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaBook,
  FaPaperPlane,
  FaCalendarAlt,
  FaClock,
  FaChevronDown
} from 'react-icons/fa';
import { GiTeacher } from 'react-icons/gi';
import './Mentorship.css';

const Mentorship = () => {
  useEffect(() => {
    document.title = "Mentor-Ship | NOVYA - Your Smart Learning Platform";
  }, []);

  const form = useRef();
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState({ email: '', phone: '' });

  // ✅ Validation functions
  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendEmail = (e) => {
    e.preventDefault();

    const phone = form.current.phone.value.trim();
    const email = form.current.email.value.trim();

    // ✅ Run validations
    let newErrors = { email: '', phone: '' };
    if (!validatePhone(phone)) {
      newErrors.phone = 'Invalid phone number ';
    }
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);

    if (newErrors.phone || newErrors.email) return;

    setIsSubmitting(true);
    setStatus('Sending...');

    // Send Admin Email
    emailjs
      .sendForm(
        'service_hkgy9fk',
        'template_lblxcx9', // Admin template
        form.current,
        'XwZ4tJWAOb1e2MDqY'
      )
      .then(() => {
        // Send User Confirmation Email
        return emailjs.send(
          'service_hkgy9fk',
          'template_0vlzw3k', // User template
          {
            to_email: email,
            name: form.current.name.value,
            email,
            phone,
            class: form.current.class.value,
            course: form.current.course.value,
            date: selectedDate,
            time: selectedTime,
            notes: form.current.notes.value
          },
          'XwZ4tJWAOb1e2MDqY'
        );
      })
      .then(() => {
        setStatus('✅ Booking successful! Confirmation email sent.');
        form.current.reset();
        setSelectedDate('');
        setSelectedTime('');
        setTimeout(() => {
          setStatus('');
        }, 5000);
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        setStatus('❌ Failed to send email. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      ['00', '30'].forEach((minutes) => {
        const time = `${hour.toString().padStart(2, '0')}:${minutes}`;
        const displayTime =
          hour > 12
            ? `${(hour - 12).toString().padStart(2, '0')}:${minutes} PM`
            : hour === 12
            ? `12:${minutes} PM`
            : `${hour.toString().padStart(2, '0')}:${minutes} AM`;

        slots.push(
          <option key={time} value={time}>
            {displayTime}
          </option>
        );
      });
    }
    return slots;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="mentorship-container">
      {/* Background Elements */}
      <div className="bg-elements">
        <motion.div
          className="floating-shape shape-1"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="floating-shape shape-2"
          animate={{
            x: [0, 25, 0],
            y: [0, -20, 0],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="floating-shape shape-3"
          animate={{
            y: [0, 40, 0],
            x: [0, -15, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="mentorship-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="mentorship-card"
          variants={itemVariants}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 25px 50px rgba(0, 123, 255, 0.15)"
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Header Section */}
          <motion.div className="header-section" variants={itemVariants}>
            <motion.div
              className="icon-container"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <GiTeacher className="header-icon" />
              <div className="icon-glow"></div>
            </motion.div>

            <motion.h1 className="main-title" variants={itemVariants}>
              Personalized Mentorship Session
            </motion.h1>

            <motion.p className="subtitle" variants={itemVariants}>
              Get expert guidance tailored to your academic and career goals
            </motion.p>
          </motion.div>

          {/* Form Section */}
          <motion.form
            ref={form}
            onSubmit={sendEmail}
            className="mentorship-form"
            variants={itemVariants}
          >
            {/* Name and Email */}
            <div className="form-row">
              <motion.div className="form-group" variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <label className="form-label">
                  <FaUser className="label-icon" />
                  Full Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    required
                    className={`form-input ${focusedField === 'name' ? 'focused' : ''}`}
                    placeholder="Enter your full name"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                    }}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                  />
                  <div className="input-highlight"></div>
                </div>
              </motion.div>

              <motion.div className="form-group" variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <label className="form-label">
                  <FaEnvelope className="label-icon" />
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    required
                    className={`form-input ${focusedField === 'email' ? 'focused' : ''}`}
                    placeholder="novya1152@gmail.com"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                  />
                  <div className="input-highlight"></div>
                </div>
                {errors.email && <p className="error-text">{errors.email}</p>}
              </motion.div>
            </div>

            {/* Phone + Class */}
            <div className="form-row">
             <motion.div className="form-group" variants={itemVariants} whileHover={{ scale: 1.02 }}>
  <label className="form-label">
    <FaPhone className="label-icon" />
    Phone Number
  </label>
  <div className="phone-wrapper" style={{ display: "flex", gap: "8px" }}>
    <span
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        background: "#f5f5f5",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontWeight: "bold"
      }}
    >
      +91
    </span>
    <div className="input-wrapper" style={{ flex: 1 }}>
      <input
        type="tel"
        name="phone"
        required
        maxLength="10"
        className={`form-input ${focusedField === 'phone' ? 'focused' : ''}`}
        placeholder="Enter 10-digit mobile number"
        onInput={(e) => {
          e.target.value = e.target.value.replace(/[^0-9]/g, "");
        }}
        onFocus={() => setFocusedField('phone')}
        onBlur={() => setFocusedField('')}
      />
      <div className="input-highlight"></div>
    </div>
  </div>
  
  {/* Error message in red */}
  {errors.phone && (
    <p style={{ color: "red", marginTop: "4px", fontSize: "14px" }}>
      {errors.phone}
    </p>
  )}
</motion.div>

              <motion.div className="form-group" variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <label className="form-label">
                  <FaGraduationCap className="label-icon" />
                  Class
                </label>
                <div className="select-wrapper">
                  <select
                    name="class"
                    required
                    className={`form-select ${focusedField === 'class' ? 'focused' : ''}`}
                    onFocus={() => setFocusedField('class')}
                    onBlur={() => setFocusedField('')}
                  >
                    <option value="">Select your class</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                  <FaChevronDown className="select-arrow" />
                  <div className="input-highlight"></div>
                </div>
              </motion.div>
            </div>

            {/* Course */}
            <motion.div className="form-group full-width" variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <label className="form-label">
                <FaBook className="label-icon" />
                Area of Interest
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="course"
                  required
                  className={`form-input ${focusedField === 'course' ? 'focused' : ''}`}
                  placeholder="E.g., Computer Science, Career Advice, Research Guidance"
                  onFocus={() => setFocusedField('course')}
                  onBlur={() => setFocusedField('')}
                />
                <div className="input-highlight"></div>
              </div>
            </motion.div>

            {/* Date + Time */}
            <div className="form-row">
              <motion.div className="form-group" variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <label className="form-label">
                  <FaCalendarAlt className="label-icon" />
                  Preferred Date
                </label>
                <div className="input-wrapper">
                  <input
                    type="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={`form-input date-input ${focusedField === 'date' ? 'focused' : ''}`}
                    onFocus={() => setFocusedField('date')}
                    onBlur={() => setFocusedField('')}
                  />
                  <div className="input-highlight"></div>
                </div>
              </motion.div>

              <motion.div className="form-group" variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <label className="form-label">
                  <FaClock className="label-icon" />
                  Preferred Time
                </label>
                <div className="select-wrapper">
                  <select
                    name="time"
                    required
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    disabled={!selectedDate}
                    className={`form-select ${focusedField === 'time' ? 'focused' : ''} ${!selectedDate ? 'disabled' : ''}`}
                    onFocus={() => setFocusedField('time')}
                    onBlur={() => setFocusedField('')}
                  >
                    <option value="">Select time</option>
                    {selectedDate && generateTimeSlots()}
                  </select>
                  <FaChevronDown className="select-arrow" />
                  <div className="input-highlight"></div>
                </div>
              </motion.div>
            </div>

            {/* Notes */}
            <motion.div className="form-group full-width" variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <label className="form-label">
                <GiTeacher className="label-icon" />
                Additional Notes
              </label>
              <div className="textarea-wrapper">
                <textarea
                  name="notes"
                  rows="4"
                  className={`form-textarea ${focusedField === 'message' ? 'focused' : ''}`}
                  placeholder="Tell us about your goals or specific questions..."
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField('')}
                />
                <div className="input-highlight"></div>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 15px 35px rgba(0, 123, 255, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              <div className="btn-content">
                {isSubmitting ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="loading-content">
                    <div className="spinner"></div>
                    Processing...
                  </motion.span>
                ) : (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="default-content">
                    <FaPaperPlane className="btn-icon" />
                    Book Your Session
                  </motion.span>
                )}
              </div>
              <div className="btn-shimmer"></div>
            </motion.button>
          </motion.form>

          {/* Status Message */}
          <AnimatePresence>
            {status && (
              <motion.div
                className={`status-message ${status.includes('successful') ? 'success' : 'error'}`}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  className="status-icon"
                  animate={
                    status.includes('successful')
                      ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }
                      : { scale: [1, 1.2, 1], x: [0, -8, 8, 0] }
                  }
                  transition={{ duration: 0.6 }}
                >
                  {status.includes('successful') ? '✅' : '❌'}
                </motion.div>
                <span className="status-text">{status}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Mentorship;

