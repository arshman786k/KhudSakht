Write-Host "Starting Design API Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; node server.js"
Start-Sleep -Seconds 3
Write-Host "Starting Vite Dev Server..." -ForegroundColor Green
npm run dev

