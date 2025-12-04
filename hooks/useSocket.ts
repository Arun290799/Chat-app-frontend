// hooks/useSocket.ts
'use client';

import { useContext, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { SocketContext } from '@/context/SocketProvider';

type EventHandler = (...args: any[]) => void;

export const useSocket = () => {
  const { socket, isConnected } = useContext(SocketContext);

  const on = useCallback(
    (event: string, handler: EventHandler) => {
      if (!socket) return () => {};

      socket.on(event, handler);
      return () => {
        socket.off(event, handler);
      };
    },
    [socket]
  );

  const emit = useCallback(
    (event: string, ...args: any[]) => {
      if (!socket) return;

      return new Promise((resolve) => {
        socket.emit(event, ...args, (response: any) => {
          resolve(response);
        });
      });
    },
    [socket]
  );

  return {
    socket,
    isConnected,
    on,
    emit,
  };
};