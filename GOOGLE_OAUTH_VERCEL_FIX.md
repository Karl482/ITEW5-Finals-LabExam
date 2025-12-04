# Fix Google OAuth for Vercel Production Deployment

## Problem Overview

Your PWA currently has hardcoded `localhost` URLs for Google OAuth, which won't work in production. This guide will fix:
- ✅ Hardcoded localhost URLs in frontend
- ✅ Environment-based API URLs
- ✅ Google Cloud Console configuration
- ✅ Vercel environment variables
- ✅ OAuth callback flow in production

---

## Step 1: Update Frontend Code

### 1.1 Fix LoginPage.tsx

Replace the hardcoded Google OAuth URL with an environment variable:

**File: `client/src/pages/LoginPage.tsx`**

```typescript
// BEFORE (Line ~92):
const handleGoogleLogin = () => {
  // Redirect to backend Google OAuth endpoint
  window.location.href = 'http://localhost:5000/api/auth/google';
};

// AFTER:
const handleGoogleLogin = () => {
  // Redirect to backend Google OAuth endpoint
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  window.location.href = `${apiUrl}/api/auth/google`;
};
```

### 1.2 Fix AuthCallbackPage.tsx

Replace hardcoded API URLs with environment variables:

**File: `client/src/pages/AuthCallbackPage.tsx`**

