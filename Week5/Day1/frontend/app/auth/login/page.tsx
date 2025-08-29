'use client'
import { useState } from 'react'
import { useLoginMutation, api } from '@/store/api'
import { useAppDispatch } from '@/store/hooks'
import { setToken } from '@/store/authSlice'
import { useRouter } from 'next/navigation'
import { initSocket } from '@/lib/socket'

export default function LoginPage() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('123456')
  const [login, { isLoading, error }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  async function handle() {
    try {
      const res = await login({ email, password }).unwrap()
      dispatch(setToken(res.access_token))

      // init socket with new token
      initSocket(res.access_token)

      // ✅ refetch notifications immediately after login
      dispatch(
        api.endpoints.getNotifications.initiate(undefined, { forceRefetch: true })
      )

      router.push('/')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <main className="container py-10">
      <div className="card p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-semibold">Login</h1>
        <div className="mt-4 space-y-3">
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            disabled={isLoading}
            className="btn btn-primary w-full"
            onClick={handle}
          >
            {isLoading ? '...' : 'Login'}
          </button>
          {error && <p className="text-sm text-red-600">Login failed</p>}
        </div>
      </div>
    </main>
  )
}
