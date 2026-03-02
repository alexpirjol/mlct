import type { Block } from 'payload'
import { colorPickerField } from '@/fields/colorPicker'
import { noVerticalSpacingField } from '@/fields/noVerticalSpacing'
import { noHorizontalSpacingField } from '@/fields/noHorizontalSpacing'

export const GalleryBlock: Block = {
  slug: 'galleryBlock',
  interfaceName: 'galleryBlock',
  fields: [
    colorPickerField(),
    noVerticalSpacingField(),
    noHorizontalSpacingField(),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      hasMany: true,
    },
  ],
}
