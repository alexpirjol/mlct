import type { Block } from 'payload'
import { colorPickerField } from '@/fields/colorPicker'

export const GalleryBlock: Block = {
  slug: 'galleryBlock',
  interfaceName: 'galleryBlock',
  fields: [
    colorPickerField(),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      hasMany: true,
    },
  ],
}
