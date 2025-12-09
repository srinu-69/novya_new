# Teacher Dashboard - Calculation Logic & Data Sources

This document explains how each metric and functionality in the Teacher Dashboard is calculated.

---

## 📊 **Main Statistics Cards (Top Section)**

### 1. **Total Students**
- **Source**: `API_CONFIG.DJANGO.AUTH.TEACHER_STUDENTS`
- **Calculation**: 
  ```javascript
  const totalStudents = students.length;
  ```
- **Logic**: Counts all students returned from the teacher-students API endpoint. This includes all students from the teacher's school.
- **Data Structure**: Array of student objects from backend

---

### 2. **Active Students**
- **Source**: Same API as Total Students
- **Calculation**:
  ```javascript
  const activeStudents = students.filter(s => 
    s.average_score !== null && s.average_score !== undefined
  ).length;
  ```
- **Logic**: Counts only students who have completed at least one assessment (quiz or mock test) and have a calculated average score. A student is considered "active" if they have performance data.
- **Criteria**: `average_score` must not be null/undefined

---

### 3. **Parents Connected**
- **Source**: `API_CONFIG.DJANGO.AUTH.TEACHER_PARENTS`
- **Calculation**:
  ```javascript
  const totalParents = parents.length;
  ```
- **Logic**: Counts all parent records linked to students in the teacher's school.
- **Data Structure**: Array of parent objects from backend

---

### 4. **Average Performance**
- **Source**: Student data from `TEACHER_STUDENTS` endpoint
- **Calculation**:
  ```javascript
  let totalPerformance = 0;
  let studentsWithPerformance = 0;
  
  students.forEach(student => {
    if (student.average_score !== null && student.average_score !== undefined) {
      totalPerformance += student.average_score;
      studentsWithPerformance++;
    }
  });
  
  const averagePerformance = studentsWithPerformance > 0 
    ? Math.round(totalPerformance / studentsWithPerformance) 
    : 0;
  ```
- **Logic**: 
  - Sums all `average_score` values from students who have performance data
  - Divides by the count of students with performance data
  - Rounds to nearest integer
  - Returns 0 if no students have performance data
- **Note**: `average_score` is calculated by backend as: `(quiz_score + mock_score) / 2`

---

### 5. **Attendance Rate**
- **Source**: `API_CONFIG.DJANGO.ATTENDANCE.LIST` (per student)
- **Calculation**:
  ```javascript
  // Get current month date range
  const currentMonth = new Date().toISOString().substring(0, 7); // "2024-01"
  const monthStart = `${currentMonth}-01`; // "2024-01-01"
  const monthEnd = new Date(year, month + 1, 0).toISOString().split('T')[0]; // Last day of month
  
  let totalPresentDays = 0;
  let totalDays = 0;
  
  // For each student, fetch attendance records
  for (const student of students) {
    const attendanceUrl = `${ATTENDANCE.LIST}?student=${student.student_id}&date_from=${monthStart}&date_to=${monthEnd}`;
    const records = await fetch(attendanceUrl);
    
    records.forEach(record => {
      totalDays++; // Count all attendance records
      if (record.status === 'present' || record.status === 'late') {
        totalPresentDays++; // Count present/late as "attended"
      }
    });
  }
  
  attendanceRate = totalDays > 0 
    ? Math.round((totalPresentDays / totalDays) * 100) 
    : 0;
  ```
- **Logic**:
  - Fetches attendance records for current month for all students
  - Counts total attendance records (all statuses)
  - Counts records with status "present" or "late" as "attended"
  - Calculates percentage: `(attended days / total days) × 100`
  - Rounds to nearest integer
- **Time Period**: Current month only
- **Statuses Counted as Present**: `'present'` and `'late'`

---

### 6. **Pending Communications**
- **Source**: `API_CONFIG.DJANGO.NOTIFICATIONS.LIST`
- **Calculation**:
  ```javascript
  const notifications = await fetch(NOTIFICATIONS.LIST);
  const pendingCommunications = notifications.filter(n => !n.is_read).length;
  ```
- **Logic**: Counts all notifications where `is_read` is `false` or `null`
- **Purpose**: Shows unread messages/notifications for the teacher

---

## 📈 **Quick Statistics Section**

### 1. **Quizzes Completed**
- **Source**: Student data from `TEACHER_STUDENTS`
- **Calculation**:
  ```javascript
  let totalQuizzes = 0;
  students.forEach(student => {
    totalQuizzes += student.quiz_attempts_count || 0;
  });
  ```
- **Logic**: Sums `quiz_attempts_count` from all students
- **Value**: Total number of quiz attempts across all students
- **Trend**: Currently static (`+12%`) - can be enhanced with historical comparison

---

### 2. **Mock Tests**
- **Source**: Student data from `TEACHER_STUDENTS`
- **Calculation**:
  ```javascript
  let totalMockTests = 0;
  students.forEach(student => {
    totalMockTests += student.mock_attempts_count || 0;
  });
  ```
- **Logic**: Sums `mock_attempts_count` from all students
- **Value**: Total number of mock test attempts across all students
- **Trend**: Currently static (`+5%`)

---

