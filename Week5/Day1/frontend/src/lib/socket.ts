'use client'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

const url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

// ✅ Get existing socket or create new one
export function getSocket(): Socket {
  if (socket) return socket
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''
  socket = io(url, {
    transports: ['websocket', 'polling'],
    auth: { token },
    withCredentials: true,
  })
  return socket
}

// ✅ Initialize fresh socket with a given token
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
    withCredentials: true,
  })
  return socket
}

// ✅ Re-authenticate existing socket with latest token
export function initSocketAuth(token?: string) {
  if (!socket) {
    return initSocket(token || (typeof window !== 'undefined'
      ? localStorage.getItem('token') || ''
      : ''))
  }

  const authToken =
    token || (typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '')

  socket.auth = { token: authToken }
  socket.disconnect()
  socket.connect()

  return socket
}

// ✅ Disconnect and clear socket
export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
