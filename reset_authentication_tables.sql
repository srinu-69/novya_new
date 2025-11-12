-- =====================================================
-- RESET ALL AUTHENTICATION TABLES
-- This script truncates all authentication-related tables
-- and resets their sequences for clean re-registration
-- =====================================================

-- Disable foreign key checks temporarily (if needed)
SET session_replication_role = 'replica';

-- Truncate tables in the correct order to handle foreign key constraints
-- Start with child tables (those with foreign keys)

-- 1. Truncate tables that reference other tables first
TRUNCATE TABLE authentication_password_reset_token CASCADE;
TRUNCATE TABLE student_profile CASCADE;
TRUNCATE TABLE parent_student_mapping CASCADE;
TRUNCATE TABLE student_feedback CASCADE;
TRUNCATE TABLE coin_transaction CASCADE;
TRUNCATE TABLE user_coin_balance CASCADE;

-- 2. Truncate main registration tables
TRUNCATE TABLE student_registration CASCADE;
TRUNCATE TABLE parent_registration CASCADE;

-- 3. Truncate legacy User table and related tables
TRUNCATE TABLE parent CASCADE;
TRUNCATE TABLE student CASCADE;
TRUNCATE TABLE users CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- Reset sequences for auto-incrementing IDs
-- PostgreSQL uses SERIAL/BIGSERIAL which creates sequences automatically

-- Reset parent_registration sequence
ALTER SEQUENCE parent_registration_parent_id_seq RESTART WITH 1;

-- Reset student_registration sequence
ALTER SEQUENCE student_registration_student_id_seq RESTART WITH 1;

-- Reset parent_student_mapping sequence
ALTER SEQUENCE parent_student_mapping_mapping_id_seq RESTART WITH 1;

-- Reset users sequence
ALTER SEQUENCE users_userid_seq RESTART WITH 1;

-- Reset student_profile sequence
ALTER SEQUENCE student_profile_profile_id_seq RESTART WITH 1;

-- Reset authentication_password_reset_token sequence
ALTER SEQUENCE authentication_password_reset_token_id_seq RESTART WITH 1;

-- Reset student_feedback sequence
ALTER SEQUENCE student_feedback_feedback_id_seq RESTART WITH 1;

-- Reset coin_transaction sequence
ALTER SEQUENCE coin_transaction_transaction_id_seq RESTART WITH 1;

-- Reset user_coin_balance sequence
ALTER SEQUENCE user_coin_balance_balance_id_seq RESTART WITH 1;

-- Verify tables are empty
SELECT 'parent_registration' as table_name, COUNT(*) as row_count FROM parent_registration
UNION ALL
SELECT 'student_registration', COUNT(*) FROM student_registration
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'student_profile', COUNT(*) FROM student_profile
UNION ALL
SELECT 'parent_student_mapping', COUNT(*) FROM parent_student_mapping;

-- Success message
SELECT 'All authentication tables have been reset successfully!' as status;

