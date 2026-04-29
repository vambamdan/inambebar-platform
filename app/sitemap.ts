import { MetadataRoute } from 'next'

const BASE = 'https://www.inambebar.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static pages — highest priority
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/trips`,    lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${BASE}/requests`, lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${BASE}/companion`,lastModified: now, changeFrequency: 'hourly',  priority: 0.8 },
    { url: `${BASE}/auth`,     lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`,    lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  return staticRoutes
}
