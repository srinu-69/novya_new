# Generated manually to add teacher_id column to student_notifications table

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0003_create_parent_notifications_table'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            -- Add teacher_id column to student_notifications table
            ALTER TABLE student_notifications 
            ADD COLUMN IF NOT EXISTS teacher_id INTEGER;
            
            COMMENT ON COLUMN student_notifications.teacher_id IS 'Foreign key to teacher_registration(teacher_id) - who sent the message';
            
            -- Update notification_type to include 'teacher_message'
            -- Note: The constraint is already handled at the model level
            """,
            reverse_sql="""
            -- Remove teacher_id column
            ALTER TABLE student_notifications 
            DROP COLUMN IF EXISTS teacher_id;
            """
        ),
    ]

