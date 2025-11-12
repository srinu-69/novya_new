# NOVYA Learning Management System - Complete Database Schema

## Overview
This document provides the complete database schema for the NOVYA Learning Management System, including all tables, fields, relationships, and constraints.

---

## 📊 **AUTHENTICATION MODULE**

### 1. **parent_registration**
```sql
CREATE TABLE parent_registration (
    parent_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    parent_username VARCHAR(255) UNIQUE NOT NULL,
    parent_password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2. **student_registration**
```sql
CREATE TABLE student_registration (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE,
    student_username VARCHAR(255) UNIQUE NOT NULL,
    student_email VARCHAR(255) UNIQUE,
    parent_email VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3. **parent_student_mapping**
```sql
CREATE TABLE parent_student_mapping (
    mapping_id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_email VARCHAR(255) NOT NULL,
    student_id INTEGER NOT NULL
);
```

### 4. **class**
```sql
CREATE TABLE class (
    class_id INTEGER PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL
);
```

### 5. **users** (Legacy User Model)
```sql
CREATE TABLE users (
    userid INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(150) UNIQUE NOT NULL,
    phonenumber VARCHAR(15) UNIQUE,
    role VARCHAR(50) DEFAULT 'Student',
    createdat DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE
);
```

### 6. **parent** (Legacy)
```sql
CREATE TABLE parent (
    parent_id INTEGER PRIMARY KEY,
    FOREIGN KEY (parent_id) REFERENCES users(userid)
);
```

### 7. **student** (Legacy)
```sql
CREATE TABLE student (
    student_id INTEGER PRIMARY KEY,
    class_id INTEGER,
    parent_id INTEGER,
    FOREIGN KEY (student_id) REFERENCES users(userid),
    FOREIGN KEY (class_id) REFERENCES class(class_id),
    FOREIGN KEY (parent_id) REFERENCES parent(parent_id)
);
```

### 8. **student_profile**
```sql
CREATE TABLE student_profile (
    profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER UNIQUE NOT NULL,
    student_username VARCHAR(255) UNIQUE,
    parent_email VARCHAR(255),
    grade VARCHAR(50),
    school VARCHAR(150),
    course_id INTEGER,
    address TEXT
);
```

### 9. **authentication_password_reset_token**
```sql
CREATE TABLE authentication_password_reset_token (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(userid)
);
```

---

## 📚 **COURSES MODULE**

### 10. **course**
```sql
CREATE TABLE course (
    course_id INTEGER PRIMARY KEY,
    class_id INTEGER,
    course_name VARCHAR(100) NOT NULL,
    course_price DECIMAL(10,2)
);
```

### 11. **topic**
```sql
CREATE TABLE topic (
    topic_id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    topic_name VARCHAR(100) NOT NULL
);
```

### 12. **pdffiles**
```sql
CREATE TABLE pdffiles (
    pdf_id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(50) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    size_in_kb INTEGER,
    is_public BOOLEAN DEFAULT TRUE
);
```

### 13. **videofiles**
```sql
CREATE TABLE videofiles (
    video_id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(50) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    size_in_mb INTEGER,
    is_public BOOLEAN DEFAULT TRUE
);
```

### 14. **subjects** (Legacy)
```sql
CREATE TABLE subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 15. **chapters** (Legacy)
```sql
CREATE TABLE chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    chapter_number INTEGER NOT NULL,
    order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);
```

### 16. **lessons** (Legacy)
```sql
CREATE TABLE lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT,
    lesson_type VARCHAR(20) DEFAULT 'video',
    order INTEGER DEFAULT 0,
    duration_minutes INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);
```

### 17. **course_enrollments**
```sql
CREATE TABLE course_enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_accessed DATETIME,
    UNIQUE(student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);
```

### 18. **lesson_progress**
```sql
CREATE TABLE lesson_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    completion_percentage INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    UNIQUE(student_id, lesson_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);
```

### 19. **course_materials**
```sql
CREATE TABLE course_materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    material_type VARCHAR(20) NOT NULL,
    file_url VARCHAR(200),
    file_size INTEGER,
    is_public BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);
```

---

## 🧠 **QUIZZES MODULE**

### 20. **quiz**
```sql
CREATE TABLE quiz (
    quiz_id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id INTEGER,
    title VARCHAR(150),
    questions_json TEXT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);
