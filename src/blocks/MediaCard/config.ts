import type { Block } from 'payload'
import { normalizeRichText } from '@/hooks/normalizeRichText'
import { colorPickerField } from '@/fields/colorPicker'
import { noVerticalSpacingField } from '@/fields/noVerticalSpacing'
import { noHorizontalSpacingField } from '@/fields/noHorizontalSpacing'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { link } from '../../fields/link'

const buildMediaCardBlock = (opts: { forLexical?: boolean } = {}): Block => ({
  slug: 'mediaCard',
  interfaceName: 'MediaCardBlock',
  fields: [
    ...(opts.forLexical
      ? []
      : [colorPickerField(), noVerticalSpacingField(), noHorizontalSpacingField()]),
    {
      name: 'displayType',
      type: 'radio',
      defaultValue: 'imageTop',
      options: [
        {
          label: 'Image on Top',
          value: 'imageTop',
        },
        {
          label: 'Image on Bottom',
          value: 'imageBottom',
        },
        {
          label: 'Image on Left',
          value: 'imageLeft',
        },
        {
          label: 'Image on Right',
          value: 'imageRight',
        },
      ],
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'noBackground',
      type: 'checkbox',
      label: 'No Background',
      defaultValue: false,
    },
    {
      name: 'imageRatio',
      type: 'select',
      defaultValue: 'half',
      options: [
        {
          label: '25% Image / 75% Content',
          value: 'quarter',
        },
        {
          label: '33% Image / 66% Content',
          value: 'third',
        },
        {
          label: '50% Image / 50% Content',
          value: 'half',
        },
        {
          label: '66% Image / 33% Content',
          value: 'twoThirds',
        },
        {
          label: '75% Image / 25% Content',
          value: 'threeQuarters',
        },
      ],
      admin: {
        condition: (data, siblingData) => {
          return (
            siblingData?.displayType === 'imageLeft' || siblingData?.displayType === 'imageRight'
          )
        },
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'richText',
      type: 'richText',
      hooks: { beforeChange: [normalizeRichText] },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures]
        },
      }),
    },

    {
      name: 'enableCTA',
      type: 'checkbox',
      label: 'Enable Call to Action',
    },
    link({
      labelRequired: false,
      overrides: {
        name: 'ctaLink',
        label: 'CTA Link',
        required: false,
        admin: {
          condition: (data, siblingData) => siblingData?.enableCTA,
        },
      },
    }),
  ],
})

export const MediaCardBlock = buildMediaCardBlock()
export const MediaCardBlockForLexical = buildMediaCardBlock({ forLexical: true })
