# PWA Install Button Testing Guide

## 🔍 Understanding the Install Button

The install button uses the browser's `beforeinstallprompt` event, which has specific requirements:

### ✅ Requirements for Install Button to Appear

1. **HTTPS or localhost** - Must be served securely
2. **Service Worker registered** - PWA must have active service worker
3. **Valid manifest.json** - Must meet PWA criteria
4. **Not already installed** - App not currently installed
5. **Production build** - Event may not fire in development mode

## 🧪 Testing Methods

### Method 1: Development Mode (Current)

**Status**: Install button shows with "(Dev)" label

**Behavior**:
- Button appears on login and profile pages
- Clicking shows alert with instructions
- Actual installation not available
- Good for UI testing

**Console Logs**:
```
🔍 InstallButton: Checking installation status...
📱 Stored installation status: false
🖥️ Display mode check: {...}
⚠️ Install button not showing. Possible reasons:
  ...
💡 Try building for production: npm run build && npm run preview
```

### Method 2: Production Build (Recommended)

**Steps**:
```bash
# 1. Build the client for production
npm run build --prefix client

# 2. Preview the production build
npm run preview --prefix client

# 3. Open in browser (usually http://localhost:4173)
```

**Expected Behavior**:
- Install button appears (no "(Dev)" label)
- Clicking triggers native install prompt
- App can be installed to desktop/home screen

**Console Logs**:
```
🔍 InstallButton: Checking installation status...
🎯 beforeinstallprompt event fired!
✅ Install button should now be visible
```

### Method 3: Using Chrome DevTools

**Steps**:
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Manifest** in left sidebar
4. Check for errors
5. Click **Service Workers**
6. Verify service worker is active

**Manifest Checklist**:
- ✅ Name: "Sports Task Manager"
- ✅ Short name: "SportsTasks"
- ✅ Start URL: "/"
- ✅ Display: "standalone"
- ✅ Icons: 192x192, 512x512
- ✅ Theme color: #0066CC

## 📱 Testing on Different Platforms

### Desktop (Chrome/Edge/Brave)

#### Development Mode
```bash
npm run dev
# Open http://localhost:5173/login
# Install button shows with "(Dev)" label
# Click shows instructions
```

#### Production Mode
```bash
npm run build --prefix client
npm run preview --prefix client
# Open http://localhost:4173/login
# Install button shows (no label)
# Click triggers install prompt
```

### Mobile (Android Chrome)

#### Using ngrok or similar
```bash
# 1. Install ngrok: https://ngrok.com/
# 2. Start your dev server
npm run dev

# 3. In another terminal, expose it
ngrok http 5173

# 4. Open the ngrok HTTPS URL on your phone
# 5. Install button should work
```

#### Using Production Build
```bash
# Deploy to Vercel, Netlify, or similar
# Access via HTTPS URL
# Install button will work
```

### Mobile (iOS Safari)

**Note**: iOS doesn't support `beforeinstallprompt`

**Alternative**:
1. Open app in Safari
2. Tap Share button (□↑)
3. Tap "Add to Home Screen"
4. App installs to home screen

**Install button behavior on iOS**:
- Button won't appear (not supported)
- Use Safari's native "Add to Home Screen"

## 🔍 Debugging Install Button

### Check Console Logs

Open browser console and look for:

**Button Initialized**:
```
🔍 InstallButton: Checking installation status...
📱 Stored installation status: false
🖥️ Display mode check: {isStandalone: false, ...}
```

**Event Fired** (production only):
```
🎯 beforeinstallprompt event fired!
✅ Install button should now be visible
```

**Not Showing**:
```
⚠️ Install button not showing. Possible reasons:
  1. App already installed
  2. Not running on HTTPS (except localhost)
  3. Service worker not registered
  4. Running in development mode (event may not fire)
  5. Browser doesn't support PWA installation
💡 Try building for production: npm run build && npm run preview
```

### Check Installation Status

**In Console**:
```javascript
// Check if already installed
localStorage.getItem('pwa-installed')

// Check display mode
window.matchMedia('(display-mode: standalone)').matches

// Check if event listener is registered
// (Should see logs when page loads)
```

### Force Show Button (Development)

The button now shows in development mode with a "(Dev)" label for UI testing purposes.

## 🎯 Expected Behavior by Location

### Login Page

**Before Installation**:
- Install button visible at bottom
- Outline style (blue border)
- Medium size
- Shows "Install App" or "Install App (Dev)"

**After Installation**:
- Button disappears
- Only "Sign up here" link visible

### Profile Page

**Before Installation**:
- "Not Installed" status badge
- Install button next to status
- Secondary style (green)
- Small size

**After Installation**:
- "✓ Installed" status badge
- No install button
- Status shows app is installed

## 🚀 Production Deployment Testing

### Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
cd client
vercel --prod

# 3. Open the HTTPS URL
# 4. Install button should work
```

### Deploy to Netlify

```bash
# 1. Build the app
npm run build --prefix client

# 2. Deploy dist folder to Netlify
# 3. Open the HTTPS URL
# 4. Install button should work
```

## 📊 Troubleshooting

### Issue: Button Not Appearing

**Check**:
1. Console for logs
2. DevTools > Application > Manifest
3. DevTools > Application > Service Workers
4. localStorage for 'pwa-installed'

**Solutions**:
- Clear localStorage: `localStorage.clear()`
- Unregister service worker
- Hard refresh: Ctrl+Shift+R
- Try production build

### Issue: Button Shows But Doesn't Work

**Check**:
1. Console for errors
2. `beforeinstallprompt` event fired
3. Browser supports PWA

**Solutions**:
- Use production build
- Check manifest.json is valid
- Verify service worker is active
- Try different browser

### Issue: Button Shows "(Dev)" Label

**Explanation**:
- This is normal in development mode
- Button is visible for UI testing
- Clicking shows instructions
- Use production build for actual installation

**Solution**:
```bash
npm run build --prefix client
npm run preview --prefix client
```

## 🎉 Success Indicators

### Install Button Working
- ✅ Button appears on login page
- ✅ Button appears on profile page
- ✅ Clicking triggers install prompt
- ✅ App installs successfully
- ✅ Button disappears after install
- ✅ Status updates to "Installed"

### Console Logs (Production)
```
🔍 InstallButton: Checking installation status...
📱 Stored installation status: false
🖥️ Display mode check: {isStandalone: false, ...}
🎯 beforeinstallprompt event fired!
✅ Install button should now be visible
[User clicks install]
🎉 PWA was installed successfully!
```

## 📚 Additional Resources

- [PWA Install Criteria](https://web.dev/install-criteria/)
- [beforeinstallprompt Event](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)
- [Testing PWAs](https://web.dev/testing-pwa/)

## 🎯 Quick Test Checklist

- [ ] Install button shows on login page
- [ ] Install button shows on profile page
- [ ] Button has correct styling
- [ ] Console shows initialization logs
- [ ] Clicking button works (shows prompt or instructions)
- [ ] Button disappears after installation
- [ ] Profile shows "Installed" status
- [ ] App opens in standalone mode

## 💡 Development vs Production

### Development Mode (npm run dev)
- ✅ Button visible for UI testing
- ✅ Shows "(Dev)" label
- ⚠️ Clicking shows instructions
- ❌ Actual installation not available
- ✅ Good for layout/styling testing

### Production Mode (npm run build + preview)
- ✅ Button visible when installable
- ✅ No "(Dev)" label
- ✅ Clicking triggers install prompt
- ✅ Actual installation works
- ✅ Full PWA functionality

**Recommendation**: Use production build for testing actual installation!
