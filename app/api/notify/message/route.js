import { Resend } from 'resend'
import getSupabaseAdmin from '@/lib/supabaseAdmin'
import { newMessageEmail } from '@/lib/emailTemplates'

export async function POST(request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const supabaseAdmin = getSupabaseAdmin()
    const { matchId, senderId, preview } = await request.json()
    if (!matchId || !senderId || !preview) return Response.json({ error: 'Missing fields' }, { status: 400 })

    // Fetch match to find the other party
    const { data: match } = await supabaseAdmin
      .from('matches')
      .select('traveler_id, sender_id')
      .eq('id', matchId)
      .single()

    if (!match) return Response.json({ error: 'Match not found' }, { status: 404 })

    // Don't notify yourself
    const recipientId = senderId === match.traveler_id ? match.sender_id : match.traveler_id

    // Check: skip if recipient sent a message in the last 30 minutes (they're active)
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
    const { data: recentActivity } = await supabaseAdmin
      .from('messages')
      .select('id')
      .eq('match_id', matchId)
      .eq('sender_id', recipientId)
      .gte('created_at', thirtyMinsAgo)
      .limit(1)

    if (recentActivity?.length > 0) return Response.json({ ok: true, skipped: 'recipient active' })

    const { data: { user: recipient } } = await supabaseAdmin.auth.admin.getUserById(recipientId)
    const { data: senderProfile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', senderId)
      .single()

    const { subject, html } = newMessageEmail({
      recipientName: 'there',
      senderName: senderProfile?.full_name || 'Someone',
      preview,
      matchId,
    })

    await resend.emails.send({
      from: 'Inambebar <notifications@inambebar.com>',
      to: recipient.email,
      subject,
      html,
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('notify/message error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
