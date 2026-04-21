import { Resend } from 'resend'
import getSupabaseAdmin from '@/lib/supabaseAdmin'
import { newMatchEmail } from '@/lib/emailTemplates'

export async function POST(request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const supabaseAdmin = getSupabaseAdmin()
    const { matchId, recipientId } = await request.json()
    if (!matchId || !recipientId) return Response.json({ error: 'Missing fields' }, { status: 400 })

    // Fetch match + trip/request details
    const { data: match } = await supabaseAdmin
      .from('matches')
      .select(`
        id,
        trip_id,
        traveler_id,
        sender_id,
        trips(origin_city, destination_city),
        shipment_requests(origin_city, destination_city)
      `)
      .eq('id', matchId)
      .single()

    if (!match) return Response.json({ error: 'Match not found' }, { status: 404 })

    // Get recipient and sender emails + names
    const { data: { user: recipient } } = await supabaseAdmin.auth.admin.getUserById(recipientId)
    const senderId = recipientId === match.traveler_id ? match.sender_id : match.traveler_id
    const { data: { user: sender } } = await supabaseAdmin.auth.admin.getUserById(senderId)

    const { data: recipientProfile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', recipientId)
      .single()

    const { data: senderProfile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', senderId)
      .single()

    const tripData = match.trips || match.shipment_requests
    const route = tripData ? `${tripData.origin_city} → ${tripData.destination_city}` : 'Unknown route'

    const { subject, html } = newMatchEmail({
      recipientName: recipientProfile?.full_name || 'there',
      senderName: senderProfile?.full_name || 'Someone',
      route,
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
    console.error('notify/match error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
