import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/(designer)/', '/(client)/'],
    },
    sitemap: 'https://www.timiclassic.com/sitemap.xml',
  }
}
