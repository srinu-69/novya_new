# Career Page Boards - Complete Data Flow Documentation

## Overview
This document explains how the career page boards fetch quiz marks and mocktest marks from the database tables (`quiz_attempt` and `mock_test_attempt`).

---

## 📊 Data Flow Diagram

```
Frontend Career Page (Career.jsx)
    ↓
Frontend Utility (quizTracking.js)
    ↓
Frontend API Config (api.js)
    ↓
Backend URL Routing (urls.py)
    ↓
Backend View (views.py)
    ↓
Backend Models (models.py)
    ↓
PostgreSQL Database Tables
```

---

## 🔍 Step-by-Step Code Flow

### 1. **FRONTEND: Career Page Component**
**File**: `frontend/src/modules/student/Career.jsx`

#### Key Code Sections:

**A. Import Functions** (Line 12):
```javascript
import { getStudentPerformance, getQuizStatistics, getRecentQuizAttempts } from '../../utils/quizTracking';
```

**B. Fetch Data on Component Mount** (Lines 87-150):
```javascript
useEffect(() => {
  const fetchQuizData = async () => {
    try {
      setLoadingQuizData(true);
      
      // Call API to get recent attempts
      const recentAttemptsRes = await getRecentQuizAttempts(10);
      
      // Calculate performance data from recent attempts
      if (recentAttemptsRes && recentAttemptsRes.attempts) {
        const attempts = recentAttemptsRes.attempts;
        
        // Filter quiz attempts
        const quizAttempts = attempts.filter(attempt => attempt.type === 'quiz');
        const quizScores = quizAttempts.map(attempt => attempt.score || 0);
        const quizAvg = quizScores.length > 0 
          ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length 
          : 0;
        
        // Calculate total questions from quiz attempts
        const quizTotalQuestions = quizAttempts.reduce(
          (sum, attempt) => sum + (attempt.total_questions || 0), 
          0
        );
        
        // Filter mock test attempts
        const mockTestAttempts = attempts.filter(attempt => attempt.type === 'mock_test');
        const mockTestScores = mockTestAttempts.map(attempt => attempt.score || 0);
        const mockTestAvg = mockTestScores.length > 0 
          ? mockTestScores.reduce((sum, score) => sum + score, 0) / mockTestScores.length 
          : 0;
        
        // Calculate total questions from mock test attempts
        const mockTestTotalQuestions = mockTestAttempts.reduce(
          (sum, attempt) => sum + (attempt.total_questions || 0), 
          0
        );
        
        // Create performance data object
        const performanceData = {
          quiz_average_score: quizAvg,
          mock_test_average_score: mockTestAvg,
          total_quizzes_attempted: quizAttempts.length,
          total_mock_tests_attempted: mockTestAttempts.length,
          total_questions_answered: quizTotalQuestions,
          mock_test_questions_answered: mockTestTotalQuestions
        };
        
        setQuizPerformanceData(performanceData);
        setRecentQuizAttempts(attempts);
      }
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    } finally {
      setLoadingQuizData(false);
    }
  };
  
  fetchQuizData();
}, []);
```

**C. Calculate Metrics for Display** (Lines 258-314):
```javascript
// Calculate dynamic metrics from API data
const getDynamicQuizMetrics = () => {
  if (!quizPerformanceData) {
    return {
      totalQuizzes: quizResults.totalQuizzes || 0,
      averageScore: parseFloat(quizAverage) || 0,
      totalQuestions: quizResults.totalQuestions || 0
    };
  }
  
  // Get quiz data from performance API
  const totalQuizzes = quizPerformanceData.total_quizzes_attempted || 0;
  const averageScore = quizPerformanceData.quiz_average_score || 0;
  const totalQuestions = quizPerformanceData.total_questions_answered || 0;
  
  return {
    totalQuizzes: totalQuizzes,
    averageScore: averageScore,
    totalQuestions: totalQuestions
  };
};

const getDynamicMockTestMetrics = () => {
  if (!quizPerformanceData) {
    return {
      totalTests: mockTestResults.totalTests || 0,
      averageScore: parseFloat(mockAverage) || 0,
      totalQuestions: mockTestResults.totalQuestions || 0
    };
  }
  
  // Get mock test data from performance API
  const totalTests = quizPerformanceData.total_mock_tests_attempted || 0;
  const averageScore = quizPerformanceData.mock_test_average_score || 0;
  const totalQuestions = quizPerformanceData.mock_test_questions_answered || 0;
  
  return {
    totalTests: totalTests,
    averageScore: averageScore,
    totalQuestions: totalQuestions
  };
};
```

