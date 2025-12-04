# Install Prompt Component

## Overview
The InstallPrompt component provides a user-friendly interface for installing the Sports Task Manager as a Progressive Web App (PWA) on the user's device.

## Features

### 1. beforeinstallprompt Event Handling
- Listens for the browser's `beforeinstallprompt` event
- Prevents the default mini-infobar on mobile devices
- Stores the event for later use when user clicks install

### 2. Installation State Management
- Tracks whether the app is already installed via localStorage
- Prevents showing the prompt if user has dismissed it
- Automatically hides prompt after successful installation

### 3. User Actions
- **Install Button**: Triggers the native browser installation prompt
- **Dismiss Button**: Hides the prompt and stores dismissal state
- Handles user's installation choice (accepted/dismissed)

### 4. Sports-Themed Design
- Trophy icon (🏆) representing achievement
- Championship gold install button
- Blue gradient background matching app theme
- Smooth animations (slide-up entrance, bounce effect)
- Responsive design for mobile and desktop

## Usage

The component is automatically included in the main App component and will:
1. Show when the browser fires the `beforeinstallprompt` event
2. Hide if the user has already installed the app
3. Hide if the user has previously dismissed the prompt
4. Automatically hide after successful installation

## localStorage Keys

- `pwa-installed`: Set to 'true' when app is installed
- `pwa-prompt-dismissed`: Set to 'true' when user dismisses the prompt

## Browser Support

The install prompt works on browsers that support PWA installation:
- Chrome/Edge (Desktop & Mobile)
- Safari (iOS 16.4+)
- Samsung Internet
- Opera

Note: Firefox does not support the `beforeinstallprompt` event.

## Testing

To test the install prompt:

1. **Development**: The prompt won't show in development mode. You need to:
   - Build the app: `npm run build`
   - Serve the built app over HTTPS or localhost
   - Clear localStorage if you've dismissed it before

2. **Reset Prompt**: Clear localStorage to see the prompt again:
   ```javascript
   localStorage.removeItem('pwa-prompt-dismissed');
   localStorage.removeItem('pwa-installed');
   ```

3. **Verify Installation**: After installing, check:
   - The prompt should not appear again
   - App should be accessible from home screen/app drawer
   - App should launch in standalone mode

## Accessibility

- Keyboard navigation support
- ARIA labels on buttons
- Focus indicators for keyboard users
- Respects `prefers-reduced-motion` for animations

## Requirements Satisfied

- **3.2**: Prompts for installation on supported browsers
- **3.5**: Stores installation state to prevent repeated prompts
