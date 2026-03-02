import type { Block, Field } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { GalleryBlock } from '@/blocks/GalleryBlock/config'
import { MapBlock } from '@/blocks/MapBlock/config'
import { MediaCardBlock } from '@/blocks/MediaCard/config'

import { link } from '@/fields/link'
import { colorPickerField } from '@/fields/colorPicker'

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
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          BlocksFeature({
            blocks: [Banner, Code, MediaBlock, GalleryBlock, MapBlock, MediaCardBlock],
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
