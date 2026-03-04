import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Before a new Project is first saved, inject an empty GalleryBlock into the layout
 * so the editor can just drop images in without adding the block manually.
 */
export const autoInsertProjectBlocks: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation !== 'create') return data

  const alreadyHasGallery = Array.isArray(data.layout)
    ? data.layout.some((block: { blockType: string }) => block.blockType === 'galleryBlock')
    : false

  if (alreadyHasGallery) return data

  return {
    ...data,
    layout: [
      ...(Array.isArray(data.layout) ? data.layout : []),
      { blockType: 'galleryBlock', media: [] },
    ],
  }
}
