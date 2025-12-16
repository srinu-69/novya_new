#!/usr/bin/env python
"""
Quick script to check users in database
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from authentication.models import User, TeacherRegistration

print("=" * 60)
print("Checking Users Table")
print("=" * 60)

all_users = User.objects.all()
print(f"\nTotal users: {all_users.count()}")

for user in all_users:
    print(f"\nUser: {user.username}")
    print(f"  Role: {user.role}")
    print(f"  Email: {user.email}")
    print(f"  Active: {user.is_active}")

print("\n" + "=" * 60)
print("Checking Teacher Registrations")
print("=" * 60)

teacher_regs = TeacherRegistration.objects.all()
print(f"\nTotal teacher registrations: {teacher_regs.count()}")

for reg in teacher_regs:
    print(f"\nTeacher Reg: {reg.teacher_username}")
    print(f"  Status: {reg.status}")
    print(f"  Email: {reg.email}")

print("=" * 60)

