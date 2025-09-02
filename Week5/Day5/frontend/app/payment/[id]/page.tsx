
'use client'
import { useParams, useRouter } from 'next/navigation'
import { useGetCarQuery } from '@/lib/api'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000'

export default function Payment(){
  const { id } = useParams<{id:string}>()
  const { data: car } = useGetCarQuery(id)
  const [stage, setStage] = useState(0)
  const router = useRouter()

  useEffect(()=>{
    const s = io(wsUrl, { transports: ['websocket'] })
    const steps = [ 'Ready for shipping', 'In transit', 'Delivered' ]
    let x = 0
    const iv = setInterval(()=>{
      x = Math.min(x+1, steps.length-1)
      setStage(x)
      if(x === steps.length-1){ clearInterval(iv) }
    }, 60000) // ~60s
    return ()=>{ clearInterval(iv); s.disconnect() }
  },[])

  if(!car) return <div>Loading...</div>

  return (
    <div className="card max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Payment for {car.make} {car.model}</h1>
      <p>Winning date: {new Date(car.updatedAt || Date.now()).toLocaleDateString()}</p>
      <p>Lot no.: {car._id?.slice(-6)}</p>
      <button className="btn btn-primary w-full" onClick={()=>alert('Payment successful (fake).')}>Make Payment</button>
      <div className="mt-4">
        <div className="font-medium mb-2">Order progress</div>
        <div className="flex items-center gap-2">
          {['Ready for shipping','In transit','Delivered'].map((s,i)=> (
            <div key={s} className={`px-3 py-1 rounded-full border ${i<=stage?'bg-black text-white':''}`}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
