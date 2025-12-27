"""
Quick script to sync parent_email from parent_student_mapping to student_registration.
Run this directly: python quick_sync_parent_email.py
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

try:
    django.setup()
except Exception as e:
    print(f"Error setting up Django: {e}")
    print("Make sure you're running this from the backend directory")
    sys.exit(1)

from django.db import transaction
from authentication.models import ParentStudentMapping, StudentRegistration, StudentProfile

def main():
    print('\n' + '='*70)
    print('🔄 SYNCING PARENT_EMAIL FROM parent_student_mapping TO student_registration')
    print('='*70 + '\n')
    
    # Get all mappings
    mappings = ParentStudentMapping.objects.all()
    total_mappings = mappings.count()
    
    print(f'📊 Found {total_mappings} parent-student mappings\n')
    
    if total_mappings == 0:
        print('⚠️  No mappings found. Nothing to sync.')
        return
    
    updated = 0
    not_found = 0
    already_set = 0
    errors = []
    
    with transaction.atomic():
        for mapping in mappings:
            student_id = mapping.student_id
            parent_email = mapping.parent_email.strip() if mapping.parent_email else None
            
            if not parent_email:
                print(f'⚠️  Skipping mapping {mapping.mapping_id}: parent_email is empty')
                continue
            
            try:
                # Get the student registration
                student_reg = StudentRegistration.objects.get(student_id=student_id)
                
                # Check if update is needed
                if not student_reg.parent_email or student_reg.parent_email != parent_email:
                    student_reg.parent_email = parent_email
                    student_reg.save()
                    updated += 1
                    print(f'✅ Updated student_id={student_id}: parent_email = "{parent_email}"')
                else:
                    already_set += 1
                    print(f'ℹ️  student_id={student_id}: already has parent_email = "{parent_email}"')
                    
            except StudentRegistration.DoesNotExist:
                not_found += 1
                print(f'❌ StudentRegistration NOT FOUND for student_id={student_id}')
                errors.append(f'student_id={student_id} not found in student_registration')
            except Exception as e:
                errors.append(f'Error updating student_id={student_id}: {str(e)}')
                print(f'❌ ERROR updating student_id={student_id}: {str(e)}')
    
    # Summary
    print('\n' + '='*70)
    print('📊 SYNC SUMMARY')
    print('='*70)
    print(f'Total mappings processed: {total_mappings}')
    print(f'✅ Updated: {updated}')
    print(f'ℹ️  Already set (no change needed): {already_set}')
    print(f'❌ Not found in student_registration: {not_found}')
    
    if errors:
        print(f'\n⚠️  Errors: {len(errors)}')
        for error in errors:
            print(f'   - {error}')
    else:
        print('\n✅ No errors!')
    
    print('\n' + '='*70)
    print('✅ SYNC COMPLETED!')
    print('='*70 + '\n')

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\n\n⚠️  Sync cancelled by user')
        sys.exit(1)
    except Exception as e:
        print(f'\n\n❌ Fatal error: {e}')
        import traceback
        traceback.print_exc()
        sys.exit(1)

