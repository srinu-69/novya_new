"""
Django management command to sync parent_email from parent_student_mapping to student_registration.

This command:
1. Reads all parent_student_mapping records
2. Updates student_registration.parent_email for each mapping
3. Updates student_profile.parent_email if profile exists

Usage:
    python manage.py sync_parent_email
    python manage.py sync_parent_email --dry-run (to see what would be updated without making changes)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from authentication.models import ParentStudentMapping, StudentRegistration, StudentProfile


class Command(BaseCommand):
    help = 'Sync parent_email from parent_student_mapping to student_registration and student_profile'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be updated without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        if dry_run:
            self.stdout.write(self.style.WARNING('\n🔍 DRY RUN MODE - No changes will be made\n'))
        else:
            self.stdout.write(self.style.WARNING('\n🔄 Starting parent_email sync...\n'))
        
        # Get all students
        all_students = StudentRegistration.objects.all()
        total_students = all_students.count()
        
        self.stdout.write(f'📊 Found {total_students} students to process\n')
        
        if total_students == 0:
            self.stdout.write(self.style.WARNING('⚠️  No students found. Nothing to sync.'))
            return
        
        # Get all parent-student mappings
        mappings = ParentStudentMapping.objects.all()
        total_mappings = mappings.count()
        self.stdout.write(f'📊 Found {total_mappings} parent-student mappings\n')
        
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
                    parent_mappings = ParentStudentMapping.objects.filter(student_id=student_id)
                    if parent_mappings.exists():
                        parent_email_to_sync = parent_mappings.first().parent_email.strip()
                        source = 'parent_student_mapping'
                        self.stdout.write(
                            f'📋 Found parent_email for student_id={student_id} from {source}: {parent_email_to_sync}'
                        )
                except Exception as e:
                    self.stdout.write(self.style.WARNING(
                        f'⚠️ Error checking parent_student_mapping for student_id={student_id}: {e}'
                    ))
                
                # Priority 2: Check student_profile if not found in mapping
                if not parent_email_to_sync:
                    try:
                        profile = StudentProfile.objects.get(student_id=student_id)
                        if profile.parent_email and profile.parent_email.strip() and profile.parent_email != 'no-parent@example.com':
                            parent_email_to_sync = profile.parent_email.strip()
                            source = 'student_profile'
                            self.stdout.write(
                                f'📋 Found parent_email for student_id={student_id} from {source}: {parent_email_to_sync}'
                            )
                    except StudentProfile.DoesNotExist:
                        pass
                    except Exception as e:
                        self.stdout.write(self.style.WARNING(
                            f'⚠️ Error checking student_profile for student_id={student_id}: {e}'
                        ))
                
                # Update StudentRegistration if we found a parent_email
                if parent_email_to_sync:
                    if not student.parent_email or student.parent_email != parent_email_to_sync:
                        if not dry_run:
                            student.parent_email = parent_email_to_sync
                            student.save()
                        
                        updated_registrations += 1
                        self.stdout.write(self.style.SUCCESS(
                            f'✅ Updated StudentRegistration (ID: {student_id}) from {source}: parent_email = "{parent_email_to_sync}"'
                        ))
                    else:
                        skipped_registrations += 1
                        self.stdout.write(
                            f'ℹ️  StudentRegistration (ID: {student_id}) already has correct parent_email'
                        )
                else:
                    skipped_registrations += 1
                    self.stdout.write(
                        f'⚠️  No parent_email found for student_id={student_id} in any source'
                    )
        
        # Summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('📊 SYNC SUMMARY'))
        self.stdout.write(self.style.SUCCESS('='*60))
        self.stdout.write(f'Total students processed: {total_students}')
        self.stdout.write(f'Total mappings found: {total_mappings}')
        self.stdout.write(f'StudentRegistration updated: {updated_registrations}')
        self.stdout.write(f'StudentRegistration skipped: {skipped_registrations}')
        
        if errors:
            self.stdout.write(self.style.ERROR(f'\n❌ Errors encountered: {len(errors)}'))
            for error in errors:
                self.stdout.write(self.style.ERROR(f'   - {error}'))
        else:
            self.stdout.write(self.style.SUCCESS('\n✅ No errors encountered'))
        
        if dry_run:
            self.stdout.write(self.style.WARNING(
                '\n⚠️  DRY RUN MODE - No changes were made. Run without --dry-run to apply changes.'
            ))
        else:
            self.stdout.write(self.style.SUCCESS('\n✅ Sync completed successfully!'))

