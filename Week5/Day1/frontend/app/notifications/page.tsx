
'use client';
import { useEffect } from 'react';
import { useGetNotificationsQuery, useMarkAllReadMutation } from '@/store/api';
import { useAppSelector } from '@/store/hooks';

export default function NotificationsPage() {
  const token = useAppSelector((s) => s.auth.token);
  const {
    data: list = [],
    refetch,
  } = useGetNotificationsQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const [markAllRead, { isLoading }] = useMarkAllReadMutation();

  // IMPORTANT: Do NOT mark read automatically on mount
  useEffect(() => {}, []);

  if (!token) {
    return (
      <main className="container py-8">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-gray-500 mt-2">Login required</p>
      </main>
    );
  }

  return (
    <main className="container py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <button
          className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-60"
          disabled={isLoading}
          onClick={async () => {
            try {
              await markAllRead().unwrap();
              await refetch();
            } catch (err) {
              console.error('Failed to mark all as read', err);
            }
          }}
        >
          {isLoading ? 'Marking…' : 'Mark all read'}
        </button>
      </div>

      <div className="divide-y border rounded-xl overflow-hidden">
        {list.length === 0 && (
          <div className="p-6 text-sm text-gray-500">No notifications.</div>
        )}
        {list.map((n: any) => (
          <div key={String(n._id)} className="flex items-start justify-between p-4">
            <div>
              <div className="font-medium text-sm">
                {n.actor?.username || n.from?.username || 'Someone'}
              </div>
              <div className="text-sm text-gray-700">{n.message || n.type}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </div>
              {!n.read ? (
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800">
                  Unread
                </span>
              ) : (
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                  Read
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
