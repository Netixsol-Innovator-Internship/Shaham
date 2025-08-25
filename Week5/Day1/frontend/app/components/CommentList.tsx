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
      // setComments(data);
      setComments(data.sort((a: Comment, b: Comment) => 
        (b.createdAt ?? "").localeCompare(a.createdAt ?? "")
    ));
    }
    load();
  }, []);

  // real-time
  useEffect(() => {
    function handleLocal(e: any) {
      setComments(prev => [e.detail, ...prev]);
    }
    window.addEventListener("local_comment", handleLocal);
    return () => window.removeEventListener("local_comment", handleLocal);
  }, []);


  return (
    <div className="space-y-2">
      {comments.map((c) => {
        const mine = username && c.authorId === username;
        return (
          <div key={c._id} className="rounded-xl border p-3">
            <div className="text-xs text-gray-500 mb-1">
              {mine ? 'You' : c.authorId}
            </div>
            <div>{c.text}</div>
          </div>
        );
      })}
    </div>
  );
}
