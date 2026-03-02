import type { Block } from 'payload'
import { colorPickerField } from '@/fields/colorPicker'

export const ContactInfoBlock: Block = {
  slug: 'contactInfo',
  interfaceName: 'ContactInfoBlock',
  fields: [
    colorPickerField(),
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
