import type { Block } from 'payload'

import { hero } from '@/heros/config'
import { colorPickerField } from '@/fields/colorPicker'
import { noVerticalSpacingField } from '@/fields/noVerticalSpacing'
import { noHorizontalSpacingField } from '@/fields/noHorizontalSpacing'

export const Carousel: Block = {
  slug: 'carousel',
  interfaceName: 'Carousel',
  fields: [
    colorPickerField(),
    noVerticalSpacingField(),
    noHorizontalSpacingField(),
    {
      name: 'type',
      type: 'text',
      defaultValue: 'carousel',
      required: true,
      admin: {
        hidden: true,
      },
    },
    ...hero.fields.filter((f) => (f as any).name !== 'type'),
  ],
}
