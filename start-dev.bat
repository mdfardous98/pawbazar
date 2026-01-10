@echo off
echo Starting PawBazar Development Servers...
echo.

echo Checking for existing processes on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Killing process %%a on port 5000...
    taskkill /PID %%a /F >nul 2>&1
)

echo Starting Server (Backend)...
start "PawBazar Server" cmd /k "cd pawbazar-server && npm run dev"

echo Waiting 5 seconds for server to start...
timeout /t 5 /nobreak > nul

echo Starting Client (Frontend)...
start "PawBazar Client" cmd /k "cd pawbazar-client && npm run dev"

echo.
echo Both servers are starting...
echo Server: http://localhost:5000
echo Client: http://localhost:5174
echo.
echo If you see "EADDRINUSE" error, wait a moment and restart the server.
echo.
echo Press any key to exit this script (servers will continue running)
pause > nul