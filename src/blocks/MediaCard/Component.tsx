'use client'
import React from 'react'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

import type { MediaCardBlock as MediaCardBlockProps } from '@/payload-types'

type Props = MediaCardBlockProps & {
  className?: string
  disableInnerContainer?: boolean
  enableGutter?: boolean
}

export const MediaCardBlock: React.FC<Props> = ({
  className: classNameProp,
  displayType = 'imageTop',
  imageRatio = 'half',
  media,
  title,
  richText,
  enableCTA,
  ctaLink,
  disableInnerContainer,
  enableGutter = true,
  noBackground = false,
}) => {
  console.log('disableInnerContainer', disableInnerContainer)
  const { card, link } = useClickableCard({})

  // Determine if we should link the whole card
  // Link whole card if CTA is enabled, has a link, but no label
  const shouldLinkWholeCard = enableCTA && ctaLink?.url && !ctaLink?.label

  // Determine the href for whole card linking
  let wholeCardHref = ''
  if (shouldLinkWholeCard && ctaLink) {
    if (ctaLink.type === 'reference' && typeof ctaLink.reference?.value === 'object') {
      const slug = ctaLink.reference.value.slug
      const relationTo = ctaLink.reference.relationTo
      wholeCardHref = relationTo !== 'pages' ? `/${relationTo}/${slug}` : `/${slug}`
    } else if (ctaLink.type === 'custom' && ctaLink.url) {
      wholeCardHref = ctaLink.url
    }
  }

  // Image ratio classes for left/right layouts
  const imageRatioClasses: Record<string, string> = {
    quarter: 'lg:col-span-3', // 25%
    third: 'lg:col-span-4', // 33%
    half: 'lg:col-span-6', // 50%
    twoThirds: 'lg:col-span-8', // 66%
    threeQuarters: 'lg:col-span-9', // 75%
  }

  const contentRatioClasses: Record<string, string> = {
    quarter: 'lg:col-span-9', // 75%
    third: 'lg:col-span-8', // 66%
    half: 'lg:col-span-6', // 50%
    twoThirds: 'lg:col-span-4', // 33%
    threeQuarters: 'lg:col-span-3', // 25%
  }

  const isHorizontal = displayType === 'imageLeft' || displayType === 'imageRight'
  const ratioKey = imageRatio || 'half'

  const renderMedia = () => (
    <div
      className={cn(
        'relative w-full bg-muted overflow-hidden',
        isHorizontal ? 'h-full min-h-[300px]' : 'aspect-[92/59]',
      )}
    >
      {media && typeof media === 'object' && (
        <Media resource={media} className="w-full h-full" imgClassName="object-cover" fill />
      )}
    </div>
  )

  const renderContent = () => {
    // Determine padding based on noBackground and displayType
    let paddingClass = 'p-6'
    if (noBackground) {
      if (displayType === 'imageTop') paddingClass = 'pt-6'
      else if (displayType === 'imageBottom') paddingClass = 'pb-6'
      else if (displayType === 'imageLeft') paddingClass = 'pl-6'
      else if (displayType === 'imageRight') paddingClass = 'pr-6'
    }

    // Don't apply container (horizontal padding) when noBackground with vertical layout
    const shouldApplyContainer =
      enableGutter &&
      !(noBackground && (displayType === 'imageTop' || displayType === 'imageBottom'))

    return (
      <div
        className={cn(paddingClass, 'flex flex-col gap-4', {
          container: shouldApplyContainer,
        })}
      >
        {title && (
          <h3 className="text-2xl font-semibold !text-white">
            {shouldLinkWholeCard ? (
              <Link href={wholeCardHref} ref={link.ref} className="hover:underline">
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>
        )}
        {richText && (
          <div className="prose dark:prose-invert max-w-none">
            <RichText data={richText} enableGutter={false} />
          </div>
        )}
        {enableCTA && ctaLink?.label && ctaLink && (
          <div className="mt-2">
            <CMSLink {...ctaLink} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        {
          container: !disableInnerContainer,
        },
        classNameProp,
      )}
    >
      <article
        className={cn(
          'overflow-hidden',
          !noBackground && 'bg-card',
          shouldLinkWholeCard && 'hover:cursor-pointer',
        )}
        ref={shouldLinkWholeCard ? card.ref : undefined}
      >
        {displayType === 'imageTop' && (
          <>
            {renderMedia()}
            {renderContent()}
          </>
        )}

        {displayType === 'imageBottom' && (
          <>
            {renderContent()}
            {renderMedia()}
          </>
        )}

        {displayType === 'imageLeft' && (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className={cn('col-span-12', imageRatioClasses[ratioKey])}>{renderMedia()}</div>
            <div className={cn('col-span-12', contentRatioClasses[ratioKey])}>
              {renderContent()}
            </div>
          </div>
        )}

        {displayType === 'imageRight' && (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className={cn('col-span-12', contentRatioClasses[ratioKey])}>
              {renderContent()}
            </div>
            <div className={cn('col-span-12', imageRatioClasses[ratioKey])}>{renderMedia()}</div>
          </div>
        )}
      </article>
    </div>
  )
}
