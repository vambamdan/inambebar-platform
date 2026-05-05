import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import getSupabaseAdmin from '@/lib/supabaseAdmin'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://inambebar.com'

export async function POST(req) {
  try {
    const body = await req.text()

    // ── Verify webhook signature ──
    const webhookSecret = process.env.DIDIT_WEBHOOK_SECRET
    if (webhookSecret) {
      const sig = req.headers.get('x-didit-signature') || ''
      const expected = createHmac('sha256', webhookSecret).update(body).digest('hex')
      if (sig !== expected) {
        console.warn('Didit webhook: invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const payload = JSON.parse(body)
    const { status, vendor_data: userId, session_id } = payload

    // vendor_data is the userId we passed at session creation
    if (!userId) {
      console.warn('Didit webhook: no vendor_data (userId) in payload', payload)
      return NextResponse.json({ ok: true })
    }

    const supabase = getSupabaseAdmin()

    if (status === 'Approved') {
      await supabase
        .from('profiles')
        .update({ kyc_status: 'approved', is_verified: true })
        .eq('id', userId)

      // Email user: approved
      fetch(`${SITE_URL}/api/notify/kyc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'approved', userId }),
      }).catch(() => {})

    } else if (status === 'Declined') {
      await supabase
        .from('profiles')
        .update({ kyc_status: 'rejected', is_verified: false })
        .eq('id', userId)

      // Email user: rejected
      fetch(`${SITE_URL}/api/notify/kyc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'rejected', userId }),
      }).catch(() => {})

    } else if (status === 'Expired') {
      // Session expired without completion — reset so user can try again
      await supabase
        .from('profiles')
        .update({ kyc_status: 'not_started', didit_session_id: null })
        .eq('id', userId)
    }

    console.log(`Didit webhook: userId=${userId} status=${status} session=${session_id}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('didit/webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
