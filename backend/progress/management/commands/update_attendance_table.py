from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = 'Update attendance table to include teacher_id and other new fields'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            try:
                # Check if teacher_id column exists
                cursor.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                    AND table_name = 'attendance' 
                    AND column_name = 'teacher_id';
                """)
                teacher_id_exists = cursor.fetchone() is not None
                
                if not teacher_id_exists:
                    self.stdout.write('Adding teacher_id column to attendance table...')
                    cursor.execute("""
                        ALTER TABLE "attendance" 
                        ADD COLUMN "teacher_id" integer;
                    """)
                    
                    # Add foreign key constraint for teacher_id
                    try:
                        cursor.execute("""
                            SELECT EXISTS (
                                SELECT FROM information_schema.tables 
                                WHERE table_schema = 'public' 
                                AND table_name = 'teacher_registration'
                            );
                        """)
                        teacher_table_exists = cursor.fetchone()[0]
                        
                        if teacher_table_exists:
                            cursor.execute("""
                                ALTER TABLE "attendance" 
                                ADD CONSTRAINT "attendance_teacher_id_fk_teacher_registration_teacher_id" 
                                FOREIGN KEY ("teacher_id") REFERENCES "teacher_registration" ("teacher_id") 
                                ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;
                            """)
                            
                            cursor.execute("""
                                CREATE INDEX IF NOT EXISTS "attendance_teacher_id" 
                                ON "attendance" ("teacher_id");
                            """)
                            self.stdout.write(self.style.SUCCESS('Added teacher_id column and foreign key!'))
                        else:
                            self.stdout.write(self.style.WARNING('teacher_registration table does not exist. Skipping foreign key.'))
                    except Exception as e:
                        self.stdout.write(self.style.WARNING(f'Could not add teacher foreign key: {e}'))
                else:
                    self.stdout.write(self.style.SUCCESS('teacher_id column already exists.'))
                
                # Check and add other new columns
                new_columns = {
                    'check_in_time': 'time',
                    'check_out_time': 'time',
                    'hours_attended': 'decimal(4,2)',
                    'updated_at': 'timestamp with time zone DEFAULT CURRENT_TIMESTAMP'
                }
                
                for column_name, column_type in new_columns.items():
                    cursor.execute(f"""
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_schema = 'public' 
                        AND table_name = 'attendance' 
                        AND column_name = '{column_name}';
                    """)
                    column_exists = cursor.fetchone() is not None
                    
                    if not column_exists:
                        self.stdout.write(f'Adding {column_name} column...')
                        cursor.execute(f"""
                            ALTER TABLE "attendance" 
                            ADD COLUMN "{column_name}" {column_type};
                        """)
                        self.stdout.write(self.style.SUCCESS(f'Added {column_name} column!'))
                    else:
                        self.stdout.write(self.style.SUCCESS(f'{column_name} column already exists.'))
                
                # Update existing records to set teacher_id if null (optional - can be done manually)
                self.stdout.write(self.style.SUCCESS('Attendance table updated successfully!'))
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error updating table: {e}'))
                raise

