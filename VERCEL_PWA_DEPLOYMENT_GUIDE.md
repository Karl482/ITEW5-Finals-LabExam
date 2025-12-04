# Complete Guide: Deploying a PWA on Vercel

## Table of Contents
1. [PWA Requirements Overview](#pwa-requirements-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Vercel Deployment Steps](#vercel-deployment-steps)
4. [Post-Deployment Verification](#post-deployment-verification)
5. [Common Issues & Solutions](#common-issues--solutions)
6. [Testing Installation](#testing-installation)

---

## PWA Requirements Overview

For a PWA to be installable, you need:

### 1. **HTTPS** ✅
- Vercel provides HTTPS automatically for all deployments
- Custom domains also get free SSL certificates

### 2. **Web App Manifest** ✅
- File: `manifest.json` or `manifest.webmanifest`
- Must be linked in your HTML
- Contains app metadata and icons

### 3. **Service Worker** ✅
- Handles offline functionality
- Caches resources for offline use
- Must be registered properly

### 4. **Valid Icons** ✅
- At least 192x192px and 512x512px
- PNG format recommended
- Proper paths in manifest

### 5. **Proper Scope** ✅
- Service worker scope must cover the app
- Start URL must be within scope

---

## Pre-Deployment Checklist

### Step 1: Verify Your Manifest File

Check your `public/manifest.json`:

```json
{
  "name": "Sports Task Manager",
  "short_name": "SportsTasks",
  "description": "Sports PWA Task Manager - Manage your tasks with a sports-themed interface",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#2563EB",
  "theme_color": "#2563EB",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Key Points:**
- `start_url` should be `/` or your app's root
- `display: "standalone"` makes it feel like a native app
- `theme_color` matches your app's primary color
- Icons must exist in the specified paths

### Step 2: Verify HTML Links

Check your `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- PWA Configuration -->
    <meta name="theme-color" content="#2563EB" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="SportsTasks" />
    
    <!-- Manifest Link -->
    <link rel="manifest" href="/manifest.json" />
    
    <!-- Icons -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    
    <title>Sports Task Manager</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Step 3: Verify Service Worker Registration

Check your service worker registration (usually in `main.tsx` or `App.tsx`):

```typescript
// In your main.tsx or similar entry file
import { registerSW } from './serviceWorkerRegistration';

// Register service worker
registerSW();
```

### Step 4: Create Icons

Ensure you have all required icon sizes in `public/icons/`:
- 72x72, 96x96, 128x128, 144x144, 152x152
- **192x192** (required minimum)
- 384x384
- **512x512** (required minimum)

**Quick Icon Generation:**
Use tools like:
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

### Step 5: Configure Vite for PWA

Your `vite.config.ts` should include:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Sports Task Manager',
        short_name: 'SportsTasks',
        description: 'Sports PWA Task Manager',
        theme_color: '#2563EB',
        background_color: '#2563EB',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.yourdomain\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173
  }
});
```

---

## Vercel Deployment Steps

### Method 1: Deploy via Vercel CLI

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Navigate to your project:**
```bash
cd client
```

4. **Deploy:**
```bash
vercel
```

5. **For production:**
```bash
vercel --prod
```

### Method 2: Deploy via GitHub Integration (Recommended)

1. **Push your code to GitHub:**
```bash
git add .
git commit -m "Ready for PWA deployment"
git push origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Build Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `client` (if your React app is in a subdirectory)
   - **Build Command:** `npm run build` or `yarn build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install` or `yarn install`

4. **Environment Variables:**
   Add any required environment variables:
   ```
   VITE_API_URL=https://your-api-domain.com
   ```
   
   **Note:** Your app uses `VITE_API_URL` for both REST API and Socket.IO connections.

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

### Method 3: Deploy via Vercel Dashboard

1. **Prepare your build:**
```bash
cd client
npm run build
```

2. **Upload via Dashboard:**
   - Go to Vercel Dashboard
   - Click "Add New Project"
   - Choose "Upload" option
   - Upload your `dist` folder

---

## Vercel Configuration File

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/service-worker.js",
      "headers": {
        "cache-control": "public, max-age=0, must-revalidate",
        "service-worker-allowed": "/"
      },
      "dest": "/service-worker.js"
    },
    {
      "src": "/manifest.json",
      "headers": {
        "content-type": "application/manifest+json"
      },
      "dest": "/manifest.json"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/service-worker.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        },
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## Post-Deployment Verification

### 1. Check HTTPS
- Visit your deployed URL
- Ensure it starts with `https://`
- Check for valid SSL certificate (lock icon in browser)

### 2. Test Manifest
Open Chrome DevTools:
- Go to **Application** tab
- Click **Manifest** in left sidebar
- Verify all fields are correct
- Check that icons load properly

### 3. Test Service Worker
In Chrome DevTools:
- Go to **Application** tab
- Click **Service Workers**
- Verify service worker is registered and activated
- Check status shows "activated and is running"

### 4. Run Lighthouse Audit
In Chrome DevTools:
- Go to **Lighthouse** tab
- Select "Progressive Web App" category
- Click "Generate report"
- Aim for 100% PWA score

**Key Lighthouse Checks:**
- ✅ Registers a service worker
- ✅ Responds with 200 when offline
- ✅ Has a web app manifest
- ✅ Provides a valid apple-touch-icon
- ✅ Configured for a custom splash screen
- ✅ Sets a theme color
- ✅ Content sized correctly for viewport
- ✅ Has a `<meta name="viewport">` tag

