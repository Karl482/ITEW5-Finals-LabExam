/**
 * Manual Test Script for Sync Queue Service
 * 
 * This script demonstrates and tests the sync queue functionality.
 * Run this in the browser console to test IndexedDB operations.
 */

import { syncQueueService } from './services/syncQueueService';

export async function testSyncQueue() {
  console.log('=== Testing Sync Queue Service ===\n');

  try {
    // Test 1: Add operations to queue
    console.log('Test 1: Adding operations to queue...');
    
    const createOpId = await syncQueueService.addOperation({
      type: 'create',
      taskData: {
        title: 'Test Task',
        description: 'This is a test task',
        status: 'todo',
        priority: 'high',
      },
    });
    console.log('✓ Create operation added:', createOpId);

    const updateOpId = await syncQueueService.addOperation({
      type: 'update',
      taskId: 'task123',
      taskData: {
        title: 'Updated Task',
        status: 'in-progress',
      },
    });
    console.log('✓ Update operation added:', updateOpId);

    const deleteOpId = await syncQueueService.addOperation({
      type: 'delete',
      taskId: 'task456',
    });
    console.log('✓ Delete operation added:', deleteOpId);

    // Test 2: Get queue count
    console.log('\nTest 2: Getting queue count...');
    const count = await syncQueueService.getQueueCount();
    console.log('✓ Queue count:', count);

    // Test 3: Get all operations
    console.log('\nTest 3: Getting all operations...');
    const operations = await syncQueueService.getAllOperations();
    console.log('✓ Operations:', operations);

    // Test 4: Update operation
    console.log('\nTest 4: Updating operation...');
    await syncQueueService.updateOperation(createOpId, {
      retryCount: 1,
      error: 'Test error',
    });
    console.log('✓ Operation updated');

    // Test 5: Check if has queued operations
    console.log('\nTest 5: Checking if has queued operations...');
    const hasOps = await syncQueueService.hasQueuedOperations();
    console.log('✓ Has queued operations:', hasOps);

    // Test 6: Remove operation
    console.log('\nTest 6: Removing operation...');
    await syncQueueService.removeOperation(deleteOpId);
    console.log('✓ Operation removed');

    const newCount = await syncQueueService.getQueueCount();
    console.log('✓ New queue count:', newCount);

    // Test 7: Clear queue
    console.log('\nTest 7: Clearing queue...');
    await syncQueueService.clearQueue();
    console.log('✓ Queue cleared');

    const finalCount = await syncQueueService.getQueueCount();
    console.log('✓ Final queue count:', finalCount);

    console.log('\n=== All tests passed! ===');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Instructions for running in browser console:
console.log(`
To test the sync queue service:
1. Import this module in your app
2. Run: testSyncQueue()
3. Check the console output
4. Inspect IndexedDB in DevTools > Application > IndexedDB > sports_pwa_sync_queue
`);
