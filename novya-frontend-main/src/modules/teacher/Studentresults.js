import React from 'react';
import { useTranslation } from 'react-i18next';

const Studentresults = ({ selectedStudent, handleBackToList }) => {
  const { t } = useTranslation();
  
  if (!selectedStudent) return null;
  
  // Ensure selectedStudent has the expected structure with safe defaults
  const student = {
    id: selectedStudent.id || selectedStudent.student_id || '',
    student_id: selectedStudent.student_id || selectedStudent.id || '',
    initials: selectedStudent.initials || 'NA',
    name: selectedStudent.name || 'Unknown',
    email: selectedStudent.email || '',
    quizScore: selectedStudent.quizScore !== undefined ? selectedStudent.quizScore : null,
    mockScore: selectedStudent.mockScore !== undefined ? selectedStudent.mockScore : null,
    averageScore: selectedStudent.averageScore !== undefined ? selectedStudent.averageScore : null,
    quizAttempts: selectedStudent.quizAttempts || selectedStudent.quiz_attempts_count || 0,
    mockAttempts: selectedStudent.mockAttempts || selectedStudent.mock_attempts_count || 0,
    course: selectedStudent.course || 'General',
    enrollmentDate: selectedStudent.enrollmentDate || null,
    quizCompletionDate: selectedStudent.quizCompletionDate || selectedStudent.quiz_completion_date || null,
    mockCompletionDate: selectedStudent.mockCompletionDate || selectedStudent.mock_completion_date || null,
    quizTimeMinutes: selectedStudent.quizTimeMinutes || selectedStudent.quiz_time_minutes || 0,
    mockTimeMinutes: selectedStudent.mockTimeMinutes || selectedStudent.mock_time_minutes || 0,
    subjectPerformance: selectedStudent.subjectPerformance || selectedStudent.subject_performance || {}
  };

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
    padding: '35px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: `1px solid ${colors.borderColor}`,
    marginBottom: '25px'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: `1px solid ${colors.borderColor}`
  };

  const avatarStyle = {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.white,
    fontWeight: 'bold',
    fontSize: '2rem',
    marginRight: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  };

  const infoStyle = {
    flex: 1
  };

  const nameStyle = {
    margin: '0 0 10px 0',
    fontSize: '1.6rem',
    fontWeight: '700',
    color: colors.dark,
    textTransform: 'capitalize'
  };

  const detailStyle = {
    margin: '5px 0',
    fontSize: '0.95rem',
    color: colors.muted,
    lineHeight: '1.5'
  };

  const sectionStyle = {
    marginBottom: '30px'
  };

  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: colors.dark,
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: `2px solid ${colors.primaryLight}`
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  };

  const subjectCardStyle = {
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: colors.white,
    border: `1px solid ${colors.borderColor}`,
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease'
  };

  const subjectNameStyle = {
    margin: '0 0 12px 0',
    fontSize: '1rem',
    fontWeight: '600',
    color: colors.dark,
    borderBottom: `2px solid ${colors.primaryLight}`,
    paddingBottom: '8px'
  };

  const scoreStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: colors.primary,
    margin: '8px 0 10px 0'
  };

  const metaStyle = {
    fontSize: '0.85rem',
    color: colors.muted,
    margin: '4px 0',
    lineHeight: '1.4'
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
    padding: '12px 24px',
    backgroundColor: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    fontFamily: 'Inter, sans-serif',
    marginBottom: '25px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      <button 
        style={backButtonStyle}
        onClick={handleBackToList}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#1e4a63';
          e.target.style.transform = 'translateX(-2px)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = colors.primary;
          e.target.style.transform = 'translateX(0)';
        }}
      >
        ← {t('backToStudentsList')}
      </button>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={avatarStyle}>
            {student.initials}
          </div>
          <div style={infoStyle}>
            <h2 style={nameStyle}>{student.name}</h2>
            <p style={detailStyle}>{student.email}</p>
            {student.enrollmentDate && (
              <p style={detailStyle}>Enrolled: {student.enrollmentDate}</p>
            )}
            {student.course && (
              <p style={detailStyle}>Course: {student.course}</p>
            )}
          </div>
        </div>

        {/* Student Results Table */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>{t('studentResultsSummary')}</h3>
          <div style={tableStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...tableHeaderStyle, width: '8%' }}>{t('sno')}</th>
                  <th style={{ ...tableHeaderStyle, width: '25%' }}>{t('studentName')}</th>
                  <th style={{ ...tableHeaderStyle, width: '18%' }}>Quiz Status</th>
                  <th style={{ ...tableHeaderStyle, width: '18%' }}>Mock Test Status</th>
                  <th style={{ ...tableHeaderStyle, width: '15%' }}>{t('averageScore')}</th>
                  <th style={{ ...tableHeaderStyle, width: '16%' }}>{t('course')}</th>
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
                        {student.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{student.name}</div>
                        <div style={{ fontSize: '0.75rem', color: colors.muted }}>{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    {student.quizScore !== null ? (
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        backgroundColor: colors.success + '20',
                        color: colors.success,
                        display: 'inline-block'
                      }}>
                        Completed ({student.quizScore}%)
                      </span>
                    ) : (
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        backgroundColor: colors.warning + '20',
                        color: colors.warning,
                        display: 'inline-block'
                      }}>
                        Pending
                      </span>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    {student.mockScore !== null ? (
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        backgroundColor: colors.success + '20',
                        color: colors.success,
                        display: 'inline-block'
                      }}>
                        Completed ({student.mockScore}%)
                      </span>
                    ) : (
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        backgroundColor: colors.warning + '20',
                        color: colors.warning,
                        display: 'inline-block'
                      }}>
                        Pending
                      </span>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    {student.averageScore !== null ? (
                      <strong style={{ 
                        color: colors.primary,
                        fontSize: '1rem'
                      }}>
                        {student.averageScore.toFixed(1)}%
                      </strong>
                    ) : (
                      <span style={{ color: colors.muted, fontSize: '0.85rem' }}>N/A</span>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    {student.course || 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Subject-wise Performance */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Subject-wise Performance</h3>
          <div style={gridStyle}>
            {['mathematics', 'english', 'science', 'social', 'computer'].map((subjectKey) => {
              const subjectData = student.subjectPerformance[subjectKey];
              const subjectNames = {
                mathematics: 'Mathematics',
                english: 'English',
                science: 'Science',
                social: 'Social Studies',
                computer: 'Computer'
              };
              
              // Always show all subjects, even if no data
              const hasScore = subjectData && subjectData.score !== null && subjectData.score !== undefined;
              const timeMinutes = subjectData?.time_minutes || 0;
              const status = hasScore ? 'Complete' : 'Pending';
              
              return (
                <div key={subjectKey} style={subjectCardStyle}>
                  <h4 style={subjectNameStyle}>{subjectNames[subjectKey]}</h4>
                  {hasScore ? (
                    <>
                      <p style={scoreStyle}>{subjectData.score}%</p>
                      <p style={metaStyle}>Time: {timeMinutes} mins</p>
                      <p style={{ ...metaStyle, color: colors.success, fontWeight: '500' }}>
                        Status: {status}
                      </p>
                    </>
                  ) : (
                    <>
                      <p style={{ ...scoreStyle, color: colors.muted }}>N/A</p>
                      <p style={metaStyle}>Time: 0 mins</p>
                      <p style={{ ...metaStyle, color: colors.warning, fontWeight: '500' }}>
                        Status: Pending
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Assessment Details */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>{t('assessmentDetails')}</h3>
          <div style={gridStyle}>
            <div style={subjectCardStyle}>
              <h4 style={subjectNameStyle}>{t('quizAssessment')}</h4>
              {student.quizScore !== null ? (
                <>
                  <p style={scoreStyle}>{student.quizScore}%</p>
                  <p style={metaStyle}>Time Spent: {student.quizTimeMinutes || 0} mins</p>
                  <p style={metaStyle}>Date Completed: {student.quizCompletionDate || 'N/A'}</p>
                  <p style={metaStyle}>Attempts: {student.quizAttempts || 0}</p>
                  <p style={{ ...metaStyle, color: colors.success, fontWeight: '500' }}>
                    Status: Completed
                  </p>
                </>
              ) : (
                <p style={{ ...metaStyle, color: colors.warning, fontWeight: '500' }}>
                  Status: Pending
                </p>
              )}
            </div>
            <div style={subjectCardStyle}>
              <h4 style={subjectNameStyle}>{t('mockTest')}</h4>
              {student.mockScore !== null ? (
                <>
                  <p style={scoreStyle}>{student.mockScore}%</p>
                  <p style={metaStyle}>Time Spent: {student.mockTimeMinutes || 0} mins</p>
                  <p style={metaStyle}>Date Completed: {student.mockCompletionDate || 'N/A'}</p>
                  <p style={metaStyle}>Attempts: {student.mockAttempts || 0}</p>
                  <p style={{ ...metaStyle, color: colors.success, fontWeight: '500' }}>
                    Status: Completed
                  </p>
                </>
              ) : (
                <p style={{ ...metaStyle, color: colors.warning, fontWeight: '500' }}>
                  Status: Pending
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
              {student.averageScore !== null ? (
                <>
                  <p style={scoreStyle}>{student.averageScore.toFixed(1)}%</p>
                  <p style={metaStyle}>Based on all subject scores</p>
                </>
              ) : (
                <p style={{ ...metaStyle, color: colors.muted }}>No scores available</p>
              )}
            </div>
            <div style={subjectCardStyle}>
              <h4 style={subjectNameStyle}>Total Subjects</h4>
              <p style={scoreStyle}>
                {(() => {
                  const subjectsWithScores = Object.values(student.subjectPerformance || {}).filter(
                    subj => subj && subj.score !== null && subj.score !== undefined
                  ).length;
                  return subjectsWithScores;
                })()}
              </p>
              <p style={metaStyle}>
                {(() => {
                  const subjectsWithScores = Object.values(student.subjectPerformance || {}).filter(
                    subj => subj && subj.score !== null && subj.score !== undefined
                  ).length;
                  return subjectsWithScores === 5 ? 'All subjects completed' : `${subjectsWithScores} subjects completed`;
                })()}
              </p>
            </div>
            <div style={subjectCardStyle}>
              <h4 style={subjectNameStyle}>{t('assessmentsCompleted')}</h4>
              <p style={scoreStyle}>
                {(student.quizScore !== null ? 1 : 0) + (student.mockScore !== null ? 1 : 0)}/2
              </p>
              <p style={metaStyle}>Quiz & Mock Test</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studentresults;