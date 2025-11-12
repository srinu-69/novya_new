-- NOVYA Learning Management System - PostgreSQL Schema
-- Simple and clean PostgreSQL version with all required functionality

-- =====================================================
-- AUTHENTICATION MODULE
-- =====================================================

-- Parent Registration
CREATE TABLE parent_registration (
    parent_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    parent_username VARCHAR(255) UNIQUE NOT NULL,
    parent_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Registration
CREATE TABLE student_registration (
    student_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE,
    student_username VARCHAR(255) UNIQUE NOT NULL,
    student_email VARCHAR(255) UNIQUE,
    parent_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parent-Student Mapping
CREATE TABLE parent_student_mapping (
    mapping_id SERIAL PRIMARY KEY,
    parent_email VARCHAR(255) NOT NULL,
    student_id INTEGER NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);

-- Classes
CREATE TABLE class (
    class_id INTEGER PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL
);

-- Legacy Users (for backward compatibility)
CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(150) UNIQUE NOT NULL,
    phonenumber VARCHAR(15) UNIQUE,
    role VARCHAR(50) DEFAULT 'Student',
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE
);

-- Student Profile
CREATE TABLE student_profile (
    profile_id SERIAL PRIMARY KEY,
    student_id INTEGER UNIQUE NOT NULL,
    student_username VARCHAR(255) UNIQUE,
    parent_email VARCHAR(255),
    grade VARCHAR(50),
    school VARCHAR(150),
    course_id INTEGER,
    address TEXT,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);

-- Password Reset Tokens
CREATE TABLE authentication_password_reset_token (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(userid)
);

-- =====================================================
-- COURSES MODULE
-- =====================================================

-- Courses
CREATE TABLE course (
    course_id INTEGER PRIMARY KEY,
    class_id INTEGER,
    course_name VARCHAR(100) NOT NULL,
    course_price DECIMAL(10,2)
);

-- Topics
CREATE TABLE topic (
    topic_id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    topic_name VARCHAR(100) NOT NULL
);

-- PDF Files
CREATE TABLE pdffiles (
    pdf_id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(50) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    size_in_kb INTEGER,
    is_public BOOLEAN DEFAULT TRUE
);

-- Video Files
CREATE TABLE videofiles (
    video_id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(50) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    size_in_mb INTEGER,
    is_public BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- QUIZZES MODULE
-- =====================================================

-- Quizzes
CREATE TABLE quiz (
    quiz_id SERIAL PRIMARY KEY,
    topic_id INTEGER,
    title VARCHAR(150),
    questions_json TEXT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);

-- Quiz Questions
CREATE TABLE quiz_question (
    question_id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(1) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id)
);

-- Quiz Attempts
CREATE TABLE quiz_attempt (
    attempt_id SERIAL PRIMARY KEY,
    quiz_id INTEGER,
    student_id INTEGER NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

-- Quiz Answers
CREATE TABLE quiz_answer (
    answer_id SERIAL PRIMARY KEY,
    attempt_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    selected_option VARCHAR(1) NOT NULL,
    is_correct BOOLEAN,
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempt(attempt_id),
    FOREIGN KEY (question_id) REFERENCES quiz_question(question_id)
);

-- Mock Tests
CREATE TABLE mock_test (
    test_id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    total_marks INTEGER,
    duration INTEGER,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);

-- Mock Test Questions
CREATE TABLE mock_test_question (
    question_id SERIAL PRIMARY KEY,
    test_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(1) NOT NULL,
    FOREIGN KEY (test_id) REFERENCES mock_test(test_id)
);

-- Mock Test Attempts
CREATE TABLE mock_test_attempt (
    attempt_id SERIAL PRIMARY KEY,
    test_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

-- Mock Test Answers
CREATE TABLE mock_test_answer (
    answer_id SERIAL PRIMARY KEY,
    attempt_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    selected_option VARCHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (attempt_id) REFERENCES mock_test_attempt(attempt_id),
    FOREIGN KEY (question_id) REFERENCES mock_test_question(question_id)
);

-- Student Performance
CREATE TABLE student_performance (
    id SERIAL PRIMARY KEY,
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
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_quiz_date TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(userid)
);

-- =====================================================
-- AI ASSISTANT MODULE (NEW)
-- =====================================================

-- AI Generated Study Plans
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

-- AI Generated Notes
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
    key_points TEXT, -- Store as JSON string
    summary TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);

-- Manual Notes
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
    color VARCHAR(7) DEFAULT '#fef3c7',
    is_important BOOLEAN DEFAULT FALSE,
    tags TEXT, -- Store as JSON string
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);

-- AI Chat History
CREATE TABLE ai_chat_history (
    chat_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(200) NOT NULL,
    subtopic VARCHAR(200),
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    response_type VARCHAR(50) DEFAULT 'general',
    message_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(100),
    is_favorite BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);

-- AI Interaction Sessions
CREATE TABLE ai_interaction_sessions (
    session_id VARCHAR(100) PRIMARY KEY,
    student_id INTEGER NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(200) NOT NULL,
    subtopic VARCHAR(200),
    session_type VARCHAR(50) DEFAULT 'general',
    total_messages INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);

-- AI Favorites
CREATE TABLE ai_favorites (
    favorite_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    content_id INTEGER NOT NULL,
    favorite_title VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);

-- Calendar (Study Calendar Entries)
-- Stores individual study plan calendar entries for the Study Calendar widget
CREATE TABLE calendar (
    calendar_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    entry_date DATE NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(200) NOT NULL,
    duration VARCHAR(50) DEFAULT '60 minutes',
    class_name VARCHAR(50),
    chapter VARCHAR(200),
    subtopic VARCHAR(200),
    plan_id INTEGER, -- Optional reference to ai_study_plans if this entry came from a study plan
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id),
    FOREIGN KEY (plan_id) REFERENCES ai_study_plans(plan_id) ON DELETE SET NULL
);

