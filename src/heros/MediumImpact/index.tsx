import React from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { isEmptyLexical } from '@/utilities/isEmptyLexical'

export const MediumImpactHero: React.FC<Partial<NonNullable<Page['hero']>>> = ({
  media,
  richText,
}) => {
  const heroImage = media ?? undefined
  return (
    <div className="relative -mt-[10.4rem] flex items-end text-white" data-theme="dark">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] pb-8 hero-text">
        <div className="col-start-1 col-span-1 md:col-span-2">
          {!isEmptyLexical(richText) && <RichText data={richText!} enableGutter={false} />}
        </div>
      </div>
      <div className="min-h-[50vh] md:min-h-[80vh] select-none">
        {heroImage && typeof heroImage === 'object' && heroImage !== null && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-linear-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
