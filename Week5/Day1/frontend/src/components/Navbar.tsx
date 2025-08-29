
'use client';
import Link from 'next/link';
import NotificationBell from './NotificationBell';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setToken } from '@/store/authSlice';
import { api } from '@/store/api';
import { disconnectSocket } from '@/lib/socket';

export default function Navbar() {
  const token = useAppSelector((s) => s.auth.token);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Clear auth, clear RTK Query cache, and tear down socket
    dispatch(setToken(null));
    dispatch(api.util.resetApiState());
    disconnectSocket();
  };

  return (
    <header className="w-full bg-white border-b">
      <div className="container h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Realtime Comments</Link>

        <nav className="flex items-center gap-4">
          {/* Only show the bell + profile when logged in */}
          {token && <NotificationBell />}
          {token && (
            <Link href="/profile" className="text-sm px-3 py-1.5 rounded-lg border">
              Profile
            </Link>
          )}

          {!token ? (
            <div className="flex gap-2">
              <Link href="/auth/login" className="text-sm px-3 py-1.5 rounded-lg bg-gray-900 text-white">Login</Link>
              <Link href="/auth/register" className="text-sm px-3 py-1.5 rounded-lg border">Register</Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="text-sm px-3 py-1.5 rounded-lg border">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