**D. Display Metrics in UI** (Lines 364-410):
```javascript
const performanceMetrics = [
  {
    id: 'quiz',
    title: t('performance.quiz'),
    icon: <BookOpen size={24} />,
    metrics: [
      { 
        name: t('metrics.totalQuizzes'), 
        value: dynamicQuizMetrics.totalQuizzes, 
        max: 50, 
        trend: 'up' 
      },
      { 
        name: t('metrics.averageScore'), 
        value: dynamicQuizMetrics.averageScore, 
        unit: '%', 
        max: 100, 
        trend: 'up' 
      },
      { 
        name: t('metrics.totalQuestions'), 
        value: dynamicQuizMetrics.totalQuestions, 
        max: 500, 
        trend: 'steady' 
      }
    ]
  },
  {
    id: 'mock',
    title: t('performance.mock'),
    icon: <Clock size={24} />,
    metrics: [
      { 
        name: t('metrics.totalTests'), 
        value: dynamicMockMetrics.totalTests, 
        max: 10, 
        trend: 'up' 
      },
      { 
        name: t('metrics.averageScore'), 
        value: dynamicMockMetrics.averageScore, 
        unit: '%', 
        max: 100, 
        trend: 'up' 
      },
      { 
        name: t('metrics.totalQuestions'), 
        value: dynamicMockMetrics.totalQuestions, 
        max: 1000, 
        trend: 'steady' 
      }
    ]
  }
];
```

---

### 2. **FRONTEND: Utility Functions**
**File**: `frontend/src/utils/quizTracking.js`

#### Key Functions:

**A. Get Recent Quiz Attempts** (Lines 80-90):
```javascript
export const getRecentQuizAttempts = async (limit = 10) => {
  try {
    console.log('🔍 Debug - Calling getRecentQuizAttempts...');
    const response = await quizTrackingAPI.getRecentAttempts(limit);
    console.log('🔍 Debug - getRecentQuizAttempts response:', response);
    return response; // Returns parsed data from API
  } catch (error) {
    console.error('❌ Error fetching recent quiz attempts:', error);
    throw error;
  }
};
```

**B. Get Student Performance** (Lines 52-62):
```javascript
export const getStudentPerformance = async () => {
  try {
    console.log('🔍 Debug - Calling getStudentPerformance...');
    const response = await quizTrackingAPI.getPerformance();
    console.log('🔍 Debug - getStudentPerformance response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error fetching student performance:', error);
    throw error;
  }
};
```

---

### 3. **FRONTEND: API Configuration**
**File**: `frontend/src/config/api.js`

#### Key Configuration:

**A. Quiz Tracking API** (Lines 336-362):
```javascript
export const quizTrackingAPI = {
  // Get recent quiz attempts
  getRecentAttempts: async (limit = 10) => {
    const url = `${API_CONFIG.DJANGO.QUIZZES.RECENT_ATTEMPTS}?limit=${limit}`;
    console.log('🔍 Debug - getRecentAttempts URL:', url);
    return await djangoAPI.get(url);
  },
  
  // Get student performance
  getPerformance: async () => {
    const url = API_CONFIG.DJANGO.QUIZZES.PERFORMANCE;
    console.log('🔍 Debug - getPerformance URL:', url);
    return await djangoAPI.get(url);
  },
  
  // Get detailed statistics
  getStatistics: async () => {
    const url = API_CONFIG.DJANGO.QUIZZES.STATISTICS;
    console.log('🔍 Debug - getStatistics URL:', url);
    return await djangoAPI.get(url);
  },
};
```

**B. API Endpoints** (Lines 56-59):
```javascript
QUIZZES: {
  // ... other endpoints
  RECENT_ATTEMPTS: `${DJANGO_BASE_URL}/quizzes/recent-attempts/`,
  PERFORMANCE: `${DJANGO_BASE_URL}/quizzes/performance/`,
  STATISTICS: `${DJANGO_BASE_URL}/quizzes/statistics/`,
}
```

---

### 4. **BACKEND: URL Routing**
**File**: `backend/quizzes/urls.py`

