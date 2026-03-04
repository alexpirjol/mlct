import type { Block, Field } from 'payload'
import { normalizeRichText } from '@/hooks/normalizeRichText'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { BannerForLexical } from '../../blocks/Banner/config'
import { CodeForLexical } from '../../blocks/Code/config'
import { MediaBlockForLexical } from '../../blocks/MediaBlock/config'
import { GalleryBlockForLexical } from '@/blocks/GalleryBlock/config'
import { MapBlockForLexical } from '@/blocks/MapBlock/config'
import { MediaCardBlockForLexical } from '@/blocks/MediaCard/config'

import { link } from '@/fields/link'
import { colorPickerField } from '@/fields/colorPicker'
import { noVerticalSpacingField } from '@/fields/noVerticalSpacing'
import { noHorizontalSpacingField } from '@/fields/noHorizontalSpacing'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'full',
    options: [
      {
        label: 'Quarter (25%)',
        value: 'quarter',
      },
      {
        label: 'One Third (33%)',
        value: 'oneThird',
      },
      {
        label: 'Half (50%)',
        value: 'half',
      },
      {
        label: 'Two Thirds (66%)',
        value: 'twoThirds',
      },
      {
        label: 'Three Quarters (75%)',
        value: 'threeQuarters',
      },
      {
        label: 'Full (100%)',
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    hooks: { beforeChange: [normalizeRichText] },
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          BlocksFeature({
            blocks: [
              BannerForLexical,
              CodeForLexical,
              MediaBlockForLexical,
              GalleryBlockForLexical,
              MapBlockForLexical,
              MediaCardBlockForLexical,
            ],
          }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
        ]
      },
    }),
    label: false,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => {
          return Boolean(siblingData?.enableLink)
        },
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    colorPickerField(),
    noVerticalSpacingField(),
    noHorizontalSpacingField(),

    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: false,
      },
      fields: columnFields,
    },
  ],
}
