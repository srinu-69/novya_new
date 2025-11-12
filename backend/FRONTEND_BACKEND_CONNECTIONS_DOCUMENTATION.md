
---

##  Complete File Index

### Frontend Files (novya-frontend-main/src/)

**Configuration & Utilities**:
- `config/api.js` - Central API configuration with all endpoints and helper functions
- `utils/quizTracking.js` - Quiz tracking utility functions

**Authentication**:
- `modules/login/Login.js` - Login and registration page

**Student Module**:
- `modules/student/QuickPractice.jsx` - Quick Practice quiz interface
- `modules/student/MockTest.jsx` - Mock Test interface  
- `modules/student/Career.jsx` - Performance and career tracking page
- `modules/student/LessonPage.jsx` - Lesson page with AI assistant, notes, chat
- `modules/student/Courses.jsx` - Course listing page
- `modules/student/CourseDetails.jsx` - Individual course details page
- `modules/student/DashboardHome.jsx` - Student dashboard home
- `modules/student/ProfilePage.jsx` - Student profile management
- `modules/student/Progress.jsx` - Progress tracking page
- `modules/student/Attendance.jsx` - Attendance view

**Parent Module**:
- `modules/parent/ParentDashboard.jsx` - Parent main dashboard
- `modules/parent/ChildProfile.jsx` - View child profile
- `modules/parent/QuizReports.jsx` - View children's quiz reports
- `modules/parent/MockTestReports.jsx` - View children's mock test reports
- `modules/parent/HomeWork.jsx` - View children's homework
- `modules/parent/StudyPlanner.jsx` - View children's study plans

### Backend Files (backend/)

**Main Configuration**:
- `config/urls.py` - Main URL routing configuration
- `config/settings.py` - Django settings

**Authentication App** (`authentication/`):
- `views.py` - Authentication views (login, register, profile)
- `urls.py` - Authentication URL patterns
- `models.py` - User, Student, Parent models

**Courses App** (`courses/`):
- `views.py` - Course management views
- `urls.py` - Course URL patterns
- `models.py` - Course, Chapter, Lesson models

**Quizzes App** (`quizzes/`):
- `views.py` - Quiz attempt tracking views
- `urls.py` - Quiz URL patterns
- `models.py` - Quiz, QuizAttempt models
- `static_quiz_views.py` - Static quiz views (7th class)
- `pdf_quiz_views.py` - PDF quiz views

**AI Assistant App** (`ai_assistant/`):
- `views.py` - AI content save/retrieve views
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
- `app.py` - FastAPI application with all AI endpoints

---

##  How to Use This Documentation

1. **Find a Feature**: Look up the feature in the Table of Contents
2. **Understand the Connection**: Each section explains:
   - Which frontend file handles the UI
   - Which backend file handles the logic
   - What API endpoint is called
   - How data flows between frontend and backend
3. **Trace the Flow**: Follow the numbered steps to understand the complete flow
4. **Find Files**: Use the File Index to locate specific files quickly

---

*Document created: 2024*
*Covers all connections between novya-frontend-main and backend*
