'use client'
import Link from 'next/link'
import {
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useDeleteCommentMutation,
  useCreateCommentMutation,
  useGetCommentsQuery,
  useGetMeQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from '@/store/api'
import { useEffect, useState } from 'react'

function useClientTimeFormat(dateISO: string) {
  const [text, setText] = useState<string>(() => new Date(dateISO).toISOString())
  useEffect(() => {
    try {
      setText(new Date(dateISO).toLocaleString())
    } catch {
      setText(new Date(dateISO).toISOString())
    }
  }, [dateISO])
  return text
}

export default function CommentItem({ c }: { c: any }) {
  const [like] = useLikeCommentMutation()
  const [unlike] = useUnlikeCommentMutation()
  const [del] = useDeleteCommentMutation()
  const [create] = useCreateCommentMutation()
  const [followUser] = useFollowUserMutation()
  const [unfollowUser] = useUnfollowUserMutation()

  const [replyBody, setReplyBody] = useState('')

  const { data: replies = [] } = useGetCommentsQuery({ parent: c._id })

  const { data: me } = useGetMeQuery()

  // Author
  let authorName = 'Unknown';
  let authorId: string | undefined;

  if (typeof c.author === 'object' && c.author !== null) {
    authorId = c.author._id;
    authorName = c.author.username || c.author.name || 'Unknown';
  } else if (typeof c.author === 'string') {
    authorId = c.author;
    authorName = c.authorName || c.username || c.name || 'Unknown';
  }

  const createdAtText = useClientTimeFormat(c.createdAt)

  const isMyComment = !!(me && authorId === me._id)
  const isFollowing = !!me?.following?.some((u: any) =>
    typeof u === 'string' ? u === authorId : u?._id === authorId
  )

  const likesArr: any[] = Array.isArray(c.likes) ? c.likes : []
  const likeCount = likesArr.length
  const isLiked = !!(me && likesArr.some((u: any) =>
    typeof u === 'string' ? u === me._id : u?._id === me._id
  ))

  const handleLikeToggle = async () => {
    if (!me) return
    try {
      if (isLiked) {
        await unlike(c._id).unwrap()
      } else {
        await like(c._id).unwrap()
      }
    } catch (err) {
      console.error('Like/Unlike failed:', err)
    }
  }

  const handleDelete = async () => {
    if (!isMyComment) return
    try {
      await del({ id: c._id }).unwrap()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleFollowToggle = async () => {
    if (!me || !authorId || isMyComment) return
    try {
      if (isFollowing) {
        await unfollowUser(authorId).unwrap()
      } else {
        await followUser(authorId).unwrap()
      }
      // Me query will auto-update via socket follow events in api.ts
    } catch (err) {
      console.error('Follow/Unfollow failed:', err)
    }
  }

  return (
    <div className="card p-3">
      <div className="text-sm text-gray-500 flex items-center justify-between">
        <span suppressHydrationWarning>{createdAtText}</span>
        <div className="flex items-center gap-2">
          <Link href={`/profile/${authorId}`} className="badge hover:underline">{authorName}</Link>
          {me && !isMyComment && (
            <button className="btn btn-xs" onClick={handleFollowToggle}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-1">{c.content}</div>

      <div className="mt-2 flex items-center gap-2 text-sm">
        <button className="btn" onClick={handleLikeToggle}>
          {isLiked ? 'Unlike' : 'Like'}
        </button>
        <span>❤️ {likeCount}</span>

        {isMyComment && (
          <button className="btn text-red-600" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>

      {/* reply box */}
      <div className="mt-3 flex gap-2">
        <input
          className="input"
          placeholder="Reply..."
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
        />
        <button
          className="btn"
          disabled={!replyBody.trim()}
          onClick={() => {
            create({ content: replyBody, parentComment: c._id })
            setReplyBody('')
          }}
        >
          Send
        </button>
      </div>

      {replies.length > 0 && (
        <div className="mt-3 pl-4 border-l space-y-2">
          {replies.map((child: any) => (
            <CommentItem key={child._id} c={child} />
          ))}
        </div>
      )}
    </div>
  )
}