#### URL Patterns (Lines 30-33):
```python
urlpatterns = [
    # ... other patterns
    path('recent-attempts/', views.get_recent_quiz_attempts, name='recent_quiz_attempts'),
    path('child-attempts/', views.get_child_quiz_attempts, name='child_quiz_attempts'),
    path('performance/', views.get_student_performance, name='student_performance'),
    path('statistics/', views.get_quiz_statistics, name='quiz_statistics'),
]
```

**Full URL**: `/api/quizzes/recent-attempts/` and `/api/quizzes/performance/`

---

### 5. **BACKEND: View Functions**
**File**: `backend/quizzes/views.py`

#### A. Get Recent Quiz Attempts (Lines 963-1044):

```python
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_recent_quiz_attempts(request):
    """
    Get recent quiz and mock test attempts for the logged-in student
    """
    limit = request.query_params.get('limit', 10)
    try:
        limit = int(limit)
    except ValueError:
        limit = 10
    
    # Get student registration
    student_reg = get_student_registration(request.user)
    if not student_reg:
        return Response({
            'error': 'Student registration not found. Please complete your registration first.'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # ⭐ KEY: Query quiz_attempt table
    quiz_attempts = QuizAttempt.objects.filter(
        student_id=student_reg
    ).order_by('-attempted_at')
    
    # ⭐ KEY: Query mock_test_attempt table
    mock_test_attempts = MockTestAttempt.objects.filter(
        student_id=student_reg
    ).order_by('-attempted_at')
    
    # Combine and sort by attempted_at, then limit
    all_attempts = []
    
    # Add quiz attempts with type indicator
    for attempt in quiz_attempts:
        all_attempts.append({
            'attempt_id': attempt.attempt_id,
            'type': 'quiz',
            'quiz_type': attempt.quiz_type,
            'class_name': attempt.class_name or 'Unknown Class',
            'subject': attempt.subject or 'Unknown Subject',
            'chapter': attempt.chapter or 'Unknown Chapter',
            'subtopic': attempt.subtopic or 'Unknown Topic',
            'score': attempt.score,  # ⭐ Quiz mark
            'total_questions': attempt.total_questions,  # ⭐ Total questions
            'correct_answers': attempt.correct_answers,
            'attempted_at': attempt.attempted_at,
            'completion_percentage': getattr(attempt, 'completion_percentage', None)
        })
    
    # Add mock test attempts with type indicator
    for attempt in mock_test_attempts:
        all_attempts.append({
            'attempt_id': attempt.attempt_id,
            'type': 'mock_test',
            'quiz_type': 'mock_test',
            'class_name': getattr(attempt, 'class_name', None) or 'Unknown Class',
            'subject': getattr(attempt, 'subject', None) or 'Mock Test',
            'subtopic': getattr(attempt, 'subtopic', None) or 'Mock Test',
            'score': attempt.score,  # ⭐ Mock test mark
            'total_questions': attempt.total_questions,  # ⭐ Total questions
            'correct_answers': getattr(attempt, 'correct_answers', None),
            'attempted_at': attempt.attempted_at,
            'completion_percentage': None
        })
    
    # Sort by attempted_at (most recent first) and limit
    all_attempts.sort(key=lambda x: x['attempted_at'], reverse=True)
    all_attempts = all_attempts[:limit]
    
    return Response({
        'attempts': all_attempts,
        'total_count': len(all_attempts),
        'quiz_count': len([a for a in all_attempts if a['type'] == 'quiz']),
        'mock_test_count': len([a for a in all_attempts if a['type'] == 'mock_test'])
    })
```

#### B. Get Student Performance (Lines 1158-1319):

