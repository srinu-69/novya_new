# Quick Guide: Execute Schema in pgAdmin

## Fastest Method (3 Steps)

### Step 1: Open pgAdmin and Connect
- Open pgAdmin
- Connect to your PostgreSQL server

### Step 2: Select/Create Database
- Expand "Servers" → Your Server → "Databases"
- **If `novya` exists:** Click on it
- **If `novya` doesn't exist:**
  - Right-click "Databases" → Create → Database
  - Name: `novya`
  - Click "Save"

### Step 3: Execute Schema
1. Right-click on `novya` database → **Query Tool**
2. Click **Open File** icon (folder icon) or press **Ctrl+O**
3. Navigate to: `C:\Users\user\Desktop\novya\novya-main\novya-main\NOVYA_PostgreSQL_Schema.sql`
4. Click **Open**
5. Click **Execute** button (▶) or press **F5**

## Done! ✅

You should see:
- "Query returned successfully"
- All 27+ tables created

## Verify Tables Created

Run this query in Query Tool:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see tables like:
- parent_registration
- student_registration
- users
- course
- topic
- quiz
- ai_study_plans
- coin_transaction
- etc.

## Alternative: Double-Click Method

1. Double-click `create_tables.bat` in the project folder
2. Follow the on-screen instructions
3. If psql is found, it will execute automatically
4. If not, it will open the SQL file for you to copy into pgAdmin

