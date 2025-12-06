@echo off
REM Start Frontend Server on Windows
REM Usage: run-frontend.bat [port]

setlocal enabledelayedexpansion

REM Determine port (default 3000)
set PORT=3000
if not "%~1"=="" set PORT=%1

REM Get the directory of this script
set SCRIPT_DIR=%~dp0

REM Change to FE directory
cd /d "%SCRIPT_DIR%"

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

REM Start server
echo.
echo 🚀 Starting Frontend Server on port %PORT%...
echo.
python server.py --port %PORT%

pause
