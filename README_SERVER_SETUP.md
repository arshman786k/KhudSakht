# Server Setup Guide

## Problem: "Failed to fetch designs: Internal Server Error"

This error occurs when the design API server is not running. The frontend (Vite) runs on port 3000, but it needs the backend API server running on port 5000 to fetch design data.

## Quick Fix

### Option 1: Start Both Servers Together (Recommended)

```bash
npm run dev:all
```

This will start both the API server (port 5000) and the Vite dev server (port 3000) simultaneously.

### Option 2: Start Servers Separately

**Terminal 1 - Start API Server:**
```bash
npm run server
```

Wait for the message: `✅ Design API server running on http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

### Option 3: Use PowerShell Script (Windows)

```powershell
.\start-servers.ps1
```

## Verify Server is Running

1. Open http://localhost:5000/api/health in your browser
2. You should see: `{"status":"ok","message":"Design API is running"}`

## Available API Endpoints

- `GET /api/health` - Health check
- `GET /api/designs` - Get all designs
- `GET /api/designs/:part` - Get designs for a specific part (gala, front, back, bazo, shalwar)
- `GET /designs/*` - Serve design images

## Troubleshooting

### Port 5000 Already in Use

If you see: `❌ Port 5000 is already in use`

1. Find and stop the process using port 5000:
   ```powershell
   netstat -ano | findstr :5000
   ```
2. Kill the process (replace PID with the actual process ID):
   ```powershell
   taskkill /PID <PID> /F
   ```
3. Or change the port in `server.js`:
   ```javascript
   const PORT = process.env.PORT || 5001; // Use different port
   ```

### CORS Errors

The server is configured with CORS enabled. If you still see CORS errors, make sure:
- The server is running on port 5000
- The Vite proxy is configured correctly (check `vite.config.ts`)

### Design Images Not Loading

1. Verify the `designs` folder exists in the project root
2. Check that design images are in the correct subfolders:
   - `designs/gala/`
   - `designs/front/`
   - `designs/back/`
   - `designs/bazo/`
   - `designs/shalwar/`
3. Ensure image filenames match those in `server.js`

## Production Setup

For production, you'll need to:
1. Set the `VITE_API_URL` environment variable to your production API URL
2. Deploy the server.js to your backend hosting
3. Update CORS settings in server.js to allow your production domain


