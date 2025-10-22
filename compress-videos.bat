@echo off
echo 🎬 Gujarat Estate Agency - Video Compression
echo ==========================================

REM Check if FFmpeg is available
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ FFmpeg not found. Please install FFmpeg first.
    echo Download from: https://ffmpeg.org/download.html
    pause
    exit /b 1
)

echo ✅ FFmpeg found

REM Define paths
set "videosPath=GujaratRealEstate-main\public\videos"
set "entranceVideo=%videosPath%\entrance.mp4"
set "heroVideo=%videosPath%\hero-bg.mp4"

REM Check if files exist
if not exist "%entranceVideo%" (
    echo ❌ Entrance video not found
    pause
    exit /b 1
)

if not exist "%heroVideo%" (
    echo ❌ Hero background video not found
    pause
    exit /b 1
)

echo 📁 Compressing videos for web optimization...

REM Create backup directory
if not exist "%videosPath%\originals" mkdir "%videosPath%\originals"

REM Backup originals
copy "%entranceVideo%" "%videosPath%\originals\entrance-original.mp4"
copy "%heroVideo%" "%videosPath%\originals\hero-bg-original.mp4"

REM Compress entrance video (target: under 800KB)
echo 📹 Compressing entrance video...
ffmpeg -i "%entranceVideo%" -vcodec libx264 -crf 28 -preset fast -vf "scale=1280:720" -acodec aac -b:a 96k -y "%videosPath%\entrance-temp.mp4"

REM Compress hero background video (target: under 2MB)
echo 📹 Compressing hero background video...
ffmpeg -i "%heroVideo%" -vcodec libx264 -crf 30 -preset fast -vf "scale=1280:720" -acodec aac -b:a 96k -y "%videosPath%\hero-bg-temp.mp4"

REM Replace original files
move "%videosPath%\entrance-temp.mp4" "%entranceVideo%"
move "%videosPath%\hero-bg-temp.mp4" "%heroVideo%"

echo ✅ Video compression completed!
echo 📁 Original files backed up to: %videosPath%\originals
echo 🚀 Your videos are now optimized for web deployment!
pause