```

### 21. **quiz_question**
```sql
CREATE TABLE quiz_question (
    question_id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(1) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id)
);
```

### 22. **quiz_attempt**
```sql
CREATE TABLE quiz_attempt (
    attempt_id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER,
    student_id INTEGER NOT NULL,
    attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    score FLOAT,
    answers_json TEXT,
    quiz_type VARCHAR(20) DEFAULT 'ai_generated',
    subject VARCHAR(100),
    chapter VARCHAR(100),
    topic VARCHAR(200),
    subtopic VARCHAR(200),
    class_name VARCHAR(50),
    difficulty_level VARCHAR(20) DEFAULT 'simple',
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    unanswered_questions INTEGER DEFAULT 0,
    time_taken_seconds INTEGER DEFAULT 0,
    completion_percentage FLOAT DEFAULT 0.0,
    language VARCHAR(10) DEFAULT 'English',
    quiz_data_json TEXT,
    FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id),
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);
```

### 23. **quiz_answer**
```sql
CREATE TABLE quiz_answer (
    answer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    selected_option VARCHAR(1) NOT NULL,
    is_correct BOOLEAN,
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempt(attempt_id),
    FOREIGN KEY (question_id) REFERENCES quiz_question(question_id)
);
```

### 24. **mock_test**
```sql
CREATE TABLE mock_test (
    test_id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    total_marks INTEGER,
    duration INTEGER,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);
```

### 25. **mock_test_question**
```sql
CREATE TABLE mock_test_question (
    question_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(1) NOT NULL,
    FOREIGN KEY (test_id) REFERENCES mock_test(test_id)
);
```

### 26. **mock_test_attempt**
```sql
CREATE TABLE mock_test_attempt (
    attempt_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    score FLOAT,
    answers_json TEXT,
    quiz_type VARCHAR(50),
    subject VARCHAR(100),
    chapter VARCHAR(100),
    topic VARCHAR(100),
    subtopic VARCHAR(100),
    class_name VARCHAR(50),
    difficulty_level VARCHAR(50),
    language VARCHAR(50),
    total_questions INTEGER,
    correct_answers INTEGER,
    wrong_answers INTEGER,
    unanswered_questions INTEGER,
    time_taken_seconds INTEGER,
    completion_percentage FLOAT,
    mock_test_data_json TEXT,
    FOREIGN KEY (test_id) REFERENCES mock_test(test_id),
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);
```

### 27. **mock_test_answer**
```sql
CREATE TABLE mock_test_answer (
    answer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    selected_option VARCHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (attempt_id) REFERENCES mock_test_attempt(attempt_id),
    FOREIGN KEY (question_id) REFERENCES mock_test_question(question_id)
);
```

### 28. **questions** (Legacy)
```sql
CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice',
    points INTEGER DEFAULT 1,
    order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id)
);
```

### 29. **question_options** (Legacy)
```sql
CREATE TABLE question_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    order INTEGER DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);
```

### 30. **legacy_quiz_answers** (Legacy)
```sql
CREATE TABLE legacy_quiz_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    selected_option_id INTEGER,
    answer_text TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    points_earned INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(attempt_id, question_id),
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempt(attempt_id),
    FOREIGN KEY (question_id) REFERENCES questions(id),
    FOREIGN KEY (selected_option_id) REFERENCES question_options(id)
);
```

### 31. **quiz_results**
```sql
CREATE TABLE quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id INTEGER UNIQUE NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    wrong_answers INTEGER NOT NULL,
    unanswered_questions INTEGER DEFAULT 0,
    accuracy_percentage FLOAT NOT NULL,
    time_per_question_seconds FLOAT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempt(attempt_id)
);
```

### 32. **quiz_analytics**
```sql
CREATE TABLE quiz_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER UNIQUE NOT NULL,
    total_attempts INTEGER DEFAULT 0,
    average_score FLOAT DEFAULT 0,
    pass_rate FLOAT DEFAULT 0,
    average_time_minutes FLOAT DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id)
);
```

### 33. **student_performance**
```sql
CREATE TABLE student_performance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER UNIQUE NOT NULL,
    total_quizzes_attempted INTEGER DEFAULT 0,
    total_questions_answered INTEGER DEFAULT 0,
    total_correct_answers INTEGER DEFAULT 0,
    overall_average_score FLOAT DEFAULT 0.0,
    mathematics_score FLOAT DEFAULT 0.0,
    science_score FLOAT DEFAULT 0.0,
    english_score FLOAT DEFAULT 0.0,
    computers_score FLOAT DEFAULT 0.0,
    class_7_score FLOAT DEFAULT 0.0,
    class_8_score FLOAT DEFAULT 0.0,
    class_9_score FLOAT DEFAULT 0.0,
    class_10_score FLOAT DEFAULT 0.0,
    simple_difficulty_score FLOAT DEFAULT 0.0,
    medium_difficulty_score FLOAT DEFAULT 0.0,
    hard_difficulty_score FLOAT DEFAULT 0.0,
    average_time_per_question FLOAT DEFAULT 0.0,
    completion_rate FLOAT DEFAULT 0.0,
    improvement_trend FLOAT DEFAULT 0.0,
    achievements_json TEXT,
    badges_earned INTEGER DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_quiz_date DATETIME,
    FOREIGN KEY (student_id) REFERENCES users(userid)
);
```

---

## 📈 **PROGRESS MODULE**

### 34. **assignments**
```sql
CREATE TABLE assignments (
    assignment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    file_url TEXT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);
