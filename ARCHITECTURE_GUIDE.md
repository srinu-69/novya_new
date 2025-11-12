# Novya Platform – Full-Stack Architecture & Integration Handbook

> **Read me like an onboarding manual.** It ties the React frontend, Django backend, and PostgreSQL database together with real file references, ASCII diagrams, and bidirectional data flows.

---

## Table of Contents

1. [Landscape at a Glance](#1-landscape-at-a-glance)
2. [System Diagrams](#2-system-diagrams)
   - [Context Diagram](#context-diagram)
   - [Logical Layer Diagram](#logical-layer-diagram)
3. [Code Touchpoints](#3-code-touchpoints)
   - [Frontend Entry Points](#frontend-entry-points)
   - [Backend Entry Points](#backend-entry-points)
   - [API Helper ↔ View ↔ Model](#api-helper--view--model)
4. [Bidirectional Data Flows](#4-bidirectional-data-flows)
   - [Flow A – Student Quiz ↔ Parent Dashboard](#flow-a--student-quiz--parent-dashboard)
   - [Flow B – AI Study Plan ↔ Calendar Notifications](#flow-b--ai-study-plan--calendar-notifications)
5. [Database Blueprint](#5-database-blueprint)
6. [API Surface Area](#6-api-surface-area)
7. [Security & Middleware](#7-security--middleware)
8. [Deployment Cheat Sheet](#8-deployment-cheat-sheet)
9. [Glossary & Quick Links](#9-glossary--quick-links)

---

## 1. Landscape at a Glance

| Persona    | Frontend Modules                         | Backend Apps / Tables                          | Outcomes                                                                   |
|------------|------------------------------------------|-----------------------------------------------|----------------------------------------------------------------------------|
| Student    | `src/modules/student/*`                  | `quizzes`, `ai_assistant`, `progress`         | Takes quizzes, generates AI plans, completes assignments, earns coins.     |
| Parent     | `src/modules/parent/*`                   | `notifications`, `progress`, `courses`        | Monitors child attendance/progress, study plans, fees, notifications.      |
| Teacher    | `src/modules/teacher/*`                  | `progress`, `courses`, `quizzes`              | Manages classes, attendance, assignments, assessments.                    |
| Admin (legacy) | (no dedicated module in repo)       | `authentication`, Django admin                | Manages users, platform settings.                                         |

Tech stack:
- **React 18 + React Router** (frontend SPA)
- **Django 4.2 + DRF + Simple JWT** (REST services)
- **PostgreSQL** (`NOVYA_PostgreSQL_Schema.sql`)
- **FastAPI** (AI assistant microservice)

---

## 2. System Diagrams

### Context Diagram

```
+----------------+        HTTPS (REST)        +-------------------+       SQL       +---------------------+
| React Frontend | <------------------------> | Django REST API    | <-----------> | PostgreSQL Database |
| (Browser SPA)  |                           | (backend/)         |               | (novya)             |
+----------------+                           +-------------------+               +---------------------+
        ^                                              |  |                                   ^
        | WebSockets / Push (future)                   |  | Celery tasks (optional)           |
        |                                              v  v                                   |
        |                                      +------------------+                          |
        +-------- FastAPI AI Microservice ----> | AI Microservice | -------------------------+
                                                +------------------+
```

### Logical Layer Diagram

```
UI Layer (React)        API/Service Layer (Django)              Data Layer (PostgreSQL)
-----------------       -----------------------------------    -------------------------
- `src/App.js`          - `backend/config/urls.py`              - `users`, `student_registration`
- `src/config/api.js`   - `authentication/views.py`             - `quiz`, `quiz_attempt`, `quiz_answer`
- `student/Quiz*`       - `quizzes/views.py`                    - `ai_study_plans`, `calendar`
- `parent/Attendance`   - `progress/views.py`                   - `assignments`, `careerperformance`
- `teacher/Dashboard`   - `notifications/views.py`              - `student_notifications`, `coin_transaction`
```

---

## 3. Code Touchpoints

### 3.1 Backend App Anatomy – Why Models, Serializers, Views, URLs (and Schema)

Every Django app (`authentication`, `quizzes`, `progress`, etc.) follows the same contract. Understanding this contract makes it easy to add endpoints without breaking conventions.

```
backend/<app>/
  models.py       # Database tables (ORM classes) + helper methods
  serializers.py  # Validation & response formatting logic for DRF
  views.py        # HTTP entry-points; orchestrate serializers + models
  urls.py         # Maps URL patterns to view classes/functions
  migrations/     # Auto-generated SQL change history
  ...
```

| File          | Responsibility                                                                                               | Example                                                             |
|---------------|--------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|
| `models.py`   | Declare data shape & relations. Each class maps to a PostgreSQL table created by migrations.                 | `quiz_attempt`, `ai_study_plans`, `coin_transaction` definitions.  |
| `serializers.py` | Validate incoming JSON, shape outgoing JSON. Bridge between raw HTTP payloads and models.                | `QuizSubmissionSerializer` checks answers & calculates score.      |
| `views.py`    | HTTP controllers. Authenticate user, call serializer, persist or fetch data from `models.py`.                | `submit_quiz()` saves attempts, awards coins, returns response.    |
| `urls.py`     | Glue file that exposes view endpoints; imported by `backend/config/urls.py`.                                | `path('submit-attempt/', SubmitQuizAttemptView.as_view())`.        |
| `migrations/` | Django-generated schema diffs; keep database aligned with models.                                           | `0002_add_registration_models.py` creates parent/student tables.   |
| Schema files  | Manual bootstrap (e.g., `NOVYA_PostgreSQL_Schema.sql`) when DB is provisioned before migrations are run.     | Used once during initial setup; afterwards rely on migrations.     |

#### Mini Example – Quizzes App

```python
# backend/quizzes/models.py (fragment)
class QuizAttempt(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    student = models.ForeignKey('authentication.User', on_delete=models.CASCADE)
    score = models.FloatField(default=0)
    is_completed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
```

```python
# backend/quizzes/serializers.py (fragment)
class QuizSubmissionSerializer(serializers.Serializer):
    answers = serializers.ListField(child=serializers.DictField())

    def validate_answers(self, value):
        if not value:
            raise serializers.ValidationError('No answers supplied')
        return value
```

```python
# backend/quizzes/views.py (fragment)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_quiz(request, pk):
    serializer = QuizSubmissionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    attempt = QuizAttempt.objects.get(student=request.user, quiz_id=pk, is_completed=False)
    # process answers → update attempt.score → return response
```

```python
# backend/quizzes/urls.py (fragment)
from django.urls import path
from .views import submit_quiz

urlpatterns = [
    path('<int:pk>/submit/', submit_quiz, name='quiz-submit'),
]
```

> **Why this separation matters**: Models keep DB logic reusable; serializers make validation reusable (views stay lean); views focus on request handling; URLs keep routing declarative. When all apps follow this layering, cross-team work is predictable.

### Frontend Entry Points

```javascript
// src/App.js (fragment)
import { Routes, Route } from 'react-router-dom';
import Navbar from './modules/home/Navbar';
import Navbarrr from './modules/student/Navbarrr';
import ParentDashboard from './modules/parent/ParentDashboard';
import TeacherDashboard from './modules/teacher/Dashboard';

function App() {
  const location = useLocation();
  const isStudentPage = location.pathname.startsWith('/student');
  const isParentPage = location.pathname.startsWith('/parent');
  const isTeacherPage = location.pathname.startsWith('/teacher');

  return (
    <div className="app-container">
      {!isStudentPage && !isParentPage && !isTeacherPage && <Navbar />}
      {isStudentPage && <Navbarrr />}

      <Routes>
        <Route path="/student/dashboard" element={<Home1 />} />
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        {/* ...others omitted for brevity */}
      </Routes>
    </div>
  );
}
```

### API Helper ↔ View ↔ Model

```javascript
// src/config/api.js (excerpt)
const DJANGO_BASE_URL = process.env.REACT_APP_DJANGO_URL || 'http://localhost:8001/api';

export const djangoAPI = {
  get: async (url) => {
    const response = await fetch(url, {
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    });
    return response.json();
  },
  post: async (url, data) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },
  // ... put/delete helpers
};
```

**Trace:**
1. React component calls `djangoAPI.post()`.
2. Django view validates payload using `QuizSubmissionSerializer`.
3. `QuizAttempt` & `QuizAnswer` persistence happen here.
4. Response (JSON) returns to frontend to update UI.

---

## 4. Bidirectional Data Flows

### Flow A – Student Quiz ↔ Parent Dashboard

**Sequence Diagram**
```
Student UI                    Backend                       DB                     Parent UI
-----------                   -------                       --                     ----------
QuickPractice.jsx  --> POST /api/quizzes/submit-attempt --> quiz_attempt          (data stored)
 (submits answers)                                          quiz_answer
                                                                   |
                                                                   v
                                                            coin_transaction
                                                                   |
                                                                   v
                                               ParentDashboard.jsx GET /api/quizzes/recent-attempts
                                               (filter by child via parent_student_mapping)
```

**Key Files**
- Frontend: `src/modules/student/QuickPractice.jsx`, `src/modules/parent/ParentDashboard.jsx`
- API helper: `src/config/api.js`
- Backend: `backend/quizzes/views.py::submit_quiz`, `backend/quizzes/serializers.py`
- Database tables: `quiz_attempt`, `quiz_answer`, `parent_student_mapping`, `coin_transaction`

**Bidirectional Insight**
- Student events write to shared tables.
- Parent dashboards query those tables via their own endpoints.
- Rewards system (`coin_transaction`) keeps balances aligned for both views.

### Flow B – AI Study Plan ↔ Calendar Notifications

**Sequence Diagram**
```
Student StudyPlanner.jsx
    |
    | 1. POST /api/ai-assistant/generate-study-plan
    v
Django ai_assistant/views.py
    | 2. Forward to FastAPI /ai-assistant/generate-study-plan
    v
FastAPI (AI service)
    | 3. Returns plan JSON
    v
Django persists plan -> ai_study_plans & calendar
    |
    | 4. Optionally create student_notifications row
    v
Parent dashboard pulls GET /api/ai-assistant/study-plans/
Calendar widget loads GET /api/ai-assistant/calendar/entries/
```

**Key Files**
- Frontend: `src/modules/student/StudyPlanner.jsx`, `