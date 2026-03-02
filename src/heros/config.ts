import type { GroupField } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const hero: GroupField = {
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
      required: false,
    },
    {
      name: 'animation',
      type: 'checkbox',
      defaultValue: true,
      label: 'Animation',
      admin: {
        condition: (_, { type } = {}) => type === 'carousel',
      },
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
      name: 'centered',
      type: 'checkbox',
      defaultValue: false,
      label: 'Centered slides (peek)',
      admin: {
        condition: (_, { type } = {}) => type === 'carousel',
      },
    },
    {
      name: 'slidesPerView',
      type: 'select',
      label: 'Slides per view',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (use slide width %)', value: 'auto' },
        { label: '1.5', value: '1.5' },
        { label: '2', value: '2' },
        { label: '2.5', value: '2.5' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
      admin: {
        condition: (_, { type, centered } = {}) => type === 'carousel' && centered,
      },
    },
    {
      name: 'direction',
      type: 'select',
      label: 'Direction',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' },
      ],
      admin: {
        condition: (_, { type } = {}) => type === 'carousel',
      },
    },
    {
      name: 'effect',
      type: 'select',
      label: 'Effect',
      defaultValue: 'fade',
      required: true,
      options: [
        { label: 'Slide', value: 'slide' },
        { label: 'Fade', value: 'fade' },
        { label: 'Cube', value: 'cube' },
        { label: 'Coverflow', value: 'coverflow' },
        { label: 'Flip', value: 'flip' },
        { label: 'Creative', value: 'creative' },
        { label: 'Cards', value: 'cards' },
      ],
      admin: {
        condition: (_, { type, centered } = {}) => type === 'carousel' && !centered,
      },
    },

    {
      name: 'slideWidth',
      type: 'select',
      label: 'Slide width (% of viewport, for Auto mode)',
      defaultValue: '80',
      options: [
        { label: '50%', value: '50' },
        { label: '60%', value: '60' },
        { label: '70%', value: '70' },
        { label: '80%', value: '80' },
        { label: '90%', value: '90' },
      ],
      admin: {
        condition: (_, { type, centered, slidesPerView } = {}) =>
          type === 'carousel' && centered && (slidesPerView === 'auto' || !slidesPerView),
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures]
        },
      }),
      label: false,
      admin: {
        condition: (_, { type } = {}) => type !== 'carousel',
      },
    },
    {
      name: 'slides',
      label: 'Slides',
      type: 'array',
      admin: { initCollapsed: false, condition: (_, { type } = {}) => type === 'carousel' },
      fields: [
        {
          name: 'richText',
          type: 'richText',
          label: false,
          required: false,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [...rootFeatures],
          }),
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          hasMany: false,
          required: false,
        },
      ],
    },

    {
      name: 'media',
      type: 'upload',
      hasMany: true,
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
    },
  ],
  label: false,
}
