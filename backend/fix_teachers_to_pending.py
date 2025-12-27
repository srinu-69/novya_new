"""
Script to set all teachers except chavi llal back to pending status
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'novya_main.settings')
django.setup()

from authentication.models import TeacherRegistration

# Get all approved teachers
approved_teachers = TeacherRegistration.objects.filter(status='approved')

print(f"Found {approved_teachers.count()} approved teachers\n")

# Keep chavi llal as approved, set others to pending
chavi_username = 'chavi'  # or whatever the username is
fixed_count = 0

for teacher in approved_teachers:
    print(f"Teacher: {teacher.teacher_username} ({teacher.first_name} {teacher.last_name})")
    print(f"  Current Status: {teacher.status}")
    
    # Skip chavi llal
    if 'chavi' in teacher.teacher_username.lower() or 'chavi' in teacher.first_name.lower():
        print(f"  ✅ Keeping as approved (chavi)")
    else:
        # Check if user account exists
        from authentication.models import User
        user_exists = User.objects.filter(username=teacher.teacher_username).exists()
        
        if user_exists:
            print(f"  ⚠️  Has user account - keeping as approved")
        else:
            teacher.status = 'pending'
            teacher.save()
            fixed_count += 1
            print(f"  ✅ Set to pending")
    print()

print(f"\n✅ Fixed {fixed_count} teachers - set to pending status")

