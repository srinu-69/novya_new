#!/usr/bin/env python
import sys
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'novya_main.settings')
django.setup()

from django.db import connection

print("=" * 60)
print("FIXING ALL TEACHERS (EXCEPT CHAVI) TO PENDING")
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
    
    # Update ALL teachers to pending EXCEPT chavi (T007)
    # This will also remove their user accounts if they exist
    print("\nUpdating ALL teachers to pending (except chavi T007)...")
    cursor.execute("""
        UPDATE teacher_registration
        SET status = 'pending'
        WHERE status = 'approved'
        AND teacher_id != 7
    """)
    
    updated_count = cursor.rowcount
    print(f"\nUpdated {updated_count} teachers to pending status")
    
    # Also delete user accounts for these teachers (except chavi)
    print("\nRemoving user accounts for updated teachers...")
    cursor.execute("""
        DELETE FROM users
        WHERE role = 'Teacher'
        AND username IN (
            SELECT teacher_username 
            FROM teacher_registration 
            WHERE status = 'pending'
            AND teacher_id != 7
        )
    """)
    
    deleted_users = cursor.rowcount
    print(f"Removed {deleted_users} user accounts")
    
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

