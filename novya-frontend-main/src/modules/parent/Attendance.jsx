// import React, { useState, useEffect } from "react";

// import { Container, Row, Col, Card, Table, Badge, Button, ProgressBar } from "react-bootstrap";

// // Theme colors

// const themeColors = {

//   primary: "#2D5D7B",

//   success: "#28a745",

//   danger: "#FF245F",

//   secondary: "#6c757d",

//   text: "#333",

//   pinkStart: "#FFB6C1",

//   pinkEnd: "#FF1493",

// };

// // Threshold for short hours

// const shortHoursThreshold = 2;

// // Calculate hours between check-in and check-out

// const calculateHours = (checkIn, checkOut) => {

//   if (!checkIn || !checkOut) return 0;

//   const [h1, m1] = checkIn.split(":").map(Number);

//   const [h2, m2] = checkOut.split(":").map(Number);

//   const start = h1 + m1 / 60;

//   const end = h2 + m2 / 60;

//   return Math.max(0, end - start);

// };

// // Daily sessions data

// const dailySessions = [

//   { date: "2025-08-15", checkIn: "09:00", checkOut: "17:00", leave: false },

//   { date: "2025-08-16", checkIn: "10:00", checkOut: "11:30", leave: false },

//   { date: "2025-08-17", leave: true },

//   { date: "2025-08-18", checkIn: "09:15", checkOut: "13:15", leave: false },

//   { date: "2025-08-19", checkIn: "10:30", checkOut: "11:00", leave: false },

//   { date: "2025-08-20", checkIn: "09:00", checkOut: "15:00", leave: false },

//   { date: "2025-08-21", leave: true },

//   { date: "2025-08-22", checkIn: "08:45", checkOut: "14:00", leave: false },

//   { date: "2025-08-23", checkIn: "09:30", checkOut: "11:00", leave: false },

//   { date: "2025-08-24", leave: true },

//   { date: "2025-08-25", checkIn: "09:00", checkOut: "17:00", leave: false },

//   { date: "2025-08-26", checkIn: "10:00", checkOut: "11:30", leave: false },

//   { date: "2025-08-27", leave: true },

//   { date: "2025-08-28", checkIn: "09:15", checkOut: "13:15", leave: false },

//   { date: "2025-08-29", checkIn: "10:30", checkOut: "11:00", leave: false },

// ];

// // Compute stats

// const totalHours = dailySessions.reduce(

//   (sum, s) => sum + (s.leave ? 0 : calculateHours(s.checkIn, s.checkOut)),

//   0

// );

// const stats = {

//   totalDays: dailySessions.length,

//   presentDays: dailySessions.filter((s) => !s.leave).length,

//   leaveDays: dailySessions.filter((s) => s.leave).length,

//   totalHours: totalHours,

// };

// // Weekly data

// const getWeeklyData = (sessions) => {

//   const weeks = [];

//   for (let i = 0; i < sessions.length; i += 7) {

//     const weekSessions = sessions.slice(i, i + 7);

//     const presentDays = weekSessions.filter((s) => !s.leave).length;

//     const leaveDays = weekSessions.filter((s) => s.leave).length;

//     const totalHours = weekSessions.reduce(

//       (sum, s) => sum + (s.leave ? 0 : calculateHours(s.checkIn, s.checkOut)),

//       0

//     );

//     weeks.push({ presentDays, leaveDays, totalHours });

//   }

//   return weeks;

// };

// const Attendance = () => {

//   const [view, setView] = useState("daily");

//   const [showNotifications, setShowNotifications] = useState(false);

//   const [attendancePercent, setAttendancePercent] = useState(0);

//   useEffect(() => {

//     // Animate progress bar fill

//     const percent = (stats.presentDays / stats.totalDays) * 100;

//     let progress = 0;

//     const interval = setInterval(() => {

//       progress += 1;

//       if (progress >= percent) {

//         progress = percent;

//         clearInterval(interval);

//       }

//       setAttendancePercent(progress);

//     }, 15);

//     return () => clearInterval(interval);

//   }, []);

//   const notifications = dailySessions

//     .map((s) => {

//       if (s.leave) return { date: s.date, leave: true };

//       const hours = calculateHours(s.checkIn, s.checkOut);

//       if (hours < shortHoursThreshold) return { date: s.date, leave: false };

//       return null;

//     })

//     .filter(Boolean);

//   const weeklyData = getWeeklyData(dailySessions);

//   return (
// <Container fluid className="p-3">

//       {/* Attendance Progress */}
// <Card

//         className="mb-3 p-3 text-center"

//         style={{

//           borderRadius: "15px",

//           boxShadow: "0 4px 15px rgba(0,0,0,0.1)",

