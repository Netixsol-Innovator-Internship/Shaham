'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { getSocket } from '@/lib/socket';

export default function SocketBridge() {
  const token = useSelector((s: RootState) => s.auth.token);

  useEffect(() => {
    const s = getSocket();
    // keep socket auth in sync with Redux token
    // @ts-ignore
    s.auth = { token: token || '' };
    if (s.connected) s.disconnect();
    s.connect();
  }, [token]);

  return null;
}
