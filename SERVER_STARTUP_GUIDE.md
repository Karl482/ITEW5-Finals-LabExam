# Server Startup Guide

## Quick Start

### Start Both Servers (Recommended)
```bash
npm run dev
```

This starts:
- **Frontend (Vite)**: http://localhost:5173/
- **Backend (Express + Socket.io)**: http://localhost:5000

## Current Status

✅ **Servers are now running!**
- Client: http://localhost:5173/
- Server: http://localhost:5000 (with Socket.io)
- MongoDB: Connected to cloud instance

## Why "Connection Lost" Was Showing

The "Connection Lost" message appeared because:
1. The backend server wasn't running
2. Socket.io client couldn't connect to http://localhost:5000
3. The ConnectionStatus component displayed the warning

## How Socket Connection Works Now

### Connection Flow
1. User logs in → JWT token is obtained
2. TaskContext calls `socketService.connect(token)`
3. Socket.io connects to backend with JWT authentication
4. Real-time events are subscribed
5. Connection persists across page navigation

### Reconnection Handling
- **Network Loss**: Automatically reconnects when network returns
- **Server Restart**: Attempts reconnection with exponential backoff
- **Page Refresh**: Reconnects with stored token
- **Navigation**: Socket stays connected (doesn't disconnect)

## Troubleshooting

### If "Connection Lost" Still Appears

1. **Check if servers are running**:
   ```bash
   # Check if port 5000 is in use
   netstat -ano | findstr :5000
   ```

2. **Check browser console**:
   - Look for socket connection errors
   - Verify API URL is correct: http://localhost:5000

3. **Verify environment variables**:
   - Check `client/.env` has `VITE_API_URL=http://localhost:5000`

4. **Check authentication**:
   - Ensure you're logged in
   - JWT token should be valid

### Port Already in Use Error

If you see `EADDRINUSE: address already in use :::5000`:

1. **Find the process**:
   ```bash
   netstat -ano | findstr :5000
   ```

2. **Kill the process** (replace PID with actual process ID):
   ```bash
   taskkill /PID <PID> /F
   ```

3. **Restart servers**:
   ```bash
   npm run dev
   ```

## Development Workflow

### Starting Development
```bash
# Install dependencies (first time only)
npm run install:all

# Start development servers
npm run dev
```

### Stopping Servers
- Press `Ctrl+C` in the terminal running `npm run dev`

### Restarting After Changes
- **Frontend**: Vite hot-reloads automatically
- **Backend**: Nodemon restarts automatically on file changes

## Socket.io Features Enabled

✅ Real-time task creation notifications
✅ Real-time task update notifications  
✅ Real-time task deletion notifications
✅ Automatic reconnection on network restore
✅ Connection status indicator
✅ Manual reconnect button (after 5 seconds of disconnect)
✅ Persistent connection across navigation

## Testing Real-time Updates

1. Open app in two browser tabs
2. Log in with the same account in both
3. Create/update/delete a task in one tab
4. See the change reflected immediately in the other tab

## Production Deployment Notes

When deploying to production:
1. Update `VITE_API_URL` to your production API URL
2. Ensure Socket.io is configured for your hosting environment
3. Use HTTPS for secure WebSocket connections (wss://)
4. Configure CORS properly for your domain
