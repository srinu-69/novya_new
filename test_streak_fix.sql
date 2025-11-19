-- Quick test to check and fix existing streak records
-- This will update all streaks with null last_activity_date or 0 current_streak to have today's date and streak=1

-- First, check current state
SELECT 
    streak_id, 
    student_id, 
    current_streak, 
    last_activity_date, 
    total_days_active,
    updated_at
FROM user_streak 
ORDER BY streak_id;

-- If needed, uncomment to fix existing records:
-- UPDATE user_streak 
-- SET 
--     current_streak = 1,
--     longest_streak = CASE WHEN longest_streak = 0 THEN 1 ELSE longest_streak END,
--     total_days_active = CASE WHEN total_days_active = 0 THEN 1 ELSE total_days_active END,
--     last_activity_date = CURRENT_DATE,
--     streak_started_at = CASE WHEN streak_started_at IS NULL THEN CURRENT_DATE ELSE streak_started_at END,
--     updated_at = CURRENT_TIMESTAMP
-- WHERE last_activity_date IS NULL OR (current_streak = 0 AND last_activity_date != CURRENT_DATE);

