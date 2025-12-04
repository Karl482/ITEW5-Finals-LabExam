/**
 * Sync Queue Service
 * 
 * Manages offline operation queueing using IndexedDB.
 * Queues task operations (create, update, delete) when offline
 * and syncs them with the backend when connection is restored.
 */

export type OperationType = 'create' | 'update' | 'delete';

export interface QueuedOperation {
  id: string; // Unique ID for the queued operation
  type: OperationType;
  taskId?: string; // For update/delete operations
  taskData?: any; // For create/update operations
  timestamp: number;
  retryCount: number;
  error?: string;
}

const DB_NAME = 'sports_pwa_sync_queue';
const DB_VERSION = 1;
const STORE_NAME = 'operations';

class SyncQueueService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize IndexedDB
   */
  private async init(): Promise<void> {
    if (this.db) return;
    
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('type', 'type', { unique: false });
          console.log('Created IndexedDB object store');
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Ensure DB is initialized before operations
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Failed to initialize IndexedDB');
    }
    return this.db;
  }

  /**
   * Add an operation to the queue
   */
  async addOperation(operation: Omit<QueuedOperation, 'id' | 'timestamp' | 'retryCount'>): Promise<string> {
    const db = await this.ensureDB();
    
    const queuedOp: QueuedOperation = {
      ...operation,
      id: `${operation.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(queuedOp);

      request.onsuccess = () => {
        console.log('Operation added to queue:', queuedOp);
        resolve(queuedOp.id);
      };

      request.onerror = () => {
        console.error('Failed to add operation to queue:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get all queued operations
   */
  async getAllOperations(): Promise<QueuedOperation[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const operations = request.result as QueuedOperation[];
        // Sort by timestamp (oldest first)
        operations.sort((a, b) => a.timestamp - b.timestamp);
        resolve(operations);
      };

      request.onerror = () => {
        console.error('Failed to get operations from queue:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get count of queued operations
   */
  async getQueueCount(): Promise<number> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Failed to count operations:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Remove an operation from the queue
   */
  async removeOperation(id: string): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log('Operation removed from queue:', id);
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to remove operation from queue:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Update an operation's retry count and error
   */
  async updateOperation(id: string, updates: Partial<QueuedOperation>): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const operation = getRequest.result as QueuedOperation;
        if (!operation) {
          reject(new Error('Operation not found'));
          return;
        }

        const updatedOperation = { ...operation, ...updates };
        const putRequest = store.put(updatedOperation);

        putRequest.onsuccess = () => {
          console.log('Operation updated in queue:', id);
          resolve();
        };

        putRequest.onerror = () => {
          console.error('Failed to update operation:', putRequest.error);
          reject(putRequest.error);
        };
      };

      getRequest.onerror = () => {
        console.error('Failed to get operation for update:', getRequest.error);
        reject(getRequest.error);
      };
    });
  }

  /**
   * Clear all operations from the queue
   */
  async clearQueue(): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('Queue cleared');
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to clear queue:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Check if there are any queued operations
   */
  async hasQueuedOperations(): Promise<boolean> {
    const count = await this.getQueueCount();
    return count > 0;
  }
}

// Export singleton instance
export const syncQueueService = new SyncQueueService();
