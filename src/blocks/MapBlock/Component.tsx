import React from 'react'
import type { MapBlock as MapBlockType } from '@/payload-types'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { cn } from '@/utilities/ui'

type Props = MapBlockType & {
  disableInnerContainer?: boolean
  noHorizontalSpacing?: boolean | null
}

export const MapBlock: React.FC<Props> = async (props) => {
  const {
    location,
    height = '100',
    width = '100',
    disableInnerContainer,
    noHorizontalSpacing,
  } = props

  const settings = await getSiteSettings()
  const settingsLocation = settings?.contact?.location || ''

  const mapLocation = location || settingsLocation

  if (!mapLocation) {
    return null
  }

  const containerHeight = 400 * (Number(height) / 100) // Base height is 400px
  const containerWidth = `${width}%`

  return (
    <div
      className={cn('', {
        container: !disableInnerContainer && !noHorizontalSpacing,
      })}
    >
      <div className="mx-auto" style={{ width: containerWidth }}>
        <iframe
          src={mapLocation}
          width="100%"
          height={containerHeight}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full "
        />
      </div>
    </div>
  )
}
