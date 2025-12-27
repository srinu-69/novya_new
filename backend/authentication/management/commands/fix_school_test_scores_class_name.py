"""
Django management command to fix class_name in school_test_scores table.

This command:
1. Reads all student profiles to get their grade
2. Converts grade to class_name format (e.g., '10th' -> 'Class 10')
3. Updates school_test_scores records to use the correct class_name based on student profile

Usage:
    python manage.py fix_school_test_scores_class_name
    python manage.py fix_school_test_scores_class_name --dry-run (to see what would be updated without making changes)
"""

from django.core.management.base import BaseCommand
from django.db import connection
from authentication.models import StudentProfile


def get_class_name_from_grade(grade):
    """
    Get class_name directly from student profile grade (no conversion)
    Uses the exact grade value from student profile
    """
    if not grade:
        return 'Class 7'  # Default fallback
    
    # Use the grade value directly as stored in student profile
    return str(grade).strip()


class Command(BaseCommand):
    help = 'Fix class_name in school_test_scores table based on student profile grade'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be updated without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No changes will be made'))
        
        try:
            with connection.cursor() as cursor:
                # Get all student profiles with their grades
                profiles = StudentProfile.objects.all()
                
                updated_count = 0
                skipped_count = 0
                
                for profile in profiles:
                    if not profile.grade:
                        continue
                    
                    # Get class_name directly from student profile grade (no conversion)
                    correct_class_name = get_class_name_from_grade(profile.grade)
                    
                    # Check current records in school_test_scores for this student
                    cursor.execute("""
                        SELECT score_id, class_name, subject, academic_year
                        FROM school_test_scores
                        WHERE student_id = %s
                    """, [profile.student_id])
                    
                    records = cursor.fetchall()
                    
                    for record in records:
                        score_id, current_class_name, subject, academic_year = record
                        
                        # If class_name doesn't match, update it
                        if current_class_name != correct_class_name:
                            if dry_run:
                                self.stdout.write(
                                    f"Would update: Student ID {profile.student_id} "
                                    f"(grade: {profile.grade}) - Score ID {score_id} "
                                    f"Subject: {subject} - "
                                    f"'{current_class_name}' -> '{correct_class_name}'"
                                )
                            else:
                                # Check if a record with the correct class_name already exists
                                cursor.execute("""
                                    SELECT score_id FROM school_test_scores
                                    WHERE student_id = %s 
                                    AND class_name = %s 
                                    AND subject = %s 
                                    AND academic_year = %s
                                """, [profile.student_id, correct_class_name, subject, academic_year])
                                
                                existing_record = cursor.fetchone()
                                
                                if existing_record:
                                    # If a record with correct class_name exists, merge scores and delete old record
                                    existing_score_id = existing_record[0]
                                    
                                    # Get scores from current record
                                    cursor.execute("""
                                        SELECT quarterly_score, half_yearly_score, annual_score, overall_score
                                        FROM school_test_scores
                                        WHERE score_id = %s
                                    """, [score_id])
                                    
                                    old_scores = cursor.fetchone()
                                    
                                    if old_scores:
                                        old_q, old_hy, old_an, old_overall = old_scores
                                        
                                        # Get existing scores
                                        cursor.execute("""
                                            SELECT quarterly_score, half_yearly_score, annual_score, overall_score
                                            FROM school_test_scores
                                            WHERE score_id = %s
                                        """, [existing_score_id])
                                        
                                        existing_scores = cursor.fetchone()
                                        
                                        if existing_scores:
                                            ex_q, ex_hy, ex_an, ex_overall = existing_scores
                                            
                                            # Update existing record with non-null values from old record
                                            new_q = old_q if old_q is not None else ex_q
                                            new_hy = old_hy if old_hy is not None else ex_hy
                                            new_an = old_an if old_an is not None else ex_an
                                            new_overall = old_overall if old_overall is not None else ex_overall
                                            
                                            cursor.execute("""
                                                UPDATE school_test_scores
                                                SET quarterly_score = %s,
                                                    half_yearly_score = %s,
                                                    annual_score = %s,
                                                    overall_score = %s,
                                                    updated_at = CURRENT_TIMESTAMP
                                                WHERE score_id = %s
                                            """, [new_q, new_hy, new_an, new_overall, existing_score_id])
                                    
                                    # Delete the old record with wrong class_name
                                    cursor.execute("""
                                        DELETE FROM school_test_scores
                                        WHERE score_id = %s
                                    """, [score_id])
                                    
                                    self.stdout.write(
                                        self.style.SUCCESS(
                                            f"Merged and updated: Student ID {profile.student_id} "
                                            f"(grade: {profile.grade}) - Subject: {subject} - "
                                            f"Merged score ID {score_id} into {existing_score_id} "
                                            f"with class_name '{correct_class_name}'"
                                        )
                                    )
                                else:
                                    # No conflict, just update the class_name
                                    cursor.execute("""
                                        UPDATE school_test_scores
                                        SET class_name = %s, updated_at = CURRENT_TIMESTAMP
                                        WHERE score_id = %s
                                    """, [correct_class_name, score_id])
                                    
                                    self.stdout.write(
                                        self.style.SUCCESS(
                                            f"Updated: Student ID {profile.student_id} "
                                            f"(grade: {profile.grade}) - Score ID {score_id} "
                                            f"Subject: {subject} - "
                                            f"'{current_class_name}' -> '{correct_class_name}'"
                                        )
                                    )
                            updated_count += 1
                        else:
                            skipped_count += 1
                
                if dry_run:
                    self.stdout.write(
                        self.style.WARNING(
                            f'\nDRY RUN COMPLETE:\n'
                            f'  Would update: {updated_count} records\n'
                            f'  Would skip: {skipped_count} records (already correct)\n'
                            f'  Run without --dry-run to apply changes'
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'\nUpdate complete:\n'
                            f'  Updated: {updated_count} records\n'
                            f'  Skipped: {skipped_count} records (already correct)'
                        )
                    )
                    
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
            import traceback
            self.stdout.write(self.style.ERROR(traceback.format_exc()))
            raise

