# NOVYA - Learning Management System

A comprehensive Learning Management System (LMS) with AI-powered features, built with Django REST API backend and React frontend.

## 🚀 Features

### Core LMS Features
- **User Management**: Students, Parents, and Teachers with role-based authentication
- **Course Management**: Subjects, Courses, Chapters, and Lessons
- **Quiz System**: Interactive quizzes with multiple choice questions and analytics
- **Progress Tracking**: Student progress, attendance, and achievements
- **Parent Dashboard**: Monitor child's academic progress
- **Notifications**: Events, announcements, and messaging system
- **Study Planning**: Personalized study plans and schedules

### AI-Powered Features
- **AI Assistant**: Intelligent tutoring and question answering
- **Quiz Generation**: Automated quiz creation from content
- **Learning Analytics**: AI-driven insights into student performance
- **Personalized Recommendations**: Tailored learning paths

## 🏗️ Project Structure

```
novya/
├── backend/                 # Django REST API Backend
│   ├── ai_backend/         # AI-powered features
│   ├── authentication/     # User authentication
│   ├── courses/           # Course management
│   ├── quizzes/           # Quiz system
│   ├── progress/          # Progress tracking
│   ├── notifications/     # Notification system
│   └── config/            # Django configuration
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   │   ├── student/   # Student interface
│   │   │   ├── parent/    # Parent dashboard
│   │   │   └── login/     # Authentication
│   │   ├── config/        # API configuration
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **Django 4.2+**: Web framework
- **Django REST Framework**: API development
- **PostgreSQL**: Database
- **Redis**: Caching and session storage
- **Celery**: Background task processing
- **JWT**: Authentication

### Frontend
- **React 18+**: UI framework
- **React Router**: Navigation
- **Axios**: HTTP client
- **Material-UI**: Component library
- **i18next**: Internationalization

### AI/ML
- **OpenAI API**: AI-powered features
- **Python**: AI processing
- **Natural Language Processing**: Content analysis

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Redis 6+

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup:**
   Create a `.env` file in the backend directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   DB_NAME=novya_lms
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

5. **Database setup:**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Start backend server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

### AI Backend Setup

1. **Navigate to AI backend:**
   ```bash
   cd backend/ai_backend
   ```

2. **Install AI dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up OpenAI API key:**
   Create a `.env` file:
   ```env
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Start AI backend:**
   ```bash
   python app.py
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

### Course Endpoints
- `GET /api/courses/` - List courses
- `GET /api/courses/{id}/` - Course details
- `POST /api/courses/{id}/enroll/` - Enroll in course

### Quiz Endpoints
- `GET /api/quizzes/` - List quizzes
- `POST /api/quizzes/{id}/start/` - Start quiz
- `POST /api/quizzes/{id}/submit/` - Submit quiz

### AI Endpoints
- `POST /api/ai/chat/` - AI chat interface
- `POST /api/ai/generate-quiz/` - Generate quiz from content
- `GET /api/ai/analytics/` - Learning analytics

## 🎯 User Roles

### Student
- Access enrolled courses
- Take quizzes and assessments
- View progress and achievements
- Interact with AI assistant
- Submit assignments

### Parent
- Monitor child's progress
- View attendance and grades
- Receive notifications
- Access parent dashboard

### Teacher
- Create and manage courses
- Assign quizzes and homework
- Grade assignments
- Track student progress
- Send announcements

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test
```

### Code Quality
```bash
# Backend
black .
flake8 .
isort .

# Frontend
npm run lint
npm run format
```

## 🚀 Deployment

### Production Setup
1. Set `DEBUG=False` in environment variables
2. Configure production database
3. Set up Redis for production
4. Configure email backend
5. Set up static file serving
6. Configure CORS for production domain
7. Set up SSL certificates

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**NOVYA LMS** - Empowering Education Through Technology