import { NextResponse } from 'next/server'
import getSupabaseAdmin from '@/lib/supabaseAdmin'

const DIDIT_TOKEN_URL = 'https://auth.didit.me/oauth2/token'
const DIDIT_SESSION_URL = 'https://apx.didit.me/v2/client/session/'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://inambebar.com'

async function getDiditToken() {
  const res = await fetch(DIDIT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.DIDIT_CLIENT_ID,
      client_secret: process.env.DIDIT_CLIENT_SECRET,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Didit token error ${res.status}: ${text}`)
  }
  const data = await res.json()
  return data.access_token
}

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    // Get Didit OAuth2 token
    const token = await getDiditToken()

    // Create verification session
    const sessionRes = await fetch(DIDIT_SESSION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        callback: `${SITE_URL}/api/didit/webhook`,
        redirect_url: `${SITE_URL}/verify/complete`,
        vendor_data: userId,
      }),
    })

    if (!sessionRes.ok) {
      const text = await sessionRes.text()
      console.error('Didit session error:', sessionRes.status, text)
      return NextResponse.json({ error: 'Didit session creation failed' }, { status: 500 })
    }

    const session = await sessionRes.json()
    if (!session.url) {
      console.error('Didit missing url in response:', session)
      return NextResponse.json({ error: 'No redirect URL returned by Didit' }, { status: 500 })
    }

    // Save session_id and flip status to in_progress
    const supabase = getSupabaseAdmin()
    await supabase
      .from('profiles')
      .update({ kyc_status: 'in_progress', didit_session_id: session.session_id })
      .eq('id', userId)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('didit/session error:', err)
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
