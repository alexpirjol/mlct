'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'
import Image from 'next/image'

import type { Category, Project as ProjectType } from '@/payload-types'
import { Media } from '@/components/Media'

export type CardPostData = {
  slug: string
  category: Pick<Category, 'slug' | 'title'> // required
  meta?: ProjectType['meta']
  title?: string
}

export const ProjectCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc: CardPostData // required
  relationTo?: 'projects'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, title: titleFromProps } = props
  if (!doc || !doc.slug || !doc.category || !doc.category.slug) {
    return null // or render a fallback/error
  }

  const { slug, category, title, heroImage } = doc

  const titleToUse = titleFromProps || title
  const categorySlug = category.slug
  const href = `/projects/${categorySlug}/${slug}`

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
