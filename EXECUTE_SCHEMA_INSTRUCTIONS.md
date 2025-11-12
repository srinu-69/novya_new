# Execute PostgreSQL Schema - Step by Step Guide

## Quick Steps to Execute in pgAdmin

### Step 1: Open pgAdmin
- Launch pgAdmin application
- Connect to your PostgreSQL server (enter password if prompted)

### Step 2: Create/Select Database
- In the left panel, expand "Servers" → Your server name → "Databases"
- **If `novya` database doesn't exist:**
  - Right-click on "Databases" → "Create" → "Database..."
  - Database name: `novya`
  - Owner: `postgres` (or your username)
  - Click "Save"
- **If `novya` database exists:**
  - Click on it to select it

### Step 3: Open Query Tool
- Right-click on the `novya` database
- Select "Query Tool" from the context menu
  - OR press `Alt + Shift + Q`
  - OR click the Query Tool icon in the toolbar

### Step 4: Open and Execute Schema File
- In the Query Tool, click "Open File" icon (folder icon) or press `Ctrl + O`
- Navigate to: `novya-main\NOVYA_PostgreSQL_Schema.sql`
- Select the file and click "Open"
- The entire SQL schema will load in the query editor

### Step 5: Execute
- Click the "Execute" button (play icon) 
  - OR press `F5`
  - OR go to Query → Execute (or press F5)

### Step 6: Verify Success
You should see:
- "Query returned successfully" message
- Execution time displayed
- No error messages

### Step 7: Verify Tables Created
Run this query to see all created tables:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see 27+ tables listed including:
- parent_registration
- student_registration
- users
- course
- topic
- quiz
- ai_study_plans
- coin_transaction
- etc.

## Troubleshooting

### Error: "relation already exists"
- Some tables might already exist
- You can either:
  - Drop existing tables first: `DROP TABLE IF EXISTS table_name CASCADE;`
  - Or modify the CREATE TABLE statements to use `CREATE TABLE IF NOT EXISTS`

### Error: "permission denied"
- Make sure you're connected as a user with CREATE privileges
- Try connecting as `postgres` superuser

### Error: "database does not exist"
- Make sure you created the `novya` database first
- Check that you're connected to the correct server

### Foreign Key Errors
- The schema is designed to create tables in the correct order
- If you get foreign key errors, make sure you're executing the entire file from start to finish

## What Gets Created

✅ **27+ Tables** organized into modules:
- Authentication (5 tables)
- Courses (4 tables)
- Quizzes (8 tables)
- AI Assistant (7 tables)
- Progress (4 tables)
- Rewards/Coins (3 tables)
- Notifications (1 table)
- Core (2 tables)

✅ **Indexes** for performance optimization

✅ **Sample Data** (optional - can be removed if needed)

✅ **Foreign Key Constraints** for data integrity

## File Location
The schema file is located at:
```
novya-main\NOVYA_PostgreSQL_Schema.sql
```

## Need Help?
If you encounter any issues, check:
1. PostgreSQL server is running
2. You're connected to the correct server
3. You have CREATE privileges
4. The `novya` database exists
5. You're executing the entire file (not just a portion)

