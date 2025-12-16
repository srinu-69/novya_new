#!/usr/bin/env python
"""
Script to create missing registration entries for existing users
Run this to migrate existing users to the new registration system
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from authentication.models import User, TeacherRegistration, StudentRegistration, ParentRegistration
from django.contrib.auth.hashers import make_password

def create_missing_registrations():
    print("=" * 60)
    print("Creating Missing Registration Entries for Existing Users")
    print("=" * 60)
    
    # Process Teachers
    teachers = User.objects.filter(role='Teacher')
    print(f"\n📋 Found {teachers.count()} teachers in users table")
    
    created_count = 0
    for teacher in teachers:
        try:
            # Check if registration already exists
            TeacherRegistration.objects.get(teacher_username=teacher.username)
            print(f"   ✅ {teacher.username} already has registration entry")
        except TeacherRegistration.DoesNotExist:
            try:
                # Create registration entry
                teacher_reg = TeacherRegistration.objects.create(
                    email=teacher.email,
                    first_name=teacher.firstname or 'Teacher',
                    last_name=teacher.lastname or '',
                    phone_number=teacher.phonenumber or '',
                    teacher_username=teacher.username,
                    teacher_password=teacher.password,  # Already hashed
                    status='approved',  # Auto-approve existing teachers
                    grade='',  # Can be updated later
                    school=''  # Can be updated later
                )
                print(f"   ✅ Created registration for teacher: {teacher.username}")
                created_count += 1
            except Exception as e:
                print(f"   ❌ Failed to create registration for {teacher.username}: {e}")
    
    print(f"\n✅ Created {created_count} teacher registration entries")
    
    # Process Students
    students = User.objects.filter(role='Student')
    print(f"\n📋 Found {students.count()} students in users table")
    
    created_students = 0
    for student in students:
        try:
            StudentRegistration.objects.get(student_username=student.username)
            print(f"   ✅ {student.username} already has registration entry")
        except StudentRegistration.DoesNotExist:
            try:
                # Create registration entry
                student_reg = StudentRegistration.objects.create(
                    first_name=student.firstname or 'Student',
                    last_name=student.lastname or '',
                    phone_number=student.phonenumber or None,
                    student_username=student.username,
                    student_email=student.email or None,
                    parent_email='',  # Can be updated later
                    student_password=student.password,  # Already hashed
                    status='approved',  # Auto-approve existing students
                    grade='',  # Can be updated later
                    school=''  # Can be updated later
                )
                print(f"   ✅ Created registration for student: {student.username}")
                created_students += 1
            except Exception as e:
                print(f"   ❌ Failed to create registration for {student.username}: {e}")
    
    print(f"\n✅ Created {created_students} student registration entries")
    
    # Process Parents
    parents = User.objects.filter(role='Parent')
    print(f"\n📋 Found {parents.count()} parents in users table")
    
    created_parents = 0
    for parent in parents:
        try:
            ParentRegistration.objects.get(parent_username=parent.username)
            print(f"   ✅ {parent.username} already has registration entry")
        except ParentRegistration.DoesNotExist:
            try:
                # Create registration entry
                parent_reg = ParentRegistration.objects.create(
                    email=parent.email,
                    first_name=parent.firstname or 'Parent',
                    last_name=parent.lastname or '',
                    phone_number=parent.phonenumber or '',
                    parent_username=parent.username,
                    parent_password=parent.password,  # Already hashed
                    status='approved'  # Auto-approve existing parents
                )
                print(f"   ✅ Created registration for parent: {parent.username}")
                created_parents += 1
            except Exception as e:
                print(f"   ❌ Failed to create registration for {parent.username}: {e}")
    
    print(f"\n✅ Created {created_parents} parent registration entries")
    
    print("\n" + "=" * 60)
    print(f"🎉 Migration complete!")
    print(f"   - Teachers: {created_count} created")
    print(f"   - Students: {created_students} created")
    print(f"   - Parents: {created_parents} created")
    print("=" * 60)

if __name__ == '__main__':
    create_missing_registrations()

