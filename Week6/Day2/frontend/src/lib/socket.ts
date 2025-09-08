import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export function getSocket(auth?: { userId?: string | null; admin?: boolean }) {

    const socketUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

    const url = socketUrl.replace(/\/$/, '');

    if (!socketInstance) {
        socketInstance = io(url, {
            autoConnect: false,
            transports: ['websocket'],
            path: '/socket.io', // ensures it matches NestJS default
        });
    }

    if (auth) {
        socketInstance.auth = { userId: auth.userId, admin: !!auth.admin } as any;
    }

    return socketInstance;
}

export function connectSocket(auth?: { userId?: string | null; admin?: boolean }) {
    const socket = getSocket(auth);
    if (!socket.connected) {
        socket.connect();
    }
    return socket;
}

export function disconnectSocket() {
    if (socketInstance?.connected) {
        socketInstance.disconnect();
    }
}
