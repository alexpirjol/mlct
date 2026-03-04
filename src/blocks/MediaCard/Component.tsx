'use client'
import React from 'react'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import RichText from '@/components/RichText'
import { isEmptyLexical } from '@/utilities/isEmptyLexical'
import { CMSLink } from '@/components/Link'

import type { MediaCardBlock as MediaCardBlockProps } from '@/payload-types'

type Props = MediaCardBlockProps & {
  className?: string
  disableInnerContainer?: boolean
  enableGutter?: boolean
  equalHeights?: number | string
  noHorizontalSpacing?: boolean | null
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
  equalHeights,
  noHorizontalSpacing,
}) => {
  const { card, link } = useClickableCard({})

  // Determine if we should link the whole card
  // Link whole card if CTA is enabled, has a link target, but no label
  const hasLinkTarget =
    (ctaLink?.type === 'custom' && !!ctaLink?.url) ||
    (ctaLink?.type === 'reference' && !!ctaLink?.reference?.value)
  const shouldLinkWholeCard = enableCTA && hasLinkTarget && !ctaLink?.label

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

  const renderMedia = () => {
    const fixedHeightStyle = equalHeights
      ? { height: typeof equalHeights === 'number' ? `${equalHeights}px` : equalHeights }
      : undefined

    const pictureClasses = cn(
      'relative w-full bg-muted overflow-hidden block mt-0 mb-0',
      isHorizontal ? 'h-full min-h-[300px]' : !equalHeights && 'aspect-[92/59]',
    )

    return (
      <picture className={pictureClasses} style={fixedHeightStyle}>
        {media && typeof media === 'object' && media?.url && (
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={media.url}
            alt={title ?? 'Media'}
          />
        )}
        {shouldLinkWholeCard && (
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <div
              className="flex items-center justify-center rounded-full w-14 h-14"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              <i
                className="fa-solid fa-magnifying-glass text-xl"
                style={{ color: 'var(--accent)' }}
              />
            </div>
          </div>
        )}
      </picture>
    )
  }

  const renderContent = () => {
    // Determine padding based on noBackground and displayType
    const noVerticalBgLayout =
      noBackground && (displayType === 'imageTop' || displayType === 'imageBottom')
    const paddingClass = noVerticalBgLayout ? 'pt-4 pb-4 pr-4' : 'p-6'

    // Don't apply container (horizontal padding) when noBackground with vertical layout
    const shouldApplyContainer =
      enableGutter &&
      !noHorizontalSpacing &&
      !(noBackground && (displayType === 'imageTop' || displayType === 'imageBottom'))

    return (
      <div
        className={cn(paddingClass, 'flex flex-col gap-4', {
          container: shouldApplyContainer,
        })}
      >
        {title && (
          <h3
            className="text-2xl font-semibold"
            style={noBackground ? { color: 'white' } : undefined}
          >
            {title}
          </h3>
        )}
        {!isEmptyLexical(richText) && (
          <div className="prose dark:prose-invert max-w-none">
            <RichText data={richText!} enableGutter={false} />
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
          container: !disableInnerContainer && !noHorizontalSpacing,
        },
        classNameProp,
      )}
    >
      <article
        className={cn(
          'overflow-hidden',
          !noBackground && 'bg-card',
          shouldLinkWholeCard && 'hover:cursor-pointer group',
        )}
        ref={shouldLinkWholeCard ? card.ref : undefined}
      >
        {shouldLinkWholeCard && (
          <Link href={wholeCardHref} ref={link.ref} className="sr-only" tabIndex={-1} aria-hidden>
            {title}
          </Link>
        )}
        {displayType === 'imageTop' && (
          <>
            {renderMedia()}
            {renderContent()}
          </>
        )}

        {displayType === 'imageBottom' && (
          <div className="flex flex-col-reverse lg:flex-col">
            {renderContent()}
            {renderMedia()}
          </div>
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
            <div
              className={cn('col-span-12 order-last lg:order-first', contentRatioClasses[ratioKey])}
            >
              {renderContent()}
            </div>
            <div
              className={cn('col-span-12 order-first lg:order-last', imageRatioClasses[ratioKey])}
            >
              {renderMedia()}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
