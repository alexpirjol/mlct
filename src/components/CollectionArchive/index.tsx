import React from 'react'
import type { Project, Category, Media } from '@/payload-types'
import { MediaCardBlock } from '@/blocks/MediaCard/Component'

export type Props = {
  items?: (Project | Category)[]
  projects?: (Project | Category)[]
  relationTo?: 'projects' | 'categories'
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { items, projects, relationTo = 'projects' } = props

  // Support legacy projects prop
  const displayItems = items || projects || []

  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
      {displayItems?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          // Build href based on item type
          let href = '#'
          let title = ''
          let media: string | Media = ''

          if (relationTo === 'categories' || !('category' in result)) {
            // Category item
            const category = result as Category
            href = `/projects/${category.slug}`
            title = category.title || ''
            media = (category.heroImage ?? '') as string | Media
          } else {
            // Project item
            const project = result as Project
            const categorySlug = typeof project.category === 'object' ? project.category.slug : ''
            href = `/projects/${categorySlug}/${project.slug}`
            title = project.title || ''
            media = (project.heroImage ?? '') as string | Media
          }

          return (
            <div className="col-span-4" key={index}>
              <MediaCardBlock
                displayType="imageTop"
                media={media}
                title={title}
                enableCTA={true}
                ctaLink={{
                  type: 'custom',
                  url: href,
                  label: 'View',
                }}
                noBackground={true}
                disableInnerContainer={true}
                blockType="mediaCard"
              />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
