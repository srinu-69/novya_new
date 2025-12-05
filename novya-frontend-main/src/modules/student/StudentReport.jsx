import React, { useEffect, useState } from "react";
import { API_CONFIG, djangoAPI } from "../../config/api";

// Reusable animated donut chart
function ProgressPieChart({
  percentage,
  size = 160, // slightly bigger
  duration = 4000,
  label = "Overall",
  color = "#7b3fe4", // Novya purple
}) {
  const radius = 15.9155;
  const circumference = 2 * Math.PI * radius;
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    let frameId;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = percentage * progress;
      setDisplayPercent(current);
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };
    frameId = requestAnimationFrame(animate);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [percentage, duration]);

  const arcLength = (displayPercent / 100) * circumference;
  const containerStyle = {
    width: size + "px",
    height: size + "px",
    position: "relative",
    display: "inline-block",
  };
  const centerLabelStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  return (
    <div style={containerStyle}>
      <svg viewBox="0 0 36 36">
        {/* background */}
        <path
          d={`
            M18 2.0845
            a ${radius} ${radius} 0 0 1 0 31.831
            a ${radius} ${radius} 0 0 1 0 -31.831
          `}
          fill="none"
          stroke="#e1e5ff"
          strokeWidth="4" // thicker ring
        />
        {/* animated arc */}
        <path
          d={`
            M18 2.0845
            a ${radius} ${radius} 0 0 1 0 31.831
            a ${radius} ${radius} 0 0 1 0 -31.831
          `}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div style={centerLabelStyle}>
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#1e3050" }}>
          {Math.round(displayPercent)}%
        </div>
        <div style={{ fontSize: "11px", color: "#6b7280" }}>{label}</div>
      </div>
    </div>
  );
}

