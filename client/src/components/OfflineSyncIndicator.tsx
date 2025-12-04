import React from 'react';
import './OfflineSyncIndicator.css';

interface OfflineSyncIndicatorProps {
  queueCount: number;
  isSyncing: boolean;
  syncError: string | null;
}

/**
 * OfflineSyncIndicator Component
 * 
 * Displays the status of offline operation synchronization.
 * Shows when operations are queued and when they're being synced.
 */
const OfflineSyncIndicator: React.FC<OfflineSyncIndicatorProps> = ({
  queueCount,
  isSyncing,
  syncError,
}) => {
  // Don't show if no queued operations and not syncing
  if (queueCount === 0 && !isSyncing && !syncError) {
    return null;
  }

  return (
    <div className={`offline-sync-indicator ${isSyncing ? 'syncing' : ''} ${syncError ? 'error' : ''}`}>
      <div className="sync-content">
        {isSyncing ? (
          <>
            <span className="sync-icon spinning">🔄</span>
            <span className="sync-text">
              Syncing {queueCount} operation{queueCount !== 1 ? 's' : ''}...
            </span>
          </>
        ) : syncError ? (
          <>
            <span className="sync-icon">⚠️</span>
            <span className="sync-text">
              Sync failed: {syncError}
            </span>
          </>
        ) : queueCount > 0 ? (
          <>
            <span className="sync-icon">📤</span>
            <span className="sync-text">
              {queueCount} operation{queueCount !== 1 ? 's' : ''} queued for sync
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default OfflineSyncIndicator;
