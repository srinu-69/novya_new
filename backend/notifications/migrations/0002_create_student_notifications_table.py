# Generated manually for StudentNotification table

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0001_initial'),
        ('authentication', '0001_initial'),  # Ensure student_registration table exists
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            CREATE TABLE IF NOT EXISTS student_notifications (
                notification_id SERIAL PRIMARY KEY,
                student_id INTEGER NOT NULL,
                notification_type VARCHAR(50) NOT NULL DEFAULT 'study_plan_created',
                title VARCHAR(200) NOT NULL,
                message TEXT NOT NULL,
                plan_id VARCHAR(200),
                is_read BOOLEAN DEFAULT FALSE,
                read_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES student_registration(student_id) ON DELETE CASCADE
            );
            
            CREATE INDEX IF NOT EXISTS idx_student_notifications_student ON student_notifications(student_id);
            CREATE INDEX IF NOT EXISTS idx_student_notifications_date ON student_notifications(created_at);
            CREATE INDEX IF NOT EXISTS idx_student_notifications_read ON student_notifications(is_read);
            
            COMMENT ON TABLE student_notifications IS 'Stores study plan notifications for students';
            COMMENT ON COLUMN student_notifications.notification_id IS 'Primary key';
            COMMENT ON COLUMN student_notifications.student_id IS 'Foreign key to student_registration(student_id)';
            COMMENT ON COLUMN student_notifications.notification_type IS 'Type of notification (study_plan_created, etc.)';
            COMMENT ON COLUMN student_notifications.title IS 'Notification title';
            COMMENT ON COLUMN student_notifications.message IS 'Notification message';
            COMMENT ON COLUMN student_notifications.plan_id IS 'Reference to study plan ID';
            COMMENT ON COLUMN student_notifications.is_read IS 'Whether the notification has been read';
            """,
            reverse_sql="""
            DROP TABLE IF EXISTS student_notifications CASCADE;
            """
        ),
    ]

