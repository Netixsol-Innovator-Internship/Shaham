
'use client';
import React from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { useGetNotificationsQuery } from '@/store/api';

export default function NotificationBell() {
  const token = useAppSelector((s) => s.auth.token);

  // If not logged in, hide the bell entirely
  if (!token) return null;

  const { data: list = [] } = useGetNotificationsQuery(undefined, {
    skip: !token,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  const unread = (list || []).filter((n: any) => !n.read).length;

  return (
    <Link
      href="/notifications"
      className="relative inline-flex items-center"
      aria-label="Notifications"
    >
      <span className="text-sm">🔔</span>
      {unread > 0 && (
        <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded-full">
          {unread}
        </span>
      )}
    </Link>
  );
}
