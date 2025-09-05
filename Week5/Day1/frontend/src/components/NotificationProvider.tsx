'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useGetNotificationsQuery } from '@/store/api';
import { getSocket } from '@/lib/socket';
import NotificationToast from './NotificationToast';

export default function NotificationProvider() {
  const token = useAppSelector((s) => s.auth.token);

  // initial list fetch; no cache, and refetch aggressively
  useGetNotificationsQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const [queue, setQueue] = useState<any[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (!token) return;

    const socket = getSocket();

    const handleNew = (n: any) => {
      setQueue((q) => [n, ...q]);
      // auto close after 5s
      const id = String(n._id);
      timers.current[id] = setTimeout(() => {
        setQueue((q) => q.filter((x) => String(x._id) !== id));
      }, 5000);
    };

    socket.on('notification:new', handleNew);

    return () => {
      socket.off('notification:new', handleNew);
      Object.values(timers.current).forEach(clearTimeout);
      timers.current = {};
    };
  }, [token]);

  const handleClose = (id: string) => {
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
    setQueue((q) => q.filter((x) => String(x._id) !== id));
  };

  if (!token) return null;

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {queue.map((n) => (
        <NotificationToast
          key={String(n._id)}
          notification={n}
          onClose={() => handleClose(String(n._id))}
        />
      ))}
    </div>
  );
}
