'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { useMeQuery, useMyCarsQuery, useMyBidsQuery } from '@/lib/api'
import ProfileBox from '@/components/ProfileBox'
import MyCarCard from '@/components/MyCarCard'
import MyBidsCard from '@/components/MyBidsCard'
import Wishlist from '@/components/Wishlist'

export default function Profile() {
  const auth = useSelector((s: RootState) => s.auth)
  const dispatch = require('react-redux').useDispatch();

  function handleLogout() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
      // reset RTK Query cache to avoid stale notifications on next login
      dispatch({ type: 'auth/logout' })
      dispatch({ type: 'api/util/resetApiState' })
    } finally {
      if (typeof window !== 'undefined') {
        window.location.assign('/')
      }
    }
  }
  const { data: me } = useMeQuery(undefined, { skip: !auth.loggedIn })
  const { data: myCars, isLoading: myCarsLoading, refetch } = useMyCarsQuery(undefined, { skip: !auth.loggedIn, refetchOnMountOrArgChange: true })
  const { data: myBids, isLoading: myBidsLoading } = useMyBidsQuery(undefined, { skip: !auth.loggedIn })

  const [activeTab, setActiveTab] = useState('personal')

  if (!auth.loggedIn) {
    return <div className="p-6 text-center">Please login to view your profile.</div>
  }

  return (
    <div className="min-h-screen bg-[#e8f0ff]">
      {/* Header */}
      <div className="bg-[#cbd9ff] py-12 text-center">
        <h1 className="text-4xl font-bold text-[#1b2a6b]">My Profile</h1>
        <p className="mt-2 text-gray-600">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>
        <div className="mt-3 text-sm text-gray-500">
          Home &gt; <span className="text-[#1b2a6b]">My Profile</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-12 gap-6 px-4">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <div className="flex flex-col bg-white rounded-xl shadow p-2">
            {[
              { key: 'personal', label: 'Personal Information' },
              { key: 'cars', label: 'My Cars' },
              { key: 'bids', label: 'My Bids' },
              { key: 'wishlist', label: 'Wishlist' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-left rounded-lg mb-1 ${activeTab === tab.key
                  ? 'bg-[#e8f0ff] text-[#1b2a6b] font-semibold'
                  : 'hover:bg-gray-100 text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Panel */}
        <div className="col-span-12 md:col-span-9">
          {activeTab === 'personal' && (
            <div>
              <ProfileBox
                name={me?.username ?? '-'}
                email={me?.email ?? '-'}
                phone={me?.phone ?? '-'}
                nationality={me?.nationality ?? '-'}
                idType={me?.idType ?? '-'}
                idNumber={me?.idNumber ?? '-'}
                showIdNumber={auth.user?._id === me?._id}
                avatarUrl={me?.avatarUrl}
              />
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {activeTab === 'cars' && (
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-lg font-semibold text-[#1b2a6b]">My Cars</h2>

              {myCarsLoading ? (
                <p className="text-gray-500 mt-2">Loading your cars...</p>
              ) : myCars && myCars.length > 0 ? (
                <div className="flex flex-wrap gap-6 mt-4">
                  {myCars.map((car: any) => (
                    <MyCarCard key={car._id} auction={car} refetchCars={refetch} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-2">You have no cars listed.</p>
              )}
            </div>
          )}

          {activeTab === 'bids' && (
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-lg font-semibold text-[#1b2a6b]">My Bids</h2>

              {myBidsLoading ? (
                <p className="text-gray-500 mt-2">Loading your bids...</p>
              ) : myBids && myBids.length > 0 ? (
                <div className="flex flex-wrap gap-6 mt-4">
                  {myBids && myBids.length > 0 ? (
                    <div className="flex flex-wrap gap-6 mt-4">
                      {myBids.map((bid: any) => (
                        <MyBidsCard key={bid._id} auction={bid.car} userBid={bid.amount} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-2">You haven't placed any bids yet.</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 mt-2">You haven't placed any bids yet.</p>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-lg font-semibold text-[#1b2a6b]">Wishlist</h2>
              <Wishlist />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
