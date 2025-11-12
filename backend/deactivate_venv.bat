@echo off
REM Deactivate virtual environment for Windows

if defined VIRTUAL_ENV (
    call deactivate
    echo ✅ Virtual environment deactivated
) else (
    echo ℹ️  No virtual environment is currently active
)