```python
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_student_performance(request):
    """
    Get student performance statistics from actual quiz and mock test attempts
    """
    # Get student registration
    student_reg = get_student_registration(request.user)
    if not student_reg:
        return Response({
            'error': 'Student registration not found. Please complete your registration first.'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # ⭐ KEY: Query quiz_attempt table
    quiz_attempts = QuizAttempt.objects.filter(student_id=student_reg)
    
    # ⭐ KEY: Query mock_test_attempt table
    mock_test_attempts = MockTestAttempt.objects.filter(student_id=student_reg)
    
    # Calculate performance metrics
    total_quizzes_attempted = quiz_attempts.count()
    total_mock_tests_attempted = mock_test_attempts.count()
    
    # Calculate total questions answered
    total_questions_answered = sum(
        attempt.total_questions or 0 for attempt in quiz_attempts
    )
    mock_test_questions_answered = sum(
        attempt.total_questions or 0 for attempt in mock_test_attempts
    )
    
    # Calculate average scores
    quiz_scores = [attempt.score for attempt in quiz_attempts if attempt.score]
    mock_test_scores = [attempt.score for attempt in mock_test_attempts if attempt.score]
    
    quiz_average_score = sum(quiz_scores) / len(quiz_scores) if quiz_scores else 0
    mock_test_average_score = sum(mock_test_scores) / len(mock_test_scores) if mock_test_scores else 0
    
    # Calculate overall average score
    all_scores = quiz_scores + mock_test_scores
    if all_scores:
        overall_average_score = sum(all_scores) / len(all_scores)
    else:
        overall_average_score = 0
    
    # Return performance data
    performance_data = {
        'total_quizzes_attempted': total_quizzes_attempted,
        'total_mock_tests_attempted': total_mock_tests_attempted,
        'total_attempts': total_quizzes_attempted + total_mock_tests_attempted,
        'total_questions_answered': total_questions_answered,
        'overall_average_score': round(overall_average_score, 2),
        # Separate quiz and mock test metrics
        'quiz_average_score': round(quiz_average_score, 2),
        'mock_test_average_score': round(mock_test_average_score, 2),
        'mock_test_questions_answered': mock_test_questions_answered,
        # ... subject_wise_performance, class_wise_performance, etc.
    }
    
    return Response(performance_data)
```

---

### 6. **BACKEND: Database Models**
**File**: `backend/quizzes/models.py`

#### A. QuizAttempt Model (Lines 46-112):

```python
class QuizAttempt(models.Model):
    """
    Quiz Attempt model - stores quiz marks and attempts
    """
    attempt_id = models.AutoField(primary_key=True)
    quiz_id = models.ForeignKey(Quiz, on_delete=models.CASCADE, null=True, blank=True)
    student_id = models.ForeignKey('authentication.StudentRegistration', on_delete=models.CASCADE)
    attempted_at = models.DateTimeField(auto_now_add=True)
    score = models.FloatField(null=True, blank=True)  # ⭐ Quiz mark stored here
    answers_json = models.TextField(null=True, blank=True)
    
    # Quiz details
    total_questions = models.PositiveIntegerField(default=0)  # ⭐ Total questions
    correct_answers = models.PositiveIntegerField(default=0)
    wrong_answers = models.PositiveIntegerField(default=0)
    unanswered_questions = models.PositiveIntegerField(default=0)
    
    # Additional fields
    subject = models.CharField(max_length=100, null=True, blank=True)
    chapter = models.CharField(max_length=100, null=True, blank=True)
    topic = models.CharField(max_length=200, null=True, blank=True)
    subtopic = models.CharField(max_length=200, null=True, blank=True)
    class_name = models.CharField(max_length=50, null=True, blank=True)
    difficulty_level = models.CharField(max_length=20, default='simple')
    quiz_type = models.CharField(max_length=20, default='ai_generated')
    
    class Meta:
        db_table = 'quiz_attempt'  # ⭐ Database table name
        verbose_name = 'Quiz Attempt'
        verbose_name_plural = 'Quiz Attempts'
        ordering = ['-attempted_at']
```

#### B. MockTestAttempt Model (Lines 162-198):

```python
class MockTestAttempt(models.Model):
    """
    Mock Test Attempt model - stores mock test marks and attempts
    """
    attempt_id = models.AutoField(primary_key=True)
    test_id = models.ForeignKey(MockTest, on_delete=models.CASCADE)
    student_id = models.ForeignKey('authentication.StudentRegistration', on_delete=models.CASCADE)
    attempted_at = models.DateTimeField(auto_now_add=True)
    score = models.FloatField(null=True, blank=True)  # ⭐ Mock test mark stored here
    
    # Additional fields to match quiz_attempt table
    total_questions = models.IntegerField(null=True, blank=True)  # ⭐ Total questions
    correct_answers = models.IntegerField(null=True, blank=True)
    wrong_answers = models.IntegerField(null=True, blank=True)
    unanswered_questions = models.IntegerField(null=True, blank=True)
    
    # Subject and topic information
    subject = models.CharField(max_length=100, null=True, blank=True)
    chapter = models.CharField(max_length=100, null=True, blank=True)
    topic = models.CharField(max_length=100, null=True, blank=True)
    subtopic = models.CharField(max_length=100, null=True, blank=True)
    class_name = models.CharField(max_length=50, null=True, blank=True)
    
    class Meta:
        db_table = 'mock_test_attempt'  # ⭐ Database table name
        verbose_name = 'Mock Test Attempt'
        verbose_name_plural = 'Mock Test Attempts'
        ordering = ['-attempted_at']
```

