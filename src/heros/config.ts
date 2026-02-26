import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'none',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Carousel',
          value: 'carousel',
        },
      ],
      required: true,
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true,
      label: 'Autoplay',
      admin: {
        condition: (_, { type } = {}) => type === 'carousel',
      },
    },
    {
      name: 'autoplayInterval',
      type: 'number',
      defaultValue: 2000,
      label: 'Autoplay Interval (ms)',
      admin: {
        condition: (_, siblingData = {}) =>
          siblingData.type === 'carousel' && siblingData.autoplay === true,
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    {
      name: 'media',
      type: 'upload',
      hasMany: true,
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'carousel'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
