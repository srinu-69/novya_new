# NOVYA LMS – Project Overview

This document captures the end‑to‑end picture of the NOVYA platform: what it is, how it is structured, the key API surfaces (Django REST + FastAPI AI), and how the main user workflows run through the stack.

## 1) What the project is
- A full LMS with roles for Students, Parents, and Teachers.
- Django REST backend (multi‑app) with PostgreSQL for core data.
- Separate FastAPI service for AI (quiz generation, chatbot, study plan, notes).
- React frontends (two codebases present): `novya-frontend-main` (primary) and `Novya-4MODULES-main` (earlier CRA snapshot).
- Internationalization support on the frontend; JWT auth and DRF on the backend.

## 2) High‑level architecture
- `backend/config/urls.py` exposes all Django APIs under `/api/...` and serves schema + Swagger (`/api/schema/`, `/api/docs/`).
- Django apps: `authentication`, `courses`, `quizzes`, `progress`, `notifications`, `ai_assistant`, plus `studyroom`, `core`.
- FastAPI AI service lives in `backend/ai_backend/app.py` and is started separately (defaults to `http://localhost:8000`).
- Frontend expects:
  - Django base: `http://localhost:8001/api`
  - FastAPI base: `http://localhost:8000`
  (defaults, can be changed via frontend config or env)

## 3) Backend (Django) – main API surfaces
Base path: `/api/`

### Authentication (`authentication/`)
- `POST /api/auth/register/` – create user (role driven).
- `POST /api/auth/login/` / `POST /api/auth/logout/` – session via JWT.
- `GET|PUT /api/auth/profile/` – fetch/update current profile.
- `POST /api/auth/change-password/`
- `POST /api/auth/request-password-reset/` and `/confirm-password-reset/`

### Courses (`courses/`)
- `GET /api/courses/subjects/`
- `GET /api/courses/` – list courses
- `GET /api/courses/{course_id}/`
- `GET /api/courses/{course_id}/chapters/`
- `GET /api/courses/{course_id}/chapters/{chapter_id}/lessons/`
- `POST /api/courses/{course_id}/enroll/`
- `GET /api/courses/{course_id}/progress/`
- `POST /api/courses/lessons/{lesson_id}/progress/`

### Quizzes (`quizzes/`)
- `GET /api/quizzes/` and `/api/quizzes/{id}/`
- `POST /api/quizzes/{id}/start/`
- `POST /api/quizzes/{id}/submit/`
- `GET /api/quizzes/attempts/` and `/attempts/{attempt_id}/`
- `GET /api/quizzes/stats/`

### Progress & attendance (`progress/`)
- `GET /api/progress/dashboard/`
- `GET /api/progress/attendance/`
- `GET /api/progress/assignments/`
- `POST /api/progress/assignments/{id}/submit/`
- `GET /api/progress/grades/`
- `GET /api/progress/achievements/`
- `GET /api/progress/parent-dashboard/`
- `GET /api/progress/children/`

### Notifications & messaging (`notifications/`)
- `GET /api/notifications/`
- `POST /api/notifications/{id}/read/`
- `GET /api/notifications/events/`
- `POST /api/notifications/events/{id}/register/`
- `GET /api/notifications/announcements/`
- `GET|POST /api/notifications/messages/`

### AI assistant storage (`ai_assistant/`)
- Manages saved study plans, notes, and chat history tied to users (Django side). Endpoints are under `/api/ai-assistant/` (see `ai_assistant/urls.py`).

### Realtime studyroom (`studyroom/`)
- WebSocket consumers for collaborative study/chat (see `studyroom/consumers.py`, `routing.py`). REST helpers live under `/` via `studyroom.urls`.

## 4) AI service (FastAPI in `backend/ai_backend`)
Base path defaults to `/` on port 8000.
- Curriculum metadata:
  - `GET /classes`, `/chapters?class_name=...`, `/subtopics?class_name=...&subject=...`
- Quiz generation:
  - `GET /quiz?subtopic=...&language=...&currentLevel=...` (Quick Practice, ~10 MCQs)
- Mock tests:
  - `GET /mock_classes`, `/mock_subjects`, `/mock_chapters`
  - `GET /mock_test?...` (50 MCQs, chapter/subject aware)
- AI assistant:
  - `POST /ai-assistant/chat`
  - `POST /ai-assistant/generate-study-plan`
  - `POST /ai-assistant/generate-notes`

