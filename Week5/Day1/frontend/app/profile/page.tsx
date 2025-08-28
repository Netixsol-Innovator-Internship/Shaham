'use client'
import { useGetMeQuery, useUpdateMeMutation } from '@/store/api'
import { useState } from 'react'

export default function ProfilePage() {
  const { data: me, refetch } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const [updateMe] = useUpdateMeMutation()

  const [bio, setBio] = useState(me?.bio || '')
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async () => {
    try {
      await updateMe({ bio }).unwrap()
      await refetch()
      setIsEditing(false)
    } catch (err) {
      console.error('Update failed:', err)
    }
  }

  return (
    <main className="container py-8 space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        {!me ? (
          <p className="text-sm text-gray-500 mt-2">Login required</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div>
                <span className="font-medium">Username:</span> {me.username}
              </div>
              <div>
                <span className="font-medium">Email:</span> {me.email}
              </div>

              {/* Editable bio */}
              <div className="mt-2">
                <span className="font-medium">Bio:</span>{' '}
                {isEditing ? (
                  <div className="mt-1 flex gap-2">
                    <input
                      className="input flex-1"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleSave}>
                      Save
                    </button>
                    <button
                      className="btn"
                      onClick={() => {
                        setBio(me.bio || '')
                        setIsEditing(false)
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 flex gap-2 items-center">
                    <span>{me.bio || '-'}</span>
                    <button
                      className="btn btn-xs"
                      onClick={() => {
                        setBio(me.bio || '')
                        setIsEditing(true)
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div>
                <span className="font-medium">Followers:</span>{' '}
                {me.followersCount ?? me.followers?.length ?? 0}
              </div>
              <div>
                <span className="font-medium">Following:</span>{' '}
                {me.followingCount ?? me.following?.length ?? 0}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
