# Google OAuth Deployment Checklist

## ✅ Code Changes (COMPLETED)

- [x] Updated `LoginPage.tsx` to use environment variable for OAuth URL
- [x] Updated `AuthCallbackPage.tsx` to use environment variable for API URL
- [x] Updated `AuthContext.tsx` to use environment variable for all API calls
- [x] Build successful with no errors

## 📋 Pre-Deployment Setup

### 1. Google Cloud Console Configuration

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Select/Create your project
- [ ] Navigate to **APIs & Services** → **Credentials**
- [ ] Configure OAuth consent screen
- [ ] Create OAuth 2.0 Client ID
- [ ] Add authorized JavaScript origins:
  ```
  https://your-frontend-domain.vercel.app
  ```
- [ ] Add authorized redirect URIs:
  ```
  https://your-backend-domain.vercel.app/api/auth/google/callback
  ```
- [ ] Save Client ID and Client Secret

### 2. Deploy Backend to Vercel

- [ ] Navigate to server directory: `cd server`
- [ ] Deploy: `vercel --prod`
- [ ] Note the deployed URL (e.g., `https://your-backend.vercel.app`)

### 3. Configure Backend Environment Variables

Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables

Add these variables:

```bash
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-strong-random-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend.vercel.app/api/auth/google/callback
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

- [ ] All backend environment variables added
- [ ] Redeploy backend after adding variables

### 4. Deploy Frontend to Vercel

- [ ] Navigate to client directory: `cd client`
- [ ] Deploy: `vercel --prod`
- [ ] Note the deployed URL (e.g., `https://your-frontend.vercel.app`)

### 5. Configure Frontend Environment Variables

Go to Vercel Dashboard → Your Frontend Project → Settings → Environment Variables

Add this variable:

```bash
VITE_API_URL=https://your-backend.vercel.app
```

- [ ] Frontend environment variable added
- [ ] Redeploy frontend after adding variable

### 6. Update Google Cloud Console with Actual URLs

After deployment, update Google Cloud Console with your actual Vercel URLs:

- [ ] Update authorized JavaScript origins with actual frontend URL
- [ ] Update authorized redirect URIs with actual backend URL
- [ ] Wait 5 minutes for changes to propagate

## 🧪 Testing

### Local Testing (Optional)

- [ ] Test OAuth works on localhost
- [ ] Can login with Google locally
- [ ] Token is generated and stored
- [ ] Redirects to dashboard

### Production Testing

- [ ] Visit deployed frontend URL
- [ ] Click "Continue with Google"
- [ ] Redirects to Google consent screen
- [ ] After authorization, redirects back to app
- [ ] User is logged in successfully
- [ ] Can access dashboard
- [ ] User data displays correctly
- [ ] Logout works

## 🔧 Troubleshooting

### If you get "redirect_uri_mismatch":
1. Check the exact URL in the error message
2. Add that exact URL to Google Cloud Console
3. Wait 5 minutes
4. Try again

### If you get CORS errors:
1. Verify `CLIENT_URL` in backend environment variables
2. Check backend CORS configuration
3. Redeploy backend

### If you get "invalid_client":
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Check for extra spaces
3. Regenerate credentials if needed

### If callback shows "No Token":
1. Check backend Vercel logs
2. Verify `CLIENT_URL` is correct
3. Check if user is being created in database

## 📝 Quick Commands

```bash
# Deploy backend
cd server
vercel --prod

# Deploy frontend
cd client
vercel --prod

# Check backend logs
vercel logs your-backend-project --prod

# Check frontend logs
vercel logs your-frontend-project --prod

# Force redeploy
vercel --prod --force
```

## 🔐 Security Reminders

- [ ] JWT_SECRET is strong and unique
- [ ] Google Client Secret is kept confidential
- [ ] Environment variables are not committed to Git
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] CORS is properly configured

## 📚 Documentation

- Full guide: `GOOGLE_OAUTH_VERCEL_FIX.md`
- PWA deployment: `VERCEL_PWA_DEPLOYMENT_GUIDE.md`
- Google OAuth setup: `server/GOOGLE_OAUTH_SETUP.md`

---

**Status**: Code changes complete ✅ | Ready for deployment 🚀
