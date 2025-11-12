// import React from "react";
// import { FaPhoneAlt, FaEnvelope, FaHome, FaUser, FaBookOpen, FaStar } from "react-icons/fa";
 
// const ChildProfile = () => {
//   const child = {
//     name: "Arjun Ramesh",
//     class: "7th Grade",
//     gender: "Male",
//     dob: "2011-08-12",
//     subjects: ["Mathematics", "Science", "English", "Computers", "Social Studies"],
//     teacher: "Mrs. Lakshmi",
//     progress: "Excellent",
//     guardian: "Ramesh Kumar",
//     contact: "+91 9876543210",
//     email: "ramesh.kumar@example.com",
//     address: "45, MG Road, Visakhapatanam, Andhra Pradesh",
//   };
 
//   return (
//     <div style={{ minHeight: "100vh", backgroundColor:    ' #e9eaf0ff ', padding: "2rem 1rem" }}>
//       <style>
//         {`
//           * { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
 
//           .container { max-width: 900px; margin: 0 auto; }
 
//           .page-title { text-align: center; color: #2d3748; font-size: 2rem; font-weight: 600; margin-bottom: 2rem; }
 
//           .profile-card { background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0; }
 
//           .profile-header { background: linear-gradient(90deg, #a3cef1, #e0f0ff); color: #1a202c; padding: 2rem; text-align: center; }
 
//           .profile-header .student-class { color: #000; } /* make 7th Grade black */
 
//           .student-name { font-size: 1.8rem; font-weight: 600; margin-bottom: 0.5rem; }
//           .student-class { font-size: 1.1rem; opacity: 0.9; }
 
//           .profile-content { padding: 2rem; }
//           .info-section { margin-bottom: 2rem; }
//           .section-title { display: flex; align-items: center; font-size: 1.2rem; font-weight: 600; color: #2d3748; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e2e8f0; }
//           .section-icon { background: #4299e1; color: white; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem; font-size: 0.9rem; }
 
//           .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
//           .info-item { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
//           .info-item:last-child { border-bottom: none; }
//           .info-label { font-weight: 500; color: #4a5568; }
//           .info-value { color: #2d3748; text-align: right; }
 
//           .subjects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; }
//           .subject-badge { background: #edf2f7; color: #2D5D7B; padding: 0.75rem; border-radius: 8px; text-align: center; font-weight: 500; border: 1px solid #e2e8f0; transition: all 0.2s ease; }
//           .subject-badge:hover { background: #e2e8f0; transform: translateY(-1px); }
 
//           .contact-item { display: flex; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
//           .contact-item:last-child { border-bottom: none; }
//           .contact-icon { color: #4299e1; margin-right: 1rem; width: 16px; }
 
//           .progress-badge { display: inline-flex; align-items: center; background: #48bb78; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 500; font-size: 0.9rem; }
//           .progress-icon { margin-right: 0.5rem; font-size: 0.8rem; }
 
//           @media (max-width: 768px) {
//             .info-grid { grid-template-columns: 1fr; }
//             .subjects-grid { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
//             .profile-content { padding: 1.5rem; }
//             .page-title { font-size: 1.5rem; }
//           }
//         `}
//       </style>
 
//       <div className="container">
//         <h1 className="page-title">Student Profile</h1>
//         <div className="profile-card">
//           <div className="profile-header">
//             <h2 className="student-name">{child.name}</h2>
//             <p className="student-class">{child.class}</p>
//           </div>
 