```

### 35. **assignment_question**
```sql
CREATE TABLE assignment_question (
    question_id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(1) NOT NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id)
);
```

### 36. **assignment_submission**
```sql
CREATE TABLE assignment_submission (
    submission_id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    file_url TEXT,
    grade FLOAT,
    remarks TEXT,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id),
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);
```

### 37. **assignment_answer**
```sql
CREATE TABLE assignment_answer (
    answer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    selected_option VARCHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (submission_id) REFERENCES assignment_submission(submission_id),
    FOREIGN KEY (question_id) REFERENCES assignment_question(question_id)
);
```

### 38. **careerperformance**
```sql
CREATE TABLE careerperformance (
    performance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    avg_assignment_score FLOAT,
    avg_mocktest_score FLOAT,
    overall_rating FLOAT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id)
);
```

### 39. **mentorshipticket**
```sql
CREATE TABLE mentorshipticket (
    ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    instructor_id INTEGER,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (instructor_id) REFERENCES users(userid)
);
```

### 40. **attendance** (Legacy)
```sql
CREATE TABLE attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, date),
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);
```

### 41. **grades** (Legacy)
```sql
CREATE TABLE grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    assignment_id INTEGER,
    grade_value FLOAT NOT NULL,
    max_grade FLOAT DEFAULT 100,
    grade_type VARCHAR(50) DEFAULT 'assignment',
    comments TEXT,
    graded_by INTEGER NOT NULL,
    graded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id),
    FOREIGN KEY (graded_by) REFERENCES users(userid)
);
```

### 42. **student_progress** (Legacy)
```sql
CREATE TABLE student_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    overall_percentage FLOAT DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    assignments_completed INTEGER DEFAULT 0,
    total_assignments INTEGER DEFAULT 0,
    last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);
