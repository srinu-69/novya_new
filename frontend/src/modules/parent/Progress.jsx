 
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calculator,
  Atom,
  BookOpen,
  AlertTriangle,
  Globe,
  Code,
  TrendingUp,
  TrendingDown,
  BarChart3,
  User,
  Clock,
  Award,
  CheckCircle2
} from 'lucide-react';
 
const Progress = () => {
  const { t, i18n } = useTranslation();
 
  // Language options
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
 
  const weeklyData = [
    { day: 'Mon', activity: 85, hours: 4.2 },
    { day: 'Tue', activity: 72, hours: 3.5 },
    { day: 'Wed', activity: 93, hours: 5.1 },
    { day: 'Thu', activity: 88, hours: 4.7 },
    { day: 'Fri', activity: 76, hours: 3.8 },
    { day: 'Sat', activity: 95, hours: 5.5 },
    { day: 'Sun', activity: 82, hours: 4.1 },
  ];
 
  const subjects = [
    { name: t("mathematics"), icon: Calculator, score: 82, trend: 'up', change: '+5%' },
    { name: t("science"), icon: Atom, score: 90, trend: 'up', change: '+8%' },
    { name: t("english"), icon: BookOpen, score: 86, trend: 'up', change: '+3%' },
    { name: t("Social"), icon: Globe, score: 72, trend: 'down', change: '-4%' },
    { name: t("Computer"), icon: Code, score: 96, trend: 'up', change: '+12%' }
  ];
 
  const stats = [
    { title: t("overallScore"), value: '84%', icon: Award, color: '#667eea' },
    { title: t("studyHours"), value: '28.9h', icon: Clock, color: '#f093fb' },
    { title: t("tasksCompleted"), value: '21/25', icon: CheckCircle2, color: '#4facfe' },
  ];
 
  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
 
      <div
        style={{
          minHeight: '100vh',
          background: '#e9eaf0ff',
          fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
        }}
      >
        <div className="container-fluid p-4">
          <div className="d-flex justify-content-between align-items-center text-white mb-4">
            <h1 className="display-6 fw-bold mb-0 text-dark">{t("title")}</h1>
 
            {/* Language Dropdown */}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              defaultValue={i18n.language}
              className="form-select w-auto"
              style={{
                borderRadius: "10px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                color: "black",
                fontWeight: "500",
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="ml">മലയാളം</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
 
          {/* Stats Section */}
          <div className="row g-4 mb-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="col-12 col-md-4">
                  <div
                    className="card border-0 h-100"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <p className="text-muted small mb-1 fw-medium">{stat.title}</p>
                          <h2 className="fw-bold mb-0" style={{ color: stat.color }}>{stat.value}</h2>
                        </div>
                        <div
                          className="p-3 rounded-circle"
                          style={{ backgroundColor: stat.color + '20' }}
                        >
                          <IconComponent size={24} style={{ color: stat.color }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
 
          {/* Weekly Activity */}
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div
                className="card border-0 h-100"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                      <h5 className="fw-bold mb-1">{t("weeklyActivity")}</h5>
                      <p className="text-muted small mb-0">{t("weeklySubtext")}</p>
                    </div>
                    <BarChart3 className="text-muted" size={24} />
                  </div>
 
                  <div className="row g-3">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="col">
                        <div className="text-center">
                          <div
                            style={{
                              height: 120,
                              width: 24,
                              display: "flex",
                              flexDirection: "column-reverse",
                              alignItems: "center",
                              margin: "0 auto",
                              position: "relative"
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 12,
                                height: "100%",
                                background: "#e5e7eb",
                                borderRadius: 8
                              }}
                            />
                            <div
                              style={{
                                width: 12,
                                height: `${day.activity}%`,
                                background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
                                borderRadius: 8,
                              }}
                            />
                          </div>
                          <div className="small fw-medium text-dark">{day.day}</div>
                          <div className="small text-muted">{day.hours}h</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
 
            {/* Goal Section */}
            <div className="col-12 col-lg-4">
              <div
                className="card border-0 h-100 text-center p-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '20px'
                }}
              >
                <div className="display-6 fw-bold text-dark mb-2">84%</div>
                <div className="small text-muted mb-2">{t("complete")}</div>
                <h6 className="fw-bold mb-2">{t("thisWeekGoal")}</h6>
                <p className="text-muted small mb-0">{t("goalSubtext")}</p>
              </div>
            </div>
          </div>
 
          {/* Subject Performance */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card border-0" style={{ background: 'white', borderRadius: '20px' }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                      <h5 className="fw-bold mb-1">{t("subjectPerformance")}</h5>
                      <p className="text-muted small mb-0">{t("subjectSubtext")}</p>
                    </div>
                    <User className="text-muted" size={24} />
                  </div>
 
                  <div className="row g-4">
                    {subjects.map((subject, index) => {
                      const IconComponent = subject.icon;
                      return (
                        <div key={index} className="col-12 col-md-6 col-lg-4">
                          <div
                            className="p-4 rounded-4 h-100"
                            style={{
                              background: '#fff',
                              borderRadius: '999px',
                              border: '3px solid #f4a468',
                              boxShadow: '0 6px 20px rgba(244,164,104,0.06)'
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <IconComponent size={28} style={{ color: '#f4a468' }} />
                              <div className="d-flex align-items-center">
                                {subject.trend === 'up' ? (
                                  <TrendingUp size={16} color="#28a745" className="me-1" />
                                ) : (
                                  <TrendingDown size={16} color="#dc3545" className="me-1" />
                                )}
                                <span className="small">{subject.change}</span>
                              </div>
                            </div>
                            <h6 className="fw-semibold mb-2">{subject.name}</h6>
                            <div className="display-6 fw-bold">{subject.score}%</div>
                            <div className="small opacity-75">{t("currentScore")}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          {/* Alert Section */}
          <div className="row mt-4">
            <div className="col-12">
              <div
                className="alert border-0 d-flex align-items-center p-4"
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 193, 7, 0.2)'
                }}
              >
                <div
                  className="p-3 rounded-circle me-3"
                  style={{ backgroundColor: 'rgba(255, 193, 7, 0.2)' }}
                >
                  <AlertTriangle size={24} style={{ color: '#f57c00' }} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-2" style={{ color: '#f57c00' }}>
                    {t("alertTitle")}
                  </h6>
                  <p className="mb-0 text-dark opacity-75">{t("alertMessage")}</p>
                </div>
              </div>
            </div>
          </div>
 
        </div>
      </div>
    </>
  );
};
 
export default Progress;
 