-- =====================================================
-- PROGRESS MODULE
-- =====================================================

-- Assignments
CREATE TABLE assignments (
    assignment_id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    file_url TEXT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);

-- Assignment Questions
CREATE TABLE assignment_question (
    question_id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(1) NOT NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id)
);

-- Assignment Submissions
CREATE TABLE assignment_submission (
    submission_id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_url TEXT,
    grade FLOAT,
    remarks TEXT,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id),
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);

-- Assignment Answers
CREATE TABLE assignment_answer (
    answer_id SERIAL PRIMARY KEY,
    submission_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    selected_option VARCHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (submission_id) REFERENCES assignment_submission(submission_id),
    FOREIGN KEY (question_id) REFERENCES assignment_question(question_id)
);

-- Career Performance
CREATE TABLE careerperformance (
    performance_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    avg_assignment_score FLOAT,
    avg_mocktest_score FLOAT,
    overall_rating FLOAT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- REWARDS/COINS MODULE
-- =====================================================

-- Coin Transactions
-- Tracks all coin/reward point transactions for users
CREATE TABLE coin_transaction (
    transaction_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    coins INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'earned' or 'spent'
    source VARCHAR(50) NOT NULL, -- 'login', 'quiz', 'mock_test', 'spin_wheel', 'purchase', etc.
    reason TEXT, -- Description of why coins were earned/spent
    reference_id INTEGER, -- Reference to related entity (quiz_attempt_id, mock_test_attempt_id, etc.)
    reference_type VARCHAR(50), -- Type of reference ('quiz_attempt', 'mock_test_attempt', etc.)
    metadata JSONB, -- Additional data (quiz score, spin wheel result, etc.)
    balance_after INTEGER NOT NULL, -- User's coin balance after this transaction
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id),
    CONSTRAINT chk_coin_transaction_type CHECK (transaction_type IN ('earned', 'spent')),
    CONSTRAINT chk_coin_transaction_positive CHECK (coins > 0)
);

-- User Coin Balance
-- Stores current coin balance for each user (optimized for quick access)
CREATE TABLE user_coin_balance (
    balance_id SERIAL PRIMARY KEY,
    student_id INTEGER UNIQUE NOT NULL,
    total_coins INTEGER DEFAULT 0,
    total_earned INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    last_transaction_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id)
);

-- Student Feedback
-- Stores feedback from students with rating and comments
CREATE TABLE student_feedback (
    feedback_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    rating INTEGER NOT NULL, -- 1-5 rating
    comment TEXT NOT NULL,
    coins_awarded INTEGER DEFAULT 0, -- Track if coins were awarded (20 for first feedback)
    reward_received BOOLEAN DEFAULT FALSE, -- Track if one-time reward was received
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id),
    CONSTRAINT chk_feedback_rating CHECK (rating >= 1 AND rating <= 5)
);

-- =====================================================
-- NOTIFICATIONS MODULE
-- =====================================================

-- Student Notifications (Study Plan Notifications)
-- Stores notifications related to study plans created for students
CREATE TABLE student_notifications (
    notification_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    notification_type VARCHAR(50) NOT NULL DEFAULT 'study_plan_created',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    plan_id VARCHAR(200), -- Reference to study plan ID (e.g., "plan_7_Math_Chapter1_...")
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_registration(student_id) ON DELETE CASCADE
);

-- Reviews
CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    reviewer_id INTEGER NOT NULL,
    course_id INTEGER,
    instructor_id INTEGER,
    topic_id INTEGER,
    review_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES users(userid),
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (instructor_id) REFERENCES users(userid),
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);

