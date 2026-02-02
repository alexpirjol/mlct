import { getCachedGlobal } from '@/utilities/getGlobals'
import type { SEO } from '@/payload-types'

export async function getSiteSEO() {
  const seo: SEO = await getCachedGlobal('seo', 1)()
  return seo
}

export function buildMetaTags(seo: SEO, pageSEO?: Partial<SEO>) {
  const lang = pageSEO?.language || seo.language || 'ro'
  const meta = {
    title: pageSEO?.siteTitle || seo.siteTitle,
    description: pageSEO?.siteDescription || seo.siteDescription,
    url: pageSEO?.siteUrl || seo.siteUrl,
    lang,
    ...seo,
    ...pageSEO,
  }
  return [
    { name: 'description', content: meta.description },
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    { property: 'og:url', content: meta.url },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: lang === 'ro' ? 'ro_RO' : lang },
    { name: 'language', content: lang },
    // Add more as needed
  ]
}
