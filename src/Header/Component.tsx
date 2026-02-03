import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'

import type { Header, Setting } from '@/payload-types'

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()
  const settingsData: Setting = await getCachedGlobal<'setting'>('setting', 2)()

  console.log('settingsData', settingsData)

  return (
    <HeaderClient
      data={{
        ...headerData,
        ...settingsData,
      }}
    />
  )
}
