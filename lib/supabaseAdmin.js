import { createClient } from '@supabase/supabase-js'

let client = null

export default function getSupabaseAdmin() {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase admin env vars missing')
  client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  return client
}