---

### 7. **DATABASE: PostgreSQL Tables**

#### A. quiz_attempt Table:
```sql
CREATE TABLE quiz_attempt (
    attempt_id SERIAL PRIMARY KEY,
    quiz_id INTEGER,
    student_id INTEGER NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score FLOAT,  -- ⭐ Quiz mark stored here
    total_questions INTEGER DEFAULT 0,  -- ⭐ Total questions stored here
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    unanswered_questions INTEGER DEFAULT 0,
    subject VARCHAR(100),
    chapter VARCHAR(100),
    topic VARCHAR(200),
    subtopic VARCHAR(200),
    class_name VARCHAR(50),
    difficulty_level VARCHAR(20) DEFAULT 'simple',
    quiz_type VARCHAR(20) DEFAULT 'ai_generated',
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);
```

#### B. mock_test_attempt Table:
```sql
CREATE TABLE mock_test_attempt (
    attempt_id SERIAL PRIMARY KEY,
    test_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score FLOAT,  -- ⭐ Mock test mark stored here
    total_questions INTEGER,  -- ⭐ Total questions stored here
    correct_answers INTEGER,
    wrong_answers INTEGER,
    unanswered_questions INTEGER,
    subject VARCHAR(100),
    chapter VARCHAR(100),
    topic VARCHAR(100),
    subtopic VARCHAR(100),
    class_name VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id),
    FOREIGN KEY (test_id) REFERENCES mock_test(test_id)
);
```

---

## 📋 Summary: Complete Flow

1. **Frontend Career Page** (`Career.jsx`) calls `getRecentQuizAttempts(10)`
2. **Frontend Utility** (`quizTracking.js`) calls `quizTrackingAPI.getRecentAttempts(limit)`
3. **Frontend API Config** (`api.js`) makes HTTP GET request to `/api/quizzes/recent-attempts/?limit=10`
4. **Backend URL Router** (`urls.py`) routes request to `views.get_recent_quiz_attempts`
5. **Backend View** (`views.py`) queries:
   - `QuizAttempt.objects.filter(student_id=student_reg)` → Gets quiz marks from `quiz_attempt` table
   - `MockTestAttempt.objects.filter(student_id=student_reg)` → Gets mock test marks from `mock_test_attempt` table
6. **Backend Models** (`models.py`) map to database tables:
   - `QuizAttempt` → `quiz_attempt` table
   - `MockTestAttempt` → `mock_test_attempt` table
7. **Database** returns data with `score` (marks) and `total_questions` fields
8. **Backend View** processes and returns JSON response with attempts array
9. **Frontend** receives data, calculates metrics (average score, total quizzes/tests, total questions)
10. **Frontend** displays metrics in the career page boards

---

## 🔑 Key Fields Used

### From `quiz_attempt` table:
- `score` → Quiz mark
- `total_questions` → Total questions in quiz
- `correct_answers` → Correct answers count
- `attempted_at` → When quiz was taken

### From `mock_test_attempt` table:
- `score` → Mock test mark
- `total_questions` → Total questions in mock test
- `correct_answers` → Correct answers count
- `attempted_at` → When mock test was taken

---

## 📝 Files Involved

### Frontend:
1. `frontend/src/modules/student/Career.jsx` - Main component displaying boards
2. `frontend/src/utils/quizTracking.js` - Utility functions for API calls
3. `frontend/src/config/api.js` - API endpoint configuration

### Backend:
1. `backend/quizzes/urls.py` - URL routing
2. `backend/quizzes/views.py` - View functions that query database
3. `backend/quizzes/models.py` - Database models

### Database:
1. `quiz_attempt` table - Stores quiz marks and attempts
2. `mock_test_attempt` table - Stores mock test marks and attempts

---

## 🎯 Logic Summary

**The logic is:**
1. Frontend fetches recent attempts from both tables via API
2. Backend queries both `quiz_attempt` and `mock_test_attempt` tables filtered by `student_id`
3. Backend combines results and adds `type` field ('quiz' or 'mock_test')
4. Backend calculates aggregated metrics (average scores, totals, etc.)
5. Frontend receives data and calculates display metrics
6. Frontend displays metrics in the three career boards (Academic, Quiz, Mock Test)

