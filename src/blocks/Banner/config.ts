import type { Block } from 'payload'
import { normalizeRichText } from '@/hooks/normalizeRichText'
import { colorPickerField } from '@/fields/colorPicker'
import { noVerticalSpacingField } from '@/fields/noVerticalSpacing'
import { noHorizontalSpacingField } from '@/fields/noHorizontalSpacing'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

const buildBanner = (opts: { forLexical?: boolean } = {}): Block => ({
  slug: 'banner',
  interfaceName: 'BannerBlock',
  fields: [
    ...(opts.forLexical
      ? []
      : [colorPickerField(), noVerticalSpacingField(), noHorizontalSpacingField()]),
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      hooks: { beforeChange: [normalizeRichText] },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures]
        },
      }),
      label: false,
      required: true,
    },
  ],
})

export const Banner = buildBanner()
export const BannerForLexical = buildBanner({ forLexical: true })
