#!/bin/bash

echo "Starting Gujarat Estate Backend API..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Warning: .env file not found"
    echo "Copying .env.example to .env..."
    cp .env.example .env
    echo
    echo "Please edit .env file with your configuration before running again"
    exit 1
fi

# Check if Google Drive credentials exist
if [ ! -f google-drive-credentials.json ]; then
    echo "Warning: google-drive-credentials.json not found"
    echo "Please add your Google Drive service account credentials file"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d node_modules ]; then
    echo "Installing dependencies..."
    npm install
    echo
fi

# Start the server
echo "Starting server on port 8000..."
echo "Frontend URL: http://localhost:5173"
echo "Admin URL: http://localhost:3001"
echo "API Health: http://localhost:8000/api/health"
echo

npm run dev