@echo off
echo ========================================
echo Starting Django Backend (LMS) on Port 8001
echo ========================================
echo.

REM Activate virtual environment
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo ✅ Virtual environment activated
) else (
    echo ⚠️  Virtual environment not found!
    echo Please run setup_windows.bat first to create the virtual environment.
    echo.
    echo Continuing without venv (using system Python)...
    echo.
)

echo Make sure you have:
echo 1. Configured database in config/settings.py
echo 2. Run migrations: python manage.py migrate
echo 3. Installed requirements in virtual environment
echo.
python manage.py runserver 8001

