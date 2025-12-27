#!/usr/bin/env python
"""Execute this with: python manage.py shell < execute_fix.py"""
import sys
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'novya_main.settings')
django.setup()

from django.db import connection

print("=" * 60)
print("FIXING TEACHER STATUSES")
print("=" * 60)

with connection.cursor() as cursor:
    # Show current approved teachers
    print("\nCurrent approved teachers:")
    cursor.execute("""
        SELECT teacher_id, teacher_username, first_name, last_name, status
        FROM teacher_registration 
        WHERE status = 'approved'
        ORDER BY teacher_id
    """)
    
    approved = cursor.fetchall()
    for row in approved:
        print(f"  T{row[0]:03d}: {row[1]} ({row[2]} {row[3]}) - {row[4]}")
    
    # Update teachers
    print("\nUpdating teachers to pending (except chavi and those with user accounts)...")
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
    print(f"\nUpdated {updated_count} teachers to pending status")
    
    # Verify changes
    print("\nVerification - All teachers:")
    cursor.execute("""
        SELECT teacher_id, teacher_username, first_name, last_name, status
        FROM teacher_registration 
        ORDER BY teacher_id
    """)
    
    all_teachers = cursor.fetchall()
    for row in all_teachers:
        print(f"  T{row[0]:03d}: {row[1]} ({row[2]} {row[3]}) - {row[4]}")

print("\n" + "=" * 60)
print("DONE! Refresh the admin portal to see changes.")
print("=" * 60)

