'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Category } from '@/payload-types'

import { Media } from '@/components/Media'

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
  const href = `/projects/categories/${slug}`

  // heroImage can be (string | null) | Media
  let imageContent: React.ReactNode = <div className="">No image</div>
  if (typeof heroImage === 'string' && heroImage) {
    imageContent = <Media resource={heroImage} size="33vw" />
  } else if (typeof heroImage === 'object' && heroImage?.url) {
    imageContent = <Media resource={heroImage} size="33vw" />
  }

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full ">{imageContent}</div>
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