//         }}
// >
// <h5 style={{ color: themeColors.pinkEnd, fontWeight: "600" }}>Attendance Progress</h5>
// <div

//           style={{

//             height: "25px",

//             borderRadius: "12px",

//             backgroundColor: ' #e9eaf0ff ',

//             overflow: "hidden",

//             marginTop: "0.5rem",

//           }}
// >
// <div

//             style={{

//               width: `${attendancePercent}%`,

//               height: "100%",

//               background: `linear-gradient(90deg, ${themeColors.pinkStart}, ${themeColors.pinkEnd})`,

//               display: "flex",

//               alignItems: "center",

//               justifyContent: "center",

//               color: "white",

//               fontWeight: "600",

//               transition: "width 1s ease-in-out",

//               borderRadius: "12px",

//             }}
// >

//             {attendancePercent.toFixed(1)}%
// </div>
// </div>
// </Card>

//       {/* Stats Cards */}
// <Row className="g-3 mb-3">
// <Col xs={12} md>
// <Card className="p-3 text-center" style={{ backgroundColor: "rgba(45, 93, 123, 0.08)" }}>
// <div>Total Days</div>
// <div style={{ fontSize: "1.5rem", fontWeight: "700", color: themeColors.primary }}>

//               {stats.totalDays}
// </div>
// </Card>
// </Col>
// <Col xs={12} md>
// <Card className="p-3 text-center" style={{ backgroundColor: "rgba(40, 167, 69, 0.08)" }}>
// <div>Logged In Days</div>
// <div style={{ fontSize: "1.5rem", fontWeight: "700", color: themeColors.success }}>

//               {stats.presentDays}
// </div>
// </Card>
// </Col>
// <Col xs={12} md>
// <Card className="p-3 text-center" style={{ backgroundColor: "rgba(255,36,95,0.08)" }}>
// <div>Leave Days</div>
// <div style={{ fontSize: "1.5rem", fontWeight: "700", color: themeColors.danger }}>

//               {stats.leaveDays}
// </div>
// </Card>
// </Col>
// <Col xs={12} md>
// <Card className="p-3 text-center" style={{ backgroundColor: "rgba(108,117,125,0.08)" }}>
// <div>Total Hours</div>
// <div style={{ fontSize: "1.5rem", fontWeight: "700", color: themeColors.primary }}>

//               {stats.totalHours.toFixed(1)} hrs
// </div>
// </Card>
// </Col>
// </Row>

//       {/* Toggle + Notifications */}
// <Row className="mb-3 d-flex justify-content-between align-items-center">
// <Col>
// <Button variant={view === "daily" ? "primary" : "outline-primary"} onClick={() => setView("daily")} className="me-2">

//             Daily Log
// </Button>
// <Button variant={view === "weekly" ? "primary" : "outline-primary"} onClick={() => setView("weekly")}>

//             Weekly Log
// </Button>
// </Col>

//         {/* Notification Bell */}
// <Col xs="auto">
// <div style={{ position: "relative", cursor: "pointer" }}>


//             {showNotifications && notifications.length > 0 && (
// <Card

//                 style={{

//                   position: "absolute",

//                   top: "30px",

//                   right: "0",

//                   width: "250px",

//                   zIndex: 10,

//                   border: "1px solid #ff245f",

//                   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",

//                 }}
// >
// <Card.Body style={{ padding: "0.5rem" }}>
// <strong>Notifications</strong>

//                   {notifications.map((s, idx) => (
// <div

//                       key={idx}

//                       style={{

//                         padding: "0.5rem",

//                         borderBottom: idx !== notifications.length - 1 ? "1px solid #eee" : "none",

//                         fontSize: "0.9rem",

//                         color: themeColors.text,

//                       }}
// >

//                       {s.leave ? `${s.date} - Leave` : `${s.date} - Short Hours`}
// </div>

//                   ))}
// </Card.Body>
// </Card>

//             )}
// </div>
// </Col>
// </Row>

//       {/* Daily Table */}

//       {view === "daily" && (
// <>
// <h5 style={{ color: themeColors.primary, marginTop: "1rem" }}>Daily Log</h5>
// <Table striped bordered hover responsive>
// <thead>
// <tr>
// <th>Date</th>
// <th>Check-In</th>
// <th>Check-Out</th>
// <th>Hours</th>
// <th>Status</th>
// </tr>
// </thead>
// <tbody>

//               {dailySessions.map((s, idx) => {

//                 const hours = s.leave ? 0 : calculateHours(s.checkIn, s.checkOut);

//                 let badgeVariant = "secondary";

//                 let statusText = "Short";

//                 if (s.leave) {

//                   badgeVariant = "danger";

//                   statusText = "Leave";

