# Socket.io Client Implementation

## Overview

This document describes the Socket.io client implementation for real-time task updates in the Sports PWA Task Manager.

## Architecture

### Components

1. **socketService.ts** - Singleton service managing Socket.io connection
2. **TaskContext.tsx** - React context integrating socket events with task state
3. **ConnectionStatus.tsx** - UI component displaying connection status
4. **App.tsx** - Root component displaying connection indicator

## Features Implemented

### ✅ Socket Connection with JWT Authentication

The socket service connects to the server using JWT token from localStorage:

```typescript
socketService.connect(token);
```

Connection is established with authentication in the handshake:

```typescript
io(SOCKET_URL, {
  auth: { token },
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});
```

### ✅ Real-time Task Events

The client subscribes to three task events:

1. **task:created** - Emitted when a new task is created
2. **task:updated** - Emitted when a task is modified
3. **task:deleted** - Emitted when a task is removed

Event handlers automatically update the task list in real-time:

```typescript
socketService.onTaskCreated((data) => {
  // Add new task to state
});

socketService.onTaskUpdated((data) => {
  // Update existing task in state
});

socketService.onTaskDeleted((data) => {
  // Remove task from state
});
```

### ✅ Automatic Reconnection

The socket automatically attempts to reconnect when connection is lost:

- Maximum 5 reconnection attempts
- Exponential backoff (1s to 5s delay)
- Connection status tracked and displayed to user

### ✅ Connection Status Indicator

Two UI components show connection status:

1. **ConnectionStatus Banner** - Appears at top when disconnected
2. **Live Badge** - Shows "🔴 Live" on dashboard when connected

### ✅ State Management Integration

Socket events are integrated with TaskContext:

- Events update task state automatically
- Duplicate prevention for task:created events
- Seamless integration with existing CRUD operations

## Usage

### Connecting Socket

Socket connects automatically when user authenticates:

```typescript
useEffect(() => {
  if (isAuthenticated && token) {
    socketService.connect(token);
    // Subscribe to events...
  }
}, [isAuthenticated, token]);
```

### Subscribing to Events

```typescript
socketService.onTaskCreated(handleTaskCreated);
socketService.onTaskUpdated(handleTaskUpdated);
socketService.onTaskDeleted(handleTaskDeleted);
```

### Monitoring Connection Status

```typescript
socketService.onConnectionStatusChange((connected) => {
  console.log('Socket connected:', connected);
});
```

### Cleanup

Always unsubscribe and disconnect on unmount:

```typescript
return () => {
  socketService.offTaskCreated(handleTaskCreated);
  socketService.offTaskUpdated(handleTaskUpdated);
  socketService.offTaskDeleted(handleTaskDeleted);
  socketService.disconnect();
};
```

## Event Data Formats

### task:created

```json
{
  "task": {
    "id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "title": "Complete sprint training",
    "description": "5x100m sprints",
    "status": "todo",
    "priority": "high",
    "createdAt": "2025-12-04T10:00:00Z",
    "updatedAt": "2025-12-04T10:00:00Z"
  }
}
```

### task:updated

```json
{
  "task": {
    "id": "507f1f77bcf86cd799439012",
    "status": "completed",
    // ... other updated fields
  }
}
```

### task:deleted

```json
{
  "taskId": "507f1f77bcf86cd799439012"
}
```

## Error Handling

### Connection Errors

- Logged to console
- Connection status updated
- Automatic reconnection attempted

### Authentication Errors

- Socket disconnects if token is invalid
- User redirected to login by API interceptor

### Event Errors

- Logged to console
- State remains consistent
- No UI disruption

## Testing

To test real-time updates:

1. Open application in two browser windows
2. Login with same account in both
3. Create/update/delete task in one window
4. Observe real-time update in other window

## Performance Considerations

- Single socket connection per user session
- Event handlers use useCallback to prevent re-subscriptions
- Duplicate task prevention in task:created handler
- Efficient state updates using functional setState

## Security

- JWT token required for socket authentication
- Server validates token on connection
- User can only receive events for their own tasks
- Token stored securely in localStorage

## Browser Compatibility

Socket.io client supports:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Socket not connecting

1. Check if backend server is running
2. Verify VITE_API_URL in .env
3. Check browser console for errors
4. Verify JWT token is valid

### Events not received

1. Check socket connection status
2. Verify event names match server
3. Check browser console for errors
4. Ensure user is authenticated

### Connection keeps dropping

1. Check network stability
2. Verify server is running
3. Check server logs for errors
4. Increase reconnection attempts if needed

## Future Enhancements

- [ ] Add typing indicators
- [ ] Add presence detection (online users)
- [ ] Add task collaboration features
- [ ] Add notification sounds for events
- [ ] Add offline event queueing
