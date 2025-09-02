
'use client'
import { useState, useEffect } from 'react'
import { useLoginMutation, api } from '@/lib/api'
import { useDispatch, useSelector } from 'react-redux'
import { setToken, setUser } from '@/lib/slices/authSlice'
import { useRouter } from 'next/navigation'
import { RootState } from '@/lib/store'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', agree: false, robot: false, remember: false })
  const [login] = useLoginMutation()
  const dispatch = useDispatch()
  const router = useRouter()
  const loggedIn = useSelector((s: RootState) => s.auth.loggedIn)

  useEffect(() => {
    if (loggedIn) router.replace('/')
  }, [loggedIn, router])

  const submit = async (e: any) => {
    e.preventDefault()
    if (!form.agree || !form.robot) { alert('Please accept terms and confirm you are not a robot.'); return }
    const res = await login(form as any).unwrap().catch(() => null)
    const token = (res as any)?.accessToken
    if (token) {
      if (form.remember) localStorage.setItem('token', token)
      dispatch(setToken(token))
      // fetch user
      const me = await (api.endpoints.me.initiate() as any)(dispatch, undefined, undefined).unwrap().catch(() => null)
      if (me) dispatch(setUser(me))
      router.push('/')
    } else alert('Login failed')
  }

  return (
    <form onSubmit={submit} className="card max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <input required type="email" placeholder="Email" className="border p-2 rounded w-full" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input required type="password" placeholder="Password" className="border p-2 rounded w-full" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })} /> I agree to Terms & Conditions</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.robot} onChange={e => setForm({ ...form, robot: e.target.checked })} /> I'm not a robot</label>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} /> Remember me</label>
        <button type="button" className="text-sm underline opacity-70">Forgot password?</button>
      </div>
      <button className="btn btn-primary w-full" type="submit">Login</button>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="btn w-full">Continue with Google</button>
        <button type="button" className="btn w-full">Continue with GitHub</button>
      </div>
    </form>
  )
}
