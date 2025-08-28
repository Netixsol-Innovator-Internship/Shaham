
'use client';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;
  const url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  socket = io(url, { transports: ['websocket', 'polling'], auth: { token } });
  return socket;
}

export function initSocketAuth() {
  if (!socket) return;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  socket.auth = { token };
  socket.disconnect().connect();
}

export function disconnectSocket() {
  if (socket) { socket.disconnect(); socket = null; }
}
