import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_CONFIG, djangoAPI } from '../../config/api';

const StudentDetails = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistories, setChatHistories] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Fetch students data from API
  useEffect(() => {
    fetchTeacherStudents();
  }, []);

  const fetchTeacherStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.TEACHER_STUDENTS);
      
      if (response && response.students) {
        // Transform API data to match component format
        const transformedStudents = response.students.map((student, index) => {
          const userInfo = student.user_info || {};
          const profile = student.profile || {};
          const parentInfo = student.parent_info || {};
          
          // Calculate attendance (default to 95% if not available)
          const attendance = profile.attendance || '95%';
          
          // Determine grade based on performance or use default
          const grade = profile.grade || 'A';
          
          return {
            id: student.student_id || index + 1,
            name: `${userInfo.firstname || student.first_name || ''} ${userInfo.lastname || student.last_name || ''}`.trim() || 'Unknown Student',
            email: userInfo.email || student.student_email || '',
            status: 'active', // Default status
            grade: grade,
            attendance: attendance,
            lastActive: `2 ${t('hoursAgo')}`, // Default last active
            school: profile.school || '',
            phone: userInfo.phone || student.phone_number || '',
            parentInfo: {
              parentName: parentInfo.parent_name || 'Not provided',
              parentEmail: parentInfo.parent_email || 'Not provided',
              parentPhone: parentInfo.parent_phone || 'Not provided',
              linked: parentInfo.linked || false
            }
          };
        });
        
        setStudents(transformedStudents);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('❌ Error fetching teacher students:', err);
      setError(err.message || 'Failed to fetch students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/teacher/userlist');
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setMessage('');
    
    // Initialize chat history if it doesn't exist
    if (!chatHistories[student.id]) {
      setChatHistories(prev => ({
        ...prev,
        [student.id]: []
      }));
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedStudent) {
      return;
    }
    
    try {
      setSendingMessage(true);
      
      // Send message to student via API
      const response = await djangoAPI.post(API_CONFIG.DJANGO.AUTH.SEND_STUDENT_MESSAGE, {
        student_id: selectedStudent.id,
        message: message,
        title: `Message about ${selectedStudent.name}`
      });
      
      console.log('✅ Message sent successfully:', response);
      
      // Update local chat history
      const studentId = selectedStudent.id;
      const currentChat = chatHistories[studentId] || [];
      
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'teacher',
        timestamp: new Date().toLocaleTimeString()
      };

      const updatedChat = [...currentChat, newMessage];
      setChatHistories(prev => ({
        ...prev,
        [studentId]: updatedChat
      }));
      
      // Clear message field
      setMessage('');
      
      // Show success message
      alert('Message sent to student successfully!');
      
    } catch (err) {
      console.error('❌ Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const generateStudentResponse = (student) => {
    // Generate different responses based on student
    const responses = [
      t('thankYouMessage'),
      t('appreciateFeedback'),
      t('thanksReachingOut'),
      t('understandConcerns'),
      t('thankGuidance')
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return randomResponse;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentChatMessages = () => {
    if (!selectedStudent) return [];
    return chatHistories[selectedStudent.id] || [];
  };

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return '#3CB371';
    if (grade.includes('B')) return '#4DD0E1';
    if (grade.includes('C')) return '#FFC107';
    return '#DC3545';
  };

  const getAttendanceColor = (attendance) => {
    const percentage = parseInt(attendance);
    if (percentage >= 95) return '#3CB371';
    if (percentage >= 85) return '#4DD0E1';
    if (percentage >= 75) return '#FFC107';
    return '#DC3545';
  };

  // Styles
  const containerStyle = {
    backgroundColor: '#F4F8FB',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  };

  const contentStyle = {
    padding: '30px',
    minHeight: 'calc(100vh - 90px)',
    overflow: 'hidden'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  };

  const titleStyle = {
    color: '#222831',
    fontSize: '2rem',
    fontWeight: '600',
    margin: '0'
  };

  const backButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#79B3D7',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  };

  const layoutStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '30px',
    height: 'calc(100vh - 200px)',
    minHeight: '600px'
  };

  const tableContainerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const tableWrapperStyle = {
    overflowX: 'auto',
    overflowY: 'auto',
    flex: 1
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px'
  };

  const thStyle = {
    backgroundColor: '#2D5D7B',
    color: '#FFFFFF',
    padding: '20px 16px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '1rem',
    position: 'sticky',
    top: 0,
    zIndex: 10
  };

  const tdStyle = {
    padding: '20px 16px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '1rem',
    height: '70px',
    verticalAlign: 'middle'
  };

  const statusBadgeStyle = (status) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
    backgroundColor: status === 'active' ? 'rgba(60, 179, 113, 0.2)' : 'rgba(220, 53, 69, 0.2)',
    color: status === 'active' ? '#3CB371' : '#DC3545',
    border: `1px solid ${status === 'active' ? '#3CB371' : '#DC3545'}`
  });

  const gradeBadgeStyle = (grade) => ({
    padding: '8px 12px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    backgroundColor: `${getGradeColor(grade)}20`,
    color: getGradeColor(grade),
    border: `1px solid ${getGradeColor(grade)}`
  });

  const attendanceBadgeStyle = (attendance) => ({
    padding: '8px 12px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    backgroundColor: `${getAttendanceColor(attendance)}20`,
    color: getAttendanceColor(attendance),
    border: `1px solid ${getAttendanceColor(attendance)}`
  });

  const chatContainerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  const chatTitleStyle = {
    color: '#2D5D7B',
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const studentInfoStyle = {
    backgroundColor: '#F8F9FA',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid rgba(0, 0, 0, 0.1)'
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    fontSize: '0.9rem'
  };

  const infoItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const infoLabelStyle = {
    color: '#666',
    fontWeight: '500'
  };

  const infoValueStyle = {
    color: '#222831',
    fontWeight: '600'
  };

  const messageInputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    fontSize: '0.9rem',
    marginBottom: '15px',
    resize: 'vertical',
    minHeight: '80px',
    backgroundColor: !selectedStudent ? '#F5F5F5' : '#FFFFFF'
  };

  const sendButtonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: selectedStudent && message.trim() ? '#A62D69' : '#B0BEC5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: selectedStudent && message.trim() ? 'pointer' : 'not-allowed',
    transition: 'all 0.3s ease'
  };

  const chatMessagesStyle = {
    flex: 1,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    overflowY: 'auto',
    backgroundColor: '#F8F9FA',
    minHeight: '200px'
  };

  const messageBubbleStyle = (sender) => ({
    display: 'inline-block',
    padding: '12px 16px',
    borderRadius: sender === 'teacher' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    backgroundColor: sender === 'teacher' ? '#2D5D7B' : '#E9ECEF',
    color: sender === 'teacher' ? '#FFFFFF' : '#333',
    maxWidth: '70%',
    fontSize: '0.95rem',
    marginBottom: '10px',
    marginLeft: sender === 'teacher' ? 'auto' : '0',
    marginRight: sender === 'teacher' ? '0' : 'auto',
    lineHeight: '1.4'
  });

  const messageTimeStyle = {
    fontSize: '0.75rem',
    color: '#666',
    marginTop: '4px',
    textAlign: 'right'
  };

  const currentChatMessages = getCurrentChatMessages();

  return (
    <div style={containerStyle}>
      {/* 90px gap from header */}
      <div style={{ height: '30px' }}></div>
      
      {/* Main Content */}
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>{t('studentDetailsCommunication')}</h1>
          <button 
            style={backButtonStyle}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#67A0C7'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#79B3D7'}
            onClick={handleBack}
          >
            {t('backToUserList')}
          </button>
        </div>

        <div style={layoutStyle}>
          <div style={tableContainerStyle}>
            <div style={tableWrapperStyle}>
              {loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#222831' }}>
                  {t('loading') || 'Loading students...'}
                </div>
              )}
              
              {error && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '20px', 
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  borderRadius: '8px',
                  margin: '20px'
                }}>
                  {t('error') || 'Error'}: {error}
                  <button 
                    onClick={fetchTeacherStudents}
                    style={{
                      marginLeft: '10px',
                      padding: '8px 16px',
                      backgroundColor: '#2D5D7B',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {t('retry') || 'Retry'}
                  </button>
                </div>
              )}
              
              {!loading && !error && (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>{t('serialNo')}</th>
                      <th style={thStyle}>{t('name')}</th>
                      <th style={thStyle}>{t('email')}</th>
                      <th style={thStyle}>{t('grade')}</th>
                      <th style={thStyle}>{t('attendance')}</th>
                      <th style={thStyle}>{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                          {t('noStudentsFound') || 'No students found. Please ensure your school name is set in your profile and students have matching school names.'}
                        </td>
                      </tr>
                    ) : (
                      students.map((student, index) => (
                    <tr 
                      key={student.id}
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: selectedStudent?.id === student.id ? 'rgba(45, 93, 123, 0.1)' : 'transparent',
                        transition: 'background-color 0.2s ease',
                        height: '70px'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedStudent?.id !== student.id) {
                          e.currentTarget.style.backgroundColor = 'rgba(45, 93, 123, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedStudent?.id !== student.id) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                      onClick={() => handleStudentSelect(student)}
                    >
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={tdStyle}>{student.name}</td>
                      <td style={tdStyle}>{student.email}</td>
                      <td style={tdStyle}>
                        <span style={gradeBadgeStyle(student.grade)}>
                          {student.grade}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={attendanceBadgeStyle(student.attendance)}>
                          {student.attendance}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={statusBadgeStyle(student.status)}>
                          {t(student.status)}
                        </span>
                      </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div style={chatContainerStyle}>
            <h3 style={chatTitleStyle}>
              {selectedStudent ? `${t('chatWith')} ${selectedStudent.name}` : t('selectStudent')}
            </h3>
            
            {selectedStudent && (
              <>
                <div style={studentInfoStyle}>
                  <div style={infoGridStyle}>
                    <div style={infoItemStyle}>
                      <span style={infoLabelStyle}>{t('email')}:</span>
                      <span style={infoValueStyle}>{selectedStudent.email}</span>
                    </div>
                    <div style={infoItemStyle}>
                      <span style={infoLabelStyle}>{t('grade')}:</span>
                      <span style={gradeBadgeStyle(selectedStudent.grade)}>
                        {selectedStudent.grade}
                      </span>
                    </div>
                    <div style={infoItemStyle}>
                      <span style={infoLabelStyle}>{t('attendance')}:</span>
                      <span style={attendanceBadgeStyle(selectedStudent.attendance)}>
                        {selectedStudent.attendance}
                      </span>
                    </div>
                    <div style={infoItemStyle}>
                      <span style={infoLabelStyle}>{t('lastActive')}:</span>
                      <span style={infoValueStyle}>{selectedStudent.lastActive}</span>
                    </div>
                  </div>
                </div>
                
                {/* Parent/Guardian Information Section */}
                {selectedStudent.parentInfo && (
                  <div style={{
                    ...studentInfoStyle,
                    marginTop: '15px',
                    borderTop: '2px solid #2D5D7B',
                    paddingTop: '15px'
                  }}>
                    <h4 style={{
                      color: '#2D5D7B',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                      borderBottom: '2px solid #2D5D7B',
                      paddingBottom: '8px'
                    }}>
                      {t('parentGuardianInformation') || 'Parent/Guardian Information'}
                      {selectedStudent.parentInfo.linked && (
                        <span style={{
                          marginLeft: '10px',
                          fontSize: '0.85rem',
                          color: '#3CB371',
                          fontWeight: '500'
                        }}>
                          ({t('linked') || 'Linked'})
                        </span>
                      )}
                    </h4>
                    <div style={infoGridStyle}>
                      <div style={infoItemStyle}>
                        <span style={infoLabelStyle}>{t('parentName') || 'Parent Name'}:</span>
                        <span style={{
                          ...infoValueStyle,
                          color: selectedStudent.parentInfo.parentName === 'Not provided' ? '#999' : infoValueStyle.color
                        }}>
                          {selectedStudent.parentInfo.parentName}
                        </span>
                      </div>
                      <div style={infoItemStyle}>
                        <span style={infoLabelStyle}>{t('parentEmail') || 'Parent Email'}:</span>
                        <span style={{
                          ...infoValueStyle,
                          color: selectedStudent.parentInfo.parentEmail === 'Not provided' ? '#999' : infoValueStyle.color
                        }}>
                          {selectedStudent.parentInfo.parentEmail}
                        </span>
                      </div>
                      <div style={infoItemStyle}>
                        <span style={infoLabelStyle}>{t('parentPhone') || 'Parent Phone'}:</span>
                        <span style={{
                          ...infoValueStyle,
                          color: selectedStudent.parentInfo.parentPhone === 'Not provided' ? '#999' : infoValueStyle.color
                        }}>
                          {selectedStudent.parentInfo.parentPhone}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div style={chatMessagesStyle}>
              {currentChatMessages.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '0.9rem',
                  marginTop: selectedStudent ? '30px' : '50px'
                }}>
                  {selectedStudent ? `${t('startConversation')} ${selectedStudent.name}` : t('selectStudentToChat')}
                </div>
              ) : (
                currentChatMessages.map((msg) => (
                  <div key={msg.id} style={{
                    marginBottom: '12px',
                    textAlign: msg.sender === 'teacher' ? 'right' : 'left'
                  }}>
                    <div style={messageBubbleStyle(msg.sender)}>
                      {msg.text}
                    </div>
                    <div style={{
                      ...messageTimeStyle,
                      textAlign: msg.sender === 'teacher' ? 'right' : 'left'
                    }}>
                      {msg.timestamp} • {t(msg.sender)}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div>
              <textarea
                style={messageInputStyle}
                placeholder={selectedStudent ? `${t('typeMessage')} ${selectedStudent.name}...` : t('selectStudentToCommunicate')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!selectedStudent}
              />
              <button
                style={sendButtonStyle}
                onClick={handleSendMessage}
                disabled={!selectedStudent || !message.trim()}
                onMouseEnter={(e) => {
                  if (selectedStudent && message.trim()) {
                    e.target.style.backgroundColor = '#912358';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedStudent && message.trim()) {
                    e.target.style.backgroundColor = '#A62D69';
                  }
                }}
              >
                {t('sendMessage')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;