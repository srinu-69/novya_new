from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = 'Make teacher_id column nullable in attendance table'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            try:
                # Check if column exists and is NOT NULL
                cursor.execute("""
                    SELECT is_nullable 
                    FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                    AND table_name = 'attendance' 
                    AND column_name = 'teacher_id';
                """)
                result = cursor.fetchone()
                
                if result and result[0] == 'NO':
                    self.stdout.write('Making teacher_id column nullable...')
                    cursor.execute("""
                        ALTER TABLE "attendance" 
                        ALTER COLUMN "teacher_id" DROP NOT NULL;
                    """)
                    self.stdout.write(self.style.SUCCESS('Successfully made teacher_id nullable!'))
                else:
                    self.stdout.write(self.style.SUCCESS('teacher_id column is already nullable.'))
                    
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error: {e}'))
                raise

