'use client';

import { useEffect, useState } from 'react';

type Props = {
  onReady?: (username: string) => void;
};

export default function UsernameGate({ onReady }: Props) {
  const [saved, setSaved] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('username');
    if (s) {
      setSaved(s);
      if (onReady) onReady(s);
    }
  }, [onReady]);

  const save = () => {
    const v = draft.trim();
    if (!v) return;
    localStorage.setItem('username', v);
    setSaved(v);
    setEditing(false);
    if (onReady) onReady(v);
  };

  const startEdit = () => {
    setDraft(saved || '');
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft('');
    setEditing(false);
  };

  if (saved && !editing) {
    return (
      <div className="mb-4 rounded-2xl border p-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Signed in as <span className="font-semibold">{saved}</span>
        </p>
        <button
          onClick={startEdit}
          className="ml-4 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Change username
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-2xl border p-4">
      <label className="block mb-2 text-sm font-medium">
        {saved ? 'Change your username' : 'Choose a username'}
      </label>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="e.g. meow"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button
          onClick={save}
          className="rounded-2xl px-4 py-2 bg-black text-white disabled:opacity-50"
          disabled={!draft.trim()}
        >
          Save
        </button>
        {saved && (
          <button
            onClick={cancelEdit}
            className="rounded-2xl px-4 py-2 border text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
