
'use client';
import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { initSocketAuth } from '@/lib/socket';
import { useAppSelector } from '@/store/hooks';

function SocketAuthInit() {
  const token = useAppSelector(s => s.auth.token);
  useEffect(() => { initSocketAuth(); }, [token]);
  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <SocketAuthInit />
      {children}
    </Provider>
  );
}
