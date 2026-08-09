import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { path: '/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { path: '/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { path: '/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ] as const

  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
