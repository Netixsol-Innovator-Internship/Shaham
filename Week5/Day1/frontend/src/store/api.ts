import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from './index'
import { getSocket } from '@/lib/socket'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const stateToken = (getState() as RootState)?.auth?.token;
      const token = stateToken ?? (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Comments', 'Me', 'Notifications', 'Followers'],
  endpoints: (builder) => ({

    // ---------------- AUTH ----------------
    register: builder.mutation<{ access_token: string }, { username: string; email: string; password: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    login: builder.mutation<{ access_token: string }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),

    // ---------------- USERS ----------------
    getMe: builder.query<any, void>({
      query: () => ({ url: '/users/me' }),
      providesTags: ['Me', 'Followers'],
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try { await cacheDataLoaded } catch { return }
        const s = getSocket()

        const upsertArr = (arr: any[] | undefined, id: string) => {
          if (!arr) return [id]
          if (arr.some((u: any) => (typeof u === 'string' ? u === id : u?._id === id))) return arr
          return [...arr, id]
        }
        const removeFromArr = (arr: any[] | undefined, id: string) =>
          (arr || []).filter((u: any) => (typeof u === 'string' ? u !== id : u?._id !== id))

        const handleFollow = (payload: any) => {
          updateCachedData((draft: any) => {
            if (!draft) return
            const followerId = String(payload?.follower?._id ?? payload?.follower ?? payload?.followerId)
            const targetId = String(payload?.targetUser?._id ?? payload?.targetUser ?? payload?.targetId)
            const meId = String(draft._id)

            if (followerId && followerId === meId) {
              draft.followingCount = (draft.followingCount ?? draft.following?.length ?? 0) + 1
              draft.following = upsertArr(draft.following, targetId)
            }
            if (targetId && targetId === meId) {
              draft.followersCount = (draft.followersCount ?? draft.followers?.length ?? 0) + 1
              draft.followers = upsertArr(draft.followers, followerId)
            }
          })
        }
        const handleUnfollow = (payload: any) => {
          updateCachedData((draft: any) => {
            if (!draft) return
            const followerId = String(payload?.follower?._id ?? payload?.follower ?? payload?.followerId)
            const targetId = String(payload?.targetUser?._id ?? payload?.targetUser ?? payload?.targetId)
            const meId = String(draft._id)

            if (followerId && followerId === meId) {
              draft.followingCount = Math.max(0, (draft.followingCount ?? draft.following?.length ?? 0) - 1)
              draft.following = removeFromArr(draft.following, targetId)
            }
            if (targetId && targetId === meId) {
              draft.followersCount = Math.max(0, (draft.followersCount ?? draft.followers?.length ?? 0) - 1)
              draft.followers = removeFromArr(draft.followers, followerId)
            }
          })
        }
        s.on('user:follow', handleFollow)
        s.on('user:unfollow', handleUnfollow)
        await cacheEntryRemoved
        s.off('user:follow', handleFollow)
        s.off('user:unfollow', handleUnfollow)
      },
    }),

    updateMe: builder.mutation<any, { bio?: string; username?: string; email?: string }>({
      query: (body) => ({
        url: '/users/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Me'],
    }),

    getUserById: builder.query<any, string>({
      query: (id) => ({ url: `/users/${id}` }),
      providesTags: ['Followers'],
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try { await cacheDataLoaded } catch { return }
        const s = getSocket()

        const upsertArr = (arr: any[] | undefined, id: string) => {
          if (!arr) return [id]
          if (arr.some((u: any) => (typeof u === 'string' ? u === id : u?._id === id))) return arr
          return [...arr, id]
        }
        const removeFromArr = (arr: any[] | undefined, id: string) =>
          (arr || []).filter((u: any) => (typeof u === 'string' ? u !== id : u?._id !== id))

        const handleFollow = (payload: any) => {
          updateCachedData((draft: any) => {
            if (!draft) return
            const followerId = String(payload?.follower?._id ?? payload?.follower ?? payload?.followerId)
            const targetId = String(payload?.targetUser?._id ?? payload?.targetUser ?? payload?.targetId)
            const pageId = String(arg)

            if (targetId === pageId) {
              draft.followersCount = (draft.followersCount ?? draft.followers?.length ?? 0) + 1
              draft.followers = upsertArr(draft.followers, followerId)
            }
            if (followerId === pageId) {
              draft.followingCount = (draft.followingCount ?? draft.following?.length ?? 0) + 1
              draft.following = upsertArr(draft.following, targetId)
            }
          })
        }

        const handleUnfollow = (payload: any) => {
          updateCachedData((draft: any) => {
            if (!draft) return
            const followerId = String(payload?.follower?._id ?? payload?.follower ?? payload?.followerId)
            const targetId = String(payload?.targetUser?._id ?? payload?.targetUser ?? payload?.targetId)
            const pageId = String(arg)

            if (targetId === pageId) {
              draft.followersCount = Math.max(0, (draft.followersCount ?? draft.followers?.length ?? 0) - 1)
              draft.followers = removeFromArr(draft.followers, followerId)
            }
            if (followerId === pageId) {
              draft.followingCount = Math.max(0, (draft.followingCount ?? draft.following?.length ?? 0) - 1)
              draft.following = removeFromArr(draft.following, targetId)
            }
          })
        }

        s.on('user:follow', handleFollow)
        s.on('user:unfollow', handleUnfollow)

        await cacheEntryRemoved
        s.off('user:follow', handleFollow)
        s.off('user:unfollow', handleUnfollow)
      },
    }),

    followUser: builder.mutation<any, string>({
      query: (id) => ({ url: `/users/${id}/follow`, method: 'POST' }),
      invalidatesTags: ['Me', 'Followers'],
    }),
    unfollowUser: builder.mutation<any, string>({
      query: (id) => ({ url: `/users/${id}/follow`, method: 'DELETE' }),
      invalidatesTags: ['Me', 'Followers'],
    }),

    // ---------------- COMMENTS ----------------
    getComments: builder.query<any[], { parent?: string } | void>({
      query: (params) => ({ url: '/comments', params }),
      providesTags: (result, error, arg) =>
        arg?.parent
          ? [{ type: 'Comments', id: arg.parent }]
          : [{ type: 'Comments', id: 'ROOT' }],

      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try { await cacheDataLoaded } catch { return }
        const s = getSocket()

        const getId = (item: any) => item?._id ?? item?.id ?? item?.commentId ?? null
        const getParent = (item: any) =>
          item?.parentComment && typeof item.parentComment === 'object'
            ? item.parentComment._id
            : item?.parentComment ?? null

        const handleNew = (payload: any) => {
          try {
            const newId = getId(payload)
            const parent = getParent(payload)
            const isRootQuery = !arg?.parent
            const belongsToThisParent =
              (arg?.parent && String(parent) === String(arg.parent)) ||
              (isRootQuery && (parent === null || parent === undefined))

            if (belongsToThisParent) {
              updateCachedData((draft: any[]) => {
                if (!draft.some((d: any) => String(getId(d)) === String(newId))) {
                  draft.unshift(payload)
                }
              })
            }
          } catch { }
        }

        const handleDeleted = (payload: any) => {
          try {
            const delId = payload?.id ?? payload?._id ?? payload ?? null
            if (!delId) return
            updateCachedData((draft: any[]) => {
              for (let i = draft.length - 1; i >= 0; i--) {
                const d = draft[i]
                if (String(getId(d)) === String(delId)) draft.splice(i, 1)
              }
            })
          } catch { }
        }

        const handleLikeOrUpdate = (payload: any) => {
          try {
            const id = payload?.commentId ?? payload?._id ?? payload?.id ?? null
            if (!id) return

            updateCachedData((draft: any[]) => {
              const idx = draft.findIndex((d: any) => String(getId(d)) === String(id))
              if (idx !== -1) {
                const entry = draft[idx]

                if (payload?.likes !== undefined) {
                  if (Array.isArray(payload.likes)) {
                    entry.likes = payload.likes
                  } else if (typeof payload.likes === 'number') {
                    entry.likesCount = payload.likes
                  }
                }

                if (payload?.content) entry.content = payload.content
                if (payload?.author) entry.author = payload.author
              }
            })
          } catch { }
        }
        s.on('comments:new', handleNew)
        s.on('comment:new', handleNew)
        s.on('comments:deleted', handleDeleted)
        s.on('comment:deleted', handleDeleted)
        s.on('comments:likes', handleLikeOrUpdate)
        s.on('comment:like', handleLikeOrUpdate)

        await cacheEntryRemoved
        s.off('comments:new', handleNew)
        s.off('comment:new', handleNew)
        s.off('comments:deleted', handleDeleted)
        s.off('comment:deleted', handleDeleted)
        s.off('comments:likes', handleLikeOrUpdate)
        s.off('comment:like', handleLikeOrUpdate)
      },
    }),

    createComment: builder.mutation<any, { content: string; parentComment?: string }>({
      query: (body) => ({ url: '/comments', method: 'POST', body }),
      invalidatesTags: (result, error, arg) =>
        arg?.parentComment
          ? [{ type: 'Comments', id: arg.parentComment }]
          : [{ type: 'Comments', id: 'ROOT' }],
    }),

    likeComment: builder.mutation<any, string>({
      query: (id) => ({ url: `/comments/${id}/like`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Comments', id },
        { type: 'Comments', id: 'ROOT' },
      ],
    }),
    unlikeComment: builder.mutation<any, string>({
      query: (id) => ({ url: `/comments/${id}/like`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Comments', id },
        { type: 'Comments', id: 'ROOT' },
      ],
    }),
    deleteComment: builder.mutation<any, { id: string; parentId?: string }>({
      query: ({ id }) => ({ url: `/comments/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { id, parentId }) => [
        { type: 'Comments', id },
        parentId ? { type: 'Comments', id: parentId } : { type: 'Comments', id: 'ROOT' },
      ],
    }),

    // ---------------- NOTIFICATIONS ----------------
    getNotifications: builder.query<any[], void>({
      query: () => ({ url: '/notifications' }),
      providesTags: ['Notifications'],
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try { await cacheDataLoaded } catch { return }
        const s = getSocket()

        const handleNewNotification = (payload: any) => {
          updateCachedData((draft: any[] | undefined) => {
            if (!draft) return
            if (!draft.some((n: any) => String(n._id) === String(payload._id))) {
              draft.unshift(payload)
            }
          })
        }

        s.on('notification:new', handleNewNotification)
        await cacheEntryRemoved
        s.off('notification:new', handleNewNotification)
      }
    }),

    markRead: builder.mutation<any, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PATCH' }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          api.util.updateQueryData('getNotifications', undefined, (draft: any[] | undefined) => {
            if (!draft) return
            const n = draft.find((x) => String(x._id) === String(id))
            if (n) n.read = true
          })
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),

    markAllRead: builder.mutation<{ ok: boolean }, void>({
      query: () => ({ url: '/notifications/read-all', method: 'PATCH' }),
      invalidatesTags: ['Notifications'],
    }),

  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useGetUserByIdQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetCommentsQuery,
  useUpdateMeMutation,
  useCreateCommentMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useDeleteCommentMutation,
  useGetNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
} = api