```

### 43. **study_plans** (Legacy)
```sql
CREATE TABLE study_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id)
);
```

### 44. **study_plan_items** (Legacy)
```sql
CREATE TABLE study_plan_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_plan_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date DATETIME NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    order INTEGER DEFAULT 0,
    FOREIGN KEY (study_plan_id) REFERENCES study_plans(id)
);
```

### 45. **achievements** (Legacy)
```sql
CREATE TABLE achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    achievement_type VARCHAR(50) NOT NULL,
    points INTEGER DEFAULT 0,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id)
);
```

---

## 🔔 **NOTIFICATIONS MODULE**

### 46. **review**
```sql
CREATE TABLE review (
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    reviewer_id INTEGER NOT NULL,
    course_id INTEGER,
    instructor_id INTEGER,
    topic_id INTEGER,
    review_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES users(userid),
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (instructor_id) REFERENCES users(userid),
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);
```

### 47. **rating**
```sql
CREATE TABLE rating (
    rating_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER,
    instructor_id INTEGER,
    topic_id INTEGER,
    rating_value INTEGER NOT NULL,
    rated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(userid),
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (instructor_id) REFERENCES users(userid),
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);
```

### 48. **report**
```sql
CREATE TABLE report (
    report_id INTEGER PRIMARY KEY AUTOINCREMENT,
    reported_by INTEGER NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    reference_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (reported_by) REFERENCES users(userid)
);
```

### 49. **events** (Legacy)
```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    event_type VARCHAR(20) NOT NULL,
    target_audience VARCHAR(20) DEFAULT 'all',
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    location VARCHAR(200),
    is_published BOOLEAN DEFAULT TRUE,
    registration_required BOOLEAN DEFAULT FALSE,
    max_participants INTEGER,
    registration_deadline DATETIME,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(userid)
);
```

### 50. **event_registrations** (Legacy)
```sql
CREATE TABLE event_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'registered',
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE(event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(userid)
);
```

### 51. **notifications** (Legacy)
```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(20) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(userid)
);
```

### 52. **announcements** (Legacy)
```sql
CREATE TABLE announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    target_audience VARCHAR(20) DEFAULT 'all',
    is_important BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(userid)
);
```

### 53. **messages** (Legacy)
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    subject VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    parent_message_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(userid),
    FOREIGN KEY (recipient_id) REFERENCES users(userid),
    FOREIGN KEY (parent_message_id) REFERENCES messages(id)
);
```

### 54. **feedback** (Legacy)
```sql
CREATE TABLE feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    feedback_type VARCHAR(20) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at DATETIME,
    admin_response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(userid)
);
```

---

## ⚙️ **CORE MODULE**

### 55. **system_settings**
```sql
CREATE TABLE system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 56. **audit_logs**
```sql
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action VARCHAR(20) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    object_id INTEGER,
    description TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(userid)
);
```

---

## 🤖 **AI ASSISTANT MODULE**

### 57. **ai_study_plans**
```sql
CREATE TABLE ai_study_plans (
    plan_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(200) NOT NULL,
    subtopic VARCHAR(200),
    plan_title VARCHAR(200) NOT NULL,
    plan_content TEXT NOT NULL,
    plan_type VARCHAR(50) DEFAULT 'study_plan',
    difficulty_level VARCHAR(20) DEFAULT 'medium',
    estimated_duration_hours INTEGER DEFAULT 1,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);
```

### 58. **ai_generated_notes**
```sql
CREATE TABLE ai_generated_notes (
    note_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(200) NOT NULL,
    subtopic VARCHAR(200),
    note_title VARCHAR(200) NOT NULL,
    note_content TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'ai_generated',
    key_points JSONB, -- Store key points as JSON array
    summary TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);
```

### 59. **manual_notes**
```sql
CREATE TABLE manual_notes (
    note_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(200) NOT NULL,
    subtopic VARCHAR(200),
    note_title VARCHAR(200),
    note_content TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'manual',
    color VARCHAR(7) DEFAULT '#fef3c7', -- Note background color
    is_important BOOLEAN DEFAULT FALSE,
    tags JSONB, -- Store tags as JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);
```

### 60. **ai_chat_history**
```sql
CREATE TABLE ai_chat_history (
    chat_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(200) NOT NULL,
    subtopic VARCHAR(200),
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    response_type VARCHAR(50) DEFAULT 'general', -- study_plan, notes, explanation, etc.
    message_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(100), -- Group related messages in a session
    is_favorite BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);
```

### 61. **ai_interaction_sessions**
```sql
CREATE TABLE ai_interaction_sessions (
    session_id VARCHAR(100) PRIMARY KEY,
    student_id INTEGER NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(200) NOT NULL,
    subtopic VARCHAR(200),
    session_type VARCHAR(50) DEFAULT 'general', -- study_plan, notes, qna, etc.
    total_messages INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);
```

### 62. **ai_favorites**
```sql
CREATE TABLE ai_favorites (
    favorite_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- study_plan, ai_note, manual_note, chat_message
    content_id INTEGER NOT NULL, -- ID of the referenced content
    favorite_title VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);
