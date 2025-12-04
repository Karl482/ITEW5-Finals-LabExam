import React, { useState, useEffect } from 'react';
import { socketService } from '../services/socketService';
import { useAuth } from '../context/AuthContext';
import './ConnectionStatus.css';

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  const { token } = useAuth();
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [showReconnectButton, setShowReconnectButton] = useState(false);

  useEffect(() => {
    // Show reconnect button after 5 seconds of being disconnected
    if (!isConnected) {
      const timer = setTimeout(() => {
        setShowReconnectButton(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowReconnectButton(false);
    }
  }, [isConnected]);

  useEffect(() => {
    // Update reconnect attempts
    if (!isConnected) {
      const info = socketService.getConnectionInfo();
      setReconnectAttempts(info.attempts);
    }
  }, [isConnected]);

  const handleManualReconnect = () => {
    if (token) {
      console.log('Manual reconnect triggered by user');
      socketService.reconnectWithToken(token);
      setShowReconnectButton(false);
    }
  };

  if (isConnected) {
    return null; // Don't show anything when connected
  }

  return (
    <div className="connection-status offline">
      <div className="status-icon">⚠️</div>
      <div className="status-text">
        <strong>Connection Lost</strong>
        <span>
          {reconnectAttempts > 0 
            ? `Attempting to reconnect... (${reconnectAttempts}/5)`
            : 'Attempting to reconnect...'}
        </span>
      </div>
      {showReconnectButton && (
        <button 
          className="reconnect-button"
          onClick={handleManualReconnect}
          title="Click to manually reconnect"
        >
          🔄 Reconnect
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;
