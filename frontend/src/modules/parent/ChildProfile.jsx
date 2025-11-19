
import React from "react";
import { useTranslation } from 'react-i18next';
import { FaPhoneAlt, FaEnvelope, FaHome, FaUser, FaBookOpen, FaStar } from "react-icons/fa";

const ChildProfile = () => {
  const { t } = useTranslation();

  const child = {
    name: "Arjun Ramesh",
    class: "7th Grade",
    gender: "Male",
    dob: "2011-08-12",
    subjects: ["Mathematics", "Science", "English", "Computers", "Social Studies"],
    teacher: "Mrs. Lakshmi",
    progress: "Excellent",
    guardian: "Ramesh Kumar",
    contact: "+91 9876543210",
    email: "ramesh.kumar@example.com",
    address: "45, MG Road, Visakhapatanam, Andhra Pradesh",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: '#e9eaf0ff', padding: "2rem 1rem" }}>
      <style>
        {`
          * { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }

          .container { max-width: 900px; margin: 0 auto; }

          .page-title { text-align: center; color: #2d3748; font-size: 2rem; font-weight: 600; margin-bottom: 2rem; }

          .profile-card { background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0; }

          .profile-header { background: linear-gradient(90deg, #a3cef1, #e0f0ff); color: #1a202c; padding: 2rem; text-align: center; }

          .profile-header .student-class { color: #000; } /* make 7th Grade black */

          .student-name { font-size: 1.8rem; font-weight: 600; margin-bottom: 0.5rem; }
          .student-class { font-size: 1.1rem; opacity: 0.9; }

          .profile-content { padding: 2rem; }
          .info-section { margin-bottom: 2rem; }
          .section-title { display: flex; align-items: center; font-size: 1.2rem; font-weight: 600; color: #2d3748; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e2e8f0; }
          .section-icon { background: #4299e1; color: white; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem; font-size: 0.9rem; }

          .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
          .info-item { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
          .info-item:last-child { border-bottom: none; }
          .info-label { font-weight: 500; color: #4a5568; }
          .info-value { color: #2d3748; text-align: right; }

          .subjects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; }
          .subject-badge { background: #edf2f7; color: #2D5D7B; padding: 0.75rem; border-radius: 8px; text-align: center; font-weight: 500; border: 1px solid #e2e8f0; transition: all 0.2s ease; }
          .subject-badge:hover { background: #e2e8f0; transform: translateY(-1px); }

          .contact-item { display: flex; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
          .contact-item:last-child { border-bottom: none; }
          .contact-icon { color: #4299e1; margin-right: 1rem; width: 16px; }

          .progress-badge { display: inline-flex; align-items: center; background: #48bb78; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 500; font-size: 0.9rem; }
          .progress-icon { margin-right: 0.5rem; font-size: 0.8rem; }

          @media (max-width: 768px) {
            .info-grid { grid-template-columns: 1fr; }
            .subjects-grid { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
            .profile-content { padding: 1.5rem; }
            .page-title { font-size: 1.5rem; }
          }
        `}
      </style>

      <div className="container">
        <h1 className="page-title">{t('studentProfile')}</h1>
        <div className="profile-card">
          <div className="profile-header">
            <h2 className="student-name">{child.name}</h2>
            <p className="student-class">{child.class}</p>
          </div>

          <div className="profile-content">
            <div className="info-grid">
              <div className="info-section">
                <h3 className="section-title">
                  <div className="section-icon"><FaUser /></div>
                  {t('personalInformation')}
                </h3>
                <div className="info-item">
                  <span className="info-label">{t('gender')}</span>
                  <span className="info-value">{child.gender}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('dateOfBirth')}</span>
                  <span className="info-value">{new Date(child.dob).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('classTeacher')}</span>
                  <span className="info-value">{child.teacher}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('progress')}</span>
                  <span className="info-value">
                    <span className="progress-badge">
                      <FaStar className="progress-icon" />
                      {child.progress}
                    </span>
                  </span>
                </div>
              </div>

              <div className="info-section">
                <h3 className="section-title">
                  <div className="section-icon"><FaHome /></div>
                  {t('guardianAndContact')}
                </h3>
                <div className="info-item">
                  <span className="info-label">{t('guardian')}</span>
                  <span className="info-value">{child.guardian}</span>
                </div>
                <div className="contact-item">
                  <FaPhoneAlt className="contact-icon" />
                  <span>{child.contact}</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <span>{child.email}</span>
                </div>
                <div className="contact-item">
                  <FaHome className="contact-icon" />
                  <span>{child.address}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3 className="section-title">
                <div className="section-icon"><FaBookOpen /></div>
                {t('All Subjects')}
              </h3>
              <div className="subjects-grid">
                {child.subjects.map((subject, index) => (
                  <div key={index} className="subject-badge">{t(`subjectsList.${subject}`)}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildProfile;

















