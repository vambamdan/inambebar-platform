import { Resend } from 'resend'
import getSupabaseAdmin from '@/lib/supabaseAdmin'
import { kycSubmittedAdminEmail, kycApprovedEmail, kycRejectedEmail } from '@/lib/emailTemplates'

const ADMIN_EMAIL = 'amirdaniyalm@gmail.com'

export async function POST(request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const supabaseAdmin = getSupabaseAdmin()
    const { type, userId } = await request.json()
    if (!type || !userId) return Response.json({ error: 'Missing fields' }, { status: 400 })

    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId)
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single()

    const userName = profile?.full_name || user?.email?.split('@')[0] || 'User'

    if (type === 'submitted') {
      const { subject, html } = kycSubmittedAdminEmail({ userName, userId })
      await resend.emails.send({
        from: 'Inambebar <notifications@inambebar.com>',
        to: ADMIN_EMAIL,
        subject,
        html,
      })
    } else if (type === 'approved') {
      const { subject, html } = kycApprovedEmail({ userName })
      await resend.emails.send({
        from: 'Inambebar <notifications@inambebar.com>',
        to: user.email,
        subject,
        html,
      })
    } else if (type === 'rejected') {
      const { subject, html } = kycRejectedEmail({ userName })
      await resend.emails.send({
        from: 'Inambebar <notifications@inambebar.com>',
        to: user.email,
        subject,
        html,
      })
    } else {
      return Response.json({ error: 'Unknown type' }, { status: 400 })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('notify/kyc error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
