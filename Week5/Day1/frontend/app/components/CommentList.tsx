'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Comment = {
  _id: string;
  text: string;
  authorId: string;
  createdAt?: string;
};

let socketRef: Socket | null = null;
function getSocket(): Socket {
  if (!socketRef) {
    socketRef = io('http://localhost:5000/comments', {
      transports: ['websocket'],
    });
  }
  return socketRef;
}

export default function CommentList() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const mounted = useRef(false);

  // load username
  useEffect(() => {
    setUsername(localStorage.getItem('username'));
  }, []);

  // initial load
  useEffect(() => {
    async function load() {
      const res = await fetch('http://localhost:5000/comments', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setComments(
        data.sort((a: Comment, b: Comment) =>
          (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
        )
      );
    }
    load();
  }, []);

  // real-time
  useEffect(() => {
    const s = getSocket();

    s.on('comment_updated', (updated: Comment) => {
      setComments((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
    });

    s.on('comment_deleted', ({ _id }) => {
      setComments((prev) => prev.filter((c) => c._id !== _id));
    });

    return () => {
      s.off('comment_updated');
      s.off('comment_deleted');
    };
  }, []);

  // delete handler
  async function handleDelete(id: string) {
    if (!username) return;
    await fetch(`http://localhost:5000/comments/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId: username }),
    });
    // no need to update state here — socket will handle it
  }

  // edit handler
  async function handleEdit(c: Comment) {
    if (!username) return;
    const newText = prompt('Edit your comment:', c.text);
    if (!newText || !newText.trim()) return;

    await fetch(`http://localhost:5000/comments/${c._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText, authorId: username }),
    });
    // socket will update state after backend emits
  }

  return (
    <div className="space-y-2">
      {comments.map((c) => {
        const mine = username && c.authorId === username;
        return (
          <div key={c._id} className="rounded-xl border p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  {mine ? 'You' : c.authorId}
                </div>
                <div>{c.text}</div>
              </div>
              {mine && (
                <div className="flex gap-2 ml-4 text-xs">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
