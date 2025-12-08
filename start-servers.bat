@echo off
echo Starting Design API Server...
start "Design API Server" cmd /k "node server.js"
timeout /t 3 /nobreak >nul
echo Starting Vite Dev Server...
npm run dev

