# 🔗 Frontend-Backend Connections Documentation
## NOVYA Learning Platform - Complete Connection Guide

This document explains **every connection** between the frontend (`novya-frontend-main`) and backend in simple, easy-to-understand terms.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication Connections](#authentication-connections)
3. [Course Management Connections](#course-management-connections)
4. [Quiz & Mock Test Connections](#quiz--mock-test-connections)
5. [AI Assistant Connections](#ai-assistant-connections)
6. [Progress Tracking Connections](#progress-tracking-connections)
7. [Parent Dashboard Connections](#parent-dashboard-connections)
8. [Notifications Connections](#notifications-connections)

---

## 🏗️ Architecture Overview

### Two Backend Servers

1. **Django Backend** (Port 8001)
   - **Purpose**: Database operations, user authentication, data storage
   - **Location**: `backend/` folder
   - **Base URL**: `http://localhost:8001/api`

2. **FastAPI Backend** (Port 8000)
   - **Purpose**: AI features (quiz generation, chatbot, study plans)
   - **Location**: `backend/ai_backend/` folder
   - **Base URL**: `http://localhost:8000`

### Frontend Configuration File

**File**: `novya-frontend-main/src/config/api.js`
- **What it does**: Stores all backend URLs and endpoint configurations
- **Why it's important**: Central place to change API endpoints

---
##  Authentication Connections

### Login Connection

**Frontend File**: `novya-frontend-main/src/modules/login/Login.js`

**Backend File**: `backend/authentication/views.py`  `CustomTokenObtainPairView`

**Connection Flow**:
1. User enters username and password in `Login.js`
2. Frontend calls `API_CONFIG.DJANGO.AUTH.LOGIN` (which is `http://localhost:8001/api/auth/login/`)
3. Uses `djangoAPI.postNoAuth()` helper function (no auth needed for login)
4. Backend validates credentials in `views.py`
5. Backend returns JWT token (access token + refresh token)
6. Frontend saves token in `localStorage` for future API calls

**Backend URL Configuration**: `backend/config/urls.py`  `path('api/auth/', include('authentication.urls'))`

---

### Registration Connection

**Frontend File**: `novya-frontend-main/src/modules/login/Login.js` (registration tab)

**Backend File**: `backend/authentication/views.py`  `register_user()` or `register_student()` / `register_parent()`

**Connection Flow**:
1. User fills registration form
2. Frontend calls `API_CONFIG.DJANGO.AUTH.REGISTER` (`http://localhost:8001/api/auth/register/`)
3. Uses `djangoAPI.postNoAuth()` (no auth needed)
4. Backend creates user account in database
5. Backend returns success message or error

**Backend URL**: `backend/authentication/urls.py`  `path('register/', views.register_user)`

---

### User Profile Connection

**Frontend File**: `novya-frontend-main/src/modules/student/ProfilePage.jsx`

**Backend File**: `backend/authentication/views.py`  `get_user_profile()` / `update_user_profile()`

**Connection Flow**:
1. Frontend calls `API_CONFIG.DJANGO.AUTH.USER_PROFILE` to GET profile
2. Uses `djangoAPI.get()` helper (automatically adds auth token from localStorage)
3. Backend returns user profile data from database
4. Frontend displays user information

**For updating profile**:
1. User edits profile in frontend
2. Frontend calls `API_CONFIG.DJANGO.AUTH.PROFILE_UPDATE` with PUT request
3. Uses `djangoAPI.put()` helper
4. Backend updates database

**Backend URLs**: 
- `backend/authentication/urls.py`  `path('profile/', views.get_user_profile)`
- `backend/authentication/urls.py`  `path('profile/update/', views.update_user_profile)`

---

##  Course Management Connections

**Frontend**: `novya-frontend-main/src/modules/student/Courses.jsx`
**Backend**: `backend/courses/views.py`  `CourseListCreateView`
**API Endpoint**: `API_CONFIG.DJANGO.COURSES.LIST` = `http://localhost:8001/api/courses/`
**How it works**: Student clicks Courses page  Frontend calls API  Backend returns all courses  Frontend displays list

**Frontend**: `novya-frontend-main/src/modules/student/CourseDetails.jsx`
**Backend**: `backend/courses/views.py`  `CourseDetailView`
**API Endpoint**: `API_CONFIG.DJANGO.COURSES.DETAIL(id)`
**How it works**: Student clicks course  Frontend calls API with course ID  Backend returns course details  Frontend shows course info

**Frontend**: `novya-frontend-main/src/modules/student/CourseDetails.jsx`
**Backend**: `backend/courses/views.py`  `CourseEnrollmentView`
**API Endpoint**: `API_CONFIG.DJANGO.COURSES.ENROLL(id)`
**How it works**: Student clicks Enroll  Frontend sends POST request  Backend saves enrollment  Student is enrolled

---

##  Quiz & Mock Test Connections

**Frontend**: `novya-frontend-main/src/modules/student/QuickPractice.jsx`
**Backend**: `backend/ai_backend/app.py`  `/classes`, `/chapters`, `/subtopics`, `/quiz`
**API Endpoint**: `API_CONFIG.FASTAPI.QUICK_PRACTICE.*`
**How it works**: Student selects class/subject/topic  Frontend calls FastAPI  AI generates 10 questions  Frontend displays quiz  After completion, saves to Django backend via `API_CONFIG.DJANGO.QUIZZES.SUBMIT_ATTEMPT`

**Frontend**: `novya-frontend-main/src/modules/student/MockTest.jsx`
**Backend**: `backend/ai_backend/app.py`  `/mock_test`
**API Endpoint**: `API_CONFIG.FASTAPI.MOCK_TEST.GENERATE_TEST(params)`
**How it works**: Student selects options  FastAPI generates 50 questions  After completion, saves via `API_CONFIG.DJANGO.QUIZZES.SUBMIT_MOCK_TEST`

**Frontend**: `novya-frontend-main/src/modules/student/Career.jsx`
**Helper**: `novya-frontend-main/src/utils/quizTracking.js`
**Backend**: `backend/quizzes/views.py`  `get_student_performance()`, `get_recent_quiz_attempts()`
**API Endpoints**: `API_CONFIG.DJANGO.QUIZZES.PERFORMANCE`, `API_CONFIG.DJANGO.QUIZZES.RECENT_ATTEMPTS`
**How it works**: Career page loads  Calls helper functions  Django returns performance stats and attempt history  Frontend displays charts

**Frontend**: `novya-frontend-main/src/modules/parent/QuizReports.jsx`
**Backend**: `backend/quizzes/views.py`  `get_child_quiz_attempts()`
**API Endpoint**: `API_CONFIG.DJANGO.QUIZZES.CHILD_ATTEMPTS`
**How it works**: Parent opens reports  Frontend calls API  Backend finds parent's children  Returns all quiz attempts  Frontend displays reports

---

##  AI Assistant Connections

**Frontend**: `novya-frontend-main/src/modules/student/LessonPage.jsx`
**FastAPI Backend**: `backend/ai_backend/app.py`  `/ai-assistant/chat`
**Django Backend**: `backend/ai_assistant/views.py`  `save_chat_message()`, `get_chat_history()`
**API Endpoints**: 
- FastAPI: `API_CONFIG.FASTAPI.AI_ASSISTANT.CHAT` (generates AI response)
- Django: `API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_CHAT_MESSAGE` (saves to database)
- Django: `API_CONFIG.DJANGO.AI_ASSISTANT.GET_CHAT_HISTORY` (loads history)
**How it works**: Student types question  FastAPI generates AI answer  Frontend displays answer  Frontend saves to Django database  Next time, loads from database

**Frontend**: `novya-frontend-main/src/modules/student/LessonPage.jsx`
**FastAPI**: `backend/ai_backend/app.py`  `/ai-assistant/generate-study-plan`
**Django**: `backend/ai_assistant/views.py`  `save_ai_study_plan()`, `get_study_plans()`
**API Endpoints**: `API_CONFIG.FASTAPI.AI_ASSISTANT.GENERATE_STUDY_PLAN`, `API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_STUDY_PLAN`, `API_CONFIG.DJANGO.AI_ASSISTANT.GET_STUDY_PLANS`
**How it works**: Student clicks Generate Study Plan  FastAPI creates plan  Frontend saves to Django  Frontend loads saved plans

**Frontend**: `novya-frontend-main/src/modules/student/LessonPage.jsx`
**FastAPI**: `backend/ai_backend/app.py`  `/ai-assistant/generate-notes`
**Django**: `backend/ai_assistant/views.py`  `save_ai_generated_note()`, `get_ai_notes()`
**API Endpoints**: `API_CONFIG.FASTAPI.AI_ASSISTANT.GENERATE_NOTES`, `API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_AI_NOTE`, `API_CONFIG.DJANGO.AI_ASSISTANT.GET_AI_NOTES`
**How it works**: Student clicks Generate Notes  FastAPI creates notes  Frontend saves to Django  Frontend displays notes

**Frontend**: `novya-frontend-main/src/modules/student/LessonPage.jsx`
**Backend**: `backend/ai_assistant/views.py`  `save_manual_note()`, `get_manual_notes()`, `update_manual_note()`, `delete_manual_note()`
**API Endpoints**: `API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_MANUAL_NOTE`, `API_CONFIG.DJANGO.AI_ASSISTANT.GET_MANUAL_NOTES`, etc.
**How it works**: Student creates sticky note  Frontend saves to Django  Frontend loads notes when page opens  Student can update/delete notes

---

##  Progress & Parent Dashboard Connections

**Frontend**: `novya-frontend-main/src/modules/student/Progress.jsx`
**Backend**: `backend/progress/views.py`  `get_student_progress()`
**API Endpoint**: `API_CONFIG.DJANGO.PROGRESS.OVERVIEW`
**How it works**: Student opens Progress page  Frontend calls API  Backend calculates progress stats  Frontend displays progress

**Frontend**: `novya-frontend-main/src/modules/parent/ParentDashboard.jsx`
**Backend**: `backend/progress/views.py`  `get_parent_dashboard()`, `backend/authentication/views.py`  `get_parent_profile()`
**API Endpoints**: `API_CONFIG.DJANGO.AUTH.PARENT_PROFILE`, `API_CONFIG.DJANGO.PROGRESS.PARENT_DASHBOARD`
**How it works**: Parent logs in  Frontend loads parent profile and dashboard data  Backend returns parent info + children's progress  Frontend displays dashboard

**Frontend**: `novya-frontend-main/src/modules/parent/MockTestReports.jsx`
**Backend**: `backend/quizzes/views.py`  `get_child_quiz_attempts()` (filters mock tests)
**API Endpoint**: `API_CONFIG.DJANGO.QUIZZES.CHILD_ATTEMPTS` (filtered by type)
**How it works**: Parent opens Mock Test Reports  Frontend calls API  Backend returns only mock test attempts  Frontend displays reports

---

##  Notifications Connections

**Frontend**: Notification components
**Backend**: `backend/notifications/views.py`
**API Endpoints**: `API_CONFIG.DJANGO.NOTIFICATIONS.GET_STUDENT_NOTIFICATIONS`, `API_CONFIG.DJANGO.NOTIFICATIONS.MARK_STUDENT_NOTIFICATION_READ(id)`, etc.
**How it works**: Frontend loads notifications  Backend returns unread notifications  Student clicks notification  Frontend marks as read  Backend updates database

---

##  Key Helper Files

**File**: `novya-frontend-main/src/config/api.js`
- Contains ALL API endpoint URLs
- Helper functions: `djangoAPI.get()`, `djangoAPI.post()`, `fastAPI.get()`, `fastAPI.post()`
- Automatically adds auth tokens for Django calls

**File**: `novya-frontend-main/src/utils/quizTracking.js`
- Helper functions for quiz tracking
- `submitQuizAttempt()`, `submitMockTestAttempt()`, `getStudentPerformance()`, `getRecentQuizAttempts()`

**File**: `backend/config/urls.py`
- Main URL routing file
- Connects all Django apps: `path('api/auth/', include('authentication.urls'))`, etc.

---

##  Quick Reference

**Django Backend**: `http://localhost:8001/api` (database, auth, data storage)
**FastAPI Backend**: `http://localhost:8000` (AI features)

**All API endpoints defined in**: `novya-frontend-main/src/config/api.js`
**Main backend URL routing**: `backend/config/urls.py`

**Authentication**: Frontend saves JWT token in localStorage  Includes in all Django API calls

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
