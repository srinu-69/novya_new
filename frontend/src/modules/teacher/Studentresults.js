import React from 'react';
import { useTranslation } from 'react-i18next';

const Studentresults = ({ selectedStudent, handleBackToList }) => {
  const { t } = useTranslation();
  
  if (!selectedStudent) return null;

  const colors = {
    primary: '#2D5D7B',
    primaryLight: 'rgba(45, 93, 123, 0.1)',
    secondary: '#79B3D7',
    accent: '#A62D69',
    light: '#F4F8FB',
    dark: '#222831',
    success: '#3CB371',
    warning: '#FFC107',
    danger: '#DC3545',
    white: '#FFFFFF',
    muted: '#B0BEC5',
    borderColor: 'rgba(0, 0, 0, 0.1)'
  };

  const containerStyle = {
    padding: '20px 30px',
    backgroundColor: colors.light,
    minHeight: 'calc(100vh - 100px)'
  };

  const cardStyle = {
    backgroundColor: colors.white,
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    border: `1px solid ${colors.borderColor}`,
    marginBottom: '20px'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: `1px solid ${colors.borderColor}`
  };

  const avatarStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.white,
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginRight: '20px'
  };

  const infoStyle = {
    flex: 1
  };

  const nameStyle = {
    margin: '0 0 8px 0',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: colors.dark
  };

  const detailStyle = {
    margin: '4px 0',
    fontSize: '0.9rem',
    color: colors.muted
  };

  const sectionStyle = {
    marginBottom: '30px'
  };

  const sectionTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: colors.dark,
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: `1px solid ${colors.borderColor}`
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  };

  const subjectCardStyle = {
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: colors.light,
    border: `1px solid ${colors.borderColor}`
  };

  const subjectNameStyle = {
    margin: '0 0 10px 0',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: colors.dark
  };

  const scoreStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: colors.primary,
    margin: '0 0 5px 0'
  };

  const metaStyle = {
    fontSize: '0.8rem',
    color: colors.muted,
    margin: '2px 0'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: colors.white,
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const tableHeaderStyle = {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: '12px 15px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '0.85rem'
  };

  const tableCellStyle = {
    padding: '12px 15px',
    borderBottom: `1px solid ${colors.borderColor}`,
    fontSize: '0.85rem',
    color: colors.dark
  };

  const statusBadgeStyle = (status) => ({
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '500',
    display: 'inline-block',
    backgroundColor: status === 'complete' ? colors.success + '20' : colors.warning + '20',
    color: status === 'complete' ? colors.success : colors.warning
  });

  const backButtonStyle = {
    padding: '10px 20px',
    backgroundColor: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    fontFamily: 'Inter, sans-serif',
    marginBottom: '20px',
    transition: 'background-color 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <button 
        style={backButtonStyle}
        onClick={handleBackToList}
        onMouseOver={(e) => e.target.style.backgroundColor = '#1e4a63'}
        onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
      >
        {t('backToStudentsList')}
      </button>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={avatarStyle}>
            {selectedStudent.initials}
          </div>
          <div style={infoStyle}>
            <h2 style={nameStyle}>{selectedStudent.name}</h2>
            <p style={detailStyle}>{selectedStudent.email}</p>
            <p style={detailStyle}>{t('enrolled')}: {selectedStudent.enrollmentDate}</p>
            <p style={detailStyle}>{t('course')}: {selectedStudent.course}</p>
          </div>
        </div>

        {/* Student Results Table */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>{t('studentResultsSummary')}</h3>
          <div style={tableStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...tableHeaderStyle, width: '10%' }}>{t('sno')}</th>
                  <th style={{ ...tableHeaderStyle, width: '25%' }}>{t('studentName')}</th>
                  <th style={{ ...tableHeaderStyle, width: '20%' }}>{t('quizStatus')}</th>
                  <th style={{ ...tableHeaderStyle, width: '20%' }}>{t('mockTestStatus')}</th>
                  <th style={{ ...tableHeaderStyle, width: '15%' }}>{t('averageScore')}</th>
                  <th style={{ ...tableHeaderStyle, width: '10%' }}>{t('course')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tableCellStyle}>
                    <strong>1</strong>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        backgroundColor: colors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.white,
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }}>
                        {selectedStudent.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{selectedStudent.name}</div>
                        <div style={{ fontSize: '0.75rem', color: colors.muted }}>{selectedStudent.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={statusBadgeStyle(selectedStudent.quiz.status)}>
                      {selectedStudent.quiz.status === 'complete' 
                        ? `${t('completed')} (${selectedStudent.quiz.score}%)` 
                        : t('pending')}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={statusBadgeStyle(selectedStudent.mocktest.status)}>
                      {selectedStudent.mocktest.status === 'complete' 
                        ? `${t('completed')} (${selectedStudent.mocktest.score}%)` 
                        : t('pending')}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <strong style={{ 
                      color: colors.primary,
                      fontSize: '1rem'
                    }}>
                      {(
                        Object.values(selectedStudent.subjects).reduce((acc, subject) => acc + subject.score, 0) / 
                        Object.keys(selectedStudent.subjects).length
                      ).toFixed(1)}%
                    </strong>
                  </td>
                  <td style={tableCellStyle}>
                    {selectedStudent.course}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Subject-wise Performance */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>{t('subjectWisePerformance')}</h3>
          <div style={gridStyle}>
            {Object.entries(selectedStudent.subjects).map(([subject, data]) => (
              <div key={subject} style={subjectCardStyle}>
                <h4 style={subjectNameStyle}>
                  {subject.charAt(0).toUpperCase() + subject.slice(1).replace(/([A-Z])/g, ' $1')}
                </h4>
                <p style={scoreStyle}>{data.score}%</p>
                <p style={metaStyle}>{t('time')}: {data.timeSpent}</p>
                <p style={{ 
                  ...metaStyle, 
                  color: data.status === 'complete' ? colors.success : colors.warning,
                  fontWeight: '500'
                }}>
                  {t('status')}: {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Details */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>{t('assessmentDetails')}</h3>
          <div style={gridStyle}>
            <div style={subjectCardStyle}>
              <h4 style={subjectNameStyle}>{t('quizAssessment')}</h4>
              {selectedStudent.quiz.status === 'complete' ? (
                <>
                  <p style={scoreStyle}>{selectedStudent.quiz.score}%</p>
                  <p style={metaStyle}>{t('timeSpent')}: {selectedStudent.quiz.timeSpent}</p>
                  <p style={metaStyle}>{t('dateCompleted')}: {selectedStudent.quiz.date}</p>
                  <p style={metaStyle}>{t('attempts')}: {selectedStudent.quiz.attempts}</p>
                  <p style={{ ...metaStyle, color: colors.success, fontWeight: '500' }}>
                    {t('status')}: {t('completed')}
                  </p>
                </>
              ) : (
                <p style={{ ...metaStyle, color: colors.warning, fontWeight: '500' }}>
                  {t('status')}: {t('pending')}
                </p>
              )}
            </div>
            <div style={subjectCardStyle}>
              <h4 style={subjectNameStyle}>{t('mockTest')}</h4>
              {selectedStudent.mocktest.status === 'complete' ? (
                <>
                  <p style={scoreStyle}>{selectedStudent.mocktest.score}%</p>
                  <p style={metaStyle}>{t('timeSpent')}: {selectedStudent.mocktest.timeSpent}</p>
                  <p style={metaStyle}>{t('dateCompleted')}: {selectedStudent.mocktest.date}</p>
                  <p style={metaStyle}>{t('attempts')}: {selectedStudent.mocktest.attempts}</p>
                  <p style={{ ...metaStyle, color: colors.success, fontWeight: '500' }}>
                    {t('status')}: {t('completed')}
                  </p>
                </>
              ) : (
                <p style={{ ...metaStyle, color: colors.warning, fontWeight: '500' }}>
                  {t('status')}: {t('pending')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>{t('performanceSummary')}</h3>
          <div style={gridStyle}>
            <div style={subjectCardStyle}>
              <h4 style={subjectNameStyle}>{t('overallPerformance')}</h4>
              <p style={scoreStyle}>
                {(
                  Object.values(selectedStudent.subjects).reduce((acc, subject) => acc + subject.score, 0) / 
                  Object.keys(selectedStudent.subjects).length
                ).toFixed(1)}%
              </p>
              <p style={metaStyle}>{t('basedOnAllSubjectScores')}</p>
            </div>
            <div style={subjectCardStyle}>
              <h4 style={subjectNameStyle}>{t('totalSubjects')}</h4>
              <p style={scoreStyle}>{Object.keys(selectedStudent.subjects).length}</p>
              <p style={metaStyle}>{t('allSubjectsCompleted')}</p>
            </div>
            <div style={subjectCardStyle}>
              <h4 style={subjectNameStyle}>{t('assessmentsCompleted')}</h4>
              <p style={scoreStyle}>
                {(selectedStudent.quiz.status === 'complete' ? 1 : 0) + (selectedStudent.mocktest.status === 'complete' ? 1 : 0)}/2
              </p>
              <p style={metaStyle}>{t('quizAndMockTest')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studentresults;