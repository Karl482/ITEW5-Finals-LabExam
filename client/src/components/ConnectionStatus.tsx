import React from 'react';
import './ConnectionStatus.css';

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  if (isConnected) {
    return null; // Don't show anything when connected
  }

  return (
    <div className="connection-status offline">
      <div className="status-icon">⚠️</div>
      <div className="status-text">
        <strong>Connection Lost</strong>
        <span>Attempting to reconnect...</span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
