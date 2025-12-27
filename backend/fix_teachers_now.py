"""
Quick script to fix teachers - set all except chavi to pending
Run this directly: python fix_teachers_now.py
"""
import os
import sys
import django

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'novya_main.settings')
django.setup()

from django.db import connection
from authentication.models import TeacherRegistration, User

print("=" * 60)
print("FIXING TEACHER STATUSES")
print("=" * 60)

# Get all approved teachers
with connection.cursor() as cursor:
    cursor.execute("""
        SELECT teacher_id, teacher_username, first_name, last_name, status
        FROM teacher_registration
        WHERE status = 'approved'
        ORDER BY teacher_id
    """)
    
    teachers = cursor.fetchall()
    print(f"\nFound {len(teachers)} approved teachers:\n")
    
    for row in teachers:
        teacher_id, username, first_name, last_name, status = row
        print(f"  T{teacher_id:03d}: {username} ({first_name} {last_name}) - {status}")

# Fix teachers (except chavi and those with user accounts)
with connection.cursor() as cursor:
    cursor.execute("""
        UPDATE teacher_registration
        SET status = 'pending'
        WHERE status = 'approved'
        AND teacher_id != 7
        AND teacher_username NOT IN (
            SELECT username FROM users WHERE role = 'Teacher'
        )
    """)
    
    updated_count = cursor.rowcount
    print(f"\n✅ Updated {updated_count} teachers to pending status")

# Verify changes
print("\n" + "=" * 60)
print("VERIFICATION - Current Status:")
print("=" * 60)

with connection.cursor() as cursor:
    cursor.execute("""
        SELECT teacher_id, teacher_username, first_name, last_name, status
        FROM teacher_registration
        ORDER BY teacher_id
    """)
    
    teachers = cursor.fetchall()
    for row in teachers:
        teacher_id, username, first_name, last_name, status = row
        status_icon = "✅" if status == 'pending' else "⚠️" if status == 'approved' else "❌"
        print(f"  {status_icon} T{teacher_id:03d}: {username} ({first_name} {last_name}) - {status}")

print("\n" + "=" * 60)
print("DONE! Refresh the admin portal to see changes.")
print("=" * 60)