```

---

## 🔗 **KEY RELATIONSHIPS**

### **Primary Relationships:**
1. **Student Registration** ↔ **Parent Registration** (via parent_email)
2. **Student Registration** ↔ **Class** (via class_id)
3. **Course** ↔ **Topic** (one-to-many)
4. **Topic** ↔ **Quiz** (one-to-many)
5. **Quiz** ↔ **Quiz Attempt** (one-to-many)
6. **Student Registration** ↔ **Quiz Attempt** (one-to-many)
7. **Mock Test** ↔ **Mock Test Attempt** (one-to-many)
8. **Assignment** ↔ **Assignment Submission** (one-to-many)
9. **Student Registration** ↔ **AI Study Plans** (one-to-many)
10. **Student Registration** ↔ **AI Generated Notes** (one-to-many)
11. **Student Registration** ↔ **Manual Notes** (one-to-many)
12. **Student Registration** ↔ **AI Chat History** (one-to-many)
13. **AI Interaction Sessions** ↔ **AI Chat History** (one-to-many)

### **User Roles:**
- **Students**: Can take quizzes, mock tests, view courses
- **Parents**: Can monitor child's progress, view reports
- **Admins**: Full system access, user management

### **Data Flow:**
1. **Authentication** → User registration and login
2. **Courses** → Course content and materials
3. **Quizzes** → Assessment and evaluation
4. **Progress** → Performance tracking and analytics
5. **Notifications** → Communication and alerts

---

## 📊 **DATABASE STATISTICS**

- **Total Tables**: 62
- **Primary Modules**: 6 (Authentication, Courses, Quizzes, Progress, Notifications, AI Assistant)
- **Legacy Tables**: 15 (for backward compatibility)
- **Core Tables**: 47 (active functionality)
- **AI Assistant Tables**: 6 (new functionality)
- **Relationships**: 30+ foreign key relationships
- **Indexes**: Primary keys on all tables, unique constraints on critical fields

---

## 🚀 **TECHNOLOGY STACK**

- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Django ORM
- **Backend**: Django REST Framework
- **Frontend**: React.js
- **Authentication**: JWT tokens with refresh mechanism
- **File Storage**: Local/Cloud storage for PDFs and videos

This schema supports a comprehensive Learning Management System with user management, course delivery, assessment tools, progress tracking, communication features, and AI-powered study assistance.

---

## 🗄️ **POSTGRESQL-SPECIFIC FEATURES**

### **Indexes for Performance:**
```sql
-- AI Assistant Module Indexes
CREATE INDEX idx_ai_study_plans_student_class ON ai_study_plans(student_id, class_name);
CREATE INDEX idx_ai_study_plans_subject_chapter ON ai_study_plans(subject, chapter);
CREATE INDEX idx_ai_generated_notes_student_class ON ai_generated_notes(student_id, class_name);
CREATE INDEX idx_manual_notes_student_class ON manual_notes(student_id, class_name);
CREATE INDEX idx_ai_chat_history_student_session ON ai_chat_history(student_id, session_id);
CREATE INDEX idx_ai_chat_history_timestamp ON ai_chat_history(message_timestamp);

-- Authentication Module Indexes
CREATE INDEX idx_student_registration_parent_email ON student_registration(parent_email);
CREATE INDEX idx_parent_student_mapping_parent ON parent_student_mapping(parent_email);

-- Quiz Module Indexes
CREATE INDEX idx_quiz_attempt_student_date ON quiz_attempt(student_id, attempted_at);
CREATE INDEX idx_quiz_attempt_subject_class ON quiz_attempt(subject, class_name);
CREATE INDEX idx_mock_test_attempt_student_date ON mock_test_attempt(student_id, attempted_at);

