@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 18+ is required. Get it from https://nodejs.org/
  pause
  exit /b 1
)
start "Inflation City Server" cmd /k "node server.js"
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"
echo Multiplayer server started in a separate window. Keep it open while playing.
