# NOVYA Platform - Complete API Endpoints & Database Connection Documentation

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Frontend API Configuration](#frontend-api-configuration)
3. [Backend URL Routing](#backend-url-routing)
4. [Database Connection](#database-connection)
5. [Complete Endpoint Mapping](#complete-endpoint-mapping)
6. [Azure Deployment Configuration](#azure-deployment-configuration)

---

## 🏗️ Architecture Overview

### System Architecture
```
┌─────────────────┐         HTTP/HTTPS         ┌─────────────────┐
│                 │ ─────────────────────────> │                 │
│   Frontend      │   REST API Calls           │   Backend       │
│   (React)       │   JWT Authentication      │   (Django)      │
│   Port: 3000    │ <───────────────────────── │   Port: 8001    │
└─────────────────┘                             └─────────────────┘
                                                          │
                                                          │ PostgreSQL
                                                          │ Connection
                                                          │
                                                          ▼
                                                ┌─────────────────┐
                                                │   PostgreSQL    │
                                                │   Database      │
                                                │   Port: 5432    │
                                                └─────────────────┘

┌─────────────────┐
│   FastAPI       │
│   Backend       │
│   Port: 8000    │  (AI Features - Chat, Quizzes, Study Plans)
└─────────────────┘
```

### Technology Stack
- **Frontend**: React.js (Port 3000)
- **Backend**: Django REST Framework (Port 8001)
- **AI Backend**: FastAPI (Port 8000)
- **Database**: PostgreSQL (Port 5432)
- **Authentication**: JWT (JSON Web Tokens)

---

## 📍 Frontend API Configuration

### File Location
```
novya-frontend-main/src/config/api.js
```

### Base URLs Configuration
```javascript
// Django Backend URL
const DJANGO_BASE_URL = process.env.REACT_APP_DJANGO_URL || 'http://localhost:8001/api';

// FastAPI Backend URL  
const FASTAPI_BASE_URL = process.env.REACT_APP_FASTAPI_URL || 'http://localhost:8000';
```

### API Helper Functions
- **`djangoAPI.get(url)`**: GET requests to Django backend (with JWT auth)
- **`djangoAPI.post(url, data)`**: POST requests to Django backend (with JWT auth)
- **`djangoAPI.put(url, data)`**: PUT requests to Django backend (with JWT auth)
- **`djangoAPI.delete(url)`**: DELETE requests to Django backend (with JWT auth)
- **`fastAPI.get(url)`**: GET requests to FastAPI backend (no auth)
- **`fastAPI.post(url, data)`**: POST requests to FastAPI backend (no auth)

### Authentication Header Function
```javascript
// File: novya-frontend-main/src/config/api.js (Line 161-185)
export const getAuthHeaders = () => {
  const token = localStorage.getItem('userToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};
```

---

## 🔗 Backend URL Routing

### Main URL Configuration
**File**: `backend/config/urls.py`

```python
urlpatterns = [
    path('api/auth/', include('authentication.urls')),        # Authentication endpoints
    path('api/courses/', include('courses.urls')),           # Course management
    path('api/quizzes/', include('quizzes.urls')),           # Quiz system
    path('api/progress/', include('progress.urls')),          # Progress tracking
    path('api/notifications/', include('notifications.urls')), # Notifications
    path('api/ai-assistant/', include('ai_assistant.urls')),  # AI Assistant
]
```

### Complete URL Prefix
All Django backend endpoints are prefixed with: `http://localhost:8001/api/`

---

## 🗄️ Database Connection

### Configuration File
**File**: `backend/config/settings.py` (Lines 102-112)

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'novya',           # Database name
        'USER': 'postgres',        # PostgreSQL user
        'PASSWORD': '12345',       # PostgreSQL password
        'HOST': 'localhost',       # Database host
        'PORT': '5432',            # PostgreSQL port
    }
}
```

### Database Tables Overview
The system uses **PostgreSQL** database with the following main tables:

1. **Authentication Tables**:
   - `users` - User accounts
   - `parent_registration` - Parent registrations
   - `student_registration` - Student registrations
   - `student_feedback` - Student feedback records

2. **AI Assistant Tables**:
   - `ai_study_plans` - AI-generated study plans
   - `ai_generated_notes` - AI-generated notes
   - `manual_notes` - Manual notes entered by students
   - `ai_chat_history` - AI chat conversation history
   - `ai_interaction_sessions` - AI interaction sessions
   - `ai_favorites` - Student favorites

3. **Quiz Tables**:
   - `quiz_attempt` - Quiz attempt records
   - `mock_test_attempt` - Mock test attempt records

4. **Coin/Rewards Tables**:
   - `user_coin_balance` - Current coin balance per user
   - `coin_transaction` - All coin transactions (earned/spent)

---

## 📊 Complete Endpoint Mapping

### 1. AUTHENTICATION ENDPOINTS

#### Frontend Configuration
**File**: `novya-frontend-main/src/config/api.js` (Lines 24-41)

```javascript
AUTH: {
  LOGIN: 'http://localhost:8001/api/auth/login/',
  REGISTER: 'http://localhost:8001/api/auth/register/',
  LOGOUT: 'http://localhost:8001/api/auth/logout/',
  REFRESH_TOKEN: 'http://localhost:8001/api/auth/token/refresh/',
  USER_PROFILE: 'http://localhost:8001/api/auth/profile/',
  PROFILE_UPDATE: 'http://localhost:8001/api/auth/profile/update/',
  CHILD_PROFILE: 'http://localhost:8001/api/auth/child-profile/',
  PARENT_PROFILE: 'http://localhost:8001/api/auth/parent-profile/',
  FEEDBACK_SUBMIT: 'http://localhost:8001/api/auth/feedback/submit/',
  FEEDBACK_STATUS: 'http://localhost:8001/api/auth/feedback/status/',
  ADD_COINS: 'http://localhost:8001/api/auth/coins/add/',
  GET_COIN_BALANCE: 'http://localhost:8001/api/auth/coins/balance/',
  GET_COIN_TRANSACTIONS: 'http://localhost:8001/api/auth/coins/transactions/',
  CHECK_DAILY_LOGIN_REWARD: 'http://localhost:8001/api/auth/coins/check-daily-login/',
}
```

#### Backend URL Patterns
**File**: `backend/authentication/urls.py`

| Frontend Endpoint | Backend URL Pattern | Backend View Function | Database Table(s) |
|-------------------|---------------------|----------------------|-------------------|
| `LOGIN` | `/api/auth/login/` | `CustomTokenObtainPairView` | `users` |
| `REGISTER` | `/api/auth/register/` | `register_user` | `users`, `parent_registration`, `student_registration` |
| `LOGOUT` | `/api/auth/logout/` | `logout_user` | None |
| `REFRESH_TOKEN` | `/api/auth/token/refresh/` | `TokenRefreshView` | None |
| `USER_PROFILE` | `/api/auth/profile/` | `get_user_profile` | `users`, `student_registration`, `parent_registration` |
| `PROFILE_UPDATE` | `/api/auth/profile/update/` | `update_user_profile` | `users` |
| `CHILD_PROFILE` | `/api/auth/child-profile/` | `get_child_profile_for_parent` | `student_registration`, `users` |
| `PARENT_PROFILE` | `/api/auth/parent-profile/` | `get_parent_profile_with_child_address` | `parent_registration`, `users` |
| `FEEDBACK_SUBMIT` | `/api/auth/feedback/submit/` | `submit_student_feedback` | `student_feedback`, `user_coin_balance`, `coin_transaction` |
| `FEEDBACK_STATUS` | `/api/auth/feedback/status/` | `get_student_feedback_status` | `student_feedback` |
| `ADD_COINS` | `/api/auth/coins/add/` | `add_coin_transaction` | `user_coin_balance`, `coin_transaction` |
| `GET_COIN_BALANCE` | `/api/auth/coins/balance/` | `get_coin_balance` | `user_coin_balance` |
| `GET_COIN_TRANSACTIONS` | `/api/auth/coins/transactions/` | `get_coin_transactions` | `coin_transaction` |
| `CHECK_DAILY_LOGIN_REWARD` | `/api/auth/coins/check-daily-login/` | `check_daily_login_reward` | `user_coin_balance`, `coin_transaction` |

#### Connection Flow
```
Frontend Component
    ↓ (HTTP POST/GET with JWT token)
novya-frontend-main/src/config/api.js (djangoAPI.post/get)
    ↓ (HTTP Request with Authorization: Bearer <token>)
backend/authentication/urls.py (URL routing)
    ↓ (Django URL pattern match)
backend/authentication/views.py (View function)
    ↓ (Django ORM queries)
backend/authentication/models.py (Model definitions)
    ↓ (SQL queries via Django ORM)
PostgreSQL Database Tables
```

---

### 2. AI ASSISTANT ENDPOINTS

#### Frontend Configuration
**File**: `novya-frontend-main/src/config/api.js` (Lines 94-115)

```javascript
AI_ASSISTANT: {
  // Save endpoints
  SAVE_STUDY_PLAN: 'http://localhost:8001/api/ai-assistant/save-study-plan/',
  SAVE_AI_NOTE: 'http://localhost:8001/api/ai-assistant/save-ai-note/',
  SAVE_MANUAL_NOTE: 'http://localhost:8001/api/ai-assistant/save-manual-note/',
  SAVE_CHAT_MESSAGE: 'http://localhost:8001/api/ai-assistant/save-chat-message/',
  
  // Get endpoints
  GET_STUDY_PLANS: 'http://localhost:8001/api/ai-assistant/study-plans/',
  GET_AI_NOTES: 'http://localhost:8001/api/ai-assistant/ai-notes/',
  GET_MANUAL_NOTES: 'http://localhost:8001/api/ai-assistant/manual-notes/',
  GET_CHAT_HISTORY: 'http://localhost:8001/api/ai-assistant/chat-history/',
  GET_ALL_NOTES: 'http://localhost:8001/api/ai-assistant/all-notes/',
  
  // Update/Delete endpoints
  UPDATE_MANUAL_NOTE: (noteId) => `http://localhost:8001/api/ai-assistant/manual-notes/${noteId}/`,
  DELETE_MANUAL_NOTE: (noteId) => `http://localhost:8001/api/ai-assistant/manual-notes/${noteId}/delete/`,
  
  // Favorites endpoints
  TOGGLE_FAVORITE: 'http://localhost:8001/api/ai-assistant/toggle-favorite/',
  GET_FAVORITES: 'http://localhost:8001/api/ai-assistant/favorites/',
}
```

#### Backend URL Patterns
**File**: `backend/ai_assistant/urls.py`

| Frontend Endpoint | Backend URL Pattern | Backend View Function | Database Table(s) |
|-------------------|---------------------|----------------------|-------------------|
| `SAVE_STUDY_PLAN` | `/api/ai-assistant/save-study-plan/` | `save_ai_study_plan` | `ai_study_plans` |
| `SAVE_AI_NOTE` | `/api/ai-assistant/save-ai-note/` | `save_ai_generated_note` | `ai_generated_notes` |
| `SAVE_MANUAL_NOTE` | `/api/ai-assistant/save-manual-note/` | `save_manual_note` | `manual_notes` |
| `SAVE_CHAT_MESSAGE` | `/api/ai-assistant/save-chat-message/` | `save_chat_message` | `ai_chat_history` |
| `GET_STUDY_PLANS` | `/api/ai-assistant/study-plans/` | `get_study_plans` | `ai_study_plans` |
| `GET_AI_NOTES` | `/api/ai-assistant/ai-notes/` | `get_ai_notes` | `ai_generated_notes` |
| `GET_MANUAL_NOTES` | `/api/ai-assistant/manual-notes/` | `get_manual_notes` | `manual_notes` |
| `GET_CHAT_HISTORY` | `/api/ai-assistant/chat-history/` | `get_chat_history` | `ai_chat_history` |
| `GET_ALL_NOTES` | `/api/ai-assistant/all-notes/` | `get_all_notes` | `ai_generated_notes`, `manual_notes` |
| `UPDATE_MANUAL_NOTE` | `/api/ai-assistant/manual-notes/<note_id>/` | `update_manual_note` | `manual_notes` |
| `DELETE_MANUAL_NOTE` | `/api/ai-assistant/manual-notes/<note_id>/delete/` | `delete_manual_note` | `manual_notes` |
| `TOGGLE_FAVORITE` | `/api/ai-assistant/toggle-favorite/` | `toggle_favorite` | `ai_favorites` |
| `GET_FAVORITES` | `/api/ai-assistant/favorites/` | `get_ai_favorites` | `ai_favorites` |

#### Connection Flow
```
Frontend Component (LessonPage.jsx)
    ↓ (User creates study plan/note/chat message)
Frontend: novya-frontend-main/src/modules/student/LessonPage.jsx
    ↓ (djangoAPI.post call)
novya-frontend-main/src/config/api.js (djangoAPI.post)
    ↓ (HTTP POST with JWT token)
backend/ai_assistant/urls.py (URL routing)
    ↓ (Django URL pattern match)
backend/ai_assistant/views.py (View function)
    ↓ (Gets student_id from student_registration table)
    ↓ (Django ORM: Model.objects.create())
backend/ai_assistant/models.py (Model: AIStudyPlan/AIGeneratedNote/etc.)
    ↓ (Django ORM generates SQL INSERT)
PostgreSQL Database Table (ai_study_plans/ai_generated_notes/etc.)
```

#### Frontend Files Using AI Assistant Endpoints
1. **`novya-frontend-main/src/modules/student/LessonPage.jsx`**
   - Line 2207: `SAVE_STUDY_PLAN` - Saves study plans when AI generates them
   - Line 2390: `SAVE_AI_NOTE` - Saves AI-generated notes
   - Line 2695: `SAVE_CHAT_MESSAGE` - Saves all chat messages
   - Line 2795: `SAVE_MANUAL_NOTE` - Saves manual notes when user clicks "Save Note"

---

### 3. QUIZ ENDPOINTS

#### Frontend Configuration
**File**: `novya-frontend-main/src/config/api.js` (Lines 52-77)

```javascript
QUIZZES: {
  LIST: 'http://localhost:8001/api/quizzes/',
  DETAIL: (id) => `http://localhost:8001/api/quizzes/${id}/`,
  START: (id) => `http://localhost:8001/api/quizzes/${id}/start/`,
  SUBMIT: (id) => `http://localhost:8001/api/quizzes/${id}/submit/`,
  MY_ATTEMPTS: 'http://localhost:8001/api/quizzes/my-attempts/',
  STATS: 'http://localhost:8001/api/quizzes/stats/',
  SUBMIT_ATTEMPT: 'http://localhost:8001/api/quizzes/submit-attempt/',
  SUBMIT_MOCK_TEST: 'http://localhost:8001/api/quizzes/submit-mock-test/',
  RECENT_ATTEMPTS: 'http://localhost:8001/api/quizzes/recent-attempts/',
  CHILD_ATTEMPTS: 'http://localhost:8001/api/quizzes/child-attempts/',
  PERFORMANCE: 'http://localhost:8001/api/quizzes/performance/',
  STATISTICS: 'http://localhost:8001/api/quizzes/statistics/',
  STATIC_SUBJECTS: 'http://localhost:8001/api/quizzes/static/subjects/',
  STATIC_TOPICS: (subject) => `http://localhost:8001/api/quizzes/static/subjects/${subject}/topics/`,
  STATIC_QUIZ: (subject, topic) => `http://localhost:8001/api/quizzes/static/subjects/${subject}/topics/${topic}/`,
  PDF_STRUCTURE: 'http://localhost:8001/api/quizzes/pdf/structure/',
  PDF_SUBJECTS: (className) => `http://localhost:8001/api/quizzes/pdf/${className}/subjects/`,
  PDF_TOPICS: (className, subject) => `http://localhost:8001/api/quizzes/pdf/${className}/${subject}/topics/`,
}
```

#### Backend URL Patterns
**File**: `backend/quizzes/urls.py`

| Frontend Endpoint | Backend URL Pattern | Backend View Function | Database Table(s) |
|-------------------|---------------------|----------------------|-------------------|
| `PERFORMANCE` | `/api/quizzes/performance/` | `get_student_performance` | `quiz_attempt`, `mock_test_attempt`, `student_registration` |
| `RECENT_ATTEMPTS` | `/api/quizzes/recent-attempts/` | `get_recent_quiz_attempts` | `quiz_attempt`, `mock_test_attempt`, `student_registration` |
| `SUBMIT_ATTEMPT` | `/api/quizzes/submit-attempt/` | `submit_quiz_attempt` | `quiz_attempt` |
| `SUBMIT_MOCK_TEST` | `/api/quizzes/submit-mock-test/` | `submit_mock_test_attempt` | `mock_test_attempt` |
| `STATISTICS` | `/api/quizzes/statistics/` | `get_quiz_statistics` | `quiz_attempt`, `mock_test_attempt` |
| `CHILD_ATTEMPTS` | `/api/quizzes/child-attempts/` | `get_child_quiz_attempts` | `quiz_attempt`, `mock_test_attempt`, `parent_student_mapping` |

---

### 4. FASTAPI AI ENDPOINTS

#### Frontend Configuration
**File**: `novya-frontend-main/src/config/api.js` (Lines 121-154)

```javascript
FASTAPI: {
  BASE_URL: 'http://localhost:8000',
  
  // Quick Practice (AI-Generated Quizzes)
  QUICK_PRACTICE: {
    GET_CLASSES: 'http://localhost:8000/classes',
    GET_CHAPTERS: (className) => `http://localhost:8000/chapters?class_name=${className}`,
    GET_SUBTOPICS: (className, subject) => `http://localhost:8000/subtopics?class_name=${className}&subject=${subject}`,
    GENERATE_QUIZ: (params) => `http://localhost:8000/quiz?${queryParams}`,
  },
  
  // Mock Tests (AI-Generated)
  MOCK_TEST: {
    GET_CLASSES: 'http://localhost:8000/mock_classes',
    GET_SUBJECTS: (className) => `http://localhost:8000/mock_subjects?class_name=${className}`,
    GET_CHAPTERS: (className, subject) => `http://localhost:8000/mock_chapters?class_name=${className}&subject=${subject}`,
    GENERATE_TEST: (params) => `http://localhost:8000/mock_test?${queryParams}`,
  },
  
  // AI Assistant
  AI_ASSISTANT: {
    CHAT: 'http://localhost:8000/ai-assistant/chat',
    GENERATE_STUDY_PLAN: 'http://localhost:8000/ai-assistant/generate-study-plan',
    GENERATE_NOTES: 'http://localhost:8000/ai-assistant/generate-notes',
    GENERATE_OVERVIEW: 'http://localhost:8000/ai-assistant/generate-notes',
    GENERATE_EXPLANATIONS: 'http://localhost:8000/ai-assistant/chat',
  },
}
```

#### Connection Flow
```
Frontend Component (LessonPage.jsx)
    ↓ (User sends chat message or requests study plan)
Frontend: novya-frontend-main/src/modules/student/LessonPage.jsx
    ↓ (fastAPI.post call)
novya-frontend-main/src/config/api.js (fastAPI.post)
    ↓ (HTTP POST - No authentication required)
FastAPI Backend (Port 8000)
    ↓ (AI Processing)
FastAPI returns AI-generated response
    ↓ (Frontend processes response)
Frontend saves to Django backend via SAVE_STUDY_PLAN/SAVE_AI_NOTE/SAVE_CHAT_MESSAGE
    ↓ (djangoAPI.post)
Django Backend saves to PostgreSQL database
```

---

## 📂 File Locations & Connections

### Frontend Files Structure
```
novya-frontend-main/
├── src/
│   ├── config/
│   │   └── api.js                    # ALL API endpoint definitions
│   ├── modules/
│   │   ├── student/
│   │   │   ├── LessonPage.jsx        # Uses: SAVE_STUDY_PLAN, SAVE_AI_NOTE, SAVE_CHAT_MESSAGE, SAVE_MANUAL_NOTE
│   │   │   ├── Home1.jsx             # Uses: Various auth and quiz endpoints
│   │   │   ├── QuizContext.jsx       # Uses: QUIZZES.PERFORMANCE, QUIZZES.RECENT_ATTEMPTS
│   │   │   └── quizTracking.js       # Uses: QUIZZES.SUBMIT_ATTEMPT, QUIZZES.PERFORMANCE
│   │   ├── parent/
│   │   │   └── Fees.jsx               # Parent fees display (no API calls)
│   │   └── login/
│   │       └── Login.jsx              # Uses: AUTH.LOGIN, AUTH.REGISTER
```

### Backend Files Structure
```
backend/
├── config/
│   ├── urls.py                        # Main URL routing (includes all app URLs)
│   ├── settings.py                    # Database connection settings (Line 103-112)
│   └── wsgi.py                        # WSGI application entry point
├── authentication/
│   ├── urls.py                        # Authentication URL patterns
│   ├── views.py                       # Authentication view functions
│   └── models.py                      # User, ParentRegistration, StudentRegistration models
├── ai_assistant/
│   ├── urls.py                        # AI Assistant URL patterns
│   ├── views.py                       # AI Assistant view functions
│   └── models.py                      # AIStudyPlan, AIGeneratedNote, ManualNote, AIChatHistory models
├── quizzes/
│   ├── urls.py                        # Quiz URL patterns
│   ├── views.py                       # Quiz view functions
│   └── models.py                      # QuizAttempt, MockTestAttempt models
├── courses/
│   ├── urls.py                        # Course URL patterns
│   └── views.py                       # Course view functions
├── progress/
│   ├── urls.py                        # Progress URL patterns
│   └── views.py                       # Progress view functions
└── notifications/
    ├── urls.py                        # Notification URL patterns
    └── views.py                       # Notification view functions
```

---

## 🔄 Complete Data Flow Example

### Example: Saving AI Study Plan

#### Step 1: User Action
```
User clicks "Study Plan" button in LessonPage.jsx
    ↓
Frontend: novya-frontend-main/src/modules/student/LessonPage.jsx (Line 2369)
    ↓
handleAIMessageResponse() function detects study plan
    ↓
Calls saveStudyPlanToCalendar() function (Line 2153)
```

#### Step 2: Frontend API Call
```javascript
// File: novya-frontend-main/src/modules/student/LessonPage.jsx (Line 2207)
const planData = {
  class_name: `Class ${classNumber}`,
  subject: subject,
  chapter: chapterTitle,
  subtopic: subtopicName || '',
  plan_title: studyPlan.title,
  plan_content: studyPlanContent,
  plan_type: 'study_plan',
  difficulty_level: 'medium',
  estimated_duration_hours: studyPlan.studySessions?.length || 5
};

await djangoAPI.post(API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_STUDY_PLAN, planData);
```

#### Step 3: HTTP Request
```
POST http://localhost:8001/api/ai-assistant/save-study-plan/
Headers:
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
Body:
  {
    "class_name": "Class 7",
    "subject": "Mathematics",
    "chapter": "Algebra",
    "subtopic": "Linear Equations",
    "plan_title": "Study Plan for Algebra",
    "plan_content": "Day 1: Introduction...",
    "plan_type": "study_plan",
    "difficulty_level": "medium",
    "estimated_duration_hours": 5
  }
```

#### Step 4: Backend URL Routing
```
Request arrives at: backend/config/urls.py (Line 31)
    ↓
Routes to: path('api/ai-assistant/', include('ai_assistant.urls'))
    ↓
backend/ai_assistant/urls.py (Line 6)
    ↓
Matches: path('save-study-plan/', views.save_ai_study_plan)
```

#### Step 5: Backend View Processing
```python
# File: backend/ai_assistant/views.py (Line 40-120)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def save_ai_study_plan(request):
    # 1. Get student_id from authenticated user
    student_id = get_student_id_from_user(request.user)
    # Returns: 54 (from student_registration table)
    
    # 2. Prepare data
    data = request.data.copy()
    data['student_id'] = student_id
    
    # 3. Validate with serializer
    serializer = AIStudyPlanSerializer(data=data)
    
    # 4. Save to database
    if serializer.is_valid():
        study_plan = serializer.save()
        # Django ORM executes: INSERT INTO ai_study_plans (...)
```

#### Step 6: Database Operation
```sql
-- Django ORM generates and executes:
INSERT INTO ai_study_plans 
  (student_id, class_name, subject, chapter, subtopic, plan_title, plan_content, plan_type, difficulty_level, estimated_duration_hours, created_at)
VALUES 
  (54, 'Class 7', 'Mathematics', 'Algebra', 'Linear Equations', 'Study Plan for Algebra', 'Day 1: Introduction...', 'study_plan', 'medium', 5, NOW());

-- Foreign Key Constraint Check:
-- Ensures student_id=54 exists in student_registration table
```

#### Step 7: Response Flow
```
PostgreSQL Database
    ↓ (Returns new record ID)
Django ORM returns: study_plan.plan_id = 123
    ↓
backend/ai_assistant/views.py returns:
  {
    'message': 'Study plan saved successfully',
    'study_plan': { 'plan_id': 123, ... }
  }
    ↓
HTTP 201 Created Response
    ↓
Frontend receives response
    ↓
console.log('✅ Study plan saved to database')
```

---

## 🔐 Authentication Flow

### JWT Token Authentication

#### Step 1: Login
```
Frontend: Login.jsx
    ↓ POST /api/auth/login/
Backend: authentication/views.py -> CustomTokenObtainPairView
    ↓ Validates credentials
Database: SELECT * FROM users WHERE username='...'
    ↓ Credentials valid
Backend: Generates JWT token
    ↓ Returns: { access: 'eyJ...', refresh: 'eyJ...' }
Frontend: Stores token in localStorage.setItem('userToken', access)
```

#### Step 2: Subsequent API Calls
```
Frontend: Any API call
    ↓ djangoAPI.post/get(url, data)
Frontend: api.js -> getAuthHeaders()
    ↓ Reads localStorage.getItem('userToken')
    ↓ Returns: { 'Authorization': 'Bearer eyJ...', 'Content-Type': 'application/json' }
HTTP Request: Includes Authorization header
    ↓
Backend: Django JWT Authentication Middleware
    ↓ Validates token
Backend: If valid, sets request.user
    ↓ View function can access request.user
```

---

## 📊 Database Connection Details

### PostgreSQL Connection Configuration

**File**: `backend/config/settings.py`

```python
# Lines 103-112
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'novya',              # Database name
        'USER': 'postgres',            # PostgreSQL username
        'PASSWORD': '12345',          # PostgreSQL password
        'HOST': 'localhost',          # Database host (change to Azure DB host in production)
        'PORT': '5432',                # PostgreSQL port
    }
}
```

### Database Models to Tables Mapping

#### Authentication Models
**File**: `backend/authentication/models.py`

| Model | Database Table | Primary Key | Foreign Keys |
|-------|---------------|-------------|--------------|
| `User` | `users` | `userid` | None |
| `ParentRegistration` | `parent_registration` | `parent_email` | None |
| `StudentRegistration` | `student_registration` | `student_id` | `parent_email → parent_registration(parent_email)` |
| `StudentFeedback` | `student_feedback` | `feedback_id` | `student_id → student_registration(student_id)` |
| `UserCoinBalance` | `user_coin_balance` | `balance_id` | `student_id → student_registration(student_id)` |
| `CoinTransaction` | `coin_transaction` | `transaction_id` | `student_id → student_registration(student_id)` |

#### AI Assistant Models
**File**: `backend/ai_assistant/models.py`

| Model | Database Table | Primary Key | Foreign Keys |
|-------|---------------|-------------|--------------|
| `AIStudyPlan` | `ai_study_plans` | `plan_id` | `student_id → student_registration(student_id)` |
| `AIGeneratedNote` | `ai_generated_notes` | `note_id` | `student_id → student_registration(student_id)` |
| `ManualNote` | `manual_notes` | `note_id` | `student_id → student_registration(student_id)` |
| `AIChatHistory` | `ai_chat_history` | `chat_id` | `student_id → student_registration(student_id)` |
| `AIInteractionSession` | `ai_interaction_sessions` | `session_id` | `student_id → student_registration(student_id)` |
| `AIFavorite` | `ai_favorites` | `favorite_id` | `student_id → student_registration(student_id)` |

#### Quiz Models
**File**: `backend/quizzes/models.py`

| Model | Database Table | Primary Key | Foreign Keys |
|-------|---------------|-------------|--------------|
| `QuizAttempt` | `quiz_attempt` | `attempt_id` | `student_id → student_registration(student_id)` |
| `MockTestAttempt` | `mock_test_attempt` | `attempt_id` | `student_id → student_registration(student_id)` |

### Foreign Key Constraints

All AI Assistant tables have foreign key constraints pointing to `student_registration(student_id)`:

```sql
-- Example: ai_chat_history table
ALTER TABLE ai_chat_history 
ADD CONSTRAINT ai_chat_history_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES student_registration(student_id) 
ON DELETE CASCADE;
```

---

## 🚀 Azure Deployment Configuration

### Environment Variables for Azure

#### Frontend Environment Variables
**File**: `.env` (in `novya-frontend-main/` root directory)

```env
# Django Backend URL (Azure App Service)
REACT_APP_DJANGO_URL=https://your-django-app.azurewebsites.net/api

# FastAPI Backend URL (Azure App Service)
REACT_APP_FASTAPI_URL=https://your-fastapi-app.azurewebsites.net
```

#### Backend Environment Variables
**File**: `.env` (in `backend/` root directory) OR Azure App Service Configuration

```env
# Django Settings
SECRET_KEY=your-production-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-django-app.azurewebsites.net,*.azurewebsites.net

# Azure PostgreSQL Database Connection
DB_NAME=novya
DB_USER=your-azure-postgres-user@your-postgres-server
DB_PASSWORD=your-azure-postgres-password
DB_HOST=your-postgres-server.postgres.database.azure.com
DB_PORT=5432

# CORS Settings (Allow frontend domain)
CORS_ALLOWED_ORIGINS=https://your-react-app.azurewebsites.net
```

### Database Connection String for Azure
**File**: `backend/config/settings.py` (Update Lines 103-112)

```python
# Azure PostgreSQL Configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'novya'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', '12345'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
        'OPTIONS': {
            'sslmode': 'require',  # Required for Azure PostgreSQL
        },
    }
}
```

### Azure Deployment Checklist

#### 1. Frontend Deployment (Azure Static Web Apps or App Service)
- [ ] Set environment variables in Azure portal:
  - `REACT_APP_DJANGO_URL=https://your-django-app.azurewebsites.net/api`
  - `REACT_APP_FASTAPI_URL=https://your-fastapi-app.azurewebsites.net`
