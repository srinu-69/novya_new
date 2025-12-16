-- Migration: Make parent_email nullable in student_registration table
-- This allows students to register without parent email and add it later in their profile

-- Step 1: Make parent_email nullable
ALTER TABLE student_registration 
ALTER COLUMN parent_email DROP NOT NULL;

-- Step 2: Update existing records with NULL parent_email to empty string (if needed)
-- This is optional - NULL is fine
-- UPDATE student_registration SET parent_email = NULL WHERE parent_email = '';

-- Step 3: Verify the change
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'student_registration' 
AND column_name = 'parent_email';

