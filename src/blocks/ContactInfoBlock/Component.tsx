import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { ContactInfo } from '@/components/ContactInfo'
import type { Setting } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Props = {
  title?: string | null
  className?: string
  enableGutter?: boolean
  noHorizontalSpacing?: boolean | null
}

export const ContactInfoBlock = async ({
  title,
  className,
  enableGutter = true,
  noHorizontalSpacing,
}: Props) => {
  const settings: Setting = await getCachedGlobal('setting', 1)()

  return (
    <div
      className={cn(
        {
          container: enableGutter && !noHorizontalSpacing,
        },
        className,
      )}
    >
      {title && <h2 className="text-center mb-8">{title}</h2>}
      <ContactInfo
        contact={settings.contact}
        workHours={settings.organization?.workHours}
        variant="block"
      />
    </div>
  )
}