- [ ] Build React app: `npm run build`
- [ ] Deploy `build/` folder to Azure Static Web Apps

#### 2. Django Backend Deployment (Azure App Service)
- [ ] Create PostgreSQL database on Azure
- [ ] Set environment variables in Azure App Service:
  - `DB_NAME=novya`
  - `DB_USER=your-azure-postgres-user@your-postgres-server`
  - `DB_PASSWORD=your-azure-postgres-password`
  - `DB_HOST=your-postgres-server.postgres.database.azure.com`
  - `DB_PORT=5432`
  - `SECRET_KEY=your-production-secret-key`
  - `DEBUG=False`
  - `ALLOWED_HOSTS=your-django-app.azurewebsites.net`
- [ ] Run database migrations: `python manage.py migrate`
- [ ] Configure CORS to allow frontend domain

#### 3. FastAPI Backend Deployment (Azure App Service)
- [ ] Set environment variables if needed
- [ ] Deploy FastAPI application
- [ ] Configure CORS if required

#### 4. Database Setup
- [ ] Create Azure PostgreSQL database
- [ ] Run SQL schema: Execute `NOVYA_PostgreSQL_Schema.sql`
- [ ] Verify foreign key constraints are created correctly
- [ ] Test database connection from Django backend

### Connection String Format for Azure

