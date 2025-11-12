# Database Setup Instructions for pgAdmin

## Steps to Create Tables in PostgreSQL (pgAdmin)

### 1. Connect to PostgreSQL Server
- Open pgAdmin
- Connect to your PostgreSQL server
- Expand the server to see databases

### 2. Create/Select the Database
- If the `novya` database doesn't exist:
  - Right-click on "Databases" → Create → Database
  - Name: `novya`
  - Click "Save"
- If it exists, right-click on `novya` database → Select it

### 3. Open Query Tool
- Right-click on the `novya` database
- Select "Query Tool" (or press Alt+Shift+Q)

### 4. Execute the Schema
- Open the file: `NOVYA_PostgreSQL_Schema.sql`
- Copy the entire contents
- Paste into the Query Tool
- Click "Execute" (F5) or press F5

### 5. Verify Tables Created
After execution, you can verify by running:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see all 27+ tables listed.

## Important Notes

- Make sure you're connected to the `novya` database before executing
- The schema includes sample data (INSERT statements) - you can remove those if you want an empty database
- All foreign key constraints are properly defined
- Indexes are created for performance optimization

## Tables Created

The schema creates the following main table groups:
1. **Authentication Module**: parent_registration, student_registration, users, etc.
2. **Courses Module**: course, topic, pdffiles, videofiles
3. **Quizzes Module**: quiz, quiz_attempt, mock_test, etc.
4. **AI Assistant Module**: ai_study_plans, ai_generated_notes, ai_chat_history, etc.
5. **Progress Module**: assignments, assignment_submission, etc.
6. **Rewards/Coins Module**: coin_transaction, user_coin_balance
7. **Notifications Module**: student_notifications
8. **Core Module**: system_settings, audit_logs

## Troubleshooting

If you get errors:
- Make sure the `novya` database exists
- Check that you're connected to the correct database
- Verify PostgreSQL version compatibility (works with PostgreSQL 12+)
- If foreign key errors occur, tables might be created out of order - the schema handles this with proper ordering

