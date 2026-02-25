'use client'
import React from 'react'
import type { Category, Project as ProjectType } from '@/payload-types'
import { MediaCard } from '@/components/MediaCard'

export type CardPostData = {
  slug: string
  category: Pick<Category, 'slug' | 'title'> // required
  meta?: ProjectType['meta']
  title?: string
  heroImage?: any
}

export const ProjectCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc: CardPostData // required
  relationTo?: 'projects'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { className, doc, title: titleFromProps } = props
  if (!doc || !doc.slug || !doc.category || !doc.category.slug) {
    return null // or render a fallback/error
  }

  const { slug, category, title, heroImage } = doc || {}

  const titleToUse = titleFromProps || title
  const categorySlug = category.slug
  const href = `/projects/${categorySlug}/${slug}`

  const { url: imgSrc, width, height } = heroImage?.sizes?.square ?? {}

  return (
    <MediaCard
      className={className}
      title={titleToUse}
      href={href}
      imageUrl={imgSrc}
      imageWidth={width}
      imageHeight={height}
      imageAlt={titleToUse || ''}
      showBackground={false}
    />
  )
}
