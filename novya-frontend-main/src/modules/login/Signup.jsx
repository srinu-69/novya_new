
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_CONFIG, djangoAPI } from "../../config/api";

function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roleFromUrl = queryParams.get('role') || 'student';
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "", // Added userName
    phone: "",
    email: "",
    role: roleFromUrl,
    // parentEmail removed - students will add it in their profile after login
    grade: "", // Added grade for student and teacher
    school: "", // Added school for student and teacher
    password: "",
    confirmPassword: "",
  });
  
  useEffect(() => {
    localStorage.setItem("userRole", form.role);
  }, [form.role]);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: numericValue });
    } else {
      setForm({ ...form, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (name === "password" && errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9][0-9]{9}$/;

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!nameRegex.test(form.firstName)) {
      newErrors.firstName = "First name should contain only letters and spaces";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!nameRegex.test(form.lastName)) {
      newErrors.lastName = "Last name should contain only letters and spaces";
    }

    if (!form.userName.trim()) { // Validate userName
      newErrors.userName = "User name is required";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Parent email removed from student registration - will be added in student profile after login
    
    // Validate grade and school for student and teacher
    if ((form.role === "student" || form.role === "teacher") && !form.grade.trim()) {
      newErrors.grade = "Grade is required";
    }
    
    if ((form.role === "student" || form.role === "teacher") && !form.school.trim()) {
      newErrors.school = "School is required";
    }
    
    // No parentEmail validation needed for teacher or parent roles

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// ✅ Handle signup submit - REAL API INTEGRATION
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Prevent duplicate submissions
  if (isSubmitting) {
    console.log('⚠️ Already submitting, ignoring duplicate request');
    return;
  }
  
  console.log('🔍 Form submission started', { form, errors });

  if (!validateForm()) {
    console.log('❌ Form validation failed', errors);
    return;
  }
  
  setIsSubmitting(true);
  console.log('✅ Form validation passed, submitting...');
  
  try {
    // Prepare data for Django backend
    const registrationData = {
      username: form.userName,
      email: form.email,
      password: form.password,
      confirm_password: form.confirmPassword, // Required by Django serializer
      firstname: form.firstName,
      lastname: form.lastName,
      phonenumber: form.phone,
    };

    // Add role-specific fields
    let apiEndpoint;
    if (form.role === "student") {
      // parent_email removed - student will add it in profile after login
      registrationData.grade = form.grade;
      registrationData.school = form.school;
      // Map to serializer field names
      registrationData.first_name = form.firstName;
      registrationData.last_name = form.lastName;
      registrationData.student_username = form.userName;
      registrationData.student_email = form.email;
      registrationData.phone_number = form.phone;
      apiEndpoint = API_CONFIG.DJANGO.AUTH.REGISTER_STUDENT;
    } else if (form.role === "parent") {
      // Map to serializer field names
      registrationData.first_name = form.firstName;
      registrationData.last_name = form.lastName;
      registrationData.parent_username = form.userName;
      registrationData.phone_number = form.phone;
      registrationData.parent_password = form.password;
      apiEndpoint = API_CONFIG.DJANGO.AUTH.REGISTER_PARENT;
    } else if (form.role === "teacher") {
      registrationData.grade = form.grade;
      registrationData.school = form.school;
      // Map to serializer field names
      registrationData.first_name = form.firstName;
      registrationData.last_name = form.lastName;
      registrationData.teacher_username = form.userName;
      registrationData.phone_number = form.phone;
      registrationData.teacher_password = form.password;
      apiEndpoint = API_CONFIG.DJANGO.AUTH.REGISTER_TEACHER;
    }

    // Call the appropriate registration endpoint
    console.log('📤 Sending registration request to:', apiEndpoint);
    console.log('📋 Registration data:', registrationData);
    const response = await djangoAPI.postNoAuth(apiEndpoint, registrationData);
    console.log('✅ Registration response:', response);

    // Save user data to localStorage for quick access
    const userDataToStore = {
      firstName: form.firstName,
      lastName: form.lastName,
      userName: form.userName,
      phone: form.phone,
      email: form.email,
      role: form.role,
      // parentEmail removed - will be added in student profile after login
      userId: response.user?.id || response.user?.userid
    };
    
    if (form.role === "student") {
      localStorage.setItem("studentData", JSON.stringify(userDataToStore));
    } else if (form.role === "parent") {
      localStorage.setItem("parentData", JSON.stringify(userDataToStore));
    } else if (form.role === "teacher") {
      localStorage.setItem("teacherData", JSON.stringify(userDataToStore));
    }

    // Show success message based on role
    if (form.role === "teacher") {
      toast.success("Teacher registration successful! You can log in now.");
      // For teachers, we might have tokens in response, so we could auto-login
      // But for now, just redirect to login
      setTimeout(() => navigate("/login"), 2000);
    } else {
      toast.success("Registration submitted! Waiting for teacher approval. You'll be able to login once approved.");
      // Navigate to login after successful registration
      setTimeout(() => navigate("/login"), 3000);
    }
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      status: error.status
    });
    
    // Handle error response
    let errorMessage = "Registration failed. Please try again.";
    let errorDetails = null;
    
    if (error.response && error.response.data) {
      errorDetails = error.response.data;
      console.error('Error details from response:', errorDetails);
    } else if (error.message) {
      // Try to extract error from message
      const errorMatch = error.message.match(/\{.*\}/);
      if (errorMatch) {
        try {
          errorDetails = JSON.parse(errorMatch[0]);
        } catch (e) {
          // Not JSON, use message as is
        }
      }
    }
    
    // Handle specific error messages from backend
    if (errorDetails) {
      // Check for field-specific errors
      if (errorDetails.username) {
        errorMessage = Array.isArray(errorDetails.username) ? errorDetails.username[0] : errorDetails.username;
      } else if (errorDetails.email) {
        errorMessage = Array.isArray(errorDetails.email) ? errorDetails.email[0] : errorDetails.email;
      } else if (errorDetails.phone_number || errorDetails.phone) {
        const phoneError = errorDetails.phone_number || errorDetails.phone;
        errorMessage = Array.isArray(phoneError) ? phoneError[0] : phoneError;
      } else if (errorDetails.student_username) {
        errorMessage = Array.isArray(errorDetails.student_username) ? errorDetails.student_username[0] : errorDetails.student_username;
      } else if (errorDetails.student_email) {
        errorMessage = Array.isArray(errorDetails.student_email) ? errorDetails.student_email[0] : errorDetails.student_email;
      } else if (errorDetails.detail) {
        errorMessage = errorDetails.detail;
      } else if (errorDetails.error) {
        errorMessage = errorDetails.error;
      } else if (typeof errorDetails === 'object') {
        // Show first error from validation errors
        const firstKey = Object.keys(errorDetails)[0];
        const firstError = errorDetails[firstKey];
        if (Array.isArray(firstError)) {
          errorMessage = `${firstKey}: ${firstError[0]}`;
        } else {
          errorMessage = `${firstKey}: ${firstError}`;
        }
      }
    } else if (error.message) {
      if (error.message.includes('username')) {
        errorMessage = "Username already exists. Please choose a different username.";
      } else if (error.message.includes('email')) {
        errorMessage = "Email already registered. Please use a different email.";
      } else if (error.message.includes('phone')) {
        errorMessage = "Phone number already registered. Please use a different number.";
      } else {
        errorMessage = error.message;
      }
    }
    
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #2D5D7B, #A62D69)",
        position: "relative",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      {/* Floating background circles */}
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {[...Array(12)].map((_, i) => {
          const cx = Math.random() * 100;
          const initialCy = Math.random() * 100;
          const r = 5 + Math.random() * 12;
          return (
            <motion.circle
              key={i}
              cx={`${cx}%`}
              cy={`${initialCy}%`}
              r={r}
              fill={i % 2 === 0 ? "#2D5D7B" : "#A62D69"}
              animate={{ cy: ["-10%", "110%"] }}
              transition={{
                repeat: Infinity,
                duration: 12 + Math.random() * 8,
                delay: Math.random() * 5,
              }}
            />
          );
        })}
      </svg>

      {/* Back Arrow */}
      <motion.div
        onClick={() => navigate("/login")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          color: "white",
          fontWeight: "bold",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: "8px" }}
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Login
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "white",
          width: "100%",
          maxWidth: "500px",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
          zIndex: 1,
          position: "relative",
        }}
      >
        <h4
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#2D5D7B",
          }}
        >
          Create Account
        </h4>

        <form onSubmit={handleSubmit}>
          {/* First + Last Name */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="firstName">First Name</label>
              <motion.input
                id="firstName"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter First Name"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: errors.firstName
                    ? "1px solid #ff4d4f"
                    : "1px solid #2D5D7B",
                  marginTop: "5px",
                }}
                whileFocus={{ scale: 1.02, borderColor: "#A62D69" }}
              />
              {errors.firstName && (
                <p style={{ color: "#ff4d4f", fontSize: "12px" }}>
                  {errors.firstName}
                </p>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="lastName">Last Name</label>
              <motion.input
                id="lastName"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter Last Name"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: errors.lastName
                    ? "1px solid #ff4d4f"
                    : "1px solid #2D5D7B",
                  marginTop: "5px",
                }}
                whileFocus={{ scale: 1.02, borderColor: "#A62D69" }}
              />
              {errors.lastName && (
                <p style={{ color: "#ff4d4f", fontSize: "12px" }}>
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* User Name
          <label htmlFor="userName">User Name</label>
          <motion.input
            id="userName"
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="Enter User Name"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: errors.userName
                ? "1px solid #ff4d4f"
                : "1px solid #2D5D7B",
              marginTop: "5px",
              marginBottom: errors.userName ? "5px" : "15px",
            }}
            whileFocus={{ scale: 1.02, borderColor: "#A62D69" }}
          />
          {errors.userName && (
            <p style={{ color: "#ff4d4f", fontSize: "12px" }}>{errors.userName}</p>
          )} */}

          {/* Phone */}
          <label htmlFor="phone">Phone Number</label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: errors.phone ? "5px" : "15px",
            }}
          >
            <span
              style={{
                padding: "10px",
                background: "#f0f0f0",
                border: "1px solid #2D5D7B",
                borderRadius: "8px 0 0 8px",
                color: "#555",
              }}
            >
              +91
            </span>
            <motion.input
              id="phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "0 8px 8px 0",
                border: errors.phone
                  ? "1px solid #ff4d4f"
                  : "1px solid #2D5D7B",
                borderLeft: "none",
              }}
              whileFocus={{ scale: 1.02, borderColor: "#A62D69" }}
            />
          </div>
          {errors.phone && (
            <p style={{ color: "#ff4d4f", fontSize: "12px" }}>{errors.phone}</p>
          )}

          {/* Email */}
          <label htmlFor="email">Email</label>
          <motion.input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter Email"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: errors.email
                ? "1px solid #ff4d4f"
                : "1px solid #2D5D7B",
              marginTop: "5px",
              marginBottom: errors.email ? "5px" : "15px",
            }}
            whileFocus={{ scale: 1.02, borderColor: "#A62D69" }}
          />
          {errors.email && (
            <p style={{ color: "#ff4d4f", fontSize: "12px" }}>{errors.email}</p>
          )}

          {/* Role */}
          <label htmlFor="role">Role</label>
          <motion.select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2D5D7B",
              marginTop: "5px",
              marginBottom: "15px",
            }}
            whileFocus={{ scale: 1.02, borderColor: "#A62D69" }}
          >
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
          </motion.select>

          {/* Parent Email removed - students will add it in their profile after login */}

          {/* Grade and School for Student and Teacher */}
          {(form.role === "student" || form.role === "teacher") && (
            <>
              <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="grade">Grade</label>
                  <motion.input
                    id="grade"
                    type="text"
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    placeholder="Enter Grade"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: errors.grade
                        ? "1px solid #ff4d4f"
                        : "1px solid #2D5D7B",
                      marginTop: "5px",
                    }}
                    whileFocus={{ scale: 1.02, borderColor: "#A62D69" }}
                  />
                  {errors.grade && (
                    <p style={{ color: "#ff4d4f", fontSize: "12px" }}>
                      {errors.grade}
                    </p>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="school">School</label>
                  <motion.input
                    id="school"
                    type="text"
                    name="school"
                    value={form.school}
                    onChange={handleChange}
                    placeholder="Enter School Name"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: errors.school
                        ? "1px solid #ff4d4f"
                        : "1px solid #2D5D7B",
                      marginTop: "5px",
                    }}
                    whileFocus={{ scale: 1.02, borderColor: "#A62D69" }}
                  />
                  {errors.school && (
                    <p style={{ color: "#ff4d4f", fontSize: "12px" }}>
                      {errors.school}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

                    {/* User Name */}
          <label htmlFor="userName">User Name</label>
          <motion.input
            id="userName"
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="Enter User Name"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: errors.userName
                ? "1px solid #ff4d4f"
                : "1px solid #2D5D7B",
              marginTop: "5px",
              marginBottom: errors.userName ? "5px" : "15px",
            }}
            whileFocus={{ scale: 1.02, borderColor: "#A62D69" }}
          />
          {errors.userName && (
            <p style={{ color: "#ff4d4f", fontSize: "12px" }}>{errors.userName}</p>
          )}
          {/* Password */}
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative", marginBottom: errors.password ? "5px" : "10px" }}>
            <motion.input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create Password"
              style={{
                width: "100%",
                padding: "10px 40px 10px 10px",
                borderRadius: "8px",
                border: errors.password
                  ? "1px solid #ff4d4f"
                  : "1px solid #2D5D7B",
                marginTop: "5px",
              }}
              whileFocus={{ scale: 1.02, borderColor: "#A62D69" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-7-10-7a18.166 18.166 0 015.058-5.058M9.88 9.88a3 3 0 014.243 4.243M6.1 6.1L18 18"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              )}
            </span>
          </div>
          {errors.password && (
            <p style={{ color: "#ff4d4f", fontSize: "12px" }}>{errors.password}</p>
          )}

          {/* Confirm Password */}
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div style={{ position: "relative", marginBottom: errors.confirmPassword ? "5px" : "20px" }}>
            <motion.input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              style={{
                width: "100%",
                padding: "10px 40px 10px 10px",
                borderRadius: "8px",
                border: errors.confirmPassword
                  ? "1px solid #ff4d4f"
                  : "1px solid #2D5D7B",
                marginTop: "5px",
              }}
              whileFocus={{ scale: 1.02, borderColor: "#A62D69" }}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-7-10-7a18.166 18.166 0 015.058-5.058M9.88 9.88a3 3 0 014.243 4.243M6.1 6.1L18 18"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <p style={{ color: "#ff4d4f", fontSize: "12px" }}>{errors.confirmPassword}</p>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: isSubmitting ? "#ccc" : "#2D5D7B",
              color: "#fff",
              fontSize: "16px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
            }}
            whileHover={isSubmitting ? {} : { scale: 1.03 }}
            whileTap={isSubmitting ? {} : { scale: 0.97 }}
          >
            {isSubmitting ? "Registering..." : "Sign Up"}
          </motion.button>
        </form>
      </motion.div>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default Signup;
 





























