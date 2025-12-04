# Vercel Environment Variables Template

## Backend Environment Variables

Copy these to your **Backend** Vercel project:
**Settings → Environment Variables**

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sports-pwa?retryWrites=true&w=majority

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Google OAuth Credentials
GOOGLE_CLIENT_ID=697126848110-xxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx

# Backend Callback URL (replace with your actual backend URL)
GOOGLE_CALLBACK_URL=https://your-backend-project.vercel.app/api/auth/google/callback

# Frontend URL (replace with your actual frontend URL)
CLIENT_URL=https://your-frontend-project.vercel.app

# Node Environment
NODE_ENV=production

# Optional: Port (Vercel handles this automatically)
PORT=5000
```

---

## Frontend Environment Variables

Copy these to your **Frontend** Vercel project:
**Settings → Environment Variables**

```bash
# Backend API URL (replace with your actual backend URL)
VITE_API_URL=https://your-backend-project.vercel.app
```

---

## How to Get Your Vercel URLs

### After First Deployment:

1. **Backend URL**: 
   - Deploy backend: `cd server && vercel --prod`
   - Copy the URL from terminal output
   - Example: `https://sports-pwa-server-abc123.vercel.app`

2. **Frontend URL**:
   - Deploy frontend: `cd client && vercel --prod`
   - Copy the URL from terminal output
   - Example: `https://sports-pwa-client-xyz789.vercel.app`

### From Vercel Dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Copy the URL from the project overview
4. Use this URL in environment variables

---

## Google Cloud Console URLs

Add these to **Google Cloud Console → Credentials → OAuth 2.0 Client**:

### Authorized JavaScript Origins:
```
https://your-frontend-project.vercel.app
```

### Authorized Redirect URIs:
```
https://your-backend-project.vercel.app/api/auth/google/callback
```

---

## Local Development (.env files)

### server/.env
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sports-pwa
JWT_SECRET=local-dev-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
```

### client/.env
```bash
VITE_API_URL=http://localhost:5000
```

---

## Step-by-Step Setup

### 1. Generate JWT Secret

```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Or use online generator
# https://generate-secret.vercel.app/32
```

### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select project
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Copy Client ID and Client Secret

### 3. Get MongoDB URI

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create cluster (if not exists)
3. Click "Connect"
4. Choose "Connect your application"
5. Copy connection string
6. Replace `<password>` with your database password

### 4. Deploy and Configure

1. Deploy backend to Vercel
2. Copy backend URL
3. Deploy frontend to Vercel
4. Copy frontend URL
5. Add environment variables to both projects
6. Update Google Cloud Console with actual URLs
7. Redeploy both projects

---

## Verification Checklist

### Backend Variables:
- [ ] `MONGODB_URI` - Valid MongoDB connection string
- [ ] `JWT_SECRET` - Strong random string (32+ characters)
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `GOOGLE_CALLBACK_URL` - Your actual backend URL + `/api/auth/google/callback`
- [ ] `CLIENT_URL` - Your actual frontend URL
- [ ] `NODE_ENV` - Set to `production`

### Frontend Variables:
- [ ] `VITE_API_URL` - Your actual backend URL

### Google Cloud Console:
- [ ] Authorized JavaScript origins includes frontend URL
- [ ] Authorized redirect URIs includes backend callback URL
- [ ] OAuth consent screen configured
- [ ] Test users added (if in testing mode)

---

## Common Mistakes to Avoid

❌ **DON'T**:
- Use `http://` in production URLs (use `https://`)
- Include trailing slashes in URLs
- Add spaces or newlines in environment variables
- Commit `.env` files to Git
- Use the same JWT secret for dev and prod

✅ **DO**:
- Use `https://` for all production URLs
- Remove trailing slashes from URLs
- Trim whitespace from environment variables
- Use different credentials for dev/prod
- Keep secrets confidential

---

## Example with Real URLs

### Backend Environment Variables:
```bash
MONGODB_URI=mongodb+srv://myuser:mypass123@cluster0.abc123.mongodb.net/sports-pwa?retryWrites=true&w=majority
JWT_SECRET=xK9mP2nQ5rT8wY1zA4bC6dE7fG0hJ3kL5mN8pQ1rS4tU7vW0xY3zA6bC9dE2fG5h
GOOGLE_CLIENT_ID=697126848110-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz12
GOOGLE_CALLBACK_URL=https://sports-pwa-server-abc123.vercel.app/api/auth/google/callback
CLIENT_URL=https://sports-pwa-client-xyz789.vercel.app
NODE_ENV=production
```

### Frontend Environment Variables:
```bash
VITE_API_URL=https://sports-pwa-server-abc123.vercel.app
```

---

## Need Help?

- Check deployment logs: `vercel logs project-name --prod`
- Verify environment variables in Vercel dashboard
- Test OAuth flow step by step
- Review `GOOGLE_OAUTH_VERCEL_FIX.md` for detailed troubleshooting

---

**Ready to deploy! 🚀**