//           <div className="profile-content">
//             <div className="info-grid">
//               <div className="info-section">
//                 <h3 className="section-title">
//                   <div className="section-icon"><FaUser /></div>
//                   Personal Information
//                 </h3>
//                 <div className="info-item">
//                   <span className="info-label">Gender</span>
//                   <span className="info-value">{child.gender}</span>
//                 </div>
//                 <div className="info-item">
//                   <span className="info-label">Date of Birth</span>
//                   <span className="info-value">{new Date(child.dob).toLocaleDateString('en-IN')}</span>
//                 </div>
//                 <div className="info-item">
//                   <span className="info-label">Class Teacher</span>
//                   <span className="info-value">{child.teacher}</span>
//                 </div>
//                 <div className="info-item">
//                   <span className="info-label">Progress</span>
//                   <span className="info-value">
//                     <span className="progress-badge">
//                       <FaStar className="progress-icon" />
//                       {child.progress}
//                     </span>
//                   </span>
//                 </div>
//               </div>
 
//               <div className="info-section">
//                 <h3 className="section-title">
//                   <div className="section-icon"><FaHome /></div>
//                   Guardian & Contact
//                 </h3>
//                 <div className="info-item">
//                   <span className="info-label">Guardian</span>
//                   <span className="info-value">{child.guardian}</span>
//                 </div>
//                 <div className="contact-item">
//                   <FaPhoneAlt className="contact-icon" />
//                   <span>{child.contact}</span>
//                 </div>
//                 <div className="contact-item">
//                   <FaEnvelope className="contact-icon" />
//                   <span>{child.email}</span>
//                 </div>
//                 <div className="contact-item">
//                   <FaHome className="contact-icon" />
//                   <span>{child.address}</span>
//                 </div>
//               </div>
//             </div>
 
//             <div className="info-section">
//               <h3 className="section-title">
//                 <div className="section-icon"><FaBookOpen /></div>
//                 Subjects
//               </h3>
//               <div className="subjects-grid">
//                 {child.subjects.map((subject, index) => (
//                   <div key={index} className="subject-badge">{subject}</div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
 
// export default ChildProfile;









 import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { FaPhoneAlt, FaEnvelope, FaHome, FaUser, FaBookOpen, FaStar } from "react-icons/fa";
import { API_CONFIG, djangoAPI } from "../../config/api";

