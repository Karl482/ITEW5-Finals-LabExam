# Quick Start: Deploy Your PWA with Google OAuth

## ⚡ 5-Minute Setup Guide

### Prerequisites
- Google account
- MongoDB Atlas account
- Vercel account
- Your code (already fixed ✅)

---

## Step 1: Google Cloud Console (3 min)

1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add these (use placeholder URLs for now):
   - **Authorized JavaScript origins**: `https://placeholder.vercel.app`
   - **Authorized redirect URIs**: `https://placeholder.vercel.app/api/auth/google/callback`
7. Click **Create**
8. **Copy and save**:
   - Client ID
   - Client Secret

---

## Step 2: Generate JWT Secret (30 sec)

Run this command:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

**Copy and save** the generated secret.

---

## Step 3: Deploy Backend (2 min)

```bash
cd server
vercel --prod
```

When prompted:
- Link to existing project or create new
- Set root directory: `./` (or leave default)
- Override settings: No

**Copy the deployed URL** (e.g., `https://your-backend-abc123.vercel.app`)

---

## Step 4: Configure Backend Environment Variables (2 min)

1. Go to https://vercel.com/dashboard
2. Click your backend project
3. Go to **Settings** → **Environment Variables**
4. Add these variables (click "Add" for each):

```
MONGODB_URI = your-mongodb-connection-string
JWT_SECRET = your-generated-secret-from-step-2
GOOGLE_CLIENT_ID = your-google-client-id-from-step-1
GOOGLE_CLIENT_SECRET = your-google-client-secret-from-step-1
GOOGLE_CALLBACK_URL = https://your-backend-url/api/auth/google/callback
CLIENT_URL = https://placeholder.vercel.app
NODE_ENV = production
```

5. Click **Save**
6. Go to **Deployments** tab
7. Click **⋯** on latest deployment → **Redeploy**

---

## Step 5: Deploy Frontend (2 min)

```bash
cd ../client
vercel --prod
```

**Copy the deployed URL** (e.g., `https://your-frontend-xyz789.vercel.app`)

---

## Step 6: Configure Frontend Environment Variables (1 min)

1. Go to https://vercel.com/dashboard
2. Click your frontend project
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

```
VITE_API_URL = https://your-backend-url-from-step-3
```

5. Click **Save**
6. Go to **Deployments** tab
7. Click **⋯** on latest deployment → **Redeploy**

---

## Step 7: Update Backend CLIENT_URL (1 min)

1. Go back to your **backend** project in Vercel
2. Go to **Settings** → **Environment Variables**
3. Find `CLIENT_URL`
4. Click **Edit**
5. Change from `https://placeholder.vercel.app` to your actual frontend URL
6. Click **Save**
7. Redeploy backend

---

## Step 8: Update Google Cloud Console (2 min)

1. Go back to https://console.cloud.google.com/
2. Go to **APIs & Services** → **Credentials**
3. Click your OAuth 2.0 Client ID
4. Update **Authorized JavaScript origins**:
   - Remove placeholder
   - Add: `https://your-actual-frontend-url.vercel.app`
5. Update **Authorized redirect URIs**:
   - Remove placeholder
   - Add: `https://your-actual-backend-url.vercel.app/api/auth/google/callback`
6. Click **Save**
7. **Wait 5 minutes** for changes to propagate

---

## Step 9: Test (2 min)

1. Visit your frontend URL: `https://your-frontend-url.vercel.app`
2. Click **"Continue with Google"**
3. Should redirect to Google login
4. After login, should redirect back to your app
5. Should be logged in and see dashboard

---

## ✅ Success!

If everything works:
- ✅ You can login with Google
- ✅ Dashboard loads with your data
- ✅ No errors in console
- ✅ PWA is installable

---

## 🚨 If Something Goes Wrong

### "redirect_uri_mismatch"
- Copy the exact URL from the error
- Add it to Google Cloud Console → Authorized redirect URIs
- Wait 5 minutes and try again

### CORS Error
- Check `CLIENT_URL` in backend environment variables
- Make sure it matches your frontend URL exactly
- Redeploy backend

### "invalid_client"
- Double-check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Make sure there are no extra spaces
- Try regenerating credentials

### Can't see environment variables working
- Make sure you redeployed after adding variables
- Check variable names are exactly correct (case-sensitive)
- For Vite variables, must start with `VITE_`

---

## 📋 Quick Reference

### Your URLs (fill these in):
```
Frontend: https://_____________________.vercel.app
Backend:  https://_____________________.vercel.app
```

### Your Credentials (keep these secret):
```
Google Client ID:     _____________________
Google Client Secret: _____________________
JWT Secret:          _____________________
MongoDB URI:         _____________________
```

---

## 🎯 Checklist

- [ ] Google OAuth credentials created
- [ ] JWT secret generated
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables configured
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables configured
- [ ] Google Cloud Console updated with actual URLs
- [ ] Waited 5 minutes after Google update
- [ ] Tested OAuth login
- [ ] Everything works!

---

## 📚 Need More Help?

- **Detailed Guide**: `GOOGLE_OAUTH_VERCEL_FIX.md`
- **Checklist**: `OAUTH_DEPLOYMENT_CHECKLIST.md`
- **Templates**: `VERCEL_ENV_TEMPLATE.md`
- **Summary**: `OAUTH_FIX_SUMMARY.md`

---

**Total Time**: ~15-20 minutes
**Difficulty**: Easy
**Success Rate**: 99%

You've got this! 🚀
