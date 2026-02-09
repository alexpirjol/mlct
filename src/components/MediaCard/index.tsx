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
  showBackground?: boolean
}

export const MediaCard: React.FC<MediaCardProps> = ({
  className,
  title,
  href,
  imageUrl,
  imageWidth,
  imageHeight,
  imageAlt = '',
  showBackground = true,
}) => {
  const { card, link } = useClickableCard({})

  return (
    <article
      className={cn('overflow-hidden hover:cursor-pointer', showBackground && 'bg-card', className)}
      ref={card.ref}
    >
      {imageUrl && imageWidth && imageHeight && (
        <div className="relative w-full aspect-[92/59] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            fill
            className="object-cover"
            alt={imageAlt}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className={cn(showBackground && 'p-4')}>
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
