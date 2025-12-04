# Testing Offline Sync Functionality

## Quick Start Guide

This guide will help you test the offline operation queueing and synchronization feature implemented in Task 22.

---

## Prerequisites

1. **Start the Application**
   ```bash
   # From project root
   composer run dev
   ```

2. **Open Browser**
   - Navigate to `http://localhost:5173`
   - Open DevTools (F12)

3. **Login**
   - Create an account or login with existing credentials
   - Navigate to Dashboard

---

## Test Scenarios

### Test 1: Create Task Offline

**Steps**:
1. Open DevTools → Network tab
2. Check the "Offline" checkbox
3. Click "Create Task" button
4. Fill in task details:
   - Title: "Offline Test Task"
   - Description: "Testing offline creation"
   - Priority: High
5. Click "Create"

**Expected Results**:
- ✅ Task appears immediately in the list
- ✅ Task has a temporary ID (starts with `temp_`)
- ✅ Purple badge appears: "1 operation queued for sync"
- ✅ Yellow "Offline Mode" indicator visible at bottom-right
- ✅ Debug panel shows: Queued Operations: 1

**Verify**:
6. Uncheck "Offline" in DevTools
7. Wait 2-3 seconds

**Expected Results**:
- ✅ Blue badge appears: "Syncing 1 operation..."
- ✅ Badge disappears after sync
- ✅ Task ID changes from temporary to real ID
- ✅ Task persists after page refresh

---

### Test 2: Update Task Offline

**Steps**:
1. Ensure you have at least one task in the list
2. Go offline (DevTools → Network → Offline)
3. Click on a task to open details
4. Change the status to "In Progress"
5. Change the priority to "High"
6. Click "Save"

**Expected Results**:
- ✅ Changes appear immediately
- ✅ Queue count increases by 1
- ✅ Purple badge shows updated count
- ✅ Task card reflects new status/priority

**Verify**:
7. Go back online
8. Wait for sync

**Expected Results**:
- ✅ Sync completes successfully
- ✅ Changes persist after refresh
- ✅ Queue count returns to 0

---

### Test 3: Delete Task Offline

**Steps**:
1. Go offline
2. Click on a task to open details
3. Click "Delete Task" button
4. Confirm deletion

**Expected Results**:
- ✅ Task removed from list immediately
- ✅ Queue count increases
- ✅ Purple badge visible

**Verify**:
5. Go back online
6. Wait for sync

**Expected Results**:
- ✅ Sync completes
- ✅ Task remains deleted after refresh
- ✅ Task not visible in list

---

### Test 4: Multiple Operations Offline

**Steps**:
1. Go offline
2. Create 2 new tasks
3. Update 1 existing task
4. Delete 1 existing task

**Expected Results**:
- ✅ All changes visible immediately
- ✅ Queue count shows 4 operations
- ✅ Purple badge: "4 operations queued for sync"
- ✅ Debug panel shows correct count

**Verify**:
5. Go back online
6. Watch the sync process

**Expected Results**:
- ✅ Blue badge: "Syncing 4 operations..."
- ✅ Operations process sequentially
- ✅ All changes persist after sync
- ✅ Queue count returns to 0
- ✅ Page refresh shows all changes

---

### Test 5: Sync with Network Error

**Steps**:
1. Stop the backend server
   ```bash
   # In server terminal, press Ctrl+C
   ```
2. Go offline in browser
3. Create a task
4. Go back online in browser
5. Wait for sync attempt

**Expected Results**:
- ✅ Sync attempts but fails
- ✅ Red badge appears with error message
- ✅ Operation retries (up to 3 times)
- ✅ After 3 failures, operation removed from queue

**Verify**:
6. Restart backend server
7. Refresh page
8. Check if task was created

**Expected Results**:
- ✅ Task not created (operation failed)
- ✅ Queue is empty

---

### Test 6: Optimistic UI Updates

**Steps**:
1. Go offline
2. Create a task with title "Optimistic Test"
3. Note the temporary ID
4. Update the same task's status
5. Go back online
6. Watch the sync

**Expected Results**:
- ✅ Task visible with temp ID while offline
- ✅ Both operations queued (create + update)
- ✅ After sync, task has real ID
- ✅ Final state matches both operations
- ✅ No duplicate tasks created

---

### Test 7: Page Refresh with Queued Operations

**Steps**:
1. Go offline
2. Create 2 tasks
3. Update 1 task
4. **Refresh the page** (F5)

**Expected Results**:
- ✅ Queue count persists (shows 3)
- ✅ Purple badge still visible
- ✅ Optimistic tasks visible in list
- ✅ Operations still in IndexedDB

