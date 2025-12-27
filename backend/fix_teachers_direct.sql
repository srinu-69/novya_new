-- Direct SQL to set all teachers except chavi llal back to pending
-- Run this in your PostgreSQL database

-- First, let's see what we have
SELECT teacher_id, teacher_username, first_name, last_name, status 
FROM teacher_registration 
WHERE status = 'approved'
ORDER BY teacher_id;

-- Update all approved teachers to pending, except chavi (T007) and those with user accounts
UPDATE teacher_registration
SET status = 'pending'
WHERE status = 'approved'
AND teacher_id != 7  -- Keep chavi (T007) as approved
AND teacher_username NOT IN (
    SELECT username FROM users WHERE role = 'Teacher'
);

-- Verify the changes
SELECT teacher_id, teacher_username, first_name, last_name, status 
FROM teacher_registration 
ORDER BY teacher_id;

