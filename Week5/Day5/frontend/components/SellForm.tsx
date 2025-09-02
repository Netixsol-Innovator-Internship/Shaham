'use client'
import { useEffect, useState } from 'react'
import { useCreateCarMutation } from '@/lib/api'

type FormState = {
  dealerOrPrivate: 'Dealer' | 'Private'
  name: string
  email: string
  phone: string
  vin: string
  year: string
  make: string
  model: string
  type: string
  mileage: string
  engineSize: string
  paint: string
  hasGCC: string
  options: string
  accidentHistory: string
  fullServiceHistory: string
  modified: string
  startingBid: string
  endTime: string
  photos: FileList | null
}

type Errors = Partial<Record<keyof FormState | 'photos' | 'global', string>>

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'

// Cloudinary
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || ''

// Hardcoded lists requested
const MAKES: Record<string, string[]> = {
  Toyota: ['Corolla', 'Camry', 'Prius'],
  BMW: ['3 Series', 'M4'],
  Honda: ['Civic', 'Accord'],
}
const YEARS = ['2023', '2022', '2021', '2020', '2019']
const TYPES = ['Sedan', 'Sports', 'Hatchback', 'Convertible']

export default function SellForm() {
  const [form, setForm] = useState<FormState>({
    dealerOrPrivate: 'Private',
    name: '',
    email: '',
    phone: '',
    vin: '',
    year: YEARS[0],
    make: Object.keys(MAKES)[0],
    model: MAKES[Object.keys(MAKES)[0]][0],
    type: TYPES[0],
    mileage: '',
    engineSize: '',
    paint: '',
    hasGCC: 'No',
    options: '',
    accidentHistory: 'No',
    fullServiceHistory: 'No',
    modified: 'Completely stock',
    startingBid: '',
    endTime: '',
    photos: null,
  })
  const [modelsForMake, setModelsForMake] = useState<string[]>(MAKES[form.make] || [])
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [photoPreviewCount, setPhotoPreviewCount] = useState(0)

const [createCar] = useCreateCarMutation()

  useEffect(() => {
    setModelsForMake(MAKES[form.make] || [])
    if (!MAKES[form.make]?.includes(form.model)) {
      setForm(prev => ({ ...prev, model: MAKES[form.make][0] || '' }))
    }
  }, [form.make])

  // Autofill user info
  useEffect(() => {
    async function fetchMe() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) return
        const res = await fetch(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        const resolvedName =
          (data.name && String(data.name).trim()) ||
          ((data.firstName || data.lastName) && `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim()) ||
          ''
        setForm(prev => ({
          ...prev,
          name: resolvedName || prev.name,
          email: data.email ?? prev.email,
          phone: data.phone ?? prev.phone,
        }))
      } catch {
        // ignore autofill failures
      }
    }
    fetchMe()
  }, [])

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value } as FormState))
    if (touched[name as keyof FormState]) {
      const singleError = validateField(name as keyof FormState, value as string)
      setErrors(prev => {
        const copy = { ...prev }
        if (singleError) copy[name as keyof FormState] = singleError
        else delete copy[name as keyof FormState]
        return copy
      })
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    setForm(prev => ({ ...prev, photos: files }))
    setPhotoPreviewCount(files ? files.length : 0)
    const photoErr = validatePhotos(files)
    setErrors(prev => {
      const copy = { ...prev }
      if (photoErr) copy.photos = photoErr
      else delete copy.photos
      return copy
    })
  }

  function validateField(key: keyof FormState, value: string): string | undefined {
    if (
      key === 'name' ||
      key === 'vin' ||
      key === 'email' ||
      key === 'phone' ||
      key === 'startingBid' ||
      key === 'endTime' ||
      key === 'make' ||
      key === 'model' ||
      key === 'year' ||
      key === 'type'
    ) {
      if (!value || value.toString().trim() === '') return 'This field is required'
    }

    if (key === 'email' && value) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!re.test(value)) return 'Enter a valid email'
    }
    if (key === 'phone' && value) {
      const digits = value.replace(/\D/g, '')
      if (digits.length < 6) return 'Enter a valid phone number'
    }
    if (key === 'vin' && value) {
      const len = value.trim().length
      if (len < 11) return 'VIN seems too short'
      if (len > 25) return 'VIN seems too long'
      if (len !== 17) return 'VIN is typically 17 characters — double-check'
    }
    if (key === 'startingBid' && value) {
      const n = Number(value)
      if (Number.isNaN(n) || n <= 0) return 'Enter a valid positive number'
    }
    if (key === 'endTime' && value) {
      if (isNaN(Date.parse(value))) return 'Enter a valid date/time'
    }
    if (key === 'year' && value) {
      if (!YEARS.includes(value)) return 'Select a valid year'
    }
    if ((key === 'mileage' || key === 'engineSize') && value) {
      if (Number.isNaN(Number(value))) return 'Must be a number'
    }
    return undefined
  }

  function validatePhotos(files: FileList | null): string | undefined {
    if (!files || files.length === 0) return 'Please upload at least 6 photos'
    if (files.length < 6) return 'Please upload at least 6 photos (backend requires 6 or more)'
    if (files.length > 50) return 'Max 50 photos allowed'
    const maxSizeBytes = 5 * 1024 * 1024 // 5MB per file
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      if (!f.type.startsWith('image/')) return `File "${f.name}" is not an image`
      if (f.size > maxSizeBytes) return `File "${f.name}" exceeds 5MB`
    }
    return undefined
  }

  function validateAll(): Errors {
    const res: Errors = {}
    const requiredKeys: (keyof FormState)[] = ['name', 'email', 'phone', 'vin', 'year', 'make', 'model', 'type', 'startingBid', 'endTime']
    for (const k of requiredKeys) {
      const v = (form as any)[k]
      const err = validateField(k, String(v ?? ''))
      if (err) res[k] = err
    }
    const mileageErr = validateField('mileage', form.mileage)
    if (mileageErr) res.mileage = mileageErr
    const engineErr = validateField('engineSize', form.engineSize)
    if (engineErr) res.engineSize = engineErr

    const photosErr = validatePhotos(form.photos)
    if (photosErr) res.photos = photosErr

    return res
  }

  async function getCloudinarySignature(folder: string) {
    const res = await fetch('/api/cloudinary-sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder }),
    })
    if (!res.ok) throw new Error('Failed to get Cloudinary signature')
    return res.json() as Promise<{ signature: string; timestamp: number; folder: string }>
  }

  async function uploadToCloudinary(file: File, folder = 'cars') {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY) {
      throw new Error('Missing Cloudinary env vars (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_API_KEY)')
    }
    const { signature, timestamp } = await getCloudinarySignature(folder)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('api_key', CLOUDINARY_API_KEY)
    fd.append('timestamp', String(timestamp))
    fd.append('signature', signature)
    fd.append('folder', folder)

    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
    const up = await fetch(endpoint, { method: 'POST', body: fd })
    const json = await up.json()
    if (!up.ok) throw new Error(json?.error?.message || `Upload failed for ${file.name}`)
    return json.secure_url as string
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {} as any))
    const v = validateAll()
    setErrors(v)
    if (Object.keys(v).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    try {
      setSubmitting(true)

      // Upload images to Cloudinary
      let photoUrls: string[] = []
      if (form.photos && form.photos.length > 0) {
        const files = Array.from(form.photos)
        photoUrls = await Promise.all(files.map(f => uploadToCloudinary(f, 'cars')))
      }

      const payload = {
        dealerOrPrivate: form.dealerOrPrivate,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        vin: form.vin.trim(),
        year: Number(form.year),
        make: form.make,
        model: form.model,
        type: form.type,
        mileage: form.mileage ? Number(form.mileage) : undefined,
        engineSize: form.engineSize ? Number(form.engineSize) : undefined,
        paint: form.paint,
        hasGCC: form.hasGCC,
        options: form.options,
        accidentHistory: form.accidentHistory,
        fullServiceHistory: form.fullServiceHistory,
        modified: form.modified,
        startingBid: form.startingBid ? Number(form.startingBid) : undefined,
        maxBid: form.startingBid ? Number(form.startingBid) : undefined,
        endTime: form.endTime ? new Date(form.endTime).toISOString() : undefined,
        photos: photoUrls,
      }

      await createCar(payload).unwrap()
      alert('Listing created successfully!')
    } catch (err: any) {
      console.error(err)
      setErrors(prev => ({ ...prev, global: err?.message ?? 'Unknown error' }))
    } finally {
      setSubmitting(false)
    }
  }

  const FieldError = ({ name }: { name: keyof Errors }) =>
    errors[name] ? <p className="text-xs text-red-600 mt-1">{errors[name]}</p> : null

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.global && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {errors.global}
        </div>
      )}

      <section className="bg-[#e6efff] rounded p-6 border border-[#d7e6ff] shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Your Info</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Dealer or Private party?</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, dealerOrPrivate: 'Dealer' }))}
              className={`px-4 py-2 border rounded ${form.dealerOrPrivate === 'Dealer' ? 'bg-white border-[#3f4b8b] text-[#3f4b8b]' : 'bg-white'}`}
            >
              Dealer
            </button>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, dealerOrPrivate: 'Private' }))}
              className={`px-4 py-2 border rounded ${form.dealerOrPrivate === 'Private' ? 'bg-white border-[#3f4b8b] text-[#3f4b8b]' : 'bg-white'}`}
            >
              Private party
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Name*</label>
            <input name="name" value={form.name} onChange={handleInput} onBlur={() => setTouched(t => ({ ...t, name: true }))} className="w-full px-3 py-2 border rounded" />
            <FieldError name="name" />
          </div>

          <div>
            <label className="block text-sm mb-1">Email*</label>
            <input name="email" value={form.email} onChange={handleInput} onBlur={() => setTouched(t => ({ ...t, email: true }))} className="w-full px-3 py-2 border rounded" />
            <FieldError name="email" />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone number*</label>
            <input name="phone" value={form.phone} onChange={handleInput} onBlur={() => setTouched(t => ({ ...t, phone: true }))} className="w-full px-3 py-2 border rounded" />
            <FieldError name="phone" />
          </div>
        </div>
      </section>

      <section className="bg-[#e6efff] rounded p-6 border border-[#d7e6ff] shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Car Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm mb-1">VIN*</label>
            <input name="vin" value={form.vin} onChange={handleInput} onBlur={() => setTouched(t => ({ ...t, vin: true }))} className="w-full px-3 py-2 border rounded" />
            <FieldError name="vin" />
          </div>

          <div>
            <label className="block text-sm mb-1">Year*</label>
            <select name="year" value={form.year} onChange={handleInput} onBlur={() => setTouched(t => ({ ...t, year: true }))} className="w-full px-3 py-2 border rounded">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <FieldError name="year" />
          </div>

          <div>
            <label className="block text-sm mb-1">Make*</label>
            <select name="make" value={form.make} onChange={handleInput} onBlur={() => setTouched(t => ({ ...t, make: true }))} className="w-full px-3 py-2 border rounded">
              {Object.keys(MAKES).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <FieldError name="make" />
          </div>

          <div>
            <label className="block text-sm mb-1">Model*</label>
            <select name="model" value={form.model} onChange={handleInput} onBlur={() => setTouched(t => ({ ...t, model: true }))} className="w-full px-3 py-2 border rounded">
              {modelsForMake.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <FieldError name="model" />
          </div>

          <div>
            <label className="block text-sm mb-1">Type*</label>
            <select name="type" value={form.type} onChange={handleInput} onBlur={() => setTouched(t => ({ ...t, type: true }))} className="w-full px-3 py-2 border rounded">
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <FieldError name="type" />
          </div>

          <div>
            <label className="block text-sm mb-1">Engine size</label>
            <select
              name="engineSize"
              value={form.engineSize}
              onChange={handleInput}
              onBlur={() => setTouched(t => ({ ...t, engineSize: true }))}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select engine size</option>
              <option value="4">4 cylinders</option>
              <option value="6">6 cylinders</option>
              <option value="8">8 cylinders</option>
              <option value="10">10 cylinders</option>
              <option value="12">12 cylinders</option>
            </select>
            <FieldError name="engineSize" />
          </div>

          <div>
            <label className="block text-sm mb-1">Mileage (in miles)</label>
            <input name="mileage" value={form.mileage} onChange={handleInput} onBlur={() => setTouched(t => ({ ...t, mileage: true }))} className="w-full px-3 py-2 border rounded" />
            <FieldError name="mileage" />
          </div>

          <div>
            <label className="block text-sm mb-1">Paint*</label>
            <select
              name="paint"
              value={form.paint}
              onChange={handleInput}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select paint condition</option>
              <option value="Original paint">Original paint</option>
              <option value="Partially repainted">Partially repainted</option>
              <option value="Totally repainted">Totally repainted</option>
            </select>
            <FieldError name="paint" />
          </div>

          <div>
            <label className="block text-sm mb-1">Has GCC Specs</label>
            <select name="hasGCC" value={form.hasGCC} onChange={handleInput} className="w-full px-3 py-2 border rounded">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Noteworthy options/features</label>
          <textarea name="options" value={form.options} onChange={handleInput} className="w-full h-28 px-3 py-2 border rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Accident History</label>
            <select name="accidentHistory" value={form.accidentHistory} onChange={handleInput} className="w-full px-3 py-2 border rounded">
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Full Service History</label>
            <select name="fullServiceHistory" value={form.fullServiceHistory} onChange={handleInput} className="w-full px-3 py-2 border rounded">
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Has the car been modified?</label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setForm(f => ({ ...f, modified: 'Completely stock' }))} className={`px-4 py-2 border rounded ${form.modified === 'Completely stock' ? 'border-[#3f4b8b] text-[#3f4b8b]' : ''}`}>Completely stock</button>
            <button type="button" onClick={() => setForm(f => ({ ...f, modified: 'Modified' }))} className={`px-4 py-2 border rounded ${form.modified === 'Modified' ? 'border-[#3f4b8b] text-[#3f4b8b]' : ''}`}>Modified</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm mb-1">Upload Photos (min 6, each ≤ 5MB)</label>
            <input type="file" name="photos" onChange={handleFile} multiple accept="image/*" />
            <p className="text-xs text-gray-500 mt-1">You can select multiple images. Backend requires at least 6 images.</p>
            <div className="mt-2 text-xs text-gray-600">Selected: {photoPreviewCount} file(s)</div>
            <FieldError name="photos" />
          </div>

          <div>
            <label className="block text-sm mb-1">Min Bid*</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-gray-300 bg-white">$</span>
              <input name="startingBid" value={form.startingBid} onChange={handleInput} onBlur={() => setTouched(t => ({ ...t, startingBid: true }))} className="w-full px-3 py-2 border rounded-r" />
            </div>
            <FieldError name="startingBid" />
          </div>

          <div>
            <label className="block text-sm mb-1">Auction End Time*</label>
            <input
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleInput}
                onBlur={() => setTouched(t => ({ ...t, endTime: true }))}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border rounded"
            />
            <FieldError name="endTime" />
          </div>

        </div>

        <div className="mt-6">
          <button disabled={submitting} type="submit" className={`px-6 py-3 rounded shadow text-white ${submitting ? 'bg-gray-400' : 'bg-[#2b3d7a]'}`}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </section>
    </form>
  )
}