```
Host: your-postgres-server.postgres.database.azure.com
Port: 5432
Database: novya
User: your-azure-postgres-user@your-postgres-server
Password: your-azure-postgres-password
SSL Mode: require
```

---

## 📝 Summary of All Connections

### Frontend → Backend Connections

1. **All API endpoints defined in**: `novya-frontend-main/src/config/api.js`
2. **API calls made using**: `djangoAPI` and `fastAPI` helper functions
3. **Authentication tokens**: Stored in `localStorage.getItem('userToken')`
4. **Token sent in**: `Authorization: Bearer <token>` header

### Backend → Database Connections

1. **Database config**: `backend/config/settings.py` (Line 103-112)
2. **ORM layer**: Django ORM (models.py files)
3. **Direct SQL**: Can be executed via `connection.cursor()` but not recommended
4. **Migrations**: Django migrations manage schema changes

### Key Helper Functions

#### Frontend Helper Functions
- **`getAuthHeaders()`**: Returns headers with JWT token for authenticated requests
- **`djangoAPI.post(url, data)`**: Makes authenticated POST requests to Django
- **`djangoAPI.get(url)`**: Makes authenticated GET requests to Django
- **`fastAPI.post(url, data)`**: Makes unauthenticated POST requests to FastAPI

#### Backend Helper Functions
- **`get_student_id_from_user(user)`**: Gets `student_id` from `student_registration` table
  - Location: `backend/ai_assistant/views.py` (Line 21-35)
  - Used by: All AI Assistant views
