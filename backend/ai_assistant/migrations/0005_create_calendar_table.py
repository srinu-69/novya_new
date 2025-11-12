# Generated manually for Calendar table

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ai_assistant', '0004_fix_chat_history_fk_constraint'),
        ('authentication', '0001_initial'),  # Ensure student_registration table exists
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            CREATE TABLE IF NOT EXISTS calendar (
                calendar_id SERIAL PRIMARY KEY,
                student_id INTEGER NOT NULL,
                entry_date DATE NOT NULL,
                subject VARCHAR(100) NOT NULL,
                topic VARCHAR(200) NOT NULL,
                duration VARCHAR(50) DEFAULT '60 minutes',
                plan_id INTEGER,
                completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES student_registration(student_id) ON DELETE CASCADE,
                CONSTRAINT calendar_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES ai_study_plans(plan_id) ON DELETE SET NULL
            );
            
            CREATE INDEX IF NOT EXISTS idx_calendar_student ON calendar(student_id);
            CREATE INDEX IF NOT EXISTS idx_calendar_date ON calendar(entry_date);
            CREATE INDEX IF NOT EXISTS idx_calendar_student_date ON calendar(student_id, entry_date);
            
            COMMENT ON TABLE calendar IS 'Stores individual study plan calendar entries for students';
            COMMENT ON COLUMN calendar.calendar_id IS 'Primary key';
            COMMENT ON COLUMN calendar.student_id IS 'Foreign key to student_registration(student_id)';
            COMMENT ON COLUMN calendar.entry_date IS 'Date for this calendar entry';
            COMMENT ON COLUMN calendar.subject IS 'Subject name (e.g., English, Math)';
            COMMENT ON COLUMN calendar.topic IS 'Study session topic/title';
            COMMENT ON COLUMN calendar.duration IS 'Duration of the study session';
            COMMENT ON COLUMN calendar.plan_id IS 'Optional reference to ai_study_plans if this came from a study plan';
            COMMENT ON COLUMN calendar.completed IS 'Whether the study session is completed';
            """,
            reverse_sql="""
            DROP TABLE IF EXISTS calendar CASCADE;
            """
        ),
    ]

