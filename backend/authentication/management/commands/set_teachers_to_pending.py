"""
Management command to set all teachers except chavi llal back to pending status
"""
from django.core.management.base import BaseCommand
from authentication.models import TeacherRegistration, User


class Command(BaseCommand):
    help = 'Set all approved teachers (except chavi llal) back to pending status'

    def handle(self, *args, **options):
        # Get all approved teachers
        approved_teachers = TeacherRegistration.objects.filter(status='approved')
        
        self.stdout.write(f'Found {approved_teachers.count()} approved teachers\n')
        
        fixed_count = 0
        skipped_count = 0
        
        for teacher in approved_teachers:
            teacher_name = f"{teacher.first_name} {teacher.last_name}".lower()
            username = teacher.teacher_username.lower()
            
            # Check if this is chavi llal (by name or username)
            is_chavi = (
                'chavi' in teacher_name or 
                'chavi' in username or
                teacher.teacher_id == 7  # T007 is chavi
            )
            
            if is_chavi:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Skipped: {teacher.teacher_username} ({teacher.first_name} {teacher.last_name}) - keeping as approved (chavi)'
                    )
                )
                skipped_count += 1
                continue
            
            # Check if user account exists (if it does, teacher was properly approved)
            user_exists = User.objects.filter(username=teacher.teacher_username).exists()
            
            if user_exists:
                self.stdout.write(
                    f'⚠️  Skipped: {teacher.teacher_username} - has user account (properly approved)'
                )
                skipped_count += 1
            else:
                # No user account = was auto-approved, set back to pending
                teacher.status = 'pending'
                teacher.save()
                fixed_count += 1
                self.stdout.write(
                    self.style.WARNING(
                        f'✅ Fixed: {teacher.teacher_username} ({teacher.first_name} {teacher.last_name}) - set to pending'
                    )
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n✅ Summary:\n'
                f'   - Fixed: {fixed_count} teachers (set to pending)\n'
                f'   - Skipped: {skipped_count} teachers (chavi or has user account)'
            )
        )

