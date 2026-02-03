import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Settings } from '@/payload-types'

export async function getSiteSettings() {
  const settings: Settings = await getCachedGlobal('settings', 1)()
  return settings
}

export function buildMetaTags(settings: Settings, pageSettings?: Partial<Settings>) {
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
