import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE = 'https://www.inambebar.com'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── Static pages ──────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/trips`,     lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${BASE}/requests`,  lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${BASE}/companion`, lastModified: now, changeFrequency: 'hourly',  priority: 0.8 },
    { url: `${BASE}/auth`,      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`,     lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  // ── Active trips ─────────────────────────────────────────
  const { data: trips } = await supabase
    .from('trips')
    .select('id, updated_at')
    .eq('status', 'active')
    .gte('departure_date', new Date().toISOString().split('T')[0])
    .order('departure_date', { ascending: true })
    .limit(1000)

  const tripRoutes: MetadataRoute.Sitemap = (trips || []).map(t => ({
    url: `${BASE}/trips/${t.id}`,
    lastModified: new Date(t.updated_at ?? now),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // ── Open shipment requests ────────────────────────────────
  const { data: requests } = await supabase
    .from('shipment_requests')
    .select('id, updated_at')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(1000)

  const requestRoutes: MetadataRoute.Sitemap = (requests || []).map(r => ({
    url: `${BASE}/requests/${r.id}`,
    lastModified: new Date(r.updated_at ?? now),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // ── Verified public profiles ──────────────────────────────
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, updated_at')
    .eq('is_verified', true)
    .order('updated_at', { ascending: false })
    .limit(500)

  const profileRoutes: MetadataRoute.Sitemap = (profiles || []).map(p => ({
    url: `${BASE}/profile/${p.id}`,
    lastModified: new Date(p.updated_at ?? now),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...tripRoutes, ...requestRoutes, ...profileRoutes]
}
