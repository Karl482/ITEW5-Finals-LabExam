# Offline Operation Queueing and Synchronization

## Overview

The Sports PWA Task Manager now includes a comprehensive offline operation queueing system that allows users to create, update, and delete tasks even when offline. These operations are automatically synchronized with the backend when the connection is restored.

## Features

### 1. Operation Queueing

When the user is offline, all task operations (create, update, delete) are:
- Queued in IndexedDB for persistence
- Applied optimistically to the UI for immediate feedback
- Cached in localStorage for offline viewing

### 2. Automatic Synchronization

When the connection is restored:
- The app automatically detects the online event
- Queued operations are processed sequentially
- Failed operations are retried up to 3 times
- The UI is updated after successful synchronization

### 3. Visual Feedback

The `OfflineSyncIndicator` component provides real-time feedback:
- **Queued**: Shows count of pending operations (purple badge)
- **Syncing**: Animated spinner while processing (blue badge)
- **Error**: Displays sync errors (red badge)

## Architecture

### IndexedDB Storage

**Database**: `sports_pwa_sync_queue`
**Object Store**: `operations`
**Indexes**:
- `timestamp` - For chronological ordering
- `type` - For filtering by operation type

### Queued Operation Structure

```typescript
interface QueuedOperation {
  id: string;              // Unique operation ID
  type: 'create' | 'update' | 'delete';
  taskId?: string;         // For update/delete
  taskData?: any;          // For create/update
  timestamp: number;       // When queued
  retryCount: number;      // Number of retry attempts
  error?: string;          // Last error message
}
```

## Implementation Details

### SyncQueueService

Located in `client/src/services/syncQueueService.ts`

**Key Methods**:
- `addOperation()` - Add operation to queue
- `getAllOperations()` - Get all queued operations
- `getQueueCount()` - Get count of queued operations
- `removeOperation()` - Remove operation after success
- `updateOperation()` - Update retry count and errors
- `clearQueue()` - Clear all operations
- `hasQueuedOperations()` - Check if queue has items

### TaskContext Integration

The `TaskContext` has been enhanced with:

**New State Properties**:
```typescript
{
  queuedOperationsCount: number;  // Count of queued operations
  isSyncing: boolean;             // Whether sync is in progress
  syncError: string | null;       // Last sync error
}
```

**New Methods**:
- `syncQueuedOperations()` - Manually trigger sync
- `processQueuedOperation()` - Process single operation
- `updateQueueCount()` - Update queue count in state

### Offline Operation Flow

#### Create Task (Offline)
1. User creates task while offline
2. Operation added to IndexedDB queue
3. Optimistic task created with temporary ID
4. Task displayed immediately in UI
5. Queue count updated

#### Update Task (Offline)
1. User updates task while offline
2. Operation added to IndexedDB queue
3. Task updated optimistically in UI
4. Changes cached in localStorage
5. Queue count updated

#### Delete Task (Offline)
1. User deletes task while offline
2. Operation added to IndexedDB queue
3. Task removed optimistically from UI
4. Cache updated
5. Queue count updated

### Synchronization Flow

#### Automatic Sync on Reconnection
1. `window.online` event fires
2. Check if queue has operations
3. If yes, trigger `syncQueuedOperations()`
4. Process operations sequentially
5. Update UI after completion

#### Processing Operations
1. Get all operations sorted by timestamp
2. For each operation:
   - Call appropriate API (create/update/delete)
   - On success: Remove from queue
   - On failure: Increment retry count
   - If retry count >= 3: Remove from queue
3. Update queue count
4. Refetch tasks to get latest state
5. Display sync status

### Conflict Resolution

**Strategy**: Last-write-wins
- Operations are processed in chronological order
- Server state is considered authoritative
- After sync, tasks are refetched from server
- Optimistic updates are replaced with server data

**Handling Conflicts**:
- If a task was deleted on server but updated offline, the update will fail
- Failed operations are removed after 3 retry attempts
- User is notified of sync errors via `OfflineSyncIndicator`

## User Experience

### Scenario 1: Create Task Offline
1. User is offline
2. Creates new task "Complete training"
3. Task appears immediately with temporary ID
4. Purple badge shows "1 operation queued for sync"
5. User reconnects
6. Blue badge shows "Syncing 1 operation..."
7. Task is created on server
8. UI updates with real task ID
9. Badge disappears

### Scenario 2: Multiple Operations Offline
1. User goes offline
2. Creates 2 tasks, updates 1 task, deletes 1 task
3. Badge shows "4 operations queued for sync"
4. All changes visible immediately in UI
5. User reconnects
6. Badge shows "Syncing 4 operations..."
7. Operations processed sequentially
8. Badge disappears after completion

### Scenario 3: Sync Failure
1. User reconnects but server is down
2. Sync attempts fail
3. Operations retry up to 3 times
4. Red badge shows "2 operation(s) failed to sync"
5. Failed operations removed after max retries
6. User can manually retry by refreshing

