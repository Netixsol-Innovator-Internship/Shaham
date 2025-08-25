'use client';

import UsernameGate from './components/UsernameGate';
import CommentForm from './components/CommentForm';
import CommentList from './components/CommentList';
import { useState } from 'react';

export default function Page() {
  const [readyName, setReadyName] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Realtime Comments</h1>
      <UsernameGate onReady={(u) => setReadyName(u)} />
      {readyName && (
        <>
          <CommentForm onSubmit={() => {}} />
          <CommentList />
        </>
      )}
    </main>
  );
}
