import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'galleryBlock',
  interfaceName: 'galleryBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      hasMany: true,
    },
  ],
}
