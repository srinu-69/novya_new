#!/usr/bin/env python3
"""
Script to generate complete Frontend-Backend Connections Documentation
"""

doc_content = """## 📚 Course Management Connections

### List All Courses

**Frontend File**: `novya-frontend-main/src/modules/student/Courses.jsx`

**Backend File**: `backend/courses/views.py` → `CourseListCreateView`

**Connection Flow**:
1. Student clicks "Courses" page
2. Frontend calls `API_CONFIG.DJANGO.COURSES.LIST` (`http://localhost:8001/api/courses/`)
3. Uses `djangoAPI.get()` with auth token
4. Backend queries database for all courses
5. Backend returns list of courses with details
6. Frontend displays courses in cards/list

**Backend URL**: `backend/courses/urls.py` → `path('', views.CourseListCreateView.as_view())`
**Main URL Config**: `backend/config/urls.py` → `path('api/courses/', include('courses.urls'))`

---

### Course Details

**Frontend File**: `novya-frontend-main/src/modules/student/CourseDetails.jsx`

**Backend File**: `backend/courses/views.py` → `CourseDetailView`

**Connection Flow**:
1. Student clicks on a course
2. Frontend calls `API_CONFIG.DJANGO.COURSES.DETAIL(courseId)` (`http://localhost:8001/api/courses/1/`)
3. Backend returns full course details (chapters, lessons, materials)
4. Frontend displays course information

**Backend URL**: `backend/courses/urls.py` → `path('<int:pk>/', views.CourseDetailView.as_view())`

---

### Enroll in Course

**Frontend File**: `novya-frontend-main/src/modules/student/CourseDetails.jsx` or `Courses.jsx`

**Backend File**: `backend/courses/views.py` → `CourseEnrollmentView`

**Connection Flow**:
1. Student clicks "Enroll" button
2. Frontend calls `API_CONFIG.DJANGO.COURSES.ENROLL(courseId)` with POST request
3. Uses `djangoAPI.post()` helper
4. Backend creates enrollment record in database
5. Backend returns success message
6. Frontend updates UI to show enrolled status

**Backend URL**: `backend/courses/urls.py` → `path('<int:pk>/enroll/', views.CourseEnrollmentView.as_view())`

---

### My Courses (Student's Enrolled Courses)

**Frontend File**: `novya-frontend-main/src/modules/student/DashboardHome.jsx` or similar

**Backend File**: `backend/courses/views.py` → `StudentCourseListView`

**Connection Flow**:
1. Student dashboard loads
2. Frontend calls `API_CONFIG.DJANGO.COURSES.MY_COURSES` (`http://localhost:8001/api/courses/my-courses/`)
3. Backend filters courses by current user's enrollments
4. Backend returns only enrolled courses
5. Frontend displays student's courses

**Backend URL**: `backend/courses/urls.py` → `path('my-courses/', views.StudentCourseListView.as_view())`

---

## 🎯 Quiz & Mock Test Connections

### Quick Practice - Get Classes

**Frontend File**: `novya-frontend-main/src/modules/student/QuickPractice.jsx`

**Backend File**: `backend/ai_backend/app.py` → `/classes` endpoint

**Connection Flow**:
1. Student opens Quick Practice page
2. Frontend calls `API_CONFIG.FASTAPI.QUICK_PRACTICE.GET_CLASSES` (`http://localhost:8000/classes`)
3. Uses `fastAPI.get()` helper (no auth needed)
4. FastAPI backend returns available classes: `["7th", "8th", "9th", "10th"]`
5. Frontend displays class buttons

**Backend Code**: FastAPI endpoint in `backend/ai_backend/app.py`

---

### Quick Practice - Get Subjects (Chapters)

**Frontend File**: `novya-frontend-main/src/modules/student/QuickPractice.jsx`

**Backend File**: `backend/ai_backend/app.py` → `/chapters` endpoint

**Connection Flow**:
1. Student selects a class (e.g., "7th")
2. Frontend calls `API_CONFIG.FASTAPI.QUICK_PRACTICE.GET_CHAPTERS("7th")` 
   - URL: `http://localhost:8000/chapters?class_name=7th`
3. FastAPI returns subjects for that class: `["Mathematics", "Science", "English", ...]`
4. Frontend displays subject buttons

---

### Quick Practice - Get Subtopics

**Frontend File**: `novya-frontend-main/src/modules/student/QuickPractice.jsx`

**Backend File**: `backend/ai_backend/app.py` → `/subtopics` endpoint

**Connection Flow**:
1. Student selects a subject (e.g., "Mathematics")
2. Frontend calls `API_CONFIG.FASTAPI.QUICK_PRACTICE.GET_SUBTOPICS("7th", "Mathematics")`
   - URL: `http://localhost:8000/subtopics?class_name=7th&subject=Mathematics`
3. FastAPI returns topics/chapters for that subject
4. Frontend displays subtopic buttons

---

### Quick Practice - Generate Quiz (AI Generated)

**Frontend File**: `novya-frontend-main/src/modules/student/QuickPractice.jsx`

**Backend File**: `backend/ai_backend/app.py` → `/quiz` endpoint

**Connection Flow**:
1. Student selects a subtopic and clicks "Start Quiz"
2. Frontend calls `API_CONFIG.FASTAPI.QUICK_PRACTICE.GENERATE_QUIZ(params)`
   - URL: `http://localhost:8000/quiz?subtopic=Fractions&currentLevel=1&language=English`
3. FastAPI uses AI (OpenRouter/Gemini) to generate 10 MCQ questions
4. FastAPI returns quiz data with questions, options, answers
5. Frontend displays quiz to student
6. Student answers questions
7. **After completion**: Frontend saves attempt to Django backend (see Quiz Tracking below)

**Backend Code**: FastAPI endpoint that calls OpenRouter API to generate questions

---

### Mock Test - Generate Test

**Frontend File**: `novya-frontend-main/src/modules/student/MockTest.jsx`

**Backend File**: `backend/ai_backend/app.py` → `/mock_test` endpoint

**Connection Flow**:
1. Student selects class, subject, chapter for mock test
2. Frontend calls `API_CONFIG.FASTAPI.MOCK_TEST.GENERATE_TEST(params)`
   - URL: `http://localhost:8000/mock_test?class_name=10th&subject=Mathematics&chapter=Algebra`
3. FastAPI generates 50 MCQ questions using AI
4. FastAPI returns mock test data
5. Frontend displays 50-question mock test
6. **After completion**: Frontend saves attempt to Django backend

---

### Submit Quiz Attempt to Database

**Frontend File**: `novya-frontend-main/src/modules/student/QuickPractice.jsx` (after quiz completion)

**Helper File**: `novya-frontend-main/src/utils/quizTracking.js` → `submitQuizAttempt()`

**Backend File**: `backend/quizzes/views.py` → `submit_quiz_attempt()`

**Connection Flow**:
1. Student completes Quick Practice quiz
2. Frontend calculates score and collects answers
3. Frontend calls `submitQuizAttempt()` from `quizTracking.js`
4. Helper function calls `quizTrackingAPI.submitAttempt()` from `api.js`
5. This calls `API_CONFIG.DJANGO.QUIZZES.SUBMIT_ATTEMPT` (`http://localhost:8001/api/quizzes/submit-attempt/`)
6. Uses `djangoAPI.post()` with auth token
7. Backend saves quiz attempt to database with:
   - User ID
   - Quiz questions and answers
   - Score
   - Timestamp
   - Quiz type ("quick_practice")
8. Backend returns saved attempt ID

**Backend URL**: `backend/quizzes/urls.py` → `path('submit-attempt/', views.submit_quiz_attempt)`

**API Config**: `novya-frontend-main/src/config/api.js` → `quizTrackingAPI.submitAttempt()`

---

### Submit Mock Test Attempt to Database

**Frontend File**: `novya-frontend-main/src/modules/student/MockTest.jsx`

**Helper File**: `novya-frontend-main/src/utils/quizTracking.js` → `submitMockTestAttempt()`

**Backend File**: `backend/quizzes/views.py` → `submit_mock_test_attempt()`

**Connection Flow**:
1. Student completes Mock Test (50 questions)
2. Frontend collects all answers and calculates score
3. Frontend calls `submitMockTestAttempt()` from `quizTracking.js`
4. Helper calls `API_CONFIG.DJANGO.QUIZZES.SUBMIT_MOCK_TEST`
5. Backend saves mock test attempt to database
6. Backend returns saved attempt

**Backend URL**: `backend/quizzes/urls.py` → `path('submit-mock-test/', views.submit_mock_test_attempt)`

---

### Get Student Performance Data

**Frontend File**: `novya-frontend-main/src/modules/student/Career.jsx`

**Helper File**: `novya-frontend-main/src/utils/quizTracking.js` → `getStudentPerformance()`

**Backend File**: `backend/quizzes/views.py` → `get_student_performance()`

**Connection Flow**:
1. Career/Performance page loads
2. Frontend calls `getStudentPerformance()` helper
3. Helper calls `API_CONFIG.DJANGO.QUIZZES.PERFORMANCE` (`http://localhost:8001/api/quizzes/performance/`)
4. Uses `djangoAPI.get()` with auth token
5. Backend calculates performance stats:
   - Total quizzes attempted
   - Average score
   - Performance by level/difficulty
   - Recent activity
6. Backend returns performance data
7. Frontend displays charts and statistics

**Backend URL**: `backend/quizzes/urls.py` → `path('performance/', views.get_student_performance)`

---

### Get Recent Quiz Attempts

**Frontend File**: `novya-frontend-main/src/modules/student/Career.jsx`

**Helper File**: `novya-frontend-main/src/utils/quizTracking.js` → `getRecentQuizAttempts()`

**Backend File**: `backend/quizzes/views.py` → `get_recent_quiz_attempts()`

**Connection Flow**:
1. Career page loads
2. Frontend calls `getRecentQuizAttempts(50)` to get last 50 attempts
3. Helper calls `API_CONFIG.DJANGO.QUIZZES.RECENT_ATTEMPTS`
4. Backend queries database for user's recent quiz/mock test attempts
5. Backend returns list of attempts with scores, dates, types
6. Frontend displays attempt history

**Backend URL**: `backend/quizzes/urls.py` → `path('recent-attempts/', views.get_recent_quiz_attempts)`

---

### Get Child Quiz Attempts (Parent View)

**Frontend File**: `novya-frontend-main/src/modules/parent/QuizReports.jsx`

**Backend File**: `backend/quizzes/views.py` → `get_child_quiz_attempts()`

**Connection Flow**:
1. Parent opens Quiz Reports page
2. Frontend calls `API_CONFIG.DJANGO.QUIZZES.CHILD_ATTEMPTS` (`http://localhost:8001/api/quizzes/child-attempts/`)
3. Uses `djangoAPI.get()` with parent's auth token
4. Backend finds parent's children from database
5. Backend retrieves all quiz attempts for those children
6. Backend returns attempts grouped by child
7. Frontend displays quiz reports for each child

**Backend URL**: `backend/quizzes/urls.py` → `path('child-attempts/', views.get_child_quiz_attempts)`

---

## 🤖 AI Assistant Connections

### AI Chat (Conversational Tutor)

**Frontend File**: `novya-frontend-main/src/modules/student/LessonPage.jsx`

**Backend Files**: 
- **FastAPI**: `backend/ai_backend/app.py` → `/ai-assistant/chat` (generates AI response)
- **Django**: `backend/ai_assistant/views.py` → `save_chat_message()` (saves to database)

**Connection Flow - Getting AI Response**:
1. Student types question in chat box
2. Frontend calls `API_CONFIG.FASTAPI.AI_ASSISTANT.CHAT` (`http://localhost:8000/ai-assistant/chat`)
3. Uses `fastAPI.post()` (no auth needed for FastAPI)
4. FastAPI sends question to OpenRouter API (Gemini AI)
5. AI generates answer
6. FastAPI returns AI response
7. Frontend displays response in chat

**Connection Flow - Saving Chat to Database**:
1. After receiving AI response, frontend calls `API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_CHAT_MESSAGE`
2. Uses `djangoAPI.post()` with auth token
3. Backend saves chat message to database:
   - User ID
   - User message
   - AI response
   - Timestamp
   - Class, subject, chapter context
4. Chat history is now saved permanently

**FastAPI Backend**: `backend/ai_backend/app.py` → Chat endpoint
**Django Backend URL**: `backend/ai_assistant/urls.py` → `path('save-chat-message/', views.save_chat_message)`
**Main URL Config**: `backend/config/urls.py` → `path('api/ai-assistant/', include('ai_assistant.urls'))`

---

### Get Chat History

**Frontend File**: `novya-frontend-main/src/modules/student/LessonPage.jsx`

**Backend File**: `backend/ai_assistant/views.py` → `get_chat_history()`

**Connection Flow**:
1. Student opens lesson page
2. Frontend calls `API_CONFIG.DJANGO.AI_ASSISTANT.GET_CHAT_HISTORY` with query params
   - URL: `http://localhost:8001/api/ai-assistant/chat-history/?class_name=7th&subject=Mathematics&chapter=Fractions`
3. Backend queries database for saved chat messages matching filters
4. Backend returns chat history
5. Frontend displays previous conversations

**Backend URL**: `backend/ai_assistant/urls.py` → `path('chat-history/', views.get_chat_history)`

---

### Generate Study Plan (AI)

**Frontend File**: `novya-frontend-main/src/modules/student/LessonPage.jsx` or Study Planner component

**Backend Files**:
- **FastAPI**: `backend/ai_backend/app.py` → `/ai-assistant/generate-study-plan` (generates plan)
- **Django**: `backend/ai_assistant/views.py` → `save_ai_study_plan()` (saves to database)

**Connection Flow - Generate Plan**:
1. Student clicks "Generate Study Plan"
2. Frontend calls `API_CONFIG.FASTAPI.AI_ASSISTANT.GENERATE_STUDY_PLAN`
3. FastAPI uses AI to create personalized study schedule
4. FastAPI returns study plan with tasks and timeline
5. Frontend displays study plan

**Connection Flow - Save Plan**:
1. After generating, frontend calls `API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_STUDY_PLAN`
2. Backend saves study plan to database
3. Study plan is now accessible across sessions

**FastAPI Backend**: `backend/ai_backend/app.py`
**Django Backend URL**: `backend/ai_assistant/urls.py` → `path('save-study-plan/', views.save_ai_study_plan)`

---

### Generate AI Notes

**Frontend File**: `novya-frontend-main/src/modules/student/LessonPage.jsx`

**Backend Files**:
- **FastAPI**: `backend/ai_backend/app.py` → `/ai-assistant/generate-notes` (generates notes)
- **Django**: `backend/ai_assistant/views.py` → `save_ai_generated_note()` (saves to database)

**Connection Flow - Generate Notes**:
1. Student clicks "Generate Notes" for a chapter
2. Frontend calls `API_CONFIG.FASTAPI.AI_ASSISTANT.GENERATE_NOTES`
3. FastAPI uses AI to create chapter summary and key concepts
4. FastAPI returns formatted notes
5. Frontend displays notes

**Connection Flow - Save Notes**:
1. Frontend calls `API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_AI_NOTE`
2. Backend saves AI-generated notes to database
3. Notes are now saved permanently

---

### Save Manual Note (Sticky Note)

**Frontend File**: `novya-frontend-main/src/modules/student/LessonPage.jsx`

**Backend File**: `backend/ai_assistant/views.py` → `save_manual_note()`

**Connection Flow**:
1. Student creates a sticky note manually
2. Frontend calls `API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_MANUAL_NOTE`
3. Uses `djangoAPI.post()` with auth token
4. Backend saves note to database:
   - Note content
   - Position (x, y coordinates)
   - User ID
   - Class, subject, chapter context
5. Note is saved permanently

**Backend URL**: `backend/ai_assistant/urls.py` → `path('save-manual-note/', views.save_manual_note)`

---

### Get Manual Notes

**Frontend File**: `novya-frontend-main/src/modules/student/LessonPage.jsx`

**Backend File**: `backend/ai_assistant/views.py` → `get_manual_notes()`

**Connection Flow**:
1. Lesson page loads
2. Frontend calls `API_CONFIG.DJANGO.AI_ASSISTANT.GET_MANUAL_NOTES` with filters
3. Backend returns saved sticky notes for current chapter
4. Frontend displays notes at saved positions

**Backend URL**: `backend/ai_assistant/urls.py` → `path('manual-notes/', views.get_manual_notes)`

---

## 📊 Progress Tracking Connections

### Get Student Progress

**Frontend File**: `novya-frontend-main/src/modules/student/Progress.jsx` or Dashboard

**Backend File**: `backend/progress/views.py` → `get_student_progress()` or `get_my_progress()`

**Connection Flow**:
1. Student opens Progress page
2. Frontend calls `API_CONFIG.DJANGO.PROGRESS.OVERVIEW` or similar endpoint
3. Backend calculates progress statistics:
   - Course completion percentages
   - Lessons completed
   - Time spent
   - Achievements
4. Backend returns progress data
5. Frontend displays progress charts

**Backend URL**: `backend/progress/urls.py` → Check progress endpoints
**Main URL Config**: `backend/config/urls.py` → `path('api/progress/', include('progress.urls'))`

---

### Get Attendance Summary

**Frontend File**: `novya-frontend-main/src/modules/student/Attendance.jsx`

**Backend File**: `backend/progress/views.py` → `get_attendance_summary()`

**Connection Flow**:
1. Student opens Attendance page
2. Frontend calls attendance endpoint
3. Backend returns attendance records
4. Frontend displays attendance calendar/stats

**Backend URL**: `backend/progress/urls.py` → `path('attendance/summary/', views.get_attendance_summary)`

---

## 👨‍👩‍👧 Parent Dashboard Connections

### Get Parent Dashboard Data

**Frontend File**: `novya-frontend-main/src/modules/parent/ParentDashboard.jsx`

**Backend File**: `backend/progress/views.py` → `get_parent_dashboard()`

**Connection Flow**:
1. Parent logs in and dashboard loads
2. Frontend calls parent profile endpoint or dashboard endpoint
3. Backend retrieves:
   - Parent profile data
   - Children list
   - Children's progress summaries
   - Recent activities
4. Backend returns dashboard data
5. Frontend displays parent dashboard

**Backend URL**: `backend/progress/urls.py` → `path('parent-dashboard/', views.get_parent_dashboard)`

---

### Get Child Mock Test Reports

**Frontend File**: `novya-frontend-main/src/modules/parent/MockTestReports.jsx`

**Backend File**: `backend/quizzes/views.py` → `get_child_quiz_attempts()` (filters by type="mock_test")

**Connection Flow**:
1. Parent opens Mock Test Reports
2. Frontend calls same endpoint as quiz reports but filters for mock tests
3. Backend returns only mock test attempts
4. Frontend displays mock test performance

---

## 🔔 Notifications Connections

### Get Student Notifications

**Frontend File**: Notification component or header

**Backend File**: `backend/notifications/views.py` → Student notification views

**Connection Flow**:
1. App loads or notification bell clicked
2. Frontend calls `API_CONFIG.DJANGO.NOTIFICATIONS.GET_STUDENT_NOTIFICATIONS`
3. Backend returns unread notifications for user
4. Frontend displays notification count and list

**Backend URL**: `backend/notifications/urls.py` → Check student notification endpoints
**Main URL Config**: `backend/config/urls.py` → `path('api/notifications/', include('notifications.urls'))`

---

### Mark Notification as Read

**Frontend File**: Notification component

**Backend File**: `backend/notifications/views.py` → Mark read view

**Connection Flow**:
1. Student clicks on notification
2. Frontend calls `API_CONFIG.DJANGO.NOTIFICATIONS.MARK_STUDENT_NOTIFICATION_READ(id)`
3. Backend updates notification status to "read" in database
4. Backend returns success

---

## 🔧 Helper Functions & Utilities

### API Helper Functions

**File**: `novya-frontend-main/src/config/api.js`

**Functions**:

1. **`djangoAPI.get(url)`**
   - **What it does**: Makes GET request to Django backend
   - **How**: Adds auth token from localStorage automatically
   - **Used by**: All components that need to fetch data from Django

2. **`djangoAPI.post(url, data)`**
   - **What it does**: Makes POST request to Django backend
   - **How**: Adds auth token and sends JSON data
   - **Used by**: Components that create/update data

3. **`djangoAPI.postNoAuth(url, data)`**
   - **What it does**: Makes POST request WITHOUT auth token
   - **Used by**: Login and registration (no auth needed)

4. **`fastAPI.get(url)`**
   - **What it does**: Makes GET request to FastAPI backend
   - **Note**: No auth token needed for FastAPI
   - **Used by**: Quick Practice, Mock Test, AI Assistant

5. **`fastAPI.post(url, data)`**
   - **What it does**: Makes POST request to FastAPI backend
   - **Used by**: AI chat, study plan generation

6. **`getAuthHeaders()`**
   - **What it does**: Returns headers with auth token
   - **Used by**: `djangoAPI` helper functions

---

### Quiz Tracking Utilities

**File**: `novya-frontend-main/src/utils/quizTracking.js`

**Functions**:

1. **`submitQuizAttempt(quizData)`**
   - **What it does**: Submits Quick Practice quiz attempt to database
   - **Calls**: `quizTrackingAPI.submitAttempt()` from `api.js`
   - **Used by**: `QuickPractice.jsx` after quiz completion

2. **`submitMockTestAttempt(mockTestData)`**
   - **What it does**: Submits Mock Test attempt to database
   - **Calls**: `quizTrackingAPI.submitMockTest()` from `api.js`
   - **Used by**: `MockTest.jsx` after test completion

3. **`getStudentPerformance()`**
   - **What it does**: Gets student's overall performance stats
   - **Calls**: `quizTrackingAPI.getPerformance()` from `api.js`
   - **Used by**: `Career.jsx` performance page

4. **`getRecentQuizAttempts(limit)`**
   - **What it does**: Gets recent quiz/mock test attempts
   - **Calls**: `quizTrackingAPI.getRecentAttempts()` from `api.js`
   - **Used by**: `Career.jsx` to show attempt history

---

## 📁 File Structure Summary

### Frontend Files (`novya-frontend-main/src/`)

**Configuration**:
- `config/api.js` - All API endpoints and helper functions

**Utilities**:
- `utils/quizTracking.js` - Quiz tracking helper functions

**Authentication**:
- `modules/login/Login.js` - Login and registration page

**Student Pages**:
- `modules/student/QuickPractice.jsx` - Quick Practice quiz page
- `modules/student/MockTest.jsx` - Mock Test page
- `modules/student/Career.jsx` - Performance/career page
- `modules/student/LessonPage.jsx` - Lesson page with AI assistant
- `modules/student/Courses.jsx` - Course listing
- `modules/student/CourseDetails.jsx` - Course details
- `modules/student/DashboardHome.jsx` - Student dashboard
- `modules/student/ProfilePage.jsx` - Student profile
- `modules/student/Progress.jsx` - Progress tracking
- `modules/student/Attendance.jsx` - Attendance view

**Parent Pages**:
- `modules/parent/ParentDashboard.jsx` - Parent dashboard
- `modules/parent/ChildProfile.jsx` - Child profile view
- `modules/parent/QuizReports.jsx` - Quiz reports for children
- `modules/parent/MockTestReports.jsx` - Mock test reports
- `modules/parent/HomeWork.jsx` - Homework view
- `modules/parent/StudyPlanner.jsx` - Study planner view

---

### Backend Files (`backend/`)

**Main Configuration**:
- `config/urls.py` - Main URL routing (connects all apps)
- `config/settings.py` - Django settings

**Authentication App** (`authentication/`):
- `views.py` - Login, register, profile views
- `urls.py` - Authentication URL patterns
- `models.py` - User, Student, Parent models

**Courses App** (`courses/`):
- `views.py` - Course, chapter, lesson views
- `urls.py` - Course URL patterns
- `models.py` - Course, Chapter, Lesson models

**Quizzes App** (`quizzes/`):
- `views.py` - Quiz attempt tracking views
- `urls.py` - Quiz URL patterns
- `models.py` - Quiz, QuizAttempt models
- `static_quiz_views.py` - Static quiz views (7th class)
- `pdf_quiz_views.py` - PDF quiz views

**AI Assistant App** (`ai_assistant/`):
- `views.py` - Save/retrieve AI content views
- `urls.py` - AI Assistant URL patterns
- `models.py` - StudyPlan, Note, ChatHistory models

**Progress App** (`progress/`):
- `views.py` - Progress, attendance, assignments views
- `urls.py` - Progress URL patterns
- `models.py` - Progress, Attendance, Assignment models

**Notifications App** (`notifications/`):
- `views.py` - Notification views
- `urls.py` - Notification URL patterns
- `models.py` - Notification models

**FastAPI Backend** (`ai_backend/`):
- `app.py` - FastAPI application with AI endpoints
- Handles: Quiz generation, Mock test generation, AI chat, Study plan generation, Notes generation

---

## 🔄 Complete Data Flow Examples

### Example 1: Student Takes Quick Practice Quiz

1. **Frontend**: `QuickPractice.jsx` → User selects class, subject, subtopic
2. **Frontend**: Calls `API_CONFIG.FASTAPI.QUICK_PRACTICE.GENERATE_QUIZ()`
3. **FastAPI**: `backend/ai_backend/app.py` → `/quiz` endpoint generates questions using AI
4. **FastAPI**: Returns quiz data (10 questions)
5. **Frontend**: Displays quiz, student answers
6. **Frontend**: After completion, calls `submitQuizAttempt()` from `quizTracking.js`
7. **Helper**: `quizTracking.js` → Calls `quizTrackingAPI.submitAttempt()`
8. **Frontend**: `api.js` → Calls `API_CONFIG.DJANGO.QUIZZES.SUBMIT_ATTEMPT`
9. **Django**: `backend/quizzes/views.py` → `submit_quiz_attempt()` saves to database
10. **Django**: Returns saved attempt ID
11. **Frontend**: Shows results and saves attempt

---

### Example 2: Student Uses AI Chat in Lesson

1. **Frontend**: `LessonPage.jsx` → Student types question
2. **Frontend**: Calls `API_CONFIG.FASTAPI.AI_ASSISTANT.CHAT` with question
3. **FastAPI**: `backend/ai_backend/app.py` → `/ai-assistant/chat` sends to OpenRouter API
4. **AI Service**: OpenRouter/Gemini generates answer
5. **FastAPI**: Returns AI response
6. **Frontend**: Displays AI response in chat
7. **Frontend**: Calls `API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_CHAT_MESSAGE` to save chat
8. **Django**: `backend/ai_assistant/views.py` → `save_chat_message()` saves to database
9. **Django**: Returns saved message ID
10. **Future**: When student returns, chat history is loaded from database

---

### Example 3: Parent Views Child's Quiz Reports

1. **Frontend**: `QuizReports.jsx` → Parent dashboard loads
2. **Frontend**: Calls `API_CONFIG.DJANGO.QUIZZES.CHILD_ATTEMPTS` with parent's auth token
3. **Django**: `backend/quizzes/views.py` → `get_child_quiz_attempts()`
4. **Django**: Finds parent's children from database (Parent-Student relationship)
5. **Django**: Queries all quiz attempts for those children
6. **Django**: Calculates statistics (average scores, total attempts, etc.)
7. **Django**: Returns attempts grouped by child
8. **Frontend**: Displays quiz reports with charts and statistics for each child

---

## 🔑 Key Concepts

### Authentication Token Flow

1. **Login**: User logs in → Backend returns JWT token
2. **Storage**: Token saved in `localStorage` as `'userToken'`
3. **API Calls**: Every Django API call includes token in header: `Authorization: Bearer <token>`
4. **Validation**: Backend validates token on each request
5. **Expiration**: Token expires after set time → User must re-login

### Two Backend Architecture

- **Django Backend**: Handles database, authentication, data persistence
- **FastAPI Backend**: Handles AI features, no database (stateless)
- **Frontend**: Calls appropriate backend based on feature needed

### API Configuration Pattern

All API endpoints are defined in **one central file** (`novya-frontend-main/src/config/api.js`):
- Easy to change backend URLs
- Consistent naming
- Type-safe endpoint generation

---

## 📝 Summary

This documentation covers **all major connections** between frontend and backend:

✅ **Authentication** - Login, registration, profiles
✅ **Courses** - Listing, details, enrollment
✅ **Quizzes** - Quick Practice, Mock Tests, tracking
✅ **AI Assistant** - Chat, study plans, notes
✅ **Progress** - Tracking, attendance, assignments
✅ **Parent Dashboard** - Child monitoring
✅ **Notifications** - Student notifications

Each connection includes:
- Frontend file name
- Backend file name
- URL path
- Data flow explanation
- What data is sent/received

---

## 🎯 Quick Reference

**Django Backend Base URL**: `http://localhost:8001/api`
**FastAPI Backend Base URL**: `http://localhost:8000`

**API Config File**: `novya-frontend-main/src/config/api.js`
**Main URL Config**: `backend/config/urls.py`

**Helper Functions**: `novya-frontend-main/src/config/api.js` → `djangoAPI`, `fastAPI`
**Quiz Utilities**: `novya-frontend-main/src/utils/quizTracking.js`

---

*Document created: 2024*
*Last updated: 2024*
"""

# Append to the documentation file
with open("FRONTEND_BACKEND_CONNECTIONS_DOCUMENTATION.md", "a", encoding="utf-8") as f:
    f.write(doc_content)

print("Documentation appended successfully!")
