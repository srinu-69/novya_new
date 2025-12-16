#!/usr/bin/env python
"""
Quick migration script to add status, grade, and school columns
Run this script to update the database schema
"""
import psycopg2
from psycopg2 import sql

# Database connection settings (from settings.py)
DB_CONFIG = {
    'dbname': 'novya',
    'user': 'postgres',
    'password': '12345',
    'host': 'localhost',
    'port': '5432'
}

def run_migration():
    try:
        # Connect to database
        print("🔌 Connecting to database...")
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        print("✅ Connected successfully!")
        
        # Migration SQL
        migrations = [
            # Add status column to parent_registration
            """
            ALTER TABLE parent_registration 
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' 
            CHECK (status IN ('pending', 'approved'));
            """,
            
            # Add columns to student_registration
            """
            ALTER TABLE student_registration 
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' 
            CHECK (status IN ('pending', 'approved'));
            """,
            """
            ALTER TABLE student_registration 
            ADD COLUMN IF NOT EXISTS grade VARCHAR(50);
            """,
            """
            ALTER TABLE student_registration 
            ADD COLUMN IF NOT EXISTS school VARCHAR(150);
            """,
            """
            ALTER TABLE student_registration 
            ADD COLUMN IF NOT EXISTS student_password VARCHAR(255);
            """,
            
            # Add columns to teacher_registration
            """
            ALTER TABLE teacher_registration 
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' 
            CHECK (status IN ('pending', 'approved'));
            """,
            """
            ALTER TABLE teacher_registration 
            ADD COLUMN IF NOT EXISTS grade VARCHAR(50);
            """,
            """
            ALTER TABLE teacher_registration 
            ADD COLUMN IF NOT EXISTS school VARCHAR(150);
            """,
        ]
        
        # Execute migrations
        print("\n📝 Running migrations...")
        for i, migration in enumerate(migrations, 1):
            try:
                cur.execute(migration)
                print(f"   ✅ Migration {i}/{len(migrations)} completed")
            except Exception as e:
                print(f"   ⚠️  Migration {i} warning: {e}")
                # Continue even if column already exists
        
        # Commit changes
        conn.commit()
        print("\n✅ All migrations completed successfully!")
        
        # Verify columns
        print("\n🔍 Verifying columns...")
        tables_to_check = {
            'parent_registration': ['status'],
            'student_registration': ['status', 'grade', 'school', 'student_password'],
            'teacher_registration': ['status', 'grade', 'school']
        }
        
        for table, columns in tables_to_check.items():
            for column in columns:
                cur.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = %s AND column_name = %s
                """, (table, column))
                if cur.fetchone():
                    print(f"   ✅ {table}.{column} exists")
                else:
                    print(f"   ❌ {table}.{column} missing")
        
        # Close connection
        cur.close()
        conn.close()
        print("\n🎉 Migration complete! You can now restart your Django server.")
        
    except psycopg2.Error as e:
        print(f"\n❌ Database error: {e}")
        return False
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return False
    
    return True

if __name__ == '__main__':
    print("=" * 60)
    print("NOVYA Database Migration - Add Status/Grade/School Columns")
    print("=" * 60)
    success = run_migration()
    if success:
        print("\n✅ Migration successful! Restart your Django server now.")
    else:
        print("\n❌ Migration failed. Please check the error messages above.")
    print("=" * 60)

