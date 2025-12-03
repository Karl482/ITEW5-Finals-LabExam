import React, { useEffect, useState } from 'react';
import { updateServiceWorker } from '../serviceWorkerRegistration';
import './ServiceWorkerUpdate.css';

/**
 * ServiceWorkerUpdate Component
 * Displays a notification when a new version of the app is available
 * and allows the user to update to the latest version
 */
const ServiceWorkerUpdate: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {

        // Check if there's a waiting service worker
        if (reg.waiting) {
          setShowUpdate(true);
        }

        // Listen for new service workers
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is installed and waiting
                setShowUpdate(true);
              }
            });
          }
        });
      });

      // Listen for controller change (when new SW takes over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Reload the page to get the new content
        window.location.reload();
      });
    }
  }, []);

  const handleUpdate = () => {
    setShowUpdate(false);
    updateServiceWorker();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="sw-update-banner">
      <div className="sw-update-content">
        <div className="sw-update-icon">🏆</div>
        <div className="sw-update-message">
          <strong>New Version Available!</strong>
          <p>A new version of Sports Task Manager is ready. Update now to get the latest features.</p>
        </div>
        <div className="sw-update-actions">
          <button className="sw-update-btn sw-update-btn-primary" onClick={handleUpdate}>
            Update Now
          </button>
          <button className="sw-update-btn sw-update-btn-secondary" onClick={handleDismiss}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceWorkerUpdate;
