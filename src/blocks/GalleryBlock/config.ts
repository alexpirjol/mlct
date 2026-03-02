import type { Block } from 'payload'
import { colorPickerField } from '@/fields/colorPicker'
import { noVerticalSpacingField } from '@/fields/noVerticalSpacing'

export const GalleryBlock: Block = {
  slug: 'galleryBlock',
  interfaceName: 'galleryBlock',
  fields: [
    colorPickerField(),
    noVerticalSpacingField(),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      hasMany: true,
    },
  ],
}
