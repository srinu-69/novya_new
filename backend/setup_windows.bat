@echo off
echo 🐘 NOVYA LMS Local PostgreSQL Setup for Windows
echo ================================================

echo.
echo 📋 This script will help you set up PostgreSQL locally on Windows
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo ✅ Python is installed

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL is not installed
    echo.
    echo 📋 Please install PostgreSQL:
    echo 1. Go to https://www.postgresql.org/download/windows/
    echo 2. Download and run the installer
    echo 3. Remember the password you set for 'postgres' user
    echo 4. Make sure to install 'Command Line Tools'
    echo 5. Add PostgreSQL to your PATH: C:\Program Files\PostgreSQL\15\bin
    echo.
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo ✅ PostgreSQL is installed

REM Check if PostgreSQL service is running
sc query postgresql >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL service is not running
    echo.
    echo 🔄 Starting PostgreSQL service...
    net start postgresql
    if errorlevel 1 (
        echo ❌ Failed to start PostgreSQL service
        echo Please start it manually or check your installation
        pause
        exit /b 1
    )
    echo ✅ PostgreSQL service started
) else (
    echo ✅ PostgreSQL service is running
)

REM Create virtual environment if it doesn't exist
echo.
echo 🔧 Setting up virtual environment...
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ❌ Failed to create virtual environment
        pause
        exit /b 1
    )
    echo ✅ Virtual environment created
) else (
    echo ✅ Virtual environment already exists
)

REM Activate virtual environment
echo.
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ❌ Failed to activate virtual environment
    pause
    exit /b 1
)
echo ✅ Virtual environment activated

REM Upgrade pip
echo.
echo 📦 Upgrading pip...
python -m pip install --upgrade pip >nul 2>&1

REM Install Python dependencies
echo.
echo 📦 Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

REM Run the Python setup script (if exists)
echo.
if exist "setup_local_postgresql.py" (
    echo 🐍 Running Django setup...
    python setup_local_postgresql.py
    if errorlevel 1 (
        echo ❌ Django setup failed
        pause
        exit /b 1
    )
) else (
    echo ℹ️  setup_local_postgresql.py not found, skipping...
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Activate venv: call activate_venv.bat (or call venv\Scripts\activate.bat)
echo 2. Update DB_PASSWORD in .env file with your PostgreSQL password
echo 3. Run migrations: python manage.py migrate
echo 4. Create superuser: python manage.py createsuperuser
echo 5. Populate data: python manage.py populate_initial_data
echo 6. Start server: python manage.py runserver (or use start.bat)
echo.
echo 🌐 Access points:
echo - Django Admin: http://localhost:8000/admin/
echo - API: http://localhost:8000/api/
echo.
pause
