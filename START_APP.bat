@echo off
setlocal enabledelayedexpansion
title Innovation DNA (RE:GEN) - Smart Launcher
color 0b

echo ====================================================================
echo        INNOVATION DNA (RE:GEN) - ZERO-CONFIG SMART LAUNCHER
echo ====================================================================
echo.

:: 1. Self-locating relative root directory
set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

:: 2. Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10 or higher from: https://www.python.org/downloads/
    echo (Make sure to check the box "Add python.exe to PATH" during installation)
    echo.
    pause
    exit /b 1
)

:: 3. Check for Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js 18 or higher from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Python and Node.js detected on this system.
echo.

:: 4. Backend Environment Auto-Setup
cd /d "%ROOT_DIR%backend"
echo [CHECK] Verifying Python backend virtual environment...

set NEED_BACKEND_SETUP=0
if not exist "venv\Scripts\python.exe" (
    set NEED_BACKEND_SETUP=1
) else (
    venv\Scripts\python.exe -c "import fastapi, uvicorn, sqlalchemy, bcrypt" >nul 2>&1
    if %errorlevel% neq 0 set NEED_BACKEND_SETUP=1
)

if "%NEED_BACKEND_SETUP%"=="1" (
    echo [SETUP] Configuring backend virtual environment on this system...
    if exist "venv" (
        echo [INFO] Refreshing existing virtual environment...
        rmdir /s /q venv >nul 2>&1
    )
    echo [1/2] Creating fresh virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        color 0c
        echo [ERROR] Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo [2/2] Installing backend dependencies...
    venv\Scripts\pip install -r requirements.txt
    if %errorlevel% neq 0 (
        color 0c
        echo [ERROR] Failed to install backend requirements!
        pause
        exit /b 1
    )
    echo [OK] Backend environment successfully configured!
    echo.
) else (
    echo [OK] Backend virtual environment is ready.
)

:: 5. Frontend Environment Auto-Setup
cd /d "%ROOT_DIR%frontend"
echo [CHECK] Verifying Frontend packages and production build...

if not exist "node_modules" (
    echo [SETUP] Installing frontend node dependencies (this runs once)...
    call npm install
    if %errorlevel% neq 0 (
        color 0c
        echo [ERROR] Failed to install npm dependencies!
        pause
        exit /b 1
    )
)

if not exist ".next" (
    echo [SETUP] Compiling production build (npm run build)...
    call npm run build
    if %errorlevel% neq 0 (
        color 0c
        echo [ERROR] Frontend build failed!
        pause
        exit /b 1
    )
)

echo [OK] Frontend is ready.
echo.

:: 6. Clean up any existing instances on ports 8000 and 3000
echo [INFO] Preparing network ports (8000, 3000)...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8000,3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>&1

:: 7. Launch Backend Server
echo [LAUNCH] Starting Backend Server (FastAPI on Port 8000)...
cd /d "%ROOT_DIR%backend"
start "Innovation DNA - Backend (Port 8000)" cmd /k "title Innovation DNA - Backend && cd /d "%ROOT_DIR%backend" && venv\Scripts\python.exe run.py"

:: 8. Launch Frontend Server
timeout /t 3 /nobreak >nul
echo [LAUNCH] Starting Frontend Server (Next.js on Port 3000)...
cd /d "%ROOT_DIR%frontend"
start "Innovation DNA - Frontend (Port 3000)" cmd /k "title Innovation DNA - Frontend && cd /d "%ROOT_DIR%frontend" && npm start"

:: 9. Open Browser
timeout /t 4 /nobreak >nul
echo.
echo ====================================================================
echo   SUCCESS! INNOVATION DNA IS NOW LIVE:
echo   - Web Frontend:  http://localhost:3000
echo   - Backend API:   http://localhost:8000/docs
echo ====================================================================
echo Opening http://localhost:3000 in your browser...
start http://localhost:3000

echo.
echo [INFO] Keep the server windows open while using the app.
echo [INFO] To stop everything, double-click STOP_APP.bat in this folder.
timeout /t 6
exit
