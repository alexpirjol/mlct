import type { Block } from 'payload'
import { colorPickerField } from '@/fields/colorPicker'
import { noVerticalSpacingField } from '@/fields/noVerticalSpacing'
import { noHorizontalSpacingField } from '@/fields/noHorizontalSpacing'

const buildContactInfoBlock = (opts: { forLexical?: boolean } = {}): Block => ({
  slug: 'contactInfo',
  interfaceName: 'ContactInfoBlock',
  fields: [
    ...(opts.forLexical ? [] : [colorPickerField(), noVerticalSpacingField(), noHorizontalSpacingField()]),
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
})

export const ContactInfoBlock = buildContactInfoBlock()
export const ContactInfoBlockForLexical = buildContactInfoBlock({ forLexical: true })