export default function StudentReportPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("Quarterly Exams");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const examTypes = [
    "Quarterly Exams",
    "Half Yearly Exams",
    "Annual Exams",
  ];

  // Fetch real school test scores from API
  useEffect(() => {
    const fetchSchoolScores = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("📊 Fetching school test scores for student...");
        const response = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.MY_SCHOOL_SCORES);
        console.log("✅ School scores response:", response);

        if (!response || !response.subjects) {
          console.log("⚠️ No scores found in response");
          setReport({
            student_name: response?.student_name || "Student",
            class_name: response?.class_name || "Class 7",
            total_tests: 0,
            average_percentage: 0,
            attendance_percentage: 0,
            tests: [],
          });
          setLoading(false);
          return;
        }

        // Transform database scores to test format
        const tests = [];
        const subjects = response.subjects || {};
        const academicYear = response.academic_year || "";
        
        // Get current date for test dates (or use updated_at if available)
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Process each subject and create test entries for Quarterly, Half Yearly, and Annual
        Object.entries(subjects).forEach(([subjectName, subjectData]) => {
          const quarterly = subjectData.quarterly || 0;
          const halfYearly = subjectData.halfYearly || 0;
          const annual = subjectData.annual || 0;
          const updatedAt = subjectData.updated_at ? subjectData.updated_at.split('T')[0] : currentDate;

          // Quarterly Exam (out of 100)
          if (quarterly > 0) {
            tests.push({
              date: updatedAt,
              subject: subjectName,
              test_name: "Quarterly Exam",
              score: quarterly,
              max_score: 100,
              exam_type: "Quarterly Exams",
            });
          }

          // Half Yearly Exam (out of 100)
          if (halfYearly > 0) {
            tests.push({
              date: updatedAt,
              subject: subjectName,
              test_name: "Half Yearly Exam",
              score: halfYearly,
              max_score: 100,
              exam_type: "Half Yearly Exams",
            });
          }

          // Annual Exam (out of 100)
          if (annual > 0) {
            tests.push({
              date: updatedAt,
              subject: subjectName,
              test_name: "Annual Exam",
              score: annual,
              max_score: 100,
              exam_type: "Annual Exams",
            });
          }
        });

        // Calculate overall average
        const overallAverage = (() => {
          if (!tests.length) return 0;
          const sum = tests.reduce((acc, t) => {
            if (!t.max_score) return acc;
            return acc + (t.score / t.max_score) * 100;
          }, 0);
          return sum / tests.length;
        })();

        const reportData = {
          student_name: response.student_name || "Student",
          class_name: response.class_name || "Class 7",
          total_tests: tests.length,
          average_percentage: overallAverage,
          attendance_percentage: response.attendance_percentage || 0,
          tests,
        };

        console.log("📊 Processed report data:", reportData);
        setReport(reportData);
      } catch (err) {
        console.error("❌ Error fetching school scores:", err);
        setError(err.message || "Failed to load school test scores");
        setReport({
          student_name: "Student",
          class_name: "Class 7",
          total_tests: 0,
          average_percentage: 0,
          attendance_percentage: 0,
          tests: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolScores();
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <p style={{ fontSize: "16px", color: "#1e3050" }}>Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <p style={{ color: "#ef4444" }}>Error: {error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={styles.page}>
        <p style={{ color: "#1e3050" }}>No report data available.</p>
      </div>
    );
  }

  // filter tests by selected exam type
  const filteredTests = report.tests.filter(
    (t) => t.exam_type === selectedExamType
  );

  // helper to compute average %
  const computeAveragePercentage = (tests) => {
    if (!tests.length) return 0;
    const sum = tests.reduce((acc, t) => {
      if (!t.max_score) return acc;
      return acc + (t.score / t.max_score) * 100;
    }, 0);
    return sum / tests.length;
  };

  const selectedExamAverage = computeAveragePercentage(filteredTests);

  // subject-wise averages (overall, not filtered)
  const subjectMap = {};
  report.tests.forEach((t) => {
    const key = t.subject;
    const percentage = t.max_score ? (t.score / t.max_score) * 100 : 0;
    if (!subjectMap[key]) {
      subjectMap[key] = { total: percentage, count: 1 };
    } else {
      subjectMap[key].total += percentage;
      subjectMap[key].count += 1;
    }
  });

  const subjectStats = Object.keys(subjectMap).map((subject) => ({
    subject,
    avg: (subjectMap[subject].total / subjectMap[subject].count).toFixed(1),
  }));

  // exam type counts (for hover breakdown)
  const examCounts = examTypes.reduce((acc, type) => {
    acc[type] = report.tests.filter((t) => t.exam_type === type).length;
    return acc;
  }, {});

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <div>
          <p style={styles.kicker}>Reports</p>
          <h1 style={styles.title}>
            Your <span style={styles.titleHighlight}>Performance</span> Overview
          </h1>
          <p style={styles.subtitle}>
            Track your grades, attendance, and exam-wise progress in one place.
          </p>
        </div>
        <div style={styles.heroCard}>
          <p style={styles.heroLabel}>Quick Snapshot</p>
          <div style={styles.heroStatsRow}>
            <div style={styles.heroStat}>
              <span style={styles.heroStatValue}>{report.total_tests}</span>
              <span style={styles.heroStatLabel}>Total Tests</span>
            </div>
            <div style={styles.heroStat}>
              <span style={styles.heroStatValue}>
                {report.average_percentage.toFixed(1)}%
              </span>
              <span style={styles.heroStatLabel}>Overall Average</span>
            </div>
            <div style={styles.heroStat}>
              <span style={styles.heroStatValue}>
                {report.attendance_percentage.toFixed(1)}%
              </span>
              <span style={styles.heroStatLabel}>Attendance</span>
            </div>
          </div>
        </div>
      </header>

      {/* BASIC INFO */}
      <section style={styles.infoRow}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Student Name</span>
          <span style={styles.infoValue}>{report.student_name}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Class</span>
          <span style={styles.infoValue}>{report.class_name}</span>
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <section style={styles.cardsRow}>
        {/* Total Tests card with hover breakdown */}
        <div
          style={{ ...styles.card, position: "relative" }}
          onMouseEnter={() => setShowBreakdown(true)}
          onMouseLeave={() => setShowBreakdown(false)}
        >
          <p style={styles.cardLabel}>Total Tests</p>
          <p style={styles.cardValue}>{report.total_tests}</p>
          {showBreakdown && (
            <div style={styles.breakdownPopover}>
              <p style={styles.breakdownTitle}>Test Breakdown</p>
              {examTypes.map((type) => (
                <div key={type} style={styles.breakdownRow}>
                  <span style={styles.breakdownLabel}>{type}</span>
                  <span style={styles.breakdownValue}>
                    {examCounts[type] || 0}
                  </span>
                </div>
              ))}
              <p style={styles.breakdownFooter}>
                Total: {report.total_tests} tests
              </p>
            </div>
          )}
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Overall Average</p>
          <p style={styles.cardValue}>
            {report.average_percentage.toFixed(1)}%
          </p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Attendance</p>
          <p style={styles.cardValue}>
            {report.attendance_percentage.toFixed(1)}%
          </p>
        </div>
      </section>

      {/* CHARTS */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            Progress ({selectedExamType} Average)
          </h2>
          <div style={styles.sectionUnderline} />
        </div>
        <div style={styles.chartCard}>
          <div
            style={{
              display: "flex",
              gap: "28px",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <ProgressPieChart
                percentage={selectedExamAverage || 0}
                label={selectedExamType}
                color="#7b3fe4"
                size={200}
              />
              <p style={styles.chartCaption}>Exam Performance</p>
            </div>
          </div>
          <div style={{ maxWidth: "400px", marginTop: "20px", textAlign: "center" }}>
            <p style={styles.chartText}>
              The chart above shows your average score for{" "}
              <strong>{selectedExamType}</strong>. Switch between exam types
              below to compare your performance.
            </p>
          </div>
        </div>
      </section>

      {/* SUBJECT-WISE */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Subject-wise Performance</h2>
          <div style={styles.sectionUnderline} />
        </div>
        {subjectStats.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No subject data available.</p>
        ) : (
          <div style={styles.chipsRow}>
            {subjectStats.map((s) => (
              <div key={s.subject} style={styles.chip}>
                <span style={{ fontWeight: 600, color: "#1e3050" }}>
                  {s.subject}
                </span>
                <span style={{ fontSize: "13px", color: "#6b7280" }}>
                  {s.avg}% avg
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* TEST-WISE WITH TABS */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Test-wise Report</h2>
          <div style={styles.sectionUnderline} />
        </div>
        {/* Exam type buttons */}
        <div style={styles.examTabsRow}>
          {examTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedExamType(type)}
              style={{
                ...styles.examTab,
                ...(selectedExamType === type
                  ? styles.examTabActive
                  : undefined),
              }}
            >
              {type}
            </button>
          ))}
        </div>
        <div style={{ overflowX: "auto", marginTop: "12px" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Test Name</th>
                <th style={styles.th}>Score</th>
                <th style={styles.th}>Max Score</th>
                <th style={styles.th}>Percentage</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan={7}>
                    No tests available for {selectedExamType}.
                  </td>
                </tr>
              ) : (
                filteredTests.map((t, index) => {
                  const percentage = t.max_score
                    ? ((t.score / t.max_score) * 100).toFixed(1)
                    : "0.0";
                  const percentNum = parseFloat(percentage);
                  const status =
                    percentNum >= 75
                      ? "Excellent"
                      : percentNum >= 50
                      ? "Good"
                      : "Needs Improvement";
                  const statusColor =
                    percentNum >= 75
                      ? "#16a34a"
                      : percentNum >= 50
                      ? "#f59e0b"
                      : "#dc2626";

                  return (
                    <tr key={index} style={styles.tr}>
                      <td style={styles.td}>{t.date}</td>
                      <td style={styles.td}>{t.subject}</td>
                      <td style={styles.td}>{t.test_name}</td>
                      <td style={styles.td}>{t.score}</td>
                      <td style={styles.td}>{t.max_score}</td>
                      <td style={styles.td}>{percentage}%</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            backgroundColor: statusColor + "1A",
                            color: statusColor,
                            fontWeight: 600,
                          }}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    // top padding so content is below fixed navbar
    padding: "110px 32px 24px",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background:
      "linear-gradient(135deg, #f5f7ff 0%, #e7f3ff 45%, #f5fbff 100%)",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    alignItems: "center",
    marginBottom: "28px",
  },
  kicker: {
    fontSize: "13px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#7b3fe4",
    margin: 0,
    marginBottom: "6px",
    fontWeight: 600,
  },
  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 700,
    color: "#1e3050",
  },
  titleHighlight: {
    color: "#7b3fe4",
  },
  subtitle: {
    margin: "10px 0 0 0",
    fontSize: "14px",
    color: "#6b7280",
    maxWidth: "420px",
    lineHeight: 1.5,
  },
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "16px 20px",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.09)",
    minWidth: "260px",
  },
  heroLabel: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
    marginBottom: "10px",
    fontWeight: 500,
  },
  heroStatsRow: {
    display: "flex",
    gap: "16px",
    justifyContent: "space-between",
  },
  heroStat: {
    textAlign: "center",
    flex: 1,
  },
  heroStatValue: {
    display: "block",
    fontSize: "18px",
    fontWeight: 700,
    color: "#1e3050",
  },
  heroStatLabel: {
    display: "block",
    fontSize: "11px",
    color: "#9ca3af",
    marginTop: "4px",
  },
  infoRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  infoItem: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "10px 16px",
    boxShadow: "0 8px 20px rgba(148, 163, 184, 0.18)",
    minWidth: "210px",
  },
  infoLabel: {
    display: "block",
    fontSize: "11px",
    color: "#9ca3af",
    marginBottom: "4px",
  },
  infoValue: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#1e3050",
  },
  cardsRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  card: {
    flex: "1 1 200px",
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    padding: "16px 18px",
    boxShadow: "0 10px 25px rgba(148, 163, 184, 0.18)",
  },
  cardLabel: {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
  },
  cardValue: {
    margin: "10px 0 0 0",
    fontSize: "22px",
    fontWeight: 700,
    color: "#1e3050",
  },
  section: {
    marginBottom: "26px",
  },
  sectionHeader: {
    marginBottom: "10px",
  },
  sectionTitle: {
    fontSize: "18px",
    margin: 0,
    color: "#1e3050",
  },
  sectionUnderline: {
    width: "60px",
    height: "3px",
    borderRadius: "999px",
    marginTop: "6px",
    background:
      "linear-gradient(90deg, #f97316 0%, #f6b013 35%, #7b3fe4 100%)",
  },
  chartCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
    backgroundColor: "#ffffff",
    padding: "18px 20px",
    borderRadius: "22px",
    boxShadow: "0 12px 28px rgba(148, 163, 184, 0.22)",
    flexWrap: "wrap",
  },
  chartCaption: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#4b5563",
    fontWeight: 600,
  },
  chartText: {
    margin: "0 0 8px 0",
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: 1.5,
  },
  chipsRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "#ffffff",
    borderRadius: "999px",
    padding: "8px 16px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 8px 18px rgba(148, 163, 184, 0.22)",
  },
  examTabsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "4px",
  },
  examTab: {
    borderRadius: "999px",
    border: "1px solid #e5e7eb",
    padding: "6px 14px",
    fontSize: "12px",
    backgroundColor: "#ffffff",
    color: "#4b5563",
    cursor: "pointer",
    fontWeight: 500,
    boxShadow: "0 4px 10px rgba(148, 163, 184, 0.18)",
    outline: "none",
  },
  examTabActive: {
    backgroundColor: "#7b3fe4",
    borderColor: "#7b3fe4",
    color: "#ffffff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow: "0 16px 32px rgba(148, 163, 184, 0.25)",
  },
  th: {
    textAlign: "left",
    padding: "10px 14px",
    fontSize: "12px",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#eef2ff",
    color: "#4b5563",
    fontWeight: 600,
  },
  tr: {
    transition: "background-color 0.15s ease",
  },
  td: {
    padding: "10px 14px",
    fontSize: "13px",
    borderBottom: "1px solid #f3f4f6",
    color: "#374151",
  },
  // NEW: hover breakdown popover styles
  breakdownPopover: {
    position: "absolute",
    top: "100%",
    left: "0",
    marginTop: "10px",
    padding: "12px 14px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.18)",
    minWidth: "220px",
    zIndex: 20,
  },
  breakdownTitle: {
    margin: "0 0 8px 0",
    fontSize: "13px",
    fontWeight: 600,
    color: "#111827",
  },
  breakdownRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    marginBottom: "4px",
  },
  breakdownLabel: {
    color: "#4b5563",
  },
  breakdownValue: {
    fontWeight: 600,
    color: "#111827",
  },
  breakdownFooter: {
    marginTop: "8px",
    fontSize: "11px",
    color: "#6b7280",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "6px",
  },
};

