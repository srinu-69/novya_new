@echo off
echo Setting up NOVYA LMS Project...
echo.

echo Installing Backend Dependencies...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment for backend...
    python -m venv venv
    if errorlevel 1 (
        echo ❌ Failed to create virtual environment
        cd ..
        pause
        exit /b 1
    )
)

REM Activate virtual environment
call venv\Scripts\activate.bat
echo ✅ Virtual environment activated
echo.

REM Upgrade pip
python -m pip install --upgrade pip >nul 2>&1

REM Install backend dependencies
echo Installing Backend Dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
echo.

REM Install AI Backend Dependencies (these might not need venv, but install them in venv too)
echo Installing AI Backend Dependencies...
cd ai_backend
pip install -r requirements.txt
cd ..
echo ✅ AI Backend dependencies installed
echo.

REM Deactivate venv for now
call deactivate >nul 2>&1
cd ..

echo Installing Frontend Dependencies...
cd frontend
npm install
cd ..
echo ✅ Frontend dependencies installed
echo.

echo Setup Complete!
echo.
echo To start the project:
echo 1. Backend: cd backend && call activate_venv.bat && python manage.py runserver
echo    OR use: cd backend && start.bat
echo 2. AI Backend: cd backend\ai_backend && python app.py
echo 3. Frontend: cd frontend && npm start
echo.
echo Note: Backend now uses virtual environment (venv) for better isolation
echo.
pause
