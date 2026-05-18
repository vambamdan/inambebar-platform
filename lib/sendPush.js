/**
 * sendPush.js — server-side helper to send Web Push to a user's subscriptions
 *
 * Requires:
 *   npm install web-push
 *   NEXT_PUBLIC_VAPID_PUBLIC_KEY — your VAPID public key
 *   VAPID_PRIVATE_KEY            — your VAPID private key (server-only)
 *   VAPID_EMAIL                  — your email (used in VAPID contact header)
 *
 * Generate keys once: npx web-push generate-vapid-keys
 */

import getSupabaseAdmin from './supabaseAdmin'

let _webpush = null

async function getWebpush() {
  if (_webpush) return _webpush
  try {
    const mod = await import('web-push')
    _webpush = mod.default ?? mod
    _webpush.setVapidDetails(
      `mailto:${process.env.VAPID_EMAIL || 'hello@inambebar.com'}`,
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    )
    return _webpush
  } catch {
    // web-push not installed — push silently disabled
    return null
  }
}

/**
 * Send a push notification to all of a user's registered devices.
 * @param {string} userId — Supabase user UUID
 * @param {{ title: string, body: string, url?: string, tag?: string }} payload
 */
export async function sendPushToUser(userId, { title, body, url = '/', tag }) {
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return
  const webpush = await getWebpush()
  if (!webpush) return

  const supabaseAdmin = getSupabaseAdmin()
  const { data: subs } = await supabaseAdmin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', userId)

  if (!subs?.length) return

  const payloadStr = JSON.stringify({ title, body, url, tag })

  await Promise.allSettled(
    subs.map(sub =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payloadStr
      ).catch(async err => {
        // 410 = subscription expired — clean it up
        if (err.statusCode === 410) {
          await supabaseAdmin.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
        }
      })
    )
  )
}
