# WebSocket Connection Troubleshooting Guide

## Issue: "CONNECTION LOST - Attempting to reconnect..."

This guide helps you diagnose and fix WebSocket connection issues in the Sports PWA Task Manager.

---

## Quick Fixes

### 1. Check if Server is Running ✅

```bash
# Check if server is responding
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","message":"Sports PWA Task Manager API is running",...}
```

**If server is not running:**
```bash
cd server
npm run dev
```

### 2. Check if You're Logged In ✅

The WebSocket requires authentication. Make sure you're logged in:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Check for `auth_token` key
4. If missing, log in again

### 3. Manual Reconnect ✅

After 5 seconds of being disconnected, a "🔄 Reconnect" button will appear in the connection status banner. Click it to manually reconnect.

### 4. Hard Refresh ✅

```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

This clears the cache and reloads the page.

---

## Common Causes & Solutions

### Cause 1: Invalid or Expired Token

**Symptoms:**
- Connection fails immediately after page load
- Console shows: "Socket authentication error: Invalid authentication token"

**Solution:**
1. Log out and log back in
2. This will generate a fresh token
3. WebSocket will reconnect automatically

**Steps:**
```
1. Click "Logout" button
2. Log in with your credentials
3. WebSocket should connect automatically
```

### Cause 2: Server Not Running

**Symptoms:**
- Connection status shows "Connection Lost"
- Console shows: "Socket connection error: Error: xhr poll error"

**Solution:**
```bash
# Start the server
cd server
npm run dev

# Verify it's running
curl http://localhost:5000/api/health
```

### Cause 3: Port Conflict

**Symptoms:**
- Server won't start
- Error: "Port 5000 is already in use"

**Solution:**
```bash
# Windows: Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac: Find and kill process
lsof -ti:5000 | xargs kill -9

# Then restart server
cd server
npm run dev
```

### Cause 4: MongoDB Connection Issue

**Symptoms:**
- Server starts but WebSocket fails
- Server logs show MongoDB connection errors

**Solution:**
1. Check `server/.env` file
2. Verify `MONGODB_URI` is correct
3. Ensure MongoDB is running
4. Restart server

### Cause 5: CORS Issues

**Symptoms:**
- Console shows CORS errors
- WebSocket connection blocked

**Solution:**
Check `server/server.js` CORS configuration:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
```

Ensure `CLIENT_URL` in `.env` matches your client URL.

### Cause 6: Network/Firewall Issues

**Symptoms:**
- Connection works sometimes, fails other times
- Long delays before connection errors

**Solution:**
1. Check firewall settings
2. Disable VPN temporarily
3. Try different network
4. Check antivirus software

---

## Diagnostic Steps

### Step 1: Check Browser Console

Open DevTools (F12) → Console tab

**Look for:**
- ✅ "Socket connected: [socket-id]" - Connection successful
- ❌ "Socket connection error" - Connection failed
- ❌ "Socket authentication error" - Token invalid

### Step 2: Check Network Tab

Open DevTools (F12) → Network tab → WS (WebSocket) filter

**Look for:**
- WebSocket connection to `ws://localhost:5000`
- Status: 101 Switching Protocols (success)
- Status: 400/401 (authentication error)
- Status: Failed (server not reachable)

### Step 3: Check Server Logs

In the terminal where server is running:

**Look for:**
- ✅ "User connected: [user-id]" - Connection successful
- ❌ "Socket authentication error" - Token validation failed
- ❌ No logs - Server not receiving connection attempts

### Step 4: Check Application State

Open DevTools (F12) → Application tab → Local Storage

**Verify:**
- `auth_token` exists and is not empty
- `auth_user` exists with valid user data

---

## Advanced Troubleshooting

### Enable Verbose Logging

**Client-side:**
```typescript
// In client/src/services/socketService.ts
// Uncomment debug logs (already present)
```

**Server-side:**
```javascript
// In server/config/socket.js
// Add more console.log statements
```

### Test WebSocket Directly

Use a WebSocket testing tool:

```javascript
// In browser console
const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('auth_token')
  }
});

socket.on('connect', () => console.log('Connected!'));
socket.on('connect_error', (err) => console.error('Error:', err));
```

