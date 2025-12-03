import { io, Socket } from 'socket.io-client';
import { Task } from './taskService';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private connectionStatusCallbacks: ((connected: boolean) => void)[] = [];

  /**
   * Initialize socket connection with JWT authentication
   */
  connect(token: string): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventHandlers();
  }

  /**
   * Set up socket event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
      this.notifyConnectionStatus(true);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.notifyConnectionStatus(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}/${this.maxReconnectAttempts}`);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  /**
   * Subscribe to task events
   */
  onTaskCreated(callback: (data: { task: Task }) => void): void {
    this.socket?.on('task:created', callback);
  }

  onTaskUpdated(callback: (data: { task: Task }) => void): void {
    this.socket?.on('task:updated', callback);
  }

  onTaskDeleted(callback: (data: { taskId: string }) => void): void {
    this.socket?.on('task:deleted', callback);
  }

  /**
   * Unsubscribe from task events
   */
  offTaskCreated(callback: (data: { task: Task }) => void): void {
    this.socket?.off('task:created', callback);
  }

  offTaskUpdated(callback: (data: { task: Task }) => void): void {
    this.socket?.off('task:updated', callback);
  }

  offTaskDeleted(callback: (data: { taskId: string }) => void): void {
    this.socket?.off('task:deleted', callback);
  }

  /**
   * Register callback for connection status changes
   */
  onConnectionStatusChange(callback: (connected: boolean) => void): void {
    this.connectionStatusCallbacks.push(callback);
    // Immediately notify with current status
    if (this.socket) {
      callback(this.socket.connected);
    }
  }

  /**
   * Unregister connection status callback
   */
  offConnectionStatusChange(callback: (connected: boolean) => void): void {
    this.connectionStatusCallbacks = this.connectionStatusCallbacks.filter(
      (cb) => cb !== callback
    );
  }

  /**
   * Notify all registered callbacks of connection status change
   */
  private notifyConnectionStatus(connected: boolean): void {
    this.connectionStatusCallbacks.forEach((callback) => callback(connected));
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatusCallbacks = [];
      console.log('Socket disconnected manually');
    }
  }

  /**
   * Manually trigger reconnection
   */
  reconnect(): void {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
