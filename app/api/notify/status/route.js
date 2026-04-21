import { Resend } from 'resend'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { statusChangeEmail } from '@/lib/emailTemplates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { matchId, status } = await request.json()
    if (!matchId || !status) return Response.json({ error: 'Missing fields' }, { status: 400 })

    const { data: match } = await supabaseAdmin
      .from('matches')
      .select('traveler_id, sender_id')
      .eq('id', matchId)
      .single()

    if (!match) return Response.json({ error: 'Match not found' }, { status: 404 })

    // Notify both parties
    const recipientIds = [match.traveler_id, match.sender_id]

    await Promise.allSettled(
      recipientIds.map(async (recipientId) => {
        const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(recipientId)
        const { subject, html } = statusChangeEmail({ recipientName: 'there', status, matchId })
        return resend.emails.send({
          from: 'Inambebar <notifications@inambebar.com>',
          to: user.email,
          subject,
          html,
        })
      })
    )

    return Response.json({ ok: true })
  } catch (err) {
    console.error('notify/status error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
