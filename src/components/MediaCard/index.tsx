'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

export type MediaCardProps = {
  alignItems?: 'center'
  className?: string
  title?: string
  href: string
  imageUrl?: string
  imageWidth?: number
  imageHeight?: number
  imageAlt?: string
}

export const MediaCard: React.FC<MediaCardProps> = ({
  className,
  title,
  href,
  imageUrl,
  imageWidth,
  imageHeight,
  imageAlt = '',
}) => {
  const { card, link } = useClickableCard({})

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      {imageUrl && imageWidth && imageHeight && (
        <div className="relative w-full flex items-center justify-center bg-muted">
          <Image src={imageUrl} width={imageWidth} height={imageHeight} alt={imageAlt} />
        </div>
      )}
      <div className="p-4">
        {title && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {title}
              </Link>
            </h3>
          </div>
        )}
      </div>
    </article>
  )
}
