import React, { useState, useEffect } from 'react';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get current week number
  function getCurrentWeek() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  // Generate dates for weekly view
  function getWeekDates(weekNumber) {
    const year = new Date().getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const daysToAdd = (weekNumber - 1) * 7;
    const startDate = new Date(firstDayOfYear);
    startDate.setDate(firstDayOfYear.getDate() + daysToAdd - firstDayOfYear.getDay());
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }

  // Enhanced student data
  const studentDetailsData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com' },
    { id: 6, name: 'Emma Davis', email: 'emma@example.com' },
    { id: 7, name: 'Alex Miller', email: 'alex@example.com' },
    { id: 8, name: 'Lisa Garcia', email: 'lisa@example.com' },
    { id: 9, name: 'Kevin Martinez', email: 'kevin@example.com' },
    { id: 10, name: 'Amy Robinson', email: 'amy@example.com' }
  ];

  // Mock data for attendance management
  useEffect(() => {
    const classes = ['Class 7A', 'Class 8B', 'Class 9A', 'Class 7B', 'Class 10A', 'Class 7C', 'Class 8A', 'Class 9B', 'Class 10B'];
    const statusOptions = ['present', 'absent', 'late'];
    
    const mockStudents = studentDetailsData.map((student, index) => {
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      let checkIn, checkOut, hours;
      
      switch (randomStatus) {
        case 'present':
          checkIn = '09:00';
          checkOut = '17:00';
          hours = 8.0;
          break;
        case 'late':
          checkIn = '10:30';
          checkOut = '17:00';
          hours = 6.5;
          break;
        case 'absent':
          checkIn = '-';
          checkOut = '-';
          hours = 0;
          break;
        default:
          checkIn = '09:00';
          checkOut = '17:00';
          hours = 8.0;
      }
      
      return {
        id: student.id,
        name: student.name,
        email: student.email,
        class: classes[index % classes.length],
        status: randomStatus,
        checkIn: checkIn,
        checkOut: checkOut,
        hours: hours
      };
    });
    
    setStudents(mockStudents);
  }, []);

  const handleStatusChange = (studentId, status) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { 
            ...student, 
            status,
            checkIn: status === 'present' ? '09:00' : (status === 'late' ? '10:30' : '-'),
            checkOut: status === 'present' ? '17:00' : (status === 'late' ? '17:00' : '-'),
            hours: status === 'present' ? 8.0 : (status === 'late' ? 6.5 : 0)
          }
        : student
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#3CB371';
      case 'absent': return '#DC3545';
      case 'late': return '#FFA500';
      default: return '#B0BEC5';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      default: return 'Not Marked';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateFull = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Export to CSV (Excel-compatible format)
  const exportToExcel = () => {
    // CSV files can be opened in Excel, so we use CSV export
    exportToCSV();
  };

  // Fallback CSV export
  const exportToCSV = () => {
    const headers = ['Student Name', 'Email', 'Class', 'Status', 'Check-In', 'Check-Out', 'Hours', 'Date'];
    const csvData = students.map(student => [
      student.name,
      student.email,
      student.class,
      getStatusText(student.status),
      student.checkIn,
      student.checkOut,
      student.hours,
      getFullDate(selectedDate)
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${selectedDate.replace(/-/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveAttendance = () => {
    const data = {
      date: selectedDate,
      timestamp: new Date().toISOString(),
      students: students,
      summary: {
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        total: students.length
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_backup_${selectedDate.replace(/-/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Attendance data saved successfully!');
  };

  // Statistics
  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const lateCount = students.filter(s => s.status === 'late').length;

  // Weekly dates
  const weekDates = getWeekDates(selectedWeek);
  
  // Generate weekly attendance data
  const weeklyAttendanceData = students.map(student => {
    const weekData = {};
    const dailyHours = {};
    weekDates.forEach(date => {
      const randomStatus = ['present', 'absent', 'late'][Math.floor(Math.random() * 3)];
      weekData[date] = randomStatus;
      dailyHours[date] = randomStatus === 'present' ? 8 : (randomStatus === 'late' ? 6.5 : 0);
    });
    
    const presentDays = Object.values(weekData).filter(status => status === 'present').length;
    const lateDays = Object.values(weekData).filter(status => status === 'late').length;
    const totalHours = Object.values(dailyHours).reduce((sum, hours) => sum + hours, 0);
    const weeklyPercentage = Math.round((presentDays / 7) * 100);
    
    return {
      ...student,
      weekData,
      dailyHours,
      weeklyPercentage,
      presentDays,
      lateDays,
      totalHours
    };
  });

  // Monthly data with real calculations
  const monthlyData = students.map(student => {
    const presentDays = Math.floor(Math.random() * 15) + 10;
    const absentDays = Math.floor(Math.random() * 5);
    const lateDays = Math.floor(Math.random() * 3);
    const totalDays = presentDays + absentDays + lateDays;
    const percentage = Math.round((presentDays / totalDays) * 100);
    const totalHours = presentDays * 8 + lateDays * 6.5;
    
    return {
      ...student,
      monthlyStats: {
        present: presentDays,
        absent: absentDays,
        late: lateDays,
        percentage: percentage,
        totalHours: totalHours,
        totalDays: totalDays
      }
    };
  });

  // Monthly summary for cards
  const monthlySummary = [
    { 
      week: 'Week 1', 
      present: monthlyData.reduce((sum, student) => sum + Math.min(5, student.monthlyStats.present), 0),
      absent: monthlyData.reduce((sum, student) => sum + Math.min(2, student.monthlyStats.absent), 0),
      late: monthlyData.reduce((sum, student) => sum + Math.min(1, student.monthlyStats.late), 0),
      percentage: Math.round(monthlyData.reduce((sum, student) => sum + student.monthlyStats.percentage, 0) / monthlyData.length)
    },
    { 
      week: 'Week 2', 
      present: monthlyData.reduce((sum, student) => sum + Math.min(4, student.monthlyStats.present - 3), 0),
      absent: monthlyData.reduce((sum, student) => sum + Math.min(3, student.monthlyStats.absent), 0),
      late: monthlyData.reduce((sum, student) => sum + Math.min(2, student.monthlyStats.late), 0),
      percentage: Math.round(monthlyData.reduce((sum, student) => sum + (student.monthlyStats.percentage - 5), 0) / monthlyData.length)
    },
    { 
      week: 'Week 3', 
      present: monthlyData.reduce((sum, student) => sum + Math.min(5, student.monthlyStats.present - 6), 0),
      absent: monthlyData.reduce((sum, student) => sum + Math.min(1, student.monthlyStats.absent), 0),
      late: monthlyData.reduce((sum, student) => sum + Math.min(2, student.monthlyStats.late), 0),
      percentage: Math.round(monthlyData.reduce((sum, student) => sum + (student.monthlyStats.percentage + 3), 0) / monthlyData.length)
    },
    { 
      week: 'Week 4', 
      present: monthlyData.reduce((sum, student) => sum + Math.min(4, student.monthlyStats.present - 9), 0),
      absent: monthlyData.reduce((sum, student) => sum + Math.min(2, student.monthlyStats.absent), 0),
      late: monthlyData.reduce((sum, student) => sum + Math.min(1, student.monthlyStats.late), 0),
      percentage: Math.round(monthlyData.reduce((sum, student) => sum + student.monthlyStats.percentage, 0) / monthlyData.length)
    }
  ];

  // Daily View Component
  const DailyView = () => (
    <div>
      <div style={styles.dateHeader}>
        <div style={styles.dateInfo}>
          <h3 style={styles.dateTitle}>
            {formatDate(selectedDate)}
          </h3>
          <p style={styles.dayName}>{getDayName(selectedDate)}</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.dateInput}
        />
      </div>

      <div style={styles.tableContainer}>
        {isMobile ? (
          // Mobile View
          <div style={styles.mobileTable}>
            {students.map(student => (
              <div key={student.id} style={styles.mobileCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.avatar}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={styles.studentInfo}>
                    <div style={styles.studentName}>{student.name}</div>
                    <div style={styles.studentEmail}>{student.email}</div>
                    <div style={styles.studentClass}>{student.class}</div>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(student.status)
                  }}>
                    {getStatusText(student.status)}
                  </span>
                </div>
                
                <div style={styles.cardDetails}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Check-In:</span>
                    <span style={styles.detailValue}>{student.checkIn}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Check-Out:</span>
                    <span style={styles.detailValue}>{student.checkOut}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Hours:</span>
                    <span style={styles.detailValue}>{student.hours}</span>
                  </div>
                </div>
                
                <div style={styles.cardActions}>
                  <select
                    value={student.status}
                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                    style={styles.statusSelect}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop Table
          <table style={styles.desktopTable}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Class</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Check-In</th>
                <th style={styles.th}>Check-Out</th>
                <th style={styles.th}>Hours</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div style={styles.nameCell}>
                      <div style={styles.avatar}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={styles.nameInfo}>
                        <div style={styles.name}>{student.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{student.email}</td>
                  <td style={styles.td}>{student.class}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(student.status)
                    }}>
                      {getStatusText(student.status)}
                    </span>
                  </td>
                  <td style={styles.td}>{student.checkIn}</td>
                  <td style={styles.td}>{student.checkOut}</td>
                  <td style={styles.td}>{student.hours}</td>
                  <td style={styles.td}>
                    <select
                      value={student.status}
                      onChange={(e) => handleStatusChange(student.id, e.target.value)}
                      style={styles.statusSelect}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // Weekly View Component with Enhanced Details
  const WeeklyView = () => (
    <div>
      <div style={styles.dateHeader}>
        <div>
          <h3 style={styles.dateTitle}>Week {selectedWeek} - {new Date().getFullYear()}</h3>
          <p style={styles.weekRange}>
            {formatDateFull(weekDates[0])} - {formatDateFull(weekDates[6])}
          </p>
        </div>
        <div style={styles.weekControls}>
          <button 
            style={styles.weekNavButton}
            onClick={() => setSelectedWeek(prev => Math.max(1, prev - 1))}
          >
            ← Previous Week
          </button>
          <button 
            style={styles.weekNavButton}
            onClick={() => setSelectedWeek(prev => prev + 1)}
          >
            Next Week →
          </button>
        </div>
      </div>

      {/* Weekly Overview Cards */}
      <div style={{
        ...styles.monthlyStats,
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))'
      }}>
        {weekDates.map((date, index) => {
          const dayStudents = weeklyAttendanceData.filter(student => 
            student.weekData[date] === 'present'
          ).length;
          const absentStudents = weeklyAttendanceData.filter(student => 
            student.weekData[date] === 'absent'
          ).length;
          const lateStudents = weeklyAttendanceData.filter(student => 
            student.weekData[date] === 'late'
          ).length;
          const percentage = Math.round((dayStudents / students.length) * 100);

          return (
            <div key={index} style={styles.monthCard}>
              <div style={styles.monthCardHeader}>
                <div>
                  <h4 style={styles.monthCardTitle}>{formatDate(date)}</h4>
                  <p style={styles.dayNameSmall}>{getDayName(date)}</p>
                </div>
                <span style={styles.percentageBadge}>
                  {percentage}%
                </span>
              </div>
              <div style={styles.monthCardStats}>
                <div style={styles.monthStat}>
                  <span style={styles.monthStatNumber}>{dayStudents}</span>
                  <span style={styles.monthStatLabel}>Present</span>
                </div>
                <div style={styles.monthStat}>
                  <span style={styles.monthStatNumber}>{absentStudents}</span>
                  <span style={styles.monthStatLabel}>Absent</span>
                </div>
                <div style={styles.monthStat}>
                  <span style={styles.monthStatNumber}>{lateStudents}</span>
                  <span style={styles.monthStatLabel}>Late</span>
                </div>
              </div>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${percentage}%`,
                    backgroundColor: percentage >= 80 ? '#3CB371' : percentage >= 60 ? '#FFA500' : '#DC3545'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Student Details Table */}
      <div style={styles.tableContainer}>
        <h4 style={styles.sectionTitle}>Weekly Student Attendance Details</h4>
        {isMobile ? (
          <div style={styles.mobileTable}>
            {weeklyAttendanceData.map(student => (
              <div key={student.id} style={styles.mobileCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.avatar}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={styles.studentInfo}>
                    <div style={styles.studentName}>{student.name}</div>
                    <div style={styles.studentEmail}>{student.email}</div>
                    <div style={styles.studentClass}>{student.class}</div>
                  </div>
                  <span style={styles.percentageBadge}>
                    {student.weeklyPercentage}%
                  </span>
                </div>
                <div style={styles.weekDaysGrid}>
                  {weekDates.map((date, index) => (
                    <div key={index} style={styles.weekDayIndicator}>
                      <span style={styles.weekDayLabel}>{formatDate(date)}</span>
                      <span style={{
                        ...styles.statusDot,
                        backgroundColor: getStatusColor(student.weekData[date])
                      }}></span>
                    </div>
                  ))}
                </div>
                <div style={styles.weekSummary}>
                  <span>Present: {student.presentDays}/7 days</span>
                  <span>Late: {student.lateDays} days</span>
                  <span style={styles.percentageText}>{student.weeklyPercentage}%</span>
                  <span>Total Hours: {student.totalHours}h</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table style={styles.desktopTable}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Class</th>
                {weekDates.map((date, index) => (
                  <th key={index} style={styles.th}>
                    {formatDate(date)}
                  </th>
                ))}
                <th style={styles.th}>Present</th>
                <th style={styles.th}>Late</th>
                <th style={styles.th}>Total Hours</th>
                <th style={styles.th}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {weeklyAttendanceData.map(student => (
                <tr key={student.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div style={styles.nameCell}>
                      <div style={styles.avatar}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={styles.nameInfo}>
                        <div style={styles.name}>{student.name}</div>
                        <div style={styles.email}>{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{student.class}</td>
                  {weekDates.map((date, index) => (
                    <td key={index} style={styles.td}>
                      <span style={{
                        ...styles.smallStatusBadge,
                        backgroundColor: getStatusColor(student.weekData[date])
                      }}>
                        {student.weekData[date].charAt(0).toUpperCase()}
                      </span>
                    </td>
                  ))}
                  <td style={styles.td}>
                    <strong>{student.presentDays}/7</strong>
                  </td>
                  <td style={styles.td}>
                    <span style={{ color: '#FFA500', fontWeight: 'bold' }}>
                      {student.lateDays}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <strong>{student.totalHours}h</strong>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      color: student.weeklyPercentage >= 80 ? '#3CB371' : 
                             student.weeklyPercentage >= 60 ? '#FFA500' : '#DC3545',
                      fontWeight: 'bold'
                    }}>
                      {student.weeklyPercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // Monthly View Component with Enhanced Details
  const MonthlyView = () => (
    <div>
      <div style={styles.dateHeader}>
        <h3 style={styles.dateTitle}>
          {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={styles.dateInput}
        />
      </div>

      {/* Monthly Overview Cards */}
      <div style={{
        ...styles.monthlyStats,
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))'
      }}>
        {monthlySummary.map((week, index) => (
          <div key={index} style={styles.monthCard}>
            <div style={styles.monthCardHeader}>
              <h4 style={styles.monthCardTitle}>{week.week}</h4>
              <span style={styles.percentageBadge}>{week.percentage}%</span>
            </div>
            <div style={styles.monthCardStats}>
              <div style={styles.monthStat}>
                <span style={styles.monthStatNumber}>{week.present}</span>
                <span style={styles.monthStatLabel}>Present</span>
              </div>
              <div style={styles.monthStat}>
                <span style={styles.monthStatNumber}>{week.absent}</span>
                <span style={styles.monthStatLabel}>Absent</span>
              </div>
              <div style={styles.monthStat}>
                <span style={styles.monthStatNumber}>{week.late}</span>
                <span style={styles.monthStatLabel}>Late</span>
              </div>
            </div>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${week.percentage}%`,
                  backgroundColor: week.percentage >= 80 ? '#3CB371' : 
                                 week.percentage >= 60 ? '#FFA500' : '#DC3545'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Student Details Table */}
      <div style={styles.tableContainer}>
        <h4 style={styles.sectionTitle}>Monthly Student Performance Report</h4>
        {isMobile ? (
          <div style={styles.mobileTable}>
            {monthlyData.map(student => (
              <div key={student.id} style={styles.mobileCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.avatar}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={styles.studentInfo}>
                    <div style={styles.studentName}>{student.name}</div>
                    <div style={styles.studentEmail}>{student.email}</div>
                    <div style={styles.studentClass}>{student.class}</div>
                  </div>
                  <span style={styles.percentageBadge}>
                    {student.monthlyStats.percentage}%
                  </span>
                </div>
                <div style={styles.monthlyStatsGrid}>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Present Days:</span>
                    <span style={styles.statValue}>{student.monthlyStats.present}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Absent Days:</span>
                    <span style={styles.statValue}>{student.monthlyStats.absent}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Late Days:</span>
                    <span style={styles.statValue}>{student.monthlyStats.late}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Total Days:</span>
                    <span style={styles.statValue}>{student.monthlyStats.totalDays}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Total Hours:</span>
                    <span style={styles.statValue}>{student.monthlyStats.totalHours}h</span>
                  </div>
                </div>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${student.monthlyStats.percentage}%`,
                      backgroundColor: student.monthlyStats.percentage >= 80 ? '#3CB371' : 
                                     student.monthlyStats.percentage >= 60 ? '#FFA500' : '#DC3545'
                    }}
                  ></div>
                </div>
                <div style={styles.performanceRating}>
                  <span style={styles.performanceText}>
                    Performance: {student.monthlyStats.percentage >= 80 ? 'Excellent' : 
                                 student.monthlyStats.percentage >= 60 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table style={styles.desktopTable}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Class</th>
                <th style={styles.th}>Present Days</th>
                <th style={styles.th}>Absent Days</th>
                <th style={styles.th}>Late Days</th>
                <th style={styles.th}>Total Days</th>
                <th style={styles.th}>Total Hours</th>
                <th style={styles.th}>Attendance %</th>
                <th style={styles.th}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map(student => (
                <tr key={student.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div style={styles.nameCell}>
                      <div style={styles.avatar}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={styles.nameInfo}>
                        <div style={styles.name}>{student.name}</div>
                        <div style={styles.email}>{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{student.class}</td>
                  <td style={styles.td}>
                    <span style={{ color: '#3CB371', fontWeight: 'bold' }}>
                      {student.monthlyStats.present}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ color: '#DC3545', fontWeight: 'bold' }}>
                      {student.monthlyStats.absent}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ color: '#FFA500', fontWeight: 'bold' }}>
                      {student.monthlyStats.late}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <strong>{student.monthlyStats.totalDays}</strong>
                  </td>
                  <td style={styles.td}>
                    <strong>{student.monthlyStats.totalHours}h</strong>
                  </td>
                  <td style={styles.td}>
                    <span style={{ 
                      color: student.monthlyStats.percentage >= 80 ? '#3CB371' : 
                             student.monthlyStats.percentage >= 60 ? '#FFA500' : '#DC3545', 
                      fontWeight: 'bold' 
                    }}>
                      {student.monthlyStats.percentage}%
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.performanceBadge,
                      backgroundColor: student.monthlyStats.percentage >= 80 ? '#3CB371' : 
                                     student.monthlyStats.percentage >= 60 ? '#FFA500' : '#DC3545'
                    }}>
                      {student.monthlyStats.percentage >= 80 ? 'Excellent' : 
                       student.monthlyStats.percentage >= 60 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // Attendance Management View
  const AttendanceManagementView = () => (
    <div>
      {/* Stats Cards */}
      <div style={{
        ...styles.statsContainer,
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))'
      }}>
        <div style={{...styles.statCard, backgroundColor: 'rgba(60, 179, 113, 0.1)'}}>
          <div style={{...styles.statNumber, color: '#3CB371'}}>{presentCount}</div>
          <div style={styles.statLabel}>PRESENT</div>
        </div>
        <div style={{...styles.statCard, backgroundColor: 'rgba(220, 53, 69, 0.1)'}}>
          <div style={{...styles.statNumber, color: '#DC3545'}}>{absentCount}</div>
          <div style={styles.statLabel}>ABSENT</div>
        </div>
        <div style={{...styles.statCard, backgroundColor: 'rgba(255, 165, 0, 0.1)'}}>
          <div style={{...styles.statNumber, color: '#FFA500'}}>{lateCount}</div>
          <div style={styles.statLabel}>LATE</div>
        </div>
        <div style={{...styles.statCard, backgroundColor: 'rgba(45, 93, 123, 0.1)'}}>
          <div style={{...styles.statNumber, color: '#2D5D7B'}}>{students.length}</div>
          <div style={styles.statLabel}>TOTAL STUDENTS</div>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={{
          ...styles.tabContainer,
          width: isMobile ? '100%' : 'fit-content'
        }}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'daily' ? styles.activeTab : {}),
              flex: isMobile ? '1' : 'none'
            }}
            onClick={() => setActiveTab('daily')}
          >
            {isMobile ? '📅 Daily' : '📅 Daily View'}
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'weekly' ? styles.activeTab : {}),
              flex: isMobile ? '1' : 'none'
            }}
            onClick={() => setActiveTab('weekly')}
          >
            {isMobile ? '📊 Weekly' : '📊 Weekly View'}
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'monthly' ? styles.activeTab : {}),
              flex: isMobile ? '1' : 'none'
            }}
            onClick={() => setActiveTab('monthly')}
          >
            {isMobile ? '📈 Monthly' : '📈 Monthly View'}
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'daily' && <DailyView />}
      {activeTab === 'weekly' && <WeeklyView />}
      {activeTab === 'monthly' && <MonthlyView />}

      {/* Action Buttons */}
      <div style={{
        ...styles.actionButtons,
        justifyContent: isMobile ? 'center' : 'flex-end'
      }}>
        <button style={styles.saveButton} onClick={saveAttendance}>
          {isMobile ? '💾 Save' : '💾 Save Attendance'}
        </button>
        <button style={styles.exportButton} onClick={exportToExcel}>
          {isMobile ? '📤 Excel' : '📤 Export to Excel'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Attendance Management
        </h1>
        <p style={styles.subtitle}>
          Track and manage student attendance in real-time
        </p>
      </div>

      {/* Content */}
      <AttendanceManagementView />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#F4F8FB',
    minHeight: 'calc(100vh - 60px)',
    fontFamily: 'Arial, sans-serif',
    marginLeft: '0px',
    marginTop: '0px',
    boxSizing: 'border-box',
    overflowX: 'auto',
    '@media (max-width: 768px)': {
      marginLeft: '0',
      padding: '15px',
      minHeight: 'calc(100vh - 60px)'
    }
  },
  header: {
    marginBottom: '30px',
    textAlign: 'left'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'black',
    margin: '0 0 8px 0',
    '@media (max-width: 768px)': {
      fontSize: '24px'
    }
  },
  subtitle: {
    fontSize: '16px',
    color: '#B0BEC5',
    margin: 0,
    '@media (max-width: 768px)': {
      fontSize: '14px'
    }
  },
  // Common Styles
  statsContainer: {
    display: 'grid',
    gap: '20px',
    marginBottom: '30px',
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      gap: '15px'
    }
  },
  statCard: {
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    border: '1px solid rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)'
    },
    '@media (max-width: 768px)': {
      padding: '20px'
    }
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '8px',
    '@media (max-width: 768px)': {
      fontSize: '28px'
    }
  },
  statLabel: {
    fontSize: '14px',
    color: '#2D5D7B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    '@media (max-width: 768px)': {
      fontSize: '12px'
    }
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '4px',
    border: '1px solid rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    '@media (max-width: 480px)': {
      width: '100%'
    }
  },
  tab: {
    padding: '12px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#B0BEC5',
    transition: 'all 0.3s ease',
    minWidth: '120px',
    '@media (max-width: 768px)': {
      padding: '10px 15px',
      minWidth: '100px',
      fontSize: '13px'
    },
    '@media (max-width: 480px)': {
      flex: '1',
      minWidth: 'auto'
    }
  },
  activeTab: {
    backgroundColor: '#2D5D7B',
    color: '#FFFFFF'
  },
  dateHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    border: '1px solid rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    gap: '15px',
    '@media (max-width: 768px)': {
      padding: '15px',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  dateInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  dateTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2D5D7B',
    margin: 0,
    '@media (max-width: 768px)': {
      fontSize: '20px'
    }
  },
  dayName: {
    fontSize: '16px',
    color: '#79B3D7',
    margin: 0,
    fontWeight: '500',
    '@media (max-width: 768px)': {
      fontSize: '14px'
    }
  },
  weekRange: {
    fontSize: '14px',
    color: '#79B3D7',
    margin: '5px 0 0 0',
    fontWeight: '500'
  },
  dayNameSmall: {
    fontSize: '12px',
    color: '#79B3D7',
    margin: '2px 0 0 0',
    fontWeight: '500'
  },
  dateInput: {
    padding: '12px',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#FFFFFF',
    minWidth: '150px',
    '@media (max-width: 768px)': {
      minWidth: '100%'
    }
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'auto',
    marginBottom: '20px',
    border: '1px solid rgba(0,0,0,0.1)',
    padding: '20px',
    maxWidth: '100%',
    '@media (max-width: 768px)': {
      padding: '15px',
      borderRadius: '8px'
    }
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2D5D7B',
    margin: '0 0 20px 0',
    paddingBottom: '10px',
    borderBottom: '2px solid #F4F8FB',
    '@media (max-width: 768px)': {
      fontSize: '16px',
      marginBottom: '15px'
    }
  },
  desktopTable: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px'
  },
  mobileTable: {
    display: 'block'
  },
  tableHeader: {
    backgroundColor: '#2D5D7B'
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: '14px',
    borderBottom: '2px solid #1a3d5a',
    whiteSpace: 'nowrap',
    '@media (max-width: 768px)': {
      padding: '12px',
      fontSize: '13px'
    }
  },
  tableRow: {
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#f8f9fa'
    }
  },
  td: {
    padding: '15px',
    fontSize: '14px',
    color: '#222831',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    whiteSpace: 'nowrap',
    '@media (max-width: 768px)': {
      padding: '12px',
      fontSize: '13px'
    }
  },
  // Mobile Card Styles
  mobileCard: {
    padding: '20px',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
    '&:last-child': {
      marginBottom: '0'
    },
    '@media (max-width: 768px)': {
      padding: '15px'
    }
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px'
  },
  studentInfo: {
    flex: 1
  },
  studentName: {
    fontWeight: '600',
    color: '#222831',
    fontSize: '16px',
    marginBottom: '2px'
  },
  studentEmail: {
    color: '#79B3D7',
    fontSize: '12px',
    marginBottom: '2px'
  },
  studentClass: {
    color: '#B0BEC5',
    fontSize: '12px'
  },
  cardDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '15px',
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr'
    }
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0'
  },
  detailLabel: {
    fontSize: '12px',
    color: '#B0BEC5',
    fontWeight: '500'
  },
  detailValue: {
    fontSize: '14px',
    color: '#222831',
    fontWeight: '500'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  // Name and Avatar Styles
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#2D5D7B',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    flexShrink: 0,
    '@media (max-width: 768px)': {
      width: '35px',
      height: '35px',
      fontSize: '12px'
    }
  },
  nameInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  name: {
    fontWeight: '600',
    color: '#222831'
  },
  email: {
    fontSize: '12px',
    color: '#79B3D7'
  },
  // Status Styles
  statusBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#FFFFFF',
    display: 'inline-block',
    minWidth: '80px',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      padding: '6px 12px',
      minWidth: '70px',
      fontSize: '11px'
    }
  },
  smallStatusBadge: {
    padding: '6px 10px',
    borderRadius: '15px',
    fontSize: '10px',
    fontWeight: '600',
    color: '#FFFFFF',
    display: 'inline-block',
    minWidth: '20px',
    textAlign: 'center'
  },
  performanceBadge: {
    padding: '6px 12px',
    borderRadius: '15px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#FFFFFF',
    display: 'inline-block',
    textAlign: 'center'
  },
  statusSelect: {
    padding: '10px',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    minWidth: '120px',
    width: '100%',
    '@media (max-width: 768px)': {
      minWidth: '100px',
      padding: '8px'
    }
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
    flexWrap: 'wrap',
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      gap: '10px'
    }
  },
  saveButton: {
    padding: '15px 25px',
    backgroundColor: '#3CB371',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    minWidth: '140px',
    '&:hover': {
      backgroundColor: '#2fa360'
    },
    '@media (max-width: 768px)': {
      padding: '12px 20px',
      minWidth: '120px',
      fontSize: '13px'
    },
    '@media (max-width: 480px)': {
      width: '100%',
      minWidth: 'auto'
    }
  },
  exportButton: {
    padding: '15px 25px',
    backgroundColor: '#79B3D7',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    minWidth: '140px',
    '&:hover': {
      backgroundColor: '#5a9bc2'
    },
    '@media (max-width: 768px)': {
      padding: '12px 20px',
      minWidth: '120px',
      fontSize: '13px'
    },
    '@media (max-width: 480px)': {
      width: '100%',
      minWidth: 'auto'
    }
  },
  // Weekly View Styles
  weekControls: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    '@media (max-width: 480px)': {
      width: '100%',
      justifyContent: 'center'
    }
  },
  weekNavButton: {
    padding: '10px 15px',
    backgroundColor: 'transparent',
    color: '#2D5D7B',
    border: '1px solid #2D5D7B',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#2D5D7B',
      color: '#FFFFFF'
    },
    '@media (max-width: 768px)': {
      padding: '8px 12px',
      fontSize: '13px'
    },
    '@media (max-width: 480px)': {
      flex: '1',
      textAlign: 'center'
    }
  },
  // Weekly specific styles
  weekDaysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginBottom: '15px',
    '@media (max-width: 480px)': {
      gridTemplateColumns: 'repeat(3, 1fr)'
    }
  },
  weekDayIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px'
  },
  weekDayLabel: {
    fontSize: '10px',
    color: '#B0BEC5',
    fontWeight: '500'
  },
  statusDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    display: 'block'
  },
  weekSummary: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#F4F8FB',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      gap: '8px'
    }
  },
  percentageText: {
    color: '#2D5D7B',
    fontWeight: 'bold'
  },
  // Monthly specific styles
  monthlyStatsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '15px',
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr'
    }
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0'
  },
  statLabel: {
    fontSize: '12px',
    color: '#B0BEC5',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '14px',
    color: '#222831',
    fontWeight: '600'
  },
  performanceRating: {
    marginTop: '10px',
    textAlign: 'center'
  },
  performanceText: {
    fontSize: '12px',
    color: '#2D5D7B',
    fontWeight: '600',
    padding: '5px 10px',
    backgroundColor: '#F4F8FB',
    borderRadius: '12px'
  },
  // Monthly View Styles
  monthlyStats: {
    display: 'grid',
    gap: '20px',
    marginBottom: '20px'
  },
  monthCard: {
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    border: '1px solid rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)'
    },
    '@media (max-width: 768px)': {
      padding: '15px'
    }
  },
  monthCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px'
  },
  monthCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D5D7B',
    margin: 0
  },
  percentageBadge: {
    padding: '6px 12px',
    backgroundColor: '#2D5D7B',
    color: '#FFFFFF',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: '600'
  },
  monthCardStats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      gap: '10px'
    }
  },
  monthStat: {
    textAlign: 'center',
    '@media (max-width: 480px)': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  },
  monthStatNumber: {
    display: 'block',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2D5D7B',
    '@media (max-width: 480px)': {
      display: 'inline',
      marginRight: '10px'
    }
  },
  monthStatLabel: {
    fontSize: '11px',
    color: '#B0BEC5',
    textTransform: 'uppercase',
    '@media (max-width: 480px)': {
      textTransform: 'none'
    }
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#F4F8FB',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  }
};

export default Attendance;