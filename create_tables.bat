@echo off
REM Batch script to execute PostgreSQL schema in novya database

echo ========================================
echo NOVYA Database Schema Setup
echo ========================================
echo.

REM Get the script directory
set SCRIPT_DIR=%~dp0
set SCHEMA_FILE=%SCRIPT_DIR%NOVYA_PostgreSQL_Schema.sql

echo Schema file: %SCHEMA_FILE%
echo.

REM Try to find psql in common PostgreSQL installation locations
set PSQL_PATH=
if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\16\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\15\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\14\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\13\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\13\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\12\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\12\bin\psql.exe
if exist "C:\Program Files (x86)\PostgreSQL\16\bin\psql.exe" set PSQL_PATH=C:\Program Files (x86)\PostgreSQL\16\bin\psql.exe
if exist "C:\Program Files (x86)\PostgreSQL\15\bin\psql.exe" set PSQL_PATH=C:\Program Files (x86)\PostgreSQL\15\bin\psql.exe
if exist "C:\Program Files (x86)\PostgreSQL\14\bin\psql.exe" set PSQL_PATH=C:\Program Files (x86)\PostgreSQL\14\bin\psql.exe

if not "%PSQL_PATH%"=="" (
    echo Found PostgreSQL at: %PSQL_PATH%
    echo.
    echo Please provide database connection details:
    set /p PGHOST="Host [localhost]: "
    if "%PGHOST%"=="" set PGHOST=localhost
    
    set /p PGPORT="Port [5432]: "
    if "%PGPORT%"=="" set PGPORT=5432
    
    set /p PGDATABASE="Database name [novya]: "
    if "%PGDATABASE%"=="" set PGDATABASE=novya
    
    set /p PGUSER="Username [postgres]: "
    if "%PGUSER%"=="" set PGUSER=postgres
    
    set /p PGPASSWORD="Password: "
    
    echo.
    echo Executing schema...
    echo.
    
    set PGPASSWORD=%PGPASSWORD%
    "%PSQL_PATH%" -h %PGHOST% -p %PGPORT% -U %PGUSER% -d %PGDATABASE% -f "%SCHEMA_FILE%"
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo SUCCESS: Schema executed successfully!
        echo ========================================
    ) else (
        echo.
        echo ========================================
        echo ERROR: Schema execution failed!
        echo ========================================
    )
) else (
    echo PostgreSQL command line (psql) not found.
    echo.
    echo ========================================
    echo INSTRUCTIONS FOR PGADMIN:
    echo ========================================
    echo.
    echo 1. Open pgAdmin application
    echo 2. Connect to your PostgreSQL server
    echo 3. Create/Select the 'novya' database:
    echo    - Right-click on "Databases"
    echo    - Select "Create" -^> "Database..."
    echo    - Name: novya
    echo    - Click "Save"
    echo.
    echo 4. Open Query Tool:
    echo    - Right-click on 'novya' database
    echo    - Select "Query Tool"
    echo.
    echo 5. Execute the schema:
    echo    - Click "Open File" icon (or Ctrl+O)
    echo    - Navigate to: %SCHEMA_FILE%
    echo    - Click "Open"
    echo    - Click "Execute" button (or press F5)
    echo.
    echo ========================================
    echo.
    echo Schema file location:
    echo %SCHEMA_FILE%
    echo.
    echo Press any key to open the schema file...
    pause >nul
    notepad "%SCHEMA_FILE%"
)

echo.
pause
