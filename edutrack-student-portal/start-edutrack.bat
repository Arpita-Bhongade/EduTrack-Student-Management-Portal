@echo off
TITLE EduTrack Student Management Portal
cd /d "%~dp0"
echo ========================================
echo   EduTrack - Student Management Portal
echo ========================================
echo.
echo Installing dependencies...
call npm install
if errorlevel 1 (
  echo.
  echo npm install failed. Make sure Node.js is installed and internet is available.
  pause
  exit /b 1
)
echo.
echo Starting frontend and backend...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
call npm run dev
pause