//                 } else if (hours >= shortHoursThreshold) {

//                   badgeVariant = "success";

//                   statusText = "Normal";

//                 }

//                 return (
// <tr key={idx}>
// <td>{s.date}</td>
// <td>{s.leave ? "-" : s.checkIn}</td>
// <td>{s.leave ? "-" : s.checkOut}</td>
// <td>{s.leave ? "-" : hours.toFixed(1)}</td>
// <td>
// <Badge bg={badgeVariant} style={{ color: "white" }}>

//                         {statusText}
// </Badge>
// </td>
// </tr>

//                 );

//               })}
// </tbody>
// </Table>
// </>

//       )}

//       {/* Weekly Table */}

//       {view === "weekly" && (
// <>
// <h5 style={{ color: themeColors.primary, marginTop: "1rem" }}>Weekly Log</h5>
// <Table striped bordered hover responsive>
// <thead>
// <tr>
// <th>Week</th>
// <th>Days Present</th>
// <th>Days Leave</th>
// <th>Total Hours</th>
// </tr>
// </thead>
// <tbody>

//               {weeklyData.map((w, idx) => (
// <tr key={idx}>
// <td>Week {idx + 1}</td>
// <td>{w.presentDays}</td>
// <td>{w.leaveDays}</td>
// <td>{w.totalHours.toFixed(1)}</td>
// </tr>

//               ))}
// </tbody>
// </Table>
// </>

//       )}
// </Container>

//   );

// };

// export default Attendance;
 



 
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next"; // Import i18n translation hook
import '../../i18n'; // Correct import path to your i18n.js
 
// Theme colors
const themeColors = {
  primary: "#2D5D7B",
  success: "#28a745",
  danger: "#FF245F",
  secondary: "#6c757d",
  text: "#333",
  pinkStart: "#FFB6C1",
  pinkEnd: "#FF1493",
};
 
// Threshold for short hours
const shortHoursThreshold = 2;
 
// Calculate hours between check-in and check-out
const calculateHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const [h1, m1] = checkIn.split(":").map(Number);
  const [h2, m2] = checkOut.split(":").map(Number);
  const start = h1 + m1 / 60;
  const end = h2 + m2 / 60;
  return Math.max(0, end - start);
};
 
// Daily sessions data
const dailySessions = [
  { date: "2025-08-15", checkIn: "09:00", checkOut: "17:00", leave: false },
  { date: "2025-08-16", checkIn: "10:00", checkOut: "11:30", leave: false },
  { date: "2025-08-17", leave: true },
  { date: "2025-08-18", checkIn: "09:15", checkOut: "13:15", leave: false },
  { date: "2025-08-19", checkIn: "10:30", checkOut: "11:00", leave: false },
  { date: "2025-08-20", checkIn: "09:00", checkOut: "15:00", leave: false },
  { date: "2025-08-21", leave: true },
  { date: "2025-08-22", checkIn: "08:45", checkOut: "14:00", leave: false },
  { date: "2025-08-23", checkIn: "09:30", checkOut: "11:00", leave: false },
  { date: "2025-08-24", leave: true },
  { date: "2025-08-25", checkIn: "09:00", checkOut: "17:00", leave: false },
  { date: "2025-08-26", checkIn: "10:00", checkOut: "11:30", leave: false },
  { date: "2025-08-27", leave: true },
  { date: "2025-08-28", checkIn: "09:15", checkOut: "13:15", leave: false },
  { date: "2025-08-29", checkIn: "10:30", checkOut: "11:00", leave: false },
];
 
// Compute stats
const totalHours = dailySessions.reduce(
  (sum, s) => sum + (s.leave ? 0 : calculateHours(s.checkIn, s.checkOut)),
  0
);
 
const stats = {
  totalDays: dailySessions.length,
  presentDays: dailySessions.filter((s) => !s.leave).length,
  leaveDays: dailySessions.filter((s) => s.leave).length,
  totalHours: totalHours,
};
 
// Weekly data
const getWeeklyData = (sessions) => {
  const weeks = [];
  for (let i = 0; i < sessions.length; i += 7) {
    const weekSessions = sessions.slice(i, i + 7);
    const presentDays = weekSessions.filter((s) => !s.leave).length;
    const leaveDays = weekSessions.filter((s) => s.leave).length;
    const totalHours = weekSessions.reduce(
      (sum, s) => sum + (s.leave ? 0 : calculateHours(s.checkIn, s.checkOut)),
      0
    );
    weeks.push({ presentDays, leaveDays, totalHours });
  }
  return weeks;
};
 
