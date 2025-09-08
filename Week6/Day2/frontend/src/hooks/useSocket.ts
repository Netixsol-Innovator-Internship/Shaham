import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { addNotification, updateLoyaltyPoints } from '@/lib/store';
import type { SocketEvents } from '@/types';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const dispatch = useDispatch();
    const { token, user } = useSelector((state: RootState) => state.auth);

    const connect = useCallback(() => {
        if (!token || socketRef.current?.connected) return;

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL as string;

        socketRef.current = io(socketUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });

        // Connection events
        socketRef.current.on('connect', () => {
            console.log('Socket connected');
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        // Notification events
        socketRef.current.on('notifications:new', (notification: any) => {
            dispatch(addNotification(notification));
        });

        socketRef.current.on('sale:started', (notification: any) => {
            dispatch(addNotification(notification));
        });

        socketRef.current.on('product:sold_out', (data: any) => {
            if (data.userId === user?.id) {
                dispatch(addNotification({
                    _id: Date.now().toString(),
                    userId: data.userId,
                    type: 'product_sold_out',
                    title: 'Product Sold Out',
                    body: `${data.productName} in your cart is now sold out.`,
                    read: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }));
            }
        });

        socketRef.current.on('loyalty:points_updated', (data: any) => {
            if (data.userId === user?.id) {
                dispatch(updateLoyaltyPoints(data.points));
                dispatch(addNotification({
                    _id: Date.now().toString(),
                    userId: data.userId,
                    type: `loyalty_points_${data.type}`,
                    title: data.type === 'earned' ? 'Loyalty Points Earned!' : 'Loyalty Points Spent',
                    body: data.type === 'earned'
                        ? `You earned ${data.points} loyalty points from your purchase!`
                        : `You spent ${data.points} loyalty points on your purchase.`,
                    read: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }));
            }
        });

        // Join user-specific room
        if (user?.id) {
            socketRef.current.emit('join', { userId: user.id });
        }

    }, [token, user?.id, dispatch]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    }, []);

    const emit = useCallback((event: string, data: any) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit(event, data);
        }
    }, []);

    // Connect on mount and when token changes
    useEffect(() => {
        if (token) {
            connect();
        } else {
            disconnect();
        }

        return () => {
            disconnect();
        };
    }, [token, connect, disconnect]);

    // Reconnect when user changes
    useEffect(() => {
        if (user?.id && socketRef.current?.connected) {
            socketRef.current.emit('join', { userId: user.id });
        }
    }, [user?.id]);

    return {
        socket: socketRef.current,
        connected: socketRef.current?.connected || false,
        emit,
        connect,
        disconnect,
    };
};
