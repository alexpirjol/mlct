import type { Block } from 'payload'

export const ContactInfoBlock: Block = {
  slug: 'contactInfo',
  interfaceName: 'ContactInfoBlock',
  fields: [
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
