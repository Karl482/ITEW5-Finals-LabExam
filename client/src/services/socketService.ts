import { io, Socket } from 'socket.io-client';
import { Task } from './taskService';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private connectionStatusCallbacks: ((connected: boolean) => void)[] = [];
  private currentToken: string | null = null;

  /**
   * Initialize socket connection with JWT authentication
   */
  connect(token: string): void {
    // Validate token before connecting
    if (!token || token.trim() === '') {
      console.error('Cannot connect socket: Invalid token');
      this.notifyConnectionStatus(false);
      return;
    }

    // If already connected, just ensure it's active
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    // If socket exists but disconnected, try to reconnect
    if (this.socket && !this.socket.connected) {
      console.log('Reconnecting existing socket...');
      this.socket.connect();
      return;
    }

    console.log('Initializing socket connection...');

    // Store token for reconnection
    this.currentToken = token;

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 10000, // 10 second connection timeout
      transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
    });

    this.setupEventHandlers();
    this.setupNetworkHandlers();
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
      this.notifyConnectionStatus(false);
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached. Please check:');
        console.error('1. Server is running on', SOCKET_URL);
        console.error('2. Authentication token is valid');
        console.error('3. Network connection is stable');
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
   * Set up network online/offline handlers
   */
  private setupNetworkHandlers(): void {
    const handleOnline = () => {
      console.log('🌐 Network back online, reconnecting socket...');
      if (this.socket && !this.socket.connected) {
        this.reconnectAttempts = 0;
        this.socket.connect();
      }
    };

    const handleOffline = () => {
      console.log('🌐 Network offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
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
      this.currentToken = null;
      this.connectionStatusCallbacks = [];
      console.log('Socket disconnected manually');
    }
  }

  /**
   * Manually trigger reconnection
   */
  reconnect(): void {
    if (this.socket && !this.socket.connected) {
      console.log('Manually reconnecting socket...');
      this.reconnectAttempts = 0; // Reset attempts
      
      // Update auth token if available
      if (this.currentToken) {
        this.socket.auth = { token: this.currentToken };
      }
      
      this.socket.connect();
    }
  }

  /**
   * Reconnect with a new token (useful when token is refreshed)
   */
  reconnectWithToken(token: string): void {
    console.log('Reconnecting with new token...');
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect(token);
  }

  /**
   * Get current connection status details
   */
  getConnectionInfo(): { connected: boolean; attempts: number; socketId?: string } {
    return {
      connected: this.socket?.connected || false,
      attempts: this.reconnectAttempts,
      socketId: this.socket?.id,
    };
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
