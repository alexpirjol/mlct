'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

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
  const { className, doc, showCategories, title: titleFromProps } = props
  if (!doc || !doc.slug || !doc.category || !doc.category.slug) {
    return null // or render a fallback/error
  }

  const { slug, category, meta, title } = doc
  const { description, image: metaImage } = meta || {}

  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  // Only one category is allowed and required, always has slug
  const categorySlug = category.slug
  const href = `/projects/${categorySlug}/${slug}`

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full ">
        {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
      </div>
      <div className="p-4">
        {showCategories && category?.title && (
          <div className="uppercase text-sm mb-4">{category.title}</div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  )
}
