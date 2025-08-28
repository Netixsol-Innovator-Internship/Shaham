'use client';
import { useEffect, useRef, useState } from 'react';
import { useGetNotificationsQuery } from '@/store/api';
import NotificationToast from './NotificationToast';
import { useAppSelector } from '@/store/hooks';

export default function NotificationProvider() {
  const token = useAppSelector((s) => s.auth.token);
  const { data: list = [] } = useGetNotificationsQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const [queue, setQueue] = useState<any[]>([]);
  const seenIds = useRef<Set<string>>(new Set());

  // Clear UI state on logout
  useEffect(() => {
    if (!token) {
      setQueue([]);
      seenIds.current.clear();
    }
  }, [token]);

  // Add any unread notifications we haven't shown yet
  useEffect(() => {
    if (!Array.isArray(list) || list.length === 0) return;
    const unread = list.filter((n: any) => !n?.read);
    const toAdd: any[] = [];
    for (const n of unread) {
      const id = String(n?._id ?? n?.id ?? '');
      if (id && !seenIds.current.has(id)) {
        seenIds.current.add(id);
        toAdd.push(n);
      }
    }
    if (toAdd.length) setQueue((q) => [...toAdd, ...q]);
  }, [list]);

  const handleClose = (id: string) => {
    setQueue((q) => q.filter((n) => String(n._id) !== String(id)));
  };

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
