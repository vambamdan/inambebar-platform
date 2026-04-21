const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://inambebar.com'

function wrapper(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Inambebar</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#1A2744;border-radius:12px 12px 0 0;padding:24px 32px;">
            <span style="color:#F5A04A;font-size:22px;font-weight:800;letter-spacing:-0.5px;">Inambebar</span>
            <span style="color:rgba(255,255,255,0.35);font-size:13px;margin-left:8px;">اینم ببر</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F1F5F9;border-radius:0 0 12px 12px;border:1px solid #E5E7EB;border-top:none;padding:16px 32px;text-align:center;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;">
              © 2026 Inambebar · <a href="${BASE_URL}/privacy" style="color:#9CA3AF;">Privacy</a> · <a href="${BASE_URL}/terms" style="color:#9CA3AF;">Terms</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function btn(text, href) {
  return `<a href="${href}" style="display:inline-block;background:#E07B29;color:#ffffff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;margin-top:24px;">${text}</a>`
}

function heading(text) {
  return `<h2 style="margin:0 0 12px;color:#1A2744;font-size:20px;font-weight:800;">${text}</h2>`
}

function para(text) {
  return `<p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">${text}</p>`
}

function pill(text, color = '#E07B29') {
  return `<span style="display:inline-block;background:${color}18;color:${color};font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;border:1px solid ${color}40;">${text}</span>`
}

// ── Email: KYC submitted — alert to admin ────────────────────────────────────
export function kycSubmittedAdminEmail({ userName, userId }) {
  const body = `
    ${heading('New KYC submission')}
    ${para(`<strong>${userName || 'A user'}</strong> has submitted their identity documents for review.`)}
    ${para(`User ID: <code style="background:#F1F5F9;padding:2px 6px;border-radius:4px;font-size:13px;">${userId}</code>`)}
    ${btn('Review in Admin Panel', `${BASE_URL}/admin`)}
  `
  return {
    subject: `KYC review needed — ${userName || userId.slice(0, 8)}`,
    html: wrapper(body),
  }
}

// ── Email: KYC approved — notify user ────────────────────────────────────────
export function kycApprovedEmail({ userName }) {
  const body = `
    ${heading('Your identity has been verified ✅')}
    ${para(`Hi ${userName || 'there'}, great news — your identity documents have been reviewed and approved.`)}
    ${para('You now have full access to Inambebar. You can send and carry packages with a verified badge on your profile.')}
    ${btn('Go to Dashboard', `${BASE_URL}/dashboard`)}
  `
  return {
    subject: 'You\'re verified on Inambebar!',
    html: wrapper(body),
  }
}

// ── Email: KYC rejected — notify user ────────────────────────────────────────
export function kycRejectedEmail({ userName }) {
  const body = `
    ${heading('Identity verification unsuccessful')}
    ${para(`Hi ${userName || 'there'}, unfortunately we were unable to verify your identity with the documents submitted.`)}
    ${para('Common reasons: blurry photos, ID not fully visible, selfie doesn\'t clearly match the ID. Please try again with clearer photos.')}
    ${btn('Try Again', `${BASE_URL}/verify`)}
  `
  return {
    subject: 'Action needed — Inambebar identity verification',
    html: wrapper(body),
  }
}

// ── Email: new match (someone contacted you) ─────────────────────────────────
export function newMatchEmail({ recipientName, senderName, route, matchId }) {
  const body = `
    ${heading(`${senderName} wants to connect with you`)}
    ${para(`You have a new match on Inambebar. ${senderName} has reached out about a shipment on the <strong>${route}</strong> route.`)}
    ${para('Head to your matches to see their message and decide whether to accept.')}
    ${btn('View Match', `${BASE_URL}/matches/${matchId}`)}
  `
  return {
    subject: `New match from ${senderName} — ${route}`,
    html: wrapper(body),
  }
}

// ── Email: new message ───────────────────────────────────────────────────────
export function newMessageEmail({ recipientName, senderName, preview, matchId }) {
  const safePreview = preview.length > 120 ? preview.slice(0, 120) + '…' : preview
  const body = `
    ${heading(`New message from ${senderName}`)}
    ${para('You have an unread message on Inambebar:')}
    <blockquote style="margin:16px 0;padding:14px 18px;background:#F8FAFC;border-left:3px solid #E07B29;border-radius:0 8px 8px 0;color:#374151;font-size:14px;font-style:italic;">
      "${safePreview}"
    </blockquote>
    ${btn('Reply', `${BASE_URL}/matches/${matchId}`)}
  `
  return {
    subject: `${senderName} sent you a message`,
    html: wrapper(body),
  }
}

// ── Email: status change ─────────────────────────────────────────────────────
const STATUS_COPY = {
  accepted:   { title: 'Match accepted!',         body: 'Great news — both parties have agreed. Your shipment is on its way to being arranged.',     pillText: 'Accepted',    pillColor: '#10B981' },
  in_transit: { title: 'Shipment is in transit',   body: 'Your item is now with the traveler and in transit to its destination. Stay tuned!',         pillText: 'In Transit',  pillColor: '#3B82F6' },
  delivered:  { title: 'Delivery confirmed!',      body: 'The shipment has been delivered. Please leave a review to help build trust in the community.', pillText: 'Delivered',   pillColor: '#10B981' },
  cancelled:  { title: 'Match cancelled',          body: 'This match has been cancelled. You can browse other travelers or requests on the platform.',   pillText: 'Cancelled',   pillColor: '#EF4444' },
}

export function statusChangeEmail({ recipientName, status, matchId }) {
  const copy = STATUS_COPY[status] || { title: 'Match update', body: 'Your match status has been updated.', pillText: status, pillColor: '#6B7280' }
  const body = `
    ${heading(copy.title)}
    <p style="margin:0 0 16px;">${pill(copy.pillText, copy.pillColor)}</p>
    ${para(copy.body)}
    ${btn('View Match', `${BASE_URL}/matches/${matchId}`)}
  `
  return {
    subject: copy.title,
    html: wrapper(body),
  }
}
