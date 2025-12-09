-- Migration script to add grade column to teacher_profile table
-- Run this in pgAdmin or your PostgreSQL client

-- Step 1: Add the grade column as nullable first (to allow existing rows)
ALTER TABLE teacher_profile 
ADD COLUMN grade VARCHAR(50);

-- Step 2: Set a default value for existing rows (you can change this default as needed)
-- Option A: Set to empty string for existing records
UPDATE teacher_profile 
SET grade = '' 
WHERE grade IS NULL;

-- Option B: Or set to a specific default like 'Not Set' or 'Class 8'
-- UPDATE teacher_profile 
-- SET grade = 'Not Set' 
-- WHERE grade IS NULL;

-- Step 3: Make the column NOT NULL now that all rows have values
ALTER TABLE teacher_profile 
ALTER COLUMN grade SET NOT NULL;

-- Step 4: Verify the column was added successfully
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'teacher_profile' AND column_name = 'grade';

-- Done! The grade column is now added to the teacher_profile table.

