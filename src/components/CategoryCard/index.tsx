'use client'
import React from 'react'
import type { Category } from '@/payload-types'
import { MediaCard } from '@/components/MediaCard'

export type CardPostData = Pick<Category, 'slug' | 'title' | 'heroImage'>

export const CategoryCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  title?: string
}> = (props) => {
  const { className, doc, title: titleFromProps } = props

  const { slug, title, heroImage } = doc || {}
  const titleToUse = titleFromProps || title
  const href = `/projects/${slug}`
  const {
    url: imgSrc,
    width,
    height,
  } = typeof heroImage === 'object' && heroImage?.sizes?.square ? heroImage.sizes.square : {}

  return (
    <MediaCard
      className={className}
      title={titleToUse}
      href={href}
      imageUrl={imgSrc ?? undefined}
      imageWidth={width ?? undefined}
      imageHeight={height ?? undefined}
      imageAlt={titleToUse || ''}
      showBackground={false}
    />
  )
}
