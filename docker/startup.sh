#!/bin/sh

# Startup script for BobApp (Frontend + Backend)

echo "🚀 Starting BobApp..."

# Start backend in background
echo "🔧 Starting backend on port 8080..."
java -jar /app/backend/app.jar &

# Give backend time to start
sleep 5

# Start nginx (frontend) in foreground
echo "🌐 Starting frontend on port 80..."
nginx -g 'daemon off;'