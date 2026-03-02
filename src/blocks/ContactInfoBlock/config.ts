import type { Block } from 'payload'
import { colorPickerField } from '@/fields/colorPicker'
import { noVerticalSpacingField } from '@/fields/noVerticalSpacing'

export const ContactInfoBlock: Block = {
  slug: 'contactInfo',
  interfaceName: 'ContactInfoBlock',
  fields: [
    colorPickerField(),
    noVerticalSpacingField(),
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
  ],
  labels: {
    singular: 'Contact Info Block',
    plural: 'Contact Info Blocks',
  },
}
