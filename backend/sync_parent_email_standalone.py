"""
Standalone script to sync parent_email from parent_student_mapping to student_registration.

This script can be run directly without Django management commands.
It reads all parent_student_mapping records and updates student_registration.parent_email.

Usage:
    python sync_parent_email_standalone.py
    python sync_parent_email_standalone.py --dry-run
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import transaction
from authentication.models import ParentStudentMapping, StudentRegistration, StudentProfile


def sync_parent_email(dry_run=False):
    """Sync parent_email from parent_student_mapping and student_profile to student_registration."""
    
    if dry_run:
        print('\n🔍 DRY RUN MODE - No changes will be made\n')
    else:
        print('\n🔄 Starting parent_email sync...\n')
    
    # Get all students
    all_students = StudentRegistration.objects.all()
    total_students = all_students.count()
    
    print(f'📊 Found {total_students} students to process\n')
    
    if total_students == 0:
        print('⚠️  No students found. Nothing to sync.')
        return
    
    # Get all parent-student mappings
    mappings = ParentStudentMapping.objects.all()
    total_mappings = mappings.count()
    print(f'📊 Found {total_mappings} parent-student mappings\n')
    
    updated_registrations = 0
    skipped_registrations = 0
    errors = []
    
    with transaction.atomic():
        for student in all_students:
            student_id = student.student_id
            parent_email_to_sync = None
            source = None
            
            # Priority 1: Check parent_student_mapping
            try:
                mappings = ParentStudentMapping.objects.filter(student_id=student_id)
                if mappings.exists():
                    parent_email_to_sync = mappings.first().parent_email.strip()
                    source = 'parent_student_mapping'
                    print(f'📋 Found parent_email for student_id={student_id} from {source}: {parent_email_to_sync}')
            except Exception as e:
                print(f'⚠️ Error checking parent_student_mapping for student_id={student_id}: {e}')
            
            # Priority 2: Check student_profile if not found in mapping
            if not parent_email_to_sync:
                try:
                    profile = StudentProfile.objects.get(student_id=student_id)
                    if profile.parent_email and profile.parent_email.strip() and profile.parent_email != 'no-parent@example.com':
                        parent_email_to_sync = profile.parent_email.strip()
                        source = 'student_profile'
                        print(f'📋 Found parent_email for student_id={student_id} from {source}: {parent_email_to_sync}')
                except StudentProfile.DoesNotExist:
                    pass
                except Exception as e:
                    print(f'⚠️ Error checking student_profile for student_id={student_id}: {e}')
            
            # Update StudentRegistration if we found a parent_email
            if parent_email_to_sync:
                if not student.parent_email or student.parent_email != parent_email_to_sync:
                    if not dry_run:
                        student.parent_email = parent_email_to_sync
                        student.save()
                    
                    updated_registrations += 1
                    print(f'✅ Updated StudentRegistration (ID: {student_id}) from {source}: parent_email = "{parent_email_to_sync}"')
                else:
                    skipped_registrations += 1
                    print(f'ℹ️  StudentRegistration (ID: {student_id}) already has correct parent_email')
            else:
                skipped_registrations += 1
                print(f'⚠️  No parent_email found for student_id={student_id} in any source')
    
    # Summary
    print('\n' + '='*60)
    print('📊 SYNC SUMMARY')
    print('='*60)
    print(f'Total students processed: {total_students}')
    print(f'Total mappings found: {total_mappings}')
    print(f'StudentRegistration updated: {updated_registrations}')
    print(f'StudentRegistration skipped: {skipped_registrations}')
    
    if errors:
        print(f'\n❌ Errors encountered: {len(errors)}')
        for error in errors:
            print(f'   - {error}')
    else:
        print('\n✅ No errors encountered')
    
    if dry_run:
        print('\n⚠️  DRY RUN MODE - No changes were made. Run without --dry-run to apply changes.')
    else:
        print('\n✅ Sync completed successfully!')


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Sync parent_email from parent_student_mapping to student_registration')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be updated without making changes')
    
    args = parser.parse_args()
    sync_parent_email(dry_run=args.dry_run)

