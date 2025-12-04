# PWA Icons - Volleyball Theme 🏐

## Overview
This directory contains the PWA icons for the Sports Task Manager app, featuring a volleyball design.

## Files

### SVG Source Files
- `icon-192x192.svg` - 192x192 volleyball icon (SVG)
- `icon-512x512.svg` - 512x512 volleyball icon (SVG)
- `favicon.svg` - 32x32 favicon (referenced in index.html)

### PNG Files (Generated)
- `icon-192x192.png` - 192x192 volleyball icon (PNG)
- `icon-512x512.png` - 512x512 volleyball icon (PNG)

### Generation Scripts
- `convert-svg-to-png.cjs` - Node.js script to convert SVG to PNG using sharp
- `generate-icons.html` - Browser-based icon generator (alternative method)

## Icon Design
The volleyball icon features:
- Blue background (#0066CC) matching the app theme
- White volleyball with classic curved panel design
- Clean, modern line art style
- Rounded corners for modern app appearance

## Usage in PWA

### Manifest (manifest.json)
The icons are referenced in `/public/manifest.json`:
```json
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
```

### HTML (index.html)
- Favicon: `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`
- Apple Touch Icon: `<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />`

## Where Icons Appear
✅ Browser tab (favicon)
✅ PWA installation screen
✅ Home screen icon (mobile)
✅ App switcher (mobile)
✅ Splash screen
✅ Desktop shortcut icon

## Regenerating Icons

If you need to regenerate the PNG files from SVG:

### Method 1: Node.js (Recommended)
```bash
npm install sharp
node client/public/icons/convert-svg-to-png.cjs
```

### Method 2: Browser
1. Open `generate-icons.html` in a browser
2. Click "Generate Icons"
3. Download the generated PNG files

## Customization

To change the icon design:
1. Edit the SVG files (`icon-192x192.svg`, `icon-512x512.svg`, `favicon.svg`)
2. Run the conversion script to generate new PNGs
3. Clear browser cache and reinstall PWA to see changes