- **`get_student_registration(user)`**: Gets `StudentRegistration` object from User
  - Location: `backend/quizzes/views.py`
  - Used by: All Quiz views
- **`get_student_from_request(request)`**: Gets student for coin operations
  - Location: `backend/authentication/views.py`
  - Used by: Coin/reward views

---

## 🔍 Endpoint Quick Reference

### Authentication Endpoints
```
POST   /api/auth/login/                    → Login user
POST   /api/auth/register/                 → Register new user
POST   /api/auth/logout/                   → Logout user
GET    /api/auth/profile/                  → Get user profile
PUT    /api/auth/profile/update/           → Update user profile
POST   /api/auth/feedback/submit/          → Submit student feedback
GET    /api/auth/feedback/status/           → Get feedback status
POST   /api/auth/coins/add/                → Add coins to user
GET    /api/auth/coins/balance/            → Get coin balance
GET    /api/auth/coins/transactions/       → Get coin transactions
```

### AI Assistant Endpoints
```
POST   /api/ai-assistant/save-study-plan/     → Save AI study plan
POST   /api/ai-assistant/save-ai-note/        → Save AI-generated note
POST   /api/ai-assistant/save-manual-note/     → Save manual note
POST   /api/ai-assistant/save-chat-message/   → Save chat message
GET    /api/ai-assistant/study-plans/          → Get study plans
GET    /api/ai-assistant/ai-notes/             → Get AI notes
GET    /api/ai-assistant/manual-notes/         → Get manual notes
GET    /api/ai-assistant/chat-history/        → Get chat history
PUT    /api/ai-assistant/manual-notes/<id>/    → Update manual note
DELETE /api/ai-assistant/manual-notes/<id>/delete/ → Delete manual note
```

