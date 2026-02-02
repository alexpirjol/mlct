'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

import type { Category } from '@/payload-types'

export type CardPostData = Pick<Category, 'slug' | 'title' | 'heroImage'>

export const CategoryCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})

  const { className, doc, title: titleFromProps } = props

  const { slug, title, heroImage } = doc || {}

  const titleToUse = titleFromProps || title
  const href = `/projects/${slug}`
  const { url: imgSrc, width, height } = heroImage?.sizes.square ?? {}

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full flex items-center justify-center bg-muted">
        <Image src={imgSrc} width={width} height={height} alt={titleToUse || ''} />
      </div>
      <div className="p-4">
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
      </div>
    </article>
  )
}
