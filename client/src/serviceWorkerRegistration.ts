/**
 * Service Worker Registration
 * Handles registration, updates, and lifecycle events for the PWA service worker
 */

import { Workbox } from 'workbox-window';

interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOfflineReady?: () => void;
  onNeedRefresh?: () => void;
}

let wb: Workbox | undefined;

export function registerServiceWorker(config?: ServiceWorkerConfig) {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers are not supported in this browser');
    return;
  }

  // Only register in production or if explicitly enabled in dev
  if (import.meta.env.DEV && !import.meta.env.VITE_SW_DEV) {
    console.log('Service worker registration skipped in development mode');
    return; // Exit early in dev mode
  }

  // Check if service worker file exists before registering
  fetch('/sw.js', { method: 'HEAD' })
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType || !contentType.includes('javascript')) {
        console.log('Service worker not available yet (will be generated during build)');
        return;
      }
      
      // Service worker file exists and has correct MIME type, proceed with registration
      initializeServiceWorker(config);
    })
    .catch(() => {
      console.log('Service worker not available in development mode');
    });
}

function initializeServiceWorker(config?: ServiceWorkerConfig) {
  wb = new Workbox('/sw.js');

  // Event: Service worker installed and ready to cache content
  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      console.log('Service worker updated, new content available');
      if (config?.onUpdate && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          config.onUpdate?.(registration);
        });
      }
      if (config?.onNeedRefresh) {
        config.onNeedRefresh();
      }
    } else {
      console.log('Service worker installed for the first time');
      if (config?.onOfflineReady) {
        config.onOfflineReady();
      }
      if (config?.onSuccess && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          config.onSuccess?.(registration);
        });
      }
    }
  });

  // Event: Service worker activated
  wb.addEventListener('activated', (event) => {
    if (!event.isUpdate) {
      console.log('Service worker activated');
    }
  });

  // Event: Waiting service worker found
  wb.addEventListener('waiting', () => {
    console.log('New service worker waiting to activate');
    if (config?.onNeedRefresh) {
      config.onNeedRefresh();
    }
  });

  // Event: Controlling service worker changed
  wb.addEventListener('controlling', () => {
    console.log('Service worker is now controlling the page');
    // Reload the page to ensure all resources are from the new service worker
    window.location.reload();
  });

  // Register the service worker
  wb.register()
    .then((registration) => {
      console.log('Service worker registered successfully:', registration);
    })
    .catch((error) => {
      console.error('Service worker registration failed:', error);
    });
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('Service worker unregistered');
      })
      .catch((error) => {
        console.error('Error unregistering service worker:', error);
      });
  }
}

/**
 * Update the service worker to the latest version
 * Call this when user confirms they want to update
 */
export function updateServiceWorker() {
  if (wb) {
    wb.messageSkipWaiting();
  }
}

/**
 * Check if there's an update available
 */
export async function checkForUpdates() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  }
}
