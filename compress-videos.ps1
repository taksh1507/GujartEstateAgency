# Video Compression Script for Gujarat Estate Agency
# This script compresses videos for better web performance

Write-Host "🎬 Gujarat Estate Agency - Video Compression Script" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Check if FFmpeg is available
try {
    $ffmpegVersion = ffmpeg -version 2>$null
    Write-Host "✅ FFmpeg found" -ForegroundColor Green
} catch {
    Write-Host "❌ FFmpeg not found. Please install FFmpeg first." -ForegroundColor Red
    Write-Host "Download from: https://ffmpeg.org/download.html" -ForegroundColor Yellow
    exit 1
}

# Define paths
$videosPath = "GujaratRealEstate-main/public/videos"
$entranceVideo = "$videosPath/entrance.mp4"
$heroVideo = "$videosPath/hero-bg.mp4"

# Check if video files exist
if (-not (Test-Path $entranceVideo)) {
    Write-Host "❌ Entrance video not found: $entranceVideo" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $heroVideo)) {
    Write-Host "❌ Hero background video not found: $heroVideo" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Original file sizes:" -ForegroundColor Yellow
Get-ChildItem $videosPath/*.mp4 | ForEach-Object {
    $sizeMB = [math]::Round($_.Length/1MB, 2)
    Write-Host "   $($_.Name): $sizeMB MB" -ForegroundColor White
}

Write-Host "`n🔄 Starting compression..." -ForegroundColor Yellow

# Compress entrance video (target: under 800KB)
Write-Host "📹 Compressing entrance video..." -ForegroundColor Cyan
$entranceCompressed = "$videosPath/entrance-compressed.mp4"
ffmpeg -i $entranceVideo -vcodec libx264 -crf 28 -preset fast -vf "scale=1280:720" -acodec aac -b:a 96k -y $entranceCompressed

# Compress hero background video (target: under 2MB)
Write-Host "📹 Compressing hero background video..." -ForegroundColor Cyan
$heroCompressed = "$videosPath/hero-bg-compressed.mp4"
ffmpeg -i $heroVideo -vcodec libx264 -crf 30 -preset fast -vf "scale=1280:720" -acodec aac -b:a 96k -y $heroCompressed

Write-Host "`n📊 Compression results:" -ForegroundColor Green
Get-ChildItem $videosPath/*-compressed.mp4 | ForEach-Object {
    $sizeMB = [math]::Round($_.Length/1MB, 2)
    Write-Host "   $($_.Name): $sizeMB MB" -ForegroundColor White
}

Write-Host "`n🔄 Replacing original files with compressed versions..." -ForegroundColor Yellow

# Backup originals
$backupPath = "$videosPath/originals"
if (-not (Test-Path $backupPath)) {
    New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
}

Move-Item $entranceVideo "$backupPath/entrance-original.mp4" -Force
Move-Item $heroVideo "$backupPath/hero-bg-original.mp4" -Force

# Replace with compressed versions
Move-Item $entranceCompressed $entranceVideo -Force
Move-Item $heroCompressed $heroVideo -Force

Write-Host "✅ Video compression completed!" -ForegroundColor Green
Write-Host "📁 Original files backed up to: $backupPath" -ForegroundColor Yellow
Write-Host "🚀 Your videos are now optimized for web deployment!" -ForegroundColor Cyan