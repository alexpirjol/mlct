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
    <div className="">
      <div className="container mb-8 hero-text">
        {!isEmptyLexical(richText) && (
          <RichText className="mb-6" data={richText!} enableGutter={false} />
        )}
      </div>
      <div className="container ">
        {heroImage &&
          (typeof heroImage === 'string' ||
            typeof heroImage === 'number' ||
            (typeof heroImage === 'object' && heroImage !== null)) && (
            <div>
              <Media
                className="-mx-4 md:-mx-8 2xl:-mx-16"
                imgClassName=""
                priority
                resource={heroImage}
              />
              {typeof heroImage === 'object' && heroImage?.caption && (
                <div className="mt-3">
                  <RichText data={heroImage.caption} enableGutter={false} />
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  )
}
