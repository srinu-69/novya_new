-- Migration script to add status, grade, and school columns to registration tables
-- Run this script on your PostgreSQL database

-- Add status column to parent_registration
ALTER TABLE parent_registration 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved'));

-- Add status, grade, and school columns to student_registration
ALTER TABLE student_registration 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
ADD COLUMN IF NOT EXISTS grade VARCHAR(50),
ADD COLUMN IF NOT EXISTS school VARCHAR(150),
ADD COLUMN IF NOT EXISTS student_password VARCHAR(255);

-- Add status, grade, and school columns to teacher_registration
ALTER TABLE teacher_registration 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
ADD COLUMN IF NOT EXISTS grade VARCHAR(50),
ADD COLUMN IF NOT EXISTS school VARCHAR(150);

-- Update existing records to have 'approved' status (if they already have User accounts)
-- This is optional - only run if you want existing registrations to be approved
-- UPDATE parent_registration SET status = 'approved' WHERE status IS NULL;
-- UPDATE student_registration SET status = 'approved' WHERE status IS NULL;
-- UPDATE teacher_registration SET status = 'approved' WHERE status IS NULL;

-- Verify the changes
SELECT 
    'parent_registration' as table_name,
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'parent_registration' 
AND column_name IN ('status', 'grade', 'school')
UNION ALL
SELECT 
    'student_registration' as table_name,
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'student_registration' 
AND column_name IN ('status', 'grade', 'school', 'student_password')
UNION ALL
SELECT 
    'teacher_registration' as table_name,
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'teacher_registration' 
AND column_name IN ('status', 'grade', 'school');

