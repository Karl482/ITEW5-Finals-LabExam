# Setup Verification Checklist

Use this checklist to verify your development environment is configured correctly.

## Prerequisites Check

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm v9+ installed (`npm --version`)
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created and running

## Installation Verification

### 1. Dependencies Installed

```bash
# Check if node_modules exist
ls node_modules        # Root dependencies
ls client/node_modules # Client dependencies
ls server/node_modules # Server dependencies
```

Expected: All three directories should exist with packages installed.

### 2. Environment Files Created

```bash
# Check if .env files exist
ls server/.env
ls client/.env
```

Expected: Both files should exist (not just .env.example).

### 3. Environment Variables Configured

**Server (.env):**
- [ ] `MONGODB_URI` - Contains valid MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Contains secure random string (not default value)
- [ ] `PORT` - Set to 5000 (or your preferred port)
- [ ] `CLIENT_URL` - Set to http://localhost:5173

**Client (.env):**
- [ ] `VITE_API_URL` - Set to http://localhost:5000

## Development Server Verification

### 1. Start Development Servers

```bash
npm run dev
# OR
composer run dev
```

### 2. Check Console Output

You should see the following messages:

**Backend (Server):**
```
✅ MongoDB Connected: [cluster-name].mongodb.net
📊 Database: [database-name]
🚀 Server running on port 5000
🌍 Environment: development
🎯 API URL: http://localhost:5000
🔌 WebSocket server ready
⚽ Sports PWA Task Manager API is ready!
```

**Frontend (Client):**
```
VITE v5.x.x ready in [time]ms
➜  Local:   http://localhost:5173/
```

### 3. Test API Endpoints

Open a new terminal and run:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","message":"Sports PWA Task Manager API is running","timestamp":"...","version":"1.0.0"}
```

### 4. Test Frontend Access

Open your browser and navigate to:
- http://localhost:5173

Expected: Application loads without errors, showing the login page.

### 5. Test API Proxy

The frontend should be able to make API requests through the Vite proxy:
- Frontend requests to `/api/*` are proxied to `http://localhost:5000`
- No CORS errors should appear in browser console

## Hot Reload Verification

### Backend Hot Reload (Nodemon)

1. With servers running, edit `server/server.js`
2. Make a small change (e.g., add a comment)
3. Save the file
4. Check console output

Expected: You should see:
```
[nodemon] restarting due to changes...
[nodemon] starting `node server.js`
✅ MongoDB Connected: ...
```

### Frontend Hot Reload (Vite HMR)

1. With servers running, edit any React component (e.g., `client/src/App.tsx`)
2. Make a small change (e.g., add a comment)
3. Save the file
4. Check browser

Expected: Browser updates automatically without full page reload.

## MongoDB Connection Verification

### 1. Check Connection Status

When server starts, verify you see:
```
✅ MongoDB Connected: [your-cluster].mongodb.net
📊 Database: [your-database-name]
```

### 2. Test Database Operations

Try registering a new user through the application:
1. Navigate to http://localhost:5173/register
2. Fill in registration form
3. Submit

Expected: User is created successfully, and you can see the user in MongoDB Atlas.

## Common Issues and Solutions

### MongoDB Connection Fails

**Symptoms:**
```
❌ MongoDB Connection Error: ...
```

**Solutions:**
1. Verify `MONGODB_URI` format is correct
2. Check username and password are correct
3. Ensure IP address is whitelisted in MongoDB Atlas
4. Verify cluster is running (not paused)

### Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
```bash
# Kill processes on ports 5000 and 5173
npx kill-port 5000 5173

# Or change ports in .env files
```

### Environment Variables Not Loading

**Symptoms:**
- Server can't connect to MongoDB
- API URL is undefined in frontend

**Solutions:**
1. Ensure `.env` files exist (not just `.env.example`)
2. Restart development servers after changing `.env`
3. Check for typos in variable names
4. Client variables must start with `VITE_`

### Hot Reload Not Working

**Backend:**
- Check nodemon is installed: `npm list nodemon --prefix server`
- Verify `server/package.json` has correct dev script
- Look for syntax errors preventing restart

**Frontend:**
- Clear browser cache
- Check Vite dev server is running
- Look for syntax errors in console

## Final Verification

Once all checks pass:

- [ ] Both servers start without errors
- [ ] MongoDB connection is successful
- [ ] API health endpoint responds
- [ ] Frontend loads in browser
- [ ] Hot reload works for both frontend and backend
- [ ] Can register a new user
- [ ] Can login with created user
- [ ] Can create, view, edit, and delete tasks

## Next Steps

If all verifications pass, your development environment is ready!

You can now:
1. Start developing features
2. Run tests (when implemented)
3. Build for production: `npm run build --prefix client`

## Getting Help

If you encounter issues not covered here:
1. Check the main README.md for detailed setup instructions
2. Review the Troubleshooting section in README.md
3. Check server logs for error messages
4. Verify all prerequisites are met
