import React from 'react';
import { useTask } from '../context/TaskContext';
import './SyncDebugPanel.css';

/**
 * SyncDebugPanel Component
 * 
 * Debug panel for testing offline sync functionality.
 * Shows queue status and provides manual sync trigger.
 * 
 * NOTE: This is a development/testing component.
 * Remove or hide in production.
 */
const SyncDebugPanel: React.FC = () => {
  const { 
    queuedOperationsCount, 
    isSyncing, 
    syncError, 
    isOnline,
    syncQueuedOperations 
  } = useTask();

  const handleManualSync = async () => {
    if (!isOnline) {
      alert('Cannot sync while offline. Please connect to the internet.');
      return;
    }
    
    if (queuedOperationsCount === 0) {
      alert('No operations to sync.');
      return;
    }

    await syncQueuedOperations();
  };

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="sync-debug-panel">
      <div className="debug-header">
        <span className="debug-title">🔧 Sync Debug Panel</span>
      </div>
      
      <div className="debug-content">
        <div className="debug-row">
          <span className="debug-label">Network:</span>
          <span className={`debug-value ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>

        <div className="debug-row">
          <span className="debug-label">Queued Operations:</span>
          <span className="debug-value">{queuedOperationsCount}</span>
        </div>

        <div className="debug-row">
          <span className="debug-label">Sync Status:</span>
          <span className="debug-value">
            {isSyncing ? '🔄 Syncing...' : '✓ Idle'}
          </span>
        </div>

        {syncError && (
          <div className="debug-row error">
            <span className="debug-label">Error:</span>
            <span className="debug-value">{syncError}</span>
          </div>
        )}

        <button 
          className="debug-sync-button"
          onClick={handleManualSync}
          disabled={isSyncing || !isOnline || queuedOperationsCount === 0}
        >
          {isSyncing ? 'Syncing...' : 'Manual Sync'}
        </button>

        <div className="debug-instructions">
          <p><strong>Testing Instructions:</strong></p>
          <ol>
            <li>Open DevTools → Network tab</li>
            <li>Check "Offline" to simulate offline mode</li>
            <li>Create/update/delete tasks</li>
            <li>Watch queue count increase</li>
            <li>Uncheck "Offline" to go online</li>
            <li>Click "Manual Sync" or wait for auto-sync</li>
            <li>Verify operations sync successfully</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SyncDebugPanel;
