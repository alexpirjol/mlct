import type { Block } from 'payload'
import { colorPickerField } from '@/fields/colorPicker'
import { noVerticalSpacingField } from '@/fields/noVerticalSpacing'
import { noHorizontalSpacingField } from '@/fields/noHorizontalSpacing'

const buildGalleryBlock = (opts: { forLexical?: boolean } = {}): Block => ({
  slug: 'galleryBlock',
  interfaceName: 'galleryBlock',
  fields: [
    ...(opts.forLexical ? [] : [colorPickerField(), noVerticalSpacingField(), noHorizontalSpacingField()]),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      hasMany: true,
    },
  ],
})

export const GalleryBlock = buildGalleryBlock()
export const GalleryBlockForLexical = buildGalleryBlock({ forLexical: true })
