
'use client'
import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { api } from '@/lib/api'
import { setUser } from '@/lib/slices/authSlice'
import { useEffect } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(()=>{
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      store.dispatch({ type: 'auth/setToken', payload: token })
      store.dispatch(api.endpoints.me.initiate()).then((res: any)=>{
        if (res?.data) store.dispatch(setUser(res.data))
      })
    }
  },[])
  return <Provider store={store}>{children}</Provider>
}
