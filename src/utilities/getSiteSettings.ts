import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Setting } from '@/payload-types'

export async function getSiteSettings() {
  const settings: Setting = await getCachedGlobal('settings', 1)()
  return settings
}

// Accepts Setting type
export function buildMetaTags(settings: Setting, pageSettings?: Partial<Setting>) {
  const lang = pageSettings?.language || settings.language || 'ro'
  const meta = {
    title: pageSettings?.siteTitle || settings.siteTitle,
    description: pageSettings?.siteDescription || settings.siteDescription,
    url: pageSettings?.siteUrl || settings.siteUrl,
    lang,
    ...settings,
    ...pageSettings,
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
