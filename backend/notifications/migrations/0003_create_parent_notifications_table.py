# Generated manually for ParentNotification table

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0002_create_student_notifications_table'),
        ('authentication', '0001_initial'),  # Ensure student_registration table exists
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            CREATE TABLE IF NOT EXISTS parent_notifications (
                notification_id SERIAL PRIMARY KEY,
                parent_email VARCHAR(255) NOT NULL,
                student_id INTEGER NOT NULL,
                teacher_id INTEGER,
                notification_type VARCHAR(50) NOT NULL DEFAULT 'teacher_message',
                title VARCHAR(200) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                read_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES student_registration(student_id) ON DELETE CASCADE
            );
            
            CREATE INDEX IF NOT EXISTS idx_parent_notifications_parent_student ON parent_notifications(parent_email, student_id);
            CREATE INDEX IF NOT EXISTS idx_parent_notifications_parent_read ON parent_notifications(parent_email, is_read);
            CREATE INDEX IF NOT EXISTS idx_parent_notifications_date ON parent_notifications(created_at);
            
            COMMENT ON TABLE parent_notifications IS 'Stores notifications sent by teachers to parents about specific students';
            COMMENT ON COLUMN parent_notifications.notification_id IS 'Primary key';
            COMMENT ON COLUMN parent_notifications.parent_email IS 'Parent email address';
            COMMENT ON COLUMN parent_notifications.student_id IS 'Foreign key to student_registration(student_id) - which child the message is about';
            COMMENT ON COLUMN parent_notifications.teacher_id IS 'References teacher_registration(teacher_id) - who sent the notification';
            COMMENT ON COLUMN parent_notifications.notification_type IS 'Type of notification (teacher_message, etc.)';
            COMMENT ON COLUMN parent_notifications.title IS 'Notification title';
            COMMENT ON COLUMN parent_notifications.message IS 'Notification message';
            COMMENT ON COLUMN parent_notifications.is_read IS 'Whether the notification has been read';
            """,
            reverse_sql="""
            DROP TABLE IF EXISTS parent_notifications CASCADE;
            """
        ),
    ]

