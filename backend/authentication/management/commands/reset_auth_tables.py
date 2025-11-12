"""
Django management command to reset all authentication tables.

This command truncates all authentication-related tables and resets their sequences.
Use this when you want to clear all user/student/parent registration data for testing.

Usage:
    python manage.py reset_auth_tables
    python manage.py reset_auth_tables --confirm (to skip confirmation)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from django.apps import apps
from django.core.management import call_command


class Command(BaseCommand):
    help = 'Reset all authentication tables (truncate and reset sequences)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Skip confirmation prompt',
        )

    def handle(self, *args, **options):
        if not options['confirm']:
            self.stdout.write(self.style.WARNING(
                '\n⚠️  WARNING: This will DELETE ALL data from the following tables:\n'
                '   - users\n'
                '   - parent_registration\n'
                '   - student_registration\n'
                '   - student_profile\n'
                '   - parent_student_mapping\n'
                '   - parent\n'
                '   - student\n'
                '   - authentication_password_reset_token\n'
                '   - student_feedback\n'
                '   - coin_transaction\n'
                '   - user_coin_balance\n'
                '\nThis action CANNOT be undone!\n'
            ))
            
            confirm = input('Type "YES" to continue: ')
            if confirm != 'YES':
                self.stdout.write(self.style.ERROR('Operation cancelled.'))
                return

        try:
            with transaction.atomic():
                # Get models
                User = apps.get_model('authentication', 'User')
                ParentRegistration = apps.get_model('authentication', 'ParentRegistration')
                StudentRegistration = apps.get_model('authentication', 'StudentRegistration')
                StudentProfile = apps.get_model('authentication', 'StudentProfile')
                ParentStudentMapping = apps.get_model('authentication', 'ParentStudentMapping')
                Parent = apps.get_model('authentication', 'Parent')
                Student = apps.get_model('authentication', 'Student')
                PasswordResetToken = apps.get_model('authentication', 'PasswordResetToken')
                StudentFeedback = apps.get_model('authentication', 'StudentFeedback')
                CoinTransaction = apps.get_model('authentication', 'CoinTransaction')
                UserCoinBalance = apps.get_model('authentication', 'UserCoinBalance')

                # Delete in correct order to handle foreign key constraints
                self.stdout.write('Deleting child tables...')
                StudentFeedback.objects.all().delete()
                CoinTransaction.objects.all().delete()
                UserCoinBalance.objects.all().delete()
                PasswordResetToken.objects.all().delete()
                StudentProfile.objects.all().delete()
                ParentStudentMapping.objects.all().delete()
                
                self.stdout.write('Deleting main registration tables...')
                Student.objects.all().delete()
                Parent.objects.all().delete()
                StudentRegistration.objects.all().delete()
                ParentRegistration.objects.all().delete()
                
                self.stdout.write('Deleting User table...')
                User.objects.all().delete()

                # Reset sequences using raw SQL
                from django.db import connection
                with connection.cursor() as cursor:
                    sequences_to_reset = [
                        ('parent_registration_parent_id_seq', 'parent_registration'),
                        ('student_registration_student_id_seq', 'student_registration'),
                        ('parent_student_mapping_mapping_id_seq', 'parent_student_mapping'),
                        ('users_userid_seq', 'users'),
                        ('student_profile_profile_id_seq', 'student_profile'),
                        ('authentication_password_reset_token_id_seq', 'authentication_password_reset_token'),
                        ('student_feedback_feedback_id_seq', 'student_feedback'),
                        ('coin_transaction_transaction_id_seq', 'coin_transaction'),
                        ('user_coin_balance_balance_id_seq', 'user_coin_balance'),
                    ]
                    
                    self.stdout.write('Resetting sequences...')
                    for seq_name, table_name in sequences_to_reset:
                        try:
                            cursor.execute(f"SELECT setval('{seq_name}', 1, false);")
                            self.stdout.write(f'  ✓ Reset {seq_name}')
                        except Exception as e:
                            # Sequence might not exist, skip it
                            self.stdout.write(self.style.WARNING(f'  ⚠ Could not reset {seq_name}: {e}'))

                # Verify tables are empty
                counts = {
                    'users': User.objects.count(),
                    'parent_registration': ParentRegistration.objects.count(),
                    'student_registration': StudentRegistration.objects.count(),
                    'student_profile': StudentProfile.objects.count(),
                    'parent_student_mapping': ParentStudentMapping.objects.count(),
                }
                
                all_empty = all(count == 0 for count in counts.values())
                
                if all_empty:
                    self.stdout.write(self.style.SUCCESS('\n✅ All authentication tables have been reset successfully!'))
                    self.stdout.write('\nRow counts after reset:')
                    for table, count in counts.items():
                        self.stdout.write(f'  {table}: {count}')
                else:
                    self.stdout.write(self.style.WARNING('\n⚠️  Some tables still have data:'))
                    for table, count in counts.items():
                        if count > 0:
                            self.stdout.write(self.style.WARNING(f'  {table}: {count} rows'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\n❌ Error resetting tables: {str(e)}'))
            import traceback
            traceback.print_exc()

