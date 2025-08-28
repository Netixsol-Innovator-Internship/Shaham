// app/profile/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useGetUserByIdQuery } from '@/store/api'

export default function OtherProfilePage() {
  const { id } = useParams() as { id: string }
  const { data: user, isLoading } = useGetUserByIdQuery(id)

  if (isLoading) return <p>Loading...</p>
  if (!user) return <p>User not found</p>

  return (
    <main className="container py-8 space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold">{user.username}’s Profile</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div><span className="font-medium">Username:</span> {user.username}</div>
            <div><span className="font-medium">Email:</span> {user.email}</div>
            <div><span className="font-medium">Bio:</span> {user.bio || '-'}</div>
          </div>
          <div>
            <div><span className="font-medium">Followers:</span> {user.followersCount ?? user.followers?.length ?? 0}</div>
            <div><span className="font-medium">Following:</span> {user.followingCount ?? user.following?.length ?? 0}</div>
          </div>
        </div>
      </div>
    </main>
  )
}
