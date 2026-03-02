import type { Block } from 'payload'
import { colorPickerField } from '@/fields/colorPicker'
import { noVerticalSpacingField } from '@/fields/noVerticalSpacing'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    colorPickerField(),
    noVerticalSpacingField(),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
