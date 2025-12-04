# PWA Logo Implementation - Volleyball Theme 🏐

## Overview
The Sports Task Manager PWA now features a consistent volleyball logo across all pages, installation screens, and home screen icons.

## Logo Component

### Location
`client/src/components/Logo.tsx`

### Features
- Reusable React component
- Three size variants: `small`, `medium`, `large`
- Optional text display
- Inline SVG for optimal performance
- Matches the volleyball design from `/icons/` directory

### Usage
```tsx
import Logo from './Logo';

// With text
<Logo size="medium" showText={true} />

// Icon only
<Logo size="large" showText={false} />
```

## Implementation Locations

### ✅ Navigation Bar
- **File**: `client/src/components/Navigation.tsx`
- **Size**: Small with text
- **Location**: Top-left brand area
- Displays on all pages when user is logged in

### ✅ Login Page
- **File**: `client/src/pages/LoginPage.tsx`
- **Size**: Large icon only
- **Location**: Centered above the login form
- First impression for new users

### ✅ Register Page
- **File**: `client/src/pages/RegisterPage.tsx`
- **Size**: Large icon only
- **Location**: Centered above the registration form
- Consistent with login page

### ✅ Install Prompt
- **File**: `client/src/components/InstallPrompt.tsx`
- **Size**: Medium icon only
- **Location**: In the install prompt banner
- Shows when PWA installation is available

### ✅ PWA Icons
- **192x192**: `client/public/icons/icon-192x192.png`
- **512x512**: `client/public/icons/icon-512x512.png`
- **Favicon**: `client/public/favicon.svg`
- Used for home screen, app switcher, and browser tabs

## PWA Configuration

### Manifest (`client/public/manifest.json`)
```json
{
  "name": "Sports Task Manager",
  "short_name": "SportsTasks",
  "theme_color": "#0066CC",
  "background_color": "#0066CC",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
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

### HTML Meta Tags (`client/index.html`)
```html
<!-- Theme color matches logo background -->
<meta name="theme-color" content="#0066CC" />

<!-- Apple-specific -->
<meta name="apple-mobile-web-app-title" content="SportsTasks" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />

<!-- Manifest -->
<link rel="manifest" href="/manifest.json" />
```

## Logo Design Specifications

### Colors
- **Background**: `#0066CC` (Primary Blue)
- **Volleyball**: `#FFFFFF` (White)

### Design Elements
- Clean line art volleyball
- Three curved panels (classic volleyball pattern)
- Circular outline
- Rounded corners on background (4px for 32x32, scales proportionally)

### Sizes
- **Small**: 32x32px (Navigation)
- **Medium**: 48x48px (Install prompt)
- **Large**: 64x64px (Auth pages)
- **PWA Icons**: 192x192px, 512x512px

## Where the Logo Appears

### In-App
✅ Navigation bar (all authenticated pages)
✅ Login page
✅ Register page
✅ Install prompt banner

### System Level
✅ Browser tab (favicon)
✅ PWA installation dialog
✅ Home screen icon (iOS/Android)
✅ App switcher/task manager
✅ Splash screen
✅ Desktop shortcut
✅ Windows Start Menu / macOS Dock

## Testing the Logo

### Development
```bash
npm run dev --prefix client
```
Visit `http://localhost:5173` to see the logo in the app.

### Production Build
```bash
npm run build --prefix client
npm run preview --prefix client
```

### PWA Installation Testing
1. Build for production
2. Serve over HTTPS (or localhost)
3. Open in Chrome/Edge
4. Click install button or use browser menu
5. Verify logo appears correctly in:
   - Installation dialog
   - Home screen
   - App window

### Mobile Testing
1. Deploy to a hosting service (Vercel, Netlify, etc.)
2. Open on mobile device
3. Use "Add to Home Screen" option
4. Verify logo on home screen and splash screen

## Updating the Logo

If you need to change the logo design:

1. **Update SVG files**:
   - `client/public/favicon.svg`
   - `client/public/icons/icon-192x192.svg`
   - `client/public/icons/icon-512x512.svg`

2. **Regenerate PNG files**:
   ```bash
   node client/public/icons/convert-svg-to-png.cjs
   ```

3. **Update Logo component** (if needed):
   - Edit `client/src/components/Logo.tsx`
   - Update the inline SVG

4. **Clear cache and test**:
   - Clear browser cache
   - Uninstall and reinstall PWA
   - Test on multiple devices

## Browser Support

The volleyball logo displays correctly on:
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Samsung Internet
- ✅ Opera

## Notes

- The logo uses inline SVG in the React component for optimal performance
- PNG files are used for PWA icons (better compatibility)
- SVG favicon provides crisp display at any size
- Theme color matches the logo background for seamless integration
- All icons support both light and dark modes
