@echo off
title Innovation DNA - Create Desktop Shortcuts
color 0a

echo ====================================================================
echo        CREATING DESKTOP SHORTCUTS ON THIS COMPUTER
echo ====================================================================
echo.

set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

powershell -NoProfile -Command ^
    "$wsh = New-Object -ComObject WScript.Shell; " ^
    "$desktop = [System.Environment]::GetFolderPath('Desktop'); " ^
    "$startLnk = $wsh.CreateShortcut(\"$desktop\Start Innovation DNA.lnk\"); " ^
    "$startLnk.TargetPath = '%ROOT_DIR%START_APP.bat'; " ^
    "$startLnk.WorkingDirectory = '%ROOT_DIR%'; " ^
    "$startLnk.Description = 'Start Innovation DNA Application'; " ^
    "$startLnk.Save(); " ^
    "$stopLnk = $wsh.CreateShortcut(\"$desktop\Stop Innovation DNA.lnk\"); " ^
    "$stopLnk.TargetPath = '%ROOT_DIR%STOP_APP.bat'; " ^
    "$stopLnk.WorkingDirectory = '%ROOT_DIR%'; " ^
    "$stopLnk.Description = 'Stop Innovation DNA Application'; " ^
    "$stopLnk.Save(); " ^
    "Write-Output \"[OK] Shortcuts created on Desktop: $desktop\""

echo.
echo ====================================================================
echo   SHORTCUTS CREATED ON YOUR DESKTOP:
echo   - 'Start Innovation DNA'
echo   - 'Stop Innovation DNA'
echo ====================================================================
echo.
timeout /t 4
exit
