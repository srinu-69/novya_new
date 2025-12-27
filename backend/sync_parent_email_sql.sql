-- SQL script to sync parent_email from parent_student_mapping to student_registration
-- Run this directly in your PostgreSQL database

-- Update student_registration with parent_email from parent_student_mapping
UPDATE student_registration sr
SET parent_email = psm.parent_email
FROM parent_student_mapping psm
WHERE sr.student_id = psm.student_id
  AND (sr.parent_email IS NULL OR sr.parent_email != psm.parent_email);

-- Show the results
SELECT 
    sr.student_id,
    sr.student_username,
    sr.student_email,
    sr.parent_email,
    psm.parent_email as mapping_parent_email,
    CASE 
        WHEN sr.parent_email = psm.parent_email THEN '✅ Synced'
        WHEN sr.parent_email IS NULL THEN '❌ Not synced'
        ELSE '⚠️ Different'
    END as status
FROM student_registration sr
LEFT JOIN parent_student_mapping psm ON sr.student_id = psm.student_id
ORDER BY sr.student_id;

