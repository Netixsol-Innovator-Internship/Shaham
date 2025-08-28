'use client';
import { useState } from 'react'
import { useRegisterMutation } from '@/store/api'
import { useAppDispatch } from '@/store/hooks'
import { setToken } from '@/store/authSlice'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [username, setUsername] = useState('demo')
  const [email, setEmail] = useState('demo@example.com')
  const [password, setPassword] = useState('123456')
  const [register, { isLoading, error }] = useRegisterMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  async function handle() {
    try {
      const res = await register({ username, email, password }).unwrap()
      dispatch(setToken(res.access_token))
      router.push('/')
    } catch (err) {
      console.error('Registration error:', err)
    }
  }

  const errorMessage =
    (error as any)?.data?.message || (error as any)?.error || null

  return (
    <main className="container py-10">
      <div className="card p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-semibold">Register</h1>
        <div className="mt-4 space-y-3">
          <input
            className="input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            className="input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            disabled={isLoading}
            className="btn btn-primary w-full"
            onClick={handle}
          >
            {isLoading ? '...' : 'Create account'}
          </button>

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
        </div>
      </div>
    </main>
  )
}
