import { cn } from '@/utilities/ui'
import React from 'react'

import { CategoryCard } from '@/components/CategoryCard'

import type { CardPostData } from '@/components/CategoryCard'

export type Props = {
  categories: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { categories } = props

  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {categories?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={index}>
                  <CategoryCard className="h-full" doc={result} />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
