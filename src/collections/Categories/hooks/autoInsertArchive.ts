import type { CollectionAfterChangeHook } from 'payload'

/**
 * After a new Category is created, automatically insert a CategoryArchiveBlock
 * into the layout that is pre-configured to show projects for this category.
 * The block is inserted at position 0, before any other blocks.
 */
export const autoInsertCategoryArchive: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req: { payload },
  context,
}) => {
  // Only run on create and prevent re-entrant calls
  if (operation !== 'create' || context.autoInsertArchive) return doc

  // Skip if an archive block was already added by the user during creation
  const alreadyHasArchive = Array.isArray(doc.layout)
    ? doc.layout.some((block: { blockType: string }) => block.blockType === 'archive')
    : false

  if (alreadyHasArchive) return doc

  const archiveBlock = {
    blockType: 'archive',
    populateBy: 'collection',
    relationTo: 'projects',
    categories: [doc.id],
    limit: 50,
  }

  await payload.update({
    collection: 'categories',
    id: doc.id,
    data: {
      layout: [archiveBlock, ...(Array.isArray(doc.layout) ? doc.layout : [])],
    },
    context: { autoInsertArchive: true },
  })

  return doc
}
