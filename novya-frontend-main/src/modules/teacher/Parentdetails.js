import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ParentDetails = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedParent, setSelectedParent] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistories, setChatHistories] = useState({});

  const parents = [
    { id: 1, name: 'Robert Doe', childName: 'John Doe', performance: 'Excellent', email: 'robert.doe@example.com', phone: '+1-555-0101', lastContact: '2 days ago', childGrade: 'A', attendance: '95%' },
    { id: 2, name: 'Michael Smith', childName: 'Jane Smith', performance: 'Good', email: 'michael.smith@example.com', phone: '+1-555-0102', lastContact: '1 week ago', childGrade: 'A+', attendance: '92%' },
    { id: 3, name: 'David Johnson', childName: 'Mike Johnson', performance: 'Average', email: 'david.johnson@example.com', phone: '+1-555-0103', lastContact: '3 weeks ago', childGrade: 'C', attendance: '85%' },
    { id: 4, name: 'James Wilson', childName: 'Sarah Wilson', performance: 'Excellent', email: 'james.wilson@example.com', phone: '+1-555-0104', lastContact: '5 days ago', childGrade: 'B+', attendance: '98%' },
    { id: 5, name: 'Richard Brown', childName: 'Tom Brown', performance: 'Good', email: 'richard.brown@example.com', phone: '+1-555-0105', lastContact: '2 weeks ago', childGrade: 'A-', attendance: '90%' },
    { id: 6, name: 'Charles Davis', childName: 'Emma Davis', performance: 'Good', email: 'charles.davis@example.com', phone: '+1-555-0106', lastContact: '1 month ago', childGrade: 'B', attendance: '78%' },
    { id: 7, name: 'Thomas Miller', childName: 'Alex Miller', performance: 'Excellent', email: 'thomas.miller@example.com', phone: '+1-555-0107', lastContact: '3 days ago', childGrade: 'A', attendance: '96%' },
    { id: 8, name: 'Christopher Garcia', childName: 'Lisa Garcia', performance: 'Good', email: 'christopher.garcia@example.com', phone: '+1-555-0108', lastContact: '1 week ago', childGrade: 'A+', attendance: '91%' },
    { id: 9, name: 'Daniel Martinez', childName: 'Kevin Martinez', performance: 'Average', email: 'daniel.martinez@example.com', phone: '+1-555-0109', lastContact: '2 weeks ago', childGrade: 'C+', attendance: '87%' },
    { id: 10, name: 'Paul Robinson', childName: 'Amy Robinson', performance: 'Excellent', email: 'paul.robinson@example.com', phone: '+1-555-0110', lastContact: '4 days ago', childGrade: 'B+', attendance: '94%' }
  ];

  const handleBack = () => {
    navigate('/teacher/userlist');
  };

  const handleParentSelect = (parent) => {
    setSelectedParent(parent);
    setMessage('');
    
    // Initialize chat history if it doesn't exist
    if (!chatHistories[parent.id]) {
      setChatHistories(prev => ({
        ...prev,
        [parent.id]: []
      }));
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedParent) {
      const parentId = selectedParent.id;
      const currentChat = chatHistories[parentId] || [];
      
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'teacher',
        timestamp: new Date().toLocaleTimeString()
      };

      // Update chat history for the specific parent
      const updatedChat = [...currentChat, newMessage];
      setChatHistories(prev => ({
        ...prev,
        [parentId]: updatedChat
      }));
      
      setMessage('');
      
      // Simulate parent response after 3 seconds
      setTimeout(() => {
        const parentResponse = {
          id: Date.now() + 1,
          text: generateParentResponse(selectedParent),
          sender: 'parent',
          timestamp: new Date().toLocaleTimeString()
        };
        
        setChatHistories(prev => ({
          ...prev,
          [parentId]: [...prev[parentId], parentResponse]
        }));
      }, 3000);
    }
  };

  const generateParentResponse = (parent) => {
    // Generate different responses based on parent and child's performance
    const responses = {
      'Excellent': [
        `Thank you for the wonderful news about ${parent.childName}'s performance! We're so proud and will continue to encourage them.`,
        `That's fantastic to hear about ${parent.childName}! We'll make sure to celebrate their achievements at home.`,
        `We're delighted with ${parent.childName}'s progress. Thank you for your excellent guidance and support.`
      ],
      'Good': [
        `Thank you for the update about ${parent.childName}. We're happy with their progress and will work on helping them reach excellence.`,
        `We appreciate the feedback on ${parent.childName}'s performance. We'll discuss areas for improvement together.`,
        `Thanks for letting us know about ${parent.childName}'s progress. We'll provide extra support at home.`
      ],
      'Average': [
        `Thank you for sharing ${parent.childName}'s performance. We'll work together to help them improve in their studies.`,
        `We understand ${parent.childName} needs to improve. We'll create a study plan and monitor their progress closely.`,
        `Thanks for the feedback. We'll provide more guidance to ${parent.childName} to help them perform better.`
      ],
      'Needs Improvement': [
        `We appreciate you informing us about ${parent.childName}'s performance. We're concerned and will take immediate action to support them.`,
        `Thank you for the honest feedback. We'll work closely with ${parent.childName} and provide extra tutoring to help them improve.`,
        `We understand the seriousness of ${parent.childName}'s situation. We'll implement a structured study routine immediately.`
      ]
    };

    const performanceResponses = responses[parent.performance] || responses['Average'];
    const randomResponse = performanceResponses[Math.floor(Math.random() * performanceResponses.length)];
    return randomResponse;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentChatMessages = () => {
    if (!selectedParent) return [];
    return chatHistories[selectedParent.id] || [];
  };

  const getPerformanceColor = (performance) => {
    // Map translated performance values back to English for color determination
    const performanceMap = {
      [t('Excellent')]: 'Excellent',
      [t('Good')]: 'Good',
      [t('Average')]: 'Average',
      [t('Needs Improvement')]: 'Needs Improvement'
    };
    
    const englishPerformance = performanceMap[performance] || performance;
    
    switch(englishPerformance) {
      case 'Excellent': return '#3CB371';
      case 'Good': return '#4DD0E1';
      case 'Average': return '#FFC107';
      case 'Needs Improvement': return '#DC3545';
      default: return '#B0BEC5';
    }
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

  // Responsive container style
  const containerStyle = {
    padding: '20px',
    backgroundColor: '#F4F8FB',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
    width: '100%',
    overflowX: 'hidden'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px'
  };

  const titleStyle = {
    color: '#222831',
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
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
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap'
  };

  // Responsive layout
  const layoutStyle = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, 380px)',
    gap: '25px',
    alignItems: 'start',
    width: '100%'
  };

  const tableContainerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'auto',
    width: '100%',
    maxHeight: 'calc(100vh - 180px)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '650px'
  };

  const thStyle = {
    backgroundColor: '#2D5D7B',
    color: '#FFFFFF',
    padding: '16px 12px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0
  };

  const tdStyle = {
    padding: '16px 12px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle'
  };

  const performanceBadgeStyle = (performance) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500',
    backgroundColor: `${getPerformanceColor(performance)}20`,
    color: getPerformanceColor(performance),
    border: `1px solid ${getPerformanceColor(performance)}`,
    whiteSpace: 'nowrap',
    display: 'inline-block'
  });

  const gradeBadgeStyle = (grade) => ({
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    backgroundColor: `${getGradeColor(grade)}20`,
    color: getGradeColor(grade),
    border: `1px solid ${getGradeColor(grade)}`,
    whiteSpace: 'nowrap',
    display: 'inline-block'
  });

  const attendanceBadgeStyle = (attendance) => ({
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    backgroundColor: `${getAttendanceColor(attendance)}20`,
    color: getAttendanceColor(attendance),
    border: `1px solid ${getAttendanceColor(attendance)}`,
    whiteSpace: 'nowrap',
    display: 'inline-block'
  });

  // Chat container with proper constraints
  const chatContainerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    height: 'fit-content',
    maxHeight: 'calc(100vh - 180px)',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: '300px',
    boxSizing: 'border-box',
    overflow: 'hidden'
  };

  const chatTitleStyle = {
    color: '#2D5D7B',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '8px',
    textAlign: 'center',
    wordWrap: 'break-word',
    lineHeight: '1.3'
  };

  const chatSubtitleStyle = {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '15px',
    textAlign: 'center',
    wordWrap: 'break-word',
    lineHeight: '1.3'
  };

  const parentInfoStyle = {
    backgroundColor: '#F8F9FA',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    fontSize: '0.8rem'
  };

  const infoItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '5px'
  };

  const infoLabelStyle = {
    color: '#666',
    fontWeight: '500',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap'
  };

  const infoValueStyle = {
    color: '#222831',
    fontWeight: '600',
    fontSize: '0.8rem',
    textAlign: 'right',
    wordBreak: 'break-word',
    flex: '1',
    minWidth: '0'
  };

  const messageInputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '12px',
    resize: 'vertical',
    minHeight: '80px',
    backgroundColor: !selectedParent ? '#F5F5F5' : '#FFFFFF',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  };

  const sendButtonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: selectedParent && message.trim() ? '#A62D69' : '#B0BEC5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: selectedParent && message.trim() ? 'pointer' : 'not-allowed',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  };

  const chatMessagesStyle = {
    flex: '1',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    overflowY: 'auto',
    backgroundColor: '#F8F9FA',
    minHeight: '200px',
    maxHeight: '300px',
    boxSizing: 'border-box'
  };

  const messageBubbleStyle = (sender) => ({
    display: 'inline-block',
    padding: '10px 14px',
    borderRadius: sender === 'teacher' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    backgroundColor: sender === 'teacher' ? '#2D5D7B' : '#E9ECEF',
    color: sender === 'teacher' ? '#FFFFFF' : '#333',
    maxWidth: '85%',
    fontSize: '0.85rem',
    marginBottom: '8px',
    marginLeft: sender === 'teacher' ? 'auto' : '0',
    marginRight: sender === 'teacher' ? '0' : 'auto',
    wordWrap: 'break-word',
    lineHeight: '1.4'
  });

  const messageTimeStyle = {
    fontSize: '0.7rem',
    color: '#666',
    marginTop: '4px',
    textAlign: 'right'
  };

  const currentChatMessages = getCurrentChatMessages();

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>{t('Parent Communication')}</h1>
        <button 
          style={backButtonStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#67A0C7'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#79B3D7'}
          onClick={handleBack}
        >
          {t('Back to User List')}
        </button>
      </div>

      <div style={layoutStyle}>
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{t('Serial No')}</th>
                <th style={thStyle}>{t('Parent Name')}</th>
                <th style={thStyle}>{t('Child Name')}</th>
                <th style={thStyle}>{t('Child Grade')}</th>
                <th style={thStyle}>{t('Attendance')}</th>
                <th style={thStyle}>{t('Performance')}</th>
              </tr>
            </thead>
            <tbody>
              {parents.map((parent, index) => (
                <tr 
                  key={parent.id}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: selectedParent?.id === parent.id ? 'rgba(45, 93, 123, 0.1)' : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedParent?.id !== parent.id) {
                      e.currentTarget.style.backgroundColor = 'rgba(45, 93, 123, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedParent?.id !== parent.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  onClick={() => handleParentSelect(parent)}
                >
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>{parent.name}</td>
                  <td style={tdStyle}>{parent.childName}</td>
                  <td style={tdStyle}>
                    <span style={gradeBadgeStyle(parent.childGrade)}>
                      {parent.childGrade}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={attendanceBadgeStyle(parent.attendance)}>
                      {parent.attendance}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={performanceBadgeStyle(t(parent.performance))}>
                      {t(parent.performance)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={chatContainerStyle}>
          <h3 style={chatTitleStyle}>
            {selectedParent ? `${t('Message')} ${selectedParent.name}` : t('Select a Parent')}
          </h3>
          <p style={chatSubtitleStyle}>
            {selectedParent && `${t('Regarding')} ${selectedParent.childName}'s ${t('performance')} (${t(selectedParent.performance)})`}
          </p>
          
          {selectedParent && (
            <div style={parentInfoStyle}>
              <div style={infoGridStyle}>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>{t('Email')}:</span>
                  <span style={infoValueStyle}>{selectedParent.email}</span>
                </div>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>{t('Phone')}:</span>
                  <span style={infoValueStyle}>{selectedParent.phone}</span>
                </div>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>{t('Child Grade')}:</span>
                  <span style={gradeBadgeStyle(selectedParent.childGrade)}>
                    {selectedParent.childGrade}
                  </span>
                </div>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>{t('Attendance')}:</span>
                  <span style={attendanceBadgeStyle(selectedParent.attendance)}>
                    {selectedParent.attendance}
                  </span>
                </div>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>{t('Last Contact')}:</span>
                  <span style={infoValueStyle}>{selectedParent.lastContact}</span>
                </div>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>{t('Performance')}:</span>
                  <span style={performanceBadgeStyle(t(selectedParent.performance))}>
                    {t(selectedParent.performance)}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div style={chatMessagesStyle}>
            {currentChatMessages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#666',
                fontSize: '0.85rem',
                marginTop: selectedParent ? '20px' : '40px',
                padding: '10px',
                lineHeight: '1.4'
              }}>
                {selectedParent ? `${t('Start a conversation with')} ${selectedParent.name} ${t('about')} ${selectedParent.childName}'s ${selectedParent.performance.toLowerCase()} ${t('performance')}` : t('Select a parent to start chatting')}
              </div>
            ) : (
              currentChatMessages.map((msg) => (
                <div key={msg.id} style={{
                  marginBottom: '10px',
                  textAlign: msg.sender === 'teacher' ? 'right' : 'left'
                }}>
                  <div style={messageBubbleStyle(msg.sender)}>
                    {msg.text}
                  </div>
                  <div style={{
                    ...messageTimeStyle,
                    textAlign: msg.sender === 'teacher' ? 'right' : 'left'
                  }}>
                    {msg.timestamp} • {msg.sender}
                  </div>
                </div>
              ))
            )}
          </div>

          <div>
            <textarea
              style={messageInputStyle}
              placeholder={selectedParent ? `${t('Type your message about')} ${selectedParent.childName}'s ${selectedParent.performance.toLowerCase()} ${t('performance')}...` : t('Select a parent to start communication')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!selectedParent}
            />
            <button
              style={sendButtonStyle}
              onClick={handleSendMessage}
              disabled={!selectedParent || !message.trim()}
              onMouseEnter={(e) => {
                if (selectedParent && message.trim()) {
                  e.target.style.backgroundColor = '#912358';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedParent && message.trim()) {
                  e.target.style.backgroundColor = '#A62D69';
                }
              }}
            >
              {t('Send Message')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDetails;