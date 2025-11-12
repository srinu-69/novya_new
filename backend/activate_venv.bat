@echo off
REM Activate virtual environment for Windows
REM Usage: call activate_venv.bat

if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo ✅ Virtual environment activated
) else (
    echo ❌ Virtual environment not found. Run setup_windows.bat first.
    exit /b 1
)

