
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaChartLine, FaMedal, FaExclamationTriangle, FaArrowUp
} from 'react-icons/fa';
import { Table } from 'react-bootstrap';
 
// Data
const mockTestData = [
  {
    subject: 'Mathematics',
    date: '2025-06-20',
    score: 88,
    total: 100,
    status: 'Excellent',
    trend: 'up',
    improvement: '+12%',
  },
  {
    subject: 'Science',
    date: '2025-06-15',
    score: 72,
    total: 100,
    status: 'Needs Attention',
    trend: 'down',
    improvement: '-5%',
  },
  {
    subject: 'English',
    date: '2025-06-10',
    score: 91,
    total: 100,
    status: 'Excellent',
    trend: 'up',
    improvement: '+8%',
  },
  {
    subject: 'Social Studies',
    date: '2025-06-05',
    score: 65,
    total: 100,
    status: 'Needs Attention',
    trend: 'down',
    improvement: '-3%',
  },
  {
    subject: 'Computer',
    date: '2025-06-25',
    score: 62,
    total: 100,
    status: 'Needs Attention',
    trend: 'down',
    improvement: '-5%',
  },
];
 
// Helper
const getStatusConfig = (status, t) => {
  switch (status) {
    case 'Excellent':
      return {
        bgColor: 'linear-gradient(45deg, #28a745, #5dd28e)',
        border: '#28a745',
        textColor: '#fff',
        icon: <FaMedal style={{ marginRight: 4 }} />,
        translatedStatus: t('excellent'),
      };
    case 'Improved':
      return {
        bgColor: 'linear-gradient(45deg, #17a2b8, #5ecdd3)',
        border: '#17a2b8',
        textColor: '#fff',
        icon: <FaArrowUp style={{ marginRight: 4 }} />,
        translatedStatus: t('improved'),
      };
    case 'Needs Attention':
      return {
        bgColor: 'linear-gradient(45deg, #ffc107, #ffd65b)',
        border: '#ffc107',
        textColor: '#000',
        icon: <FaExclamationTriangle style={{ marginRight: 4 }} />,
        translatedStatus: t('needsAttention'),
      };
    default:
      return {
        bgColor: '#ccc',
        border: '#999',
        textColor: '#000',
        icon: null,
        translatedStatus: status,
      };
  }
};
 
