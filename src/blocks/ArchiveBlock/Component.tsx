import type { Project, Category, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import { isEmptyLexical } from '@/utilities/isEmptyLexical'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
    noHorizontalSpacing?: boolean | null
    projects?: (string | Project)[] | null
  }
> = async (props) => {
  const {
    id,
    categories,
    projects: projectsFromProps,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    relationTo,
    noHorizontalSpacing,
  } = props

  const limit = limitFromProps || 100

  let items: (Project | Category)[] = []

  if (populateBy === 'collection') {
    if (relationTo === 'categories') {
      // Use the categories array directly — order is preserved from the admin UI.
      // If no categories are selected, fall back to a full fetch.
      if (categories?.length) {
        items = categories.filter((c): c is Category => typeof c === 'object')
      } else {
        const payload = await getPayload({ config: configPromise })
        const fetched = await payload.find({ collection: 'categories', depth: 1, limit })
        items = fetched.docs
      }
    } else if (relationTo === 'projects') {
      // If projects are manually ordered, use that list directly.
      // Otherwise fetch all projects, optionally filtered by selected categories.
      if (projectsFromProps?.length) {
        items = projectsFromProps.filter((p): p is Project => typeof p === 'object')
      } else {
        const flattenedCategories = categories?.map((c) => (typeof c === 'object' ? c.id : c))
        const payload = await getPayload({ config: configPromise })
        const fetched = await payload.find({
          collection: 'projects',
          depth: 1,
          limit,
          ...(flattenedCategories?.length
            ? { where: { category: { in: flattenedCategories } } }
            : {}),
        })
        items = fetched.docs
      }
    }
  } else {
    // Individual selection — the array order is exactly what the editor saved.
    items = (selectedDocs ?? [])
      .map((doc) => (typeof doc.value === 'object' ? (doc.value as Project | Category) : null))
      .filter(Boolean) as (Project | Category)[]
  }

  return (
    <div className={noHorizontalSpacing ? undefined : 'container'} id={`block-${id}`}>
      {!isEmptyLexical(introContent) && (
        <div className=" mb-8">
          <RichText className="ms-0 " data={introContent!} enableGutter={false} />
        </div>
      )}
      <CollectionArchive items={items} relationTo={relationTo || 'projects'} />
    </div>
  )
}
