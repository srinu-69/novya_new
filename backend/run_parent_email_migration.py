"""
Migration script to make parent_email nullable in student_registration table
"""
import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection

def run_migration():
    print("=" * 60)
    print("Migration: Make parent_email nullable in student_registration")
    print("=" * 60)
    
    try:
        with connection.cursor() as cursor:
            # Execute the ALTER TABLE command
            print("\n📝 Executing ALTER TABLE command...")
            cursor.execute("ALTER TABLE student_registration ALTER COLUMN parent_email DROP NOT NULL;")
            print("✅ ALTER TABLE command executed successfully!")
            
            # Verify the change
            print("\n🔍 Verifying the change...")
            cursor.execute("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = 'student_registration' 
                AND column_name = 'parent_email'
            """)
            result = cursor.fetchone()
            
            if result:
                column_name, data_type, is_nullable, column_default = result
                print(f"   Column: {column_name}")
                print(f"   Data Type: {data_type}")
                print(f"   Is Nullable: {is_nullable}")
                print(f"   Default: {column_default}")
                
                if is_nullable == 'YES':
                    print("\n✅ SUCCESS! parent_email is now nullable.")
                else:
                    print("\n⚠️ WARNING: parent_email is still NOT NULL. Migration may have failed.")
            else:
                print("❌ ERROR: Could not find parent_email column!")
        
        print("\n" + "=" * 60)
        print("✅ Migration complete! You can now restart your Django server.")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error during migration: {e}")
        import traceback
        traceback.print_exc()
        print("=" * 60)

if __name__ == '__main__':
    run_migration()