### 5. Test Installation

**Desktop (Chrome/Edge):**
- Look for install icon in address bar (⊕ or computer icon)
- Click to install
- App should open in standalone window

**Mobile (Android):**
- Open in Chrome
- Tap menu (⋮)
- Look for "Install app" or "Add to Home Screen"
- Install and test

**Mobile (iOS):**
- Open in Safari
- Tap Share button
- Select "Add to Home Screen"
- Customize name and add

---

## Common Issues & Solutions

### Issue 1: Install Prompt Not Showing

**Causes:**
- Service worker not registered
- Manifest missing or invalid
- Icons missing or wrong size
- Not served over HTTPS
- Already installed

**Solutions:**
```bash
# Check service worker registration
console.log('Service Worker' in navigator);

# Check manifest
fetch('/manifest.json').then(r => r.json()).then(console.log);

# Clear cache and unregister SW
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
```

### Issue 2: Service Worker Not Updating

**Solution:**
```javascript
// Force update on page load
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.update());
  });
}
```

**In Vercel:**
- Ensure service worker has proper cache headers
- Use versioning in service worker file name
- Clear Vercel cache: `vercel --force`

### Issue 3: Icons Not Loading

**Checklist:**
- Icons exist in `public/icons/` folder
- Paths in manifest are correct (start with `/`)
- Icons are PNG format
- Minimum sizes: 192x192 and 512x512
- Icons are square (same width and height)

**Fix:**
```json
// Correct path format in manifest.json
{
  "src": "/icons/icon-192x192.png",  // ✅ Correct
  "src": "icons/icon-192x192.png",   // ❌ Wrong
  "src": "./icons/icon-192x192.png"  // ❌ Wrong
}
```

### Issue 4: Offline Mode Not Working

**Checklist:**
- Service worker registered successfully
- Workbox caching configured
- Network requests properly cached
- Service worker scope is correct

**Test:**
```javascript
// Test offline capability
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    console.log('SW Ready:', registration);
  });
}
```

### Issue 5: Manifest Not Found (404)

**Solutions:**
1. Ensure manifest is in `public/` folder
2. Check build output includes manifest
3. Verify Vercel routes configuration
4. Check manifest link in HTML:
```html
<link rel="manifest" href="/manifest.json" />
```

### Issue 6: Wrong Start URL

**Fix in manifest.json:**
```json
{
  "start_url": "/",           // ✅ For root deployment
  "start_url": "/app/",       // ✅ For subdirectory
  "start_url": "https://...", // ❌ Don't use absolute URLs
}
```

### Issue 7: Theme Color Not Applied

**Ensure consistency:**
```html
<!-- In HTML -->
<meta name="theme-color" content="#2563EB" />
```
```json
// In manifest.json
{
  "theme_color": "#2563EB",
  "background_color": "#2563EB"
}
```

### Issue 8: App Not Opening in Standalone Mode

**Check manifest display mode:**
```json
{
  "display": "standalone",  // ✅ Recommended
  "display": "fullscreen",  // Alternative
  "display": "minimal-ui",  // Alternative
  "display": "browser"      // ❌ Not standalone
}
```

---

## Testing Installation

### Desktop Testing (Chrome)

1. **Open DevTools** (F12)
2. **Application Tab** → **Manifest**
3. Click **"Add to home screen"** link
4. Or use address bar install button

### Mobile Testing (Android)

1. **Chrome DevTools Remote Debugging:**
   - Connect Android device via USB
   - Enable USB debugging
   - Open `chrome://inspect`
   - Inspect your device

2. **Test Install:**
   - Open app in Chrome
   - Menu → "Install app"
   - Verify standalone mode

### Mobile Testing (iOS)

1. **Safari:**
   - Share → Add to Home Screen
   - Note: iOS has limited PWA support
   - No install prompt, manual only

2. **Test Offline:**
   - Enable Airplane mode
   - Open installed app
   - Verify cached content loads

---

## Deployment Checklist

Before deploying, verify:

- [ ] All icons exist (192x192, 512x512 minimum)
- [ ] manifest.json is valid and linked
- [ ] Service worker is registered
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] Theme color is set
- [ ] Start URL is correct
- [ ] Display mode is "standalone"
- [ ] Build completes without errors
- [ ] Environment variables are set
- [ ] API endpoints are configured
- [ ] Offline functionality works
- [ ] Install prompt appears
- [ ] Lighthouse PWA score is 100%

---

## Monitoring & Maintenance

### After Deployment:

1. **Monitor Service Worker Updates:**
```javascript
// Notify users of updates
navigator.serviceWorker.addEventListener('controllerchange', () => {
  window.location.reload();
});
```

2. **Track Installation:**
```javascript
window.addEventListener('appinstalled', (evt) => {
  console.log('App installed successfully');
  // Track with analytics
});
```

3. **Handle Install Prompt:**
```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show custom install button
});
```

4. **Check for Updates:**
```javascript
// Check for SW updates every hour
setInterval(() => {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.update());
  });
}, 60 * 60 * 1000);
```

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Check build output
ls -la dist/

# Test service worker locally
npx serve dist -p 3000
```

---

**Your PWA is now ready for deployment on Vercel! 🚀**

Follow this guide step-by-step to ensure your app is fully installable and offline-capable.
