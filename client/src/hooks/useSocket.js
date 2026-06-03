import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

let socket = null;

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    if (isAuthenticated && user && !initialized.current) {
      socket = io('/', { withCredentials: true, transports: ['websocket', 'polling'] });
      socket.emit('userOnline', user._id);
      initialized.current = true;
    }
    return () => {
      if (socket && !isAuthenticated) {
        socket.disconnect();
        socket = null;
        initialized.current = false;
      }
    };
  }, [isAuthenticated, user]);

  return socket;
};

export const getSocket = () => socket;