const ChildProfile = () => {
  const { t } = useTranslation();
  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch child data from localStorage (linked student data)
  useEffect(() => {
    const fetchChildData = async () => {
      try {
        console.log('🔍 Debug - Fetching child data from backend...');
        
        // Fetch child data from backend API
        const response = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.CHILD_PROFILE);
        console.log('🔍 Debug - Backend response:', response);
        
        if (response && response.student_registration) {
          const studentReg = response.student_registration;
          const studentProfile = response.student_profile;
          const studentUser = response.student_user;
          
          // Create child data object from backend data
          const child = {
            name: `${studentReg.first_name || ''} ${studentReg.last_name || ''}`.trim() || 'Student Name',
            class: studentProfile?.grade ? `Grade ${studentProfile.grade}` : 'Grade Unknown',
            gender: 'Not specified', // Not available in current schema
            dob: 'Not specified', // Not available in current schema
            subjects: ["Mathematics", "Science", "English", "Computers", "Social Studies"], // Default subjects
            teacher: 'Not assigned', // Not available in current schema
            progress: 'Good', // Default progress
            guardian: `${studentReg.first_name || ''} ${studentReg.last_name || ''}`.trim() || 'Not specified',
            contact: studentReg.phone_number || studentUser?.phonenumber || 'Not specified',
            email: studentReg.student_email || studentUser?.email || 'Not specified',
            address: studentProfile?.address || 'Not specified',
            userName: studentReg.student_username || 'Not specified',
          };
          
          console.log('🔍 Debug - Child data created from backend:', child);
          console.log('🔍 Debug - Grade from backend:', studentProfile?.grade);
          console.log('🔍 Debug - Phone from backend:', studentReg.phone_number || studentUser?.phonenumber);
          console.log('🔍 Debug - Address from backend:', studentProfile?.address);
          
          setChildData(child);
        } else {
          console.log('🔍 Debug - No child data found in backend response');
          setChildData({
            name: 'Student Name',
            class: 'Grade Unknown',
            gender: 'Not specified',
            dob: 'Not specified',
            subjects: ["Mathematics", "Science", "English", "Computers", "Social Studies"],
            teacher: 'Not assigned',
            progress: 'Good',
            guardian: 'Not specified',
            contact: 'Not specified',
            email: 'Not specified',
            address: 'Not specified',
            userName: 'Not specified',
          });
        }
      } catch (error) {
        console.error('❌ Error fetching child data from backend:', error);
        console.error('❌ Error details:', error.message);
        console.error('❌ Error stack:', error.stack);
        
        // Fallback to localStorage if backend fails
        try {
          const studentData = localStorage.getItem('studentData');
          if (studentData) {
            const parsedStudentData = JSON.parse(studentData);
  const child = {
              name: `${parsedStudentData.firstName || ''} ${parsedStudentData.lastName || ''}`.trim() || 'Student Name',
              class: parsedStudentData.grade ? `Grade ${parsedStudentData.grade}` : 'Grade Unknown',
              gender: parsedStudentData.gender || 'Not specified',
              dob: parsedStudentData.dateOfBirth || 'Not specified',
              subjects: parsedStudentData.course ? [parsedStudentData.course] : (parsedStudentData.subjects || ["Mathematics", "Science", "English", "Computers", "Social Studies"]),
              teacher: parsedStudentData.classTeacher || 'Not assigned',
              progress: parsedStudentData.progress || 'Good',
              guardian: `${parsedStudentData.parentName || ''}`.trim() || 'Not specified',
              contact: parsedStudentData.phone || 'Not specified',
              email: parsedStudentData.email || 'Not specified',
              address: parsedStudentData.address || 'Not specified',
              userName: parsedStudentData.userName || 'Not specified',
            };
            setChildData(child);
          } else {
            throw new Error('No fallback data available');
          }
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError);
          setChildData({
            name: 'Student Name',
            class: 'Grade Unknown',
            gender: 'Not specified',
            dob: 'Not specified',
    subjects: ["Mathematics", "Science", "English", "Computers", "Social Studies"],
            teacher: 'Not assigned',
            progress: 'Good',
            guardian: 'Not specified',
            contact: 'Not specified',
            email: 'Not specified',
            address: 'Not specified',
            userName: 'Not specified',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChildData();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: '#e9eaf0ff', padding: "2rem 1rem", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#2d3748' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Loading child profile...</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Fetching student data...</div>
        </div>
      </div>
    );
  }

  if (!childData) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: '#e9eaf0ff', padding: "2rem 1rem", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#2d3748' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No child data found</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Please ensure student data is properly linked</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: '#f8f9fa', padding: "2rem 1rem" }}>
      <style>
        {`
          * { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }

          .container { max-width: 1200px; margin: 0 auto; }

          .page-header { margin-bottom: 2rem; }
          .page-title { color: #6B46C1; font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
          .page-subtitle { color: #6B7280; font-size: 1.1rem; }

          .student-summary-card { 
            background: white; 
            border-radius: 16px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
            padding: 2rem; 
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 2rem;
          }

          .student-avatar { 
            position: relative;
            width: 80px; 
            height: 80px; 
            border-radius: 50%; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.8rem;
            font-weight: 600;
            flex-shrink: 0;
          }

          .star-badge {
            position: absolute;
            bottom: -5px;
            right: -5px;
            width: 24px;
            height: 24px;
            background: #F59E0B;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 0.8rem;
            border: 3px solid white;
          }

          .student-info h2 { 
            color: #1F2937; 
            font-size: 1.8rem; 
            font-weight: 700; 
            margin-bottom: 0.5rem; 
          }
          .student-details { 
            color: #6B7280; 
            font-size: 1rem; 
          }

          .info-cards-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 1.5rem; 
          }

          .info-card { 
            background: white; 
            border-radius: 16px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
            padding: 1.5rem;
            border: 1px solid #E5E7EB;
          }

          .card-header { 
            display: flex; 
            align-items: center; 
            margin-bottom: 1.5rem; 
            padding-bottom: 1rem;
            border-bottom: 2px solid #F3F4F6;
          }

          .card-icon { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            width: 40px; 
            height: 40px; 
            border-radius: 10px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            margin-right: 1rem; 
            font-size: 1.1rem; 
          }

          .card-title { 
            font-size: 1.2rem; 
            font-weight: 600; 
            color: #1F2937; 
          }

          .info-item { 
            display: flex; 
            align-items: center; 
            padding: 0.75rem 0; 
            border-bottom: 1px solid #F3F4F6; 
          }
          .info-item:last-child { border-bottom: none; }

          .info-icon { 
            color: #6B7280; 
            margin-right: 1rem; 
            width: 20px; 
            font-size: 1rem;
          }

          .info-content { 
            flex: 1; 
          }

          .info-label { 
            font-weight: 500; 
            color: #4B5563; 
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
          }
          .info-value { 
            color: #1F2937; 
            font-weight: 600;
            font-size: 1rem;
          }

          @media (max-width: 768px) {
            .info-cards-grid { grid-template-columns: 1fr; }
            .student-summary-card { flex-direction: column; text-align: center; gap: 1rem; }
            .page-title { font-size: 2rem; }
            .container { padding: 0 1rem; }
          }
        `}
      </style>

      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Child Profile</h1>
          <p className="page-subtitle">Good Morning! Track your child's learning journey</p>
          </div>

        {/* Student Summary Card */}
        <div className="student-summary-card">
          <div className="student-avatar">
            {childData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            <div className="star-badge">
              <FaStar />
                </div>
                </div>
          <div className="student-info">
            <h2>{childData.name}</h2>
            <p className="student-details">{childData.class} • {childData.subjects ? childData.subjects.slice(0, 2).join(' & ') : 'General Studies'}</p>
                </div>
              </div>

        {/* Information Cards Grid */}
        <div className="info-cards-grid">

          {/* Contact Information Card */}
          <div className="info-card">
            <div className="card-header">
              <div className="card-icon">
                <FaPhoneAlt />
              </div>
              <h3 className="card-title">Contact Information</h3>
                </div>
                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <div className="info-content">
                    <div className="info-label">Student Email</div>
                    <div className="info-value">{childData.email || 'Not specified'}</div>
                  </div>
                </div>
                <div className="info-item">
                  <FaPhoneAlt className="info-icon" />
                  <div className="info-content">
                    <div className="info-label">Student Phone</div>
                    <div className="info-value">{childData.contact || 'Not specified'}</div>
                </div>
                </div>
                <div className="info-item">
                  <FaHome className="info-icon" />
                  <div className="info-content">
                    <div className="info-label">Address</div>
                    <div className="info-value">{childData.address || 'Not specified'}</div>
                </div>
              </div>
            </div>

          {/* Academic Information Card */}
          <div className="info-card">
            <div className="card-header">
              <div className="card-icon">
                <FaBookOpen />
              </div>
              <h3 className="card-title">Academic Information</h3>
            </div>
                <div className="info-item">
              <FaBookOpen className="info-icon" />
              <div className="info-content">
                <div className="info-label">Grade</div>
                <div className="info-value">{childData.class}</div>
                </div>
                </div>
            <div className="info-item">
              <FaBookOpen className="info-icon" />
              <div className="info-content">
                <div className="info-label">Course</div>
                <div className="info-value">{childData.subjects ? childData.subjects.join(' & ') : 'General Studies'}</div>
                </div>
                </div>
            <div className="info-item">
              <FaStar className="info-icon" />
              <div className="info-content">
                <div className="info-label">Progress</div>
                <div className="info-value">{childData.progress}</div>
              </div>
            </div>
            <div className="info-item">
              <FaUser className="info-icon" />
              <div className="info-content">
                <div className="info-label">Class Teacher</div>
                <div className="info-value">{childData.teacher}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildProfile;