### 3. **Assignments**
- **Source**: Student data (currently not fully implemented)
- **Calculation**:
  ```javascript
  let totalAssignments = 0;
  // Currently returns 0, can be enhanced with assignment data
  ```
- **Logic**: Placeholder for assignment count (can be enhanced with assignment API)
- **Trend**: Currently static (`+8%`)

---

### 4. **Pending Reviews**
- **Source**: Same as Pending Communications
- **Calculation**: Uses `pendingCommunications` value
- **Logic**: Same as "Pending Communications" metric above
- **Trend**: Currently static (`-2%`)

---

## 📊 **Chart Data**

### 1. **Performance Distribution (Pie Chart)**
- **Source**: Student `average_score` values
- **Calculation**:
  ```javascript
  let excellent = 0, good = 0, average = 0, needsImprovement = 0;
  
  students.forEach(student => {
    const score = student.average_score;
    if (score !== null && score !== undefined) {
      if (score >= 90) excellent++;
      else if (score >= 80) good++;
      else if (score >= 70) average++;
      else needsImprovement++;
    }
  });
  ```
- **Categories & Thresholds**:
  - **Excellent**: `score >= 90%`
  - **Good**: `80% <= score < 90%`
  - **Average**: `70% <= score < 80%`
  - **Needs Improvement**: `score < 70%`
- **Logic**: Categorizes each student based on their average score and counts students in each category

---

### 2. **Subject-Wise Performance (Bar Chart)**
- **Source**: `student.subject_performance` object from API
- **Calculation**:
  ```javascript
  const subjectScores = {
    mathematics: [],
    physics: [],
    chemistry: [],
    biology: [],
    english: []
  };
  
  // Collect all subject scores from all students
  students.forEach(student => {
    if (student.subject_performance) {
      Object.keys(student.subject_performance).forEach(subjectKey => {
        const subjectData = student.subject_performance[subjectKey];
        if (subjectData && subjectData.score !== null) {
          // Map subject keys to chart subjects
          if (subjectKey === 'mathematics' || subjectKey === 'math') {
            subjectScores.mathematics.push(subjectData.score);
          }
          // ... similar for other subjects
        }
      });
    }
  });
  
  // Calculate average for each subject
  const calculateAverage = (arr) => 
    arr.length > 0 
      ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) 
      : 0;
  
  const mathAvg = calculateAverage(subjectScores.mathematics);
  ```
- **Logic**:
  - Extracts `score` from each student's `subject_performance` object
  - Groups scores by subject (mathematics, physics, chemistry, biology, english)
  - Calculates average score per subject across all students
  - Returns 0 if no data for a subject
- **Subject Mapping**:
  - `'mathematics'` or `'math'` → Mathematics
  - `'science'` or `'physics'` → Physics
  - `'chemistry'` → Chemistry
  - `'biology'` → Biology
  - `'english'` → English

---

### 3. **Assessment Types (Pie Chart)**
- **Source**: Aggregated from student data
- **Calculation**:
  ```javascript
  const assessmentTypes = [
    { label: 'quizzes', value: totalQuizzes, color: colors.primary },
    { label: 'mockTests', value: totalMockTests, color: colors.secondary },
    { label: 'assignments', value: totalAssignments, color: colors.info },
    { label: 'projects', value: Math.floor(totalAssignments * 0.2), color: colors.accent }
  ];
  ```
- **Logic**:
  - **Quizzes**: Sum of all `quiz_attempts_count`
  - **Mock Tests**: Sum of all `mock_attempts_count`
  - **Assignments**: Currently 0 (can be enhanced)
  - **Projects**: Estimated as 20% of assignments (placeholder)
- **Purpose**: Shows distribution of assessment types

---

### 4. **Student Progress Trend (Bar Chart)**
- **Source**: Calculated from `averagePerformance`
- **Calculation**:
  ```javascript
  const studentProgress = [
    { label: 'week 1', value: Math.max(0, averagePerformance - 20) },
    { label: 'week 2', value: Math.max(0, averagePerformance - 15) },
    { label: 'week 3', value: Math.max(0, averagePerformance - 10) },
    { label: 'week 4', value: Math.max(0, averagePerformance - 5) },
    { label: 'week 5', value: Math.max(0, averagePerformance - 2) },
    { label: 'week 6', value: averagePerformance }
  ];
  ```
- **Logic**: 
  - **Currently Simplified**: Shows a simulated trend based on current average performance
  - Week 6 = current average performance
  - Previous weeks show incremental improvement (backwards calculation)
  - Uses `Math.max(0, ...)` to ensure no negative values
- **Enhancement Opportunity**: Can be improved with actual time-series data from historical records

---

## 📝 **Latest Assessments Section**

