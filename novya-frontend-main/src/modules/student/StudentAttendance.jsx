import React, { useMemo, useState } from "react";
import "./studentAttendance.css";
import {
  FaCalendarAlt,
  FaUserCheck,
  FaUserTimes,
  FaClock,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// Helpers
const getDaysInMonth = (month, year) =>
  new Date(year, month + 1, 0).getDate();

const makeDateString = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const getWeekOfMonth = (dateStr) =>
  Math.ceil(new Date(dateStr).getDate() / 7);

const formatFullDateLabel = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    weekday: "long",
  });
};

const StudentAttendance = () => {
  const today = new Date(2025, 11, 2);
  const [selectedView, setSelectedView] = useState("daily");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [selectedWeek, setSelectedWeek] = useState(1);

  const TOTAL_DAYS = getDaysInMonth(selectedMonth, selectedYear);

  // MOCK API
  const apiResponse = {
    studentId: 1,
    name: "John Doe",
    email: "john@example.com",
    className: "Class 7A",
    attendance: [
      { date: "2025-12-01", status: "Present", hours: 8 },
      { date: "2025-12-02", status: "Absent", hours: 0 },
      { date: "2025-12-03", status: "Late", hours: 6.5 },
      { date: "2025-12-04", status: "Present", hours: 8 },
      { date: "2025-12-05", status: "Present", hours: 7.9 },
    ],
  };

  const { name, email, className, attendance } = apiResponse;

  // Build month records
  const fullMonthRecords = useMemo(() => {
    const list = [];
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      const dateStr = makeDateString(selectedYear, selectedMonth, d);
      const found = attendance.find((r) => r.date === dateStr);
      list.push(
        found || {
          date: dateStr,
          status: "Not Marked",
          hours: 0,
        }
      );
    }
    return list;
  }, [attendance, TOTAL_DAYS, selectedMonth, selectedYear]);

  // Daily record
  const selectedKey = makeDateString(
    selectedYear,
    selectedMonth,
    selectedDate.getDate()
  );
  const dailyRecord = attendance.find((r) => r.date === selectedKey) || null;

  // Summary cards
  const present = fullMonthRecords.filter((r) => r.status === "Present").length;
  const absent = fullMonthRecords.filter((r) => r.status === "Absent").length;
  const late = fullMonthRecords.filter((r) => r.status === "Late").length;
  const summary = [
    { label: "PRESENT", value: present, color: "#D1FAE5", textColor: "#059669", status: "Present", icon: <FaUserCheck /> },
    { label: "ABSENT", value: absent, color: "#FEE2E2", textColor: "#DC2626", status: "Absent", icon: <FaUserTimes /> },
    { label: "LATE", value: late, color: "#FEF3C7", textColor: "#D97706", status: "Late", icon: <FaClock /> },
    { label: "TOTAL DAYS", value: TOTAL_DAYS, color: "#E5E7EB", textColor: "#374151", status: null, icon: <FaUsers /> },
  ];

  // Filtered list when clicking card
  const filteredByStatus =
    selectedStatus !== null
      ? fullMonthRecords.filter((r) => r.status === selectedStatus)
      : [];

  // Weekly calc
  const weeklyStats = useMemo(() => {
    return [1, 2, 3, 4, 5].map((week) => {
      const set = fullMonthRecords.filter(
        (r) => getWeekOfMonth(r.date) === week
      );
      if (!set.length)
        return { week, present: 0, absent: 0, late: 0, percent: 0 };
      const p = set.filter((r) => r.status === "Present").length;
      const a = set.filter((r) => r.status === "Absent").length;
      const l = set.filter((r) => r.status === "Late").length;
      const total = p + a + l;
      return {
        week,
        present: p,
        absent: a,
        late: l,
        percent: total ? Math.round((p / total) * 100) : 0,
      };
    });
  }, [fullMonthRecords]);

  const weeklyRecords = fullMonthRecords.filter(
    (r) => getWeekOfMonth(r.date) === selectedWeek
  );

  // Monthly summary
  const monthlyOverview = useMemo(() => {
    const p = fullMonthRecords.filter((r) => r.status === "Present").length;
    const a = fullMonthRecords.filter((r) => r.status === "Absent").length;
    const l = fullMonthRecords.filter((r) => r.status === "Late").length;
    const total = p + a + l;
    return {
      present: p,
      absent: a,
      late: l,
      percent: total ? Math.round((p / total) * 100) : 0,
    };
  }, [fullMonthRecords]);

  // Change month (calendar)
  const changeMonth = (dir) => {
    let m = calendarMonth + dir;
    let y = calendarYear;
    if (m < 0) {
      m = 11;
      y--;
    } else if (m > 11) {
      m = 0;
      y++;
    }
    setCalendarMonth(m);
    setCalendarYear(y);
    // UPDATE sheet month
    setSelectedMonth(m);
    setSelectedYear(y);
  };

  return (
    <div className="student-attendance-container">
      <h1 className="attendance-title">Student Attendance</h1>
      <p className="attendance-subtitle">
        {name} • {className} • {email}
      </p>

      {/* VIEW SWITCH */}
      <div className="view-selector">
        {["daily", "weekly", "monthly"].map((v) => (
          <button
            key={v}
            className={selectedView === v ? "active" : ""}
            onClick={() => {
              setSelectedView(v);
              setSelectedStatus(null);
            }}
          >
            {v.toUpperCase()} View
          </button>
        ))}
      </div>

      {/* SUMMARY CARDS */}
      <div className="summary-cards">
        {summary.map((item, i) => (
          <div
            key={i}
            className="summary-card"
            style={{ backgroundColor: item.color }}
            onClick={() =>
              item.status
                ? setSelectedStatus(
                    selectedStatus === item.status ? null : item.status
                  )
                : setSelectedStatus(null)
            }
          >
            <div className="summary-icon">{item.icon}</div>
            <h2 style={{ color: item.textColor }}>{item.value}</h2>
            <p style={{ color: item.textColor }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* STATUS LIST WHEN CARD CLICKED */}
      {selectedStatus && (
        <div className="status-list-box">
          <h3>{selectedStatus} Days ({filteredByStatus.length})</h3>
          {filteredByStatus.map((rec, i) => (
            <div key={i} className="status-row">
              <strong>{formatFullDateLabel(rec.date)}</strong>
            </div>
          ))}
        </div>
      )}

      {/* DAILY VIEW */}
      {selectedView === "daily" && (
        <>
          <div className="date-header">
            <div>
              <h2 className="selected-date">
                {selectedDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
              <p className="day-text">
                {selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
              </p>
            </div>
            <div className="calendar-wrapper">
              <button
                className="date-picker-btn"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <FaCalendarAlt />
                <span>{selectedDate.toLocaleDateString("en-GB")}</span>
              </button>
              {showCalendar && (
                <div className="calendar-dropdown-container">
                  <div className="calendar-header">
                    <button onClick={() => changeMonth(-1)}>
                      <FaChevronLeft />
                    </button>
                    <span>
                      {new Date(calendarYear, calendarMonth).toLocaleString(
                        "en-US",
                        { month: "long", year: "numeric" }
                      )}
                    </span>
                    <button onClick={() => changeMonth(1)}>
                      <FaChevronRight />
                    </button>
                  </div>
                  <div className="calendar-grid">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
                      <div key={d} className="calendar-grid-header">
                        {d}
                      </div>
                    ))}
                    {Array.from({
                      length:
                        (new Date(calendarYear, calendarMonth, 1).getDay() ||
                          7) - 1,
                    }).map((_, idx) => (
                      <div key={idx}></div>
                    ))}
                    {Array.from({
                      length: getDaysInMonth(calendarMonth, calendarYear),
                    }).map((_, i) => {
                      const d = i + 1;
                      const dateObj = new Date(calendarYear, calendarMonth, d);
                      return (
                        <div
                          key={d}
                          className="calendar-day"
                          onClick={() => {
                            setSelectedDate(dateObj);
                            setSelectedMonth(calendarMonth);
                            setSelectedYear(calendarYear);
                            setShowCalendar(false);
                          }}
                        >
                          {d}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* ATTENDANCE SHEET */}
          <div className="attendance-sheet-box">
            <h2 className="sheet-title">Attendance Sheet</h2>
            <div className="attendance-sheet-grid">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="sheet-day-header">
                  {d}
                </div>
              ))}
              {Array.from({
                length:
                  (new Date(selectedYear, selectedMonth, 1).getDay() || 7) - 1,
              }).map((_, idx) => (
                <div key={idx} className="sheet-cell empty"></div>
              ))}
              {fullMonthRecords.map((rec, idx) => {
                const dateObj = new Date(rec.date);
                const dayNum = dateObj.getDate();
                return (
                  <div
                    key={idx}
                    className={`sheet-cell ${
                      rec.status === "Present"
                        ? "present"
                        : rec.status === "Absent"
                        ? "absent"
                        : rec.status === "Late"
                        ? "late"
                        : ""
                    }`}
                    title={formatFullDateLabel(rec.date)}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>
          </div>
          {/* DAILY TABLE WITHOUT CHECKIN/CHECKOUT */}
          <div className="monthly-table-box">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Status</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {dailyRecord ? (
                  <tr>
                    <td>{new Date(dailyRecord.date).toLocaleDateString("en-GB")}</td>
                    <td>{new Date(dailyRecord.date).toLocaleDateString("en-US", { weekday: "long" })}</td>
                    <td className={dailyRecord.status.toLowerCase()}>
                      {dailyRecord.status}
                    </td>
                    <td>{dailyRecord.hours}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>
                      No data for this date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* WEEKLY VIEW */}
      {selectedView === "weekly" && (
        <>
          <h2 className="report-title">Weekly Overview</h2>
          <div className="weekly-grid">
            {weeklyStats.map((w) => (
              <div
                key={w.week}
                className="weekly-card"
                onClick={() => setSelectedWeek(w.week)}
              >
                <div className="weekly-percent">{w.percent}%</div>
                <h3>Week {w.week}</h3>
                <p><strong>{w.present}</strong> Present</p>
                <p><strong>{w.absent}</strong> Absent</p>
                <p><strong>{w.late}</strong> Late</p>
                <div className="weekly-bar">
                  <div
                    className="weekly-progress"
                    style={{ width: `${w.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="monthly-table-box">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Status</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {weeklyRecords.map((rec, i) => (
                  <tr key={i}>
                    <td>{new Date(rec.date).toLocaleDateString("en-GB")}</td>
                    <td>{new Date(rec.date).toLocaleDateString("en-US", { weekday: "long" })}</td>
                    <td className={rec.status.toLowerCase()}>{rec.status}</td>
                    <td>{rec.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MONTHLY VIEW */}
      {selectedView === "monthly" && (
        <>
          <h2 className="report-title">Monthly Overview</h2>
          <div className="weekly-grid">
            <div className="weekly-card">
              <div className="weekly-percent">{monthlyOverview.percent}%</div>
              <h3>Monthly Performance</h3>
              <p><strong>{monthlyOverview.present}</strong> Present</p>
              <p><strong>{monthlyOverview.absent}</strong> Absent</p>
              <p><strong>{monthlyOverview.late}</strong> Late</p>
              <div className="weekly-bar">
                <div
                  className="weekly-progress"
                  style={{ width: `${monthlyOverview.percent}%` }}
                ></div>
              </div>
            </div>
          </div>
          {/* MONTHLY ATTENDANCE SHEET */}
          <div className="attendance-sheet-box">
            <h2 className="sheet-title">Attendance Sheet</h2>
            <div className="attendance-sheet-grid">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="sheet-day-header">
                  {d}
                </div>
              ))}
              {/* Empty start cells */}
              {Array.from({
                length:
                  (new Date(selectedYear, selectedMonth, 1).getDay() || 7) - 1,
              }).map((_, idx) => (
                <div key={"blank" + idx} className="sheet-cell empty"></div>
              ))}
              {/* Days */}
              {fullMonthRecords.map((rec, idx) => {
                const dateObj = new Date(rec.date);
                const dayNum = dateObj.getDate();
                return (
                  <div
                    key={idx}
                    className={`sheet-cell ${
                      rec.status === "Present"
                        ? "present"
                        : rec.status === "Absent"
                        ? "absent"
                        : rec.status === "Late"
                        ? "late"
                        : ""
                    }`}
                    title={formatFullDateLabel(rec.date)}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>
          </div>
          {/* MONTHLY TABLE */}
          <div className="monthly-table-box">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Status</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {fullMonthRecords.map((rec, index) => (
                  <tr key={index}>
                    <td>{new Date(rec.date).toLocaleDateString("en-GB")}</td>
                    <td>
                      {new Date(rec.date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </td>
                    <td className={rec.status.toLowerCase()}>{rec.status}</td>
                    <td>{rec.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentAttendance;

