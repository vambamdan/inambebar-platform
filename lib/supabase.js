import { createBrowserClient } from '@supabase/ssr'

// Singleton browser client — safe to call from 'use client' components
let client = null
export function getSupabaseBrowser() {
  if (client) return client
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  return client
}

// Named export kept for backward compat with existing imports
export const supabase = getSupabaseBrowser()
