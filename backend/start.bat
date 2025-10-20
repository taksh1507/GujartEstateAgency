@echo off
echo Starting Gujarat Estate Backend API...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo Warning: .env file not found
    echo Copying .env.example to .env...
    copy .env.example .env
    echo.
    echo Please edit .env file with your configuration before running again
    pause
    exit /b 1
)

REM Check if Google Drive credentials exist
if not exist google-drive-credentials.json (
    echo Warning: google-drive-credentials.json not found
    echo Please add your Google Drive service account credentials file
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    npm install
    echo.
)

REM Start the server
echo Starting server on port 8000...
echo Frontend URL: http://localhost:5173
echo Admin URL: http://localhost:3001
echo API Health: http://localhost:8000/api/health
echo.
npm run dev