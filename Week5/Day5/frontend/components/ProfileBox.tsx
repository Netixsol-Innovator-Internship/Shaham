'use client'

import Image from 'next/image'

import { useState } from 'react'
import { useUpdateMeMutation } from '@/lib/api'

interface ProfileBoxProps {
  name: string
  email?: string
  phone?: string
  nationality?: string
  idType?: string
  idNumber?: string
  showIdNumber?: boolean
  avatarUrl?: string
}

export default function ProfileBox({
  name,
  email,
  phone,
  nationality,
  idType,
  idNumber,
  showIdNumber = false,
  avatarUrl = '/default-avatar.png',
}: ProfileBoxProps) {
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({
    phone: phone ?? '',
    nationality: nationality ?? '',
    idType: idType ?? '',
    idNumber: idNumber ?? '',
  })
  const [updateMe, { isLoading }] = useUpdateMeMutation()

  const handleSave = async () => {
    await updateMe(form).unwrap()
    setEdit(false)
  }

  return (
    <div className="bg-white shadow rounded-xl">
      {/* Header */}
      <div className="bg-[#1b2a6b] text-white rounded-t-xl px-4 py-3 flex justify-between items-center">
        <h2 className="font-semibold">Personal Information</h2>
        <button className="hover:opacity-80" onClick={()=>setEdit(e=>!e)}>{edit ? '✖' : '✎'}</button>
      </div>

      {/* Content */}
      <div className="p-6 grid md:grid-cols-2 gap-6">
        {/* Info fields */}
        <div>
          <div className="text-sm text-gray-500">Full Name</div>
          <div>{name ?? '-'}</div>
        </div>
        {email && (
          <div>
            <div className="text-sm text-gray-500">Email</div>
            <div>{email}</div>
          </div>
        )}
        {edit ? (
          <>
            <div>
              <div className="text-sm text-gray-500">Mobile Number</div>
              <input className="border rounded p-1 w-full" value={form.phone} onChange={e=>setForm(f=>({...f, phone:e.target.value}))} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Nationality</div>
              <input className="border rounded p-1 w-full" value={form.nationality} onChange={e=>setForm(f=>({...f, nationality:e.target.value}))} />
            </div>
            <div>
              <div className="text-sm text-gray-500">ID Type</div>
              <input className="border rounded p-1 w-full" value={form.idType} onChange={e=>setForm(f=>({...f, idType:e.target.value}))} />
            </div>
            <div>
              <div className="text-sm text-gray-500">ID Number</div>
              <input className="border rounded p-1 w-full" value={form.idNumber} onChange={e=>setForm(f=>({...f, idNumber:e.target.value}))} />
            </div>
            <div className="col-span-2 mt-4">
              <button className="btn btn-primary" onClick={handleSave} disabled={isLoading}>Save</button>
            </div>
          </>
        ) : (
          <>
            {form.phone && (
              <div>
                <div className="text-sm text-gray-500">Mobile Number</div>
                <div>{form.phone}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-500">Nationality</div>
              <div>{form.nationality || '-'}</div>
            </div>
            {form.idType && (
              <div>
                <div className="text-sm text-gray-500">ID Type</div>
                <div>{form.idType}</div>
              </div>
            )}
            {showIdNumber && form.idNumber && (
              <div>
                <div className="text-sm text-gray-500">ID Number</div>
                <div>{form.idNumber}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
