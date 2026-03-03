import type { Block } from 'payload'
import { colorPickerField } from '@/fields/colorPicker'
import { noVerticalSpacingField } from '@/fields/noVerticalSpacing'
import { noHorizontalSpacingField } from '@/fields/noHorizontalSpacing'

const buildCode = (opts: { forLexical?: boolean } = {}): Block => ({
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    ...(opts.forLexical ? [] : [colorPickerField(), noVerticalSpacingField(), noHorizontalSpacingField()]),
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
})

export const Code = buildCode()
export const CodeForLexical = buildCode({ forLexical: true })
