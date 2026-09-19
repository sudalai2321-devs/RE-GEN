@echo off
title Innovation DNA (RE:GEN) - Stopping Application
color 0c

echo =========================================================
echo       INNOVATION DNA (RE:GEN) - STOPPING ALL SERVERS
echo =========================================================
echo.

echo [1/2] Stopping Backend on port 8000...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo [2/2] Stopping Frontend on port 3000...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo.
echo =========================================================
echo   ALL SERVICES STOPPED SUCCESSFULLY!
echo   - Backend (Port 8000): STOPPED
echo   - Frontend (Port 3000): STOPPED
echo =========================================================
echo.
timeout /t 3
exit
