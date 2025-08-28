'use client'
import { useEffect, useMemo, useState } from 'react'
import { useGetCommentsQuery, useCreateCommentMutation } from '@/store/api'
import { getSocket } from '@/lib/socket'
import CommentItem from '@/components/CommentItem'
import { useAppSelector } from '@/store/hooks'
import RichTextEditor from '@/components/RichTextEditor'

function nest(comments: any[]) {
  const byId: Record<string, any> = {};
  const roots: any[] = [];

  comments.forEach(c => { byId[c._id] = { ...c, children: [] }; });

  comments.forEach(c => {
    const parentId =
      typeof c.parentComment === 'object'
        ? c.parentComment?._id
        : c.parentComment;

    if (parentId) {
      const parent = byId[parentId];
      if (parent) {
        parent.children.push(byId[c._id]);
        return;
      }
    }
    roots.push(byId[c._id]);
  });

  const byDateDesc = (a: any, b: any) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  roots.sort(byDateDesc);
  roots.forEach(r => r.children?.sort(byDateDesc));

  return roots;
}

export default function Page() {
  const { data: comments = [], refetch } = useGetCommentsQuery()
  const [createComment] = useCreateCommentMutation()
  const [content, setContent] = useState('')
  const [resetCounter, setResetCounter] = useState(0)
  const token = useAppSelector(s => s.auth.token)
  const tree = useMemo(()=>nest(comments), [comments])

  useEffect(() => {
    const s = getSocket()
    const onAny = () => refetch()

    s.on('comments:new', onAny)
    s.on('comments:likes', onAny)
    s.on('comments:deleted', onAny)

    s.on('comment:new', onAny)
    s.on('comment:like', onAny)
    s.on('comment:deleted', onAny)

    return () => { 
      s.off('comments:new', onAny); 
      s.off('comments:likes', onAny); 
      s.off('comments:deleted', onAny); 

      s.off('comment:new', onAny);
      s.off('comment:like', onAny);
      s.off('comment:deleted', onAny);
    }
  }, [refetch])

  return (
    <main className="container py-6 space-y-4">
      <div className="card p-4">
        <h2 className="font-semibold">Add Comment</h2>
        <div className="mt-2 space-y-2">
          <RichTextEditor onChange={setContent} resetSignal={resetCounter} />
          <button
            className="btn btn-primary"
            disabled={!token || !content.trim()}
            onClick={async () => {
              await createComment({ content }).unwrap()
              setContent('')
              setResetCounter(c => c + 1) // trigger editor reset
            }}
          >
            Post
          </button>
        </div>
        {!token && <p className="text-xs text-gray-500 mt-1">Login to post, like or reply.</p>}
      </div>

      <div className="space-y-3">
        {tree.map((c: any) => (
          <CommentItem key={c._id} c={c} />
        ))}
      </div>
    </main>
  )
}
