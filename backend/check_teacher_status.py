"""
Quick script to check and fix teacher registration status
Run this to verify teachers are being created with 'pending' status
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'novya_main.settings')
django.setup()

from authentication.models import TeacherRegistration
from django.utils import timezone
from datetime import timedelta

# Check recent teacher registrations
cutoff = timezone.now() - timedelta(days=1)
recent_teachers = TeacherRegistration.objects.filter(created_at__gte=cutoff).order_by('-created_at')

print(f"Found {recent_teachers.count()} teachers registered in the last 24 hours:\n")

for teacher in recent_teachers:
    print(f"ID: {teacher.teacher_id}")
    print(f"  Username: {teacher.teacher_username}")
    print(f"  Name: {teacher.first_name} {teacher.last_name}")
    print(f"  Status: {teacher.status}")
    print(f"  Created: {teacher.created_at}")
    
    if teacher.status != 'pending':
        print(f"  ⚠️  WARNING: Status is '{teacher.status}' but should be 'pending'!")
        # Fix it
        teacher.status = 'pending'
        teacher.save()
        print(f"  ✅ Fixed: Set status to 'pending'")
    else:
        print(f"  ✅ Status is correct")
    print()

