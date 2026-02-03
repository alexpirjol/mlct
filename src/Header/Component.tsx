import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header, Settings } from '@/payload-types'

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()
  const settingsData: Settings = await getCachedGlobal('settings', 1)()

  console.log('settingsData', settingsData)

  return <HeaderClient data={headerData} />
}
