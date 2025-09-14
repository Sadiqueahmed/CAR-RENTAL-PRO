import React from 'react';
import { useConnectionStatus } from '../../store/useCarRentalStore';

const ConnectionStatus = ({ className = '' }) => {
  const { isConnected, status, lastUpdate } = useConnectionStatus();

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: '🟢',
          text: 'Connected',
          description: 'Real-time updates active'
        };
      case 'connecting':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: '🟡',
          text: 'Connecting...',
          description: 'Establishing connection'
        };
      case 'disconnected':
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: '⚪',
          text: 'Disconnected',
          description: 'No real-time updates'
        };
      case 'error':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: '🔴',
          text: 'Connection Error',
          description: 'Failed to connect'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: '⚪',
          text: 'Unknown',
          description: 'Status unknown'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        <span className="animate-pulse">{config.icon}</span>
        <span>{config.text}</span>
      </div>
      
      {isConnected && (
        <div className="text-xs text-gray-500">
          Last: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;