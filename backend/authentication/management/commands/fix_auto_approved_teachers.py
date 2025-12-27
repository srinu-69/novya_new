"""
Management command to fix teachers that were auto-approved
Sets all pending/approved teachers (except those explicitly approved by admin) back to pending
"""
from django.core.management.base import BaseCommand
from authentication.models import TeacherRegistration
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = 'Fix teachers that were auto-approved - set them to pending if they were registered recently'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=7,
            help='Only fix teachers registered in the last N days (default: 7)',
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Fix all approved teachers (use with caution)',
        )

    def handle(self, *args, **options):
        days = options['days']
        fix_all = options['all']
        
        if fix_all:
            teachers = TeacherRegistration.objects.filter(status='approved')
            self.stdout.write(f'Found {teachers.count()} approved teachers')
        else:
            cutoff_date = timezone.now() - timedelta(days=days)
            teachers = TeacherRegistration.objects.filter(
                status='approved',
                created_at__gte=cutoff_date
            )
            self.stdout.write(f'Found {teachers.count()} approved teachers registered in the last {days} days')
        
        if not teachers.exists():
            self.stdout.write(self.style.SUCCESS('No teachers to fix'))
            return
        
        count = 0
        for teacher in teachers:
            # Check if user account exists (if it does, teacher was properly approved)
            from authentication.models import User
            user_exists = User.objects.filter(username=teacher.teacher_username).exists()
            
            if not user_exists:
                # No user account = was auto-approved, set back to pending
                teacher.status = 'pending'
                teacher.save()
                count += 1
                self.stdout.write(
                    self.style.WARNING(
                        f'Fixed: {teacher.teacher_username} ({teacher.first_name} {teacher.last_name}) - set to pending'
                    )
                )
            else:
                self.stdout.write(
                    f'Skipped: {teacher.teacher_username} - has user account (properly approved)'
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'\n✅ Fixed {count} teachers - set to pending status')
        )