const MockTestReports = () => {
  const { t } = useTranslation();
 
  // Header stats
  const testCount = mockTestData.length;
  const upTests = mockTestData.filter(t => t.trend === 'up').length;
  const avgScore = Math.round(
    mockTestData.reduce((a, b) => a + b.score, 0) / testCount
  );
  const excTests = mockTestData.filter(t => t.status === 'Excellent').length;
 
  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      {/* Custom CSS for animation & responsiveness */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
       
        /* Responsive card style */
        .responsive-card {
          background: rgba(255,255,255,0.95) !important;
          backdrop-filter: blur(10px);
          border-radius: 15px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          margin-bottom: 0.75rem;
        }
 
        .table-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
 
        .status-badge {
          background: #667eea;
          color: white;
          padding: 3px 10px;
          border-radius: 15px;
          font-weight: 500;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
 
        .progress-container {
          display: flex;
          align-items: center;
          min-width: 80px;
        }
 
        .progress-bar-wrapper {
          flex: 1;
          margin-right: 4px;
          height: 6px;
          border-radius: 3px;
          background-color: #e9ecef;
        }
 
        .progress-bar {
          height: 100%;
          transition: width 0.5s;
          border-radius: 3px;
        }
 
        .test-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 0.5rem;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          background-color: #fff;
        }
 
        .test-item:last-child {
          border-bottom: none;
        }
 
        .test-label {
          font-weight: bold;
          color: #333;
          font-size: 0.7rem;
        }
 
        .test-value {
          color: #666;
          font-size: 0.65rem;
        }
 
        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .responsive-title {
            font-size: 1.2rem !important;
            text-align: center;
            margin-bottom: 0.4rem;
          }
         
          .responsive-sub {
            font-size: 0.75rem !important;
            text-align: center;
            margin-bottom: 0.4rem;
          }
         
          .card-body {
            padding: 0.4rem !important;
          }
         
          .table {
            display: none; /* Hide table on mobile */
          }
 
          .test-list {
            display: block; /* Show list on mobile */
          }
 
          .test-item {
            padding: 0.3rem;
            gap: 0.1rem;
          }
 
          .test-label {
            font-size: 0.6rem;
          }
 
          .test-value {
            font-size: 0.55rem;
          }
 
          .status-badge {
            font-size: 0.5rem;
            padding: 1px 6px;
            gap: 2px;
          }
 
          .progress-container {
            min-width: 50px;
            justify-content: center;
          }
 
          .progress-bar-wrapper {
            margin-right: 2px;
            height: 4px;
          }
 
          .progress-percentage {
            min-width: 16px;
            font-size: 0.5rem;
          }
 
          .icon-sm {
            width: 10px !important;
            height: 10px !important;
          }
 
          .card-body .text-center {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.2rem;
          }
 
          .card-body h5 {
            margin: 0;
            font-size: 1rem;
          }
 
          .card-body p {
            font-size: 0.6rem;
            margin: 0;
          }
 
          .row.g-3 {
            margin-left: -0.25rem;
            margin-right: -0.25rem;
          }
 
          .col-12 {
            padding-left: 0.25rem;
            padding-right: 0.25rem;
          }
        }
 
        @media (max-width: 480px) {
          .responsive-title {
            font-size: 1rem !important;
          }
         
          .responsive-sub {
            font-size: 0.65rem !important;
          }
 
          .test-item {
            padding: 0.2rem;
            gap: 0.1rem;
          }
 
          .test-label {
            font-size: 0.55rem;
          }
 
          .test-value {
            font-size: 0.5rem;
          }
 
          .status-badge {
            font-size: 0.45rem;
            padding: 1px 4px;
            gap: 1px;
          }
 
          .progress-container {
            min-width: 40px;
          }
 
          .progress-percentage {
            font-size: 0.45rem;
            min-width: 14px;
          }
 
          .icon-sm {
            width: 8px !important;
            height: 8px !important;
          }
 
          .card-body {
            padding: 0.3rem !important;
          }
 
          .card-body h5 {
            font-size: 0.9rem;
          }
 
          .card-body p {
            font-size: 0.55rem;
          }
        }
 
        /* Desktop styles */
        @media (min-width: 769px) {
          .test-list {
            display: none; /* Hide list on desktop */
          }
 
          .table {
            display: table; /* Show table on desktop */
          }
 
          .table th, .table td {
            font-size: 0.85rem;
            padding: 0.4rem;
            vertical-align: middle;
            text-align: center;
          }
        }
      `}</style>
 
 
  
      {/* Page Container */}
      <div style={{
        minHeight: '100vh',
        background: '#e9eaf0',
        fontFamily: '"Inter", "Noto Sans", sans-serif',
        padding: '0.5rem 0'
      }}>
        <div className="container-fluid">
          {/* Header Stats */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="text-white text-center mb-3">
                <h1 className="display-6 fw-bold mb-1 text-dark responsive-title">{t('MockTestReports.Title')}</h1>
                <p className="mb-0 opacity-75 text-secondary responsive-sub">
                  {t('mockTestReports.subtitle')}
                </p>
              </div>
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <div className="card border-0 responsive-card">
                    <div className="card-body p-2 text-center">
                      <div className="p-1 rounded-circle mx-auto mb-1" style={{ backgroundColor: '#28a74520', width: 'fit-content' }}>
                        <FaMedal className="icon-sm" style={{ color: '#28a745', width: 20, height: 20 }} />
                      </div>
                      <h5 className="fw-bold mb-0" style={{ color: '#28a745' }}>{excTests}</h5>
                      <p className="text-muted small mb-0">{t('excellentScores')}</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="card border-0 responsive-card">
                    <div className="card-body p-2 text-center">
                      <div className="p-1 rounded-circle mx-auto mb-1" style={{ backgroundColor: '#4facfe20', width: 'fit-content' }}>
                        <FaChartLine className="icon-sm" style={{ color: '#4facfe', width: 20, height: 20 }} />
                      </div>
                      <h5 className="fw-bold mb-0" style={{ color: '#4facfe' }}>
                        {avgScore}%
                      </h5>
                      <p className="text-muted small mb-0">{t('averageScore')}</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="card border-0 responsive-card">
                    <div className="card-body p-2 text-center">
                      <div className="p-1 rounded-circle mx-auto mb-1" style={{ backgroundColor: '#17a2b820', width: 'fit-content' }}>
                        <FaArrowUp className="icon-sm" style={{ color: '#17a2b8', width: 20, height: 20 }} />
                      </div>
                      <h5 className="fw-bold mb-0" style={{ color: '#17a2b8' }}>
                        {upTests}/{testCount}
                      </h5>
                      <p className="text-muted small mb-0">{t('testsImproved')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          {/* Table Card */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0 responsive-card">
                <div className="card-body p-2">
                  <div className="d-flex align-items-center mb-2">
                    <div className="p-1 rounded-circle me-1" style={{ backgroundColor: '#667eea20' }}>
                      <FaChartLine className="icon-sm" style={{ color: '#667eea', width: 20, height: 20 }} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">{t('detailedSummary')}</h6>
                      <p className="text-muted small mb-0">{t('summaryDesc')}</p>
                    </div>
                  </div>
                  <div className="table-container">
                    <Table responsive="sm" style={{ marginBottom: 0 }}>
                      <thead style={{ backgroundColor: '#2d5d7b', color: '#fff' }}>
                        <tr>
                          <th className="text-center py-1">{t('date')}</th>
                          <th className="text-center py-1">{t('subject')}</th>
                          <th className="text-center py-1">{t('score')}</th>
                          <th className="text-center py-1">{t('progress')}</th>
                          <th className="text-center py-1">{t('status')}</th>
                          <th className="text-center py-1">{t('trend')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockTestData.map((test, index) => {
                          const percentage = (test.score / test.total) * 100;
                          const status = getStatusConfig(test.status, t);
                          const isUp = test.trend === 'up';
                          return (
                            <tr key={index} style={{
                              animation: `fadeInUp 0.5s ease-in ${index * 0.1}s`,
                              animationFillMode: 'both',
                              backgroundColor: index % 2 === 0 ? '#ffffff' : '#f4f8fb',
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              <td className="text-center fw-medium">{test.date}</td>
                              <td className="text-center fw-bold">{t(`subjects.${test.subject.toLowerCase().replace(' ', '-')}`, { defaultValue: test.subject })}</td>
                              <td className="text-center fw-semibold">
                                {test.score}<span className="text-muted">/{test.total}</span>
                              </td>
                              <td>
                                <div className="progress-container justify-content-center">
                                  <div className="progress-bar-wrapper">
                                    <div className="progress-bar" style={{
                                      width: `${percentage}%`,
                                      backgroundColor: percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545',
                                    }} />
                                  </div>
                                  <span className="progress-percentage fw-bold" style={{
                                    color: percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545'
                                  }}>
                                    {Math.round(percentage)}%
                                  </span>
                                </div>
                              </td>
                              <td className="text-center">
                                <div className="status-badge" style={{
                                  background: status.bgColor,
                                  color: status.textColor,
                                  border: `1px solid ${status.border}`,
                                }}>
                                  {status.icon}
                                  {status.translatedStatus}
                                </div>
                              </td>
                              <td className="text-center fw-bold" style={{ color: isUp ? '#28a745' : '#dc3545', fontSize: '0.8rem' }}>
                                {isUp ? '↑' : '↓'} {test.improvement}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                  <div className="test-list">
                    {mockTestData.map((test, index) => {
                      const percentage = (test.score / test.total) * 100;
                      const status = getStatusConfig(test.status, t);
                      const isUp = test.trend === 'up';
                      return (
                        <div key={index} className="test-item" style={{
                          animation: `fadeInUp 0.5s ease-in ${index * 0.1}s`,
                          animationFillMode: 'both',
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#f4f8fb',
                        }}>
                          <div><span className="test-label">{t('date')}:</span> <span className="test-value">{test.date}</span></div>
                          <div><span className="test-label">{t('subject')}:</span> <span className="test-value">{t(`subjects.${test.subject.toLowerCase().replace(' ', '-')}`, { defaultValue: test.subject })}</span></div>
                          <div><span className="test-label">{t('score')}:</span> <span className="test-value">{test.score}/{test.total}</span></div>
                          <div className="progress-container">
                            <div className="progress-bar-wrapper">
                              <div className="progress-bar" style={{
                                width: `${percentage}%`,
                                backgroundColor: percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545',
                              }} />
                            </div>
                            <span className="progress-percentage" style={{
                              color: percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545'
                            }}>
                              {Math.round(percentage)}%
                            </span>
                          </div>
                          <div><span className="test-label">{t('status')}:</span>
                            <div className="status-badge" style={{
                              background: status.bgColor,
                              color: status.textColor,
                              border: `1px solid ${status.border}`,
                              display: 'inline-flex',
                              verticalAlign: 'middle',
                            }}>
                              {status.icon}
                              {status.translatedStatus}
                            </div>
                          </div>
                          <div><span className="test-label">{t('trend')}:</span> <span className="test-value" style={{ color: isUp ? '#28a745' : '#dc3545' }}>
                            {isUp ? '↑' : '↓'} {test.improvement}
                          </span></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
 
export default MockTestReports;
 
 