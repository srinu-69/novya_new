import React, { useState, useEffect } from 'react';
import { djangoAPI, API_CONFIG } from '../../config/api';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // { date: { studentId: status } }
  const [timeData, setTimeData] = useState({}); // { date: { studentId: { checkIn, checkOut, hours } } }
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // Fetch students and attendance data
  useEffect(() => {
    fetchStudentsAndAttendance();
  }, [selectedDate, selectedMonth, selectedWeek]);

  const fetchStudentsAndAttendance = async () => {
    try {
      setLoading(true);
      
      // Fetch students from teacher's school
      const studentsResponse = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.TEACHER_STUDENTS);
      const studentsList = studentsResponse.students || [];
      
      // Process students data
      const processedStudents = studentsList.map((student) => {
        const firstName = student.user_info?.firstname || student.first_name || '';
        const lastName = student.user_info?.lastname || student.last_name || '';
      
      return {
          id: student.student_id,
          student_id: student.student_id,
          name: `${firstName} ${lastName}`.trim() || 'Unknown',
          email: student.user_info?.email || student.student_email || '',
          class: student.profile?.grade || 'General',
      };
    });
    
      setStudents(processedStudents);
      
      // Fetch attendance records for the selected month
      const monthStart = `${selectedMonth}-01`;
      const monthEnd = new Date(new Date(monthStart).getFullYear(), new Date(monthStart).getMonth() + 1, 0)
        .toISOString().split('T')[0];
      
      // Fetch attendance for all students in the month
      const attendanceMap = {};
      for (const student of processedStudents) {
        try {
          const attendanceUrl = `${API_CONFIG.DJANGO.ATTENDANCE.LIST}?student=${student.student_id}&date_from=${monthStart}&date_to=${monthEnd}`;
          const attendanceResponse = await djangoAPI.get(attendanceUrl);
          const records = Array.isArray(attendanceResponse) ? attendanceResponse : (attendanceResponse.results || []);
          
          records.forEach(record => {
            const dateKey = record.date;
            if (!attendanceMap[dateKey]) {
              attendanceMap[dateKey] = {};
            }
            attendanceMap[dateKey][student.student_id] = {
              status: record.status,
              id: record.id,
              remarks: record.remarks || '',
              check_in_time: record.check_in_time || null,
              check_out_time: record.check_out_time || null,
              hours_attended: record.hours_attended || null
            };
          });
        } catch (error) {
          console.error(`Error fetching attendance for student ${student.student_id}:`, error);
        }
      }
      
      setAttendanceRecords(attendanceMap);
      
      // Also populate timeData from fetched records
      const timeMap = {};
      for (const student of processedStudents) {
        try {
          const attendanceUrl = `${API_CONFIG.DJANGO.ATTENDANCE.LIST}?student=${student.student_id}&date_from=${monthStart}&date_to=${monthEnd}`;
          const attendanceResponse = await djangoAPI.get(attendanceUrl);
          const records = Array.isArray(attendanceResponse) ? attendanceResponse : (attendanceResponse.results || []);
          
          records.forEach(record => {
            const recordDate = record.date;
            if (!timeMap[recordDate]) timeMap[recordDate] = {};
            if (!timeMap[recordDate][student.student_id]) timeMap[recordDate][student.student_id] = {};
            
            timeMap[recordDate][student.student_id] = {
              checkIn: record.check_in_time || '-',
              checkOut: record.check_out_time || '-',
              hours: record.hours_attended || 0
            };
          });
        } catch (error) {
          console.error(`Error fetching time data for student ${student.student_id}:`, error);
        }
      }
      setTimeData(prev => ({ ...prev, ...timeMap }));
    } catch (error) {
      console.error('Error fetching students and attendance:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (studentId, status, date = selectedDate) => {
    try {
      setSaving(true);
      
      // Check if attendance record already exists for this date and student
      const existingRecord = attendanceRecords[date]?.[studentId];
      
      // Get a default subject ID (using 1 as fallback, but ideally should fetch from API)
      // For now, we'll try to use subject_id from the existing record if available
      const defaultSubjectId = existingRecord?.subject_id || 1;
      
      // Get teacher ID from localStorage or fetch from API
      let teacherId = null;
      try {
        const userId = parseInt(localStorage.getItem('userId') || '0');
        // Try to get teacher registration ID - backend will handle this if not provided
        // For now, we'll let the backend serializer get it from the request user
        teacherId = userId; // This will be used by backend to find teacher_registration
      } catch (error) {
        console.warn('Could not get teacher ID:', error);
      }
      
      // Get check-in/check-out times from state or record
      const timeInfo = timeData[date]?.[studentId];
      const record = attendanceRecords[date]?.[studentId];
      const checkInTime = timeInfo?.checkIn || record?.check_in_time || (status === 'present' ? '09:00' : status === 'late' ? '10:30' : null);
      const checkOutTime = timeInfo?.checkOut || record?.check_out_time || (status === 'present' || status === 'late' ? '17:00' : null);
      
      // Calculate hours if both times are provided
      let calculatedHours = 0;
      if (checkInTime && checkOutTime && checkInTime !== '-' && checkOutTime !== '-') {
        calculatedHours = calculateHours(checkInTime, checkOutTime);
      } else if (record?.hours_attended) {
        calculatedHours = record.hours_attended;
      } else if (status === 'present') {
        calculatedHours = 8.0;
      } else if (status === 'late') {
        calculatedHours = 6.5;
      }
      
      const attendanceData = {
        student_id: studentId,
        date: date,
        status: status,
        subject_id: defaultSubjectId, // Backend serializer will map this to course_id
        teacher_id: teacherId, // Backend will resolve this to teacher_registration.teacher_id
        remarks: status === 'late' ? 'Student arrived late' : '',
        check_in_time: checkInTime && checkInTime !== '-' ? checkInTime : null,
        check_out_time: checkOutTime && checkOutTime !== '-' ? checkOutTime : null,
        hours_attended: calculatedHours > 0 ? calculatedHours : null
      };
      
      if (existingRecord?.id) {
        // Update existing record
        await djangoAPI.put(API_CONFIG.DJANGO.ATTENDANCE.DETAIL(existingRecord.id), attendanceData);
      } else {
        // Create new record with teacher_id
        await djangoAPI.post(API_CONFIG.DJANGO.ATTENDANCE.CREATE, attendanceData);
      }
      
      // Update local state
      setAttendanceRecords(prev => {
        const newRecords = { ...prev };
        if (!newRecords[date]) {
          newRecords[date] = {};
        }
        newRecords[date][studentId] = {
          status: status,
          id: existingRecord?.id || Date.now(), // Temporary ID if new
          remarks: attendanceData.remarks,
          check_in_time: attendanceData.check_in_time,
          check_out_time: attendanceData.check_out_time,
          hours_attended: attendanceData.hours_attended
        };
        return newRecords;
      });
      
      // Update timeData state
      setTimeData(prev => {
        const newData = { ...prev };
        if (!newData[date]) newData[date] = {};
        if (!newData[date][studentId]) newData[date][studentId] = {};
        newData[date][studentId] = {
          checkIn: attendanceData.check_in_time || '-',
          checkOut: attendanceData.check_out_time || '-',
          hours: attendanceData.hours_attended || 0
        };
        return newData;
      });
      
      // Refresh data to get the actual ID from backend
      await fetchStudentsAndAttendance();
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Get student status for a specific date
  const getStudentStatus = (studentId, date) => {
    return attendanceRecords[date]?.[studentId]?.status || null;
  };
  
  // Calculate hours from check-in and check-out times
  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut || checkIn === '-' || checkOut === '-') return 0;
    
    try {
      const [inHours, inMinutes] = checkIn.split(':').map(Number);
      const [outHours, outMinutes] = checkOut.split(':').map(Number);
      
      const inTime = inHours * 60 + inMinutes;
      const outTime = outHours * 60 + outMinutes;
      
      if (outTime <= inTime) return 0;
      
      const diffMinutes = outTime - inTime;
      const hours = diffMinutes / 60;
      return Math.round(hours * 10) / 10; // Round to 1 decimal place
    } catch (error) {
      return 0;
    }
  };
  
  // Handle time change and auto-save
  const handleTimeChange = async (studentId, date, field, value) => {
    setTimeData(prev => {
      const newData = { ...prev };
      if (!newData[date]) newData[date] = {};
      if (!newData[date][studentId]) newData[date][studentId] = { checkIn: '-', checkOut: '-', hours: 0 };
      
      newData[date][studentId][field] = value;
      
      // Calculate hours if both times are set
      let calculatedHours = 0;
      if (field === 'checkIn' && newData[date][studentId].checkOut && newData[date][studentId].checkOut !== '-') {
        calculatedHours = calculateHours(value, newData[date][studentId].checkOut);
      } else if (field === 'checkOut' && newData[date][studentId].checkIn && newData[date][studentId].checkIn !== '-') {
        calculatedHours = calculateHours(newData[date][studentId].checkIn, value);
      }
      
      newData[date][studentId].hours = calculatedHours;
      
      // Auto-save to backend if record exists
      const record = attendanceRecords[date]?.[studentId];
      if (record?.id && (field === 'checkOut' || (field === 'checkIn' && newData[date][studentId].checkOut && newData[date][studentId].checkOut !== '-'))) {
        // Save after a short delay to avoid too many API calls
        setTimeout(async () => {
          try {
            const existingRecord = attendanceRecords[date]?.[studentId];
            const defaultSubjectId = existingRecord?.subject_id || 1;
            let teacherId = null;
            try {
              const userId = parseInt(localStorage.getItem('userId') || '0');
              teacherId = userId;
            } catch (error) {
              console.warn('Could not get teacher ID:', error);
            }
            
            const attendanceData = {
              student_id: studentId,
              date: date,
              status: existingRecord?.status || 'present',
              subject_id: defaultSubjectId,
              teacher_id: teacherId,
              check_in_time: newData[date][studentId].checkIn !== '-' ? newData[date][studentId].checkIn : null,
              check_out_time: newData[date][studentId].checkOut !== '-' ? newData[date][studentId].checkOut : null,
              hours_attended: calculatedHours > 0 ? calculatedHours : null
            };
            
            await djangoAPI.put(API_CONFIG.DJANGO.ATTENDANCE.DETAIL(existingRecord.id), attendanceData);
            
            // Update attendanceRecords with new time data
            setAttendanceRecords(prev => {
              const updated = { ...prev };
              if (!updated[date]) updated[date] = {};
              if (!updated[date][studentId]) updated[date][studentId] = {};
              updated[date][studentId] = {
                ...updated[date][studentId],
                check_in_time: attendanceData.check_in_time,
                check_out_time: attendanceData.check_out_time,
                hours_attended: attendanceData.hours_attended
              };
              return updated;
            });
          } catch (error) {
            console.error('Error saving time data:', error);
          }
        }, 500); // 500ms delay to debounce
      }
      
      return newData;
    });
  };
  
  // Get student status with default values
  const getStudentStatusWithDefaults = (studentId, date) => {
    const status = getStudentStatus(studentId, date);
    const record = attendanceRecords[date]?.[studentId];
    const timeInfo = timeData[date]?.[studentId];
    
    // Use actual data from record if available, otherwise use timeData state, otherwise defaults
    const checkIn = record?.check_in_time || timeInfo?.checkIn || (status === 'present' ? '09:00' : status === 'late' ? '10:30' : '-');
    const checkOut = record?.check_out_time || timeInfo?.checkOut || (status === 'present' || status === 'late' ? '17:00' : '-');
    const hours = record?.hours_attended || timeInfo?.hours || (status === 'present' ? 8.0 : status === 'late' ? 6.5 : 0);
    
    if (!status) return { status: null, checkIn: '-', checkOut: '-', hours: 0 };
    
    return { status, checkIn, checkOut, hours };
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

  const saveAttendance = async () => {
    try {
      setSaving(true);
      
      // Save all attendance for the selected date
      const promises = students.map(async (student) => {
        const status = getStudentStatus(student.id, selectedDate);
        if (status) {
          await handleStatusChange(student.id, status, selectedDate);
        }
      });
      
      await Promise.all(promises);
    alert('Attendance data saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Statistics for selected date
  const presentCount = students.filter(s => getStudentStatus(s.id, selectedDate) === 'present').length;
  const absentCount = students.filter(s => getStudentStatus(s.id, selectedDate) === 'absent').length;
  const lateCount = students.filter(s => getStudentStatus(s.id, selectedDate) === 'late').length;

  // Weekly dates
  const weekDates = getWeekDates(selectedWeek);
  
  // Generate weekly attendance data from real records
  const weeklyAttendanceData = students.map(student => {
    const weekData = {};
    const dailyHours = {};
    weekDates.forEach(date => {
      const status = getStudentStatus(student.id, date);
      weekData[date] = status || null;
      if (status === 'present') {
        dailyHours[date] = 8;
      } else if (status === 'late') {
        dailyHours[date] = 6.5;
      } else {
        dailyHours[date] = 0;
      }
    });
    
    const presentDays = Object.values(weekData).filter(status => status === 'present').length;
    const lateDays = Object.values(weekData).filter(status => status === 'late').length;
    const totalHours = Object.values(dailyHours).reduce((sum, hours) => sum + hours, 0);
    const markedDays = Object.values(weekData).filter(status => status !== null).length;
    const weeklyPercentage = markedDays > 0 ? Math.round((presentDays / markedDays) * 100) : 0;
    
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

  // Monthly data with real calculations from attendance records
  const monthlyData = students.map(student => {
    const monthStart = `${selectedMonth}-01`;
    const monthEnd = new Date(new Date(monthStart).getFullYear(), new Date(monthStart).getMonth() + 1, 0)
      .toISOString().split('T')[0];
    
    let presentDays = 0;
    let absentDays = 0;
    let lateDays = 0;
    
    // Count attendance for the month
    Object.keys(attendanceRecords).forEach(date => {
      if (date >= monthStart && date <= monthEnd) {
        const status = attendanceRecords[date]?.[student.id]?.status;
        if (status === 'present') presentDays++;
        else if (status === 'absent') absentDays++;
        else if (status === 'late') lateDays++;
      }
    });
    
    const totalDays = presentDays + absentDays + lateDays;
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading students and attendance...</div>
        ) : isMobile ? (
          // Mobile View
          <div style={styles.mobileTable}>
            {students.map(student => {
              const studentData = getStudentStatusWithDefaults(student.id, selectedDate);
              return (
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
                    {studentData.status && (
                  <span style={{
                    ...styles.statusBadge,
                        backgroundColor: getStatusColor(studentData.status)
                  }}>
                        {getStatusText(studentData.status)}
                  </span>
                    )}
                </div>
                
                <div style={styles.cardDetails}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Check-In:</span>
                    <input
                      type="time"
                      value={studentData.checkIn !== '-' ? studentData.checkIn : ''}
                      onChange={(e) => {
                        const value = e.target.value || '-';
                        handleTimeChange(student.id, selectedDate, 'checkIn', value);
                      }}
                      style={{
                        padding: '6px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        width: '100px'
                      }}
                      disabled={!studentData.status || studentData.status === 'absent'}
                    />
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Check-Out:</span>
                    <input
                      type="time"
                      value={studentData.checkOut !== '-' ? studentData.checkOut : ''}
                      onChange={(e) => {
                        const value = e.target.value || '-';
                        handleTimeChange(student.id, selectedDate, 'checkOut', value);
                      }}
                      style={{
                        padding: '6px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        width: '100px'
                      }}
                      disabled={!studentData.status || studentData.status === 'absent'}
                    />
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Hours:</span>
                    <span style={{ ...styles.detailValue, fontWeight: 'bold', color: '#2D5D7B' }}>
                      {studentData.hours > 0 ? `${studentData.hours}h` : '-'}
                    </span>
                  </div>
                </div>
                
                <div style={styles.cardActions}>
                  <select
                      value={studentData.status || ''}
                      onChange={(e) => handleStatusChange(student.id, e.target.value, selectedDate)}
                    style={styles.statusSelect}
                      disabled={saving}
                  >
                      <option value="">Not Marked</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </div>
              </div>
              );
            })}
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
              {students.map(student => {
                const studentData = getStudentStatusWithDefaults(student.id, selectedDate);
                return (
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
                      {studentData.status ? (
                    <span style={{
                      ...styles.statusBadge,
                          backgroundColor: getStatusColor(studentData.status)
                    }}>
                          {getStatusText(studentData.status)}
                    </span>
                      ) : (
                        <span style={{ color: '#B0BEC5' }}>Not Marked</span>
                      )}
                  </td>
                    <td style={styles.td}>
                      <input
                        type="time"
                        value={studentData.checkIn !== '-' ? studentData.checkIn : ''}
                        onChange={(e) => {
                          const value = e.target.value || '-';
                          handleTimeChange(student.id, selectedDate, 'checkIn', value);
                        }}
                        style={{
                          padding: '6px 8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          width: '100px',
                          minWidth: '80px'
                        }}
                        disabled={!studentData.status || studentData.status === 'absent'}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="time"
                        value={studentData.checkOut !== '-' ? studentData.checkOut : ''}
                        onChange={(e) => {
                          const value = e.target.value || '-';
                          handleTimeChange(student.id, selectedDate, 'checkOut', value);
                        }}
                        style={{
                          padding: '6px 8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          width: '100px',
                          minWidth: '80px'
                        }}
                        disabled={!studentData.status || studentData.status === 'absent'}
                      />
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: 'bold', color: '#2D5D7B' }}>
                        {studentData.hours > 0 ? `${studentData.hours}h` : '-'}
                      </span>
                    </td>
                  <td style={styles.td}>
                    <select
                        value={studentData.status || ''}
                        onChange={(e) => handleStatusChange(student.id, e.target.value, selectedDate)}
                      style={styles.statusSelect}
                        disabled={saving}
                    >
                        <option value="">Not Marked</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                </tr>
                );
              })}
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
                  {weekDates.map((date, index) => {
                    const status = student.weekData[date];
                    return (
                    <td key={index} style={styles.td}>
                        <select
                          value={status || ''}
                          onChange={(e) => handleStatusChange(student.id, e.target.value, date)}
                          style={{
                            ...styles.statusSelect,
                            padding: '4px 8px',
                            fontSize: '12px',
                            minWidth: '80px'
                          }}
                          disabled={saving}
                        >
                          <option value="">-</option>
                          <option value="present">P</option>
                          <option value="absent">A</option>
                          <option value="late">L</option>
                        </select>
                    </td>
                    );
                  })}
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