-- Course Module Indexes
CREATE INDEX idx_pdffiles_course_topic ON pdffiles(course_id, topic_id);
CREATE INDEX idx_videofiles_course_topic ON videofiles(course_id, topic_id);
```

### **JSONB Indexes for AI Content:**
```sql
-- GIN indexes for JSONB fields
CREATE INDEX idx_ai_generated_notes_key_points ON ai_generated_notes USING GIN (key_points);
CREATE INDEX idx_manual_notes_tags ON manual_notes USING GIN (tags);
```

### **Full-Text Search Indexes:**
```sql
-- Full-text search for AI content
CREATE INDEX idx_ai_study_plans_content_search ON ai_study_plans USING GIN (to_tsvector('english', plan_content));
CREATE INDEX idx_ai_generated_notes_content_search ON ai_generated_notes USING GIN (to_tsvector('english', note_content));
CREATE INDEX idx_manual_notes_content_search ON manual_notes USING GIN (to_tsvector('english', note_content));
CREATE INDEX idx_ai_chat_history_search ON ai_chat_history USING GIN (to_tsvector('english', user_message || ' ' || ai_response));
```

### **Triggers for Auto-Update:**
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to AI Assistant tables
CREATE TRIGGER update_ai_study_plans_updated_at BEFORE UPDATE ON ai_study_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_generated_notes_updated_at BEFORE UPDATE ON ai_generated_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_manual_notes_updated_at BEFORE UPDATE ON manual_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Views for Common Queries:**
```sql
-- View for student's AI content summary
CREATE VIEW student_ai_content_summary AS
SELECT 
    s.student_id,
    s.first_name || ' ' || s.last_name as student_name,
    COUNT(DISTINCT asp.plan_id) as total_study_plans,
    COUNT(DISTINCT agn.note_id) as total_ai_notes,
    COUNT(DISTINCT mn.note_id) as total_manual_notes,
    COUNT(DISTINCT ach.chat_id) as total_chat_messages,
    MAX(GREATEST(
        COALESCE(asp.updated_at, '1970-01-01'::timestamp),
        COALESCE(agn.updated_at, '1970-01-01'::timestamp),
        COALESCE(mn.updated_at, '1970-01-01'::timestamp),
        COALESCE(ach.message_timestamp, '1970-01-01'::timestamp)
    )) as last_activity
FROM student_registration s
LEFT JOIN ai_study_plans asp ON s.student_id = asp.student_id
LEFT JOIN ai_generated_notes agn ON s.student_id = agn.student_id
LEFT JOIN manual_notes mn ON s.student_id = mn.student_id
LEFT JOIN ai_chat_history ach ON s.student_id = ach.student_id
GROUP BY s.student_id, s.first_name, s.last_name;

-- View for recent AI interactions
CREATE VIEW recent_ai_interactions AS
SELECT 
    student_id,
    class_name,
    subject,
    chapter,
    subtopic,
    'study_plan' as content_type,
    plan_title as title,
    created_at
FROM ai_study_plans
UNION ALL
SELECT 
    student_id,
    class_name,
    subject,
    chapter,
    subtopic,
    'ai_note' as content_type,
    note_title as title,
    created_at
FROM ai_generated_notes
UNION ALL
SELECT 
    student_id,
    class_name,
    subject,
    chapter,
    subtopic,
    'manual_note' as content_type,
    COALESCE(note_title, 'Untitled Note') as title,
    created_at
FROM manual_notes
ORDER BY created_at DESC;
```

### **Sample Data for Testing:**
```sql
-- Insert sample AI study plan
INSERT INTO ai_study_plans (student_id, class_name, subject, chapter, subtopic, plan_title, plan_content, difficulty_level, estimated_duration_hours)
VALUES (1, '8th', 'Maths', 'Chapter 2: Linear Equations in One Variable', 'Some Applications', 
        'Linear Equations Study Plan', 
        '1. Review basic concepts (30 min)\n2. Practice word problems (45 min)\n3. Solve application problems (60 min)\n4. Take practice quiz (30 min)', 
        'medium', 3);

-- Insert sample AI generated note
INSERT INTO ai_generated_notes (student_id, class_name, subject, chapter, subtopic, note_title, note_content, key_points)
VALUES (1, '8th', 'Maths', 'Chapter 2: Linear Equations in One Variable', 'Some Applications',
        'Linear Equations Applications - Key Points',
        'Linear equations are used to solve real-world problems involving unknown quantities. The key is to identify the variable and set up the equation correctly.',
        '["Identify the unknown variable", "Set up the equation", "Solve for the variable", "Check your answer"]');

-- Insert sample manual note
INSERT INTO manual_notes (student_id, class_name, subject, chapter, subtopic, note_content, color, tags)
VALUES (1, '8th', 'Maths', 'Chapter 2: Linear Equations in One Variable', 'Some Applications',
        'Remember: Always check your answer by substituting back into the original equation!',
        '#fef3c7', '["important", "checking", "verification"]');
```
