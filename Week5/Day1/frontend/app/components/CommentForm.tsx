'use client';

import { useState } from 'react';

export default function CommentForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('');
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !username) return;

    // POST
    const res = await fetch('http://localhost:5000/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, authorId: username }),
    });

    if (res.ok) {
      const saved = await res.json(); // make backend return saved comment
      const event = new CustomEvent("local_comment", { detail: saved });
      window.dispatchEvent(event); // tell CommentList to update
      setText('');
    }
  }


  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        className="flex-1 rounded border px-3 py-2"
        placeholder={username ? 'Type a comment…' : 'Pick a username above first'}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!username}
      />
      <button
        type="submit"
        className="rounded-2xl px-4 py-2 bg-blue-600 text-white disabled:opacity-50"
        disabled={!username}
      >
        Post
      </button>
    </form>
  );
}
