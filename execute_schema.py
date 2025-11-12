#!/usr/bin/env python3
"""
Execute NOVYA PostgreSQL Schema
This script will execute the SQL schema file to create all tables in the novya database.
"""

import os
import sys

def execute_schema():
    """Execute the PostgreSQL schema file"""
    
    print("=" * 50)
    print("NOVYA Database Schema Setup")
    print("=" * 50)
    print()
    
    # Get the schema file path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    schema_file = os.path.join(script_dir, "NOVYA_PostgreSQL_Schema.sql")
    
    if not os.path.exists(schema_file):
        print(f"ERROR: Schema file not found at: {schema_file}")
        return False
    
    print(f"Found schema file: {schema_file}")
    print()
    
    # Try to import psycopg2
    try:
        import psycopg2
        from psycopg2 import sql
    except ImportError:
        print("ERROR: psycopg2 is not installed.")
        print("   Please install it using: pip install psycopg2-binary")
        print()
        print("Alternatively, use pgAdmin:")
        print("1. Open pgAdmin")
        print("2. Connect to PostgreSQL server")
        print("3. Create/Select 'novya' database")
        print("4. Right-click on 'novya' -> Query Tool")
        print("5. Open and execute: NOVYA_PostgreSQL_Schema.sql")
        return False
    
    # Get database connection details from command line args or environment variables
    import getpass
    
    print("Please provide PostgreSQL connection details:")
    print("(Press Enter to use defaults, or provide values)")
    print()
    
    # Try to get from command line arguments first
    if len(sys.argv) > 1:
        host = sys.argv[1] if len(sys.argv) > 1 else "localhost"
        port = sys.argv[2] if len(sys.argv) > 2 else "5432"
        database = sys.argv[3] if len(sys.argv) > 3 else "novya"
        user = sys.argv[4] if len(sys.argv) > 4 else "postgres"
        password = sys.argv[5] if len(sys.argv) > 5 else ""
    else:
        # Try environment variables
        host = os.getenv("PGHOST", "localhost")
        port = os.getenv("PGPORT", "5432")
        database = os.getenv("PGDATABASE", "novya")
        user = os.getenv("PGUSER", "postgres")
        password = os.getenv("PGPASSWORD", "")
    
    # If password not provided, prompt for it
    if not password:
        try:
            password = getpass.getpass("Password: ")
        except (EOFError, KeyboardInterrupt):
            print("\nPassword required. Please provide it via:")
            print("  - Command line: python execute_schema.py host port database user password")
            print("  - Environment variable: set PGPASSWORD=your_password")
            print("  - Or use pgAdmin instead (see EXECUTE_SCHEMA_INSTRUCTIONS.md)")
            return False
    
    print()
    print("Connecting to database...")
    
    try:
        # Connect to PostgreSQL
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        print(f"Connected to database: {database}")
        print()
        print("Reading schema file...")
        
        # Read the schema file
        with open(schema_file, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        
        print("Schema file loaded")
        print()
        print("Executing schema (this may take a moment)...")
        print()
        
        # Execute the schema
        # Split by semicolon and execute each statement
        statements = schema_sql.split(';')
        
        executed = 0
        errors = []
        
        for i, statement in enumerate(statements, 1):
            statement = statement.strip()
            if not statement or statement.startswith('--'):
                continue
            
            try:
                cursor.execute(statement)
                executed += 1
                if executed % 5 == 0:
                    print(f"   Executed {executed} statements...", end='\r')
            except Exception as e:
                error_msg = f"Statement {i}: {str(e)}"
                errors.append(error_msg)
                # Continue with other statements
                continue
        
        print()
        print("=" * 50)
        
        if errors:
            print(f"WARNING: Completed with {len(errors)} errors:")
            for error in errors[:10]:  # Show first 10 errors
                print(f"   {error}")
            if len(errors) > 10:
                print(f"   ... and {len(errors) - 10} more errors")
        else:
            print("SUCCESS: Schema executed successfully!")
            print(f"   Executed {executed} statements")
        
        print("=" * 50)
        print()
        
        # Verify tables were created
        print("Verifying tables...")
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """)
        
        tables = cursor.fetchall()
        table_count = len(tables)
        
        print(f"Found {table_count} tables in the database")
        print()
        
        if table_count > 0:
            print("Sample tables created:")
            for table in tables[:10]:
                print(f"   - {table[0]}")
            if table_count > 10:
                print(f"   ... and {table_count - 10} more tables")
        
        cursor.close()
        conn.close()
        
        return True
        
    except psycopg2.OperationalError as e:
        print(f"Connection error: {e}")
        print()
        print("Please check:")
        print("  - PostgreSQL server is running")
        print("  - Database 'novya' exists (or will be created)")
        print("  - Connection details are correct")
        return False
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    success = execute_schema()
    sys.exit(0 if success else 1)