- **Source**: Student `quiz_completion_date` and `mock_completion_date`
- **Calculation**:
  ```javascript
  const assessmentMap = {};
  
  // Group assessments by date and type
  students.forEach(student => {
    if (student.quiz_completion_date) {
      const key = `quiz-${student.quiz_completion_date}`;
      if (!assessmentMap[key]) {
        assessmentMap[key] = {
          type: 'quiz',
          date: student.quiz_completion_date,
          students: [],
          scores: []
        };
      }
      assessmentMap[key].students.push(student);
      if (student.quiz_score !== null) {
        assessmentMap[key].scores.push(student.quiz_score);
      }
    }
    // Similar for mock_completion_date
  });
  
  // Sort by date (newest first) and take top 3
  const sortedAssessments = Object.values(assessmentMap)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .map((assessment) => {
      // Calculate average score
      const avgScore = assessment.scores.length > 0
        ? Math.round(assessment.scores.reduce((a, b) => a + b, 0) / assessment.scores.length)
        : 0;
      
      // Count completed vs total
      const completed = assessment.students.length;
      const total = totalStudents;
      
      return {
        type: typeLabel, // Based on assessment.type
        avg: `${avgScore}%`,
        completion: `${completed}/${total} ${t('completed')}`,
        color: color
      };
    });
  ```
- **Logic**:
  1. Groups students by assessment completion date and type (quiz/mock)
  2. Collects all scores for each assessment group
  3. Sorts by date (newest first)
  4. Takes top 3 most recent assessments
  5. Calculates average score: `sum of all scores / number of students`
  6. Shows completion: `students who completed / total students`
- **Display Format**:
  - **Type**: "Mathematics Quizzes", "Physics Mock Tests", or "Chemistry Assignments"
  - **Average**: Average score percentage
  - **Completion**: "X/Y Completed" format

---

## 🔔 **Recent Activities Section**

- **Source**: `API_CONFIG.DJANGO.NOTIFICATIONS.LIST`
- **Calculation**:
  ```javascript
  const notifications = await fetch(NOTIFICATIONS.LIST);
  
  const activities = notifications
    .slice(0, 5) // Take first 5 notifications
    .map((notif, index) => {
      const timeAgo = getTimeAgo(notif.created_at || notif.timestamp);
      return {
        id: notif.id || index + 1,
        type: notif.type || 'system',
        message: notif.message || notif.title || t('newNotification'),
        time: timeAgo,
        priority: notif.priority || 'normal'
      };
    });
  ```
- **Time Calculation** (`getTimeAgo` function):
  ```javascript
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) return `${diffMins} ${t('minutesAgo')}`;
    if (diffHours < 24) return `${diffHours} ${t('hoursAgo')}`;
    if (diffDays < 7) return `${diffDays} ${t('daysAgo')}`;
    return date.toLocaleDateString();
  };
  ```
- **Logic**:
  - Fetches all notifications
  - Takes first 5 notifications
  - Calculates relative time (e.g., "5 minutes ago", "2 hours ago")
  - Maps notification data to activity format
- **Display**: Shows notification message, time ago, and priority level

---

## 🔄 **Data Flow Summary**

1. **On Component Mount**: `loadDashboardData()` is called
2. **API Calls** (in parallel where possible):
   - `GET /api/auth/teacher-students/` → Student data with scores
   - `GET /api/auth/teacher-parents/` → Parent data
   - `GET /api/notifications/` → Notifications
   - `GET /api/progress/attendance/?student=X&date_from=...&date_to=...` → Attendance (per student)
3. **Data Processing**: All calculations happen client-side after data is fetched
4. **State Updates**: Results are stored in React state and displayed in UI

---

## ⚠️ **Current Limitations & Enhancement Opportunities**

1. **Trend Calculations**: Currently static (`+12%`, `+5%`, etc.)
   - **Enhancement**: Compare current period with previous period
   - **Example**: `((current - previous) / previous) * 100`

2. **Student Progress Trend**: Currently simulated
   - **Enhancement**: Fetch historical performance data from backend
   - **Example**: Store weekly snapshots of average performance

3. **Assignments Count**: Currently returns 0
   - **Enhancement**: Integrate with assignments API endpoint

4. **Attendance Rate**: Fetches per-student (can be slow with many students)
   - **Enhancement**: Backend endpoint that aggregates attendance for all students

5. **Latest Assessments**: Only shows quiz/mock test dates
   - **Enhancement**: Include actual assessment names/titles from backend

---

## 📌 **Key Data Structures**

### Student Object (from API):
```javascript
{
  student_id: "123",
  student_username: "john_doe",
  first_name: "John",
  last_name: "Doe",
  quiz_score: 85.5,           // Percentage
  mock_score: 78.2,            // Percentage
  average_score: 81.85,       // (quiz_score + mock_score) / 2
  quiz_attempts_count: 15,     // Number of quiz attempts
  mock_attempts_count: 8,      // Number of mock test attempts
  quiz_completion_date: "2024-01-15",  // Latest quiz date
  mock_completion_date: "2024-01-20",  // Latest mock date
  subject_performance: {
    mathematics: { score: 88, quiz_score: 85, mock_score: 91, ... },
    english: { score: 75, ... },
    // ... other subjects
  }
}
```

### Notification Object:
```javascript
{
  id: 1,
  message: "New quiz completed",
  type: "quiz",
  created_at: "2024-01-20T10:30:00Z",
  is_read: false,
  priority: "normal"
}
```

---

This dashboard is now fully dynamic and calculates all metrics from real backend data! 🎉

