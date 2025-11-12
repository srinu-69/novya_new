
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCamera, FaEdit, FaSave, FaArrowLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./UserDetailsPage.css";
import { API_CONFIG, djangoAPI } from "../../config/api";
 
const UserDetailsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(null);
 
  // Fetch user data based on role - REAL API INTEGRATION
  useEffect(() => {
    const fetchUserData = async () => {
      const userRole = localStorage.getItem("userRole"); // "student" or "parent"
      const userToken = localStorage.getItem("userToken");
      
      // Only clear cache if it's very old (older than 30 minutes) or if there's no meaningful data
      const now = Date.now();
      const cacheKey = userRole === "student" ? "studentDataLastFetch" : "parentDataLastFetch";
      const lastFetch = localStorage.getItem(cacheKey);
      const shouldClearCache = !lastFetch || (now - parseInt(lastFetch)) > 30 * 60 * 1000; // 30 minutes
      
      // Check if existing data has meaningful content
      let existingData = null;
      if (userRole === "student") {
        existingData = localStorage.getItem("studentData");
      } else if (userRole === "parent") {
        existingData = localStorage.getItem("parentData");
      }
      
      let hasMeaningfulData = false;
      if (existingData) {
        try {
          const parsed = JSON.parse(existingData);
          hasMeaningfulData = !!(parsed.firstName || parsed.lastName || parsed.email);
        } catch (e) {
          hasMeaningfulData = false;
        }
      }
      
      if (shouldClearCache && !hasMeaningfulData) {
        if (userRole === "student") {
          localStorage.removeItem("studentData");
        } else if (userRole === "parent") {
          localStorage.removeItem("parentData");
        }
      }
      
      try {
        // Try to fetch fresh data from backend first
        if (userToken) {
          const response = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.USER_PROFILE);
          
          if (response && response.user) {
            // Get existing localStorage data to preserve good values
            let existingData = {};
            if (userRole === "student") {
              const stored = localStorage.getItem("studentData");
              if (stored) {
                try {
                  existingData = JSON.parse(stored);
                } catch (e) {
                  console.error('Error parsing existing data:', e);
                }
              }
            } else if (userRole === "parent") {
              const stored = localStorage.getItem("parentData");
              if (stored) {
                try {
                  existingData = JSON.parse(stored);
                } catch (e) {
                  console.error('Error parsing existing data:', e);
                }
              }
            }
            
            const backendData = {
              // Use backend data if available, otherwise keep existing data
              firstName: response.user.firstname || existingData.firstName || 'User',
              lastName: response.user.lastname || existingData.lastName || 'Name',
              email: response.user.email || existingData.email || 'user@example.com',
              userName: response.user.username || existingData.userName || 'username',
              phone: response.user.phonenumber || existingData.phone || '',
              role: userRole || existingData.role || 'student',
              address: response.student_profile?.address || existingData.address || '',
              ...(userRole === 'student' && {
                grade: response.student_profile?.grade || existingData.grade || '',
                course: response.student_profile?.course || existingData.course || '',
                // Use parent details from backend response or keep existing
                parentEmail: response.parent_details?.parent_email || existingData.parentEmail || '',
                parentName: response.parent_details?.parent_name || existingData.parentName || '',
                parentPhone: response.parent_details?.parent_phone || existingData.parentPhone || ''
              })
            };
            
            setUserData(backendData);
            
            // Only update localStorage if we have meaningful data
            if (backendData.firstName || backendData.lastName || backendData.email) {
              if (userRole === "student") {
                localStorage.setItem("studentData", JSON.stringify(backendData));
                localStorage.setItem("studentDataLastFetch", now.toString());
              } else {
                localStorage.setItem("parentData", JSON.stringify(backendData));
                localStorage.setItem("parentDataLastFetch", now.toString());
              }
            }
            return;
          }
        }
      } catch (error) {
        console.error('❌ Error fetching from backend:', error);
        // Fall through to localStorage fallback
      }
      
      // Fallback to localStorage data
      let storedData = null;
      if (userRole === "student") {
        storedData = localStorage.getItem("studentData");
      } else if (userRole === "parent") {
        storedData = localStorage.getItem("parentData");
      }

      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setUserData(parsed);
        } catch (error) {
          console.error('Error parsing stored data:', error);
        }
      }
    };

    fetchUserData();
  }, []);
 
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userToken");
    navigate("/");
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleSave = async () => {
    try {
      const updatedData = tempAvatar
        ? { ...userData, avatar: tempAvatar }
        : userData;

      // Prepare data for Django backend
      const profileData = {
        firstname: updatedData.firstName,
        lastname: updatedData.lastName,
        email: updatedData.email,
        phonenumber: updatedData.phone,
        address: updatedData.address || '',
        ...(updatedData.role === 'student' && {
          grade: updatedData.grade || '',
          course: updatedData.course || ''
        })
      };

      // Call backend API to update profile
      const response = await djangoAPI.put(API_CONFIG.DJANGO.AUTH.PROFILE_UPDATE, profileData);

      // Update local state
      setUserData(updatedData);
      setEditMode(false);

      // Update localStorage
      if (updatedData.role === "student") {
        localStorage.setItem("studentData", JSON.stringify(updatedData));
        localStorage.setItem("studentDataLastFetch", Date.now().toString());
      } else {
        localStorage.setItem("parentData", JSON.stringify(updatedData));
        localStorage.setItem("parentDataLastFetch", Date.now().toString());
      }

      // Show success message (if toast is available)
      if (window.toast) {
        window.toast.success(t('userDetails.profileUpdated', 'Profile updated successfully!'));
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      // Show error message (if toast is available)
      if (window.toast) {
        window.toast.error(error.message || t('userDetails.updateFailed', 'Failed to update profile. Please try again.'));
      }
      // Still update local state to keep UI in sync
      setUserData(tempAvatar ? { ...userData, avatar: tempAvatar } : userData);
      setEditMode(false);
    }
  };
 
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
 
  if (!userData) {
    return (
      <div className="user-details-container">
        <div className="loading">{t('userDetails.loading', 'Loading user data...')}</div>
      </div>
    );
  }
 
  return (
    <div className="user-details-container">
      <motion.div
        className="user-details-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="user-details-header">
          <h1>{t('userDetails.title', 'User Details')}</h1>
          <div className="header-buttons">
            <button className="back-button" onClick={() => navigate(-1)}>
              <FaArrowLeft /> {t('userDetails.back', 'Back')}
            </button>
            <button className="logout-button-page" onClick={handleLogout}>
              {t('navbar.logout', 'Logout')}
            </button>
          </div>
        </div>
 
        <div className="user-details-content">
          <div className="avatar-section">
            <div className="user-avatar">
              {userData.avatar || tempAvatar ? (
                <img
                  src={tempAvatar || userData.avatar}
                  alt={t('userDetails.avatarAlt', 'User Avatar')}
                  className="avatar-img"
                />
              ) : (
                <span>{userData.firstName?.charAt(0) || "U"}</span>
              )}
              {editMode && (
                <label className="avatar-upload">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
            {editMode ? (
              <div className="name-inputs">
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName || ""}
                  onChange={handleInputChange}
                  placeholder={t('userDetails.firstNamePlaceholder', 'First Name')}
                />
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName || ""}
                  onChange={handleInputChange}
                  placeholder={t('userDetails.lastNamePlaceholder', 'Last Name')}
                />
              </div>
            ) : (
              <h2>
                {userData.firstName} {userData.lastName}
              </h2>
            )}
            <p className="user-role">
              {userData.role === "student"
                ? t('userDetails.studentRole', 'Student')
                : t('userDetails.parentRole', 'Parent')
              }
            </p>
          </div>
 
          <div className="details-section">
            <h3>{t('userDetails.personalInfo', 'Personal Information')}</h3>
            {[
              { label: t('userDetails.email', 'Email'), name: "email" },
              { label: t('userDetails.phone', 'Phone'), name: "phone" },
              { label: t('userDetails.userName', 'User Name'), name: "userName" },
              ...(userData.role === "student"
                ? [
                    { label: t('userDetails.grade', 'Grade'), name: "grade" },
                    { label: t('userDetails.course', 'Course'), name: "course" },
                  ]
                : []),
              { label: t('userDetails.address', 'Address'), name: "address" },
            ].map((field) => (
              <div className="detail-row" key={field.name}>
                <span className="detail-label">{field.label}:</span>
                {editMode ? (
                  <input
                    type="text"
                    name={field.name}
                    value={userData[field.name] || ""}
                    onChange={handleInputChange}
                    placeholder={field.label}
                  />
                ) : (
                  <span className="detail-value">
                    {userData[field.name] || t('userDetails.notProvided', 'Not provided')}
                  </span>
                )}
              </div>
            ))}
 
            {userData.role === "student" && (
              <section className="parent-info-section">
                <h3>{t('userDetails.parentInfo', 'Parent/Guardian Information')}</h3>
                {[
                  { label: t('userDetails.parentName', 'Parent Name'), key: "parentName" },
                  { label: t('userDetails.parentEmail', 'Parent Email'), key: "parentEmail" },
                  { label: t('userDetails.parentPhone', 'Parent Phone'), key: "parentPhone" },
                ].map(({ label, key }) => (
                  <div className="detail-row" key={key}>
                    <span className="detail-label">{label}:</span>
                    {editMode ? (
                      <input
                        type="text"
                        name={key}
                        value={userData[key] || ""}
                        onChange={handleInputChange}
                        placeholder={t('userDetails.enterField', 'Enter {{field}}', { field: label })}
                      />
                    ) : (
                      <span className="detail-value">
                        {userData[key] || t('userDetails.notProvided', 'Not provided')}
                      </span>
                    )}
                  </div>
                ))}
              </section>
            )}
 
            <div className="edit-save-buttons">
              {editMode ? (
                <button className="save-button" onClick={handleSave}>
                  <FaSave /> {t('userDetails.save', 'Save')}
                </button>
              ) : (
                <button
                  className="edit-button"
                  onClick={() => setEditMode(true)}
                >
                  <FaEdit /> {t('userDetails.edit', 'Edit')}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
 
export default UserDetailsPage;
 