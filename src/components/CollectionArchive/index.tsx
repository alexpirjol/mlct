import { cn } from '@/utilities/ui'
import React from 'react'
import type { Project, Category } from '@/payload-types'

import { ProjectCard, CardPostData } from '@/components/ProjectCard'
import { CategoryCard } from '@/components/CategoryCard'

export type Props = {
  items?: (Project | Category)[]
  projects?: CardPostData[]
  relationTo?: 'projects' | 'categories'
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { items, projects, relationTo = 'projects' } = props

  // Support legacy projects prop
  const displayItems = items || projects || []

  console.log('here CollectionArchive', relationTo)

  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
      {displayItems?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return (
            <div className="col-span-4" key={index}>
              {relationTo === 'categories' || !('category' in result) ? (
                <CategoryCard className="h-full" doc={result as Category} />
              ) : (
                <ProjectCard
                  className="h-full"
                  doc={result as CardPostData}
                  relationTo="projects"
                  showCategories
                />
              )}
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
