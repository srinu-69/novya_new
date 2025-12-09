# Generated migration to ensure notifications table exists

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0004_add_teacher_id_to_student_notifications'),
        ('authentication', '0001_initial'),  # Ensure users table exists
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            -- Check if table exists, if not create it
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications') THEN
                    CREATE TABLE notifications (
                        id BIGSERIAL PRIMARY KEY,
                        recipient_id INTEGER NOT NULL,
                        title VARCHAR(200) NOT NULL,
                        message TEXT NOT NULL,
                        notification_type VARCHAR(20) NOT NULL DEFAULT 'info',
                        is_read BOOLEAN DEFAULT FALSE,
                        read_at TIMESTAMP,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (recipient_id) REFERENCES users(userid) ON DELETE CASCADE
                    );
                    
                    CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
                    CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);
                    CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
                    
                    COMMENT ON TABLE notifications IS 'Stores notifications for users (teachers, students, parents)';
                END IF;
            END $$;
            
            CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
            CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);
            CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
            
            COMMENT ON TABLE notifications IS 'Stores notifications for users (teachers, students, parents)';
            COMMENT ON COLUMN notifications.id IS 'Primary key';
            COMMENT ON COLUMN notifications.recipient_id IS 'Foreign key to user(id)';
            COMMENT ON COLUMN notifications.notification_type IS 'Type of notification (info, warning, success, error)';
            COMMENT ON COLUMN notifications.is_read IS 'Whether the notification has been read';
            """,
            reverse_sql="""
            DROP TABLE IF EXISTS notifications CASCADE;
            """
        ),
    ]

