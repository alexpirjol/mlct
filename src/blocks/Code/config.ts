import type { Block } from 'payload'
import { colorPickerField } from '@/fields/colorPicker'
import { noVerticalSpacingField } from '@/fields/noVerticalSpacing'

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    colorPickerField(),
    noVerticalSpacingField(),
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        {
          label: 'Typescript',
          value: 'typescript',
        },
        {
          label: 'Javascript',
          value: 'javascript',
        },
        {
          label: 'CSS',
          value: 'css',
        },
      ],
    },
    {
      name: 'code',
      type: 'code',
      label: false,
      required: true,
    },
  ],
}
