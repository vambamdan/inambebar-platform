import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/auth/callback'],
      },
    ],
    sitemap: 'https://www.inambebar.com/sitemap.xml',
    host: 'https://www.inambebar.com',
  }
}
