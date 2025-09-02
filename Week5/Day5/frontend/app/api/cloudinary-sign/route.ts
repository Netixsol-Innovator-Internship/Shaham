export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const { folder = 'cars' } = await req.json().catch(() => ({}))
  const timestamp = Math.floor(Date.now() / 1000)

  const toSign = `folder=${folder}&timestamp=${timestamp}`
  const signature = crypto
    .createHash('sha1')
    .update(toSign + process.env.CLOUDINARY_API_SECRET!)
    .digest('hex')

  return NextResponse.json({ signature, timestamp, folder })
}
