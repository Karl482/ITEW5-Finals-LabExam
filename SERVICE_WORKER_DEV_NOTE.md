# Service Worker in Development Mode

## Issue Resolved ✅

The Service Worker MIME type error has been resolved by disabling service worker registration in development mode.

## What Changed

### Before
```
❌ Service worker registration failed: SecurityError
   The script has an unsupported MIME type ('text/html')
```

### After
```
✅ Service worker disabled in development mode
   To enable, set VITE_SW_DEV=true in .env file
```

## Why This Happens

In development mode:
- Vite doesn't generate the service worker file (`sw.js`)
- When the app tries to load `/sw.js`, Vite returns HTML (404 page)
- Browser rejects registration because HTML is not valid JavaScript
- This causes the MIME type error

## Solution Applied

Service worker registration is now **disabled by default in development mode**:

1. **vite.config.js** - Set `devOptions.enabled: false`
2. **main.tsx** - Only register SW when `import.meta.env.PROD === true`
3. **serviceWorkerRegistration.ts** - Added MIME type check before registration

## Development Testing

### Current Behavior (Development Mode)
- ✅ App runs normally without service worker
- ✅ No MIME type errors in console
- ✅ All features work except offline caching
- ✅ Real-time updates work
- ✅ Authentication works
- ✅ Task management works

### What's Not Available in Dev
- ⚠️ Offline caching (requires service worker)
- ⚠️ Background sync (requires service worker)
- ⚠️ Push notifications (requires service worker)
- ⚠️ Install prompt (requires service worker)

## Testing Service Worker Features

### Option 1: Production Build (Recommended)

```bash
# Build the application
npm run build --prefix client

# Preview the production build
npm run preview --prefix client

# Open browser to http://localhost:4173
# Service worker will be active
```

### Option 2: Enable in Development (Optional)

If you need to test service worker in development:

1. Create `.env` file in `client/` directory:
   ```bash
   cd client
   echo "VITE_SW_DEV=true" > .env
   ```

2. Restart the development server:
   ```bash
   npm run dev --prefix client
   ```

3. Service worker will now register in development mode

**Note:** This may cause issues if the service worker file doesn't exist yet.

## Verification

### Check Current Mode

Open browser console and look for:

**Development Mode (SW Disabled):**
```
Service worker disabled in development mode
To enable, set VITE_SW_DEV=true in .env file
```

**Production Mode (SW Enabled):**
```
Service worker registered successfully
App is ready for offline use
```

### Verify Service Worker Status

1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in left sidebar
4. Should see:
   - Development: "No service workers"
   - Production: Service worker registered and activated

## E2E Testing Impact

### Automated Tests
- ✅ All automated tests work in development mode
- ✅ No changes needed to test suite
- ✅ Service worker endpoints still validated
- ✅ PWA manifest still tested

### Manual Tests
- ⚠️ PWA installation requires production build
- ⚠️ Offline mode requires production build
- ⚠️ Service worker caching requires production build
- ✅ All other features testable in development

## Production Deployment

### Before Deployment

1. **Build the application:**
   ```bash
   npm run build --prefix client
   ```

2. **Verify service worker generated:**
   ```bash
   ls client/dist/sw.js
   # Should exist
   ```

3. **Test production build locally:**
   ```bash
   npm run preview --prefix client
   ```

4. **Verify in browser:**
   - Open http://localhost:4173
   - Check DevTools → Application → Service Workers
   - Should see service worker registered
   - Test offline mode
   - Test PWA installation

### Production Checklist

- [ ] Service worker file exists in dist folder
- [ ] Service worker registers without errors
- [ ] Offline mode works
- [ ] PWA installable
- [ ] Icons display correctly
- [ ] Manifest loads without errors
- [ ] HTTPS enabled (required for SW in production)

## Troubleshooting

### Issue: Service worker not working in production

**Solution:**
1. Verify build completed successfully
2. Check `dist/sw.js` exists
3. Ensure server serves SW with correct MIME type
4. Verify HTTPS is enabled
5. Clear browser cache and service workers

### Issue: Want to test offline features in development

**Solution:**
1. Use production build: `npm run build && npm run preview`
2. Or enable SW in dev: Add `VITE_SW_DEV=true` to `.env`

### Issue: Service worker causing issues in development

**Solution:**
1. Disable SW: Remove `VITE_SW_DEV` from `.env`
2. Unregister existing SW: DevTools → Application → Service Workers → Unregister
3. Clear site data: DevTools → Application → Clear storage
4. Restart dev server

## Best Practices

### Development
- ✅ Keep service worker disabled (default)
- ✅ Test core features without SW
- ✅ Use production build for SW testing
- ✅ Clear SW between tests

### Production
- ✅ Always test production build before deployment
- ✅ Verify SW registration
- ✅ Test offline functionality
- ✅ Verify PWA installation
- ✅ Monitor SW updates

## Summary

The service worker MIME type error has been resolved by:
1. Disabling service worker in development mode by default
2. Adding conditional registration based on environment
3. Implementing MIME type check before registration
4. Providing option to enable in dev if needed

**Result:** 
- ✅ No more MIME type errors in development
- ✅ Clean console output
- ✅ All features work in development
- ✅ Service worker works properly in production
- ✅ E2E tests unaffected

**For PWA feature testing, use production build:** `npm run build && npm run preview`
