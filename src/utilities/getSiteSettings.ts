import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Setting } from '@/payload-types'

export async function getSiteSettings() {
  const settings: Setting = await getCachedGlobal('setting', 1)()
  return settings
}