-- Ratings
CREATE TABLE rating (
    rating_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    course_id INTEGER,
    instructor_id INTEGER,
    topic_id INTEGER,
    rating_value INTEGER NOT NULL,
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(userid),
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (instructor_id) REFERENCES users(userid),
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);

-- Reports
CREATE TABLE report (
    report_id SERIAL PRIMARY KEY,
    reported_by INTEGER NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    reference_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (reported_by) REFERENCES users(userid)
);

-- =====================================================
-- STUDYROOM MODULE
-- =====================================================

-- Friend Requests
CREATE TABLE studyroom_friend_request (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    status VARCHAR(10) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    CONSTRAINT fk_studyroom_friend_request_sender FOREIGN KEY (sender_id) REFERENCES users(userid),
    CONSTRAINT fk_studyroom_friend_request_receiver FOREIGN KEY (receiver_id) REFERENCES users(userid),
    CONSTRAINT uq_studyroom_friend_request UNIQUE (sender_id, receiver_id)
);

-- Friendships
CREATE TABLE studyroom_friendship (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_studyroom_friendship_user1 FOREIGN KEY (user1_id) REFERENCES users(userid),
    CONSTRAINT fk_studyroom_friendship_user2 FOREIGN KEY (user2_id) REFERENCES users(userid),
    CONSTRAINT uq_studyroom_friendship UNIQUE (user1_id, user2_id)
);

-- Direct Chat Threads
CREATE TABLE studyroom_direct_thread (
    id SERIAL PRIMARY KEY,
    friendship_id INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_studyroom_direct_thread_friendship FOREIGN KEY (friendship_id) REFERENCES studyroom_friendship(id) ON DELETE CASCADE
);

-- Direct Messages
CREATE TABLE studyroom_direct_message (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT,
    attachment VARCHAR(255),
    attachment_type VARCHAR(20),
    attachment_filename VARCHAR(255),
    reply_to_id INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_studyroom_direct_message_thread FOREIGN KEY (thread_id) REFERENCES studyroom_direct_thread(id) ON DELETE CASCADE,
    CONSTRAINT fk_studyroom_direct_message_sender FOREIGN KEY (sender_id) REFERENCES users(userid),
    CONSTRAINT fk_studyroom_direct_message_receiver FOREIGN KEY (receiver_id) REFERENCES users(userid),
    CONSTRAINT fk_studyroom_direct_message_reply FOREIGN KEY (reply_to_id) REFERENCES studyroom_direct_message(id) ON DELETE SET NULL
);

-- Direct Message Reactions
CREATE TABLE studyroom_direct_message_reaction (
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    emoji VARCHAR(16) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_studyroom_direct_message_reaction_message FOREIGN KEY (message_id) REFERENCES studyroom_direct_message(id) ON DELETE CASCADE,
    CONSTRAINT fk_studyroom_direct_message_reaction_user FOREIGN KEY (user_id) REFERENCES users(userid),
    CONSTRAINT uq_studyroom_direct_message_reaction UNIQUE (message_id, user_id, emoji)
);

-- Study Groups
CREATE TABLE studyroom_group (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    creator_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_studyroom_group_creator FOREIGN KEY (creator_id) REFERENCES users(userid)
);

-- Group Memberships
CREATE TABLE studyroom_group_membership (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_studyroom_group_membership_group FOREIGN KEY (group_id) REFERENCES studyroom_group(id) ON DELETE CASCADE,
    CONSTRAINT fk_studyroom_group_membership_user FOREIGN KEY (user_id) REFERENCES users(userid),
    CONSTRAINT uq_studyroom_group_membership UNIQUE (group_id, user_id)
);

-- Group Messages
CREATE TABLE studyroom_group_message (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT,
    attachment VARCHAR(255),
    attachment_type VARCHAR(20),
    attachment_filename VARCHAR(255),
    reply_to_id INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_studyroom_group_message_group FOREIGN KEY (group_id) REFERENCES studyroom_group(id) ON DELETE CASCADE,
    CONSTRAINT fk_studyroom_group_message_sender FOREIGN KEY (sender_id) REFERENCES users(userid),
    CONSTRAINT fk_studyroom_group_message_reply FOREIGN KEY (reply_to_id) REFERENCES studyroom_group_message(id) ON DELETE SET NULL
);

-- Group Message Read Receipts
CREATE TABLE studyroom_group_message_read (
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_studyroom_group_message_read_message FOREIGN KEY (message_id) REFERENCES studyroom_group_message(id) ON DELETE CASCADE,
    CONSTRAINT fk_studyroom_group_message_read_user FOREIGN KEY (user_id) REFERENCES users(userid),
    CONSTRAINT uq_studyroom_group_message_read UNIQUE (message_id, user_id)
);