### Scenario 4: Optimistic Updates
1. User offline, updates task status to "completed"
2. Change visible immediately
3. User reconnects
4. Sync processes update
5. If successful, no visible change (already updated)
6. If failed, task reverts to server state

## Testing

### Manual Testing

#### Test Offline Create
```
1. Open app and log in
2. Open DevTools > Network tab
3. Check "Offline" checkbox
4. Create a new task
5. Verify task appears immediately
6. Verify purple badge shows "1 operation queued"
7. Uncheck "Offline"
8. Verify blue badge shows "Syncing..."
9. Verify task syncs successfully
10. Verify badge disappears
```

#### Test Offline Update
```
1. Go offline (DevTools)
2. Edit an existing task
3. Verify changes appear immediately
4. Verify queue count increases
5. Go online
6. Verify sync completes
7. Refresh page and verify changes persisted
```

#### Test Offline Delete
```
1. Go offline
2. Delete a task
3. Verify task removed from UI
4. Verify queue count increases
5. Go online
6. Verify sync completes
7. Verify task deleted on server
```

#### Test Multiple Operations
```
1. Go offline
2. Create 2 tasks
3. Update 1 task
4. Delete 1 task
5. Verify all changes in UI
6. Verify badge shows "4 operations queued"
7. Go online
8. Verify all operations sync
9. Verify final state matches server
```

### Browser DevTools Testing

**IndexedDB Inspection**:
1. Open DevTools > Application tab
2. Expand IndexedDB
3. Find `sports_pwa_sync_queue`
4. View `operations` object store
5. Inspect queued operations

**Network Throttling**:
1. DevTools > Network tab
2. Select "Slow 3G" or "Offline"
3. Test offline functionality
4. Switch to "Online" to test sync

## Technical Considerations

### Browser Support
- IndexedDB: All modern browsers (Chrome 24+, Firefox 16+, Safari 10+, Edge 12+)
- Online/Offline events: All modern browsers
- Promises: All modern browsers

### Storage Limits
- IndexedDB: Typically 50MB+ per origin
- Varies by browser and available disk space
- Operations are small (~1KB each)
- Can store thousands of operations

### Performance
- IndexedDB operations are asynchronous
- Minimal impact on UI performance
- Sync processes operations sequentially to maintain order
- Large queues (100+ operations) may take several seconds to sync

### Error Handling
- Network errors: Retry up to 3 times
- Server errors (4xx, 5xx): Retry up to 3 times
- Invalid operations: Removed after max retries
- Sync errors displayed to user

### Security
- Operations stored in IndexedDB (origin-isolated)
- JWT token required for sync
- Operations only accessible to same origin
- No sensitive data stored in queue (only task data)

## Future Enhancements

Potential improvements for future versions:

1. **Smart Conflict Resolution**
   - Detect conflicts before sync
   - Prompt user to resolve conflicts
   - Merge changes intelligently

2. **Batch Sync**
   - Group operations into batches
   - Reduce number of API calls
   - Improve sync performance

3. **Sync Priority**
   - Prioritize certain operations
   - Sync critical operations first
   - Defer low-priority operations

4. **Background Sync API**
   - Use Background Sync API when available
   - Sync even when app is closed
   - Better reliability

5. **Sync History**
   - Track sync history
   - Show sync logs to user
   - Debug sync issues

## Related Files

- `client/src/services/syncQueueService.ts` - Queue management
- `client/src/context/TaskContext.tsx` - Integration with task operations
- `client/src/components/OfflineSyncIndicator.tsx` - UI component
- `client/src/components/OfflineSyncIndicator.css` - Styles
- `client/src/App.tsx` - Component integration

## API Reference

### syncQueueService

```typescript
// Add operation to queue
await syncQueueService.addOperation({
  type: 'create',
  taskData: { title: 'New Task', description: 'Description' }
});

// Get all operations
const operations = await syncQueueService.getAllOperations();

// Get queue count
const count = await syncQueueService.getQueueCount();

// Remove operation
await syncQueueService.removeOperation(operationId);

// Update operation
await syncQueueService.updateOperation(operationId, {
  retryCount: 1,
  error: 'Network error'
});

// Clear queue
await syncQueueService.clearQueue();

// Check if has operations
const hasOps = await syncQueueService.hasQueuedOperations();
```

### TaskContext

```typescript
const {
  queuedOperationsCount,  // Number of queued operations
  isSyncing,              // Whether sync is in progress
  syncError,              // Last sync error
  syncQueuedOperations,   // Manually trigger sync
} = useTask();

// Manually trigger sync
await syncQueuedOperations();
```

## Troubleshooting

### Queue Not Syncing
- Check network connection
- Verify JWT token is valid
- Check browser console for errors
- Inspect IndexedDB for queued operations

### Operations Failing
- Check server logs for errors
- Verify API endpoints are accessible
- Check for validation errors
- Ensure task data is valid

### UI Not Updating
- Check if sync completed successfully
- Verify tasks are refetched after sync
- Check for React state update issues
- Inspect browser console for errors

### IndexedDB Issues
- Clear browser data and retry
- Check browser storage quota
- Verify IndexedDB is enabled
- Try different browser

