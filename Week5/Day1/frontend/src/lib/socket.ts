'use client'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

const url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

export function getSocket(): Socket {
  if (socket) return socket
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''
  socket = io(url, {
    transports: ['websocket', 'polling'],
    auth: { token },
  })
  return socket
}

export function initSocket(token: string) {
  if (socket) {
    try {
      socket.disconnect()
    } catch {}
    socket = null
  }
  socket = io(url, {
    transports: ['websocket', 'polling'],
    auth: { token },
  })
  return socket
}

export function initSocketAuth() {
  if (!socket) return
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''
  socket.auth = { token }
  socket.disconnect().connect()
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
