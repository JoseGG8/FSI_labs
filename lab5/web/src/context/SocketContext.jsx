'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/api';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastEvent, setLastEvent] = useState(null);
  const socketRef = useRef(null);

  const pushNotification = useCallback((item) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const entry = { id, ...item, receivedAt: new Date().toISOString() };
    setNotifications((prev) => [entry, ...prev].slice(0, 6));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 6500);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConnected(false);
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      secure: SOCKET_URL.startsWith('https://'),
      withCredentials: true,
      reconnectionAttempts: 10
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => setConnected(false));

    socket.on('order:created', (payload) => {
      setLastEvent({ event: 'order:created', payload, at: Date.now() });
      pushNotification({
        variant: 'info',
        title: payload.type === 'NEW_ORDER' ? 'Nuevo pedido recibido' : 'Pedido registrado',
        message: payload.message
      });
    });

    socket.on('order:paid', (payload) => {
      setLastEvent({ event: 'order:paid', payload, at: Date.now() });
      pushNotification({
        variant: 'success',
        title: payload.type === 'NEW_SALE' ? 'Nueva venta confirmada' : 'Pago verificado',
        message: payload.message
      });
    });

    socket.on('order:status_updated', (payload) => {
      setLastEvent({ event: 'order:status_updated', payload, at: Date.now() });
      pushNotification({
        variant: 'update',
        title: 'Estado de pedido actualizado',
        message: payload.message
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [isAuthenticated, token, pushNotification]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        notifications,
        lastEvent,
        dismissNotification
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket debe usarse dentro de SocketProvider');
  return ctx;
}
