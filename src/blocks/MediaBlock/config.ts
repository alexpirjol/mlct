import type { Block } from 'payload'
import { colorPickerField } from '@/fields/colorPicker'
import { noVerticalSpacingField } from '@/fields/noVerticalSpacing'
import { noHorizontalSpacingField } from '@/fields/noHorizontalSpacing'

const buildMediaBlock = (opts: { forLexical?: boolean } = {}): Block => ({
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    ...(opts.forLexical ? [] : [colorPickerField(), noVerticalSpacingField(), noHorizontalSpacingField()]),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
})

export const MediaBlock = buildMediaBlock()
export const MediaBlockForLexical = buildMediaBlock({ forLexical: true })