The service is stateless; it calls OpenRouter (Gemini 2.0 Flash) using the key from `backend/ai_backend/.env`.

## 5) Frontend surfaces (React)
- Primary codebase: `novya-frontend-main/src/`
  - Routing and shared setup in `index.js`, `App.js`.
  - Auth: `modules/login/Login.js`.
  - Student: dashboards, courses, lessons, quick practice, mock tests, AI chat, attendance, progress, profile (see `modules/student/*`).
  - Parent: dashboard, child profile, quiz/mock reports, homework, study planner (see `modules/parent/*`).
  - Teacher: course/quiz management and dashboards (see `modules/teacher/*`).
  - API layer: `config/api.js` centralizes Django + FastAPI endpoints.
  - Utilities: `utils/quizTracking.js` etc.
- Secondary snapshot: `Novya-4MODULES-main/` (older CRA build; keep for reference).

## 6) Data model (selected core entities)
- Users with roles (Student, Parent, Teacher) and profile extensions.
- Courses: Subject → Course → Chapter → Lesson; `CourseEnrollment` links students to courses.
- Quizzes: `Quiz`, `Question`, `QuestionOption`, `QuizAttempt`, `QuizAnswer`, `QuizResult`.
- Progress: `StudentProgress`, `Attendance`, `Assignment`, `AssignmentSubmission`, `Grade`, `Achievement`.
- Notifications: `Event`, `EventRegistration`, `Notification`, `Announcement`, `Message`, `Feedback`.
- AI assistant (Django): `StudyPlan`, `Note`, `ChatHistory` for persistence of AI interactions.

## 7) Key user workflows (request/response path)
- **Authentication**: Frontend posts to `/api/auth/login/` → receives JWT → stored client‑side → all subsequent Django API calls include the token. Profile/edit flows hit `/api/auth/profile/`.
- **Student learning flow**: List courses (`/api/courses/`), open course → chapters/lessons → mark lesson progress (`/api/courses/lessons/{id}/progress/`) → take quizzes (`/api/quizzes/{id}/start|submit`) → view stats (`/api/quizzes/stats/`) → dashboard aggregates (`/api/progress/dashboard/`).
- **AI quick practice / mock**: UI calls FastAPI for metadata (`/classes`, `/chapters`, `/subtopics`) → generate quiz via `/quiz` or `/mock_test` → answers handled client‑side; persistence/analytics can be stored via Django quiz endpoints if needed.
- **AI assistant (chat/notes/plan)**: UI posts to FastAPI `/ai-assistant/chat|generate-*` for generation; Django `ai_assistant` endpoints store/retrieve study plans, notes, and chat history per user.
- **Parent monitoring**: Parent token → fetch `/api/progress/parent-dashboard/` and `/api/progress/children/` → view child grades, attendance, assignments.
- **Teacher management**: Create/manage courses and assessments via course/quiz endpoints; send announcements via notifications endpoints.
- **Notifications/messages**: Poll `/api/notifications/`; mark read; events registration; messages CRUD via `/api/notifications/messages/`.
- **Realtime studyroom**: WebSocket connect to `studyroom` routing for live sessions; REST helpers exposed via `studyroom.urls`.

## 8) Running the stack (local)
- **Django**: `cd backend && python manage.py runserver 8001`
- **FastAPI AI**: `cd backend/ai_backend && python app.py` (or uvicorn)
- **Frontend**: `cd novya-frontend-main && npm start`
- Env essentials:
  - Django `.env` (DB, JWT, Redis, email, CORS; see `backend/README.md`)
  - FastAPI `.env` with `OPENROUTER_API_KEY`

## 9) Tips for contributors
- Start with `START_HERE.txt` for a quick status recap of the AI backend wiring.
- Use `/api/docs/` (Swagger via drf-spectacular) to explore live Django endpoints.
- For file mapping between UI and API, see `backend/FRONTEND_BACKEND_CONNECTIONS_DOCUMENTATION.md`.
- Lint/tests:
  - Backend: `python manage.py test`, `black .`, `flake8 .`, `isort .`
  - Frontend: `npm test`, `npm run lint`

---

If you need a deeper drill (e.g., per-module data contracts or DB schema details), start from `NOVYA_Database_Schema.md` and `NOVYA_PostgreSQL_Schema.sql`, then trace the corresponding serializers and views in each Django app.

