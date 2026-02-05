import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '../../fields/link'

export const MediaCard: Block = {
  slug: 'mediaCard',
  interfaceName: 'MediaCardBlock',
  fields: [
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
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    {
      name: 'enableCTA',
      type: 'checkbox',
      label: 'Enable Call to Action',
    },
    link({
      overrides: {
        name: 'ctaLink',
        label: 'CTA Link',
        admin: {
          condition: (data, siblingData) => siblingData?.enableCTA,
        },
      },
    }),
  ],
  labels: {
    plural: 'Media Cards',
    singular: 'Media Card',
  },
}