**Verify**:
5. Go back online
6. Wait for sync

**Expected Results**:
- ✅ All operations sync successfully
- ✅ No data loss
- ✅ Final state correct

---

### Test 8: Manual Sync (Debug Panel)

**Steps**:
1. Ensure Debug Panel is visible (top-right, green border)
2. Go offline
3. Create a task
4. Go back online
5. Click "Manual Sync" button in Debug Panel

**Expected Results**:
- ✅ Sync triggers immediately
- ✅ Button shows "Syncing..."
- ✅ Operation processes
- ✅ Queue count updates

---

## Verification Checklist

After testing, verify the following:

### UI Components
- [ ] OfflineSyncIndicator appears when operations queued
- [ ] Indicator shows correct count
- [ ] Spinning animation during sync
- [ ] Error state displays correctly
- [ ] Indicator disappears when queue empty

### Data Persistence
- [ ] Operations persist across page refreshes
- [ ] IndexedDB contains queued operations
- [ ] Operations removed after successful sync
- [ ] Cache updated after operations

### Synchronization
- [ ] Auto-sync triggers on reconnection
- [ ] Operations process in order
- [ ] Retry logic works (3 attempts)
- [ ] Failed operations removed after max retries
- [ ] UI updates after sync

### Error Handling
- [ ] Network errors handled gracefully
- [ ] Server errors handled gracefully
- [ ] User notified of failures
- [ ] App remains functional after errors

---

## Inspecting IndexedDB

### Chrome DevTools
1. Open DevTools (F12)
2. Go to "Application" tab
3. Expand "IndexedDB" in left sidebar
4. Find "sports_pwa_sync_queue"
5. Click on "operations" object store
6. View queued operations

**What to Look For**:
- Operation ID
- Type (create/update/delete)
- Task data
- Timestamp
- Retry count

### Firefox DevTools
1. Open DevTools (F12)
2. Go to "Storage" tab
3. Expand "Indexed DB"
4. Find "sports_pwa_sync_queue"
5. View operations

---

## Console Logging

The app logs sync operations to the console. Look for:

```
Network connection restored
Syncing queued operations after reconnection...
Processing queued operation: {id: "...", type: "create", ...}
Successfully processed operation: create_1234567890_abc123
Sync complete: 3 succeeded, 0 failed
```

---

## Common Issues

### Issue: Queue count not updating
**Solution**: Check console for errors, verify IndexedDB is accessible

### Issue: Sync not triggering
**Solution**: Verify online event fires, check network tab

### Issue: Operations failing
**Solution**: Check backend is running, verify JWT token is valid

### Issue: Duplicate tasks
**Solution**: Clear IndexedDB and localStorage, refresh page

### Issue: Debug panel not visible
**Solution**: Ensure running in development mode (`npm run dev`)

---

## Performance Testing

### Large Queue Test
1. Go offline
2. Create 50 tasks (use a script or manually)
3. Go back online
4. Measure sync time

**Expected**:
- All operations sync successfully
- Sync completes in reasonable time (<30 seconds)
- UI remains responsive

### Rapid Operations Test
1. Go offline
2. Rapidly create/update/delete tasks
3. Go back online
4. Verify all operations sync

**Expected**:
- No operations lost
- No race conditions
- Final state consistent

---

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

Verify:
- IndexedDB works
- Online/offline events fire
- Sync completes successfully

---

## Cleanup

After testing, clean up test data:

1. **Clear IndexedDB**:
   - DevTools → Application → IndexedDB
   - Right-click "sports_pwa_sync_queue"
   - Select "Delete database"

2. **Clear localStorage**:
   - DevTools → Application → Local Storage
   - Right-click origin
   - Select "Clear"

3. **Delete test tasks**:
   - Delete tasks from UI
   - Or clear database on backend

---

## Automated Testing (Future)

For automated testing, consider:

1. **Unit Tests**:
   - Test syncQueueService methods
   - Test queue operations
   - Test retry logic

2. **Integration Tests**:
   - Test TaskContext integration
   - Test sync flow
   - Test error handling

3. **E2E Tests**:
   - Test complete offline workflow
   - Test multiple operations
   - Test sync after reconnection

---

## Success Criteria

The implementation is successful if:

✅ All test scenarios pass
✅ No data loss occurs
✅ Sync completes reliably
✅ UI provides clear feedback
✅ Errors handled gracefully
✅ Performance is acceptable
✅ Works across browsers

---

## Support

For issues or questions:
- Check `OFFLINE_SYNC_QUEUE.md` for detailed documentation
- Review console logs for errors
- Inspect IndexedDB for queue state
- Check network tab for API calls