### Quiz Endpoints
```
GET    /api/quizzes/performance/           → Get student performance
GET    /api/quizzes/recent-attempts/        → Get recent quiz attempts
POST   /api/quizzes/submit-attempt/        → Submit quiz attempt
POST   /api/quizzes/submit-mock-test/      → Submit mock test
GET    /api/quizzes/statistics/            → Get quiz statistics
```

---

## 📌 Important Notes for Deployment Team

1. **Database Connection**: 
   - Local: `localhost:5432`
   - Azure: Use Azure PostgreSQL connection string with SSL mode

2. **CORS Configuration**:
   - Update `CORS_ALLOWED_ORIGINS` in `backend/config/settings.py` to include frontend URL

3. **Environment Variables**:
   - Frontend: Set `REACT_APP_DJANGO_URL` and `REACT_APP_FASTAPI_URL`
   - Backend: Set database connection variables

4. **Authentication**:
   - JWT tokens are required for most Django endpoints
   - Token stored in `localStorage` on frontend
   - Token validated by Django middleware before reaching views

5. **Foreign Key Constraints**:
   - All AI Assistant tables reference `student_registration(student_id)`
   - Ensure `student_registration` records exist before saving AI content

6. **File Locations**:
   - API config: `novya-frontend-main/src/config/api.js`
   - Backend URLs: `backend/config/urls.py` (main), individual app `urls.py` files
   - Database settings: `backend/config/settings.py` (Line 103-112)
   - Views: `backend/*/views.py` files
   - Models: `backend/*/models.py` files

---

## 📞 Support & Troubleshooting

### Common Issues

1. **401 Unauthorized Errors**:
   - Check if JWT token is being sent in headers
   - Verify token is not expired
   - Check `localStorage.getItem('userToken')` in browser console

2. **404 Not Found**:
   - Verify backend server is running
   - Check URL pattern matches in `urls.py`
   - Ensure URL includes `/api/` prefix

3. **500 Internal Server Error**:
   - Check backend logs for database errors
   - Verify `student_registration` record exists for user
   - Check foreign key constraints are correct

4. **Database Connection Errors**:
   - Verify PostgreSQL is running
   - Check database credentials in `settings.py`
   - For Azure: Ensure SSL mode is set to 'require'

---

## 📚 Additional Resources

- **Database Schema**: See `NOVYA_PostgreSQL_Schema.sql`
- **Django Documentation**: https://docs.djangoproject.com/
- **React Documentation**: https://react.dev/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-03  
**Prepared for**: Azure Deployment Team