const Attendance = () => {
  const { t } = useTranslation(); // Translation hook
  const [view, setView] = useState("daily");
  const [attendancePercent, setAttendancePercent] = useState(0);
 
  useEffect(() => {
    const percent = (stats.presentDays / stats.totalDays) * 100;
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      if (progress >= percent) {
        progress = percent;
        clearInterval(interval);
      }
      setAttendancePercent(progress);
    }, 15);
    return () => clearInterval(interval);
  }, []);
 
  const weeklyData = getWeeklyData(dailySessions);
 
  return (
    <Container fluid className="p-3">
      {/* Attendance Progress */}
      <Card
        className="mb-3 p-3 text-center"
        style={{ borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
      >
        <h5 style={{ color: themeColors.pinkEnd, fontWeight: "600" }}>
          {t("attendance_progress")}
        </h5>
        <div
          style={{
            height: "25px",
            borderRadius: "12px",
            backgroundColor: " #e9eaf0ff ",
            overflow: "hidden",
            marginTop: "0.5rem",
          }}
        >
          <div
            style={{
              width: `${attendancePercent}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${themeColors.pinkStart}, ${themeColors.pinkEnd})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "600",
              transition: "width 1s ease-in-out",
              borderRadius: "12px",
            }}
          >
            {attendancePercent.toFixed(1)}%
          </div>
        </div>
      </Card>
 
      {/* Stats Cards */}
      <Row className="g-3 mb-3">
        <Col xs={12} md>
          <Card className="p-3 text-center" style={{ backgroundColor: "rgba(45, 93, 123, 0.08)" }}>
            <div>{t("total_days")}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: themeColors.primary }}>
              {stats.totalDays}
            </div>
          </Card>
        </Col>
        <Col xs={12} md>
          <Card className="p-3 text-center" style={{ backgroundColor: "rgba(40, 167, 69, 0.08)" }}>
            <div>{t("logged_in_days")}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: themeColors.success }}>
              {stats.presentDays}
            </div>
          </Card>
        </Col>
        <Col xs={12} md>
          <Card className="p-3 text-center" style={{ backgroundColor: "rgba(255,36,95,0.08)" }}>
            <div>{t("leave_days")}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: themeColors.danger }}>
              {stats.leaveDays}
            </div>
          </Card>
        </Col>
        <Col xs={12} md>
          <Card className="p-3 text-center" style={{ backgroundColor: "rgba(108,117,125,0.08)" }}>
            <div>{t("total_hours")}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: themeColors.primary }}>
              {stats.totalHours.toFixed(1)} {t("hours")}
            </div>
          </Card>
        </Col>
      </Row>
 
      {/* Toggle Buttons */}
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <Button
            variant={view === "daily" ? "primary" : "outline-primary"}
            onClick={() => setView("daily")}
            className="me-2"
          >
            {t("daily_log")}
          </Button>
          <Button variant={view === "weekly" ? "primary" : "outline-primary"} onClick={() => setView("weekly")}>
            {t("weekly_log")}
          </Button>
        </Col>
      </Row>
 
      {/* Daily Table */}
      {view === "daily" && (
        <>
          <h5 style={{ color: themeColors.primary, marginTop: "1rem" }}>{t("daily_log")}</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t("date")}</th>
                <th>{t("check_in")}</th>
                <th>{t("check_out")}</th>
                <th>{t("hours")}</th>
                <th>{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {dailySessions.map((s, idx) => {
                const hours = s.leave ? 0 : calculateHours(s.checkIn, s.checkOut);
                let badgeVariant = "secondary";
                let statusText = t("short");
 
                if (s.leave) {
                  badgeVariant = "danger";
                  statusText = t("leave");
                } else if (hours >= shortHoursThreshold) {
                  badgeVariant = "success";
                  statusText = t("normal");
                }
 
                return (
                  <tr key={idx}>
                    <td>{s.date}</td>
                    <td>{s.leave ? "-" : s.checkIn}</td>
                    <td>{s.leave ? "-" : s.checkOut}</td>
                    <td>{s.leave ? "-" : hours.toFixed(1)}</td>
                    <td>
                      <Badge bg={badgeVariant} style={{ color: "white" }}>
                        {statusText}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
 
      {/* Weekly Table */}
      {view === "weekly" && (
        <>
          <h5 style={{ color: themeColors.primary, marginTop: "1rem" }}>{t("weekly_log")}</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t("week")}</th>
                <th>{t("days_present")}</th>
                <th>{t("days_leave")}</th>
                <th>{t("total_hours")}</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((w, idx) => (
                <tr key={idx}>
                  <td>{t("week")} {idx + 1}</td>
                  <td>{w.presentDays}</td>
                  <td>{w.leaveDays}</td>
                  <td>{w.totalHours.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};
 
export default Attendance;
 
 