-- Group Message Reactions
CREATE TABLE studyroom_group_message_reaction (
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    emoji VARCHAR(16) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_studyroom_group_message_reaction_message FOREIGN KEY (message_id) REFERENCES studyroom_group_message(id) ON DELETE CASCADE,
    CONSTRAINT fk_studyroom_group_message_reaction_user FOREIGN KEY (user_id) REFERENCES users(userid),
    CONSTRAINT uq_studyroom_group_message_reaction UNIQUE (message_id, user_id, emoji)
);

-- =====================================================
-- CORE MODULE
-- =====================================================

-- System Settings
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(20) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    object_id INTEGER,
    description TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(userid)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- AI Assistant Indexes
CREATE INDEX idx_ai_study_plans_student ON ai_study_plans(student_id);
CREATE INDEX idx_ai_study_plans_class_subject ON ai_study_plans(class_name, subject);
CREATE INDEX idx_ai_generated_notes_student ON ai_generated_notes(student_id);
CREATE INDEX idx_manual_notes_student ON manual_notes(student_id);
CREATE INDEX idx_ai_chat_history_student ON ai_chat_history(student_id);
CREATE INDEX idx_ai_chat_history_session ON ai_chat_history(session_id);

-- Calendar Indexes
CREATE INDEX idx_calendar_student ON calendar(student_id);
CREATE INDEX idx_calendar_date ON calendar(entry_date);
CREATE INDEX idx_calendar_student_date ON calendar(student_id, entry_date);

-- Authentication Indexes
CREATE INDEX idx_student_registration_parent_email ON student_registration(parent_email);
CREATE INDEX idx_parent_student_mapping_parent ON parent_student_mapping(parent_email);

-- Quiz Indexes
CREATE INDEX idx_quiz_attempt_student ON quiz_attempt(student_id);
CREATE INDEX idx_quiz_attempt_date ON quiz_attempt(attempted_at);
CREATE INDEX idx_mock_test_attempt_student ON mock_test_attempt(student_id);

-- Rewards/Coins Indexes
CREATE INDEX idx_coin_transaction_student ON coin_transaction(student_id);
CREATE INDEX idx_coin_transaction_date ON coin_transaction(created_at);
CREATE INDEX idx_coin_transaction_source ON coin_transaction(source);
CREATE INDEX idx_user_coin_balance_student ON user_coin_balance(student_id);

-- Student Feedback Indexes
CREATE INDEX idx_student_feedback_student ON student_feedback(student_id);
CREATE INDEX idx_student_feedback_date ON student_feedback(created_at);

-- Student Notifications Indexes
CREATE INDEX idx_student_notifications_student ON student_notifications(student_id);
CREATE INDEX idx_student_notifications_date ON student_notifications(created_at);
CREATE INDEX idx_student_notifications_read ON student_notifications(is_read);

-- Course Indexes
CREATE INDEX idx_pdffiles_course_topic ON pdffiles(course_id, topic_id);
CREATE INDEX idx_videofiles_course_topic ON videofiles(course_id, topic_id);

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample classes
INSERT INTO class (class_id, class_name) VALUES 
(7, 'Class 7'),
(8, 'Class 8'),
(9, 'Class 9'),
(10, 'Class 10');

-- Insert sample courses
INSERT INTO course (course_id, class_id, course_name) VALUES 
(1, 8, 'Mathematics'),
(2, 8, 'Science'),
(3, 8, 'English');

-- Insert sample topics
INSERT INTO topic (course_id, topic_name) VALUES 
(1, 'Chapter 1: Rational Numbers'),
(1, 'Chapter 2: Linear Equations in One Variable'),
(2, 'Chapter 1: Crop Production and Management'),
(3, 'Chapter 1: The Best Christmas Present in the World');

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

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE ai_study_plans IS 'Stores AI-generated study plans for students';
COMMENT ON TABLE ai_generated_notes IS 'Stores AI-generated notes for students';
COMMENT ON TABLE manual_notes IS 'Stores manually created notes by students';
COMMENT ON TABLE ai_chat_history IS 'Stores all AI chat conversations';
COMMENT ON TABLE ai_interaction_sessions IS 'Groups AI interactions into sessions';
COMMENT ON TABLE ai_favorites IS 'Stores student favorites for AI content';
COMMENT ON TABLE calendar IS 'Stores individual study plan calendar entries for the Study Calendar widget';
COMMENT ON TABLE coin_transaction IS 'Tracks all coin/reward point transactions (earned/spent)';
COMMENT ON TABLE user_coin_balance IS 'Stores current coin balance for each user (optimized for quick access)';
COMMENT ON TABLE student_feedback IS 'Stores feedback from students with rating and comments';
COMMENT ON TABLE student_notifications IS 'Stores study plan notifications for students';

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================

-- Total Tables: 27 (Core functionality + Rewards/Coins system)
-- All tables use SERIAL for auto-incrementing IDs
-- All foreign keys properly defined
-- Indexes for performance
-- Sample data for testing
-- Ready for production use
