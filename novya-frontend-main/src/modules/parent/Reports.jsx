import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { API_CONFIG, djangoAPI, getChildEmailForParent } from "../../config/api";

const Reports = () => {
  const [data, setData] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [exporting, setExporting] = useState(false);
  const containerRef = useRef(null);

  // Calendar state
  const nowRaw = new Date();
  const today = new Date(nowRaw.getFullYear(), nowRaw.getMonth(), nowRaw.getDate()); // normalize to midnight
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayModalOpen, setDayModalOpen] = useState(false);

  // Exams selection index (safe default 0)
  const [selectedExamIndex, setSelectedExamIndex] = useState(0);

  // Helper: sort exams by date (newest first)
  const sortExamsByDateDesc = (exams = []) =>
    exams.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const childEmail = getChildEmailForParent();
        if (!childEmail) {
          console.error("❌ No child email found. Please ensure you're logged in as a parent with a linked child.");
          // Set empty data structure
          setData({
            overview: { performance: 0, attendance: 0, studyHours: 0, accuracy: 0 },
            subjects: [],
            exams: [],
            dailyRecords: {},
          });
          return;
        }

        console.log("📊 Fetching child school scores for parent, child email:", childEmail);
        const url = `${API_CONFIG.DJANGO.AUTH.CHILD_SCHOOL_SCORES}?child_email=${encodeURIComponent(childEmail)}`;
        const response = await djangoAPI.get(url);
        console.log("✅ Child school scores response:", response);

        if (!response || !response.subjects) {
          console.log("⚠️ No scores found in response");
          setData({
            overview: { performance: 0, attendance: response?.attendance_percentage || 0, studyHours: 0, accuracy: 0 },
            subjects: [],
            exams: [],
            dailyRecords: {},
          });
          return;
        }

        // Transform database scores to exam format
        const examsRaw = [];
        const subjects = response.subjects || {};
        const academicYear = response.academic_year || "";
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Subject colors mapping
        const subjectColors = {
          "Telugu": "#E07A5F",
          "English": "#3D5A80",
          "Hindi": "#2D6A4F",
          "Maths": "#5A20CB",
          "Mathematics": "#5A20CB",
          "Math": "#5A20CB",
          "Biology": "#8AA29E",
          "History": "#D9A441",
          "Physics": "#2D5D7B",
          "Chemistry": "#A62D69",
        };

        // Helper to get remark based on score
        const getRemark = (score) => {
          if (score >= 90) return "Excellent";
          if (score >= 80) return "Very Good";
          if (score >= 70) return "Good";
          if (score >= 60) return "Satisfactory";
          return "Needs Improvement";
        };

        // Collect all subjects with their scores
        const subjectList = [];
        const quarterlySubjects = [];
        const halfYearlySubjects = [];
        const annualSubjects = [];
        const examDates = {
          quarterly: null,
          halfYearly: null,
          annual: null,
        };

        Object.entries(subjects).forEach(([subjectName, subjectData]) => {
          const quarterly = subjectData.quarterly || 0;
          const halfYearly = subjectData.halfYearly || 0;
          const annual = subjectData.annual || 0;
          const overall = subjectData.overall || 0;
          const updatedAt = subjectData.updated_at ? subjectData.updated_at.split('T')[0] : currentDate;

          // Track latest update date for each exam type
          if (quarterly > 0 && (!examDates.quarterly || updatedAt > examDates.quarterly)) {
            examDates.quarterly = updatedAt;
          }
          if (halfYearly > 0 && (!examDates.halfYearly || updatedAt > examDates.halfYearly)) {
            examDates.halfYearly = updatedAt;
          }
          if (annual > 0 && (!examDates.annual || updatedAt > examDates.annual)) {
            examDates.annual = updatedAt;
          }

          // Add to subject list for overview (use overall score)
          subjectList.push({
            name: subjectName,
            score: Math.round(overall),
            color: subjectColors[subjectName] || "#2D5D7B",
          });

          // Collect subjects for each exam type
          if (quarterly > 0) {
            quarterlySubjects.push({
              name: subjectName,
              marks: `${Math.round(quarterly)}/100`,
              remark: getRemark(quarterly),
            });
          }
          if (halfYearly > 0) {
            halfYearlySubjects.push({
              name: subjectName,
              marks: `${Math.round(halfYearly)}/100`,
              remark: getRemark(halfYearly),
            });
          }
          if (annual > 0) {
            annualSubjects.push({
              name: subjectName,
              marks: `${Math.round(annual)}/100`,
              remark: getRemark(annual),
            });
          }
        });

        // Create exam entries
        if (quarterlySubjects.length > 0) {
          const quarterlyAvg = Math.round(
            quarterlySubjects.reduce((sum, s) => {
              const score = parseInt(s.marks.split('/')[0]);
              return sum + score;
            }, 0) / quarterlySubjects.length
          );
          const quarterlyDate = examDates.quarterly || currentDate;
          const quarterlyYear = new Date(quarterlyDate).getFullYear();
          examsRaw.push({
            id: "quarterly",
            title: `Quarterly - Q1 ${quarterlyYear}`,
            date: quarterlyDate,
            subjects: quarterlySubjects,
            average: quarterlyAvg,
          });
        }

        if (halfYearlySubjects.length > 0) {
          const halfYearlyAvg = Math.round(
            halfYearlySubjects.reduce((sum, s) => {
              const score = parseInt(s.marks.split('/')[0]);
              return sum + score;
            }, 0) / halfYearlySubjects.length
          );
          const halfYearlyDate = examDates.halfYearly || currentDate;
          const halfYearlyYear = new Date(halfYearlyDate).getFullYear();
          examsRaw.push({
            id: "half-yearly",
            title: `Half-Yearly - H1 ${halfYearlyYear}`,
            date: halfYearlyDate,
            subjects: halfYearlySubjects,
            average: halfYearlyAvg,
          });
        }

        if (annualSubjects.length > 0) {
          const annualAvg = Math.round(
            annualSubjects.reduce((sum, s) => {
              const score = parseInt(s.marks.split('/')[0]);
              return sum + score;
            }, 0) / annualSubjects.length
          );
          const annualDate = examDates.annual || currentDate;
          const annualYear = new Date(annualDate).getFullYear();
          examsRaw.push({
            id: "annual",
            title: `Annual-Examination - A1 ${annualYear}`,
            date: annualDate,
            subjects: annualSubjects,
            average: annualAvg,
          });
        }

        // Sort exams by date (newest first)
        const exams = sortExamsByDateDesc(examsRaw);

        // Generate daily records (can be enhanced later with real attendance data)
        const dailyRecords = generateMockMonthRecords();

        setData({
          overview: {
            performance: response.overall_score || 0,
            attendance: response.attendance_percentage || 0,
            studyHours: 14,
            accuracy: response.overall_score || 0,
          },
          subjects: subjectList,
          exams,
          dailyRecords,
        });

        // Reset selectedExamIndex to 0 (newest)
        setSelectedExamIndex(0);
      } catch (error) {
        console.error("❌ Error fetching child data:", error);
        // Set empty data on error
        setData({
          overview: { performance: 0, attendance: 0, studyHours: 0, accuracy: 0 },
          subjects: [],
          exams: [],
          dailyRecords: {},
        });
      }
    };

    fetchChildData();
  }, []);

  if (!data) {
    return (
      <div style={S.loaderWrap}>
        <div style={S.loader}>Loading modern report…</div>
      </div>
    );
  }

  // Safe selected exam reference — clamp the index
  const safeExamIndex = Math.max(0, Math.min((data.exams || []).length - 1, selectedExamIndex));
  const selectedExam = (data.exams && data.exams[safeExamIndex]) || null;

  // ----- Export PDF -----
  const handleExportPDF = async () => {
    setExporting(true);
    try {
      if (!containerRef.current) throw new Error("Capture target not found");

      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("student-report.pdf");
    } catch (err) {
      console.error("Export PDF failed:", err);
      alert("Export failed. Ensure html2canvas and jspdf are installed.");
    } finally {
      setExporting(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setFeedbackStatus({ ok: false, msg: "Please enter feedback before sending." });
      return;
    }

    try {
      const childEmail = getChildEmailForParent();
      if (!childEmail) {
        setFeedbackStatus({ ok: false, msg: "Child email not found. Please ensure you're logged in with a linked child." });
        return;
      }

      console.log("📤 Sending parent feedback to student:", childEmail);
      const response = await djangoAPI.post(API_CONFIG.DJANGO.AUTH.SEND_PARENT_FEEDBACK, {
        child_email: childEmail,
        message: feedback.trim(),
        title: "Feedback from Parent"
      });

      console.log("✅ Feedback sent successfully:", response);
      setFeedback("");
      setFeedbackStatus({ ok: true, msg: "Thank you — feedback sent to your child successfully." });
    } catch (error) {
      console.error("❌ Error sending feedback:", error);
      setFeedbackStatus({ ok: false, msg: error.message || "Failed to send feedback. Please try again." });
    }
  };

  // Calendar helpers
  const buildMonthMatrix = (year, month) => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const firstWeekday = first.getDay();
    const totalDays = last.getDate();

    const rows = [];
    let week = new Array(7).fill(null);
    let dayIndex = 1;

    for (let i = 0; i < 7; i++) {
      if (i >= firstWeekday) {
        week[i] = new Date(year, month, dayIndex++);
      }
    }

    rows.push(week);

    while (dayIndex <= totalDays) {
      week = new Array(7).fill(null);
      for (let i = 0; i < 7 && dayIndex <= totalDays; i++) {
        week[i] = new Date(year, month, dayIndex++);
      }
      rows.push(week);
    }

    return rows;
  };

  const monthName = (m) =>
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m];

  const goPrevMonth = () => {
    const prev = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth());
  };

  const goNextMonth = () => {
    const nxt = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(nxt.getFullYear());
    setViewMonth(nxt.getMonth());
  };

  const jumpToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  // recordFor returns records for dates up to today (no future data)
  const recordFor = (d) => {
    if (!d) return null;

    const key = formatKey(d);
    const r = data.dailyRecords?.[key] || null;
    const dNorm = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    return dNorm <= today ? r : null;
  };

  const formatKey = (d) => {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const dd = `${d.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  function sameDate(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  const monthMatrix = buildMonthMatrix(viewYear, viewMonth);

  return (
    <div style={S.pageWrap} ref={containerRef}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Student Insights — Marks & Activities</h1>
          <div style={S.subtitle}>Exams shown with marks. Sports, Weekly Goals, Calendar + day details included.</div>
        </div>
        <div style={S.headerActions}>
          <button style={{ ...S.btn, ...S.exportBtn }} onClick={handleExportPDF} disabled={exporting}>
            {exporting ? "Exporting…" : "Export PDF"}
          </button>
        </div>
      </div>
      <div style={S.gridRoot}>
        {/* LEFT COLUMN */}
        <div style={S.leftCol}>
          {/* KPI Row */}
          <div style={S.kpiRow}>
            <Glass>
              <div style={S.kpiTitle}>Overall</div>
              <div style={S.kpiBig}>{data.overview.performance}%</div>
              <div style={S.kpiMeta}>Performance</div>
            </Glass>
            <Glass>
              <div style={S.kpiTitle}>Attendance</div>
              <div style={S.kpiBig}>{data.overview.attendance}%</div>
              <div style={S.kpiMeta}>This term</div>
            </Glass>
           
          </div>

          {/* ---------------- SUBJECTS (ROW style) ---------------- */}
          <Glass style={{ marginTop: 16 }}>
            <div style={S.cardHeader}>
              <h3 style={S.cardTitle}>Subjects Overview</h3>
              <div style={S.cardSmallMeta}>Subject | Percentage | Status</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              {Array.isArray(data.subjects) &&
                data.subjects.map((s) => {
                  const color = s.color || "#2D5D7B"; // safe fallback
                  const statusIsStrong = typeof s.score === "number" && s.score >= 85;

                  return (
                    <div key={s.name} style={{ ...S.subjectRowWrap }}>
                      <div style={{ ...S.subjectRowInner, borderLeft: `6px solid ${color}` }}>
                        <div style={{ ...S.iconBox, background: color }}>{s.name.slice(0, 2).toUpperCase()}</div>
                        <div style={{ flex: 1 }}>
                          <div style={S.subjectName}>{s.name}</div>
                        </div>
                        <div style={{ width: 80, textAlign: "right", fontWeight: 800 }}>
                          {s.score}%{" "}
                        </div>
                        <div style={{ width: 80, textAlign: "right" }}>
                          {statusIsStrong ? (
                            <span style={{ color: "#059669", fontWeight: 700 }}>↑ strong</span>
                          ) : (
                            <span style={{ color: "#6b7280", fontWeight: 700 }}>↘ focus</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Glass>

          {/* EXAMS */}
          <Glass style={{ marginTop: 16 }}>
            <div style={S.cardHeader}>
              <h3 style={S.cardTitle}>Exams & Term Results (marks)</h3>
              <div style={S.cardSmallMeta}>Select an exam to view subject-wise marks</div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <select
                value={safeExamIndex}
                onChange={(e) => setSelectedExamIndex(Number(e.target.value))}
                style={S.select}
              >
                {Array.isArray(data.exams) &&
                  data.exams.map((ex, i) => (
                    <option value={i} key={ex.id}>
                      {ex.title} — {ex.date}
                    </option>
                  ))}
              </select>
              <div style={{ marginLeft: "auto", color: "#6b7882" }}>Average: {selectedExam?.average ?? "-"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {Array.isArray(selectedExam?.subjects) &&
                selectedExam.subjects.map((s) => (
                  <div
                    key={s.name}
                    style={{ padding: 12, borderRadius: 10, background: "#fff", boxShadow: "0 6px 18px rgba(8,18,30,0.04)" }}
                  >
                    <div style={{ fontWeight: 800 }}>{s.name}</div>
                    <div style={{ color: "#6b7882", fontSize: 13 }}>{s.remark}</div>
                    <div style={{ marginTop: 8, fontSize: 20, fontWeight: 900, color: "#2D5D7B" }}>{s.marks}</div>
                  </div>
                ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "#6b7882" }}>Tip: Click Export PDF to save the selected exam report.</div>
          </Glass>
        </div>

        {/* RIGHT COLUMN */}
        <div style={S.rightCol}>
          {/* Calendar */}
          <Glass style={{ marginTop: 16 }}>
            <div style={S.cardHeader}>
              <h3 style={S.cardTitle}>Calendar</h3>
              <div style={S.cardSmallMeta}>Click any day to view details</div>
            </div>
            <div style={S.calNav}>
              <button style={S.navBtn} onClick={goPrevMonth}>‹</button>
              <strong>{monthName(viewMonth)} {viewYear}</strong>
              <button style={S.navBtn} onClick={goNextMonth}>›</button>
              <button style={{ ...S.navBtn, marginLeft: 10 }} onClick={jumpToToday}>Today</button>
            </div>
            <div style={S.calendarGrid}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} style={S.calendarHeader}>{d}</div>
              ))}

              {monthMatrix.map((week, wi) =>
                week.map((dateObj, di) => {
                  const key = dateObj ? formatKey(dateObj) : `null-${wi}-${di}`;
                  const rec = dateObj ? recordFor(dateObj) : null; // returns null for future dates
                  const isToday = dateObj && sameDate(dateObj, today);

                  return (
                    <div
                      key={key}
                      style={{
                        ...S.calendarCell,
                        border: isToday ? "2px solid #2D5D7B" : "1px solid rgba(15,20,25,0.03)",
                        background: rec ? "#fff" : "transparent",
                        cursor: dateObj ? (dateObj <= today ? "pointer" : "default") : "default",
                      }}
                      onClick={() => {
                        if (dateObj && dateObj <= today) {
                          setSelectedDate(dateObj);
                          setDayModalOpen(true);
                        }
                      }}
                      title={dateObj ? (rec ? `${rec.attendance} • ${rec.performance}%` : dateObj.toDateString()) : ""}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 13, color: dateObj ? "#17202A" : "#c4c8cc" }}>{dateObj ? dateObj.getDate() : ""}</div>
                        {rec && <div style={S.dot(rec.performance)} />}
                      </div>
                      {rec && <div style={{ marginTop: 8, fontSize: 11, color: "#54606a" }}>{rec.performance}%</div>}
                    </div>
                  );
                })
              )}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#6b7882" }}>Click any past day (up to today) to view details. Future days show no data.</div>
          </Glass>

          {/* Parent feedback */}
          <Glass style={{ marginTop: 16 }}>
            <div style={S.cardHeader}>
              <h3 style={S.cardTitle}>Parent Feedback</h3>
              <div style={S.cardSmallMeta}>Share quick notes for the teacher</div>
            </div>
            <form onSubmit={handleFeedbackSubmit}>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Write feedback (e.g., 'Please focus on reading comprehension')" style={S.feedbackInput} />
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="submit" style={S.btn}>Send Feedback</button>
                <button type="button" style={{ ...S.btn, background: "#fff", color: "#2D5D7B", border: "1px solid #e4e7eb" }} onClick={() => { setFeedback(""); setFeedbackStatus(null); }}>Clear</button>
              </div>
              {feedbackStatus && <div style={{ marginTop: 10, color: feedbackStatus.ok ? "#0b7a3f" : "#b02a37" }}>{feedbackStatus.msg}</div>}
            </form>
          </Glass>
        </div>
      </div>

      {/* Day details modal */}
      {dayModalOpen && selectedDate && (
        <div style={S.modalOverlay} onClick={() => setDayModalOpen(false)}>
          <div style={S.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0 }}>{selectedDate.toDateString()}</h3>
                <div style={{ color: "#6b7882", fontSize: 13 }}>Details for the day</div>
              </div>
              <div>
                <button style={S.smallBtn} onClick={() => setDayModalOpen(false)}>Close</button>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              {(() => {
                const rec = recordFor(selectedDate);
                if (!rec) return <div style={{ padding: 12, color: "#6b7882" }}>No data available for this date.</div>;

                return (
                  <div>
                    <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
                      <div style={{ minWidth: 140 }}>
                        <div style={{ color: "#5b6b7a", fontSize: 13 }}>Attendance</div>
                        <div style={{ fontWeight: 800, fontSize: 18 }}>{rec.attendance}</div>
                      </div>
                      <div style={{ minWidth: 140 }}>
                        <div style={{ color: "#5b6b7a", fontSize: 13 }}>Performance</div>
                        <div style={{ fontWeight: 800, fontSize: 18 }}>{rec.performance}%</div>
                      </div>
                      <div style={{ minWidth: 140 }}>
                        <div style={{ color: "#5b6b7a", fontSize: 13 }}>Study hours</div>
                        <div style={{ fontWeight: 800, fontSize: 18 }}>{rec.studyHours} hrs</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <div style={{ color: "#5b6b7a", fontSize: 13 }}>Subject scores</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                        {Array.isArray(rec.subjects) && rec.subjects.map((s) => (
                          <div key={s.name} style={{ padding: 8, borderRadius: 8, background: "#fafbfc", display: "flex", justifyContent: "space-between" }}>
                            <div style={{ fontWeight: 700 }}>{s.name}</div>
                            <div style={{ color: "#2D5D7B", fontWeight: 800 }}>{s.score}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <div style={{ color: "#5b6b7a", fontSize: 13 }}>Teacher notes</div>
                      <div style={{ marginTop: 6, padding: 10, borderRadius: 8, background: "#fff" }}>{rec.notes || <span style={{ color: "#8b949a" }}>No notes for this day.</span>}</div>
                      <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                        <button style={S.btn} onClick={() => {
                          const key = formatKey(selectedDate);
                          const url = `/teacher/notes?date=${key}`;
                          window.open(url, "_blank");
                        }}>View classroom notes</button>
                        <button style={{ ...S.btn, background: "#fff", color: "#2D5D7B", border: "1px solid #e4e7eb" }} onClick={() => alert("Marked as reviewed (mock)")}>Mark reviewed</button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- Presentational helpers ---------------- */
const Glass = ({ children, style = {} }) => <div style={{ ...S.glassCard, ...style }}>{children}</div>;

/* ---------------- Mock generator (keeps previous pattern) ---------------- */
function generateMockMonthRecords() {
  const rec = {};
  const now = new Date();

  for (let mOffset = -1; mOffset <= 1; mOffset++) {
    const base = new Date(now.getFullYear(), now.getMonth() + mOffset, 1);
    const year = base.getFullYear();
    const month = base.getMonth();
    const last = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= last; d++) {
      

      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const performance = Math.max(40, Math.round(60 + (Math.sin(d) * 8) + (Math.random() * 18)));
      const studyHours = Math.round(Math.max(0, Math.random() * 3 + (performance / 100) * 2) * 10) / 10;

      rec[key] = {
        attendance: Math.random() > 0.08 ? (Math.random() > 0.1 ? "Present" : "Late") : "Absent",
        performance,
        studyHours,
        notes: Math.random() > 0.82 ? "Teacher: Good improvement in problem solving." : "",
        subjects: [
          { name: "Telugu", score: Math.min(100, performance + Math.round(Math.random() * 6)) },
          { name: "English", score: Math.min(100, performance + Math.round(Math.random() * 4 - 2)) },
          { name: "Hindi", score: Math.min(100, performance + Math.round(Math.random() * 3 - 4)) },
          { name: "Maths", score: Math.min(100, performance + Math.round(Math.random() * 8)) },
          { name: "Biology", score: Math.min(100, performance + Math.round(Math.random() * 4 - 1)) },
          { name: "History", score: Math.min(100, performance + Math.round(Math.random() * 2 - 6)) },
          { name: "Physics", score: Math.min(100, performance + Math.round(Math.random() * 5)) },
          { name: "Chemistry", score: Math.min(100, performance + Math.round(Math.random() * 3)) },
        ],
      };
    }
  }

  return rec;
}

/* ---------------- STYLES ---------------- */
const S = {
  pageWrap: {
    padding: 24,
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    color: "#17202A",
    background: "linear-gradient(180deg,#F7FAFC 0%, #F4F8FB 100%)",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  heading: { fontSize: 22, margin: 0, color: "#1f3644" },
  subtitle: { color: "#55636d", marginTop: 6, fontSize: 13 },
  headerActions: { display: "flex", gap: 8, alignItems: "center" },
  btn: { background: "#2D5D7B", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 600, boxShadow: "0 6px 18px rgba(45,93,123,0.12)" },
  exportBtn: { background: "#A62D69" },
  gridRoot: { display: "grid", gridTemplateColumns: "1fr 420px", gap: 22, alignItems: "start" },
  leftCol: { display: "flex", flexDirection: "column" },
  rightCol: { display: "flex", flexDirection: "column" },
  glassCard: { borderRadius: 14, padding: 14, background: "rgba(255,255,255,0.9)", boxShadow: "0 10px 30px rgba(25,40,50,0.06)", border: "1px solid rgba(23,32,40,0.04)" },
  kpiRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 10 },
  kpiTitle: { fontSize: 12, color: "#5b6b7a", fontWeight: 600 },
  kpiBig: { fontSize: 28, fontWeight: 800, color: "#2D5D7B", marginTop: 6 },
  kpiMeta: { fontSize: 12, color: "#7a8a92", marginTop: 6 },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardTitle: { margin: 0, fontSize: 16, color: "#17202A" },
  cardSmallMeta: { fontSize: 12, color: "#6b7882" },
  /* New row style for subjects */
  subjectRowWrap: { width: "100%" },
  subjectRowInner: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 10,
    background: "#fff",
    boxShadow: "0 6px 18px rgba(8,18,30,0.03)",
  },
  iconBox: { width: 40, height: 40, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 },
  subjectName: { fontSize: 15, fontWeight: 700, color: "#17202A" },
  select: { padding: "6px 8px", borderRadius: 8, border: "1px solid #e6eef6" },
  calendarGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 8 },
  calendarHeader: { fontSize: 12, color: "#6b7882", textAlign: "center", padding: "6px 4px" },
  calendarCell: { minHeight: 62, padding: 8, borderRadius: 8, background: "#fff" },
  dot: (perf) => ({ width: 10, height: 10, borderRadius: 6, background: perf >= 85 ? "#2D5D7B" : (perf >= 70 ? "#60a5fa" : "#f59e0b") }),
  smallBtn: { padding: "6px 10px", borderRadius: 8, border: "none", background: "#f3f6f8", cursor: "pointer" },
  /* calendar specific */
  calNav: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 },
  navBtn: { padding: "6px 10px", borderRadius: 8, border: "none", background: "#f3f6f8", cursor: "pointer" },
  calDay: { fontSize: 13, fontWeight: 700 },
  feedbackInput: { width: "100%", minHeight: 90, padding: 12, borderRadius: 8, border: "1px solid #e6eef6", resize: "vertical", fontSize: 14, fontFamily: "inherit" },
  loaderWrap: { padding: 32, textAlign: "center" },
  loader: { fontSize: 18, color: "#2D5D7B" },
  modalOverlay: { position: "fixed", left: 0, top: 0, right: 0, bottom: 0, background: "rgba(10,15,25,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 },
  modalCard: { width: "720px", maxWidth: "95%", background: "#fff", borderRadius: 12, padding: 18 },
};

export default Reports;