```typescript
// BEFORE (Line ~30):
const response = await fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

// AFTER:
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const response = await fetch(`${apiUrl}/api/auth/me`, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

### 1.3 Fix AuthContext.tsx

Replace all hardcoded API URLs:

**File: `client/src/context/AuthContext.tsx`**

```typescript
// Add this at the top of the file, after imports:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// BEFORE (Line ~107):
const response = await fetch('http://localhost:5000/api/auth/login', {

// AFTER:
const response = await fetch(`${API_URL}/api/auth/login`, {

// BEFORE (Line ~127):
const response = await fetch('http://localhost:5000/api/auth/register', {

// AFTER:
const response = await fetch(`${API_URL}/api/auth/register`, {
```

---

## Step 2: Configure Google Cloud Console

### 2.1 Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Credentials**

### 2.2 Configure OAuth Consent Screen

1. Click **OAuth consent screen** in the left sidebar
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in required information:
   - **App name**: Sports Task Manager
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Add test users (if in testing mode)
6. Save and continue

### 2.3 Create OAuth 2.0 Credentials

1. Go to **Credentials** tab
2. Click **Create Credentials** → **OAuth client ID**
3. Choose **Web application**
4. Configure:

**Name**: Sports PWA Production

**Authorized JavaScript origins**:
```
https://your-frontend-domain.vercel.app
https://your-custom-domain.com (if you have one)
```

**Authorized redirect URIs**:
```
https://your-backend-domain.vercel.app/api/auth/google/callback
https://your-backend-domain.com/api/auth/google/callback (if custom domain)
```

5. Click **Create**
6. **Save your Client ID and Client Secret** - you'll need these!

### 2.4 Add Development URLs (Optional)

For local testing, also add:

**Authorized JavaScript origins**:
```
http://localhost:5173
http://localhost:3000
```

**Authorized redirect URIs**:
```
http://localhost:5000/api/auth/google/callback
```

---

## Step 3: Configure Vercel Environment Variables

### 3.1 Backend (Server) Environment Variables

Go to your **backend** Vercel project settings:

1. Navigate to **Settings** → **Environment Variables**
2. Add the following variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sports-pwa?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth Credentials
GOOGLE_CLIENT_ID=697126848110-your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-client-secret

# Callback URL (your backend domain)
GOOGLE_CALLBACK_URL=https://your-backend-domain.vercel.app/api/auth/google/callback

# Frontend URL (your frontend domain)
CLIENT_URL=https://your-frontend-domain.vercel.app
```

**Important Notes:**
- Replace `your-backend-domain` with your actual Vercel backend URL
- Replace `your-frontend-domain` with your actual Vercel frontend URL
- Use the Client ID and Secret from Google Cloud Console
- Generate a strong JWT_SECRET (use: `openssl rand -base64 32`)

### 3.2 Frontend (Client) Environment Variables

Go to your **frontend** Vercel project settings:

1. Navigate to **Settings** → **Environment Variables**
2. Add the following variable:

```bash
# Backend API URL
VITE_API_URL=https://your-backend-domain.vercel.app
```

**Important**: Replace `your-backend-domain` with your actual backend Vercel URL

---

## Step 4: Update Environment Files

### 4.1 Update client/.env

```bash
# Development
VITE_API_URL=http://localhost:5000

# Production (comment out for local dev)
# VITE_API_URL=https://your-backend-domain.vercel.app
```

### 4.2 Update server/.env

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sports-pwa

# JWT Secret
JWT_SECRET=your-local-dev-secret

# Google OAuth (Development)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL (Development)
CLIENT_URL=http://localhost:5173
```

---

## Step 5: Deploy to Vercel

### 5.1 Deploy Backend

```bash
cd server
vercel --prod
```

**Note the deployed URL** - you'll need it for the frontend!

### 5.2 Deploy Frontend

```bash
cd client
vercel --prod
```

### 5.3 Update Environment Variables

After deployment, if your URLs changed:
1. Update `VITE_API_URL` in frontend Vercel settings
2. Update `CLIENT_URL` and `GOOGLE_CALLBACK_URL` in backend Vercel settings
3. Redeploy both projects

---

## Step 6: Verify OAuth Configuration

### 6.1 Check Google Cloud Console

Ensure these URLs are added to **Authorized redirect URIs**:
```
https://your-actual-backend-url.vercel.app/api/auth/google/callback
```

### 6.2 Test OAuth Flow

1. Visit your deployed frontend: `https://your-frontend-url.vercel.app`
2. Click "Continue with Google"
3. Should redirect to Google consent screen
4. After authorization, should redirect back to your app
5. Should be logged in successfully

---

## Step 7: Common Issues & Solutions

### Issue 1: "redirect_uri_mismatch" Error

**Cause**: The callback URL doesn't match Google Cloud Console configuration

**Solution**:
1. Check the error message for the exact redirect URI being used
2. Add that exact URI to Google Cloud Console → Credentials → Authorized redirect URIs
3. Wait 5 minutes for changes to propagate
4. Try again

**Example**:
```
Error: redirect_uri_mismatch
The redirect URI in the request: https://your-backend.vercel.app/api/auth/google/callback
does not match the ones authorized for the OAuth client.
```

Add the exact URL from the error to your Google Cloud Console.

### Issue 2: CORS Errors

**Cause**: Backend not allowing frontend origin

**Solution**: Ensure your backend CORS configuration includes your frontend URL

**File: `server/server.js` or `server/index.js`**

```javascript
import cors from 'cors';

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Issue 3: "invalid_client" Error

**Cause**: Wrong Client ID or Client Secret

**Solution**:
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Vercel
2. Check for extra spaces or newlines
3. Ensure you're using the correct credentials from Google Cloud Console
4. Regenerate credentials if needed

### Issue 4: Callback Page Shows "No Token"

**Cause**: Token not being passed from backend to frontend

**Solution**:
1. Check backend logs in Vercel
2. Verify `CLIENT_URL` environment variable is correct
3. Ensure backend is generating JWT token correctly
4. Check if user is being created/found in database

### Issue 5: "Access Blocked" by Google

**Cause**: OAuth consent screen not configured or app not verified

**Solution**:
1. Complete OAuth consent screen configuration
2. Add test users if app is in testing mode
3. For production, submit app for verification (if needed)
4. Ensure all required scopes are added

### Issue 6: Environment Variables Not Working

**Cause**: Vercel not picking up environment variables

**Solution**:
1. Ensure variables are set in Vercel dashboard
2. Redeploy after adding/changing variables
3. Check variable names match exactly (case-sensitive)
4. For Vite, ensure variables start with `VITE_`

---

## Step 8: Testing Checklist

### Local Testing
- [ ] Google OAuth works on localhost
- [ ] Can login with Google
- [ ] User data is stored correctly
- [ ] Token is generated and stored
- [ ] Redirects to dashboard after login

### Production Testing
- [ ] Google OAuth button redirects to Google
- [ ] Google consent screen appears
- [ ] After authorization, redirects back to app
- [ ] User is logged in successfully
- [ ] Token is stored in localStorage
- [ ] Can access protected routes
- [ ] User data displays correctly
- [ ] Logout works properly

---

## Step 9: Security Best Practices

### 9.1 Environment Variables

✅ **DO**:
- Use strong, random JWT secrets
- Keep Client Secret confidential
- Use different credentials for dev/prod
- Rotate secrets periodically

❌ **DON'T**:
- Commit `.env` files to Git
- Share credentials in public repos
- Use weak or default secrets
- Expose Client Secret in frontend

### 9.2 OAuth Configuration

✅ **DO**:
- Use HTTPS in production (Vercel provides this)
- Validate redirect URIs
- Implement CSRF protection
- Use short-lived tokens

❌ **DON'T**:
- Allow wildcard redirect URIs
- Skip token validation
- Store tokens in cookies without httpOnly flag
- Use long-lived access tokens

### 9.3 Production Checklist

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables set correctly
- [ ] Google OAuth credentials are production credentials
- [ ] JWT secret is strong and unique
- [ ] CORS configured properly
- [ ] Error handling implemented
- [ ] Logging configured (but don't log secrets)
- [ ] Rate limiting enabled (optional but recommended)

---

## Step 10: Monitoring & Debugging

### 10.1 Check Vercel Logs

**Backend Logs**:
```bash
vercel logs your-backend-project-name --prod
```

**Frontend Logs**:
```bash
vercel logs your-frontend-project-name --prod
```

### 10.2 Browser DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Try Google OAuth login
4. Check for:
   - Redirect to Google
   - Callback to backend
   - Token in URL
   - API call to `/api/auth/me`

### 10.3 Common Log Messages

**Success**:
```
✅ OAuth callback: User data received
✅ OAuth callback: Navigating to dashboard
✅ Socket connected
```

**Errors**:
```
❌ OAuth error: oauth_failed
❌ No token received from OAuth callback
❌ Failed to fetch user data
```

---

## Quick Reference: URLs to Update

### Frontend Code
- [ ] `LoginPage.tsx` - Line ~92
- [ ] `AuthCallbackPage.tsx` - Line ~30
- [ ] `AuthContext.tsx` - Lines ~107, ~127

### Google Cloud Console
- [ ] Authorized JavaScript origins
- [ ] Authorized redirect URIs

### Vercel Environment Variables

**Backend**:
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GOOGLE_CALLBACK_URL`
- [ ] `CLIENT_URL`
- [ ] `JWT_SECRET`
- [ ] `MONGODB_URI`

**Frontend**:
- [ ] `VITE_API_URL`

---

## Example Production URLs

Replace these with your actual URLs:

```bash
# Frontend
https://sports-pwa-client.vercel.app

# Backend
https://sports-pwa-server.vercel.app

# Google OAuth Callback
https://sports-pwa-server.vercel.app/api/auth/google/callback

# Frontend Callback
https://sports-pwa-client.vercel.app/auth/callback
```

---

## Need Help?

### Resources
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)

### Debugging Steps
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Test OAuth flow step by step
4. Check Google Cloud Console configuration
5. Verify redirect URIs match exactly

---

**Your Google OAuth is now ready for production! 🚀**

Follow this guide step-by-step to ensure OAuth works correctly on Vercel.