### Check JWT Token

```javascript
// In browser console
const token = localStorage.getItem('auth_token');
console.log('Token:', token);

// Decode JWT (without verification)
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log('Token payload:', payload);
console.log('Expires:', new Date(payload.exp * 1000));
```

### Monitor Connection Status

```javascript
// In browser console
setInterval(() => {
  const info = socketService.getConnectionInfo();
  console.log('Connection info:', info);
}, 2000);
```

---

## Fixes Applied

### Fix 1: Improved Socket Service ✅

**File:** `client/src/services/socketService.ts`

**Changes:**
- Added token validation before connection
- Added connection timeout (10 seconds)
- Added fallback to polling if WebSocket fails
- Added better error messages
- Added `reconnectWithToken()` method
- Added `getConnectionInfo()` method

### Fix 2: Enhanced Connection Status Component ✅

**File:** `client/src/components/ConnectionStatus.tsx`

**Changes:**
- Shows reconnection attempt count
- Displays manual reconnect button after 5 seconds
- Better user feedback

### Fix 3: Updated CSS ✅

**File:** `client/src/components/ConnectionStatus.css`

**Changes:**
- Styled reconnect button
- Improved responsive design
- Better visual feedback

---

## Prevention Tips

### 1. Keep Server Running

Use a process manager in production:
```bash
# Install PM2
npm install -g pm2

# Start server with PM2
pm2 start server/server.js --name sports-pwa-api

# Server will auto-restart on crashes
```

### 2. Implement Token Refresh

Add token refresh logic to prevent expiration:
```typescript
// Refresh token before it expires
setInterval(() => {
  refreshAuthToken();
}, 15 * 60 * 1000); // Every 15 minutes
```

### 3. Monitor Connection Health

Add connection health checks:
```typescript
// Ping server periodically
setInterval(() => {
  if (socketService.isConnected()) {
    socket.emit('ping');
  }
}, 30000); // Every 30 seconds
```

### 4. Graceful Degradation

The app already handles offline mode:
- Tasks are cached locally
- Operations are queued
- Sync happens when connection restored

---

## Testing Connection

### Test 1: Normal Connection

1. Ensure server is running
2. Log in to the application
3. Check console for: "Socket connected: [id]"
4. Connection status banner should NOT appear

### Test 2: Server Restart

1. While logged in, stop the server
2. Connection status banner should appear
3. Restart the server
4. Connection should restore automatically
5. Banner should disappear

### Test 3: Manual Reconnect

1. While logged in, stop the server
2. Wait 5 seconds
3. "🔄 Reconnect" button should appear
4. Restart the server
5. Click reconnect button
6. Connection should restore

### Test 4: Token Expiration

1. Log in to the application
2. Manually clear `auth_token` from localStorage
3. Connection should fail
4. Log in again
5. Connection should restore

---

## When to Contact Support

If you've tried all the above and still have issues:

1. **Collect Information:**
   - Browser console logs
   - Server terminal logs
   - Network tab WebSocket details
   - Steps to reproduce

2. **Check Known Issues:**
   - Review GitHub issues
   - Check documentation updates

3. **Create Bug Report:**
   - Include all collected information
   - Specify environment (OS, browser, Node version)
   - Describe expected vs actual behavior

---

## Summary

**Most Common Fix:**
```bash
# 1. Restart server
cd server
npm run dev

# 2. Hard refresh browser
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)

# 3. If still not working, log out and log back in
```

**Quick Checklist:**
- [ ] Server is running on port 5000
- [ ] You are logged in (check localStorage for auth_token)
- [ ] No firewall blocking connections
- [ ] MongoDB is connected
- [ ] Browser console shows no errors
- [ ] Network tab shows WebSocket connection

**Connection should work if all boxes are checked!** ✅

---

## Additional Resources

- **Socket.io Documentation:** https://socket.io/docs/v4/
- **JWT Documentation:** https://jwt.io/
- **WebSocket Protocol:** https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

---

**Last Updated:** December 4, 2025

**Status:** All connection fixes applied and tested ✅
