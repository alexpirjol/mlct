import type { Project, Category, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    relationTo,
  } = props

  const limit = limitFromProps || 3

  let projects: Project[] = []
  let categoryDocs: Category[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    if (relationTo === 'projects') {
      const flattenedCategories = categories?.map((category) => {
        if (typeof category === 'object') return category.id
        else return category
      })

      const fetchedProjects = await payload.find({
        collection: 'projects',
        depth: 1,
        limit,
        ...(flattenedCategories && flattenedCategories.length > 0
          ? {
              where: {
                category: {
                  in: flattenedCategories,
                },
              },
            }
          : {}),
      })

      projects = fetchedProjects.docs
    } else if (relationTo === 'categories') {
      const fetchedCategories = await payload.find({
        collection: 'categories',
        depth: 1,
        limit,
      })

      categoryDocs = fetchedCategories.docs
    }
  } else {
    if (selectedDocs?.length) {
      const filteredDocs = selectedDocs
        .map((doc) => {
          if (typeof doc.value === 'object') return doc.value
          return null
        })
        .filter(Boolean)

      // Separate by type
      projects = filteredDocs.filter((doc) => doc && 'category' in doc) as Project[]
      categoryDocs = filteredDocs.filter((doc) => doc && !('category' in doc)) as Category[]
    }
  }

  const items = relationTo === 'categories' ? categoryDocs : projects

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive items={items} relationTo={relationTo || 'projects'} />
    </div>
  )
}
