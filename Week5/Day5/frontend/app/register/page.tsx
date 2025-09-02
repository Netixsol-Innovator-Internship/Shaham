
'use client'
import { useState } from 'react'
import { useRegisterMutation } from '@/lib/api'
import { useDispatch } from 'react-redux'
import { setToken } from '@/lib/slices/authSlice'
import { useRouter } from 'next/navigation'

export default function Register(){
  const [form, setForm] = useState({ name:'', email:'', password:'', agree:false, robot:false })
  const [register] = useRegisterMutation()
  const dispatch = useDispatch()
  const router = useRouter()

  const submit = async (e:any)=>{
    e.preventDefault()
    if(!form.agree || !form.robot) { alert('Please accept terms and confirm you are not a robot.'); return }
    const res = await register(form as any).unwrap().catch((e)=>({error:true, data:e}))
    const token = (res as any)?.token
    if(token){ localStorage.setItem('token', token); dispatch(setToken(token)); router.push('/') }
    else alert('Registration failed')
  }

  return (
    <form onSubmit={submit} className="card max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <input required placeholder="Name" className="border p-2 rounded w-full" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
      <input required type="email" placeholder="Email" className="border p-2 rounded w-full" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
      <input required type="password" placeholder="Password" className="border p-2 rounded w-full" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.agree} onChange={e=>setForm({...form, agree:e.target.checked})}/> I agree to Terms & Conditions</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.robot} onChange={e=>setForm({...form, robot:e.target.checked})}/> I'm not a robot</label>
      <button className="btn btn-primary w-full" type="submit">Register</button>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="btn w-full">Continue with Google</button>
        <button type="button" className="btn w-full">Continue with GitHub</button>
      </div>
    </form>
  )
}
